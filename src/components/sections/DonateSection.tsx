import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Infinity as InfinityIcon,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { revealOnScroll } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-context";
import { REVEAL, stagger } from "@/lib/motion";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { SectionHeading } from "../layout/SectionHeading";

type TierKey = keyof typeof translations.en.donate.tiers;
const tiers: { amount: string; tierKey: TierKey }[] = [
  { amount: "5", tierKey: "tier5" },
  { amount: "15", tierKey: "tier15" },
  { amount: "30", tierKey: "tier30" },
];

const PAYPAL = "https://www.paypal.com/paypalme/dominikkoenitzer";

/** Every amount is the same control, so the four share one class string. */
const TILE =
  "group/tile flex flex-col gap-2 rounded-2xl border bg-card p-4 transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:p-5";

/** Fixed glyph row: the amounts and the infinity mark share one height, so all
    four captions sit on the same line however tall the mark is. */
const TILE_GLYPH = "flex h-10 items-center sm:h-11";

/** The arrow is a flex sibling of the micro-label, not an absolute overlay: it
    used to sit on top of it, 6px into the word at 1440px and 10px at 390px. */
const TILE_TOP = "flex items-center justify-between gap-2";
const TILE_ARROW =
  "h-3.5 w-3.5 flex-none transition-[transform,color] duration-200 ease-out group-hover/tile:-translate-y-0.5 group-hover/tile:translate-x-0.5 group-hover/tile:text-primary";

export function DonateSection() {
  const { language } = useLanguage();
  const t = translations[language].donate;
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-padding" id="donate">
      {/* One sequence across both columns: eyebrow, headline and sentence on
          the left, then the label and every amount on the right.
          Two rows at md+, not two cells: the amount column spans both, so the
          collab nudge can sit in row two under the intro and bottom-align with
          it. That is what closes the ~130px the two columns used to finish out
          of step by, and it keeps the mobile order (intro, amounts, nudge)
          intact because the nudge is still last in the DOM. The row gap is set
          separately from the column gap because at md+ it only ever separates
          the intro from the nudge. */}
      <motion.div
        className="grid gap-12 sm:gap-16 md:grid-cols-12 md:gap-x-12 md:gap-y-6 lg:gap-x-20"
        {...revealOnScroll(reduceMotion, stagger())}
      >
        {/* Left: editorial intro */}
        <motion.div
          className="flex min-w-0 flex-col md:col-span-5 md:col-start-1 md:row-start-1"
          variants={stagger(0, 0.08)}
        >
          {/* The shared page title, left-aligned for the two-column layout,
              so the type matches every other page's. */}
          <SectionHeading
            align="left"
            className="mb-6"
            eyebrow={t.eyebrow}
            title={`${t.headlineLine1} ${t.headlineLine2}`}
          />

          <motion.p
            className="max-w-sm text-muted-foreground text-base leading-relaxed"
            variants={REVEAL}
          >
            {t.intro}
          </motion.p>
        </motion.div>

        {/* Right: amount picker */}
        <motion.div
          className="flex min-w-0 flex-col md:col-span-7 md:col-start-6 md:row-span-2 md:row-start-1"
          variants={stagger(0.15, 0.06)}
        >
          <motion.p
            className="mb-5 font-medium text-[11px] text-muted-foreground uppercase tracking-[0.2em]"
            variants={REVEAL}
          >
            {t.pickAmount}
          </motion.p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {tiers.map((tier) => {
              const data = t.tiers[tier.tierKey];
              return (
                <motion.a
                  aria-label={`${t.currency} ${tier.amount}: ${data.label}`}
                  className={cn(TILE, "border-border/60 hover:border-primary/30")}
                  href={`${PAYPAL}/${tier.amount}`}
                  key={tier.amount}
                  rel="noopener noreferrer"
                  target="_blank"
                  variants={REVEAL}
                >
                  <span className={TILE_TOP}>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
                      {t.currency}
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      className={cn(TILE_ARROW, "text-muted-foreground/60")}
                    />
                  </span>
                  <span
                    className={cn(
                      TILE_GLYPH,
                      "font-bold text-3xl tracking-tight transition-colors duration-200 ease-out group-hover/tile:text-primary sm:text-4xl",
                    )}
                  >
                    {tier.amount}
                  </span>
                  <span className="mt-auto text-muted-foreground text-xs leading-snug">
                    {data.label}
                  </span>
                </motion.a>
              );
            })}

            {/* The open amount is the odd one out, and says so with its border
                and its violet label rather than with a fill. */}
            <motion.a
              aria-label={`${t.anyAmount.title}: ${t.anyAmount.label}`}
              className={cn(TILE, "border-border/60 hover:border-primary/30")}
              href={PAYPAL}
              rel="noopener noreferrer"
              target="_blank"
              variants={REVEAL}
            >
              <span className={TILE_TOP}>
                <span className="text-[10px] text-primary/85 uppercase tracking-[0.18em]">
                  {t.anyAmount.title}
                </span>
                <ArrowUpRight
                  aria-hidden
                  className={cn(TILE_ARROW, "text-primary/60")}
                />
              </span>
              <span className={TILE_GLYPH}>
                <InfinityIcon
                  aria-hidden
                  className="h-8 w-8 text-primary sm:h-9 sm:w-9"
                  strokeWidth={1.75}
                />
              </span>
              <span className="mt-auto text-foreground/80 text-xs leading-snug">
                {t.anyAmount.label}
              </span>
            </motion.a>
          </div>

          {/* Divider: a rule, drawn where it sits. */}
          <motion.div
            className="my-10 h-px w-full bg-border/60"
            variants={REVEAL}
          />

          {/* Tiny security note. It stays with the amounts, directly under the
              rule, because that is what it is about. `md:mt-auto` is the other
              half of the balance: in the languages where the intro column is
              the taller one, the note drops to this column's floor rather than
              letting the two finish out of step again. */}
          <motion.div
            className="flex items-center gap-2 text-muted-foreground text-xs md:mt-auto"
            variants={REVEAL}
          >
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <p>{t.paypalNote}</p>
          </motion.div>
        </motion.div>

        {/* Bigger collab nudge: row two of the left column, parked on the same
            floor as the amount column via `md:self-end`. Last in the DOM, so on
            a phone it is still the closing line of the page. */}
        <motion.div
          className="flex flex-wrap items-baseline gap-x-2 gap-y-1 md:col-span-5 md:col-start-1 md:row-start-2 md:self-end"
          variants={REVEAL}
        >
          <span className="text-foreground/85 text-sm">
            {t.sponsorBiggerLead}
          </span>
          <Link
            className="group/cta -my-3 inline-flex items-center gap-1 rounded-sm py-3 text-primary text-sm transition-colors duration-200 ease-out hover:text-primary/80"
            to="/contact"
          >
            {t.sponsorBiggerCta}
            <ArrowUpRight className="h-3 w-3 transition-[transform,color] duration-200 ease-out group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
