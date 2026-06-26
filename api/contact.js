// Contact form delivery — a Vercel serverless function that emails inquiries
// via Resend. Locally, a small Vite plugin in vite.config.ts runs this same
// handler in-process (see `local-contact-api`). The API key is read server-side
// from the environment and never reaches the client bundle.
//
// Setup: set RESEND_API_KEY in the deployment's env vars. With just a key (no
// custom domain) Resend can deliver to the account owner's own address using
// the onboarding sender, which is exactly this single-recipient use case.

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const TO = "dominik.koenitzer@gmail.com";
const FROM = "Portfolio Contact <onboarding@resend.dev>";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body || {};
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const subject = String(body.subject || "").trim();
  const message = String(body.message || "").trim();
  // Honeypot: a hidden field no human fills. If present, silently accept and
  // drop so bots get a 200 and don't retry, but no email is sent.
  if (String(body.company || "").trim()) {
    return res.status(200).json({ ok: true });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: "Email service not configured",
      details: "Set RESEND_API_KEY on the deployment to enable contact emails.",
    });
  }

  try {
    const r = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: email,
        subject: subject
          ? `[Portfolio] ${subject}`
          : `[Portfolio] New message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || "(none)"}\n\n${message}`,
      }),
    });

    if (!r.ok) {
      const details = await r.text();
      return res.status(502).json({ error: "Email send failed", details });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res
      .status(500)
      .json({ error: "Unexpected error", details: e?.message || String(e) });
  }
}
