import { describe, expect, it } from "vitest";
import { pickerKey } from "./psyche-keys";

describe("pickerKey", () => {
  it("leaves Enter on No to the No button", () => {
    expect(pickerKey("Enter", "ask", true)).toBeNull();
  });

  it("answers Yes on Enter from Yes or from the page", () => {
    expect(pickerKey("Enter", "ask", false)).toBe("yes");
  });

  it("answers No on N from anywhere in the question", () => {
    expect(pickerKey("n", "ask", false)).toBe("no");
    expect(pickerKey("N", "ask", true)).toBe("no");
  });

  it("closes the picker and the question on Escape", () => {
    expect(pickerKey("Escape", "picker", true)).toBe("close");
    expect(pickerKey("Escape", "ask", false)).toBe("close");
  });

  it("leaves every key alone while nothing is asked", () => {
    for (const phase of ["idle", "picker", "typing", "typed"] as const) {
      expect(pickerKey("Enter", phase, false)).toBeNull();
      expect(pickerKey("n", phase, false)).toBeNull();
    }
    expect(pickerKey("Escape", "idle", false)).toBeNull();
    expect(pickerKey("Escape", "typed", false)).toBeNull();
  });
});
