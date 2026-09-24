import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Download,
  ExternalLink,
  Github,
  Lock,
  Search,
  SearchX,
  Wrench,
  X,
} from "lucide-react";
import { type KeyboardEvent, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getProjects,
  type PortfolioProject,
  PROJECT_CARD_SIZES,
  projectCardSrcSet,
} from "@/constants/projects";
import { useRoutePrefetch } from "@/hooks/use-route-prefetch";
import { revealOnScroll } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-context";
import { REVEAL, stagger } from "@/lib/motion";
import { translations } from "@/lib/translations";
import { SectionHeading } from "../layout/SectionHeading";
import { PrivateSource } from "./PrivateSource";

type TypeKey = "all" | "web" | "desktop";
type SortKey = "oldest" | "newest" | "az";

const PARAM_DEFAULTS: Record<string, string> = {
  q: "",
  tech: "",
  type: "all",
  sort: "newest",
};

/**
 * A desktop app is one you download and install; everything else runs in a
 * browser, hosted or local. Keyed on the download rather than the OS, because
 * a cross-platform app names three systems.
 */
const isDesktopApp = (project: PortfolioProject) => Boolean(project.downloadUrl);

/** One card surface for the whole page: opaque cream, hairline, no shadow. */
const CARD =
  "rounded-2xl border border-border/60 bg-card transition-colors duration-200 ease-out";

/**
 * Every action in a card's footer row is a link, not a button, so they cannot
 * come from the Button cva. One base class keeps them the same height (44px),
 * radius and focus behaviour; the variant only supplies the surface.
 */
const ACTION_BASE =
  "inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border px-3 font-medium text-sm transition-colors duration-200 ease-out";

const TOOLBAR =
  "flex flex-col gap-2 rounded-2xl border border-border/60 bg-card p-2 lg:flex-row lg:items-center";

