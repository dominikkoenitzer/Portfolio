import { motion } from "framer-motion";
import { Heart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "../layout/SectionHeading";

const donationTiers = [
  {
    amount: "5",
    label: "Keep The Dream Alive",
    description: "Helps with hosting, tools, and keeping the work online.",
  },
  {
    amount: "15",
    label: "Fuel The Mission",
    description:
      "Gives me space to improve quality and ship thoughtful updates faster.",
  },
  {
    amount: "30",
    label: "Change The Trajectory",
    description:
      "Directly supports new builds and deep polish on the next projects.",
  },
];

export default function DonateSection() {
  return (
    <section className="section-padding" id="donate">
      <SectionHeading
        subtitle="If my work helped you, your support helps me keep creating with care and consistency."
        title="Support My Work"
      />

      <motion.div
        className="mx-auto max-w-5xl space-y-5"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div className="glass-card rounded-2xl border border-border/50 bg-background/80 p-6 sm:p-8">
          <h3 className="mb-3 font-heading font-semibold text-2xl sm:text-3xl">
            Thank you for considering support
          </h3>

          <p className="max-w-3xl text-muted-foreground leading-relaxed">
            This portfolio is personal work, built with care and consistency. Your
            support helps me keep building, keep learning, and keep sharing projects
            that are actually useful. No pressure, just genuine appreciation.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild className="h-11 px-6">
              <a
                href="https://www.paypal.com/paypalme/dominikkoenitzer"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Heart className="h-4 w-4" />
                Support With Any Amount
              </a>
            </Button>

            <a
              className="inline-flex h-11 items-center justify-center rounded-md border border-border/60 bg-background px-5 font-medium text-sm transition-colors hover:border-primary/30 hover:bg-background/80"
              href="/contact"
            >
              Sponsor A Bigger Build
            </a>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {donationTiers.map((tier, index) => (
            <motion.div
              className="rounded-xl border border-border/50 bg-card/60 p-5"
              initial={{ opacity: 0, y: 16 }}
              key={tier.amount}
              transition={{ duration: 0.4, delay: 0.08 + index * 0.08 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <h4 className="font-heading font-semibold text-lg">{tier.label}</h4>
                <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 font-semibold text-primary text-sm">
                  CHF {tier.amount}
                </span>
              </div>

              <p className="mb-4 text-muted-foreground text-sm leading-relaxed">
                {tier.description}
              </p>

              <a
                className="inline-flex h-9 w-full items-center justify-center rounded-md border border-border/60 bg-background px-3 font-medium text-sm transition-colors hover:border-primary/30 hover:text-primary"
                href={`https://www.paypal.com/paypalme/dominikkoenitzer/${tier.amount}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                Choose This Tier
              </a>
            </motion.div>
          ))}
        </div>

        <div className="rounded-xl border border-border/50 bg-card/40 p-4 text-muted-foreground text-sm">
          <div className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p>
              Donations are securely processed via PayPal. Thank you again for supporting
              my independent work. It means more than you think.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
