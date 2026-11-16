type Focusable = { focus: () => void };

/** Clears a filter whose button goes with it, handing focus to the search field if the button held it. */
export function clearFilter(
  clear: () => void,
  heldFocus: boolean,
  searchField: Focusable | null,
): void {
  clear();
  if (heldFocus) searchField?.focus();
}
