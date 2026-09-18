import { beforeEach, describe, expect, it } from "vitest";

import { claim, depth, isTop, isTopFor, release, reset } from "./overlay-stack";

describe("overlay stack", () => {
  beforeEach(() => reset());

  it("hands the top to the overlay that opened last", () => {
    const first = claim();
    const second = claim();
    expect(isTop(second)).toBe(true);
    expect(isTop(first)).toBe(false);
  });

  it("gives it back when the top closes", () => {
    const first = claim();
    const second = claim();
    release(second);
    expect(isTop(first)).toBe(true);
    expect(depth()).toBe(1);
  });

  it("survives an overlay closing out of order", () => {
    const first = claim();
    const second = claim();
    release(first);
    expect(isTop(second)).toBe(true);
    expect(depth()).toBe(1);
  });

  it("ignores a release it has already seen", () => {
    const only = claim();
    release(only);
    release(only);
    expect(depth()).toBe(0);
    expect(isTop(only)).toBe(false);
  });

  it("never calls a closed overlay the top one", () => {
    expect(isTop(null)).toBe(false);
  });

  /*
   * The case this module exists for: two overlays answer the same keypress, and
   * the first one to act unmounts and releases its layer before the second one
   * asks. Both used to believe they were in front.
   */
  it("keeps one answer for the whole event", () => {
    const behind = claim();
    const inFront = claim();
    const keypress = new Event("keydown");

    expect(isTopFor(keypress, inFront)).toBe(true);
    // the overlay in front closes itself, exactly as it would in a handler
    release(inFront);
    expect(isTopFor(keypress, behind)).toBe(false);

    // a later keypress sees the new truth
    const next = new Event("keydown");
    expect(isTopFor(next, behind)).toBe(true);
  });

  it("answers the bottom overlay when it is the only one", () => {
    const only = claim();
    const keypress = new Event("keydown");
    expect(isTopFor(keypress, only)).toBe(true);
  });
});
