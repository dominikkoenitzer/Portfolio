import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Award, GraduationCap } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  fadeInLeft,
  fadeInRight,
  fadeInUp,
  revealOnScroll,
  revealStagger,
} from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-context";
import { DUR, EASE_OUT, REVEAL, stagger } from "@/lib/motion";
import { translations } from "@/lib/translations";
import { SectionHeading } from "../layout/SectionHeading";
import { Button } from "../ui/button";
import { GitHubContributions } from "./GitHubContributions";

export function AboutSection() {
  const { language } = useLanguage();
  const t = translations[language].about;

  // When the columns stack on mobile, the desktop left/right slide-ins read as
  // the content drifting sideways (the avatar visibly slides right on load). Use
  // a plain vertical fade there; keep the horizontal slides on the wide layout.
  const [isMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches,
  );
  const avatarReveal = isMobile ? fadeInUp : fadeInLeft;
  const bioReveal = isMobile ? fadeInUp : fadeInRight;
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-padding" id="about">
      <SectionHeading
        eyebrow={t.eyebrow}
        subtitle={t.subheading}
        title={t.heading}
      />

      {/* Both columns stretch to the taller of the two (the grid's default),
          and each one owns where its slack goes: the left column pushes the
          fact tiles down to its floor, the right column pins the card's action
          row to the same line. The columns therefore finish level in every
          language instead of 100-200px out of step. */}
      <div className="grid gap-8 md:grid-cols-12 md:gap-10">
        <motion.div
          className="md:col-span-5 lg:col-span-5 md:flex md:flex-col"
          {...avatarReveal}
        >
          <div className="relative mx-auto max-w-[268px] md:max-w-[348px]">
            <div className="aspect-square overflow-hidden rounded-2xl shadow-lg ring-1 ring-border/20">
              {/* LCP element on /about: fetchPriority high + async decode so it
                  paints fast; explicit square dimensions reserve space (no CLS).
                  Self-hosted copy of the GitHub avatar (public/avatar.jpg, 460px):
                  no third-party connection on the critical path, and it keeps
                  rendering when github.com is unreachable. */}
              <img
                alt="Dominik Könitzer"
                className="h-full w-full object-cover"
                decoding="async"
                fetchPriority="high"
                height={460}
                src="/avatar.jpg"
                width={460}
              />
            </div>
            {/* A mat, not a second card. This is the only decoration behind
                the portrait: one hairline that sits an even 10px outside it on
                all four sides. It used to be an inset-0 frame nudged 14px down
                and right, which an opaque photo hides on two sides, so all you
                ever saw was a stray L-shaped rect off the bottom-right corner.
                Centred, it can only read as a frame. */}
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              aria-hidden="true"
              className="-z-10 -inset-2.5 absolute rounded-[1.625rem] border border-primary/15"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
              transition={{ duration: DUR.slow, delay: 0.25, ease: EASE_OUT }}
            />
          </div>

          {/* Same width and centre line as the portrait above them, so the
              column reads as one stack: past ~1100px the track is wider than
              the 348px photo, and full-bleed tiles left it hanging off-axis
              with a third of each tile empty.
              `md:mt-auto` is the left column's slack: when the bio card is the
              taller of the two, the gap opens under the portrait rather than
              leaving the tiles hanging above the card's floor. `md:pt-10` keeps
              the minimum gap when there is no slack to spend. */}
          <motion.div
            className="mt-8 space-y-3 sm:space-y-4 md:mx-auto md:mt-auto md:w-full md:max-w-[348px] md:pt-10"
            {...revealOnScroll(reduceMotion, stagger())}
          >
            <InfoCard
              icon={<GraduationCap />}
              label={t.cards.educationTitle}
              to="/timeline"
              value={t.cards.educationSubtitle}
            />

            <InfoCard
              icon={<Award />}
              label={t.cards.specializedTitle}
              to="/services"
              value={t.cards.specializedSubtitle}
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="md:col-span-7 lg:col-span-7 md:flex md:flex-col"
          {...bioReveal}
        >
          {/* One trigger for the whole card: the panel rises, then the heading,
              the three paragraphs and the buttons follow it in sequence instead
              of each running its own hand-set delay. */}
          <motion.div
            className="glass-card rounded-2xl p-6 sm:p-8 md:flex md:flex-1 md:flex-col"
            {...revealOnScroll(reduceMotion, revealStagger())}
          >
            <motion.h2
              className="mb-4 font-semibold text-xl sm:mb-6 sm:text-2xl"
              variants={REVEAL}
            >
              {t.passionate}{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {t.passionateRole}
              </span>
            </motion.h2>

            <div className="space-y-4 sm:space-y-5">
              <motion.p
                className="text-muted-foreground text-sm leading-relaxed sm:text-base"
                variants={REVEAL}
              >
                {t.intro1Before}
                <span className="font-medium text-foreground">
                  {t.intro1Highlight}
                </span>
                {t.intro1After}
              </motion.p>

              <motion.p
                className="text-muted-foreground text-sm leading-relaxed sm:text-base"
                variants={REVEAL}
              >
                {t.intro2}
              </motion.p>

              <motion.p
                className="text-muted-foreground text-sm leading-relaxed sm:text-base"
                variants={REVEAL}
              >
                {t.intro3Before}
                <span className="font-medium text-foreground">
                  {t.intro3Word1}
                </span>
                {t.intro3Comma1}
                <span className="font-medium text-foreground">
                  {t.intro3Word2}
                </span>
                {t.intro3Comma2}
                <span className="font-medium text-foreground">
                  {t.intro3Word3}
                </span>
                {t.intro3After}
              </motion.p>
            </div>

            {/* The card's footer: a hairline, then the two actions. `md:mt-auto`
                parks it on the card's floor, so when the card stretches to the
                portrait column the air lands above the rule (where a card wants
                air) instead of below the buttons. */}
            <motion.div
              className="mt-6 flex flex-col gap-3 border-border/40 border-t pt-6 sm:mt-8 sm:flex-row sm:gap-4 sm:pt-8 md:mt-auto"
              variants={REVEAL}
            >
              <Button asChild className="group" variant="default">
                <Link to="/skills">
                  {t.exploreSkills}
                  <svg
                    className="ml-2 h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </Link>
              </Button>
              <Button asChild className="group" variant="outline">
                <a
                  href="https://senbon.ch/journal"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                  {t.readJournal}
                  <svg
                    className="ml-2 h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* GitHub Contributions. The gap above lives on the card itself, so an
          endpoint failure (the widget renders nothing) leaves no empty band. */}
      <motion.div {...revealOnScroll(reduceMotion)}>
        <GitHubContributions />
      </motion.div>
    </section>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  /** Mono micro-label: the category ("Education"). */
  label: string;
  /** The fact itself, and the line the eye should land on. */
  value: string;
  /** Where the fact is expanded on: the tile is the whole hit target. */
  to: string;
}

