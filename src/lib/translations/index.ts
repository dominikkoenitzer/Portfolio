import { de } from "./de";
import { en } from "./en";
import { fr } from "./fr";
import { zh } from "./zh";

/** All UI copy, keyed by language code. Each language lives in its own module. */
export const translations = { en, de, fr, zh };

export type Translation = typeof en;
