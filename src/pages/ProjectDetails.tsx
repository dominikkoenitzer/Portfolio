import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Download,
  ExternalLink,
  Github,
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
  createSoftwareSourceCodeSchema,  getDefaultCitations,
  getDefaultGeoLocation,
} from "@/lib/seo-utils";
import { translations } from "@/lib/translations";

function Section({
  title,
  children,
  divider = true,
}: {
  title: ReactNode;
  children: ReactNode;
  divider?: boolean;
}) {
  return (
    <motion.section
      className={
        divider ? "mt-12 border-border/30 border-t pt-10" : "mt-8 pt-2"
      }
      initial={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-80px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl sm:text-3xl">{title}</h2>
      <div className="mt-5">{children}</div>
    </motion.section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          className="flex gap-3 text-foreground/90 leading-relaxed"
          key={item}
        >
          <span className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
          <span>{item}</span>
        </li>
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
          <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const ProjectDetails = () => {
  const { projectSlug } = useParams();
  const { language } = useLanguage();
  const t = translations[language].projectDetails;
  const seoSuffix = translations[language].seo.projectDetailsKeywordsSuffix;
  const project = projectSlug ? getProject(projectSlug, language) : undefined;

  if (!project) {
    return <Navigate replace to="/projects" />;
  }

  const projectPath = `/projects/${project.slug}`;
  const projectUrl = `${SITE_CONFIG.url}${projectPath}`;
  const projectTimeline = `${project.year} — ${t.present}`;
  const otherProjects = getProjects(language).filter(
    (item) => item.slug !== project.slug,
  );

  return (
    <>
      <SEO        citationLinks={getDefaultCitations()}
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

      <div className="min-h-screen">
        {/* Hero — content floats on the page's flowing veil background */}
        <section className="relative overflow-hidden">
          <div className="relative mx-auto max-w-5xl px-4 pt-4 pb-10 sm:px-6 sm:pb-12 md:px-8 lg:px-16">
            <div className="mb-12 flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-wide">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Link
                  className="transition-colors hover:text-foreground"
                  to="/"
                >
                  {t.home}
                </Link>
                <span>/</span>
                <Link
                  className="transition-colors hover:text-foreground"
                  to="/projects"
                >
                  {t.projects}
                </Link>
                <span>/</span>
                <span className="text-foreground">{project.title}</span>
              </div>

              <Link
                className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                to="/projects"
              >
                <ArrowLeft className="h-4 w-4" />
                {t.back}
              </Link>
            </div>

            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <p className="font-mono text-[11px] text-primary/70 uppercase tracking-[0.22em]">
                {projectTimeline}
              </p>
              <h1 className="mt-3 font-bold text-5xl sm:text-6xl">
                {project.title}
              </h1>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                {project.tagline}
              </p>
              <p className="mt-4 text-foreground/90 leading-relaxed">
                {project.description}
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
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
                <Button asChild className="rounded-lg px-5" variant="outline">
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
                <p className="mx-auto mt-4 max-w-prose text-muted-foreground text-xs leading-relaxed">
                  {t.downloadNote}
                </p>
              ) : null}

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </div>

            {project.image ? (
              <img
                alt={`${project.title} screenshot`}
                className={
                  project.imagePortrait
                    ? "mx-auto mt-14 max-h-[660px] w-auto rounded-2xl border border-border/40 shadow-2xl shadow-primary/10"
                    : "mx-auto mt-14 w-full max-w-4xl rounded-2xl border border-border/40 object-cover shadow-2xl shadow-primary/10"
                }
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                src={project.image}
              />
            ) : null}
          </div>
        </section>

        {/* Body — the veil dissolves into a solid reading surface here, so the
            hero/body boundary is veil-on-veil (no hard seam) and the fade to
            solid happens lower down, away from the boundary. */}
        <div
          className="relative pt-72 pb-24"
          style={{
            background:
              "linear-gradient(to bottom, hsl(var(--background) / 0) 0px, hsl(var(--background) / 0.1) 80px, hsl(var(--background) / 0.92) 220px, hsl(var(--background)) 320px)",
          }}
        >
          <div className="mx-auto max-w-3xl px-4 sm:px-6 md:px-8 lg:px-16">
            <article>
              <Section divider={false} title={t.overview}>
                <p className="border-primary/40 border-l-2 pl-4 text-foreground/80 italic leading-relaxed">
                  {project.roleSummary}
                </p>
                <p className="mt-5 text-foreground/90 leading-relaxed">
                  {project.overview}
                </p>
              </Section>

              <Section title={t.problem}>
                <p className="text-foreground/90 leading-relaxed">
                  {project.problemStatement}
                </p>
              </Section>

              <Section title={t.objectives}>
                <ol className="space-y-4">
                  {project.objectives.map((objective, index) => (
                    <li className="flex gap-4" key={objective}>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-mono text-primary text-xs">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="pt-1 text-foreground/90 leading-relaxed">
                        {objective}
                      </span>
                    </li>
                  ))}
                </ol>
              </Section>

              <Section title={t.architecture}>
                <BulletList items={project.architectureDecisions} />
              </Section>

              <Section title={t.implementation}>
                <BulletList items={project.implementationHighlights} />
              </Section>

              <Section title={t.quality}>
                <BulletList items={project.qualityAndSecurity} />
              </Section>

              <Section title={t.challenges}>
                <div className="grid gap-5 sm:grid-cols-2">
                  {project.challengesAndSolutions.map((item) => (
                    <div
                      className="glass-deep rounded-2xl p-5"
                      key={item.challenge}
                    >
                      <p className="font-mono text-[10px] text-destructive uppercase tracking-[0.18em]">
                        {t.challengeLabel}
                      </p>
                      <p className="mt-2 text-foreground/90 text-sm leading-relaxed">
                        {item.challenge}
                      </p>
                      <div className="my-4 h-px bg-border/40" />
                      <p className="font-mono text-[10px] text-primary uppercase tracking-[0.18em]">
                        {t.solutionLabel}
                      </p>
                      <p className="mt-2 text-foreground/80 text-sm leading-relaxed">
                        {item.solution}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title={project.impactHeading}>
                <CheckList items={project.impactPoints} />
              </Section>

              <Section title={t.moreProjects}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {otherProjects.map((item) => (
                    <Link
                      className="group glass-deep flex flex-col rounded-2xl p-5 transition hover:border-primary/30"
                      key={item.slug}
                      to={`/projects/${item.slug}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-heading text-xl tracking-tight transition-colors group-hover:text-primary">
                            {item.title}
                          </p>
                          <p className="mt-1 text-[11px] text-muted-foreground/70 uppercase tracking-wide">
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
              </Section>
            </article>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetails;
