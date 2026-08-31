import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { revealOnScroll } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-context";
import { REVEAL, stagger } from "@/lib/motion";
import { translations } from "@/lib/translations";

/**
 * Both icon links are the same 44px square on every pointer, so the two targets
 * match and clear the WCAG minimum without the global coarse-pointer fallback
 * having to stretch them. The lift rides the independent `translate` property
 * rather than a transform utility: these sit inside a framer subtree, and framer
 * writes a finished entrance back as an inline `transform: none` that would
 * out-rank a class rule for good (same reason as `.btn-raise` in index.css).
 */
const ICON_LINK =
  "inline-flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition-[color,translate] duration-200 ease-out hover:text-primary hover:[translate:0_-2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function Footer() {
  const { language } = useLanguage();
  const t = translations[language];
  const reduceMotion = useReducedMotion();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-border/30 border-t bg-background pb-safe">
      <motion.div
        className="mx-auto max-w-7xl px-6 py-12 sm:px-8 md:px-12 lg:px-16"
        {...revealOnScroll(reduceMotion, stagger())}
      >
        {/* Row one: who this is, and where else he is. */}
        <div className="flex flex-col items-center gap-7 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:text-left">
          <motion.div className="min-w-0" variants={REVEAL}>
            <Link
              className="rounded-sm font-bold text-xl tracking-tight transition-colors duration-200 ease-out hover:text-primary"
              to="/"
            >
              Dominik Könitzer
            </Link>
            <p className="mt-1.5 text-muted-foreground text-sm">
              {t.footer.tagline}
            </p>
          </motion.div>

          {/* The negative margin pulls the 44px squares back out to the column
              edge, so the icons stay optically aligned with the text above. */}
          <motion.div
            className="-mx-2.5 flex shrink-0 items-center gap-1 sm:mx-0 sm:-mr-2.5"
            variants={REVEAL}
          >
            <a
              aria-label="GitHub"
              className={ICON_LINK}
              href="https://github.com/dominikkoenitzer"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg
                aria-hidden="true"
                className="lucide lucide-github"
                fill="none"
                height="20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            <a
              aria-label={t.footer.journal}
              className={ICON_LINK}
              href="https://senbon.ch/"
              rel="noopener noreferrer"
              target="_blank"
              title={t.footer.journal}
            >
              <svg
                aria-hidden="true"
                className="lucide lucide-book-open"
                fill="none"
                height="20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </a>
          </motion.div>
        </div>

        {/* Row two: the hairline runs the full content width, and the legal line
            keeps a 44px target for the one link it carries. */}
        <motion.div
          className="mt-9 flex flex-col items-center gap-1 border-border/40 border-t pt-5 text-center sm:mt-10 sm:flex-row sm:justify-between sm:gap-6 sm:pt-6 sm:text-left"
          variants={REVEAL}
        >
          <p className="text-muted-foreground text-sm">
            © {currentYear} Dominik Könitzer. {t.footer.rights}
          </p>

          <Link
            className="inline-flex min-h-[44px] items-center rounded-sm text-muted-foreground text-sm transition-colors duration-200 ease-out hover:text-primary"
            to="/privacy"
          >
            {t.footer.privacyPolicy}
          </Link>
        </motion.div>
      </motion.div>
    </footer>
  );
}
