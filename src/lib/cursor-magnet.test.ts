import { describe, expect, it } from "vitest";

import { VIEWPORT_COVER_RATIO, coversViewport } from "./cursor-magnet";

/**
 * The regression this file exists for: on 2026-09-20 the CV preview's
 * click-to-dismiss backdrop, a full-screen `<button>`, pulled the custom
 * cursor's magnet box onto the whole page (1498 x 819 in a 1486 x 807
 * viewport) whenever the pointer rested beside the panel. The backdrops carry
 * `data-cursor-ignore` now; this predicate is the second line, so the next
 * full-screen control cannot bring it back.
 *
 * The cases below are real geometry from the site, measured at 1440 x 900.
 */
const VW = 1440;
const VH = 900;

describe("coversViewport", () => {
  it("catches a full-screen dialog backdrop", () => {
    expect(coversViewport({ width: 1440, height: 900 }, VW, VH)).toBe(true);
  });

  it("catches a backdrop inset by a few pixels", () => {
    expect(coversViewport({ width: 1428, height: 888 }, VW, VH)).toBe(true);
  });

  it("catches a target larger than the viewport", () => {
    expect(coversViewport({ width: 2000, height: 3000 }, VW, VH)).toBe(true);
  });

  it("leaves a content-column link alone", () => {
    // The widest real target: an <a> across the text column.
    expect(coversViewport({ width: 1216, height: 120 }, VW, VH)).toBe(false);
  });

  it("leaves a project card alone", () => {
    expect(coversViewport({ width: 534, height: 600 }, VW, VH)).toBe(false);
  });

  it("leaves a full-width but short bar alone", () => {
    expect(coversViewport({ width: 1440, height: 72 }, VW, VH)).toBe(false);
  });

  it("leaves a full-height but narrow rail alone", () => {
    expect(coversViewport({ width: 96, height: 900 }, VW, VH)).toBe(false);
  });

  it("needs both axes, and takes the threshold as inclusive", () => {
    const w = VW * VIEWPORT_COVER_RATIO;
    const h = VH * VIEWPORT_COVER_RATIO;
    expect(coversViewport({ width: w, height: h }, VW, VH)).toBe(true);
    expect(coversViewport({ width: w - 1, height: h }, VW, VH)).toBe(false);
    expect(coversViewport({ width: w, height: h - 1 }, VW, VH)).toBe(false);
  });

  it("says no when the viewport has no size, rather than swallowing every target", () => {
    // A zero viewport is a measurement that has not happened yet (SSR, a
    // hidden tab): every rect would "cover" it and the magnet would never fire.
    expect(coversViewport({ width: 40, height: 40 }, 0, 0)).toBe(false);
  });
});
