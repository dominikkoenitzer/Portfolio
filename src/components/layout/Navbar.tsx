import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV_LINKS } from "@/constants";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useHaptic } from "@/hooks/use-haptic";
import { isActivePath } from "@/lib/active-path";
import { useLanguage } from "@/lib/language-context";
import { DUR, EASE_OUT, SPRING_SOFT, stagger } from "@/lib/motion";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { LanguageToggle } from "./LanguageToggle";
import { NavbarMobileMenu } from "./NavbarMobileMenu";

/** Offset at which the bar takes its condensed island state. */
const CONDENSE_AT = 50;
/** The bar may only hide past this offset; nearer the top it always shows. */
const HIDE_BELOW = 80;
/** Movement smaller than this is jitter, not a direction change. */
const DIRECTION_THRESHOLD = 8;

/** The wordmark, split at the space so the surname can take the violet. */
const BRAND = "Dominik Könitzer";
const BRAND_ACCENT_AT = BRAND.indexOf(" ") + 1;

const NAV_KEY_BY_PATH: Record<string, keyof typeof translations.en.nav> = {
  "/about": "about",
  "/timeline": "timeline",
  "/skills": "skills",
  "/projects": "projects",
  "/services": "services",
  "/contact": "contact",
  "/donate": "donate",
};

/** The row's cascade, and the entrance of one item inside it. */
const NAV_ROW = stagger(0.1, 0.05);
const NAV_ITEM = {
  hidden: { opacity: 0, y: -8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE_OUT },
  },
} as const;

interface RippleLabelProps {
  /** The label. Also what assistive tech is given, verbatim. */
  text: string;
  /** Index from which characters take the accent colour. */
  accentFrom?: number;
  /** Run the per-character wave. Off under reduced motion. */
  wave: boolean;
}

/**
 * A label whose glyphs lift one after another when the link around it is
 * hovered or focused, the site's "motion type" idiom applied to navigation.
 *
 * Deliberately CSS rather than framer: seven labels plus the wordmark is ~65
 * glyphs, and sixty-five motion components subscribing to a hover state costs
 * far more than sixty-five transforms the compositor already knows how to run.
 * The per-glyph `transition-delay` is what turns a jump into a wave, and it
 * plays in reverse on the way out for free. Curve and duration are the CSS
 * half of the motion vocabulary (`--ease-out` is `EASE_OUT`, 200ms is
 * `DUR.fast`). At rest no transform class applies at all, so settled text is
 * rasterized by the text pipeline rather than through the compositor.
 *
 * A screen reader walking a dozen sibling spans would spell the word out, so
 * the real string is carried once in an `sr-only` span and the visible glyphs
 * are `aria-hidden`, the same split `SplitText` and the hero already use.
 */
function RippleLabel({ accentFrom, text, wave }: RippleLabelProps) {
  return (
    <>
      <span className="sr-only">{text}</span>
      {[...text].map((char, i) => (
        <span
          aria-hidden
          className={cn(
            "inline-block whitespace-pre",
            wave &&
              "transition-transform duration-200 ease-bloom group-focus-visible:-translate-y-[3px] group-hover:-translate-y-[3px]",
            accentFrom !== undefined && i >= accentFrom && "text-primary",
          )}
          // The string is fixed for the life of the element. A language switch
          // remounts the tree through the provider, so the index is stable.
          key={`${i}-${char}`}
          style={wave ? { transitionDelay: `${i * 22}ms` } : undefined}
        >
          {char}
        </span>
      ))}
    </>
  );
}

/**
 * The mark: a violet tile carrying the same "DK" as the favicon and the PWA
 * icons, so the tab, the installed app and the header finally agree on one
 * logo instead of the header being a line of bold body text.
 *
 * Contrast is why the fill is flat violet rather than the violet→lilac sweep
 * used elsewhere: cream on `primary` is 6.8:1, but cream on `lilac` is only
 * 3.6:1, which a 15px glyph may not sit on. The lit corner is white at 12%,
 * which leaves the lightest patch at 5.0:1, still AA. Purely decorative, so
 * the whole tile is hidden from assistive tech and the wordmark beside it
 * names the link.
 */
