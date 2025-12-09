import { ContactSection } from "@/components";
import { PageLayout } from "@/components/layout/PageLayout";
import { SEO } from "@/components/seo";
import { SITE_CONFIG } from "@/constants";
import {
  createPersonSchema,
  generateAlternateLanguages,
  getDefaultGeoLocation,
} from "@/lib/seo-utils";

const Contact = () => {
  const contactUrl = `${SITE_CONFIG.url}/contact`;

  return (
    <>
      <SEO
        alternateLanguages={generateAlternateLanguages("/contact")}
        description="Get in touch with Dominik Könitzer for software engineering and web development projects. Based in Switzerland, available for freelance work, collaborations, and consulting opportunities."
        geoLocation={getDefaultGeoLocation()}
        keywords="contact Dominik Könitzer, software engineer contact, web developer contact, hire software engineer, freelance developer Switzerland, software engineering consultation"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Dominik Könitzer",
          description: "Contact page for Dominik Könitzer - Software Engineer",
          url: contactUrl,
          mainEntity: createPersonSchema({
            email: SITE_CONFIG.email,
          }),
        }}
        title="Contact"
        url={contactUrl}
      />
      <PageLayout>
        <ContactSection />
      </PageLayout>
    </>
  );
};

export default Contact;
