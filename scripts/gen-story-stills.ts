/**
 * Writes the stills the project stories show, in the sizes and formats the
 * page asks for: 640, 960, 1280 and 1920 px wide (the 640 px column at 1x,
 * 1.5x, 2x and 3x), each as AVIF, WebP and JPEG, never wider than the capture.
 *
 * Run: `bun scripts/gen-story-stills.ts <name>=<capture> ...`, for example
 * `oxidize-overview=C:/captures/hero-light.png`. The captures themselves stay
 * outside the repo; only the sized copies land in `public/projects/e/`.
 * Needs `sharp`, kept out of package.json like the other image scripts.
 */
import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const TRANSIENT = join(tmpdir(), "resvg", "node_modules");
const sharp = (() => {
  try {
    return require("sharp") as typeof import("sharp");
  } catch {
    return require(join(TRANSIENT, "sharp")) as typeof import("sharp");
  }
})();

/** Must match the widths `StillFigure` offers in `src/pages/e/kit.tsx`. */
const WIDTHS = [640, 960, 1280, 1920];
const OUT = join(process.cwd(), "public", "projects", "e");

const pairs = process.argv.slice(2).map((arg) => {
  const at = arg.indexOf("=");
  if (at < 1) throw new Error(`expected name=path, got ${arg}`);
  return { name: arg.slice(0, at), path: arg.slice(at + 1) };
});

await mkdir(OUT, { recursive: true });
for (const { name, path } of pairs) {
  const meta = await sharp(path).metadata();
  const full = meta.width ?? 0;
  for (const width of WIDTHS.filter((w) => w <= full)) {
    // Lanczos down to size, then the lightest sharpening, so small UI text
    // stays crisp after the scale-down.
    const base = () => sharp(path).resize({ width, kernel: "lanczos3" }).sharpen({ sigma: 0.5 });
    await base().avif({ quality: 62, effort: 4 }).toFile(join(OUT, `${name}-${width}.avif`));
    await base().webp({ quality: 84 }).toFile(join(OUT, `${name}-${width}.webp`));
    await base().flatten({ background: "#ffffff" }).jpeg({ quality: 86, mozjpeg: true }).toFile(join(OUT, `${name}-${width}.jpg`));
    console.log(`${name}-${width}`);
  }
}
