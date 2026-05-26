import { motion } from "framer-motion";
import { Heart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { SectionHeading } from "../layout/SectionHeading";

type TierKey = keyof typeof translations.en.donate.tiers;
const donationTiers: { amount: string; tierKey: TierKey }[] = [
  { amount: "5", tierKey: "tier5" },
  { amount: "15", tierKey: "tier15" },
  { amount: "30", tierKey: "tier30" },
];

export default function DonateSection() {
  const { language } = useLanguage();
  const t = translations[language].donate;

  return (
    <section className="section-padding" id="donate">
      <SectionHeading subtitle={t.subheading} title={t.heading} />

      <motion.div
        className="mx-auto max-w-5xl space-y-5"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div className="glass-card rounded-2xl border border-border/50 bg-background/80 p-6 sm:p-8">
          <h3 className="mb-3 font-heading font-semibold text-2xl sm:text-3xl">
            {t.cardTitle}
          </h3>

          <p className="max-w-3xl text-muted-foreground leading-relaxed">
            {t.cardBody}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild className="h-11 px-6">
              <a
                href="https://www.paypal.com/paypalme/dominikkoenitzer"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Heart className="h-4 w-4" />
                {t.supportAny}
              </a>
            </Button>

            <a
              className="inline-flex h-11 items-center justify-center rounded-md border border-border/60 bg-background px-5 font-medium text-sm transition-colors hover:border-primary/30 hover:bg-background/80"
              href="/contact"
            >
              {t.sponsorBigger}
            </a>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {donationTiers.map((tier, index) => {
            const tierData = t.tiers[tier.tierKey];
            return (
              <motion.div
                className="rounded-xl border border-border/50 bg-card/60 p-5"
                initial={{ opacity: 0, y: 16 }}
                key={tier.amount}
                transition={{ duration: 0.4, delay: 0.08 + index * 0.08 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h4 className="font-heading font-semibold text-lg">{tierData.label}</h4>
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 font-semibold text-primary text-sm">
                    CHF {tier.amount}
                  </span>
                </div>

                <p className="mb-4 text-muted-foreground text-sm leading-relaxed">
                  {tierData.description}
                </p>

                <a
                  className="inline-flex h-9 w-full items-center justify-center rounded-md border border-border/60 bg-background px-3 font-medium text-sm transition-colors hover:border-primary/30 hover:text-primary"
                  href={`https://www.paypal.com/paypalme/dominikkoenitzer/${tier.amount}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {t.chooseTier}
                </a>
              </motion.div>
            );
          })}
        </div>

        <div className="rounded-xl border border-border/50 bg-card/40 p-4 text-muted-foreground text-sm">
          <div className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p>{t.paypalNote}</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
