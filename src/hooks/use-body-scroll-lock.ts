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

    // Capture the scroll position now and restore it on unlock. Applying the
    // lock in rAF avoids a layout read during commit — but the returned id is
    // cancelled in cleanup so a quick lock→unlock can never leave the styles
    // applied with no pending cleanup (which would freeze the page for good).
    const scrollY = window.scrollY;
    const raf = requestAnimationFrame(() => {
      const html = document.documentElement;
      const body = document.body;

      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.width = "100%";
      body.style.overflow = "hidden";
      html.style.overflow = "hidden";
    });

    return () => {
      cancelAnimationFrame(raf);
      const html = document.documentElement;
      const body = document.body;

      body.style.position = "";
      body.style.top = "";
      body.style.width = "";
      body.style.overflow = "";
      html.style.overflow = "";

      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}
