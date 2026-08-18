import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/**
 * The scroll act that follows the 3D tree.
 *
 * The tree stops at the panel edge; this continues it. A branch draws down the
 * page as you scroll, each category is a node on that branch glowing in its own
 * accent, and its services bud off one at a time. The motion vocabulary is
 * deliberately the hero's — velocity skew, magnetic pull — so the page reads as
 * one site rather than a catalogue of effects.
 *
 * Everything heavy is gated: `useReducedMotion` collapses it to a plain list,
 * and coarse pointers skip the velocity skew (it shears badly during touch
 * momentum scrolling — the same reason HeroSection disables it).
 */

export type OfferService = {
  key: string;
  title: string;
  description: string;
  price: string;
  icon: LucideIcon;
  inquiry: { label: string; subject: string; message: string };
};

export type OfferCategory = {
  key: string;
  label: string;
  desc: string;
  /** Decorative accent — glows, washes, icon tiles. Tuned for saturation. */
  accent: string;
  /** The same hue at text contrast. Anything carrying words uses this. */
  accentText: string;
  fromLabel: string;
  services: OfferService[];
};

const EASE = [0.22, 1, 0.36, 1] as const;

/** `#36d0ff` + alpha → `rgba(...)`, so accents can tint backgrounds. */
const rgba = (hex: string, alpha: number) => {
  const n = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

/**
 * Counts the leading figure up when the row arrives, keeping the rest of the
 * price verbatim — "200 CHF + 50/mo" animates the 200 and leaves the tail alone.
 */
function PriceCounter({ price, accent }: { price: string; accent: string }) {
  // `accent` here is already the text-contrast variant (see OfferCategory).
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const reduce = useReducedMotion();

  const match = price.match(/^(\d+)([\s\S]*)$/);
  const target = match ? Number(match[1]) : 0;
  const tail = match ? match[2] : price;

  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toString());

  useEffect(() => {
    if (!(inView && match) || reduce) return;
    const controls = animate(count, target, { duration: 1.1, ease: EASE });
    return () => controls.stop();
  }, [inView, match, reduce, count, target]);

  if (!match || reduce) {
    return (
      <span className="font-mono text-xs" ref={ref}>
        {price}
      </span>
    );
  }

  return (
    <span className="font-mono text-xs tabular-nums" ref={ref}>
      <motion.span style={{ color: inView ? accent : undefined }}>
        {rounded}
      </motion.span>
      {tail}
    </span>
  );
}

