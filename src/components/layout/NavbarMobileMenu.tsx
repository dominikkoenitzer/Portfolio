import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Code, X } from "lucide-react";
import { useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { useSwipe } from "@/hooks/use-swipe";
import type { Translation } from "@/lib/translations";
import type { NavLink } from "@/types";

interface NavbarMobileMenuProps {
  open: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  activePath: string;
  nav: Translation["nav"];
}

/** Full-screen mobile navigation drawer, portaled to document.body. */
export function NavbarMobileMenu({
  activePath,
  nav,
  navLinks,
  onClose,
  open,
}: NavbarMobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  // Swipe-right inside the drawer closes it — feels native on iOS/Android.
  const swipeHandlers = useSwipe({ onSwipeRight: onClose, threshold: 70 });

  if (typeof window === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — tap to dismiss */}
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl md:hidden"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Drawer — swipe right to close */}
          <motion.div
            animate={{ x: 0 }}
            className="overflow-y-auto overscroll-contain border-border/50 border-l bg-gradient-to-br from-background via-background to-background/95 shadow-2xl shadow-primary/10 backdrop-blur-2xl md:hidden"
            data-mobile-scroll
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.5 }}
            dragMomentum={false}
            exit={{ x: "100%" }}
            initial={{ x: "100%" }}
            onDragEnd={(_, info) => {
              if (info.offset.x > 100 || info.velocity.x > 500) {
                closeMobileMenu();
              }
            }}
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
              paddingTop: "var(--safe-top, 0px)",
              paddingBottom: "var(--safe-bottom, 0px)",
            }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              mass: 0.8,
            }}
            {...swipeHandlers}
          >
            {/* Drag affordance — small grip on the left edge */}
            <div className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2 z-20 hidden h-12 w-1 rounded-full bg-border/40 sm:block" />

            <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            </div>

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
                      {nav.menu}
                    </h2>
                    <p className="text-muted-foreground text-xs">
                      {nav.navigation}
                    </p>
                  </div>
                </div>
                <motion.button
                  aria-label={nav.closeMenu}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/50 bg-muted/50 transition-colors hover:bg-muted"
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="h-5 w-5 text-foreground/70" />
                </motion.button>
              </div>
            </motion.div>

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
                  const isActive = activePath === link.targetId;
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
                          transition: { duration: 0.2 },
                        },
                      }}
                    >
                      <Link
                        className="group relative block"
                        onClick={onClose}
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
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                            initial={false}
                          />

                          <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-4">
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
                                    {nav.currentPage}
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

              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 border-border/20 border-t pt-6"
                initial={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <Link
                  className="group flex items-center justify-center gap-2 text-muted-foreground text-xs transition-colors duration-200 hover:text-foreground"
                  onClick={onClose}
                  to="/privacy"
                >
                  <span>{nav.privacyPolicy}</span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
