import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";

interface SmoothScrollProps {
  children: ReactNode;
}

/**
 * App-wide smooth scrolling via Lenis. Mounted high in the tree with `root`, so
 * Lenis drives the real window scroll — `window.scrollY`, native `scroll`
 * events, and framer-motion's `useScroll` (progress bar + hero parallax) all
 * keep working downstream. Lenis runs its own rAF (`autoRaf`, on by default).
 *
 * Honors `prefers-reduced-motion`: when set, Lenis is not mounted at all, so
 * scrolling stays fully native and instant. Consumers read the instance with
 * `useLenis()`, which returns `undefined` in that case — every call site has a
 * native fallback (see ScrollToTopFab, AnimatedRoutes, use-body-scroll-lock).
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  if (prefersReducedMotion()) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 1,
        // Leave touch scrolling native: smoothing it fights iOS momentum, and
        // the hero's velocity parallax is already disabled on coarse pointers.
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
