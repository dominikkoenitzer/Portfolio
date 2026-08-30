import type { MotionProps } from "framer-motion";
import { DUR, EASE_OUT } from "./motion";

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
