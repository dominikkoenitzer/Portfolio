import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type Language, SUPPORTED_LANGUAGE_CODES } from "@/config/languages";

type LanguageProviderProps = {
  children: ReactNode;
  defaultLanguage?: Language;
  storageKey?: string;
};

type LanguageProviderState = {
  language: Language;
  setLanguage: (language: Language) => void;
  detectedLanguage: Language;
  detectedLanguageCode: string | null;
};

const LanguageContext = createContext<LanguageProviderState | undefined>(
  undefined
);

function normalize(code: string): Language {
  const lower = code.toLowerCase();
  const base = lower.split("-")[0];
  if ((SUPPORTED_LANGUAGE_CODES as readonly string[]).includes(lower)) {
    return lower as Language;
  }
  if ((SUPPORTED_LANGUAGE_CODES as readonly string[]).includes(base)) {
    return base as Language;
  }
  return "en";
}

function getAuto(defaultLanguage: Language) {
  if (typeof window === "undefined") {
    return { matched: defaultLanguage, source: null as string | null };
  }
  const nav = window.navigator;
  const langs =
    nav.languages && nav.languages.length ? nav.languages : [nav.language];
  const first = (langs.filter(Boolean)[0] ?? defaultLanguage) as string;
  return { matched: normalize(first), source: first };
}

export function LanguageProvider({
  children,
  defaultLanguage = "en",
  storageKey = "app-language",
}: LanguageProviderProps) {
  const auto = useMemo(() => getAuto(defaultLanguage), [defaultLanguage]);

  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored =
        typeof window !== "undefined"
          ? localStorage.getItem(storageKey)
          : null;
      if (
        stored &&
        (SUPPORTED_LANGUAGE_CODES as readonly string[]).includes(stored)
      ) {
        return stored as Language;
      }
    } catch {
      /* ignore */
    }
    return auto.matched || defaultLanguage;
  });

  // Keep <html lang> in sync for SEO / a11y
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback(
    (next: Language) => {
      try {
        localStorage.setItem(storageKey, next);
      } catch {
        /* ignore */
      }
      setLanguageState(next);
    },
    [storageKey]
  );

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (
        e.key === storageKey &&
        e.newValue &&
        (SUPPORTED_LANGUAGE_CODES as readonly string[]).includes(e.newValue)
      ) {
        setLanguageState(e.newValue as Language);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey]);

  useEffect(() => {
    const handler = () => {
      const { matched } = getAuto(defaultLanguage);
      try {
        const stored = localStorage.getItem(storageKey);
        if (!stored) setLanguageState(matched);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("languagechange", handler);
    return () => window.removeEventListener("languagechange", handler);
  }, [defaultLanguage, storageKey]);

  const value = useMemo<LanguageProviderState>(
    () => ({
      language,
      setLanguage,
      detectedLanguage: auto.matched,
      detectedLanguageCode: auto.source,
    }),
    [language, setLanguage, auto.matched, auto.source]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx)
    throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
};
