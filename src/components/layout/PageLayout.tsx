import { motion, useScroll, useSpring } from "framer-motion";
import { lazy, type ReactNode, Suspense, useEffect } from "react";
import { Footer, Navbar } from "@/components";

// Decorative WebGL background — defer it (and the ~70KB ogl lib) off the
// critical path so first paint isn't blocked by it.
const LightVeilBackground = lazy(
  () => import("@/components/backgrounds/LightVeilBackground")
);
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
        <Suspense fallback={null}>
          <LightVeilBackground />
        </Suspense>
        <CustomCursor />

      {/* Scroll progress bar */}
      <motion.div
        className="progress-bar fixed top-0 right-0 left-0 z-[100] h-[2px] bg-gradient-to-r from-primary/70 via-primary to-primary/70"
        style={{ scaleX, transformOrigin: "0%" }}
      />

      {/* Aurora background — only visible on glass theme via CSS */}
      <div className="aurora-layer pointer-events-none fixed inset-0 -z-50 overflow-hidden" aria-hidden="true">
        <div
          className="aurora-orb absolute"
          style={{
            top: "-15%",
            left: "-8%",
            width: "900px",
            height: "900px",
            background: "hsl(var(--primary) / 0.18)",
            filter: "blur(160px)",
            borderRadius: "50%",
          }}
        />
        <div
          className="aurora-orb absolute"
          style={{
            bottom: "-20%",
            right: "-8%",
            width: "750px",
            height: "750px",
            background: "hsl(260 100% 68% / 0.13)",
            filter: "blur(150px)",
            borderRadius: "50%",
          }}
        />
        <div
          className="aurora-orb absolute"
          style={{
            top: "35%",
            right: "15%",
            width: "550px",
            height: "550px",
            background: "hsl(185 100% 58% / 0.09)",
            filter: "blur(130px)",
            borderRadius: "50%",
          }}
        />
        <div
          className="aurora-orb absolute"
          style={{
            bottom: "20%",
            left: "30%",
            width: "400px",
            height: "400px",
            background: "hsl(210 100% 70% / 0.07)",
            filter: "blur(110px)",
            borderRadius: "50%",
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
