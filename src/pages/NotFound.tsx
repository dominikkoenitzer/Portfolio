import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { revealOnScroll } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-context";
import { REVEAL, stagger } from "@/lib/motion";
import { translations } from "@/lib/translations";

/**
 * 404 page for unmatched routes. Default-exported for React.lazy.
 *
 * The SEO component is what marks it noindex, rather than a bare robots meta:
 * Google reads the bot-specific `googlebot` tag ahead of the generic `robots`
 * one, so setting only the latter left the page indexable. dist/404.html says
 * the same thing statically for crawlers that never run the app. Its title and
 * description stay English and byte-identical to what `scripts/prerender.ts`
 * writes for this route; only the copy on screen follows the visitor's language.
 */
export default function NotFound() {
  const { language } = useLanguage();
  const t = translations[language].notFound;
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-padding flex min-h-[60vh] flex-col items-center justify-center text-center">
      <SEO
        description="This page does not exist."
        noindex
        title="Page not found"
      />
      <motion.div
        className="flex max-w-xl flex-col items-center"
        {...revealOnScroll(reduceMotion, stagger())}
      >
        <motion.p className="eyebrow" variants={REVEAL}>
          404
        </motion.p>
        <motion.h1
          className="mt-4 font-bold text-4xl sm:text-5xl"
          variants={REVEAL}
        >
          {t.title}
        </motion.h1>
        <motion.p
          className="mt-4 text-balance text-muted-foreground leading-relaxed"
          variants={REVEAL}
        >
          {t.body}
        </motion.p>
        <motion.div className="mt-10" variants={REVEAL}>
          {/* `size="lg"` for the 44px target; the cta variant brings the site's
              lift, sweep and glow, and the leading arrow is nudged here because
              `.btn-icon-nudge` only leans a trailing one. */}
          <Button
            asChild
            className="group rounded-lg px-6"
            size="lg"
            variant="cta"
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4 transition-transform duration-200 ease-out group-hover:-translate-x-0.5" />
              {t.cta}
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
