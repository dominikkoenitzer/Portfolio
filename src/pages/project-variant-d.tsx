import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { type CSSProperties, type MouseEvent, type ReactNode, useRef } from "react";
import { Link } from "react-router-dom";
import { LiveTestCount, type LightboxOrigin } from "@/components/effects/project-effects";
import { pictureSrcSet, pictureWidth, type PortfolioProject } from "@/constants/projects";
import { revealOnScroll } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-context";
import { EASE_OUT, VIEWPORT } from "@/lib/motion";
import { translations } from "@/lib/translations";
import type { VariantProps } from "./project-variants";

/**
 * Layout d of the project page, built to `SPEC.md` of 18.10.: the project as
 * a short story (promise, the moment worth remembering, proof) told almost
 * entirely in pictures. The whole app in the hero, a bento of one-feature
 * tiles, the facts in one row, then the next project. Each project brings its
 * own accent, tuned for the light and the night theme.
 *
 * Every picture in a tile is one clean piece of the interface, framed whole
 * and scaled up: a crop never runs through a word.
 */

const PAGE = "mx-auto w-full max-w-7xl px-6 sm:px-8 md:px-12 lg:px-16";
const FILE_ASPECT = 16 / 10;

/** One card: radius, the project's tone, clipping. Text never sits inside. */
const CARD = "relative isolate overflow-hidden rounded-[28px] bg-[color:var(--pt)]";

/** Focus ring in the project accent, following the card radius. */
const RING =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:[outline-color:var(--pa)]";

const SPRING = { type: "spring", stiffness: 210, damping: 26, mass: 0.9 } as const;

/** A piece of interface on a card: hairline edge, contact and ambient shadow. */
const DEPTH =
  "ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgb(0_0_0/0.08),0_24px_50px_-28px_rgb(0_0_0/0.45)] dark:ring-white/10 dark:shadow-[0_1px_2px_rgb(0_0_0/0.4),0_28px_60px_-28px_rgb(0_0_0/0.8)]";

/* ------------------------------------------------------------------ */
/* Art direction                                                       */
/* ------------------------------------------------------------------ */

/** A region of a picture: left, top, right, bottom as fractions of the file. */
type Rect = [number, number, number, number];

type Shot = { pic: string; rect: Rect };

/**
 * One feature per tile. A shot is one clean region of the interface (its
 * edges fall between rows and columns, never through text); a number is a
 * fact from the case study, with what it means for the person using it.
 */
type Tile =
  | (Shot & { kind: "shot"; title: string })
  | { kind: "pair"; a: Shot; b: Shot; title: string; stack?: boolean }
  | { kind: "stat"; stat: number; title?: string }
  | { kind: "number"; value: string; title: string };

type Art = {
  /** Accent for the light theme and for the night theme. */
  accent: [string, string];
  /** The screen the hero shows whole. */
  hero: string;
  tiles: Tile[];
  /** One more full-width picture, where the project has one worth it. */
  wide?: Shot & { title: string };
};

const P = (name: string) => `/projects/${name}`;

