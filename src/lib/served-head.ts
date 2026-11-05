// The tags <SEO> renders for itself, as the served document holds them before React runs.
const SERVED_TAGS = "title, meta[name], meta[property], link[rel='canonical'], script[data-route]";

const served = typeof document === "undefined" ? [] : [...document.head.querySelectorAll(SERVED_TAGS)];

const keyOf = (tag: Element) => {
  if (tag.tagName === "TITLE") return "<title>";
  if (tag.tagName === "LINK") return "canonical";
  return tag.getAttribute("name") ?? tag.getAttribute("property");
};

/** Removes each served tag the page has now rendered itself, so a head never holds two of one tag. */
export function dropServedHead() {
  const original = new Set(served);
  const rendered = new Set(
    [...document.head.querySelectorAll(SERVED_TAGS)].filter((tag) => !original.has(tag)).map(keyOf),
  );
  for (const tag of served.splice(0)) {
    if (tag.tagName === "SCRIPT" || rendered.has(keyOf(tag))) tag.remove();
  }
}
