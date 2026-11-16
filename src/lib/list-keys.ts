import type { KeyboardEvent } from "react";

// The row an arrow, Home or End moves to, wrapping at both ends; from is -1 when no row has focus.
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

// Radix gives a popover focus but no roving movement, so its plain buttons were reachable by Tab alone.
export function moveFocusInList(e: KeyboardEvent<HTMLElement>) {
  const items = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>("button"));
  const next = listKeyTarget(e.key, items.indexOf(document.activeElement as HTMLButtonElement), items.length);
  if (next === null) return;
  e.preventDefault();
  items[next]?.focus();
}
