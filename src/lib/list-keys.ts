import type { KeyboardEvent } from "react";

/**
 * The row ArrowDown, ArrowUp, Home and End move to in a list of `count` rows,
 * wrapping at both ends, or null for any other key. `from` is -1 when no row
 * has focus.
 */
export function listKeyTarget(key: string, from: number, count: number): number | null {
  if (count === 0) return null;
  switch (key) {
    case "Home":
      return 0;
    case "End":
      return count - 1;
    case "ArrowDown":
      return (from + 1) % count;
    case "ArrowUp":
      return from < 0 ? count - 1 : (from - 1 + count) % count;
    default:
      return null;
  }
}

/**
 * Radix gives a popover focus but no roving movement, so a list of plain
 * buttons inside one could only be walked with Tab. Put this on the element
 * that holds the buttons.
 */
export function moveFocusInList(e: KeyboardEvent<HTMLElement>) {
  const items = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>("button"));
  const next = listKeyTarget(e.key, items.indexOf(document.activeElement as HTMLButtonElement), items.length);
  if (next === null) return;
  e.preventDefault();
  items[next]?.focus();
}
