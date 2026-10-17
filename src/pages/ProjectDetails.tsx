import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Download,
  ExternalLink,
  Lock,
} from "lucide-react";
import { Github } from "@/components/ui/github-icon";
import { useLenis } from "lenis/react";
import { type ReactNode, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { SEO } from "@/components/seo";
import { TechBadge } from "@/components/ui/tech-badge";
import { ProjectTechLoop } from "@/components/effects/tech-stack";
import { Button } from "@/components/ui/button";
// Module path, not the seo-data barrel: that barrel also re-exports
// services.ts, which is 14 kB of FAQ and HowTo copy in four languages and has
// no business riding along in the project-detail chunk.
import {
  getProjectSeoDescription,
  getProjectSeoTitle,
} from "@/config/seo-data/projects";
import { PrivateSource } from "@/components/sections/PrivateSource";
import { SITE_CONFIG } from "@/constants";
import {
  cardImageSrc,
  getProject,
  getProjects,
  pictureSrcSet,
  projectCardSrcSet,
} from "@/constants/projects";
import type { ProjectSection } from "@/constants/projects/types";
import { useRoutePrefetch } from "@/hooks/use-route-prefetch";
import { revealOnScroll } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-context";
import {
  createSoftwareApplicationSchema,
  createSoftwareSourceCodeSchema,
  getDefaultCitations,
  getDefaultGeoLocation,
} from "@/lib/seo-utils";
import { translations } from "@/lib/translations";
import {
  Lightbox,
  ProjectFigure,
  StatStrip,
} from "@/components/effects/project-effects";

/** One card surface for the whole page: opaque cream, hairline, no shadow. */
const CARD = "rounded-2xl border border-border/60 bg-card";

/**
 * How wide the main screenshot renders: the page column, which stops at
 * 1152px (max-w-7xl less the lg gutters) and otherwise is the viewport less
 * the gutter ladder (24, 32, 48, 64px a side).
 */
const HERO_SIZES =
  "(min-width: 1280px) 1152px, (min-width: 1024px) calc(100vw - 128px), (min-width: 768px) calc(100vw - 96px), (min-width: 640px) calc(100vw - 64px), calc(100vw - 48px)";

/* ------------------------------------------------------------------ */
/* Numbered section: a flat marker, a hairline and a reading body      */
/* ------------------------------------------------------------------ */

function FeatureSection({
  id,
  index,
  title,
  children,
}: {
  id?: string;
  index: number;
  title: ReactNode;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.section
      id={id}
      className="scroll-mt-28 border-border/60 border-t pt-12 first:border-t-0 first:pt-0"
      {...revealOnScroll(reduceMotion)}
    >
      <div className="flex items-baseline gap-4">
        {/* A fixed 24px column, not an auto-width numeral: `gap-4` puts the
            heading text 24+16=40px in, which is exactly the `sm:pl-10` the body
            copy below gets, so a section's heading and its own paragraphs share
            one left edge. Left to itself the span was ~13px wide and the
            heading sat 11px left of its own text, with a ragged edge on top of
            that: the old body face ignored `tabular-nums`, so "01" and "05"
            measured differently. */}
        <span
          aria-hidden
          className="accent-jp w-6 shrink-0 select-none text-lg text-primary"
        >
          {String(index).padStart(2, "0")}
        </span>
        <h2 className="title-serif font-bold text-2xl leading-tight sm:text-3xl">
          {title}
        </h2>
      </div>
      <div className="mt-6 sm:pl-10">{children}</div>
    </motion.section>
  );
}

/** A quiet text link in the rail; the hero carries the full buttons. */
const RAIL_LINK =
  "inline-flex items-center gap-2 py-1 text-muted-foreground transition-colors duration-200 ease-out hover:text-foreground";

/**
 * Which numbered section the reader is in: the last one whose top has passed
 * a line a third of the way down the viewport. Measured on scroll, at most
 * once a frame; the page glides on Lenis, which still moves the window, so
 * the native scroll event fires as it goes.
 */
function useActiveSection(count: number) {
  const [active, setActive] = useState("section-1");
  useEffect(() => {
    if (count < 2) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const line = window.innerHeight / 3;
      let current = "section-1";
      for (let index = 1; index <= count; index += 1) {
        const section = document.getElementById(`section-${index}`);
        if (section && section.getBoundingClientRect().top <= line) {
          current = `section-${index}`;
        }
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [count]);
  return active;
}

/* A label above a group in the links rail: plain words at reading size, set
   apart by weight, not by capitals and letter-spacing. */
function RailLabel({ children }: { children: ReactNode }) {
  return <p className="font-semibold text-foreground text-sm">{children}</p>;
}

/**
 * A few lines from the real source, where they show a decision better than a
 * paragraph would. The body face is forced onto `pre` and `code` site-wide,
 * so the excerpt names its own face: the system monospace, nothing to load.
 */
function CodeExcerpt({
  code,
}: {
  code: NonNullable<ProjectSection["code"]>;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.figure className="m-0" {...revealOnScroll(reduceMotion)}>
      {/* Focusable because it scrolls sideways: without a tab stop a keyboard
          user cannot reach the end of a long line. The site-wide
          :focus-visible ring shows where focus is. */}
      <pre
        className={`${CARD} code-excerpt overflow-x-auto p-5 text-[13px] leading-relaxed sm:p-6`}
        tabIndex={0}
      >
        <code>{code.text}</code>
      </pre>
      <figcaption className="mt-3 max-w-prose text-muted-foreground text-sm leading-relaxed">
        {code.caption}
      </figcaption>
    </motion.figure>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const ProjectDetails = () => {
  const { projectSlug } = useParams();
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();
  const { warmOnIntent } = useRoutePrefetch();
  const t = translations[language].projectDetails;
  const seoSuffix = translations[language].seo.projectDetailsKeywordsSuffix;
  const project = projectSlug ? getProject(projectSlug, language) : undefined;

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  // Which picture the viewer was opened from, for the grow-from-thumbnail
  // animation. Kept apart from the current index, which changes on a swipe.
  const [lightboxOrigin, setLightboxOrigin] = useState(0);
  // The viewer opens once the full-size file is decoded, or after 350ms at the
  // latest. The shared-layout flight measures the enlarged image when it
  // mounts, and an image still loading measures as an empty box: the first
  // frames then scaled the picture from nothing into a squashed rectangle.
  const openLightbox = (at: number) => {
    const open = () => {
      setLightboxOrigin(at);
      setLightboxIndex(at);
    };
    const src = galleryImages[at];
    if (!src) return open();
    const full = new Image();
    full.src = src;
    let opened = false;
    const once = () => {
      if (opened) return;
      opened = true;
      open();
    };
    full.decode().then(once, once);
    window.setTimeout(once, 350);
  };
  const lenis = useLenis();
  // Overview plus one per case-study section, numbered from 1 like the page.
  const activeSection = useActiveSection(
    project ? project.sections.length + 1 : 0,
  );

  if (!project) {
    return <Navigate replace to="/projects" />;
  }

  const projectPath = `/projects/${project.slug}`;
  const projectUrl = `${SITE_CONFIG.url}${projectPath}`;
  const projectTimeline = `${project.dateLabel} – ${project.endLabel ?? t.present}`;
  const otherProjects = getProjects(language).filter(
    (item) => item.slug !== project.slug,
  );
  const captionFor = (position: number) => project.captions[position];

  /* The case study's sections, for the list in the links rail.
     Ids are positional: a heading is prose and changes with the language. */
  const outline = [
    { id: "section-1", heading: t.overview },
    ...project.sections.map((section, index) => ({
      id: `section-${index + 2}`,
      heading: section.heading,
    })),
  ];
  const jumpTo = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    // The destination is worked out here, as a number, and handed to Lenis:
    // given the element, Lenis measured it against its own animated position
    // and landed anywhere from short of the section to far past it. The
    // margin is the section's own `scroll-mt-28`.
    const margin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    const top = target.getBoundingClientRect().top + window.scrollY - margin;
    if (lenis) lenis.scrollTo(top);
    else window.scrollTo({ top });
  };

  /* Spec-rail rows (year / role / languages / OS), only render what exists. */
  const specRows: Array<{ label: string; value: ReactNode }> = [
    { label: t.timeline, value: projectTimeline },
    { label: t.role, value: project.roleSummary },
  ];
  if (project.operatingSystem) {
    specRows.push({ label: t.platform, value: project.operatingSystem });
  }

  /* Every full-size image on the page, in reading order: the hero screenshot
     (icon-mode projects have a logo there, not a screenshot) followed by the
     in-context shots woven through the body. The lightbox walks this list, so
     each figure only has to know its own offset into it. */
  const heroShot = project.image && !project.imageIcon ? project.image : null;
  const galleryImages = [
    ...(heroShot ? [heroShot] : []),
    ...(project.gallery ?? []),
  ];
  const shotLabel = (position: number) =>
    t.viewImage
      .replace("{index}", String(position + 1))
      .replace("{total}", String(galleryImages.length));
  /*
   * Three screenshots of the same app carried the same alt text ("Zephyr
   * interface") three times, which tells a screen reader nothing about which
   * one it has reached. Position is the honest distinguisher when the pictures
   * have no separate description, and the counter string is already localised
   * for the viewer, so this adds no new copy in any language.
   */
  const shotAlt = (position: number) =>
    galleryImages.length > 1
      ? `${project.title}, ${t.imageCounter
          .replace("{index}", String(position + 1))
          .replace("{total}", String(galleryImages.length))}`
      : `${project.title} interface`;

  return (
    <>
      <SEO
        citationLinks={getDefaultCitations()}
        // Exactly what scripts/prerender.ts writes into this route's static
        // document. Helmet appends rather than replaces, so a different string
        // here would leave two disagreeing description tags in one head.
        description={getProjectSeoDescription(project)}
        type="article"
        image={`${SITE_CONFIG.url}/og/projects/${project.slug}.png`}
        geoLocation={getDefaultGeoLocation()}
        keywords={`${project.title} ${seoSuffix}, ${project.tags.join(", ")}, Dominik Könitzer, Dominik Koenitzer`}
        speakableSelectors={["h1", "h2"]}
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `${project.title} Project Details`,
            description: project.description,
            url: projectUrl,
            inLanguage: language,
            isPartOf: { "@id": `${SITE_CONFIG.url}/#website` },
            about: {
              "@type": "CreativeWork",
              name: project.title,
              keywords: project.tags.join(", "),
            },
          },
          createSoftwareSourceCodeSchema(project),
          // Only something a visitor can open or install is an application
          // offer; a project that runs locally is described by its source.
          ...(project.liveUrl || project.downloadUrl
            ? [createSoftwareApplicationSchema(project)]
            : []),
        ]}
        title={getProjectSeoTitle(project.slug, project.title)}
        url={projectUrl}
      />

      <div className="min-h-screen">
        {/* ============================================================ */}
        {/* HERO: title, tagline, actions and the facts beside them,     */}
        {/* then the main picture across the full column                 */}
        {/* ============================================================ */}
        <section className="mx-auto max-w-7xl px-6 pt-4 pb-12 sm:px-8 sm:pb-16 md:px-12 lg:px-16">
          {/* `inline-flex` on the links is not cosmetic: it is what the touch
              tap-target rule in index.css matches, so a breadcrumb is a 44px
              target under a thumb and unchanged under a mouse. The Projects
              crumb is the way back, so there is no separate Back link. */}
          <nav
            aria-label={t.breadcrumb}
            className="mb-10 flex items-center gap-2 text-muted-foreground text-sm sm:mb-12"
          >
            <Link
              className="inline-flex items-center transition-colors hover:text-foreground"
              to="/"
            >
              {t.home}
            </Link>
            <span aria-hidden className="text-border">
              /
            </span>
            <Link
              className="inline-flex items-center transition-colors hover:text-foreground"
              to="/projects"
              {...warmOnIntent("/projects")}
            >
              {t.projects}
            </Link>
            <span aria-hidden className="text-border">
              /
            </span>
            <span className="text-foreground/80">{project.title}</span>
          </nav>

          {/* Title, tagline and actions on the left; the facts in a narrow
              column on the right from `lg`, under the actions below it. */}
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-end lg:gap-16">
            <motion.div {...revealOnScroll(reduceMotion)}>
              <h1 className="title-serif font-bold text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
                {project.title}
              </h1>

              <p className="mt-7 max-w-2xl text-balance text-foreground/90 text-lg leading-relaxed sm:text-xl">
                {project.tagline}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                {project.downloadUrl ? (
                  <Button asChild className="rounded-lg px-6" variant="cta">
                    <a
                      href={project.downloadUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Download className="h-4 w-4" />
                      {t.download}
                    </a>
                  </Button>
                ) : project.liveUrl ? (
                  <Button asChild className="rounded-lg px-6" variant="cta">
                    <a
                      href={project.liveUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {t.visitSite}
                    </a>
                  </Button>
                ) : null}
                {project.downloadPage && project.downloadPage !== project.downloadUrl ? (
                  <Button asChild className="rounded-lg px-5" variant="soft">
                    <a
                      href={project.downloadPage}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {t.downloadPage}
                    </a>
                  </Button>
                ) : null}
                {project.sourcePrivate ? (
                  <PrivateSource>
                    <Button className="rounded-lg px-5" type="button" variant="soft">
                      <Lock className="h-4 w-4" />
                      {t.sourceCode}
                    </Button>
                  </PrivateSource>
                ) : (
                  <Button asChild className="rounded-lg px-5" variant="soft">
                    <a
                      href={project.repoUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Github className="h-4 w-4" />
                      {t.sourceCode}
                    </a>
                  </Button>
                )}
              </div>

              {project.downloadUrl ? (
                <p className="mt-4 max-w-prose text-muted-foreground text-sm leading-relaxed">
                  {project.downloadNote ?? t.downloadNote}
                </p>
              ) : null}
            </motion.div>

            {/* The facts, once. Two columns under a hairline on a phone, one
                column beside the title from `lg`, where the hairline turns
                to stand on its left. */}
            <motion.dl
              className="grid grid-cols-2 gap-x-8 gap-y-6 border-border/60 border-t pt-7 lg:grid-cols-1 lg:gap-y-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8"
              {...revealOnScroll(reduceMotion)}
            >
              {specRows.map((row) => (
                <div key={row.label}>
                  <dt className="font-medium text-muted-foreground text-sm">
                    {row.label}
                  </dt>
                  <dd className="mt-1.5 text-foreground/90 text-sm leading-relaxed">
                    {row.value}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* The main picture at the width of the page column: it is what
              the project looks like, so it gets the room. A square app icon
              keeps its small frame. */}
          {project.image ? (
            <div className="mt-12 sm:mt-14">
              {project.imageIcon ? (
                <motion.div
                  className={`${CARD} flex items-center justify-center p-10`}
                  {...revealOnScroll(reduceMotion)}
                >
                  <img
                    alt={`${project.title} logo`}
                    className="h-36 w-36 object-contain sm:h-44 sm:w-44"
                    decoding="async"
                    fetchPriority="high"
                    loading="eager"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    src={project.image}
                  />
                </motion.div>
              ) : (
                <ProjectFigure
                  alt={`${project.title} screenshot`}
                  caption={captionFor(0)}
                  layoutId="project-shot-0"
                  onOpen={() => openLightbox(0)}
                  openLabel={shotLabel(0)}
                  priority
                  sizes={HERO_SIZES}
                  src={project.image}
                  srcSet={projectCardSrcSet(project.image, project.imageWidth)}
                />
              )}
            </div>
          ) : null}

          {project.stats?.length ? (
            <div className="mt-12 sm:mt-14">
              <StatStrip stats={project.stats} />
            </div>
          ) : null}

          <div className="mt-12">
            <ProjectTechLoop project={project} />
          </div>
        </section>

        {/* ============================================================ */}
        {/* BODY                                                         */}
        {/* ============================================================ */}
        <div className="mx-auto max-w-7xl px-6 pb-24 sm:px-8 sm:pb-28 md:px-12 lg:px-16">
          <div className="grid gap-12 pt-8 lg:grid-cols-[1fr_auto] lg:gap-16">
            {/* -------- Reading column -------- */}
            <article className="min-w-0 max-w-3xl space-y-12">
              <FeatureSection
                id="section-1"
                index={1}
                title={t.overview}
              >
                <p className="text-foreground/90 leading-relaxed">
                  {project.overview}
                </p>
              </FeatureSection>

              {project.sections.map((section, sectionIndex) => (
                <FeatureSection
                  id={`section-${sectionIndex + 2}`}
                  index={sectionIndex + 2}
                  key={section.heading}
                  title={section.heading}
                >
                  <div className="space-y-5">
                    {section.body.map((paragraph) => (
                      <p
                        className="text-foreground/90 leading-relaxed"
                        key={paragraph}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {section.code ? (
                    <div className="mt-8">
                      <CodeExcerpt code={section.code} />
                    </div>
                  ) : null}
                  {section.figure !== undefined ? (
                    <ProjectFigure
                      alt={shotAlt(section.figure)}
                      caption={captionFor(section.figure)}
                      className="mt-8"
                      layoutId={`project-shot-${section.figure}`}
                      onOpen={() => openLightbox(section.figure ?? 0)}
                      openLabel={shotLabel(section.figure)}
                      /* The reading column stops at 768px, so the middle
                         copy covers it at 2x and the full capture is left
                         to the lightbox. */
                      sizes="(min-width: 768px) 768px, 100vw"
                      src={galleryImages[section.figure]}
                      srcSet={pictureSrcSet(galleryImages[section.figure])}
                    />
                  ) : null}
                </FeatureSection>
              ))}
            </article>

            {/* -------- Sticky rail: where the reader is, then the links.
                    The hero has the full buttons; here they are quiet text
                    links, so the first screen does not show them twice. -------- */}
            <aside className="hidden lg:block">
              <div className={`sticky top-28 w-64 ${CARD} p-6`}>
                {outline.length > 1 ? (
                  <nav aria-label={t.onThisPage}>
                    <RailLabel>{t.onThisPage}</RailLabel>
                    <ol className="mt-3 space-y-1">
                      {outline.map((entry, index) => {
                        const current = entry.id === activeSection;
                        return (
                          <li key={entry.id}>
                            <button
                              aria-current={current ? "location" : undefined}
                              className={`flex w-full gap-2.5 rounded-md py-1 text-left text-sm leading-snug transition-colors duration-200 ease-out hover:text-foreground ${
                                current ? "text-foreground" : "text-muted-foreground"
                              }`}
                              onClick={() => jumpTo(entry.id)}
                              type="button"
                            >
                              <span
                                aria-hidden
                                className={`accent-jp w-6 shrink-0 tabular-nums transition-colors duration-200 ease-out ${
                                  current ? "text-primary" : ""
                                }`}
                              >
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <span>{entry.heading}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ol>
                  </nav>
                ) : null}

                <div
                  className={
                    outline.length > 1 ? "mt-6 border-border/60 border-t pt-5" : ""
                  }
                >
                  <RailLabel>{t.links}</RailLabel>
                  <ul className="mt-3 space-y-1 text-sm">
                    {project.downloadUrl ? (
                      <li>
                        <a
                          className={RAIL_LINK}
                          href={project.downloadUrl}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <Download className="h-3.5 w-3.5" />
                          {t.download}
                        </a>
                      </li>
                    ) : project.liveUrl ? (
                      <li>
                        <a
                          className={RAIL_LINK}
                          href={project.liveUrl}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          {t.visitSite}
                        </a>
                      </li>
                    ) : null}
                    {project.downloadPage && project.downloadPage !== project.downloadUrl ? (
                      <li>
                        <a
                          className={RAIL_LINK}
                          href={project.downloadPage}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          {t.downloadPage}
                        </a>
                      </li>
                    ) : null}
                    <li>
                      {project.sourcePrivate ? (
                        <PrivateSource>
                          <button className={RAIL_LINK} type="button">
                            <Lock className="h-3.5 w-3.5" />
                            {t.sourceCode}
                          </button>
                        </PrivateSource>
                      ) : (
                        <a
                          className={RAIL_LINK}
                          href={project.repoUrl}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <Github className="h-3.5 w-3.5" />
                          {t.sourceCode}
                        </a>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>

          {/* -------- More projects -------- */}
          <motion.section
            className="mt-24 border-border/60 border-t pt-14"
            {...revealOnScroll(reduceMotion)}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="title-serif font-bold text-2xl sm:text-3xl">
                {t.moreProjects}
              </h2>
              <Link
                className="inline-flex min-h-6 items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                to="/projects"
                {...warmOnIntent("/projects")}
              >
                {t.allProjects}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* One rail, two behaviours: a snapping swipe deck on a phone
                (a ten-card grid there is a wall of scrolling) and the grid
                from `sm` up. The negative margin lets the first and last
                cards sit flush with the page gutter while still scrolling
                edge to edge, so it has to be exactly the gutter: 24px under
                `sm` (`.section-padding` is `px-6` there), measured, not
                assumed. It used to pull 32, and `max-w-none` is what makes the
                bleed possible at all: index.css caps `*` at `max-width: 100%`
                below 640px, so the strip could never grow past the parent's
                content box and the whole overhang went left. The visible
                result was a strip 8px off the left edge of the screen that
                stopped 56px short of the right. */}
            <div className="-mx-6 mt-8 flex max-w-none snap-x snap-mandatory scroll-pl-6 gap-4 overflow-x-auto px-6 pb-4 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
              {otherProjects.map((item) => (
                <Link
                  className={`group flex w-[78vw] max-w-sm shrink-0 snap-start flex-col p-5 transition-colors duration-200 ease-out hover:border-primary/30 sm:w-auto sm:max-w-none ${CARD}`}
                  key={item.slug}
                  to={`/projects/${item.slug}`}
                  {...warmOnIntent(`/projects/${item.slug}`)}
                >
                  {/* The catalogue's small copy of the shot, so a card here
                      costs what it costs on /projects. Decorative: the title
                      right below names it. */}
                  {item.image && !item.imageIcon ? (
                    <div className="-mx-5 -mt-5 mb-4 aspect-16/10 overflow-hidden rounded-t-2xl border-border/60 border-b bg-secondary/40">
                      <img
                        alt=""
                        className="h-full w-full object-cover object-top"
                        decoding="async"
                        loading="lazy"
                        src={cardImageSrc(item.image)}
                      />
                    </div>
                  ) : null}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="title-serif text-lg transition-colors duration-200 group-hover:text-primary">
                        {item.title}
                      </p>
                      <p className="mt-1 text-muted-foreground text-sm">
                        {item.dateLabel}
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
                  </div>
                  <p className="mt-3 line-clamp-3 text-foreground/80 text-sm leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <TechBadge key={tag} name={tag} />
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        </div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && galleryImages.length > 0 ? (
        <Lightbox
          alt={captionFor(lightboxIndex) ?? shotAlt(lightboxIndex)}
          images={galleryImages}
          index={lightboxIndex}
          labels={{
            close: t.closeViewer,
            counter: t.imageCounter,
            next: t.nextImage,
            previous: t.previousImage,
            thumb: t.showImage,
            title: `${project.title} ${t.gallery}`,
          }}
          onClose={() => setLightboxIndex(null)}
          onSelect={setLightboxIndex}
          originIndex={lightboxOrigin}
        />
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default ProjectDetails;
