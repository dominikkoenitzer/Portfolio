import { ThemeProvider } from "@/context/ThemeContext";
import { Navbar, Footer, ContactSection } from "@/components";
import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect } from "react";

const Contact = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ThemeProvider defaultTheme="system">
      <motion.div 
        className="progress-bar fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/70 via-primary to-primary/70 z-[100]"
        style={{ scaleX, transformOrigin: "0%" }}
      />
      
      <Navbar />
      
      <main className="overflow-hidden">
        <ContactSection />
      </main>
      
      <Footer />
    </ThemeProvider>
  );
};

export default Contact;

