import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Code,
  FileText,
  HardDrive,
  Laptop,
  type LucideIcon,
  Search,
  Server,
  Settings,
  Shield,
  Wrench,
  X,
} from "lucide-react";
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { ServiceTreeNode } from "@/components/effects/service-tree/types";
import {
  CATEGORY_ACCENT_HEX,
  CATEGORY_ACCENT_TEXT,
  isDarkTheme,
  serviceTreeThemeFor,
} from "@/components/effects/service-tree/theme";
import { ServiceOffers } from "@/components/effects/service-offers";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { getServicesFaqs, getServicesHowTo } from "@/config/seo-data";
import { useTheme } from "@/components/theme-context";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";

// The Services page IS a 3D skill-tree sapling on desktop — lazy (three.js),
// desktop + motion only.
const ServiceExplorer = lazy(
  () => import("@/components/effects/ServiceExplorer"),
);

type CategoryGroup = "build" | "protect" | "grow";
type Category = "all" | CategoryGroup;
type ItemKey = keyof typeof translations.en.services.items;
type ServiceCopy = {
  title: string;
  description: string;
  features: readonly string[];
};
/**
 * Handed to /contact as router state. `label` is the service title on its own,
 * so the contact page can drop it straight into its draft sentence ("I'm here
 * about Web Development") without having to parse it back out of `subject`.
 */
type Inquiry = { label: string; subject: string; message: string };

interface Service {
  itemKey: ItemKey;
  price: string;
  icon: LucideIcon;
  category: CategoryGroup;
}

const EASE = [0.22, 1, 0.36, 1] as const;

// Order within a category maps onto the tree's three leaf slots (see
// ServiceExplorer's LEAVES layout), so keep build/protect/grow grouped.
const services: Service[] = [
  { itemKey: "webDev", price: "300 CHF", icon: Code, category: "build" },
  {
    itemKey: "customSoftware",
    price: "500 CHF",
    icon: Settings,
    category: "build",
  },
  { itemKey: "serverSetup", price: "350 CHF", icon: Server, category: "build" },
  { itemKey: "security", price: "60 CHF/hr", icon: Shield, category: "protect" },
  {
    itemKey: "maintenance",
    price: "50 CHF/mo",
    icon: Wrench,
    category: "protect",
  },
  {
    itemKey: "backup",
    price: "200 CHF + 50/mo",
    icon: HardDrive,
    category: "protect",
  },
  { itemKey: "seo", price: "150 CHF", icon: Search, category: "grow" },
  { itemKey: "cms", price: "40 CHF/hr", icon: FileText, category: "grow" },
  { itemKey: "support", price: "30 CHF/hr", icon: Laptop, category: "grow" },
];

const FILTER_IDS: Category[] = ["all", "build", "protect", "grow"];

// The page's structure, and the tree's branch order.
const CATEGORY_ORDER: CategoryGroup[] = ["build", "protect", "grow"];

/**
 * The "from" price for a category: the lowest headline number, carrying its own
 * unit. Taking a numeric minimum across the raw strings would be wrong — they
 * mix models ("300 CHF", "60 CHF/hr", "50 CHF/mo", "200 CHF + 50/mo") — so we
 * pick the cheapest entry figure and show that service's price verbatim. Derived
 * rather than hard-coded so it can't drift when a price changes.
 */
const entryPrice = (items: Service[]) =>
  items.reduce((cheapest, s) =>
    Number(s.price.match(/\d+/)?.[0] ?? Number.POSITIVE_INFINITY) <
    Number(cheapest.price.match(/\d+/)?.[0] ?? Number.POSITIVE_INFINITY)
      ? s
      : cheapest,
  ).price;

// The immersive 3D tree is desktop + motion only; everything else is cards.
const DESKTOP_QUERY = "(min-width: 1024px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** Hex colour with an appended 8-bit alpha (#RRGGBB + AA). */
const withAlpha = (hex: string, alpha: number) =>
  hex +
  Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");

/**
 * The detail card that flies up bottom-left when a leaf is clicked. Surfaces use
 * theme tokens so the card reads on either page brightness; `accent` stays the
 * saturated hue for the glowing bar, while `accentText` carries anything with
 * words in it.
 */
