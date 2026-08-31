/**
 * Emits a real HTML file per route after `vite build`.
 *
 * The app is a client-rendered SPA, so every URL used to serve the same
 * `index.html`, meaning every route advertised the *home page's* title,
 * description, canonical and OG image. Google runs JS and coped, but link
 * unfurlers (LinkedIn, Slack, WhatsApp, Discord, iMessage) do not: sharing
 * /projects/oxidize previewed as the homepage.
 *
 * This writes dist/<route>/index.html for each route with that route's own
 * metadata patched into the head. The body is left exactly as Vite emitted it,
 * so React still mounts normally: there is no hydration mismatch to reason
 * about, and no SSR-safety requirement on any component.
 *
 * Run: bun scripts/prerender.ts   (wired into `bun run build`)
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import { SITE_CONFIG } from "../src/constants";
import { getProjects } from "../src/constants/projects";
import {
  getProjectSeoDescription,
  getProjectSeoTitle,
  getServicesFaqs,
  getServicesHowTo,
} from "../src/config/seo-data";
import {
  createBreadcrumbSchema,
  createFAQSchema,
  createHowToSchema,
  createSoftwareApplicationSchema,
  createSoftwareSourceCodeSchema,
  getDefaultCitations,
} from "../src/lib/seo-utils";
import { translations } from "../src/lib/translations";

const DIST = join(process.cwd(), "dist");
const seo = translations.en.seo;

interface Page {
  route: string;
  title: string;
  description: string;
  keywords: string;
  image: string;
  /** og:type. Must match what the page passes to `<SEO type>`, or the head
   *  ends up with a prerendered `website` arguing with a Helmet `article`. */
  ogType: "website" | "article";
  /**
   * Route-specific JSON-LD, on top of the four site-wide graphs already in the
   * shell (Person, WebSite, ProfessionalService, Organization).
   */
  jsonLd: object[];
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

const citations = getDefaultCitations();

/**
 * The page-specific structured data worth baking into the static document.
 *
 * Everything a page passes to `<SEO>` is emitted by Helmet, i.e. only after
 * React has run. Google renders JS and sees it; the crawlers that do not
 * (Bingbot's non-render pass, LinkedIn, Slack, and every AI crawler) see the
 * head of this file and nothing else, because the body they receive is an empty
 * `<div id="root">`. So the highest-value graphs are emitted here too.
 *
 * Both copies come from the same helpers the pages call, so the static tag and
 * the Helmet-appended one are the same object rather than two disagreeing ones.
 * Same trade-off the robots/canonical pair already makes.
 */
const staticSchemas = (route: string): object[] => {
  const url = `${SITE_CONFIG.url}${route}`;
  const graphs: object[] = [];

  // Breadcrumbs are how a nested route gets a trail instead of a bare URL in
  // the result. Returns null on "/", which has no trail to show.
  const breadcrumb = createBreadcrumbSchema(url);
  if (breadcrumb) graphs.push(breadcrumb);

  // Services is the one page that renders the FAQ and the step-by-step copy, so
  // it is the one page allowed to claim them. English, because that is what
  // this document says and what Googlebot resolves to.
  if (route === "/services") {
    const faq = createFAQSchema(getServicesFaqs("en"), citations);
    if (faq) graphs.push(faq);
    const howTo = createHowToSchema(getServicesHowTo("en"), citations);
    if (howTo) graphs.push(howTo);
  }

  return graphs;
};

const pages: Page[] = STATIC.map(([route, key, image]) => {
  const entry = seo[key] as {
    title: string;
    description: string;
    keywords: string;
  };
  return {
    route,
    title: entry.title,
    description: entry.description,
    keywords: entry.keywords,
    image,
    ogType: "website",
    jsonLd: staticSchemas(route),
  };
});

// Title, description and keywords are exactly what ProjectDetails passes to
// <SEO>: Helmet appends its tags to the ones already in the document, so
// anything else here would put two disagreeing titles/descriptions in the same
// head. getProjectSeoTitle is language-neutral for that reason; the description
// is the English one, which is what Googlebot resolves to.
for (const p of getProjects("en")) {
  pages.push({
    route: `/projects/${p.slug}`,
    title: getProjectSeoTitle(p.slug, p.title),
    description: getProjectSeoDescription(p).slice(0, 300),
    keywords: `${p.title} ${seo.projectDetailsKeywordsSuffix}, ${p.tags.join(", ")}, Dominik Konitzer`,
    image: `/og/projects/${p.slug}.png`,
    // ProjectDetails passes type="article" to <SEO>.
    ogType: "article",
    jsonLd: [
      ...staticSchemas(`/projects/${p.slug}`),
      createSoftwareSourceCodeSchema(p),
      createSoftwareApplicationSchema(p),
    ],
  });
}

// A route that reaches the router but not this list ships with no file behind
// it, and Vercel answers 404 for a path with no file. That is invisible in dev
// (the dev server has no prerender step) and invisible in the browser (the app
// boots from 404.html and client-routes to the right page anyway), so fail the
// build instead of letting the route rot as a 404 to every crawler.
const routerSrc = await readFile(
  join(process.cwd(), "src", "components", "AnimatedRoutes.tsx"),
  "utf8",
);
const covered = new Set(pages.map((p) => p.route));
const uncovered = [...routerSrc.matchAll(/path="([^"]+)"/g)]
  .map((m) => m[1])
  .filter((p) => p !== "*" && !p.includes(":") && !covered.has(p));

if (uncovered.length > 0) {
  console.error(
    `prerender: routed but not prerendered: ${uncovered.join(", ")}\n` +
      "  Add each one to the STATIC list in scripts/prerender.ts.",
  );
  process.exit(1);
}

