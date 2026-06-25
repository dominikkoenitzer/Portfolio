import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";

/**
 * CustomCursor — a fast, minimal precision dot.
 *
 * A single small dot that sits EXACTLY on the pointer (1:1, zero position lag —
 * it must feel locked to the mouse, never floaty/trailing). The only motion is
 * a quick scale: it pops up a touch over interactive targets and dips on press.
 * No trailing ring, no glow, no morph. It fades out when the pointer leaves the
 * window / the tab loses focus and reappears on re-entry.
 *
 * Theme: pure `hsl(var(--primary))`, the active theme's signature accent, so the
 * dot is distinctly colored per theme (glass blue, bloom violet) and recolors
 * automatically when the theme changes — the theme
 * class lives on <html>, this portals into <body> and inherits the variable, so
 * the CSS value re-resolves on its own with no JS.
 *
 * Performance: NOTHING on the per-move/hover/press path calls React setState.
 * Position, hover and press all ride framer-motion motion values and animate
 * only GPU-composited transform/opacity. The only React state is the one-shot
 * `enabled` gate (mount) and `visible` (window-leave fade), both of which flip
 * on discrete boundary events, never on mousemove.
 *
 * Robustness: hides on true window-leave (mouseout w/ null relatedTarget +
 * documentElement mouseleave) and on blur / tab switch; no flash at (-100,-100)
 * because render is gated until the first real move; every listener is passive
 * and cleaned up.
 */

/**
 * Elements that should trigger the hover pop. Kept as one string so the
 * per-event `closest()` lookup stays a single cheap ancestor walk.
 */
const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, label, [data-cursor], .cursor-pointer';

/** Scale spring — snappy and lively, settles fast (this is the only motion). */
const SCALE_SPRING = { stiffness: 700, damping: 30, mass: 0.45 } as const;

const DOT_SIZE = 9; // px — dot diameter at rest

export function CustomCursor() {
  // `enabled` gates the very first render: true only on a fine pointer AND after
  // the first real mousemove. This avoids the classic top-left mount flash.
  // Once true it never reverts, so the user is never left without a cursor (the
  // native one is hidden via global CSS).
  const [enabled, setEnabled] = useState(false);
  // `visible` drives the fade when the pointer leaves/enters the window. It
  // flips only on boundary events, never on the move path.
  const [visible, setVisible] = useState(false);

  // Pointer position — written every move, applied 1:1, never re-renders React.
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Hover (0 → 1) and press (0 → 1) factors live on motion values so updating
  // them never re-renders React.
  const hover = useMotionValue(0);
  const press = useMotionValue(0);

  // Reduced motion is read once during render (synchronous, render-safe). When
  // true we drop the scale easing so the dot snaps instantly.
  const reduced = prefersReducedMotion();

  // Springs are ALWAYS constructed (stable hook order); the reduced-motion
  // branch is chosen at the value level, never by conditionally calling a hook.
  const hoverSpring = useSpring(hover, SCALE_SPRING);
  const pressSpring = useSpring(press, SCALE_SPRING);
  const h = reduced ? hover : hoverSpring;
  const p = reduced ? press : pressSpring;

  // Single scale: pops to ~1.8 over interactive targets, dips on press.
  const scale = useTransform([h, p], ([hv, pv]: number[]) =>
    Math.max(0.001, (1 + hv * 0.8) * (1 - pv * 0.3)),
  );

  useEffect(() => {
    // Only activate for fine pointers (mouse/trackpad). On coarse/touch devices
    // the native cursor stays as-is and this component renders nothing.
    if (
      typeof window === "undefined" ||
      !window.matchMedia("(pointer: fine)").matches
    ) {
      return;
    }

    let hasMoved = false;

    const onMove = (e: MouseEvent) => {
      // 1:1, no smoothing — the dot is exactly on the pointer.
      x.set(e.clientX);
      y.set(e.clientY);
      if (!hasMoved) {
        hasMoved = true;
        setEnabled(true);
      }
      setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      hover.set(target?.closest(INTERACTIVE_SELECTOR) ? 1 : 0);
    };

    const onDown = () => press.set(1);
    const onUp = () => press.set(0);

    // `relatedTarget` null on a document-level mouseout means the pointer left
    // the window entirely (not just moved between two elements).
    const onWindowOut = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        setVisible(false);
        press.set(0);
      }
    };
    // `mouseleave` on <html> is a reliable, non-bubbling "left the viewport"
    // signal; it complements the mouseout check (belt and suspenders).
    const onWindowLeave = () => {
      setVisible(false);
      press.set(0);
    };
    const onWindowEnter = () => {
      if (hasMoved) setVisible(true);
    };

    // Hide while another tab/window has focus so a stale dot doesn't linger.
    const onBlur = () => setVisible(false);
    const onVisibility = () => {
      if (document.hidden) setVisible(false);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });
    document.addEventListener("mouseout", onWindowOut, { passive: true });
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibility);
    document.documentElement.addEventListener("mouseleave", onWindowLeave);
    document.documentElement.addEventListener("mouseenter", onWindowEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseout", onWindowOut);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibility);
      document.documentElement.removeEventListener("mouseleave", onWindowLeave);
      document.documentElement.removeEventListener("mouseenter", onWindowEnter);
    };
  }, [x, y, hover, press]);

  if (!enabled) return null;

  // Portal to <body> so the cursor shares the stacking context of Radix
  // popovers/dropdowns (which also portal to body); z-[9999] then beats their
  // z-50, keeping the cursor above open menus.
  return createPortal(
    <div className="pointer-events-none select-none" aria-hidden="true">
      <AnimatePresence>
        {visible && (
          <motion.span
            className="fixed left-0 top-0 z-[9999] rounded-full"
            style={{
              x,
              y,
              width: DOT_SIZE,
              height: DOT_SIZE,
              marginLeft: -DOT_SIZE / 2,
              marginTop: -DOT_SIZE / 2,
              backgroundColor: "hsl(var(--primary))",
              scale,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.12, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
