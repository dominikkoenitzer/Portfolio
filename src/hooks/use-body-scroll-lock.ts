import { useLenis } from "lenis/react";
import { useEffect } from "react";

/*
 * The lock is module-level, not per component, because more than one overlay
 * can hold it at once: the drawer and the palette share one flag in `Navbar`,
 * but the lightbox and the CV dialog each lock on their own. With per-instance
 * state the second lock read `window.scrollY` while the body was already
 * fixed, so it captured 0, and whichever overlay closed first wiped the
 * styles out from under the one still open, leaving the page scrolling behind
 * it and dropping the visitor back to the top on the way out. Measured: open
 * the CV at y=596, open the palette, close the CV, close the palette, land at
 * y=0. One counter and one saved offset: the styles go on at 0→1 and come off
 * at 1→0, and the offset is whatever the first holder saw.
 */
let holders = 0;
let savedScrollY = 0;
let pendingFrame: number | null = null;

const applyStyles = () => {
  const html = document.documentElement;
  const body = document.body;

  body.style.position = "fixed";
  body.style.top = `-${savedScrollY}px`;
  body.style.width = "100%";
  body.style.overflow = "hidden";
  html.style.overflow = "hidden";
};

const clearStyles = () => {
  const html = document.documentElement;
  const body = document.body;

  body.style.position = "";
  body.style.top = "";
  body.style.width = "";
  body.style.overflow = "";
  html.style.overflow = "";
};

/**
 * Locks page scroll while `locked` is true and restores the previous scroll
 * position once every holder has released it. Used by the nav drawer, the
 * search palette, the project lightbox and the CV dialog.
 */
export function useBodyScrollLock(locked: boolean) {
  const lenis = useLenis();

  useEffect(() => {
    if (!locked) {
      return;
    }

    holders += 1;

    if (holders === 1) {
      // Pause Lenis while locked: its rAF would otherwise keep writing
      // scrollTop and fight the fixed <body>. Resumed by the last release,
      // after the native scroll position is restored, so Lenis re-syncs to it.
      // No-op when Lenis is off.
      lenis?.stop();

      // Captured synchronously, applied in rAF: reading layout during commit is
      // what the frame avoids, but the position has to be the one from before
      // the body is fixed.
      savedScrollY = window.scrollY;
      pendingFrame = requestAnimationFrame(() => {
        pendingFrame = null;
        applyStyles();
      });
    }

    return () => {
      holders -= 1;
      if (holders > 0) {
        return;
      }
      holders = 0;

      // A lock→unlock inside one frame must not leave the styles applied with
      // no pending cleanup, which would freeze the page for good.
      if (pendingFrame !== null) {
        cancelAnimationFrame(pendingFrame);
        pendingFrame = null;
      }
      clearStyles();

      // Restore instantly and explicitly: a bare scrollTo would inherit the
      // page's `scroll-behavior` and could animate, which would desync Lenis on
      // the start() below (it reads the live scroll position synchronously).
      window.scrollTo({ top: savedScrollY, left: 0, behavior: "instant" });
      lenis?.start();
    };
  }, [locked, lenis]);
}
