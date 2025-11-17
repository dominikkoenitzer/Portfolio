import { PageLayout } from '@/components/layout/PageLayout';
import { DonateSection } from '@/components';
import { SEO } from '@/components/seo';
import { SITE_CONFIG } from '@/constants';
import { generateAlternateLanguages } from '@/lib/seo-utils';

const Donate = () => {
  return (
    <>
      <SEO
        title="Donate"
        description="Support Dominik Könitzer's work and projects. Your contribution helps maintain and improve open-source projects and educational content."
        keywords="donate, support software engineer, contribute, open source support, developer donation"
        url={`${SITE_CONFIG.url}/donate`}
        noindex={true}
        alternateLanguages={generateAlternateLanguages('/donate')}
      />
      <PageLayout>
        <DonateSection />
      </PageLayout>
    </>
  );
};

export default Donate;

