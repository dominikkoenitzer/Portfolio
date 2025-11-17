import { PageLayout } from '@/components/layout/PageLayout';
import { SkillsSection } from '@/components';
import { SEO } from '@/components/seo';
import { SITE_CONFIG } from '@/constants';
import {
  getDefaultGeoLocation,
  generateAlternateLanguages,
  getDefaultCitations,
  createPersonSchema,
} from '@/lib/seo-utils';
import { SKILLS_FAQS } from '@/config/seo-data';

const Skills = () => {
  const skillsUrl = `${SITE_CONFIG.url}/skills`;

  return (
    <>
      <SEO
        title="Skills & Technologies"
        description="Explore Dominik Könitzer's technical skills and expertise. Proficient in React, TypeScript, JavaScript, Node.js, and modern web development technologies. Full-stack developer with expertise in frontend and backend development."
        keywords="software engineer skills, React skills, TypeScript skills, JavaScript developer, Node.js developer, full-stack developer skills, web development technologies, programming languages, software engineering expertise"
        url={skillsUrl}
        geoLocation={getDefaultGeoLocation()}
        alternateLanguages={generateAlternateLanguages('/skills')}
        structuredData={[
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Technical Skills',
            description:
              'Technical skills and technologies mastered by Dominik Könitzer',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'React',
                description: 'Frontend framework - 95% proficiency',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Next.js',
                description: 'React framework - 90% proficiency',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: 'Java',
                description: 'Backend programming - 90% proficiency',
              },
              {
                '@type': 'ListItem',
                position: 4,
                name: 'TypeScript',
                description: 'Programming language - 80% proficiency',
              },
              {
                '@type': 'ListItem',
                position: 5,
                name: 'Node.js',
                description: 'Backend runtime - 85% proficiency',
              },
              {
                '@type': 'ListItem',
                position: 6,
                name: 'Spring Framework',
                description: 'Java framework - 85% proficiency',
              },
              {
                '@type': 'ListItem',
                position: 7,
                name: 'Full-Stack Development',
                description: 'Complete web application development',
              },
            ],
          },
          createPersonSchema({
            knowsAbout: [
              'React',
              'TypeScript',
              'JavaScript',
              'Node.js',
              'Java',
              'Spring Framework',
              'Full-Stack Development',
              'Web Development',
              'Software Engineering',
              'Frontend Development',
              'Backend Development',
              'DevOps',
              'Database Management',
            ],
            hasCredential: {
              '@type': 'EducationalOccupationalCredential',
              credentialCategory: 'degree',
              recognizedBy: {
                '@type': 'Organization',
                name: 'WISS Schulen für Wirtschaft Informatik Immobilien',
              },
            },
          }),
        ]}
        faqSchema={SKILLS_FAQS}
        citationLinks={getDefaultCitations()}
      />
      <PageLayout>
        <SkillsSection />
      </PageLayout>
    </>
  );
};

export default Skills;

