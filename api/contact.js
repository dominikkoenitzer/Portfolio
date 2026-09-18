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

// Postgres rejects a JSON body holding a NUL or a lone surrogate, and PostgREST
// answers 400, which this handler reports to the visitor as "could not store the
// message". Slicing by UTF-16 unit can cut an emoji in half at exactly the
// limit, so drop a dangling high surrogate, and strip the control characters
// that are not newlines or tabs.
const clean = (v, max) =>
  typeof v === "string"
    ? v
        .replace(/\r\n?/g, "\n")
        .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
        .trim()
        .slice(0, max)
        .replace(/[\uD800-\uDBFF]$/, "")
    : "";

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
    // Backslashes have to go as well as quotes: a name ending in one escaped the
    // closing quote and swallowed the address, so the reply went nowhere.
    replyTo: `"${row.name.replace(/["\\]/g, "")}" <${row.email}>`,
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

  // The form is same-origin and always sends JSON. Without these two checks any
  // other site could post a plain <form> here from a visitor's browser: a form
  // body is a "simple request", so it is never preflighted, and every accepted
  // one costs a stored row and a mail out of his own Gmail account. A
  // same-origin POST always carries an Origin, so comparing it with the Host
  // covers the live domain, every preview deployment and localhost at once.
  const origin = req.headers?.origin;
  if (origin) {
    let originHost = null;
    try {
      originHost = new URL(origin).host;
    } catch {
      originHost = null;
    }
    // Both headers, because the platform in front of the function is what
    // decides which one carries the domain the visitor actually typed. Getting
    // this wrong would reject every real message, so accept either.
    // Split on commas too: a chained proxy joins forwarded values into one
    // header, and a false 403 here would silently swallow a real message.
    const selfHosts = [req.headers?.host, req.headers?.["x-forwarded-host"]]
      .flatMap((h) => (Array.isArray(h) ? h : [h]))
      .filter(Boolean)
      .flatMap((h) => String(h).split(","))
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean);
    if (!originHost || !selfHosts.includes(originHost.toLowerCase())) {
      return res.status(403).json({ error: "Forbidden" });
    }
  }
  const contentType = String(req.headers?.["content-type"] || "");
  if (!contentType.toLowerCase().startsWith("application/json")) {
    res.setHeader("Accept-Post", "application/json");
    return res.status(415).json({ error: "Unsupported media type" });
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
  // Both gates used to be skippable by leaving the field out, which is the first
  // thing a bot does, so a missing or unreadable `startedAt` now counts as one.
  // The elapsed time is judged only when it is positive: a visitor whose clock
  // runs ahead of the server produces a negative one, and that silently threw
  // their message away.
  const startedAt = Number(body.startedAt);
  const elapsed = Date.now() - startedAt;
  if (
    (typeof body.website === "string" && body.website.trim() !== "") ||
    !Number.isFinite(startedAt) ||
    (elapsed >= 0 && elapsed < MIN_FILL_MS)
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
    // The row is stored by now. An unexpected response shape must not turn into
    // a 500 the visitor sees, or they retry a message that did arrive.
    let id = null;
    try {
      [{ id }] = await insert.json();
    } catch (err) {
      console.error("contact: stored but could not read the id", err);
      return res.status(200).json({ ok: true });
    }

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
