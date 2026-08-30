/**
 * The site's one motion vocabulary. Every animated surface (pages, cards,
 * nav, buttons) draws its curve and durations from here, because consistency
 * of motion is most of what makes an interface feel engineered rather than
 * assembled. Animate transform and opacity only: width/height/filter
 * animations repaint every frame and read as stutter.
 */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const DUR = {
  /** Hover and press feedback. */
  fast: 0.2,
  /** Entrances, page transitions. */
  base: 0.4,
  /** Large staged reveals. */
  slow: 0.6,
} as const;

/** Cushioned spring for pointer feedback (hover lift, press). */
export const SPRING_SOFT = {
  type: "spring",
  stiffness: 260,
  damping: 30,
  mass: 0.9,
} as const;
