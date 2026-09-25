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

/**
 * The iOS feel for things that move between places: an image growing out of
 * its thumbnail, a panel settling. Quick to start, a touch of overshoot at the
 * end, and no fixed duration, so a short hop and a long flight both feel
 * physical.
 */
export const SPRING_FLUID = {
  type: "spring",
  stiffness: 330,
  damping: 30,
  mass: 0.85,
} as const;

/**
 * Scroll reveal for any element: a rise and fade on the shared curve. Use as
 * `variants={REVEAL}` with `initial="hidden" whileInView="show"`, inside a
 * parent that carries `stagger()` so siblings cascade instead of popping in
 * together.
 */
export const REVEAL = {
  // A little slower and a little shorter a rise than the rest of the motion:
  // blocks arrive the way a warm evening does, unhurried.
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_OUT },
  },
} as const;

/** Parent variants that cascade REVEAL children. */
export const stagger = (delayChildren = 0.08, staggerChildren = 0.07) => ({
  hidden: {},
  show: { transition: { delayChildren, staggerChildren } },
});

/** Shared whileInView settings so every reveal fires at the same threshold. */
export const VIEWPORT = { once: true, margin: "-10% 0px -10% 0px" } as const;
