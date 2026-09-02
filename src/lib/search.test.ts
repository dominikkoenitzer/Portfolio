import { describe, expect, it } from "vitest";

import {
  groupHits,
  normalizeText,
  type SearchRecord,
  searchRecords,
  tokenizeQuery,
  withinOneEdit,
} from "./search";

const record = (
  id: string,
  fields: Partial<SearchRecord> & Pick<SearchRecord, "title">,
): SearchRecord => ({
  id,
  kind: "page",
  context: "",
  href: `/${id}`,
  ...fields,
});

const titles = (records: readonly SearchRecord[], query: string): string[] =>
  searchRecords(records, query).map((hit) => hit.record.title);

describe("normalizeText", () => {
  it("folds case, accents and the sharp s", () => {
    expect(normalizeText("Zürich")).toBe("zurich");
    expect(normalizeText("Könitzer")).toBe("konitzer");
    expect(normalizeText("Développeur")).toBe("developpeur");
    expect(normalizeText("Straße")).toBe("strasse");
  });

  it("leaves Chinese alone", () => {
    expect(normalizeText("网站维护")).toBe("网站维护");
  });
});

describe("tokenizeQuery", () => {
  it("splits on spaces and punctuation", () => {
    expect(tokenizeQuery("  react,  typescript ")).toEqual([
      "react",
      "typescript",
    ]);
  });

  it("keeps the characters that are part of a language's name", () => {
    expect(tokenizeQuery("C++")).toEqual(["c++"]);
    expect(tokenizeQuery("C#")).toEqual(["c#"]);
  });

  it("keeps a Chinese run whole instead of dropping or shredding it", () => {
    // Splitting on spaces alone would be harmless here, but a token filter
    // written as [a-z0-9] would erase the query entirely and a per-character
    // split would make every record with those glyphs anywhere a match.
    expect(tokenizeQuery("网站维护")).toEqual(["网站维护"]);
    expect(tokenizeQuery("网站维护 SEO")).toEqual(["网站维护", "seo"]);
  });

  it("has nothing to say about an empty query", () => {
    expect(tokenizeQuery("")).toEqual([]);
    expect(tokenizeQuery("   ")).toEqual([]);
  });
});

describe("searchRecords", () => {
  const index: SearchRecord[] = [
    record("experience", {
      kind: "experience",
      title: "Computer Scientist EFZ",
      context: "WISS · Aug 2023 – Present",
      keywords: ["Zürich, Switzerland", "Databases"],
    }),
    record("portfolio", {
      kind: "project",
      title: "Portfolio",
      context: "This website.",
      keywords: ["React", "TypeScript", "2025"],
      body: ["A React portfolio built with Vite and Tailwind CSS."],
    }),
    record("support", {
      kind: "service",
      title: "Technical Support",
      context: "Help when something breaks.",
      keywords: ["Bug fixes", "React"],
    }),
    record("maintenance", {
      kind: "service",
      title: "网站维护",
      context: "每月修补和更新。",
      keywords: ["安全更新"],
    }),
    record("about", {
      title: "About",
      context: "Dominik Könitzer, a software engineer in Zürich.",
    }),
  ];

  it("finds accented copy from an unaccented query", () => {
    expect(titles(index, "zurich")).toContain("About");
    expect(titles(index, "konitzer")).toEqual(["About"]);
  });

  it("prefers the records that match every token", () => {
    expect(titles(index, "react portfolio")).toEqual(["Portfolio"]);
  });

  it("falls back to partial matches only when nothing matches everything", () => {
    // "support" and "vite" are both in the index, but no single record carries
    // both, so the second pass offers what does match rather than nothing.
    const partial = titles(index, "support vite");
    expect(partial).toContain("Technical Support");
    expect(partial).toContain("Portfolio");
    // A record that matches every token is never mixed in with partial ones.
    expect(titles(index, "react portfolio")).toEqual(["Portfolio"]);
  });

  it("ranks by where the match landed: title, then keywords, then prose", () => {
    // "react" is the title of nothing, a keyword of two records and prose in
    // one. Portfolio wins over Technical Support on keyword position.
    expect(titles(index, "react")).toEqual(["Portfolio", "Technical Support"]);

    const byField = [
      record("body-hit", { title: "Alpha", context: "A note about widgets." }),
      record("title-hit", { title: "Widgets" }),
      record("keyword-hit", { title: "Beta", keywords: ["widgets"] }),
    ];
    expect(titles(byField, "widgets")).toEqual(["Widgets", "Beta", "Alpha"]);
  });

  it("prefers a title that starts with the query", () => {
    const rows = [
      record("late", { title: "Technical Support" }),
      record("early", { title: "Support Plan" }),
    ];
    expect(titles(rows, "support")).toEqual(["Support Plan", "Technical Support"]);
  });

  it("matches a Chinese query with no word spaces", () => {
    expect(titles(index, "网站维护")).toEqual(["网站维护"]);
    expect(titles(index, "安全更新")).toEqual(["网站维护"]);
  });

  it("returns nothing for an empty query", () => {
    expect(searchRecords(index, "")).toEqual([]);
    expect(searchRecords(index, "   ")).toEqual([]);
  });

  it("returns nothing when nothing matches", () => {
    expect(searchRecords(index, "kubernetes")).toEqual([]);
  });
});

