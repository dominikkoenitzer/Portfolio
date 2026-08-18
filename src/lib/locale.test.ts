import { describe, expect, it } from "vitest";

import { SUPPORTED_LANGUAGE_CODES } from "@/config/languages";
import { DATE_FNS_LOCALE, LOCALE_TAG } from "./locale";

/**
 * Adding a language to `LANGUAGES` without adding it here is a runtime
 * `undefined` deep inside a date formatter, which surfaces as a crashed page
 * rather than an English fallback. These keep the three lists in step.
 */
describe("locale maps", () => {
  it("has a BCP-47 tag for every supported language", () => {
    for (const code of SUPPORTED_LANGUAGE_CODES) {
      expect(LOCALE_TAG[code], code).toBeTruthy();
    }
  });

  it("has a date-fns locale for every supported language", () => {
    for (const code of SUPPORTED_LANGUAGE_CODES) {
      expect(DATE_FNS_LOCALE[code], code).toBeDefined();
    }
  });

  it("carries no entries for languages the app does not offer", () => {
    expect(Object.keys(LOCALE_TAG).sort()).toEqual(
      [...SUPPORTED_LANGUAGE_CODES].sort(),
    );
    expect(Object.keys(DATE_FNS_LOCALE).sort()).toEqual(
      [...SUPPORTED_LANGUAGE_CODES].sort(),
    );
  });

  it("emits tags Intl actually accepts", () => {
    for (const code of SUPPORTED_LANGUAGE_CODES) {
      const tag = LOCALE_TAG[code];
      expect(() => new Intl.DateTimeFormat(tag), tag).not.toThrow();
      expect(Intl.DateTimeFormat.supportedLocalesOf(tag), tag).toContain(tag);
    }
  });

  it("formats a date differently per language", () => {
    // A cheap guard against every tag quietly resolving to the same locale.
    const date = new Date("2024-12-01T00:00:00Z");
    const rendered = SUPPORTED_LANGUAGE_CODES.map((code) =>
      new Intl.DateTimeFormat(LOCALE_TAG[code], {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(date),
    );

    expect(new Set(rendered).size).toBeGreaterThan(1);
  });
});
