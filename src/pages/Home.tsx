import { PageLayout } from '@/components/layout/PageLayout';
import { HeroSection } from '@/components';
import { SEO } from '@/components/seo';
import { SITE_CONFIG } from '@/constants';
import {
  getDefaultGeoLocation,
  generateAlternateLanguages,
  getDefaultCitations,
  createPersonSchema,
} from '@/lib/seo-utils';
import { HOME_FAQS } from '@/config/seo-data';

const Home = () => {
  return (
    <>
      <SEO
        title="Software Engineer & Web Developer"
        description="Dominik Könitzer - Software Engineer specializing in modern web development. Based in Switzerland, currently studying at WISS. Expert in React, TypeScript, and full-stack development. View my portfolio, projects, and skills."
        keywords="Dominik Könitzer, software engineer, web developer, React developer, TypeScript developer, full-stack developer, Switzerland, Swiss developer, software engineer Switzerland, web development services, frontend developer, backend developer, portfolio"
        url={SITE_CONFIG.url}
        geoLocation={getDefaultGeoLocation()}
        alternateLanguages={[
          ...generateAlternateLanguages('/'),
          { lang: 'x-default', url: SITE_CONFIG.url },
        ]}
        structuredData={[createPersonSchema()]}
        faqSchema={HOME_FAQS}
        citationLinks={getDefaultCitations()}
      />
      <PageLayout>
        <HeroSection />
      </PageLayout>
    </>
  );
};

export default Home;

