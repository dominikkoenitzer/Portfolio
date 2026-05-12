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
import { cn } from "@/lib/utils";

type Category = "all" | "build" | "protect" | "grow";

interface Service {
  title: string;
  description: string;
  price: string;
  icon: React.ReactNode;
  features: string[];
  category: Exclude<Category, "all">;
}

const CATEGORY_META: Record<Exclude<Category, "all">, { label: string; desc: string }> = {
  build: { label: "Build", desc: "Design & development" },
  protect: { label: "Protect", desc: "Security & reliability" },
  grow: { label: "Grow", desc: "Visibility & performance" },
};

const services: Service[] = [
  {
    title: "Web Development",
    description: "End-to-end website creation — responsive, fast, and built to convert.",
    price: "300 CHF",
    icon: <Code className="h-5 w-5" />,
    features: ["Responsive design", "SEO-friendly", "Fast loading", "Cross-browser"],
    category: "build",
  },
  {
    title: "Custom Software",
    description: "Tailored software designed around your exact business requirements.",
    price: "500 CHF",
    icon: <Settings className="h-5 w-5" />,
    features: ["Requirements analysis", "Custom architecture", "Full testing", "Handover"],
    category: "build",
  },
  {
    title: "Server Setup",
    description: "Production-grade server configuration with security and monitoring baked in.",
    price: "350 CHF",
    icon: <Server className="h-5 w-5" />,
    features: ["Installation", "Security hardening", "Performance tuning", "Monitoring"],
    category: "build",
  },
  {
    title: "Security Consultation",
    description: "Find vulnerabilities before attackers do. Audits with actionable fixes.",
    price: "60 CHF/hr",
    icon: <Shield className="h-5 w-5" />,
    features: ["Security audit", "Vulnerability scan", "Risk mitigation", "Compliance"],
    category: "protect",
  },
  {
    title: "Website Maintenance",
    description: "Keep your site secure, patched, and running smoothly every month.",
    price: "50 CHF/mo",
    icon: <Wrench className="h-5 w-5" />,
    features: ["Security updates", "Bug fixes", "Uptime monitoring", "Content updates"],
    category: "protect",
  },
  {
    title: "Backup & Recovery",
    description: "Automated backups and tested recovery — because data loss isn't an option.",
    price: "200 CHF + 50/mo",
    icon: <HardDrive className="h-5 w-5" />,
    features: ["Automated backups", "Cloud storage", "Recovery protocols", "Real-time alerts"],
    category: "protect",
  },
  {
    title: "SEO Optimization",
    description: "Improve organic rankings with technical SEO, keywords, and performance.",
    price: "150 CHF",
    icon: <Search className="h-5 w-5" />,
    features: ["Keyword research", "On-page SEO", "Technical audit", "Reporting"],
    category: "grow",
  },
  {
    title: "Content Management",
    description: "Ongoing content updates and CMS care so your site stays fresh.",
    price: "40 CHF/hr",
    icon: <FileText className="h-5 w-5" />,
    features: ["CMS maintenance", "Image optimization", "Layout updates", "SEO content"],
    category: "grow",
  },
  {
    title: "Technical Support",
    description: "Fast, reliable help when something breaks or needs to be optimised.",
    price: "30 CHF/hr",
    icon: <Laptop className="h-5 w-5" />,
    features: ["Fast response", "Bug fixes", "Code optimisation", "Integration help"],
    category: "grow",
  },
];

const FILTERS: { id: Category; label: string }[] = [
  { id: "all", label: "All services" },
  { id: "build", label: "Build" },
  { id: "protect", label: "Protect" },
  { id: "grow", label: "Grow" },
];

export default function ServicesSection() {
  const [active, setActive] = useState<Category>("all");

  const filtered = active === "all" ? services : services.filter((s) => s.category === active);

  return (
    <section className="section-padding" id="services">

      {/* Header */}
      <motion.div
        className="mb-10 md:mb-12"
        initial={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/35">
          What I offer
        </p>
        <div className="flex items-end justify-between">
          <h2 className="font-bold text-4xl tracking-tight md:text-5xl">Services</h2>
          <span aria-hidden="true" className="font-mono text-5xl font-bold text-muted-foreground/10 md:text-7xl">
            {String(services.length).padStart(2, "0")}
          </span>
        </div>
      </motion.div>

      {/* Category filter */}
      <motion.div
        className="mb-8 flex flex-wrap gap-2 md:mb-10"
        initial={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        {FILTERS.map((f) => (
          <button
            className={cn(
              "relative rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
              active === f.id
                ? "bg-primary text-primary-foreground shadow-[0_2px_12px_hsl(var(--primary)/0.3)]"
                : "border border-border/30 text-muted-foreground hover:border-primary/25 hover:text-foreground"
            )}
            key={f.id}
            onClick={() => setActive(f.id)}
          >
            {f.label}
            {active === f.id && f.id !== "all" && (
              <span className="ml-1.5 font-mono text-[10px] opacity-70">
                — {CATEGORY_META[f.id as Exclude<Category, "all">].desc}
              </span>
            )}
          </button>
        ))}
      </motion.div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((service, i) => (
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="glass-card group flex flex-col rounded-2xl p-5 sm:p-6"
              exit={{ opacity: 0, scale: 0.94, y: 6 }}
              initial={{ opacity: 0, scale: 0.94, y: 6 }}
              key={service.title}
              layout
              transition={{
                duration: 0.35,
                delay: i * 0.04,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Top row: icon + price */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/15">
                  {service.icon}
                </div>
                <span className="rounded-lg border border-border/20 bg-muted/20 px-2.5 py-1 font-mono text-xs font-medium text-foreground/70">
                  {service.price}
                </span>
              </div>

              {/* Category label */}
              <span className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/35">
                {CATEGORY_META[service.category].label}
              </span>

              {/* Title */}
              <h3 className="mb-2 font-semibold text-lg tracking-tight transition-colors duration-200 group-hover:text-primary">
                {service.title}
              </h3>

              {/* Description */}
              <p className="mb-4 flex-1 text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>

              {/* Feature pills */}
              <div className="mb-5 flex flex-wrap gap-1.5">
                {service.features.map((f) => (
                  <span
                    className="rounded-full border border-border/20 bg-muted/15 px-2.5 py-0.5 text-[11px] text-muted-foreground/60"
                    key={f}
                  >
                    {f}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <a
                className="group/btn mt-auto flex items-center justify-between rounded-lg border border-border/20 px-4 py-2.5 text-sm text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:bg-primary/[0.04] hover:text-primary"
                href="/contact"
              >
                Get in touch
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
              </a>
            </motion.div>
          ))}
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
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/35">
          Have a project in mind?
        </p>
        <h3 className="font-bold text-2xl tracking-tight md:text-3xl">
          Let's build something together
        </h3>
        <a
          className="group mt-2 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-[0_2px_16px_hsl(var(--primary)/0.25)] transition-shadow duration-200 hover:shadow-[0_4px_24px_hsl(var(--primary)/0.38)]"
          href="/contact"
        >
          Get in Touch
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </a>
      </motion.div>

    </section>
  );
}
