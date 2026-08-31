import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { ArrowRight, Github, Mail } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/constants";
import { useLanguage } from "@/lib/language-context";
import { DUR, EASE_OUT, REVEAL, stagger } from "@/lib/motion";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";
import { translations } from "@/lib/translations";

const MORPH_EASE = `cubic-bezier(${EASE_OUT.join(", ")})`;
/** The name swaps the instant the outgoing one has finished fading. */
const MORPH_OUT_MS = DUR.fast * 1000;

// ─── Name morph title ─────────────────────────────────────────────────────────
// Cycles the owner's identities (Dominik, Punds, DK) under the greeting.
function NameMorphTitle() {
  const { language } = useLanguage();
  const PHRASES = translations[language].hero.roles;
  const [idx, setIdx] = useState(0);
  const [morphOut, setMorphOut] = useState(false);
  // Honour reduced-motion: hold one static name rather than auto-cycling the
  // morph (avoids vestibular triggers and WCAG 2.2.2 auto-update issues).
  // Seeded on the first client render so the static branch never flashes a cycle.
  const [reduceMotion] = useState(prefersReducedMotion);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    let swapTimer: ReturnType<typeof setTimeout>;
    const cycleTimer = setInterval(() => {
      setMorphOut(true);
      swapTimer = setTimeout(() => {
        setIdx((i) => (i + 1) % PHRASES.length);
        setMorphOut(false);
      }, MORPH_OUT_MS);
    }, 4000);
    return () => {
      clearTimeout(swapTimer);
      clearInterval(cycleTimer);
    };
  }, [PHRASES.length, reduceMotion]);

  // Transform and opacity only. The line spans the viewport at the 7.5rem max
  // size, so a blur() on the way out repainted the whole hero every frame.
  const morphStyle: React.CSSProperties = reduceMotion
    ? {}
    : {
        opacity: morphOut ? 0 : 1,
        // Rest at `none`, not an identity matrix: a transformed layer makes
        // Chrome rasterize this 7.5rem text through the compositor, which is
        // visibly soft on high-density screens.
        transform: morphOut ? "scale(0.97) translateY(-0.04em)" : "none",
        transition: morphOut
          ? `opacity ${DUR.fast}s ease-in, transform ${DUR.fast}s ease-in`
          : `opacity ${DUR.slow}s ${MORPH_EASE}, transform ${DUR.slow}s ${MORPH_EASE}`,
      };

  return (
    <>
      {/* Stable, SEO-friendly heading for assistive tech and crawlers. The
          visible name below cycles purely as decoration (aria-hidden), so it
          never re-announces every few seconds. */}
      <h1 className="sr-only">
        Dominik Könitzer, {SITE_CONFIG.title}
      </h1>
      <div
        aria-hidden="true"
        className="mb-7 overflow-visible leading-[0.95] tracking-[-0.01em] sm:mb-9 md:mb-11"
        style={{ fontSize: "clamp(2.75rem, 8vw, 7.5rem)" }}
      >
        <span
          className="hero-name-gradient font-title block pb-[0.12em]"
          style={morphStyle}
        >
          {PHRASES[idx]}
        </span>
      </div>
    </>
  );
}

// ─── Magnetic wrapper ─────────────────────────────────────────────────────────
function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Not SPRING_SOFT: this one tracks the cursor continuously rather than
  // settling once, and the cushioned spring lags far enough behind the pointer
  // to break the illusion that the button is attached to it.
  const sx = useSpring(x, { stiffness: 200, damping: 20, mass: 0.1 });
  const sy = useSpring(y, { stiffness: 200, damping: 20, mass: 0.1 });

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.28);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export function HeroSection() {
  const { language } = useLanguage();
  const t = translations[language];
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 40,
    stiffness: 280,
  });
  const skewY = useTransform(smoothVelocity, [-2500, 0, 2500], [2.5, 0, -2.5]);
  const contentY = useTransform(scrollY, [0, 600], [0, -60]);

  // Seeded on the first client render, like RoleMorphTitle: reduced motion gets
  // the settled hero immediately rather than a cascade it did not ask for.
  const [reduceMotion] = useState(prefersReducedMotion);

  // The velocity-driven skew + parallax shear the hero during touch momentum
  // scrolling; it reads as the content being thrown off-center. Desktop only.
  const [reduceFx] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)")
        .matches,
  );

  return (
    <section
      className="relative flex min-h-[calc(100vh-6rem)] flex-col justify-center overflow-hidden sm:min-h-[calc(100vh-7rem)] md:min-h-[calc(100vh-8rem)]"
      id="hero"
    >
      {/* Ambient — radial-gradient glows instead of solid circles under a heavy
          `blur()`; same soft look, no costly blur pass on mobile. */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute left-[5%] top-[15%] h-[700px] w-[700px]"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary) / 0.09) 0%, hsl(var(--primary) / 0) 72%)",
          }}
        />
        <div
          className="absolute right-[5%] bottom-[10%] h-[500px] w-[500px]"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, hsl(var(--primary) / 0) 72%)",
          }}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-pattern opacity-[0.018]" />

      <motion.div
        className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-16"
        style={{ skewY: reduceFx ? 0 : skewY }}
      >
        {/* One choreographed sequence rather than hand-tuned delays: the
            greeting, the social row and the CTAs cascade off a single stagger
            parent, so the order stays fixed no matter what is added between
            them. The morph title sits in the middle without a variant of its
            own, it is already animating on its own clock. */}
        <motion.div
          animate="show"
          initial={reduceMotion ? "show" : "hidden"}
          style={{ y: reduceFx ? 0 : contentY }}
          variants={stagger(0.18, 0.2)}
        >
          {/* Greeting, completed by the rotating name below it */}
          <motion.p
            className="mb-3 font-semibold text-foreground/90 sm:mb-4"
            style={{ fontSize: "clamp(1.15rem, 2.5vw, 1.75rem)" }}
            variants={REVEAL}
          >
            {t.hero.greeting}
          </motion.p>

          <NameMorphTitle />

          {/* Social links */}
          <motion.div
            className="mb-5 flex items-center gap-2.5 sm:mb-6 sm:gap-3"
            variants={REVEAL}
          >
            {[
              {
                href: "https://github.com/dominikkoenitzer",
                label: "GitHub",
                icon: <Github className="h-[18px] w-[18px]" />,
              },
              {
                href: "mailto:dominik.koenitzer@gmail.com",
                label: "Email",
                icon: <Mail className="h-[18px] w-[18px]" />,
              },
            ].map(({ href, label, icon }) => (
              <a
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border/40 text-muted-foreground transition-colors duration-200 ease-out hover:border-primary/40 hover:bg-primary/[0.06] hover:text-primary"
                href={href}
                key={label}
                rel="noopener noreferrer"
                target={href.startsWith("mailto") ? undefined : "_blank"}
              >
                {icon}
              </a>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap gap-2.5 sm:gap-3"
            variants={REVEAL}
          >
            <Magnetic>
              <Button
                asChild
                className="group h-10 rounded-lg px-6 text-sm font-medium"
                variant="cta"
              >
                <Link className="flex items-center gap-1.5" to="/contact">
                  {t.hero.hireMe}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button
                asChild
                className="h-10 rounded-lg border-primary/25 bg-transparent px-6 text-sm font-medium hover:border-primary/45 hover:bg-primary/[0.04]"
                variant="outline"
              >
                <Link to="/projects">{t.hero.viewWork}</Link>
              </Button>
            </Magnetic>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
