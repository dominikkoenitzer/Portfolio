/**
 * One-off generator for per-page Open Graph / social share images.
 *
 * Every route shared the single static /og-image.png, so links to /about,
 * /projects, etc. looked identical when shared (Slack/Discord/X) or shown
 * in AI answer cards. This renders a distinct 1200x630 card per section + per
 * project in the same dark-brand style as og-image.png, served statically and
 * wired through the <SEO image=...> prop.
 *
 * Run: `bun scripts/gen-og.ts` (needs `@resvg/resvg-js`; installed transiently
 * — not kept in package.json since these change rarely).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { Resvg } from "@resvg/resvg-js";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const FONT = "Segoe UI, Arial, sans-serif";

const card = (title: string, subtitle: string) =>
  `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a0f1e"/>
      <stop offset="1" stop-color="#0d1428"/>
    </linearGradient>
    <radialGradient id="glow" cx="22%" cy="40%" r="60%">
      <stop offset="0" stop-color="#2563eb" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#2563eb" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="96" y="222" width="8" height="132" rx="4" fill="#2563eb"/>
  <text x="140" y="208" font-family="${FONT}" font-size="26" font-weight="600" letter-spacing="5" fill="#5b8def">DOMINIK KÖNITZER</text>
  <text x="137" y="312" font-family="${FONT}" font-size="78" font-weight="700" fill="#ffffff">${esc(title)}</text>
  <text x="140" y="374" font-family="${FONT}" font-size="36" fill="#c2cbe0">${esc(subtitle)}</text>
  <text x="140" y="520" font-family="${FONT}" font-size="26" fill="#6b7693">dominikkoenitzer.ch</text>
</svg>`;

const CARDS: { out: string; title: string; subtitle: string }[] = [
  { out: "public/og/about.png", title: "About", subtitle: "Software engineer in Zürich, Switzerland" },
  { out: "public/og/timeline.png", title: "Timeline", subtitle: "Career & education — experience and studies" },
  { out: "public/og/skills.png", title: "Skills & Technologies", subtitle: "React · TypeScript · Node.js · full-stack" },
  { out: "public/og/projects.png", title: "Projects", subtitle: "Impact-focused software & web builds" },
  { out: "public/og/services.png", title: "Services", subtitle: "Web development & software engineering" },
  { out: "public/og/contact.png", title: "Contact", subtitle: "Let's build something — Zürich or remote" },
  { out: "public/og/donate.png", title: "Support My Work", subtitle: "Fund new builds, hosting & development" },
];

// Per-project share cards (wired through ProjectDetails' <SEO image=...>, which
// points at /og/projects/<slug>.png). Subtitles are short, plain summaries.
const PROJECT_CARDS: { out: string; title: string; subtitle: string }[] = [
  { out: "public/og/projects/time.png", title: "Time", subtitle: "NTP-synced clock, accurate to 1/100 of a second" },
  { out: "public/og/projects/spectrum.png", title: "Spectrum", subtitle: "Color picker, palettes & WCAG contrast tools" },
  { out: "public/og/projects/entropy.png", title: "Entropy", subtitle: "Local-only password generator & strength analyzer" },
  { out: "public/og/projects/zephyr.png", title: "Zephyr", subtitle: "Local-first focus & productivity app" },
  { out: "public/og/projects/senbon.png", title: "Senbon", subtitle: "A digital garden — one thousand entries" },
  { out: "public/og/projects/punds.png", title: "Punds", subtitle: "Everything I build, in one place" },
  { out: "public/og/projects/flow.png", title: "Flow", subtitle: "Ultra-low-latency Windows automation (C++)" },
  { out: "public/og/projects/jester.png", title: "Jester", subtitle: "A lightweight Windows notepad (C# · WPF)" },
  { out: "public/og/projects/remnants.png", title: "Remnants", subtitle: "A clean, AI-free fork of VS Code" },
  { out: "public/og/projects/portfolio.png", title: "Portfolio", subtitle: "This site — React, TypeScript, multilingual" },
];

for (const c of [...CARDS, ...PROJECT_CARDS]) {
  mkdirSync(dirname(c.out), { recursive: true });
  const resvg = new Resvg(card(c.title, c.subtitle), {
    fitTo: { mode: "width", value: 1200 },
    font: { loadSystemFonts: true, defaultFontFamily: "Segoe UI" },
  });
  writeFileSync(c.out, resvg.render().asPng());
  console.log("✓", c.out);
}
console.log(`Generated ${CARDS.length + PROJECT_CARDS.length} OG cards.`);
