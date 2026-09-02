import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Download,
  ExternalLink,
  Github,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { SEO } from "@/components/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// Module path, not the seo-data barrel: that barrel also re-exports
// services.ts, which is 14 kB of FAQ and HowTo copy in four languages and has
// no business riding along in the project-detail chunk.
import {
  getProjectSeoDescription,
  getProjectSeoTitle,
} from "@/config/seo-data/projects";
import { SITE_CONFIG } from "@/constants";
import { getProject, getProjects } from "@/constants/projects";
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

/* ------------------------------------------------------------------ */
/* Numbered section: a flat marker, a hairline and a reading body      */
/* ------------------------------------------------------------------ */

function FeatureSection({
  index,
  title,
  children,
}: {
  index: number;
  title: ReactNode;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.section
      className="scroll-mt-28 border-border/60 border-t pt-12 first:border-t-0 first:pt-0"
      {...revealOnScroll(reduceMotion)}
    >
      <div className="flex items-baseline gap-4">
        <span
          aria-hidden
          className="select-none text-muted-foreground text-sm tabular-nums"
        >
          {String(index).padStart(2, "0")}
        </span>
        <h2 className="font-bold text-2xl leading-tight tracking-tight sm:text-3xl">
          {title}
        </h2>
      </div>
      <div className="mt-6 sm:pl-10">{children}</div>
    </motion.section>
  );
}

