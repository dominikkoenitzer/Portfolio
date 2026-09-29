import { describe, expect, it, vi } from "vitest";

const attempts = vi.hoisted(() => ({ zh: 0 }));

// The first fetch of the Chinese module fails the way a dropped network
// request or a chunk from an older deploy does; the second succeeds.
vi.mock("./zh", async (importOriginal) => {
  const real = await importOriginal<typeof import("./zh")>();
  return {
    get zh() {
      attempts.zh += 1;
      if (attempts.zh === 1) throw new Error("Failed to fetch dynamically imported module");
      return real.zh;
    },
  };
});

import { isTranslationLoaded, loadTranslation } from "./index";

describe("a language that fails to load", () => {
  it("can be loaded again once the failure has passed", async () => {
    await expect(loadTranslation("zh")).rejects.toThrow();
    expect(isTranslationLoaded("zh")).toBe(false);
    await expect(loadTranslation("zh")).resolves.toBeUndefined();
    expect(isTranslationLoaded("zh")).toBe(true);
  });
});
