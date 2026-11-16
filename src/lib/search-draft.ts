/** The search field's own text and its writes to the address that have not arrived yet, oldest first. */
export interface SearchDraft {
  readonly text: string;
  readonly pending: readonly number[];
}

/** A field showing what the address holds. */
export const draftFrom = (query: string): SearchDraft => ({ text: query, pending: [] });

/** The field took `text` and sent it to the address as write number `write`. */
export const typed = (draft: SearchDraft, text: string, write: number): SearchDraft => ({
  text,
  pending: [...draft.pending, write],
});

/** The address now holds `query`: the field's own write keeps the typed text, any other change replaces it. */
export function addressMoved(
  draft: SearchDraft,
  query: string,
  write: number | undefined,
): SearchDraft {
  const at = write === undefined ? -1 : draft.pending.indexOf(write);
  if (at === -1) return draftFrom(query);
  return { text: draft.text, pending: draft.pending.slice(at + 1) };
}

/** The number of the field's write a history entry carries, if it carries one. */
export function fieldWrite(state: unknown): number | undefined {
  if (typeof state !== "object" || state === null) return undefined;
  const write = (state as { searchWrite?: unknown }).searchWrite;
  return typeof write === "number" ? write : undefined;
}
