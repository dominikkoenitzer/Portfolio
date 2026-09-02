import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import type { ProjectStat } from "@/constants/projects/types";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { DUR, EASE_OUT, VIEWPORT } from "@/lib/motion";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";

/* ------------------------------------------------------------------ */
/* ProjectFigure: a framed screenshot, optionally opening a lightbox   */
/* ------------------------------------------------------------------ */

/**
 * The ratio every project screenshot in `public/projects/` is exported at
 * (1600x1000). It is only the opening bid: the frame re-reserves itself from
 * the file's own dimensions as soon as the browser knows them, so a portrait
 * shot or a square icon is never squeezed into a landscape slot.
 */
const SHOT_RATIO = 16 / 10;

export function ProjectFigure({
  src,
  alt,
  label,
  className,
  onOpen,
  openLabel,
  priority = false,
  ratio = SHOT_RATIO,
}: {
  src?: string;
  alt: string;
  /** Optional caption under the frame (the live host, usually). */
  label?: string;
  className?: string;
  /** When set, the frame becomes a button that opens the image in a lightbox. */
  onOpen?: () => void;
  /** Accessible name for that button (required for it to render). */
  openLabel?: string;
  priority?: boolean;
  /**
   * Width over height of the picture, used to reserve its box before the file
   * arrives. Pass the real one for anything that is not a landscape screenshot
   * (a portrait shot, a square icon) to make the reservation exact from the
   * first frame.
   */
  ratio?: number;
}) {
  const [box, setBox] = useState(ratio);
  const [failed, setFailed] = useState(false);

  // Correct the reservation from the file itself. Runs both on load and when
  // the element attaches, because a cached image is already complete by the
  // time React wires the handler up and would never fire `onLoad`.
  const measure = useCallback((node: HTMLImageElement | null) => {
    if (!node?.naturalWidth || !node.naturalHeight) return;
    const real = node.naturalWidth / node.naturalHeight;
    setBox((current) => (Math.abs(current - real) < 0.005 ? current : real));
  }, []);

  if (!src) return null;

  // The box is reserved by ratio rather than left to the file: an <img> with no
  // dimensions is a zero-height box until it decodes, and there are four of
  // these per project page, so a cold load pushed the article down once per
  // picture. `object-contain` means the reservation never crops, and a file
  // that 404s leaves the frame standing instead of collapsing it.
  const picture = (
    <div className="relative w-full" style={{ aspectRatio: box }}>
      <img
        alt={alt}
        className={`absolute inset-0 h-full w-full object-contain ${failed ? "opacity-0" : ""}`}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
        onError={() => setFailed(true)}
        onLoad={(event) => measure(event.currentTarget)}
        ref={measure}
        src={src}
      />
    </div>
  );

  return (
    <motion.figure
      className={`group/shot m-0 ${className ?? ""}`}
      initial={{ opacity: 0, y: 24 }}
      transition={{ duration: DUR.slow, ease: EASE_OUT }}
      viewport={VIEWPORT}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card transition-colors duration-200 ease-out hover:border-primary/30">
        {onOpen && openLabel ? (
          <button
            aria-label={openLabel}
            className="block w-full cursor-zoom-in"
            onClick={onOpen}
            type="button"
          >
            {picture}
            {/* Affordance, not decoration: the frame is clickable, so say so.
                Opacity only, and it is always painted for touch, where there
                is no hover to reveal it. */}
            <span
              aria-hidden
              className="pointer-events-none absolute right-3 bottom-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card text-foreground/80 transition-opacity duration-200 ease-out md:opacity-0 md:group-hover/shot:opacity-100"
            >
              <Maximize2 className="h-4 w-4" />
            </span>
          </button>
        ) : (
          picture
        )}
      </div>
      {label ? (
        <figcaption className="mt-2.5 text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
          {label}
        </figcaption>
      ) : null}
    </motion.figure>
  );
}

/* ------------------------------------------------------------------ */
/* StatStrip: the project's headline numbers, as a flat meta row       */
/* ------------------------------------------------------------------ */

