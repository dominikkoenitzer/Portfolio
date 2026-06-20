/**
 * One-off generator for public/favicon.ico.
 *
 * Google's favicon crawler and legacy clients request /favicon.ico by
 * convention regardless of <link> tags, so a real multi-size .ico closes a
 * common 404 and improves SERP favicon eligibility. We downscale the existing,
 * known-good gradient PNG (no SVG/font re-rasterization) into 16/32/48 frames
 * and pack them into one .ico.
 *
 * Run: `bun scripts/gen-favicon.ts` (needs `sharp` + `png-to-ico`; installed
 * transiently — not kept in package.json since the icon rarely changes).
 */
import { writeFileSync } from "node:fs";
import pngToIco from "png-to-ico";
import sharp from "sharp";

const SRC = "public/android-chrome-512x512.png";
const SIZES = [16, 32, 48];

const frames = await Promise.all(
  SIZES.map((size) => sharp(SRC).resize(size, size).png().toBuffer())
);

const ico = await pngToIco(frames);
writeFileSync("public/favicon.ico", ico);

console.log(`✓ wrote public/favicon.ico (${SIZES.join("/")} px, ${ico.length} bytes)`);
