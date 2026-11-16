import { describe, expect, it } from "vitest";

import { fillTemplate } from "./fill-template";
import { searchStatus } from "./search-status";
import { de } from "./translations/de";
import { en } from "./translations/en";
import { fr } from "./translations/fr";
import { zh } from "./translations/zh";

const copies = { en, de, fr, zh };

describe("searchStatus", () => {
  it("reads the no-match sentence with the query, not the suggestions", () => {
    expect(searchStatus(en.search, "zzzz", 5, true)).toBe(
      "No results for “zzzz”",
    );
    for (const [code, t] of Object.entries(copies)) {
      const status = searchStatus(t.search, "zzzz", 5, true);
      expect(status, code).toContain("zzzz");
      const count = fillTemplate(t.search.results, "count", "5");
      expect(status, code).not.toBe(count);
    }
  });

  it("counts the suggestions when nothing is typed", () => {
    expect(searchStatus(en.search, "", 5, true)).toBe("5 results");
  });

  it("counts real hits", () => {
    expect(searchStatus(en.search, "rust", 3, false)).toBe("3 results");
    expect(searchStatus(en.search, "rust", 1, false)).toBe(en.search.resultsOne);
  });

  it("echoes dollar sequences in the query as typed", () => {
    expect(searchStatus(en.search, "a$$b", 5, true)).toBe(
      "No results for “a$$b”",
    );
    expect(searchStatus(en.search, "$&", 5, true)).toBe("No results for “$&”");
  });
});

describe("fillTemplate", () => {
  it("puts the value in as typed", () => {
    const template = en.projects.noResultsQuery;
    expect(fillTemplate(template, "query", "a$$b")).toBe("Searched for “a$$b”");
    expect(fillTemplate(template, "query", "$&")).toBe("Searched for “$&”");
    expect(fillTemplate(template, "query", "$`$'")).toBe("Searched for “$`$'”");
  });
});
