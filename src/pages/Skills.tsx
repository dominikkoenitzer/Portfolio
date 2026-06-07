import { SkillsSection } from "@/components";
import { SEO } from "@/components/seo";
import { getSkillsFaqs } from "@/config/seo-data";
import { SITE_CONFIG } from "@/constants";
import { useLanguage } from "@/lib/language-provider";
import {
  createPersonSchema,
  generateAlternateLanguages,
  getDefaultCitations,
  getDefaultGeoLocation,
} from "@/lib/seo-utils";
import { translations } from "@/lib/translations";

const Skills = () => {
  const { language } = useLanguage();
  const seo = translations[language].seo.skills;
  const skillsUrl = `${SITE_CONFIG.url}/skills`;

  return (
    <>
      <SEO
        alternateLanguages={generateAlternateLanguages("/skills")}
        citationLinks={getDefaultCitations()}
        description={seo.description}
        faqSchema={getSkillsFaqs(language)}
        geoLocation={getDefaultGeoLocation()}
        keywords={seo.keywords}
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Technical Skills",
            description:
              "Technical skills and technologies mastered by Dominik Könitzer",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "React",
                description: "Frontend framework - 95% proficiency",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Next.js",
                description: "React framework - 90% proficiency",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Java",
                description: "Backend programming - 90% proficiency",
              },
              {
                "@type": "ListItem",
                position: 4,
                name: "TypeScript",
                description: "Programming language - 80% proficiency",
              },
              {
                "@type": "ListItem",
                position: 5,
                name: "Node.js",
                description: "Backend runtime - 85% proficiency",
              },
              {
                "@type": "ListItem",
                position: 6,
                name: "Spring Framework",
                description: "Java framework - 85% proficiency",
              },
              {
                "@type": "ListItem",
                position: 7,
                name: "Full-Stack Development",
                description: "Complete web application development",
              },
            ],
          },
          createPersonSchema({
            knowsAbout: [
              "React",
              "TypeScript",
              "JavaScript",
              "Node.js",
              "Java",
              "Spring Framework",
              "Full-Stack Development",
              "Web Development",
              "Software Engineering",
              "Frontend Development",
              "Backend Development",
              "DevOps",
              "Database Management",
            ],
            hasCredential: {
              "@type": "EducationalOccupationalCredential",
              credentialCategory: "degree",
              recognizedBy: {
                "@type": "Organization",
                name: "WISS Schulen für Wirtschaft Informatik Immobilien",
              },
            },
          }),
        ]}
        title={seo.title}
        url={skillsUrl}
      />
      <SkillsSection />
    </>
  );
};

export default Skills;
