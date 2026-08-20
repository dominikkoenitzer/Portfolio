import { AnimatePresence, motion } from "framer-motion";
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
import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProjects, type PortfolioProject } from "@/constants/projects";
import { useLanguage } from "@/lib/language-context";
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

const segmentedButtonClass = (active: boolean) =>
  `rounded-lg px-3.5 py-1.5 font-medium text-xs transition-all duration-200 ${
    active
      ? "bg-primary/15 text-primary shadow-sm"
      : "text-muted-foreground hover:text-foreground"
  }`;

export function ProjectsSection() {
  const { language } = useLanguage();
  const t = translations[language].projects;
  const projects = getProjects(language);

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
        // The catalog is being reworked — show a clean placeholder instead of an
        // empty grid, so the page reads as intentionally in-progress.
        <motion.div
          className="glass-deep mx-auto flex max-w-xl flex-col items-center rounded-2xl px-8 py-16 text-center sm:py-20"
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
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
          <motion.div
            className="mb-8 max-w-3xl border-l-2 border-primary/35 pl-5 sm:mb-10 sm:pl-6"
            initial={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <p className="eyebrow mb-2.5">{t.disclosureEyebrow}</p>
            <p className="text-muted-foreground/85 text-sm leading-relaxed sm:text-base">
              {t.disclosureBody}
            </p>
          </motion.div>

          {/* Search / filter / sort toolbar */}
          <motion.div
            aria-label={t.toolbarLabel}
            className="mb-8 sm:mb-10"
            initial={{ opacity: 0, y: 16 }}
            role="search"
            transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1 lg:max-w-sm">
                <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                {/* The placeholder is the only visible label, and it
                    vanishes as soon as anything is typed — name the field. */}
                <input
                  aria-label={t.searchPlaceholder}
                  className="h-11 w-full rounded-xl border border-border/40 bg-secondary/50 pr-10 pl-10 text-sm backdrop-blur-sm transition-colors placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15"
                  onChange={(event) => updateParams({ q: event.target.value })}
                  placeholder={t.searchPlaceholder}
                  type="text"
                  value={query}
                />
                {query ? (
                  <button
                    aria-label={t.clearSearch}
                    className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-muted-foreground/60 transition-colors hover:bg-secondary hover:text-foreground"
                    onClick={() => updateParams({ q: "" })}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-3 lg:ml-auto">
                <div className="inline-flex rounded-xl border border-border/40 bg-secondary/50 p-1 backdrop-blur-sm">
                  {typeOptions.map((option) => (
                    <button
                      aria-pressed={type === option.key}
                      className={segmentedButtonClass(type === option.key)}
                      key={option.key}
                      onClick={() => updateParams({ type: option.key })}
                      type="button"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <div
                  aria-label={t.sortLabel}
                  className="inline-flex rounded-xl border border-border/40 bg-secondary/50 p-1 backdrop-blur-sm"
                  role="group"
                >
                  {sortOptions.map((option) => (
                    <button
                      aria-pressed={sort === option.key}
                      className={segmentedButtonClass(sort === option.key)}
                      key={option.key}
                      onClick={() => updateParams({ sort: option.key })}
                      type="button"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <p
                  aria-live="polite"
                  className="text-muted-foreground/70 text-xs tabular-nums"
                >
                  {t.showingCount
                    .replace("{count}", String(visible.length))
                    .replace("{total}", String(projects.length))}
                </p>
              </div>
            </div>
          </motion.div>

          {visible.length === 0 ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="glass-deep mx-auto flex max-w-xl flex-col items-center rounded-2xl px-8 py-14 text-center"
              initial={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
                <SearchX className="h-5 w-5" />
              </span>
              <h2 className="font-semibold text-xl tracking-tight">
                {t.noResultsTitle}
              </h2>
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
            <div className="space-y-5 sm:space-y-6">
              <AnimatePresence mode="popLayout">
                {visible.map((project, index) => (
                  <motion.article
                    className="glass-deep group relative overflow-hidden rounded-2xl"
                    exit={{
                      opacity: 0,
                      scale: 0.98,
                      transition: { duration: 0.22 },
                    }}
                    initial={{ opacity: 0, y: 28 }}
                    key={project.slug}
                    layout
                    transition={{
                      duration: 0.55,
                      delay: 0.06 + Math.min(index, 6) * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    viewport={{ once: true }}
                    whileHover={{ y: -4 }}
                    whileInView={{ opacity: 1, y: 0 }}
                  >
                    {/* Top animated border */}
                    <span className="absolute top-0 left-0 z-10 h-[2px] w-0 bg-gradient-to-r from-primary via-primary/70 to-primary/30 transition-all duration-700 group-hover:w-full" />

                    {/* Large faded index number */}
                    <span className="pointer-events-none absolute right-4 top-3 z-10 select-none font-bold font-mono text-6xl text-foreground/[0.04] sm:text-7xl">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="grid min-h-[300px] md:grid-cols-[1fr_1.15fr]">
                      {/* Left visual panel */}
                      <div className="shimmer-on-hover relative overflow-hidden border-b border-border/20 md:border-b-0 md:border-r">
                        <div
                          className={`absolute inset-0 ${project.toneClass}`}
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,_transparent_20%,_hsl(var(--foreground)/0.025)_50%,_transparent_80%)]" />
                        <div className="absolute inset-0 opacity-40 [background:repeating-linear-gradient(135deg,transparent,transparent_22px,hsl(var(--foreground)/0.025)_22px,hsl(var(--foreground)/0.025)_23px)]" />

                        {project.image && !project.imageIcon ? (
                          <>
                            <img
                              alt={`${project.title} screenshot`}
                              className="absolute inset-0 h-full w-full object-cover object-top"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                              src={project.image}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/35 to-background/10" />
                          </>
                        ) : null}

                        <div className="relative flex h-full min-h-[220px] flex-col items-center justify-center px-8 py-10 text-center">
                          {project.imageIcon && project.image ? (
                            <img
                              alt={`${project.title} logo`}
                              className="mb-5 h-20 w-20 object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                              src={project.image}
                            />
                          ) : null}
                          <h2 className="font-bold text-2xl tracking-tight sm:text-3xl">
                            {project.title}
                          </h2>
                          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                            {project.tags.map((tag) => (
                              <Badge key={tag}>{tag}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right content panel */}
                      <div className="flex flex-col p-5 sm:p-6">
                        <div className="mb-3.5 flex items-start justify-between gap-2 border-b border-border/25 pb-3.5">
                          <div>
                            <p
                              aria-hidden
                              className="font-semibold text-xl leading-tight"
                            >
                              {project.title}
                            </p>
                            <p className="mt-1 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/60">
                              {project.dateLabel}
                            </p>
                          </div>
                          <Badge>{project.tags[0]}</Badge>
                        </div>

                        <p className="mb-2.5 font-medium text-foreground/90 text-sm leading-snug">
                          {project.tagline}
                        </p>
                        <p className="mb-5 flex-1 text-muted-foreground text-sm leading-relaxed">
                          {project.description}
                        </p>

                        <div className="mt-auto grid grid-cols-3 gap-2 border-t border-border/25 pt-3.5">
                          <a
                            aria-label={t.openRepo.replace(
                              "{name}",
                              project.title,
                            )}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border/40 bg-secondary/50 px-3 py-2.5 font-medium text-xs backdrop-blur-sm transition-all duration-200 hover:border-border/70 hover:bg-secondary"
                            href={project.repoUrl}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            <Github className="h-3.5 w-3.5" />
                            {t.source}
                          </a>
                          {project.downloadUrl ? (
                            <a
                              aria-label={t.openDownload.replace(
                                "{name}",
                                project.title,
                              )}
                              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary/10 px-3 py-2.5 font-medium text-primary text-xs backdrop-blur-sm transition-all duration-200 hover:bg-primary/20 hover:shadow-[0_2px_12px_hsl(var(--primary)/0.2)]"
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
                              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary/10 px-3 py-2.5 font-medium text-primary text-xs backdrop-blur-sm transition-all duration-200 hover:bg-primary/20 hover:shadow-[0_2px_12px_hsl(var(--primary)/0.2)]"
                              href={project.liveUrl}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              {t.live}
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                          <Link
                            aria-label={t.viewDetails.replace(
                              "{name}",
                              project.title,
                            )}
                            className="inline-flex items-center justify-center gap-1 rounded-xl border border-border/40 bg-background/60 px-3 py-2.5 font-medium text-primary text-xs backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:bg-primary/[0.06]"
                            to={`/projects/${project.slug}`}
                          >
                            {t.details}
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}
    </section>
  );
}
