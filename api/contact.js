import { createHash, createHmac } from "node:crypto";
import nodemailer from "nodemailer";
import { markNotified, saveMessage, takeSlot } from "./_contact-store.js";

/**
 * POST /api/contact
 *
 * Takes the contact form, stores the message in a private Vercel Blob store
 * and mails it to Dominik. The browser only ever talks to this same-origin
 * route: the store token and the mail credentials live in the server
 * environment, so the CSP stays same-origin and nothing secret reaches the
 * client bundle.
 *
 * Environment (Vercel project settings, `.env.local` for `vite dev`):
 *   BLOB_READ_WRITE_TOKEN                      required, set by the linked store
 *   GMAIL_USER, GMAIL_APP_PASSWORD             optional, the notification mail
 *   CONTACT_TO                                 optional, defaults to GMAIL_USER
 *   CONTACT_HASH_SECRET                        keys the stored address hash
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

// Slicing by UTF-16 unit can cut an emoji in half at exactly the limit, which
// leaves a lone surrogate that turns into a replacement character in the mail,
// so drop a dangling high surrogate. Control characters other than newlines
// and tabs have no place in a message and are stripped.
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

// A plain SHA-256 of an IPv4 address is reversed by hashing all four billion
// of them, which a laptop does in minutes. Keyed with a secret only the server
// knows, the stored value says nothing about the address. Without the secret
// (a local run) it falls back to the plain hash, so the form still works.
function hashIp(ip) {
  const secret = process.env.CONTACT_HASH_SECRET;
  return secret
    ? createHmac("sha256", secret).update(ip).digest("hex")
    : createHash("sha256").update(ip).digest("hex");
}

// The transport timeouts each cover one phase or one quiet stretch, so a mail
// server that answers slowly but steadily could still hold the answer past the
// browser's 20 s. The whole send gets one deadline on top.
const MAIL_DEADLINE_MS = () => Number(process.env.CONTACT_MAIL_DEADLINE_MS) || 10000;

function withDeadline(promise, ms) {
  let timer;
  const deadline = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`mail took longer than ${ms} ms`)), ms);
  });
  return Promise.race([promise, deadline]).finally(() => clearTimeout(timer));
}

async function notify(row) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return false;
  // The visitor's browser gives up after 20 s, and the mail is awaited before
  // the answer. With nodemailer's defaults (2 min to connect, 30 s for the
  // greeting, 10 min of silence) a slow Gmail turned a stored message into
  // "didn't go through", and the retry stored it twice. Stalled, the mail now
  // fails into the catch below and the visitor still gets the 200.
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 8000,
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
  // one costs a stored message and a mail out of his own Gmail account. A
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
  // thing a bot does, so a missing or unreadable time now counts as one.
  // The form sends `fillMs`, the fill time measured on the visitor's own
  // clock. Subtracting their absolute `startedAt` from the server's clock
  // mixed two clocks: one running a minute ahead turned 61.5 s of typing into
  // 1.5 s, and a real message was thrown away behind a "Sent." `startedAt` is
  // still read from a page loaded before the form sent `fillMs`.
  const tooFast = (() => {
    if (body.fillMs !== undefined) {
      const fillMs = Number(body.fillMs);
      return !Number.isFinite(fillMs) || fillMs < MIN_FILL_MS;
    }
    const startedAt = Number(body.startedAt);
    const elapsed = Date.now() - startedAt;
    return !Number.isFinite(startedAt) || (elapsed >= 0 && elapsed < MIN_FILL_MS);
  })();
  if ((typeof body.website === "string" && body.website.trim() !== "") || tooFast) {
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
  row.ip_hash = ip ? hashIp(ip) : null;
  row.created_at = new Date().toISOString();

  try {
    // A failed cap lets the message through, on purpose: a lost enquiry costs
    // more than a rare extra one. It is logged, so a cap that stopped working
    // does not go unnoticed.
    if (row.ip_hash) {
      let allowed = true;
      try {
        allowed = await takeSlot(row.ip_hash, MAX_PER_HOUR);
      } catch (err) {
        console.error("contact: rate cap failed", err);
      }
      if (!allowed) {
        return res.status(429).json({ error: "Too many messages, try again later" });
      }
    }

    let stored;
    try {
      stored = await saveMessage(row);
    } catch (err) {
      console.error("contact: store failed", err);
      return res.status(502).json({ error: "Could not store the message" });
    }

    // The stored message is the record; the mail is a courtesy. A mail failure
    // must not turn a stored message into an error the visitor sees.
    let mailed = false;
    try {
      mailed = await withDeadline(notify(row), MAIL_DEADLINE_MS());
    } catch (err) {
      console.error("contact: notification failed", err);
    }
    if (mailed) {
      try {
        await markNotified(stored, row);
      } catch (err) {
        console.error("contact: could not mark the message as mailed", err);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("contact: failed", err);
    return res.status(500).json({ error: "Contact form failed" });
  }
}
