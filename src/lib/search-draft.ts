/** What the search field typed last, and where. */
export interface SearchDraft {
  readonly text: string;
  /** The key of the address the field showed when this text was typed. */
  readonly at: string;
  /** The number of the first write the field sent since the component mounted. */
  readonly first: number;
}

/** The field took `text` while the address `at` was showing and sent it as write number `write`. */
export const typed = (
  draft: SearchDraft | null,
  text: string,
  at: string,
  write: number,
): SearchDraft => ({ text, at, first: draft?.first ?? write });

/** The typed text while the address is the one it was typed at or one of the field's own writes; any other address shows its query. */
export function shown(
  draft: SearchDraft | null,
  query: string,
  key: string,
  write: number | undefined,
): string {
  if (draft === null) return query;
  if (key === draft.at) return draft.text;
  if (write !== undefined && write >= draft.first) return draft.text;
  return query;
}

/** The number of the field's write a history entry carries, if it carries one. */
export function fieldWrite(state: unknown): number | undefined {
  if (typeof state !== "object" || state === null) return undefined;
  const write = (state as { searchWrite?: unknown }).searchWrite;
  return typeof write === "number" ? write : undefined;
}
