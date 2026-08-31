import { describe, expect, it } from "vitest";

import { de } from "./de";
import { isTranslationLoaded, loadTranslation, translations } from "./index";

describe("lazy translations", () => {
  it("ships English and nothing else in the entry", () => {
    expect(isTranslationLoaded("en")).toBe(true);
    expect(translations.en.nav).toBeDefined();
  });

  it("loads a language once and stores it where components read it", async () => {
    expect(isTranslationLoaded("de")).toBe(false);
    const first = loadTranslation("de");
    const second = loadTranslation("de");
    expect(second).toBe(first);
    await first;
    expect(isTranslationLoaded("de")).toBe(true);
    expect(translations.de).toBe(de);
    await expect(loadTranslation("de")).resolves.toBeUndefined();
  });
});
