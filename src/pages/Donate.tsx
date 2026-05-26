import { DonateSection } from "@/components";
import { SEO } from "@/components/seo";
import { getDonateFaqs, getDonateHowTo } from "@/config/seo-data";
import { SITE_CONFIG } from "@/constants";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import {
  generateAlternateLanguages,
  getDefaultCitations,
  getDefaultGeoLocation,
} from "@/lib/seo-utils";

const Donate = () => {
  const { language } = useLanguage();
  const seo = translations[language].seo.donate;

  return (
    <>
      <SEO
        alternateLanguages={generateAlternateLanguages("/donate")}
        citationLinks={getDefaultCitations()}
        description={seo.description}
        faqSchema={getDonateFaqs(language)}
        geoLocation={getDefaultGeoLocation()}
        howToSchema={getDonateHowTo(language)}
        keywords={seo.keywords}
        title={seo.title}
        url={`${SITE_CONFIG.url}/donate`}
      />
      <DonateSection />
    </>
  );
};

export default Donate;
