import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DonateSection() {
  return (
    <section id="donate" className="section-padding">
      <SectionHeading 
        title="Support My Work" 
        subtitle="If you find value in my work and would like to support me, consider making a donation."
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center bg-background rounded-xl p-8 shadow-sm border border-border/50"
      >
        <div className="relative mb-6 inline-block">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-full blur-md"></div>
          <div className="relative flex items-center justify-center h-16 w-16 rounded-full bg-background border border-border mx-auto">
            <Heart className="h-8 w-8 text-primary animate-pulse" />
          </div>
        </div>
        
        <h3 className="text-2xl font-semibold mb-3">Support My Journey</h3>
        
        <p className="text-muted-foreground mb-6">
          Your donations help me continue creating valuable content, improving my skills, and developing new projects. Any amount is greatly appreciated!
        </p>
        
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-block"
        >
          <a
            href="https://www.paypal.com/paypalme/dominikkoenitzer"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-base font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Donate via PayPal
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
