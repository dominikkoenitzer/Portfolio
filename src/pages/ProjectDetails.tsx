import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { SEO } from "@/components/seo";
import { PORTFOLIO_PROJECTS } from "@/constants/projects";
import { SITE_CONFIG } from "@/constants";
import {
  generateAlternateLanguages,
  getDefaultCitations,
  getDefaultGeoLocation,
} from "@/lib/seo-utils";

const ProjectDetails = () => {
  const { projectSlug } = useParams();
  const project = PORTFOLIO_PROJECTS.find((item) => item.slug === projectSlug);

  if (!project) {
    return <Navigate replace to="/projects" />;
  }

  const projectPath = `/projects/${project.slug}`;
  const projectUrl = `${SITE_CONFIG.url}${projectPath}`;

  return (
    <>
      <SEO
        alternateLanguages={generateAlternateLanguages(projectPath)}
        citationLinks={getDefaultCitations()}
        description={`${project.title}: ${project.description} Explore architecture, outcomes, and project links.`}
        geoLocation={getDefaultGeoLocation()}
        keywords={`${project.title} project, software engineering case study, web development portfolio, ${project.tags.join(", ")}, Dominik Konitzer`}
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `${project.title} Project Details`,
            description: project.description,
            url: projectUrl,
          },
          {
            "@context": "https://schema.org",
            "@type": "SoftwareSourceCode",
            name: project.title,
            description: project.description,
            url: project.liveUrl,
            codeRepository: project.repoUrl,
            author: {
              "@type": "Person",
              name: SITE_CONFIG.name,
            },
            programmingLanguage: ["TypeScript", "JavaScript"],
          },
        ]}
        title={`${project.title} Project`}
        url={projectUrl}
      />

      <PageLayout>
        <div className="min-h-screen bg-background pb-16">
          <section className="relative overflow-hidden border-border/30 border-b">
            <div className={`absolute inset-0 ${project.toneClass}`} />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,_transparent_20%,_hsl(var(--foreground)/0.04)_50%,_transparent_80%)]" />
            <div className="relative mx-auto max-w-7xl px-6 py-20 text-center sm:px-8 md:px-12 md:py-24 lg:px-16 lg:py-28">
              <motion.h1
                className="font-heading font-semibold text-4xl tracking-tight sm:text-5xl md:text-6xl"
                initial={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.45 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                {project.title}
              </motion.h1>
              <motion.p
                className="mx-auto mt-4 max-w-3xl text-muted-foreground text-sm sm:text-base"
                initial={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.45, delay: 0.05 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                {project.tagline}
              </motion.p>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-6 py-10 sm:px-8 md:px-12 lg:px-16">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-border/40 border-b pb-4 text-xs uppercase tracking-wide">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Link className="transition-colors hover:text-foreground" to="/">
                  Home
                </Link>
                <span>/</span>
                <Link className="transition-colors hover:text-foreground" to="/projects">
                  Projects
                </Link>
                <span>/</span>
                <span className="text-foreground">{project.title}</span>
              </div>

              <Link
                className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                to="/projects"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
              <div className="space-y-8">
                <article className="rounded-xl border border-border/50 bg-card/50 p-5 sm:p-6 md:p-7">
                  <p className="mb-2 text-muted-foreground text-xs uppercase tracking-wide">
                    {project.year}
                  </p>
                  <h2 className="mb-3 font-heading font-semibold text-2xl tracking-tight">
                    Overview
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.overview}
                  </p>
                </article>

                <article className="rounded-xl border border-border/50 bg-card/50 p-5 sm:p-6 md:p-7">
                  <h2 className="mb-3 font-heading font-semibold text-2xl tracking-tight">
                    {project.impactHeading}
                  </h2>
                  <ul className="space-y-3 text-muted-foreground leading-relaxed">
                    {project.impactPoints.map((point) => (
                      <li className="flex items-start gap-2" key={point}>
                        <span className="mt-[10px] h-1.5 w-1.5 rounded-full bg-primary/80" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>

              <aside className="space-y-5">
                <div className="rounded-xl border border-border/50 bg-card/50 p-5 sm:p-6">
                  <h3 className="mb-3 font-heading font-semibold text-lg">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        className="rounded-full border border-border/60 bg-background/70 px-2.5 py-1 text-sm"
                        key={tag}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border/50 bg-card/50 p-5 sm:p-6">
                  <h3 className="mb-3 font-heading font-semibold text-lg">Links</h3>
                  <div className="space-y-2">
                    <a
                      className="inline-flex w-full items-center justify-between rounded-md border border-border/60 bg-background/80 px-3 py-2 text-sm transition-colors hover:border-primary/30"
                      href={project.repoUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Github className="h-4 w-4" />
                        Source Code
                      </span>
                      <ExternalLink className="h-4 w-4" />
                    </a>

                    <a
                      className="inline-flex w-full items-center justify-between rounded-md border border-border/60 bg-primary/10 px-3 py-2 text-primary text-sm transition-colors hover:bg-primary/20"
                      href={project.liveUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span className="inline-flex items-center gap-2">Live Project</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </aside>
            </div>
          </section>
        </div>
      </PageLayout>
    </>
  );
};

export default ProjectDetails;
