import { AnimatePresence, motion } from "framer-motion";
import { type CSSProperties, type KeyboardEvent, type ReactNode, useId, useState } from "react";
import { Lightbox, type LightboxOrigin } from "@/components/effects/project-effects";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { useMotionSafe } from "./motion";
import { RING } from "./style";
import type { Code, Point, Still } from "./types";

/** The shared controls of the project pages' live demos: one demo box, pills and actions. */

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
    <figure aria-label={label} className="m-0">
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

/** The quiet surface every boxed visual shares: card tone, radius 16, a hairline and a contact shadow. */
export const SURFACE =
  "rounded-2xl bg-card shadow-[0_1px_2px_rgb(0_0_0/0.04)] ring-1 ring-black/[0.06] dark:ring-white/[0.08]";

/** A picture's own edge inside a surface: a finer hairline and a soft drop, so it reads as a window on the card. */
const PICTURE_EDGE =
  "shadow-[0_1px_2px_rgb(0_0_0/0.08),0_20px_40px_-24px_rgb(0_0_0/0.4)] ring-1 ring-black/[0.06] dark:ring-white/[0.06]";

const CAPTION = "mt-3.5 text-balance text-center text-[0.8125rem] text-muted-foreground leading-[1.625]";

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

const cropOf = (still: Still) => still.crop ?? ([0, 0, 1, 1] as [number, number, number, number]);

/**
 * The site's viewer for a group of stills. Each opens out of the crop it was
 * pressed in and grows into the whole capture; the others in the group are
 * one arrow away.
 */
function useViewer(stills: Still[], radius: number) {
  const [state, setState] = useState<{ index: number; at: number; from: LightboxOrigin } | null>(null);
  const { language } = useLanguage();
  const t = translations[language].projectDetails;
  const show = (index: number, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    setState({
      index,
      at: index,
      from: { rect: { left: r.left, top: r.top, width: r.width, height: r.height }, crop: cropOf(stills[index]), radius },
    });
  };
  const largest = (still: Still) => {
    const fits = STILL_WIDTHS.filter((w) => w <= still.width);
    return fits[fits.length - 1] ?? 640;
  };
  const viewer = (
    <AnimatePresence>
      {state ? (
        <Lightbox
          alt={stills[state.index].alt}
          altLang={language === "en" ? undefined : "en"}
          images={stills.map((still) => {
            const dark = document.documentElement.classList.contains("dark") && still.dark;
            return `/projects/e/${dark ? still.dark : still.name}-${largest(still)}.webp`;
          })}
          index={state.index}
          labels={{
            close: t.closeViewer,
            counter: t.imageCounter,
            next: t.nextImage,
            previous: t.previousImage,
            thumb: t.showImage,
            title: stills[state.index].alt,
          }}
          onClose={() => setState(null)}
          onSelect={(index) => setState((s) => (s ? { ...s, index } : s))}
          origin={state.from}
          originIndex={state.at}
        />
      ) : null}
    </AnimatePresence>
  );
  return { show, viewer };
}

/**
 * One still, cut to its crop. The button reserves the crop's shape before the
 * picture loads, so nothing moves; pressing it opens the whole capture.
 * `box` is the drawn width from 720px up and `phone` the width below, both as
 * CSS lengths, so the browser asks for exactly the pixels the crop needs.
 */
function Crop({
  still,
  eager,
  box,
  phone,
  className,
  onOpen,
}: {
  still: Still;
  eager: boolean;
  box: string;
  phone: string;
  className: string;
  onOpen: (el: HTMLElement) => void;
}) {
  const crop = cropOf(still);
  const cw = crop[2] - crop[0];
  const ch = crop[3] - crop[1];
  const scale = (1 / cw).toFixed(3);
  const sizes = `(min-width: 720px) calc(${box} * ${scale}), calc(${phone} * ${scale})`;
  return (
    <button
      aria-label={still.alt}
      className={`relative block w-full cursor-zoom-in overflow-hidden ${RING} ${className}`}
      onClick={(event) => onOpen(event.currentTarget)}
      style={{ aspectRatio: `${Math.round(still.width * cw)} / ${Math.round(still.height * ch)}` }}
      type="button"
    >
      {/* Wider than the button on purpose: the site's phone rule caps every
          element at its parent's width, which would shrink the crop back to
          the whole capture, so this one is let out of it. */}
      <span
        className="absolute block"
        style={{ width: `${100 / cw}%`, maxWidth: "none", left: `${(-crop[0] / cw) * 100}%`, top: `${(-crop[1] / ch) * 100}%` }}
      >
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
  );
}

