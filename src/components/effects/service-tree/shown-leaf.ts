/** The leaf to mark: the one under the pointer, or else the one whose button has keyboard focus. */
export function shownLeaf(
  hovered: number | null,
  focusedKey: string | null,
  nodes: readonly { key: string }[],
): number | null {
  if (hovered != null) return hovered;
  if (!focusedKey) return null;
  const index = nodes.findIndex((node) => node.key === focusedKey);
  return index === -1 ? null : index;
}
