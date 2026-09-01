import {
  MotionConfig,
  motion,
  type MotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import {
  ArrowUpRight,
  Briefcase,
  CalendarDays,
  ExternalLink,
  FileText,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { type ReactNode, useRef } from "react";
import type { Language } from "@/config/languages";
import { getTimeline, type TimelineEntry } from "@/constants/timeline";
import { revealOnScroll, revealStagger } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-context";
import { DUR, EASE_OUT, REVEAL, SPRING_SOFT, stagger } from "@/lib/motion";
import { translations } from "@/lib/translations";
import { SectionHeading } from "../layout/SectionHeading";
import { TimelineTags } from "./TimelineTags";

const DURATION_UNITS: Record<
  Language,
  { year: (n: number) => string; month: (n: number) => string }
> = {
  en: {
    year: (n) => `${n} yr${n === 1 ? "" : "s"}`,
    month: (n) => `${n} mth${n === 1 ? "" : "s"}`,
  },
  de: { year: (n) => `${n} J.`, month: (n) => `${n} Mon.` },
  fr: {
    year: (n) => `${n} an${n === 1 ? "" : "s"}`,
    month: (n) => `${n} mois`,
  },
  zh: { year: (n) => `${n} 年`, month: (n) => `${n} 个月` },
};

function parseYearMonth(value: string): { year: number; month: number } {
  const [year, month] = value.split("-").map(Number);
  return { year, month: month ?? 1 };
}

/**
 * Human "2 yrs 11 mths"-style range. Ongoing entries (no `end`) run to today
 * and count the current month, matching the convention used on the source CV.
 */
function formatDuration(
  start: string,
  end: string | undefined,
  lang: Language,
): string {
  const from = parseYearMonth(start);
  const now = new Date();
  const to = end
    ? parseYearMonth(end)
    : { year: now.getFullYear(), month: now.getMonth() + 1 };

  let months = (to.year - from.year) * 12 + (to.month - from.month);
  if (months < 0) months = 0;
  if (!end) months += 1;

  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  const units = DURATION_UNITS[lang] ?? DURATION_UNITS.en;

  const parts: string[] = [];
  if (years > 0) parts.push(units.year(years));
  if (remMonths > 0) parts.push(units.month(remMonths));
  if (parts.length === 0) parts.push(units.month(1));
  return parts.join(" ");
}

/*
 * Rail geometry. The spine, the beads, the group markers and the connector
 * hairlines all have to land on one vertical axis, so the numbers that decide
 * it live together here:
 *
 *   rail cell width   32px / 44px   (mobile / sm)
 *   spine x           16px / 22px   the centre of that cell
 *   bead centre y     40px / 48px   from the top of a row, which is where the
 *                                   card's own padding puts the middle of the
 *                                   logo tile (16 + 24, then 20 + 28)
 *
 * Move one and move the rest with it: `SPINE`, the group marker's `h-8 sm:h-11`
 * and the `top-8 sm:top-10` on the bead are all the same measurement seen from
 * different sides.
 */
const RAIL_CELL = "w-8 flex-none sm:w-11";
const RAIL_ROW = "flex gap-3 sm:gap-5";
const SPINE = "left-[15px] w-0.5 sm:left-[21px]";

/** The logo tile and the group markers arrive by scale rather than by rise. */
const POP = {
  hidden: { scale: 0.6, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: SPRING_SOFT },
} as const;

/** A bead outlines itself first, */
const BEAD_RING = {
  hidden: { scale: 0.4, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: { duration: DUR.base, ease: EASE_OUT },
  },
} as const;

/** then fills. Both are pure scale, so nothing repaints per frame. */
const BEAD_CORE = {
  hidden: { scale: 0 },
  show: { scale: 1, transition: SPRING_SOFT },
} as const;

/** The hairline from the bead to the card, drawn outward from the spine. */
const CONNECTOR = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: { duration: DUR.base, ease: EASE_OUT },
  },
} as const;

/** For the year label on the rail: it is already in place, it just appears. */
const FADE = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DUR.base, ease: EASE_OUT } },
} as const;

/**
 * The spine: a pale static track with the palette gradient tracing over it as
 * the stack scrolls past, violet at the newest entry and cooling to blush by
 * the oldest. `pathLength` is the one length-like property that is safe to
 * animate, and it is the technique the Services branch already uses.
 * Reduced motion gets the line fully drawn and never subscribes to scroll.
 */
