/**
 * One-off generator for the Open Graph / social share images.
 *
 * Every route shared the single static /og-image.png, so links to /about,
 * /projects, etc. looked identical when shared (Slack/Discord/X) or shown
 * in AI answer cards. This renders a distinct 1200x630 card for the home
 * page, each section and each project in the site's own look (the bloom
 * palette and the three site fonts), served statically and wired through
 * the <SEO image=...> prop.
 *
 * Run: `bun scripts/gen-og.ts`. Needs `@resvg/resvg-js` and `sharp`, which are
 * not kept in package.json because these change rarely: install them once into
 * the temp folder below (`cd %TEMP%/resvg && bun add @resvg/resvg-js sharp`) or
 * into the repo transiently. The fonts are fetched into the temp folder on
 * first run, static cuts only (resvg cannot see web fonts and would draw a
 * variable font at its default weight): Geist from its own repo, the other
 * two from the Google Fonts repo.
 *
 * The cards are written as 128-colour palette PNGs. resvg's 32-bit output is
 * ~950 KB per card because the grain filter defeats PNG compression, and
 * WhatsApp silently drops link previews whose image is over ~300 KB; at 128
 * colours with dithering a card is ~120 KB and indistinguishable at share size.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const TRANSIENT = join(tmpdir(), "resvg", "node_modules");
const transient = <T>(name: string, ...segments: string[]): T => {
  try {
    return require(name) as T;
  } catch {
    return require(join(TRANSIENT, ...segments)) as T;
  }
};
const { Resvg } = transient<typeof import("@resvg/resvg-js")>("@resvg/resvg-js", "@resvg", "resvg-js");
const sharp = transient<typeof import("sharp")>("sharp", "sharp");

const FONT_DIR = join(tmpdir(), "og-fonts");
const GOOGLE_FONTS = "https://github.com/google/fonts/raw/main/ofl";
const GEIST = "https://github.com/vercel/geist-font/raw/main/fonts/Geist/ttf";
const FONT_URLS = [
  `${GOOGLE_FONTS}/mplusrounded1c/MPLUSRounded1c-ExtraBold.ttf`,
  `${GOOGLE_FONTS}/kaiseidecol/KaiseiDecol-Bold.ttf`,
  `${GEIST}/Geist-Regular.ttf`,
  `${GEIST}/Geist-Medium.ttf`,
];

async function ensureFonts(): Promise<string[]> {
  mkdirSync(FONT_DIR, { recursive: true });
  const paths: string[] = [];
  for (const url of FONT_URLS) {
    const out = join(FONT_DIR, url.split("/").at(-1) as string);
    if (!existsSync(out)) {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`font download failed: ${url} (${res.status})`);
      writeFileSync(out, new Uint8Array(await res.arrayBuffer()));
    }
    paths.push(out);
  }
  return paths;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// The bloom tokens from index.css, resolved to hex (see the token table
// there): page, primary violet and its lilac highlight, ink, muted ink, the
// deep sage the eyebrows use, and the three stops of the card wash.
const BG = "#f6f0e6";
const PRIMARY = "#62477f";
const LILAC = "#8d74a8";
const FOREGROUND = "#332a38";
const MUTED = "#5f6478";
const SAGE_DEEP = "#4e7040";
const VIOLET = "#5a4276";
const SAGE = "#a9c39a";
const BLUSH = "#e4d3e0";

// The site's three faces in their site roles: the hero name's face for the
// name on the home card, Kaisei Decol for every other title, Geist for text.
// resvg matches the family name inside the file, and M PLUS Rounded 1c calls
// itself "Rounded Mplus 1c" there; under the web name the home card fell back
// to the body face.
const NAME_FONT = "Rounded Mplus 1c";
const TITLE_FONT = "Kaisei Decol";
const BODY_FONT = "Geist";

/** Greedy word wrap for the subtitle: two lines at most, so it never runs
 *  under the footer. */
function wrap(text: string, max: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length > max && line) {
      lines.push(line);
      line = w;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 2);
}

const backdrop = `
  <defs>
    <linearGradient id="wash" x1="0" y1="0" x2="1" y2="0.35">
      <stop offset="0" stop-color="${VIOLET}" stop-opacity="0.30"/>
      <stop offset="0.5" stop-color="${SAGE}" stop-opacity="0.26"/>
      <stop offset="1" stop-color="${BLUSH}" stop-opacity="0.7"/>
    </linearGradient>
    <radialGradient id="glow" cx="18%" cy="30%" r="55%">
      <stop offset="0" stop-color="${PRIMARY}" stop-opacity="0.14"/>
      <stop offset="1" stop-color="${PRIMARY}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="name" x1="0" y1="0" x2="1" y2="0.2">
      <stop offset="0" stop-color="${PRIMARY}"/>
      <stop offset="0.55" stop-color="${LILAC}"/>
      <stop offset="1" stop-color="${PRIMARY}"/>
    </linearGradient>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.27  0 0 0 0 0.19  0 0 0 0 0.38  0 0 0 0.09 0"/>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="${BG}"/>
  <rect width="1200" height="630" fill="url(#wash)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="630" filter="url(#grain)"/>`;

const eyebrow = (text: string, y: number) =>
  `<text x="120" y="${y}" font-family="${BODY_FONT}" font-weight="500" font-size="26" fill="${SAGE_DEEP}">${esc(text)}</text>`;

