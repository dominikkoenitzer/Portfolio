import { useState } from "react";
import { useLocation } from "react-router-dom";
import { fieldWrite, type SearchDraft, shown, typed } from "@/lib/search-draft";

// Seeded from the clock so that history entries left by an earlier page load never carry a current number.
let lastWrite = Date.now();
const nextWrite = () => ++lastWrite;

/** The text a search field shows while the router applies its writes later; nothing is stored during render, since a cut-off transition render would leak into the next one. */
export function useSearchDraft(query: string) {
  const location = useLocation();
  const [draft, setDraft] = useState<SearchDraft | null>(null);
  const text = shown(draft, query, location.key, fieldWrite(location.state));

  /** Takes a key's text and returns the history state its write to the address carries. */
  const type = (next: string) => {
    const write = nextWrite();
    // An event handler always comes from a committed render, so this is the address the field showed.
    const at = location.key;
    setDraft((current) => typed(current, next, at, write));
    return { searchWrite: write };
  };

  return [text, type] as const;
}