function Spine({ draw, drawn }: { draw: MotionValue<number>; drawn: boolean }) {
  return (
    // The wrapper is what `top`/`bottom` stretches. An <svg> is a replaced
    // element, and an absolutely positioned replaced element with `height:auto`
    // takes its intrinsic height and ignores `bottom` outright: on this viewBox
    // that pinned the spine to 100px no matter how tall the stack was.
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute top-8 bottom-6 sm:top-11 ${SPINE}`}
    >
      <svg
        className="h-full w-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 2 100"
      >
        <title>Timeline spine</title>
        <defs>
        {/* userSpaceOnUse, deliberately: a vertical line has a zero-width
            bounding box, and an objectBoundingBox gradient over one is
            degenerate. */}
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="timeline-spine"
            x1="0"
            x2="0"
            y1="0"
            y2="100"
          >
            <stop
              offset="0%"
              stopColor="hsl(var(--primary))"
              stopOpacity="0.85"
            />
            <stop offset="34%" stopColor="hsl(var(--lilac))" stopOpacity="0.75" />
            <stop offset="70%" stopColor="hsl(var(--blush))" stopOpacity="0.7" />
            {/* Full strength past the last bead, then the tail dissolves. */}
            <stop offset="90%" stopColor="hsl(var(--blush))" stopOpacity="0.7" />
            <stop offset="100%" stopColor="hsl(var(--blush))" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* The undrawn track, so the spine reads as a route with road left. */}
        <path d="M1 0V100" stroke="hsl(var(--border))" strokeWidth="2" />
        <motion.path
          d="M1 0V100"
          stroke="url(#timeline-spine)"
          strokeWidth="2"
          style={{ pathLength: drawn ? 1 : draw }}
        />
      </svg>
    </div>
  );
}

/**
 * One entry's slot on the rail: the bead, the hairline out to the card and the
 * start year under it, so the rail reads as a date index (2025, 2023, 2021,
 * 2016, 2014) on its own. All decoration: every word of it is also in the card.
 */
function RailNode({
  reduceMotion,
  year,
}: {
  reduceMotion: boolean | null;
  year: string;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className={`relative ${RAIL_CELL}`}
      {...revealOnScroll(reduceMotion, stagger(0.05, 0.07))}
    >
      <motion.span
        className="absolute top-[39px] right-[-0.75rem] left-1/2 h-0.5 origin-left rounded-full bg-primary/25 sm:top-[47px] sm:right-[-1.25rem]"
        variants={CONNECTOR}
      />

      {/* The hover scale lives on this plain wrapper, not on the beads: framer
          writes the finished entrance back as an inline transform, which would
          out-rank a class rule on the same element for good. */}
      <div className="absolute top-8 left-1/2 h-4 w-4 -translate-x-1/2 transition-transform duration-200 ease-out group-hover/entry:scale-125 sm:top-10">
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-primary/30 bg-background"
          variants={BEAD_RING}
        />
        <motion.span
          className="absolute inset-1 rounded-full bg-primary"
          variants={BEAD_CORE}
        />
      </div>

      <span className="absolute top-[52px] right-0 left-0 text-center sm:top-[60px]">
        <motion.span
          className="inline-block font-mono text-[10px] text-muted-foreground tabular-nums"
          variants={FADE}
        >
          {year}
        </motion.span>
      </span>
    </motion.div>
  );
}

// The logo tile reacts to a hover anywhere on the entry. Transform and colour
// only, and it is the one thing inside the card that moves: the card itself
// deliberately does not lift, so a chip's own hover lift is unambiguous.
const LOGO_HOVER =
  "transform-gpu transition-[transform,border-color,box-shadow] duration-200 ease-out group-hover/entry:-translate-y-0.5 group-hover/entry:scale-[1.04] group-hover/entry:border-primary/40 group-hover/entry:shadow-[0_8px_24px_-6px_hsl(var(--primary)/0.35)]";

function LogoTile({ entry }: { entry: TimelineEntry }) {
  if (entry.logo) {
    return (
      <div
        className={`h-12 w-12 overflow-hidden rounded-xl border border-border/50 shadow-sm sm:h-14 sm:w-14 ${LOGO_HOVER} ${
          entry.logoFill ? "" : "flex items-center justify-center bg-white p-1.5"
        }`}
      >
        <img
          alt={`${entry.organization} logo`}
          className={`h-full w-full ${entry.logoFill ? "object-cover" : "object-contain"}`}
          decoding="async"
          height={56}
          loading="lazy"
          src={entry.logo}
          width={56}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-xl border border-border/50 bg-primary/10 font-bold text-primary text-sm tracking-tight sm:h-14 sm:w-14 sm:text-base ${LOGO_HOVER}`}
    >
      {entry.monogram}
    </div>
  );
}

