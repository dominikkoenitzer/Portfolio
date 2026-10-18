import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import { LiveTestCount } from "@/components/effects/project-effects";
import {
  cardImageSrc,
  pictureSrcSet,
  pictureWidth,
  type PortfolioProject,
} from "@/constants/projects";
import { revealOnScroll } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-context";
import { EASE_OUT, VIEWPORT } from "@/lib/motion";
import { translations } from "@/lib/translations";
import type { VariantProps } from "./project-variants";

/**
 * Layout d of the project page. Everything visual sits in one kind of card
 * (one radius, one tone per theme, never any text inside), and the app is
 * staged in every section: cropped so it runs off the card edge, or floated
 * whole when the capture is small. Each section repeats one unit: label,
 * headline, a short lead, the card, a caption. The longer write-up follows
 * once the pictures are told.
 */

const PAGE = "mx-auto w-full max-w-7xl px-6 sm:px-8 md:px-12 lg:px-16";

/** The one card: radius, tone and clipping, used for every visual on the page. */
const CARD = "relative isolate overflow-hidden rounded-[28px]";
const TONE = "bg-secondary";

/** Card shape: square on a phone, 16:9 from `sm`. */
const CARD_SHAPE = "aspect-square sm:aspect-video";

/** Entry: a small scale and fade on a soft spring, once, as the card arrives. */
const CARD_SPRING = { type: "spring", stiffness: 210, damping: 26, mass: 0.9 } as const;

/* ------------------------------------------------------------------ */
/* Where the app sits inside a picture                                 */
/* ------------------------------------------------------------------ */

type Rect = { x0: number; y0: number; x1: number; y1: number };

const WHOLE: Rect = { x0: 0, y0: 0, x1: 1, y1: 1 };

/**
 * The app's own window inside the pictures that were shot on the plain
 * backdrop, as fractions of the file (measured from the pixels). The stage
 * shows the window alone, so the backdrop never paints a pale box on the
 * night theme. The catalogue copies share the composition.
 */
const WINDOWS: Record<string, Rect> = {
  "/projects/entropy-3.jpg": { x0: 0.095, y0: 0.072, x1: 0.905, y1: 0.929 },
  "/projects/entropy-4.jpg": { x0: 0.25875, y0: 0.204, x1: 0.74125, y1: 0.796 },
  "/projects/entropy-5.jpg": { x0: 0.095, y0: 0.072, x1: 0.905, y1: 0.929 },
  "/projects/flow.jpg": { x0: 0.338125, y0: 0.06, x1: 0.66125, y1: 0.949 },
  "/projects/psyche.jpg": { x0: 0.26, y0: 0.206, x1: 0.739375, y1: 0.793 },
  "/projects/psyche-2.jpg": { x0: 0.145, y0: 0.102, x1: 0.854375, y1: 0.898 },
};

/**
 * Close-ups worth showing, per picture: points in the window's own fractions
 * that land on something to read. A picture with none gets one at its middle.
 */
