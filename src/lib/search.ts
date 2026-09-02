/**
 * The site search matcher: pure, data-agnostic and dependency-free.
 *
 * The index itself is built in `components/search/search-index.ts` out of copy
 * that already exists in the repo (nav routes, projects, services, skills,
 * experience, FAQ). This module only knows how to score a query against a
 * record, so it can be unit-tested without React, routing or translations.
 *
 * Two passes, in this order:
 *  1. every token has to match somewhere (with synonyms), ranked by where the
 *     matches landed;
 *  2. only if that finds nothing, the same tokens are scored by how many of
 *     them matched and how rare they are, with one typo allowed per word. That
 *     is what turns "what do you charge" and "prjects" into a destination
 *     instead of a dead end, while never letting a fuzzy hit outrank an exact
 *     one (the passes are never mixed).
 */

/** Group order used as the tie-break when two groups score the same. */
export const SEARCH_KINDS = [
  "page",
  "project",
  "service",
  "skill",
  "experience",
  "faq",
] as const;

export type SearchKind = (typeof SEARCH_KINDS)[number];

export interface SearchRecord {
  /**
   * Stable within one index build. It is the React key, and the option id in
   * the dialog is derived from it, so a row keeps its identity across
   * keystrokes even as its position in the list changes.
   */
  id: string;
  kind: SearchKind;
  title: string;
  /** The one line shown under the title. Searched at the weakest weight. */
  context: string;
  href: string;
  /** Short, high-signal extras: tags, a year, an organization, a slug. */
  keywords?: readonly string[];
  /** Long prose that is never shown. Searched at the weakest weight. */
  body?: readonly string[];
}

export interface SearchHit {
  record: SearchRecord;
  /** Lower is better. Only meaningful against hits from the same query. */
  score: number;
}

export interface SearchGroup {
  kind: SearchKind;
  hits: SearchHit[];
}

/**
 * Case- and accent-insensitive form. "Zürich" and "Könitzer" have to be
 * reachable by typing "zurich" and "konitzer", which is what a visitor on a
 * keyboard without umlauts will do. ß folds to ss for the same reason.
 * Decomposition leaves CJK untouched, so Chinese copy passes through as-is.
 */
export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

/*
 * Everything that is not a letter, a digit, `+` or `#` separates tokens. Two
 * things follow from writing it this way rather than splitting on spaces:
 * "C++" and "C#" survive as single tokens, and a Chinese query survives at all.
 * `\p{L}` covers Han characters, so "网站维护" stays one token instead of being
 * scrubbed away by an a-z0-9 filter or split into meaningless single glyphs.
 */