function DetailCard({
  service,
  item,
  accent,
  accentText,
  categoryLabel,
  inquiry,
  closeLabel,
  getInTouchLabel,
  onClose,
}: {
  service: Service;
  item: ServiceCopy;
  accent: string;
  accentText: string;
  categoryLabel: string;
  inquiry: Inquiry;
  closeLabel: string;
  getInTouchLabel: string;
  onClose: () => void;
}) {
  const Icon = service.icon;
  return (
    <motion.div
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="glass-deep absolute bottom-7 left-7 z-[4] w-[340px] max-w-[calc(100%-56px)] rounded-[20px] p-[22px] text-foreground shadow-[0_24px_70px_-20px_rgba(0,0,0,0.35)]"
      exit={{ opacity: 0, y: 14, scale: 0.98 }}
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      onPointerDown={(e) => e.stopPropagation()}
      transition={{ duration: 0.35, ease: [0.2, 0.7, 0.3, 1] }}
    >
      <button
        aria-label={closeLabel}
        className="absolute top-[15px] right-[15px] flex h-[30px] w-[30px] items-center justify-center rounded-full border-none bg-muted/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        onClick={onClose}
        type="button"
      >
        <X className="h-4 w-4" />
      </button>

      <div
        className="mb-4 h-1 w-11 rounded-full"
        style={{ background: accent, boxShadow: `0 0 16px ${withAlpha(accent, 0.85)}` }}
      />

      <div className="mb-[13px] flex items-center gap-2">
        <span
          className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-xl"
          style={{ background: withAlpha(accentText, 0.12), color: accentText }}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <span
          className="inline-flex items-center rounded-full px-[11px] py-1 font-bold text-[11.5px] uppercase tracking-[0.06em]"
          style={{
            background: withAlpha(accentText, 0.12),
            color: accentText,
            border: `1px solid ${withAlpha(accentText, 0.32)}`,
          }}
        >
          {categoryLabel}
        </span>
      </div>

      <h3 className="mb-[9px] font-bold text-[22px] text-foreground leading-tight tracking-[-0.01em]">
        {item.title}
      </h3>
      <p className="mb-3 text-[15px] text-muted-foreground leading-[1.55]">
        {item.description}
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        <span className="rounded-md border border-border/40 bg-muted/40 px-2 py-1 font-medium font-mono text-[11px] text-foreground/80">
          {service.price}
        </span>
        {item.features.map((f) => (
          <span
            className="rounded-full border border-border/40 bg-muted/30 px-2.5 py-0.5 text-[11px] text-muted-foreground"
            key={f}
          >
            {f}
          </span>
        ))}
      </div>

      <Link
        className="group/btn flex items-center justify-between rounded-lg border border-border/40 px-4 py-2.5 text-[13px] text-foreground/80 transition-all duration-200 hover:border-primary/40 hover:bg-primary/[0.06] hover:text-foreground"
        state={inquiry}
        to="/contact"
      >
        {getInTouchLabel}
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
      </Link>
    </motion.div>
  );
}

