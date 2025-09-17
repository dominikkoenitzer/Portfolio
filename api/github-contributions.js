const GQL = 'https://api.github.com/graphql';

const query = `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              color
              contributionCount
              date
              weekday
            }
          }
        }
      }
    }
  }
`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const username = (req.query?.username) || '';
  if (!username) return res.status(400).json({ error: 'Missing username' });

  const token = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN;
  if (!token) {
    return res.status(500).json({
      error: 'Missing GitHub token on server',
      details: 'Set env GITHUB_TOKEN (recommended) or VITE_GITHUB_TOKEN on your deployment platform.'
    });
  }

  try {
    const r = await fetch(GQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables: { login: username } }),
    });

    if (!r.ok) {
      const txt = await r.text();
      return res.status(r.status).json({ error: 'GitHub API error', details: txt });
    }
    const data = await r.json();
    const calendar = data?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) return res.status(404).json({ error: 'User or calendar not found' });

    return res.status(200).json({
      total: calendar.totalContributions,
      weeks: calendar.weeks,
    });
  } catch (e) {
    return res.status(500).json({ error: 'Unexpected error', details: e?.message || String(e) });
  }
}
