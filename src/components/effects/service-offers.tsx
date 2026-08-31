import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { revealOnScroll } from "@/lib/framer-animations";
import { DUR, EASE_OUT, REVEAL, stagger, VIEWPORT } from "@/lib/motion";

/**
 * The offer stack that follows the 3D tree.
 *
 * The tree stops at the panel edge; this continues it. A branch draws down the
 * page as you scroll, each category is a stop on that branch glowing in its own
 * accent, and its three offers bud off as cards.
 *
 * The cards are a grid rather than a list so a row's cards share a height and
 * their prices land on one line: a price you can compare across three offers
 * without moving your eye is most of what makes a rate card read as considered.
 * Each card is one link, so there is one focus stop and one 44px-plus target per
 * offer, and it carries the same `/contact` router state the tree's detail card
 * does.
 *
 * Everything decorative is gated behind `useReducedMotion`, which collapses the
 * section to a static grid.
 */

export type OfferService = {
  key: string;
  title: string;
  description: string;
  /** The short capability chips shown under the description. */
  features: readonly string[];
  price: string;
  icon: LucideIcon;
  inquiry: { label: string; subject: string; message: string };
};

export type OfferCategory = {
  key: string;
  label: string;
  desc: string;
  /** Decorative accent: glows, washes, icon tiles. Tuned for saturation. */
  accent: string;
  /** The same hue at text contrast. Anything carrying words uses this. */
  accentText: string;
  fromLabel: string;
  services: OfferService[];
};

/**
 * The price count-up. Longer than any transition on purpose: it is a number
 * being read, not a surface being moved, and under ~1s the digits blur past.
 */
const COUNT_UP = 1.1;

/** `#36d0ff` + alpha → `rgba(...)`, so accents can tint backgrounds. */
const rgba = (hex: string, alpha: number) => {
  const n = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

/**
 * Counts the leading figure up when the card arrives, keeping the rest of the
 * price verbatim: "200 CHF + 50/mo" animates the 200 and leaves the tail alone.
 */
function PriceCounter({ price, accent }: { price: string; accent: string }) {
  // `accent` here is already the text-contrast variant (see OfferCategory).
  const ref = useRef<HTMLSpanElement>(null);
  // No inset margin: a price that is on screen at all should count, or a card
  // sitting on the fold shows "0 CHF" until the visitor scrolls.
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();

  const match = price.match(/^(\d+)([\s\S]*)$/);
  const target = match ? Number(match[1]) : 0;
  const tail = match ? match[2] : price;

  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toString());

  useEffect(() => {
    if (!(inView && match) || reduce) return;
    const controls = animate(count, target, {
      duration: COUNT_UP,
      ease: EASE_OUT,
    });
    return () => controls.stop();
  }, [inView, match, reduce, count, target]);

  // Same colour either way, so the settled price looks identical whether it
  // counted up or was painted straight in.
  if (!match || reduce) {
    return (
      <span
        className="font-mono text-[13px] tabular-nums"
        ref={ref}
        style={{ color: accent }}
      >
        {price}
      </span>
    );
  }

  return (
    <span
      className="font-mono text-[13px] tabular-nums"
      ref={ref}
      style={{ color: accent }}
    >
      {/* A motion value only renders as text inside a motion component. */}
      <motion.span>{rounded}</motion.span>
      {tail}
    </span>
  );
}

function ServiceCard({
  accentText,
  ctaLabel,
  includesLabel,
  inquireLabel,
  service,
}: {
  accentText: string;
  ctaLabel: string;
  includesLabel: string;
  inquireLabel: string;
  service: OfferService;
}) {
  const Icon = service.icon;

  // The link wraps the title only and stretches a pseudo-element over the whole
  // card. Wrapping the card in one <a> instead would fold the description, the
  // chips and the price into the link's accessible name, so a screen reader
  // would hear one long run-on string and lose the structure; this way the card
  // keeps a real heading and readable prose, while the click target is still the
  // entire card. No timer of its own: the grid is the stagger parent, so the
  // cards bud off the branch in order however many offers a category carries.
  return (
    <motion.li
      className="glass-card group relative flex h-full transform-gpu flex-col rounded-2xl p-5"
      variants={REVEAL}
    >
      <span
        aria-hidden
        className="mb-4 inline-flex h-11 w-11 flex-none transform-gpu items-center justify-center rounded-xl transition-transform duration-200 ease-out group-hover:scale-105"
        style={{
          background: rgba(accentText, 0.1),
          boxShadow: `0 0 0 1px ${rgba(accentText, 0.22)}`,
          color: accentText,
        }}
      >
        <Icon className="h-5 w-5" />
      </span>

      <h3 className="font-semibold text-[17px] leading-snug">
        <Link
          aria-label={inquireLabel.replace("{service}", service.title)}
          className="rounded-2xl after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary/70"
          state={service.inquiry}
          to="/contact"
        >
          {service.title}
        </Link>
      </h3>
      <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
        {service.description}
      </p>

      <p className="sr-only">{includesLabel}</p>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {service.features.map((feature) => (
          <li
            className="rounded-full border border-border/40 bg-muted/40 px-2.5 py-1 text-[11px] text-muted-foreground leading-none"
            key={feature}
          >
            {feature}
          </li>
        ))}
      </ul>

      {/* `mt-auto` pins the footer to the card's bottom, and grid stretch makes
          the cards in a row the same height, so the three prices in a row sit on
          one line without a hard-coded height anywhere. */}
      <div className="mt-auto flex items-center justify-between gap-3 border-border/30 border-t pt-4">
        <PriceCounter accent={accentText} price={service.price} />
        <span
          aria-hidden
          className="inline-flex items-center gap-1.5 font-medium text-[13px] text-foreground/70 transition-colors duration-200 ease-out group-hover:text-primary"
        >
          {ctaLabel}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
        </span>
      </div>
    </motion.li>
  );
}

