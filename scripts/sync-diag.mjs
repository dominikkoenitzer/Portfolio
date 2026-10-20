// Copies the diagnostic panel's client from a checkout of its repository into
// src/vendor/diag, byte for byte, and records where each file came from.
//
//   node scripts/sync-diag.mjs <path to the diag checkout>   copy and record
//   node scripts/sync-diag.mjs --check                       verify only
//
// The files are taken from the checkout's last commit, never from its working
// tree, so work in progress there cannot leak in. --check (run in CI) fails
// when a vendored file no longer matches its recorded hash: the copy is
// changed by syncing again, not by editing it here.

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const target = join(root, "src", "vendor", "diag");
const manifestPath = join(target, "upstream.json");
const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");

if (process.argv[2] === "--check") {
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const bad = Object.entries(manifest.files).filter(
    ([name, hash]) => sha256(readFileSync(join(target, name))) !== hash,
  );
  if (bad.length) {
    console.error(`vendored diag files changed by hand: ${bad.map(([n]) => n).join(", ")}`);
    console.error("  Sync them again with scripts/sync-diag.mjs instead.");
    process.exit(1);
  }
  console.log(`diag client matches upstream ${manifest.commit.slice(0, 7)} (${Object.keys(manifest.files).length} files)`);
  process.exit(0);
}

const source = process.argv[2];
if (!source) {
  console.error("usage: node scripts/sync-diag.mjs <path to the diag checkout> | --check");
  process.exit(2);
}
const git = (...args) => execFileSync("git", ["-C", source, ...args]);
const commit = git("rev-parse", "HEAD").toString().trim();
const names = git("ls-tree", "--name-only", "HEAD", "src/client/")
  .toString()
  .split("\n")
  .filter((n) => n.endsWith(".js"))
  .map((n) => n.slice("src/client/".length));

mkdirSync(target, { recursive: true });
const files = {};
for (const name of names) {
  const content = git("show", `HEAD:src/client/${name}`);
  writeFileSync(join(target, name), content);
  files[name] = sha256(content);
}
writeFileSync(
  manifestPath,
  `${JSON.stringify({ commit, path: "src/client", files }, null, 2)}\n`,
);
console.log(`copied ${names.length} files from ${commit.slice(0, 7)}`);
