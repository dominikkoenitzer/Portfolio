import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV_LINKS } from "@/constants";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useHaptic } from "@/hooks/use-haptic";
import { isActivePath } from "@/lib/active-path";
import { useLanguage } from "@/lib/language-context";
import { DUR, EASE_OUT, SPRING_SOFT, stagger } from "@/lib/motion";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { LanguageToggle } from "./LanguageToggle";
import { NavbarMobileMenu } from "./NavbarMobileMenu";

/** Offset at which the bar takes its condensed island state. */
const CONDENSE_AT = 50;
/** The bar may only hide past this offset; nearer the top it always shows. */
const HIDE_BELOW = 80;
/** Movement smaller than this is jitter, not a direction change. */
const DIRECTION_THRESHOLD = 8;

const NAV_KEY_BY_PATH: Record<string, keyof typeof translations.en.nav> = {
  "/": "home",
  "/about": "about",
  "/experience": "experience",
  "/skills": "skills",
  "/projects": "projects",
  "/services": "services",
  "/contact": "contact",
  "/donate": "donate",
};

/** The row's cascade, and the entrance of one item inside it. */
const NAV_ROW = stagger(0.1, 0.05);
const NAV_ITEM = {
  hidden: { opacity: 0, y: -8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE_OUT },
  },
} as const;

/**
 * The cream surface a cluster takes once the row sits over content, so the
 * labels stay legible. It fills its parent, which is sized by the cluster's
 * own padding, so the pill hugs what it stands behind instead of stretching
 * across the page. The blur class only flips while the layer is transparent,
 * so it is never caught mid-fade. 90% cream is opaque enough that the labels
 * measure 10:1 over the content the pill covers (worst of /projects,
 * /services, /about and /donate at 1440); unscrolled, straight over the
 * aurora, they measure 6.1:1.
 */
