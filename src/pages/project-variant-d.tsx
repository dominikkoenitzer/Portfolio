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
import {
  pictureSrcSet,
  pictureWidth,
  type PortfolioProject,
} from "@/constants/projects";
import type { ProjectStat } from "@/constants/projects/types";
import { revealOnScroll } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-context";
import { EASE_OUT, VIEWPORT } from "@/lib/motion";
import { translations } from "@/lib/translations";
import type { VariantProps } from "./project-variants";

/**
 * Layout d of the project page, built to `SPEC.md` of 18.10.: the project as
 * a short story (promise, the moment worth remembering, proof) told almost
 * entirely in pictures. A hero with the app at about its own size, a bento of
 * one-feature tiles, the facts in one row, then the next project. Each
 * project brings its own accent, tuned for the light and the night theme.
 */

const PAGE = "mx-auto w-full max-w-7xl px-6 sm:px-8 md:px-12 lg:px-16";
const FILE_ASPECT = 16 / 10;

/** One card: radius, the project's tone, clipping. Text never sits inside. */
const CARD = "relative isolate overflow-hidden rounded-[28px] bg-[color:var(--pt)]";

/** Focus ring in the project accent, following the card radius. */
const RING =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:[outline-color:var(--pa)]";

const SPRING = { type: "spring", stiffness: 210, damping: 26, mass: 0.9 } as const;

/* ------------------------------------------------------------------ */
/* Art direction                                                       */
/* ------------------------------------------------------------------ */

/** A region of a picture: left, top, right, bottom as fractions of the file. */
type Rect = [number, number, number, number];

type Shot = { pic: string; rect: Rect };

type Tile =
  | { kind: "crop"; pic: string; rect: Rect; title: string }
  | { kind: "pair"; a: Shot; b: Shot; title: string; stack?: boolean }
  | { kind: "mark"; pic: string; rect: Rect; title: string }
  | { kind: "stat"; stat: number };

/**
 * How the hero places the app window in its card. `width` is in card widths;
 * left/right pin a top corner and run off the far edge, plate centres the
 * window, detail fills the card around a focus point.
 */
type View = {
  mode: "left" | "right" | "plate" | "detail";
  width?: number;
  focus?: [number, number];
};

type Art = {
  /** Accent for the light theme and for the night theme. */
  accent: [string, string];
  hero: { pic: string; wide: View; phone: View };
  tiles: Tile[];
  /** One more full-width picture, where the project has a second screen worth it. */
  wide?: Shot & { title: string };
};

const P = (name: string) => `/projects/${name}`;