const CLOSE_UPS: Record<string, Array<[number, number]>> = {
  "/projects/oxidize.jpg": [[0.2, 0.2], [0.58, 0.3], [0.24, 0.72]],
  "/projects/inkling.jpg": [[0.66, 0.32], [0.16, 0.2]],
  "/projects/inkling-2.jpg": [[0.3, 0.26]],
  "/projects/inkling-3.jpg": [[0.5, 0.5]],
  "/projects/inkling-4.jpg": [[0.4, 0.25]],
  "/projects/jester.jpg": [[0.24, 0.16], [0.3, 0.5], [0.3, 0.84]],
  "/projects/daifuku.jpg": [[0.17, 0.2], [0.5, 0.66], [0.84, 0.2]],
  "/projects/remnants.jpg": [[0.4, 0.3], [0.45, 0.74], [0.1, 0.3]],
  "/projects/mochi.jpg": [[0.25, 0.3], [0.75, 0.24], [0.75, 0.76]],
  "/projects/punds.jpg": [[0.5, 0.5], [0.8, 0.3], [0.2, 0.42]],
  "/projects/time.jpg": [[0.5, 0.5], [0.3, 0.52]],
  "/projects/time-2.jpg": [[0.5, 0.5], [0.7, 0.5]],
  "/projects/senbon.jpg": [[0.5, 0.32], [0.5, 0.56]],
  "/projects/senbon-2.jpg": [[0.36, 0.2], [0.46, 0.55]],
  "/projects/portfolio.jpg": [[0.3, 0.46], [0.55, 0.1]],
  "/projects/portfolio-2.jpg": [[0.3, 0.4], [0.5, 0.84]],
  "/projects/portfolio-3.jpg": [[0.5, 0.55], [0.5, 0.3]],
  "/projects/zephyr.jpg": [[0.3, 0.25], [0.6, 0.55], [0.3, 0.85]],
  "/projects/zephyr-2.jpg": [[0.45, 0.42], [0.8, 0.25]],
  "/projects/zephyr-3.jpg": [[0.4, 0.35], [0.85, 0.35]],
  "/projects/zephyr-4.jpg": [[0.5, 0.52]],
  "/projects/spectrum.jpg": [[0.25, 0.25], [0.68, 0.3]],
  "/projects/spectrum-2.jpg": [[0.3, 0.25], [0.5, 0.6]],
  "/projects/spectrum-3.jpg": [[0.25, 0.25], [0.65, 0.45]],
  "/projects/spectrum-4.jpg": [[0.45, 0.2], [0.6, 0.65]],
  "/projects/entropy.jpg": [[0.5, 0.45], [0.35, 0.3]],
  "/projects/entropy-2.jpg": [[0.5, 0.3], [0.25, 0.25]],
  "/projects/entropy-3.jpg": [[0.3, 0.2], [0.6, 0.5]],
  "/projects/entropy-5.jpg": [[0.3, 0.2], [0.55, 0.6]],
};

/** A logo picture, not a screenshot: it stays in the viewer and never gets a stage. */
const isMark = (src: string) => /-mark\.(jpe?g|png)$/i.test(src);

type Window = {
  rect: Rect;
  /** Width over height of the window. */
  aspect: number;
  /** The window's width in the file's own pixels. */
  native: number;
};

const windowOf = (src: string): Window => {
  const rect = WINDOWS[src] ?? WHOLE;
  const width = pictureWidth(src);
  const fileAspect = 16 / 10;
  return {
    rect,
    aspect: ((rect.x1 - rect.x0) * fileAspect) / (rect.y1 - rect.y0),
    native: width * (rect.x1 - rect.x0),
  };
};

/* ------------------------------------------------------------------ */
/* Stage geometry                                                      */
/* ------------------------------------------------------------------ */

/**
 * hero: centred, inset at the top, cut off by the bottom edge.
 * plate: centred and whole where it fits, for small captures.
 * left / right: pinned to one side, running off the far side where it is wide enough.
 * detail: a close-up that fills the card.
 */
type Mode = "hero" | "plate" | "left" | "right" | "detail";

/**
 * How a stage is set: its mode, the point a close-up centres on, and for a
 * capture taller than the card, which part of it shows (its top, middle or
 * bottom).
 */
type View = {
  mode: Mode;
  focus?: [number, number];
  y?: "top" | "middle" | "bottom";
  /**
   * A close-up's width in card widths, for a picture whose subject must stay
   * whole (a clock face, a name). The square phone card shows that picture
   * whole and centred instead.
   */
  zoom?: number;
};

/** A picture whose subject only reads whole: the phone shows even its head card uncropped. */
const keepWhole = (src: string) => OWN_VIEWS[src]?.every((view) => view.zoom) ?? false;

/**
 * Pictures whose subject a corner crop would cut in half: they get their own
 * list of views instead of the usual corners and close-ups.
 */
