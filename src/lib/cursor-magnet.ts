/**
 * Shared contract between the site-wide custom cursor and canvas-based scenes.
 *
 * The custom cursor (`components/ui/CustomCursor`) morphs its magnetic "box"
 * onto an interactive element using that element's bounding rect. For a WebGL
 * `<canvas>` the interactive object (e.g. a leaf in the 3D services tree) is a
 * tiny fraction of the canvas, so morphing to the bounding box would swallow
 * the whole panel. A scene therefore pins the cursor to a live sub-rect of the
 * canvas via {@link setCursorMagnetRect}, and the cursor reads it via
 * {@link magnetRectOf}.
 *
 * Lives in its own dependency-free module (not in `CustomCursor`) so the lazy
 * scene chunks that set the rect don't pull the cursor's framer-motion code.
 */

/** Viewport-space rect, in `getBoundingClientRect`'s frame of reference. */
export type CursorMagnetRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

// Stashed on the DOM element itself (a hot-path channel — no React, no events).
type MagnetRectHost = { __cursorMagnetRect?: CursorMagnetRect | null };

/**
 * Read an element's cursor-magnet override.
 * - `undefined` ⇒ no override; the cursor uses the element's bounding box.
 * - a rect ⇒ the cursor morphs to it (viewport coords).
 * - explicit `null` ⇒ the element is an override source but has no live target
 *   right now, so the cursor releases the morph (falls back to a dot).
 */
export const magnetRectOf = (
  el: Element,
): CursorMagnetRect | null | undefined =>
  (el as unknown as MagnetRectHost).__cursorMagnetRect;

/**
 * Pin the custom cursor's magnetic morph to `rect` (viewport coords) — a
 * sub-region of `el` — instead of its bounding box, or clear it with `null`.
 * Meant for canvas-based scenes where the interactive object is a fraction of
 * the element; see {@link CursorMagnetRect}.
 */
export function setCursorMagnetRect(
  el: Element,
  rect: CursorMagnetRect | null,
): void {
  (el as unknown as MagnetRectHost).__cursorMagnetRect = rect;
}
