import { gunzipSync } from "node:zlib";

/**
 * How many tests a project has, counted from its source on GitHub, so the
 * number on a case study follows the repository instead of going stale the
 * day after it was typed in.
 *
 * Only the projects listed here are answered for. An open `repo` parameter
 * would make this a proxy that downloads any repository on his token, and a
 * name nobody asked for before is always an edge-cache miss.
 *
 * The count is the number of test attributes in the source, the same thing
 * `git grep -c` reports locally. It is not a run: a test that is counted here
 * can still fail, which is what the project's own CI is for.
 */
const PROJECTS = {
  mochi: {
    repo: "dominikkoenitzer/Mochi",
    // Every crate lives under crates/; nothing outside it holds tests.
    include: (path) => path.includes("/crates/") && path.endsWith(".rs"),
    marker: /#\[test\]/g,
  },
};

/** Reads a NUL-terminated field out of a tar header. */
const field = (header, start, end) => {
  const raw = header.subarray(start, end).toString("utf8");
  const nul = raw.indexOf("\0");
  return nul === -1 ? raw : raw.slice(0, nul);
};

/**
 * Walks a gzipped tarball and counts `marker` in every file `include` accepts.
 *
 * A ustar archive is 512-byte headers, each followed by its file padded to
 * 512. GitHub's tarballs open with a pax global header (the commit id) and use
 * a pax extended header for any path longer than 100 bytes, so both are read
 * rather than taken for files.
 */
export function countInTarball(gzipped, include, marker) {
  const tar = gunzipSync(gzipped);
  let offset = 0;
  let count = 0;
  let files = 0;
  let longPath = null;

  while (offset + 512 <= tar.length) {
    const header = tar.subarray(offset, offset + 512);
    // Two zero blocks end the archive; one is enough to stop reading.
    if (header.every((byte) => byte === 0)) break;

    const size = Number.parseInt(field(header, 124, 136).trim() || "0", 8);
    const type = String.fromCharCode(header[156]);
    const body = tar.subarray(offset + 512, offset + 512 + size);
    offset += 512 + Math.ceil(size / 512) * 512;

    if (type === "x") {
      const match = /\d+ path=([^\n]*)\n/.exec(body.toString("utf8"));
      longPath = match ? match[1] : null;
      continue;
    }
    if (type === "g") continue;

    const prefix = field(header, 345, 500);
    const name = field(header, 0, 100);
    const path = longPath ?? (prefix ? `${prefix}/${name}` : name);
    longPath = null;

    if ((type === "0" || type === "\0") && include(path)) {
      files += 1;
      count += body.toString("utf8").match(marker)?.length ?? 0;
    }
  }

  return { count, files };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD, OPTIONS");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const requested = Array.isArray(req.query?.project)
    ? req.query.project[0]
    : req.query?.project || "";
  const project = PROJECTS[String(requested).toLowerCase()];
  if (!project) return res.status(404).json({ error: "Unknown project" });

  // The repositories are public, so the token only lifts the rate limit.
  const token = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN;
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "dk.punds.ch",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await fetch(
      `https://api.github.com/repos/${project.repo}/tarball`,
      { headers, redirect: "follow" },
    );
    if (!response.ok) {
      console.error(`test-count: GitHub answered ${response.status}`);
      return res.status(502).json({ error: "GitHub API error" });
    }
    const { count, files } = countInTarball(
      Buffer.from(await response.arrayBuffer()),
      project.include,
      project.marker,
    );
    // An archive that parsed to nothing is a broken read, not a project with
    // no tests; answering 0 would put a wrong number on the page.
    if (files === 0) {
      return res.status(502).json({ error: "No source files read" });
    }

    // An hour at the edge, then a day of serving the old count while a fresh
    // one is fetched: a push shows up within the hour, and the tarball is
    // downloaded about once an hour at most, not once per visitor.
    res.setHeader(
      "Cache-Control",
      "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    );
    return res.status(200).json({ count, files });
  } catch (error) {
    console.error("test-count:", error);
    return res.status(502).json({ error: "Could not count" });
  }
}
