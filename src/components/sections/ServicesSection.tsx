import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import type { ServiceTreeNode } from "@/components/effects/service-tree/types";
import {
  CATEGORY_ACCENT_HEX,
  CATEGORY_ACCENT_TEXT,
  SITE_SERVICE_TREE_THEME,
} from "@/components/effects/service-tree/theme";
import { ServiceOffers } from "@/components/effects/service-offers";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { getServicesFaqs, getServicesHowTo } from "@/config/seo-data";
import { Button } from "@/components/ui/button";
import { revealOnScroll } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-context";
import { DUR, EASE_OUT, REVEAL, SPRING_SOFT, stagger, VIEWPORT } from "@/lib/motion";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";

// The Services page IS a 3D skill-tree sapling on desktop, lazy (three.js),
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
 * unit. Taking a numeric minimum across the raw strings would be wrong, they
 * mix models ("300 CHF", "60 CHF/hr", "50 CHF/mo", "200 CHF + 50/mo"), so we
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
 *
 * It arrives on the shared soft spring rather than a tween, which is what makes
 * it read as pushed up out of the leaf instead of faded in over it, and it takes
 * focus on open so the keyboard lands on the close button rather than back at
 * the top of the document.
 */
function DetailCard({
  service,
  item,
  accent,
  accentText,
  categoryLabel,
  inquiry,
  closeLabel,
  includesLabel,
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
  includesLabel: string;
  getInTouchLabel: string;
  onClose: () => void;
}) {
  const Icon = service.icon;
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // `preventScroll` because the card is already on screen: without it the
    // browser would scroll the panel to satisfy a focus it did not need to.
    closeRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1, y: 0 }}
      aria-label={item.title}
      className="glass-deep absolute bottom-7 left-7 z-[4] w-[356px] max-w-[calc(100%-56px)] transform-gpu rounded-2xl p-6 text-foreground shadow-[0_24px_70px_-20px_rgba(0,0,0,0.35)]"
      exit={{
        opacity: 0,
        scale: 0.98,
        transition: { duration: DUR.fast, ease: EASE_OUT },
        y: 12,
      }}
      initial={{ opacity: 0, scale: 0.96, y: 18 }}
      onPointerDown={(e) => e.stopPropagation()}
      role="dialog"
      transition={{
        ...SPRING_SOFT,
        opacity: { duration: DUR.fast, ease: EASE_OUT },
      }}
    >
      {/* The close control reads as a control: a bordered chip rather than a
          bare glyph, with an invisible ring of extra hit area around it so the
          pointer target clears 44px without a 44px hole in the layout. */}
      <button
        aria-label={closeLabel}
        className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/40 bg-background/70 text-muted-foreground transition-colors duration-200 ease-out after:absolute after:-inset-1.5 after:content-[''] hover:border-primary/40 hover:bg-primary/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        onClick={onClose}
        ref={closeRef}
        type="button"
      >
        <X className="h-4 w-4" />
      </button>

      <div
        aria-hidden
        className="mb-4 h-1 w-11 rounded-full"
        style={{
          background: accent,
          boxShadow: `0 0 16px ${withAlpha(accent, 0.85)}`,
        }}
      />

      <div className="mb-3.5 flex items-center gap-2">
        <span
          aria-hidden
          className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-xl"
          style={{ background: withAlpha(accentText, 0.12), color: accentText }}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <span
          className="inline-flex items-center rounded-full px-[11px] py-1 font-bold text-[11.5px] uppercase tracking-[0.06em]"
          style={{
            background: withAlpha(accentText, 0.12),
            border: `1px solid ${withAlpha(accentText, 0.32)}`,
            color: accentText,
          }}
        >
          {categoryLabel}
        </span>
      </div>

      <h3 className="mb-2 font-bold text-[22px] text-foreground leading-tight tracking-[-0.01em]">
        {item.title}
      </h3>
      <p className="text-[15px] text-muted-foreground leading-[1.55]">
        {item.description}
      </p>

      <span className="sr-only">{includesLabel}</span>
      <div className="mt-3.5 flex flex-wrap gap-1.5">
        {item.features.map((feature) => (
          <span
            className="rounded-full border border-border/40 bg-muted/30 px-2.5 py-1 text-[11px] text-muted-foreground leading-none"
            key={feature}
          >
            {feature}
          </span>
        ))}
      </div>

      {/* Price and action share the footer rule, the same pairing the offer
          cards below use, so the tree and the grid quote a price identically. */}
      <div className="mt-5 flex items-center justify-between gap-3 border-border/30 border-t pt-4">
        <span
          className="font-mono font-semibold text-[15px] tabular-nums"
          style={{ color: accentText }}
        >
          {service.price}
        </span>
        <Button asChild className="rounded-lg" size="sm" variant="soft">
          <Link state={inquiry} to="/contact">
            {getInTouchLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}

