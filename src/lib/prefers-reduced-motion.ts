/**
 * Reads the user's `prefers-reduced-motion` setting. Safe to call during render
 * (it's a synchronous media-query read) — used to fully bypass smooth-scroll
 * and to make programmatic scrolls instant for motion-sensitive users.
 */
export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
