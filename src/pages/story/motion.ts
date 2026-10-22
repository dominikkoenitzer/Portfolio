import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE_OUT } from "@/lib/motion";

/** Timing and start-once-seen for the live demos on the project pages. */

/** Moving between places: settles in about 350ms with no visible overshoot. */
export const SPRING = { type: "spring", stiffness: 420, damping: 40, mass: 0.9 } as const;

/** Appearing and leaving: a short ease-out. */
export const FADE = { duration: 0.22, ease: EASE_OUT } as const;

/** A step that takes time in the real app gets a readable beat in the demo. */
export const wait = (ms: number) => new Promise<void>((done) => window.setTimeout(done, ms));

/** The transition to use, or none at all under reduced motion. */
export function useMotionSafe() {
  const reduced = useReducedMotion() ?? false;
  return {
    reduced,
    spring: reduced ? { duration: 0 } : SPRING,
    fade: reduced ? { duration: 0 } : FADE,
    delay: (seconds: number) => (reduced ? 0 : seconds),
  };
}

/**
 * True once the element has been at least half in view. A demo plays its
 * moment once at that point and then waits for the reader; under reduced
 * motion it never starts on its own.
 */
export function useSeenOnce<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return [ref, seen] as const;
}
