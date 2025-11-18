const GQL = 'https://api.github.com/graphql';

const contributionsQuery = `
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

const recentCommitsQuery = `
  query ($login: String!, $first: Int!) {
    user(login: $login) {
      repositories(first: $first, orderBy: {field: UPDATED_AT, direction: DESC}, ownerAffiliations: OWNER) {
        nodes {
          name
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 10) {
                  nodes {
                    message
                    committedDate
                    url
                    oid
                    author {
                      user {
                        login
                      }
                    }
                  }
                }
              }
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
    // Fetch contributions calendar
    const contributionsRes = await fetch(GQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query: contributionsQuery, variables: { login: username } }),
    });

    if (!contributionsRes.ok) {
      const txt = await contributionsRes.text();
      return res.status(contributionsRes.status).json({ error: 'GitHub API error', details: txt });
    }

    const contributionsData = await contributionsRes.json();
    const calendar = contributionsData?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) return res.status(404).json({ error: 'User or calendar not found' });

    // Fetch recent commits from repositories
    const commitsRes = await fetch(GQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        query: recentCommitsQuery, 
        variables: { login: username, first: 10 } 
      }),
    });

    let recentCommits = [];
    if (commitsRes.ok) {
      const commitsData = await commitsRes.json();
      const repos = commitsData?.data?.user?.repositories?.nodes || [];
      
      // Flatten commits from all repositories, filter by author, and sort by date
      const allCommits = [];
      repos.forEach(repo => {
        const commits = repo?.defaultBranchRef?.target?.history?.nodes || [];
        commits.forEach(commit => {
          // Only include commits by the user
          if (commit.author?.user?.login === username) {
            allCommits.push({
              message: commit.message,
              date: commit.committedDate,
              url: commit.url,
              sha: commit.oid,
              repository: repo.name,
            });
          }
        });
      });

      // Sort by date (newest first) and take top 5
      recentCommits = allCommits
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    }

    return res.status(200).json({
      total: calendar.totalContributions,
      weeks: calendar.weeks,
      recentCommits,
    });
  } catch (e) {
    return res.status(500).json({ error: 'Unexpected error', details: e?.message || String(e) });
  }
}
