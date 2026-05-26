import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";

// ─── Blur morph title ─────────────────────────────────────────────────────────
function BlurMorphTitle() {
  const { language } = useLanguage();
  const PHRASES = translations[language].hero.roles;
  const [idx, setIdx] = useState(0);
  const [blurOut, setBlurOut] = useState(false);

  useEffect(() => {
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
  }, []);

  const morphStyle: React.CSSProperties = {
    opacity: blurOut ? 0 : 1,
    filter: blurOut ? "blur(18px)" : "blur(0px)",
    transform: blurOut ? "scale(0.97)" : "scale(1)",
    transition: blurOut
      ? "opacity 0.32s ease-in, filter 0.32s ease-in, transform 0.32s ease-in"
      : "opacity 0.55s cubic-bezier(0.25,1,0.4,1), filter 0.55s cubic-bezier(0.25,1,0.4,1), transform 0.55s cubic-bezier(0.25,1,0.4,1)",
  };

  return (
    <h1
      aria-live="polite"
      className="mb-7 font-bold leading-[0.88] tracking-[-0.03em] sm:mb-9 md:mb-11"
      style={{ fontSize: "clamp(2.75rem, 8vw, 7.5rem)" }}
    >
      <span className="block hero-name-gradient pb-[0.08em]" style={morphStyle}>{PHRASES[idx].line1}</span>
      <span className="block hero-name-gradient pb-[0.18em]" style={morphStyle}>{PHRASES[idx].line2}</span>
    </h1>
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
      <span className="font-bold text-xl text-primary sm:text-2xl md:text-3xl">{value}</span>
      <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground/80 sm:text-[10px] sm:tracking-[0.18em]">{label}</span>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function HeroSection() {
  const { language } = useLanguage();
  const t = translations[language];
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 40, stiffness: 280 });
  const skewY = useTransform(smoothVelocity, [-2500, 0, 2500], [2.5, 0, -2.5]);
  const contentY = useTransform(scrollY, [0, 600], [0, -60]);

  return (
    <section
      className="relative flex min-h-[calc(100vh-6rem)] flex-col justify-center overflow-hidden sm:min-h-[calc(100vh-7rem)] md:min-h-[calc(100vh-8rem)]"
      id="hero"
    >
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[5%] top-[15%] h-[700px] w-[700px] rounded-full bg-primary/[0.09] blur-[150px]" />
        <div className="absolute bottom-[10%] right-[5%] h-[500px] w-[500px] rounded-full bg-primary/[0.06] blur-[130px]" />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-pattern opacity-[0.018]" />

      <motion.div
        className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-16"
        style={{ skewY }}
      >
        <motion.div style={{ y: contentY }}>

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
                href: "https://linkedin.com/in/dominik-koenitzer",
                label: "LinkedIn",
                icon: <Linkedin className="h-[18px] w-[18px]" />,
              },
              {
                href: "mailto:dominik.koenitzer@gmail.com",
                label: "Email",
                icon: <Mail className="h-[18px] w-[18px]" />,
              },
              {
                href: "https://www.paypal.com/paypalme/dominikkoenitzer",
                label: "PayPal",
                icon: (
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
                  </svg>
                ),
              },
            ].map(({ href, label, icon }) => (
              <a
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border/30 text-muted-foreground/60 transition-all duration-200 hover:border-primary/40 hover:bg-primary/[0.06] hover:text-primary"
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
                className="group h-10 rounded-lg px-6 text-sm font-medium shadow-[0_2px_16px_hsl(var(--primary)/0.25)] transition-shadow duration-200 hover:shadow-[0_4px_24px_hsl(var(--primary)/0.38)]"
              >
                <a className="flex items-center gap-1.5" href="/contact">
                  {t.hero.hireMe}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </a>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button
                asChild
                className="h-10 rounded-lg border-border/30 bg-transparent px-6 text-sm font-medium transition-all duration-200 hover:border-primary/25 hover:bg-primary/[0.04]"
                variant="outline"
              >
                <a href="/projects">{t.hero.viewWork}</a>
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
