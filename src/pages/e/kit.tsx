import { AnimatePresence, motion } from "framer-motion";
import { type CSSProperties, type KeyboardEvent, type ReactNode, useId, useRef, useState } from "react";
import { Lightbox, type LightboxOrigin } from "@/components/effects/project-effects";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { useMotionSafe } from "./motion";
import { RING } from "./style";
import type { Still } from "./types";

/** The shared controls of layout e's live demos: one demo box, pills and actions. */

/**
 * The one demo box: the column's width, a fixed height (so nothing on the
 * page moves while the demo changes), radius 16, the card tone and a hairline.
 * The caption below says what to do and what to watch.
 */
export function Demo({
  label,
  caption,
  height,
  phoneHeight,
  children,
  live,
  className = "",
}: {
  /** What the demo shows, for screen readers. */
  label: string;
  caption: string;
  /** Box height in px from `sm`, and on a phone. */
  height: number;
  phoneHeight?: number;
  children: ReactNode;
  /** The demo's state in words, announced politely as it changes. */
  live?: string;
  className?: string;
}) {
  const style = {
    "--demo-h": `${height}px`,
    "--demo-h-phone": `${phoneHeight ?? height}px`,
  } as CSSProperties;
  return (
    <figure aria-label={label} className="m-0" role="group">
      <div
        className={`relative h-[var(--demo-h-phone)] overflow-hidden rounded-2xl bg-card shadow-[0_1px_2px_rgb(0_0_0/0.04)] ring-1 ring-black/[0.06] sm:h-[var(--demo-h)] dark:ring-white/[0.08] ${className}`}
        style={style}
      >
        {children}
      </div>
      <figcaption className="mt-3.5 text-balance text-center text-[0.8125rem] text-muted-foreground leading-[1.625]">
        {caption}
      </figcaption>
      {live !== undefined ? (
        <p aria-live="polite" className="sr-only">
          {live}
        </p>
      ) : null}
    </figure>
  );
}

/** A control row inside a demo: pills that share one sliding indicator. */
/**
 * One tab stop for the whole group, like any radio group: the arrow keys move
 * the choice, and the focus goes with it.
 */
