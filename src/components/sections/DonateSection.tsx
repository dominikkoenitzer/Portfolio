import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { SectionHeading } from "../layout/SectionHeading";

export default function DonateSection() {
  return (
    <section className="section-padding" id="donate">
      <SectionHeading
        subtitle="If you find value in my work and would like to support me, consider making a donation."
        title="Support My Work"
      />

      <motion.div
        className="mx-auto max-w-2xl rounded-xl border border-border/50 bg-background p-8 text-center shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div className="relative mb-6 inline-block">
          <div className="-inset-1 absolute rounded-full bg-gradient-to-r from-primary/50 to-secondary/50 blur-md" />
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-border bg-background">
            <Heart className="h-8 w-8 animate-pulse text-primary" />
          </div>
        </div>

        <h3 className="mb-3 font-heading font-semibold text-2xl">
          Support My Journey
        </h3>

        <p className="mb-6 text-muted-foreground">
          Your donations help me continue creating valuable content, improving
          my skills, and developing new projects. Any amount is greatly
          appreciated!
        </p>

        <motion.div
          className="inline-block"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <a
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 font-medium text-base text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            href="https://www.paypal.com/paypalme/dominikkoenitzer"
            rel="noopener noreferrer"
            target="_blank"
          >
            Donate via PayPal
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
