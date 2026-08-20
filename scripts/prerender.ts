/**
 * Emits a real HTML file per route after `vite build`.
 *
 * The app is a client-rendered SPA, so every URL used to serve the same
 * `index.html` — meaning every route advertised the *home page's* title,
 * description, canonical and OG image. Google runs JS and coped, but link
 * unfurlers (LinkedIn, Slack, WhatsApp, Discord, iMessage) do not: sharing
 * /projects/oxidize previewed as the homepage.
 *
 * This writes dist/<route>/index.html for each route with that route's own
 * metadata patched into the head. The body is left exactly as Vite emitted it,
 * so React still mounts normally — there is no hydration mismatch to reason
 * about, and no SSR-safety requirement on any component.
 *
 * Run: bun scripts/prerender.ts   (wired into `bun run build`)
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import { SITE_CONFIG } from "../src/constants";
import { getProjects } from "../src/constants/projects";
import { translations } from "../src/lib/translations";

const DIST = join(process.cwd(), "dist");
const seo = translations.en.seo;

interface Page {
  route: string;
  title: string;
  description: string;
  image: string;
}

const STATIC: Array<[route: string, key: keyof typeof seo, image: string]> = [
  ["/", "home", "/og-image.png"],
  ["/about", "about", "/og/about.png"],
  ["/timeline", "timeline", "/og/timeline.png"],
  ["/skills", "skills", "/og/skills.png"],
  ["/projects", "projects", "/og/projects.png"],
  ["/services", "services", "/og/services.png"],
  ["/contact", "contact", "/og/contact.png"],
  ["/donate", "donate", "/og/donate.png"],
  ["/privacy", "privacy", "/og-image.png"],
];

const pages: Page[] = STATIC.map(([route, key, image]) => {
  const entry = seo[key] as { title: string; description: string };
  return { route, title: entry.title, description: entry.description, image };
});

for (const p of getProjects("en")) {
  pages.push({
    route: `/projects/${p.slug}`,
    title: `${p.title} — Project`,
    description: (p.tagline || p.description || "").slice(0, 300),
    image: `/og/projects/${p.slug}.png`,
  });
}

const esc = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Replace the content="" of the <meta> carrying this name/property. */
const setMeta = (html: string, key: string, value: string): string => {
  // [^>] matches newlines too, so multi-line meta tags are handled.
  const re = new RegExp(
    `<meta\\b(?=[^>]*(?:name|property)="${key}")[^>]*>`,
    "i",
  );
  return html.replace(re, (tag) =>
    /content="/.test(tag)
      ? tag.replace(/content="[^"]*"/, `content="${esc(value)}"`)
      : tag,
  );
};

const shell = await readFile(join(DIST, "index.html"), "utf8");

let written = 0;
for (const page of pages) {
  const url = `${SITE_CONFIG.url}${page.route === "/" ? "/" : page.route}`;
  const fullTitle =
    page.route === "/"
      ? `${SITE_CONFIG.title} | ${SITE_CONFIG.name}`
      : `${page.title} | ${SITE_CONFIG.name}`;
  const img = `${SITE_CONFIG.url}${page.image}`;

  let html = shell;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(fullTitle)}</title>`);

  for (const [k, v] of [
    ["description", page.description],
    ["title", fullTitle],
    ["og:title", fullTitle],
    ["og:description", page.description],
    ["og:url", url],
    ["og:image", img],
    ["og:image:secure_url", img],
    ["twitter:title", fullTitle],
    ["twitter:description", page.description],
    ["twitter:url", url],
    ["twitter:image", img],
  ] as const) {
    html = setMeta(html, k, v);
  }

  // A per-route file can finally carry a correct canonical. A static one in
  // index.html could not — it would have claimed the home URL on every route,
  // which is exactly the "multiple conflicting canonical URLs" warning noted
  // in index.html.
  html = html.replace(
    /<\/head>/i,
    `  <link rel="canonical" href="${esc(url)}">\n  </head>`,
  );

  const out =
    page.route === "/"
      ? join(DIST, "index.html")
      : join(DIST, page.route.slice(1), "index.html");
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, html);
  written++;
}

/*
 * The SPA fallback in vercel.json points unmatched URLs here rather than at
 * index.html. Serving the home document meant every junk URL advertised
 * `index, follow` in all three bot tags and claimed the home page as its
 * canonical, so the client-side 404's own `noindex` was arguing with a
 * bot-specific tag that outranks it. This file is the same shell — the app
 * still boots and client-routes normally — it just tells crawlers the truth
 * before any JavaScript runs.
 */
let notFound = shell;
notFound = notFound.replace(
  /<title>[\s\S]*?<\/title>/i,
  `<title>Page not found | ${esc(SITE_CONFIG.name)}</title>`,
);
for (const [k, v] of [
  ["description", "This page does not exist."],
  ["title", `Page not found | ${SITE_CONFIG.name}`],
  ["og:title", `Page not found | ${SITE_CONFIG.name}`],
  ["og:description", "This page does not exist."],
  ["robots", "noindex, nofollow"],
  ["googlebot", "noindex, nofollow"],
  ["bingbot", "noindex, nofollow"],
] as const) {
  notFound = setMeta(notFound, k, v);
}
await writeFile(join(DIST, "404.html"), notFound);

console.log(`prerender: wrote ${written} route documents and 404.html into dist/`);
