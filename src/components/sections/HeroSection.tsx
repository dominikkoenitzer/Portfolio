import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Github, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/constants";
import { useLanguage } from "@/lib/language-context";
import { DUR, EASE_OUT, REVEAL, stagger } from "@/lib/motion";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";
import { translations } from "@/lib/translations";

/** How long each name holds before the next one takes over. */
const HOLD_MS = 4000;

/**
 * The owner's names (Dominik, Punds, DK), one at a time, on a plain crossfade.
 * Reduced motion holds the first name and never cycles.
 *
 * Mounted with `key={language}` so a language switch remounts it: the index
 * belongs to one list, and resetting it from an effect is what
 * `react-hooks/set-state-in-effect` exists to stop.
 */
function Name() {
  const { language } = useLanguage();
  const { roles: names, title } = translations[language].hero;
  const [index, setIndex] = useState(0);
  const [reduceMotion] = useState(prefersReducedMotion);
  const name = names[index] ?? names[0];

  useEffect(() => {
    if (reduceMotion || names.length < 2) return;
    const cycle = setInterval(
      () => setIndex((i) => (i + 1) % names.length),
      HOLD_MS,
    );
    return () => clearInterval(cycle);
  }, [names, reduceMotion]);

  return (
    <>
      {/* Stable heading for assistive tech and crawlers; the visible name
          below is decoration and must not re-announce every few seconds. It is
          translated, so a German screen reader is not handed an English phrase
          inside a `lang="de"` document. */}
      <h1 className="sr-only">Dominik Könitzer, {title}</h1>
      {/* Both names share one grid cell, so the outgoing one is still fading
          while the next is already arriving: the biggest element on the page
          never blinks empty. `ml-[-0.07em]` cancels the face's left sidebearing
          at 115px, which otherwise hangs the name 8px off the column. */}
      <div
        aria-hidden="true"
        className="ml-[-0.07em] grid leading-none tracking-[-0.01em]"
        style={{ fontSize: "clamp(2.75rem, 8vw, 7.5rem)" }}
      >
        {reduceMotion ? (
          <span className="font-title block pb-[0.1em] text-primary">
            {name}
          </span>
        ) : (
          <AnimatePresence initial={false}>
            <motion.span
              animate={{ opacity: 1 }}
              className="font-title col-start-1 row-start-1 block pb-[0.1em] text-primary"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key={name}
              transition={{ duration: DUR.fast, ease: EASE_OUT }}
            >
              {name}
            </motion.span>
          </AnimatePresence>
        )}
      </div>
    </>
  );
}

const SOCIAL = [
  {
    href: SITE_CONFIG.github,
    label: "GitHub",
    icon: <Github className="h-[18px] w-[18px]" />,
  },
  {
    href: `mailto:${SITE_CONFIG.email}`,
    label: "Email",
    icon: <Mail className="h-[18px] w-[18px]" />,
  },
];

export function HeroSection() {
  const { language } = useLanguage();
  const t = translations[language].hero;
  const [reduceMotion] = useState(prefersReducedMotion);

  return (
    <section
      className="flex min-h-[calc(100vh-7.5rem)] flex-col justify-center sm:min-h-[calc(100vh-8.5rem)] md:min-h-[calc(100vh-11rem)]"
      id="hero"
    >
      {/* One cascade: greeting, name, tagline, links, actions. */}
      <motion.div
        animate="show"
        className="mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-16"
        initial={reduceMotion ? "show" : "hidden"}
        variants={stagger(0.1, 0.12)}
      >
        <motion.p
          className="mb-3 font-semibold text-foreground sm:mb-4"
          style={{ fontSize: "clamp(1.15rem, 2.5vw, 1.75rem)" }}
          variants={REVEAL}
        >
          {t.greeting}
        </motion.p>

        <motion.div className="mb-5 sm:mb-6 md:mb-7" variants={REVEAL}>
          <Name key={language} />
        </motion.div>

        <motion.p
          className="mb-7 max-w-xl text-balance text-foreground/85 leading-relaxed sm:mb-8"
          style={{ fontSize: "clamp(1rem, 1.6vw, 1.2rem)" }}
          variants={REVEAL}
        >
          {t.tagline}
        </motion.p>

        <motion.div
          className="mb-5 flex items-center gap-2.5 sm:mb-6 sm:gap-3"
          variants={REVEAL}
        >
          {SOCIAL.map(({ href, label, icon }) => (
            <a
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/25 text-muted-foreground transition-colors duration-200 ease-out hover:border-primary/45 hover:text-primary"
              href={href}
              key={label}
              rel="noopener noreferrer"
              target={href.startsWith("mailto") ? undefined : "_blank"}
            >
              {icon}
            </a>
          ))}
        </motion.div>

        <motion.div
          className="flex flex-wrap gap-2.5 sm:gap-3"
          variants={REVEAL}
        >
          <Button asChild className="h-10 px-6" variant="cta">
            <Link to="/contact">
              {t.hireMe}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button asChild className="h-10 px-6" variant="outline">
            <Link to="/projects">{t.viewWork}</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
