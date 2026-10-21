/**
 * Whether this browser hands out a WebGL context, asked once per page load.
 *
 * The canvases already survive a refused context (`createRenderer` and the
 * error boundaries around them), but ogl and three.js log an error to the
 * console on the way out, and three.js only asks for WebGL 2. Asking first
 * lets the page leave them out, and skip downloading them, where they could
 * not draw anyway. This is a measurement of the browser in hand, not a guess
 * from the device: the answer is whatever `getContext` returns.
 */
type Support = { webgl2: boolean; webgl: boolean };

let cached: Support | undefined;

function ask(kind: "webgl2" | "webgl"): boolean {
  try {
    const gl = document.createElement("canvas").getContext(kind) as
      | WebGLRenderingContext
      | WebGL2RenderingContext
      | null;
    if (!gl) return false;
    // Give the context back at once; browsers cap how many a page may hold.
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function support(): Support {
  if (cached) return cached;
  if (typeof document === "undefined") return { webgl2: false, webgl: false };
  const webgl2 = ask("webgl2");
  cached = { webgl2, webgl: webgl2 || ask("webgl") };
  return cached;
}

/** A WebGL 2 context is available: what three.js needs. */
export const canDrawWebGL2 = (): boolean => support().webgl2;

/** Any WebGL context is available: ogl falls back to WebGL 1. */
export const canDrawWebGL = (): boolean => support().webgl;

/** Forgets the answer. For tests only. */
export function resetWebGLSupport(): void {
  cached = undefined;
}
