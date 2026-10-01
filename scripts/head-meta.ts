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
 * The head of 404.html: the shell is the home document, so everything in it
 * that describes the home page has to be rewritten or dropped. The page has no
 * URL of its own (it answers for every path that has no file), so the tags
 * that name one are removed rather than pointed at home.
 */
export const notFoundHead = (shell: string, siteName: string): string => {
  const title = notFoundTitle(siteName);
  let html = shell.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${esc(title)}</title>`,
  );
  for (const [k, v] of [
    ["description", NOT_FOUND_DESCRIPTION],
    ["title", title],
    ["og:title", title],
    ["og:description", NOT_FOUND_DESCRIPTION],
    ["og:image:alt", title],
    ["twitter:title", title],
    ["twitter:description", NOT_FOUND_DESCRIPTION],
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
