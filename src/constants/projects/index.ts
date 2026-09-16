import type { Language } from "@/config/languages";
import { SITE_CONFIG } from "@/constants";
import { entropy } from "./entropy";
import { flow } from "./flow";
import { jester } from "./jester";
import { oxidize } from "./oxidize";
import { portfolio } from "./portfolio";
import { punds } from "./punds";
import { remnants } from "./remnants";
import { senbon } from "./senbon";
import { spectrum } from "./spectrum";
import { time } from "./time";
import type { LocalizedContent, PortfolioProject, ProjectBase } from "./types";
import { zephyr } from "./zephyr";

export type { PortfolioProject } from "./types";

// Array order is display order (getProjects maps over this list as-is) and is
// kept sorted by repository creation date, oldest first. To add a project:
// insert it at the position matching its GitHub creation date, set `date` to
// that repo's created_at year-month (YYYY-MM), renumber `priority` to stay
// 1-based, and add a localized content module (keyed by slug) to
// PROJECT_CONTENT. The public API below rebuilds automatically.
const PROJECT_BASE: ProjectBase[] = [
  {
    slug: "zephyr",
    title: "Zephyr",
    date: "2024-12",
    repoUrl: "https://github.com/dominikkoenitzer/Zephyr",
    liveUrl: "https://zephyr.punds.ch/",
    priority: 1,
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
    date: "2025-05",
    repoUrl: "https://github.com/dominikkoenitzer/Portfolio",
    liveUrl: `${SITE_CONFIG.url}/`,
    priority: 2,
    image: "/projects/portfolio.jpg",
    gallery: [
      "/projects/portfolio-2.jpg",
      "/projects/portfolio-3.jpg",
    ],
  },
  {
    slug: "entropy",
    title: "Entropy",
    date: "2026-02",
    repoUrl: "https://github.com/dominikkoenitzer/Entropy",
    liveUrl: "https://entropy.punds.ch/",
    priority: 3,
    image: "/projects/entropy.jpg",
    gallery: [
      "/projects/entropy-2.jpg",
    ],
  },
  {
    slug: "spectrum",
    title: "Spectrum",
    date: "2026-02",
    repoUrl: "https://github.com/dominikkoenitzer/Spectrum",
    liveUrl: "https://spectrum.punds.ch/",
    priority: 4,
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
    date: "2026-02",
    repoUrl: "https://github.com/dominikkoenitzer/Remnants",
    liveUrl: "https://github.com/dominikkoenitzer/Remnants",
    downloadUrl:
      "https://github.com/dominikkoenitzer/Remnants/releases/latest/download/RemnantsUserSetup.exe",
    priority: 5,
    image: "/projects/remnants.jpg",
    programmingLanguages: ["TypeScript"],
    operatingSystem: "Windows",
    applicationCategory: "DeveloperApplication",
  },
  {
    slug: "time",
    title: "Time",
    date: "2026-06",
    repoUrl: "https://github.com/dominikkoenitzer/Time",
    liveUrl: "https://time.punds.ch/",
    priority: 6,
    image: "/projects/time.jpg",
    // One screen, so one extra view: the same clock in another timezone.
    gallery: ["/projects/time-2.jpg"],
  },
  {
    slug: "jester",
    title: "Jester",
    date: "2026-06",
    repoUrl: "https://github.com/dominikkoenitzer/Jester",
    liveUrl: "https://github.com/dominikkoenitzer/Jester",
    downloadUrl:
      "https://github.com/dominikkoenitzer/Jester/releases/latest/download/Jester.exe",
    priority: 7,
    image: "/projects/jester.jpg",
    programmingLanguages: ["C#"],
    operatingSystem: "Windows",
    applicationCategory: "UtilitiesApplication",
  },
  {
    slug: "flow",
    title: "Flow",
    date: "2026-06",
    repoUrl: "https://github.com/dominikkoenitzer/Flow",
    liveUrl: "https://github.com/dominikkoenitzer/Flow",
    downloadUrl:
      "https://github.com/dominikkoenitzer/Flow/releases/latest/download/FLOW.exe",
    priority: 8,
    image: "/projects/flow.jpg",
    programmingLanguages: ["C++"],
    operatingSystem: "Windows",
    applicationCategory: "UtilitiesApplication",
  },
  {
    slug: "punds",
    title: "Punds",
    date: "2026-06",
    repoUrl: "https://github.com/dominikkoenitzer/Punds",
    liveUrl: "https://punds.ch/",
    priority: 9,
    image: "/projects/punds.jpg",
  },
  {
    slug: "senbon",
    title: "Senbon",
    date: "2026-06",
    repoUrl: "https://github.com/dominikkoenitzer/Senbon",
    liveUrl: "https://senbon.ch/",
    priority: 10,
    image: "/projects/senbon.jpg",
    gallery: [
      "/projects/senbon-2.jpg",
    ],
  },
  {
    slug: "oxidize",
    title: "Oxidize",
    date: "2026-06",
    repoUrl: "https://github.com/dominikkoenitzer/Oxidize",
    liveUrl: "https://github.com/dominikkoenitzer/Oxidize",
    // Oxidize ships a versioned archive, so a fixed asset name under
    // latest/download breaks on every release. The release page always resolves.
    downloadUrl: "https://github.com/dominikkoenitzer/Oxidize/releases/latest",
    priority: 11,
    image: "/projects/oxidize.png",
    // The one shot that is not 1600px wide. Left alone on purpose: it is flat
    // terminal text, and a lanczos downscale to 1600 turns crisp glyph edges
    // into gradients that PNG cannot pack, taking the file from 144 kB to 388.
    imageWidth: 1920,
    programmingLanguages: ["Rust"],
    operatingSystem: "Windows",
    applicationCategory: "UtilitiesApplication",
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
  oxidize,
};

const resolveContent = (slug: string, lang: Language): LocalizedContent => {
  const entry = PROJECT_CONTENT[slug];
  return entry[lang] ?? entry.en;
};

const LOCALE_BY_LANG: Record<Language, string> = {
  en: "en-US",
  de: "de-CH",
  fr: "fr-CH",
  zh: "zh-CN",
};

const DATE_FORMATTERS: Partial<Record<Language, Intl.DateTimeFormat>> = {};

// "2024-12" → "Dec 2024" / "Dez. 2024" / "déc. 2024" / "2024年12月"
const formatProjectDate = (date: string, lang: Language): string => {
  const formatter = (DATE_FORMATTERS[lang] ??= new Intl.DateTimeFormat(
    LOCALE_BY_LANG[lang],
    { month: "short", year: "numeric", timeZone: "UTC" },
  ));
  return formatter.format(new Date(`${date}-01T00:00:00Z`));
};

/** Intrinsic width of a project screenshot unless the entry says otherwise. */
const DEFAULT_IMAGE_WIDTH = 1600;

/** Width of the downscaled catalogue copies `gen-card-images.ts` writes. */
export const PROJECT_CARD_WIDTH = 800;

/**
 * The /projects catalogue's copy of a project's picture: the same shot at
 * `PROJECT_CARD_WIDTH`, written by `scripts/gen-card-images.ts` and offered
 * beside the original in the card's `srcset`. Always .jpg, including for the
 * one PNG source: a downscaled screenshot has no flat regions left for PNG to
 * pack, so the format would cost more than it returns.
 */
export const cardImageSrc = (image: string): string =>
  image.replace(/\.(jpe?g|png)$/i, "-card.jpg");

/** The two candidates a catalogue card offers for a project's picture. */
export const projectCardSrcSet = (image: string, imageWidth: number): string =>
  `${cardImageSrc(image)} ${PROJECT_CARD_WIDTH}w, ${image} ${imageWidth}w`;

/**
 * How wide a catalogue card renders its picture, measured in a browser rather
 * than estimated: 534px from 1280 up, where the grid column stops growing,
 * 42vw for the two-column card between 768 and 1280, and all but the gutters
 * on a phone. Shared with the prerendered preload on /projects, which has to
 * advertise the same widths or the browser preloads one candidate and then
 * downloads the other.
 */
export const PROJECT_CARD_SIZES =
  "(min-width: 1280px) 534px, (min-width: 768px) 42vw, 93vw";

const buildProject = (base: ProjectBase, lang: Language): PortfolioProject => {
  const content = resolveContent(base.slug, lang);
  return {
    ...base,
    ...content,
    imageWidth: base.imageWidth ?? DEFAULT_IMAGE_WIDTH,
    year: base.date.slice(0, 4),
    dateLabel: formatProjectDate(base.date, lang),
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