/* Tile titles are English in this preview (see SPEC.md, section 10). */
const ART: Record<string, Art> = {
  zephyr: {
    accent: ["#a8502a", "#f2a679"],
    hero: P("zephyr.jpg"),
    tiles: [
      { kind: "shot", pic: P("zephyr-4.jpg"), rect: [0.26, 0.17, 0.7403, 0.845], title: "Focus, as a sunset" },
      { kind: "number", value: "0", title: "accounts to sign up for" },
      { kind: "shot", pic: P("zephyr.jpg"), rect: [0.1831, 0.188, 0.3753, 0.3845], title: "Today at a glance" },
      { kind: "shot", pic: P("zephyr-3.jpg"), rect: [0.18, 0.3, 0.71, 0.548], title: "Tasks sorted by due date" },
      { kind: "number", value: "100%", title: "stays on your device" },
    ],
  },
  portfolio: {
    accent: ["#5f4b8b", "#c7aef0"],
    hero: P("portfolio.jpg"),
    tiles: [
      { kind: "shot", pic: P("portfolio-3.jpg"), rect: [0.3, 0.37, 0.7, 0.97], title: "Tools on a 3D sphere" },
      { kind: "stat", stat: 0 },
      { kind: "number", value: "2", title: "themes, light and night" },
      { kind: "shot", pic: P("portfolio-2.jpg"), rect: [0.125, 0.56, 0.895, 1], title: "Every project, searchable" },
      { kind: "stat", stat: 3 },
    ],
  },
  entropy: {
    accent: ["#566300", "#d6f04a"],
    hero: P("entropy.jpg"),
    tiles: [
      { kind: "shot", pic: P("entropy-2.jpg"), rect: [0.33, 0.104, 0.9553, 0.592], title: "Crack times for five attackers" },
      { kind: "number", value: "100%", title: "stays in your browser" },
      { kind: "shot", pic: P("entropy-4.jpg"), rect: [0.2587, 0.204, 0.7419, 0.797], title: "Alt+E types your login" },
      { kind: "shot", pic: P("entropy-5.jpg"), rect: [0.1144, 0.112, 0.8806, 0.425], title: "Weak and reused, flagged" },
      { kind: "number", value: "7,776", title: "words for passphrases" },
    ],
    wide: { pic: P("entropy-3.jpg"), rect: [0.095, 0.072, 0.9056, 0.501], title: "Logins and codes, one vault" },
  },
  spectrum: {
    accent: ["#1d6a88", "#74c6e6"],
    hero: P("spectrum.jpg"),
    tiles: [
      { kind: "shot", pic: P("spectrum-4.jpg"), rect: [0.5, 0.605, 0.855, 0.993], title: "Gradients, ready to copy" },
      { kind: "shot", pic: P("spectrum-3.jpg"), rect: [0.395, 0.405, 0.8253, 0.6075], title: "Contrast checked for WCAG" },
      { kind: "number", value: "8", title: "kinds of color blindness" },
      { kind: "shot", pic: P("spectrum-2.jpg"), rect: [0.08, 0.08, 0.9003, 0.4865], title: "Every format of a color" },
      { kind: "number", value: "100%", title: "your images stay local" },
    ],
  },
  remnants: {
    accent: ["#2c58b0", "#93b3ff"],
    hero: P("remnants.jpg"),
    tiles: [
      { kind: "number", value: "759k", title: "lines of code removed" },
      { kind: "number", value: "Off", title: "telemetry and crash reports" },
      { kind: "number", value: "3", title: "systems, x64 and arm64" },
    ],
  },
  time: {
    accent: ["#ad3128", "#f2867a"],
    hero: P("time.jpg"),
    tiles: [
      {
        kind: "pair",
        a: { pic: P("time.jpg"), rect: [0.04, 0.3, 0.96, 0.7] },
        b: { pic: P("time-2.jpg"), rect: [0.04, 0.3, 0.96, 0.7] },
        title: "Zurich and Tokyo, same second",
        stack: true,
      },
      { kind: "stat", stat: 0 },
      { kind: "number", value: "3", title: "time servers compared" },
    ],
  },
  jester: {
    accent: ["#7a5c10", "#e6c65e"],
    hero: P("jester.jpg"),
    tiles: [
      { kind: "number", value: "1", title: "exe, nothing to install" },
      { kind: "number", value: "A4", title: "PDF export built in" },
      { kind: "stat", stat: 2 },
    ],
  },
  flow: {
    accent: ["#ab2f2a", "#f2908a"],
    hero: P("flow.jpg"),
    tiles: [
      { kind: "shot", pic: P("flow.jpg"), rect: [0.3381, 0.05, 0.6619, 0.392], title: "F8 records, F9 replays" },
      { kind: "number", value: "3 MB", title: "the whole app" },
      { kind: "stat", stat: 3 },
      { kind: "shot", pic: P("flow.jpg"), rect: [0.3381, 0.582, 0.6619, 0.862], title: "Clicks every 10 ms" },
      { kind: "stat", stat: 1 },
    ],
  },
  punds: {
    accent: ["#1d5c91", "#78b8f0"],
    hero: P("punds.jpg"),
    tiles: [
      { kind: "number", value: "3", title: "runtime dependencies" },
      { kind: "number", value: "4", title: "links, also in plain HTML" },
    ],
  },
  senbon: {
    accent: ["#865234", "#eab48c"],
    hero: P("senbon.jpg"),
    tiles: [
      { kind: "shot", pic: P("senbon-2.jpg"), rect: [0.3, 0.075, 0.7, 0.763], title: "Entries, newest first" },
      { kind: "stat", stat: 0 },
      { kind: "number", value: "noindex", title: "hidden from search, on purpose" },
    ],
    wide: { pic: P("senbon.jpg"), rect: [0.3, 0.37, 0.7203, 0.67], title: "A journal and a guestbook" },
  },
  oxidize: {
    accent: ["#9e4f28", "#e9a070"],
    hero: P("oxidize.jpg"),
    tiles: [
      { kind: "shot", pic: P("oxidize.jpg"), rect: [0, 0.06, 0.7137, 0.941], title: "Every program, biggest first" },
      { kind: "number", value: "0", title: "leftovers deleted without a backup" },
      { kind: "number", value: "1", title: "command undoes a removal" },
      { kind: "shot", pic: P("oxidize.jpg"), rect: [0.63, 0, 0.9956, 0.048], title: "Backups on by default" },
      { kind: "stat", stat: 3 },
    ],
  },
  inkling: {
    accent: ["#3a52a8", "#a3b5f7"],
    hero: P("inkling.jpg"),
    tiles: [
      { kind: "shot", pic: P("inkling-3.jpg"), rect: [0.39, 0.39, 0.765, 0.727], title: "Flashcards that schedule themselves" },
      { kind: "shot", pic: P("inkling-2.jpg"), rect: [0.37, 0.144, 0.7306, 0.34], title: "Write once, get flashcards" },
      { kind: "number", value: "20", title: "tools for AI assistants" },
      {
        kind: "pair",
        a: { pic: P("inkling.jpg"), rect: [0.38, 0.08, 0.8, 0.372] },
        b: { pic: P("inkling-4.jpg"), rect: [0.36, 0.09, 0.78, 0.372] },
        title: "Light and dark themes",
      },
      { kind: "number", value: "3", title: "Windows, macOS and Linux" },
    ],
  },
  mochi: {
    accent: ["#9d426b", "#f3a6ca"],
    hero: P("mochi.jpg"),
    tiles: [
      { kind: "shot", pic: P("mochi.jpg"), rect: [0.5012, 0.503, 0.9956, 0.961], title: "Scriptable from any terminal" },
      { kind: "shot", pic: P("mochi.jpg"), rect: [0.5012, 0, 0.9956, 0.504], title: "The focused window, in pink" },
      { kind: "number", value: "1", title: "key gives windows back" },
    ],
  },
  daifuku: {
    accent: ["#964b6e", "#f2a9c9"],
    hero: P("daifuku.jpg"),
    tiles: [
      { kind: "shot", pic: P("daifuku.jpg"), rect: [0.0031, 0.501, 0.3344, 0.931], title: "Yellow: it needs your answer" },
      { kind: "shot", pic: P("daifuku.jpg"), rect: [0.6644, 0.069, 0.9975, 0.5], title: "Red: it failed" },
      { kind: "number", value: "6", title: "agents on one key" },
      { kind: "shot", pic: P("daifuku.jpg"), rect: [0.3344, 0.071, 0.665, 0.5], title: "Green: it is done" },
      { kind: "shot", pic: P("daifuku.jpg"), rect: [0.0031, 0.071, 0.335, 0.5], title: "Blue: it is working" },
      { kind: "stat", stat: 1 },
    ],
  },
  psyche: {
    accent: ["#2d5ca2", "#86b9f6"],
    hero: P("psyche.jpg"),
    tiles: [
      { kind: "shot", pic: P("psyche-2.jpg"), rect: [0.145, 0.102, 0.8556, 0.834], title: "All your codes, one window" },
      { kind: "number", value: "151", title: "services it knows" },
      { kind: "number", value: "6", title: "apps you can import from" },
      { kind: "shot", pic: P("psyche.jpg"), rect: [0.2594, 0.206, 0.7406, 0.384], title: "The right account, listed first" },
      { kind: "stat", stat: 3 },
    ],
  },
};

