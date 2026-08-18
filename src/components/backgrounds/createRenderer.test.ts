import { beforeEach, describe, expect, it, vi } from "vitest";

import { createRenderer } from "./createRenderer";

// The backgrounds are decoration, but OGL's Renderer assigns `gl.renderer = this`
// in its constructor. On a machine that cannot hand out a WebGL context — GPU
// blocklists, hardware acceleration off, VMs, remote desktop — that assignment
// threw straight out of a React effect and unmounted the whole page, so the
// site rendered blank. These cover the ways that failure arrives.
const construct = vi.fn();

vi.mock("ogl", () => ({
  Renderer: class {
    gl: unknown;
    constructor(options: unknown) {
      this.gl = construct(options);
    }
  },
}));

describe("createRenderer", () => {
  beforeEach(() => {
    construct.mockReset();
  });

  it("returns the renderer when a context is available", () => {
    const gl = { drawingBufferWidth: 800 };
    construct.mockReturnValue(gl);

    const renderer = createRenderer({ alpha: true });

    expect(renderer).not.toBeNull();
    expect(renderer?.gl).toBe(gl);
  });

  it("passes its options through untouched", () => {
    construct.mockReturnValue({});
    const options = { webgl: 2 as const, alpha: true, antialias: false, dpr: 2 };

    createRenderer(options);

    expect(construct).toHaveBeenCalledWith(options);
  });

  it("returns null when the constructor throws", () => {
    // What OGL actually does today: `gl` is null and `gl.renderer = this` throws.
    construct.mockImplementation(() => {
      throw new TypeError("Cannot set properties of null (setting 'renderer')");
    });

    expect(createRenderer({ alpha: true })).toBeNull();
  });

  it("returns null when the constructor survives but leaves no context", () => {
    // Belt and braces: a future OGL that fails softly must not hand back a
    // renderer whose `gl` every caller immediately dereferences.
    construct.mockReturnValue(null);

    expect(createRenderer({ alpha: true })).toBeNull();
  });

  it("never throws, whatever the constructor does", () => {
    for (const boom of [
      () => {
        throw new Error("no webgl");
      },
      () => {
        // A non-Error throw still has to be swallowed.
        throw "context creation failed";
      },
    ]) {
      construct.mockImplementation(boom);
      expect(() => createRenderer({ alpha: true })).not.toThrow();
    }
  });
});
