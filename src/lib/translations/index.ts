import { de } from "./de";
import { en } from "./en";
import { fr } from "./fr";
import { zh } from "./zh";

/** All UI copy, keyed by language code. Each language lives in its own module. */
export const translations = { en, de, fr, zh };

// `en` is declared `as const`, so `typeof en` pins every value to a string literal
// ("About", …) — and each other language pins *different* literals. Components read
// `translations[lang]` (a union of all four) against this `Translation` type, so we
// widen the leaf literals to their base types; otherwise e.g. de's "Über mich" is
// not assignable to en's "About".
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
