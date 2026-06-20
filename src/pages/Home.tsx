import { HeroSection } from "@/components";
import { SEO } from "@/components/seo";
import { getHomeFaqs } from "@/config/seo-data";
import { SITE_CONFIG } from "@/constants";
import { useLanguage } from "@/lib/language-provider";
import {
  createPersonSchema,  getDefaultCitations,
  getDefaultGeoLocation,
} from "@/lib/seo-utils";
import { translations } from "@/lib/translations";

const Home = () => {
  const { language } = useLanguage();
  const seo = translations[language].seo.home;

  return (
    <>
      <SEO        citationLinks={getDefaultCitations()}
        description={seo.description}
        faqSchema={getHomeFaqs(language)}
        geoLocation={getDefaultGeoLocation()}
        keywords={seo.keywords}
        speakableSelectors={["h1", "h2", "[data-speakable]"]}
        structuredData={[createPersonSchema()]}
        title={seo.title}
        url={SITE_CONFIG.url}
      />
      <HeroSection />
    </>
  );
};

export default Home;