/** A project without its own art direction: the main shot and its numbers. */
const fallbackArt = (project: PortfolioProject, pictures: string[]): Art => ({
  accent: ["#5f4b8b", "#c7aef0"],
  hero: pictures[0] ?? "",
  tiles: (project.stats ?? []).slice(0, 3).map((_, stat): Tile => ({ kind: "stat", stat })),
});

/* ------------------------------------------------------------------ */
/* Geometry                                                            */
/* ------------------------------------------------------------------ */

/**
 * The app's own window inside pictures shot on the plain backdrop, measured
 * from the pixels, so the hero shows the window alone in either theme.
 */
const WINDOWS: Record<string, Rect> = {
  [P("flow.jpg")]: [0.338125, 0.06, 0.66125, 0.949],
  [P("psyche.jpg")]: [0.26, 0.206, 0.739375, 0.793],
};

const pct = (value: number) => `${value.toFixed(3)}%`;
const aspectOf = ([x0, y0, x1, y1]: Rect) => ((x1 - x0) * FILE_ASPECT) / (y1 - y0);

/** The image inside a region's box: the whole file, offset so the region fills the box. */
const regionImageStyle = ([x0, y0, x1, y1]: Rect): CSSProperties => ({
  width: pct(100 / (x1 - x0)),
  left: pct((-x0 / (x1 - x0)) * 100),
  top: pct((-y0 / (y1 - y0)) * 100),
});

