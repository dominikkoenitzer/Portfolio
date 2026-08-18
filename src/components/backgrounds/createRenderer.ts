import { Renderer, type RendererOptions } from "ogl";

/**
 * Builds an OGL renderer, or returns `null` when the browser will not give us a
 * WebGL context.
 *
 * These backgrounds are decoration, but OGL's `Renderer` assigns
 * `gl.renderer = this` in its constructor. When context creation fails — GPU
 * blocklists, hardware acceleration switched off, VMs, remote desktop sessions,
 * some corporate-managed machines — `gl` is null and that assignment throws.
 * Thrown from an effect, React unmounts the whole tree above it and the page
 * renders blank, so a purely cosmetic gradient can take the entire site down.
 *
 * Failing to `null` here keeps the background what it always was: optional.
 */
export function createRenderer(
  options: Partial<RendererOptions>,
): Renderer | null {
  try {
    const renderer = new Renderer(options);
    return renderer.gl ? renderer : null;
  } catch {
    return null;
  }
}
