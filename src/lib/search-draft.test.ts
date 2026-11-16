import { describe, expect, it } from "vitest";
import { addressMoved, draftFrom, fieldWrite, typed } from "./search-draft";

describe("search draft", () => {
  it("keeps the typed text when the field's own writes arrive late", () => {
    // "rct", then "e" and "a" typed after the "r": three writes on their way.
    let draft = typed(draftFrom(""), "rct", 1);
    draft = typed(draft, "rect", 2);
    draft = typed(draft, "react", 3);

    draft = addressMoved(draft, "rct", 1);
    expect(draft).toEqual({ text: "react", pending: [2, 3] });
    draft = addressMoved(draft, "rect", 2);
    expect(draft.text).toBe("react");
    draft = addressMoved(draft, "react", 3);
    expect(draft).toEqual({ text: "react", pending: [] });
  });

  it("keeps the typed text when only the last of several writes arrives", () => {
    const draft = typed(typed(draftFrom(""), "r", 1), "re", 2);
    expect(addressMoved(draft, "re", 2)).toEqual({ text: "re", pending: [] });
  });

  it("takes the address's text on a change from elsewhere", () => {
    const draft = typed(draftFrom(""), "react", 1);
    // Back, Forward, a link or a skill chip carry no write of the field.
    expect(addressMoved(draft, "rust", undefined)).toEqual({ text: "rust", pending: [] });
    // Nor does an entry the field wrote earlier and that has already arrived.
    const settled = addressMoved(draft, "react", 1);
    expect(addressMoved(settled, "rust", 1)).toEqual({ text: "rust", pending: [] });
  });

  it("empties the field when the clear button empties the address", () => {
    const draft = typed(draftFrom("react"), "reacts", 4);
    expect(addressMoved(draft, "", undefined)).toEqual({ text: "", pending: [] });
  });

  it("reads the write number from history state", () => {
    expect(fieldWrite({ searchWrite: 7 })).toBe(7);
    expect(fieldWrite({ searchWrite: "7" })).toBeUndefined();
    expect(fieldWrite({})).toBeUndefined();
    expect(fieldWrite(null)).toBeUndefined();
    expect(fieldWrite(undefined)).toBeUndefined();
  });
});
