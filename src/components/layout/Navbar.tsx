import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SearchTrigger } from "@/components/search/SearchTrigger";
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

/**
 * The palette reaches the whole project catalogue, the timeline and the FAQ
 * copy, so it is loaded on demand. The specifiers are written once and reused
 * as the preload, so hovering the button and clicking it ask for one chunk.
 */
const loadSearchDialog = () => import("@/components/search/SearchDialog");
const loadSearchIndex = () => import("@/components/search/search-index");

/**
 * The palette is held in state rather than behind `React.lazy`, which is the
 * one place this file departs from the pattern the rest of the app uses.
 * `lazy` needs a Suspense boundary, and React throttles the reveal of content
 * that replaces a fallback by ~300ms: with the chunk already in memory the
 * panel still took 330ms to appear, all of it that throttle. Loaded into state
 * by the preload below, the component is simply there when the visitor asks
 * for it and the panel mounts on the next frame. The props type is read back
 * off the import, so it cannot drift from the component's own.
 */
type SearchDialogComponent = Awaited<
  ReturnType<typeof loadSearchDialog>
>["default"];

/**
 * What stands in for the palette while its chunk is still in flight: the same
 * wash and the same card, with the field's own geometry, so a slow network
 * shows an empty search rather than nothing at all. Everything below the input
 * row belongs to the real panel, which replaces this the moment it resolves.
 * With the preloads on hover, focus and the modifier key, this is rarely seen.
 */
