type Holder<T> = { ownerDocument: { activeElement: T | null }; contains: (node: T | null) => boolean };
type Target = { focus: (options?: FocusOptions) => void };

/** Runs a press that removes or disables its own control; if that control held the focus, `to` takes it, so the keys stay in the demo. */
export function keepFocus<T>(from: Holder<T> | null | undefined, to: Target | null | undefined, press?: () => void): void {
  const held = from ? from.contains(from.ownerDocument.activeElement) : false;
  press?.();
  if (held) to?.focus({ preventScroll: true });
}
