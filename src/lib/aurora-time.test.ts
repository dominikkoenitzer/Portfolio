import { describe, expect, it } from "vitest";
import { auroraStops, localHour, warmStops } from "./aurora-time";

describe("auroraStops", () => {
  it("shows the site's own palette through the day", () => {
    expect(auroraStops(12, false)).toEqual(["#7b5f9e", "#86ad78", "#c68c99"]);
    expect(auroraStops(12, true)).toEqual(["#6a3cc4", "#7fae36", "#c4608a"]);
  });

  it("holds the night palette across midnight", () => {
    expect(auroraStops(23.5, false)).toEqual(auroraStops(2, false));
    expect(auroraStops(0, true)).toEqual(auroraStops(24, true));
  });

  it("blends between keyframes instead of switching", () => {
    const before = auroraStops(17.5, false)[2];
    const halfway = auroraStops(18.25, false)[2];
    const evening = auroraStops(19, false)[2];
    expect(halfway).not.toBe(before);
    expect(halfway).not.toBe(evening);
  });

  it("holds the festival evening from 19:00 to 21:00", () => {
    expect(auroraStops(19, false)).toEqual(auroraStops(21, false));
    expect(auroraStops(20, true)).toEqual(auroraStops(19, true));
    expect(auroraStops(21.75, false)).not.toEqual(auroraStops(21, false));
  });

  it("accepts any clock reading", () => {
    expect(auroraStops(-1, false)).toEqual(auroraStops(23, false));
    expect(auroraStops(36, true)).toEqual(auroraStops(12, true));
    for (const stop of auroraStops(13.37, true)) {
      expect(stop).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});

describe("localHour", () => {
  it("turns a clock into a fractional hour", () => {
    expect(localHour(new Date(2026, 8, 25, 19, 45))).toBe(19.75);
  });
});

describe("warmStops", () => {
  it("leaves the sky alone at rest and only leans it when lingering", () => {
    const day = auroraStops(12, false);
    expect(warmStops(day, 0, false)).toEqual(day);
    const warm = warmStops(day, 1, false);
    expect(warm).not.toEqual(day);
    expect(warmStops(day, 5, false)).toEqual(warm);
  });
});
