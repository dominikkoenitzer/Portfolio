import { motion } from "framer-motion";
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
import { useLanguage } from "@/lib/language-provider";
import { SectionHeading } from "../layout/SectionHeading";

const EASE = [0.22, 1, 0.36, 1] as const;
const MAX_TAGS = 7;

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

function LogoTile({ entry }: { entry: TimelineEntry }) {
  if (entry.logo) {
    return (
      <div
        className={`h-12 w-12 flex-none overflow-hidden rounded-xl border border-border/50 shadow-sm sm:h-14 sm:w-14 ${
          entry.logoFill ? "" : "flex items-center justify-center bg-white p-1.5"
        }`}
      >
        <img
          alt={`${entry.organization} logo`}
          className={`h-full w-full ${entry.logoFill ? "object-cover" : "object-contain"}`}
          height={56}
          loading="lazy"
          src={entry.logo}
          width={56}
        />
      </div>
    );
  }

  return (
    <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl border border-border/50 bg-primary/10 font-bold text-primary text-sm tracking-tight sm:h-14 sm:w-14 sm:text-base">
      {entry.monogram}
    </div>
  );
}

function TimelineCard({
  entry,
  index,
  language,
}: {
  entry: TimelineEntry;
  index: number;
  language: Language;
}) {
  const duration = formatDuration(entry.start, entry.end, language);
  const visibleTags = entry.tags.slice(0, MAX_TAGS);
  const overflow = entry.tags.length - visibleTags.length;

  return (
    <motion.article
      className="flex gap-4 sm:gap-5"
      initial={{ opacity: 0, y: 18 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.06, 0.3),
        ease: EASE,
      }}
      viewport={{ once: true, margin: "-60px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <LogoTile entry={entry} />

      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-lg leading-tight sm:text-xl">
          {entry.role}
        </h3>

        <a
          className="group mt-1 inline-flex items-center gap-1 font-medium text-foreground/90 text-sm transition-colors hover:text-primary"
          href={entry.organizationUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          {entry.organization}
          <ArrowUpRight
            aria-hidden
            className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-primary"
          />
        </a>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1.5 font-mono text-muted-foreground text-xs">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays aria-hidden className="h-3.5 w-3.5 opacity-80" />
            <span>{entry.period}</span>
            <span aria-hidden className="opacity-40">
              ·
            </span>
            <span>{duration}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 sm:ml-2">
            <MapPin aria-hidden className="h-3.5 w-3.5 opacity-80" />
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
        </div>

        {entry.points.length > 0 && (
          <ul className="mt-4 space-y-2">
            {entry.points.map((point, pointIndex) => (
              <li
                className="relative pl-4 text-muted-foreground text-sm leading-relaxed"
                key={`${entry.organization}-${pointIndex}`}
              >
                <span
                  aria-hidden
                  className="absolute top-2 left-0 h-1 w-1 rounded-full bg-muted-foreground/50"
                />
                {point}
              </li>
            ))}
          </ul>
        )}

        {entry.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {visibleTags.map((tag) => (
              <span
                className="rounded-full border border-border/40 bg-secondary/40 px-3 py-1 text-foreground/80 text-xs"
                key={tag}
              >
                {tag}
              </span>
            ))}
            {overflow > 0 && (
              <span className="rounded-full border border-border/40 bg-secondary/30 px-3 py-1 text-muted-foreground text-xs">
                +{overflow}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.article>
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
  return (
    <div>
      <motion.div
        className="mb-8 flex items-center gap-3"
        initial={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.5, ease: EASE }}
        viewport={{ once: true, margin: "-60px" }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </span>
        <h2 className="font-bold text-xl sm:text-2xl">{title}</h2>
      </motion.div>

      <div className="space-y-10 sm:space-y-12">
        {entries.map((entry, i) => (
          <TimelineCard
            entry={entry}
            index={i}
            key={`${entry.organization}-${entry.period}`}
            language={language}
          />
        ))}
      </div>
    </div>
  );
}

export function TimelineSection() {
  const { language } = useLanguage();
  const t = getTimeline(language);

  return (
    <section className="section-padding" id="timeline">
      <SectionHeading
        eyebrow={t.eyebrow}
        subtitle={t.subheading}
        title={t.heading}
      />

      <div className="mx-auto max-w-3xl space-y-14 sm:space-y-16">
        <TimelineGroup
          entries={t.experience}
          icon={<Briefcase className="h-5 w-5" />}
          language={language}
          title={t.experienceTitle}
        />
        <TimelineGroup
          entries={t.education}
          icon={<GraduationCap className="h-5 w-5" />}
          language={language}
          title={t.educationTitle}
        />
      </div>
    </section>
  );
}
