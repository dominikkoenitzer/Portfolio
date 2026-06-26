import { motion } from "framer-motion";
import { ArrowUpRight, Github, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";

export function ContactSection() {
  const { language } = useLanguage();
  const t = translations[language].contact;
  return (
    <section className="section-padding relative overflow-hidden" id="contact">
      <div className="grid gap-12 sm:gap-16 md:grid-cols-12 md:gap-12 lg:gap-20">
        {/* Left — editorial info */}
        <motion.div
          className="flex min-w-0 flex-col md:col-span-5"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {/* Headline — uses hyphens: manual so it only breaks where the
              translation file places a soft hyphen (U+00AD), e.g.
              "zusammen-arbeiten" instead of the dictionary "zusammenar-beiten".
              pb on the gradient span ensures descenders ("g") aren't clipped. */}
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

          <p className="mb-12 max-w-sm text-muted-foreground text-base leading-relaxed">
            {t.intro}
          </p>

          {/* Contact details */}
          <div className="mb-10 space-y-5">
            <a
              className="group flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-foreground/80 transition-colors duration-200 hover:text-foreground"
              href="mailto:dominik.koenitzer@gmail.com"
            >
              <span className="w-16 shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">
                {t.emailLabel}
              </span>
              <span className="break-all">dominik.koenitzer@gmail.com</span>
              <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-70" />
            </a>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-foreground/80">
              <span className="w-16 shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">
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
              className="group inline-flex items-center gap-2.5 text-foreground/75 text-sm transition-colors duration-200 hover:text-foreground"
              href="https://github.com/dominikkoenitzer"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Github className="h-4 w-4 shrink-0" />
              <span className="break-all">github.com/dominikkoenitzer</span>
              <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-70" />
            </a>
          </div>
        </motion.div>

        {/* Right — direct email CTA */}
        <motion.div
          className="min-w-0 md:col-span-7"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="flex h-full min-h-[260px] flex-col items-center justify-center rounded-2xl border border-border/40 bg-card/30 p-8 text-center sm:p-12">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Mail className="h-7 w-7" />
            </div>
            <p className="mb-3 font-mono text-[10px] text-muted-foreground/60 uppercase tracking-[0.18em]">
              {t.emailLabel}
            </p>
            <Button asChild className="group gap-2 rounded-lg px-6" variant="cta">
              <a href="mailto:dominik.koenitzer@gmail.com">
                dominik.koenitzer@gmail.com
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
