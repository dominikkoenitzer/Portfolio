// @ts-expect-error The app tsconfig has no Node types; vitest runs this file in Node.
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Code, Story } from "../types";

const stories = import.meta.glob<{ story: Story }>("./*.ts", { eager: true });

const isTrim = (line: string) => line === "…" || line === "// …";

/** The quote's lines that the source no longer has, in the quote's order. */
function missingLines(quote: string, source: string): string[] {
  const lines = source.split(/\r?\n/).map((l) => l.trim());
  const missing: string[] = [];
  let at = 0;
  for (const raw of quote.split("\n")) {
    const line = raw.trim();
    if (line === "" || isTrim(line)) continue;
    const found = lines.indexOf(line, at);
    if (found === -1) missing.push(line);
    else at = found + 1;
  }
  return missing;
}

const quotes: { story: string; code: Code }[] = Object.entries(stories).flatMap(([path, module]) =>
  module.story.sections.flatMap((section) =>
    section.blocks.flatMap((block) =>
      typeof block === "object" && "code" in block ? [{ story: path, code: block.code }] : [],
    ),
  ),
);

const inRepo = (file: string) => new URL(`../../../../${file}`, import.meta.url);

const local = quotes.filter(({ code }) => existsSync(inRepo(code.file)));

describe("story code quotes", () => {
  it("checks at least the quote from this repository", () => {
    expect(local.map((q) => q.code.file)).toContain("scripts/prerender.ts");
  });

  it.each(local.map((q) => [q.story, q.code.file, q.code] as const))(
    "%s quotes %s as it is",
    (_story, file, code) => {
      expect(missingLines(code.text, readFileSync(inRepo(file), "utf8"))).toEqual([]);
    },
  );
});
