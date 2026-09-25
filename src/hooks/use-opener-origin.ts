import { type RefObject, useLayoutEffect } from "react";

/**
 * The control most recently pressed, remembered for a moment. A click does not
 * focus a button in Safari, so `document.activeElement` alone cannot say what
 * opened an overlay; the pointer can.
 */
let lastPress: { el: Element; at: number } | null = null;

if (typeof window !== "undefined") {
  window.addEventListener(
    "pointerdown",
    (event) => {
      const el = (event.target as Element | null)?.closest?.(
        "button, a, [role='button']",
      );
      if (el) lastPress = { el, at: performance.now() };
    },
    { capture: true, passive: true },
  );
}

function openerRect(): DOMRect | null {
  if (
    lastPress &&
    lastPress.el.isConnected &&
    performance.now() - lastPress.at < 1500
  ) {
    return lastPress.el.getBoundingClientRect();
  }
  const active = document.activeElement;
  if (active && active !== document.body) return active.getBoundingClientRect();
  return null;
}

/**
 * Points a panel's `transform-origin` at the control that opened it, so a
 * scale-in grows out of that control and the scale-out on close returns into
 * it, the way iOS opens an app from its icon. Runs before paint, when the
 * panel is already drawn at its initial scale; scaling happens around the
 * centre, so the centre of the measured box is exact and the unscaled size
 * comes from `offsetWidth` and `offsetHeight`.
 */
export function useOpenerOrigin(
  ref: RefObject<HTMLElement | null>,
  active = true,
) {
  useLayoutEffect(() => {
    if (!active) return;
    const panel = ref.current;
    const from = openerRect();
    if (!panel || !from) return;
    const box = panel.getBoundingClientRect();
    const left = box.left + box.width / 2 - panel.offsetWidth / 2;
    const top = box.top + box.height / 2 - panel.offsetHeight / 2;
    const x = from.left + from.width / 2 - left;
    const y = from.top + from.height / 2 - top;
    panel.style.transformOrigin = `${x}px ${y}px`;
  }, [ref, active]);
}
