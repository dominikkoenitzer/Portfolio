// A Markdown table of a Lighthouse CI run: per page, the median of every
// budgeted number across the runs, marked where it misses the budget.
//
//   node scripts/lighthouse-summary.mjs <.lighthouseci output dir>
//
// Reads the manifest the filesystem upload target writes. In CI the table is
// appended to the job summary.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2];
const preset = process.env.LHCI_PRESET === "desktop" ? "desktop" : "mobile";
const manifestPath = join(dir, "manifest.json");
if (!existsSync(manifestPath)) {
  console.log(`### Lighthouse, ${preset}

No results: the run stopped before any page was measured.
`);
  process.exit(0);
}
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};

const COLUMNS = [
  ["Perf", (l) => l.categories.performance.score * 100, (v) => v >= (preset === "desktop" ? 95 : 90), (v) => v.toFixed(0)],
  ["A11y", (l) => l.categories.accessibility.score * 100, (v) => v >= 100, (v) => v.toFixed(0)],
  ["BP", (l) => l.categories["best-practices"].score * 100, (v) => v >= 100, (v) => v.toFixed(0)],
  ["LCP s", (l) => l.audits["largest-contentful-paint"].numericValue / 1000, (v) => v <= 2, (v) => v.toFixed(2)],
  ["TBT ms (INP proxy)", (l) => l.audits["total-blocking-time"].numericValue, (v) => v <= 150, (v) => v.toFixed(0)],
  ["CLS", (l) => l.audits["cumulative-layout-shift"].numericValue, (v) => v <= 0.05, (v) => v.toFixed(3)],
];

const byPath = new Map();
for (const run of manifest) {
  const lhr = JSON.parse(readFileSync(run.jsonPath, "utf8"));
  const path = new URL(run.url).pathname;
  if (!byPath.has(path)) byPath.set(path, []);
  byPath.get(path).push(lhr);
}

const lines = [
  `### Lighthouse, ${preset} (median of ${median([...byPath.values()].map((r) => r.length))} runs)`,
  "",
  `| Page | ${COLUMNS.map(([name]) => name).join(" | ")} |`,
  `| --- | ${COLUMNS.map(() => "---:").join(" | ")} |`,
];
for (const [path, lhrs] of byPath) {
  const cells = COLUMNS.map(([, get, ok, fmt]) => {
    const value = median(lhrs.map(get));
    return ok(value) ? fmt(value) : `**${fmt(value)}** (over)`;
  });
  lines.push(`| ${path} | ${cells.join(" | ")} |`);
}
console.log(`${lines.join("\n")}\n`);
