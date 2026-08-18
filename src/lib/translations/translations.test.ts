import { describe, expect, it } from "vitest";

import { SUPPORTED_LANGUAGE_CODES } from "@/config/languages";
import { translations } from "./index";

/**
 * `satisfies Record<Language, Translation>` already makes a missing key fail
 * typecheck. What it cannot see is a translation that type-checks but is wrong
 * at runtime: an empty string, or a list that lost an item on the way into
 * another language, which renders as a short paragraph or a missing bullet
 * with nothing failing anywhere.
 */

type Node = unknown;

const walk = (
  node: Node,
  path: string,
  visit: (path: string, value: Node) => void,
): void => {
  visit(path, node);

  if (Array.isArray(node)) {
    node.forEach((item, index) => walk(item, `${path}[${index}]`, visit));
    return;
  }

  if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      walk(value, path ? `${path}.${key}` : key, visit);
    }
  }
};

const shapeOf = (root: Node) => {
  const shape = new Map<string, string>();
  walk(root, "", (path, value) => {
    if (!path) return;
    shape.set(
      path,
      Array.isArray(value) ? `array(${value.length})` : typeof value,
    );
  });
  return shape;
};

const leavesOf = (root: Node) => {
  const leaves: Array<[string, string]> = [];
  walk(root, "", (path, value) => {
    if (typeof value === "string") leaves.push([path, value]);
  });
  return leaves;
};

const OTHER_LANGUAGES = SUPPORTED_LANGUAGE_CODES.filter(
  (code) => code !== "en",
);

describe("translations", () => {
  it("ships every supported language", () => {
    expect(Object.keys(translations).sort()).toEqual(
      [...SUPPORTED_LANGUAGE_CODES].sort(),
    );
  });

  it.each(OTHER_LANGUAGES)("%s has the same shape as en", (code) => {
    const english = shapeOf(translations.en);
    const other = shapeOf(translations[code]);

    const missing = [...english.keys()].filter((key) => !other.has(key));
    const extra = [...other.keys()].filter((key) => !english.has(key));

    expect({ missing, extra }).toEqual({ missing: [], extra: [] });
  });

  it.each(OTHER_LANGUAGES)("%s has the same list lengths as en", (code) => {
    const english = shapeOf(translations.en);
    const other = shapeOf(translations[code]);

    const mismatched = [...english.entries()]
      .filter(([key, kind]) => kind.startsWith("array(") && other.get(key) !== kind)
      .map(([key, kind]) => `${key}: en ${kind}, ${code} ${other.get(key)}`);

    expect(mismatched).toEqual([]);
  });

  it.each(SUPPORTED_LANGUAGE_CODES)("%s has no blank copy", (code) => {
    const blank = leavesOf(translations[code])
      .filter(([, value]) => value.trim() === "")
      .map(([path]) => path);

    expect(blank).toEqual([]);
  });

  it.each(SUPPORTED_LANGUAGE_CODES)("%s has no leftover placeholders", (code) => {
    const placeholders = leavesOf(translations[code])
      .filter(([, value]) => /\bTODO\b|\bTBD\b|\bFIXME\b|^\.\.\.$|\bLorem ipsum\b/i.test(value))
      .map(([path]) => path);

    expect(placeholders).toEqual([]);
  });

  it.each(OTHER_LANGUAGES)("%s is actually translated, not copied en", (code) => {
    const english = new Map(leavesOf(translations.en));
    const identical = leavesOf(translations[code]).filter(
      ([path, value]) => english.get(path) === value,
    );

    // Proper nouns, URLs and short labels legitimately match ("GitHub",
    // "Zürich"), so this is a floor on how much genuinely differs rather than a
    // demand that every leaf differ.
    expect(identical.length / english.size).toBeLessThan(0.5);
  });
});
