import { ReactLenis, useLenis } from "lenis/react";
import { type ReactNode, useEffect } from "react";
import { runWhileGliding } from "@/lib/lenis-frame-loop";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";

interface SmoothScrollProps {
  children: ReactNode;
}

/** Drives the root instance's frames while it glides, nothing in between. */
function FrameLoop() {
  const lenis = useLenis();
  useEffect(() => (lenis ? runWhileGliding(lenis) : undefined), [lenis]);
  return null;
}

/**
 * App-wide smooth scrolling via Lenis. Mounted high in the tree with `root`, so
 * Lenis drives the real window scroll: `window.scrollY`, native `scroll`
 * events, and framer-motion's `useScroll` (the header's hide-on-scroll, the
 * scroll-to-top button) all keep working downstream. Its frame loop runs only
 * while a glide is under way (`runWhileGliding`), not on every frame of the
 * page's life.
 *
 * Honors `prefers-reduced-motion`: when set, Lenis is not mounted at all, so
 * scrolling stays fully native and instant. Consumers read the instance with
 * `useLenis()`, which returns `undefined` in that case, every call site has a
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
        // A longer glide than the default, so the page drifts to rest.
        lerp: 0.085,
        smoothWheel: true,
        wheelMultiplier: 1,
        // Leave touch scrolling native: smoothing it fights iOS momentum.
        syncTouch: false,
        autoRaf: false,
      }}
    >
      <FrameLoop />
      {children}
    </ReactLenis>
  );
}
