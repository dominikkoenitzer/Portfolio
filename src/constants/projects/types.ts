/** A headline number shown in the detail page meta row. */
export type ProjectStat = {
  value: string;
  label: string;
  /**
   * A project key of `api/test-count.js`. The number is then counted from the
   * repository when the page loads; `value` is what shows until it arrives,
   * and what stays if the count cannot be had.
   */
  liveTests?: string;
};

/**
 * One section of a case study, titled for that project rather than from a
 * fixed template. `figure` points into the project's pictures in reading
 * order (0 is the main shot, then the gallery), and the picture renders under
 * the section's text with its caption from `captions`.
 */
export type ProjectSection = {
  heading: string;
  /** Paragraphs, in order. */
  body: string[];
  figure?: number;
  /** A short excerpt from the real source, where it shows a decision better than prose. */
  code?: { language: string; text: string; caption: string };
};

export interface PortfolioProject {
  slug: string;
  downloadNote?: string;
  title: string;
  tagline: string;
  description: string;
  overview: string;
  roleSummary: string;
  /** The case study, in the project's own sections, after the overview. */
  sections: ProjectSection[];
  /** One caption per picture, in reading order: the main shot, then the gallery. */
  captions: string[];
  /** ISO year-month (YYYY-MM) the project's GitHub repo was created. */
  date: string;
  /** Four-digit year derived from `date`. */
  year: string;
  /** Localized month + year label derived from `date` (e.g. "Dec 2024"). */
  dateLabel: string;
  /** ISO year-month (YYYY-MM) work stopped; absent while the project is active. */
  ended?: string;
  /** Skill names the project is built with, from `stacks.ts`. */
  stack: readonly string[];
  /** Localized label for `ended`; absent while the project is still being worked on. */
  endLabel?: string;
  repoUrl: string;
  /** Absent for a project that only runs locally. */
  liveUrl?: string;
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
  /** Set when the GitHub repo is private: the Source control explains that instead of linking to a 404. */
  sourcePrivate?: boolean;
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
  /** Headline numbers for the detail page meta row (e.g. "9 KB" / "binary size"). */
  stats?: ProjectStat[];
}

export type LocalizedContent = {
  /** Replaces the generic first-launch note under a download, when this binary needs more (Flow asks for admin rights). */
  downloadNote?: string;
  tagline: string;
  description: string;
  overview: string;
  roleSummary: string;
  /** The case study, in the project's own sections, after the overview. */
  sections: ProjectSection[];
  /** One caption per picture, in reading order: the main shot, then the gallery. */
  captions: string[];
  tags: string[];
  stats?: ProjectStat[];
};

export type ProjectBase = {
  slug: string;
  title: string;
  /** ISO year-month (YYYY-MM) the GitHub repo was created, array order should match. */
  date: string;
  /** ISO year-month (YYYY-MM) work stopped. Leave it out while the project is still active. */
  ended?: string;
  repoUrl: string;
  /** Absent for a project that only runs locally: its card then offers no Live link. */
  liveUrl?: string;
  /** When set, the card/detail page show a Download button (e.g. a desktop app binary) instead of the Live link. */
  downloadUrl?: string;
  priority: number;
  /** Set when the GitHub repo is private: the Source control explains that instead of linking to a 404. */
  sourcePrivate?: boolean;
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
