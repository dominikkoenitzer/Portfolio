import { ArrowLeft } from "lucide-react";
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
  const projectTimeline = `${project.year} - Present`;
  const otherProjects = PORTFOLIO_PROJECTS.filter((item) => item.slug !== project.slug);
  const architectureText = project.architectureDecisions.join(" ");
  const implementationText = project.implementationHighlights.join(" ");
  const qualityText = project.qualityAndSecurity.join(" ");

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
        <div className="min-h-screen bg-background pb-20">
          <section className="border-border/30 border-b">
            <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8 md:px-12 lg:py-20">
              <h1 className="font-heading font-semibold text-4xl tracking-tight sm:text-5xl">
                {project.title}
              </h1>
              <p className="mt-4 max-w-3xl text-muted-foreground leading-7">
                {project.tagline}
              </p>
              <p className="mt-4 max-w-3xl text-foreground/90 leading-7">
                {project.description}
              </p>
            </div>
          </section>

          <section className="mx-auto max-w-5xl px-6 py-10 sm:px-8 md:px-12">
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

            <article>
              <p className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
                {projectTimeline}
              </p>

              <section className="mt-5 border-border/30 border-t pt-8">
                <h2 className="font-heading text-2xl tracking-tight">Overview</h2>
                <p className="mt-4 text-foreground/90 leading-8">{project.description}</p>
                <p className="mt-4 text-foreground/85 leading-8">{project.overview}</p>
              </section>

              <section className="mt-10 border-border/30 border-t pt-8">
                <h2 className="font-heading text-2xl tracking-tight">Notes</h2>
                <div className="mt-4 space-y-4 text-foreground/90 leading-8">
                  <p>{project.roleSummary}</p>
                  <p>{project.problemStatement}</p>
                  <p>{architectureText}</p>
                  <p>{implementationText}</p>
                  <p>{qualityText}</p>
                </div>
              </section>

              <section className="mt-10 border-border/30 border-t pt-8">
                <h2 className="font-heading text-2xl tracking-tight">Links</h2>
                <div className="mt-4 space-y-3 text-foreground/90 leading-8">
                  <p>
                    Visit Site: <a className="text-primary underline-offset-4 hover:underline" href={project.liveUrl} rel="noopener noreferrer" target="_blank">{project.liveUrl}</a>
                  </p>
                  <p>
                    Source Code: <a className="text-primary underline-offset-4 hover:underline" href={project.repoUrl} rel="noopener noreferrer" target="_blank">{project.repoUrl}</a>
                  </p>
                </div>
              </section>

              <section className="mt-10 border-border/30 border-t pt-8">
                <h2 className="font-heading text-2xl tracking-tight">More Projects</h2>
                <div className="mt-6 space-y-7">
                  {otherProjects.map((item) => (
                    <article className="border-border/30 border-b pb-6" key={item.slug}>
                      <Link
                        className="font-heading text-2xl tracking-tight transition-colors hover:text-primary"
                        to={`/projects/${item.slug}`}
                      >
                        {item.title}
                      </Link>
                      <p className="mt-2 text-muted-foreground text-sm uppercase tracking-wide">
                        {item.year} - Present
                      </p>
                      <p className="mt-3 text-foreground/85 leading-8">{item.description}</p>
                      <p className="mt-3 text-muted-foreground text-sm">{item.tags.join(" • ")}</p>
                    </article>
                  ))}
                </div>
              </section>
            </article>
          </section>
        </div>
      </PageLayout>
    </>
  );
};

export default ProjectDetails;
