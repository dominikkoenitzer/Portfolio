import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import type { ProjectStat } from "@/constants/projects/types";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/* TiltFigure: a framed screenshot that tilts toward the cursor       */
/* ------------------------------------------------------------------ */

export function TiltFigure({
  src,
  alt,
  label,
  className,
  onOpen,
  openLabel,
  priority = false,
}: {
  src?: string;
  alt: string;
  label?: string;
  className?: string;
  /** When set, the frame becomes a button that opens the image in a lightbox. */
  onOpen?: () => void;
  /** Accessible name for that button (required for it to render). */
  openLabel?: string;
  priority?: boolean;
}) {
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(mx, { stiffness: 150, damping: 18 });
  const ry = useSpring(my, { stiffness: 150, damping: 18 });

  if (!src) return null;

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    my.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    mx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const picture = (
    <img
      alt={alt}
      className="block w-full"
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      loading={priority ? "eager" : "lazy"}
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
      src={src}
    />
  );

  return (
    <motion.figure
      className={`group/tilt relative overflow-hidden rounded-2xl border border-border/40 bg-card/40 shadow-2xl shadow-primary/10 ${className ?? ""}`}
      initial={{ opacity: 0, y: 28 }}
      onMouseLeave={reduced ? undefined : onLeave}
      onMouseMove={reduced ? undefined : onMove}
      style={{
        rotateX: reduced ? 0 : rx,
        rotateY: reduced ? 0 : ry,
        transformPerspective: 1100,
        transformStyle: "preserve-3d",
      }}
      transition={{ duration: 0.6, ease: EASE }}
      viewport={{ once: true, margin: "-80px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {/* window chrome — makes a screenshot read as an app window, not a crop */}
      <div className="flex items-center gap-1.5 border-border/30 border-b bg-background/50 px-3 py-2 backdrop-blur-sm">
        <span className="h-2.5 w-2.5 rounded-full bg-destructive/50" />
        <span className="h-2.5 w-2.5 rounded-full bg-primary/40" />
        <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
        {label ? (
          <span className="ml-2 truncate font-mono text-[10px] text-muted-foreground">
            {label}
          </span>
        ) : null}
      </div>
      <div className="relative overflow-hidden">
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
              className="pointer-events-none absolute right-3 bottom-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/40 bg-background/80 text-foreground/80 opacity-100 backdrop-blur-sm transition-opacity duration-300 ease-out md:opacity-0 md:group-hover/tilt:opacity-100"
            >
              <Maximize2 className="h-4 w-4" />
            </span>
          </button>
        ) : (
          picture
        )}
        {/* static glassy sheen */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,hsl(var(--foreground)/0.06),transparent_35%)] opacity-0 transition-opacity duration-500 group-hover/tilt:opacity-100"
        />
      </div>
    </motion.figure>
  );
}

/* ------------------------------------------------------------------ */
/* SpotlightCard: a primary-tinted glow that tracks the cursor        */
/* ------------------------------------------------------------------ */

