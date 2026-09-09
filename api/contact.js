import { createHash } from "node:crypto";
import nodemailer from "nodemailer";

/**
 * POST /api/contact
 *
 * Takes the contact form, stores the message in Supabase and mails it to
 * Dominik. The browser only ever talks to this same-origin route: the Supabase
 * service key and the mail credentials live in the server environment, so the
 * CSP stays same-origin and nothing secret reaches the client bundle.
 *
 * Environment (Vercel project settings, `.env.local` for `vite dev`):
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY   required, the table is behind RLS
 *   GMAIL_USER, GMAIL_APP_PASSWORD             optional, the notification mail
 *   CONTACT_TO                                 optional, defaults to GMAIL_USER
 *
 * Spam: a honeypot field, a minimum fill time and a per-IP hourly cap. Bots
 * that trip the first two get a 200 with nothing stored, so they learn nothing.
 */

const LIMITS = { name: 120, email: 254, subject: 200, message: 5000 };
const MIN_FILL_MS = 3000;
const MAX_PER_HOUR = 5;
const INTENTS = new Set(["job", "freelance", "collab", "other", "service"]);
const LANGS = new Set(["en", "de", "fr", "zh"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const clean = (v, max) =>
  typeof v === "string" ? v.replace(/\r\n?/g, "\n").trim().slice(0, max) : "";

const clientIp = (req) => {
  const fwd = req.headers?.["x-forwarded-for"];
  const first = Array.isArray(fwd) ? fwd[0] : (fwd || "").split(",")[0];
  return (first || req.headers?.["x-real-ip"] || req.socket?.remoteAddress || "").trim();
};

const supabase = (path, init = {}) => {
  const base = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) throw new Error("Supabase is not configured");
  return fetch(`${base}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
};

async function sentLastHour(ipHash) {
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const res = await supabase(
    `contact_messages?select=id&ip_hash=eq.${encodeURIComponent(ipHash)}&created_at=gte.${encodeURIComponent(since)}`,
    { method: "HEAD", headers: { Prefer: "count=exact" } },
  );
  const range = res.headers.get("content-range") || "";
  const total = Number(range.split("/")[1]);
  return Number.isFinite(total) ? total : 0;
}

async function notify(row) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return false;
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
  const to = process.env.CONTACT_TO || user;
  const text = [
    `Von: ${row.name} <${row.email}>`,
    `Betreff: ${row.subject}`,
    `Sprache: ${row.language || "?"}   Thema: ${row.intent || "?"}`,
    "",
    row.message,
    "",
    "Antworten geht direkt an den Absender (Reply-To ist gesetzt).",
  ].join("\n");
  await transport.sendMail({
    from: `"dk.punds.ch Kontakt" <${user}>`,
    to,
    replyTo: `"${row.name.replace(/"/g, "")}" <${row.email}>`,
    subject: `[Kontakt] ${row.subject}`,
    text,
  });
  return true;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Invalid JSON" });
    }
  }
  if (!body || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid body" });
  }

  // Honeypot and timing: answer as if it worked, store nothing.
  const startedAt = Number(body.startedAt);
  if (
    (typeof body.website === "string" && body.website.trim() !== "") ||
    (Number.isFinite(startedAt) && Date.now() - startedAt < MIN_FILL_MS)
  ) {
    return res.status(200).json({ ok: true });
  }

  const row = {
    name: clean(body.name, LIMITS.name),
    email: clean(body.email, LIMITS.email),
    subject: clean(body.subject, LIMITS.subject),
    message: clean(body.message, LIMITS.message),
    intent: INTENTS.has(body.intent) ? body.intent : null,
    language: LANGS.has(body.language) ? body.language : null,
    user_agent: clean(req.headers?.["user-agent"], 300) || null,
  };

  const missing = ["name", "email", "subject", "message"].filter((k) => !row[k]);
  if (missing.length) {
    return res.status(400).json({ error: "Missing fields", fields: missing });
  }
  if (!EMAIL_RE.test(row.email)) {
    return res.status(400).json({ error: "Invalid email", fields: ["email"] });
  }

  const ip = clientIp(req);
  row.ip_hash = ip ? createHash("sha256").update(ip).digest("hex") : null;

  try {
    if (row.ip_hash && (await sentLastHour(row.ip_hash)) >= MAX_PER_HOUR) {
      return res.status(429).json({ error: "Too many messages, try again later" });
    }

    const insert = await supabase("contact_messages?select=id", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(row),
    });
    if (!insert.ok) {
      const details = await insert.text();
      console.error("contact: insert failed", insert.status, details);
      return res.status(502).json({ error: "Could not store the message" });
    }
    const [{ id }] = await insert.json();

    // The row is the record; the mail is a courtesy. A mail failure must not
    // turn a stored message into an error the visitor sees.
    try {
      if (await notify(row)) {
        await supabase(`contact_messages?id=eq.${id}`, {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({ notified_at: new Date().toISOString() }),
        });
      }
    } catch (err) {
      console.error("contact: notification failed", err);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("contact: failed", err);
    return res.status(500).json({ error: "Contact form failed" });
  }
}
