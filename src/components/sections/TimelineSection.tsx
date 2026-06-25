import {
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowUpRight,
  Briefcase,
  CalendarDays,
  Download,
  FileText,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { type ReactNode, useRef } from "react";
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

// Shared hover transition for the logo tile (also reacts to the card's hover).
const LOGO_HOVER =
  "transition-all duration-300 group-hover/card:-translate-y-0.5 group-hover/card:scale-[1.04] group-hover/card:border-primary/40 group-hover/card:shadow-[0_8px_24px_-6px_hsl(var(--primary)/0.35)]";

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

function TimelineCard({
  entry,
  index,
  language,
}: {
  entry: TimelineEntry;
  index: number;
  language: Language;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Scroll-linked parallax: the logo tile drifts vertically as the card moves
  // through the viewport, so it floats a touch behind the text. Spring-smoothed.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const parallaxY = useSpring(useTransform(scrollYProgress, [0, 1], [14, -14]), {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  const duration = formatDuration(entry.start, entry.end, language);
  const visibleTags = entry.tags.slice(0, MAX_TAGS);
  const overflow = entry.tags.length - visibleTags.length;

  return (
    <motion.article
      className="group/card flex gap-4 sm:gap-5"
      initial={{ opacity: 0, y: 18 }}
      ref={ref}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.06, 0.3),
        ease: EASE,
      }}
      viewport={{ once: true, margin: "-60px" }}
      whileHover={{ y: -4, transition: { duration: 0.25, ease: EASE } }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <motion.div
        className="flex-none"
        style={reduceMotion ? undefined : { y: parallaxY }}
      >
        <LogoTile entry={entry} />
      </motion.div>

      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-lg leading-tight sm:text-xl">
          {entry.role}
        </h3>

        <a
          className="group mt-1 inline-flex items-center gap-1 rounded-sm font-medium text-foreground/90 text-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          href={entry.organizationUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          {entry.organization}
          <ArrowUpRight
            aria-hidden
            className="h-3.5 w-3.5 text-muted-foreground transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
          />
        </a>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1.5 font-mono text-muted-foreground text-xs transition-colors duration-300 group-hover/card:text-foreground/70">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays aria-hidden className="h-3.5 w-3.5 opacity-80" />
            <span>{entry.period}</span>
            <span aria-hidden className="opacity-40">
              ·
            </span>
            <span>{duration}</span>
            {!entry.end && (
              <span
                aria-hidden
                className="relative ml-0.5 inline-flex h-1.5 w-1.5"
              >
                <span className="absolute inline-flex h-full w-full animate-status-ping rounded-full bg-primary/60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
            )}
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
                className="rounded-full border border-border/40 bg-secondary/40 px-3 py-1 text-foreground/80 text-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/[0.07] hover:text-primary hover:shadow-[0_6px_18px_-6px_hsl(var(--primary)/0.35)]"
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
        className="group/head mb-8 flex items-center gap-3"
        initial={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.5, ease: EASE }}
        viewport={{ once: true, margin: "-60px" }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover/head:scale-110 group-hover/head:bg-primary/15">
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

function CvDownload({
  href,
  title,
  subtitle,
}: {
  href: string;
  title: string;
  subtitle: string;
}) {
  return (
    <a
      className="group/cv flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/30 px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/[0.06] hover:shadow-[0_12px_32px_-12px_hsl(var(--primary)/0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-300 group-hover/cv:bg-primary/15">
        <FileText aria-hidden className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block font-medium text-foreground text-sm leading-tight">
          {title}
        </span>
        <span className="block text-muted-foreground text-xs">{subtitle}</span>
      </span>
      <Download
        aria-hidden
        className="h-4 w-4 flex-none text-muted-foreground transition-all duration-300 group-hover/cv:translate-y-0.5 group-hover/cv:text-primary"
      />
    </a>
  );
}

export function TimelineSection() {
  const { language } = useLanguage();
  const t = getTimeline(language);

  return (
    <MotionConfig reducedMotion="user">
      <section className="section-padding" id="timeline">
        <SectionHeading
          className="mb-8"
          eyebrow={t.eyebrow}
          subtitle={t.subheading}
          title={t.heading}
        />

        <motion.div
          className="mx-auto mb-14 grid max-w-xl grid-cols-1 gap-3 sm:mb-16 sm:grid-cols-2"
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: EASE }}
          viewport={{ once: true, margin: "-60px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <CvDownload
            href="/cv/curriculum-vitae.html"
            subtitle="English"
            title="Curriculum Vitae"
          />
          <CvDownload
            href="/cv/lebenslauf.html"
            subtitle="German"
            title="Lebenslauf"
          />
        </motion.div>

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
    </MotionConfig>
  );
}
