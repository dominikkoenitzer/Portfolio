import { useEffect, useRef } from "react";

import { claim, isTopFor, release } from "@/lib/overlay-stack";

/**
 * Registers an overlay while `open` is true and answers whether it is the one
 * in front. A global Escape handler asks `isTopLayer()` before it acts, so one
 * keypress peels one layer instead of clearing every overlay on the page.
 *
 * Returns a predicate rather than a boolean: the handler asks at keypress time,
 * passing the event, so every overlay answering the same keypress compares
 * against the same snapshot of the stack.
 */
export function useOverlayLayer(open: boolean) {
  const idRef = useRef<symbol | null>(null);

  useEffect(() => {
    if (!open) return;
    const id = claim();
    idRef.current = id;
    return () => {
      release(id);
      idRef.current = null;
    };
  }, [open]);

  return (event: Event) => isTopFor(event, idRef.current);
}
