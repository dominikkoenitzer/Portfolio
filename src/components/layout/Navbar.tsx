
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Menu, X, Code, ChevronRight, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { NAV_LINKS } from "@/constants";

const navLinks = NAV_LINKS;

// Enhanced scroll to section with better offset calculation and active section tracking
const scrollToSection = (targetId: string) => {
  const element = document.getElementById(targetId);
  if (element) {
    // Calculate navbar height dynamically
    const navbar = document.querySelector('header');
    const navbarHeight = navbar ? navbar.offsetHeight : 80;
    
    const elementTop = element.getBoundingClientRect().top;
    const absoluteElementTop = elementTop + window.pageYOffset;
    const middle = absoluteElementTop - navbarHeight - 20; // Extra padding
    
    window.scrollTo({
      top: middle,
      behavior: 'smooth'
    });

    // Update URL hash without triggering scroll
    const currentUrl = new URL(window.location.href);
    currentUrl.hash = targetId;
    window.history.pushState({}, '', currentUrl);
  }
};

const handleNavigation = (targetId: string, pathname: string) => {
  if (pathname === '/') {
    // We're on the home page, scroll to section
    scrollToSection(targetId);
  } else {
    // We're on another page, navigate to home page with hash
    window.location.href = `/#${targetId}`;
  }
};

