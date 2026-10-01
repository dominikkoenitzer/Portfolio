import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  LanguageContext,
  type LanguageContextValue,
} from "@/lib/language-context";
import { type Language, SUPPORTED_LANGUAGE_CODES } from "@/config/languages";
import { isTranslationLoaded, loadTranslation } from "@/lib/translations";

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

type LanguageProviderProps = {
  children: ReactNode;
  defaultLanguage?: Language;
};

export function LanguageProvider({
  children,
  defaultLanguage = "en",
}: LanguageProviderProps) {
  const detected = useMemo(() => detectFromBrowser(), []);

  const [language, setLanguageState] = useState<Language>(
    () => readStored() ?? detected.resolved ?? defaultLanguage,
  );

  // Only English ships in the entry chunk; the other languages are fetched on
  // demand (see lib/translations). Nothing renders under the provider until
  // the initial language's copy is in memory, so `translations[language]` is
  // never read before it exists. English visitors pay nothing; the others
  // wait one small request instead of seeing an English page flip over.
  const [ready, setReady] = useState(() => isTranslationLoaded(language));
  useEffect(() => {
    if (ready) return;
    let cancelled = false;
    loadTranslation(language).then(
      () => {
        if (!cancelled) setReady(true);
      },
      () => {
        // English ships in the entry chunk, so a page is always possible;
        // without this the whole site stayed blank, cursor included.
        if (cancelled) return;
        setLanguageState("en");
        setReady(true);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [language, ready]);

  // The language asked for last. Two quick picks load in parallel and can
  // resolve in either order; only the latest may take effect, or the page
  // shows one language while the other is stored.
  const latestRequest = useRef<Language>(language);

  // Every path that changes the language goes through here, so the copy is
  // always loaded before the switch is visible.
  const applyLanguage = useCallback((next: Language) => {
    latestRequest.current = next;
    loadTranslation(next).then(
      () => {
        if (latestRequest.current === next) setLanguageState(next);
      },
      () => {
        if (latestRequest.current !== next) return;
        // A tab left open across a deploy asks for a chunk that no longer
        // exists, and every retry fails the same way. The choice is already
        // stored, so a reload picks the new build up in that language; offline,
        // the page stays as it is and a later switch tries again.
        if (navigator.onLine) window.location.reload();
      },
    );
  }, []);

  const setLanguage = useCallback(
    (next: Language) => {
      applyLanguage(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* private mode etc., the in-memory choice still applies */
      }
    },
    [applyLanguage],
  );

  // Mirror the choice across open tabs.
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue && isSupported(e.newValue)) {
        applyLanguage(e.newValue);
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [applyLanguage]);

  // Track the OS/browser language until the user makes an explicit choice.
  useEffect(() => {
    const onBrowserChange = () => {
      if (readStored() === null) {
        applyLanguage(detectFromBrowser().resolved);
      }
    };
    window.addEventListener("languagechange", onBrowserChange);
    return () => window.removeEventListener("languagechange", onBrowserChange);
  }, [applyLanguage]);

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
    [language, setLanguage, detected],
  );

  return (
    <LanguageContext.Provider value={value}>
      {ready ? children : null}
    </LanguageContext.Provider>
  );
}
