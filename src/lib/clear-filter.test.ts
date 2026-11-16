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

  it("leaves focus alone after a tap, even where the tap focused the button", () => {
    // Chrome and Firefox on Android focus a tapped button, and focusing the field there would open the keyboard.
    const field = { focus: vi.fn() };
    const clear = vi.fn();
    clearFilter(clear, true, field, "touch");
    expect(clear).toHaveBeenCalledTimes(1);
    expect(field.focus).not.toHaveBeenCalled();
  });

  it("moves focus after a mouse click or a key press", () => {
    for (const pointerType of ["mouse", "pen", "", undefined]) {
      const field = { focus: vi.fn() };
      clearFilter(() => {}, true, field, pointerType);
      expect(field.focus).toHaveBeenCalledTimes(1);
    }
  });

  it("still clears when the search field is not mounted", () => {
    const clear = vi.fn();
    expect(() => clearFilter(clear, true, null)).not.toThrow();
    expect(clear).toHaveBeenCalledTimes(1);
  });
});
