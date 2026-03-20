import { ProjectsSection } from "@/components";
import { PageLayout } from "@/components/layout/PageLayout";
import { SEO } from "@/components/seo";
import { PROJECTS_FAQS } from "@/config/seo-data";
import { SITE_CONFIG } from "@/constants";
import {
  generateAlternateLanguages,
  getDefaultCitations,
  getDefaultGeoLocation,
} from "@/lib/seo-utils";

const Projects = () => {
  const projectsUrl = `${SITE_CONFIG.url}/projects`;

  return (
    <>
      <SEO
        alternateLanguages={generateAlternateLanguages("/projects")}
        citationLinks={getDefaultCitations()}
        description="Explore impact-focused software projects by Dominik Konitzer, including Zephyr, Spectrum, and Entropy. Review live deployments and source code that demonstrate real-world product thinking, performance optimization, and professional engineering execution."
        faqSchema={PROJECTS_FAQS}
        geoLocation={getDefaultGeoLocation()}
        keywords="software engineer portfolio, impactful web development projects, Zephyr project, Spectrum project, Entropy project, React TypeScript portfolio, frontend engineer Switzerland, hire software engineer"
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
        title="Projects"
        url={projectsUrl}
      />
      <PageLayout>
        <ProjectsSection />
      </PageLayout>
    </>
  );
};

export default Projects;