import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { revealOnScroll } from "@/lib/framer-animations";
import { REVEAL, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The offer stack: three categories, three cards each.
 *
 * The cards sit on a grid rather than in a list so a row's cards share a height
 * and their prices land on one line: a price you can compare across three
 * offers without moving your eye is most of what makes a rate card readable.
 * Each card is one link, so there is one focus stop and one 44px-plus target
 * per offer.
 */

export type OfferCategoryKey = "build" | "protect" | "grow";

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
  key: OfferCategoryKey;
  label: string;
  desc: string;
  fromLabel: string;
  services: OfferService[];
};

/**
 * The one place a category shows its colour: the 44px icon tile. Bloom tokens
 * only, and sage stays rare because a tile this size is the largest fill it
 * takes anywhere on the page.
 */
const ACCENT: Record<OfferCategoryKey, string> = {
  build: "bg-primary/10 text-primary",
  protect: "bg-sage/15 text-sage-deep",
  grow: "bg-blush/20 text-blush-deep",
};

function ServiceCard({
  accent,
  ctaLabel,
  includesLabel,
  inquireLabel,
  service,
}: {
  accent: string;
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
  // entire card. No timer of its own: the grid is the stagger parent.
  return (
    <motion.li
      className="group relative flex h-full flex-col rounded-2xl border border-border/60 bg-card p-5 transition-colors duration-200 ease-out hover:border-primary/30"
      variants={REVEAL}
    >
      <span
        aria-hidden
        className={cn(
          "mb-4 inline-flex h-11 w-11 flex-none items-center justify-center rounded-xl",
          accent,
        )}
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
      <ul className="mt-4 mb-5 flex flex-wrap gap-1.5">
        {service.features.map((feature) => (
          <li
            className="rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground leading-none"
            key={feature}
          >
            {feature}
          </li>
        ))}
      </ul>

      {/* `mt-auto` pins the footer to the card's bottom, and grid stretch makes
          the cards in a row the same height, so the three prices in a row sit on
          one line without a hard-coded height anywhere. */}
      <div className="mt-auto flex items-center justify-between gap-3 border-border/50 border-t pt-4">
        <span className="font-medium text-[13px] tabular-nums">
          {service.price}
        </span>
        <span
          aria-hidden
          className="inline-flex items-center gap-1.5 font-medium text-[13px] text-muted-foreground transition-colors duration-200 ease-out group-hover:text-primary"
        >
          {ctaLabel}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
        </span>
      </div>
    </motion.li>
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
  const reduce = useReducedMotion();

  return (
    <div className="space-y-16 sm:space-y-20">
      {categories.map((category) => (
        <div key={category.key}>
          <motion.div
            className="border-border/60 border-b pb-4"
            {...revealOnScroll(reduce)}
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {/* Section-heading scale, not page-title scale: three 36px
                  headings under a 36px title read as four pages. */}
              <h2 className="font-bold text-xl sm:text-2xl">{category.label}</h2>
              {/* The entry price sits beside the name rather than at the far
                  edge: at this column width a right-aligned price lands a
                  thousand pixels from the thing it is pricing. */}
              <p className="inline-flex flex-none items-center rounded-full border border-border/60 px-3 py-1 text-[11.5px] text-muted-foreground">
                {category.fromLabel}
              </p>
            </div>
            <p className="mt-2 text-muted-foreground text-sm">
              {category.desc}
            </p>
          </motion.div>

          <motion.ul
            className="mt-6 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3"
            {...revealOnScroll(reduce, stagger())}
          >
            {category.services.map((service) => (
              <ServiceCard
                accent={ACCENT[category.key]}
                ctaLabel={ctaLabel}
                includesLabel={includesLabel}
                inquireLabel={inquireLabel}
                key={service.key}
                service={service}
              />
            ))}
          </motion.ul>
        </div>
      ))}
    </div>
  );
}
