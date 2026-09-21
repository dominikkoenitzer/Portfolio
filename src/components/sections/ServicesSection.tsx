import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Code,
  Laptop,
  LifeBuoy,
  type LucideIcon,
  RefreshCw,
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
import {
  type OfferCategoryKey,
  ServiceOffers,
} from "@/components/effects/service-offers";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Button } from "@/components/ui/button";
import { getServicesFaqs, getServicesHowTo } from "@/config/seo-data";
import { revealOnScroll } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-context";
import { DUR, EASE_OUT, REVEAL, SPRING_SOFT, stagger } from "@/lib/motion";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";

// The Services page opens on a 3D skill-tree sapling on desktop: lazy
// (three.js), desktop and full-motion only. Everything below it is plain cards.
const ServiceExplorer = lazy(
  () => import("@/components/effects/ServiceExplorer"),
);

type Category = "all" | OfferCategoryKey;
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
  category: OfferCategoryKey;
}

// Order within a category maps onto the tree's three leaf slots (see
// ServiceExplorer's LEAVES layout), so keep build/protect/grow grouped.
const services: Service[] = [
  { itemKey: "webDev", price: "2'000 CHF", icon: Code, category: "build" },
  {
    itemKey: "customSoftware",
    price: "3'000 CHF",
    icon: Settings,
    category: "build",
  },
  { itemKey: "serverSetup", price: "600 CHF", icon: Server, category: "build" },
  { itemKey: "security", price: "100 CHF/hr", icon: Shield, category: "protect" },
  {
    itemKey: "maintenance",
    price: "50 CHF/mo",
    icon: Wrench,
    category: "protect",
  },
  {
    itemKey: "emergency",
    price: "300 CHF",
    icon: LifeBuoy,
    category: "protect",
  },
  { itemKey: "seo", price: "500 CHF", icon: Search, category: "grow" },
  {
    itemKey: "relaunch",
    price: "1'500 CHF",
    icon: RefreshCw,
    category: "grow",
  },
  { itemKey: "support", price: "80 CHF/hr", icon: Laptop, category: "grow" },
];

const FILTER_IDS: Category[] = ["all", "build", "protect", "grow"];

// The page's structure, and the tree's branch order.
const CATEGORY_ORDER: OfferCategoryKey[] = ["build", "protect", "grow"];

/**
 * The "from" price for a category: the lowest headline number, carrying its own
 * unit. Taking a numeric minimum across the raw strings would be wrong, they
 * mix models ("2'000 CHF", "100 CHF/hr", "50 CHF/mo"), so we
 * pick the cheapest entry figure and show that service's price verbatim. Derived
 * rather than hard-coded so it can't drift when a price changes. The Swiss
 * thousands apostrophe is stripped first, or "2'000" would count as 2.
 */
