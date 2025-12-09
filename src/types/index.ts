export interface NavLink {
  name: string;
  targetId: string;
}

export interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  price?: string;
}

export interface Skill {
  name: string;
  level: number;
  category: "frontend" | "backend" | "tools" | "other";
  icon?: React.ReactNode;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  delay: number;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}

// Re-export SEO types
export type {
  AlternateLanguage,
  CitationLink,
  FAQItem,
  GeoLocation,
  HowToSchema,
  HowToStep,
  SEOProps,
} from "./seo";
