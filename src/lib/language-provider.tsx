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

const STORAGE_KEY = "preferred-language";

const isSupported = (code: string): code is Language =>
  (SUPPORTED_LANGUAGE_CODES as readonly string[]).includes(code);

/** Reduce any raw locale tag ("en-US", "DE", "fr_CH") to a supported language. */
const toSupported = (raw: string | null | undefined): Language | null => {
  if (!raw) {
    return null;
  }
  const tag = raw.toLowerCase();
  if (isSupported(tag)) {
    return tag;
  }
  const primary = tag.split(/[-_]/)[0];
  return isSupported(primary) ? primary : null;
};

/** Walk the browser's ordered preference list and take the first we support. */
const detectFromBrowser = (): { resolved: Language; raw: string | null } => {
  if (typeof navigator === "undefined") {
    return { resolved: "en", raw: null };
  }
  const prefs =
    navigator.languages && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language];
  const raw = prefs[0] ?? null;
  for (const pref of prefs) {
    const supported = toSupported(pref);
    if (supported) {
      return { resolved: supported, raw };
    }
  }
  return { resolved: "en", raw };
};

const readStored = (): Language | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored && isSupported(stored) ? stored : null;
  } catch {
    return null;
  }
};

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  detectedLanguage: Language;
  detectedLanguageCode: string | null;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

type LanguageProviderProps = {
  children: ReactNode;
  defaultLanguage?: Language;
};

export function LanguageProvider({
  children,
  defaultLanguage = "en",
}: LanguageProviderProps) {
  const detected = useMemo(detectFromBrowser, []);

  const [language, setLanguageState] = useState<Language>(
    () => readStored() ?? detected.resolved ?? defaultLanguage
  );

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode etc. — the in-memory choice still applies */
    }
  }, []);

  // Mirror the choice across open tabs.
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue && isSupported(e.newValue)) {
        setLanguageState(e.newValue);
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  // Track the OS/browser language until the user makes an explicit choice.
  useEffect(() => {
    const onBrowserChange = () => {
      if (readStored() === null) {
        setLanguageState(detectFromBrowser().resolved);
      }
    };
    window.addEventListener("languagechange", onBrowserChange);
    return () => window.removeEventListener("languagechange", onBrowserChange);
  }, []);

  // Keep <html lang> accurate for SEO and assistive tech.
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      detectedLanguage: detected.resolved,
      detectedLanguageCode: detected.raw,
    }),
    [language, setLanguage, detected]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
};
