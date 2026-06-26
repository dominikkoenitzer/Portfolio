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
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";

// ─── Blur morph title ─────────────────────────────────────────────────────────
function BlurMorphTitle() {
  const { language } = useLanguage();
  const PHRASES = translations[language].hero.roles;
  const [idx, setIdx] = useState(0);
  const [blurOut, setBlurOut] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    // Honour reduced-motion: hold one static role rather than auto-cycling the
    // blur morph (avoids vestibular triggers and WCAG 2.2.2 auto-update issues).
    if (mq.matches) {
      return;
    }

    let swapTimer: ReturnType<typeof setTimeout>;
    const cycleTimer = setInterval(() => {
      setBlurOut(true);
      swapTimer = setTimeout(() => {
        setIdx((i) => (i + 1) % PHRASES.length);
        setBlurOut(false);
      }, 400);
    }, 4000);
    return () => {
      clearTimeout(swapTimer);
      clearInterval(cycleTimer);
    };
  }, [PHRASES.length]);

  const morphStyle: React.CSSProperties = reduceMotion
    ? {}
    : {
        opacity: blurOut ? 0 : 1,
        filter: blurOut ? "blur(18px)" : "blur(0px)",
        transform: blurOut ? "scale(0.97)" : "scale(1)",
        transition: blurOut
          ? "opacity 0.32s ease-in, filter 0.32s ease-in, transform 0.32s ease-in"
          : "opacity 0.55s cubic-bezier(0.25,1,0.4,1), filter 0.55s cubic-bezier(0.25,1,0.4,1), transform 0.55s cubic-bezier(0.25,1,0.4,1)",
      };

  return (
    <>
      {/* Stable, SEO-friendly heading for assistive tech and crawlers. The
          visible title below cycles purely as decoration (aria-hidden), so it
          never re-announces every few seconds. */}
      <h1 className="sr-only">
        Dominik Könitzer — {PHRASES[0].line1} {PHRASES[0].line2}
      </h1>
      <div
        aria-hidden="true"
        // leading-[0.95] + pb-[0.25em] on each gradient span gives French/German
        // descenders ("g" in Ingénieur, "j" in projet, etc.) enough room — at the
        // 7.5rem max font size the descender alone is ~24px.
        className="mb-7 overflow-visible font-bold leading-[0.95] tracking-[-0.03em] sm:mb-9 md:mb-11"
        style={{ fontSize: "clamp(2.75rem, 8vw, 7.5rem)" }}
      >
        <span className="block hero-name-gradient pb-[0.12em]" style={morphStyle}>
          {PHRASES[idx].line1}
        </span>
        <span className="block hero-name-gradient pb-[0.25em]" style={morphStyle}>
          {PHRASES[idx].line2}
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

// ─── Stat item ────────────────────────────────────────────────────────────────
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-bold text-xl text-primary sm:text-2xl md:text-3xl">
        {value}
      </span>
      <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground sm:text-[10px] sm:tracking-[0.18em]">
        {label}
      </span>
    </div>
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

  // The velocity-driven skew + parallax shear the hero during touch momentum
  // scrolling — it reads as the content being thrown off-center. Desktop only.
  const [reduceFx, setReduceFx] = useState(false);
  useEffect(() => {
    setReduceFx(
      window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)")
        .matches,
    );
  }, []);

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
        <motion.div style={{ y: reduceFx ? 0 : contentY }}>
          {/* Name */}
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 font-semibold text-foreground/90 sm:mb-4"
            initial={{ opacity: 0, y: 8 }}
            style={{ fontSize: "clamp(1.15rem, 2.5vw, 1.75rem)" }}
            transition={{ duration: 0.5, delay: 0.18 }}
          >
            {t.hero.greeting}
          </motion.p>

          {/* Role — blur morph cycling title */}
          <BlurMorphTitle />

          {/* Social links */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 flex items-center gap-2.5 sm:mb-6 sm:gap-3"
            initial={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.5, delay: 0.55 }}
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
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border/40 text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:bg-primary/[0.06] hover:text-primary"
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
            animate={{ opacity: 1, y: 0 }}
            className="mb-9 flex flex-wrap gap-2.5 sm:mb-11 sm:gap-3 md:mb-14"
            initial={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.5, delay: 0.65 }}
          >
            <Magnetic>
              <Button
                asChild
                className="group h-10 rounded-lg px-6 text-sm font-medium"
                variant="cta"
              >
                <Link className="flex items-center gap-1.5" to="/contact">
                  {t.hero.hireMe}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button
                asChild
                className="h-10 rounded-lg border-border/30 bg-transparent px-6 text-sm font-medium transition-all duration-200 hover:border-primary/25 hover:bg-primary/[0.04]"
                variant="outline"
              >
                <Link to="/projects">{t.hero.viewWork}</Link>
              </Button>
            </Magnetic>
          </motion.div>

          {/* Stats */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-5 border-t border-border/20 pt-6 sm:gap-7 sm:pt-7 md:gap-10 md:pt-8"
            initial={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.5, delay: 0.78 }}
          >
            <Stat value="20+" label={t.hero.stats.projects} />
            <div className="h-8 w-px bg-border/20 sm:h-10" />
            <Stat value="4+" label={t.hero.stats.yearsCoding} />
            <div className="h-8 w-px bg-border/20 sm:h-10" />
            <Stat value="30+" label={t.hero.stats.technologies} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
