/**
 * CI guard: validate the JSON-LD baked into the prerendered homepage.
 *
 * Structured data is this site's primary lever for Google rich results and AI
 * answer engines. This parses every inline <script type="application/ld+json">
 * block in the prerendered build/client/index.html (site-wide graphs from
 * root.tsx + per-route graphs injected by <SEO>) and asserts the minimum shape
 * (@context + @type), failing the build on any malformed graph. Runs after the
 * build so it validates the actual shipped output.
 */
import { readFileSync } from "node:fs";

const html = readFileSync("build/client/index.html", "utf8");
const blocks = [
  ...html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
  ),
].map((m) => m[1]);

if (blocks.length === 0) {
  console.error(
    "✗ No JSON-LD blocks found in build/client/index.html (did the build run first?)"
  );
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
