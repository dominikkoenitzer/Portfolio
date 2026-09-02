import { useCallback, useEffect } from "react";
import { routePrefetch } from "@/lib/route-prefetch";

/**
 * Warms the chunk behind an internal link when the pointer arrives or focus
 * lands on it, so the click has nothing left to download.
 *
 * Spread `warmOnIntent(href)` onto a link that has no handlers of its own, or
 * call `warm(href)` from handlers it already has.
 */
export function useRoutePrefetch() {
  // Armed once the browser is idle. During the first load the entry chunk, the
  // fonts and the aurora all want the same bandwidth, and a page nobody has
  // asked for must not join that queue.
  useEffect(() => {
    const idle = window.requestIdleCallback;
    if (idle) {
      const id = idle(() => routePrefetch.arm(), { timeout: 3000 });
      return () => window.cancelIdleCallback?.(id);
    }
    const timer = setTimeout(() => routePrefetch.arm(), 1000);
    return () => clearTimeout(timer);
  }, []);

  const warm = useCallback((href: string) => routePrefetch.prefetch(href), []);

  const warmOnIntent = useCallback(
    (href: string) => ({
      onFocus: () => routePrefetch.prefetch(href),
      onPointerEnter: () => routePrefetch.prefetch(href),
    }),
    [],
  );

  return { warm, warmOnIntent };
}