/** Where a clicked picture sits, for the viewer to open out of it. */
function originOf(clip: HTMLElement, img: HTMLImageElement, radius: number): LightboxOrigin {
  const c = clip.getBoundingClientRect();
  const i = img.getBoundingClientRect();
  const left = Math.max(c.left, i.left);
  const top = Math.max(c.top, i.top);
  const right = Math.min(c.right, i.right);
  const bottom = Math.min(c.bottom, i.bottom);
  return {
    rect: { left, top, width: right - left, height: bottom - top },
    crop: [
      (left - i.left) / i.width,
      (top - i.top) / i.height,
      (right - i.left) / i.width,
      (bottom - i.top) / i.height,
    ],
    radius,
  };
}

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

/**
 * One region of the interface, whole, as large as the box allows with 14px
 * of the card around it (so its radius is the card's 28 less 14).
 */
function Region({ src, rect, alt, sizes }: { src: string; rect: Rect; alt: string; sizes: string }) {
  const aspect = aspectOf(rect);
  return (
    <div className="absolute inset-0 flex items-center justify-center [container-type:size]">
      <div
        className={`relative max-w-none overflow-hidden rounded-[14px] ${DEPTH}`}
        data-clip
        style={{
          aspectRatio: aspect,
          width: `min(calc(100cqw - 28px), calc((100cqh - 28px) * ${aspect.toFixed(4)}))`,
        }}
      >
        <img
          alt={alt}
          className="absolute max-w-none select-none"
          data-crop
          decoding="async"
          draggable={false}
          loading="lazy"
          sizes={sizes}
          src={src}
          srcSet={pictureSrcSet(src)}
          style={regionImageStyle(rect)}
        />
      </div>
    </div>
  );
}

/**
 * The whole app window, centred in its card and as large as it fits, never
 * blown past a quarter over its own pixels.
 */
