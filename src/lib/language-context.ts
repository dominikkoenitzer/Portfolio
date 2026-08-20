import { createContext, useContext } from "react";
import type { Language } from "@/config/languages";

/**
 * The context and its hook live apart from `LanguageProvider` so that the
 * provider module exports nothing but the component. A module that exports both
 * a component and a hook loses Fast Refresh for every consumer of that hook —
 * which here is most of the site.
 */
export type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  detectedLanguage: Language;
  detectedLanguageCode: string | null;
};

export const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
};
