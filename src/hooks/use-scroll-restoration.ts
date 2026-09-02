import { useLenis } from "lenis/react";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import {
  clampOffset,
  type HistoryAction,
  rememberOffset,
  targetOffsetFor,
} from "@/lib/scroll-memory";

/**
 * Frames we will wait for the incoming page to reach the height it was left
 * at. A cached chunk mounts in one or two; a second of budget covers a cold
 * one, and the clamp is the answer if the page is simply shorter now.
 */
const SETTLE_FRAMES = 60;

/** Frames spent checking that the jump actually took. */
const CONFIRM_FRAMES = 4;

/** Slack, in pixels, between what we asked for and what counts as landed. */
const TOLERANCE = 2;

/**
 * The live scroll offset, including while the body is locked. The mobile
 * drawer parks the page with `position: fixed; top: -Npx`, where window.scrollY
 * reads 0, so a link tapped inside the drawer would otherwise remember its
 * entry as being at the very top.
 */
function currentOffset(): number {
  const parked = document.body.style.top;
  if (document.body.style.position === "fixed" && parked) {
    const offset = Number.parseFloat(parked);
    if (Number.isFinite(offset)) return Math.abs(offset);
  }
  return window.scrollY;
}

const maxScroll = () =>
  document.documentElement.scrollHeight - window.innerHeight;

/**
 * History-aware scroll position. A fresh navigation lands at the top, back and
 * forward return to the offset that entry was left at.
 *
 * Two callbacks because the two cases need different moments. Landing at the
 * top belongs in `onExitComplete`, where the outgoing page has already faded
 * out and the incoming one has not painted. Restoring an offset can only
 * happen once the incoming page is mounted at its real height, or the jump is
 * clamped to whatever document happens to be on screen, so it hangs off
 * `onRouteReady` and then waits frame by frame for the height.
 */
export function useScrollRestoration() {
  const location = useLocation();
  const navigationType = useNavigationType() as HistoryAction;
  const lenis = useLenis();

  const entryKey = useRef(location.key);
  const pending = useRef<number | null>(null);
  // Which route the pending offset belongs to. AnimatePresence keeps the
  // outgoing page mounted through its exit, so a ready signal has to say which
  // page it is speaking for.
  const pendingPath = useRef(location.pathname);
  const settling = useRef(0);

  // Lenis owns the real window scroll, so a bare window.scrollTo would move the
  // page without telling it and its next frame would snap back to the stale
  // target. Reduced motion never mounts it, hence the native path.
  const jumpTo = useCallback(
    (offset: number) => {
      if (lenis) {
        // Lenis caches the scroll limit and only refreshes it from its own
        // ResizeObserver a frame later, so straight after a route swap it still
        // holds the outgoing page's height and clamps the jump to it. Coming
        // back to the 9200px project list from the 2300px About page landed
        // 1000px short until this re-measure went in.
        lenis.resize();
        lenis.scrollTo(offset, { immediate: true });
      } else {
        window.scrollTo(0, offset);
      }
    },
    [lenis],
  );

  // Runs in the commit that swaps the location, while the outgoing page is
  // still on screen: its live offset is exactly what the entry we are leaving
  // should be remembered at. A layout effect so no browser scroll event can
  // slip in first and record the wrong number.
  useLayoutEffect(() => {
    if (entryKey.current === location.key) return;
    const leaving = entryKey.current;
    entryKey.current = location.key;
    pendingPath.current = location.pathname;

    if (navigationType === "REPLACE") {
      // A replace drops the entry we were on, so the offset moves across to
      // the one that took its place and nothing scrolls.
      rememberOffset(location.key, currentOffset());
      pending.current = null;
      return;
    }

    rememberOffset(leaving, currentOffset());
    pending.current = targetOffsetFor(navigationType, location.key);
  }, [location.key, location.pathname, navigationType]);

  useEffect(() => () => cancelAnimationFrame(settling.current), []);

  const land = useCallback(
    (offset: number) => {
      cancelAnimationFrame(settling.current);
      pending.current = null;
      jumpTo(offset);
      rememberOffset(entryKey.current, offset);

      // Check that it took. Anything holding a cached measurement of the page
      // can silently clamp the jump, and the page is still growing while its
      // images decode, so give it a few frames to be sure rather than trust
      // one write.
      let frames = 0;
      const confirm = () => {
        frames += 1;
        const short =
          Math.abs(window.scrollY - offset) > TOLERANCE &&
          maxScroll() >= offset - TOLERANCE;
        if (short) jumpTo(offset);
        if (frames < CONFIRM_FRAMES) {
          settling.current = requestAnimationFrame(confirm);
        } else {
          settling.current = 0;
        }
      };
      settling.current = requestAnimationFrame(confirm);
    },
    [jumpTo],
  );

  /** AnimatePresence has finished with the outgoing page. */
  const onExitComplete = useCallback(() => {
    if (pending.current === 0) land(0);
  }, [land]);

  /**
   * The incoming page has committed, so the document is finally the one to
   * measure. `path` is the route the signal speaks for: the outgoing page is
   * still mounted during its exit, and its document is the wrong one to jump
   * against.
   */
  const onRouteReady = useCallback(
    (path: string) => {
      const target = pending.current;
      if (target === null || target <= 0) return;
      if (path !== pendingPath.current) return;

      cancelAnimationFrame(settling.current);
      let frames = 0;
      const settle = () => {
        const max = maxScroll();
        if (max >= target || frames >= SETTLE_FRAMES) {
          land(clampOffset(target, max));
          return;
        }
        frames += 1;
        settling.current = requestAnimationFrame(settle);
      };
      settle();
    },
    [land],
  );

  return { onExitComplete, onRouteReady };
}
