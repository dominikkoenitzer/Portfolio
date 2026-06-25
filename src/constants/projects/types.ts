/** A punchy metric chip for the animated stats strip on the detail page. */
export type ProjectStat = { value: string; label: string };

export interface PortfolioProject {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  overview: string;
  roleSummary: string;
  problemStatement: string;
  objectives: string[];
  architectureDecisions: string[];
  implementationHighlights: string[];
  qualityAndSecurity: string[];
  challengesAndSolutions: Array<{
    challenge: string;
    solution: string;
  }>;
  hiringSignals: string[];
  nextIterations: string[];
  year: string;
  repoUrl: string;
  liveUrl: string;
  /** When set, the card/detail page show a Download button (e.g. a desktop app binary) instead of the Live link. */
  downloadUrl?: string;
  priority: number;
  toneClass: string;
  image?: string;
  /** Set for portrait (mobile/phone) screenshots so the detail page bounds them instead of stretching full-width. */
  imagePortrait?: boolean;
  /** Set when `image` is a square app icon/logo (not a screenshot): renders it contained and centered instead of full-bleed. */
  imageIcon?: boolean;
  /** Extra in-context screenshots woven through the detail-page body (paths under /public). */
  gallery?: string[];
  /** Real implementation languages for SoftwareSourceCode JSON-LD (defaults to TS/JS for web projects). */
  programmingLanguages?: string[];
  /** Target OS for SoftwareApplication JSON-LD (defaults to "Any"). */
  operatingSystem?: string;
  /** schema.org applicationCategory (defaults to "WebApplication"). */
  applicationCategory?: string;
  tags: string[];
  impactHeading: string;
  impactPoints: string[];
  /** Punchy metric chips for the animated stats strip (e.g. "9 KB" / "binary size"). */
  stats?: ProjectStat[];
}

export type LocalizedContent = {
  tagline: string;
  description: string;
  overview: string;
  roleSummary: string;
  problemStatement: string;
  objectives: string[];
  architectureDecisions: string[];
  implementationHighlights: string[];
  qualityAndSecurity: string[];
  challengesAndSolutions: Array<{ challenge: string; solution: string }>;
  hiringSignals: string[];
  nextIterations: string[];
  tags: string[];
  impactHeading: string;
  impactPoints: string[];
  stats?: ProjectStat[];
};

export type ProjectBase = {
  slug: string;
  title: string;
  year: string;
  repoUrl: string;
  liveUrl: string;
  /** When set, the card/detail page show a Download button (e.g. a desktop app binary) instead of the Live link. */
  downloadUrl?: string;
  priority: number;
  toneClass: string;
  /** Optional screenshot path under /public (e.g. /projects/<slug>.png). */
  image?: string;
  /** Set for portrait (mobile/phone) screenshots so the detail page bounds them instead of stretching full-width. */
  imagePortrait?: boolean;
  /** Set when `image` is a square app icon/logo (not a screenshot): renders it contained and centered instead of full-bleed. */
  imageIcon?: boolean;
  /** Extra in-context screenshots woven through the detail-page body (paths under /public). */
  gallery?: string[];
  /** Real implementation languages for SoftwareSourceCode JSON-LD (defaults to TS/JS for web projects). */
  programmingLanguages?: string[];
  /** Target OS for SoftwareApplication JSON-LD (defaults to "Any"). */
  operatingSystem?: string;
  /** schema.org applicationCategory (defaults to "WebApplication"). */
  applicationCategory?: string;
};