export function Pills<T extends string>({
  options,
  value,
  onChange,
  label,
  dark = false,
}: {
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (next: T) => void;
  label: string;
  /** On a dark app surface rather than the card. */
  dark?: boolean;
}) {
  const id = useId();
  const { spring } = useMotionSafe();
  const step = (event: KeyboardEvent<HTMLDivElement>) => {
    const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
    const back = event.key === "ArrowLeft" || event.key === "ArrowUp";
    if (!forward && !back) return;
    event.preventDefault();
    const at = options.findIndex((o) => o.value === value);
    const next = options[(at + (forward ? 1 : -1) + options.length) % options.length];
    onChange(next.value);
    const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>("button");
    buttons[options.indexOf(next)]?.focus();
  };
  return (
    <div aria-label={label} className="flex flex-wrap items-center gap-2 sm:gap-1" onKeyDown={step} role="radiogroup">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            aria-checked={active}
            className={`relative inline-flex h-11 items-center rounded-full px-3.5 font-medium sm:h-8 sm:px-3 ${RING} text-[0.8125rem] transition-colors duration-200 ease-bloom ${
              dark
                ? active
                  ? "text-white"
                  : "text-white/55 hover:text-white/85"
                : active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
            }`}
            key={option.value}
            onClick={() => onChange(option.value)}
            role="radio"
            tabIndex={active ? 0 : -1}
            type="button"
          >
            {active ? (
              <motion.span
                aria-hidden
                className={`absolute inset-0 rounded-full ${dark ? "bg-white/12" : "bg-foreground/[0.07] dark:bg-foreground/[0.1]"}`}
                layoutId={`pill-${id}`}
                transition={spring}
              />
            ) : null}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/** An action inside a demo: a verb on a quiet pill, with a press. */
export function Action({
  children,
  onClick,
  dark = false,
  primary = false,
  label,
  width = "",
}: {
  children: ReactNode;
  onClick: () => void;
  dark?: boolean;
  /** A name for screen readers when the visible text is a symbol. */
  label?: string;
  primary?: boolean;
  /** A minimum width that fits every label the action takes, so the bar never jumps. */
  width?: string;
}) {
  const { reduced } = useMotionSafe();
  const tone = dark
    ? primary
      ? "bg-white text-neutral-900 hover:bg-white/90"
      : "bg-white/10 text-white/90 hover:bg-white/15"
    : primary
      ? "bg-foreground text-background hover:bg-foreground/90"
      : "bg-foreground/[0.07] text-foreground hover:bg-foreground/[0.11]";
  return (
    <motion.button
      aria-label={label}
      className={`inline-flex h-11 items-center justify-center gap-1.5 rounded-full px-4 font-medium text-[0.8125rem] transition-colors duration-200 ease-bloom sm:h-8 sm:px-3.5 ${RING} ${width} ${tone}`}
      onClick={onClick}
      type="button"
      whileTap={reduced ? undefined : { scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}

/**
 * The inner layout of every demo box: one padding all round (16px on a phone,
 * 20px from `sm`) and the same gap between a control bar and the stage, so no
 * control ever sits closer to an edge or a line than the box's own padding.
 */
export function Frame({
  top,
  bottom,
  children,
}: {
  top?: ReactNode;
  bottom?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="absolute inset-0 flex flex-col gap-4 p-4 sm:gap-5 sm:p-5" data-frame>
      {top ? (
        <div className="flex min-h-11 shrink-0 flex-wrap items-center gap-2 sm:min-h-8" data-bar>
          {top}
        </div>
      ) : null}
      <div className="relative min-h-0 flex-1" data-stage>
        {children}
      </div>
      {bottom ? (
        <div className="flex min-h-11 shrink-0 flex-wrap items-center gap-2 sm:min-h-8" data-bar>
          {bottom}
        </div>
      ) : null}
    </div>
  );
}

/**
 * The state of a demo in words, on the card's own bar. It keeps at least
 * 9.5rem, so on a phone the actions wrap below it instead of squeezing it.
 */
export function BarText({ children }: { children: ReactNode }) {
  return <p className="m-0 line-clamp-2 min-w-[9.5rem] flex-1 text-[0.75rem] text-muted-foreground leading-snug">{children}</p>;
}

/** The widths every still is written at: the column at 1x, 1.5x, 2x and 3x. */
const STILL_WIDTHS = [640, 960, 1280, 1920];

function StillPicture({ name, still, eager, className, sizes }: { name: string; still: Still; eager: boolean; className: string; sizes: string }) {
  const widths = STILL_WIDTHS.filter((w) => w <= still.width);
  const set = (ext: string) => widths.map((w) => `/projects/e/${name}-${w}.${ext} ${w}w`).join(", ");
  return (
    <picture className={className}>
      <source sizes={sizes} srcSet={set("avif")} type="image/avif" />
      <source sizes={sizes} srcSet={set("webp")} type="image/webp" />
      <img
        alt={still.alt}
        className="block h-auto w-full"
        decoding="async"
        fetchPriority={eager ? "high" : "auto"}
        height={still.height}
        loading={eager ? "eager" : "lazy"}
        sizes={sizes}
        src={`/projects/e/${name}-${widths[Math.min(2, widths.length - 1)]}.jpg`}
        srcSet={set("jpg")}
        width={still.width}
      />
    </picture>
  );
}

/**
 * A real capture in the same box as the demos, cropped to the part that
 * proves its caption. The box reserves the crop's shape before the picture
 * loads, so nothing moves; a click opens the whole capture in the site's
 * viewer, growing out of the crop.
 */
export function StillFigure({ still, eager = false }: { still: Still; eager?: boolean }) {
  const [from, setFrom] = useState<LightboxOrigin | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const box = useRef<HTMLButtonElement>(null);
  const t = translations[useLanguage().language].projectDetails;
  const crop = still.crop ?? [0, 0, 1, 1];
  const cw = crop[2] - crop[0];
  const ch = crop[3] - crop[1];
  // The picture is drawn 1/cw times the box's width, so it asks for that many pixels.
  const sizes = `(min-width: 720px) ${Math.round(608 / cw)}px, calc((100vw - 80px) * ${(1 / cw).toFixed(3)})`;
  const fits = STILL_WIDTHS.filter((w) => w <= still.width);
  const largest = fits[fits.length - 1] ?? 640;
  const open = () => {
    const el = box.current;
    if (!el) return;
    const dark = document.documentElement.classList.contains("dark") && still.dark;
    const r = el.getBoundingClientRect();
    setFrom({ rect: { left: r.left, top: r.top, width: r.width, height: r.height }, crop, radius: 8 });
    setSrc(`/projects/e/${dark ? still.dark : still.name}-${largest}.webp`);
  };
  return (
    <figure className="m-0">
      <div className="rounded-2xl bg-card p-4 shadow-[0_1px_2px_rgb(0_0_0/0.04)] ring-1 ring-black/[0.06] sm:p-5 dark:ring-white/[0.08]">
        <button
          aria-label={still.alt}
          className={`relative block w-full cursor-zoom-in overflow-hidden rounded-lg shadow-[0_1px_2px_rgb(0_0_0/0.08),0_20px_40px_-24px_rgb(0_0_0/0.4)] ring-1 ring-black/[0.06] dark:ring-white/[0.06] ${RING}`}
          onClick={open}
          ref={box}
          style={{ aspectRatio: `${Math.round(still.width * cw)} / ${Math.round(still.height * ch)}` }}
          type="button"
        >
          <span className="absolute block" style={{ width: `${100 / cw}%`, left: `${(-crop[0] / cw) * 100}%`, top: `${(-crop[1] / ch) * 100}%` }}>
            {still.dark ? (
              <>
                <StillPicture className="block dark:hidden" eager={eager} name={still.name} sizes={sizes} still={still} />
                <StillPicture className="hidden dark:block" eager={eager} name={still.dark} sizes={sizes} still={still} />
              </>
            ) : (
              <StillPicture className="block" eager={eager} name={still.name} sizes={sizes} still={still} />
            )}
          </span>
        </button>
      </div>
      <figcaption className="mt-3.5 text-balance text-center text-[0.8125rem] text-muted-foreground leading-[1.625]">{still.caption}</figcaption>
      <AnimatePresence>
        {src ? (
          <Lightbox
            alt={still.alt}
            images={[src]}
            index={0}
            labels={{ close: t.closeViewer, counter: t.imageCounter, next: t.nextImage, previous: t.previousImage, thumb: t.showImage, title: still.alt }}
            onClose={() => setSrc(null)}
            onSelect={() => undefined}
            origin={from}
            originIndex={0}
          />
        ) : null}
      </AnimatePresence>
    </figure>
  );
}
