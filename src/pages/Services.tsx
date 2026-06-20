import { ServicesSection } from "@/components";
import { SEO } from "@/components/seo";
import { getServicesFaqs, getServicesHowTo } from "@/config/seo-data";
import { SITE_CONFIG } from "@/constants";
import { useLanguage } from "@/lib/language-provider";
import {  getDefaultCitations,
  getDefaultGeoLocation,
} from "@/lib/seo-utils";
import { translations } from "@/lib/translations";

const Services = () => {
  const { language } = useLanguage();
  const seo = translations[language].seo.services;
  const servicesUrl = `${SITE_CONFIG.url}/services`;

  return (
    <>
      <SEO        citationLinks={getDefaultCitations()}
        description={seo.description}
        image={`${SITE_CONFIG.url}/og/services.png`}
        faqSchema={getServicesFaqs(language)}
        geoLocation={getDefaultGeoLocation()}
        howToSchema={getServicesHowTo(language)}
        keywords={seo.keywords}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "Software Engineering & Web Development Services",
          description:
            "Professional software engineering and web development services",
          url: servicesUrl,
          provider: {
            "@type": "Person",
            name: SITE_CONFIG.name,
            jobTitle: "Software Engineer",
            url: SITE_CONFIG.url,
          },
          areaServed: {
            "@type": "Country",
            name: "Switzerland",
          },
          serviceType: [
            "Web Development",
            "Software Engineering",
            "Frontend Development",
            "Backend Development",
            "Full-Stack Development",
            "React Development",
            "TypeScript Development",
          ],
          offers: {
            "@type": "Offer",
            description:
              "Professional software engineering and web development services",
          },
        }}
        title={seo.title}
        url={servicesUrl}
      />
      <ServicesSection />
    </>
  );
};

export default Services;
