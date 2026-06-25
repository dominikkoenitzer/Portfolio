import { TimelineSection } from "@/components";
import { SEO } from "@/components/seo";
import { getTimelineFaqs } from "@/config/seo-data";
import { SITE_CONFIG } from "@/constants";
import { useLanguage } from "@/lib/language-provider";
import {
  createPersonSchema,
  getDefaultCitations,
  getDefaultGeoLocation,
} from "@/lib/seo-utils";
import { translations } from "@/lib/translations";

const Timeline = () => {
  const { language } = useLanguage();
  const seo = translations[language].seo.timeline;
  const timelineUrl = `${SITE_CONFIG.url}/timeline`;

  return (
    <>
      <SEO
        citationLinks={getDefaultCitations()}
        description={seo.description}
        faqSchema={getTimelineFaqs(language)}
        geoLocation={getDefaultGeoLocation()}
        image={`${SITE_CONFIG.url}/og/timeline.png`}
        keywords={seo.keywords}
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            name: "Dominik Könitzer — Career & Education Timeline",
            description:
              "The career and education timeline of Dominik Könitzer, a software engineer in Switzerland — work experience and academic background.",
            url: timelineUrl,
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
              {
                "@type": "Occupation",
                name: "Freelance Web Developer",
              },
            ],
          }),
        ]}
        title={seo.title}
        url={timelineUrl}
      />
      <TimelineSection />
    </>
  );
};

export default Timeline;
