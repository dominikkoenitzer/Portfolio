import { describe, expect, it } from "vitest";

import { fitTags, rowsNeeded } from "./fit-tags";

/**
 * The chips these numbers stand in for are ~60–110px wide with an 8px gap, so
 * the fixtures use round widths at that scale: a 100px chip in a 320px row
 * fits three per line.
 */
const GAP = 8;

describe("rowsNeeded", () => {
  it("keeps chips on one row while they fit", () => {
    expect(rowsNeeded([100, 100, 100], 320, GAP)).toBe(1);
  });

  it("wraps once the gap no longer fits either", () => {
    // 100 + 8 + 100 + 8 + 100 = 316 fits; a fourth needs 424.
    expect(rowsNeeded([100, 100, 100, 100], 320, GAP)).toBe(2);
  });

  it("gives a chip wider than the row a row of its own", () => {
    expect(rowsNeeded([400, 100], 320, GAP)).toBe(2);
  });

  it("counts an empty row as one row", () => {
    expect(rowsNeeded([], 320, GAP)).toBe(1);
  });
});

describe("fitTags", () => {
  const base = { badgeWidth: 44, containerWidth: 320, gap: GAP, maxRows: 2 };

  it("shows every chip when they all fit", () => {
    expect(fitTags({ ...base, widths: [100, 100, 100] })).toBe(3);
  });

  it("shows every chip when they exactly fill the last row", () => {
    expect(fitTags({ ...base, widths: [100, 100, 100, 100, 100, 100] })).toBe(6);
  });

  it("reserves room for the badge before cutting", () => {
    // Seven chips need three rows. Six plus a 44px badge would need 316 + 52 on
    // row two, so the cut lands at five.
    expect(fitTags({ ...base, widths: Array(7).fill(100) })).toBe(5);
  });

  it("collapses to the badge alone when nothing else fits", () => {
    expect(
      fitTags({ ...base, containerWidth: 60, widths: [100, 100], maxRows: 1 }),
    ).toBe(0);
  });

  it("shows every chip before the row has been measured", () => {
    expect(fitTags({ ...base, containerWidth: 0, widths: Array(9).fill(100) })).toBe(9);
  });

  it("widens with the container — the badge is a symptom of space, not a cap", () => {
    const widths = Array(9).fill(100);
    expect(fitTags({ ...base, containerWidth: 340, widths })).toBe(5);
    expect(fitTags({ ...base, containerWidth: 700, widths })).toBe(9);
  });
});
