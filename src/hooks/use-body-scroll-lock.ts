import { useEffect } from "react";

/**
 * Locks page scroll while `locked` is true and restores the previous scroll
 * position on unlock. Used by the mobile nav drawer so the page behind it
 * does not move.
 */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) {
      return;
    }

    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const html = document.documentElement;
      const body = document.body;

      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.width = "100%";
      body.style.overflow = "hidden";
      html.style.overflow = "hidden";
    });

    return () => {
      const scrollY = Number.parseInt(document.body.style.top || "0", 10) * -1;
      const html = document.documentElement;
      const body = document.body;

      body.style.position = "";
      body.style.top = "";
      body.style.width = "";
      body.style.overflow = "";
      html.style.overflow = "";

      if (!Number.isNaN(scrollY)) {
        window.scrollTo(0, scrollY);
      }
    };
  }, [locked]);
}
