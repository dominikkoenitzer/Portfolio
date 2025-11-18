
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, ArrowUpRight, ChevronRight, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { NAV_LINKS } from "@/constants";

const navLinks = NAV_LINKS;

// Navigation is now handled by React Router

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Handle mobile menu state
  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const openMobileMenu = useCallback(() => {
    setMobileMenuOpen(true);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (!mobileMenuOpen) {
        const scrollPosition = window.scrollY;
        setIsScrolled(scrollPosition > 50);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        closeMobileMenu();
      }
    };


    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen, closeMobileMenu]);


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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
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
              const isActive = location.pathname === link.targetId;
              return (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.targetId}
                    className={`relative px-4 py-2.5 text-sm font-medium rounded-lg group transition-all duration-300 block ${
                      isActive 
                        ? 'text-primary bg-primary/10 shadow-md' 
                        : 'hover:text-primary hover:bg-primary/5'
                    }`}
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
                  </Link>
                </motion.div>
              );
            })}
            <div className="ml-4 pl-4 border-l border-border/30">
              <ThemeToggle />
            </div>
          </nav>
          
          <div className="flex md:hidden items-center gap-2.5 sm:gap-3">
            <ThemeToggle />
            <motion.button
              onClick={mobileMenuOpen ? closeMobileMenu : openMobileMenu}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="relative h-11 w-11 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 border border-primary/20 transition-all duration-300 flex-shrink-0 flex items-center justify-center group overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated background glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl"
                animate={{
                  opacity: mobileMenuOpen ? 1 : 0.5,
                  scale: mobileMenuOpen ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Custom Hamburger Icon */}
              <div className="relative w-5 h-5 flex flex-col justify-center items-center">
                <motion.span
                  className="absolute w-5 h-0.5 bg-primary rounded-full origin-center"
                  animate={{
                    rotate: mobileMenuOpen ? 45 : 0,
                    y: mobileMenuOpen ? 0 : -6,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
                <motion.span
                  className="absolute w-5 h-0.5 bg-primary rounded-full origin-center"
                  animate={{
                    opacity: mobileMenuOpen ? 0 : 1,
                    scale: mobileMenuOpen ? 0 : 1,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
                <motion.span
                  className="absolute w-5 h-0.5 bg-primary rounded-full origin-center"
                  animate={{
                    rotate: mobileMenuOpen ? -45 : 0,
                    y: mobileMenuOpen ? 0 : 6,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Modern Full-Screen Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 bg-background/95 backdrop-blur-xl md:hidden z-40"
            />
            
            {/* Full-Screen Menu Container */}
            <motion.div
              ref={menuRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 300,
                mass: 0.8
              }}
              className="md:hidden fixed inset-y-0 right-0 w-full max-w-md bg-gradient-to-br from-background via-background to-background/95 backdrop-blur-2xl z-50 shadow-2xl shadow-primary/10 border-l border-border/50 overflow-y-auto overscroll-contain"
            >
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
              </div>


              {/* Header Section */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="relative z-10 px-6 pt-8 pb-6 border-b border-border/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center border border-primary/20"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Code className="h-6 w-6 text-primary" />
                    </motion.div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">Menu</h2>
                      <p className="text-xs text-muted-foreground">Navigation</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={closeMobileMenu}
                    className="h-10 w-10 rounded-xl bg-muted/50 hover:bg-muted border border-border/50 flex items-center justify-center transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5 text-foreground/70" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Navigation Items */}
              <nav className="relative z-10 px-6 py-6">
                <motion.div
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
                  className="space-y-3"
                >
                  {navLinks.map((link, index) => {
                    const isActive = location.pathname === link.targetId;
                    return (
                      <motion.div
                        key={link.name}
                        variants={{
                          open: {
                            opacity: 1,
                            x: 0,
                            transition: {
                              type: "spring",
                              stiffness: 300,
                              damping: 25
                            }
                          },
                          closed: {
                            opacity: 0,
                            x: 50,
                            transition: {
                              duration: 0.2
                            }
                          }
                        }}
                      >
                        <Link
                          to={link.targetId}
                          onClick={closeMobileMenu}
                          className="group relative block"
                        >
                          <motion.div
                            className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 ${
                              isActive
                                ? 'bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 border-primary/30 shadow-lg shadow-primary/10'
                                : 'bg-muted/30 border-border/50 hover:bg-muted/50 hover:border-primary/20'
                            }`}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            {/* Animated background gradient */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                              initial={false}
                            />
                            
                            {/* Active indicator glow */}
                            {isActive && (
                              <motion.div
                                className="absolute inset-0 bg-primary/5 rounded-2xl"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            )}
                            
                            <div className="relative flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                {/* Number badge */}
                                <motion.div
                                  className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm border ${
                                    isActive
                                      ? 'bg-primary/20 text-primary border-primary/30'
                                      : 'bg-background/50 text-muted-foreground border-border/50 group-hover:border-primary/20'
                                  }`}
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                >
                                  {String(index + 1).padStart(2, '0')}
                                </motion.div>
                                
                                <div>
                                  <h3 className={`text-lg font-semibold mb-1 ${
                                    isActive ? 'text-primary' : 'text-foreground'
                                  }`}>
                                    {link.name}
                                  </h3>
                                  {isActive && (
                                    <motion.p
                                      initial={{ opacity: 0, y: -5 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="text-xs text-primary/70 font-medium"
                                    >
                                      Current page
                                    </motion.p>
                                  )}
                                </div>
                              </div>
                              
                              <motion.div
                                className={`transition-colors ${
                                  isActive
                                    ? 'text-primary'
                                    : 'text-muted-foreground group-hover:text-primary'
                                }`}
                                whileHover={{ x: 4, rotate: -45 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                <ChevronRight className="h-6 w-6" />
                              </motion.div>
                            </div>
                            
                            {/* Bottom accent line for active */}
                            {isActive && (
                              <motion.div
                                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/40 rounded-b-2xl"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                              />
                            )}
                          </motion.div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Privacy Policy Link */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  className="mt-8 pt-6 border-t border-border/20"
                >
                  <Link
                    to="/privacy"
                    onClick={closeMobileMenu}
                    className="group flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    <span>Privacy Policy</span>
                    <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                  </Link>
                </motion.div>

              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
