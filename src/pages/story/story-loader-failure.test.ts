import { describe, expect, it, vi } from "vitest";

const attempts = vi.hoisted(() => ({ time: 0 }));

// The first fetch of the story chunk fails the way a dropped network request
// or a chunk from an older deploy does; the second succeeds.
vi.mock("./stories/time", async (importOriginal) => {
  attempts.time += 1;
  if (attempts.time === 1) throw new Error("Failed to fetch dynamically imported module");
  return importOriginal<typeof import("./stories/time")>();
});

import { loadStory, storyNow } from "./story-loader";

describe("a story that fails to load", () => {
  it("shows the page without it, then loads on the next visit", async () => {
    await expect(loadStory("time")).resolves.toBeNull();
    expect(storyNow("time")).toBeUndefined();
    const story = await loadStory("time");
    expect(story?.lead).toMatch(/web clock/);
    expect(storyNow("time")).toBe(story);
    expect(attempts.time).toBe(2);
  });
});
