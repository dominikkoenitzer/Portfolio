/**
 * One-off generator for the site icons: public/favicon.svg, favicon.ico,
 * apple-touch-icon.png and the two android-chrome PNGs, all from one drawing
 * in the bloom palette: a rose, built ring by ring out of cupped petals that
 * run from pale blush on the outside to near-black violet at the heart.
 *
 * Small means simplified, large means detailed:
 *
 *   tab      the head alone on a rounded cream tile. `favicon.svg` and the 16
 *            and 32px entries in the .ico carry three rings, because seven
 *            turns at 16px is mud; the 48px entry gets all seven.
 *   app      the head at 78% with two sage leaves and a stem, full bleed. The
 *            home-screen and PWA slots are big enough for the whole plant, and
 *            the host applies its own mask, so everything sits inside the 80%
 *            maskable safe zone.
 *
 * It is pure geometry: no font, so nothing is downloaded and the SVG favicon
 * renders identically everywhere. Run: `bun scripts/gen-icons.ts`. Needs
 * `@resvg/resvg-js` and `png-to-ico`, kept out of package.json because the
 * icons change rarely: install them once into the temp folder
 * (`cd %TEMP%/resvg && bun add @resvg/resvg-js png-to-ico`).
 */
import { writeFileSync } from "node:fs";
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
const pngToIcoModule = load("png-to-ico");
const pngToIco: (buffers: Buffer[]) => Promise<Buffer> =
  pngToIcoModule.default ?? pngToIcoModule;

// Bloom tokens from index.css, resolved to hex.
const CREAM = "#f6f0e6";
const BLUSH_PALE = "#dcbcc1";
const BLUSH = "#c9a0a8";
const LILAC = "#8d74a8";
const VIOLET = "#62477f";
const VIOLET_DEEP = "#4a3560";
const VIOLET_DARK = "#382948";
const SAGE = "#97b78a";
const SAGE_DEEP = "#4e7040";

const SIZE = 512;
const C = SIZE / 2;

/**
 * One petal, drawn from the flower's centre outward and rotated into place.
 * `curl` pushes the tip sideways, so a ring of them turns rather than sitting
 * symmetrically: that turn is the difference between a rose and a daisy.
 */
const petal = (angle: number, len: number, wid: number, fill: string, curl = 0) =>
  `<path d="M0 0 C ${-wid} ${-len * 0.24}, ${-wid * 0.92 + curl} ${-len * 0.86}, ${curl * 1.15} ${-len}
            C ${wid * 0.92 + curl} ${-len * 0.86}, ${wid} ${-len * 0.24}, 0 0 Z"
     fill="${fill}" transform="translate(${C} ${C}) rotate(${angle})"/>`;

interface Ring {
  count: number;
  len: number;
  wid: number;
  fill: string;
  curl?: number;
  offset?: number;
}

const ring = ({ count, len, wid, fill, curl = 0, offset = 0 }: Ring) =>
  Array.from({ length: count }, (_, i) =>
    petal((360 / count) * i + offset, len, wid, fill, curl),
  ).join("");

/** Seven turns from the outside in, each smaller, tighter and a step darker. */
const head = `
  ${ring({ count: 10, len: 214, wid: 126, fill: BLUSH_PALE, curl: 44 })}
  ${ring({ count: 9, len: 178, wid: 110, fill: BLUSH, curl: 38, offset: 19 })}
  ${ring({ count: 8, len: 146, wid: 94, fill: LILAC, curl: 33, offset: 40 })}
  ${ring({ count: 7, len: 116, wid: 78, fill: VIOLET, curl: 28, offset: 62 })}
  ${ring({ count: 6, len: 88, wid: 62, fill: VIOLET_DEEP, curl: 24, offset: 12 })}
  ${ring({ count: 5, len: 64, wid: 48, fill: VIOLET_DARK, curl: 20, offset: 44 })}
  ${ring({ count: 4, len: 44, wid: 34, fill: VIOLET_DARK, curl: 16, offset: 76 })}
  <circle cx="${C}" cy="${C}" r="13" fill="${BLUSH}"/>`;

/** Three turns, for the 16px entry in the .ico. */
const headSmall = `
  ${ring({ count: 8, len: 208, wid: 132, fill: BLUSH, curl: 48 })}
  ${ring({ count: 6, len: 146, wid: 100, fill: LILAC, curl: 38, offset: 28 })}
  ${ring({ count: 4, len: 84, wid: 62, fill: VIOLET, curl: 26, offset: 58 })}
  <circle cx="${C}" cy="${C}" r="20" fill="${BLUSH_PALE}"/>`;

/** Leaves and stem under a head scaled to 78%, so the leaves clear the petals. */
const plant = `
  <path d="M256 486 C 128 486, 62 404, 62 322 C 190 322, 256 402, 256 486 Z" fill="${SAGE_DEEP}"/>
  <path d="M256 486 C 384 486, 450 404, 450 322 C 322 322, 256 402, 256 486 Z" fill="${SAGE}"/>
  <path d="M256 486 V 372" stroke="${SAGE_DEEP}" stroke-width="18" stroke-linecap="round"/>
  <g transform="translate(256 214) scale(0.78) translate(-256 -256)">${head}</g>`;

const svg = (radius: number, inner: string, scale = 1) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}">
  <rect width="${SIZE}" height="${SIZE}" rx="${radius}" fill="${CREAM}"/>
  <g transform="translate(${C} ${C}) scale(${scale}) translate(${-C} ${-C})">${inner}</g>
</svg>
`;

// The tab icon keeps the site's corner radius. The app icon is full bleed and
// pulled into the maskable safe zone, because the host rounds it further and
// would otherwise clip the leaves.
const tabIcon = svg(116, head);
const tabIconSmall = svg(116, headSmall);
const appIcon = svg(0, plant, 0.8);

const png = (source: string, size: number): Buffer =>
  new Resvg(source, { fitTo: { mode: "width", value: size } }).render().asPng();

const write = (path: string, data: Buffer | string) => {
  writeFileSync(path, data);
  console.log("ok", path);
};

// `favicon.svg` is a tab asset and nothing else, so it takes the drawing that
// survives 16 to 32px rather than the one that looks best at 512.
write("public/favicon.svg", tabIconSmall);
write(
  "public/favicon.ico",
  await pngToIco([png(tabIconSmall, 16), png(tabIconSmall, 32), png(tabIcon, 48)]),
);
write("public/apple-touch-icon.png", png(appIcon, 180));
write("public/android-chrome-192x192.png", png(appIcon, 192));
write("public/android-chrome-512x512.png", png(appIcon, 512));
