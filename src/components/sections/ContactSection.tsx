import { motion } from "framer-motion";
import { ArrowUpRight, Github, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";

export function ContactSection() {
  const { language } = useLanguage();
  const t = translations[language].contact;
  return (
    <section className="section-padding relative overflow-hidden" id="contact">
      <motion.div
        className="glass-deep mx-auto flex max-w-xl flex-col items-center rounded-2xl px-8 py-16 text-center sm:py-20"
        initial={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <span className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
          <Wrench className="h-6 w-6" />
        </span>
        <p className="eyebrow mb-3">{t.wipEyebrow}</p>
        <h1 className="font-bold text-2xl tracking-tight sm:text-3xl">
          {t.wipTitle}
        </h1>
        <p className="mt-4 max-w-md text-balance text-muted-foreground leading-relaxed">
          {t.wipBody}
        </p>

        <Button
          asChild
          className="group mt-8 gap-2 rounded-lg px-6"
          variant="cta"
        >
          <a href="mailto:dominik.koenitzer@gmail.com">
            dominik.koenitzer@gmail.com
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </Button>

        <a
          className="group mt-5 inline-flex items-center gap-2 text-muted-foreground text-sm transition-colors duration-200 hover:text-foreground"
          href="https://github.com/dominikkoenitzer"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Github className="h-4 w-4" />
          github.com/dominikkoenitzer
          <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:opacity-70" />
        </a>
      </motion.div>
    </section>
  );
}
