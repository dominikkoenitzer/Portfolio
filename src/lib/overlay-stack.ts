/**
 * Which overlay owns the next Escape.
 *
 * The site has four things that cover the page — the nav drawer, the search
 * palette, the project lightbox and the CV preview — and each binds its own
 * global key handler. They all fired on the same keypress, so one Escape
 * cleared the whole stack at once: opening the palette over the CV and pressing
 * Escape closed both, which is not what Escape means anywhere else.
 *
 * A module-level stack rather than context, for the same reason the scroll lock
 * is module-level: these components are mounted through three different
 * portals and never share a provider. Registering is `useOverlayLayer`, and a
 * handler asks `isTop` before it acts.
 */

const stack: symbol[] = [];

/** Register an open overlay. Returns its handle; pass it to {@link release}. */
export function claim(): symbol {
  startStamping();
  const id = Symbol("overlay");
  stack.push(id);
  return id;
}

/** Deregister an overlay, whether or not it is the top one. */
export function release(id: symbol): void {
  const index = stack.lastIndexOf(id);
  if (index !== -1) stack.splice(index, 1);
}

/** True when this overlay is the one in front of the visitor. */
export function isTop(id: symbol | null): boolean {
  if (!id) return false;
  return stack[stack.length - 1] === id;
}

/*
 * Every overlay's handler runs on the same keypress, and React flushes a
 * discrete event synchronously: the first handler closes its overlay, that
 * unmount releases its layer, and the next handler then reads a stack whose top
 * has already moved to it — so both closed anyway. The answer has to be fixed
 * for the whole event, so the first question asked during a keypress freezes
 * the top for every later question about the same one.
 */
const topAtEvent = new WeakMap<Event, symbol | undefined>();

/*
 * Stamped from the capture phase, before any component handler runs, because
 * asking lazily is not early enough: the palette closes itself from its own
 * handler, and by the time the dialog underneath asks, the palette has already
 * unmounted and released its layer.
 */
let stamping = false;
function startStamping(): void {
  if (stamping || typeof window === "undefined") return;
  stamping = true;
  window.addEventListener(
    "keydown",
    (event) => {
      if (!topAtEvent.has(event)) {
        topAtEvent.set(event, stack[stack.length - 1]);
      }
    },
    { capture: true },
  );
}

/** True when this overlay was in front when the event began. */
export function isTopFor(event: Event, id: symbol | null): boolean {
  if (!id) return false;
  if (!topAtEvent.has(event)) {
    // No stamp means nothing was open when the key went down.
    topAtEvent.set(event, stack[stack.length - 1]);
  }
  return topAtEvent.get(event) === id;
}

/** How many overlays are open. Exposed for tests. */
export function depth(): number {
  return stack.length;
}

/** Test seam: drop everything. */
export function reset(): void {
  stack.length = 0;
}