export function SpotlightCard({
  className,
  children,
  glow = 0.12,
}: {
  className?: string;
  children: ReactNode;
  glow?: number;
}) {
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const mx = useMotionValue(-300);
  const my = useMotionValue(-300);
  const bg = useMotionTemplate`radial-gradient(22rem 22rem at ${mx}px ${my}px, hsl(var(--primary) / ${glow}), transparent 65%)`;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };
  const onLeave = () => {
    mx.set(-300);
    my.set(-300);
  };

  return (
    <div
      className={`relative isolate ${className ?? ""}`}
      onMouseLeave={reduced ? undefined : onLeave}
      onMouseMove={reduced ? undefined : onMove}
    >
      {reduced ? null : (
        <motion.div
          aria-hidden
          className="-z-10 pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: bg }}
        />
      )}
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CountUp + StatStrip: animated metric chips                          */
/* ------------------------------------------------------------------ */

export function CountUp({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const parsed = value.match(/^(\D*)([\d.,]+)(.*)$/);
  const [disp, setDisp] = useState(reduced ? (parsed?.[2] ?? "0") : "0");

  // Stats live in the hero (above the fold), so count up on mount. Depend ONLY
  // on the stable `value` string: the regex match is a fresh object each render,
  // so keeping it in deps would restart the tween on every setDisp (stuck at 0).
  useEffect(() => {
    if (reduced) return;
    const m = value.match(/^(\D*)([\d.,]+)(.*)$/);
    if (!m) return;
    const num = m[2];
    const tgt = Number.parseFloat(num.replace(/,/g, "")) || 0;
    const dec = num.includes(".") ? num.split(".")[1].length : 0;
    const comma = num.includes(",");
    const controls = animate(0, tgt, {
      duration: 1.2,
      delay: 0.25,
      ease: EASE,
      onUpdate: (v) => {
        let s = v.toFixed(dec);
        if (comma) s = Number(s).toLocaleString("en-US");
        setDisp(s);
      },
    });
    return () => controls.stop();
  }, [value, reduced]);

  if (!parsed) return <span className={className}>{value}</span>;
  return (
    <span className={className}>
      {parsed[1]}
      {disp}
      {parsed[3]}
    </span>
  );
}

export function StatStrip({ stats }: { stats?: ProjectStat[] }) {
  if (!stats?.length) return null;
  return (
    // One surface rather than four floating numbers: the strip is a single
    // component in the layout, so it gets a single frame and the dividers sit
    // inside it instead of hanging in the page.
    <dl className="glass-deep grid grid-cols-2 gap-y-8 rounded-2xl px-4 py-8 sm:flex sm:flex-wrap sm:items-stretch sm:justify-center sm:px-8 sm:py-9">
      {stats.map((s, i) => (
        <motion.div
          className={`px-4 text-center sm:px-10 ${i > 0 ? "sm:border-border/40 sm:border-l" : ""}`}
          initial={{ opacity: 0, y: 18 }}
          key={s.label}
          transition={{ duration: 0.5, ease: EASE, delay: Math.min(i, 6) * 0.07 }}
          viewport={{ once: true, margin: "-60px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <dt className="sr-only">{s.label}</dt>
          <dd className="m-0">
            <CountUp
              className="block font-bold font-heading text-4xl text-primary tabular-nums sm:text-5xl"
              value={s.value}
            />
            <span
              aria-hidden
              className="mt-2 block font-mono text-[10px] text-muted-foreground uppercase tracking-[0.18em]"
            >
              {s.label}
            </span>
          </dd>
        </motion.div>
      ))}
    </dl>
  );
}

/* ------------------------------------------------------------------ */
/* Magnetic: children drift toward the cursor on hover                */
/* ------------------------------------------------------------------ */

export function Magnetic({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const onMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      className={`inline-flex ${className ?? ""}`}
      onMouseLeave={reduced ? undefined : onLeave}
      onMouseMove={reduced ? undefined : onMove}
      style={{ x: reduced ? 0 : sx, y: reduced ? 0 : sy }}
    >
      {children}
    </motion.span>
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
    "inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/40 bg-background/80 text-foreground/80 backdrop-blur-sm transition-[background-color,color,transform] duration-200 ease-out hover:bg-background hover:text-foreground";

  return createPortal(
    <motion.div
      animate={{ opacity: 1 }}
      aria-label={labels.title}
      aria-modal="true"
      className="fixed inset-0 z-[100] flex flex-col bg-background/90 backdrop-blur-xl"
      initial={{ opacity: reduced ? 1 : 0 }}
      onKeyDown={onKeyDown}
      ref={panelRef}
      role="dialog"
      transition={{ duration: 0.2, ease: EASE }}
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
        <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.18em] tabular-nums">
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
          animate={{ opacity: 1, scale: 1 }}
          className="max-h-full min-h-0 w-auto max-w-full rounded-2xl border border-border/40 object-contain shadow-2xl shadow-primary/10"
          drag={reduced || total < 2 ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.16}
          initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.98 }}
          key={images[index]}
          onDragEnd={(_, info) => {
            if (info.offset.x < -70) go(1);
            else if (info.offset.x > 70) go(-1);
          }}
          src={images[index]}
          transition={{ duration: 0.25, ease: EASE }}
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
                  : "border-border/40 opacity-60 hover:opacity-100"
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