function SearchShell({ hint, label }: { hint: string; label: string }) {
  return (
    // Announced rather than hidden: it covers the page with an opaque wash, so
    // an assistive technology that was told nothing would leave its user on a
    // trigger they can no longer see. Escape still closes it.
    <div
      aria-busy="true"
      aria-label={label}
      aria-modal="true"
      className="fixed inset-0 z-[80]"
      role="dialog"
    >
      <div className="absolute inset-0 bg-background/95" />
      <div className="absolute inset-0 flex justify-center sm:px-4 sm:pt-28">
        <div className="flex h-14 w-full max-w-xl items-center gap-3 overflow-hidden rounded-b-2xl border-border/60 border-b bg-card px-4 shadow-sm sm:rounded-2xl sm:border">
          <Search className="size-[18px] shrink-0 text-muted-foreground" />
          <span className="truncate text-base text-muted-foreground">
            {hint}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Offset at which the bar takes its condensed island state. */
const CONDENSE_AT = 50;
/** The bar may only hide past this offset; nearer the top it always shows. */
const HIDE_BELOW = 80;
/** Movement smaller than this is jitter, not a direction change. */
const DIRECTION_THRESHOLD = 8;

const NAV_KEY_BY_PATH: Record<string, keyof typeof translations.en.nav> = {
  "/": "home",
  "/about": "about",
  "/experience": "experience",
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

/**
 * The cream surface a cluster takes once the row sits over content, so the
 * labels stay legible. It fills its parent, which is sized by the cluster's
 * own padding, so the pill hugs what it stands behind instead of stretching
 * across the page. The blur class only flips while the layer is transparent,
 * so it is never caught mid-fade. 90% cream is opaque enough that the labels
 * measure 10:1 over the content the pill covers (worst of /projects,
 * /services, /about and /donate at 1440); unscrolled, straight over the
 * aurora, they measure 6.1:1.
 */
function Island({ show, tight }: { show: boolean; tight?: boolean }) {
  return (
    <motion.div
      animate={{ opacity: show ? 1 : 0 }}
      aria-hidden
      /* `left` is written on its own rather than through `inset-0` plus an
         override: two utilities that set the same property leave the winner to
         Tailwind's own ordering, which is not something to bet a layout on. */
      className={cn(
        "pointer-events-none absolute top-0 right-0 bottom-0 rounded-full border border-border/60 bg-background/90 shadow-sm",
        tight ? "left-2" : "left-0",
        show && "backdrop-blur-xl",
      )}
      initial={false}
      transition={{ duration: DUR.fast, ease: EASE_OUT }}
    />
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollingDown, setScrollingDown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  // Counts openings, and stays 0 until the first one: it mounts the dialog and
  // then re-keys it, so every opening starts on an empty query and a fresh
  // highlight without the panel writing its own state from an effect.
  const [searchSession, setSearchSession] = useState(0);
  const [SearchDialog, setSearchDialog] = useState<SearchDialogComponent | null>(
    null,
  );
  const [reduceMotion] = useState(prefersReducedMotion);
  // Which link the pointer/keyboard is on, and whether it is still there. The
  // `on` flag exists so the travelling pill can fade out where it stands: a
  // shared-layout element only glides while a single instance stays mounted, so
  // unmounting it on mouse-out would make it vanish instead.
  const [hover, setHover] = useState<{ index: number; on: boolean } | null>(
    null,
  );
  const searchReturnFocus = useRef<HTMLElement | null>(null);
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

  /**
   * Everything the first open would otherwise pay for: the chunk, and the
   * index itself. Building it is not free the first time, because it is the
   * call that pulls in the project catalogue and warms the platform's date and
   * unicode tables, which measured ~320ms of the first open on its own. After
   * this the index module has it cached and opening is one frame.
   */
  const preloadSearch = useCallback(() => {
    loadSearchDialog()
      // The updater form, because the value is itself a function.
      .then((module) => setSearchDialog(() => module.default))
      .catch(() => {});
    loadSearchIndex()
      .then((module) => module.buildSearchIndex(language, t))
      .catch(() => {});
  }, [language, t]);

  const openSearch = useCallback(() => {
    haptic("medium");
    // A cold open (before hover, focus, the modifier key or the idle window
    // have armed it) starts the load here and shows the shell until it lands.
    preloadSearch();
    // Captured here, not in the dialog: the drawer hands focus back to the
    // hamburger as it closes, and that runs first, so the dialog would see the
    // wrong element as the control to return focus to.
    searchReturnFocus.current = document.activeElement as HTMLElement | null;
    // The drawer covers the header and locks the page; two overlays at once
    // would fight over both. The lock below stays on throughout, because it
    // reads one flag for both.
    setMobileMenuOpen(false);
    setSearchSession((session) => session + 1);
    setSearchOpen(true);
  }, [haptic, preloadSearch]);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
  }, []);

  useBodyScrollLock(mobileMenuOpen || searchOpen);

  // Arm the palette once the browser has nothing better to do, so the first
  // open is never the slow one. Hover, focus and the modifier key all preload
  // as well, but a visitor who goes straight for the shortcut touches none of
  // them, and that first open measured a third of a second.
  useEffect(() => {
    const idle = window.requestIdleCallback;
    if (idle) {
      // The aurora animates on its own rAF, so this page is never truly idle
      // and the callback lands on its timeout. Two seconds is late enough to
      // be clear of first paint and early enough that a visitor reaching for
      // the shortcut finds the chunk already there.
      const id = idle(preloadSearch, { timeout: 2000 });
      return () => window.cancelIdleCallback?.(id);
    }
    const timer = window.setTimeout(preloadSearch, 2000);
    return () => window.clearTimeout(timer);
  }, [preloadSearch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        closeMobileMenu();
      }
      // Escape is handled inside the panel as well, for the case where focus
      // has been moved out of it; both paths just close.
      if (e.key === "Escape" && searchOpen) {
        closeSearch();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen, closeMobileMenu, searchOpen, closeSearch]);

  return (
    <motion.header
      animate={{ y: navHidden ? "-100%" : "0%" }}
      /* `pointer-events-none`, re-enabled on the two clusters below: the bar
         spans the whole width but is now mostly empty, and a centred row that
         swallowed clicks in both of its flanks would be worse than the
         right-aligned one that swallowed them in one. */
      className="pointer-events-none fixed top-0 right-0 left-0 z-50"
      data-no-callout
      initial={{ y: reduceMotion ? "0%" : "-100%" }}
      style={{ paddingTop: "var(--safe-top, 0px)" }}
      transition={SPRING_SOFT}
    >
      {/* The page's own gutter ladder and column cap, so the row is measured
          against the same box as the hero and the footer. Because the box is
          `mx-auto`, its centre is the viewport's centre: anything centred
          inside it lands on the page axis at every width. */}
      <div className="mx-auto max-w-7xl px-6 pt-2.5 pb-2 sm:px-8 md:px-12 lg:px-16">
        {/* The row itself: one centred group in flow, one cluster out of it. */}
        <div className="relative flex h-16 items-center justify-center md:h-[4.5rem]">
          {/* No mark or wordmark: Home is the first entry of the nav list, so
              the whole row is one set of links and nothing else. That is what
              lets it be centred honestly: the group holds only the eight
              links, so its geometric centre is also its optical centre. */}
          <nav
            aria-label={t.nav.navigation}
            className="pointer-events-auto relative hidden w-fit shrink-0 lg:block"
          >
            <Island show={isScrolled} />

            <motion.ul
              animate="show"
              /* `relative` so the row paints above the island, which is a
                 positioned sibling earlier in the tree. The px-4 is the
                 pill's air: it sits on this element, not on the surface, so
                 the surface can only ever be the row plus 16px each side. */
              className="relative flex h-16 items-center gap-0.5 px-4 md:h-[4.5rem]"
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
                        // Ink, not the muted slate: at the top of the page
                        // the row sits on the strongest part of the aurora,
                        // where slate lands at 3.1:1 and ink at about 9:1.
                        // The current page is marked by the violet underline
                        // below and by `aria-current`, so the label itself
                        // does not have to carry a second, weaker signal.
                        // One padding at every width: the French row is the
                        // widest, and at 1024 the roomier lg padding brought
                        // it within 15px of the language button.
                        "group relative flex min-h-11 items-center whitespace-nowrap rounded-full px-3 font-medium text-sm transition-colors duration-200 ease-out",
                        isActive
                          ? "font-semibold text-foreground"
                          : "text-foreground/90 hover:text-foreground",
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
                          className="absolute inset-x-3 bottom-[0.3rem] h-[2px] rounded-full bg-primary"
                          layoutId={
                            reduceMotion ? undefined : "navbar-active-pill"
                          }
                          transition={glide}
                        />
                      )}
                      <span className="relative">{link.name}</span>
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>
          </nav>

          {/* The utilities park at the gutter, out of flow, so they cannot
              pull the links off the axis: inside the centred group the
              language button alone shifted every label 28px to the left. Out
              of flow also means the nav's centring is language- and
              breakpoint-independent, which is the whole point.
              `-right-4` cancels this cluster's own 16px of pill air, so the
              control that is actually visible at the top of the page lines up
              with the page column rather than sitting 16px inside it; the
              surface overhangs into the gutter, which is where the old
              right-aligned bar put it too. */}
          <div className="-right-4 pointer-events-auto absolute inset-y-0 flex items-center">
            <div className="relative flex h-16 items-center md:h-[4.5rem]">
              <Island show={isScrolled} tight />
              <div className="relative flex items-center gap-1.5 px-4">
                {/* Two forms of one control: the input-shaped bar where the row
                    has room for it, the 44px circle where it does not. At 1024
                    the French link row leaves 11px between its last label and
                    this cluster, so a 160px bar cannot live there. */}
                <SearchTrigger
                  onOpen={openSearch}
                  onPreload={preloadSearch}
                />
                <LanguageToggle />
                <button
                  aria-expanded={mobileMenuOpen}
                  aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
                  className="group relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-primary/15 bg-primary/[0.06] transition-colors duration-200 ease-out hover:bg-primary/[0.12] lg:hidden"
                  onClick={mobileMenuOpen ? closeMobileMenu : openMobileMenu}
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
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <NavbarMobileMenu
        activePath={location.pathname}
        nav={t.nav}
        navLinks={navLinks}
        onClose={closeMobileMenu}
        onOpenSearch={openSearch}
        onPreloadSearch={preloadSearch}
        open={mobileMenuOpen}
      />

      {/* Mounted from the first opening onwards, so the panel can animate out;
          the key makes each opening a fresh panel with an empty query. */}
      {SearchDialog && searchSession > 0 ? (
        <SearchDialog
          key={searchSession}
          onClose={closeSearch}
          open={searchOpen}
          returnFocusTo={searchReturnFocus}
        />
      ) : null}
      {/* The one frame (or the one slow network) where the palette has been
          asked for and its chunk has not landed. Escape still closes it. */}
      {searchOpen && !SearchDialog ? (
        <SearchShell hint={t.search.placeholder} label={t.search.label} />
      ) : null}
    </motion.header>
  );
}