function Monogram() {
  return (
    <span
      aria-hidden
      className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[0.8rem] bg-primary shadow-[0_8px_20px_-10px_hsl(var(--primary)/0.75)] transition-transform duration-200 ease-bloom group-focus-visible:-rotate-6 group-hover:-rotate-6 md:h-10 md:w-10 md:rounded-[0.9rem]"
    >
      <span className="absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-black/[0.07]" />
      {/* Sheen parked off the left edge, sweeping across on hover. */}
      <span className="-left-full -skew-x-12 absolute inset-y-0 w-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 ease-bloom group-hover:translate-x-[220%]" />
      <span className="relative font-bold font-heading text-[0.95rem] text-primary-foreground leading-none tracking-tight md:text-base">
        DK
      </span>
    </span>
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollingDown, setScrollingDown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [reduceMotion] = useState(prefersReducedMotion);
  // Which link the pointer/keyboard is on, and whether it is still there. The
  // `on` flag exists so the travelling pill can fade out where it stands: a
  // shared-layout element only glides while a single instance stays mounted, so
  // unmounting it on mouse-out would make it vanish instead.
  const [hover, setHover] = useState<{ index: number; on: boolean } | null>(
    null,
  );
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language];
  const haptic = useHaptic();
  const navLinks = NAV_LINKS.map((link) => ({
    ...link,
    name: t.nav[NAV_KEY_BY_PATH[link.targetId]] ?? link.name,
  }));

  // Lenis drives the real window scroll, so the window-level scrollY that
  // useScroll reads stays authoritative with or without smooth scrolling.
  const { scrollY } = useScroll();
  // null until the first event: a reload halfway down the page must not read as
  // one giant downward jump and swallow the bar before the user touches it.
  const lastScrollY = useRef<number | null>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    // The drawer locks the body with position:fixed, which reports a scrollY of
    // 0 and would flip both states. Ignoring it also keeps the last real offset,
    // so the restore on close reads as no movement at all.
    if (mobileMenuOpen) {
      return;
    }

    setIsScrolled(y > CONDENSE_AT);

    const previous = lastScrollY.current;
    if (previous === null || y <= HIDE_BELOW) {
      lastScrollY.current = y;
      setScrollingDown(false);
      return;
    }

    const delta = y - previous;
    if (Math.abs(delta) < DIRECTION_THRESHOLD) {
      return;
    }
    lastScrollY.current = y;
    setScrollingDown(delta > 0);
  });

  // Off-screen while scrolling down past the hero, back the moment the user
  // scrolls up. Never hidden while the drawer is open: the same button that
  // closes it lives in this row, so hiding the bar would trap the user.
  const navHidden = scrollingDown && !mobileMenuOpen && !reduceMotion;
  // The island's surface is legibility, not decoration, so it appears for
  // everyone once the row sits over content. Only the extra flourish that rides
  // with it (the wordmark settling a few percent smaller) is motion.
  const isCondensed = isScrolled && !reduceMotion;
  // Shared-layout gliding is movement across the screen, which is exactly what
  // reduced motion asks us not to do; without a layoutId each indicator simply
  // appears on the link it belongs to.
  const glide = reduceMotion ? undefined : SPRING_SOFT;

  const closeMobileMenu = useCallback(() => {
    haptic("light");
    setMobileMenuOpen(false);
  }, [haptic]);

  const openMobileMenu = useCallback(() => {
    haptic("medium");
    setMobileMenuOpen(true);
  }, [haptic]);

  useBodyScrollLock(mobileMenuOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen, closeMobileMenu]);

  return (
    <motion.header
      animate={{ y: navHidden ? "-100%" : "0%" }}
      className="fixed top-0 right-0 left-0 z-50"
      data-no-callout
      initial={{ y: reduceMotion ? "0%" : "-100%" }}
      style={{ paddingTop: "var(--safe-top, 0px)" }}
      transition={SPRING_SOFT}
    >
      <div className="mx-auto max-w-7xl px-3 pt-2.5 pb-2 sm:px-5 md:px-6 lg:px-8 xl:px-10">
        <div className="relative">
          {/* The island. A separate layer from the row it sits behind, so the
              surface can fade and settle into place on its own while the row's
              box never moves: nothing here animates width, height, padding or
              a filter, and the blur class only flips while the layer is fully
              transparent, so it can never be caught mid-fade.

              The surface stays at 90% cream rather than going thinner and
              glassier: the blur is what sells the glass, and the nav labels
              have to clear 4.5:1 even when a violet fill scrolls underneath:
              at 80% that case lands at 3.9:1, at 90% it holds at 4.6:1. */}
          <motion.div
            animate={{
              opacity: isScrolled ? 1 : 0,
              scale: isScrolled || reduceMotion ? 1 : 1.03,
            }}
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 rounded-3xl border border-primary/10 bg-background/90 shadow-[0_16px_44px_-20px_hsl(var(--primary)/0.4)] md:rounded-full",
              isScrolled && "backdrop-blur-xl",
            )}
            initial={false}
            transition={
              reduceMotion ? { duration: DUR.fast, ease: EASE_OUT } : SPRING_SOFT
            }
          />

          <div className="relative flex h-16 items-center justify-between gap-2 px-2 md:h-[4.5rem] md:px-3">
            <motion.div
              animate={{ scale: isCondensed ? 0.95 : 1 }}
              className="flex min-w-0 items-center"
              style={{ transformOrigin: "left center" }}
              transition={SPRING_SOFT}
            >
              {/* `!rounded-full` on focus: the global `:focus-visible` rule in
                  index.css pins a 4px corner so the outline hugs the page's
                  many square-ish controls, and the header is all pills; a pill
                  that squares off the instant it takes focus reads as a
                  rendering bug. The bang is what beats an unlayered rule. */}
              <Link
                className="group flex min-h-11 items-center gap-2.5 rounded-full pr-2 focus-visible:!rounded-full"
                to="/"
              >
                <Monogram />
                {/* At `md` the seven links plus the language control own the
                    row, so the name steps back to the mark alone, but only
                    visually: it stays in the accessibility tree, which is where
                    this link gets its name from. */}
                <span className="whitespace-nowrap font-bold font-heading text-[1.0625rem] text-foreground leading-none tracking-tight md:sr-only lg:not-sr-only lg:text-lg">
                  <RippleLabel
                    accentFrom={BRAND_ACCENT_AT}
                    text={BRAND}
                    wave={!reduceMotion}
                  />
                </span>
              </Link>
            </motion.div>

            <nav
              aria-label={t.nav.navigation}
              className="hidden items-center md:flex"
            >
              <motion.ul
                animate="show"
                className="flex items-center gap-0.5"
                initial={reduceMotion ? "show" : "hidden"}
                onMouseLeave={() =>
                  setHover((h) => (h ? { ...h, on: false } : null))
                }
                variants={NAV_ROW}
              >
                {navLinks.map((link, index) => {
                  const isActive = isActivePath(location.pathname, link.targetId);
                  return (
                    <motion.li key={link.targetId} variants={NAV_ITEM}>
                      <Link
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "group relative flex min-h-11 items-center rounded-full px-3 font-medium text-sm transition-colors duration-200 ease-out focus-visible:!rounded-full lg:px-3.5",
                          isActive
                            ? "font-semibold text-primary"
                            : "text-muted-foreground hover:text-primary",
                        )}
                        onBlur={() =>
                          setHover((h) => (h ? { ...h, on: false } : null))
                        }
                        onFocus={() => setHover({ index, on: true })}
                        onMouseEnter={() => setHover({ index, on: true })}
                        to={link.targetId}
                      >
                        {/* One pill for the whole row: framer projects it from
                            the link the pointer left to the one it arrived at,
                            so the highlight travels instead of blinking. */}
                        {hover !== null && hover.index === index && (
                          <motion.span
                            animate={{ opacity: hover.on ? 1 : 0 }}
                            aria-hidden
                            className="absolute inset-0 rounded-full bg-primary/[0.07]"
                            initial={{ opacity: 0 }}
                            layoutId={
                              reduceMotion ? undefined : "navbar-hover-pill"
                            }
                            transition={
                              reduceMotion
                                ? { duration: DUR.fast, ease: EASE_OUT }
                                : SPRING_SOFT
                            }
                          />
                        )}
                        {/* The current page: a second shared element, so the
                            underline slides across the row on navigation while
                            the hover pill runs its own errand. A shape rather
                            than a colour alone, and `aria-current` above says
                            the same thing without one. */}
                        {isActive && (
                          <motion.span
                            aria-hidden
                            className="absolute inset-x-3 bottom-[0.3rem] h-[2.5px] rounded-full bg-gradient-to-r from-primary via-lilac to-primary shadow-[0_0_10px_hsl(var(--primary)/0.45)] lg:inset-x-3.5"
                            layoutId={
                              reduceMotion ? undefined : "navbar-active-pill"
                            }
                            transition={glide}
                          />
                        )}
                        <span className="relative">
                          <RippleLabel text={link.name} wave={!reduceMotion} />
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </motion.ul>
              <div className="ml-2 flex items-center lg:ml-3">
                <LanguageToggle />
              </div>
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2 md:hidden">
              <LanguageToggle />
              <motion.button
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
                className="group relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-primary/15 bg-primary/[0.06] transition-colors duration-200 ease-out hover:bg-primary/[0.12] focus-visible:!rounded-full"
                onClick={mobileMenuOpen ? closeMobileMenu : openMobileMenu}
                transition={SPRING_SOFT}
                whileHover={reduceMotion ? undefined : { scale: 1.05 }}
                whileTap={reduceMotion ? undefined : { scale: 0.94 }}
              >
                {/* Three bars that fold into a cross. */}
                <span className="relative flex h-5 w-5 items-center justify-center">
                  <motion.span
                    animate={{
                      rotate: mobileMenuOpen ? 45 : 0,
                      y: mobileMenuOpen ? 0 : -6,
                    }}
                    className="absolute h-0.5 w-[18px] origin-center rounded-full bg-primary"
                    transition={{ duration: DUR.fast, ease: EASE_OUT }}
                  />
                  <motion.span
                    animate={{
                      opacity: mobileMenuOpen ? 0 : 1,
                      scaleX: mobileMenuOpen ? 0 : 1,
                    }}
                    className="absolute h-0.5 w-[18px] origin-center rounded-full bg-primary"
                    transition={{ duration: DUR.fast, ease: EASE_OUT }}
                  />
                  <motion.span
                    animate={{
                      rotate: mobileMenuOpen ? -45 : 0,
                      y: mobileMenuOpen ? 0 : 6,
                    }}
                    className="absolute h-0.5 w-[18px] origin-center rounded-full bg-primary"
                    transition={{ duration: DUR.fast, ease: EASE_OUT }}
                  />
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      <NavbarMobileMenu
        activePath={location.pathname}
        nav={t.nav}
        navLinks={navLinks}
        onClose={closeMobileMenu}
        open={mobileMenuOpen}
      />
    </motion.header>
  );
}