export function StatStrip({ stats }: { stats?: ProjectStat[] }) {
  if (!stats?.length) return null;
  return (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-border/60 border-t pt-7 sm:flex sm:flex-wrap sm:gap-x-14">
      {stats.map((stat) => (
        <div key={stat.label}>
          {/* The label reads under the number, so the term is voiced from a
              screen-reader-only copy and the visible one is decorative. */}
          <dt className="sr-only">{stat.label}</dt>
          <dd className="m-0">
            <span className="block font-heading text-3xl text-primary tabular-nums sm:text-4xl">
              {stat.value}
            </span>
            <span
              aria-hidden
              className="mt-1.5 block text-[10px] text-muted-foreground uppercase tracking-[0.18em]"
            >
              {stat.label}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ------------------------------------------------------------------ */
/* Lightbox: full-size gallery viewer                                  */
/* ------------------------------------------------------------------ */

export type LightboxLabels = {
  /** "{index} of {total}" */
  counter: string;
  close: string;
  next: string;
  previous: string;
  /** "Show image {index}" */
  thumb: string;
  /** Accessible name for the dialog itself. */
  title: string;
};

const FOCUSABLE = 'a[href],button:not([disabled]):not([tabindex="-1"])';

/**
 * A gallery viewer built by hand: the project has no Radix Dialog, and pulling
 * one in for four buttons would cost more than it saves. It does what a dialog
 * has to do (labelled `aria-modal`, focus moved in and restored on close,
 * Escape and the arrow keys bound, Tab cycling inside) and it animates opacity
 * and transform only, so nothing repaints per frame.
 */
export function Lightbox({
  alt,
  images,
  index,
  labels,
  onClose,
  onSelect,
}: {
  alt: string;
  images: string[];
  index: number;
  labels: LightboxLabels;
  onClose: () => void;
  onSelect: (next: number) => void;
}) {
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const panelRef = useRef<HTMLDivElement>(null);
  const total = images.length;

  useBodyScrollLock(true);

  const go = useCallback(
    (delta: number) => onSelect((index + delta + total) % total),
    [index, onSelect, total],
  );

  // Move focus in on open and hand it back to whatever opened the viewer, so a
  // keyboard user lands back on the figure they were reading, not at the top.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    return () => opener?.focus?.();
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key === "ArrowRight" && total > 1) {
      event.preventDefault();
      go(1);
      return;
    }
    if (event.key === "ArrowLeft" && total > 1) {
      event.preventDefault();
      go(-1);
      return;
    }
    if (event.key !== "Tab") return;

    const items = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
    );
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const control =
    "inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-card text-foreground/80 transition-colors duration-200 ease-out hover:text-foreground";

  return createPortal(
    <motion.div
      animate={{ opacity: 1 }}
      aria-label={labels.title}
      aria-modal="true"
      className="fixed inset-0 z-[100] flex flex-col bg-background/95"
      initial={{ opacity: reduced ? 1 : 0 }}
      onKeyDown={onKeyDown}
      ref={panelRef}
      role="dialog"
      transition={{ duration: DUR.fast, ease: EASE_OUT }}
    >
      {/* The backdrop closes on click; the header and the image sit above it
          and do not. It is not tabbable, so Escape and the close button stay
          the keyboard route out. */}
      <button
        aria-hidden
        className="absolute inset-0 cursor-zoom-out"
        onClick={onClose}
        tabIndex={-1}
        type="button"
      />

      <div className="relative flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <p className="text-[11px] text-muted-foreground uppercase tracking-[0.18em] tabular-nums">
          {labels.counter
            .replace("{index}", String(index + 1))
            .replace("{total}", String(total))}
        </p>
        <button
          aria-label={labels.close}
          className={control}
          onClick={onClose}
          type="button"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* The arrows overlay the frame rather than sitting beside it: as flex
          siblings they competed with the image for width, and on a phone that
          pushed both of them off the screen. */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-4 sm:px-16 sm:pb-8">
        {total > 1 ? (
          <button
            aria-label={labels.previous}
            className={`${control} -translate-y-1/2 absolute top-1/2 left-2 z-10 sm:left-4`}
            onClick={() => go(-1)}
            type="button"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : null}

        <motion.img
          alt={alt}
          animate={{ opacity: 1 }}
          className="max-h-full min-h-0 w-auto max-w-full rounded-2xl border border-border/60 object-contain"
          drag={reduced || total < 2 ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.16}
          initial={{ opacity: reduced ? 1 : 0 }}
          key={images[index]}
          onDragEnd={(_, info) => {
            if (info.offset.x < -70) go(1);
            else if (info.offset.x > 70) go(-1);
          }}
          src={images[index]}
          transition={{ duration: DUR.fast, ease: EASE_OUT }}
        />

        {total > 1 ? (
          <button
            aria-label={labels.next}
            className={`${control} -translate-y-1/2 absolute top-1/2 right-2 z-10 sm:right-4`}
            onClick={() => go(1)}
            type="button"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      {total > 1 ? (
        <div className="relative flex justify-center gap-2 overflow-x-auto px-4 pb-5 sm:pb-7">
          {images.map((src, i) => (
            <button
              aria-current={i === index}
              aria-label={labels.thumb.replace("{index}", String(i + 1))}
              className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border transition-[border-color,opacity] duration-200 ease-out ${
                i === index
                  ? "border-primary/60 opacity-100"
                  : "border-border/60 opacity-60 hover:opacity-100"
              }`}
              key={src}
              onClick={() => onSelect(i)}
              type="button"
            >
              <img
                alt=""
                className="h-full w-full object-cover object-top"
                decoding="async"
                loading="lazy"
                src={src}
              />
            </button>
          ))}
        </div>
      ) : null}
    </motion.div>,
    document.body,
  );
}