const OWN_VIEWS: Record<string, View[]> = {
  "/projects/time.jpg": [
    { mode: "detail", focus: [0.5, 0.5], zoom: 1.25 },
    { mode: "detail", focus: [0.5, 0.5], zoom: 1 },
  ],
  "/projects/time-2.jpg": [
    { mode: "detail", focus: [0.5, 0.5], zoom: 1 },
    { mode: "detail", focus: [0.5, 0.5], zoom: 1.1 },
  ],
  "/projects/portfolio.jpg": [
    { mode: "left" },
    { mode: "detail", focus: [0.34, 0.47] },
    { mode: "detail", focus: [0.5, 0.5], zoom: 1 },
  ],
  "/projects/portfolio-2.jpg": [
    { mode: "left" },
    { mode: "detail", focus: [0.35, 0.42] },
    { mode: "detail", focus: [0.5, 0.85] },
  ],
};

type Frame = {
  /** Card width over height. */
  ratio: number;
  /** Inset of the window from the card edge, in card widths. */
  pad: number;
  /** Window width for left/right, in card widths. */
  bleed: number;
  /** Window width for a close-up, in card widths. */
  zoom: number;
  /**
   * The card's width in CSS px where the file's own pixels set a limit (the
   * wide layout tops out at 1152px); 0 where a dense screen makes it moot.
   */
  reference: number;
};

const PHONE: Frame = { ratio: 1, pad: 0.07, bleed: 2, zoom: 2.4, reference: 0 };
const WIDE: Frame = { ratio: 16 / 9, pad: 0.065, bleed: 1.3, zoom: 1.7, reference: 1152 };
const TILE: Frame = { ratio: 16 / 9, pad: 0.08, bleed: 1.45, zoom: 1.8, reference: 0 };

/** Captures narrower than this are floated whole rather than cropped. */
const LARGE_CAPTURE = 1100;

type Box = { left: number; top: number; width: number };

const clamp = (value: number, low: number, high: number) =>
  Math.min(high, Math.max(low, value));

/** Left, top and width of the window, as percentages of the card. */
function placeWindow(view: View, win: Window, frame: Frame): Box {
  const { mode } = view;
  const focus = view.focus ?? [0.5, 0.4];
  const large = win.native >= LARGE_CAPTURE;
  // A small capture is never blown up past a quarter over its own size.
  const cap = frame.reference ? (win.native * 1.25) / frame.reference : Number.POSITIVE_INFINITY;
  const height = 1 / frame.ratio;
  let resolved = mode;
  if (!large && mode === "detail") resolved = "plate";
  if (mode === "hero" && !frame.reference) resolved = large && !view.zoom ? "left" : "plate";

  let width: number;
  let left: number;
  let top = frame.pad;
  if (resolved !== "detail") {
    if (resolved === "left" || resolved === "right") {
      width = Math.min(large ? frame.bleed : Math.min(frame.bleed, 1.3), cap);
      left = resolved === "left" ? frame.pad : 1 - frame.pad - width;
    } else {
      width = Math.min(resolved === "hero" ? 0.88 : frame.reference ? 0.8 : 0.84, cap);
      left = (1 - width) / 2;
    }
    const windowHeight = width / win.aspect;
    if (view.zoom && !frame.reference) top = Math.max(frame.pad, (height - windowHeight) / 2);
    if (view.y === "bottom") top = Math.min(frame.pad, height - frame.pad - windowHeight);
    if (view.y === "middle" && windowHeight + 2 * frame.pad > height) {
      top = (height - windowHeight) / 2;
    }
  } else if (view.zoom && !frame.reference) {
    // The square card shows the picture whole, centred.
    width = 1 - 2 * frame.pad;
    left = frame.pad;
    top = Math.max(frame.pad, (height - width / win.aspect) / 2);
  } else {
    // Close in, but not past a third over the file's own pixels.
    const zoom =
      view.zoom ??
      (frame.reference ? Math.min(frame.zoom, (win.native * 1.3) / frame.reference) : frame.zoom);
    width = Math.max(zoom, win.aspect * height, 1);
    const windowHeight = width / win.aspect;
    // Stay a little inside the window, so its own border never lines the card.
    const mx = 0.015 * width;
    const my = 0.015 * windowHeight;
    left = clamp(0.5 - focus[0] * width, 1 - width + mx, -mx);
    top = clamp(height / 2 - focus[1] * windowHeight, height - windowHeight + my, -my);
  }
  return { left: left * 100, top: (top / height) * 100, width: width * 100 };
}

