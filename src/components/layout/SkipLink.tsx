import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";

/**
 * Visually-hidden "skip to content" link that becomes visible on keyboard focus,
 * letting keyboard/AT users jump past the nav straight to <main id="main-content">.
 * Rendered first inside the providers so it is the first thing in the tab order.
 */
export function SkipLink() {
  const { language } = useLanguage();
  return (
    <a
      className="sr-only rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground text-sm shadow-lg focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200]"
      href="#main-content"
    >
      {translations[language].nav.skipToContent}
    </a>
  );
}
