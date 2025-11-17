import { PageLayout } from '@/components/layout/PageLayout';
import { ContactSection } from '@/components';
import { SEO } from '@/components/seo';
import { SITE_CONFIG } from '@/constants';
import {
  getDefaultGeoLocation,
  generateAlternateLanguages,
  createPersonSchema,
} from '@/lib/seo-utils';

const Contact = () => {
  const contactUrl = `${SITE_CONFIG.url}/contact`;

  return (
    <>
      <SEO
        title="Contact"
        description="Get in touch with Dominik Könitzer for software engineering and web development projects. Based in Switzerland, available for freelance work, collaborations, and consulting opportunities."
        keywords="contact Dominik Könitzer, software engineer contact, web developer contact, hire software engineer, freelance developer Switzerland, software engineering consultation"
        url={contactUrl}
        geoLocation={getDefaultGeoLocation()}
        alternateLanguages={generateAlternateLanguages('/contact')}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact Dominik Könitzer',
          description: 'Contact page for Dominik Könitzer - Software Engineer',
          url: contactUrl,
          mainEntity: createPersonSchema({
            email: SITE_CONFIG.email,
          }),
        }}
      />
      <PageLayout>
        <ContactSection />
      </PageLayout>
    </>
  );
};

export default Contact;

