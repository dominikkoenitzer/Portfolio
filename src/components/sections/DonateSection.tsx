import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Infinity as InfinityIcon,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";

type TierKey = keyof typeof translations.en.donate.tiers;
const tiers: { amount: string; tierKey: TierKey }[] = [
  { amount: "5", tierKey: "tier5" },
  { amount: "15", tierKey: "tier15" },
  { amount: "30", tierKey: "tier30" },
];

const PAYPAL = "https://www.paypal.com/paypalme/dominikkoenitzer";

export function DonateSection() {
  const { language } = useLanguage();
  const t = translations[language].donate;

  return (
    <section className="section-padding" id="donate">
      <div className="grid gap-12 sm:gap-16 md:grid-cols-12 md:gap-12 lg:gap-20">
        {/* Left — editorial intro */}
        <motion.div
          className="flex min-w-0 flex-col md:col-span-5"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <p className="eyebrow mb-3">
            {t.eyebrow}
          </p>
          <h1
            className="mb-6 break-words font-bold leading-[1.02] [hyphens:manual] [-webkit-hyphens:manual] [overflow-wrap:break-word]"
            style={{ fontSize: "clamp(2rem, 7vw, 3.75rem)" }}
          >
            {t.headlineLine1}
            <br />
            <span className="hero-name-gradient inline-block pb-[0.15em]">
              {t.headlineLine2}
            </span>
          </h1>

          <p className="max-w-sm text-muted-foreground text-base leading-relaxed">
            {t.intro}
          </p>
        </motion.div>

        {/* Right — amount picker */}
        <motion.div
          className="flex min-w-0 flex-col md:col-span-7"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <p className="mb-5 font-mono font-medium text-[11px] text-muted-foreground uppercase tracking-[0.2em]">
            {t.pickAmount}
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {tiers.map((tier, i) => {
              const data = t.tiers[tier.tierKey];
              return (
                <motion.a
                  className="group/tile relative flex flex-col gap-2 overflow-hidden rounded-xl border border-border/30 bg-background/40 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/[0.04] sm:p-5"
                  href={`${PAYPAL}/${tier.amount}`}
                  initial={{ opacity: 0, y: 12 }}
                  key={tier.amount}
                  rel="noopener noreferrer"
                  target="_blank"
                  transition={{
                    duration: 0.45,
                    delay: 0.05 + i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  viewport={{ once: true }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/45">
                    {t.currency}
                  </span>
                  <span className="font-bold text-3xl tracking-tight transition-colors duration-200 group-hover/tile:text-primary sm:text-4xl">
                    {tier.amount}
                  </span>
                  <span className="text-muted-foreground/75 text-xs leading-snug">
                    {data.label}
                  </span>
                  <ArrowUpRight className="absolute right-3 top-3 h-3.5 w-3.5 text-muted-foreground/35 transition-all duration-200 group-hover/tile:-translate-y-0.5 group-hover/tile:translate-x-0.5 group-hover/tile:text-primary" />
                </motion.a>
              );
            })}

            <motion.a
              className="group/tile relative flex flex-col gap-2 overflow-hidden rounded-xl border border-primary/30 bg-primary/[0.04] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/55 hover:bg-primary/[0.08] sm:p-5"
              href={PAYPAL}
              initial={{ opacity: 0, y: 12 }}
              rel="noopener noreferrer"
              target="_blank"
              transition={{
                duration: 0.45,
                delay: 0.05 + tiers.length * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary/65">
                {t.anyAmount.title}
              </span>
              <InfinityIcon
                className="h-7 w-7 text-primary sm:h-8 sm:w-8"
                strokeWidth={1.75}
              />
              <span className="text-foreground/80 text-xs leading-snug">
                {t.anyAmount.label}
              </span>
              <ArrowUpRight className="absolute right-3 top-3 h-3.5 w-3.5 text-primary/60 transition-all duration-200 group-hover/tile:-translate-y-0.5 group-hover/tile:translate-x-0.5 group-hover/tile:text-primary" />
            </motion.a>
          </div>

          {/* Divider */}
          <motion.div
            animate={{ scaleX: 1 }}
            className="my-10 h-px w-full bg-border/20"
            initial={{ scaleX: 0 }}
            style={{ transformOrigin: "left" }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            whileInView={{ scaleX: 1 }}
          />

          {/* Bigger collab nudge */}
          <div className="mb-8 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-foreground/85 text-sm">
              {t.sponsorBiggerLead}
            </span>
            <Link
              className="group/cta inline-flex items-center gap-1 text-primary text-sm transition-colors duration-200 hover:text-primary/80"
              to="/contact"
            >
              {t.sponsorBiggerCta}
              <ArrowUpRight className="h-3 w-3 transition-all duration-200 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
            </Link>
          </div>

          {/* Tiny security note */}
          <div className="flex items-center gap-2 text-muted-foreground/55 text-xs">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <p>{t.paypalNote}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
