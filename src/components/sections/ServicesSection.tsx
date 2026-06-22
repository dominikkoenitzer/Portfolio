import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Code,
  FileText,
  HardDrive,
  Laptop,
  Search,
  Server,
  Settings,
  Shield,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";

type CategoryGroup = "build" | "protect" | "grow";
type Category = "all" | CategoryGroup;
type ItemKey = keyof typeof translations.en.services.items;

interface Service {
  itemKey: ItemKey;
  price: string;
  icon: React.ReactNode;
  category: CategoryGroup;
}

const services: Service[] = [
  {
    itemKey: "webDev",
    price: "300 CHF",
    icon: <Code className="h-5 w-5" />,
    category: "build",
  },
  {
    itemKey: "customSoftware",
    price: "500 CHF",
    icon: <Settings className="h-5 w-5" />,
    category: "build",
  },
  {
    itemKey: "serverSetup",
    price: "350 CHF",
    icon: <Server className="h-5 w-5" />,
    category: "build",
  },
  {
    itemKey: "security",
    price: "60 CHF/hr",
    icon: <Shield className="h-5 w-5" />,
    category: "protect",
  },
  {
    itemKey: "maintenance",
    price: "50 CHF/mo",
    icon: <Wrench className="h-5 w-5" />,
    category: "protect",
  },
  {
    itemKey: "backup",
    price: "200 CHF + 50/mo",
    icon: <HardDrive className="h-5 w-5" />,
    category: "protect",
  },
  {
    itemKey: "seo",
    price: "150 CHF",
    icon: <Search className="h-5 w-5" />,
    category: "grow",
  },
  {
    itemKey: "cms",
    price: "40 CHF/hr",
    icon: <FileText className="h-5 w-5" />,
    category: "grow",
  },
  {
    itemKey: "support",
    price: "30 CHF/hr",
    icon: <Laptop className="h-5 w-5" />,
    category: "grow",
  },
];

const FILTER_IDS: Category[] = ["all", "build", "protect", "grow"];

export function ServicesSection() {
  const { language } = useLanguage();
  const t = translations[language].services;
  const [active, setActive] = useState<Category>("all");

  const filtered =
    active === "all" ? services : services.filter((s) => s.category === active);

  return (
    <section className="section-padding" id="services">
      {/* Header */}
      <SectionHeading eyebrow={t.eyebrow} title={t.heading} />

      {/* Category filter */}
      <motion.div
        className="mb-8 flex flex-wrap gap-2 md:mb-10"
        initial={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        {FILTER_IDS.map((id) => (
          <button
            className={cn(
              "relative rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
              active === id
                ? "bg-primary text-primary-foreground shadow-[0_2px_12px_hsl(var(--primary)/0.3)]"
                : "border border-border/30 text-muted-foreground hover:border-primary/25 hover:text-foreground",
            )}
            key={id}
            onClick={() => setActive(id)}
          >
            {t.filters[id]}
            {active === id && id !== "all" && (
              <span className="ml-1.5 font-mono text-[10px] opacity-70">
                — {t.categoryMeta[id].desc}
              </span>
            )}
          </button>
        ))}
      </motion.div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((service, i) => {
            const item = t.items[service.itemKey];
            const subject = `${t.inquiry.subjectPrefix} ${item.title}`;
            const message = [
              t.inquiry.greeting,
              "",
              t.inquiry.intro.replace("{service}", item.title),
              "",
              t.inquiry.discuss,
              ...item.features.map((f) => `  → ${f}`),
              "",
              t.inquiry.closing,
            ].join("\n");
            return (
              <motion.div
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="glass-card group flex flex-col rounded-2xl p-5 sm:p-6"
                exit={{ opacity: 0, scale: 0.94, y: 6 }}
                initial={{ opacity: 0, scale: 0.94, y: 6 }}
                key={service.itemKey}
                layout
                transition={{
                  duration: 0.35,
                  delay: i * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/15">
                    {service.icon}
                  </div>
                  <span className="rounded-lg border border-border/20 bg-muted/20 px-2.5 py-1 font-mono text-xs font-medium text-foreground/70">
                    {service.price}
                  </span>
                </div>

                <span className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/35">
                  {t.categoryMeta[service.category].label}
                </span>

                <h3 className="mb-2 font-semibold text-lg transition-colors duration-200 group-hover:text-primary">
                  {item.title}
                </h3>

                <p className="mb-4 flex-1 text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>

                <div className="mb-5 flex flex-wrap gap-1.5">
                  {item.features.map((f) => (
                    <Badge key={f}>{f}</Badge>
                  ))}
                </div>

                <Link
                  className="group/btn mt-auto flex items-center justify-between rounded-lg border border-border/20 px-4 py-2.5 text-sm text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:bg-primary/[0.04] hover:text-primary"
                  state={{ subject, message }}
                  to="/contact"
                >
                  {t.getInTouch}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <motion.div
        className="mt-16 flex flex-col items-center gap-4 border-t border-border/20 pt-14 text-center"
        initial={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <p className="eyebrow">{t.ctaEyebrow}</p>
        <h3 className="font-bold text-2xl md:text-3xl">{t.ctaTitle}</h3>
        <Button asChild className="group mt-2 rounded-lg px-6" variant="cta">
          <Link to="/contact">
            {t.ctaButton}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </motion.div>
    </section>
  );
}
