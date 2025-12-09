import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Code, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { NAV_LINKS } from "@/constants";
import { ThemeToggle } from "./ThemeToggle";

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
      // Use requestAnimationFrame to ensure menu starts animating first
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const html = document.documentElement;
        const body = document.body;

        // Store original styles
        const originalBodyPosition = body.style.position;
        const originalBodyTop = body.style.top;
        const originalBodyWidth = body.style.width;
        const originalBodyOverflow = body.style.overflow;
        const originalHtmlOverflow = html.style.overflow;

        // Lock scroll
        body.style.position = "fixed";
        body.style.top = `-${scrollY}px`;
        body.style.width = "100%";
        body.style.overflow = "hidden";
        html.style.overflow = "hidden";
      });

      return () => {
        const scrollY = Number.parseInt(document.body.style.top || "0") * -1;
        const html = document.documentElement;
        const body = document.body;

        // Restore styles
        body.style.position = "";
        body.style.top = "";
        body.style.width = "";
        body.style.overflow = "";
        html.style.overflow = "";

        // Restore scroll position
        if (!isNaN(scrollY)) {
          window.scrollTo(0, scrollY);
        }
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
      if (e.key === "Escape" && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen, closeMobileMenu]);

  return (
    <motion.header
      animate={{ y: 0 }}
      className={`fixed top-0 right-0 left-0 z-50 ${
        isScrolled
          ? "border-border/50 border-b bg-background/90 shadow-primary/5 shadow-xl backdrop-blur-2xl"
          : "bg-transparent"
      } transition-all duration-700`}
      initial={{ y: -100 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link
              aria-label="Go to home page"
              className="group flex items-center font-bold text-xl tracking-tight md:text-2xl"
              to="/"
            >
              <motion.span
                className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent text-primary shadow-lg shadow-primary/10 transition-all duration-300 group-hover:from-primary/30 group-hover:via-primary/20"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Code className="h-5 w-5" />
              </motion.span>
              <motion.span
                animate={{ y: [0, -2, 0] }}
                className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
                initial={false}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 3,
                }}
              >
                Dominik Könitzer
              </motion.span>
            </Link>
          </div>

          <nav className="hidden items-center space-x-2 md:flex">
            {navLinks.map((link, index) => {
              const isActive = location.pathname === link.targetId;
              return (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: -10 }}
                  key={link.name}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    className={`group relative block rounded-lg px-4 py-2.5 font-medium text-sm transition-all duration-300 ${
                      isActive
                        ? "bg-primary/10 text-primary shadow-md"
                        : "hover:bg-primary/5 hover:text-primary"
                    }`}
                    to={link.targetId}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <motion.div
                        animate={{
                          scale: isActive ? 1 : 0.6,
                          opacity: isActive ? 1 : 0.4,
                        }}
                        className="h-1 w-1 rounded-full bg-primary"
                        initial={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                      {link.name}
                    </span>
                    <motion.span
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10"
                      initial={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                    />
                  </Link>
                </motion.div>
              );
            })}
            <div className="ml-4 border-border/30 border-l pl-4">
              <ThemeToggle />
            </div>
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-3 md:hidden">
            <ThemeToggle />
            <motion.button
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="group relative flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 transition-all duration-300 hover:from-primary/20 hover:to-primary/10"
              onClick={mobileMenuOpen ? closeMobileMenu : openMobileMenu}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated background glow */}
              <motion.div
                animate={{
                  opacity: mobileMenuOpen ? 1 : 0.5,
                  scale: mobileMenuOpen ? 1.1 : 1,
                }}
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5"
                transition={{ duration: 0.3 }}
              />

              {/* Custom Hamburger Icon */}
              <div className="relative flex h-5 w-5 flex-col items-center justify-center">
                <motion.span
                  animate={{
                    rotate: mobileMenuOpen ? 45 : 0,
                    y: mobileMenuOpen ? 0 : -6,
                  }}
                  className="absolute h-0.5 w-5 origin-center rounded-full bg-primary"
                  transition={{
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
                <motion.span
                  animate={{
                    opacity: mobileMenuOpen ? 0 : 1,
                    scale: mobileMenuOpen ? 0 : 1,
                  }}
                  className="absolute h-0.5 w-5 origin-center rounded-full bg-primary"
                  transition={{
                    duration: 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
                <motion.span
                  animate={{
                    rotate: mobileMenuOpen ? -45 : 0,
                    y: mobileMenuOpen ? 0 : 6,
                  }}
                  className="absolute h-0.5 w-5 origin-center rounded-full bg-primary"
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
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                {/* Backdrop with blur */}
                <motion.div
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl md:hidden"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  style={{ position: "fixed" }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Full-Screen Menu Container */}
                <motion.div
                  animate={{ x: 0 }}
                  className="overflow-y-auto overscroll-contain border-border/50 border-l bg-gradient-to-br from-background via-background to-background/95 shadow-2xl shadow-primary/10 backdrop-blur-2xl md:hidden"
                  exit={{ x: "100%" }}
                  initial={{ x: "100%" }}
                  ref={menuRef}
                  style={{
                    position: "fixed",
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: "auto",
                    zIndex: 70,
                    width: "100%",
                    maxWidth: "28rem",
                  }}
                  transition={{
                    type: "spring",
                    damping: 30,
                    stiffness: 300,
                    mass: 0.8,
                  }}
                >
                  {/* Animated background pattern */}
                  <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                  </div>

                  {/* Header Section */}
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 border-border/30 border-b px-6 pt-8 pb-6"
                    initial={{ opacity: 0, y: -20 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <motion.div
                          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5"
                          transition={{ type: "spring", stiffness: 400 }}
                          whileHover={{ scale: 1.05, rotate: 5 }}
                        >
                          <Code className="h-6 w-6 text-primary" />
                        </motion.div>
                        <div>
                          <h2 className="font-bold text-foreground text-lg">
                            Menu
                          </h2>
                          <p className="text-muted-foreground text-xs">
                            Navigation
                          </p>
                        </div>
                      </div>
                      <motion.button
                        aria-label="Close menu"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-muted/50 transition-colors hover:bg-muted"
                        onClick={closeMobileMenu}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <X className="h-5 w-5 text-foreground/70" />
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Navigation Items */}
                  <nav className="relative z-10 px-6 py-6">
                    <motion.div
                      animate="open"
                      className="space-y-3"
                      initial="closed"
                      variants={{
                        open: {
                          transition: {
                            staggerChildren: 0.1,
                            delayChildren: 0.2,
                          },
                        },
                        closed: {
                          transition: {
                            staggerChildren: 0.05,
                            staggerDirection: -1,
                          },
                        },
                      }}
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
                                  damping: 25,
                                },
                              },
                              closed: {
                                opacity: 0,
                                x: 50,
                                transition: {
                                  duration: 0.2,
                                },
                              },
                            }}
                          >
                            <Link
                              className="group relative block"
                              onClick={closeMobileMenu}
                              to={link.targetId}
                            >
                              <motion.div
                                className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${
                                  isActive
                                    ? "border-primary/30 bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 shadow-lg shadow-primary/10"
                                    : "border-border/50 bg-muted/30 hover:border-primary/20 hover:bg-muted/50"
                                }`}
                                transition={{ type: "spring", stiffness: 400 }}
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {/* Animated background gradient */}
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                  initial={false}
                                />

                                {/* Active indicator glow */}
                                {isActive && (
                                  <motion.div
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    className="absolute inset-0 rounded-2xl bg-primary/5"
                                    initial={{ opacity: 0 }}
                                    transition={{
                                      duration: 2,
                                      repeat: Number.POSITIVE_INFINITY,
                                    }}
                                  />
                                )}

                                <div className="relative flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    {/* Number badge */}
                                    <motion.div
                                      className={`flex h-10 w-10 items-center justify-center rounded-xl border font-bold text-sm ${
                                        isActive
                                          ? "border-primary/30 bg-primary/20 text-primary"
                                          : "border-border/50 bg-background/50 text-muted-foreground group-hover:border-primary/20"
                                      }`}
                                      whileHover={{ scale: 1.1, rotate: 5 }}
                                    >
                                      {String(index + 1).padStart(2, "0")}
                                    </motion.div>

                                    <div>
                                      <h3
                                        className={`mb-1 font-semibold text-lg ${
                                          isActive
                                            ? "text-primary"
                                            : "text-foreground"
                                        }`}
                                      >
                                        {link.name}
                                      </h3>
                                      {isActive && (
                                        <motion.p
                                          animate={{ opacity: 1, y: 0 }}
                                          className="font-medium text-primary/70 text-xs"
                                          initial={{ opacity: 0, y: -5 }}
                                        >
                                          Current page
                                        </motion.p>
                                      )}
                                    </div>
                                  </div>

                                  <motion.div
                                    className={`transition-colors ${
                                      isActive
                                        ? "text-primary"
                                        : "text-muted-foreground group-hover:text-primary"
                                    }`}
                                    transition={{
                                      type: "spring",
                                      stiffness: 400,
                                    }}
                                    whileHover={{ x: 4, rotate: -45 }}
                                  >
                                    <ChevronRight className="h-6 w-6" />
                                  </motion.div>
                                </div>

                                {/* Bottom accent line for active */}
                                {isActive && (
                                  <motion.div
                                    animate={{ scaleX: 1 }}
                                    className="absolute right-0 bottom-0 left-0 h-1 rounded-b-2xl bg-gradient-to-r from-primary via-primary/80 to-primary/40"
                                    initial={{ scaleX: 0 }}
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
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 border-border/20 border-t pt-6"
                      initial={{ opacity: 0, y: 10 }}
                      transition={{ delay: 0.7, duration: 0.4 }}
                    >
                      <Link
                        className="group flex items-center justify-center gap-2 text-muted-foreground text-xs transition-colors duration-200 hover:text-foreground"
                        onClick={closeMobileMenu}
                        to="/privacy"
                      >
                        <span>Privacy Policy</span>
                        <ChevronRight className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </Link>
                    </motion.div>
                  </nav>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </motion.header>
  );
}
