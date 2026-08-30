import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV_LINKS } from "@/constants";
import { isActivePath } from "@/lib/active-path";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useHaptic } from "@/hooks/use-haptic";
import { useLanguage } from "@/lib/language-context";
import { DUR, EASE_OUT, SPRING_SOFT } from "@/lib/motion";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";
import { translations } from "@/lib/translations";
import { LanguageToggle } from "./LanguageToggle";
import { NavbarMobileMenu } from "./NavbarMobileMenu";

/** Offset at which the bar takes its condensed glass state. */
const CONDENSE_AT = 50;
/** The bar may only hide past this offset; nearer the top it always shows. */
const HIDE_BELOW = 80;
/** Movement smaller than this is jitter, not a direction change. */
const DIRECTION_THRESHOLD = 8;

const NAV_KEY_BY_PATH: Record<string, keyof typeof translations.en.nav> = {
  "/about": "about",
  "/timeline": "timeline",
  "/skills": "skills",
  "/projects": "projects",
  "/services": "services",
  "/contact": "contact",
  "/donate": "donate",
};

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollingDown, setScrollingDown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [reduceMotion] = useState(prefersReducedMotion);
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
  // Transform-only condense: no height, padding or filter animates.
  const isCondensed = isScrolled && !reduceMotion;

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
      className={`fixed top-0 right-0 left-0 z-50 ${
        isScrolled
          ? "scrolled-nav border-border/50 border-b bg-background/90 shadow-primary/5 shadow-xl backdrop-blur-2xl"
          : "bg-transparent"
      } transition-[background-color,border-color,box-shadow] duration-300 ease-out`}
      data-no-callout
      initial={{ y: reduceMotion ? "0%" : "-100%" }}
      style={{ paddingTop: "var(--safe-top, 0px)" }}
      transition={SPRING_SOFT}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* The bar keeps its height; only its contents ride a few pixels up, so
            the condense is a transform and never a layout pass. */}
        <motion.div
          animate={{ y: isCondensed ? -3 : 0 }}
          className="flex h-20 items-center justify-between"
          transition={SPRING_SOFT}
        >
          <motion.div
            animate={{ scale: isCondensed ? 0.92 : 1 }}
            className="flex items-center"
            style={{ transformOrigin: "left center" }}
            transition={SPRING_SOFT}
          >
            <Link
              className="group flex items-center font-bold text-xl tracking-tight md:text-2xl"
              to="/"
            >
              <span className="text-foreground">Dominik Könitzer</span>
            </Link>
          </motion.div>

          <nav
            aria-label={t.nav.navigation}
            className="hidden items-center space-x-2 md:flex"
          >
            {navLinks.map((link, index) => {
              const isActive = isActivePath(location.pathname, link.targetId);
              return (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: -10 }}
                  key={link.name}
                  transition={{
                    delay: index * 0.1,
                    duration: DUR.base,
                    ease: EASE_OUT,
                  }}
                >
                  <Link
                    className={`group relative block rounded-lg px-4 py-2.5 font-medium text-sm transition-colors duration-200 ease-out ${
                      isActive
                        ? "text-primary"
                        : "hover:bg-primary/5 hover:text-primary"
                    }`}
                    to={link.targetId}
                  >
                    {/* One shared pill for the whole bar: framer projects it
                        from the previously active link to this one, so the
                        highlight slides instead of blinking across. Same
                        radius/tint/shadow the active link carried inline. */}
                    {isActive && (
                      <motion.span
                        className="absolute inset-0 rounded-lg bg-primary/10 shadow-md"
                        layoutId="navbar-active-pill"
                        transition={SPRING_SOFT}
                      />
                    )}
                    <span className="relative z-10">{link.name}</span>
                    <motion.span
                      className="absolute inset-0 rounded-lg bg-primary/[0.08]"
                      initial={{ opacity: 0 }}
                      transition={{ duration: DUR.fast, ease: EASE_OUT }}
                      whileHover={{ opacity: 1 }}
                    />
                  </Link>
                </motion.div>
              );
            })}
            <div className="ml-4 flex items-center gap-1 border-border/30 border-l pl-4">
              <LanguageToggle />
            </div>
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-3 md:hidden">
            <LanguageToggle />
            <motion.button
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
              className="group relative flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 transition-colors duration-200 ease-out hover:from-primary/20 hover:to-primary/10"
              onClick={mobileMenuOpen ? closeMobileMenu : openMobileMenu}
              transition={SPRING_SOFT}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{
                  opacity: mobileMenuOpen ? 1 : 0.5,
                  scale: mobileMenuOpen ? 1.1 : 1,
                }}
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5"
                transition={{ duration: DUR.fast, ease: EASE_OUT }}
              />

              <div className="relative flex h-5 w-5 flex-col items-center justify-center">
                <motion.span
                  animate={{
                    rotate: mobileMenuOpen ? 45 : 0,
                    y: mobileMenuOpen ? 0 : -6,
                  }}
                  className="absolute h-0.5 w-5 origin-center rounded-full bg-primary"
                  transition={{ duration: DUR.fast, ease: EASE_OUT }}
                />
                <motion.span
                  animate={{
                    opacity: mobileMenuOpen ? 0 : 1,
                    scale: mobileMenuOpen ? 0 : 1,
                  }}
                  className="absolute h-0.5 w-5 origin-center rounded-full bg-primary"
                  transition={{ duration: DUR.fast, ease: EASE_OUT }}
                />
                <motion.span
                  animate={{
                    rotate: mobileMenuOpen ? -45 : 0,
                    y: mobileMenuOpen ? 0 : 6,
                  }}
                  className="absolute h-0.5 w-5 origin-center rounded-full bg-primary"
                  transition={{ duration: DUR.fast, ease: EASE_OUT }}
                />
              </div>
            </motion.button>
          </div>
        </motion.div>
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
