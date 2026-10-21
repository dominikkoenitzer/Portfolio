// Serves the built `dist` the way the host does, for the browser tests and
// Lighthouse: one prerendered document per route, the 404 page with a 404
// status, the redirects and the response headers from vercel.json, the
// Content-Security-Policy included. `vite preview` is not used for this: it
// serves none of those headers and runs the local API plugin, which needs the
// real secrets.
//
// node scripts/serve-dist.mjs [--port 4173] [--host 127.0.0.1] [--dir dist]
//
// Text responses are compressed as the host compresses them (brotli, or gzip
// for a client without it), so Lighthouse's throttled load sees the bytes a
// visitor downloads rather than the files on disk.
//
// The serverless functions are not run here. `/api/*` answers 204, so the
// pages take their offline path (no live test count, no calendar) without a
// console error, and `/_vercel/*` answers with an empty script or a 204, the
// way the analytics endpoints do in production.

import { readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { brotliCompressSync, constants, gzipSync } from "node:zlib";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const port = Number(arg("port", process.env.PORT ?? "4173"));
const host = arg("host", "127.0.0.1");
const dir = resolve(root, arg("dir", "dist"));
const config = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".pdf": "application/pdf",
  ".wasm": "application/wasm",
};

// vercel.json sources are path patterns where `(...)` groups are regular
// expressions; everything outside the groups is literal.
function toRegExp(source) {
  let out = "";
  let depth = 0;
  for (const ch of source) {
    if (ch === "(") depth++;
    if (depth === 0 && /[.+?^${}|[\]\\]/.test(ch)) out += `\\${ch}`;
    else out += ch;
    if (ch === ")") depth--;
  }
  return new RegExp(`^${out}$`);
}

const redirects = (config.redirects ?? []).map((r) => ({
  match: toRegExp(r.source),
  to: r.destination,
  status: r.permanent ? 308 : 307,
}));
// The host-only rules (the CSP is sent for the production host alone) apply
// here too, so the tests run under the policy visitors get. Over plain http on
// 127.0.0.1 `upgrade-insecure-requests` would rewrite every request to https,
// so that one directive is left out.
const headerRules = (config.headers ?? []).map((h) => ({
  match: toRegExp(h.source),
  headers: h.headers.map(({ key, value }) =>
    key === "Content-Security-Policy"
      ? { key, value: value.replace(/;\s*upgrade-insecure-requests/, "") }
      : { key, value },
  ),
}));

function fileAt(path) {
  try {
    const stat = statSync(path);
    if (stat.isFile()) return path;
    if (stat.isDirectory()) return fileAt(join(path, "index.html"));
  } catch {
    // not there
  }
  return null;
}

const COMPRESSIBLE = /^(text\/|application\/(json|xml|manifest\+json)|image\/svg)/;
const compressed = new Map();

function body(file, type, accept) {
  const raw = readFileSync(file);
  if (!COMPRESSIBLE.test(type) || raw.length < 1024) return { data: raw };
  const encoding = /\bbr\b/.test(accept) ? "br" : /\bgzip\b/.test(accept) ? "gzip" : null;
  if (!encoding) return { data: raw };
  const key = `${encoding}:${file}`;
  if (!compressed.has(key)) {
    compressed.set(
      key,
      encoding === "br"
        ? brotliCompressSync(raw, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } })
        : gzipSync(raw, { level: 9 }),
    );
  }
  return { data: compressed.get(key), encoding };
}

function send(req, res, status, file, pathname) {
  for (const rule of headerRules) {
    if (rule.match.test(pathname)) {
      for (const { key, value } of rule.headers) res.setHeader(key, value);
    }
  }
  const type = TYPES[extname(file)] ?? "application/octet-stream";
  const { data, encoding } = body(file, type, String(req.headers["accept-encoding"] ?? ""));
  res.setHeader("Content-Type", type);
  res.setHeader("Vary", "Accept-Encoding");
  if (encoding) res.setHeader("Content-Encoding", encoding);
  res.setHeader("Content-Length", data.length);
  res.writeHead(status);
  res.end(req.method === "HEAD" ? undefined : data);
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://${host}`);
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    res.writeHead(400).end();
    return;
  }

  if (pathname.startsWith("/_vercel/")) {
    if (pathname.endsWith(".js")) {
      res.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8" });
      res.end("");
    } else res.writeHead(204).end();
    return;
  }
  if (pathname.startsWith("/api/")) {
    res.writeHead(204, { "X-Robots-Tag": "noindex" }).end();
    return;
  }

  if (pathname.length > 1 && pathname.endsWith("/")) {
    res.writeHead(308, { Location: pathname.replace(/\/+$/, "") + url.search }).end();
    return;
  }
  for (const r of redirects) {
    if (r.match.test(pathname)) {
      res.writeHead(r.status, { Location: r.to }).end();
      return;
    }
  }

  const target = normalize(join(dir, pathname));
  const file = target === dir || target.startsWith(dir + sep) ? fileAt(target) : null;
  if (file) return send(req, res, 200, file, pathname);
  send(req, res, 404, join(dir, "404.html"), pathname);
});

server.listen(port, host, () => {
  console.log(`serving ${dir} at http://${host}:${port}`);
});
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
