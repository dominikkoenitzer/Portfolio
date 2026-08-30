import { motion, useScroll, useSpring } from "framer-motion";
import { lazy, type ReactNode, Suspense, useEffect, useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollToTopFab } from "@/components/layout/ScrollToTopFab";
import { SkipLink } from "@/components/layout/SkipLink";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { useViewportHeight } from "@/hooks/use-viewport-height";
import { LanguageProvider } from "@/lib/language-provider";

// Pulls in the ~70KB ogl lib, so it stays lazy and off the critical path.
const GrainientBackground = lazy(
  () => import("@/components/backgrounds/GrainientBackground"),
);

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Keeps --vh in sync with the real visual viewport so 100vh layouts
  // don't overshoot iOS Safari's collapsing toolbar.
  useViewportHeight();

  // Hold the WebGL background (GL context + shader compile) until the browser is
  // idle so it never competes with first paint / hydration, critical on phones,
  // where that work otherwise lands right in the middle of the initial render.
  const [showVeil, setShowVeil] = useState(false);
  useEffect(() => {
    const idle = window.requestIdleCallback;
    if (idle) {
      const id = idle(() => setShowVeil(true), { timeout: 2000 });
      return () => window.cancelIdleCallback?.(id);
    }
    const t = setTimeout(() => setShowVeil(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Own scroll position ourselves: the browser's automatic restore on reload/
    // back-forward would otherwise fight Lenis (leaving its internal target out
    // of sync). We always land at the top on load and reset on every route
    // change (see AnimatedRoutes), so manual restoration is consistent.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    document.body.style.fontFamily =
      "'Zen Kaku Gothic New', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif";
  }, []);

  return (
    <LanguageProvider defaultLanguage="en">
      <SkipLink />
      {showVeil && (
        <Suspense fallback={null}>
          <GrainientBackground />
        </Suspense>
      )}
      <CustomCursor />

      {/* Scroll progress bar */}
      <motion.div
        className="progress-bar fixed top-0 right-0 left-0 z-[100] h-[2px] bg-gradient-to-r from-primary/70 via-primary to-primary/70"
        style={{ scaleX, transformOrigin: "0%" }}
      />

      <Navbar />

      <main
        className="min-h-screen-mobile w-full overflow-x-hidden pt-24 focus:outline-none sm:pt-28 md:pt-32"
        id="main-content"
        tabIndex={-1}
      >
        {children}
      </main>

      <Footer />
      <ScrollToTopFab />
    </LanguageProvider>
  );
}
