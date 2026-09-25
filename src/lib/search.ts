/**
 * The site search matcher: pure, data-agnostic and dependency-free.
 *
 * The index itself is built in `components/search/search-index.ts` out of copy
 * that already exists in the repo (nav routes, projects, services, skills,
 * experience, FAQ). This module only knows how to score a query against a
 * record, so it can be unit-tested without React, routing or translations.
 *
 * Two passes, in this order:
 *  1. every token that carries signal has to match somewhere (with synonyms),
 *     ranked by which field the matches landed in and where;
 *  2. only if that finds nothing, the same tokens are scored by how many of
 *     them matched and how rare they are, with one typo allowed per word. That
 *     is what turns "prjects" into a destination instead of a dead end, while
 *     never letting a fuzzy hit outrank an exact one (the passes are never
 *     mixed).
 *
 * A 305-query study across the four languages drove the shape of both passes.
 * Three findings are worth keeping in mind when changing anything here:
 * a query of common words used to be decided by the commonest of them, so
 * "what do you charge" answered with the record that happened to contain
 * "what", "do" and "you"; the fallback would rank noise confidently, so
 * "zzzz-nothing-here" returned nine hits and Enter opened one of them; and a
 * Chinese compound never matched at all, because it is one token that has to
 * appear contiguously.
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
  /** The one line shown under the title. Searched below the keywords. */
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
 * Case- and accent-insensitive form. "Zürich" has to be reachable by
 * typing "zurich", which is what a visitor on a keyboard without umlauts
 * will do. ß folds to ss for the same reason.
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
/** The same class, for stripping rather than splitting. */
const SEPARATORS = /[^\p{L}\p{N}+#]+/gu;

/** The query as normalized tokens. */
export function tokenizeQuery(query: string): string[] {
  return normalizeText(query).split(TOKEN_SEPARATOR).filter(Boolean);
}

/** True for a token written in a script that does not put spaces between words. */
const isUnspaced = (token: string): boolean => !/[a-z0-9]/.test(token);

/**
 * Words a visitor and the copy can disagree about. Kept here rather than in
 * the translations, because these are search handles, not text anybody reads:
 * the copy says "price" and the visitor types "what do you charge", the copy
 * says "Werdegang" and the visitor types "experience". Groups are symmetric,
 * so any member finds any other, and members are written in normalized form
 * (no diacritics), because that is what they are matched against.
 *
 * One group serves all four languages: a member with nothing to match in the
 * active index is simply inert, so there is no need to key these by language.
 */
const ALIAS_GROUPS: readonly (readonly string[])[] = [
  ["color", "colour"],
  // "curriculum" and "vitae" are deliberately absent: "curriculum" also
  // appears in the tag "International Curriculum" on two school entries, so
  // including it put primary school under every search for a CV.
  ["cv", "resume", "lebenslauf", "简历"],
  [
    "email",
    "mail",
    "write",
    "message",
    "contact",
    "phone",
    "call",
    "kontakt",
    "kontaktieren",
    "courriel",
    "contacter",
    "联系",
    "邮箱",
  ],
  [
    "price",
    "pricing",
    "cost",
    "costs",
    "cheap",
    "rate",
    "rates",
    "charge",
    "charges",
    "quote",
    "chf",
    "preis",
    "preise",
    "kosten",
    "kostet",
    "stundensatz",
    "prix",
    "tarif",
    "tarifs",
    "cout",
    "coute",
    "combien",
    "费用",
    "价格",
    "报价",
    "多少钱",
  ],
  ["3d", "three", "threejs", "webgl"],
  ["dark", "light", "theme"],
  ["swiss", "switzerland", "schweiz", "suisse", "瑞士"],
  [
    "experience",
    "erfahrung",
    "werdegang",
    "laufbahn",
    "parcours",
    "经验",
    "履历",
  ],
  ["skills", "fahigkeiten", "kenntnisse", "competences", "技能"],
  [
    "privacy",
    "datenschutz",
    "confidentialite",
    "impressum",
    "imprint",
    "legal",
    "cookies",
    "隐私",
  ],
  [
    "donate",
    "donation",
    "tip",
    "coffee",
    "trinkgeld",
    "spenden",
    "pourboire",
    "打赏",
    "捐赠",
  ],
  [
    "hire",
    "hiring",
    "job",
    "jobs",
    "vacancy",
    "freelance",
    "engagieren",
    "einstellen",
    "embaucher",
    "招聘",
    "雇佣",
  ],
  ["process", "steps", "prozess", "ablauf", "processus", "流程"],
  ["todo", "aufgabenliste", "待办"],
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
 * Function words, which say nothing about which record a visitor wants. They
 * are still scored where they appear, so "how it works" still ranks better on
 * a record containing all three, but they can never decide the result set on
 * their own and they can never justify a fallback hit.
 *
 * A frequency threshold was tried first and does not work at this size: on a
 * 90 record index "do" appears in 30% and "to" in 36%, but "what" in only 7%,
 * which is the same neighbourhood as "cost" at 2%. There is no cut that keeps
 * "cost" and drops "what". The indefinite pronouns are in here for the same
 * reason as the articles: "zzzz-nothing-here" was answering with a project,
 * on the strength of "nothing" and "here".
 */
const STOPWORDS = new Set([
  // English
  "a", "an", "and", "any", "anything", "are", "as", "at", "be", "been", "but",
  "by", "can", "could", "did", "do", "does", "each", "everything", "for",
  "from", "get", "had", "has", "have", "here", "how", "i", "if", "in", "into",
  "is", "it", "its", "just", "me", "much", "my", "no", "not", "nothing", "of",
  "on", "or", "our", "out", "over", "should", "so", "some", "something",
  "than", "that", "the", "their", "them", "then", "there", "these", "they",
  "this", "to", "up", "us", "was", "we", "were", "what", "when", "where",
  "which", "who", "why", "will", "with", "would", "you", "your",
  // German
  "als", "auf", "aus", "bei", "das", "dass", "dem", "den", "der", "des", "die",
  "ein", "eine", "einen", "einer", "es", "fur", "hat", "ich", "ist", "kann",
  "mit", "nicht", "sie", "sind", "und", "von", "war", "was", "wie", "wird",
  "zu", "zum", "zur",
  // French
  "au", "aux", "avec", "ce", "ces", "dans", "de", "des", "du", "est", "et",
  "il", "je", "la", "le", "les", "ne", "ou", "par", "pas", "pour", "que",
  "qui", "sur", "un", "une", "vous",
]);

const isStopword = (token: string): boolean => STOPWORDS.has(token);

/**
 * What a match costs, by where it landed. The gaps are wider than the largest
 * position penalty, so a match that starts a word in a stronger field always
 * beats one that starts a word in a weaker field, whatever the offsets. The
 * mid-word penalty is deliberately larger than the whole position range, so
 * "note" inside "Node" cannot outrank "note" starting "Notepad".
 *
 * `context` is the line shown under the title, so it is stronger evidence than
 * a sentence buried in the prose. Folding the two together was measurable:
 * "to do list" answered with a security FAQ rather than with the project whose
 * tagline is literally "A to-do list and a focus timer".
 */
const FIELD_COST = { title: 0, keywords: 100, context: 150, body: 220 } as const;
const FIELDS = ["title", "keywords", "context", "body"] as const;

/** Beyond this many characters in, one match is as late as another. */
const MAX_POSITION_COST = 40;

/** A match in the middle of a word is weaker than one that starts a word. */
const MID_WORD_COST = 50;

/** A synonym is a weaker signal than the word the visitor actually typed. */
const ALIAS_COST = 12;

/** A word with the spaces taken out ("todo" against "to-do list"). */
const SQUASH_COST = 80;

/** And a word one edit away is weaker still. */
const FUZZY_COST = 60;

/** Per character dropped when retreating to the head of an unspaced token. */
const CJK_TRIM_COST = 15;

/**
 * The whole query, spaces and all, appears in the part of a record a visitor
 * can see. "to do list" is three ordinary words that half the catalogue
 * contains separately, and the record that means it is the one whose tagline
 * reads "A to-do list and a focus timer". Only ever applied to a query of more
 * than one word, so single-word ranking is untouched.
 */
const PHRASE_BONUS = 60;

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

/**
 * What a token that is present in more than half the records is worth as a
 * requirement: nothing. It still scores where it appears, it just cannot
 * decide the result set on its own.
 */
const COMMON_TOKEN_SHARE = 0.5;

/** A token this rare is specific enough to justify a fallback hit by itself. */
const RARE_TOKEN_SHARE = 0.25;

/** Missing an optional token has to cost more than matching it anywhere. */
const OPTIONAL_MISS_COST = 320;

/** A multi-word query has to be half accounted for before a hit is honest. */
const MIN_FALLBACK_COVERAGE = 0.5;

interface Prepared {
  title: string;
  keywords: string;
  context: string;
  body: string;
  /**
   * Title words and keyword words, kept apart for the typo pass, so a mistyped
   * title ranks above a mistyped keyword: "prjoects" has to answer with
   * Projects, not with whichever record happens to carry the word somewhere
   * cheaper. The prose is left out of both: a one-edit match inside a
   * paragraph is as likely to be a coincidence as an intention, and this keeps
   * the fallback cheap.
   */
  titleWords: string[];
  keywordWords: string[];
  /**
   * Title, keywords and context with every separator removed, so a query that
   * dropped a space ("todo", "vscode") can still find "to-do list" and
   * "VS Code". The prose is left out for the same reason as above: squashing a
   * paragraph invents words that were never written.
   */
  squashed: string;
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
  const context = normalizeText(record.context);
  const prepared: Prepared = {
    title,
    keywords,
    context,
    body: normalizeText((record.body ?? []).join(" ")),
    titleWords: [...new Set(title.split(TOKEN_SEPARATOR).filter(Boolean))],
    keywordWords: [
      ...new Set(keywords.split(TOKEN_SEPARATOR).filter(Boolean)),
    ],
    squashed: `${title} ${keywords} ${context}`.replace(SEPARATORS, ""),
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

/**
 * The cheapest occurrence of `token` in one field, or null. Every occurrence is
 * considered rather than the first: "e" appears mid-word in most titles long
 * before it starts one, and taking `indexOf`'s answer would score the accident
 * instead of the intention.
 */
function fieldCost(haystack: string, token: string): number | null {
  let at = haystack.indexOf(token);
  if (at < 0) return null;
  let best = Number.POSITIVE_INFINITY;
  while (at >= 0) {
    const cost =
      Math.min(at, MAX_POSITION_COST) +
      (isWordStart(haystack, at) ? 0 : MID_WORD_COST);
    if (cost < best) best = cost;
    if (best === 0) return 0;
    at = haystack.indexOf(token, at + 1);
  }
  return best;
}

/** Where this exact string sits in a record's fields, or null for nowhere. */
function directCost(prepared: Prepared, token: string): number | null {
  let best: number | null = null;
  for (const field of FIELDS) {
    const cost = fieldCost(prepared[field], token);
    if (cost === null) continue;
    const total = FIELD_COST[field] + cost;
    if (best === null || total < best) best = total;
  }
  return best;
}

interface TokenMatch {
  cost: number;
  /** True when the token did not appear as written, so it is weaker evidence. */
  fuzzy: boolean;
}

/** The cheapest way this token accounts for a record, or null for no way. */
function tokenMatch(
  prepared: Prepared,
  token: string,
  allowFuzzy: boolean,
): TokenMatch | null {
  // The literal word and its synonyms are both costed, and the cheaper wins.
  // Returning the literal match on sight is wrong when it landed somewhere
  // weak: "swiss" appears in the answer text of the Switzerland question, and
  // "Switzerland" is in its title, so taking the first hit ranked a school
  // entry above the question that is actually about working in Switzerland.
  let best = directCost(prepared, token);

  // Synonyms are looked up flat, never recursively: the groups are symmetric,
  // so following an alias's own aliases would only walk back into the group it
  // came from.
  const aliases = ALIASES.get(token);
  if (aliases) {
    for (const alias of aliases) {
      const cost = directCost(prepared, alias);
      if (cost === null) continue;
      const total = cost + ALIAS_COST;
      if (best === null || total < best) best = total;
    }
  }
  if (best !== null) return { cost: best, fuzzy: false };

  if (!allowFuzzy) return null;

  // A dropped space is not a typo, so it is not the edit pass's job.
  if (token.length >= MIN_FUZZY_LENGTH && prepared.squashed.includes(token)) {
    return { cost: FIELD_COST.keywords + SQUASH_COST, fuzzy: false };
  }

  if (isUnspaced(token)) {
    // Chinese compounds are head-initial, so retreating to the head is the
    // cheapest correct thing: 联系方式 finds 联系, 密码生成器 finds 密码. The
    // edit distance below is meaningless here, where two characters are a
    // whole word.
    for (let n = token.length - 1; n >= 2; n -= 1) {
      const cost = directCost(prepared, token.slice(0, n));
      if (cost !== null) {
        return {
          cost: cost + CJK_TRIM_COST * (token.length - n),
          fuzzy: true,
        };
      }
    }
    return null;
  }

  if (token.length >= MIN_FUZZY_LENGTH) {
    for (const word of prepared.titleWords) {
      if (withinOneEdit(token, word)) {
        return { cost: FIELD_COST.title + FUZZY_COST, fuzzy: true };
      }
    }
    for (const word of prepared.keywordWords) {
      if (withinOneEdit(token, word)) {
        return { cost: FIELD_COST.keywords + FUZZY_COST, fuzzy: true };
      }
    }
  }
  return null;
}

/** How many records each token accounts for, without any fuzzy help. */
function documentFrequency(
  records: readonly SearchRecord[],
  tokens: readonly string[],
): number[] {
  return tokens.map((token) => {
    let n = 0;
    for (const record of records) {
      if (tokenMatch(prepare(record), token, false) !== null) n += 1;
    }
    return n;
  });
}

/**
 * Which tokens a record must account for. A word carried by more than half the
 * index says nothing about which record the visitor wants, and neither does a
 * single letter sitting next to a real word, so both are scored where they
 * appear but never required. Without this, "what do you charge" is decided by
 * "what" and answers with the wrong question, and the German "e-mail" is
 * decided by "e".
 */
function requiredFlags(
  tokens: readonly string[],
  frequency: readonly number[],
  total: number,
): boolean[] {
  if (tokens.length < 2) return tokens.map(() => true);
  const hasLongToken = tokens.some((token) => token.length > 1);
  const required = tokens.map((token, i) => {
    if (isStopword(token)) return false;
    if (frequency[i] > total * COMMON_TOKEN_SHARE) return false;
    if (hasLongToken && token.length === 1) return false;
    return true;
  });
  if (required.some(Boolean)) return required;
  // Every token was a function word. Keep the rarest, so the query still
  // narrows to something instead of returning the whole index.
  let rarest = 0;
  for (let i = 1; i < tokens.length; i += 1) {
    if (frequency[i] < frequency[rarest]) rarest = i;
  }
  required[rarest] = true;
  return required;
}

/** Required tokens must land; optional ones only pay for being absent. */
function scoreRecord(
  record: SearchRecord,
  tokens: readonly string[],
  required: readonly boolean[],
  normalizedQuery: string,
  phrase: string | null,
): number | null {
  const prepared = prepare(record);
  let score = 0;
  for (let i = 0; i < tokens.length; i += 1) {
    const match = tokenMatch(prepared, tokens[i], false);
    if (match === null) {
      if (required[i]) return null;
      score += OPTIONAL_MISS_COST;
      continue;
    }
    score += match.cost;
  }
  if (phrase !== null && prepared.squashed.includes(phrase)) {
    score -= PHRASE_BONUS;
  }
  if (prepared.title === normalizedQuery) return score - EXACT_BONUS;
  if (prepared.title.startsWith(normalizedQuery)) return score - PREFIX_BONUS;
  return score;
}

const KIND_ORDER = new Map(SEARCH_KINDS.map((kind, i) => [kind, i]));

// Ties are broken by kind, then by how much title there is around the match
// (a four letter title matching "time" is likelier to be the intent than a
// forty character question), and only then by the title itself, so the same
// query always produces the same list rather than leaning on sort stability.
function byScore(a: SearchHit, b: SearchHit): number {
  if (a.score !== b.score) return a.score - b.score;
  const kind =
    (KIND_ORDER.get(a.record.kind) ?? 0) - (KIND_ORDER.get(b.record.kind) ?? 0);
  if (kind !== 0) return kind;
  const length = a.record.title.length - b.record.title.length;
  if (length !== 0) return length;
  return a.record.title.localeCompare(b.record.title);
}

/**
 * Second pass: nothing matched everything, so rank by how much of the query a
 * record does account for, weighted by rarity.
 *
 * The floor is the important part. Without one this pass answers anything:
 * "zzzz-nothing-here" found nine records through a fuzzy edit and a common
 * word, ranked them confidently, and Enter opened the first. So a hit has to
 * account for at least half of a multi-word query, and at least one of the
 * tokens it did account for has to be both rare and written as the visitor
 * typed it. A single-word query is exempt from the coverage rule, because
 * covering half of one word is not a meaningful test, and that is the query
 * shape the typo pass exists for.
 */
function fallbackSearch(
  records: readonly SearchRecord[],
  tokens: readonly string[],
  frequency: readonly number[],
): SearchHit[] {
  const total = Math.max(records.length, 1);
  const rare = frequency.map((n) => n > 0 && n <= total * RARE_TOKEN_SHARE);
  const rarity = frequency.map((n) => (n === 0 ? 0 : Math.log(1 + total / n)));
  // Function words are already gone by the time this runs, so every token here
  // is one the visitor meant. A single word is exempt from coverage: covering
  // half of one word is not a test, and a lone mistyped word is exactly what
  // this pass exists for.
  const needCoverage = tokens.length > 1;

  const hits: SearchHit[] = [];
  for (const record of records) {
    const prepared = prepare(record);
    let weight = 0;
    let cost = 0;
    let matched = 0;
    let anchored = false;
    for (let i = 0; i < tokens.length; i += 1) {
      const match = tokenMatch(prepared, tokens[i], true);
      if (match === null) continue;
      matched += 1;
      weight += rarity[i];
      cost += match.cost;
      // A token can anchor a hit when it is specific and it is really there.
      // Rarity is measured without fuzzy help, so a token nothing contains
      // scores zero frequency and cannot anchor anything.
      if (!match.fuzzy && rare[i]) anchored = true;
    }
    if (matched === 0) continue;
    if (needCoverage && matched < tokens.length * MIN_FALLBACK_COVERAGE) continue;
    if (needCoverage && !anchored) continue;
    hits.push({
      record,
      score: FALLBACK_BASE - weight * RARITY_WEIGHT + cost / tokens.length,
    });
  }
  return hits.sort(byScore);
}

/** Both passes over one already-tokenized query. */
function runPasses(
  records: readonly SearchRecord[],
  tokens: readonly string[],
  normalizedQuery: string,
): SearchHit[] {
  // Function words are dropped rather than scored. Scoring them was actively
  // harmful: "what do you charge" made every record that lacked "what" and
  // "you" pay for it, so the question that literally answers the query lost to
  // the one that happened to be phrased as a question.
  const meaningful = tokens.filter((token) => !isStopword(token));
  const query = meaningful.length > 0 ? meaningful : tokens;

  // "to-do" is two function words, and the only thing that makes it a query is
  // that they are next to each other. So when nothing but function words was
  // typed, the phrase has to be there: without this the security question won
  // on the strength of the "Do" it starts with.
  const phraseOnly = meaningful.length === 0;

  const frequency = documentFrequency(records, query);
  const required = requiredFlags(query, frequency, Math.max(records.length, 1));
  // The phrase is taken from the query as typed, function words included: it
  // is the whole thing the visitor wrote, not what is left after filtering.
  const squashedQuery = normalizedQuery.replace(SEPARATORS, "");
  const phrase =
    tokens.length > 1 && squashedQuery.length >= 4 ? squashedQuery : null;

  const hits: SearchHit[] = [];
  for (const record of records) {
    // Literal, not squashed: squashing turns any "... to do ..." in a sentence
    // into the same string as the hyphenated "to-do" the visitor typed, which
    // is how a security question came first for a to-do list.
    if (phraseOnly && directCost(prepare(record), normalizedQuery) === null) {
      continue;
    }
    const score = scoreRecord(record, query, required, normalizedQuery, phrase);
    if (score !== null) hits.push({ record, score });
  }
  if (hits.length > 0) return hits.sort(byScore);
  return fallbackSearch(records, query, frequency);
}

/**
 * A keyboard without umlauts writes them out, so "koenitzer" and
 * "faehigkeiten" have to reach "Könitzer" and "Fähigkeiten". Collapsing the
 * digraphs in `normalizeText` would be wrong (it would mangle "queue", "value"
 * and "blue"), so it happens here instead, once, and only for a query that
 * already found nothing at all.
 */
const DIGRAPHS = /ae|oe|ue/;
const collapseDigraphs = (value: string): string =>
  value.replace(/ae/g, "a").replace(/oe/g, "o").replace(/ue/g, "u");

/**
 * Every record that matches the query, best first. An empty or whitespace-only
 * query matches nothing: the dialog shows its suggestions in that state rather
 * than the whole index.
 */
export function searchRecords(
  records: readonly SearchRecord[],
  query: string,
): SearchHit[] {
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) return [];
  const normalizedQuery = normalizeText(query.trim());

  const hits = runPasses(records, tokens, normalizedQuery);
  if (hits.length > 0) return hits;

  if (DIGRAPHS.test(normalizedQuery)) {
    const collapsed = collapseDigraphs(normalizedQuery);
    if (collapsed !== normalizedQuery) {
      return runPasses(records, tokenizeQuery(collapsed), collapsed);
    }
  }
  return hits;
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