// Enhanced active section detection
const useActiveSection = () => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('header');
      const navbarHeight = navbar ? navbar.offsetHeight : 80;
      const scrollPosition = window.scrollY + navbarHeight + 50;

      for (const link of navLinks) {
        const element = document.getElementById(link.targetId);
        if (element) {
          const elementTop = element.offsetTop;
          const elementBottom = elementTop + element.offsetHeight;
          
          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveSection(link.targetId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return activeSection;
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const activeSection = useActiveSection();

  // Animation values for gesture controls
  const y = useMotionValue(0);
  const opacity = useTransform(y, [-100, 0], [0, 1]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Handle mobile menu state with animation timing
  const closeMobileMenu = useCallback(() => {
    setMenuClosing(true);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setMenuClosing(false);
    }, 200);
  }, []);

  const openMobileMenu = useCallback(() => {
    setMobileMenuOpen(true);
  }, []);

  // Touch gesture handlers for swipe-to-close
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const deltaY = touchStartY - currentY;
    
    if (deltaY > 0) {
      y.set(-Math.min(deltaY, 100));
    }
  };

  const handleTouchEnd = () => {
    const currentY = y.get();
    if (currentY < -50) {
      closeMobileMenu();
    }
    y.set(0);
  };

  const handlePanEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y < -50 || info.velocity.y < -500) {
      closeMobileMenu();
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-2xl border-b border-border/50 shadow-xl shadow-primary/5"
          : "bg-transparent"
      } transition-all duration-700`}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="group flex items-center text-xl md:text-2xl font-bold tracking-tight"
              aria-label="Go to home page"
            >
              <motion.span 
                className="h-10 w-10 mr-3 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center text-primary group-hover:from-primary/30 group-hover:via-primary/20 transition-all duration-300 shadow-lg shadow-primary/10"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Code className="h-5 w-5" />
              </motion.span>
              <motion.span 
                className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
                initial={false}
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
              >
                Dominik Könitzer
              </motion.span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-2 items-center">
            {navLinks.map((link, index) => {
              const isActive = activeSection === link.targetId;
              return (
                <motion.button
                  key={link.name}
                  onClick={() => handleNavigation(link.targetId, location.pathname)}
                  className={`relative px-4 py-2.5 text-sm font-medium rounded-lg group transition-all duration-300 ${
                    isActive 
                      ? 'text-primary bg-primary/10 shadow-md' 
                      : 'hover:text-primary hover:bg-primary/5'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  aria-label={`Navigate to ${link.name} section`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <motion.div
                      className="w-1 h-1 bg-primary rounded-full"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: isActive ? 1 : 0.6, 
                        opacity: isActive ? 1 : 0.4 
                      }}
                      transition={{ duration: 0.2 }}
                    />
                    {link.name}
                  </span>
                  <motion.span 
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.button>
              );
            })}
            <div className="ml-4 pl-4 border-l border-border/30">
              <ThemeToggle />
            </div>
          </nav>
          
          <div className="flex md:hidden items-center space-x-3">
            <ThemeToggle />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={mobileMenuOpen ? closeMobileMenu : openMobileMenu}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                className="h-11 w-11 rounded-xl bg-primary/5 hover:bg-primary/10 border border-border/30 transition-all duration-300"
              >
                <motion.div
                  animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Revolutionary Mobile Menu */}
      <AnimatePresence mode="wait">
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-md md:hidden z-40"
              onClick={closeMobileMenu}
            />
            
            {/* Menu Container */}
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: {
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                  staggerChildren: 0.1,
                  delayChildren: 0.1
                }
              }}
              exit={{ 
                opacity: 0, 
                y: -20, 
                scale: 0.95,
                transition: {
                  duration: 0.2,
                  ease: [0.22, 1, 0.36, 1]
                }
              }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 100 }}
              onPanEnd={handlePanEnd}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ y, opacity }}
              className="md:hidden absolute top-full left-0 right-0 mx-4 mt-2 rounded-2xl border border-border/50 bg-background/95 backdrop-blur-2xl shadow-2xl shadow-primary/10 z-50 overflow-hidden"
            >
              {/* Swipe Indicator */}
              <motion.div 
                className="flex justify-center pt-3 pb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-12 h-1 bg-border/50 rounded-full" />
              </motion.div>

              {/* Navigation Items */}
              <nav className="px-4 pb-6">
                <motion.div 
                  className="space-y-1"
                  initial="closed"
                  animate="open"
                  variants={{
                    open: {
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.2
                      }
                    },
                    closed: {
                      transition: {
                        staggerChildren: 0.05,
                        staggerDirection: -1
                      }
                    }
                  }}
                >
                  {navLinks.map((link, index) => {
                    const isActive = activeSection === link.targetId;
                    return (
                      <motion.div
                        key={link.name}
                        variants={{
                          open: {
                            opacity: 1,
                            y: 0,
                            transition: {
                              type: "spring",
                              stiffness: 300,
                              damping: 24
                            }
                          },
                          closed: {
                            opacity: 0,
                            y: 20,
                            transition: {
                              duration: 0.2
                            }
                          }
                        }}
                      >
                        <motion.button
                          onClick={() => {
                            handleNavigation(link.targetId, location.pathname);
                            closeMobileMenu();
                          }}
                          className={`w-full text-left p-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                            isActive 
                              ? 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary border border-primary/20' 
                              : 'hover:bg-primary/5 active:bg-primary/10'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          aria-label={`Navigate to ${link.name} section`}
                        >
                          {/* Background Gradient Effect */}
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5 rounded-xl"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '100%' }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                          />
                          
                          <div className="relative flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {isActive && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  className="w-2 h-2 bg-primary rounded-full"
                                />
                              )}
                              <div>
                                <span className={`text-lg font-semibold ${isActive ? 'text-primary' : ''}`}>
                                  {link.name}
                                </span>
                                {isActive && (
                                  <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-xs text-primary/70 font-medium"
                                  >
                                    Currently viewing
                                  </motion.div>
                                )}
                              </div>
                            </div>
                            
                            <motion.div
                              className={`transition-colors duration-200 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}
                              whileHover={{ x: 2 }}
                            >
                              <ArrowUpRight className="h-5 w-5" />
                            </motion.div>
                          </div>
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Footer Section */}
                <motion.div 
                  className="mt-6 pt-4 border-t border-border/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      Swipe up to close • Tap outside to dismiss
                    </p>
                  </div>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
