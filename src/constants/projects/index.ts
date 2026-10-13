import type { Language } from "@/config/languages";
import { SITE_CONFIG } from "@/constants";
import { entropy } from "./entropy";
import { flow } from "./flow";
import { inkling } from "./inkling";
import { jester } from "./jester";
import { mochi } from "./mochi";
import { daifuku } from "./daifuku";
import { oxidize } from "./oxidize";
import { portfolio } from "./portfolio";
import { psyche } from "./psyche";
import { punds } from "./punds";
import { remnants } from "./remnants";
import { senbon } from "./senbon";
import { spectrum } from "./spectrum";
import { PROJECT_STACKS } from "./stacks";
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
    sourcePrivate: true,
    liveUrl: "https://entropy.punds.ch/",
    priority: 3,
    image: "/projects/entropy.jpg",
    gallery: [
      "/projects/entropy-2.jpg",
      "/projects/entropy-3.jpg",
      "/projects/entropy-4.jpg",
      "/projects/entropy-5.jpg",
    ],
    // The website and, since October 2026, its Windows app in the same repo.
    programmingLanguages: ["TypeScript", "C#"],
    operatingSystem: "Web, Windows",
  },
  {
    slug: "spectrum",
    title: "Spectrum",
    date: "2026-02",
    repoUrl: "https://github.com/dominikkoenitzer/Spectrum",
    sourcePrivate: true,
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
    // The Windows user installer keeps a fixed name on every release, so
    // latest/download always serves the newest one. Other platforms are on the
    // release page.
    downloadUrl:
      "https://github.com/dominikkoenitzer/Remnants/releases/latest/download/RemnantsUserSetup-x64.exe",
    downloadPage: "https://get-remnants.vercel.app/",
    priority: 5,
    image: "/projects/remnants.jpg",
    gallery: ["/projects/remnants-mark.jpg"],
    programmingLanguages: ["TypeScript"],
    operatingSystem: "Windows, macOS, Linux",
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
    downloadPage: "https://get-jester.vercel.app/",
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
    downloadPage: "https://get-flow-app.vercel.app/",
    priority: 8,
    image: "/projects/flow.jpg",
    gallery: ["/projects/flow-mark.jpg"],
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
    sourcePrivate: true,
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
    // The GUI ships as one exe under a fixed name, so latest/download always
    // serves the newest build.
    downloadUrl:
      "https://github.com/dominikkoenitzer/Oxidize/releases/latest/download/oxidize-gui.exe",
    downloadPage: "https://get-oxidize.vercel.app/",
    priority: 11,
    image: "/projects/oxidize.jpg",
    gallery: ["/projects/oxidize-mark.jpg"],
    programmingLanguages: ["Rust"],
    operatingSystem: "Windows",
    applicationCategory: "UtilitiesApplication",
  },
  {
    slug: "inkling",
    title: "Inkling",
    date: "2026-07",
    repoUrl: "https://github.com/dominikkoenitzer/Inkling",
    // The Windows installer keeps a fixed name on every release. Other
    // platforms are on the release page.
    downloadUrl:
      "https://github.com/dominikkoenitzer/Inkling/releases/latest/download/Inkling-Setup.exe",
    downloadPage: "https://get-inkling.vercel.app/",
    priority: 12,
    image: "/projects/inkling.jpg",
    gallery: [
      "/projects/inkling-2.jpg",
      "/projects/inkling-3.jpg",
      "/projects/inkling-4.jpg",
    ],
    programmingLanguages: ["TypeScript"],
    operatingSystem: "Windows, macOS, Linux",
    applicationCategory: "EducationalApplication",
  },
  {
    slug: "mochi",
    title: "Mochi",
    date: "2026-09",
    repoUrl: "https://github.com/dominikkoenitzer/Mochi",
    // The installer keeps a fixed name on every release, so latest/download
    // always serves the newest one.
    downloadUrl:
      "https://github.com/dominikkoenitzer/Mochi/releases/latest/download/Mochi-Setup.exe",
    downloadPage: "https://get-mochi.vercel.app/",
    image: "/projects/mochi.jpg",
    gallery: ["/projects/mochi-mark.jpg"],
    priority: 13,
    programmingLanguages: ["Rust"],
    operatingSystem: "Windows",
    applicationCategory: "UtilitiesApplication",
  },
  {
    slug: "daifuku",
    title: "Daifuku",
    date: "2026-09",
    repoUrl: "https://github.com/dominikkoenitzer/Daifuku",
    downloadUrl:
      "https://github.com/dominikkoenitzer/Daifuku/releases/latest/download/daifuku.exe",
    downloadPage: "https://get-daifuku.vercel.app/",
    image: "/projects/daifuku.jpg",
    priority: 14,
    programmingLanguages: ["Rust"],
    operatingSystem: "Windows",
    applicationCategory: "DeveloperApplication",
  },
  {
    slug: "psyche",
    title: "Psyche",
    date: "2026-10",
    repoUrl: "https://github.com/dominikkoenitzer/Psyche",
    sourcePrivate: true,
    priority: 15,
    image: "/projects/psyche.jpg",
    gallery: ["/projects/psyche-2.jpg"],
    programmingLanguages: ["C#"],
    operatingSystem: "Windows",
    applicationCategory: "SecurityApplication",
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
  inkling,
  mochi,
  daifuku,
  psyche,
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

/**
 * Every picture that is not 1600px wide: the web projects are captured at
 * twice the 1600x1000 viewport, so the lightbox shows them sharp on any
 * screen. `scripts/gen-card-images.ts` checks each entry against the file.
 */
const PICTURE_WIDTHS: Record<string, number> = Object.fromEntries(
  [
    "/projects/zephyr.jpg",
    "/projects/zephyr-2.jpg",
    "/projects/zephyr-3.jpg",
    "/projects/zephyr-4.jpg",
    "/projects/portfolio.jpg",
    "/projects/portfolio-2.jpg",
    "/projects/portfolio-3.jpg",
    "/projects/entropy.jpg",
    "/projects/entropy-2.jpg",
    "/projects/spectrum.jpg",
    "/projects/spectrum-3.jpg",
    "/projects/spectrum-4.jpg",
    "/projects/time.jpg",
    "/projects/punds.jpg",
    "/projects/senbon.jpg",
    "/projects/senbon-2.jpg",
  ].map((path) => [path, 3200]),
);

/** Intrinsic pixel width of any project picture, main shot or gallery. */
export const pictureWidth = (path: string): number =>
  PICTURE_WIDTHS[path] ?? DEFAULT_IMAGE_WIDTH;

/** Width of the downscaled catalogue copies `gen-card-images.ts` writes. */
export const PROJECT_CARD_WIDTH = 800;

/**
 * Width of the middle copy `gen-card-images.ts` writes beside every picture
 * wider than this. A retina card (534px at 2x) or a reading-column figure
 * takes it, so only the lightbox ever downloads the full capture.
 */
export const PROJECT_MEDIUM_WIDTH = 1600;

/**
 * The /projects catalogue's copy of a project's picture: the same shot at
 * `PROJECT_CARD_WIDTH`, written by `scripts/gen-card-images.ts` and offered
 * beside the original in the card's `srcset`. Always .jpg, including for the
 * one PNG source: a downscaled screenshot has no flat regions left for PNG to
 * pack, so the format would cost more than it returns.
 */
export const cardImageSrc = (image: string): string =>
  image.replace(/\.(jpe?g|png)$/i, "-card.jpg");

/** The middle copy of a picture wider than `PROJECT_MEDIUM_WIDTH`. */
export const mediumImageSrc = (image: string): string =>
  image.replace(/\.(jpe?g|png)$/i, `-${PROJECT_MEDIUM_WIDTH}.jpg`);

/** The middle copy and the original, or nothing when the original is the middle size. */
const largeCandidates = (image: string, imageWidth: number): string =>
  imageWidth > PROJECT_MEDIUM_WIDTH
    ? `${mediumImageSrc(image)} ${PROJECT_MEDIUM_WIDTH}w, ${image} ${imageWidth}w`
    : `${image} ${imageWidth}w`;

/** The candidates a catalogue card offers for a project's picture. */
export const projectCardSrcSet = (image: string, imageWidth: number): string =>
  `${cardImageSrc(image)} ${PROJECT_CARD_WIDTH}w, ${largeCandidates(image, imageWidth)}`;

/**
 * The candidates for a picture in the reading column, which has no card copy:
 * undefined for a 1600px picture, where the plain `src` is the only file.
 */
export const pictureSrcSet = (image: string): string | undefined => {
  const width = pictureWidth(image);
  return width > PROJECT_MEDIUM_WIDTH ? largeCandidates(image, width) : undefined;
};

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
    imageWidth:
      base.imageWidth ?? (base.image ? pictureWidth(base.image) : DEFAULT_IMAGE_WIDTH),
    stack: PROJECT_STACKS[base.slug] ?? [],
    year: base.date.slice(0, 4),
    dateLabel: formatProjectDate(base.date, lang),
    ...(base.ended ? { endLabel: formatProjectDate(base.ended, lang) } : {}),
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
