/**
 * GET /api/keepalive
 *
 * OldDb pauses free projects after a week without activity, which would
 * take the contact form down with it. A daily Vercel cron (see `vercel.json`)
 * calls this route, and the one counting query it makes is enough to count
 * as activity. Nothing is written and nothing is returned but the count.
 *
 * Environment: OLDDB_URL, OLDDB_SERVICE_ROLE_KEY (the table is behind RLS).
 */

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const base = process.env.OLDDB_URL;
  const key = process.env.OLDDB_SERVICE_ROLE_KEY;
  if (!base || !key) {
    return res.status(500).json({ error: "OldDb is not configured" });
  }

  const upstream = await fetch(`${base}/rest/v1/contact_messages?select=id`, {
    method: "HEAD",
    headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: "count=exact" },
  });
  if (!upstream.ok) {
    return res.status(502).json({ error: "OldDb unreachable", status: upstream.status });
  }

  const total = Number((upstream.headers.get("content-range") || "").split("/")[1]);
  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({ ok: true, messages: Number.isFinite(total) ? total : null });
}
