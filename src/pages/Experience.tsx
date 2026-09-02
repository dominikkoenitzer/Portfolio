import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { SEO } from "@/components/seo";
import { SITE_CONFIG } from "@/constants";
import { useLanguage } from "@/lib/language-context";
import {
  createPersonSchema,
  getDefaultCitations,
  getDefaultGeoLocation,
} from "@/lib/seo-utils";
import { translations } from "@/lib/translations";

const Experience = () => {
  const { language } = useLanguage();
  const seo = translations[language].seo.experience;
  const experienceUrl = `${SITE_CONFIG.url}/experience`;

  return (
    <>
      <SEO
        citationLinks={getDefaultCitations()}
        description={seo.description}
        geoLocation={getDefaultGeoLocation()}
        image={`${SITE_CONFIG.url}/og/experience.png`}
        keywords={seo.keywords}
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            name: "Dominik Könitzer, Career & Education",
            description:
              "The work experience and academic background of Dominik Könitzer, a software engineer in Switzerland.",
            url: experienceUrl,
            mainEntity: {
              "@type": "Person",
              name: SITE_CONFIG.name,
              jobTitle: "Software Engineer",
            },
          },
          createPersonSchema({
            alumniOf: {
              "@type": "EducationalOrganization",
              name: "WISS Schulen für Wirtschaft Informatik Immobilien",
              url: "https://www.wiss.ch",
            },
            hasOccupation: [
              {
                "@type": "Occupation",
                name: "Software Engineering Intern",
                occupationLocation: {
                  "@type": "City",
                  name: "Lucerne, Switzerland",
                },
              },
            ],
          }),
        ]}
        title={seo.title}
        url={experienceUrl}
      />
      <ExperienceSection />
    </>
  );
};

export default Experience;
