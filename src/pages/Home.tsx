import { HeroSection } from "@/components";
import { SEO } from "@/components/seo";
import { getHomeFaqs } from "@/config/seo-data";
import { SITE_CONFIG } from "@/constants";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import {
  createPersonSchema,
  generateAlternateLanguages,
  getDefaultCitations,
  getDefaultGeoLocation,
} from "@/lib/seo-utils";

const Home = () => {
  const { language } = useLanguage();
  const seo = translations[language].seo.home;

  return (
    <>
      <SEO
        alternateLanguages={[
          ...generateAlternateLanguages("/"),
          { lang: "x-default", url: SITE_CONFIG.url },
        ]}
        citationLinks={getDefaultCitations()}
        description={seo.description}
        faqSchema={getHomeFaqs(language)}
        geoLocation={getDefaultGeoLocation()}
        keywords={seo.keywords}
        structuredData={[createPersonSchema()]}
        title={seo.title}
        url={SITE_CONFIG.url}
      />
      <HeroSection />
    </>
  );
};

export default Home;
