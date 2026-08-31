import { lazy, Suspense } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { SEO } from "@/components/seo";
import { useLanguage } from "@/lib/language-context";
import {
  createPersonSchema,  getDefaultCitations,
  getDefaultGeoLocation,
} from "@/lib/seo-utils";
import { translations } from "@/lib/translations";

/*
 * Home is the one page that is not lazy-loaded, so anything it imports lands in
 * the entry chunk. The selected-work section reads `constants/projects`, which
 * would drag every project's content in all four languages onto the critical
 * path (+281 kB, the regression CLAUDE.md documents), so it is split out and
 * fetched after first paint instead. It sits below the fold; there is nothing
 * to see during the swap, hence the null fallback.
 */
const HomeWorkSection = lazy(
  () => import("@/components/sections/HomeWorkSection"),
);

const Home = () => {
  const { language } = useLanguage();
  const seo = translations[language].seo.home;

  return (
    <>
      <SEO        citationLinks={getDefaultCitations()}
        description={seo.description}
        geoLocation={getDefaultGeoLocation()}
        keywords={seo.keywords}
        speakableSelectors={["h1", "h2", "[data-speakable]"]}
        structuredData={[createPersonSchema()]}
        title={seo.title}
      />
      <HeroSection />
      <Suspense fallback={null}>
        <HomeWorkSection />
      </Suspense>
    </>
  );
};

export default Home;
