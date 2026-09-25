import { DUR, EASE_OUT, SPRING_FLUID } from "./motion";

// Page-level enter/exit motion for routes, transform and opacity only. The
// previous variant also animated filter: blur() across the whole route, which
// forces a full-page repaint every frame and stuttered on mid-range hardware.
//
// Transitions live on the variants because the two halves deserve different
// clocks: AnimatePresence runs exit-then-enter back to back, so a symmetric
// duration made every navigation wait almost a second. The exit is a quick
// step aside; the enter does the graceful part. The enter rides the fluid
// spring, the way iOS settles a new screen: the page rises into place from
// just below and a hair smaller, overshoots by a pixel and comes to rest,
// while the fade keeps its own short clock so the text is readable early.
export const pageTransitionVariants = {
  initial: { opacity: 0, y: 18, scale: 0.985 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      y: SPRING_FLUID,
      scale: SPRING_FLUID,
      opacity: { duration: DUR.base, ease: EASE_OUT },
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: DUR.fast, ease: EASE_OUT },
  },
};