/**
 * A fact tile, built to the /donate amount tile: micro-label over a value,
 * hairline border, a lift and a warmed fill on hover, an arrow that leans out
 * to the corner it points at. The entrance variant stays on an outer wrapper so
 * the column's cascade delay can never apply to the hover, and the hover rides
 * the independent `translate`/`scale` properties for the same reason /donate's
 * tiles do: they compose with a finished framer transform instead of losing to
 * it. These two are also the only body links on /about that reach Timeline and
 * Services, which nothing else on the page pointed at.
 */
function InfoCard({ icon, label, value, to }: InfoCardProps) {
  return (
    <motion.div variants={REVEAL}>
      <Link
        className="group/tile flex items-center gap-4 rounded-xl border border-border/30 bg-background/40 p-4 shadow-sm backdrop-blur-sm transition-[translate,scale,border-color,background-color,box-shadow] duration-200 ease-out hover:border-primary/40 hover:bg-primary/[0.04] hover:shadow-md hover:[translate:0_-2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background active:[scale:0.985] sm:p-5"
        to={to}
      >
        {/* Decorative: the label says the same thing in words. */}
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary/[0.07] text-primary transition-colors duration-200 ease-out group-hover/tile:border-primary/30 group-hover/tile:bg-primary/10 [&_svg]:h-[18px] [&_svg]:w-[18px]"
        >
          {icon}
        </span>
        <div className="min-w-0">
          <h2 className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
            {label}
          </h2>
          <p className="mt-1 font-medium text-sm transition-colors duration-200 ease-out group-hover/tile:text-primary sm:text-base">
            {value}
          </p>
        </div>
        <ArrowUpRight
          aria-hidden
          className="ml-auto h-4 w-4 shrink-0 text-muted-foreground/60 transition-[transform,color] duration-200 ease-out group-hover/tile:-translate-y-0.5 group-hover/tile:translate-x-0.5 group-hover/tile:text-primary"
        />
      </Link>
    </motion.div>
  );
}
