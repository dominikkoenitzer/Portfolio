import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "@/constants/projects";
import { revealOnScroll } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-context";
import { REVEAL, stagger } from "@/lib/motion";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";

/** How many projects the home page shows before handing over to /projects. */
const FEATURED = 3;

/**
 * The home page was the hero and nothing else: one screen that said who the
 * owner is and not one word about the work, so a visitor's only route to a
 * project was the nav. This is the second screen: three projects, then a door
 * to the rest.
 *
 * Default-exported and `React.lazy`-loaded from `Home` on purpose. Home is the
 * one page that is *not* lazy, so importing `constants/projects` from it
 * directly would drag every project's content, in all four languages, into the
 * entry chunk, the exact +281 kB regression `CLAUDE.md` warns about. As its
 * own chunk it is fetched after first paint and never blocks the hero.
 */
export default function HomeWorkSection() {
  const { language } = useLanguage();
  const t = translations[language];
  const reduceMotion = useReducedMotion();

  // `priority` is the owner's own running order, so the home page leads with
  // whatever /projects leads with rather than inventing a second ranking.
  // `image` is optional on the type, and a card here is mostly its screenshot,
  // so anything without one is skipped rather than shown as an empty frame.
  const featured = useMemo(
    () =>
      getProjects(language)
        .filter((project) => Boolean(project.image))
        .sort((a, b) => a.priority - b.priority)
        .slice(0, FEATURED),
    [language],
  );

  return (
    <section className="section-padding" id="selected-work">
      <motion.div
        className="mx-auto w-full max-w-7xl"
        {...revealOnScroll(reduceMotion, stagger())}
      >
        <motion.div
          className="mb-9 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 sm:mb-11"
          variants={REVEAL}
        >
          <div className="max-w-xl">
            <p className="eyebrow mb-2.5">{t.home.workEyebrow}</p>
            <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
              {t.home.workHeading}
            </h2>
            <p className="mt-3 text-balance text-muted-foreground leading-relaxed">
              {t.home.workBody}
            </p>
          </div>

          {/* Sits with the heading on desktop and drops under it on a phone,
              so the section reads header-then-grid at every width. */}
          <Link
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-sm font-medium text-primary text-sm transition-colors duration-200 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            to="/projects"
          >
            {t.home.workCta}
            <ArrowRight
              aria-hidden
              className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
            />
          </Link>
        </motion.div>

        <motion.ul
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          variants={stagger(0, 0.08)}
        >
          {featured.map((project) => (
            <motion.li key={project.slug} variants={REVEAL}>
              <Link
                className="group block h-full overflow-hidden rounded-2xl border border-border/50 bg-card/60 transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                to={`/projects/${project.slug}`}
              >
                {/* Fixed aspect box with intrinsic dimensions on the image:
                    the row reserves its height before the file arrives, so
                    nothing below it moves when the screenshots load. */}
                <span className="block aspect-[16/10] overflow-hidden border-border/40 border-b bg-secondary/40">
                  <img
                    // Named rather than empty: the link text already carries
                    // the title for a screen reader, but an empty alt also
                    // opts the screenshot out of image search, and these are
                    // the only pictures of the work on the highest-authority
                    // page. Same wording as the cards on /projects.
                    alt={`${project.title} screenshot`}
                    className={cn(
                      "h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]",
                      // A few projects carry a square app icon rather than a
                      // screenshot; cropping one to 16:10 cuts its corners off.
                      project.imageIcon
                        ? "object-contain p-8"
                        : "object-cover object-top",
                    )}
                    decoding="async"
                    height={1000}
                    loading="lazy"
                    src={project.image}
                    width={1600}
                  />
                </span>
                <span className="flex flex-col gap-1.5 p-5">
                  <span className="flex items-center gap-1.5 font-semibold tracking-tight">
                    {project.title}
                    <ArrowRight
                      aria-hidden
                      className="h-3.5 w-3.5 shrink-0 text-primary opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </span>
                  <span className="line-clamp-2 text-muted-foreground text-sm leading-relaxed">
                    {project.tagline}
                  </span>
                </span>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}