function ServiceRow({
  service,
  accentText,
  index,
  skew,
}: {
  service: OfferService;
  accentText: string;
  index: number;
  skew: ReturnType<typeof useTransform<number, number>> | null;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const Icon = service.icon;

  // Magnetic pull, same feel as the hero's CTA buttons.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 180, damping: 18, mass: 0.1 });
  const y = useSpring(my, { stiffness: 180, damping: 18, mass: 0.1 });

  return (
    <motion.li
      initial={{ opacity: 0, y: 34, filter: "blur(10px)" }}
      transition={{ duration: 0.7, delay: index * 0.09, ease: EASE }}
      viewport={{ once: true, margin: "-12%" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    >
      <motion.div style={skew ? { skewY: skew } : undefined}>
        <Link
          className="group relative flex items-start gap-4 py-6 focus-visible:outline-none sm:gap-5"
          onMouseLeave={() => {
            mx.set(0);
            my.set(0);
          }}
          onMouseMove={(e) => {
            const r = ref.current?.getBoundingClientRect();
            if (!r) return;
            mx.set((e.clientX - (r.left + r.width / 2)) * 0.03);
            my.set((e.clientY - (r.top + r.height / 2)) * 0.12);
          }}
          ref={ref}
          state={service.inquiry}
          to="/contact"
        >
          {/* Accent wash that sweeps in from the branch side on hover. */}
          <span
            aria-hidden
            className="-inset-x-4 -inset-y-1 pointer-events-none absolute origin-left scale-x-0 rounded-2xl opacity-0 transition-all duration-500 ease-out group-hover:scale-x-100 group-hover:opacity-100 group-focus-visible:scale-x-100 group-focus-visible:opacity-100"
            style={{
              background: `linear-gradient(90deg, ${rgba(accentText, 0.09)} 0%, transparent 70%)`,
            }}
          />

          <motion.span className="relative flex min-w-0 flex-1 items-start gap-4 sm:gap-5" style={{ x, y }}>
            <span
              aria-hidden
              className="mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
              style={{
                background: rgba(accentText, 0.1),
                color: accentText,
                boxShadow: `0 0 0 1px ${rgba(accentText, 0.22)}`,
              }}
            >
              <Icon className="h-5 w-5" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="font-semibold text-base transition-colors duration-300 sm:text-lg">
                  {service.title}
                </span>
                <span className="text-muted-foreground">
                  <PriceCounter accent={accentText} price={service.price} />
                </span>
              </span>
              <span className="mt-1.5 block text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </span>
            </span>

            <ArrowRight
              aria-hidden
              className="mt-3 h-4 w-4 flex-none translate-x-0 text-muted-foreground/30 transition-all duration-300 group-hover:translate-x-1"
              style={{ color: undefined }}
            />
          </motion.span>
        </Link>
      </motion.div>
    </motion.li>
  );
}

function CategoryStage({
  category,
  index,
  skew,
}: {
  category: OfferCategory;
  index: number;
  skew: ReturnType<typeof useTransform<number, number>> | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Ghost numeral drifts against the scroll; the accent bloom peaks mid-section.
  const ghostY = useTransform(scrollYProgress, [0, 1], ["18%", "-18%"]);
  const bloom = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  return (
    <div className="relative" ref={ref}>
      {/* Accent bloom — the section's colour breathing behind the content. */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-[-20%] inset-y-[-10%] -z-10"
          style={{
            opacity: bloom,
            background: `radial-gradient(60% 50% at 20% 50%, ${rgba(category.accent, 0.16)} 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Oversized ghost numeral, parallaxing behind the header. */}
      {!reduce && (
        <motion.span
          aria-hidden
          className="-z-10 pointer-events-none absolute top-0 right-0 select-none font-bold leading-none"
          style={{
            y: ghostY,
            fontSize: "clamp(7rem, 18vw, 15rem)",
            color: rgba(category.accent, 0.07),
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>
      )}

      <div>
        <motion.div
          className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pb-5"
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: EASE }}
          viewport={{ once: true, margin: "-15%" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="min-w-0">
            <h2
              className="font-bold text-3xl tracking-tight sm:text-4xl"
              style={{ textShadow: `0 0 44px ${rgba(category.accent, 0.3)}` }}
            >
              {category.label}
            </h2>
            <p className="mt-1.5 text-muted-foreground text-sm">
              {category.desc}
            </p>
          </div>
          <p className="font-mono text-xs" style={{ color: category.accentText }}>
            {category.fromLabel}
          </p>
        </motion.div>

        {/* Rule that wipes in under the header, in the category accent. */}
        <motion.div
          className="h-px origin-left"
          initial={{ scaleX: 0 }}
          style={{
            background: `linear-gradient(90deg, ${category.accentText} 0%, ${rgba(category.accentText, 0)} 100%)`,
          }}
          transition={{ duration: 0.9, ease: EASE }}
          viewport={{ once: true, margin: "-15%" }}
          whileInView={{ scaleX: 1 }}
        />
      </div>

      <ul className="divide-y divide-border/10">
        {category.services.map((service, i) => (
          <ServiceRow
            accentText={category.accentText}
            index={i}
            key={service.key}
            service={service}
            skew={skew}
          />
        ))}
      </ul>
    </div>
  );
}

export function ServiceOffers({
  categories,
}: {
  categories: OfferCategory[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [fine, setFine] = useState(false);

  // Velocity skew shears badly during touch-momentum scrolling — desktop only,
  // matching HeroSection's `reduceFx` gate.
  useEffect(() => {
    setFine(window.matchMedia("(pointer: fine)").matches);
  }, []);

  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 45, stiffness: 300 });
  const skewRaw = useTransform(smooth, [-2200, 0, 2200], [1.6, 0, -1.6]);
  const skew = !reduce && fine ? skewRaw : null;

  // The branch: draws downward as the whole stack scrolls through.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 60%"],
  });
  const draw = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <div className="relative lg:pl-20" ref={ref}>
      {/* The branch continuing out of the 3D tree above. Decorative, desktop —
          the content stack reads identically without it. */}
      {!reduce && (
        <svg
          aria-hidden
          className="pointer-events-none absolute top-0 bottom-0 left-4 hidden w-10 lg:block"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 40 1000"
        >
          <title>Decorative branch</title>
          <defs>
            <linearGradient id="branch-gradient" x1="0" x2="0" y1="0" y2="1">
              {categories.map((c, i) => (
                <stop
                  key={c.key}
                  offset={`${(i / Math.max(categories.length - 1, 1)) * 100}%`}
                  stopColor={c.accentText}
                />
              ))}
            </linearGradient>
          </defs>
          <motion.path
            d="M20 0 C 8 180, 32 320, 20 500 S 8 820, 20 1000"
            stroke="url(#branch-gradient)"
            strokeLinecap="round"
            strokeWidth="2"
            style={{ pathLength: draw, opacity: 0.55 }}
          />
        </svg>
      )}

      <div className="space-y-24 sm:space-y-32">
        {categories.map((category, i) => (
          <CategoryStage
            category={category}
            index={i}
            key={category.key}
            skew={skew}
          />
        ))}
      </div>
    </div>
  );
}
