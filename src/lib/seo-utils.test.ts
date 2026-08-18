import { describe, expect, it } from "vitest";

import { SITE_CONFIG } from "@/constants";
import { SUPPORTED_LANGUAGE_CODES } from "@/config/languages";
import {
  createBreadcrumbSchema,
  createFAQSchema,
  createHowToSchema,
  createSpeakableSchema,
  getOgLocale,
} from "./seo-utils";

describe("getOgLocale", () => {
  it("returns an Open Graph locale for every supported language", () => {
    for (const code of SUPPORTED_LANGUAGE_CODES) {
      // og:locale is underscored (en_US), not hyphenated like a BCP-47 tag.
      expect(getOgLocale(code), code).toMatch(/^[a-z]{2}_[A-Z]{2}$/);
    }
  });

  it("falls back to English for an unknown language", () => {
    expect(getOgLocale("xx" as never)).toBe("en_US");
  });
});

describe("createFAQSchema", () => {
  it("returns null rather than an empty FAQPage", () => {
    // An empty mainEntity is a structured-data error, so emitting nothing is
    // the correct output.
    expect(createFAQSchema([])).toBeNull();
    expect(createFAQSchema(undefined as never)).toBeNull();
  });

  it("maps questions and answers into schema.org shape", () => {
    const schema = createFAQSchema([
      { question: "Where are you based?", answer: "Zürich, Switzerland." },
    ]);

    expect(schema).toMatchObject({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Where are you based?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Zürich, Switzerland.",
          },
        },
      ],
    });
  });

  it("omits the citation key entirely when no citations are given", () => {
    const schema = createFAQSchema([{ question: "q", answer: "a" }]);
    const answer = schema?.mainEntity[0].acceptedAnswer as Record<
      string,
      unknown
    >;

    expect(answer).not.toHaveProperty("citation");
  });

  it("attaches citation URLs when they are given", () => {
    const schema = createFAQSchema(
      [{ question: "q", answer: "a" }],
      [{ name: "WISS", url: "https://www.wiss.ch" }],
    );
    const answer = schema?.mainEntity[0].acceptedAnswer as Record<
      string,
      unknown
    >;

    expect(answer.citation).toEqual(["https://www.wiss.ch"]);
  });
});

describe("createHowToSchema", () => {
  it("returns null for missing input", () => {
    expect(createHowToSchema(undefined as never)).toBeNull();
  });
});

describe("createBreadcrumbSchema", () => {
  it("returns null on the home page, which has no trail", () => {
    expect(createBreadcrumbSchema(SITE_CONFIG.url)).toBeNull();
    expect(createBreadcrumbSchema(`${SITE_CONFIG.url}/`)).toBeNull();
    expect(createBreadcrumbSchema("")).toBeNull();
  });

  it("returns null rather than throwing on a malformed URL", () => {
    expect(createBreadcrumbSchema("not a url")).toBeNull();
  });

  it("puts Home first and numbers positions from one", () => {
    const schema = createBreadcrumbSchema(`${SITE_CONFIG.url}/projects/zephyr`);
    const items = schema?.itemListElement ?? [];

    expect(items.map((item) => item.position)).toEqual([1, 2, 3]);
    expect(items[0]).toMatchObject({ name: "Home", item: SITE_CONFIG.url });
  });

  it("builds a cumulative URL for each crumb", () => {
    const schema = createBreadcrumbSchema(`${SITE_CONFIG.url}/projects/zephyr`);
    const items = schema?.itemListElement ?? [];

    expect(items.map((item) => item.item)).toEqual([
      SITE_CONFIG.url,
      `${SITE_CONFIG.url}/projects`,
      `${SITE_CONFIG.url}/projects/zephyr`,
    ]);
  });

  it("capitalises each segment for the visible label", () => {
    const schema = createBreadcrumbSchema(`${SITE_CONFIG.url}/projects`);
    expect(schema?.itemListElement[1].name).toBe("Projects");
  });
});

describe("createSpeakableSchema", () => {
  it("returns null when there is nothing to speak", () => {
    expect(createSpeakableSchema(SITE_CONFIG.url, [])).toBeNull();
    expect(createSpeakableSchema(SITE_CONFIG.url, undefined as never)).toBeNull();
  });

  it("carries the selectors through", () => {
    const schema = createSpeakableSchema(SITE_CONFIG.url, ["h1", ".lead"]);

    expect(schema).toMatchObject({
      "@type": "WebPage",
      url: SITE_CONFIG.url,
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", ".lead"],
      },
    });
  });
});
