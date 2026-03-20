import { DonateSection } from "@/components";
import { PageLayout } from "@/components/layout/PageLayout";
import { SEO } from "@/components/seo";
import { DONATE_FAQS, DONATE_HOW_TO } from "@/config/seo-data";
import { SITE_CONFIG } from "@/constants";
import {
  generateAlternateLanguages,
  getDefaultCitations,
  getDefaultGeoLocation,
} from "@/lib/seo-utils";

const Donate = () => (
  <>
    <SEO
      alternateLanguages={generateAlternateLanguages("/donate")}
      citationLinks={getDefaultCitations()}
      description="Support Dominik Konitzer's software projects with a donation. Your contribution helps fund new builds, improvements, hosting, and long-term development work."
      faqSchema={DONATE_FAQS}
      geoLocation={getDefaultGeoLocation()}
      howToSchema={DONATE_HOW_TO}
      keywords="donate to developer, support software projects, support open source developer, PayPal donation, support Dominik Konitzer"
      title="Donate"
      url={`${SITE_CONFIG.url}/donate`}
    />
    <PageLayout>
      <DonateSection />
    </PageLayout>
  </>
);

export default Donate;
