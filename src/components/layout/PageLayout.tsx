import { motion, useScroll, useSpring } from "framer-motion";
import { type ReactNode, useEffect, useState } from "react";
import { Footer, Navbar } from "@/components";
import { ThemedBackground } from "@/components/backgrounds/ThemedBackground";
import { ScrollToTopFab } from "@/components/layout/ScrollToTopFab";
import { ThemeProvider } from "@/components/theme-provider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { useViewportHeight } from "@/hooks/use-viewport-height";
import { LanguageProvider } from "@/lib/language-provider";

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
  // idle so it never competes with first paint / hydration — critical on phones,
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
    window.scrollTo(0, 0);
    document.body.style.fontFamily =
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif";
    const rootStyles = document.documentElement.style;
    rootStyles.setProperty("--primary-rgb", "37, 99, 235");
  }, []);

  return (
    <ThemeProvider defaultTheme="glass">
      <LanguageProvider defaultLanguage="en">
        {showVeil && <ThemedBackground />}
        <CustomCursor />

        {/* Scroll progress bar */}
        <motion.div
          className="progress-bar fixed top-0 right-0 left-0 z-[100] h-[2px] bg-gradient-to-r from-primary/70 via-primary to-primary/70"
          style={{ scaleX, transformOrigin: "0%" }}
        />

        {/* Aurora background — only visible on glass theme via CSS. Each orb is a
          radial-gradient glow rather than a solid circle behind `filter: blur()`:
          visually identical at these low alphas, but it skips the large offscreen
          blur buffers that make first paint crawl on mobile Safari. */}
        <div
          className="aurora-layer pointer-events-none fixed inset-0 -z-50 overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="aurora-orb absolute"
            style={{
              top: "-15%",
              left: "-8%",
              width: "900px",
              height: "900px",
              background:
                "radial-gradient(circle, hsl(var(--primary) / 0.18) 0%, transparent 72%)",
            }}
          />
          <div
            className="aurora-orb absolute"
            style={{
              bottom: "-20%",
              right: "-8%",
              width: "750px",
              height: "750px",
              background:
                "radial-gradient(circle, hsl(260 100% 68% / 0.13) 0%, transparent 72%)",
            }}
          />
          <div
            className="aurora-orb absolute"
            style={{
              top: "35%",
              right: "15%",
              width: "550px",
              height: "550px",
              background:
                "radial-gradient(circle, hsl(185 100% 58% / 0.09) 0%, transparent 72%)",
            }}
          />
          <div
            className="aurora-orb absolute"
            style={{
              bottom: "20%",
              left: "30%",
              width: "400px",
              height: "400px",
              background:
                "radial-gradient(circle, hsl(210 100% 70% / 0.07) 0%, transparent 72%)",
            }}
          />
        </div>

        <Navbar />

        <main className="min-h-screen-mobile w-full overflow-x-hidden pt-24 sm:pt-28 md:pt-32">
          {children}
        </main>

        <Footer />
        <ScrollToTopFab />
      </LanguageProvider>
    </ThemeProvider>
  );
}