function CategoryStage({
  category,
  ctaLabel,
  includesLabel,
  index,
  inquireLabel,
}: {
  category: OfferCategory;
  ctaLabel: string;
  includesLabel: string;
  index: number;
  inquireLabel: string;
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
      {/* Accent bloom, the category's colour breathing behind the content. */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="-z-10 pointer-events-none absolute inset-x-[-20%] inset-y-[-10%]"
          style={{
            background: `radial-gradient(60% 50% at 20% 50%, ${rgba(category.accent, 0.16)} 0%, transparent 70%)`,
            opacity: bloom,
          }}
        />
      )}

      {/* Oversized ghost numeral, parallaxing as a watermark behind the
          category name. It sits left rather than right because the entry price
          holds the right edge, and two things drifting into each other at the
          same corner reads as a collision rather than as depth. Hidden on narrow
          screens, where there is nowhere for it to sit that is not behind copy. */}
      {!reduce && (
        <motion.span
          aria-hidden
          className="-z-10 -left-4 -top-10 pointer-events-none absolute hidden select-none font-bold leading-none sm:block"
          style={{
            color: rgba(category.accent, 0.09),
            fontSize: "clamp(6rem, 12vw, 10rem)",
            y: ghostY,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>
      )}

      <motion.div {...revealOnScroll(reduce, stagger())}>
        <motion.div className="pb-5" variants={REVEAL}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <h2
              className="font-bold text-3xl tracking-tight sm:text-4xl"
              style={{ textShadow: `0 0 44px ${rgba(category.accent, 0.3)}` }}
            >
              {category.label}
            </h2>
            {/* The entry price as a tag beside the name rather than flung to
                the far edge: at this column width a right-aligned price sat a
                thousand pixels from the thing it was pricing. */}
            <p
              className="inline-flex flex-none items-center rounded-full border px-3 py-1.5 font-mono text-xs"
              style={{
                background: rgba(category.accentText, 0.07),
                borderColor: rgba(category.accentText, 0.3),
                color: category.accentText,
              }}
            >
              {category.fromLabel}
            </p>
          </div>
          <p className="mt-2 text-muted-foreground text-sm">{category.desc}</p>
        </motion.div>

        {/* Rule that wipes in under the header, in the category accent. Its own
            scaleX draw rather than a REVEAL, so it keeps its own trigger. */}
        <motion.div
          className="h-px origin-left"
          initial={{ scaleX: 0 }}
          style={{
            background: `linear-gradient(90deg, ${category.accentText} 0%, ${rgba(category.accentText, 0)} 100%)`,
          }}
          transition={{ duration: DUR.slow, ease: EASE_OUT }}
          viewport={VIEWPORT}
          whileInView={{ scaleX: 1 }}
        />
      </motion.div>

      <motion.ul
        className="mt-7 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3"
        {...revealOnScroll(reduce, stagger())}
      >
        {category.services.map((service) => (
          <ServiceCard
            accentText={category.accentText}
            ctaLabel={ctaLabel}
            includesLabel={includesLabel}
            inquireLabel={inquireLabel}
            key={service.key}
            service={service}
          />
        ))}
      </motion.ul>
    </div>
  );
}

export function ServiceOffers({
  categories,
  ctaLabel,
  includesLabel,
  inquireLabel,
}: {
  categories: OfferCategory[];
  /** The in-card action label, e.g. "Get in touch". */
  ctaLabel: string;
  /** Screen-reader label introducing a card's feature chips. */
  includesLabel: string;
  /** Accessible name for a card link; `{service}` is replaced with its title. */
  inquireLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

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
      {/* The branch continuing out of the 3D tree above. Decorative, desktop:
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
            style={{ opacity: 0.55, pathLength: draw }}
          />
        </svg>
      )}

      <div className="space-y-20 sm:space-y-28">
        {categories.map((category, i) => (
          <CategoryStage
            category={category}
            ctaLabel={ctaLabel}
            includesLabel={includesLabel}
            index={i}
            inquireLabel={inquireLabel}
            key={category.key}
          />
        ))}
      </div>
    </div>
  );
}
