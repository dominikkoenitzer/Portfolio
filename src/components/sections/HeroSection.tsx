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
import { SplitText } from "@/components/effects/SplitText";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/constants";
import { useLanguage } from "@/lib/language-context";
import { DUR, EASE_OUT, REVEAL, stagger } from "@/lib/motion";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";
import { translations } from "@/lib/translations";

const MORPH_EASE = `cubic-bezier(${EASE_OUT.join(", ")})`;
/** The name swaps the instant the outgoing one has finished clearing. */
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

  /*
   * A clip-path wipe, not a transform: the name carries `hero-name-gradient`,
   * i.e. a `background-clip: text` fill, and `clip-path` clips the painted
   * gradient with the glyphs it fills. It also keeps the promise the old
   * transform version made for a different reason: the line spans the
   * viewport at 7.5rem, and a transformed layer makes Chrome rasterize text
   * that size through the compositor, which is visibly soft on dense screens.
   * `inset()` never scales the layer, so the settled name stays sharp.
   *
   * The same reasoning rules out splitting this line into per-character spans
   * (see `SplitText`): a gradient clipped to one element cannot be inherited by
   * transformed children, they would all render transparent.
   */
  const morphStyle: React.CSSProperties = reduceMotion
    ? {}
    : {
        opacity: morphOut ? 0 : 1,
        clipPath: morphOut ? "inset(0 0 100% 0)" : "inset(0 0 0 0)",
        transition: morphOut
          ? `opacity ${DUR.fast}s ease-in, clip-path ${DUR.fast}s ease-in`
          : `opacity ${DUR.slow}s ${MORPH_EASE}, clip-path ${DUR.slow}s ${MORPH_EASE}`,
      };

  return (
    <>
      {/* Stable, SEO-friendly heading for assistive tech and crawlers. The
          visible name below cycles purely as decoration (aria-hidden), so it
          never re-announces every few seconds. */}
      <h1 className="sr-only">Dominik Könitzer, {SITE_CONFIG.title}</h1>
      <div
        aria-hidden="true"
        className="mb-5 overflow-visible leading-[0.95] tracking-[-0.01em] sm:mb-6 md:mb-7"
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
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.28);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
      }}
      ref={ref}
      style={{ x: sx, y: sy }}
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
  // The cue has done its job the moment the page moves; fading it on scroll
  // keeps it from sitting over the section below.
  const cueOpacity = useTransform(scrollY, [0, 120], [1, 0]);

  // Seeded on the first client render, like NameMorphTitle: reduced motion gets
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
      {/* Ambient: radial-gradient glows instead of solid circles under a heavy
          `blur()`; same soft look, no costly blur pass on mobile. */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute top-[15%] left-[5%] h-[700px] w-[700px]"
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
            status line, greeting, tagline, social row and CTAs cascade off a
            single stagger parent, so the order stays fixed no matter what is
            added between them. The morph title sits in the middle without a
            variant of its own, it is already animating on its own clock. */}
        <motion.div
          animate="show"
          initial={reduceMotion ? "show" : "hidden"}
          style={{ y: reduceFx ? 0 : contentY }}
          variants={stagger(0.18, 0.2)}
        >
          {/* Availability. Sage is the site's signal colour and stays rare;
              this is the one thing on the home page asking to be looked at, so
              it earns the dot. The ping ring is a CSS animation, which the
              global reduced-motion rule in index.css already cancels. */}
          <motion.div className="mb-5 sm:mb-6" variants={REVEAL}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-sage/45 bg-sage/[0.10] py-1.5 pr-3.5 pl-3">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sage-deep" />
              </span>
              <span className="eyebrow">{t.hero.available}</span>
            </span>
          </motion.div>

          {/* Greeting, completed by the rotating name below it. Split per
              character so the line writes itself in rather than fading up as a
              block; it is flat-coloured, so the split is safe here. */}
          {/* The paragraph orchestrates rather than animates: it takes its slot
              in the hero cascade and then deals its own characters out, 30ms
              apart. Giving it REVEAL as well would fade the whole line up
              underneath the letters and read as two animations fighting. */}
          <motion.p
            className="mb-3 font-semibold text-foreground/90 sm:mb-4"
            style={{ fontSize: "clamp(1.15rem, 2.5vw, 1.75rem)" }}
            variants={stagger(0, 0.03)}
          >
            <SplitText static={reduceMotion} text={t.hero.greeting} />
          </motion.p>

          <NameMorphTitle />

          {/* What the name is attached to. The hero was greeting + name + two
              buttons and said nothing about the work; this is the one line that
              does, and it is what the page is actually about. */}
          <motion.p
            className="mb-7 max-w-xl text-balance text-muted-foreground leading-relaxed sm:mb-8"
            style={{ fontSize: "clamp(1rem, 1.6vw, 1.2rem)" }}
            variants={REVEAL}
          >
            {t.hero.tagline}
          </motion.p>

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
                className="group h-10 rounded-lg px-6 font-medium text-sm"
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
                className="h-10 rounded-lg border-primary/25 bg-transparent px-6 font-medium text-sm hover:border-primary/45 hover:bg-primary/[0.04]"
                variant="outline"
              >
                <Link to="/projects">{t.hero.viewWork}</Link>
              </Button>
            </Magnetic>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll cue. Decorative and desktop-only: on a phone the hero already
          ends mid-thumb, and the section beneath is obvious. Fades out as soon
          as the page moves. */}
      {reduceMotion ? null : (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-6 hidden justify-center md:flex"
          style={{ opacity: cueOpacity }}
        >
          <span className="flex flex-col items-center gap-2">
            {/* Full-strength muted foreground, not an opacity of it: 10px
                type at /70 lands under the 4.5:1 AA floor, which is exactly
                the regression the small-type contrast pass cleared. */}
            <span className="eyebrow text-muted-foreground">
              {t.hero.scrollCue}
            </span>
            <span className="relative block h-9 w-px overflow-hidden bg-border">
              <span className="animate-scroll-cue absolute inset-x-0 top-0 block h-3 bg-primary/70" />
            </span>
          </span>
        </motion.div>
      )}
    </section>
  );
}