const entryFigure = (price: string) =>
  Number(price.replace(/'/g, "").match(/\d+/)?.[0] ?? Number.POSITIVE_INFINITY);

const entryPrice = (items: Service[]) =>
  items.reduce((cheapest, s) =>
    entryFigure(s.price) < entryFigure(cheapest.price) ? s : cheapest,
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
 * The detail card that rises bottom-left when a leaf is clicked. A plain card
 * on the shared soft spring; `accent` colours the small bar that ties it to the
 * leaf, `accentText` carries anything with words in it. Takes focus on open so
 * the keyboard lands on the close button rather than back at the top.
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
      className="absolute bottom-7 left-7 z-4 w-[356px] max-w-[calc(100%-56px)] rounded-2xl border border-border/60 bg-card p-6 text-foreground shadow-xs"
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
      {/* A bordered chip rather than a bare glyph, with an invisible ring of
          extra hit area so the pointer target clears 44px. */}
      <button
        aria-label={closeLabel}
        className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors duration-200 ease-out after:absolute after:-inset-1.5 after:content-[''] hover:border-primary/40 hover:text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        onClick={onClose}
        ref={closeRef}
        type="button"
      >
        <X className="h-4 w-4" />
      </button>

      <div
        aria-hidden
        className="mb-4 h-1 w-11 rounded-full"
        style={{ background: accent }}
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
            className="rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground leading-none"
            key={feature}
          >
            {feature}
          </span>
        ))}
      </div>

      {/* Price and action share the footer rule, the same pairing the offer
          cards below use, so the tree and the grid quote a price identically. */}
      <div className="mt-5 flex items-center justify-between gap-3 border-border/60 border-t pt-4">
        <span
          className="font-semibold text-[15px] tabular-nums"
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
  // The tree's decorative accents are unreadable as small text on the light
  // page (a pastel on cream is under 2:1), so words use the text set.
  const accentText = CATEGORY_ACCENT_TEXT.light;

  const [active, setActive] = useState<Category>("all");
  const [selectedKey, setSelectedKey] = useState<ItemKey | null>(null);
  const [treeReady, setTreeReady] = useState(false);
  const [treeFailed, setTreeFailed] = useState(false);

  // The 3D tree is purely the desktop experience; mobile / narrow viewports /
  // reduced motion get the card grid only (three.js never even loads there).
  // Seeded on first client render (no layout shift, no mobile cost) and kept
  // reactive so crossing the breakpoint swaps cleanly and tears down the WebGL
  // panel on the way down.
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

  const closeCard = useCallback(() => {
    const key = selectedKey;
    setSelectedKey(null);
    // Only when the keyboard was inside the card: a pointer user clicking the
    // empty canvas must not have focus yanked into the hidden list.
    if (key && document.activeElement?.closest('[role="dialog"]')) {
      document.getElementById(`service-leaf-${key}`)?.focus();
    }
  }, [selectedKey]);

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
        // The plant renders straight onto the page: the canvas is transparent
        // and there is no panel or border around it.
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

            {/* Eyebrow, title and the category filter, overlaid top-centre.
                Same eyebrow and title classes as SectionHeading, so this
                page's title matches every other page's. The cream halo keeps
                the title legible where a leaf passes behind it. */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-2 px-6 text-center">
              <p className="eyebrow mb-3">{t.eyebrow}</p>
              <h1
                className="font-bold text-3xl md:text-4xl"
                style={{ textShadow: "0 2px 30px hsl(var(--background))" }}
              >
                {t.heading}
              </h1>
              {/* One segmented control on its own opaque track: over a moving
                  3D scene, unfilled labels read as text lying on the leaves. */}
              <div
                aria-label={t.filterLabel}
                className="pointer-events-auto mt-6 inline-flex flex-wrap items-center justify-center gap-1 rounded-full border border-border/60 bg-background/95 p-1"
                role="group"
              >
                {FILTER_IDS.map((id) => {
                  const on = active === id;
                  // The active chip wears the category's own accent, the same
                  // one its bough wears, so pressing "Grow" is answered on the
                  // chip as well as out in the tree. Only fill, ring and text
                  // colour change, so the row cannot re-wrap under the pointer.
                  // "All services" stays ink, because the build accent is the
                  // primary violet and the two would otherwise be the same chip.
                  const tint = id === "all" ? null : accentText[id];
                  return (
                    <button
                      aria-pressed={on}
                      className={cn(
                        "inline-flex min-h-[40px] items-center rounded-full px-[18px] font-semibold text-[14.5px] transition-[color,background-color,box-shadow] duration-200 ease-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                        on
                          ? "text-foreground"
                          : "bg-transparent text-muted-foreground hover:bg-primary/6 hover:text-foreground",
                        on &&
                          !tint &&
                          "bg-foreground/8 shadow-[inset_0_0_0_1px_hsl(var(--foreground)/0.6)]",
                      )}
                      key={id}
                      onClick={() => selectCategory(id)}
                      style={
                        on && tint
                          ? {
                              backgroundColor: withAlpha(tint, 0.16),
                              boxShadow: `inset 0 0 0 1px ${withAlpha(tint, 0.85)}`,
                            }
                          : undefined
                      }
                      type="button"
                    >
                      {t.filters[id]}
                    </button>
                  );
                })}
              </div>
              {/* The hint sits on the same opaque track as the control above,
                  because small type cannot be separated from a lit 3D object
                  in the same pixels by a text-shadow alone. Picking a category
                  prefixes it with that category's name and description, so the
                  chips have a written answer as well as a moving one. Announced
                  politely, because the tree itself is aria-hidden and this line
                  is the only thing a screen reader can hear change. */}
              <div className="mt-3 flex justify-center">
                <p
                  aria-live="polite"
                  className="inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-0.5 rounded-full border border-border/60 bg-background/95 px-3.5 py-1.5 text-[12.5px] text-muted-foreground"
                >
                  {active === "all" ? null : (
                    <motion.span
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-flex items-center gap-1.5 font-semibold"
                      initial={{ opacity: 0, y: -4 }}
                      key={active}
                      style={{ color: accentText[active] }}
                      transition={{ duration: DUR.fast, ease: EASE_OUT }}
                    >
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 flex-none rounded-full"
                        style={{ background: accentText[active] }}
                      />
                      {`${t.categoryMeta[active].label} · ${t.categoryMeta[active].desc}`}
                    </motion.span>
                  )}
                  <span>{t.treeHint}</span>
                </p>
              </div>
            </div>

            {/* The tree is a <canvas>: aria-hidden, with nothing focusable in
                it, so a keyboard or a screen reader could reach this page's
                framing and never one of the nine services, because the page's whole
                point. These are the same nine leaves as real buttons, visually
                hidden, driving the same `selectedKey` the pointer drives, so
                both inputs open the same panel rather than getting two
                different UIs. Filtered by `active` for the same reason a dimmed
                bough stops answering the pointer. */}
            <ul aria-label={t.heading} className="sr-only">
              {services
                .filter((item) => active === "all" || item.category === active)
                .map((item) => (
                  <li key={item.itemKey}>
                    <button
                      aria-expanded={selectedKey === item.itemKey}
                      id={`service-leaf-${item.itemKey}`}
                      onClick={() => handleSelect(item.itemKey)}
                      type="button"
                    >
                      {`${t.items[item.itemKey].title}, ${t.categoryMeta[item.category].label}, ${item.price}`}
                    </button>
                  </li>
                ))}
            </ul>

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

            {/* Loading note, fades once the first frame renders. */}
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-0 z-5 flex flex-col items-center justify-center gap-3 transition-opacity duration-500 ease-out",
                treeReady && "opacity-0",
              )}
            >
              <span className="h-2 w-2 rounded-full bg-sage-deep" />
              <span className="text-[13px] text-muted-foreground tracking-[0.06em]">
                {t.loading}
              </span>
            </div>
          </div>
        </div>
      ) : (
        // Mobile / reduced-motion / fallback header, left-aligned like
        // /projects and /contact. The tree carries a centred title because it
        // is a title laid over its own canvas; with no canvas the title has no
        // reason to leave the column the rest of the page sits in.
        <SectionHeading
          align="left"
          className="mb-6"
          eyebrow={t.eyebrow}
          title={t.heading}
        />
      )}

      {/* The lead. Nine prices with no framing is a rate card; one paragraph
          ahead of them is an offer. It starts on the page column edge, the one
          the footer and the hero use: centred here, it was the first step of a
          staircase that ran centred, left, left, centred down the page. The
          measure is 35rem rather than `max-w-2xl`, which fitted 87 characters
          a line in English and 89 in French; this holds every language between
          70 and 75. */}
      <motion.p
        className="mb-16 max-w-140 text-base text-muted-foreground leading-relaxed sm:text-lg"
        {...revealOnScroll(reduceMotion)}
      >
        {t.intro}
      </motion.p>

      {/* The nine offers as cards, only where the tree is not: the tree already
          carries every service, its price and its feature list behind a leaf,
          so on desktop the grid was the same rate card twice. This is the
          fallback for phones, narrow windows and reduced motion, where the
          tree never renders. */}
      {showPanel ? null : (
        <ServiceOffers
          categories={CATEGORY_ORDER.map((category) => {
            const items = services.filter((s) => s.category === category);
            const meta = t.categoryMeta[category];
            return {
              key: category,
              label: meta.label,
              desc: meta.desc,
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
      )}

      {/* Process + FAQ. This copy already existed in `seo-data/services.ts`,
          fully translated, but was only ever emitted as JSON-LD, and Google
          requires FAQ/HowTo content to be visible to users, so the markup was
          being ignored and the visitor was told less than the crawler.

          The two sit side by side from `lg`, because on desktop the tree above
          already answers "what do you sell", and the two things left to say
          ("how does this go" and "what will I want to ask") are short lists
          that were each running down a 672px column in a 1152px page, leaving
          the right half of the page blank twice over. Paired, they share one
          band, both headings start on the page column edge, and the gap opens
          up at `xl` so neither measure runs past ~75 characters: the cap below
          `lg`, where the two stack, is on the lists themselves. */}
      <div className="mt-20 grid gap-y-20 sm:mt-24 lg:grid-cols-2 lg:gap-x-16 xl:gap-x-36">
        {/* Heading and steps cascade off one parent instead of each step
            running its own timer, so the list reads as a single sequence. */}
        <motion.div {...revealOnScroll(reduceMotion, stagger())}>
          <motion.h2
            className="font-bold text-xl sm:text-2xl"
            variants={REVEAL}
          >
            {t.processTitle}
          </motion.h2>
          <ol className="mt-8 max-w-lg space-y-7 lg:max-w-none">
            {howTo.step.map((step, i) => (
              <motion.li
                className="flex gap-4"
                key={step.name}
                variants={REVEAL}
              >
                <span
                  aria-hidden
                  className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full border border-border/60 text-[11px] text-muted-foreground"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-medium text-base leading-7">{step.name}</p>
                  <p className="mt-1.5 text-muted-foreground text-sm leading-relaxed">
                    {step.text}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </motion.div>

        <motion.div {...revealOnScroll(reduceMotion, stagger())}>
          <motion.h2
            className="font-bold text-xl sm:text-2xl"
            variants={REVEAL}
          >
            {t.faqTitle}
          </motion.h2>
          {/* Native <details>: no JS, keyboard and screen-reader correct, and
              it keeps the answers in the DOM for crawlers even while collapsed,
              which matters here because this copy is also the page's FAQ
              schema. The box snaps to its open height (animating height
              repaints every frame and is banned site-wide); `.faq-panel` in
              index.css rises the answer into the space it opened. */}
          <div className="mt-6 max-w-lg divide-y divide-border/50 border-border/50 border-t lg:max-w-none">
            {faqs.map((faq) => (
              <motion.details
                className="group py-1.5"
                key={faq.question}
                variants={REVEAL}
              >
                <summary className="-mx-3 flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-3 py-3 font-medium text-sm transition-colors duration-200 ease-out hover:text-primary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background group-open:text-primary [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown
                    aria-hidden
                    className="h-4 w-4 flex-none text-muted-foreground/60 transition-transform duration-300 ease-out group-open:rotate-180 group-open:text-primary"
                  />
                </summary>
                {/* No left padding: the summary's own is cancelled by its
                    negative margin, so the answer lines up under the
                    question. */}
                <p className="faq-panel pt-1 pr-10 pb-4 text-muted-foreground text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </motion.details>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom CTA. Left on the same column edge as everything above it, with
          the one sage fill on the page pushed to the far end of the rule from
          `sm` up: the ask and the button are the two ends of one line rather
          than a centred stack that restarted the staircase. */}
      <motion.div
        className="mt-20 border-border/50 border-t pt-14 sm:mt-24"
        {...revealOnScroll(reduceMotion, stagger(0.2))}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <motion.p className="eyebrow" variants={REVEAL}>
              {t.ctaEyebrow}
            </motion.p>
            <motion.h3
              className="mt-3 font-bold text-xl sm:text-2xl"
              variants={REVEAL}
            >
              {t.ctaTitle}
            </motion.h3>
          </div>
          <motion.div className="flex-none" variants={REVEAL}>
            <Button asChild className="group rounded-lg px-6" variant="cta">
              {/* No specific service picked, so land on /contact set to "a
                  freelance project" rather than its default of "a role". */}
              <Link state={{ intent: "freelance" }} to="/contact">
                {t.ctaButton}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