const TOKEN_SEPARATOR = /[^\p{L}\p{N}+#]+/u;

/** The query as normalized tokens, all of which a record must match. */
export function tokenizeQuery(query: string): string[] {
  return normalizeText(query).split(TOKEN_SEPARATOR).filter(Boolean);
}

/**
 * Words a visitor and the copy can disagree about. Kept here rather than in
 * the translations, because these are search handles, not text anybody reads:
 * the copy says "price" and the visitor types "what do you charge", the copy
 * says "Zürich" and an American types "color". Groups are symmetric, so any
 * member finds any other.
 */
const ALIAS_GROUPS: readonly (readonly string[])[] = [
  ["color", "colour"],
  ["cv", "resume", "lebenslauf", "curriculum", "vitae"],
  ["email", "mail", "write", "message", "contact"],
  [
    "price",
    "pricing",
    "cost",
    "costs",
    "rate",
    "rates",
    "charge",
    "charges",
    "quote",
    "chf",
  ],
  ["3d", "three", "threejs", "webgl"],
  ["dark", "light", "theme"],
];

const ALIASES = new Map<string, readonly string[]>();
for (const group of ALIAS_GROUPS) {
  for (const word of group) {
    ALIASES.set(
      word,
      group.filter((other) => other !== word),
    );
  }
}

/**
 * What a match costs, by where it landed. The gaps are wider than the largest
 * position penalty below, so a title match always beats a keyword match and a
 * keyword match always beats one in the prose, whatever the offsets.
 */
const FIELD_COST = { title: 0, keywords: 100, body: 220 } as const;
const FIELDS = ["title", "keywords", "body"] as const;

/** Beyond this many characters in, one match is as late as another. */
const MAX_POSITION_COST = 40;

/** A match in the middle of a word is weaker than one that starts a word. */
const MID_WORD_COST = 8;

/** A synonym is a weaker signal than the word the visitor actually typed. */
const ALIAS_COST = 12;

/** And a word one edit away is weaker still. */
const FUZZY_COST = 60;

/** The whole query is the start of the title, or the title exactly. */
const PREFIX_BONUS = 30;
const EXACT_BONUS = 60;

/**
 * Fallback scores start here, so they can never be compared against a first
 * pass hit by accident, and rarity outweighs position by an order of
 * magnitude inside the pass.
 */
const FALLBACK_BASE = 10_000;
const RARITY_WEIGHT = 100;

/** Below this length a typo allowance would match half the dictionary. */
const MIN_FUZZY_LENGTH = 4;

interface Prepared {
  title: string;
  keywords: string;
  body: string;
  /**
   * Title and keyword words, for the typo pass. The prose is left out: a
   * one-edit match inside a paragraph is as likely to be a coincidence as an
   * intention, and this keeps the fallback cheap.
   */
  words: string[];
}

/**
 * Normalizing every field of every record on every keystroke is wasted work:
 * the index is rebuilt only when the language changes, so the normalized form
 * is cached against the record object and dies with it.
 */
const PREPARED = new WeakMap<SearchRecord, Prepared>();

function prepare(record: SearchRecord): Prepared {
  const cached = PREPARED.get(record);
  if (cached) return cached;
  const title = normalizeText(record.title);
  const keywords = normalizeText((record.keywords ?? []).join(" "));
  const prepared: Prepared = {
    title,
    keywords,
    body: normalizeText([record.context, ...(record.body ?? [])].join(" ")),
    words: [
      ...new Set(`${title} ${keywords}`.split(TOKEN_SEPARATOR).filter(Boolean)),
    ],
  };
  PREPARED.set(record, prepared);
  return prepared;
}

/**
 * Normalize a whole index up front. The cache above would do it lazily on the
 * first query, but that puts the cost of every record on one keystroke; the
 * index is built once per language, which is where the work belongs.
 */
export function primeSearchRecords(records: readonly SearchRecord[]): void {
  for (const record of records) {
    prepare(record);
  }
}

const isWordStart = (haystack: string, at: number): boolean =>
  at === 0 || TOKEN_SEPARATOR.test(haystack[at - 1]);

/**
 * True when `a` and `b` are one edit apart: one insertion, one deletion, one
 * substitution, or one transposition of neighbours. Transposition is in there
 * because it is the typo people actually make ("prjoects"), and a plain
 * Levenshtein bound of 1 does not cover it.
 */
export function withinOneEdit(a: string, b: string): boolean {
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > 1) return false;

  const shared = Math.min(la, lb);
  let i = 0;
  while (i < shared && a[i] === b[i]) i += 1;
  // One string is a prefix of the other, so at most one character separates
  // them (the length check above already bounded that).
  if (i === shared) return true;

  if (la === lb) {
    if (a.slice(i + 1) === b.slice(i + 1)) return true;
    return (
      a[i] === b[i + 1] &&
      a[i + 1] === b[i] &&
      a.slice(i + 2) === b.slice(i + 2)
    );
  }
  return la > lb ? a.slice(i + 1) === b.slice(i) : a.slice(i) === b.slice(i + 1);
}

/** Where this exact string sits in a record's fields, or null for nowhere. */
function directCost(prepared: Prepared, token: string): number | null {
  for (const field of FIELDS) {
    const haystack = prepared[field];
    const at = haystack.indexOf(token);
    if (at < 0) continue;
    return (
      FIELD_COST[field] +
      Math.min(at, MAX_POSITION_COST) +
      (isWordStart(haystack, at) ? 0 : MID_WORD_COST)
    );
  }
  return null;
}

/** The cheapest place this token appears in a record, or null for nowhere. */
function tokenCost(
  prepared: Prepared,
  token: string,
  fuzzy: boolean,
): number | null {
  const direct = directCost(prepared, token);
  if (direct !== null) return direct;

  // Synonyms are looked up flat, never recursively: the groups are symmetric,
  // so following an alias's own aliases would only walk back into the group it
  // came from.
  const aliases = ALIASES.get(token);
  if (aliases) {
    let best: number | null = null;
    for (const alias of aliases) {
      const cost = directCost(prepared, alias);
      if (cost !== null && (best === null || cost < best)) best = cost;
    }
    if (best !== null) return best + ALIAS_COST;
  }

  if (fuzzy && token.length >= MIN_FUZZY_LENGTH) {
    for (const word of prepared.words) {
      if (withinOneEdit(token, word)) return FIELD_COST.keywords + FUZZY_COST;
    }
  }
  return null;
}

