import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Download,
  ExternalLink,
  Github,
  Search,
  SearchX,
  Wrench,
  X,
} from "lucide-react";
import { type KeyboardEvent, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SpotlightCard } from "@/components/effects/project-effects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProjects, type PortfolioProject } from "@/constants/projects";
import { revealOnScroll } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-context";
import {
  DUR,
  EASE_OUT,
  REVEAL,
  SPRING_SOFT,
  stagger,
  VIEWPORT,
} from "@/lib/motion";
import { translations } from "@/lib/translations";
import { SectionHeading } from "../layout/SectionHeading";

type TypeKey = "all" | "web" | "desktop";
type SortKey = "oldest" | "newest" | "az";

const PARAM_DEFAULTS: Record<string, string> = {
  q: "",
  type: "all",
  sort: "oldest",
};

/** Desktop apps ship a Windows binary; everything else is a hosted web app. */
const isDesktopApp = (project: PortfolioProject) =>
  project.operatingSystem === "Windows";

/**
 * Every action in a card's footer row is a link, not a button, so they cannot
 * come from the Button cva. One base class keeps them the same height (44px),
 * radius and focus behaviour; the variant only supplies the surface.
 */
const ACTION_BASE =
  "inline-flex h-11 items-center justify-center gap-1.5 rounded-xl px-3 font-medium text-xs backdrop-blur-sm transition-[background-color,border-color,box-shadow,color] duration-200 ease-out";

/* ------------------------------------------------------------------ */
/* Segmented control: one radiogroup, roving tabindex, arrow keys      */
/* ------------------------------------------------------------------ */

