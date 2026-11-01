/**
 * SEO-related TypeScript types and interfaces
 */

export interface GeoLocation {
  latitude: number;
  longitude: number;
  placename: string;
  region: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ProcessStep {
  name: string;
  text: string;
  image?: string;
}

export interface ServiceProcess {
  step: ProcessStep[];
}

export interface CitationLink {
  name: string;
  url: string;
}

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
  structuredData?: object | object[];
  geoLocation?: GeoLocation;
  faqSchema?: FAQItem[];
  citationLinks?: CitationLink[];
  /**
   * CSS selectors for content that voice assistants / AEO engines should read aloud.
   * Emitted as schema.org SpeakableSpecification.
   */
  speakableSelectors?: string[];
}
