/**
 * CI guard: assert public/sitemap.xml stays in lockstep with the app's routes.
 *
 * The sitemap is hand-maintained and the site is client-rendered, so the
 * sitemap IS the crawl-discovery surface — a forgotten route silently rots SEO
 * with no other signal. This fails the build on any drift between:
 *   - the static routes declared in AnimatedRoutes.tsx, and
 *   - the project slugs in constants/projects (→ /projects/<slug>)
 * versus the <loc> entries actually present in public/sitemap.xml.
 *
 * Pure file parsing (no app imports) so it runs under bun with no alias setup.
 */
import { readFileSync } from "node:fs";

const BASE = "https://dominikkoenitzer.ch";

const norm = (p: string): string => (p === "/" ? "/" : p.replace(/\/$/, ""));

const routesSrc = readFileSync("src/routes.ts", "utf8");
const staticRoutes = [
  "/", // index() route
  ...[...routesSrc.matchAll(/route\("([^"]+)"/g)]
    .map((m) => `/${m[1]}`)
    .filter((p) => p !== "/*" && !p.includes(":")),
];

const projectsSrc = readFileSync("src/constants/projects/index.ts", "utf8");
const slugs = [...projectsSrc.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);

const expected = new Set<string>([
  ...staticRoutes.map(norm),
  ...slugs.map((s) => `/projects/${s}`),
]);

const sitemap = readFileSync("public/sitemap.xml", "utf8");
const escaped = BASE.replace(/[.]/g, "\\.");
const actual = new Set<string>(
  [...sitemap.matchAll(new RegExp(`<loc>${escaped}(/[^<]*)</loc>`, "g"))].map(
    (m) => norm(m[1])
  )
);

const missing = [...expected].filter((p) => !actual.has(p));
const stale = [...actual].filter((p) => !expected.has(p));

if (missing.length || stale.length) {
  if (missing.length) {
    console.error("✗ Missing from sitemap.xml:", missing.join(", "));
  }
  if (stale.length) {
    console.error("✗ Stale entries in sitemap.xml:", stale.join(", "));
  }
  console.error(
    "  Update public/sitemap.xml to match the routes + project slugs."
  );
  process.exit(1);
}

console.log(`✓ sitemap parity OK (${expected.size} routes covered)`);
