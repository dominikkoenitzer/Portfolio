import { MotionConfig, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Briefcase,
  CalendarDays,
  GraduationCap,
  MapPin,
} from "lucide-react";
import type { ReactNode } from "react";
import type { Language } from "@/config/languages";
import { getTimeline, type TimelineEntry } from "@/constants/timeline";
import { revealOnScroll, revealStagger } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-context";
import { DUR, EASE_OUT, REVEAL, stagger } from "@/lib/motion";
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
 * Move one and move the rest with it: `SPINE`, the group marker's `h-8 sm:h-11`,
 * the bead's `top-[34px] sm:top-[42px]` (its 10px height puts its centre on 39
 * and 47) and the connector's `top-[39px] sm:top-[47px]` are all the same
 * measurement seen from different sides.
 */
const RAIL_CELL = "w-8 flex-none sm:w-11";
const RAIL_ROW = "flex gap-3 sm:gap-5";
const SPINE = "left-[15px] w-0.5 sm:left-[21px]";

/** The rail is decoration that is already in place: it fades, it never draws. */
const RAIL_FADE = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DUR.base, ease: EASE_OUT } },
} as const;

/**
 * One entry's slot on the rail: a bead on the spine and the hairline out to the
 * card. Decoration only. The year used to sit under the bead as a date index,
 * but the card beside it already prints the full period, so it was the same
 * number twice on one line.
 */
function RailNode({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <motion.div
      aria-hidden="true"
      className={`relative ${RAIL_CELL}`}
      {...revealOnScroll(reduceMotion, RAIL_FADE)}
    >
      <span className="absolute top-[39px] right-[-0.75rem] left-1/2 h-0.5 bg-border sm:top-[47px] sm:right-[-1.25rem]" />

      {/* The bead: one solid dot, sitting on the line. It used to carry a
          3px rim in the page colour, which is only the page colour where the
          aurora is pale: over the green stretch every rimmed bead read as a
          ring and the rest as dots, so the same element looked like two. */}
      <span className="absolute top-[34px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-primary sm:top-[42px]" />
    </motion.div>
  );
}

function LogoTile({ entry }: { entry: TimelineEntry }) {
  if (entry.logo) {
    return (
      <div
        className={`h-12 w-12 overflow-hidden rounded-xl border border-border/60 sm:h-14 sm:w-14 ${
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
    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/60 bg-primary/10 font-bold text-primary text-sm tracking-tight sm:h-14 sm:w-14 sm:text-base">
      {entry.monogram}
    </div>
  );
}

/**
 * One row of the timeline: the rail slot on the left, a real card on the right.
 * The card answers a hover with its border and nothing else, so the row never
 * moves under the pointer.
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
      <RailNode reduceMotion={reduceMotion} />

      {/* The entry arrives as one object and then unpacks: role, employer,
          dates, bullets and tags follow it up the rail one after another. Each
          row keeps its own trigger, because a group-wide one would spend the
          education group's last three reveals off-screen. */}
      <motion.article
        className="min-w-0 flex-1 rounded-2xl border border-border/60 bg-card p-4 transition-colors duration-200 ease-out group-hover/entry:border-primary/30 sm:p-5"
        {...revealOnScroll(reduceMotion, revealStagger(0.08, 0.05))}
      >
        <div className="flex items-start gap-3 sm:gap-4">
          <motion.div className="flex-none" variants={REVEAL}>
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
          className="mt-3.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground sm:text-xs"
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
          // Opaque on purpose: the spine runs behind this tile (see the `-z-10`
          // on it), so the line reads as entering the station and leaving it.
          className={`flex h-8 items-center justify-center rounded-xl border border-border/60 bg-secondary text-primary sm:h-11 ${RAIL_CELL}`}
          variants={REVEAL}
        >
          <span className="[&_svg]:h-4 [&_svg]:w-4 sm:[&_svg]:h-5 sm:[&_svg]:w-5">
            {icon}
          </span>
        </motion.span>
        <motion.h2 className="font-bold text-xl sm:text-2xl" variants={REVEAL}>
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

export function ExperienceSection() {
  const { language } = useLanguage();
  const t = getTimeline(language);

  return (
    <MotionConfig reducedMotion="user">
      <section className="section-padding" id="experience">
        <SectionHeading
          eyebrow={t.eyebrow}
          subtitle={t.subheading}
          title={t.heading}
        />

        {/* The CV lives on /about now, behind one button that opens the
            document for the language the site is in. */}
        <div className="relative mx-auto max-w-3xl space-y-14 sm:space-y-16">
          {/* The spine: one static hairline behind the whole stack, starting
              under the first group marker and stopping above the last year. */}
          <span
            aria-hidden="true"
            // The tail dissolves rather than stopping in mid-air: the last
            // card is taller than its bead, so a hard end left the line
            // running a few hundred pixels past the last date.
            className={`-z-10 pointer-events-none absolute top-8 bottom-6 bg-border [mask-image:linear-gradient(to_bottom,black_82%,transparent)] sm:top-11 ${SPINE}`}
          />
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
