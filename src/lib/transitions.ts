import { DUR, EASE_OUT } from "./motion";

// Page-level enter/exit motion for routes, transform and opacity only. The
// previous variant also animated filter: blur() across the whole route, which
// forces a full-page repaint every frame and stuttered on mid-range hardware.
//
// Transitions live on the variants because the two halves deserve different
// clocks: AnimatePresence runs exit-then-enter back to back, so a symmetric
// duration made every navigation wait almost a second. The exit is a quick
// step aside; the enter does the graceful part.
export const pageTransitionVariants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: DUR.fast, ease: EASE_OUT },
  },
};
