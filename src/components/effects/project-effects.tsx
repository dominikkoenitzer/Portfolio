import { animate, motion, type TargetAndTransition, useMotionValue } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useOverlayLayer } from "@/hooks/use-overlay-layer";
import { DUR, EASE_OUT, SPRING_FLUID } from "@/lib/motion";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";

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
/**
 * Where a picture sat on the page when the viewer was opened from a crop of
 * it: the visible box on screen, which part of the picture that box showed
 * (fractions of the file), and the corner radius it had.
 */
export type LightboxOrigin = {
  rect: { left: number; top: number; width: number; height: number };
  crop: [number, number, number, number];
  radius: number;
};

export function Lightbox({
  alt,
  altLang,
  images,
  index,
  labels,
  onClose,
  onSelect,
  origin,
  originIndex,
}: {
  alt: string;
  /** The language of `alt` when it differs from the page's. */
  altLang?: string;
  images: string[];
  index: number;
  /**
   * The picture the viewer was opened from. While it is the one on show it
   * shares its frame's `layoutId`, so it grows out of the page on open and
   * returns there on close; any other picture simply fades.
   */
  originIndex?: number;
  /**
   * When set, the picture opens out of a crop instead of a whole frame: it
   * starts clipped to what the crop showed, at the crop's place, and unclips
   * as it grows into the viewer. It returns the same way on close.
   */
  origin?: LightboxOrigin | null;
  labels: LightboxLabels;
  onClose: () => void;
  onSelect: (next: number) => void;
}) {
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const panelRef = useRef<HTMLDivElement>(null);
  const total = images.length;

  useBodyScrollLock(true);
  const isTopLayer = useOverlayLayer(true);

  const go = useCallback(
    (delta: number) => onSelect((index + delta + total) % total),
    [index, onSelect, total],
  );

  // Move focus in on open and hand it back to whatever opened the viewer, so a
  // keyboard user lands back on the figure they were reading, not at the top.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    return () => {
      // The root has to come out of `inert` before the opener is focused:
      // `.focus()` inside an inert subtree is a silent no-op, and React runs
      // cleanups in the order the effects were declared, so leaving it to the
      // effect below meant every exit from the viewer dropped focus on <body>.
      const root = document.getElementById("root");
      if (root) {
        root.inert = false;
        root.removeAttribute("aria-hidden");
      }
      opener?.focus?.();
    };
  }, []);

  // Escape and the arrows are bound on the document rather than the panel:
  // clicking the picture itself moves focus to <body>, and a viewer whose keys
  // go dead the moment you touch what you came to look at is a trap. Home and
  // End jump to the ends of the gallery, which is what they do in every other
  // list on the site.
  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      // Only the overlay in front answers Escape.
      if (event.key === "Escape") {
        if (!isTopLayer(event)) return;
        event.preventDefault();
        onClose();
        return;
      }
      // Tab is trapped here rather than on the panel, because clicking the
      // picture (the obvious thing to do) because on a one-image gallery it is the
      // only content) moves focus to <body>, and a React handler bound to the
      // panel never sees a key pressed there. On a single-image viewer the
      // browser then walked the whole navbar behind the overlay: nine stops,
      // all invisible, dialog still open.
      if (event.key === "Tab") {
        const items = Array.from(
          panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
        );
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;
        if (!panelRef.current?.contains(active)) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        } else if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }
      if (total < 2) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      } else if (event.key === "Home") {
        event.preventDefault();
        onSelect(0);
      } else if (event.key === "End") {
        event.preventDefault();
        onSelect(total - 1);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, onClose, onSelect, total, isTopLayer]);

  // Warm the two shots either side of this one. The arrows and a swipe are a
  // single gesture away, and a 90 kB screenshot that only starts downloading on
  // the press shows an empty frame first.
  useEffect(() => {
    if (total < 2) return;
    for (const src of [
      images[(index + 1) % total],
      images[(index - 1 + total) % total],
    ]) {
      const warm = new Image();
      warm.src = src;
    }
  }, [images, index, total]);

  // The dialog portals into <body>, so the app root is its sibling: hiding it
  // while the viewer is open is what stops a screen reader in browse mode from
  // reading the whole project page straight through the overlay.
  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    root.setAttribute("aria-hidden", "true");
    root.inert = true;
    return () => {
      root.removeAttribute("aria-hidden");
      root.inert = false;
    };
  }, []);

  const control =
    "inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-card text-foreground/80 transition-colors duration-200 ease-out hover:text-foreground";

  const morph = !reduced && origin && originIndex === index ? origin : null;
  const sharedId =
    !reduced && !morph && originIndex === index ? `project-shot-${index}` : undefined;

  // The crop morph: measured once the picture has its place in the viewer,
  // then set to the crop's place and released. Transform and one clip-path.
  const imageRef = useRef<HTMLImageElement>(null);
  const [returnTo, setReturnTo] = useState<TargetAndTransition | null>(null);
  // Motion values, not writes to the element: the image owns its transform
  // (it drags on x), so anything set from outside would be painted over.
  const morphX = useMotionValue(0);
  const morphY = useMotionValue(0);
  const morphScale = useMotionValue(1);
  const morphClip = useMotionValue("inset(0% 0% 0% 0% round 16px)");
  // Once per picture: `index` is the key the image remounts on.
  useLayoutEffect(() => {
    const el = imageRef.current;
    if (!morph || !el) return;
    const box = el.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const [x0, y0, x1, y1] = morph.crop;
    const width = morph.rect.width / (x1 - x0);
    const height = morph.rect.height / (y1 - y0);
    const left = morph.rect.left - x0 * width;
    const top = morph.rect.top - y0 * height;
    const scale = width / box.width;
    const from = {
      x: left + width / 2 - (box.left + box.width / 2),
      y: top + height / 2 - (box.top + box.height / 2),
      scale,
      clipPath: `inset(${(y0 * 100).toFixed(3)}% ${((1 - x1) * 100).toFixed(3)}% ${((1 - y1) * 100).toFixed(3)}% ${(x0 * 100).toFixed(3)}% round ${(morph.radius / scale).toFixed(2)}px)`,
    };
    morphX.set(from.x);
    morphY.set(from.y);
    morphScale.set(scale);
    morphClip.set(from.clipPath);
    animate(morphX, 0, SPRING_FLUID);
    animate(morphY, 0, SPRING_FLUID);
    animate(morphScale, 1, SPRING_FLUID);
    animate(morphClip, "inset(0% 0% 0% 0% round 16px)", { duration: 0.45, ease: EASE_OUT });
    setReturnTo({ ...from, transition: { ...SPRING_FLUID, clipPath: { duration: 0.35, ease: EASE_OUT } } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return createPortal(
    <motion.div
      animate={{ opacity: 1 }}
      aria-label={labels.title}
      aria-modal="true"
      className="fixed inset-0 z-100 flex flex-col bg-background/95"
      exit={{ opacity: 0 }}
      initial={{ opacity: reduced ? 1 : 0 }}
      ref={panelRef}
      role="dialog"
      transition={{ duration: DUR.fast, ease: EASE_OUT }}
    >
      {/* The backdrop closes on click; the header and the image sit above it
          and do not. It is not tabbable, so Escape and the close button stay
          the keyboard route out. `data-cursor-ignore` for the same reason as
          the CV preview's: a viewport-sized button would pull the custom
          cursor's magnet onto the whole page. */}
      <button
        aria-hidden
        className="absolute inset-0 cursor-zoom-out"
        data-cursor-ignore
        onClick={onClose}
        tabIndex={-1}
        type="button"
      />

      <div className="relative flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <p className="text-muted-foreground text-sm tabular-nums">
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
          lang={altLang}
          animate={{ opacity: 1 }}
          className="max-h-full min-h-0 w-auto max-w-full border border-border/60 object-contain"
          drag={reduced || total < 2 ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.16}
          initial={{ opacity: reduced || sharedId || morph ? 1 : 0 }}
          exit={returnTo ?? undefined}
          key={images[index]}
          layoutId={sharedId}
          ref={imageRef}
          onDragEnd={(_, info) => {
            // Either a deliberate drag or a flick: a fast swipe on a phone
            // covers barely 40px before the finger leaves the glass, and
            // distance alone swallowed it.
            const right = info.offset.x > 70 || info.velocity.x > 500;
            const left = info.offset.x < -70 || info.velocity.x < -500;
            if (left) go(1);
            else if (right) go(-1);
          }}
          src={images[index]}
          // The radius lives in `style` rather than a class so the shared
          // layout animation can correct it while the box scales; a class
          // radius stretches into an oval mid-flight.
          style={
            morph
              ? { borderRadius: 16, x: morphX, y: morphY, scale: morphScale, clipPath: morphClip }
              : { borderRadius: 16 }
          }
          transition={{
            layout: SPRING_FLUID,
            opacity: { duration: DUR.fast, ease: EASE_OUT },
          }}
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