/**
 * One row of the timeline: the rail slot on the left, a real card on the right.
 *
 * The card has no hover lift of its own on purpose. It used to, and because the
 * tag chips inside it lift too, hovering a single chip moved that chip 6px and
 * all of its siblings 4px, which read as a glitch. The card now answers a hover
 * with its border, its shadow and its logo tile; the only thing that travels in
 * the chip row is the chip under the pointer.
 */
function TimelineEntryRow({
  entry,
  language,
}: {
  entry: TimelineEntry;
  language: Language;
}) {
  const reduceMotion = useReducedMotion();
  const duration = formatDuration(entry.start, entry.end, language);
  const moreLabel = getTimeline(language).moreTags;

  return (
    <li className={`group/entry relative ${RAIL_ROW}`}>
      <RailNode reduceMotion={reduceMotion} year={entry.start.slice(0, 4)} />

      {/* The entry arrives as one object and then unpacks: role, employer,
          dates, bullets and tags follow it up the rail one after another. Each
          row keeps its own trigger, because a group-wide one would spend the
          education group's last three reveals off-screen. */}
      <motion.article
        className="min-w-0 flex-1 rounded-2xl border border-border/70 bg-card/80 p-4 shadow-[0_2px_10px_-4px_hsl(var(--primary)/0.14)] transition-[border-color,background-color,box-shadow] duration-300 ease-out group-hover/entry:border-primary/35 group-hover/entry:bg-card group-hover/entry:shadow-[0_18px_44px_-20px_hsl(var(--primary)/0.45)] sm:p-5"
        {...revealOnScroll(reduceMotion, revealStagger(0.08, 0.05))}
      >
        <div className="flex items-start gap-3 sm:gap-4">
          <motion.div className="flex-none" variants={POP}>
            <LogoTile entry={entry} />
          </motion.div>

          <div className="min-w-0 flex-1">
            <motion.h3
              className="hyphens-auto break-words font-bold text-lg leading-snug sm:text-xl"
              variants={REVEAL}
            >
              {entry.role}
            </motion.h3>

            <motion.a
              className="group/org mt-1 inline-flex max-w-full items-center gap-1 break-words rounded-sm font-medium text-foreground/90 text-sm transition-colors duration-200 ease-out hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              href={entry.organizationUrl}
              rel="noopener noreferrer"
              target="_blank"
              variants={REVEAL}
            >
              {entry.organization}
              <ArrowUpRight
                aria-hidden
                className="h-3.5 w-3.5 flex-none text-muted-foreground transition-[transform,color] duration-200 ease-out group-hover/org:-translate-y-0.5 group-hover/org:translate-x-0.5 group-hover/org:text-primary"
              />
            </motion.a>
          </div>
        </div>

        <motion.div
          className="mt-3.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-muted-foreground transition-colors duration-200 ease-out group-hover/entry:text-foreground/70 sm:text-xs"
          variants={REVEAL}
        >
          <span className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-1">
            <CalendarDays
              aria-hidden
              className="h-3.5 w-3.5 flex-none opacity-80"
            />
            <span>{entry.period}</span>
            <span aria-hidden className="opacity-40">
              ·
            </span>
            <span>{duration}</span>
          </span>
          <span className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-1 sm:ml-2">
            <MapPin aria-hidden className="h-3.5 w-3.5 flex-none opacity-80" />
            <span>{entry.location}</span>
            {entry.arrangement && (
              <>
                <span aria-hidden className="opacity-40">
                  ·
                </span>
                <span>{entry.arrangement}</span>
              </>
            )}
            {entry.commitment && (
              <>
                <span aria-hidden className="opacity-40">
                  ·
                </span>
                <span>{entry.commitment}</span>
              </>
            )}
          </span>
        </motion.div>

        {entry.points.length > 0 && (
          <motion.ul
            className="mt-4 space-y-2 border-border/60 border-t pt-4"
            variants={REVEAL}
          >
            {entry.points.map((point, pointIndex) => (
              <li
                className="relative pl-4 text-muted-foreground text-sm leading-relaxed"
                key={`${entry.organization}-${pointIndex}`}
              >
                <span
                  aria-hidden
                  className="absolute top-[0.6em] left-0 h-1.5 w-1.5 rounded-full bg-primary/40"
                />
                {point}
              </li>
            ))}
          </motion.ul>
        )}

        {entry.tags.length > 0 && (
          <motion.div variants={REVEAL}>
            <TimelineTags moreLabel={moreLabel} tags={entry.tags} />
          </motion.div>
        )}
      </motion.article>
    </li>
  );
}

