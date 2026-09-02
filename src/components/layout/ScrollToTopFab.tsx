import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { haptic } from "@/hooks/use-haptic";
import { useLanguage } from "@/lib/language-context";
import { SPRING_SOFT } from "@/lib/motion";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";
import { translations } from "@/lib/translations";

/**
 * Floating action button that appears once the user has scrolled past a
 * threshold. Tapping it returns to the top with smooth scroll behavior and a
 * subtle haptic tick. Stays inside the iOS gesture-bar safe area.
 */
export function ScrollToTopFab() {
  const [visible, setVisible] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const lenis = useLenis();
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    let ticking = false;
    const update = () => {
      setVisible(window.scrollY > 600);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The mobile drawer flags itself on <html>. Stand down while it is open: the
  // backdrop covers this button but leaves it in the tab order, and a stray
  // arrow floating over a full-screen menu reads as a rendering slip. One
  // observer, filtered to the single attribute, so it fires twice per open.
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setNavOpen(root.dataset.navOpen === "true");
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, {
      attributeFilter: ["data-nav-open"],
      attributes: true,
    });
    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    haptic("light");
    // Drive the return through Lenis when it's active so the smooth scroll and
    // Lenis's internal target stay in sync. Without Lenis (reduced motion), jump
    // instantly, an explicit behavior:"smooth" would animate despite the
    // reduced-motion CSS, since it overrides the `scroll-behavior` property.
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    }
  };

  return (
    <AnimatePresence>
      {visible && !navOpen && (
        <motion.button
          animate={{ opacity: 1, scale: 1, y: 0 }}
          aria-label={t.nav.backToTop}
          // Clear of the thumb zone on a phone, where card actions are
          // full-width controls ending at the same right edge.
          className="fixed right-4 bottom-20 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-card text-primary shadow-sm transition-colors hover:bg-primary/10 active:bg-primary/15 sm:right-6 sm:bottom-6"
          exit={{ opacity: 0, scale: 0.8, y: 16 }}
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          onClick={handleClick}
          style={{
            paddingBottom: "0px",
            marginBottom: "var(--safe-bottom, 0px)",
          }}
          transition={SPRING_SOFT}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowUp className="h-5 w-5" strokeWidth={2.4} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
