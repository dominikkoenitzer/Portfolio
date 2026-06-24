import type { Language } from "@/config/languages";
import type { LocalizedContent, PortfolioProject, ProjectBase } from "./types";

export type { PortfolioProject } from "./types";

// The project catalog is intentionally empty — projects are being reworked.
// To re-add one: append base metadata to PROJECT_BASE and a localized content
// module (one per project, keyed by slug) to PROJECT_CONTENT. The public API
// below (getProjects / getProject / PORTFOLIO_PROJECTS) rebuilds automatically,
// so keep it stable and consumers don't need to change.
const PROJECT_BASE: ProjectBase[] = [];

const PROJECT_CONTENT: Record<string, Record<Language, LocalizedContent>> = {};

const resolveContent = (slug: string, lang: Language): LocalizedContent => {
  const entry = PROJECT_CONTENT[slug];
  return entry[lang] ?? entry.en;
};

const buildProject = (base: ProjectBase, lang: Language): PortfolioProject => {
  const content = resolveContent(base.slug, lang);
  return {
    ...base,
    ...content,
  };
};

export const getProjects = (lang: Language): PortfolioProject[] =>
  PROJECT_BASE.map((base) => buildProject(base, lang));

export const getProject = (
  slug: string,
  lang: Language,
): PortfolioProject | undefined => {
  const base = PROJECT_BASE.find((item) => item.slug === slug);
  if (!base) return undefined;
  return buildProject(base, lang);
};

export const PORTFOLIO_PROJECTS: PortfolioProject[] = getProjects("en");
