import { ContactSection } from "@/components";
import { SEO } from "@/components/seo";
import { SITE_CONFIG } from "@/constants";
import { useLanguage } from "@/lib/language-provider";
import {
  createPersonSchema,  getDefaultGeoLocation,
} from "@/lib/seo-utils";
import { translations } from "@/lib/translations";

const Contact = () => {
  const { language } = useLanguage();
  const seo = translations[language].seo.contact;
  const contactUrl = `${SITE_CONFIG.url}/contact`;

  return (
    <>
      <SEO        description={seo.description}
        image={`${SITE_CONFIG.url}/og/contact.png`}
        geoLocation={getDefaultGeoLocation()}
        keywords={seo.keywords}
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
        title={seo.title}
        url={contactUrl}
      />
      <ContactSection />
    </>
  );
};

export default Contact;