/** A real capture in the same surface as the demos, cropped to the part that proves its caption. */
export function StillFigure({ still, eager = false }: { still: Still; eager?: boolean }) {
  const { show, viewer } = useViewer([still], 8);
  return (
    <figure className="m-0">
      <div className={`${SURFACE} p-4 sm:p-5`}>
        <Crop
          box="600px"
          className={`rounded-lg ${PICTURE_EDGE}`}
          eager={eager}
          onOpen={(el) => show(0, el)}
          phone="(100vw - 80px)"
          still={still}
        />
      </div>
      {still.caption ? <figcaption className={CAPTION}>{still.caption}</figcaption> : null}
      {viewer}
    </figure>
  );
}

/**
 * Two captures of one thing side by side in one surface (before and after,
 * two screens of one flow), stacked on a phone, where side by side would make
 * both too small to read. One caption speaks for both.
 */
export function PairFigure({ stills, caption }: { stills: [Still, Still]; caption: string }) {
  const { show, viewer } = useViewer(stills, 8);
  return (
    <figure className="m-0">
      <div className={`${SURFACE} grid gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-5`}>
        {stills.map((still, i) => (
          <Crop
            box="290px"
            className={`self-center rounded-lg ${PICTURE_EDGE}`}
            eager={false}
            key={`${still.name}-${i}`}
            onOpen={(el) => show(i, el)}
            phone="(100vw - 80px)"
            still={still}
          />
        ))}
      </div>
      <figcaption className={CAPTION}>{caption}</figcaption>
      {viewer}
    </figure>
  );
}

/**
 * The app as it really looks, wide under the header: wider than the text
 * column on a desktop, the column's width on a phone. It stands on the page
 * with only its own edge, because the capture already carries its backdrop.
 */
export function HeroPicture({ still }: { still: Still }) {
  const { show, viewer } = useViewer([still], 18);
  return (
    <figure className="m-0">
      <Crop
        box="min(920px, 100vw - 64px)"
        className="rounded-[18px] shadow-[0_1px_2px_rgb(0_0_0/0.06),0_28px_56px_-32px_rgb(0_0_0/0.35)] ring-1 ring-black/[0.06] dark:ring-white/[0.08]"
        eager
        onOpen={(el) => show(0, el)}
        phone="(100vw - 48px)"
        still={still}
      />
      {still.caption ? <figcaption className={CAPTION}>{still.caption}</figcaption> : null}
      {viewer}
    </figure>
  );
}

/**
 * A short excerpt of the real source in the demos' surface, with the file it
 * comes from on a quiet bar. Focusable, because a long line scrolls sideways.
 */
export function CodePane({ code }: { code: Code }) {
  return (
    <figure className="m-0">
      <div className={`${SURFACE} overflow-hidden`}>
        <div className="flex h-10 items-center border-border/60 border-b px-4 sm:px-5">
          <span className="truncate text-[0.75rem] text-muted-foreground">{code.file}</span>
        </div>
        <pre
          aria-label={code.file}
          className="code-excerpt m-0 overflow-x-auto px-4 py-4 text-[0.78rem] text-foreground/85 leading-[1.65] focus-visible:outline-2 focus-visible:outline-primary focus-visible:-outline-offset-2 sm:px-5 sm:py-5"
          tabIndex={0}
        >
          <code>{code.text}</code>
        </pre>
      </div>
      <figcaption className={CAPTION}>{code.caption}</figcaption>
    </figure>
  );
}

/**
 * A quiet list of what something answers to: keys, commands, rules. The term
 * on the left, one line about it on the right, rows parted by hairlines.
 */
export function Points({ items }: { items: Point[] }) {
  return (
    <dl className="m-0 border-border/80 border-t">
      {items.map((item) => (
        <div
          className="grid gap-1 border-border/80 border-b py-3.5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6"
          key={item.term}
        >
          <dt className="font-medium text-[0.875rem] text-foreground leading-[1.6]">{item.term}</dt>
          <dd className="m-0 text-[0.875rem] text-foreground/75 leading-[1.6]">{item.text}</dd>
        </div>
      ))}
    </dl>
  );
}