const pct = (value: number) => `${value.toFixed(3)}%`;

/** Whether a small capture, floated at its size, runs past the bottom of the wide card. */
const isTall = (win: Window) =>
  WIDE.pad + Math.min(0.8, (win.native * 1.25) / WIDE.reference) / win.aspect > 1 / WIDE.ratio;

/** The distinct ways one picture can be staged, in the order they are used. */
function viewsOf(src: string): View[] {
  const own = OWN_VIEWS[src];
  if (own) return own;
  const win = windowOf(src);
  if (win.native < LARGE_CAPTURE) {
    const views: View[] = [{ mode: "left" }, { mode: "right" }];
    if (!isTall(win)) return views;
    // A tall capture shows a different part of itself from each anchor.
    return [
      ...views,
      { mode: "plate", y: "bottom" },
      { mode: "left", y: "middle" },
      { mode: "right", y: "bottom" },
      { mode: "plate", y: "middle" },
    ];
  }
  const points = CLOSE_UPS[src] ?? [[0.5, 0.4]];
  return [
    { mode: "left" },
    { mode: "right" },
    ...points.map((focus): View => ({ mode: "detail", focus })),
  ];
}

/** True when the stage covers the whole card, edge to edge. */
const fillsCard = (src: string, view: View) =>
  view.mode === "detail" && !view.zoom && windowOf(src).native >= LARGE_CAPTURE;

/* ------------------------------------------------------------------ */
/* Text helpers                                                        */
/* ------------------------------------------------------------------ */