function TimelineGroup({
  title,
  icon,
  entries,
  language,
}: {
  title: string;
  icon: ReactNode;
  entries: TimelineEntry[];
  language: Language;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div>
      {/* The group marker is a station on the spine, not a label beside it: the
          tile is exactly the rail cell wide and opaque, so the line runs into
          it and out the other side. */}
      <motion.div
        className={`mb-7 items-center sm:mb-8 ${RAIL_ROW}`}
        {...revealOnScroll(reduceMotion, stagger())}
      >
        <motion.span
          aria-hidden="true"
          className={`flex h-8 items-center justify-center rounded-xl border border-border/60 bg-secondary text-primary shadow-sm sm:h-11 ${RAIL_CELL}`}
          variants={POP}
        >
          <span className="[&_svg]:h-4 [&_svg]:w-4 sm:[&_svg]:h-5 sm:[&_svg]:w-5">
            {icon}
          </span>
        </motion.span>
        <motion.h2
          className="font-bold text-xl sm:text-2xl"
          variants={REVEAL}
        >
          {title}
        </motion.h2>
      </motion.div>

      <ol className="space-y-8 sm:space-y-10">
        {entries.map((entry) => (
          <TimelineEntryRow
            entry={entry}
            key={`${entry.organization}-${entry.period}`}
            language={language}
          />
        ))}
      </ol>
    </div>
  );
}

function CvDownload({
  href,
  title,
  subtitle,
}: {
  href: string;
  title: string;
  subtitle: string;
}) {
  // The reveal sits on a wrapper, not on the link: the lift on hover is a CSS
  // transform, and an inline one from the entrance would outrank it forever.
  return (
    <motion.div variants={REVEAL}>
      <a
        className="group/cv flex transform-gpu items-center gap-3 rounded-xl border border-border/50 bg-secondary/30 px-4 py-3 transition-[transform,border-color,background-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/[0.06] hover:shadow-[0_12px_32px_-12px_hsl(var(--primary)/0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-200 ease-out group-hover/cv:bg-primary/15">
          <FileText aria-hidden className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="block font-medium text-foreground text-sm leading-tight">
            {title}
          </span>
          <span className="block text-muted-foreground text-xs">{subtitle}</span>
        </span>
        <ExternalLink
          aria-hidden
          className="h-4 w-4 flex-none text-muted-foreground transition-[transform,color] duration-200 ease-out group-hover/cv:-translate-y-0.5 group-hover/cv:translate-x-0.5 group-hover/cv:text-primary"
        />
      </a>
    </motion.div>
  );
}

export function TimelineSection() {
  const { language } = useLanguage();
  const t = getTimeline(language);
  const langNames = translations[language].skills.langNames;
  const reduceMotion = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);

  // The spine draws as the whole stack passes through: 0 when its head reaches
  // the lower sixth of the viewport, 1 when its foot is a little above the
  // middle. Sprung, so a flick of the wheel does not snap the line forward.
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 85%", "end 55%"],
  });
  const draw = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <MotionConfig reducedMotion="user">
      <section className="section-padding" id="timeline">
        <SectionHeading
          eyebrow={t.eyebrow}
          subtitle={t.subheading}
          title={t.heading}
        />

        <motion.div
          className="mx-auto mb-12 grid max-w-xl grid-cols-1 gap-3 sm:mb-16 sm:grid-cols-2"
          {...revealOnScroll(reduceMotion, stagger())}
        >
          <CvDownload
            href="/cv/curriculum-vitae.html"
            subtitle={langNames.english}
            title="Curriculum Vitae"
          />
          <CvDownload
            href="/cv/lebenslauf.html"
            subtitle={langNames.german}
            title="Lebenslauf"
          />
        </motion.div>

        <div
          className="relative mx-auto max-w-3xl space-y-14 sm:space-y-16"
          ref={railRef}
        >
          <Spine draw={draw} drawn={Boolean(reduceMotion)} />
          <TimelineGroup
            entries={t.experience}
            icon={<Briefcase />}
            language={language}
            title={t.experienceTitle}
          />
          <TimelineGroup
            entries={t.education}
            icon={<GraduationCap />}
            language={language}
            title={t.educationTitle}
          />
        </div>
      </section>
    </MotionConfig>
  );
}
