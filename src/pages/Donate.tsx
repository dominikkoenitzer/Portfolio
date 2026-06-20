import { DonateSection } from "@/components";
import { SEO } from "@/components/seo";
import { getDonateFaqs, getDonateHowTo } from "@/config/seo-data";
import { SITE_CONFIG } from "@/constants";
import { useLanguage } from "@/lib/language-provider";
import {  getDefaultCitations,
  getDefaultGeoLocation,
} from "@/lib/seo-utils";
import { translations } from "@/lib/translations";

const Donate = () => {
  const { language } = useLanguage();
  const seo = translations[language].seo.donate;

  return (
    <>
      <SEO        citationLinks={getDefaultCitations()}
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
