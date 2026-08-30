import type { MotionProps, Variants } from "framer-motion";
import { DUR, EASE_OUT, REVEAL, VIEWPORT } from "./motion";

export const fadeInUp: MotionProps = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: DUR.slow, ease: EASE_OUT },
};

export const fadeInLeft: MotionProps = {
  initial: { opacity: 0, x: -40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: DUR.slow, ease: EASE_OUT },
};

export const fadeInRight: MotionProps = {
  initial: { opacity: 0, x: 40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: DUR.slow, ease: EASE_OUT },
};

/**
 * Variants for a container that reveals itself and then cascades its `REVEAL`
 * children. `delayChildren` counts from the moment the container starts, not
 * from where it lands, so the children follow it up instead of waiting for it.
 */
export const revealStagger = (
  delayChildren = 0.08,
  staggerChildren = 0.07,
): Variants => ({
  hidden: REVEAL.hidden,
  show: {
    ...REVEAL.show,
    transition: { ...REVEAL.show.transition, delayChildren, staggerChildren },
  },
});

/**
 * The scroll-reveal prop bundle, at the shared threshold and fired once: pass
 * `REVEAL` (the default) for a lone element, `stagger()` or `revealStagger()`
 * for a container whose children carry `REVEAL`.
 *
 * Reduced motion renders the settled state and never observes the viewport.
 * `initial` flows down the motion tree, so children resolve to `show` too and
 * the whole subtree paints where it belongs, without animating.
 */
export const revealOnScroll = (
  reduceMotion: boolean | null,
  variants: Variants = REVEAL,
): MotionProps =>
  reduceMotion
    ? { initial: "show", variants }
    : {
        initial: "hidden",
        variants,
        viewport: VIEWPORT,
        whileInView: "show",
      };
