import { HeroSection } from "@/components";
import { PageLayout } from "@/components/layout/PageLayout";
import { SEO } from "@/components/seo";
import { HOME_FAQS } from "@/config/seo-data";
import { SITE_CONFIG } from "@/constants";
import {
  createPersonSchema,
  generateAlternateLanguages,
  getDefaultCitations,
  getDefaultGeoLocation,
} from "@/lib/seo-utils";

const Home = () => (
  <>
    <SEO
      alternateLanguages={[
        ...generateAlternateLanguages("/"),
        { lang: "x-default", url: SITE_CONFIG.url },
      ]}
      citationLinks={getDefaultCitations()}
      description="Dominik Könitzer - Software Engineer specializing in modern web development. Based in Switzerland, currently studying at WISS. Expert in React, TypeScript, and full-stack development. View my portfolio, projects, and skills."
      faqSchema={HOME_FAQS}
      geoLocation={getDefaultGeoLocation()}
      keywords="Dominik Könitzer, software engineer, web developer, React developer, TypeScript developer, full-stack developer, Switzerland, Swiss developer, software engineer Switzerland, web development services, frontend developer, backend developer, portfolio"
      structuredData={[createPersonSchema()]}
      title="Software Engineer & Web Developer"
      url={SITE_CONFIG.url}
    />
    <PageLayout>
      <HeroSection />
    </PageLayout>
  </>
);

export default Home;
