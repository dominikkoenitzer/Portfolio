import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { isActivePath } from "@/lib/active-path";
import { DUR, EASE_OUT, SPRING_SOFT, stagger } from "@/lib/motion";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";
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
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  // Motion-sensitive users get the drawer in place: it fades where it stands
  // instead of sliding, and its rows arrive together instead of cascading.
  const reduceMotion = prefersReducedMotion();
  // Rows ride the shared cascade so the drawer opens on the same clock as every
  // other staged reveal on the site. The old timing ran the last row 0.8s after
  // the panel, long enough that the drawer looked like it was still loading.
  const rowsVariants = reduceMotion ? stagger(0, 0) : stagger(0.12, 0.05);
  const rowVariants = {
    hidden: { opacity: 0, x: reduceMotion ? 0 : 24 },
    show: {
      opacity: 1,
      x: 0,
      transition: reduceMotion
        ? { duration: DUR.fast, ease: EASE_OUT }
        : SPRING_SOFT,
    },
  };

  // Move focus to the close button when the drawer opens and restore it to the
  // trigger (hamburger) when it closes: standard modal-dialog behaviour.
  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement as HTMLElement | null;
    const id = window.setTimeout(() => closeBtnRef.current?.focus(), 60);
    return () => {
      window.clearTimeout(id);
      previousFocus.current?.focus?.();
    };
  }, [open]);

  // Flag the open drawer on <html> so fixed chrome outside this subtree (the
  // scroll-to-top button) can step out of the way. An attribute rather than a
  // context keeps it to one write per open and costs the drawer no re-render.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.dataset.navOpen = "true";
    return () => {
      delete root.dataset.navOpen;
    };
  }, [open]);

  // Keep Tab focus inside the open drawer.
  const trapTab = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const focusables = menuRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (!focusables || focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

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
            className="fixed inset-0 z-[60] transform-gpu bg-background/95 md:hidden"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed" }}
            transition={{ duration: DUR.base, ease: EASE_OUT }}
          />

          {/* Drawer — swipe right to close */}
          <motion.div
            animate={reduceMotion ? { opacity: 1, x: 0 } : { x: 0 }}
            aria-label={nav.menu}
            aria-modal="true"
            className="overflow-y-auto overscroll-contain border-border/50 border-l bg-gradient-to-br from-background via-background to-background/95 shadow-2xl shadow-primary/10 md:hidden"
            data-mobile-scroll
            /* One gesture system, not two. The panel tracks the finger 1:1 to
               the right (elastic 1) and springs back from the constraint when
               the throw is too short, which is what a native drawer does; the
               old 0.5 elasticity moved it half as far as the finger and read as
               drag. */
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 1 }}
            dragMomentum={false}
            exit={reduceMotion ? { opacity: 0, x: 0 } : { x: "100%" }}
            initial={reduceMotion ? { opacity: 0, x: 0 } : { x: "100%" }}
            onDragEnd={(_, info) => {
              if (info.offset.x > 90 || info.velocity.x > 400) {
                onClose();
              }
            }}
            onKeyDown={trapTab}
            ref={menuRef}
            role="dialog"
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
            transition={
              reduceMotion
                ? { duration: DUR.fast, ease: EASE_OUT }
                : SPRING_SOFT
            }
          >
            {/* Drag affordance — small grip on the left edge */}
            <div className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2 z-20 hidden h-12 w-1 rounded-full bg-border/40 sm:block" />

            <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            </div>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 border-border/30 border-b px-6 pt-8 pb-6"
              initial={{ opacity: 0, y: reduceMotion ? 0 : -20 }}
              transition={{
                delay: reduceMotion ? 0 : 0.1,
                duration: DUR.base,
                ease: EASE_OUT,
              }}
            >
              {/* The header used to read "Menu / Navigation" beside a decorative
                  code glyph: a label for a panel that is self-evidently a menu,
                  and an icon that says nothing. The row now carries the one
                  thing the list is missing, a way back to the home page, under
                  the same wordmark the bar behind it shows. The panel keeps its
                  accessible name from the dialog and the <nav> below. */}
              <div className="flex items-center justify-between gap-4">
                <Link
                  aria-label={nav.goHome}
                  className="min-w-0 truncate rounded-lg font-bold text-foreground text-lg tracking-tight transition-colors duration-200 ease-out hover:text-primary"
                  onClick={onClose}
                  to="/"
                >
                  Dominik Könitzer
                </Link>
                <motion.button
                  aria-label={nav.closeMenu}
                  className="-mr-1 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-border/50 bg-muted/50 transition-colors duration-200 ease-out hover:bg-muted"
                  onClick={onClose}
                  ref={closeBtnRef}
                  transition={SPRING_SOFT}
                  whileTap={{ scale: 0.92 }}
                >
                  <X className="h-5 w-5 text-foreground/70" />
                </motion.button>
              </div>
            </motion.div>

            <nav aria-label={nav.menu} className="relative z-10 px-6 py-6">
              <motion.div
                animate="show"
                className="space-y-3"
                initial="hidden"
                variants={rowsVariants}
              >
                {navLinks.map((link, index) => {
                  const isActive = isActivePath(activePath, link.targetId);
                  return (
                    <motion.div key={link.name} variants={rowVariants}>
                      <Link
                        className="group relative block"
                        /* A drag that starts on a row is a swipe-to-close, not
                           an attempt to drag the link somewhere: without this
                           the browser's native link drag swallows the gesture
                           and the panel never moves. */
                        draggable={false}
                        onClick={onClose}
                        to={link.targetId}
                      >
                        <motion.div
                          className={`relative overflow-hidden rounded-2xl border p-5 transition-[background-color,border-color,box-shadow] duration-200 ease-out ${
                            isActive
                              ? "border-primary/30 bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 shadow-lg shadow-primary/10"
                              : "border-border/50 bg-muted/30 hover:border-primary/20 hover:bg-muted/50"
                          }`}
                          transition={SPRING_SOFT}
                          whileTap={{ scale: 0.98 }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"
                            initial={false}
                          />

                          <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {/* The row is a tap target, not a hover surface:
                                  the number and the chevron used to spin and
                                  swell on hover, which nothing on a phone can
                                  ever trigger. */}
                              <div
                                className={`flex h-10 w-10 items-center justify-center rounded-xl border font-bold text-sm tabular-nums ${
                                  isActive
                                    ? "border-primary/30 bg-primary/20 text-primary"
                                    : "border-border/50 bg-background/50 text-muted-foreground group-hover:border-primary/20"
                                }`}
                              >
                                {String(index + 1).padStart(2, "0")}
                              </div>

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
                                    transition={{
                                      duration: DUR.fast,
                                      ease: EASE_OUT,
                                    }}
                                  >
                                    {nav.currentPage}
                                  </motion.p>
                                )}
                              </div>
                            </div>

                            <div
                              className={`transition-colors duration-200 ease-out ${
                                isActive
                                  ? "text-primary"
                                  : "text-muted-foreground group-hover:text-primary"
                              }`}
                            >
                              <ChevronRight className="h-6 w-6" />
                            </div>
                          </div>

                          {isActive && (
                            <motion.div
                              animate={{ scaleX: 1 }}
                              className="absolute right-0 bottom-0 left-0 h-1 rounded-b-2xl bg-gradient-to-r from-primary via-primary/80 to-primary/40"
                              initial={{ scaleX: reduceMotion ? 1 : 0 }}
                              transition={{
                                duration: DUR.base,
                                delay: reduceMotion ? 0 : 0.2,
                                ease: EASE_OUT,
                              }}
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
                initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                transition={{
                  delay: reduceMotion ? 0 : 0.45,
                  duration: DUR.base,
                  ease: EASE_OUT,
                }}
              >
                <Link
                  className="group flex min-h-11 items-center justify-center gap-2 text-muted-foreground text-xs transition-colors duration-200 ease-out hover:text-foreground"
                  onClick={onClose}
                  to="/privacy"
                >
                  <span>{nav.privacyPolicy}</span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:translate-x-0.5 group-hover:opacity-100" />
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