/* Tile titles are English in this preview (see SPEC.md, section 10). */
const ART: Record<string, Art> = {
  zephyr: {
    accent: ["#a8502a", "#f2a679"],
    hero: { pic: P("zephyr.jpg"), wide: { mode: "left" }, phone: { mode: "left", width: 2.1 } },
    tiles: [
      { kind: "crop", pic: P("zephyr-4.jpg"), rect: [0.28, 0.14, 0.72, 0.8], title: "The timer is a sunset" },
      { kind: "stat", stat: 1 },
      { kind: "crop", pic: P("zephyr.jpg"), rect: [0.185, 0.19, 0.375, 0.38], title: "Today at a glance" },
      { kind: "crop", pic: P("zephyr-3.jpg"), rect: [0.17, 0.28, 0.72, 0.66], title: "Tasks by due date" },
      { kind: "stat", stat: 3 },
    ],
  },
  portfolio: {
    accent: ["#5f4b8b", "#c7aef0"],
    hero: { pic: P("portfolio.jpg"), wide: { mode: "left" }, phone: { mode: "left", width: 2.2 } },
    tiles: [
      { kind: "crop", pic: P("portfolio-3.jpg"), rect: [0.3, 0.3, 0.7, 0.97], title: "Tools on a 3D sphere" },
      { kind: "stat", stat: 0 },
      { kind: "stat", stat: 3 },
      { kind: "crop", pic: P("portfolio-2.jpg"), rect: [0.13, 0.55, 0.9, 0.68], title: "Search, filter, sort" },
      { kind: "stat", stat: 2 },
    ],
  },
  entropy: {
    accent: ["#566300", "#d6f04a"],
    hero: { pic: P("entropy.jpg"), wide: { mode: "left" }, phone: { mode: "left", width: 2.2 } },
    tiles: [
      { kind: "crop", pic: P("entropy-2.jpg"), rect: [0.34, 0.1, 0.95, 0.6], title: "Five attacker scenarios" },
      { kind: "stat", stat: 1 },
      { kind: "crop", pic: P("entropy-4.jpg"), rect: [0.26, 0.2, 0.74, 0.8], title: "Alt+E on a sign-in page" },
      { kind: "crop", pic: P("entropy-5.jpg"), rect: [0.16, 0.17, 0.88, 0.42], title: "A health check, all local" },
      { kind: "stat", stat: 0 },
    ],
    wide: { pic: P("entropy-3.jpg"), rect: [0.12, 0.08, 0.9, 0.62], title: "Logins and codes, one vault" },
  },
  spectrum: {
    accent: ["#1d6a88", "#74c6e6"],
    hero: { pic: P("spectrum.jpg"), wide: { mode: "left" }, phone: { mode: "left", width: 2.1 } },
    tiles: [
      { kind: "crop", pic: P("spectrum-4.jpg"), rect: [0.08, 0.12, 0.94, 0.9], title: "Gradients, ready to copy" },
      { kind: "crop", pic: P("spectrum-3.jpg"), rect: [0.17, 0.45, 0.82, 0.6], title: "Contrast at 21:1" },
      { kind: "stat", stat: 2 },
      { kind: "crop", pic: P("spectrum-2.jpg"), rect: [0.1, 0.33, 0.9, 0.47], title: "One color, five formats" },
      { kind: "stat", stat: 3 },
    ],
  },
  remnants: {
    accent: ["#2c58b0", "#93b3ff"],
    hero: { pic: P("remnants.jpg"), wide: { mode: "left" }, phone: { mode: "left", width: 2.2 } },
    tiles: [
      { kind: "mark", pic: P("remnants-mark.jpg"), rect: [0.3375, 0.247, 0.6625, 0.767], title: "A faceted shard" },
      { kind: "stat", stat: 0 },
      { kind: "stat", stat: 1 },
      { kind: "stat", stat: 2 },
    ],
  },
  time: {
    accent: ["#ad3128", "#f2867a"],
    hero: { pic: P("time.jpg"), wide: { mode: "plate", width: 0.9 }, phone: { mode: "plate", width: 0.9 } },
    tiles: [
      {
        kind: "pair",
        a: { pic: P("time.jpg"), rect: [0.1, 0.3, 0.9, 0.7] },
        b: { pic: P("time-2.jpg"), rect: [0.06, 0.3, 0.86, 0.7] },
        title: "Zurich and Tokyo, one moment",
        stack: true,
      },
      { kind: "stat", stat: 0 },
      { kind: "stat", stat: 2 },
      { kind: "crop", pic: P("time.jpg"), rect: [0.47, 0.34, 0.93, 0.66], title: "Only the colons move" },
      { kind: "stat", stat: 3 },
    ],
  },
  jester: {
    accent: ["#7a5c10", "#e6c65e"],
    hero: { pic: P("jester.jpg"), wide: { mode: "left" }, phone: { mode: "left", width: 2.3 } },
    tiles: [
      { kind: "stat", stat: 2 },
      { kind: "stat", stat: 0 },
      { kind: "stat", stat: 3 },
      { kind: "crop", pic: P("jester.jpg"), rect: [0.52, 0.935, 1, 1], title: "Encoding and line endings kept" },
    ],
  },
  flow: {
    accent: ["#ab2f2a", "#f2908a"],
    hero: { pic: P("flow.jpg"), wide: { mode: "plate" }, phone: { mode: "plate", width: 0.84 } },
    tiles: [
      { kind: "crop", pic: P("flow.jpg"), rect: [0.34, 0.03, 0.66, 0.32], title: "F8 records, F9 plays" },
      { kind: "mark", pic: P("flow-mark.jpg"), rect: [0.35625, 0.27, 0.64375, 0.73], title: "Input as soft bars" },
      { kind: "stat", stat: 0 },
      { kind: "crop", pic: P("flow.jpg"), rect: [0.34, 0.6, 0.66, 0.86], title: "About 100 clicks a second" },
      { kind: "stat", stat: 3 },
    ],
  },
  punds: {
    accent: ["#1d5c91", "#78b8f0"],
    hero: { pic: P("punds.jpg"), wide: { mode: "left" }, phone: { mode: "detail", focus: [0.5, 0.45] } },
    tiles: [
      { kind: "crop", pic: P("punds.jpg"), rect: [0.3, 0.2, 0.7, 0.8], title: "A city you fly through" },
      { kind: "crop", pic: P("punds.jpg"), rect: [0.68, 0.28, 0.9, 0.5], title: "Links as floating panels" },
      { kind: "stat", stat: 0 },
      { kind: "stat", stat: 2 },
      { kind: "stat", stat: 1 },
    ],
  },
  senbon: {
    accent: ["#865234", "#eab48c"],
    hero: { pic: P("senbon.jpg"), wide: { mode: "plate", width: 0.9 }, phone: { mode: "detail", focus: [0.5, 0.48] } },
    tiles: [
      { kind: "crop", pic: P("senbon-2.jpg"), rect: [0.27, 0.08, 0.73, 0.56], title: "Newest entry first" },
      { kind: "stat", stat: 0 },
      { kind: "stat", stat: 3 },
      { kind: "crop", pic: P("senbon.jpg"), rect: [0.3, 0.38, 0.72, 0.66], title: "A journal and a guestbook" },
      { kind: "stat", stat: 1 },
    ],
  },
  oxidize: {
    accent: ["#9e4f28", "#e9a070"],
    hero: { pic: P("oxidize.jpg"), wide: { mode: "left" }, phone: { mode: "left", width: 2.4 } },
    tiles: [
      { kind: "mark", pic: P("oxidize-mark.jpg"), rect: [0.3219, 0.215, 0.6781, 0.785], title: "Copper and verdigris" },
      { kind: "stat", stat: 3 },
      { kind: "crop", pic: P("oxidize.jpg"), rect: [0.44, 0.11, 0.74, 0.36], title: "Biggest first" },
      { kind: "crop", pic: P("oxidize.jpg"), rect: [0.67, 0, 0.99, 0.065], title: "Backups on by default" },
      { kind: "stat", stat: 1 },
    ],
  },
  inkling: {
    accent: ["#3a52a8", "#a3b5f7"],
    hero: { pic: P("inkling.jpg"), wide: { mode: "left" }, phone: { mode: "detail", width: 2, focus: [0.58, 0.3] } },
    tiles: [
      { kind: "crop", pic: P("inkling-3.jpg"), rect: [0.5, 0.4, 0.78, 0.73], title: "Flashcards that schedule themselves" },
      { kind: "crop", pic: P("inkling-2.jpg"), rect: [0.36, 0.12, 0.74, 0.34], title: "Notes become cards" },
      { kind: "stat", stat: 0 },
      {
        kind: "pair",
        a: { pic: P("inkling.jpg"), rect: [0.34, 0.08, 0.82, 0.38] },
        b: { pic: P("inkling-4.jpg"), rect: [0.34, 0.08, 0.84, 0.38] },
        title: "Light and dark",
      },
      { kind: "stat", stat: 3 },
    ],
  },
  mochi: {
    accent: ["#9d426b", "#f3a6ca"],
    hero: { pic: P("mochi.jpg"), wide: { mode: "plate", width: 0.9 }, phone: { mode: "left", width: 1.9 } },
    tiles: [
      { kind: "crop", pic: P("mochi.jpg"), rect: [0.5, 0.53, 1, 0.96], title: "Scriptable from the terminal" },
      { kind: "mark", pic: P("mochi-mark.jpg"), rect: [0.35625, 0.27, 0.64375, 0.73], title: "Three windows, tiled" },
      { kind: "stat", stat: 1 },
      { kind: "crop", pic: P("mochi.jpg"), rect: [0.49, 0, 1, 0.24], title: "Focus in pink" },
      { kind: "stat", stat: 3 },
    ],
  },
  daifuku: {
    accent: ["#964b6e", "#f2a9c9"],
    hero: { pic: P("daifuku.jpg"), wide: { mode: "plate", width: 0.9 }, phone: { mode: "left", width: 1.9 } },
    tiles: [
      { kind: "crop", pic: P("daifuku.jpg"), rect: [0, 0.49, 0.34, 1], title: "Yellow means it waits" },
      { kind: "crop", pic: P("daifuku.jpg"), rect: [0.66, 0.05, 1, 0.45], title: "Red means it failed" },
      { kind: "stat", stat: 3 },
      { kind: "crop", pic: P("daifuku.jpg"), rect: [0.33, 0.05, 0.67, 0.3], title: "Green means done" },
      { kind: "stat", stat: 1 },
    ],
  },
  psyche: {
    accent: ["#2d5ca2", "#86b9f6"],
    hero: { pic: P("psyche.jpg"), wide: { mode: "plate" }, phone: { mode: "plate", width: 0.9 } },
    tiles: [
      { kind: "crop", pic: P("psyche-2.jpg"), rect: [0.145, 0.102, 0.855, 0.898], title: "Every code in one window" },
      { kind: "stat", stat: 0 },
      { kind: "crop", pic: P("psyche.jpg"), rect: [0.6, 0.3, 0.74, 0.48], title: "A ring counts down" },
      { kind: "crop", pic: P("psyche.jpg"), rect: [0.26, 0.2, 0.74, 0.38], title: "This site, listed first" },
      { kind: "stat", stat: 3 },
    ],
  },
};

