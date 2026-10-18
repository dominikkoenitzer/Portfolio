import { motion } from "framer-motion";
import { type CSSProperties, type KeyboardEvent, type ReactNode, useId } from "react";
import { useMotionSafe } from "./motion";
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
            className={`relative inline-flex h-11 items-center rounded-full px-3.5 font-medium sm:h-8 sm:px-3 text-[0.8125rem] transition-colors duration-200 ease-bloom ${
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
}: {
  children: ReactNode;
  onClick: () => void;
  dark?: boolean;
  /** A name for screen readers when the visible text is a symbol. */
  label?: string;
  primary?: boolean;
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
      className={`inline-flex h-11 items-center gap-1.5 rounded-full px-4 font-medium text-[0.8125rem] transition-colors duration-200 ease-bloom sm:h-8 sm:px-3.5 ${tone}`}
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

/** The state of a demo in words, on the card's own bar. */
export function BarText({ children }: { children: ReactNode }) {
  return <p className="m-0 line-clamp-2 min-w-0 flex-1 text-[0.75rem] text-muted-foreground leading-snug">{children}</p>;
}

/** A key as the app binds it. */
export function Keycap({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border/80 bg-background/60 px-1.5 font-sans text-[0.6875rem] text-foreground/80">
      {children}
    </kbd>
  );
}

/** The widths every still is written at: the column at 1x, 1.5x, 2x and 3x. */
const STILL_WIDTHS = [640, 960, 1280, 1920];

function StillPicture({ name, still, eager, className }: { name: string; still: Still; eager: boolean; className: string }) {
  const widths = STILL_WIDTHS.filter((w) => w <= still.width);
  const set = (ext: string) => widths.map((w) => `/projects/e/${name}-${w}.${ext} ${w}w`).join(", ");
  const sizes = "(min-width: 720px) 608px, calc(100vw - 80px)";
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
 * A real capture, whole and sharp, in the same box as the demos. The box
 * reserves the picture's own shape before it loads, so nothing moves.
 */
export function StillFigure({ still, eager = false }: { still: Still; eager?: boolean }) {
  return (
    <figure className="m-0">
      <div className="rounded-2xl bg-card p-4 shadow-[0_1px_2px_rgb(0_0_0/0.04)] ring-1 ring-black/[0.06] sm:p-5 dark:ring-white/[0.08]">
        <div
          className="overflow-hidden rounded-lg shadow-[0_1px_2px_rgb(0_0_0/0.08),0_20px_40px_-24px_rgb(0_0_0/0.4)] ring-1 ring-black/[0.06] dark:ring-white/[0.06]"
          style={{ aspectRatio: `${still.width} / ${still.height}` }}
        >
          {still.dark ? (
            <>
              <StillPicture className="block dark:hidden" eager={eager} name={still.name} still={still} />
              <StillPicture className="hidden dark:block" eager={eager} name={still.dark} still={still} />
            </>
          ) : (
            <StillPicture className="block" eager={eager} name={still.name} still={still} />
          )}
        </div>
      </div>
      <figcaption className="mt-3.5 text-balance text-center text-[0.8125rem] text-muted-foreground leading-[1.625]">
        {still.caption}
      </figcaption>
    </figure>
  );
}
