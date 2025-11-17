/**
 * SEO utility functions for generating structured data and meta tags
 */

import { SITE_CONFIG } from '@/constants';
import type { FAQItem, HowToSchema, CitationLink } from '@/types/seo';

/**
 * Generate default geo location from site config
 */
export const getDefaultGeoLocation = () => ({
  latitude: SITE_CONFIG.location.latitude,
  longitude: SITE_CONFIG.location.longitude,
  placename: SITE_CONFIG.location.country,
  region: SITE_CONFIG.location.region,
});

/**
 * Generate alternate language links for a given path
 */
export const generateAlternateLanguages = (path: string = '') => [
  { lang: 'en', url: `${SITE_CONFIG.url}${path}` },
  { lang: 'de', url: `${SITE_CONFIG.url}/de${path}` },
];

/**
 * Generate default citation links
 */
export const getDefaultCitations = (): CitationLink[] => [
  { name: 'WISS Schulen', url: 'https://www.wiss.ch' },
  { name: 'GitHub Profile', url: SITE_CONFIG.github },
];

/**
 * Create FAQ schema structured data
 */
export const createFAQSchema = (
  faqs: FAQItem[],
  citations?: CitationLink[]
) => {
  if (!faqs || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
        ...(citations && citations.length > 0 && {
          citation: citations.map((c) => c.url),
        }),
      },
    })),
  };
};

/**
 * Create HowTo schema structured data
 */
export const createHowToSchema = (
  howTo: HowToSchema,
  citations?: CitationLink[]
) => {
  if (!howTo) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howTo.name,
    description: howTo.description,
    step: howTo.step.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
    })),
    ...(citations && citations.length > 0 && {
      citation: citations.map((c) => c.url),
    }),
  };
};

/**
 * Create breadcrumb schema for a given URL
 */
export const createBreadcrumbSchema = (url: string) => {
  if (!url || url === SITE_CONFIG.url) return null;

  try {
    const pathSegments = new URL(url).pathname.split('/').filter(Boolean);
    if (pathSegments.length === 0) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE_CONFIG.url,
        },
        ...pathSegments.map((segment, index) => ({
          '@type': 'ListItem',
          position: index + 2,
          name: segment.charAt(0).toUpperCase() + segment.slice(1),
          item: `${SITE_CONFIG.url}/${pathSegments.slice(0, index + 1).join('/')}`,
        })),
      ],
    };
  } catch {
    return null;
  }
};

/**
 * Create Person schema with default values
 */
export const createPersonSchema = (additionalData?: Record<string, unknown>) => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.url,
  image: `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`,
  sameAs: [SITE_CONFIG.github],
  jobTitle: 'Software Engineer',
  worksFor: {
    '@type': 'Organization',
    name: 'WISS Schulen für Wirtschaft Informatik Immobilien',
    url: 'https://www.wiss.ch',
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'CH',
    addressLocality: 'Switzerland',
  },
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'WISS Schulen für Wirtschaft Informatik Immobilien',
  },
  ...additionalData,
});

