import { HeroSection } from "@/components/sections/HeroSection";
import { SEO } from "@/components/seo";
import { useLanguage } from "@/lib/language-context";
import {
  createPersonSchema,
  getDefaultCitations,
  getDefaultGeoLocation,
} from "@/lib/seo-utils";
import { translations } from "@/lib/translations";

/**
 * The home page is the hero and nothing else. It is also the one page that is
 * not lazy-loaded, so keep anything heavy (project data, effects) out of here.
 */
const Home = () => {
  const { language } = useLanguage();
  const seo = translations[language].seo.home;

  return (
    <>
      <SEO
        citationLinks={getDefaultCitations()}
        description={seo.description}
        geoLocation={getDefaultGeoLocation()}
        keywords={seo.keywords}
        speakableSelectors={["h1"]}
        structuredData={[createPersonSchema()]}
        title={seo.title}
      />
      <HeroSection />
    </>
  );
};

export default Home;
