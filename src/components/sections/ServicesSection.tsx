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
import {
  lazy,
  type RefObject,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { useTheme } from "@/components/theme-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";

// The Services page IS a 3D skill tree on desktop — lazy (three.js), desktop-only.
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
type ScreenPos = { x: number; y: number };
type Inquiry = { subject: string; message: string };

interface Service {
  itemKey: ItemKey;
  price: string;
  icon: LucideIcon;
  category: CategoryGroup;
}

const EASE = [0.22, 1, 0.36, 1] as const;

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

const POPUP_W = 300;
const POPUP_H = 320;

/** A card that pops up anchored to the clicked node, clamped inside the tree. */
function ServicePopup({
  service,
  item,
  inquiry,
  categoryLabel,
  closeLabel,
  getInTouchLabel,
  pos,
  containerRef,
  onClose,
}: {
  service: Service;
  item: ServiceCopy;
  inquiry: Inquiry;
  categoryLabel: string;
  closeLabel: string;
  getInTouchLabel: string;
  pos: ScreenPos;
  containerRef: RefObject<HTMLDivElement>;
  onClose: () => void;
}) {
  const w = containerRef.current?.clientWidth ?? 0;
  const h = containerRef.current?.clientHeight ?? 0;
  const left = Math.min(Math.max(pos.x - POPUP_W / 2, 12), Math.max(12, w - POPUP_W - 12));
  const placeBelow = pos.y + POPUP_H + 28 < h;
  const top = placeBelow
    ? pos.y + 22
    : Math.max(12, pos.y - POPUP_H - 22);
  const Icon = service.icon;

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="absolute z-20 w-[300px] rounded-2xl border border-border/60 bg-background/95 p-5 shadow-[0_24px_70px_-20px_rgba(0,0,0,0.55)] backdrop-blur-md"
      exit={{ opacity: 0, scale: 0.92, y: 6 }}
      initial={{ opacity: 0, scale: 0.92, y: 6 }}
      onPointerDown={(e) => e.stopPropagation()}
      style={{ left, top }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      <button
        aria-label={closeLabel}
        className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
        onClick={onClose}
        type="button"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <span className="block font-mono text-[10px] text-muted-foreground/50 uppercase tracking-[0.18em]">
            {categoryLabel}
          </span>
          <h3 className="font-semibold text-lg leading-tight">{item.title}</h3>
        </div>
      </div>

      <span className="mb-3 inline-flex rounded-lg border border-border/20 bg-muted/20 px-2.5 py-1 font-medium font-mono text-foreground/70 text-xs">
        {service.price}
      </span>

      <p className="mb-4 text-muted-foreground text-sm leading-relaxed">
        {item.description}
      </p>

      <div className="mb-5 flex flex-wrap gap-1.5">
        {item.features.map((f) => (
          <Badge key={f}>{f}</Badge>
        ))}
      </div>

      <Link
        className="group/btn flex items-center justify-between rounded-lg border border-border/20 px-4 py-2.5 text-muted-foreground text-sm transition-all duration-200 hover:border-primary/30 hover:bg-primary/[0.04] hover:text-primary"
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
  const [active, setActive] = useState<Category>("all");
  const [selectedKey, setSelectedKey] = useState<ItemKey | null>(null);
  const [selectedPos, setSelectedPos] = useState<ScreenPos | null>(null);
  const treeRef = useRef<HTMLDivElement>(null);

  // The 3D tree is the desktop experience; mobile / reduced-motion get the card
  // grid. Resolved on first (client) render → no layout shift, no mobile cost.
  const [showExplorer] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1024px)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

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
    setSelectedPos(null);
  };

  const closePopup = useCallback(() => {
    setSelectedKey(null);
    setSelectedPos(null);
  }, []);

  // Stable so the memoised 3D Node children don't re-render when the section does.
  const handleSelect = useCallback((key: string, pos: ScreenPos) => {
    setSelectedKey(key as ItemKey);
    setSelectedPos(pos);
  }, []);

  // Esc closes the open service card (matches the Navbar mobile-menu pattern).
  useEffect(() => {
    if (!selectedKey) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePopup();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedKey, closePopup]);

  // The popup is anchored to a screen position captured at click time; a viewport
  // resize reframes the canvas and moves the node, so close the card to keep it
  // from detaching from its node.
  useEffect(() => {
    const el = treeRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => closePopup());
    ro.observe(el);
    return () => ro.disconnect();
  }, [closePopup]);

  // Stable across selection so the 3D scene bakes its textures once.
  const explorerNodes = useMemo(
    () =>
      services.map((s) => ({
        key: s.itemKey,
        category: s.category,
        title: t.items[s.itemKey].title,
        price: s.price,
        icon: s.icon,
      })),
    [t],
  );

  const filtered =
    active === "all" ? services : services.filter((s) => s.category === active);

  const selected =
    selectedKey && services.find((s) => s.itemKey === selectedKey);

  return (
    <section className="section-padding" id="services">
      <SectionHeading eyebrow={t.eyebrow} title={t.heading} />

      {/* Category filter — lights up a path (or filters the cards) */}
      <motion.div
        className="mb-8 flex flex-wrap justify-center gap-2 md:mb-10"
        initial={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
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
            {active === id && id !== "all" && (
              <span className="ml-1.5 hidden font-mono text-[10px] opacity-70 sm:inline">
                — {t.categoryMeta[id].desc}
              </span>
            )}
          </button>
        ))}
      </motion.div>

      {/* Desktop: an interactive 3D skill tree, shown above the scannable grid. */}
      {showExplorer ? (
        <div
          className="relative mx-auto mb-12 aspect-square w-full max-w-[min(88vh,1000px)]"
          ref={treeRef}
        >
          <Suspense fallback={null}>
            <ServiceExplorer
              activeCategory={active}
              nodes={explorerNodes}
              onClose={closePopup}
              onSelect={handleSelect}
              selectedKey={selectedKey ?? ""}
              theme={theme}
            />
          </Suspense>

          <AnimatePresence>
            {selected && selectedPos ? (
              <ServicePopup
                categoryLabel={t.categoryMeta[selected.category].label}
                closeLabel={t.close}
                containerRef={treeRef}
                getInTouchLabel={t.getInTouch}
                inquiry={buildInquiry(t.items[selected.itemKey])}
                item={t.items[selected.itemKey]}
                key={selected.itemKey}
                onClose={closePopup}
                pos={selectedPos}
                service={selected}
              />
            ) : null}
          </AnimatePresence>
        </div>
      ) : null}

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