/* A single mono micro-label, used everywhere for rhythm. */
function MicroLabel({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "primary" | "destructive";
}) {
  const color =
    tone === "primary"
      ? "text-primary"
      : tone === "destructive"
        ? "text-destructive"
        : "text-muted-foreground";
  return (
    <p className={`text-[10px] uppercase tracking-[0.22em] ${color}`}>
      {children}
    </p>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-3 pl-5 text-foreground/90 leading-relaxed marker:text-primary/50">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          className="flex gap-3 text-foreground/90 leading-relaxed"
          key={item}
        >
          <Check aria-hidden className="mt-1 h-4 w-4 shrink-0 text-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
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

  if (!project) {
    return <Navigate replace to="/projects" />;
  }

  const projectPath = `/projects/${project.slug}`;
  const projectUrl = `${SITE_CONFIG.url}${projectPath}`;
  const projectTimeline = `${project.dateLabel} – ${t.present}`;
  const otherProjects = getProjects(language).filter(
    (item) => item.slug !== project.slug,
  );
  // Caption under a screenshot: the host it was taken on. A desktop app points
  // `liveUrl` at its repo, so it would read "github.com" under a picture of a
  // Windows window; those get no caption.
  const shotCaption = project.downloadUrl
    ? undefined
    : (() => {
        try {
          return new URL(project.liveUrl).host;
        } catch {
          return project.title;
        }
      })();

  /* Spec-rail rows (year / role / languages / OS), only render what exists. */
  const specRows: Array<{ label: string; value: ReactNode }> = [
    { label: t.timeline, value: projectTimeline },
    { label: t.role, value: project.roleSummary },
  ];
  if (project.programmingLanguages?.length) {
    specRows.push({
      label: "Stack",
      value: project.programmingLanguages.join(" · "),
    });
  }
  if (project.operatingSystem) {
    specRows.push({ label: "Platform", value: project.operatingSystem });
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
  const shotIndex = (galleryPosition: number) =>
    galleryPosition + (heroShot ? 1 : 0);
  const shotLabel = (position: number) =>
    t.viewImage
      .replace("{index}", String(position + 1))
      .replace("{total}", String(galleryImages.length));

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
        keywords={`${project.title} ${seoSuffix}, ${project.tags.join(", ")}, Dominik Konitzer`}
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
          createSoftwareApplicationSchema(project),
        ]}
        title={getProjectSeoTitle(project.slug, project.title)}
        url={projectUrl}
      />

      <div className="min-h-screen">
        {/* ============================================================ */}
        {/* HERO: title, tagline, actions, meta                          */}
        {/* ============================================================ */}
        <section className="mx-auto max-w-7xl px-6 pt-4 pb-12 sm:px-8 sm:pb-16 md:px-12 lg:px-16">
          {/* Breadcrumb + back */}
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4 sm:mb-12">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-[11px] text-muted-foreground uppercase tracking-[0.18em]"
            >
              <Link className="transition-colors hover:text-foreground" to="/">
                {t.home}
              </Link>
              <span aria-hidden className="text-border">
                /
              </span>
              <Link
                className="transition-colors hover:text-foreground"
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

            <Link
              className="inline-flex items-center gap-2 text-[11px] text-muted-foreground uppercase tracking-[0.18em] transition-colors hover:text-foreground"
              to="/projects"
              {...warmOnIntent("/projects")}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t.back}
            </Link>
          </div>

          {/* Title and tagline left, the picture right. */}
          <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
            <motion.div {...revealOnScroll(reduceMotion)}>
              <p className="eyebrow">{projectTimeline}</p>

              <h1 className="mt-5 font-bold text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                {project.title}
              </h1>

              <p className="mt-7 max-w-2xl text-balance text-foreground/90 text-lg leading-relaxed sm:text-xl">
                {project.tagline}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                {project.downloadUrl ? (
                  <Button asChild className="rounded-lg px-6" variant="cta">
                    <a
                      download
                      href={project.downloadUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Download className="h-4 w-4" />
                      {t.download}
                    </a>
                  </Button>
                ) : (
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
                )}
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
              </div>

              {project.downloadUrl ? (
                <p className="mt-4 max-w-prose text-muted-foreground text-xs leading-relaxed">
                  {t.downloadNote}
                </p>
              ) : null}

              <div className="mt-7 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="primary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </motion.div>

            {/* A square app icon gets the same frame as a screenshot, so both
                modes read as one component. */}
            {project.image ? (
              <div className="flex justify-center lg:justify-end">
                {project.imageIcon ? (
                  <motion.div
                    className={`${CARD} flex items-center justify-center p-10`}
                    {...revealOnScroll(reduceMotion)}
                  >
                    <img
                      alt={`${project.title} logo`}
                      className="h-36 w-36 object-contain sm:h-44 sm:w-44"
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
                    className="w-full max-w-xl"
                    label={shotCaption}
                    onOpen={() => setLightboxIndex(0)}
                    openLabel={shotLabel(0)}
                    priority
                    src={project.image}
                  />
                )}
              </div>
            ) : null}
          </div>

          {/* Spec rail. It has to live here rather than only in the desktop
              aside, or a phone gets the title and the buttons and none of the
              facts. */}
          <motion.dl
            className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-border/60 border-t pt-7 sm:flex sm:flex-wrap sm:gap-x-14"
            {...revealOnScroll(reduceMotion)}
          >
            {specRows.map((row) => (
              <div className="max-w-xs" key={row.label}>
                <dt className="text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
                  {row.label}
                </dt>
                <dd className="mt-2 text-foreground/90 text-sm leading-relaxed">
                  {row.value}
                </dd>
              </div>
            ))}
          </motion.dl>

          {project.stats?.length ? (
            <div className="mt-10">
              <StatStrip stats={project.stats} />
            </div>
          ) : null}
        </section>

        {/* ============================================================ */}
        {/* BODY                                                         */}
        {/* ============================================================ */}
        <div className="mx-auto max-w-7xl px-6 pb-24 sm:px-8 sm:pb-28 md:px-12 lg:px-16">
          <div className="grid gap-12 pt-8 lg:grid-cols-[1fr_auto] lg:gap-16">
            {/* -------- Reading column -------- */}
            <article className="min-w-0 max-w-3xl space-y-12">
              <FeatureSection index={1} title={t.overview}>
                <p className="text-foreground/90 leading-relaxed">
                  {project.overview}
                </p>
              </FeatureSection>

              <ProjectFigure
                alt={`${project.title} interface`}
                label={shotCaption}
                onOpen={() => setLightboxIndex(shotIndex(0))}
                openLabel={shotLabel(shotIndex(0))}
                src={project.gallery?.[0]}
              />

              <FeatureSection index={2} title={t.problem}>
                <p className="text-foreground/90 leading-relaxed">
                  {project.problemStatement}
                </p>
              </FeatureSection>

              <FeatureSection index={3} title={t.objectives}>
                <ol className="list-decimal space-y-3 pl-5 text-foreground/90 leading-relaxed marker:marker:text-muted-foreground">
                  {project.objectives.map((objective) => (
                    <li key={objective}>{objective}</li>
                  ))}
                </ol>
              </FeatureSection>

              <FeatureSection index={4} title={t.architecture}>
                <BulletList items={project.architectureDecisions} />
              </FeatureSection>

              <FeatureSection index={5} title={t.implementation}>
                <BulletList items={project.implementationHighlights} />
              </FeatureSection>

              <ProjectFigure
                alt={`${project.title} interface`}
                label={shotCaption}
                onOpen={() => setLightboxIndex(shotIndex(1))}
                openLabel={shotLabel(shotIndex(1))}
                src={project.gallery?.[1]}
              />

              <FeatureSection index={6} title={t.quality}>
                <BulletList items={project.qualityAndSecurity} />
              </FeatureSection>

              <FeatureSection index={7} title={t.challenges}>
                <div className="grid gap-5 sm:grid-cols-2">
                  {project.challengesAndSolutions.map((item) => (
                    <div className={`${CARD} p-5`} key={item.challenge}>
                      <MicroLabel tone="destructive">
                        {t.challengeLabel}
                      </MicroLabel>
                      <p className="mt-2 text-foreground/90 text-sm leading-relaxed">
                        {item.challenge}
                      </p>
                      <div aria-hidden className="my-4 h-px bg-border/60" />
                      <MicroLabel tone="primary">{t.solutionLabel}</MicroLabel>
                      <p className="mt-2 text-foreground/80 text-sm leading-relaxed">
                        {item.solution}
                      </p>
                    </div>
                  ))}
                </div>
              </FeatureSection>

              <ProjectFigure
                alt={`${project.title} interface`}
                label={shotCaption}
                onOpen={() => setLightboxIndex(shotIndex(2))}
                openLabel={shotLabel(shotIndex(2))}
                src={project.gallery?.[2]}
              />

              {/* What this demonstrates: hiring signals */}
              <FeatureSection index={8} title={t.signals}>
                <div className={`${CARD} p-6 sm:p-7`}>
                  <CheckList items={project.hiringSignals} />
                </div>
              </FeatureSection>

              {/* What's next: roadmap */}
              <FeatureSection index={9} title={t.whatsNext}>
                <BulletList items={project.nextIterations} />
              </FeatureSection>

              <FeatureSection index={10} title={project.impactHeading}>
                <div className={`${CARD} p-6 sm:p-7`}>
                  <CheckList items={project.impactPoints} />
                </div>
              </FeatureSection>
            </article>

            {/* -------- Sticky links rail. The facts are in the hero spec
                    rail; repeating them here only doubled the page. -------- */}
            <aside className="hidden lg:block">
              <div className={`sticky top-28 w-64 ${CARD} p-6`}>
                <MicroLabel>{t.links}</MicroLabel>
                <div className="mt-4 flex flex-col gap-2">
                  {project.downloadUrl ? (
                    <Button
                      asChild
                      className="w-full justify-start rounded-lg"
                      size="sm"
                      variant="cta"
                    >
                      <a
                        download
                        href={project.downloadUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <Download className="h-4 w-4" />
                        {t.download}
                      </a>
                    </Button>
                  ) : (
                    <Button
                      asChild
                      className="w-full justify-start rounded-lg"
                      size="sm"
                      variant="cta"
                    >
                      <a
                        href={project.liveUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <ExternalLink className="h-4 w-4" />
                        {t.visitSite}
                      </a>
                    </Button>
                  )}
                  <Button
                    asChild
                    className="w-full justify-start rounded-lg"
                    size="sm"
                    variant="soft"
                  >
                    <a
                      href={project.repoUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Github className="h-4 w-4" />
                      {t.sourceCode}
                    </a>
                  </Button>
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
              <h2 className="font-bold text-2xl tracking-tight sm:text-3xl">
                {t.moreProjects}
              </h2>
              <Link
                className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground uppercase tracking-[0.18em] transition-colors hover:text-foreground"
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
                edge to edge. The gutter under `sm` is 32px, not 16: index.css
                adds a 1rem padding to every `section` below 768px on top of
                this container's `px-4`. The bleed has to clear both or the
                first card sits 16px left of the heading above it. */}
            <div className="-mx-8 mt-8 flex snap-x snap-mandatory scroll-pl-8 gap-4 overflow-x-auto px-8 pb-4 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
              {otherProjects.map((item) => (
                <Link
                  className={`group flex w-[78vw] max-w-sm shrink-0 snap-start flex-col p-5 transition-colors duration-200 ease-out hover:border-primary/30 sm:w-auto sm:max-w-none ${CARD}`}
                  key={item.slug}
                  to={`/projects/${item.slug}`}
                  {...warmOnIntent(`/projects/${item.slug}`)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-heading text-lg tracking-tight transition-colors duration-200 group-hover:text-primary">
                        {item.title}
                      </p>
                      <p className="mt-1 text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
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
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        </div>
      </div>

      {lightboxIndex !== null && galleryImages.length > 0 ? (
        <Lightbox
          alt={`${project.title} screenshot`}
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
        />
      ) : null}
    </>
  );
};

export default ProjectDetails;