function Island({ show }: { show: boolean }) {
  return (
    <motion.div
      animate={{ opacity: show ? 1 : 0 }}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 rounded-full border border-border/60 bg-background/90 shadow-sm",
        show && "backdrop-blur-xl",
      )}
      initial={false}
      transition={{ duration: DUR.fast, ease: EASE_OUT }}
    />
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollingDown, setScrollingDown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [reduceMotion] = useState(prefersReducedMotion);
  // Which link the pointer/keyboard is on, and whether it is still there. The
  // `on` flag exists so the travelling pill can fade out where it stands: a
  // shared-layout element only glides while a single instance stays mounted, so
  // unmounting it on mouse-out would make it vanish instead.
  const [hover, setHover] = useState<{ index: number; on: boolean } | null>(
    null,
  );
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language];
  const haptic = useHaptic();
  const navLinks = NAV_LINKS.map((link) => ({
    ...link,
    name: t.nav[NAV_KEY_BY_PATH[link.targetId]] ?? link.name,
  }));

  // Lenis drives the real window scroll, so the window-level scrollY that
  // useScroll reads stays authoritative with or without smooth scrolling.
  const { scrollY } = useScroll();
  // null until the first event: a reload halfway down the page must not read as
  // one giant downward jump and swallow the bar before the user touches it.
  const lastScrollY = useRef<number | null>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    // The drawer locks the body with position:fixed, which reports a scrollY of
    // 0 and would flip both states. Ignoring it also keeps the last real offset,
    // so the restore on close reads as no movement at all.
    if (mobileMenuOpen) {
      return;
    }

    setIsScrolled(y > CONDENSE_AT);

    const previous = lastScrollY.current;
    if (previous === null || y <= HIDE_BELOW) {
      lastScrollY.current = y;
      setScrollingDown(false);
      return;
    }

    const delta = y - previous;
    if (Math.abs(delta) < DIRECTION_THRESHOLD) {
      return;
    }
    lastScrollY.current = y;
    setScrollingDown(delta > 0);
  });

  // Off-screen while scrolling down past the hero, back the moment the user
  // scrolls up. Never hidden while the drawer is open: the same button that
  // closes it lives in this row, so hiding the bar would trap the user.
  const navHidden = scrollingDown && !mobileMenuOpen && !reduceMotion;
  // Shared-layout gliding is movement across the screen, which is exactly what
  // reduced motion asks us not to do; without a layoutId each indicator simply
  // appears on the link it belongs to.
  const glide = reduceMotion ? undefined : SPRING_SOFT;

  const closeMobileMenu = useCallback(() => {
    haptic("light");
    setMobileMenuOpen(false);
  }, [haptic]);

  const openMobileMenu = useCallback(() => {
    haptic("medium");
    setMobileMenuOpen(true);
  }, [haptic]);

  useBodyScrollLock(mobileMenuOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen, closeMobileMenu]);

  return (
    <motion.header
      animate={{ y: navHidden ? "-100%" : "0%" }}
      /* `pointer-events-none`, re-enabled on the two clusters below: the bar
         spans the whole width but is now mostly empty, and a centred row that
         swallowed clicks in both of its flanks would be worse than the
         right-aligned one that swallowed them in one. */
      className="pointer-events-none fixed top-0 right-0 left-0 z-50"
      data-no-callout
      initial={{ y: reduceMotion ? "0%" : "-100%" }}
      style={{ paddingTop: "var(--safe-top, 0px)" }}
      transition={SPRING_SOFT}
    >
      {/* The page's own gutter ladder and column cap, so the row is measured
          against the same box as the hero and the footer. Because the box is
          `mx-auto`, its centre is the viewport's centre: anything centred
          inside it lands on the page axis at every width. */}
      <div className="mx-auto max-w-7xl px-6 pt-2.5 pb-2 sm:px-8 md:px-12 lg:px-16">
        {/* The row itself: one centred group in flow, one cluster out of it. */}
        <div className="relative flex h-16 items-center justify-center md:h-[4.5rem]">
          {/* No mark or wordmark: Home is the first entry of the nav list, so
              the whole row is one set of links and nothing else. That is what
              lets it be centred honestly: the group holds only the eight
              links, so its geometric centre is also its optical centre. */}
          <nav
            aria-label={t.nav.navigation}
            className="pointer-events-auto relative hidden w-fit shrink-0 lg:block"
          >
            <Island show={isScrolled} />

            <motion.ul
              animate="show"
              /* `relative` so the row paints above the island, which is a
                 positioned sibling earlier in the tree. The px-4 is the
                 pill's air: it sits on this element, not on the surface, so
                 the surface can only ever be the row plus 16px each side. */
              className="relative flex h-16 items-center gap-0.5 px-4 md:h-[4.5rem]"
              initial={reduceMotion ? "show" : "hidden"}
              onMouseLeave={() =>
                setHover((h) => (h ? { ...h, on: false } : null))
              }
              variants={NAV_ROW}
            >
              {navLinks.map((link, index) => {
                const isActive = isActivePath(location.pathname, link.targetId);
                return (
                  <motion.li key={link.targetId} variants={NAV_ITEM}>
                    <Link
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        // Ink, not the muted slate: at the top of the page
                        // the row sits on the strongest part of the aurora,
                        // where slate lands at 3.1:1 and ink at about 9:1.
                        // The current page is marked by the violet underline
                        // below and by `aria-current`, so the label itself
                        // does not have to carry a second, weaker signal.
                        // One padding at every width: the French row is the
                        // widest, and at 1024 the roomier lg padding brought
                        // it within 15px of the language button.
                        "group relative flex min-h-11 items-center whitespace-nowrap rounded-full px-3 font-medium text-sm transition-colors duration-200 ease-out",
                        isActive
                          ? "font-semibold text-foreground"
                          : "text-foreground/90 hover:text-foreground",
                      )}
                      onBlur={() =>
                        setHover((h) => (h ? { ...h, on: false } : null))
                      }
                      onFocus={() => setHover({ index, on: true })}
                      onMouseEnter={() => setHover({ index, on: true })}
                      to={link.targetId}
                    >
                      {/* One pill for the whole row: framer projects it from
                          the link the pointer left to the one it arrived at,
                          so the highlight travels instead of blinking. */}
                      {hover !== null && hover.index === index && (
                        <motion.span
                          animate={{ opacity: hover.on ? 1 : 0 }}
                          aria-hidden
                          className="absolute inset-0 rounded-full bg-primary/[0.07]"
                          initial={{ opacity: 0 }}
                          layoutId={
                            reduceMotion ? undefined : "navbar-hover-pill"
                          }
                          transition={
                            reduceMotion
                              ? { duration: DUR.fast, ease: EASE_OUT }
                              : SPRING_SOFT
                          }
                        />
                      )}
                      {/* The current page: a second shared element, so the
                          underline slides across the row on navigation while
                          the hover pill runs its own errand. A shape rather
                          than a colour alone, and `aria-current` above says
                          the same thing without one. */}
                      {isActive && (
                        <motion.span
                          aria-hidden
                          className="absolute inset-x-3 bottom-[0.3rem] h-[2px] rounded-full bg-primary"
                          layoutId={
                            reduceMotion ? undefined : "navbar-active-pill"
                          }
                          transition={glide}
                        />
                      )}
                      <span className="relative">{link.name}</span>
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>
          </nav>

          {/* The utilities park at the gutter, out of flow, so they cannot
              pull the links off the axis: inside the centred group the
              language button alone shifted every label 28px to the left. Out
              of flow also means the nav's centring is language- and
              breakpoint-independent, which is the whole point.
              `-right-4` cancels this cluster's own 16px of pill air, so the
              control that is actually visible at the top of the page lines up
              with the page column rather than sitting 16px inside it; the
              surface overhangs into the gutter, which is where the old
              right-aligned bar put it too. */}
          <div className="-right-4 pointer-events-auto absolute inset-y-0 flex items-center">
            <div className="relative flex h-16 items-center md:h-[4.5rem]">
              <Island show={isScrolled} />
              <div className="relative flex items-center gap-1.5 px-4 sm:gap-2">
                <LanguageToggle />
                <button
                  aria-expanded={mobileMenuOpen}
                  aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
                  className="group relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-primary/15 bg-primary/[0.06] transition-colors duration-200 ease-out hover:bg-primary/[0.12] lg:hidden"
                  onClick={mobileMenuOpen ? closeMobileMenu : openMobileMenu}
                >
                  {/* Three bars that fold into a cross. */}
                  <span className="relative flex h-5 w-5 items-center justify-center">
                    <motion.span
                      animate={{
                        rotate: mobileMenuOpen ? 45 : 0,
                        y: mobileMenuOpen ? 0 : -6,
                      }}
                      className="absolute h-0.5 w-[18px] origin-center rounded-full bg-primary"
                      transition={{ duration: DUR.fast, ease: EASE_OUT }}
                    />
                    <motion.span
                      animate={{
                        opacity: mobileMenuOpen ? 0 : 1,
                        scaleX: mobileMenuOpen ? 0 : 1,
                      }}
                      className="absolute h-0.5 w-[18px] origin-center rounded-full bg-primary"
                      transition={{ duration: DUR.fast, ease: EASE_OUT }}
                    />
                    <motion.span
                      animate={{
                        rotate: mobileMenuOpen ? -45 : 0,
                        y: mobileMenuOpen ? 0 : 6,
                      }}
                      className="absolute h-0.5 w-[18px] origin-center rounded-full bg-primary"
                      transition={{ duration: DUR.fast, ease: EASE_OUT }}
                    />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <NavbarMobileMenu
        activePath={location.pathname}
        nav={t.nav}
        navLinks={navLinks}
        onClose={closeMobileMenu}
        open={mobileMenuOpen}
      />
    </motion.header>
  );
}