export function ServicesSection() {
  const { language } = useLanguage();
  const t = translations[language].services;
  const designTheme = SITE_SERVICE_TREE_THEME;
  const reduceMotion = useReducedMotion();
  // Same source the page's JSON-LD is built from, rendered here so the
  // visible content and the structured data can't drift apart.
  const howTo = getServicesHowTo(language);
  const faqs = getServicesFaqs(language);
  // The decorative accents glow on dark but are unreadable as small text on the
  // light bloom page (cyan on #fdf0f2 is about 1.5:1), so words use the text set.
  const accentText = CATEGORY_ACCENT_TEXT.light;

  const [active, setActive] = useState<Category>("all");
  const [selectedKey, setSelectedKey] = useState<ItemKey | null>(null);
  const [treeReady, setTreeReady] = useState(false);
  const [treeFailed, setTreeFailed] = useState(false);

  // The 3D tree is purely the desktop experience; mobile / narrow viewports /
  // reduced-motion get the card grid only (three.js never even loads there).
  // Seeded on first client render (no layout shift, no mobile cost) and kept
  // reactive so crossing the breakpoint (resize, DevTools, device rotation)
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
    // `w-full` matters: `section-padding` centres with auto margins, and a
    // column flex item with auto side margins is sized to its content rather
    // than stretched. Without it this section collapsed to roughly 800px on a
    // 1440px screen and the offer grid had nowhere to go.
    <section className="section-padding w-full" id="services">
      {showPanel ? (
        // ── Immersive desktop panel ──────────────────────────────────────
        // No panel, no border, no vignette: the plant renders straight onto
        // the page. The canvas was always transparent (alpha renderer, zero
        // clear alpha); the dark slab was this wrapper.
        <div className="relative mb-10 w-full">
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

            {/* Eyebrow + title + segmented filter, overlaid top-centre. */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] px-6 pt-11 text-center">
              <p className="font-semibold text-[13px] text-muted-foreground uppercase tracking-[0.24em]">
                {t.eyebrow}
              </p>
              <h1
                className="mt-2.5 font-bold text-foreground tracking-[-0.025em]"
                style={{
                  fontSize: "clamp(38px, 4.4vw, 58px)",
                  textShadow: "0 2px 30px hsl(var(--background))",
                }}
              >
                {t.heading}
              </h1>
              {/* One segmented control on its own glass track rather than four
                  loose pills: over a moving 3D scene, unfilled labels had
                  nothing behind them and read as text lying on the leaves. */}
              <div
                aria-label={t.filterLabel}
                className="pointer-events-auto mt-6 inline-flex flex-wrap items-center justify-center gap-1 rounded-full border border-border/40 bg-background/85 p-1 shadow-sm backdrop-blur-md"
                role="group"
              >
                {FILTER_IDS.map((id) => {
                  const on = active === id;
                  return (
                    <button
                      aria-pressed={on}
                      className={cn(
                        "inline-flex min-h-[40px] items-center rounded-full px-[18px] font-semibold text-[14.5px] transition-[color,background-color,box-shadow] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                        on
                          ? "bg-primary/15 text-foreground shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.35)]"
                          : "bg-transparent text-muted-foreground hover:bg-primary/[0.06] hover:text-foreground",
                      )}
                      key={id}
                      onClick={() => selectCategory(id)}
                      type="button"
                    >
                      {t.filters[id]}
                    </button>
                  );
                })}
              </div>
              {/* The same background-coloured halo the title uses, so a line of
                  small type stays readable where a leaf passes behind it. */}
              <p
                className="mt-3 text-[12.5px] text-muted-foreground"
                style={{
                  textShadow:
                    "0 0 8px hsl(var(--background)), 0 0 16px hsl(var(--background))",
                }}
              >
                {t.treeHint}
              </p>
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
                  includesLabel={t.includesLabel}
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
                "pointer-events-none absolute inset-0 z-[5] flex flex-col items-center justify-center gap-3.5 transition-opacity duration-500 ease-out",
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
        <SectionHeading className="mb-8" eyebrow={t.eyebrow} title={t.heading} />
      )}

      {/* The lead. Nine prices with no framing is a rate card; one paragraph
          ahead of them is an offer. */}
      <motion.p
        className="mx-auto mb-14 max-w-2xl text-balance text-center text-base text-muted-foreground leading-relaxed sm:mb-16 sm:text-lg"
        {...revealOnScroll(reduceMotion)}
      >
        {t.intro}
      </motion.p>

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
              features: t.items[service.itemKey].features,
              price: service.price,
              icon: service.icon,
              inquiry: buildInquiry(t.items[service.itemKey]),
            })),
          };
        })}
        ctaLabel={t.getInTouch}
        includesLabel={t.includesLabel}
        inquireLabel={t.inquireAbout}
      />

      {/* Process + FAQ. This copy already existed in `seo-data/services.ts`,
          fully translated, but was only ever emitted as JSON-LD, and Google
          requires FAQ/HowTo content to be visible to users, so the markup was
          being ignored and the visitor was told less than the crawler.
          Heading and steps cascade off one parent instead of each step running
          its own timer, so the list reads as a single sequence. */}
      <motion.div
        className="mt-24 sm:mt-28"
        {...revealOnScroll(reduceMotion, stagger())}
      >
        <motion.h2
          className="font-bold text-2xl tracking-tight sm:text-3xl"
          variants={REVEAL}
        >
          {t.processTitle}
        </motion.h2>
        <ol className="relative mt-9 max-w-2xl space-y-8 pl-11">
          {/* The rule draws itself as the steps arrive. Its own scaleY wipe,
              not a REVEAL, so it keeps its independent trigger. Offset to run
              through the middle of the numbered tokens. */}
          <motion.span
            aria-hidden
            className="absolute top-0 left-[13px] w-0.5 origin-top bg-gradient-to-b from-primary via-primary/50 to-transparent"
            initial={{ scaleY: 0 }}
            style={{ bottom: 0 }}
            transition={{ duration: DUR.slow, ease: EASE_OUT }}
            viewport={VIEWPORT}
            whileInView={{ scaleY: 1 }}
          />
          {howTo.step.map((step, i) => (
            <motion.li className="relative" key={step.name} variants={REVEAL}>
              {/* An opaque token so the rule passes behind, not through. */}
              <span
                aria-hidden
                className="-left-11 absolute top-0 flex h-7 w-7 items-center justify-center rounded-full border border-border/50 bg-background font-mono text-[11px] text-muted-foreground"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-medium text-base leading-7">{step.name}</p>
              <p className="mt-1.5 text-muted-foreground text-sm leading-relaxed">
                {step.text}
              </p>
            </motion.li>
          ))}
        </ol>
      </motion.div>

      <motion.div
        className="mt-24 max-w-2xl sm:mt-28"
        {...revealOnScroll(reduceMotion, stagger())}
      >
        <motion.h2
          className="font-bold text-2xl tracking-tight sm:text-3xl"
          variants={REVEAL}
        >
          {t.faqTitle}
        </motion.h2>
        {/* Native <details>: no JS, keyboard and screen-reader correct, and it
            keeps the answers in the DOM for crawlers even while collapsed. The
            cascade is on the wrapper, the element itself stays native, and the
            open state is styled rather than animated (a height animation would
            need JS and would take the content out of the DOM's flow). */}
        <div className="mt-6 divide-y divide-border/30 border-border/30 border-t">
          {faqs.map((faq) => (
            <motion.details
              className="group py-1.5"
              key={faq.question}
              variants={REVEAL}
            >
              <summary className="-mx-3 flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-3 py-3 font-medium text-sm transition-colors duration-200 ease-out hover:bg-muted/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background group-open:text-primary [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronDown
                  aria-hidden
                  className="h-4 w-4 flex-none text-muted-foreground/50 transition-transform duration-200 ease-out group-open:rotate-180"
                />
              </summary>
              {/* No left padding: the summary's own is cancelled by its
                  negative margin, so the answer lines up under the question. */}
              <p className="pt-1 pr-10 pb-4 text-muted-foreground text-sm leading-relaxed">
                {faq.answer}
              </p>
            </motion.details>
          ))}
        </div>
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        className="mt-20 flex flex-col items-center gap-4 border-border/20 border-t pt-14 text-center"
        {...revealOnScroll(reduceMotion, stagger(0.2))}
      >
        <motion.p className="eyebrow" variants={REVEAL}>
          {t.ctaEyebrow}
        </motion.p>
        <motion.h3 className="font-bold text-2xl md:text-3xl" variants={REVEAL}>
          {t.ctaTitle}
        </motion.h3>
        <motion.div variants={REVEAL}>
          <Button asChild className="group mt-2 rounded-lg px-6" variant="cta">
            {/* No specific service picked, so land on /contact set to "a
                freelance project" rather than its default of "a role". */}
            <Link state={{ intent: "freelance" }} to="/contact">
              {t.ctaButton}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