/** The house keyboard-focus ring (same one the buttons and Contact use). */
const FOCUS_RING =
  "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

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
      // width from `sm` up where it sits beside the search field. The track is
      // a shade darker than the toolbar panel so the selected option reads as
      // sitting on top of it rather than floating on the page.
      className="flex w-full rounded-xl border border-border/60 bg-secondary/60 p-1 sm:w-auto"
      onKeyDown={onKeyDown}
      role="radiogroup"
    >
      {options.map((option, index) => {
        const active = option.key === value;
        return (
          <button
            aria-checked={active}
            className={`h-9 flex-1 rounded-lg px-3.5 font-medium text-sm transition-colors duration-200 ease-out sm:flex-none ${FOCUS_RING} ${
              active
                ? "bg-primary/10 text-primary"
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
  const { warmOnIntent } = useRoutePrefetch();

  // Filter/sort state lives in the URL (?q=&type=&sort=) so it survives
  // back-navigation from a detail page and can be shared as a link. Defaults
  // are kept out of the URL to leave /projects clean.
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const rawType = searchParams.get("type");
  const type: TypeKey =
    rawType === "web" || rawType === "desktop" ? rawType : "all";
  // Set by a skill chip on /skills: an exact match on what a project is built
  // with, not a text search, so "Java" never finds the JavaScript projects.
  const tech = searchParams.get("tech") ?? "";
  const rawSort = searchParams.get("sort");
  const sort: SortKey =
    rawSort === "oldest" || rawSort === "az" ? rawSort : "newest";

  const updateParams = (
    patch: Partial<Record<"q" | "type" | "sort" | "tech", string>>,
  ) => {
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
      if (tech && !project.stack.includes(tech)) return false;
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
  }, [projects, query, type, sort, tech]);

  // The grid is re-keyed per result *set* rather than per keystroke. Re-mounting
  // it is what replays the reveal after a filter or a sort, but typing
  // "spectrum" narrows to the same single card eight times in a row and used to
  // replay the whole cascade on every one of those characters.
  const resultKey = useMemo(
    () => visible.map((project) => project.slug).join("|"),
    [visible],
  );

  const typeOptions: Array<{ key: TypeKey; label: string }> = [
    { key: "all", label: t.filterAll },
    { key: "web", label: t.filterWeb },
    { key: "desktop", label: t.filterDesktop },
  ];
  const sortOptions: Array<{ key: SortKey; label: string }> = [
    { key: "newest", label: t.sortNewest },
    { key: "oldest", label: t.sortOldest },
    { key: "az", label: t.sortAZ },
  ];

  return (
    <section className="section-padding" id="projects">
      {/* Left-aligned like /donate and /contact: one left edge for the eyebrow,
          title, subtitle, disclosure and toolbar, so the whole page head reads
          as a single column. */}
      <SectionHeading
        align="left"
        subtitle={t.subheading}
        title={t.heading}
      />

      {projects.length === 0 ? (
        // The catalog is being reworked: show a clean placeholder instead of an
        // empty grid, so the page reads as intentionally in-progress.
        <motion.div
          className={`${CARD} mx-auto flex max-w-xl flex-col items-center px-8 py-16 text-center sm:py-20`}
          {...revealOnScroll(reduceMotion)}
        >
          <span className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full border border-border/60 text-primary">
            <Wrench className="h-6 w-6" />
          </span>
          <p className="mb-3 font-semibold text-foreground text-sm">{t.wipEyebrow}</p>
          <h2 className="font-bold text-xl sm:text-2xl">{t.wipTitle}</h2>
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
              <p className="mb-2 font-semibold text-foreground text-sm">{t.disclosureEyebrow}</p>
              <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                {t.disclosureBody}
              </p>
            </motion.div>

            {/* Search / filter / sort: one bar rather than three floating
                controls, so the whole toolbar reads as a single object and its
                three groups line up on one 44px baseline. */}
            <motion.div className="mb-10 sm:mb-12" variants={stagger(0, 0.06)}>
              <motion.div
                aria-label={t.toolbarLabel}
                className={TOOLBAR}
                role="search"
                variants={REVEAL}
              >
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  {/* The placeholder is the only visible label, and it
                      vanishes as soon as anything is typed, so name the field
                      and keep the placeholder at full text contrast. */}
                  <input
                    aria-label={t.searchPlaceholder}
                    className={`h-11 w-full rounded-xl border border-border/60 bg-background pr-11 pl-10 text-sm transition-colors duration-200 ease-out placeholder:text-muted-foreground focus:border-primary/40 ${FOCUS_RING}`}
                    onChange={(event) => updateParams({ q: event.target.value })}
                    placeholder={t.searchPlaceholder}
                    type="text"
                    value={query}
                  />
                  {query ? (
                    <button
                      aria-label={t.clearSearch}
                      className={`absolute top-1/2 right-1.5 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 ease-out hover:text-foreground ${FOCUS_RING}`}
                      onClick={() => updateParams({ q: "" })}
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>

                <span
                  aria-hidden
                  className="hidden h-7 w-px shrink-0 bg-border lg:block"
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

              <motion.div
                className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 pl-1"
                variants={REVEAL}
              >
                <p
                  aria-live="polite"
                  className="text-muted-foreground text-sm tabular-nums"
                >
                  {t.showingCount
                    .replace("{count}", String(visible.length))
                    .replace("{total}", String(projects.length))}
                </p>
                {tech ? (
                  <button
                    aria-label={`${t.techFilter.replace("{tech}", tech)}. ${t.clearTech}`}
                    className={`inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary text-sm transition-colors duration-200 ease-out hover:bg-primary/15 ${FOCUS_RING}`}
                    onClick={() => updateParams({ tech: "" })}
                    type="button"
                  >
                    {t.techFilter.replace("{tech}", tech)}
                    <X aria-hidden className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </motion.div>
            </motion.div>
          </motion.div>

          {visible.length === 0 ? (
            <motion.div
              className={`${CARD} mx-auto flex max-w-xl flex-col items-center px-6 py-14 text-center sm:px-10`}
              {...revealOnScroll(reduceMotion)}
            >
              <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full border border-border/60 text-primary">
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
                onClick={() =>
                  updateParams({ q: "", type: "all", sort: "newest", tech: "" })
                }
                variant="cta"
              >
                {t.resetFilters}
              </Button>
            </motion.div>
          ) : (
            /* Re-keyed per result set so the list reveals once per set instead
               of animating cards across the page to their new positions.

               `md:auto-rows-fr` is what stops re-sorting from resizing
               anything. The list was a stack of naturally sized cards, so a
               card's height was its description's line count: two distinct
               heights 22.75px apart in English at 1280 and a 67.5px spread in
               French at 1024. Equal rows make the boxes identical, so a sort
               only swaps their contents. It is `auto-rows-fr` rather than a
               `line-clamp` because no single clamp survives four languages.
               Below `md` the card is a single column seen one at a time, so
               the rows stay natural. */
            <motion.div
              className="grid grid-cols-1 gap-6 md:auto-rows-fr"
              key={resultKey}
              {...revealOnScroll(reduceMotion, stagger(0, 0.06))}
            >
              {visible.map((project, cardIndex) => (
                <motion.article
                  className={`${CARD} group overflow-hidden hover:border-primary/30`}
                  key={project.slug}
                  variants={REVEAL}
                >
                  <div className="grid md:h-full md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
                    {/* Visual panel: the picture and nothing else, at one
                        aspect ratio across every card. Naming happens once, in
                        the content column. */}
                    <figure className="relative m-0 aspect-16/10 overflow-hidden border-border/60 border-b bg-secondary/40 md:aspect-auto md:border-r md:border-b-0">
                      {project.image && !project.imageIcon ? (
                        /* Two candidates, not one. The box is 534px wide past
                           1280 and never grows, so a 1x display was decoding a
                           1600px screenshot to fill a third of its width: eleven
                           of those is 844kB on one route, 448kB of it pulled in
                           before the visitor has scrolled. `gen-card-images.ts`
                           writes the 800px copy; the original stays in the list
                           so a retina panel still gets a sharp picture. `sizes`
                           is measured, not guessed: see the script's header.

                           The first card is the LCP element on this route, and
                           `loading="lazy"` costs it a round trip, because the
                           browser will not start a lazy image until layout has
                           told it the box is on screen. The rest stay lazy. */
                        <img
                          alt={`${project.title} screenshot`}
                          className="absolute inset-0 h-full w-full object-cover object-top"
                          decoding="async"
                          fetchPriority={cardIndex === 0 ? "high" : "auto"}
                          loading={cardIndex === 0 ? "eager" : "lazy"}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                          sizes={PROJECT_CARD_SIZES}
                          src={project.image}
                          srcSet={projectCardSrcSet(
                            project.image,
                            project.imageWidth,
                          )}
                        />
                      ) : null}

                      {project.imageIcon && project.image ? (
                        <div className="flex h-full items-center justify-center p-8">
                          <img
                            alt={`${project.title} logo`}
                            className="h-20 w-20 object-contain sm:h-24 sm:w-24"
                            decoding="async"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                            src={project.image}
                          />
                        </div>
                      ) : null}
                    </figure>

                    {/* Content panel: title, date, tagline, description, tags,
                        actions, in that order and nowhere else. */}
                    <div className="flex flex-col p-5 sm:p-6">
                      <h2 className="title-serif font-semibold text-xl leading-tight sm:text-2xl">
                        {project.title}
                      </h2>
                      {/* Date and platform on one line: the type filter needs a
                          visible counterpart on the card, and a meta line is
                          quieter than a chip on top of the screenshot. */}
                      <p className="mt-1.5 text-muted-foreground text-sm">
                        {project.dateLabel} ·{" "}
                        {isDesktopApp(project) ? t.filterDesktop : t.filterWeb}
                      </p>

                      <p className="mt-4 font-medium text-base text-foreground/90 leading-snug">
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

                      {/* Three actions, or two when the project runs only
                          locally and has nothing to open or install. */}
                      <div
                        className={`mt-auto grid grid-cols-2 gap-2 border-border/60 border-t pt-4 ${
                          project.liveUrl || project.downloadUrl
                            ? "sm:grid-cols-3"
                            : ""
                        }`}
                      >
                        {project.downloadUrl ? (
                          <a
                            aria-label={t.openDownload.replace(
                              "{name}",
                              project.title,
                            )}
                            className={`${ACTION_BASE} col-span-2 border-primary/30 bg-primary/10 text-primary hover:bg-primary/15 sm:col-span-1`}
                            download
                            href={project.downloadUrl}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {t.download}
                            <Download className="h-3.5 w-3.5" />
                          </a>
                        ) : project.liveUrl ? (
                          <a
                            aria-label={t.openLive.replace(
                              "{name}",
                              project.title,
                            )}
                            className={`${ACTION_BASE} col-span-2 border-primary/30 bg-primary/10 text-primary hover:bg-primary/15 sm:col-span-1`}
                            href={project.liveUrl}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {t.live}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ) : null}
                        {project.sourcePrivate ? (
                          <PrivateSource>
                            <button
                              className={`${ACTION_BASE} border-border/60 hover:bg-secondary/60`}
                              type="button"
                            >
                              <Lock className="h-3.5 w-3.5" />
                              {t.source}
                            </button>
                          </PrivateSource>
                        ) : (
                          <a
                            aria-label={t.openRepo.replace(
                              "{name}",
                              project.title,
                            )}
                            className={`${ACTION_BASE} border-border/60 hover:bg-secondary/60`}
                            href={project.repoUrl}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            <Github className="h-3.5 w-3.5" />
                            {t.source}
                          </a>
                        )}
                        <Link
                          aria-label={t.viewDetails.replace(
                            "{name}",
                            project.title,
                          )}
                          className={`${ACTION_BASE} border-border/60 text-primary hover:border-primary/30`}
                          to={`/projects/${project.slug}`}
                          {...warmOnIntent(`/projects/${project.slug}`)}
                        >
                          {t.details}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </>
      )}
    </section>
  );
}
