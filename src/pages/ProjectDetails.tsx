import { ArrowLeft } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { SEO } from "@/components/seo";
import { SITE_CONFIG } from "@/constants";
import { getProject, getProjects } from "@/constants/projects";
import { useLanguage } from "@/lib/language-provider";
import {
  createSoftwareApplicationSchema,
  createSoftwareSourceCodeSchema,
  generateAlternateLanguages,
  getDefaultCitations,
  getDefaultGeoLocation,
} from "@/lib/seo-utils";
import { translations } from "@/lib/translations";

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
  const projectTimeline = `${project.year} - ${t.present}`;
  const otherProjects = getProjects(language).filter(
    (item) => item.slug !== project.slug
  );
  const technicalPoints = [
    ...project.architectureDecisions,
    ...project.implementationHighlights,
    ...project.qualityAndSecurity,
  ];

  return (
    <>
      <SEO
        alternateLanguages={generateAlternateLanguages(projectPath)}
        citationLinks={getDefaultCitations()}
        description={`${project.title}: ${project.description}`}
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
        title={`${project.title} Project`}
        url={projectUrl}
      />

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
              <div className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    className="rounded-full border border-border/40 bg-secondary/40 px-3 py-1 text-muted-foreground text-xs"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {project.image ? (
                <img
                  alt={`${project.title} screenshot`}
                  className="mt-8 w-full rounded-xl border border-border/40 object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  src={project.image}
                />
              ) : null}
            </div>
          </section>

          <section className="mx-auto max-w-5xl px-6 py-10 sm:px-8 md:px-12">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-border/40 border-b pb-4 text-xs uppercase tracking-wide">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Link className="transition-colors hover:text-foreground" to="/">
                  {t.home}
                </Link>
                <span>/</span>
                <Link className="transition-colors hover:text-foreground" to="/projects">
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

            <article>
              <p className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
                {projectTimeline}
              </p>

              <section className="mt-5 border-border/30 border-t pt-8">
                <h2 className="font-heading text-2xl tracking-tight">{t.overview}</h2>
                <p className="mt-4 text-foreground/90 leading-8">{project.description}</p>
                <p className="mt-4 text-foreground/85 leading-8">{project.overview}</p>
              </section>

              <section className="mt-10 border-border/30 border-t pt-8">
                <h2 className="font-heading text-2xl tracking-tight">{t.notes}</h2>
                <div className="mt-4 space-y-4 text-foreground/90 leading-8">
                  <p>{project.roleSummary}</p>
                  <p>{project.problemStatement}</p>
                </div>
                <ul className="mt-6 space-y-2.5">
                  {technicalPoints.map((point) => (
                    <li
                      className="flex gap-2.5 text-foreground/90 leading-7"
                      key={point}
                    >
                      <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mt-10 border-border/30 border-t pt-8">
                <h2 className="font-heading text-2xl tracking-tight">{t.links}</h2>
                <div className="mt-4 space-y-3 text-foreground/90 leading-8">
                  <p>
                    {t.visitSite}: <a className="text-primary underline-offset-4 hover:underline" href={project.liveUrl} rel="noopener noreferrer" target="_blank">{project.liveUrl}</a>
                  </p>
                  <p>
                    {t.sourceCode}: <a className="text-primary underline-offset-4 hover:underline" href={project.repoUrl} rel="noopener noreferrer" target="_blank">{project.repoUrl}</a>
                  </p>
                </div>
              </section>

              <section className="mt-10 border-border/30 border-t pt-8">
                <h2 className="font-heading text-2xl tracking-tight">{t.moreProjects}</h2>
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
                        {item.year} - {t.present}
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
    </>
  );
};

export default ProjectDetails;
