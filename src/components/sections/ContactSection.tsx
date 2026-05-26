import { motion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin } from "lucide-react";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import ContactForm from "../forms/ContactForm";

export default function ContactSection() {
  const { language } = useLanguage();
  const t = translations[language].contact;
  return (
    <section className="section-padding relative overflow-hidden" id="contact">

      <div className="grid gap-16 md:grid-cols-12 md:gap-12 lg:gap-20">

        {/* Left — editorial info */}
        <motion.div
          className="flex flex-col md:col-span-5"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {/* Headline */}
          <h1 className="mb-6 font-bold leading-[0.92] tracking-tight" style={{ fontSize: "clamp(2.8rem, 5.5vw, 4.5rem)" }}>
            {t.headlineLine1}
            <br />
            <span className="hero-name-gradient">{t.headlineLine2}</span>
          </h1>

          <p className="mb-12 max-w-xs text-muted-foreground text-sm leading-relaxed">
            {t.intro}
          </p>

          {/* Contact details */}
          <div className="mb-10 space-y-5">
            <a
              className="group flex items-center gap-2 text-sm text-muted-foreground/70 transition-colors duration-200 hover:text-foreground"
              href="mailto:dominik.koenitzer@gmail.com"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/30 w-16">
                {t.emailLabel}
              </span>
              dominik.koenitzer@gmail.com
              <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <div className="flex items-center gap-2 text-sm text-muted-foreground/70">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/30 w-16">
                {t.basedLabel}
              </span>
              {t.basedLocation}
            </div>
          </div>

          {/* Divider */}
          <motion.div
            animate={{ scaleX: 1 }}
            className="mb-10 h-px w-full bg-border/20"
            initial={{ scaleX: 0 }}
            style={{ transformOrigin: "left" }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Socials */}
          <div className="flex flex-col gap-3">
            <a
              className="group inline-flex items-center gap-2.5 text-sm text-muted-foreground/50 transition-colors duration-200 hover:text-foreground"
              href="https://github.com/dominikkoenitzer"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Github className="h-4 w-4" />
              github.com/dominikkoenitzer
              <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              className="group inline-flex items-center gap-2.5 text-sm text-muted-foreground/50 transition-colors duration-200 hover:text-foreground"
              href="https://linkedin.com/in/dominik-koenitzer"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Linkedin className="h-4 w-4" />
              linkedin.com/in/dominik-koenitzer
              <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </motion.div>

        {/* Right — form */}
        <motion.div
          className="md:col-span-7"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <ContactForm />
        </motion.div>

      </div>
    </section>
  );
}
