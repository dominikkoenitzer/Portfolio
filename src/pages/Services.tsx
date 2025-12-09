import { ServicesSection } from "@/components";
import { PageLayout } from "@/components/layout/PageLayout";
import { SEO } from "@/components/seo";
import { SERVICES_FAQS, SERVICES_HOW_TO } from "@/config/seo-data";
import { SITE_CONFIG } from "@/constants";
import {
  generateAlternateLanguages,
  getDefaultCitations,
  getDefaultGeoLocation,
} from "@/lib/seo-utils";

const Services = () => {
  const servicesUrl = `${SITE_CONFIG.url}/services`;

  return (
    <>
      <SEO
        alternateLanguages={generateAlternateLanguages("/services")}
        citationLinks={getDefaultCitations()}
        description="Professional software engineering and web development services by Dominik Könitzer. Offering frontend development, backend development, full-stack solutions, and modern web application development. Based in Switzerland, serving clients worldwide."
        faqSchema={SERVICES_FAQS}
        geoLocation={getDefaultGeoLocation()}
        howToSchema={SERVICES_HOW_TO}
        keywords="software engineering services, web development services, frontend development services, backend development services, full-stack development, React development services, TypeScript development, custom web applications, software development Switzerland"
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
        title="Services"
        url={servicesUrl}
      />
      <PageLayout>
        <ServicesSection />
      </PageLayout>
    </>
  );
};

export default Services;
