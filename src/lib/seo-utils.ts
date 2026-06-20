/**
 * SEO utility functions for generating structured data and meta tags
 */

import type { Language } from "@/config/languages";
import { SITE_CONFIG } from "@/constants";
import type { CitationLink, FAQItem, HowToSchema } from "@/types/seo";

/**
 * Map a UI language code to an Open Graph locale string.
 * Used for og:locale emission.
 */
const OG_LOCALES: Record<Language, string> = {
  en: "en_US",
  de: "de_CH",
  fr: "fr_CH",
  zh: "zh_CN",
};

export const getOgLocale = (lang: Language): string =>
  OG_LOCALES[lang] ?? OG_LOCALES.en;

/**
 * Default geo location from site config
 */
export const getDefaultGeoLocation = () => ({
  latitude: SITE_CONFIG.location.latitude,
  longitude: SITE_CONFIG.location.longitude,
  placename: `${SITE_CONFIG.location.city}, ${SITE_CONFIG.location.country}`,
  region: SITE_CONFIG.location.region,
});

/**
 * Default citation links used as authority signals for AI search engines.
 */
export const getDefaultCitations = (): CitationLink[] => [
  { name: "WISS Schulen", url: "https://www.wiss.ch" },
  { name: "GitHub Profile", url: SITE_CONFIG.github },
];

/**
 * FAQ schema (schema.org/FAQPage). Rich results + AI engines read these to
 * answer follow-up questions directly.
 */
export const createFAQSchema = (
  faqs: FAQItem[],
  citations?: CitationLink[],
) => {
  if (!faqs || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
        ...(citations &&
          citations.length > 0 && {
            citation: citations.map((c) => c.url),
          }),
      },
    })),
  };
};

/**
 * HowTo schema (schema.org/HowTo). Used by AI engines for step-by-step recipes.
 */
export const createHowToSchema = (
  howTo: HowToSchema,
  citations?: CitationLink[],
) => {
  if (!howTo) return null;

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: howTo.name,
    description: howTo.description,
    step: howTo.step.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
    })),
    ...(citations &&
      citations.length > 0 && {
        citation: citations.map((c) => c.url),
      }),
  };
};

/**
 * Breadcrumb schema for the given URL. Skips emission on the homepage so
 * search consoles don't flag a single-item breadcrumb.
 */
export const createBreadcrumbSchema = (url: string) => {
  if (!url || url === SITE_CONFIG.url || url === `${SITE_CONFIG.url}/`) {
    return null;
  }

  try {
    const pathSegments = new URL(url).pathname.split("/").filter(Boolean);
    if (pathSegments.length === 0) return null;

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_CONFIG.url,
        },
        ...pathSegments.map((segment, index) => ({
          "@type": "ListItem",
          position: index + 2,
          name: segment.charAt(0).toUpperCase() + segment.slice(1),
          item: `${SITE_CONFIG.url}/${pathSegments.slice(0, index + 1).join("/")}`,
        })),
      ],
    };
  } catch {
    return null;
  }
};

/**
 * Person schema with defaults derived from SITE_CONFIG.
 * Pass per-page extras (knowsAbout, hasCredential, etc.) via `additionalData`.
 */
export const createPersonSchema = (
  additionalData?: Record<string, unknown>,
) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_CONFIG.url}/#person`,
  name: SITE_CONFIG.name,
  alternateName: ["Dominik Konitzer", "D. Könitzer"],
  url: SITE_CONFIG.url,
  image: {
    "@type": "ImageObject",
    url: `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`,
    width: 1200,
    height: 630,
  },
  sameAs: [SITE_CONFIG.github],
  jobTitle: "Software Engineer",
  knowsLanguage: ["en", "de", "fr"],
  knowsAbout: [
    "Software Engineering",
    "Web Development",
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Java",
    "Spring Framework",
    "Full-Stack Development",
    "Frontend Architecture",
    "DevOps",
    "Docker",
    "PostgreSQL",
    "MongoDB",
  ],
  email: SITE_CONFIG.email,
  nationality: { "@type": "Country", name: "Switzerland" },
  hasOccupation: {
    "@type": "Occupation",
    name: "Software Engineer",
    occupationalCategory: "15-1252.00",
    occupationLocation: { "@type": "Country", name: "Switzerland" },
    skills:
      "React, Next.js, TypeScript, JavaScript, Node.js, Java, Spring Framework, Full-Stack Development, Docker, PostgreSQL",
  },
  worksFor: { "@id": `${SITE_CONFIG.url}/#organization` },
  seeks: {
    "@type": "Demand",
    name: "Software engineering roles, internships, and freelance opportunities",
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "CH",
    addressRegion: "Zürich",
    addressLocality: "Zürich",
  },
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "WISS Schulen für Wirtschaft Informatik Immobilien",
    url: "https://www.wiss.ch",
  },
  ...additionalData,
});

/**
 * Speakable specification (schema.org/SpeakableSpecification) — voice
 * assistants and AEO engines use these CSS selectors to pick the spoken
 * summary of the page.
 */
export const createSpeakableSchema = (url: string, cssSelectors: string[]) => {
  if (!cssSelectors || cssSelectors.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: cssSelectors,
    },
  };
};

/**
 * SoftwareSourceCode schema for project detail pages — richer than the base
 * version because AI engines surface this when answering "show me X's code".
 */
export const createSoftwareSourceCodeSchema = (project: {
  title: string;
  description: string;
  liveUrl: string;
  repoUrl: string;
  tags: string[];
  year: string;
  programmingLanguages?: string[];
  operatingSystem?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: project.title,
  description: project.description,
  url: project.liveUrl,
  codeRepository: project.repoUrl,
  codeSampleType: "full",
  programmingLanguage: project.programmingLanguages ?? [
    "TypeScript",
    "JavaScript",
  ],
  runtimePlatform: project.operatingSystem ?? "Web",
  keywords: project.tags.join(", "),
  datePublished: project.year,
  author: { "@id": `${SITE_CONFIG.url}/#person` },
  creator: { "@id": `${SITE_CONFIG.url}/#person` },
  maintainer: { "@id": `${SITE_CONFIG.url}/#person` },
});

/**
 * SoftwareApplication schema — pairs with SoftwareSourceCode to describe the
 * deployed product behind a project.
 */
export const createSoftwareApplicationSchema = (project: {
  title: string;
  description: string;
  liveUrl: string;
  tags: string[];
  downloadUrl?: string;
  applicationCategory?: string;
  operatingSystem?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: project.title,
  description: project.description,
  url: project.downloadUrl ?? project.liveUrl,
  ...(project.downloadUrl && { downloadUrl: project.downloadUrl }),
  applicationCategory: project.applicationCategory ?? "WebApplication",
  operatingSystem: project.operatingSystem ?? "Any",
  keywords: project.tags.join(", "),
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CHF",
  },
  author: { "@id": `${SITE_CONFIG.url}/#person` },
});
