import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { SearchTrigger } from "@/components/search/SearchTrigger";
import { useRoutePrefetch } from "@/hooks/use-route-prefetch";
import { isActivePath } from "@/lib/active-path";
import { DUR, EASE_OUT, SPRING_SOFT, stagger } from "@/lib/motion";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";
import type { Translation } from "@/lib/translations";
import type { NavLink } from "@/types";
import { cn } from "@/lib/utils";

interface NavbarMobileMenuProps {
  open: boolean;
  onClose: () => void;
  /** Closes the drawer and opens the search palette over it. */
  onOpenSearch: () => void;
  onPreloadSearch?: () => void;
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
  onOpenSearch,
  onPreloadSearch,
  open,
}: NavbarMobileMenuProps) {
  // The drawer's rows carry no handlers of their own, so the whole pair goes
  // on in one spread: touching a row warms the page it opens.
  const { warmOnIntent } = useRoutePrefetch();
  const menuRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  // Motion-sensitive users get the drawer in place: it fades where it stands
  // instead of sliding, and its rows arrive together instead of cascading.
  const reduceMotion = prefersReducedMotion();
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
  // scroll-to-top button) can step out of the way.
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
          {/* Backdrop: tap to dismiss */}
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-60 bg-background/95 lg:hidden"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
            transition={{ duration: DUR.base, ease: EASE_OUT }}
          />

          {/* Drawer: swipe right to close. The panel tracks the finger 1:1 to
              the right and springs back when the throw is too short. */}
          <motion.div
            animate={reduceMotion ? { opacity: 1, x: 0 } : { x: 0 }}
            aria-label={nav.menu}
            aria-modal="true"
            className="overflow-y-auto overscroll-contain border-border/60 border-l bg-background shadow-xl lg:hidden"
            data-mobile-scroll
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
            {/* Home is the first row of the list below, so the head of the
                drawer holds only the controls. The language picker and the
                search button have to be here: the drawer covers the header, so
                without them there is no way to reach either on a phone. */}
            <div className="flex items-center justify-end gap-2 border-border/40 border-b px-6 pt-8 pb-6">
              <SearchTrigger
                onOpen={onOpenSearch}
                onPreload={onPreloadSearch}
              />
              <LanguageToggle />
              <button
                aria-label={nav.closeMenu}
                className="-mr-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border/60 text-foreground/80 transition-colors duration-200 ease-out hover:border-primary/40 hover:text-primary"
                onClick={onClose}
                ref={closeBtnRef}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav aria-label={nav.menu} className="px-6 py-6">
              <motion.ul
                animate="show"
                className="space-y-2"
                initial="hidden"
                variants={rowsVariants}
              >
                {navLinks.map((link) => {
                  const isActive = isActivePath(activePath, link.targetId);
                  return (
                    <motion.li key={link.targetId} variants={rowVariants}>
                      <Link
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex min-h-14 items-center justify-between gap-4 rounded-xl border px-4 font-semibold text-base transition-colors duration-200 ease-out",
                          isActive
                            ? "border-primary/30 bg-primary/6 text-primary"
                            : "border-border/60 bg-card text-foreground hover:border-primary/30 hover:text-primary",
                        )}
                        /* A drag that starts on a row is a swipe-to-close, not
                           an attempt to drag the link somewhere. */
                        draggable={false}
                        onClick={onClose}
                        to={link.targetId}
                        {...warmOnIntent(link.targetId)}
                      >
                        {link.name}
                        <ChevronRight
                          aria-hidden
                          className={cn(
                            "h-5 w-5 shrink-0",
                            isActive ? "text-primary" : "text-muted-foreground",
                          )}
                        />
                      </Link>
                    </motion.li>
                  );
                })}
              </motion.ul>

              <div className="mt-8 border-border/40 border-t pt-6">
                <Link
                  className="flex min-h-11 items-center justify-center text-muted-foreground text-sm transition-colors duration-200 ease-out hover:text-foreground"
                  onClick={onClose}
                  to="/privacy"
                >
                  {nav.privacyPolicy}
                </Link>
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