function WholeWindow({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  const rect = WINDOWS[src] ?? ([0, 0, 1, 1] as Rect);
  const aspect = aspectOf(rect);
  const native = pictureWidth(src) * (rect[2] - rect[0]);
  return (
    <div className="absolute inset-0 flex items-center justify-center [container-type:size]">
      <div
        className={`relative max-w-none overflow-hidden rounded-xl ${DEPTH}`}
        data-clip
        style={{
          aspectRatio: aspect,
          width: `min(88cqw, calc((100cqh - 12cqw) * ${aspect.toFixed(4)}), ${Math.round(native * 1.25)}px)`,
        }}
      >
        <img
          alt={alt}
          className="absolute max-w-none select-none"
          data-crop
          decoding="async"
          draggable={false}
          fetchPriority={priority ? "high" : "auto"}
          loading={priority ? "eager" : "lazy"}
          sizes="(min-width: 1280px) 1100px, 88vw"
          src={src}
          srcSet={pictureSrcSet(src)}
          style={regionImageStyle(rect)}
        />
      </div>
    </div>
  );
}

/** The picture inside a card eases closer on hover; the card itself stays still. */
const HOVER = { rest: { scale: 1 }, hover: { scale: 1.025 } };

/**
 * A number set as large as its tile allows. Long values ("noindex") get a
 * smaller size from their length, so no numeral ever runs off its card.
 */
function Numeral({ value, chars }: { value: ReactNode; chars: number }) {
  const width = Math.min(30, 150 / Math.max(chars, 1));
  return (
    <div className="absolute inset-0 flex items-end p-6 [container-type:size] sm:p-7">
      <span
        className="title-serif block whitespace-nowrap font-bold text-[color:var(--pa)] leading-[0.9] tracking-[-0.03em] tabular-nums"
        style={{ fontSize: `min(${width.toFixed(2)}cqw, 52cqh, 9rem)` }}
      >
        {value}
      </span>
    </div>
  );
}

const SIZE_CLASS = {
  L: "col-span-2 row-span-2",
  M: "col-span-2",
  S: "col-span-1",
  W: "col-span-2 sm:col-span-3",
} as const;

/** Bento patterns by tile count: no empty cell at any width. */
const PATTERNS: Record<number, Array<keyof typeof SIZE_CLASS>> = {
  1: ["W"],
  2: ["M", "S"],
  3: ["L", "S", "S"],
  4: ["L", "S", "S", "W"],
  5: ["L", "S", "S", "M", "S"],
  6: ["L", "S", "S", "S", "S", "S"],
};

function BentoTile({
  tile,
  size,
  order,
  orphan,
  props,
}: {
  tile: Tile;
  size: keyof typeof SIZE_CLASS;
  order: number;
  /** A small tile that would sit alone in its row on a phone. */
  orphan: boolean;
  props: VariantProps;
}) {
  const reduceMotion = useReducedMotion();
  const { project, pictures } = props;
  const stat = tile.kind === "stat" ? project.stats?.[tile.stat] : undefined;
  const title = tile.kind === "stat" ? (tile.title ?? stat?.label) : tile.title;
  const pic = tile.kind === "shot" ? tile.pic : tile.kind === "pair" ? tile.a.pic : null;
  const position = pic ? pictures.indexOf(pic) : -1;
  const sizes = size === "L" || size === "W" ? "(min-width: 1024px) 1600px, 100vw" : "(min-width: 1024px) 900px, 70vw";

  let visual: ReactNode = null;
  if (tile.kind === "shot") {
    visual = <Region alt={props.altFor(position)} rect={tile.rect} sizes={sizes} src={tile.pic} />;
  } else if (tile.kind === "pair") {
    visual = (
      <div className={`absolute inset-0 grid ${tile.stack ? "grid-rows-2" : "grid-cols-2"}`}>
        {[tile.a, tile.b].map((shot) => (
          <div className={`relative ${tile.stack ? "-my-[7px] first:mt-0 last:mb-0" : "-mx-[7px] first:ml-0 last:mr-0"}`} key={shot.pic}>
            <Region alt={props.altFor(pictures.indexOf(shot.pic))} rect={shot.rect} sizes={sizes} src={shot.pic} />
          </div>
        ))}
      </div>
    );
  } else if (tile.kind === "number") {
    visual = <Numeral chars={tile.value.length} value={tile.value} />;
  } else if (stat) {
    visual = (
      <Numeral
        chars={stat.value.length}
        value={stat.liveTests ? <LiveTestCount fallback={stat.value} project={stat.liveTests} /> : stat.value}
      />
    );
  }

  const open = (event: MouseEvent<HTMLElement>) => {
    if (position < 0) return;
    const img = event.currentTarget.querySelector<HTMLImageElement>("img[data-crop]");
    const clip = img?.closest<HTMLElement>("[data-clip]");
    props.open(position, img && clip ? originOf(clip, img, 14) : true);
  };

  const inner = (
    <motion.div className="absolute inset-0" transition={SPRING} variants={reduceMotion ? undefined : HOVER}>
      {visual}
    </motion.div>
  );

  return (
    <motion.div
      className={`flex min-h-0 flex-col ${SIZE_CLASS[size]} ${orphan ? "max-sm:col-span-2" : ""}`}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
      transition={{
        scale: { ...SPRING, delay: order * 0.06 },
        opacity: { duration: 0.6, ease: EASE_OUT, delay: order * 0.06 },
      }}
      viewport={VIEWPORT}
      whileInView={{ opacity: 1, scale: 1 }}
    >
      {position >= 0 ? (
        <motion.button
          aria-label={props.openLabelFor(position)}
          className={`${CARD} ${RING} group block min-h-0 w-full flex-1 cursor-zoom-in text-left transition-shadow duration-300 ease-bloom hover:[box-shadow:inset_0_0_0_1px_color-mix(in_oklab,var(--pa)_45%,transparent)]`}
          data-cursor-ignore
          initial="rest"
          onClick={open}
          type="button"
          whileHover="hover"
          whileTap={reduceMotion ? undefined : { scale: 0.985 }}
        >
          {inner}
        </motion.button>
      ) : (
        <div className={`${CARD} min-h-0 flex-1`}>{visual}</div>
      )}
      <p className="mt-3 line-clamp-2 max-w-[28ch] font-semibold text-[0.9375rem] leading-snug tracking-[-0.01em] sm:text-[1.0625rem]">
        {title}
      </p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function VariantD(props: VariantProps) {
  const { project, pictures } = props;
  const { language } = useLanguage();
  const t = translations[language].projectDetails;
  const reduceMotion = useReducedMotion();
  const art = ART[project.slug] ?? fallbackArt(project, pictures);
  const heroIndex = Math.max(0, pictures.indexOf(art.hero));
  const host = project.liveUrl && !project.downloadUrl ? new URL(project.liveUrl).host : null;
  const kind = project.operatingSystem ?? host ?? project.title;

  // The hero card eases back a touch as it scrolls away. Transform only.
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 0.96]), {
    stiffness: 200,
    damping: 30,
  });

  const tiles = art.tiles.slice(0, 6);
  const numbersOnly = tiles.every((tile) => tile.kind === "number" || tile.kind === "stat");
  const pattern = numbersOnly
    ? tiles.length === 2
      ? PATTERNS[2]
      : tiles.map((): keyof typeof SIZE_CLASS => "S")
    : (PATTERNS[tiles.length] ?? PATTERNS[5]);
  const next = props.next[0];
  const nextHero = next ? (ART[next.slug]?.hero ?? next.image) : undefined;

  const style = { "--pa-l": art.accent[0], "--pa-d": art.accent[1] } as CSSProperties;

  /** The viewer opens out of the clicked picture's visible box. */
  const openFrom = (position: number, radius: number) => (event: MouseEvent<HTMLElement>) => {
    const img = event.currentTarget.querySelector<HTMLImageElement>("img[data-crop]");
    const clip = img?.closest<HTMLElement>("[data-clip]");
    props.open(position, img && clip ? originOf(clip, img, radius) : true);
  };

  return (
    <div
      className={`${PAGE} pt-4 pb-28 [--pa:var(--pa-l)] [--pt:color-mix(in_oklab,hsl(var(--secondary))_90%,var(--pa)_10%)] dark:[--pa:var(--pa-d)] dark:[--pt:color-mix(in_oklab,hsl(var(--secondary))_86%,var(--pa)_14%)]`}
      style={style}
    >
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

      {/* Promise: the name, one line, the buttons, then the whole app. */}
      <section className="mt-12 sm:mt-16">
        <motion.div {...revealOnScroll(reduceMotion)}>
          <p className="font-medium text-[0.8125rem] text-[color:var(--pa)]">{kind}</p>
          <h1 className="title-serif mt-3 ml-[-0.04em] font-bold text-[length:clamp(3.5rem,9vw,7.5rem)] leading-[0.92] tracking-[-0.02em]">
            {project.title}
          </h1>
          <p className="mt-5 max-w-[30ch] text-balance text-muted-foreground text-xl leading-[1.45] sm:text-2xl">
            {project.tagline}
          </p>
          <div className="mt-8">{props.actions}</div>
        </motion.div>

        {art.hero ? (
          <motion.div className="mt-14" ref={heroRef} style={reduceMotion ? undefined : { scale: heroScale }}>
            <motion.button
              aria-label={props.openLabelFor(heroIndex)}
              className={`${CARD} ${RING} block aspect-[16/10] w-full cursor-zoom-in`}
              data-cursor-ignore
              initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
              onClick={openFrom(heroIndex, 12)}
              transition={{ scale: SPRING, opacity: { duration: 0.7, ease: EASE_OUT } }}
              type="button"
              viewport={VIEWPORT}
              whileInView={{ opacity: 1, scale: 1 }}
              whileTap={reduceMotion ? undefined : { scale: 0.99 }}
            >
              <WholeWindow alt={props.altFor(heroIndex)} priority src={art.hero} />
            </motion.button>
          </motion.div>
        ) : null}
      </section>

      {/* The moment worth remembering, then the proof: one feature per tile. */}
      {tiles.length ? (
        <section className="mt-24 grid auto-rows-[13.5rem] grid-cols-2 gap-x-3 gap-y-5 sm:mt-32 sm:auto-rows-[17rem] sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6 lg:auto-rows-[20rem]">
          {tiles.map((tile, order) => (
            <BentoTile
              key={`${tile.kind}-${order}`}
              order={order}
              orphan={
                pattern[order] === "S" &&
                order === tiles.length - 1 &&
                (numbersOnly ? tiles.length % 2 === 1 : tiles.length >= 5)
              }
              props={props}
              size={pattern[order]}
              tile={tile}
            />
          ))}
        </section>
      ) : null}

      {art.wide ? <WideMoment props={props} wide={art.wide} /> : null}

      {/* The facts in one row, then the buttons. */}
      <motion.div className="mt-24 sm:mt-32" {...revealOnScroll(reduceMotion)}>
        <dl className="flex flex-wrap gap-x-12 gap-y-4">
          {props.facts
            .filter((fact) => fact.label !== t.role)
            .map((fact) => (
              <div key={fact.label}>
                <dt className="font-medium text-[0.8125rem] text-muted-foreground">{fact.label}</dt>
                <dd className="mt-1 text-foreground/90">{fact.value}</dd>
              </div>
            ))}
        </dl>
        <div className="mt-8">{props.actions}</div>
      </motion.div>

      {/* The handoff: the next project as one full card. */}
      {next ? (
        <section className="mt-28 sm:mt-36">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-medium text-[0.8125rem] text-muted-foreground">{t.nextProject}</p>
            <Link
              className="inline-flex min-h-6 items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
              to="/projects"
            >
              {t.allProjects}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <Link className={`group mt-4 block rounded-[28px] ${RING}`} to={`/projects/${next.slug}?v=d`}>
            <motion.div
              className={`${CARD} aspect-[16/10] sm:aspect-[21/9]`}
              initial="rest"
              whileHover="hover"
              whileTap={reduceMotion ? undefined : { scale: 0.99 }}
            >
              {nextHero ? (
                <motion.div className="absolute inset-0" transition={SPRING} variants={reduceMotion ? undefined : HOVER}>
                  <WholeWindow alt="" src={nextHero} />
                </motion.div>
              ) : null}
            </motion.div>
            <span className="title-serif mt-5 flex items-center gap-3 font-bold text-4xl leading-tight tracking-[-0.01em] transition-colors duration-200 ease-out group-hover:text-[color:var(--pa)] sm:text-5xl">
              {next.title}
              <ArrowUpRight className="h-7 w-7 transition-transform duration-300 ease-bloom group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        </section>
      ) : null}
    </div>
  );
}

