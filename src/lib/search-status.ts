import { fillTemplate } from "./fill-template";

export interface SearchStatusCopy {
  noResults: string;
  results: string;
  resultsOne: string;
}

/**
 * What the search's live region reads. A query with no hits gets the same
 * sentence the panel shows, not a count of the suggested routes under it.
 */
export function searchStatus(
  copy: SearchStatusCopy,
  query: string,
  count: number,
  showingSuggestions: boolean,
): string {
  if (query && showingSuggestions) {
    return fillTemplate(copy.noResults, "query", query);
  }
  return count === 1
    ? copy.resultsOne
    : fillTemplate(copy.results, "count", String(count));
}
