import { ProjectsSection } from "@/components";
import { SEO } from "@/components/seo";
import { getProjectsFaqs } from "@/config/seo-data";
import { SITE_CONFIG } from "@/constants";
import { getProjects } from "@/constants/projects";
import { useLanguage } from "@/lib/language-provider";
import {  getDefaultCitations,
  getDefaultGeoLocation,
} from "@/lib/seo-utils";
import { translations } from "@/lib/translations";

const Projects = () => {
  const { language } = useLanguage();
  const seo = translations[language].seo.projects;
  const projectsUrl = `${SITE_CONFIG.url}/projects`;
  const projects = getProjects(language);

  return (
    <>
      <SEO        citationLinks={getDefaultCitations()}
        description={seo.description}
        faqSchema={getProjectsFaqs(language)}
        geoLocation={getDefaultGeoLocation()}
        keywords={seo.keywords}
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Projects",
            description: "Impact-focused software projects by Dominik Konitzer",
            url: projectsUrl,
            inLanguage: language,
            isPartOf: { "@id": `${SITE_CONFIG.url}/#website` },
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Featured Software Projects",
            numberOfItems: projects.length,
            itemListOrder: "https://schema.org/ItemListOrderAscending",
            itemListElement: projects.map((project, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `${SITE_CONFIG.url}/projects/${project.slug}`,
              item: {
                "@type": "SoftwareApplication",
                name: project.title,
                description: project.description,
                url: project.liveUrl,
                sameAs: project.repoUrl,
                applicationCategory: "WebApplication",
                operatingSystem: "Any",
                keywords: project.tags.join(", "),
                creator: {
                  "@type": "Person",
                  name: SITE_CONFIG.name,
                  url: SITE_CONFIG.url,
                },
              },
            })),
          },
        ]}
        title={seo.title}
        url={projectsUrl}
      />
      <ProjectsSection />
    </>
  );
};

export default Projects;
