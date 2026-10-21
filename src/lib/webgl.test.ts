import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { canDrawWebGL, canDrawWebGL2, resetWebGLSupport } from "./webgl";

const loseContext = vi.fn();
const getContext = vi.fn();

function stubDocument() {
  vi.stubGlobal("document", {
    createElement: () => ({ getContext }),
  });
}

const context = () => ({
  getExtension: (name: string) =>
    name === "WEBGL_lose_context" ? { loseContext } : null,
});

describe("WebGL support", () => {
  beforeEach(() => {
    resetWebGLSupport();
    getContext.mockReset();
    loseContext.mockReset();
    stubDocument();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reports both kinds when WebGL 2 is granted, and gives the context back", () => {
    getContext.mockImplementation((kind: string) =>
      kind === "webgl2" ? context() : null,
    );

    expect(canDrawWebGL2()).toBe(true);
    expect(canDrawWebGL()).toBe(true);
    expect(loseContext).toHaveBeenCalledTimes(1);
  });

  it("falls back to WebGL 1 for ogl but not for three.js", () => {
    getContext.mockImplementation((kind: string) =>
      kind === "webgl" ? context() : null,
    );

    expect(canDrawWebGL2()).toBe(false);
    expect(canDrawWebGL()).toBe(true);
  });

  it("reports nothing when every context is refused", () => {
    getContext.mockReturnValue(null);

    expect(canDrawWebGL2()).toBe(false);
    expect(canDrawWebGL()).toBe(false);
  });

  it("treats a throwing getContext as refused", () => {
    getContext.mockImplementation(() => {
      throw new Error("blocked");
    });

    expect(canDrawWebGL()).toBe(false);
  });

  it("asks the browser once per page", () => {
    getContext.mockImplementation(() => context());

    canDrawWebGL2();
    canDrawWebGL();
    canDrawWebGL2();

    expect(getContext).toHaveBeenCalledTimes(1);
  });

  it("answers no without a document, as during the prerender", () => {
    vi.unstubAllGlobals();
    vi.stubGlobal("document", undefined);

    expect(canDrawWebGL()).toBe(false);
  });
});