/** Sentences of a paragraph, ending at `.`, `!` or `?` before a capital, or at a CJK stop. */
function sentences(text: string): string[] {
  const out: string[] = [];
  const end = /[.!?](?=\s+["“‘(]?[\p{Lu}\d])|[。！？]/gu;
  let start = 0;
  for (let match = end.exec(text); match; match = end.exec(text)) {
    const stop = match.index + match[0].length;
    out.push(text.slice(start, stop).trim());
    start = stop;
  }
  const rest = text.slice(start).trim();
  if (rest) out.push(rest);
  return out;
}

/** The first sentence or two as a lead, and what is left of the paragraph. */
function splitLead(text: string, limit = 190): { lead: string; rest: string } {
  const parts = sentences(text);
  let lead = parts[0] ?? "";
  let used = 1;
  while (used < parts.length && lead.length + parts[used].length + 1 <= limit) {
    lead = `${lead} ${parts[used]}`;
    used += 1;
  }
  return { lead, rest: parts.slice(used).join(" ") };
}

/** A caption in two tones: the first sentence (or the words before a colon) in ink, the rest muted. */
function TwoTone({ text }: { text: string }) {
  const parts = sentences(text);
  let head = parts[0] ?? text;
  let tail = parts.slice(1).join(" ");
  if (!tail) {
    const colon = text.search(/[:：]\s?/);
    if (colon > 0 && colon < text.length - 2) {
      head = text.slice(0, colon + 1);
      tail = text.slice(colon + 1).trim();
    }
  }
  return (
    <>
      <span className="font-medium text-foreground">{head}</span>
      {tail ? <span className="text-muted-foreground"> {tail}</span> : null}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* The card and its stage                                              */
/* ------------------------------------------------------------------ */

type StageProps = {
  src: string;
  /** The file actually loaded (the catalogue copy on small tiles). */
  file?: string;
  alt: string;
  view: View;
  layoutId?: string;
  priority?: boolean;
  tile?: boolean;
};

/** The app's window placed in the card for the phone and the wide layout. */
function Stage({ src, file, alt, view, layoutId, priority, tile }: StageProps) {
  const win = windowOf(src);
  const phone = placeWindow(view, win, tile ? TILE : PHONE);
  const wide = placeWindow(view, win, tile ? TILE : WIDE);
  const { rect } = win;
  const spanX = rect.x1 - rect.x0;
  const spanY = rect.y1 - rect.y0;
  const style = {
    "--l": pct(phone.left),
    "--t": pct(phone.top),
    "--w": pct(phone.width),
    "--l2": pct(wide.left),
    "--t2": pct(wide.top),
    "--w2": pct(wide.width),
    aspectRatio: win.aspect,
  } as CSSProperties;
  // Rendered width of the whole file, for the browser's pick from `srcset`.
  const wideFile = Math.round(((wide.width / 100) * 1152) / spanX);
  const phoneFile = Math.round(phone.width / spanX);
  // A close-up fills the card and shows no window edge, so it needs no
  // corner or shadow of its own.
  const floating = !fillsCard(src, view);
  return (
    <div
      className={`absolute top-[var(--t)] left-[var(--l)] w-[var(--w)] max-w-none overflow-hidden sm:top-[var(--t2)] sm:left-[var(--l2)] sm:w-[var(--w2)] ${
        floating
          ? "rounded-xl shadow-[0_24px_60px_-28px_rgb(0_0_0/0.45)] ring-1 ring-black/5 dark:ring-white/5"
          : ""
      }`}
      style={style}
    >
      <motion.img
        alt={alt}
        className="absolute max-w-none"
        decoding="async"
        draggable={false}
        fetchPriority={priority ? "high" : "auto"}
        layoutId={layoutId}
        loading={priority ? "eager" : "lazy"}
        sizes={tile ? "(min-width: 1024px) 380px, 80vw" : `(min-width: 640px) ${wideFile}px, ${phoneFile}vw`}
        src={file ?? src}
        srcSet={file ? undefined : pictureSrcSet(src)}
        style={{
          width: pct(100 / spanX),
          left: pct((-rect.x0 / spanX) * 100),
          top: pct((-rect.y0 / spanY) * 100),
        }}
      />
    </div>
  );
}

/** The card: enters with a small spring scale, presses in under a tap. */
function Card({
  children,
  label,
  onOpen,
  className = "",
  shape = CARD_SHAPE,
  covered = false,
}: {
  children: ReactNode;
  label?: string;
  onOpen?: () => void;
  className?: string;
  /** Aspect classes; the code card sizes to its text instead. */
  shape?: string;
  /**
   * The picture covers the card edge to edge. The tone is left off then: under
   * the clipped corners it showed through the antialiased edge as a hairline.
   */
  covered?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const motionProps = {
    initial: reduceMotion ? false : { opacity: 0, scale: 0.98 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: VIEWPORT,
    transition: {
      scale: CARD_SPRING,
      opacity: { duration: 0.6, ease: EASE_OUT },
    },
  } as const;
  if (onOpen && label) {
    return (
      <motion.button
        aria-label={label}
        className={`${CARD} ${covered ? "" : TONE} ${shape} block w-full cursor-zoom-in ${className}`}
        // A picture is not a label for the custom cursor to snap to.
        data-cursor-ignore
        onClick={onOpen}
        type="button"
        whileTap={reduceMotion ? undefined : { scale: 0.985 }}
        {...motionProps}
      >
        {children}
      </motion.button>
    );
  }
  return (
    <motion.div className={`${CARD} ${covered ? "" : TONE} ${shape} ${className}`} {...motionProps}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* The repeating unit                                                  */
/* ------------------------------------------------------------------ */

function UnitHead({
  label,
  heading,
  lead,
  level = 2,
  accentLabel,
}: {
  label: ReactNode;
  heading: ReactNode;
  lead?: ReactNode;
  level?: 1 | 2;
  accentLabel?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const { language } = useLanguage();
  const Heading = level === 1 ? "h1" : "h2";
  return (
    <motion.div {...revealOnScroll(reduceMotion)}>
      <p
        className={`text-primary ${
          accentLabel ? "accent-jp text-base tabular-nums" : "font-medium text-sm"
        }`}
      >
        {label}
      </p>
      <Heading
        className={`title-serif mt-3 max-w-4xl text-balance font-bold ${
          level === 1
            ? "text-6xl leading-[0.95] sm:text-7xl lg:text-8xl"
            : "text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]"
        } ${language === "en" ? "hyphens-manual" : ""}`}
      >
        {heading}
      </Heading>
      {lead ? (
        <p
          className={`max-w-2xl text-balance text-muted-foreground leading-relaxed ${
            level === 1 ? "mt-6 text-xl sm:text-2xl" : "mt-5 text-lg sm:text-xl"
          }`}
        >
          {lead}
        </p>
      ) : null}
    </motion.div>
  );
}

function Caption({ text }: { text?: string }) {
  const reduceMotion = useReducedMotion();
  if (!text) return null;
  return (
    <motion.p
      className="mt-5 max-w-2xl text-sm leading-relaxed sm:text-base"
      {...revealOnScroll(reduceMotion)}
    >
      <TwoTone text={text} />
    </motion.p>
  );
}

/* ------------------------------------------------------------------ */
/* Which picture each section stages                                   */
/* ------------------------------------------------------------------ */

type Scene = {
  picture: number;
  view: View;
  /** First time on the page: it carries the caption and the shared layout id. */
  first: boolean;
};

const viewKey = (view: View) =>
  `${view.mode}:${view.y ?? "top"}:${view.focus?.join(",") ?? ""}:${view.zoom ?? ""}`;

/**
 * One scene per section, overview first. A section names its picture through
 * `figure`; the rest take the screenshots no section claims, in order. Once
 * those run out, a section gets another view of the picture shown least so
 * far: the other corner, then the close-ups, so no two cards match.
 */
function planScenes(project: PortfolioProject, pictures: string[]): Scene[] {
  const screens = pictures.map((_, index) => index).filter((index) => !isMark(pictures[index]));
  const usable = (index: number | undefined): index is number =>
    index !== undefined && pictures[index] !== undefined && !isMark(pictures[index]);
  const claimed = new Set(project.sections.map((s) => s.figure).filter(usable));
  const free = screens.filter((index) => index !== 0 && !claimed.has(index));
  const uses = new Map<number, number>([[0, 1]]);
  const seen = new Map<number, Set<string>>();
  const slots: Array<number | undefined> = [undefined, ...project.sections.map((s) => s.figure)];

  const viewFor = (picture: number, prefer: Mode | null): View => {
    const views = viewsOf(pictures[picture]);
    const used = seen.get(picture) ?? new Set<string>();
    seen.set(picture, used);
    let pool = views.filter((view) => !used.has(viewKey(view)));
    if (!pool.length) {
      used.clear();
      pool = views;
    }
    const pick = (prefer ? pool.find((view) => view.mode === prefer) : undefined) ?? pool[0];
    used.add(viewKey(pick));
    return pick;
  };

  return slots.map((figure, slot) => {
    let picture: number;
    if (usable(figure)) picture = figure;
    else if (free.length) picture = free.shift() as number;
    else {
      // Least shown first; a picture a later section claims waits for it.
      const ready = screens.filter((index) => uses.has(index) || !claimed.has(index));
      const pool = ready.length ? ready : screens;
      picture = pool.reduce((best, index) =>
        (uses.get(index) ?? 0) < (uses.get(best) ?? 0) ? index : best,
      );
    }
    const first = !uses.has(picture);
    uses.set(picture, (uses.get(picture) ?? 0) + 1);
    return { picture, view: viewFor(picture, first ? (slot % 2 ? "right" : "left") : null), first };
  });
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function VariantD(props: VariantProps) {
  const { project, pictures } = props;
  const { language } = useLanguage();
  const t = translations[language].projectDetails;
  const reduceMotion = useReducedMotion();

  const host = project.liveUrl && !project.downloadUrl ? new URL(project.liveUrl).host : null;
  const kind = project.operatingSystem ?? host ?? project.title;
  const scenes = planScenes(project, pictures);
  const units = [
    { heading: t.overview, ...splitLead(project.overview), more: [] as string[], code: undefined },
    ...project.sections.map((section) => ({
      heading: section.heading,
      ...splitLead(section.body[0] ?? ""),
      more: section.body.slice(1),
      code: section.code,
    })),
  ];
  const facts: Array<{ label: string; value: ReactNode; wide?: boolean }> = [
    { label: t.role, value: project.roleSummary, wide: true },
    { label: t.timeline, value: props.facts[0]?.value },
  ];
  if (project.operatingSystem) {
    facts.push({ label: t.platform, value: project.operatingSystem });
  }
  const hero = pictures[0];

  return (
    <div className={`${PAGE} pt-4 pb-28`}>
      <nav aria-label={t.breadcrumb} className="flex items-center gap-2 text-muted-foreground text-sm">
        <Link className="inline-flex items-center transition-colors hover:text-foreground" to="/">
          {t.home}
        </Link>
        <span aria-hidden className="text-border">/</span>
        <Link className="inline-flex items-center transition-colors hover:text-foreground" to="/projects">
          {t.projects}
        </Link>
        <span aria-hidden className="text-border">/</span>
        <span className="text-foreground/80">{project.title}</span>
      </nav>

      {/* The head unit: the project itself. */}
      <section className="mt-12 sm:mt-16">
        <UnitHead heading={project.title} label={kind} lead={project.tagline} level={1} />
        <motion.div className="mt-8" {...revealOnScroll(reduceMotion)}>
          {props.actions}
        </motion.div>
        {hero ? (
          <>
            <Card
              className="mt-12 sm:mt-14"
              label={props.openLabelFor(0)}
              onOpen={() => props.open(0)}
            >
              <Stage
                alt={props.altFor(0)}
                layoutId="project-shot-0"
                priority
                src={hero}
                view={keepWhole(hero) ? { mode: "hero", zoom: 1 } : { mode: "hero" }}
              />
            </Card>
            <Caption text={props.captionFor(0)} />
          </>
        ) : null}

        {/* The facts, in the page's own text: no box, no rule. */}
        <motion.dl
          className="mt-14 grid grid-cols-2 gap-x-8 gap-y-8 sm:mt-16 sm:grid-cols-4"
          {...revealOnScroll(reduceMotion)}
        >
          {facts.map((fact) => (
            <div className={fact.wide ? "col-span-2" : ""} key={fact.label}>
              <dt className="text-muted-foreground text-sm">{fact.label}</dt>
              <dd className="mt-1.5 max-w-xl text-foreground/90 leading-relaxed">{fact.value}</dd>
            </div>
          ))}
          {(project.stats ?? []).map((stat) => (
            <div className="flex flex-col-reverse" key={stat.label}>
              <dt className="mt-1 text-muted-foreground text-sm">{stat.label}</dt>
              <dd className="title-serif text-3xl tabular-nums sm:text-4xl">
                {stat.liveTests ? (
                  <LiveTestCount fallback={stat.value} project={stat.liveTests} />
                ) : (
                  stat.value
                )}
              </dd>
            </div>
          ))}
        </motion.dl>
      </section>

      {/* One unit per section: label, headline, lead, the app, a caption. */}
      {units.map((unit, index) => {
        const scene = scenes[index];
        const src = scene ? pictures[scene.picture] : undefined;
        return (
          <section className="mt-28 sm:mt-40" key={unit.heading}>
            <UnitHead
              accentLabel
              heading={unit.heading}
              label={String(index + 1).padStart(2, "0")}
              lead={unit.lead}
            />
            {scene && src ? (
              <>
                <Card
                  className="mt-10 sm:mt-12"
                  covered={fillsCard(src, scene.view)}
                  label={props.openLabelFor(scene.picture)}
                  onOpen={() => props.open(scene.picture, scene.first)}
                >
                  <Stage
                    alt={props.altFor(scene.picture)}
                    layoutId={scene.first ? `project-shot-${scene.picture}` : undefined}
                    src={src}
                    view={scene.view}
                  />
                </Card>
                <Caption text={scene.first ? props.captionFor(scene.picture) : undefined} />
              </>
            ) : null}
          </section>
        );
      })}

      {/* The write-up, once the pictures are told: the rest of each section. */}
      <section className="mt-32 sm:mt-44">
        <UnitHead heading={t.inDepth} label={project.title} />
        <div className="mt-4">
          {units.map((unit) => {
            const paragraphs = [unit.rest, ...unit.more].filter(Boolean);
            if (!paragraphs.length && !unit.code) return null;
            return (
              <motion.article
                className="mt-14 sm:mt-16"
                key={unit.heading}
                {...revealOnScroll(reduceMotion)}
              >
                <h3
                  className={`max-w-2xl text-balance font-semibold text-lg leading-snug sm:text-xl ${
                    language === "en" ? "hyphens-manual" : ""
                  }`}
                >
                  {unit.heading}
                </h3>
                <div className="mt-4 max-w-2xl space-y-5">
                  {paragraphs.map((paragraph) => (
                    <p className="text-foreground/90 leading-relaxed" key={paragraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>
                {unit.code ? (
                  <figure className="m-0 mt-10">
                    <Card shape="">
                      {/* Focusable because it scrolls sideways. */}
                      <pre
                        className="code-excerpt overflow-x-auto p-6 text-[13px] leading-relaxed sm:p-10"
                        tabIndex={0}
                      >
                        <code>{unit.code.text}</code>
                      </pre>
                    </Card>
                    <figcaption className="mt-5 max-w-2xl text-sm leading-relaxed sm:text-base">
                      <TwoTone text={unit.code.caption} />
                    </figcaption>
                  </figure>
                ) : null}
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* The way out: the actions again, then three more projects. */}
      <section className="mt-32 sm:mt-44">
        <UnitHead heading={project.title} label={kind} />
        <motion.div className="mt-8" {...revealOnScroll(reduceMotion)}>
          {props.actions}
        </motion.div>
      </section>

      <section className="mt-28 sm:mt-36">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="title-serif font-bold text-3xl sm:text-4xl">{t.moreProjects}</h2>
          <Link
            className="inline-flex min-h-6 items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
            to="/projects"
          >
            {t.allProjects}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {/* A swipe row on a phone and a tablet, three across from `lg`. The
            row bleeds to the screen edge by exactly the page gutter. */}
        <div className="-mx-6 sm:-mx-8 md:-mx-12 mt-8 flex max-w-none snap-x snap-mandatory scroll-pl-6 gap-5 overflow-x-auto px-6 pb-2 sm:scroll-pl-8 sm:px-8 md:scroll-pl-12 md:px-12 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:px-0 lg:pb-0">
          {props.next.map((item) => (
            <Link
              className="group block w-[78vw] max-w-sm shrink-0 snap-start sm:w-[46vw] lg:w-auto lg:max-w-none"
              key={item.slug}
              to={`/projects/${item.slug}?v=d`}
            >
              {item.image ? (
                <Card shape="aspect-video">
                  <Stage alt="" file={cardImageSrc(item.image)} src={item.image} tile view={{ mode: "left" }} />
                </Card>
              ) : null}
              <p className="title-serif mt-4 text-xl transition-colors duration-200 ease-out group-hover:text-primary">
                {item.title}
              </p>
              <p className="mt-1.5 text-muted-foreground text-sm leading-relaxed">{item.tagline}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
