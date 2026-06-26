import type { Locale } from "date-fns";
import { de, enUS, fr, zhCN } from "date-fns/locale";
import type { Language } from "@/config/languages";

/**
 * Maps the app's language code to the locale objects the date/number APIs want,
 * so dates, months and relative times render in the visitor's language instead
 * of hardcoded English.
 */

/** BCP-47 tag for Intl APIs (toLocaleDateString, Intl.NumberFormat, …). */
export const LOCALE_TAG: Record<Language, string> = {
  en: "en-US",
  de: "de-DE",
  fr: "fr-FR",
  zh: "zh-CN",
};

/** date-fns Locale for formatDistanceToNow / format. */
export const DATE_FNS_LOCALE: Record<Language, Locale> = {
  en: enUS,
  de,
  fr,
  zh: zhCN,
};
