import { ContactSection } from "@/components";
import { SEO } from "@/components/seo";
import { SITE_CONFIG } from "@/constants";
import { useLanguage } from "@/lib/language-provider";
import {
  createPersonSchema,
  generateAlternateLanguages,
  getDefaultGeoLocation,
} from "@/lib/seo-utils";
import { translations } from "@/lib/translations";

const Contact = () => {
  const { language } = useLanguage();
  const seo = translations[language].seo.contact;
  const contactUrl = `${SITE_CONFIG.url}/contact`;

  return (
    <>
      <SEO
        alternateLanguages={generateAlternateLanguages("/contact")}
        description={seo.description}
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
