import { ReactNode, useEffect } from "react";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Navbar, Footer } from "@/components";
import { OverscrollBackground } from "./OverscrollBackground";
import { motion, useScroll, useSpring } from "framer-motion";

interface PageLayoutProps {
  children: ReactNode;
}

function PageLayoutContent({ children }: PageLayoutProps) {
  const { scrollYProgress } = useScroll();
  const { themeColors } = useTheme();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif";
    const rootStyles = document.documentElement.style;
    rootStyles.setProperty('--primary-rgb', '37, 99, 235');
    
    // Ensure main element has background color matching theme
    const mainElement = document.querySelector('main');
    if (mainElement) {
      const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--background');
      if (bgColor) {
        (mainElement as HTMLElement).style.backgroundColor = `hsl(${bgColor.trim()})`;
      }
    }
  }, []);

  const backgroundColor = `hsl(${themeColors.background})`;

  return (
    <>
      <OverscrollBackground backgroundColor={backgroundColor} />
      <motion.div 
        className="progress-bar fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/70 via-primary to-primary/70 z-[100]"
        style={{ scaleX, transformOrigin: "0%" }}
      />
      
      <Navbar />
      
      <main className="overflow-x-hidden w-full min-h-screen">
        {children}
      </main>
      
      <Footer />
    </>
  );
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <ThemeProvider defaultTheme="system">
      <PageLayoutContent>{children}</PageLayoutContent>
    </ThemeProvider>
  );
}