const footer = (text: string) =>
  `<text x="120" y="552" font-family="${BODY_FONT}" font-weight="400" font-size="24" fill="${MUTED}">${esc(text)}</text>`;

const subtitle = (text: string, y: number) =>
  wrap(text, 58)
    .map(
      (line, i) =>
        `<text x="120" y="${y + i * 46}" font-family="${BODY_FONT}" font-weight="500" font-size="34" fill="${FOREGROUND}" fill-opacity="0.82">${esc(line)}</text>`,
    )
    .join("\n  ");

const card = (title: string, sub: string, path: string) =>
  `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  ${backdrop}
  ${eyebrow("Dominik Könitzer", 196)}
  <text x="114" y="330" font-family="${TITLE_FONT}" font-weight="700" font-size="104" fill="url(#name)">${esc(title)}</text>
  ${subtitle(sub, 404)}
  ${footer(`dk.punds.ch${path}`)}
</svg>`;

// The home card mirrors the hero: the greeting, then the name at hero size.
const homeCard = () =>
  `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  ${backdrop}
  ${eyebrow("Hi, I'm", 168)}
  <text x="114" y="292" font-family="${NAME_FONT}" font-weight="800" font-size="112" fill="url(#name)">Dominik</text>
  <text x="114" y="404" font-family="${NAME_FONT}" font-weight="800" font-size="112" fill="url(#name)">Könitzer</text>
  ${subtitle("Software engineer and web developer in Zürich", 470)}
  ${footer("dk.punds.ch")}
</svg>`;

const CARDS: { out: string; title: string; subtitle: string; path: string }[] = [
  { out: "public/og/about.png", title: "About", subtitle: "Software engineer in Zürich, Switzerland", path: "/about" },
  { out: "public/og/experience.png", title: "Experience", subtitle: "School in three countries, then an internship in Lucerne", path: "/experience" },
  { out: "public/og/skills.png", title: "Skills", subtitle: "What I work with day to day, and what I'm still getting better at", path: "/skills" },
  { out: "public/og/projects.png", title: "Projects", subtitle: "Things I built, most of them with the source", path: "/projects" },
  { out: "public/og/services.png", title: "Services", subtitle: "Web development and software engineering, Zürich or remote", path: "/services" },
  { out: "public/og/contact.png", title: "Contact", subtitle: "Let's work together. One email is all it takes.", path: "/contact" },
  { out: "public/og/donate.png", title: "Tip Jar", subtitle: "If something here clicked for you", path: "/donate" },
];

// Per-project share cards (wired through ProjectDetails' <SEO image=...>, which
// points at /og/projects/<slug>.png). Subtitles follow each project's tagline.
const PROJECT_CARDS: { slug: string; title: string; subtitle: string }[] = [
  { slug: "time", title: "Time", subtitle: "An NTP-synced clock, accurate to a hundredth of a second" },
  { slug: "spectrum", title: "Spectrum", subtitle: "Five color tools under one roof, and none of them phone home" },
  { slug: "entropy", title: "Entropy", subtitle: "Real randomness and an honest strength score, nothing leaves your browser" },
  { slug: "zephyr", title: "Zephyr", subtitle: "A to-do list and a focus timer, all yours and all offline" },
  { slug: "senbon", title: "Senbon", subtitle: "A digital garden that refuses to be found on Google. On purpose." },
  { slug: "punds", title: "Punds", subtitle: "A CRT terminal that boots up to tell you where everything else lives" },
  { slug: "flow", title: "Flow", subtitle: "Clicks faster than you can, and never needs a coffee break" },
  { slug: "jester", title: "Jester", subtitle: "Notepad, but it grew up. Tabs, line numbers, find in files, PDF export." },
  { slug: "remnants", title: "Remnants", subtitle: "VS Code, minus the parts that talk back" },
  { slug: "portfolio", title: "Portfolio", subtitle: "The site you are looking at. Yes, it is in the portfolio." },
  { slug: "oxidize", title: "Oxidize", subtitle: "Uninstall a program, then hunt down what it left behind" },
  { slug: "inkling", title: "Inkling", subtitle: "Your notes quietly turn into tasks and flashcards" },
  { slug: "cyberia", title: "Cyberia", subtitle: "An anime app built around waiting as little as possible" },
  { slug: "accela", title: "Accela", subtitle: "Films and series, in an app that trusts nothing it stores" },
  { slug: "mochi", title: "Mochi", subtitle: "A tiling window manager that always gives the desktop back" },
];

const fontFiles = await ensureFonts();
const render = async (svg: string, out: string) => {
  mkdirSync(dirname(out), { recursive: true });
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
    font: { fontFiles, loadSystemFonts: false, defaultFontFamily: BODY_FONT },
  });
  const png = await sharp(resvg.render().asPng())
    .png({ palette: true, colours: 128, dither: 1.0, compressionLevel: 9, effort: 10 })
    .toBuffer();
  writeFileSync(out, png);
  console.log("ok", out, `${Math.round(png.length / 1024)} KB`);
};

await render(homeCard(), "public/og-image.png");
for (const c of CARDS) await render(card(c.title, c.subtitle, c.path), c.out);
for (const p of PROJECT_CARDS) {
  await render(card(p.title, p.subtitle, `/projects/${p.slug}`), `public/og/projects/${p.slug}.png`);
}
console.log(`Generated ${1 + CARDS.length + PROJECT_CARDS.length} OG cards.`);