function WideMoment({ wide, props }: { wide: NonNullable<Art["wide"]>; props: VariantProps }) {
  const reduceMotion = useReducedMotion();
  const position = props.pictures.indexOf(wide.pic);
  return (
    <motion.section
      className="mt-6 sm:mt-8"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
      transition={{ scale: SPRING, opacity: { duration: 0.6, ease: EASE_OUT } }}
      viewport={VIEWPORT}
      whileInView={{ opacity: 1, scale: 1 }}
    >
      <motion.button
        aria-label={props.openLabelFor(position)}
        className={`${CARD} ${RING} block aspect-[16/10] w-full cursor-zoom-in sm:aspect-[21/9]`}
        data-cursor-ignore
        initial="rest"
        onClick={(event) => {
          const img = event.currentTarget.querySelector<HTMLImageElement>("img[data-crop]");
          const clip = img?.closest<HTMLElement>("[data-clip]");
          props.open(position, img && clip ? originOf(clip, img, 14) : true);
        }}
        type="button"
        whileHover="hover"
        whileTap={reduceMotion ? undefined : { scale: 0.99 }}
      >
        <motion.div className="absolute inset-0" transition={SPRING} variants={reduceMotion ? undefined : HOVER}>
          <Region alt={props.altFor(position)} rect={wide.rect} sizes="(min-width: 1024px) 1600px, 100vw" src={wide.pic} />
        </motion.div>
      </motion.button>
      <p className="mt-3 font-semibold text-[0.9375rem] leading-snug tracking-[-0.01em] sm:text-[1.0625rem]">
        {wide.title}
      </p>
    </motion.section>
  );
}
