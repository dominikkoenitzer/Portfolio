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
  priority: number;
  toneClass: string;
  tags: string[];
  impactHeading: string;
  impactPoints: string[];
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
};

export type ProjectBase = {
  slug: string;
  title: string;
  year: string;
  repoUrl: string;
  liveUrl: string;
  priority: number;
  toneClass: string;
};