function SegmentedControl<Key extends string>({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (key: Key) => void;
  options: Array<{ key: Key; label: string }>;
  value: Key;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  // A radiogroup is a single tab stop: Tab lands on the checked option and the
  // arrow keys move between (and select) the rest, which is what a native radio
  // set does and what a row of aria-pressed buttons never did.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = options.findIndex((option) => option.key === value);
    let next = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = (current + 1) % options.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (current - 1 + options.length) % options.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = options.length - 1;
    }
    if (next < 0) return;
    event.preventDefault();
    onChange(options[next].key);
    refs.current[next]?.focus();
  };

  return (
    <div
      aria-label={label}
      // Full width on a phone (two tidy rows beat two ragged ones), intrinsic
      // width from `sm` up where it sits beside the search field.
      className="flex w-full rounded-xl border border-border/40 bg-secondary/50 p-1 backdrop-blur-sm sm:w-auto"
      onKeyDown={onKeyDown}
      role="radiogroup"
    >
      {options.map((option, index) => {
        const active = option.key === value;
        return (
          <button
            aria-checked={active}
            className={`relative h-9 flex-1 rounded-lg px-3.5 font-medium text-xs transition-[color,background-color,box-shadow] duration-200 ease-out sm:flex-none ${
              active
                ? "bg-primary/15 text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            key={option.key}
            onClick={() => onChange(option.key)}
            ref={(node) => {
              refs.current[index] = node;
            }}
            role="radio"
            tabIndex={active ? 0 : -1}
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function ProjectsSection() {
  const { language } = useLanguage();
  const t = translations[language].projects;
  const projects = getProjects(language);
  const reduceMotion = useReducedMotion();

  // Filter/sort state lives in the URL (?q=&type=&sort=) so it survives
  // back-navigation from a detail page and can be shared as a link. Defaults
  // are kept out of the URL to leave /projects clean.
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const rawType = searchParams.get("type");
  const type: TypeKey =
    rawType === "web" || rawType === "desktop" ? rawType : "all";
  const rawSort = searchParams.get("sort");
  const sort: SortKey =
    rawSort === "newest" || rawSort === "az" ? rawSort : "oldest";

  const updateParams = (patch: Partial<Record<"q" | "type" | "sort", string>>) => {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(patch)) {
      if (!value || value === PARAM_DEFAULTS[key]) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    }
    setSearchParams(next, { replace: true });
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = projects.filter((project) => {
      if (type !== "all" && (type === "desktop") !== isDesktopApp(project)) {
        return false;
      }
      if (!q) return true;
      return [
        project.title,
        project.tagline,
        project.description,
        project.year,
        project.dateLabel,
        ...project.tags,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
    // The base array is ordered by repo creation date, oldest first.
    if (sort === "newest") return [...list].reverse();
    if (sort === "az")
      return [...list].sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [projects, query, type, sort]);

  const typeOptions: Array<{ key: TypeKey; label: string }> = [
    { key: "all", label: t.filterAll },
    { key: "web", label: t.filterWeb },
    { key: "desktop", label: t.filterDesktop },
  ];
  const sortOptions: Array<{ key: SortKey; label: string }> = [
    { key: "oldest", label: t.sortOldest },
    { key: "newest", label: t.sortNewest },
    { key: "az", label: t.sortAZ },
  ];

  return (
    <section className="section-padding" id="projects">
      <SectionHeading subtitle={t.subheading} title={t.heading} />

      {projects.length === 0 ? (
        // The catalog is being reworked: show a clean placeholder instead of an
        // empty grid, so the page reads as intentionally in-progress.
        <motion.div
          className="glass-deep mx-auto flex max-w-xl flex-col items-center rounded-2xl px-8 py-16 text-center sm:py-20"
          {...revealOnScroll(reduceMotion)}
        >
          <span className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
            <Wrench className="h-6 w-6" />
          </span>
          <p className="eyebrow mb-3">{t.wipEyebrow}</p>
          <h2 className="font-bold text-2xl tracking-tight sm:text-3xl">
            {t.wipTitle}
          </h2>
          <p className="mt-4 max-w-md text-balance text-muted-foreground leading-relaxed">
            {t.wipBody}
          </p>
          <Button asChild className="mt-8 rounded-lg px-6" variant="cta">
            <Link to="/contact">{t.wipCta}</Link>
          </Button>
        </motion.div>
      ) : (
        <>
          {/* The disclosure and every toolbar control hang off one stagger
              parent, so the page head arrives as a single cascade instead of
              four independent reveals racing each other. */}
          <motion.div {...revealOnScroll(reduceMotion, stagger())}>
            <motion.div
              className="mb-10 max-w-3xl border-l-2 border-primary/35 pl-5 sm:pl-6"
              variants={REVEAL}
            >
              <p className="eyebrow mb-2.5">{t.disclosureEyebrow}</p>
              <p className="text-muted-foreground/85 text-sm leading-relaxed sm:text-base">
                {t.disclosureBody}
              </p>
            </motion.div>

            {/* Search / filter / sort: one bar rather than three floating
                controls, so the whole toolbar reads as a single object and its
                three groups line up on one 44px baseline. */}
            <motion.div className="mb-10 sm:mb-12" variants={stagger(0, 0.06)}>
              <motion.div
                aria-label={t.toolbarLabel}
                className="glass-card flex flex-col gap-2 rounded-2xl p-2 lg:flex-row lg:items-center"
                role="search"
                variants={REVEAL}
              >
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                  {/* The placeholder is the only visible label, and it
                      vanishes as soon as anything is typed, so name the field. */}
                  <input
                    aria-label={t.searchPlaceholder}
                    className="h-11 w-full rounded-xl border border-transparent bg-secondary/40 pr-11 pl-10 text-sm transition-[border-color,background-color] duration-200 ease-out placeholder:text-muted-foreground/60 focus:border-primary/40 focus:bg-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/15"
                    onChange={(event) => updateParams({ q: event.target.value })}
                    placeholder={t.searchPlaceholder}
                    type="text"
                    value={query}
                  />
                  {query ? (
                    <button
                      aria-label={t.clearSearch}
                      className="absolute top-1/2 right-1.5 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground/70 transition-colors duration-200 ease-out hover:bg-secondary hover:text-foreground"
                      onClick={() => updateParams({ q: "" })}
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>

                <span
                  aria-hidden
                  className="hidden h-7 w-px shrink-0 bg-border/60 lg:block"
                />

                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                  <SegmentedControl
                    label={t.filterLabel}
                    onChange={(key) => updateParams({ type: key })}
                    options={typeOptions}
                    value={type}
                  />
                  <SegmentedControl
                    label={t.sortLabel}
                    onChange={(key) => updateParams({ sort: key })}
                    options={sortOptions}
                    value={sort}
                  />
                </div>
              </motion.div>

              <motion.p
                aria-live="polite"
                className="mt-3 pl-1 text-muted-foreground/70 text-xs tabular-nums"
                variants={REVEAL}
              >
                {t.showingCount
                  .replace("{count}", String(visible.length))
                  .replace("{total}", String(projects.length))}
              </motion.p>
            </motion.div>
          </motion.div>

          {visible.length === 0 ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="glass-deep mx-auto flex max-w-xl flex-col items-center rounded-2xl px-6 py-14 text-center sm:px-10"
              initial={{ opacity: 0, y: 12 }}
              transition={{ duration: DUR.base, ease: EASE_OUT }}
            >
              <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
                <SearchX className="h-5 w-5" />
              </span>
              <h2 className="font-semibold text-xl tracking-tight">
                {t.noResultsTitle}
              </h2>
              {/* Echo what was actually searched: an empty state that repeats
                  the query is a state, not a dead end. */}
              {query.trim() ? (
                <p className="mt-3 max-w-sm truncate text-muted-foreground text-sm">
                  {t.noResultsQuery.replace("{query}", query.trim())}
                </p>
              ) : null}
              <p className="mt-3 max-w-sm text-muted-foreground text-sm leading-relaxed">
                {t.noResultsBody}
              </p>
              <Button
                className="mt-6 rounded-lg px-5"
                onClick={() => updateParams({ q: "", type: "all", sort: "oldest" })}
                variant="cta"
              >
                {t.resetFilters}
              </Button>
            </motion.div>
          ) : (
            /* Re-keyed per filter/sort state: the whole list swaps with a
               quick fade-and-rise. The previous version gave every card
               `layout` + popLayout exits, so re-sorting sent full-height
               cards flying across the page to their new positions, and quick
               switches interrupted them mid-flight. */
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
              initial={{ opacity: 0, y: 12 }}
              key={`${query}|${type}|${sort}`}
              transition={{ duration: DUR.fast, ease: EASE_OUT }}
            >
              {/* Entrance and hover live on separate elements: sharing one
                  would make the card's staggered entrance delay apply to the
                  hover lift in both directions. `.glass-deep` also transitions
                  transform in CSS, which would fight the spring writing
                  transform every frame, so the utility narrows the card's own
                  transition to the colour properties. */}
              {visible.map((project, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  key={project.slug}
                  transition={{
                    duration: DUR.slow,
                    delay: 0.06 + Math.min(index, 6) * 0.08,
                    ease: EASE_OUT,
                  }}
                  viewport={VIEWPORT}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <motion.article
                    className="glass-deep group relative transform-gpu overflow-hidden rounded-2xl transition-[box-shadow,border-color] duration-300 ease-out"
                    transition={SPRING_SOFT}
                    whileHover={reduceMotion ? undefined : { y: -4 }}
                  >
                    {/* The same cursor-following highlight the detail page
                        uses, at its lower glow. It lives inside the article so
                        the card's own overflow clips it to the rounded corners
                        and so it rides along with the hover lift. */}
                    <SpotlightCard className="rounded-[inherit]" glow={0.14}>
                      {/* Top animated border */}
                      <span className="absolute top-0 left-0 z-10 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-primary via-primary/70 to-primary/30 transition-transform duration-500 ease-out group-hover:scale-x-100" />

                      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
                        {/* Visual panel. The screenshot used to sit under the
                            title and the full tag list, which needed a heavy
                            scrim to stay legible and left the image as mush.
                            Naming happens once, in the content column; the
                            panel is now just the picture, at one aspect ratio
                            across every card. */}
                        <figure className="shimmer-on-hover relative m-0 aspect-[16/10] overflow-hidden border-border/20 border-b md:aspect-auto md:border-r md:border-b-0">
                          <div className={`absolute inset-0 ${project.toneClass}`} />
                          <div className="absolute inset-0 bg-[linear-gradient(135deg,_transparent_20%,_hsl(var(--foreground)/0.025)_50%,_transparent_80%)]" />
                          <div className="absolute inset-0 opacity-40 [background:repeating-linear-gradient(135deg,transparent,transparent_22px,hsl(var(--foreground)/0.025)_22px,hsl(var(--foreground)/0.025)_23px)]" />

                          {project.image && !project.imageIcon ? (
                            <>
                              <img
                                alt={`${project.title} screenshot`}
                                className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                                src={project.image}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
                            </>
                          ) : null}

                          {project.imageIcon && project.image ? (
                            <div className="relative flex h-full items-center justify-center p-8">
                              <img
                                alt={`${project.title} logo`}
                                className="h-20 w-20 object-contain drop-shadow-xl transition-transform duration-300 ease-out group-hover:scale-105 sm:h-24 sm:w-24"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                                src={project.image}
                              />
                            </div>
                          ) : null}

                          {/* Platform chip, so the type filter has a visible
                              counterpart on the card itself. */}
                          <Badge
                            className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm"
                            variant="default"
                          >
                            {isDesktopApp(project) ? t.filterDesktop : t.filterWeb}
                          </Badge>

                          {/* Hairline inset ring: frames the image against the
                              card without adding a second visible border. */}
                          <span
                            aria-hidden
                            className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_hsl(var(--foreground)/0.06)]"
                          />
                        </figure>

                        {/* Content panel: title, date, tagline, description,
                            tags, actions, in that order and nowhere else. */}
                        <div className="relative flex flex-col p-5 sm:p-6">
                          <span
                            aria-hidden
                            className="pointer-events-none absolute top-2 right-4 select-none font-bold font-mono text-6xl text-foreground/[0.05] leading-none sm:text-7xl"
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <div className="relative">
                            <h2 className="font-semibold text-xl leading-tight tracking-tight sm:text-2xl">
                              {project.title}
                            </h2>
                            <p className="mt-1.5 font-medium text-[11px] text-muted-foreground/70 uppercase tracking-[0.18em]">
                              {project.dateLabel}
                            </p>
                          </div>

                          <p className="relative mt-4 font-medium text-base text-foreground/90 leading-snug">
                            {project.tagline}
                          </p>
                          <p className="mt-2.5 text-muted-foreground text-sm leading-relaxed">
                            {project.description}
                          </p>

                          <div className="mt-5 mb-6 flex flex-wrap gap-1.5">
                            {project.tags.map((tag) => (
                              <Badge key={tag}>{tag}</Badge>
                            ))}
                          </div>

                          <div className="mt-auto grid grid-cols-2 gap-2 border-border/25 border-t pt-4 sm:grid-cols-3">
                            {project.downloadUrl ? (
                              <a
                                aria-label={t.openDownload.replace(
                                  "{name}",
                                  project.title,
                                )}
                                className={`${ACTION_BASE} col-span-2 bg-primary/10 text-primary hover:bg-primary/20 hover:shadow-[0_2px_12px_hsl(var(--primary)/0.2)] sm:col-span-1`}
                                download
                                href={project.downloadUrl}
                                rel="noopener noreferrer"
                                target="_blank"
                              >
                                {t.download}
                                <Download className="h-3.5 w-3.5" />
                              </a>
                            ) : (
                              <a
                                aria-label={t.openLive.replace(
                                  "{name}",
                                  project.title,
                                )}
                                className={`${ACTION_BASE} col-span-2 bg-primary/10 text-primary hover:bg-primary/20 hover:shadow-[0_2px_12px_hsl(var(--primary)/0.2)] sm:col-span-1`}
                                href={project.liveUrl}
                                rel="noopener noreferrer"
                                target="_blank"
                              >
                                {t.live}
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            )}
                            <a
                              aria-label={t.openRepo.replace(
                                "{name}",
                                project.title,
                              )}
                              className={`${ACTION_BASE} border border-border/40 bg-secondary/50 hover:border-border/70 hover:bg-secondary`}
                              href={project.repoUrl}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              <Github className="h-3.5 w-3.5" />
                              {t.source}
                            </a>
                            <Link
                              aria-label={t.viewDetails.replace(
                                "{name}",
                                project.title,
                              )}
                              className={`${ACTION_BASE} border border-border/40 bg-background/60 text-primary hover:border-primary/30 hover:bg-primary/[0.06]`}
                              to={`/projects/${project.slug}`}
                            >
                              {t.details}
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </SpotlightCard>
                  </motion.article>
                </motion.div>
              ))}
            </motion.div>
          )}
        </>
      )}
    </section>
  );
}
