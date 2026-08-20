/**
 * Line-packing for the timeline's tag chips.
 *
 * The chips are a wrapping flex row, so how many of them fit is a question
 * about the *rendered* widths at the current viewport — not a fixed count. The
 * component measures the chips off-layout and asks these functions how many to
 * keep; whatever is left over goes behind the "+N" chip, which reveals it.
 *
 * Kept free of the DOM so the arithmetic is unit-testable: the test suite runs
 * on the node environment, without jsdom.
 */

export interface FitTagsInput {
  /** Rendered width of every chip, in source order, in px. */
  widths: number[];
  /** Rendered width of the widest "+N" chip that could be needed, in px. */
  badgeWidth: number;
  /** Inner width of the row the chips wrap inside, in px. */
  containerWidth: number;
  /** Flex `gap` between chips, in px. */
  gap: number;
  /** How many rows of chips the card is willing to show. */
  maxRows: number;
}

/** Rows a wrapping flex row of these widths needs. Mirrors the browser's greedy wrap. */
export function rowsNeeded(
  widths: number[],
  containerWidth: number,
  gap: number,
): number {
  let rows = 1;
  let used = 0;

  for (const width of widths) {
    const extended = used === 0 ? width : used + gap + width;
    if (extended <= containerWidth || used === 0) {
      // A chip wider than the row still occupies one on its own.
      used = extended;
      continue;
    }
    rows++;
    used = width;
  }

  return rows;
}

/**
 * How many chips to render before the "+N" one. Returns every chip when they
 * all fit — the badge only appears when the row genuinely runs out of space,
 * and the space it needs for itself is reserved before the cut is made.
 */
export function fitTags({
  widths,
  badgeWidth,
  containerWidth,
  gap,
  maxRows,
}: FitTagsInput): number {
  // Nothing measured yet (first paint, or a hidden card): show everything
  // rather than collapsing to a badge that would immediately be wrong.
  if (containerWidth <= 0) return widths.length;

  if (rowsNeeded(widths, containerWidth, gap) <= maxRows) return widths.length;

  for (let visible = widths.length - 1; visible > 0; visible--) {
    const withBadge = [...widths.slice(0, visible), badgeWidth];
    if (rowsNeeded(withBadge, containerWidth, gap) <= maxRows) return visible;
  }

  return 0;
}
