import { beforeEach, describe, expect, it } from "vitest";

import {
  clampOffset,
  clearOffsets,
  recallOffset,
  rememberOffset,
  targetOffsetFor,
} from "./scroll-memory";

beforeEach(() => {
  clearOffsets();
});

describe("rememberOffset / recallOffset", () => {
  it("round-trips an offset for a history key", () => {
    rememberOffset("k1", 3000);
    expect(recallOffset("k1")).toBe(3000);
  });

  it("answers zero for an entry it has never seen", () => {
    // A forward navigation into an entry created before a reload.
    expect(recallOffset("never-visited")).toBe(0);
  });

  it("rounds and floors what it stores", () => {
    rememberOffset("k1", 2999.6);
    expect(recallOffset("k1")).toBe(3000);
    rememberOffset("k2", -40);
    expect(recallOffset("k2")).toBe(0);
    rememberOffset("k3", Number.NaN);
    expect(recallOffset("k3")).toBe(0);
  });

  it("overwrites the entry rather than keeping the first value", () => {
    rememberOffset("k1", 100);
    rememberOffset("k1", 900);
    expect(recallOffset("k1")).toBe(900);
  });

  it("ignores an empty key", () => {
    rememberOffset("", 500);
    expect(recallOffset("")).toBe(0);
  });

  it("evicts the least recently touched entry past the cap", () => {
    for (let i = 0; i < 60; i += 1) {
      rememberOffset(`k${i}`, i + 1);
    }
    // The first ten are gone, the last fifty are still there.
    expect(recallOffset("k0")).toBe(0);
    expect(recallOffset("k9")).toBe(0);
    expect(recallOffset("k10")).toBe(11);
    expect(recallOffset("k59")).toBe(60);
  });

  it("keeps an entry alive when it is re-written", () => {
    rememberOffset("keep", 42);
    for (let i = 0; i < 49; i += 1) {
      rememberOffset(`k${i}`, i);
      rememberOffset("keep", 42);
    }
    expect(recallOffset("keep")).toBe(42);
  });
});

describe("targetOffsetFor", () => {
  it("returns the remembered offset for back and forward", () => {
    rememberOffset("k1", 3000);
    expect(targetOffsetFor("POP", "k1")).toBe(3000);
  });

  it("lands a fresh navigation at the top", () => {
    rememberOffset("k1", 3000);
    expect(targetOffsetFor("PUSH", "k1")).toBe(0);
  });

  it("leaves the page alone on a replace", () => {
    // The projects toolbar writes its filters to the URL with replace, so a
    // keystroke must not scroll anything.
    rememberOffset("k1", 3000);
    expect(targetOffsetFor("REPLACE", "k1")).toBeNull();
  });

  it("lands at the top on a back into an entry it never recorded", () => {
    expect(targetOffsetFor("POP", "unknown")).toBe(0);
  });
});

describe("clampOffset", () => {
  it("passes an offset the document can hold", () => {
    expect(clampOffset(3000, 4400)).toBe(3000);
  });

  it("clamps to what the document can scroll", () => {
    // Back into a filtered list that is now two cards long.
    expect(clampOffset(3000, 800)).toBe(800);
  });

  it("answers zero for a document that cannot scroll", () => {
    expect(clampOffset(3000, 0)).toBe(0);
    expect(clampOffset(3000, -120)).toBe(0);
  });

  it("answers zero for a non-offset", () => {
    expect(clampOffset(0, 4400)).toBe(0);
    expect(clampOffset(-10, 4400)).toBe(0);
    expect(clampOffset(Number.NaN, 4400)).toBe(0);
    expect(clampOffset(500, Number.NaN)).toBe(0);
  });
});