describe("groupHits", () => {
  const many = (kind: SearchRecord["kind"], count: number): SearchRecord[] =>
    Array.from({ length: count }, (_, i) =>
      record(`${kind}-${i}`, { kind, title: `Widget ${kind} ${i}` }),
    );

  const index = [...many("project", 6), ...many("service", 6)];

  it("caps each group and the whole list", () => {
    const groups = groupHits(searchRecords(index, "widget"), {
      perGroup: 2,
      total: 3,
    });
    expect(groups.flatMap((group) => group.hits)).toHaveLength(3);
    for (const group of groups) {
      expect(group.hits.length).toBeLessThanOrEqual(2);
    }
  });

  it("puts the group holding the best hit first", () => {
    const rows = [
      record("a", { kind: "page", title: "Contact", context: "widgets" }),
      record("b", { kind: "project", title: "Widgets" }),
    ];
    const groups = groupHits(searchRecords(rows, "widgets"));
    expect(groups.map((group) => group.kind)).toEqual(["project", "page"]);
  });

  it("has no empty groups", () => {
    const groups = groupHits(searchRecords(index, "widget"));
    expect(groups.every((group) => group.hits.length > 0)).toBe(true);
  });
});

describe("withinOneEdit", () => {
  it("accepts a transposition, the typo people actually make", () => {
    expect(withinOneEdit("prjoects", "projects")).toBe(true);
    expect(withinOneEdit("sevrices", "services")).toBe(true);
  });

  it("accepts one insertion, deletion or substitution", () => {
    expect(withinOneEdit("prjects", "projects")).toBe(true);
    expect(withinOneEdit("projectss", "projects")).toBe(true);
    expect(withinOneEdit("prosects", "projects")).toBe(true);
    expect(withinOneEdit("projects", "projects")).toBe(true);
  });

  it("rejects two edits or a length gap", () => {
    expect(withinOneEdit("prjoetcs", "projects")).toBe(false);
    expect(withinOneEdit("prjcts", "projects")).toBe(false);
    expect(withinOneEdit("zephyr", "spectrum")).toBe(false);
  });
});

describe("synonyms", () => {
  const index: SearchRecord[] = [
    record("colors", { title: "Color tokens" }),
    record("cv", { kind: "page", title: "View CV", href: "/about" }),
    record("maintenance", {
      kind: "service",
      title: "Website Maintenance",
      context: "50 CHF per month, monthly patching.",
    }),
    record("faq-price", {
      kind: "faq",
      title: "How much does website maintenance cost?",
      context: "50 CHF per month.",
    }),
    record("contact", {
      kind: "page",
      title: "Contact",
      context: "Send me a message.",
    }),
  ];

  it("finds the British spelling from the American one and back", () => {
    expect(titles(index, "colour")).toEqual(["Color tokens"]);
    expect(titles(index, "color")).toEqual(["Color tokens"]);
  });

  it("finds the CV from the word a recruiter types", () => {
    for (const query of ["cv", "resume", "lebenslauf"]) {
      expect(titles(index, query)).toEqual(["View CV"]);
    }
  });

  it("finds the priced records from a word the copy never uses", () => {
    const hits = titles(index, "rates");
    expect(hits).toContain("How much does website maintenance cost?");
    expect(hits).toContain("Website Maintenance");
  });

  it("ranks an exact match above a synonym", () => {
    // "cost" is in the FAQ title verbatim; "Website Maintenance" only reaches
    // it through the price group.
    expect(titles(index, "cost")[0]).toBe(
      "How much does website maintenance cost?",
    );
  });

  it("answers a whole question by the rarest word in it", () => {
    expect(titles(index, "what do you charge")[0]).toBe(
      "How much does website maintenance cost?",
    );
  });

  it("survives a typo, but only on the fallback pass", () => {
    const index2: SearchRecord[] = [
      record("projects", { kind: "page", title: "Projects" }),
      record("project-note", {
        kind: "faq",
        title: "Anything else?",
        context: "A note that says projects.",
      }),
    ];
    // Exact substring wins outright, so the typo pass never runs.
    expect(titles(index2, "projects")).toEqual([
      "Projects",
      "Anything else?",
    ]);
    // One edit away, and only the high-signal fields are searched, so the
    // page's title matches and the prose mention does not.
    expect(titles(index2, "prjects")).toEqual(["Projects"]);
    // Too short to guess at.
    expect(titles(index2, "prj")).toEqual([]);
  });
});
