import { AboutSection } from "@/components";
import { PageLayout } from "@/components/layout/PageLayout";
import { SEO } from "@/components/seo";
import { ABOUT_FAQS } from "@/config/seo-data";
import { SITE_CONFIG } from "@/constants";
import {
  createPersonSchema,
  generateAlternateLanguages,
  getDefaultGeoLocation,
} from "@/lib/seo-utils";

const About = () => {
  const aboutUrl = `${SITE_CONFIG.url}/about`;

  return (
    <>
      <SEO
        alternateLanguages={generateAlternateLanguages("/about")}
        citationLinks={[{ name: "WISS Schulen", url: "https://www.wiss.ch" }]}
        description="Learn about Dominik Könitzer - a 17-year-old Software Engineer studying at WISS Schulen für Wirtschaft Informatik Immobilien. Currently in the fifth semester of a 4-year software engineering program, specializing in modern web development."
        faqSchema={ABOUT_FAQS}
        geoLocation={getDefaultGeoLocation()}
        keywords="about Dominik Könitzer, software engineer biography, WISS student, software engineering student Switzerland, web developer background, software engineer education"
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
              age: 17,
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
              "17-year-old Software Engineer studying at WISS Schulen für Wirtschaft Informatik Immobilien, currently in fifth semester of 4-year program",
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
        title="About Me"
        url={aboutUrl}
      />
      <PageLayout>
        <AboutSection />
      </PageLayout>
    </>
  );
};

export default About;