/** Every token must land somewhere; the record's score is what they cost. */
function scoreRecord(
  record: SearchRecord,
  tokens: readonly string[],
  normalizedQuery: string,
): number | null {
  const prepared = prepare(record);
  let score = 0;
  for (const token of tokens) {
    const cost = tokenCost(prepared, token, false);
    if (cost === null) return null;
    score += cost;
  }
  if (prepared.title === normalizedQuery) return score - EXACT_BONUS;
  if (prepared.title.startsWith(normalizedQuery)) return score - PREFIX_BONUS;
  return score;
}

const KIND_ORDER = new Map(SEARCH_KINDS.map((kind, i) => [kind, i]));

// Ties are broken by kind and then by title, so the same query always produces
// the same list rather than leaning on the sort's stability.
function byScore(a: SearchHit, b: SearchHit): number {
  if (a.score !== b.score) return a.score - b.score;
  const kind =
    (KIND_ORDER.get(a.record.kind) ?? 0) - (KIND_ORDER.get(b.record.kind) ?? 0);
  if (kind !== 0) return kind;
  return a.record.title.localeCompare(b.record.title);
}

/**
 * Second pass: nothing matched everything, so rank by how much of the query a
 * record does account for. Tokens are weighted by rarity, which is what keeps
 * a sentence like "what do you charge" from being decided by "what": the words
 * that appear in half the index count for little, and "charge" (a synonym of
 * "cost", which appears twice) carries the result.
 */
function fallbackSearch(
  records: readonly SearchRecord[],
  tokens: readonly string[],
): SearchHit[] {
  const costs = records.map((record) =>
    tokens.map((token) => tokenCost(prepare(record), token, true)),
  );
  const total = Math.max(records.length, 1);
  const rarity = tokens.map((_, i) => {
    const frequency = costs.reduce(
      (n, row) => n + (row[i] === null ? 0 : 1),
      0,
    );
    return frequency === 0 ? 0 : Math.log(1 + total / frequency);
  });

  const hits: SearchHit[] = [];
  records.forEach((record, r) => {
    let weight = 0;
    let cost = 0;
    let matched = 0;
    for (let i = 0; i < tokens.length; i += 1) {
      const c = costs[r][i];
      if (c === null) continue;
      matched += 1;
      weight += rarity[i];
      cost += c;
    }
    if (matched === 0) return;
    hits.push({
      record,
      score: FALLBACK_BASE - weight * RARITY_WEIGHT + cost / tokens.length,
    });
  });
  return hits.sort(byScore);
}

/**
 * Every record that matches all of the query's tokens, best first, falling
 * back to partial matches when nothing matches everything. An empty or
 * whitespace-only query matches nothing: the dialog shows its suggestions in
 * that state rather than the whole index.
 */
export function searchRecords(
  records: readonly SearchRecord[],
  query: string,
): SearchHit[] {
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) return [];
  const normalizedQuery = normalizeText(query.trim());

  const hits: SearchHit[] = [];
  for (const record of records) {
    const score = scoreRecord(record, tokens, normalizedQuery);
    if (score !== null) hits.push({ record, score });
  }
  if (hits.length > 0) return hits.sort(byScore);
  return fallbackSearch(records, tokens);
}

export interface GroupOptions {
  /** Rows kept per group. */
  perGroup?: number;
  /** Rows kept across all groups. */
  total?: number;
}

/**
 * Hits bucketed by kind, the group with the best hit first. Fixed group order
 * would be steadier to look at, but it would also bury the thing the visitor
 * typed: searching a project name has to put Projects at the top, because the
 * first row is what Enter opens.
 */
export function groupHits(
  hits: readonly SearchHit[],
  { perGroup = 4, total = 16 }: GroupOptions = {},
): SearchGroup[] {
  const byKind = new Map<SearchKind, SearchHit[]>();
  let kept = 0;
  for (const hit of hits) {
    if (kept >= total) break;
    const bucket = byKind.get(hit.record.kind);
    if (!bucket) {
      byKind.set(hit.record.kind, [hit]);
      kept += 1;
    } else if (bucket.length < perGroup) {
      bucket.push(hit);
      kept += 1;
    }
  }

  return [...byKind.entries()]
    .map(([kind, groupHitList]) => ({ kind, hits: groupHitList }))
    .sort((a, b) => {
      const best = a.hits[0].score - b.hits[0].score;
      if (best !== 0) return best;
      return (KIND_ORDER.get(a.kind) ?? 0) - (KIND_ORDER.get(b.kind) ?? 0);
    });
}
