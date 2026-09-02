/**
 * Relevance, against the real index rather than fixtures.
 *
 * `search.test.ts` covers the matcher's mechanics on hand-built records. This
 * file covers the thing a visitor actually experiences: type a word, get the
 * right row first. Every case here comes from a 305-query study across the four
 * languages, and each one failed at the time it was written, so this doubles as
 * the record of what was wrong.
 *
 * These assertions are deliberately about the FIRST row, because the first row
 * is what Enter opens.
 */
import { describe, expect, it } from "vitest";

import { buildSearchIndex } from "@/components/search/search-index";
import { de } from "@/lib/translations/de";
import { en } from "@/lib/translations/en";
import { fr } from "@/lib/translations/fr";
import { zh } from "@/lib/translations/zh";
import { searchRecords } from "./search";

const INDEX = {
  en: buildSearchIndex("en", en),
  de: buildSearchIndex("de", de),
  fr: buildSearchIndex("fr", fr),
  zh: buildSearchIndex("zh", zh),
};

type Lang = keyof typeof INDEX;

const top = (lang: Lang, query: string) =>
  searchRecords(INDEX[lang], query)[0]?.record;

const count = (lang: Lang, query: string) =>
  searchRecords(INDEX[lang], query).length;

/** The href of the first row, which is where Enter would take the visitor. */
const lands = (lang: Lang, query: string) => top(lang, query)?.href;

describe("the index covers what the site actually renders", () => {
  it("has a record per language for the privacy policy", () => {
    for (const lang of Object.keys(INDEX) as Lang[]) {
      expect(
        INDEX[lang].some((record) => record.href === "/privacy"),
        `${lang} is missing the privacy page`,
      ).toBe(true);
    }
  });

  it("indexes the process steps rendered on the services page", () => {
    expect(INDEX.en.some((record) => record.id === "service:process")).toBe(
      true,
    );
  });
});

describe("a visitor finds a page by what they call it", () => {
  it.each([
    ["en", "privacy", "/privacy"],
    ["en", "cookies", "/privacy"],
    ["de", "datenschutz", "/privacy"],
    ["fr", "confidentialite", "/privacy"],
    ["zh", "隐私", "/privacy"],
    // The page is Tip Jar, Trinkgeld, Cagnotte and 打赏, so only the path
    // carries the word a visitor half-remembers from a link.
    ["en", "donate", "/donate"],
    ["de", "donate", "/donate"],
    // Localized nav labels: Werdegang, Parcours, 履历.
    ["de", "erfahrung", "/experience"],
    ["fr", "experience", "/experience"],
    ["zh", "经验", "/experience"],
    ["de", "fahigkeiten", "/skills"],
  ] as const)("%s: %s lands on %s", (lang, query, href) => {
    expect(lands(lang, query)).toBe(href);
  });

  it("reaches a name written without its umlaut", () => {
    expect(count("en", "koenitzer")).toBeGreaterThan(0);
  });
});

describe("intent, not vocabulary", () => {
  it("answers a question about money with the pricing question", () => {
    // "what do you charge" used to answer with the only record holding all of
    // what, do and you, which was the wrong question entirely.
    const hit = top("en", "what do you charge");
    expect(hit?.kind).toBe("faq");
    expect(hit?.title.toLowerCase()).toContain("cost");
  });

  it.each([
    ["de", "preis"],
    ["fr", "tarif"],
    ["zh", "价格"],
  ] as const)("%s: %s finds a question about cost", (lang, query) => {
    expect(top(lang, query)?.kind).toBe("faq");
  });

  it("sends hiring and process words somewhere that helps", () => {
    // Contact is as good an answer as Services for "hire", and better than the
    // nothing it used to return; the process steps are the answer for the
    // question about how the work runs.
    expect(["/contact", "/services"]).toContain(lands("en", "hire"));
    expect(lands("en", "process")).toBe("/services");
  });

  it("sends contact words to the contact page", () => {
    expect(lands("en", "email")).toBe("/contact");
    expect(lands("en", "job")).toBe("/contact");
  });

  it("puts the CV first and keeps school entries out of the top rows", () => {
    const hits = searchRecords(INDEX.en, "cv").slice(0, 3);
    expect(hits[0]?.record.href).toBe("/about");
    // "curriculum" also appears in the tag "International Curriculum" on two
    // school entries, which is why it is not a synonym for a CV any more.
    expect(hits.some((hit) => hit.record.kind === "experience")).toBe(false);
  });
});

describe("the words are not always the words in the copy", () => {
  it.each([
    // The tagline says "A to-do list and a focus timer".
    ["to do list", "Zephyr"],
    ["todo", "Zephyr"],
    // The tagline says "VS Code, minus the parts that talk back".
    ["vscode", "Remnants"],
    ["vs code", "Remnants"],
    ["password generator", "Entropy"],
  ] as const)("%s finds %s", (query, title) => {
    expect(top("en", query)?.title).toBe(title);
  });

  it.each([
    ["spectrm", "Spectrum"],
    ["prjoects", "Projects"],
    ["oxidise", "Oxidize"],
  ] as const)("survives the typo in %s", (query, title) => {
    expect(top("en", query)?.title).toBe(title);
  });

  it("retreats to the head of a Chinese compound", () => {
    // One token that has to appear contiguously, so the compound never matched
    // while its head did.
    expect(lands("zh", "联系方式")).toBe("/contact");
    expect(top("zh", "密码生成器")?.title).toBe("Entropy");
  });
});

describe("it says nothing rather than something wrong", () => {
  it.each([
    "zzzz-nothing-here",
    "the quick brown fox jumps over the lazy dog and keeps on running",
    "asdfghjkl qwertyuiop",
  ])("returns nothing for %s", (query) => {
    expect(count("en", query)).toBe(0);
  });

  it("still answers a single mistyped word", () => {
    // The floor above must not take the typo pass with it: one word is the
    // shape the typo pass exists for.
    expect(count("en", "prjects")).toBeGreaterThan(0);
  });

  it("never throws, whatever is typed", () => {
    for (const query of [
      "",
      "   ",
      "a(b",
      ".*",
      "[",
      "\\",
      "###",
      "a".repeat(2000),
      "联系".repeat(200),
      "🙂",
    ]) {
      expect(() => searchRecords(INDEX.en, query)).not.toThrow();
    }
  });
});

describe("the obvious queries stay obvious", () => {
  it.each([
    ["spectrum", "Spectrum"],
    ["time", "Time"],
    ["zephyr", "Zephyr"],
    ["entropy", "Entropy"],
  ] as const)("%s is still the first row", (query, title) => {
    expect(top("en", query)?.title).toBe(title);
  });

  it("keeps a technology query on the technology", () => {
    expect(top("en", "rust")?.kind).toBe("skill");
  });
});
