import type { Language } from "@/config/languages";
import { entropy } from "./entropy";
import { remnants } from "./remnants";
import { spectrum } from "./spectrum";
import { zephyr } from "./zephyr";
import type { LocalizedContent, PortfolioProject, ProjectBase } from "./types";

export type { PortfolioProject } from "./types";

const TONE_RADIAL =
  "bg-[radial-gradient(circle_at_50%_50%,_hsl(var(--primary)/0.18),_transparent_70%)]";

const PROJECT_BASE: ProjectBase[] = [
  {
    slug: "zephyr",
    title: "Zephyr",
    year: "2024",
    repoUrl: "https://github.com/dominikkoenitzer/Zephyr",
    liveUrl: "https://zephyr.punds.ch/",
    priority: 1,
    toneClass: TONE_RADIAL,
    image: "/projects/zephyr.png",
  },
  {
    slug: "spectrum",
    title: "Spectrum",
    year: "2026",
    repoUrl: "https://github.com/dominikkoenitzer/Spectrum",
    liveUrl: "https://spectrum.punds.ch/",
    priority: 2,
    toneClass: TONE_RADIAL,
    image: "/projects/spectrum.png",
  },
  {
    slug: "entropy",
    title: "Entropy",
    year: "2026",
    repoUrl: "https://github.com/dominikkoenitzer/Entropy",
    liveUrl: "https://entropy.punds.ch/",
    priority: 3,
    toneClass: TONE_RADIAL,
    image: "/projects/entropy.png",
  },
  {
    slug: "remnants",
    title: "Remnants",
    year: "2026",
    repoUrl: "https://github.com/dominikkoenitzer/Remnants",
    liveUrl: "https://remnants.punds.ch/",
    priority: 4,
    toneClass: TONE_RADIAL,
    image: "/projects/remnants.png",
  },
];

const PROJECT_CONTENT: Record<string, Record<Language, LocalizedContent>> = {
  zephyr,
  spectrum,
  entropy,
  remnants,
};

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
