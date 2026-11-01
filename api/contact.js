import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import nodemailer from "nodemailer";
import { createCap, markNotified, saveMessage } from "./_contact-store.js";

/**
 * GET and POST /api/contact
 *
 * GET hands the form a signed start time. POST takes the contact form, stores
 * the message in a private Vercel Blob store and mails it to Dominik. The
 * browser only ever talks to this same-origin route: the store token and the
 * mail credentials live in the server environment, so the CSP stays
 * same-origin and nothing secret reaches the client bundle.
 *
 * Environment (Vercel project settings, `.env.local` for `vite dev`):
 *   BLOB_READ_WRITE_TOKEN                      required, set by the linked store
 *   GMAIL_USER, GMAIL_APP_PASSWORD             optional, the notification mail
 *   CONTACT_TO                                 optional, defaults to GMAIL_USER
 *   CONTACT_HASH_SECRET                        signs the form token and keys
 *                                              the stored address hash
 *
 * Spam: a honeypot field, a minimum fill time measured on the server, a cap
 * per address and hour (a /64 for IPv6), and a ceiling on the messages stored
 * per day. Bots that trip the first two get a 200 with nothing stored, so
 * they learn nothing.
 */

const LIMITS = { name: 120, email: 254, subject: 200, message: 5000 };
const MIN_FILL_MS = 3000;
// A form left open longer than this asks for a new token before it sends.
const TOKEN_MAX_AGE_MS = 6 * 60 * 60 * 1000;
// Five messages an hour per address and eleven stored per Zurich day for the
// whole site. An accepted message takes three writes, so a 31-day month takes
// at most 1,023 of the 2,000 the Hobby plan allows. A conditional write that
// loses a race may count as well. Each instance tries one write at a time, so
// only a message another instance stored can make one lose: a day adds at
// most eleven lost writes for every instance past the first. A refusal the
// instance already knows of costs no read, and no instance reads the store
// more than 21 times a minute.
const CAPS = { perAddress: 5, perDay: 11, readsPerMinute: 21 };
const takeSlot = createCap(CAPS);
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

/**
 * The part of an address the hourly cap counts. An IPv6 visitor is usually
 * handed a whole /64, so counting the full address let one sender change it
 * per message; the first four groups are what identifies them. IPv4, and IPv6
 * that carries an IPv4 address, stay whole.
 */
function addressKey(ip) {
  const bare = ip.trim().replace(/^\[|\]$/g, "").split("%")[0].toLowerCase();
  const mapped = bare.match(/^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/);
  if (mapped) return mapped[1];
  if (!bare.includes(":")) return bare;
  const halves = bare.split("::");
  if (halves.length > 2) return bare;
  // A trailing dotted quad fills the last two groups.
  const groups = (part) =>
    part ? part.split(":").flatMap((g) => (g.includes(".") ? ["0", "0"] : [g])) : [];
  const head = groups(halves[0]);
  const tail = halves.length === 2 ? groups(halves[1]) : [];
  const gap = halves.length === 2 ? 8 - head.length - tail.length : 0;
  if (gap < 0) return bare;
  const full = [...head, ...Array(gap).fill("0"), ...tail];
  if (full.length !== 8 || !full.every((g) => /^[0-9a-f]{1,4}$/.test(g))) return bare;
  return `${full
    .slice(0, 4)
    .map((g) => Number.parseInt(g, 16).toString(16))
    .join(":")}::/64`;
}

// Without CONTACT_HASH_SECRET, the token and the cap use a key that lasts as
// long as this process.
const PROCESS_KEY = randomBytes(32);
const serverKey = () => process.env.CONTACT_HASH_SECRET || PROCESS_KEY;

// A plain SHA-256 of an IPv4 address is reversed by hashing all four billion
// of them, which a laptop does in minutes. Keyed with a secret only the server
// knows, the value says nothing about the address. The cap always counts a
// keyed hash; the message keeps one only when the key is the lasting secret,
// since a hash under a key that died with its process links nothing.
const capHash = (ip) => createHmac("sha256", serverKey()).update(addressKey(ip)).digest("hex");

const signStamp = (stamp) =>
  createHmac("sha256", serverKey())
    .update(`contact-form:${stamp}`)
    .digest("base64url");

/**
 * How long ago, on this server's clock, the token was handed out. Null for no
 * token at all, NaN for one this server did not sign.
 */
function tokenAge(token, at) {
  if (typeof token !== "string" || token === "") return null;
  const parts = token.split(".");
  if (parts.length !== 2 || !/^\d{1,16}$/.test(parts[0])) return Number.NaN;
  const expected = Buffer.from(signStamp(parts[0]));
  const given = Buffer.from(parts[1]);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return Number.NaN;
  }
  return at - Number(parts[0]);
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
  // The form asks for this when it mounts and sends it back with the message,
  // so the fill time is measured on the server's clock alone.
  if (req.method === "GET") {
    const stamp = String(Date.now());
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({
      token: `${stamp}.${signStamp(stamp)}`,
      minAgeMs: MIN_FILL_MS,
      maxAgeMs: TOKEN_MAX_AGE_MS,
    });
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
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

  // Honeypot and timing: answer as if it worked, store nothing. The fill time
  // is the age of the signed token from GET, on this server's clock: a time
  // the visitor's browser reports can say anything. A token younger than a
  // person types, or one stamped ahead of this clock, counts as a bot.
  const age = tokenAge(body.token, Date.now());
  const tooFast = age !== null && age < MIN_FILL_MS;
  if ((typeof body.website === "string" && body.website.trim() !== "") || tooFast) {
    return res.status(200).json({ ok: true });
  }
  // No token, one this server did not sign, or one past its time. The form
  // fetches a fresh one before it sends, so this is a page loaded before the
  // token existed, or a form left open too long: the answer is the general
  // failure, which points to the mail link, and the next try gets a new token.
  if (age === null || !(age <= TOKEN_MAX_AGE_MS)) {
    return res.status(403).json({ error: "Form expired" });
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
  const capKey = ip ? capHash(ip) : null;
  row.ip_hash = process.env.CONTACT_HASH_SECRET ? capKey : null;
  row.created_at = new Date().toISOString();

  try {
    // A cap that cannot be checked refuses the message: unchecked, a flood
    // would spend the store's monthly writes. The form shows its general
    // failure, which points to the mail link.
    let slot;
    try {
      slot = await takeSlot(capKey);
    } catch (err) {
      console.error("contact: rate cap failed", err);
      slot = "failed";
    }
    if (slot === "address") {
      return res.status(429).json({ error: "Too many messages, try again later" });
    }
    // The site-wide ceiling keeps a flood from many addresses inside the
    // store's monthly operations. The form shows its general failure for
    // this, as for a cap it could not check, which points to the mail link.
    if (slot !== "ok") {
      return res.status(503).json({ error: "Not taking messages right now" });
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
