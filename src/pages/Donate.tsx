import { DonateSection } from "@/components";
import { PageLayout } from "@/components/layout/PageLayout";
import { SEO } from "@/components/seo";
import { SITE_CONFIG } from "@/constants";
import { generateAlternateLanguages } from "@/lib/seo-utils";

const Donate = () => (
  <>
    <SEO
      alternateLanguages={generateAlternateLanguages("/donate")}
      description="Support Dominik Könitzer's work and projects. Your contribution helps maintain and improve open-source projects and educational content."
      keywords="donate, support software engineer, contribute, open source support, developer donation"
      noindex={true}
      title="Donate"
      url={`${SITE_CONFIG.url}/donate`}
    />
    <PageLayout>
      <DonateSection />
    </PageLayout>
  </>
);

export default Donate;
