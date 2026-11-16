import { describe, expect, it } from "vitest";
import { listKeyTarget } from "./list-keys";

describe("listKeyTarget", () => {
  it("moves down and up one row", () => {
    expect(listKeyTarget("ArrowDown", 0, 4)).toBe(1);
    expect(listKeyTarget("ArrowUp", 2, 4)).toBe(1);
  });

  it("wraps at both ends", () => {
    expect(listKeyTarget("ArrowDown", 3, 4)).toBe(0);
    expect(listKeyTarget("ArrowUp", 0, 4)).toBe(3);
  });

  it("jumps to the first and last row", () => {
    expect(listKeyTarget("Home", 2, 4)).toBe(0);
    expect(listKeyTarget("End", 1, 4)).toBe(3);
  });

  it("starts at an end when no row has focus", () => {
    expect(listKeyTarget("ArrowDown", -1, 4)).toBe(0);
    expect(listKeyTarget("ArrowUp", -1, 4)).toBe(3);
  });

  it("leaves other keys and empty lists alone", () => {
    expect(listKeyTarget("Enter", 1, 4)).toBeNull();
    expect(listKeyTarget("Tab", 1, 4)).toBeNull();
    expect(listKeyTarget("ArrowDown", -1, 0)).toBeNull();
  });
});
