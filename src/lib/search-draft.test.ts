import { describe, expect, it } from "vitest";
import { fieldWrite, shown, typed } from "./search-draft";

describe("search draft", () => {
  it("shows the address's query until the field types", () => {
    expect(shown(null, "react", "a", undefined)).toBe("react");
    expect(shown(null, "react", "a", 5)).toBe("react");
  });

  it("keeps the typed text while the field's own writes arrive late", () => {
    // "rct", then "e" and "a" typed after the "r", all at the first address: three writes on their way.
    let draft = typed(null, "rct", "start", 1);
    draft = typed(draft, "rect", "start", 2);
    draft = typed(draft, "react", "start", 3);

    expect(shown(draft, "", "start", undefined)).toBe("react");
    expect(shown(draft, "rct", "k1", 1)).toBe("react");
    expect(shown(draft, "rect", "k2", 2)).toBe("react");
    expect(shown(draft, "react", "k3", 3)).toBe("react");
  });

  it("keeps the typed text when a render still sees the address from before an earlier write", () => {
    // A transition render showed "r" arriving at k1 and was cut off by the "c"; the urgent render still sees the start.
    let draft = typed(null, "r", "start", 1);
    expect(shown(draft, "r", "k1", 1)).toBe("r");
    draft = typed(draft, "rc", "start", 2);
    expect(shown(draft, "", "start", undefined)).toBe("rc");
  });

  it("takes the address's text on a change from elsewhere", () => {
    const draft = typed(null, "react", "start", 1);
    // Back, Forward, a link or a skill chip carry no write of the field.
    expect(shown(draft, "rust", "k2", undefined)).toBe("rust");
    // Nor does an entry an earlier page load wrote.
    expect(shown(draft, "rust", "k2", 0)).toBe("rust");
  });

  it("types on from an address it did not write", () => {
    const draft = typed(typed(null, "react", "start", 1), "rust", "chip", 2);
    expect(shown(draft, "react", "chip", undefined)).toBe("rust");
    expect(shown(draft, "rust", "k3", 2)).toBe("rust");
  });

  it("empties the field when the clear button empties the address", () => {
    const draft = typed(null, "reacts", "start", 4);
    expect(shown(draft, "", "cleared", undefined)).toBe("");
  });

  it("reads the write number from history state", () => {
    expect(fieldWrite({ searchWrite: 7 })).toBe(7);
    expect(fieldWrite({ searchWrite: "7" })).toBeUndefined();
    expect(fieldWrite({})).toBeUndefined();
    expect(fieldWrite(null)).toBeUndefined();
    expect(fieldWrite(undefined)).toBeUndefined();
  });
});
