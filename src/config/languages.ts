export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "zh", label: "中文" },
  { code: "fr", label: "Français" },
] as const;

export type Language = (typeof LANGUAGES)[number]["code"];
export const SUPPORTED_LANGUAGE_CODES = LANGUAGES.map((l) => l.code);
