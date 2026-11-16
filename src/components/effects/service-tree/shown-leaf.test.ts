import { describe, expect, it } from "vitest";

import { shownLeaf } from "./shown-leaf";

const nodes = [{ key: "web" }, { key: "apps" }, { key: "audit" }];

describe("shownLeaf", () => {
  it("marks the leaf under the pointer first", () => {
    expect(shownLeaf(0, "audit", nodes)).toBe(0);
  });

  it("marks the leaf whose button has focus when nothing is hovered", () => {
    expect(shownLeaf(null, "audit", nodes)).toBe(2);
  });

  it("marks nothing when no leaf is hovered or focused", () => {
    expect(shownLeaf(null, null, nodes)).toBeNull();
  });

  it("marks nothing for a focused key the scene does not hold", () => {
    expect(shownLeaf(null, "gone", nodes)).toBeNull();
  });
});
