import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
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
import type { ServiceTreeNode } from "@/components/effects/ServiceExplorer";
import {
  CATEGORY_ACCENT_HEX,
  SERVICE_TREE_THEMES,
  SERVICE_TREE_VIGNETTE,
  serviceTreeThemeFor,
} from "@/components/effects/service-tree-theme";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { useTheme } from "@/components/theme-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-provider";
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
type Inquiry = { subject: string; message: string };

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
 * The detail card that flies up bottom-left when a leaf is clicked — design
 * tokens (dark glass, accent bar + pill), enriched with the real price,
 * feature chips, and the inquiry CTA.
 */
function DetailCard({
  service,
  item,
  accent,
  categoryLabel,
  inquiry,
  closeLabel,
  getInTouchLabel,
  onClose,
}: {
  service: Service;
  item: ServiceCopy;
  accent: string;
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
      className="absolute bottom-7 left-7 z-[4] w-[340px] max-w-[calc(100%-56px)] rounded-[20px] border border-white/[0.14] p-[22px] text-white shadow-[0_24px_70px_rgba(0,0,0,0.45)]"
      exit={{ opacity: 0, y: 14, scale: 0.98 }}
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      onPointerDown={(e) => e.stopPropagation()}
      style={{
        background: "rgba(8,16,42,0.62)",
        backdropFilter: "blur(20px) saturate(140%)",
        WebkitBackdropFilter: "blur(20px) saturate(140%)",
      }}
      transition={{ duration: 0.35, ease: [0.2, 0.7, 0.3, 1] }}
    >
      <button
        aria-label={closeLabel}
        className="absolute top-[15px] right-[15px] flex h-[30px] w-[30px] items-center justify-center rounded-full border-none bg-white/[0.09] text-white/75 transition-colors hover:bg-white/20 hover:text-white"
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
          style={{ background: withAlpha(accent, 0.14), color: accent }}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <span
          className="inline-flex items-center rounded-full px-[11px] py-1 font-bold text-[11.5px] uppercase tracking-[0.06em]"
          style={{
            background: withAlpha(accent, 0.16),
            color: accent,
            border: `1px solid ${withAlpha(accent, 0.35)}`,
          }}
        >
          {categoryLabel}
        </span>
      </div>

      <h3 className="mb-[9px] font-bold text-[22px] text-white leading-tight tracking-[-0.01em]">
        {item.title}
      </h3>
      <p className="mb-3 text-[15px] text-white/[0.72] leading-[1.55]">
        {item.description}
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        <span className="rounded-md border border-white/15 bg-white/[0.06] px-2 py-1 font-medium font-mono text-[11px] text-white/80">
          {service.price}
        </span>
        {item.features.map((f) => (
          <span
            className="rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-0.5 text-[11px] text-white/70"
            key={f}
          >
            {f}
          </span>
        ))}
      </div>

      <Link
        className="group/btn flex items-center justify-between rounded-lg border border-white/15 px-4 py-2.5 text-[13px] text-white/80 transition-all duration-200 hover:border-white/30 hover:bg-white/[0.06] hover:text-white"
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
  const palette = SERVICE_TREE_THEMES[designTheme];

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

  const filtered =
    active === "all" ? services : services.filter((s) => s.category === active);
  const selected =
    (selectedKey && services.find((s) => s.itemKey === selectedKey)) || null;

  const showPanel = showExplorer && !treeFailed;

  return (
    <section className="section-padding" id="services">
      {showPanel ? (
        // ── Immersive desktop panel ──────────────────────────────────────
        <div
          className="relative mb-14 w-full overflow-hidden rounded-[28px] border border-white/10 shadow-[0_30px_80px_-30px_rgba(8,16,42,0.7)]"
          style={{ background: palette.bg }}
        >
          <div
            className="relative w-full"
            style={{ height: "clamp(560px, 70vh, 760px)" }}
          >
            <Suspense fallback={null}>
              <ServiceExplorer
                activeCategory={active}
                designTheme={designTheme}
                nodes={explorerNodes}
                onError={handleError}
                onReady={handleReady}
                onSelect={handleSelect}
                selectedKey={selectedKey}
              />
            </Suspense>

            {/* Vignette sinks the far branches into the backdrop. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[1]"
              style={{ background: SERVICE_TREE_VIGNETTE }}
            />

            {/* Eyebrow + title + tabs, overlaid top-centre. */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] px-6 pt-11 text-center">
              <p className="font-semibold text-[13px] text-white/55 uppercase tracking-[0.24em]">
                {t.eyebrow}
              </p>
              <h1
                className="mt-2.5 font-bold text-white tracking-[-0.025em]"
                style={{
                  fontSize: "clamp(38px, 4.4vw, 58px)",
                  textShadow: "0 4px 40px rgba(120,160,255,0.35)",
                }}
              >
                {t.heading}
              </h1>
              <div className="pointer-events-auto mt-6 inline-flex flex-wrap justify-center gap-1.5">
                {FILTER_IDS.map((id) => {
                  const on = active === id;
                  return (
                    <button
                      className="rounded-full px-[18px] py-[9px] font-semibold text-[14.5px] transition-all duration-200"
                      key={id}
                      onClick={() => selectCategory(id)}
                      style={
                        on
                          ? {
                              background: "rgba(255,255,255,0.16)",
                              color: "#fff",
                              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.22)",
                            }
                          : { background: "transparent", color: "rgba(255,255,255,0.55)" }
                      }
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
              <span className="text-[13px] text-white/50 tracking-[0.06em]">
                {t.loading}
              </span>
            </div>
          </div>
        </div>
      ) : (
        // ── Mobile / reduced-motion / fallback header ────────────────────
        <>
          <SectionHeading eyebrow={t.eyebrow} title={t.heading} />
          <div className="mb-8 flex flex-wrap justify-center gap-2 md:mb-10">
            {FILTER_IDS.map((id) => (
              <button
                className={cn(
                  "relative rounded-full px-4 py-1.5 font-medium text-sm transition-all duration-200",
                  active === id
                    ? "bg-primary text-primary-foreground shadow-[0_2px_12px_hsl(var(--primary)/0.3)]"
                    : "border border-border/30 text-muted-foreground hover:border-primary/25 hover:text-foreground",
                )}
                key={id}
                onClick={() => selectCategory(id)}
                type="button"
              >
                {t.filters[id]}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Scannable cards — always visible: the at-a-glance view, and the
          crawlable + keyboard-accessible equivalent of the 3D tree above. */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((service, i) => {
            const item = t.items[service.itemKey];
            const inquiry = buildInquiry(item);
            const Icon = service.icon;
            return (
              <motion.div
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="glass-card group flex flex-col rounded-2xl p-5 sm:p-6"
                exit={{ opacity: 0, scale: 0.94, y: 6 }}
                initial={{ opacity: 0, scale: 0.94, y: 6 }}
                key={service.itemKey}
                layout
                transition={{ duration: 0.35, delay: i * 0.04, ease: EASE }}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-lg border border-border/20 bg-muted/20 px-2.5 py-1 font-medium font-mono text-foreground/70 text-xs">
                    {service.price}
                  </span>
                </div>
                <span className="mb-1.5 font-mono text-[10px] text-muted-foreground/35 uppercase tracking-[0.18em]">
                  {t.categoryMeta[service.category].label}
                </span>
                <h3 className="mb-2 font-semibold text-lg">{item.title}</h3>
                <p className="mb-4 flex-1 text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
                <div className="mb-5 flex flex-wrap gap-1.5">
                  {item.features.map((f) => (
                    <Badge key={f}>{f}</Badge>
                  ))}
                </div>
                <Link
                  className="group/btn mt-auto flex items-center justify-between rounded-lg border border-border/20 px-4 py-2.5 text-muted-foreground text-sm transition-all duration-200 hover:border-primary/30 hover:bg-primary/[0.04] hover:text-primary"
                  state={inquiry}
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
        className="mt-16 flex flex-col items-center gap-4 border-border/20 border-t pt-14 text-center"
        initial={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
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
