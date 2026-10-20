/**
 * Head patching for the prerender step, kept apart from `prerender.ts` so it
 * can be tested without a build: that script reads `dist/` and writes files
 * the moment it is imported.
 */

export const esc = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** The first <meta> carrying this name/property. [^>] matches newlines too,
 *  so multi-line meta tags are handled. */
const metaTag = (key: string, leadingSpace = ""): RegExp =>
  new RegExp(
    `${leadingSpace}<meta\\b(?=[^>]*(?:name|property)="${key}")[^>]*>`,
    "i",
  );

/** Replace the content="" of the <meta> carrying this name/property. */
export const setMeta = (html: string, key: string, value: string): string =>
  html.replace(metaTag(key), (tag) =>
    /content="/.test(tag)
      ? tag.replace(/content="[^"]*"/, `content="${esc(value)}"`)
      : tag,
  );

/** Drop the <meta> carrying this name/property, with the indent before it. */
export const removeMeta = (html: string, key: string): string =>
  html.replace(metaTag(key, "[ \\t]*\\r?\\n?[ \\t]*"), "");

export const NOT_FOUND_DESCRIPTION = "This page does not exist.";

export const notFoundTitle = (siteName: string): string =>
  `Page not found | ${siteName}`;

/**
 * Pages that exist but are kept out of search: no sitemap entry, noindex in
 * every bot tag. Read by the prerender step and the sitemap check, so a route
 * listed here gets its own unlisted document and is not expected in the
 * sitemap. The title and description match what the page's <SEO> writes in
 * English.
 */
export const UNLISTED_ROUTES = {
  "/diag": {
    title: "Diagnostics",
    description: "A measurement page for this site. Not listed.",
  },
} as const;

/**
 * The head of a page kept out of search, from the home document's shell:
 * everything in it that describes the home page is rewritten or dropped, and
 * the tags that name a URL are removed rather than pointed at home.
 */
export const unlistedHead = (
  shell: string,
  title: string,
  description: string,
): string => {
  let html = shell.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${esc(title)}</title>`,
  );
  for (const [k, v] of [
    ["description", description],
    ["title", title],
    ["og:title", title],
    ["og:description", description],
    ["og:image:alt", title],
    ["twitter:title", title],
    ["twitter:description", description],
    ["twitter:image:alt", title],
    ["robots", "noindex, nofollow"],
    ["googlebot", "noindex, nofollow"],
    ["bingbot", "noindex, nofollow"],
  ] as const) {
    html = setMeta(html, k, v);
  }
  for (const k of ["og:url", "twitter:url", "DC.identifier"]) {
    html = removeMeta(html, k);
  }
  return html;
};

/**
 * The head of 404.html. The page has no URL of its own (it answers for every
 * path that has no file), so it is an unlisted head under the not-found title.
 */
export const notFoundHead = (shell: string, siteName: string): string =>
  unlistedHead(shell, notFoundTitle(siteName), NOT_FOUND_DESCRIPTION);
