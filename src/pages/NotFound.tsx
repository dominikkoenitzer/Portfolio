import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  FolderGit2,
  Mail,
  User,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { revealOnScroll } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-context";
import { REVEAL, stagger } from "@/lib/motion";
import { translations } from "@/lib/translations";

/**
 * A long junk path would otherwise set the width of the block it sits in. The
 * cut is generous enough that a real mistyped route is shown whole.
 */
const PATH_LIMIT = 80;

/**
 * The status marker. It replaces a 10px `.eyebrow`, which was the smallest
 * type on the site: this is 11px violet (6.7:1) in a bordered pill, so it is
 * legible and reads as a label rather than as a stray line of text. Violet
 * rather than sage, because a dead end is not something to signal-colour.
 */
const STATUS =
  "inline-flex items-center rounded-full border border-primary/25 bg-primary/[0.09] py-1.5 pr-3.5 pl-4 font-mono text-primary text-xs tracking-[0.2em]";

/**
 * A suggested destination. `.glass-card` earns its hover lift here: unlike the
 * panels this site used to put legal text in, these really are clickable.
 */
function Destination({
  blurb,
  icon,
  title,
  to,
}: {
  blurb: string;
  icon: ReactNode;
  title: string;
  to: string;
}) {
  return (
    <li>
      <Link
        className="glass-card group flex h-full items-start gap-3.5 rounded-2xl p-5 text-left"
        to={to}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </span>
        <span className="min-w-0">
          <span className="flex items-center gap-1.5 font-semibold text-foreground">
            {title}
            <ArrowRight
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0 text-primary transition-transform duration-200 ease-out group-hover:translate-x-0.5"
            />
          </span>
          <span className="mt-1 block text-muted-foreground text-sm leading-relaxed">
            {blurb}
          </span>
        </span>
      </Link>
    </li>
  );
}

/**
 * 404 page for unmatched routes. Default-exported for React.lazy.
 *
 * The SEO component is what marks it noindex, rather than a bare robots meta:
 * Google reads the bot-specific `googlebot` tag ahead of the generic `robots`
 * one, so setting only the latter left the page indexable. dist/404.html says
 * the same thing statically for crawlers that never run the app. Its title and
 * description stay English and byte-identical to what `scripts/prerender.ts`
 * writes for this route; only the copy on screen follows the visitor's language.
 *
 * There is deliberately no route for this page and none is needed: Vercel
 * serves dist/404.html with a real 404 status for any path with no file behind
 * it, the app boots from that file and the router's `*` case renders this.
 */
export default function NotFound() {
  const { language } = useLanguage();
  const t = translations[language].notFound;
  const nav = translations[language].nav;
  const reduceMotion = useReducedMotion();
  const { pathname } = useLocation();

  const requested =
    pathname.length > PATH_LIMIT ? `${pathname.slice(0, PATH_LIMIT)}…` : pathname;

  const destinations = [
    {
      blurb: t.destinations.projects,
      icon: <FolderGit2 className="h-[18px] w-[18px]" />,
      title: nav.projects,
      to: "/projects",
    },
    {
      blurb: t.destinations.about,
      icon: <User className="h-[18px] w-[18px]" />,
      title: nav.about,
      to: "/about",
    },
    {
      blurb: t.destinations.services,
      icon: <Briefcase className="h-[18px] w-[18px]" />,
      title: nav.services,
      to: "/services",
    },
    {
      blurb: t.destinations.contact,
      icon: <Mail className="h-[18px] w-[18px]" />,
      title: nav.contact,
      to: "/contact",
    },
  ];

  return (
    <section className="section-padding">
      <SEO
        description="This page does not exist."
        noindex
        title="Page not found"
      />
      <motion.div
        className="mx-auto w-full max-w-3xl"
        {...revealOnScroll(reduceMotion, stagger())}
      >
        <div className="flex flex-col items-center text-center">
          <motion.p variants={REVEAL}>
            <span className={STATUS}>404</span>
          </motion.p>

          <motion.h1
            className="mt-5 font-bold text-4xl sm:text-5xl"
            variants={REVEAL}
          >
            {t.title}
          </motion.h1>

          <motion.p
            className="mt-4 max-w-xl text-balance text-muted-foreground leading-relaxed"
            variants={REVEAL}
          >
            {t.body}
          </motion.p>

          {/* What was actually asked for. A 404 that does not say which URL it
              is about leaves the reader guessing at their own typo. */}
          <motion.p
            className="mt-5 flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-muted-foreground text-sm"
            variants={REVEAL}
          >
            {t.requested}
            <code className="min-w-0 max-w-full break-all rounded-md bg-muted px-2 py-1 font-mono text-[13px] text-foreground">
              {requested}
            </code>
          </motion.p>

          <motion.div className="mt-9" variants={REVEAL}>
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
        </div>

        {/* The dead end fixed: four places worth going instead of 350px of
            empty page under a single button. */}
        <motion.div
          className="mt-16 border-border/50 border-t pt-10"
          variants={REVEAL}
        >
          <h2 className="text-center font-semibold text-base text-foreground">
            {t.suggestionsHeading}
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4">
            {destinations.map((destination) => (
              <Destination
                blurb={destination.blurb}
                icon={destination.icon}
                key={destination.to}
                title={destination.title}
                to={destination.to}
              />
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
}