export function ServicesSection() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const t = translations[language].services;
  const designTheme = serviceTreeThemeFor(theme);
  // Same source the page's JSON-LD is built from — rendered here so the
  // visible content and the structured data can't drift apart.
  const howTo = getServicesHowTo(language);
  const faqs = getServicesFaqs(language);
  const isDark = isDarkTheme(theme);
  // The decorative accents glow on dark but are unreadable as small text on a
  // light page (cyan on #fdf0f2 is about 1.5:1) — words use the text set.
  const accentText = CATEGORY_ACCENT_TEXT[isDark ? "dark" : "light"];

  const [active, setActive] = useState<Category>("all");
  const [selectedKey, setSelectedKey] = useState<ItemKey | null>(null);
  const [treeReady, setTreeReady] = useState(false);
  const [treeFailed, setTreeFailed] = useState(false);

  // The 3D tree is purely the desktop experience; mobile / narrow viewports /
  // reduced-motion get the card grid only (three.js never even loads there).
  // Seeded on first client render (no layout shift, no mobile cost) and kept
  // reactive so crossing the breakpoint — resize, DevTools, device rotation —
  // swaps cleanly and tears down the WebGL panel on the way down.
  const [showExplorer, setShowExplorer] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(DESKTOP_QUERY).matches &&
      !window.matchMedia(REDUCED_MOTION_QUERY).matches,
  );
  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const motion = window.matchMedia(REDUCED_MOTION_QUERY);
    const update = () => {
      const next = desktop.matches && !motion.matches;
      setShowExplorer(next);
      if (!next) setSelectedKey(null); // no card lingering once the tree is gone
    };
    update();
    desktop.addEventListener("change", update);
    motion.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      motion.removeEventListener("change", update);
    };
  }, []);

  const buildInquiry = (item: ServiceCopy): Inquiry => ({
    label: item.title,
    subject: `${t.inquiry.subjectPrefix} ${item.title}`,
    message: [
      t.inquiry.greeting,
      "",
      t.inquiry.intro.replace("{service}", item.title),
      "",
      t.inquiry.discuss,
      ...item.features.map((f) => `  → ${f}`),
      "",
      t.inquiry.closing,
    ].join("\n"),
  });

  const selectCategory = (id: Category) => {
    setActive(id);
    setSelectedKey(null);
  };

  const closeCard = useCallback(() => setSelectedKey(null), []);

  // Stable so the imperative scene's pointer handlers never see a stale setter.
  const handleSelect = useCallback((key: string | null) => {
    setSelectedKey(key as ItemKey | null);
  }, []);

  const handleError = useCallback(() => setTreeFailed(true), []);
  const handleReady = useCallback(() => setTreeReady(true), []);

  // Esc closes the open card (matches the Navbar mobile-menu pattern).
  useEffect(() => {
    if (!selectedKey) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCard();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedKey, closeCard]);

  // Stable identity across selection so the scene builds its textures once.
  const explorerNodes = useMemo<ServiceTreeNode[]>(
    () =>
      services.map((s) => ({
        key: s.itemKey,
        category: s.category,
        name: t.items[s.itemKey].title,
        icon: s.icon,
      })),
    [t],
  );

  const selected =
    (selectedKey && services.find((s) => s.itemKey === selectedKey)) || null;

  const showPanel = showExplorer && !treeFailed;

  return (
    <section className="section-padding" id="services">
      {showPanel ? (
        // ── Immersive desktop panel ──────────────────────────────────────
        // No panel, no border, no vignette — the plant renders straight onto
        // the page. The canvas was always transparent (alpha renderer, zero
        // clear alpha); the dark slab was this wrapper.
        <div className="relative mb-14 w-full">
          <div
            className="relative w-full"
            style={{ height: "clamp(560px, 70vh, 760px)" }}
          >
            <Suspense fallback={null}>
              <ServiceExplorer
                activeCategory={active}
                key={designTheme}
                designTheme={designTheme}
                nodes={explorerNodes}
                onError={handleError}
                onReady={handleReady}
                onSelect={handleSelect}
                selectedKey={selectedKey}
              />
            </Suspense>

            {/* Eyebrow + title + tabs, overlaid top-centre. */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] px-6 pt-11 text-center">
              <p className="font-semibold text-[13px] text-muted-foreground uppercase tracking-[0.24em]">
                {t.eyebrow}
              </p>
              <h1
                className="mt-2.5 font-bold text-foreground tracking-[-0.025em]"
                style={{
                  fontSize: "clamp(38px, 4.4vw, 58px)",
                  textShadow: isDark
                    ? "0 4px 40px rgba(120,160,255,0.35)"
                    : "0 2px 30px hsl(var(--background))",
                }}
              >
                {t.heading}
              </h1>
              <div className="pointer-events-auto mt-6 inline-flex flex-wrap justify-center gap-1.5">
                {FILTER_IDS.map((id) => {
                  const on = active === id;
                  return (
                    <button
                      key={id}
                      onClick={() => selectCategory(id)}
                      className={cn(
                        "rounded-full px-[18px] py-[9px] font-semibold text-[14.5px] transition-all duration-200",
                        on
                          ? "bg-primary/15 text-foreground shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.35)]"
                          : "bg-transparent text-muted-foreground hover:text-foreground",
                      )}
                      type="button"
                    >
                      {t.filters[id]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detail card. */}
            <AnimatePresence>
              {selected ? (
                <DetailCard
                  accent={CATEGORY_ACCENT_HEX[selected.category]}
                  accentText={accentText[selected.category]}
                  categoryLabel={t.categoryMeta[selected.category].label}
                  closeLabel={t.close}
                  getInTouchLabel={t.getInTouch}
                  inquiry={buildInquiry(t.items[selected.itemKey])}
                  item={t.items[selected.itemKey]}
                  key={selected.itemKey}
                  onClose={closeCard}
                  service={selected}
                />
              ) : null}
            </AnimatePresence>

            {/* Loading shimmer (fades once the first frame renders). */}
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-0 z-[5] flex flex-col items-center justify-center gap-3.5 transition-opacity duration-500",
                treeReady && "opacity-0",
              )}
            >
              <span className="h-3.5 w-3.5 animate-pulse rounded-full bg-[#bcd6ff] shadow-[0_0_22px_6px_rgba(120,160,255,0.6)]" />
              <span className="text-[13px] text-muted-foreground tracking-[0.06em]">
                {t.loading}
              </span>
            </div>
          </div>
        </div>
      ) : (
        // ── Mobile / reduced-motion / fallback header ────────────────────
        <>
          <SectionHeading eyebrow={t.eyebrow} title={t.heading} />
        </>
      )}

      {/* Three offers, not nine line items. The categories that used to be
          filter-only are now the page's structure. `ServiceOffers` carries the
          scroll act: a branch drawing down the page out of the tree above, each
          category blooming in its own accent as it passes. */}
      <ServiceOffers
        categories={CATEGORY_ORDER.map((category) => {
          const items = services.filter((s) => s.category === category);
          const meta = t.categoryMeta[category];
          return {
            key: category,
            label: meta.label,
            desc: meta.desc,
            accent: CATEGORY_ACCENT_HEX[category],
            accentText: accentText[category],
            fromLabel: t.fromPrice.replace("{price}", entryPrice(items)),
            services: items.map((service) => ({
              key: service.itemKey,
              title: t.items[service.itemKey].title,
              description: t.items[service.itemKey].description,
              price: service.price,
              icon: service.icon,
              inquiry: buildInquiry(t.items[service.itemKey]),
            })),
          };
        })}
      />

      {/* Process + FAQ. This copy already existed in `seo-data/services.ts`,
          fully translated, but was only ever emitted as JSON-LD — Google
          requires FAQ/HowTo content to be visible to users, so the markup was
          being ignored and the visitor was told less than the crawler. */}
      <div className="mt-20 sm:mt-24">
        <h2 className="font-bold text-xl tracking-tight sm:text-2xl">
          {t.processTitle}
        </h2>
        <ol className="relative mt-8 max-w-2xl space-y-7 pl-6 sm:pl-8">
          {/* The rule draws itself as the steps arrive. */}
          <motion.span
            aria-hidden
            className="absolute top-0 left-0 w-0.5 origin-top bg-gradient-to-b from-primary via-primary/50 to-transparent"
            initial={{ scaleY: 0 }}
            style={{ bottom: 0 }}
            transition={{ duration: 1.2, ease: EASE }}
            viewport={{ once: true, margin: "-20%" }}
            whileInView={{ scaleY: 1 }}
          />
          {howTo.step.map((step, i) => (
            <motion.li
              initial={{ opacity: 0, x: -18, filter: "blur(6px)" }}
              key={step.name}
              transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              viewport={{ once: true, margin: "-15%" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            >
              <p className="flex items-baseline gap-3">
                <span className="font-mono text-muted-foreground/40 text-xs">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-medium text-base">{step.name}</span>
              </p>
              <p className="mt-1.5 text-muted-foreground text-sm leading-relaxed">
                {step.text}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>

      <div className="mt-20 max-w-2xl sm:mt-24">
        <h2 className="font-bold text-xl tracking-tight sm:text-2xl">
          {t.faqTitle}
        </h2>
        {/* Native <details>: no JS, keyboard and screen-reader correct, and it
            keeps the answers in the DOM for crawlers even while collapsed. */}
        <div className="mt-6 divide-y divide-border/15 border-border/15 border-t">
          {faqs.map((faq, i) => (
            <motion.details
              className="group py-4"
              initial={{ opacity: 0, y: 14 }}
              key={faq.question}
              transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
              viewport={{ once: true, margin: "-10%" }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-medium text-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronDown
                  aria-hidden
                  className="mt-0.5 h-4 w-4 flex-none text-muted-foreground/50 transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                {faq.answer}
              </p>
            </motion.details>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <motion.div
        className="mt-16 flex flex-col items-center gap-4 border-border/20 border-t pt-14 text-center"
        initial={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <p className="eyebrow">{t.ctaEyebrow}</p>
        <h3 className="font-bold text-2xl md:text-3xl">{t.ctaTitle}</h3>
        <Button asChild className="group mt-2 rounded-lg px-6" variant="cta">
          {/* No specific service picked — land on /contact set to "a freelance
              project" rather than its default of "a role". */}
          <Link state={{ intent: "freelance" }} to="/contact">
            {t.ctaButton}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </motion.div>
    </section>
  );
}
