import { useEffect } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";
import DonateSection from "@/components/DonateSection";
import Footer from "@/components/Footer";
import { motion, useScroll, useSpring } from "framer-motion";

const Index = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  
  useEffect(() => {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
    
    
    document.body.style.fontFamily = "'Inter', sans-serif";
    
    
    const rootStyles = document.documentElement.style;
    
    
    rootStyles.setProperty('--primary-rgb', '37, 99, 235');
    
    
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.hash && anchor.hash.startsWith('#') && anchor.origin + anchor.pathname === window.location.origin + window.location.pathname) {
        e.preventDefault();
        const targetElement = document.querySelector(anchor.hash);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 80,
            behavior: 'smooth'
          });
          
          
          history.pushState(null, '', anchor.hash);
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    
    
    const style = document.createElement('style');
    style.textContent = `
      .highlight-text {
        display: inline-block;
        position: relative;
        color: var(--foreground);
        font-weight: 500;
      }
      
      .highlight-text::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 5px;
        background: linear-gradient(to right, rgba(var(--primary-rgb), 0.2), rgba(var(--primary-rgb), 0.05));
        border-radius: 4px;
        z-index: -1;
      }
      
      .gradient-border {
        position: relative;
      }
      
      .gradient-border::before {
        content: '';
        position: absolute;
        inset: -1px;
        background: linear-gradient(45deg, rgba(var(--primary-rgb), 0.3), transparent, rgba(var(--primary-rgb), 0.3));
        border-radius: inherit;
        z-index: -1;
        animation: border-rotate 8s linear infinite;
      }
      
      @keyframes border-rotate {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
      
      .link-hover {
        position: relative;
      }
      
      .link-hover::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 2px;
        bottom: -2px;
        left: 0;
        background: currentColor;
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 0.3s ease;
      }
      
      .link-hover:hover::after {
        transform: scaleX(1);
        transform-origin: left;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(fontLink);
      document.head.removeChild(style);
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <ThemeProvider defaultTheme="light">
      <motion.div 
        className="progress-bar fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/70 via-primary to-primary/70 z-[100]"
        style={{ scaleX, transformOrigin: "0%" }}
      />
      
      <Navbar />
      
      <main className="overflow-hidden">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ServicesSection />
        <ContactSection />
        <DonateSection />
      </main>
      
      <Footer />
    </ThemeProvider>
  );
};

export default Index;
