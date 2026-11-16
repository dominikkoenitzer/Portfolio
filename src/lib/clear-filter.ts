type Focusable = { focus: () => void };

/** Clears a filter whose button goes with it, handing focus to the search field if the button held it and was not tapped. */
export function clearFilter(
  clear: () => void,
  heldFocus: boolean,
  searchField: Focusable | null,
  pointerType?: string,
): void {
  clear();
  if (heldFocus && pointerType !== "touch") searchField?.focus();
}
