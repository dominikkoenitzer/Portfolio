import { PageLayout } from '@/components/layout/PageLayout';
import { AboutSection } from '@/components';
import { SEO } from '@/components/seo';
import { SITE_CONFIG } from '@/constants';
import {
  getDefaultGeoLocation,
  generateAlternateLanguages,
  createPersonSchema,
} from '@/lib/seo-utils';
import { ABOUT_FAQS } from '@/config/seo-data';

const About = () => {
  const aboutUrl = `${SITE_CONFIG.url}/about`;

  return (
    <>
      <SEO
        title="About Me"
        description="Learn about Dominik Könitzer - a 17-year-old Software Engineer studying at WISS Schulen für Wirtschaft Informatik Immobilien. Currently in the fifth semester of a 4-year software engineering program, specializing in modern web development."
        keywords="about Dominik Könitzer, software engineer biography, WISS student, software engineering student Switzerland, web developer background, software engineer education"
        url={aboutUrl}
        geoLocation={getDefaultGeoLocation()}
        alternateLanguages={generateAlternateLanguages('/about')}
        structuredData={[
          {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About Dominik Könitzer',
            description:
              'Learn about Dominik Könitzer, a Software Engineer specializing in modern web development',
            url: aboutUrl,
            mainEntity: {
              '@type': 'Person',
              name: SITE_CONFIG.name,
              jobTitle: 'Software Engineer',
              alumniOf: {
                '@type': 'EducationalOrganization',
                name: 'WISS Schulen für Wirtschaft Informatik Immobilien',
                url: 'https://www.wiss.ch',
              },
              age: 17,
              knowsAbout: [
                'Software Engineering',
                'Web Development',
                'React',
                'TypeScript',
                'Full-Stack Development',
              ],
            },
          },
          createPersonSchema({
            description:
              '17-year-old Software Engineer studying at WISS Schulen für Wirtschaft Informatik Immobilien, currently in fifth semester of 4-year program',
            educationalCredentialAwarded: 'Software Engineering Degree (In Progress)',
            hasCredential: {
              '@type': 'EducationalOccupationalCredential',
              credentialCategory: 'degree',
              educationalLevel: 'Vocational Education',
              recognizedBy: {
                '@type': 'Organization',
                name: 'WISS Schulen für Wirtschaft Informatik Immobilien',
              },
            },
          }),
        ]}
        faqSchema={ABOUT_FAQS}
        citationLinks={[{ name: 'WISS Schulen', url: 'https://www.wiss.ch' }]}
      />
      <PageLayout>
        <AboutSection />
      </PageLayout>
    </>
  );
};

export default About;

