/**
 * One-off generator for the small copies of the project screenshots that the
 * /projects catalogue serves.
 *
 * A catalogue card renders its picture at 534 CSS px at every width past 1280
 * and at roughly 340 px on a phone, but the only file behind it was the
 * full-size screenshot the detail page and the lightbox need. That put 844 kB
 * of image on one route, 448 kB of it fetched before the visitor had scrolled
 * a pixel, to fill boxes a third of that size. This writes an 800 px copy of
 * each card image beside the original; `ProjectsSection` offers both through
 * `srcset`, so a 1x display takes the small one and a retina display still
 * gets the sharp original.
 *
 * 800 px is the smallest step that still covers the two common buckets on
 * their own: a 1x desktop (534 px) and a 2x phone (~680 px). Anything denser
 * falls through to the original, which is what those screens should get.
 *
 * Run: `bun scripts/gen-card-images.ts` after adding a project or replacing a
 * project's `image`. Needs `sharp`, kept out of package.json for the same
 * reason `gen-og.ts` keeps it out: install it once into the temp folder below
 * (`cd %TEMP%/resvg && bun add sharp`) or into the repo transiently.
 *
 * The script also re-checks every source against the `imageWidth` the data
 * declares, because that number is the `w` descriptor the browser picks by: a
 * stale one quietly sends the wrong file.
 */
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  cardImageSrc,
  PORTFOLIO_PROJECTS,
  PROJECT_CARD_WIDTH,
} from "../src/constants/projects";

const require = createRequire(import.meta.url);
const TRANSIENT = join(tmpdir(), "resvg", "node_modules");
const transient = <T>(name: string, ...segments: string[]): T => {
  try {
    return require(name) as T;
  } catch {
    return require(join(TRANSIENT, ...segments)) as T;
  }
};
const sharp = transient<typeof import("sharp")>("sharp", "sharp");

const PUBLIC = join(process.cwd(), "public");

/**
 * Quality 82 through mozjpeg. The sources already sit between 0.02 and 0.15
 * bits per pixel, so they are encoded close to their floor; a downscale
 * re-encoded at 82 lands on the same side of that line and is
 * indistinguishable in a 534 px box. 4:4:4 is there for the one terminal
 * screenshot, whose coloured text bleeds under chroma subsampling.
 */
const encode = (input: Buffer) =>
  sharp(input)
    .resize(PROJECT_CARD_WIDTH, null, { kernel: "lanczos3" })
    .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toBuffer();

let before = 0;
let after = 0;
let mismatches = 0;

for (const project of PORTFOLIO_PROJECTS) {
  if (!project.image || project.imageIcon) continue;

  const sourcePath = join(PUBLIC, project.image);
  const source = await readFile(sourcePath);

  const meta = await sharp(source).metadata();
  if (meta.width !== project.imageWidth) {
    console.error(
      `  ! ${project.slug}: the file is ${meta.width}px wide, the data says ${project.imageWidth}px`,
    );
    mismatches += 1;
  }

  const card = cardImageSrc(project.image);
  const buffer = await encode(source);
  await writeFile(join(PUBLIC, card), buffer);

  before += source.length;
  after += buffer.length;
  console.log(
    `  ${project.slug.padEnd(10)} ${String(Math.round(source.length / 1024)).padStart(4)} kB -> ` +
      `${String(Math.round(buffer.length / 1024)).padStart(4)} kB  ${card}`,
  );
}

console.log(
  `\ncard images: ${Math.round(before / 1024)} kB of originals -> ` +
    `${Math.round(after / 1024)} kB (${Math.round(100 - (100 * after) / before)}% less on a 1x display)`,
);

if (mismatches > 0) {
  console.error(
    `\n${mismatches} project(s) declare the wrong imageWidth; fix constants/projects before shipping.`,
  );
  process.exit(1);
}
