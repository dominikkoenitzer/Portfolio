/**
 * Where each history entry was left, so back and forward can put the reader
 * back on the card they came from instead of at the top of a 5300px list.
 *
 * Keyed by the router's history key, which is stable across a POP to the same
 * entry, and deliberately in memory only: a reload rebuilds the document from
 * scratch, so a persisted offset would be applied to a page nobody has
 * measured yet.
 */

export type HistoryAction = "POP" | "PUSH" | "REPLACE";

/** Entries kept before the oldest is dropped. A session loses the far past, never the recent. */
const MAX_ENTRIES = 50;

const offsets = new Map<string, number>();

export function rememberOffset(key: string, offset: number): void {
  if (!key) return;
  // Re-inserting moves the key to the end, so the Map's own iteration order is
  // least-recently-touched first and the eviction below can trust it.
  offsets.delete(key);
  offsets.set(key, Number.isFinite(offset) ? Math.max(0, Math.round(offset)) : 0);
  if (offsets.size > MAX_ENTRIES) {
    const oldest = offsets.keys().next();
    if (!oldest.done) offsets.delete(oldest.value);
  }
}

export function recallOffset(key: string): number {
  return offsets.get(key) ?? 0;
}

/** Drop everything. A test seam, and what a full page load gives us for free. */
export function clearOffsets(): void {
  offsets.clear();
}

/**
 * Where a navigation has to land. Back and forward return to the offset that
 * entry was left at, a push starts at the top, and a replace must not move the
 * page at all (the projects toolbar rewrites the URL on every keystroke),
 * which is what `null` says.
 */
export function targetOffsetFor(
  action: HistoryAction,
  key: string,
): number | null {
  if (action === "REPLACE") return null;
  if (action === "POP") return recallOffset(key);
  return 0;
}

/**
 * A remembered offset can outlive the height it was taken at, because a filter
 * has since emptied the list or the copy is shorter in another language. Never
 * ask for more scroll than the incoming document can give.
 */
export function clampOffset(offset: number, maxScroll: number): number {
  if (!Number.isFinite(offset) || offset <= 0) return 0;
  if (!Number.isFinite(maxScroll) || maxScroll <= 0) return 0;
  return Math.min(offset, maxScroll);
}
