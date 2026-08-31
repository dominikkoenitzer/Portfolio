import type { Language } from "@/config/languages";
import type { de } from "./de";
import { en } from "./en";
import type { fr } from "./fr";
import type { zh } from "./zh";

// `en` is declared `as const`, so `typeof en` pins every value to a string literal
// ("About" and friends), and each other language pins different literals. Components read
// `translations[lang]` against this `Translation` type, so we widen the leaf literals to
// their base types; otherwise e.g. de's "Über mich" is not assignable to en's "About".
type WidenLeaves<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? readonly WidenLeaves<U>[]
        : { [K in keyof T]: WidenLeaves<T[K]> };

export type Translation = WidenLeaves<typeof en>;

/**
 * Compile-time only: a missing or mistyped key in any language module still
 * fails `bun run typecheck` at the source. The modules are imported as types
 * above, so this check costs the bundle nothing.
 */
type MatchesEnglish<T extends Translation> = T;
export type LanguageShapes = [
  MatchesEnglish<typeof de>,
  MatchesEnglish<typeof fr>,
  MatchesEnglish<typeof zh>,
];

/**
 * All UI copy, keyed by language code. English ships in the entry chunk; the
 * other three modules (about 17 kB each, minified) are fetched on demand by
 * `loadTranslation`, which `LanguageProvider` awaits before it ever exposes a
 * language, so `translations[language]` is always populated wherever
 * `useLanguage()` can be called. Nothing else may index a language it has not
 * loaded; scripts that need every language import the modules directly.
 */
const table: Partial<Record<Language, Translation>> = { en };
// Typed as complete because the provider guarantees it is, for the language
// any component can observe; `isTranslationLoaded` is the honest check.
export const translations = table as Record<Language, Translation>;

const loaders: Record<Exclude<Language, "en">, () => Promise<Translation>> = {
  de: () => import("./de").then((m) => m.de),
  fr: () => import("./fr").then((m) => m.fr),
  zh: () => import("./zh").then((m) => m.zh),
};

/** True once `translations[lang]` can be read synchronously. */
export const isTranslationLoaded = (lang: Language): boolean =>
  translations[lang] !== undefined;

const pending = new Map<Language, Promise<void>>();

/** Fetch a language module once and store it in `translations`. */
export function loadTranslation(lang: Language): Promise<void> {
  if (isTranslationLoaded(lang)) return Promise.resolve();
  const inFlight = pending.get(lang);
  if (inFlight) return inFlight;
  const load = loaders[lang as Exclude<Language, "en">]().then((loaded) => {
    translations[lang] = loaded;
    pending.delete(lang);
  });
  pending.set(lang, load);
  return load;
}
