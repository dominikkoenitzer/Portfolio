// @ts-expect-error The app tsconfig has no Node types; vitest runs this file in Node.
import { readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { hasStory } from "./story-loader";

const files: string[] = readdirSync(new URL("./stories/", import.meta.url)).filter((f: string) =>
  f.endsWith(".ts"),
);
const tests = files.filter((f) => f.endsWith(".test.ts"));
const stories = files.filter((f) => !f.endsWith(".test.ts"));

describe("the stories the loader can fetch", () => {
  it("are the story modules", () => {
    expect(stories.length).toBeGreaterThan(0);
    for (const file of stories) expect(hasStory(file.slice(0, -3)), file).toBe(true);
  });

  it("leave out the test files beside them, so no build ships one", () => {
    expect(tests.length).toBeGreaterThan(0);
    for (const file of tests) expect(hasStory(file.slice(0, -3)), file).toBe(false);
  });
});
