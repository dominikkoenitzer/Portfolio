/**
 * One-off generator for the site icons: public/favicon.svg, favicon.ico,
 * apple-touch-icon.png and the two android-chrome PNGs, all from one drawing
 * in the bloom palette: a dusty-violet tile with "DK" in sage, set in the
 * hero's title face.
 *
 * The letters are baked in as a <path> rather than a <text> element, so the
 * SVG favicon renders identically in every browser tab without the font being
 * installed, and the rasters below are pixel-for-pixel the same drawing.
 *
 * Two variants come out of the same drawing: the tab icon has rounded corners
 * and larger letters; the PWA/touch icon is full-bleed with the letters pulled
 * in to the maskable safe zone (the inner 80%), because Android and iOS apply
 * their own mask and would otherwise clip the corners of the letters.
 *
 * Run: `bun scripts/gen-icons.ts`. Needs `@resvg/resvg-js`, `opentype.js` and
 * `png-to-ico`, none of which are kept in package.json because the icons
 * change rarely: install them once into the temp folder (`cd %TEMP%/resvg &&
 * bun add @resvg/resvg-js opentype.js png-to-ico`) or into the repo
 * transiently. The title font is fetched into the OG font cache on first run.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const TMP_MODULES = join(tmpdir(), "resvg", "node_modules");
const load = (name: string) => {
  try {
    return require(name);
  } catch {
    return require(join(TMP_MODULES, name));
  }
};
const { Resvg } = load("@resvg/resvg-js");
const opentype = load("opentype.js");
const pngToIcoModule = load("png-to-ico");
const pngToIco: (buffers: Buffer[]) => Promise<Buffer> =
  pngToIcoModule.default ?? pngToIcoModule;

// The same cache gen-og.ts fills, so the two scripts share one download.
const FONT_DIR = join(tmpdir(), "og-fonts");
const FONT_REL = "mplusrounded1c/MPLUSRounded1c-ExtraBold.ttf";

async function ensureFont(): Promise<string> {
  mkdirSync(FONT_DIR, { recursive: true });
  const out = join(FONT_DIR, FONT_REL.split("/")[1]);
  if (!existsSync(out)) {
    const res = await fetch(`https://github.com/google/fonts/raw/main/ofl/${FONT_REL}`);
    if (!res.ok) throw new Error(`font download failed: ${FONT_REL} (${res.status})`);
    writeFileSync(out, new Uint8Array(await res.arrayBuffer()));
  }
  return out;
}

// Bloom tokens from index.css, resolved to hex: the violet band the tile runs
// through (highlight to shadow) and the sage the letters are cut from.
const HAIR_LIGHT = "#7a5f9c";
const HAIR_DARK = "#4a3566";
const SAGE = "#b9d3ad";

const SIZE = 100;
const TEXT = "DK";

const font = opentype.loadSync(await ensureFont());

/** "DK" as path data, centred in the tile with its advance width at `width`. */
function letters(width: number): string {
  const options = { kerning: true, letterSpacing: -0.03 };
  const perUnit = font.getAdvanceWidth(TEXT, 1, options);
  const fontSize = width / perUnit;
  const capHeight =
    ((font.tables.os2?.sCapHeight ?? font.ascender * 0.72) / font.unitsPerEm) *
    fontSize;
  const x = (SIZE - width) / 2;
  const y = SIZE / 2 + capHeight / 2;
  return font.getPath(TEXT, x, y, fontSize, options).toPathData(2);
}

const drawing = (radius: number, lettersWidth: number) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>
    <linearGradient id="hair" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${HAIR_LIGHT}"/>
      <stop offset="1" stop-color="${HAIR_DARK}"/>
    </linearGradient>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" rx="${radius}" fill="url(#hair)"/>
  <path d="${letters(lettersWidth)}" fill="${SAGE}"/>
</svg>
`;

// Tab icon: rounded, letters at 70% of the tile. Full-bleed icon: the host
// masks it, so the letters stay inside the 80% safe zone with room to spare.
const tabIcon = drawing(24, 70);
const fullBleedIcon = drawing(0, 58);

const png = (svg: string, size: number): Buffer =>
  new Resvg(svg, { fitTo: { mode: "width", value: size } }).render().asPng();

const write = (path: string, data: Buffer | string) => {
  writeFileSync(path, data);
  console.log("ok", path);
};

write("public/favicon.svg", tabIcon);
write("public/favicon.ico", await pngToIco([16, 32, 48].map((s) => png(tabIcon, s))));
write("public/apple-touch-icon.png", png(fullBleedIcon, 180));
write("public/android-chrome-192x192.png", png(fullBleedIcon, 192));
write("public/android-chrome-512x512.png", png(fullBleedIcon, 512));
