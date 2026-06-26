// Portfolio contact API — a tiny dependency-light Node service for a VPS.
// The portfolio (on Vercel) POSTs form submissions here; this relays them to
// your inbox over an authenticated SMTP account (see .env.example + README).
//
// Run: `npm install && npm start` (configure .env first). Put HTTPS in front of
// it with Caddy/nginx — see README.md. Nothing here is wired to the live site
// until you set VITE_CONTACT_ENDPOINT on the Vercel deployment.

import { createServer } from "node:http";
import nodemailer from "nodemailer";

const {
  PORT = "8080",
  SMTP_HOST,
  SMTP_PORT = "587",
  SMTP_SECURE = "false", // "true" only for port 465
  SMTP_USER,
  SMTP_PASS,
  MAIL_FROM,
  MAIL_TO = "dominik.koenitzer@gmail.com",
  ALLOWED_ORIGIN = "https://dominikkoenitzer.ch",
} = process.env;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: SMTP_SECURE === "true",
  auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
});

const cors = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function reply(res, code, body) {
  res.writeHead(code, { "Content-Type": "application/json", ...cors });
  res.end(JSON.stringify(body));
}

const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, cors);
    res.end();
    return;
  }
  if (req.method !== "POST" || !(req.url || "").startsWith("/contact")) {
    return reply(res, 404, { error: "Not found" });
  }

  try {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();

    // Honeypot: bots fill this hidden field — accept silently and drop.
    if (String(body.company || "").trim()) return reply(res, 200, { ok: true });

    if (!name || !email || !message) {
      return reply(res, 400, { error: "Missing required fields" });
    }
    if (!EMAIL_RE.test(email)) {
      return reply(res, 400, { error: "Invalid email" });
    }
    if (!SMTP_HOST) {
      return reply(res, 503, { error: "SMTP not configured" });
    }

    await transporter.sendMail({
      from: MAIL_FROM || SMTP_USER,
      to: MAIL_TO,
      replyTo: email,
      subject: subject
        ? `[Portfolio] ${subject}`
        : `[Portfolio] New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || "(none)"}\n\n${message}`,
    });

    return reply(res, 200, { ok: true });
  } catch (err) {
    console.error("contact-api error:", err);
    return reply(res, 500, { error: "Send failed" });
  }
});

server.listen(Number(PORT), () => {
  console.log(`contact-api listening on :${PORT}`);
});
