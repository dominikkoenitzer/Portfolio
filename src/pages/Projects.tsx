import { ProjectsSection } from "@/components";
import { SEO } from "@/components/seo";
import { getProjectsFaqs } from "@/config/seo-data";
import { SITE_CONFIG } from "@/constants";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import {
  generateAlternateLanguages,
  getDefaultCitations,
  getDefaultGeoLocation,
} from "@/lib/seo-utils";

const Projects = () => {
  const { language } = useLanguage();
  const seo = translations[language].seo.projects;
  const projectsUrl = `${SITE_CONFIG.url}/projects`;

  return (
    <>
      <SEO
        alternateLanguages={generateAlternateLanguages("/projects")}
        citationLinks={getDefaultCitations()}
        description={seo.description}
        faqSchema={getProjectsFaqs(language)}
        geoLocation={getDefaultGeoLocation()}
        keywords={seo.keywords}
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Projects",
            description:
              "Impact-focused software projects by Dominik Konitzer",
            url: projectsUrl,
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Featured Software Projects",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                item: {
                  "@type": "CreativeWork",
                  name: "Zephyr",
                  url: "https://zephyr.punds.ch/",
                  sameAs: "https://github.com/dominikkoenitzer/Zephyr",
                  creator: {
                    "@type": "Person",
                    name: SITE_CONFIG.name,
                  },
                },
              },
              {
                "@type": "ListItem",
                position: 2,
                item: {
                  "@type": "CreativeWork",
                  name: "Spectrum",
                  url: "https://spectrum.punds.ch/",
                  sameAs: "https://github.com/dominikkoenitzer/Spectrum",
                  creator: {
                    "@type": "Person",
                    name: SITE_CONFIG.name,
                  },
                },
              },
              {
                "@type": "ListItem",
                position: 3,
                item: {
                  "@type": "CreativeWork",
                  name: "Entropy",
                  url: "https://entropy.punds.ch/",
                  sameAs: "https://github.com/dominikkoenitzer/Entropy",
                  creator: {
                    "@type": "Person",
                    name: SITE_CONFIG.name,
                  },
                },
              },
            ],
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