const esc = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * JSON-LD goes inside a <script>, where HTML escaping does not apply but a
 * literal `</script>` in any string value would end the block early. Only the
 * `</` sequence can do that, and `<\/` is the same character in JSON.
 */
const escJsonLd = (data: object): string =>
  JSON.stringify(data).replace(/<\//g, "<\\/");

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

/**
 * The no-JavaScript fallback.
 *
 * React renders into an empty `<div id="root">`, so with scripting off every
 * URL on this site is a blank cream page: no title on screen, no way out, no
 * hint that anything is wrong. This is the standard `<noscript>` answer to
 * that, and it repeats only what the head of the same document already says
 * (this route's title and description), plus links to the handful of things
 * here that genuinely work without scripting. /projects and /contact are
 * deliberately *not* linked: they are blank without JS too, so sending someone
 * there would be a dead end.
 *
 * Side effect worth having: the crawlers that do not run JS (GPTBot,
 * ClaudeBot, PerplexityBot, CCBot) currently read every route as an empty
 * body. This gives them the same two sentences a human with JS off gets.
 */
const noscriptBlock = (title: string, description: string): string =>
  `    <noscript>
      <div class="no-js">
        <p><strong>${esc(title)}</strong></p>
        <p>${esc(description)}</p>
        <p>The rest of this page is rendered with JavaScript, which is switched off in your browser. These do not need it:</p>
        <ul>
          <li><a href="/cv/curriculum-vitae.html">My CV, in English</a></li>
          <li><a href="/cv/lebenslauf.html">Mein Lebenslauf, auf Deutsch</a></li>
          <li><a href="/sitemap.xml">Every page on this site</a></li>
          <li><a href="mailto:${esc(SITE_CONFIG.email)}">Email me</a></li>
        </ul>
      </div>
    </noscript>`;

/** Insert the fallback straight after the mount point React owns. */
const withNoscript = (
  html: string,
  title: string,
  description: string,
): string =>
  html.replace(
    /<div id="root"><\/div>/i,
    `<div id="root"></div>\n${noscriptBlock(title, description)}`,
  );

const shell = await readFile(join(DIST, "index.html"), "utf8");

let written = 0;
for (const page of pages) {
  const url = `${SITE_CONFIG.url}${page.route === "/" ? "/" : page.route}`;
  const fullTitle = `${page.title} | ${SITE_CONFIG.name}`;
  const img = `${SITE_CONFIG.url}${page.image}`;

  let html = shell;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(fullTitle)}</title>`);

  for (const [k, v] of [
    ["description", page.description],
    ["keywords", page.keywords],
    ["title", fullTitle],
    ["og:title", fullTitle],
    ["og:type", page.ogType],
    ["og:description", page.description],
    ["og:url", url],
    ["og:image", img],
    ["og:image:secure_url", img],
    ["twitter:title", fullTitle],
    ["twitter:description", page.description],
    ["twitter:url", url],
    ["twitter:image", img],
    // Dublin Core is nearly dead as a ranking signal, but the shell's copy
    // names the home URL, so every other route shipped a DC.identifier that
    // disagreed with its own canonical.
    ["DC.identifier", url],
  ] as const) {
    html = setMeta(html, k, v);
  }

  // A per-route file can finally carry a correct canonical. A static one in
  // index.html could not: it would have claimed the home URL on every route,
  // which is exactly the "multiple conflicting canonical URLs" warning noted
  // in index.html.
  html = html.replace(
    /<\/head>/i,
    `  <link rel="canonical" href="${esc(url)}">\n  </head>`,
  );

  if (page.jsonLd.length > 0) {
    const blocks = page.jsonLd
      .map(
        (data) =>
          `  <script type="application/ld+json">${escJsonLd(data)}</script>`,
      )
      .join("\n");
    html = html.replace(/<\/head>/i, `${blocks}\n  </head>`);
  }

  // The avatar is the LCP element on /about but lives in a lazy route chunk,
  // so the browser would only discover it after React renders the page. A
  // preload in the head starts that fetch alongside the entry script instead.
  if (page.route === "/about") {
    html = html.replace(
      /<\/head>/i,
      `  <link rel="preload" as="image" href="/avatar.jpg" fetchpriority="high">\n  </head>`,
    );
  }

  html = withNoscript(html, fullTitle, page.description);

  if (!html.includes("<noscript>")) {
    console.error(
      `prerender: no mount point found in the shell, so ${page.route} shipped\n` +
        "  without its no-JS fallback. Did index.html's <div id=\"root\"> change?",
    );
    process.exit(1);
  }

  const out =
    page.route === "/"
      ? join(DIST, "index.html")
      : join(DIST, page.route.slice(1), "index.html");
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, html);
  written++;
}

/*
 * Vercel serves a 404.html from the output directory for any path that matches
 * no other file, and does it with a real 404 status. Every route of this site
 * is a real file (written above), so there is deliberately no catch-all rewrite
 * in vercel.json: one would have to answer 200 and turn every junk URL into a
 * soft 404. This document is the same shell, so the app still boots and
 * client-routes normally, it just tells crawlers the truth before any
 * JavaScript runs: noindex in all three bot tags, and no canonical claiming
 * some other page.
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
notFound = withNoscript(
  notFound,
  `Page not found | ${SITE_CONFIG.name}`,
  "This page does not exist.",
);
await writeFile(join(DIST, "404.html"), notFound);

console.log(`prerender: wrote ${written} route documents and 404.html into dist/`);
