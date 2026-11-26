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
 *
 * Pictures captured wider than 1600 px (the web projects, at twice their
 * viewport) also get a 1600 px middle copy, main shot and gallery alike. The
 * card and the reading column offer it before the full capture, so a retina
 * card costs what it did when 1600 px was the original and only the lightbox
 * fetches the full file.
 *
 * Each card picture also gets AVIF copies at the card and middle sizes, held to the error of a quality 82 JPEG of that size.
 */
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  avifImageSrc,
  cardImageSrc,
  mediumAvifSrc,
  mediumImageSrc,
  PORTFOLIO_PROJECTS,
  PROJECT_CARD_WIDTH,
  PROJECT_MEDIUM_WIDTH,
  pictureWidth,
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
const encode = (input: Buffer, width = PROJECT_CARD_WIDTH) =>
  sharp(input)
    .resize(width, null, { kernel: "lanczos3" })
    .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toBuffer();

const pixelsOf = (input: Buffer, width?: number) =>
  (width ? sharp(input).resize(width, null, { kernel: "lanczos3" }) : sharp(input))
    .removeAlpha()
    .raw()
    .toBuffer();

const meanSquaredError = (a: Buffer, b: Buffer) => {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += (a[i] - b[i]) ** 2;
  return sum / a.length;
};

const encodeAvif = (input: Buffer, width: number, quality: number) =>
  sharp(input)
    .resize(width, null, { kernel: "lanczos3" })
    .avif({ quality, chromaSubsampling: "4:4:4", effort: 6 })
    .toBuffer();

// The lowest AVIF quality no further from the plain downscale than a quality 82 JPEG of that size, bisected per picture.
const avifNoWorseThanJpeg = async (source: Buffer, width: number) => {
  const reference = await pixelsOf(source, width);
  const bound = meanSquaredError(await pixelsOf(await encode(source, width)), reference);
  let low = 30;
  let high = 100;
  let best = await encodeAvif(source, width, high);
  while (low < high) {
    const quality = (low + high) >> 1;
    const avif = await encodeAvif(source, width, quality);
    if (meanSquaredError(await pixelsOf(avif), reference) <= bound) {
      best = avif;
      high = quality;
    } else {
      low = quality + 1;
    }
  }
  return { avif: best, quality: low };
};

let before = 0;
let after = 0;
let avifBytes = 0;
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

  // The AVIF pair the card offers first: the card size and the middle size.
  for (const [path, width, jpegBytes] of [
    [avifImageSrc(card), PROJECT_CARD_WIDTH, buffer.length],
    [
      mediumAvifSrc(project.image, project.imageWidth),
      Math.min(project.imageWidth, PROJECT_MEDIUM_WIDTH),
      project.imageWidth > PROJECT_MEDIUM_WIDTH
        ? (await encode(source, PROJECT_MEDIUM_WIDTH)).length
        : source.length,
    ],
  ] as const) {
    const { avif, quality } = await avifNoWorseThanJpeg(source, width);
    await writeFile(join(PUBLIC, path), avif);
    avifBytes += avif.length;
    console.log(
      `  ${String(Math.round(jpegBytes / 1024)).padStart(4)} kB jpeg, ` +
        `${String(Math.round(avif.length / 1024)).padStart(4)} kB avif at ${quality}  ${path}`,
    );
  }
}

for (const project of PORTFOLIO_PROJECTS) {
  if (project.imageIcon) continue;
  for (const picture of [project.image, ...(project.gallery ?? [])]) {
    if (!picture) continue;
    const source = await readFile(join(PUBLIC, picture));
    const { width } = await sharp(source).metadata();
    if (width !== pictureWidth(picture)) {
      console.error(
        `  ! ${picture}: the file is ${width}px wide, the data says ${pictureWidth(picture)}px`,
      );
      mismatches += 1;
    }
    if (pictureWidth(picture) <= PROJECT_MEDIUM_WIDTH) continue;
    const medium = mediumImageSrc(picture);
    const buffer = await encode(source, PROJECT_MEDIUM_WIDTH);
    await writeFile(join(PUBLIC, medium), buffer);
    console.log(
      `  ${String(Math.round(source.length / 1024)).padStart(4)} kB -> ` +
        `${String(Math.round(buffer.length / 1024)).padStart(4)} kB  ${medium}`,
    );
  }
}

console.log(
  `\ncard images: ${Math.round(before / 1024)} kB of originals -> ` +
    `${Math.round(after / 1024)} kB (${Math.round(100 - (100 * after) / before)}% less on a 1x display)`,
);
console.log(`avif copies: ${Math.round(avifBytes / 1024)} kB in all`);

if (mismatches > 0) {
  console.error(
    `\n${mismatches} project(s) declare the wrong imageWidth; fix constants/projects before shipping.`,
  );
  process.exit(1);
}
