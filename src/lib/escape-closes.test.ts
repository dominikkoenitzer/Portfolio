import { beforeEach, describe, expect, it } from "vitest";

import { escapeCloses } from "./escape-closes";
import { claim, isTopFor, release, reset } from "./overlay-stack";

const press = (key: string) => Object.assign(new Event("keydown"), { key });

describe("escapeCloses", () => {
  beforeEach(() => reset());

  it("closes the card when nothing lies over it", () => {
    const card = claim();
    expect(escapeCloses(press("Escape"), (e) => isTopFor(e, card))).toBe(true);
  });

  it("leaves the card open while the search lies over it", () => {
    const card = claim();
    claim();
    expect(escapeCloses(press("Escape"), (e) => isTopFor(e, card))).toBe(false);
  });

  it("leaves the card open when the search closed earlier on the same key", () => {
    const card = claim();
    const search = claim();
    const key = press("Escape");
    expect(escapeCloses(key, (e) => isTopFor(e, search))).toBe(true);
    release(search);
    expect(escapeCloses(key, (e) => isTopFor(e, card))).toBe(false);
    expect(escapeCloses(press("Escape"), (e) => isTopFor(e, card))).toBe(true);
  });

  it("ignores every other key", () => {
    const card = claim();
    expect(escapeCloses(press("Enter"), (e) => isTopFor(e, card))).toBe(false);
  });
});
