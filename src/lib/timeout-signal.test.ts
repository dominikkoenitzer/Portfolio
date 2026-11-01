// @ts-expect-error -- the app tsconfig carries no Node types; vitest runs this file in Node.
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { timeoutSignal } from "./timeout-signal";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("timeoutSignal", () => {
  it("aborts with a timeout where AbortSignal.timeout is missing", () => {
    vi.useFakeTimers();
    class OldAbortSignal {
      static abort = AbortSignal.abort;
    }
    vi.stubGlobal("AbortSignal", OldAbortSignal);
    const signal = timeoutSignal(1000);
    expect(signal.aborted).toBe(false);
    vi.advanceTimersByTime(1000);
    expect(signal.aborted).toBe(true);
    expect((signal.reason as DOMException).name).toBe("TimeoutError");
  });

  it("uses the built-in timeout where there is one", () => {
    const spy = vi.spyOn(AbortSignal, "timeout");
    timeoutSignal(1000);
    expect(spy).toHaveBeenCalledWith(1000);
  });

  it("is what the contact form uses for its requests", () => {
    const source = readFileSync(
      new URL("../components/sections/ContactSection.tsx", import.meta.url),
      "utf8",
    );
    expect(source).not.toContain("AbortSignal.timeout(");
    expect(source).toContain("timeoutSignal(");
  });
});
