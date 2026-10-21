// The JavaScript a first visit has to download before the app can start: the
// entry script and every module dist/index.html preloads with it, gzipped.
//
//   node scripts/bundle-size.mjs [--dir dist] [--base <other dist>] [--summary <file>]
//
// With --base the table compares against another build (in CI, the base
// branch's) file by file and in total. With --summary the table is appended to
// that file as Markdown (in CI, $GITHUB_STEP_SUMMARY).
//
// The budget is 170 kB. The entry is over it today, which is recorded below as
// a named exception with the size measured when it was set: the check passes
// while the entry stays at or under that ceiling, and fails the moment it grows
// past it. The exception is removed once the entry is back under 170 kB.

import { appendFileSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { gzipSync } from "node:zlib";

const BUDGET_KB = 170;
const EXCEPTION = {
  name: "entry-js-over-budget",
  ceilingKb: 232,
  reason:
    "the entry carries the router, the first page and the libraries it imports eagerly; measured 228.7 kB on main at 9cee2b0",
};

const args = process.argv.slice(2);
const arg = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

/** Entry files of a build, in load order, with their gzipped sizes in bytes. */
function entryFiles(dir) {
  const html = readFileSync(join(dir, "index.html"), "utf8");
  const srcs = [
    ...html.matchAll(/<script\b[^>]*type="module"[^>]*src="([^"]+)"/g),
    ...html.matchAll(/<link\b[^>]*rel="modulepreload"[^>]*href="([^"]+)"/g),
  ].map((m) => m[1]);
  if (!srcs.some((src) => /\.js$/.test(src))) {
    throw new Error(`no entry script found in ${join(dir, "index.html")}`);
  }
  return [...new Set(srcs)].map((src) => {
    const raw = readFileSync(join(dir, src.replace(/^\//, "")));
    return {
      // Hashes change on every build, so files are matched by name alone.
      name: src.replace(/^\/assets\//, "").replace(/-[\w-]{8}\.js$/, ".js"),
      gzip: gzipSync(raw, { level: 9 }).length,
    };
  });
}

const kb = (bytes) => (bytes / 1000).toFixed(1);
const signed = (bytes) => `${bytes > 0 ? "+" : ""}${kb(bytes)}`;

const dir = resolve(arg("dir") ?? "dist");
const baseDir = arg("base") ? resolve(arg("base")) : undefined;
const now = entryFiles(dir);
const base = baseDir ? entryFiles(baseDir) : [];
const total = now.reduce((s, f) => s + f.gzip, 0);
const baseTotal = base.reduce((s, f) => s + f.gzip, 0);

const names = [...new Set([...now, ...base].map((f) => f.name))];
const rows = names.map((name) => {
  const a = base.find((f) => f.name === name)?.gzip ?? 0;
  const b = now.find((f) => f.name === name)?.gzip ?? 0;
  return baseDir
    ? `| ${name} | ${kb(a)} | ${kb(b)} | ${signed(b - a)} |`
    : `| ${name} | ${kb(b)} |`;
});

const overBudget = total > BUDGET_KB * 1000;
const overCeiling = total > EXCEPTION.ceilingKb * 1000;
const verdict = !overBudget
  ? `within the ${BUDGET_KB} kB budget`
  : overCeiling
    ? `over the ${BUDGET_KB} kB budget and past the ${EXCEPTION.ceilingKb} kB ceiling of exception ${EXCEPTION.name}`
    : `over the ${BUDGET_KB} kB budget, under the ${EXCEPTION.ceilingKb} kB ceiling of exception ${EXCEPTION.name} (${EXCEPTION.reason})`;

const table = [
  "### Entry JavaScript, gzipped (kB)",
  "",
  baseDir ? "| File | Base | This build | Change |" : "| File | This build |",
  baseDir ? "| --- | ---: | ---: | ---: |" : "| --- | ---: |",
  ...rows,
  baseDir
    ? `| **Total** | **${kb(baseTotal)}** | **${kb(total)}** | **${signed(total - baseTotal)}** |`
    : `| **Total** | **${kb(total)}** |`,
  "",
  `${kb(total)} kB: ${verdict}.`,
  "",
].join("\n");

console.log(table);
const summary = arg("summary");
if (summary) appendFileSync(summary, `${table}\n`);
if (overCeiling) process.exit(1);
