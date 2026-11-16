import { describe, expect, it, vi } from "vitest";

import { clearFilter } from "./clear-filter";

describe("clearFilter", () => {
  it("moves focus to the search field when the pressed button held it", () => {
    const calls: string[] = [];
    const field = { focus: vi.fn(() => calls.push("focus")) };
    clearFilter(() => calls.push("clear"), true, field);
    expect(field.focus).toHaveBeenCalledTimes(1);
    expect(calls).toEqual(["clear", "focus"]);
  });

  it("leaves focus alone when the button did not hold it", () => {
    // A tap in Safari never focuses the button, so nothing was lost and the phone keyboard stays shut.
    const field = { focus: vi.fn() };
    const clear = vi.fn();
    clearFilter(clear, false, field);
    expect(clear).toHaveBeenCalledTimes(1);
    expect(field.focus).not.toHaveBeenCalled();
  });

  it("still clears when the search field is not mounted", () => {
    const clear = vi.fn();
    expect(() => clearFilter(clear, true, null)).not.toThrow();
    expect(clear).toHaveBeenCalledTimes(1);
  });
});
