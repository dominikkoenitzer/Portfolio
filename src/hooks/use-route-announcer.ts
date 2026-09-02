import { useCallback, useEffect, useRef } from "react";

/** Frames to wait for Helmet to write the new title before announcing anyway. */
const TITLE_FRAMES = 10;

/**
 * Tells a screen reader which page a client-side navigation landed on.
 *
 * A real page load makes the browser read the new document title; swapping a
 * route is silent, so the title Helmet has just written is echoed into one
 * polite region. The title rather than the page heading, because the heading
 * is already on screen and would be read twice.
 *
 * Returns the ref for that region and the `announce` call the route makes once
 * it has mounted. Never fires on first load: the browser has already said it.
 */
export function useRouteAnnouncer(pathname: string) {
  const liveRef = useRef<HTMLParagraphElement>(null);
  const armed = useRef(false);
  const seen = useRef(pathname);
  const frame = useRef(0);

  useEffect(() => {
    if (seen.current === pathname) return;
    seen.current = pathname;
    armed.current = true;
  }, [pathname]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const announce = useCallback(() => {
    if (!armed.current) return;
    armed.current = false;

    // Helmet applies the head from its own animation frame, so right now the
    // title is still the previous page's. Wait for it to turn over, and give
    // up after a short budget rather than stay silent if two routes ever
    // happen to share a title.
    const previous = document.title;
    let frames = 0;
    const speak = () => {
      if (document.title !== previous || frames >= TITLE_FRAMES) {
        // Written straight to the node: a live region announces a text
        // mutation, and this way the region itself never re-renders.
        if (liveRef.current) liveRef.current.textContent = document.title;
        return;
      }
      frames += 1;
      frame.current = requestAnimationFrame(speak);
    };
    frame.current = requestAnimationFrame(speak);
  }, []);

  return { announce, liveRef };
}
