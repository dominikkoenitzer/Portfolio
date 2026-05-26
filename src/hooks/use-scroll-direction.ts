import { useEffect, useState } from "react";

type Direction = "up" | "down";

/**
 * Tracks vertical scroll direction with a small threshold so micro-scrolls
 * don't flip the value. Used to auto-hide the navbar on mobile when the user
 * scrolls down and reveal it when they scroll up.
 *
 * `topRange` keeps the bar visible while still near the top of the page.
 */
export const useScrollDirection = (threshold = 6, topRange = 80): Direction => {
  const [direction, setDirection] = useState<Direction>("up");

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      if (y < topRange) {
        setDirection("up");
        lastY = y;
        ticking = false;
        return;
      }
      if (Math.abs(y - lastY) >= threshold) {
        setDirection(y > lastY ? "down" : "up");
        lastY = y;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold, topRange]);

  return direction;
};
