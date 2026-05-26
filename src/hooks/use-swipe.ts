import type { PointerEvent as ReactPointerEvent } from "react";
import { useRef } from "react";

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeOptions extends SwipeHandlers {
  /** Minimum distance in px to count as a swipe. */
  threshold?: number;
  /** Max ms allowed between pointerdown and pointerup. */
  maxDuration?: number;
}

/**
 * Lightweight pointer-based swipe gesture hook. Returns spread-able handlers
 * (`{...swipe}` on a div) so you can attach swipe logic without bringing in a
 * gesture library. Works with both touch and mouse pointers.
 */
export const useSwipe = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 60,
  maxDuration = 600,
}: SwipeOptions) => {
  const start = useRef<{ x: number; y: number; t: number } | null>(null);

  const handlePointerDown = (e: ReactPointerEvent) => {
    start.current = { x: e.clientX, y: e.clientY, t: performance.now() };
  };

  const handlePointerUp = (e: ReactPointerEvent) => {
    const s = start.current;
    start.current = null;
    if (!s) return;
    const dt = performance.now() - s.t;
    if (dt > maxDuration) return;

    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (absX > absY) {
      if (absX < threshold) return;
      if (dx > 0) onSwipeRight?.();
      else onSwipeLeft?.();
    } else {
      if (absY < threshold) return;
      if (dy > 0) onSwipeDown?.();
      else onSwipeUp?.();
    }
  };

  return {
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onPointerCancel: () => {
      start.current = null;
    },
  };
};
