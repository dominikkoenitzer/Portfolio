import { describe, expect, it } from "vitest";

import { SITE_CONFIG } from "@/constants";

import {
  NOT_FOUND_DESCRIPTION,
  notFoundHead,
  notFoundTitle,
} from "../../scripts/head-meta";
import shell from "../../index.html?raw";

// The prerender step patches dist/index.html, which carries the same head as
// the source shell: Vite only adds script and link tags to it.
const html = notFoundHead(shell, SITE_CONFIG.name);
const title = notFoundTitle(SITE_CONFIG.name);

const metas: string[] = html.match(/<meta\b[^>]*>/gi) ?? [];

/** Every content="" carried by the <meta> tags with this name/property. */
const contentOf = (key: string): string[] =>
  metas
    .filter((tag) => new RegExp(`(?:name|property)="${key}"`).test(tag))
    .map((tag) => /content="([^"]*)"/.exec(tag)?.[1] ?? "");

describe("notFoundHead", () => {
  it("titles the page as not found", () => {
    expect(html).toContain(`<title>${title}</title>`);
    for (const key of ["title", "og:title", "twitter:title"]) {
      expect(contentOf(key), key).toEqual([title]);
    }
  });

  it("describes the page as not found on every card", () => {
    for (const key of ["description", "og:description", "twitter:description"]) {
      expect(contentOf(key), key).toEqual([NOT_FOUND_DESCRIPTION]);
    }
  });

  it("names the card by the page title, as <SEO> does", () => {
    for (const key of ["og:image:alt", "twitter:image:alt"]) {
      expect(contentOf(key), key).toEqual([title]);
    }
  });

  it("claims no URL, since it answers for every missing path", () => {
    for (const key of ["og:url", "twitter:url", "DC.identifier"]) {
      expect(contentOf(key), key).toEqual([]);
    }
    expect(metas.some((tag) => tag.includes(`content="${SITE_CONFIG.url}/"`))).toBe(
      false,
    );
  });

  it("keeps no home page title in any tag", () => {
    const homeTitle = /<title>([^<]*)<\/title>/.exec(shell)?.[1] ?? "";
    expect(homeTitle).not.toBe("");
    expect(metas.filter((tag) => tag.includes(homeTitle))).toEqual([]);
  });

  it("tells all three bots not to index or follow", () => {
    for (const key of ["robots", "googlebot", "bingbot"]) {
      expect(contentOf(key), key).toEqual(["noindex, nofollow"]);
    }
  });

  it("leaves the rest of the head alone", () => {
    expect(contentOf("og:image")).toEqual([`${SITE_CONFIG.url}/og-image.png`]);
    expect(html).toContain('<meta property="og:type" content="website">');
    expect(html).toContain('<div id="root"></div>');
  });
});
