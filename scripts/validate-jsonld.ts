/**
 * CI guard: validate the JSON-LD structured data baked into index.html.
 *
 * Structured data is this site's primary lever for Google rich results and AI
 * answer engines, but typecheck/build never parse the inline <script
 * type="application/ld+json"> blocks — a stray comma or unescaped character
 * ships to prod and silently disqualifies the page. This parses every block
 * and asserts the minimum shape (@context + @type), failing the build on any
 * malformed graph.
 */
import { readFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const blocks = [
  ...html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
  ),
].map((m) => m[1]);

if (blocks.length === 0) {
  console.error("✗ No JSON-LD blocks found in index.html");
  process.exit(1);
}

let ok = true;
const types: string[] = [];

blocks.forEach((raw, i) => {
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(raw) as Record<string, unknown>;
  } catch (err) {
    ok = false;
    console.error(`✗ Block ${i + 1}: invalid JSON — ${(err as Error).message}`);
    return;
  }
  if (!data["@context"] || !data["@type"]) {
    ok = false;
    console.error(`✗ Block ${i + 1}: missing @context or @type`);
    return;
  }
  types.push(String(data["@type"]));
});

if (!ok) {
  process.exit(1);
}

console.log(`✓ ${blocks.length} JSON-LD blocks valid (${types.join(", ")})`);
