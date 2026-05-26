import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { haptic } from "@/hooks/use-haptic";

/**
 * Floating action button that appears once the user has scrolled past a
 * threshold. Tapping it returns to the top with smooth scroll behavior and a
 * subtle haptic tick. Stays inside the iOS gesture-bar safe area.
 */
export function ScrollToTopFab() {
  const [visible, setVisible] = useState(false);

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

  const handleClick = () => {
    haptic("light");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          animate={{ opacity: 1, scale: 1, y: 0 }}
          aria-label="Scroll to top"
          className="fixed right-4 bottom-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-background/80 text-primary shadow-lg shadow-primary/15 backdrop-blur-xl transition-colors active:bg-primary/15 sm:right-6 sm:bottom-6 md:hidden"
          exit={{ opacity: 0, scale: 0.8, y: 16 }}
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          onClick={handleClick}
          style={{
            paddingBottom: "0px",
            marginBottom: "var(--safe-bottom, 0px)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowUp className="h-5 w-5" strokeWidth={2.4} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
