import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Infinity as InfinityIcon,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { revealOnScroll } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-context";
import { DUR, EASE_OUT, REVEAL, stagger, VIEWPORT } from "@/lib/motion";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";

type TierKey = keyof typeof translations.en.donate.tiers;
const tiers: { amount: string; tierKey: TierKey }[] = [
  { amount: "5", tierKey: "tier5" },
  { amount: "15", tierKey: "tier15" },
  { amount: "30", tierKey: "tier30" },
];

const PAYPAL = "https://www.paypal.com/paypalme/dominikkoenitzer";

/**
 * Every amount is the same control, so the four share one behaviour string and
 * differ only in what they say. The lift and the press ride the independent
 * `translate` and `scale` properties rather than transform utilities: these are
 * framer elements, and framer writes a finished entrance back as an inline
 * `transform: none` that would out-rank a class rule for good (the reason
 * `.btn-raise` in index.css works the same way). Both compose with that inline
 * value instead of losing to it, and with each other on press.
 */
const TILE =
  "group/tile relative flex flex-col gap-2 overflow-hidden rounded-xl border p-4 shadow-sm transition-[translate,scale,border-color,background-color,box-shadow] duration-200 ease-out hover:[translate:0_-2px] hover:shadow-md active:[scale:0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:p-5";

/** Fixed glyph row: the amounts and the infinity mark share one height, so all
    four captions sit on the same line however tall the mark is. */
const TILE_GLYPH = "flex h-10 items-center sm:h-11";

const TILE_ARROW =
  "absolute right-3 top-3 h-3.5 w-3.5 transition-[transform,color] duration-200 ease-out group-hover/tile:-translate-y-0.5 group-hover/tile:translate-x-0.5 group-hover/tile:text-primary";

export function DonateSection() {
  const { language } = useLanguage();
  const t = translations[language].donate;
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-padding" id="donate">
      {/* One sequence across both columns: eyebrow, headline and sentence on
          the left, then the label and every amount on the right. */}
      <motion.div
        className="grid gap-12 sm:gap-16 md:grid-cols-12 md:gap-12 lg:gap-20"
        {...revealOnScroll(reduceMotion, stagger())}
      >
        {/* Left — editorial intro */}
        <motion.div
          className="flex min-w-0 flex-col md:col-span-5"
          variants={stagger(0, 0.08)}
        >
          <motion.p className="eyebrow mb-3" variants={REVEAL}>
            {t.eyebrow}
          </motion.p>
          <motion.h1
            className="mb-6 break-words font-bold leading-[1.02] [hyphens:manual] [-webkit-hyphens:manual] [overflow-wrap:break-word]"
            style={{ fontSize: "clamp(2rem, 7vw, 3.75rem)" }}
            variants={REVEAL}
          >
            {t.headlineLine1}
            <br />
            <span className="hero-name-gradient inline-block pb-[0.15em]">
              {t.headlineLine2}
            </span>
          </motion.h1>

          <motion.p
            className="max-w-sm text-muted-foreground text-base leading-relaxed"
            variants={REVEAL}
          >
            {t.intro}
          </motion.p>
        </motion.div>

        {/* Right — amount picker */}
        <motion.div
          className="flex min-w-0 flex-col md:col-span-7"
          variants={stagger(0.15, 0.06)}
        >
          <motion.p
            className="mb-5 font-mono font-medium text-[11px] text-muted-foreground uppercase tracking-[0.2em]"
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
                  className={cn(
                    TILE,
                    "border-border/30 bg-background/40 hover:border-primary/40 hover:bg-primary/[0.04]",
                  )}
                  href={`${PAYPAL}/${tier.amount}`}
                  key={tier.amount}
                  rel="noopener noreferrer"
                  target="_blank"
                  variants={REVEAL}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/45">
                    {t.currency}
                  </span>
                  <span
                    className={cn(
                      TILE_GLYPH,
                      "font-bold text-3xl tracking-tight transition-colors duration-200 ease-out group-hover/tile:text-primary sm:text-4xl",
                    )}
                  >
                    {tier.amount}
                  </span>
                  <span className="mt-auto text-muted-foreground/75 text-xs leading-snug">
                    {data.label}
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className={cn(TILE_ARROW, "text-muted-foreground/35")}
                  />
                </motion.a>
              );
            })}

            <motion.a
              aria-label={`${t.anyAmount.title}: ${t.anyAmount.label}`}
              className={cn(
                TILE,
                "border-primary/30 bg-primary/[0.04] hover:border-primary/55 hover:bg-primary/[0.08]",
              )}
              href={PAYPAL}
              rel="noopener noreferrer"
              target="_blank"
              variants={REVEAL}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary/65">
                {t.anyAmount.title}
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
              <ArrowUpRight aria-hidden className={cn(TILE_ARROW, "text-primary/60")} />
            </motion.a>
          </div>

          {/* Divider. No `animate` prop alongside `whileInView`: it ran the wipe
              on mount, so the rule was already drawn once it scrolled into view. */}
          <motion.div
            className="my-10 h-px w-full bg-border/20"
            initial={{ scaleX: 0 }}
            style={{ transformOrigin: "left" }}
            transition={{ duration: DUR.slow, delay: 0.4, ease: EASE_OUT }}
            viewport={VIEWPORT}
            whileInView={{ scaleX: 1 }}
          />

          {/* Bigger collab nudge */}
          <motion.div
            className="mb-8 flex flex-wrap items-baseline gap-x-2 gap-y-1"
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

          {/* Tiny security note */}
          <motion.div
            className="flex items-center gap-2 text-muted-foreground/55 text-xs"
            variants={REVEAL}
          >
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <p>{t.paypalNote}</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
