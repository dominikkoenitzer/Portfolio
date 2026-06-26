import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { type ReactNode, useEffect, useMemo, useState } from "react";

import type { ProjectStat } from "@/constants/projects/types";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/* TiltFigure — a framed screenshot that tilts toward the cursor       */
/* ------------------------------------------------------------------ */

export function TiltFigure({
  src,
  alt,
  label,
  className,
  priority = false,
}: {
  src?: string;
  alt: string;
  label?: string;
  className?: string;
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
          <span className="ml-2 truncate font-mono text-[10px] text-muted-foreground/60">
            {label}
          </span>
        ) : null}
      </div>
      <div className="relative overflow-hidden">
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
/* SpotlightCard — a primary-tinted glow that tracks the cursor        */
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
/* CountUp + StatStrip — animated metric chips                          */
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
  // on the stable `value` string — the regex match is a fresh object each render,
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
    <div className="grid grid-cols-2 gap-y-8 sm:flex sm:flex-wrap sm:items-stretch sm:justify-center">
      {stats.map((s, i) => (
        <motion.div
          className={`px-4 text-center sm:px-10 ${i > 0 ? "sm:border-border/40 sm:border-l" : ""}`}
          initial={{ opacity: 0, y: 18 }}
          key={s.label}
          transition={{ duration: 0.5, ease: EASE, delay: Math.min(i, 6) * 0.07 }}
          viewport={{ once: true, margin: "-60px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <CountUp
            className="block font-bold font-heading text-4xl text-primary tabular-nums sm:text-5xl"
            value={s.value}
          />
          <span className="mt-2 block font-mono text-[10px] text-muted-foreground/60 uppercase tracking-[0.18em]">
            {s.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Magnetic — children drift toward the cursor on hover                */
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
