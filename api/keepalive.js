/**
 * GET /api/keepalive
 *
 * Supabase pauses free projects after a week without activity, which would
 * take the contact form down with it. Supabase wants "a few requests each
 * day"; one daily read still drew the pause warning. So four Vercel crons (see
 * `vercel.json`, Hobby allows each only once a day) call this route, and each
 * call stamps the single row in `keepalive` with the current time. Nothing
 * else is touched.
 *
 * Environment: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (the table is behind RLS).
 */

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const base = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) {
    return res.status(500).json({ error: "Supabase is not configured" });
  }

  // The other two routes both wrap their upstream call; this one did not, so a
  // DNS or network failure left the platform to turn an unhandled rejection
  // into a 500 instead of the 502 this route means. The upstream status stays
  // in the log rather than the response: to an anonymous caller it is the
  // difference between "the service key is dead" and "the table is gone".
  let upstream;
  try {
    upstream = await fetch(`${base}/rest/v1/keepalive?id=eq.1`, {
      method: "PATCH",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ touched_at: new Date().toISOString() }),
    });
  } catch (err) {
    console.error("keepalive: upstream request failed", err);
    return res.status(502).json({ error: "Supabase unreachable" });
  }
  if (!upstream.ok) {
    console.error("keepalive: upstream answered", upstream.status);
    return res.status(502).json({ error: "Supabase unreachable" });
  }

  // A PATCH that matches no row still answers 200, so an empty result means the
  // row is missing and nothing was written.
  const rows = await upstream.json().catch(() => []);
  if (!Array.isArray(rows) || rows.length !== 1) {
    console.error("keepalive: heartbeat row missing");
    return res.status(502).json({ error: "Supabase unreachable" });
  }
  console.log("keepalive: ok", rows[0].touched_at);
  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({ ok: true });
}
