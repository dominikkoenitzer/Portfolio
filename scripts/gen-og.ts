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
 * Run: `bun scripts/gen-og.ts`. Needs `@resvg/resvg-js`, which is not kept in
 * package.json because these change rarely: install it once into the temp
 * folder below (`cd %TEMP%/resvg && bun add @resvg/resvg-js`) or into the
 * repo transiently. The fonts are fetched from the Google Fonts repo into the
 * temp folder on first run; resvg cannot see web fonts.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const RESVG_FALLBACK = join(tmpdir(), "resvg", "node_modules", "@resvg", "resvg-js");
const { Resvg } = (() => {
  try {
    return require("@resvg/resvg-js");
  } catch {
    return require(RESVG_FALLBACK);
  }
})();

const FONT_DIR = join(tmpdir(), "og-fonts");
const FONT_FILES = [
  "mplusrounded1c/MPLUSRounded1c-ExtraBold.ttf",
  "zenmarugothic/ZenMaruGothic-Medium.ttf",
  "zenmarugothic/ZenMaruGothic-Bold.ttf",
  "zenkakugothicnew/ZenKakuGothicNew-Regular.ttf",
  "zenkakugothicnew/ZenKakuGothicNew-Medium.ttf",
];

async function ensureFonts(): Promise<string[]> {
  mkdirSync(FONT_DIR, { recursive: true });
  const paths: string[] = [];
  for (const rel of FONT_FILES) {
    const out = join(FONT_DIR, rel.split("/")[1]);
    if (!existsSync(out)) {
      const res = await fetch(`https://github.com/google/fonts/raw/main/ofl/${rel}`);
      if (!res.ok) throw new Error(`font download failed: ${rel} (${res.status})`);
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
// deep sage the eyebrows use, and the three grainient stops.
const BG = "#f6f0e6";
const PRIMARY = "#62477f";
const LILAC = "#8d74a8";
const FOREGROUND = "#332a38";
const MUTED = "#5f6478";
const SAGE_DEEP = "#4e7040";
const VIOLET = "#5a4276";
const SAGE = "#a9c39a";
const BLUSH = "#e4d3e0";

const TITLE_FONT = "M PLUS Rounded 1c";
const SUB_FONT = "Zen Maru Gothic";
const BODY_FONT = "Zen Kaku Gothic New";

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
  `<text x="120" y="${y}" font-family="${BODY_FONT}" font-weight="500" font-size="24" letter-spacing="6" fill="${SAGE_DEEP}">${esc(text)}</text>`;

const footer = (text: string) =>
  `<text x="120" y="552" font-family="${BODY_FONT}" font-weight="400" font-size="24" fill="${MUTED}">${esc(text)}</text>`;

const subtitle = (text: string, y: number) =>
  wrap(text, 58)
    .map(
      (line, i) =>
        `<text x="120" y="${y + i * 46}" font-family="${SUB_FONT}" font-weight="500" font-size="34" fill="${FOREGROUND}" fill-opacity="0.82">${esc(line)}</text>`,
    )
    .join("\n  ");

const card = (title: string, sub: string, path: string) =>
  `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  ${backdrop}
  ${eyebrow("DOMINIK KÖNITZER", 196)}
  <text x="114" y="330" font-family="${TITLE_FONT}" font-weight="800" font-size="104" fill="url(#name)">${esc(title)}</text>
  ${subtitle(sub, 404)}
  ${footer(`dk.punds.ch${path}`)}
</svg>`;

// The home card mirrors the hero: the greeting, then the name at hero size.
const homeCard = () =>
  `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  ${backdrop}
  ${eyebrow("HI, I'M", 168)}
  <text x="114" y="292" font-family="${TITLE_FONT}" font-weight="800" font-size="112" fill="url(#name)">Dominik</text>
  <text x="114" y="404" font-family="${TITLE_FONT}" font-weight="800" font-size="112" fill="url(#name)">Könitzer</text>
  ${subtitle("Software engineer and web developer in Zürich", 470)}
  ${footer("dk.punds.ch")}
</svg>`;

const CARDS: { out: string; title: string; subtitle: string; path: string }[] = [
  { out: "public/og/about.png", title: "About", subtitle: "Software engineer in Zürich, Switzerland", path: "/about" },
  { out: "public/og/timeline.png", title: "Timeline", subtitle: "School in three countries, then an internship in Lucerne", path: "/timeline" },
  { out: "public/og/skills.png", title: "Skills", subtitle: "What I work with day to day, and what I'm still getting better at", path: "/skills" },
  { out: "public/og/projects.png", title: "Projects", subtitle: "Things I built and put online, source included", path: "/projects" },
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
];

const fontFiles = await ensureFonts();
const render = (svg: string, out: string) => {
  mkdirSync(dirname(out), { recursive: true });
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
    font: { fontFiles, loadSystemFonts: false, defaultFontFamily: BODY_FONT },
  });
  writeFileSync(out, resvg.render().asPng());
  console.log("ok", out);
};

render(homeCard(), "public/og-image.png");
for (const c of CARDS) render(card(c.title, c.subtitle, c.path), c.out);
for (const p of PROJECT_CARDS) {
  render(card(p.title, p.subtitle, `/projects/${p.slug}`), `public/og/projects/${p.slug}.png`);
}
console.log(`Generated ${1 + CARDS.length + PROJECT_CARDS.length} OG cards.`);
