/** A headline number shown in the detail page meta row. */
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
  /** ISO year-month (YYYY-MM) the project's GitHub repo was created. */
  date: string;
  /** Four-digit year derived from `date`. */
  year: string;
  /** Localized month + year label derived from `date` (e.g. "Dec 2024"). */
  dateLabel: string;
  repoUrl: string;
  liveUrl: string;
  /** When set, the card/detail page show a Download button (e.g. a desktop app binary) instead of the Live link. */
  downloadUrl?: string;
  priority: number;
  image?: string;
  /**
   * Intrinsic pixel width of `image`, resolved from the data (1600 unless the
   * entry overrides it). It is the `w` descriptor the catalogue card's
   * `srcset` advertises, so it has to match the file on disk;
   * `scripts/gen-card-images.ts` fails the run when it does not.
   */
  imageWidth: number;
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
  /** Headline numbers for the detail page meta row (e.g. "9 KB" / "binary size"). */
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
  /** ISO year-month (YYYY-MM) the GitHub repo was created, array order should match. */
  date: string;
  repoUrl: string;
  liveUrl: string;
  /** When set, the card/detail page show a Download button (e.g. a desktop app binary) instead of the Live link. */
  downloadUrl?: string;
  priority: number;
  /** Optional screenshot path under /public (e.g. /projects/<slug>.png). */
  image?: string;
  /** Intrinsic pixel width of `image`, when it is not the usual 1600. */
  imageWidth?: number;
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
