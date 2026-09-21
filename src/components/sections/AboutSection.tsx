import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  GraduationCap,
  Languages,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";
import { revealOnScroll, revealStagger } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-context";
import { REVEAL, stagger } from "@/lib/motion";
import { translations } from "@/lib/translations";
import { SectionHeading } from "../layout/SectionHeading";
import { Button } from "../ui/button";
import { CvPreview } from "./CvPreview";
import { GitHubContributions } from "./GitHubContributions";

export function AboutSection() {
  const { language } = useLanguage();
  const t = translations[language].about;
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
          {...revealOnScroll(reduceMotion)}
        >
          <div className="mx-auto max-w-[268px] md:max-w-[348px]">
            <div className="aspect-square overflow-hidden rounded-2xl border border-border/60">
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
              to="/experience"
              value={t.cards.educationSubtitle}
            />

            {/* Points at /skills because that is where the spoken languages
                actually live, next to the technical ones. */}
            <InfoCard
              icon={<Languages />}
              label={t.cards.languagesTitle}
              to="/skills"
              value={t.cards.languagesSubtitle}
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="md:col-span-7 lg:col-span-7 md:flex md:flex-col"
          {...revealOnScroll(reduceMotion)}
        >
          {/* One trigger for the whole card: the panel rises, then the heading,
              the three paragraphs and the buttons follow it in sequence instead
              of each running its own hand-set delay. */}
          <motion.div
            className="rounded-2xl border border-border/60 bg-card p-6 transition-colors duration-200 ease-out hover:border-primary/30 sm:p-8 md:flex md:flex-1 md:flex-col"
            {...revealOnScroll(reduceMotion, revealStagger())}
          >
            <motion.h2
              className="mb-4 font-semibold text-xl sm:mb-6 sm:text-2xl"
              variants={REVEAL}
            >
              {t.passionate}{" "}
              <span className="text-primary">{t.passionateRole}</span>
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
                {t.intro2Before}
                <span className="font-medium text-foreground">
                  {t.intro2Highlight}
                </span>
                {t.intro2After}
              </motion.p>

              <motion.p
                className="text-muted-foreground text-sm leading-relaxed sm:text-base"
                variants={REVEAL}
              >
                {t.intro3Before}
                <span className="font-medium text-foreground">
                  {t.intro3Highlight}
                </span>
                {t.intro3After}
              </motion.p>
            </div>

            {/* The card's footer: a hairline, then the two actions. `md:mt-auto`
                parks it on the card's floor, so when the card stretches to the
                portrait column the air lands above the rule (where a card wants
                air) instead of below the buttons. */}
            <motion.div
              className="mt-6 flex flex-col gap-3 border-border/40 border-t pt-6 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4 sm:pt-8 md:mt-auto"
              variants={REVEAL}
            >
              {/* `sm:flex-wrap` stays: the German labels are the widest of the
                  four languages, and without wrapping the last action ran past
                  the card's edge at tablet widths. */}
              {/* Lucide, like every other icon on the site. The trailing one
                  leans on hover through `.btn-icon-nudge` on the size variant,
                  so neither button needs a nudge of its own. */}
              <Button asChild className="rounded-lg px-6" variant="cta">
                <Link to="/skills">
                  {t.exploreSkills}
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
              {/* One button for both CV documents: it opens the one that
                  matches the language the site is in. */}
              <CvPreview />
              {/* The last paragraph ends on "I'm easy to reach", so the route
                  that makes good on it belongs in the same row. */}
              <Button asChild variant="outline">
                <Link to="/contact">
                  <Mail aria-hidden />
                  {t.getInTouch}
                </Link>
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
 * A fact tile, built to the /donate amount tile: micro-label over a value, a
 * hairline border that warms under the pointer, an arrow that leans out to the
 * corner it points at. These two are also the only body links on /about that
 * reach Timeline and Services, which nothing else on the page pointed at.
 */
function InfoCard({ icon, label, value, to }: InfoCardProps) {
  return (
    <motion.div variants={REVEAL}>
      <Link
        className="group/tile flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 transition-colors duration-200 ease-out hover:border-primary/30 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:p-5"
        to={to}
      >
        {/* Decorative: the label says the same thing in words. */}
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary [&_svg]:h-[18px] [&_svg]:w-[18px]"
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
            {label}
          </p>
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