/** A project without its own art direction: the main shot and its numbers. */
const fallbackArt = (project: PortfolioProject, pictures: string[]): Art => ({
  accent: ["#5f4b8b", "#c7aef0"],
  hero: { pic: pictures[0] ?? "", wide: { mode: "left" }, phone: { mode: "left", width: 2 } },
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
  [P("psyche-2.jpg")]: [0.145, 0.102, 0.854375, 0.898],
  [P("entropy-3.jpg")]: [0.095, 0.072, 0.905, 0.929],
  [P("entropy-4.jpg")]: [0.25875, 0.204, 0.74125, 0.796],
  [P("entropy-5.jpg")]: [0.095, 0.072, 0.905, 0.929],
};

/** Card shape for the hero: tall on a phone, 16:10 from `sm`. */
const HERO_PHONE_RATIO = 4 / 5;
const HERO_WIDE_RATIO = 16 / 10;
/** The widest the hero card gets, for keeping a capture near its own pixels. */
const HERO_WIDE_PX = 1152;

type Box = { left: number; top: number; width: number };

const clamp = (value: number, low: number, high: number) =>
  Math.min(high, Math.max(low, value));

/** Left, top and width of the window in the hero card, as percentages. */
function placeHero(view: View, src: string, ratio: number, reference: number): Box {
  const [x0, y0, x1, y1] = WINDOWS[src] ?? [0, 0, 1, 1];
  const aspect = ((x1 - x0) * FILE_ASPECT) / (y1 - y0);
  const native = pictureWidth(src) * (x1 - x0);
  // Near its own pixels on a wide screen: legible, never blown up.
  const cap = reference ? (native * 1.15) / reference : Number.POSITIVE_INFINITY;
  const height = 1 / ratio;
  const pad = reference ? 0.065 : 0.07;
  let width: number;
  let left: number;
  let top = pad;
  if (view.mode === "detail") {
    width = Math.max(view.width ?? 2.4, aspect * height, 1);
    const focus = view.focus ?? [0.5, 0.4];
    const windowHeight = width / aspect;
    left = clamp(0.5 - focus[0] * width, 1 - width, 0);
    top = clamp(height / 2 - focus[1] * windowHeight, height - windowHeight, 0);
  } else if (view.mode === "plate") {
    width = Math.min(view.width ?? 0.88, cap);
    left = (1 - width) / 2;
    const windowHeight = width / aspect;
    // Centred when it fits; otherwise inset at the top and cut by the bottom edge.
    if (windowHeight + 2 * pad <= height) top = (height - windowHeight) / 2;
  } else {
    width = Math.min(view.width ?? 1.3, cap);
    left = view.mode === "left" ? pad : 1 - pad - width;
  }
  return { left: left * 100, top: (top / height) * 100, width: width * 100 };
}

const pct = (value: number) => `${value.toFixed(3)}%`;

/**
 * Style that crops a picture to `rect` inside any box: the region is shown
 * whole with a little air, the box is always covered by the app's own window
 * (never the backdrop around it), and it adapts to the box's shape at every
 * width (container units), so a phone gets its own crop.
 */
function cropStyle(rect: Rect, bounds: Rect = [0, 0, 1, 1]): CSSProperties {
  const [x0, y0, x1, y1] = rect;
  const [bx0, by0, bx1, by1] = bounds;
  const air = 1.06;
  const rw = (x1 - x0) * air;
  const rh = (y1 - y0) * air;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const f = (n: number) => n.toFixed(4);
  const w = `max(min(${f(100 / rw)}cqw, ${f((100 * FILE_ASPECT) / rh)}cqh), ${f(100 / (bx1 - bx0))}cqw, ${f((100 * FILE_ASPECT) / (by1 - by0))}cqh)`;
  const h = `(${w} / ${FILE_ASPECT})`;
  return {
    width: w,
    left: `clamp(calc(100cqw - ${f(bx1)} * ${w}), calc(50cqw - ${f(cx)} * ${w}), calc(-${f(bx0)} * ${w}))`,
    top: `clamp(calc(100cqh - ${f(by1)} * ${h}), calc(50cqh - ${f(cy)} * ${h}), calc(-${f(by0)} * ${h}))`,
  };
}

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

/** A picture cropped to a region, filling its box. */
function Crop({ src, rect, alt, sizes }: { src: string; rect: Rect; alt: string; sizes: string }) {
  return (
    <div className="absolute inset-0 [container-type:size]">
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
        style={cropStyle(rect, WINDOWS[src])}
      />
    </div>
  );
}

/** The picture inside a card eases closer on hover; the card itself stays still. */
const HOVER = { rest: { scale: 1 }, hover: { scale: 1.03 } };

function StatFigure({ stat }: { stat: ProjectStat }) {
  return (
    <div className="absolute inset-0 flex items-end p-6 [container-type:size] sm:p-7">
      <span className="title-serif block font-bold text-[color:var(--pa)] text-[length:min(26cqw,52cqh,6rem)] leading-none tracking-[-0.03em] tabular-nums">
        {stat.liveTests ? <LiveTestCount fallback={stat.value} project={stat.liveTests} /> : stat.value}
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

/** Bento patterns by tile count: the large tile first, never an empty cell. */
const PATTERNS: Record<number, Array<keyof typeof SIZE_CLASS>> = {
  1: ["W"],
  2: ["M", "S"],
  3: ["L", "S", "S"],
  4: ["L", "S", "S", "W"],
  5: ["L", "S", "S", "M", "S"],
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
  /** The last small tile on a phone, which would otherwise sit alone in its row. */
  orphan: boolean;
  props: VariantProps;
}) {
  const reduceMotion = useReducedMotion();
  const { project, pictures } = props;
  const stat = tile.kind === "stat" ? project.stats?.[tile.stat] : undefined;
  const title = tile.kind === "stat" ? stat?.label : tile.title;
  const pic = tile.kind === "crop" || tile.kind === "mark" ? tile.pic : tile.kind === "pair" ? tile.a.pic : null;
  const position = pic ? pictures.indexOf(pic) : -1;
  const large = size === "L" || size === "W";
  const sizes = large ? "(min-width: 1024px) 1600px, 100vw" : "(min-width: 1024px) 900px, 60vw";

  let visual: ReactNode = null;
  if (tile.kind === "crop") {
    visual = <Crop alt={props.altFor(position)} rect={tile.rect} sizes={sizes} src={tile.pic} />;
  } else if (tile.kind === "pair") {
    visual = (
      <div className={`absolute inset-0 grid gap-1.5 p-1.5 ${tile.stack ? "grid-rows-2" : "grid-cols-2"}`}>
        {[tile.a, tile.b].map((shot) => (
          <div className="relative overflow-hidden rounded-[22px]" data-clip key={shot.pic}>
            <Crop alt={props.altFor(pictures.indexOf(shot.pic))} rect={shot.rect} sizes={sizes} src={shot.pic} />
          </div>
        ))}
      </div>
    );
  } else if (tile.kind === "mark") {
    visual = (
      <div className="absolute inset-0 flex items-center justify-center [container-type:size]">
        <div
          className="relative aspect-square w-[min(52cqh,46cqw)] overflow-hidden rounded-[23%] shadow-[0_18px_40px_-18px_rgb(0_0_0/0.45)]"
          data-clip
        >
          <Crop alt={props.altFor(position)} rect={tile.rect} sizes="320px" src={tile.pic} />
        </div>
      </div>
    );
  } else if (stat) {
    visual = <StatFigure stat={stat} />;
  }

  const open = (event: MouseEvent<HTMLElement>) => {
    if (position < 0) return;
    const img = event.currentTarget.querySelector<HTMLImageElement>("img[data-crop]");
    const clip = img?.closest<HTMLElement>("[data-clip]") ?? event.currentTarget;
    const radius = tile.kind === "mark" ? clip.getBoundingClientRect().width * 0.23 : tile.kind === "pair" ? 22 : 28;
    props.open(position, img ? originOf(clip, img, radius) : true);
  };

  const cardClass = `${CARD} ${RING} group block h-full w-full text-left transition-shadow duration-300 ease-bloom hover:[box-shadow:inset_0_0_0_1px_color-mix(in_oklab,var(--pa)_45%,transparent)]`;
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
          className={`${cardClass} min-h-0 flex-1 cursor-zoom-in`}
          data-cursor-ignore
          data-clip
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
      <p className="mt-3 line-clamp-2 max-w-[26ch] font-semibold text-[0.9375rem] leading-snug tracking-[-0.01em] sm:text-[1.0625rem]">
        {title}
      </p>
    </motion.div>
  );
}

/** The app window in the hero card, with its own depth. */
function HeroWindow({
  src,
  art,
  alt,
  layoutId,
  priority,
}: {
  src: string;
  art: Art["hero"];
  alt: string;
  layoutId?: string;
  priority?: boolean;
}) {
  const [x0, y0, x1, y1] = WINDOWS[src] ?? [0, 0, 1, 1];
  const phone = placeHero(art.phone, src, HERO_PHONE_RATIO, 0);
  const wide = placeHero(art.wide, src, HERO_WIDE_RATIO, HERO_WIDE_PX);
  const aspect = ((x1 - x0) * FILE_ASPECT) / (y1 - y0);
  const style = {
    "--l": pct(phone.left),
    "--t": pct(phone.top),
    "--w": pct(phone.width),
    "--l2": pct(wide.left),
    "--t2": pct(wide.top),
    "--w2": pct(wide.width),
    aspectRatio: aspect,
  } as CSSProperties;
  const full = art.phone.mode === "detail";
  const spanX = x1 - x0;
  return (
    <div
      className={`absolute top-[var(--t)] left-[var(--l)] w-[var(--w)] max-w-none overflow-hidden sm:top-[var(--t2)] sm:left-[var(--l2)] sm:w-[var(--w2)] sm:rounded-xl sm:shadow-[0_1px_2px_rgb(0_0_0/0.08),0_40px_80px_-40px_rgb(0_0_0/0.5)] dark:sm:shadow-[0_1px_2px_rgb(0_0_0/0.4),0_40px_90px_-30px_rgb(0_0_0/0.8)] ${
        full ? "" : "rounded-xl shadow-[0_1px_2px_rgb(0_0_0/0.08),0_30px_60px_-30px_rgb(0_0_0/0.5)]"
      }`}
      data-clip
      style={style}
    >
      <motion.img
        alt={alt}
        className="absolute max-w-none"
        data-crop
        decoding="async"
        draggable={false}
        fetchPriority={priority ? "high" : "auto"}
        layoutId={layoutId}
        loading={priority ? "eager" : "lazy"}
        sizes={`(min-width: 640px) ${Math.round(((wide.width / 100) * HERO_WIDE_PX) / spanX)}px, ${Math.round(phone.width / spanX)}vw`}
        src={src}
        srcSet={pictureSrcSet(src)}
        style={{
          width: pct(100 / spanX),
          left: pct((-x0 / spanX) * 100),
          top: pct((-y0 / (y1 - y0)) * 100),
        }}
      />
      {/* The window's edge: a hairline, and a top highlight at night. */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 ring-1 ring-black/[0.06] ring-inset dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.1)] dark:ring-white/10 ${
          full ? "max-sm:hidden" : ""
        } rounded-[inherit]`}
      />
    </div>
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
  const heroIndex = Math.max(0, pictures.indexOf(art.hero.pic));
  const host = project.liveUrl && !project.downloadUrl ? new URL(project.liveUrl).host : null;
  const kind = project.operatingSystem ?? host ?? project.title;

  // The hero card eases back a touch as it scrolls away. Transform only.
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 0.96]), {
    stiffness: 200,
    damping: 30,
  });

  const tiles = art.tiles.slice(0, 5);
  const pattern = PATTERNS[tiles.length] ?? PATTERNS[5];
  const next = props.next[0];
  const nextArt = next ? ART[next.slug] : undefined;

  const style = { "--pa-l": art.accent[0], "--pa-d": art.accent[1] } as CSSProperties;

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

      {/* Promise: the name, one line, the buttons, then the app itself. */}
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

        {art.hero.pic ? (
          <motion.div
            className="mt-14"
            ref={heroRef}
            style={reduceMotion ? undefined : { scale: heroScale }}
          >
            <motion.button
              aria-label={props.openLabelFor(heroIndex)}
              className={`${CARD} ${RING} block aspect-[4/5] w-full cursor-zoom-in sm:aspect-[16/10]`}
              data-cursor-ignore
              initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
              onClick={(event) => {
                const img = event.currentTarget.querySelector<HTMLImageElement>("img[data-crop]");
                const clip = img?.closest<HTMLElement>("[data-clip]");
                if (!img || !clip) return props.open(heroIndex);
                // The visible part is where the window and the card overlap.
                const card = event.currentTarget.getBoundingClientRect();
                const o = originOf(clip, img, 12);
                const left = Math.max(o.rect.left, card.left);
                const top = Math.max(o.rect.top, card.top);
                const right = Math.min(o.rect.left + o.rect.width, card.right);
                const bottom = Math.min(o.rect.top + o.rect.height, card.bottom);
                const i = img.getBoundingClientRect();
                props.open(heroIndex, {
                  rect: { left, top, width: right - left, height: bottom - top },
                  crop: [(left - i.left) / i.width, (top - i.top) / i.height, (right - i.left) / i.width, (bottom - i.top) / i.height],
                  radius: 12,
                });
              }}
              transition={{ scale: SPRING, opacity: { duration: 0.7, ease: EASE_OUT } }}
              type="button"
              viewport={VIEWPORT}
              whileInView={{ opacity: 1, scale: 1 }}
              whileTap={reduceMotion ? undefined : { scale: 0.99 }}
            >
              <HeroWindow alt={props.altFor(heroIndex)} art={art.hero} priority src={art.hero.pic} />
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
              orphan={pattern[order] === "S" && order === tiles.length - 1 && tiles.length === 5}
              props={props}
              size={pattern[order]}
              tile={tile}
            />
          ))}
        </section>
      ) : null}

      {art.wide ? (
        <section className="mt-6 sm:mt-8">
          <WideMoment props={props} wide={art.wide} />
        </section>
      ) : null}

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
              className={`${CARD} aspect-[4/3] sm:aspect-[21/9]`}
              initial="rest"
              whileHover="hover"
              whileTap={reduceMotion ? undefined : { scale: 0.99 }}
            >
              {next.image ? (
                <motion.div className="absolute inset-0" transition={SPRING} variants={reduceMotion ? undefined : HOVER}>
                  <HeroWindow
                    alt=""
                    art={nextArt?.hero ?? { pic: next.image, wide: { mode: "left" }, phone: { mode: "left", width: 2 } }}
                    src={nextArt?.hero.pic ?? next.image}
                  />
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
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
      transition={{ scale: SPRING, opacity: { duration: 0.6, ease: EASE_OUT } }}
      viewport={VIEWPORT}
      whileInView={{ opacity: 1, scale: 1 }}
    >
      <motion.button
        aria-label={props.openLabelFor(position)}
        className={`${CARD} ${RING} block aspect-[4/3] w-full cursor-zoom-in sm:aspect-[21/9]`}
        data-clip
        data-cursor-ignore
        initial="rest"
        onClick={(event) => {
          const img = event.currentTarget.querySelector<HTMLImageElement>("img[data-crop]");
          props.open(position, img ? originOf(event.currentTarget, img, 28) : true);
        }}
        type="button"
        whileHover="hover"
        whileTap={reduceMotion ? undefined : { scale: 0.99 }}
      >
        <motion.div className="absolute inset-0" transition={SPRING} variants={reduceMotion ? undefined : HOVER}>
          <Crop alt={props.altFor(position)} rect={wide.rect} sizes="(min-width: 1024px) 1600px, 100vw" src={wide.pic} />
        </motion.div>
      </motion.button>
      <p className="mt-3 font-semibold text-[0.9375rem] leading-snug tracking-[-0.01em] sm:text-[1.0625rem]">
        {wide.title}
      </p>
    </motion.div>
  );
}
