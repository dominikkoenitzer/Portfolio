import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV_LINKS } from "@/constants";
import { isActivePath } from "@/lib/active-path";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useHaptic } from "@/hooks/use-haptic";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { LanguageToggle } from "./LanguageToggle";
import { NavbarMobileMenu } from "./NavbarMobileMenu";
import { ThemeToggle } from "./ThemeToggle";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language];
  const haptic = useHaptic();
  const scrollDirection = useScrollDirection(8, 100);
  const navLinks = NAV_LINKS.map((link) => ({
    ...link,
    name: t.nav[NAV_KEY_BY_PATH[link.targetId]] ?? link.name,
  }));

  // Hide the bar when scrolling down past the hero, show on scroll-up.
  // Always visible while the menu is open so the user can find the close button.
  const navHidden = !mobileMenuOpen && isScrolled && scrollDirection === "down";

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
    const handleScroll = () => {
      if (!mobileMenuOpen) {
        setIsScrolled(window.scrollY > 50);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen, closeMobileMenu]);

  return (
    <motion.header
      animate={{ y: navHidden ? -120 : 0 }}
      className={`fixed top-0 right-0 left-0 z-50 ${
        isScrolled
          ? "scrolled-nav border-border/50 border-b bg-background/90 shadow-primary/5 shadow-xl backdrop-blur-2xl"
          : "bg-transparent"
      } transition-all duration-700`}
      data-no-callout
      initial={{ y: -100 }}
      style={{ paddingTop: "var(--safe-top, 0px)" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link
              className="group flex items-center font-bold text-xl tracking-tight md:text-2xl"
              to="/"
            >
              <span className="text-foreground">Dominik Könitzer</span>
            </Link>
          </div>

          <nav className="hidden items-center space-x-2 md:flex">
            {navLinks.map((link, index) => {
              const isActive = isActivePath(location.pathname, link.targetId);
              return (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: -10 }}
                  key={link.name}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    className={`group relative block rounded-lg px-4 py-2.5 font-medium text-sm transition-all duration-300 ${
                      isActive
                        ? "bg-primary/10 text-primary shadow-md"
                        : "hover:bg-primary/5 hover:text-primary"
                    }`}
                    to={link.targetId}
                  >
                    <span className="relative z-10">{link.name}</span>
                    <motion.span
                      className="absolute inset-0 rounded-lg bg-primary/[0.08]"
                      initial={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      whileHover={{ opacity: 1 }}
                    />
                  </Link>
                </motion.div>
              );
            })}
            <div className="ml-4 flex items-center gap-1 border-border/30 border-l pl-4">
              <ThemeToggle />
              <LanguageToggle />
            </div>
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-3 md:hidden">
            <ThemeToggle />
            <LanguageToggle />
            <motion.button
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
              className="group relative flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 transition-all duration-300 hover:from-primary/20 hover:to-primary/10"
              onClick={mobileMenuOpen ? closeMobileMenu : openMobileMenu}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{
                  opacity: mobileMenuOpen ? 1 : 0.5,
                  scale: mobileMenuOpen ? 1.1 : 1,
                }}
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5"
                transition={{ duration: 0.3 }}
              />

              <div className="relative flex h-5 w-5 flex-col items-center justify-center">
                <motion.span
                  animate={{
                    rotate: mobileMenuOpen ? 45 : 0,
                    y: mobileMenuOpen ? 0 : -6,
                  }}
                  className="absolute h-0.5 w-5 origin-center rounded-full bg-primary"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.span
                  animate={{
                    opacity: mobileMenuOpen ? 0 : 1,
                    scale: mobileMenuOpen ? 0 : 1,
                  }}
                  className="absolute h-0.5 w-5 origin-center rounded-full bg-primary"
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.span
                  animate={{
                    rotate: mobileMenuOpen ? -45 : 0,
                    y: mobileMenuOpen ? 0 : 6,
                  }}
                  className="absolute h-0.5 w-5 origin-center rounded-full bg-primary"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </motion.button>
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
