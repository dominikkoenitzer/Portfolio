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

export interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

export interface HowToSchema {
  name: string;
  description: string;
  step: HowToStep[];
}

export interface CitationLink {
  name: string;
  url: string;
}

export interface AlternateLanguage {
  lang: string;
  url: string;
}

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
  alternateLanguages?: AlternateLanguage[];
  structuredData?: object | object[];
  geoLocation?: GeoLocation;
  faqSchema?: FAQItem[];
  howToSchema?: HowToSchema;
  citationLinks?: CitationLink[];
}

