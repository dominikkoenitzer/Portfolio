import type { Language } from "@/config/languages";
import { entropy } from "./entropy";
import { flow } from "./flow";
import { jester } from "./jester";
import { portfolio } from "./portfolio";
import { punds } from "./punds";
import { remnants } from "./remnants";
import { senbon } from "./senbon";
import { spectrum } from "./spectrum";
import { time } from "./time";
import type { LocalizedContent, PortfolioProject, ProjectBase } from "./types";
import { zephyr } from "./zephyr";

export type { PortfolioProject } from "./types";

const TONE_RADIAL =
  "bg-[radial-gradient(circle_at_50%_50%,_hsl(var(--primary)/0.18),_transparent_70%)]";

// Array order is display order (getProjects maps over this list as-is) and is
// kept sorted by repository creation date, oldest first. To add a project:
// insert it at the position matching its GitHub creation date, renumber
// `priority` to stay 1-based, and add a localized content module (keyed by slug)
// to PROJECT_CONTENT. The public API below rebuilds automatically.
const PROJECT_BASE: ProjectBase[] = [
  {
    slug: "zephyr",
    title: "Zephyr",
    year: "2024",
    repoUrl: "https://github.com/dominikkoenitzer/Zephyr",
    liveUrl: "https://zephyr.punds.ch/",
    priority: 1,
    toneClass: TONE_RADIAL,
    image: "/projects/zephyr.jpg",
    gallery: [
      "/projects/zephyr-2.jpg",
      "/projects/zephyr-3.jpg",
      "/projects/zephyr-4.jpg",
    ],
  },
  {
    slug: "portfolio",
    title: "Portfolio",
    year: "2025",
    repoUrl: "https://github.com/dominikkoenitzer/Portfolio",
    liveUrl: "https://dominikkoenitzer.ch/",
    priority: 2,
    toneClass: TONE_RADIAL,
    image: "/projects/portfolio.jpg",
    gallery: [
      "/projects/portfolio-2.jpg",
      "/projects/portfolio-3.jpg",
    ],
  },
  {
    slug: "entropy",
    title: "Entropy",
    year: "2026",
    repoUrl: "https://github.com/dominikkoenitzer/Entropy",
    liveUrl: "https://entropy.punds.ch/",
    priority: 3,
    toneClass: TONE_RADIAL,
    image: "/projects/entropy.jpg",
    gallery: [
      "/projects/entropy-2.jpg",
    ],
  },
  {
    slug: "spectrum",
    title: "Spectrum",
    year: "2026",
    repoUrl: "https://github.com/dominikkoenitzer/Spectrum",
    liveUrl: "https://spectrum.punds.ch/",
    priority: 4,
    toneClass: TONE_RADIAL,
    image: "/projects/spectrum.jpg",
    gallery: [
      "/projects/spectrum-2.jpg",
      "/projects/spectrum-3.jpg",
      "/projects/spectrum-4.jpg",
    ],
  },
  {
    slug: "remnants",
    title: "Remnants",
    year: "2026",
    repoUrl: "https://github.com/dominikkoenitzer/Remnants",
    liveUrl: "https://github.com/dominikkoenitzer/Remnants",
    downloadUrl:
      "https://github.com/dominikkoenitzer/Remnants/releases/latest/download/RemnantsUserSetup.exe",
    priority: 5,
    toneClass: TONE_RADIAL,
    image: "/projects/remnants.png",
    imageIcon: true,
    programmingLanguages: ["TypeScript"],
    operatingSystem: "Windows",
    applicationCategory: "DeveloperApplication",
  },
  {
    slug: "time",
    title: "Time",
    year: "2026",
    repoUrl: "https://github.com/dominikkoenitzer/Time",
    liveUrl: "https://time.punds.ch/",
    priority: 6,
    toneClass: TONE_RADIAL,
    image: "/projects/time.jpg",
    gallery: [
      "/projects/time-2.jpg",
      "/projects/time-3.jpg",
    ],
  },
  {
    slug: "jester",
    title: "Jester",
    year: "2026",
    repoUrl: "https://github.com/dominikkoenitzer/Jester",
    liveUrl: "https://github.com/dominikkoenitzer/Jester",
    downloadUrl:
      "https://github.com/dominikkoenitzer/Jester/releases/latest/download/Jester.exe",
    priority: 7,
    toneClass: TONE_RADIAL,
    image: "/projects/jester.png",
    programmingLanguages: ["C#"],
    operatingSystem: "Windows",
    applicationCategory: "UtilitiesApplication",
  },
  {
    slug: "flow",
    title: "Flow",
    year: "2026",
    repoUrl: "https://github.com/dominikkoenitzer/Flow",
    liveUrl: "https://github.com/dominikkoenitzer/Flow",
    downloadUrl:
      "https://github.com/dominikkoenitzer/Flow/releases/latest/download/FLOW.exe",
    priority: 8,
    toneClass: TONE_RADIAL,
    image: "/projects/flow.png",
    imageIcon: true,
    programmingLanguages: ["C++"],
    operatingSystem: "Windows",
    applicationCategory: "UtilitiesApplication",
  },
  {
    slug: "punds",
    title: "Punds",
    year: "2026",
    repoUrl: "https://github.com/dominikkoenitzer/Punds",
    liveUrl: "https://punds.ch/",
    priority: 9,
    toneClass: TONE_RADIAL,
    image: "/projects/punds.jpg",
  },
  {
    slug: "senbon",
    title: "Senbon",
    year: "2026",
    repoUrl: "https://github.com/dominikkoenitzer/Senbon",
    liveUrl: "https://senbon.ch/",
    priority: 10,
    toneClass: TONE_RADIAL,
    image: "/projects/senbon.jpg",
    gallery: [
      "/projects/senbon-2.jpg",
    ],
  },
];

const PROJECT_CONTENT: Record<string, Record<Language, LocalizedContent>> = {
  zephyr,
  portfolio,
  entropy,
  spectrum,
  remnants,
  time,
  jester,
  flow,
  punds,
  senbon,
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
