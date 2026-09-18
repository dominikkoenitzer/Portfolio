const GQL = "https://api.github.com/graphql";

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
      repositories(first: $first, orderBy: {field: UPDATED_AT, direction: DESC}, ownerAffiliations: OWNER, privacy: PUBLIC) {
        nodes {
          name
          isPrivate
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

/**
 * The only account this endpoint will answer for. Without it the route is an
 * open proxy onto a personal token: any origin could ask for any GitHub user
 * and spend two authenticated GraphQL calls of the 5000/hour budget, and a
 * username nobody has asked for before is always an edge-cache miss, so the
 * CDN is no shield at all.
 */
const ALLOWED_LOGIN = "dominikkoenitzer";

export default async function handler(req, res) {
  // No CORS header: the widget is same-origin. It used to send `*`, which is
  // what let the open proxy above be driven from anyone's browser.
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();
  // Without this, a POST reaches the handler like any GET, and Vercel never
  // edge-caches a POST: every one of them was a guaranteed cache miss spending
  // two authenticated GraphQL calls of his personal token's hourly budget.
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD, OPTIONS");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const requested = Array.isArray(req.query?.username)
    ? req.query.username[0]
    : req.query?.username || "";
  if (!requested) return res.status(400).json({ error: "Missing username" });
  if (requested.toLowerCase() !== ALLOWED_LOGIN) {
    return res.status(403).json({ error: "Forbidden" });
  }
  const username = ALLOWED_LOGIN;

  const token = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN;
  if (!token) {
    // The name of the missing variable belongs in the log, not in a response an
    // anonymous caller can read.
    console.error("github-contributions: no GITHUB_TOKEN configured");
    return res.status(500).json({ error: "Not configured" });
  }

  try {
    // The calendar and commits queries are independent, fire them together to
    // save a round-trip instead of awaiting one then the other.
    const ghHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const [contributionsRes, commitsRes] = await Promise.all([
      fetch(GQL, {
        method: "POST",
        headers: ghHeaders,
        body: JSON.stringify({
          query: contributionsQuery,
          variables: { login: username },
        }),
      }),
      fetch(GQL, {
        method: "POST",
        headers: ghHeaders,
        body: JSON.stringify({
          query: recentCommitsQuery,
          variables: { login: username, first: 10 },
        }),
      }),
    ]);

    if (!contributionsRes.ok) {
      const txt = await contributionsRes.text();
      console.error("github-contributions: upstream", contributionsRes.status, txt);
      return res.status(contributionsRes.status).json({ error: "GitHub API error" });
    }

    const contributionsData = await contributionsRes.json();

    // GitHub answers a failed GraphQL query with HTTP 200 and an `errors`
    // array, so the status check above misses rate limits, bad credentials and
    // missing scopes. They all fell through to the 404 below and reported
    // themselves as a missing user. Pass GitHub's own message through instead.
    if (contributionsData?.errors?.length) {
      const details = contributionsData.errors.map((e) => e.message).join("; ");
      const rateLimited = contributionsData.errors.some(
        (e) => e.type === "RATE_LIMIT",
      );
      // Logged, not returned: the upstream text tells a prober whether the
      // token is live, out of scope or rate limited.
      console.error("github-contributions: graphql", details);
      return res.status(rateLimited ? 429 : 502).json({ error: "GitHub API error" });
    }

    const calendar =
      contributionsData?.data?.user?.contributionsCollection
        ?.contributionCalendar;
    if (!calendar)
      return res.status(404).json({ error: "User or calendar not found" });

    // A failed commits query must not be cached for an hour as if it had
    // succeeded: GitHub answers a rate limit or a bad scope with HTTP 200 and an
    // `errors` array, which used to fall straight through to an empty list and
    // get pinned at the edge for `s-maxage`, then served stale for a day.
    let commitsFailed = !commitsRes.ok;
    let recentCommits = [];
    if (commitsRes.ok) {
      const commitsData = await commitsRes.json();
      if (commitsData?.errors?.length) commitsFailed = true;
      const repos = commitsData?.data?.user?.repositories?.nodes || [];

      // Flatten commits from all repositories, filter by author, and sort by date
      const allCommits = [];
      repos.forEach((repo) => {
        // The query already asks for `privacy: PUBLIC`; this second check means
        // a private repo still cannot reach the public response if that filter
        // is ever lost. The token is the account's own, so everything it can
        // read would otherwise be published here.
        if (repo?.isPrivate !== false) return;
        const commits = repo?.defaultBranchRef?.target?.history?.nodes || [];
        commits.forEach((commit) => {
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

    // Cache at the edge: the calendar changes a few times a day at most. A
    // partial answer (calendar fine, commits failed) gets a minute instead of an
    // hour, so a transient upstream failure clears itself.
    res.setHeader(
      "Cache-Control",
      commitsFailed
        ? "public, s-maxage=60, stale-while-revalidate=300"
        : "public, s-maxage=3600, stale-while-revalidate=86400",
    );
    return res.status(200).json({
      total: calendar.totalContributions,
      weeks: calendar.weeks,
      recentCommits,
    });
  } catch (e) {
    console.error("github-contributions: failed", e);
    return res.status(500).json({ error: "Unexpected error" });
  }
}
