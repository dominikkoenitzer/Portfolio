import { motion, useScroll, useSpring } from "framer-motion";
import { type ReactNode, useEffect } from "react";
import { Footer, Navbar } from "@/components";
import { ThemeProvider } from "@/context/ThemeContext";

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

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.fontFamily =
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif";
    const rootStyles = document.documentElement.style;
    rootStyles.setProperty("--primary-rgb", "37, 99, 235");
  }, []);

  return (
    <ThemeProvider defaultTheme="system">
      <motion.div
        className="progress-bar fixed top-0 right-0 left-0 z-[100] h-1 bg-gradient-to-r from-primary/70 via-primary to-primary/70"
        style={{ scaleX, transformOrigin: "0%" }}
      />

      <Navbar />

      <main className="min-h-screen w-full overflow-x-hidden pt-24 sm:pt-28 md:pt-32">
        {children}
      </main>

      <Footer />
    </ThemeProvider>
  );
}
