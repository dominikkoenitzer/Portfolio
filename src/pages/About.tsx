import { AboutSection } from "@/components";
import { SEO } from "@/components/seo";
import { getAboutFaqs } from "@/config/seo-data";
import { SITE_CONFIG } from "@/constants";
import { useLanguage } from "@/lib/language-provider";
import {
  createPersonSchema,  getDefaultGeoLocation,
} from "@/lib/seo-utils";
import { translations } from "@/lib/translations";

const About = () => {
  const { language } = useLanguage();
  const seo = translations[language].seo.about;
  const aboutUrl = `${SITE_CONFIG.url}/about`;

  return (
    <>
      <SEO        citationLinks={[{ name: "WISS Schulen", url: "https://www.wiss.ch" }]}
        description={seo.description}
        image={`${SITE_CONFIG.url}/og/about.png`}
        faqSchema={getAboutFaqs(language)}
        geoLocation={getDefaultGeoLocation()}
        keywords={seo.keywords}
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About Dominik Könitzer",
            description:
              "Learn about Dominik Könitzer, a Software Engineer specializing in modern web development",
            url: aboutUrl,
            mainEntity: {
              "@type": "Person",
              name: SITE_CONFIG.name,
              jobTitle: "Software Engineer",
              alumniOf: {
                "@type": "EducationalOrganization",
                name: "WISS Schulen für Wirtschaft Informatik Immobilien",
                url: "https://www.wiss.ch",
              },
              knowsAbout: [
                "Software Engineering",
                "Web Development",
                "React",
                "TypeScript",
                "Full-Stack Development",
              ],
            },
          },
          createPersonSchema({
            description:
              "18-year-old Software Engineer studying at WISS Schulen für Wirtschaft Informatik Immobilien, currently in sixth semester of 4-year program",
            educationalCredentialAwarded:
              "Software Engineering Degree (In Progress)",
            hasCredential: {
              "@type": "EducationalOccupationalCredential",
              credentialCategory: "degree",
              educationalLevel: "Vocational Education",
              recognizedBy: {
                "@type": "Organization",
                name: "WISS Schulen für Wirtschaft Informatik Immobilien",
              },
            },
          }),
        ]}
        title={seo.title}
        url={aboutUrl}
      />
      <AboutSection />
    </>
  );
};

export default About;
