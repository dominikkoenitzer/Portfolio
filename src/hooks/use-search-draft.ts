import { useState } from "react";
import { useLocation } from "react-router-dom";
import { addressMoved, draftFrom, fieldWrite, typed } from "@/lib/search-draft";

// Seeded from the clock so that history entries left by an earlier page load never carry a current number.
let lastWrite = Date.now();
const nextWrite = () => ++lastWrite;

/** The text a search field shows while it writes each key to the address, which the router applies later in a transition. */
export function useSearchDraft(query: string) {
  const location = useLocation();
  const [state, setState] = useState(() => ({ at: location.key, draft: draftFrom(query) }));

  let { draft } = state;
  if (state.at !== location.key) {
    draft = addressMoved(draft, query, fieldWrite(location.state));
    setState({ at: location.key, draft });
  }

  /** Takes a key's text and returns the history state its write to the address carries. */
  const type = (text: string) => {
    const write = nextWrite();
    setState((current) => ({ ...current, draft: typed(current.draft, text, write) }));
    return { searchWrite: write };
  };

  return [draft.text, type] as const;
}
