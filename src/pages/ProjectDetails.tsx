import { motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Download,
  ExternalLink,
  Github,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { SEO } from "@/components/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/constants";
import { getProject, getProjects } from "@/constants/projects";
import { useLanguage } from "@/lib/language-provider";
import {
  createSoftwareApplicationSchema,
  createSoftwareSourceCodeSchema,
  getDefaultCitations,
  getDefaultGeoLocation,
} from "@/lib/seo-utils";
import { translations } from "@/lib/translations";
import LogoLoop from "@/components/effects/LogoLoop";
import {
  Magnetic,
  SpotlightCard,
  StatStrip,
  TiltFigure,
} from "@/components/effects/project-effects";
import { TECH_LOGOS } from "@/components/effects/tech-stack";

/* ------------------------------------------------------------------ */
/* Canonical motion                                                    */
/* ------------------------------------------------------------------ */

const EASE = [0.22, 1, 0.36, 1] as const;

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: EASE },
  viewport: { once: true, margin: "-80px" },
} as const;

/* ------------------------------------------------------------------ */
/* Editorial section — big numbered marker + hairline + reading body   */
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
  return (
    <motion.section
      className="scroll-mt-28 border-border/30 border-t pt-12 first:border-t-0 first:pt-0"
      {...reveal}
    >
      <div className="flex items-baseline gap-4">
        <span
          aria-hidden
          className="select-none font-mono text-2xl text-primary/30 tabular-nums leading-none"
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
    <p
      className={`font-mono text-[10px] uppercase tracking-[0.22em] ${color}`}
    >
      {children}
    </p>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item, i) => (
        <motion.li
          className="flex gap-4 text-foreground/90 leading-relaxed"
          key={item}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE, delay: i * 0.05 }}
          viewport={{ once: true, margin: "-60px" }}
        >
          <span
            aria-hidden
            className="mt-[0.55rem] h-1.5 w-6 shrink-0 rounded-full bg-primary/60"
          />
          <span>{item}</span>
        </motion.li>
      ))}
    </ul>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item, i) => (
        <motion.li
          className="flex gap-4 text-foreground/90 leading-relaxed"
          key={item}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE, delay: i * 0.05 }}
          viewport={{ once: true, margin: "-60px" }}
        >
          <span
            aria-hidden
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/12 ring-1 ring-primary/25"
          >
            <Check className="h-3 w-3 text-primary" />
          </span>
          <span>{item}</span>
        </motion.li>
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
  const t = translations[language].projectDetails;
  const seoSuffix = translations[language].seo.projectDetailsKeywordsSuffix;
  const project = projectSlug ? getProject(projectSlug, language) : undefined;

  // useScroll/useSpring must run unconditionally (hooks order); cheap when unused.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  if (!project) {
    return <Navigate replace to="/projects" />;
  }

  const projectPath = `/projects/${project.slug}`;
  const projectUrl = `${SITE_CONFIG.url}${projectPath}`;
  const projectTimeline = `${project.year} — ${t.present}`;
  const otherProjects = getProjects(language).filter(
    (item) => item.slug !== project.slug,
  );
  const liveHost = (() => {
    try {
      return new URL(project.liveUrl).host;
    } catch {
      return project.title;
    }
  })();

  /* Spec-rail rows (year / role / languages / OS) — only render what exists. */
  const specRows: Array<{ label: string; value: ReactNode }> = [
    { label: t.present, value: projectTimeline },
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

  return (
    <>
      <SEO
        citationLinks={getDefaultCitations()}
        description={`${project.title} — ${project.tagline}`}
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
        title={project.title}
        url={projectUrl}
      />

      {/* Reading-progress hairline — transform-only, fixed, decorative. */}
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-primary/80"
        style={{ scaleX: progress }}
      />

      <div className="min-h-screen">
        {/* ============================================================ */}
        {/* HERO — floats on the WebGL veil                              */}
        {/* ============================================================ */}
        <section className="relative overflow-hidden">
          <div className="relative z-10 mx-auto max-w-6xl px-4 pt-4 pb-12 sm:px-6 sm:pb-16 md:px-8 lg:px-16">
            {/* Breadcrumb + back */}
            <div className="mb-14 flex flex-wrap items-center justify-between gap-4">
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
              >
                <Link
                  className="transition-colors hover:text-foreground"
                  to="/"
                >
                  {t.home}
                </Link>
                <span aria-hidden className="text-border">/</span>
                <Link
                  className="transition-colors hover:text-foreground"
                  to="/projects"
                >
                  {t.projects}
                </Link>
                <span aria-hidden className="text-border">/</span>
                <span className="text-foreground/80">{project.title}</span>
              </nav>

              <Link
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
                to="/projects"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {t.back}
              </Link>
            </div>

            {/* Asymmetric editorial hero: oversized title left, image right. */}
            <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <p className="eyebrow text-primary/70">{projectTimeline}</p>

                <h1 className="mt-5 font-bold text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                  <span className="gradient-text">{project.title}</span>
                </h1>

                <p className="mt-7 max-w-2xl text-balance text-lg text-foreground/90 leading-relaxed sm:text-xl">
                  {project.tagline}
                </p>

                {/* CTAs */}
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  {project.downloadUrl ? (
                    <Magnetic>
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
                    </Magnetic>
                  ) : (
                    <Magnetic>
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
                    </Magnetic>
                  )}
                  <Magnetic>
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
                  </Magnetic>
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

              {/* Image — handles all 3 modes, guarded onError */}
              {project.image ? (
                <motion.div
                  className="flex justify-center lg:justify-end"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
                >
                  {project.imageIcon ? (
                    <div className="relative">
                      <div
                        aria-hidden
                        className="-inset-6 absolute rounded-full opacity-40 blur-2xl"
                        style={{ backgroundImage: "var(--theme-gradient)" }}
                      />
                      <img
                        alt={`${project.title} logo`}
                        className="relative h-36 w-36 object-contain drop-shadow-2xl sm:h-44 sm:w-44"
                        loading="eager"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                        src={project.image}
                      />
                    </div>
                  ) : (
                    <TiltFigure
                      alt={`${project.title} screenshot`}
                      className="w-full max-w-xl"
                      label={liveHost}
                      src={project.image}
                    />
                  )}
                </motion.div>
              ) : null}
            </div>

            {project.stats?.length ? (
              <div className="mt-14">
                <StatStrip stats={project.stats} />
              </div>
            ) : null}
          </div>
        </section>

        {/* ============================================================ */}
        {/* BODY — veil dissolves into a solid reading surface           */}
        {/* ============================================================ */}
        <div
          className="relative pb-28 pt-40 sm:pt-48"
          style={{
            background:
              "linear-gradient(to bottom, hsl(var(--background) / 0) 0px, hsl(var(--background) / 0.1) 80px, hsl(var(--background) / 0.92) 220px, hsl(var(--background)) 320px)",
          }}
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 lg:px-16">
            {/* Edges fade to transparent via a mask (not a colored overlay), so
                the strip blends into whatever theme/veil sits behind it. */}
            <div className="relative mb-12 overflow-hidden [-webkit-mask-image:linear-gradient(to_right,transparent,#000_14%,#000_86%,transparent)] [mask-image:linear-gradient(to_right,transparent,#000_14%,#000_86%,transparent)]">
              <LogoLoop
                ariaLabel="My tech stack"
                className="text-foreground/50"
                gap={56}
                logoHeight={30}
                logos={TECH_LOGOS}
                pauseOnHover
                scaleOnHover
                speed={34}
              />
            </div>

            {/* Pull-quote: roleSummary, framed like a magazine standfirst. */}
            <motion.blockquote className="relative max-w-4xl" {...reveal}>
              <span
                aria-hidden
                className="-left-2 sm:-left-4 absolute top-0 select-none font-bold font-heading text-6xl text-primary/15 leading-none"
              >
                “
              </span>
              <p className="pl-6 font-heading text-balance text-2xl leading-snug tracking-tight text-foreground/90 sm:pl-10 sm:text-3xl">
                {project.tagline}
              </p>
              <footer className="mt-5 pl-6 sm:pl-10">
                <MicroLabel tone="primary">{t.role}</MicroLabel>
                <p className="mt-2 text-foreground/70 leading-relaxed">
                  {project.roleSummary}
                </p>
              </footer>
            </motion.blockquote>

            <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
              {/* -------- Reading column -------- */}
              <article className="min-w-0 max-w-3xl space-y-12">
                {/* Overview with drop-cap emphasis */}
                <motion.section className="scroll-mt-28" {...reveal}>
                  <div className="flex items-baseline gap-4">
                    <span
                      aria-hidden
                      className="select-none font-mono text-2xl text-primary/30 tabular-nums leading-none"
                    >
                      01
                    </span>
                    <h2 className="font-bold text-2xl leading-tight tracking-tight sm:text-3xl">
                      {t.overview}
                    </h2>
                  </div>
                  <p className="mt-6 text-foreground/90 leading-relaxed sm:pl-10 [&>span:first-letter]:float-left [&>span:first-letter]:mr-2 [&>span:first-letter]:font-bold [&>span:first-letter]:font-heading [&>span:first-letter]:text-5xl [&>span:first-letter]:text-primary [&>span:first-letter]:leading-[0.85]">
                    <span>{project.overview}</span>
                  </p>
                </motion.section>

                <TiltFigure
                  alt={`${project.title} interface`}
                  label={liveHost}
                  src={project.gallery?.[0]}
                />

                <FeatureSection index={2} title={t.problem}>
                  <p className="text-foreground/90 leading-relaxed">
                    {project.problemStatement}
                  </p>
                </FeatureSection>

                <FeatureSection index={3} title={t.objectives}>
                  <ol className="space-y-5">
                    {project.objectives.map((objective, i) => (
                      <motion.li
                        className="flex gap-4"
                        key={objective}
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.45,
                          ease: EASE,
                          delay: i * 0.05,
                        }}
                        viewport={{ once: true, margin: "-60px" }}
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-mono text-primary text-xs tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="pt-1 text-foreground/90 leading-relaxed">
                          {objective}
                        </span>
                      </motion.li>
                    ))}
                  </ol>
                </FeatureSection>

                <FeatureSection index={4} title={t.architecture}>
                  <BulletList items={project.architectureDecisions} />
                </FeatureSection>

                <FeatureSection index={5} title={t.implementation}>
                  <BulletList items={project.implementationHighlights} />
                </FeatureSection>

                <TiltFigure
                  alt={`${project.title} interface`}
                  label={liveHost}
                  src={project.gallery?.[1]}
                />

                <FeatureSection index={6} title={t.quality}>
                  <BulletList items={project.qualityAndSecurity} />
                </FeatureSection>

                <FeatureSection index={7} title={t.challenges}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {project.challengesAndSolutions.map((item) => (
                      <div
                        className="glass-deep rounded-2xl p-5"
                        key={item.challenge}
                      >
                        <MicroLabel tone="destructive">
                          {t.challengeLabel}
                        </MicroLabel>
                        <p className="mt-2 text-foreground/90 text-sm leading-relaxed">
                          {item.challenge}
                        </p>
                        <div
                          aria-hidden
                          className="my-4 h-px bg-border/40"
                        />
                        <MicroLabel tone="primary">
                          {t.solutionLabel}
                        </MicroLabel>
                        <p className="mt-2 text-foreground/80 text-sm leading-relaxed">
                          {item.solution}
                        </p>
                      </div>
                    ))}
                  </div>
                </FeatureSection>

                <TiltFigure
                  alt={`${project.title} interface`}
                  label={liveHost}
                  src={project.gallery?.[2]}
                />

                {/* What this demonstrates — hiring signals */}
                <FeatureSection index={8} title={t.signals}>
                  <SpotlightCard
                    className="glass-deep overflow-hidden rounded-2xl p-6 sm:p-7"
                    glow={0.14}
                  >
                    <div
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-px opacity-60"
                      style={{ backgroundImage: "var(--theme-gradient)" }}
                    />
                    <div className="mb-5 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <MicroLabel tone="primary">{t.signals}</MicroLabel>
                    </div>
                    <CheckList items={project.hiringSignals} />
                  </SpotlightCard>
                </FeatureSection>

                {/* What's next — roadmap */}
                <FeatureSection index={9} title={t.whatsNext}>
                  <ol className="relative space-y-6 border-border/40 border-l pl-6">
                    {project.nextIterations.map((step, i) => (
                      <motion.li
                        className="relative"
                        key={step}
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.45,
                          ease: EASE,
                          delay: i * 0.05,
                        }}
                        viewport={{ once: true, margin: "-60px" }}
                      >
                        <span
                          aria-hidden
                          className="-left-[1.6rem] absolute top-1.5 h-2.5 w-2.5 rounded-full border border-primary/40 bg-background ring-2 ring-primary/15"
                        />
                        <p className="text-foreground/90 leading-relaxed">
                          {step}
                        </p>
                      </motion.li>
                    ))}
                  </ol>
                </FeatureSection>

                {/* Impact — the focal climax tile: brand-gradient wash + a soft
                    primary glow over glass-deep. Overlays kept low-opacity so the
                    checklist stays legible in the light themes (bloom/forest). */}
                <FeatureSection index={10} title={project.impactHeading}>
                  <SpotlightCard
                    className="glass-deep overflow-hidden rounded-3xl p-7 sm:p-9"
                    glow={0.16}
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-[0.12]"
                      style={{ backgroundImage: "var(--theme-gradient)" }}
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full opacity-40 blur-3xl"
                      style={{
                        background:
                          "radial-gradient(circle, hsl(var(--primary) / 0.35), transparent 70%)",
                      }}
                    />
                    <div className="relative">
                      <CheckList items={project.impactPoints} />
                    </div>
                  </SpotlightCard>
                </FeatureSection>
              </article>

              {/* -------- Sticky spec rail -------- */}
              <aside className="hidden lg:block">
                <div className="sticky top-28 w-64">
                  <div className="glass-deep rounded-2xl p-6">
                    <MicroLabel tone="primary">{t.notes}</MicroLabel>
                    <dl className="mt-5 space-y-5">
                      {specRows.map((row) => (
                        <div key={row.label}>
                          <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
                            {row.label}
                          </dt>
                          <dd className="mt-1.5 text-foreground/90 text-sm leading-relaxed">
                            {row.value}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <div
                      aria-hidden
                      className="my-6 h-px bg-border/40"
                    />

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
                </div>
              </aside>
            </div>

            {/* -------- More projects -------- */}
            <motion.section
              className="mt-24 border-border/30 border-t pt-14"
              {...reveal}
            >
              <h2 className="font-bold text-2xl tracking-tight sm:text-3xl">
                {t.moreProjects}
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {otherProjects.map((item) => (
                  <Link
                    className="group glass-deep flex flex-col rounded-2xl p-5 transition hover:border-primary/30"
                    key={item.slug}
                    to={`/projects/${item.slug}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-heading text-lg tracking-tight transition-colors group-hover:text-primary">
                          {item.title}
                        </p>
                        <p className="mt-1 font-mono text-[10px] text-muted-foreground/70 uppercase tracking-[0.18em]">
                          {item.year}
                        </p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                    </div>
                    <p className="mt-3 line-clamp-3 text-foreground/80 text-sm leading-relaxed">
                      {item.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {item.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetails;
