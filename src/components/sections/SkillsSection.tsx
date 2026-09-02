import { motion, useReducedMotion } from "framer-motion";
import {
  Briefcase,
  Database,
  Languages as LanguagesIcon,
  Layers,
  Network,
  Server,
} from "lucide-react";
import { type JSX, lazy, type ReactNode, Suspense, useState } from "react";
import { revealOnScroll, revealStagger } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-context";
import { REVEAL, stagger } from "@/lib/motion";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { SectionHeading } from "../layout/SectionHeading";
import { getSkillIcon } from "./skill-icons";

// The owner's draggable 3D logo sphere: lazy (three.js) and desktop-only.
const SkillSphere = lazy(() => import("@/components/effects/SkillSphere"));

type CategoryKey = keyof typeof translations.en.skills.categories;
type LangKey = keyof typeof translations.en.skills.langNames;

interface SkillCategory {
  key: CategoryKey;
  icon: JSX.Element;
  /**
   * How many of the leading skills wear the card's accent surface. The lists
   * are written most-used first, so the emphasis is the ordering signal: the
   * three chips a visitor should read are visibly the first three, and the
   * rest of the list reads as depth behind them. The Languages card sets 0,
   * because emphasising three of four spoken languages would be claiming a
   * proficiency ranking the page never states.
   */
  lead: number;
  skills: string[];
}

/* Categories paired so adjacent cards sit at similar heights on the 2-col grid.
   Skill names must match the keys in skill-icons.tsx. */
const skillCategories: SkillCategory[] = [
  {
    key: "frontend",
    icon: <Layers />,
    lead: 3,
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript (ES6+)",
      "Tailwind CSS",
      "shadcn/ui",
      "Radix UI",
      "Framer Motion",
      "Figma",
      "Lighthouse",
    ],
  },
  {
    key: "backend",
    icon: <Server />,
    lead: 3,
    skills: [
      "Java",
      "Kotlin",
      "Rust",
      "Node.js",
      "Bun",
      "Spring Framework",
      "Python",
      "C#",
      "C++",
      "GraphQL",
      "Bash",
    ],
  },
  {
    key: "devops",
    icon: <Network />,
    lead: 3,
    skills: [
      "Linux Server",
      "Ubuntu",
      "Windows Server",
      "NGINX",
      "Docker",
      "Vercel",
      "Jenkins",
      "Grafana",
      "Kali Linux",
      "Hardware Installation",
    ],
  },
  {
    key: "professional",
    icon: <Briefcase />,
    lead: 3,
    skills: [
      "Communication",
      "Customer Service",
      "Project Management",
      "Direct Sales",
      "Social Media Outreach",
      "SEO Copywriting",
      "Video Editing",
    ],
  },
  {
    key: "databases",
    icon: <Database />,
    lead: 3,
    skills: ["PostgreSQL", "MongoDB", "Redis", "SQLite", "Git", "pnpm"],
  },
];

const languageKeys: LangKey[] = ["english", "german", "chinese", "french"];

/** The card: a bordered cream panel that only changes its border on hover. */
const CARD =
  "flex h-full flex-col rounded-2xl border border-border/60 bg-card p-5 transition-colors duration-200 ease-out hover:border-primary/30 sm:p-6";

/**
 * A chip. The row above owns the timing: the chip only says how it arrives,
 * never when. `lead` swaps the surface only, and padding, font-weight and glyph
 * size are constant across both states and across hover, so a row of ten chips
 * cannot re-wrap under the pointer.
 */
function Chip({
  icon,
  label,
  lead,
}: {
  icon: ReactNode;
  label: string;
  lead?: boolean;
}) {
  return (
    <motion.span
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[13.5px] transition-colors duration-200 ease-out",
        lead
          ? "border-primary/25 bg-primary/[0.07] hover:border-primary/45"
          : "border-border/60 bg-background/50 hover:border-primary/30",
      )}
      variants={REVEAL}
    >
      {/* Decorative: the skill's name is the text right beside it, and the
          react-icons glyphs carry role="img" without a name of their own. */}
      <span
        aria-hidden="true"
        className="flex h-[17px] w-[17px] shrink-0 items-center justify-center text-foreground/75"
      >
        {icon}
      </span>
      <span
        className={cn(
          "font-medium",
          lead ? "text-foreground" : "text-foreground/85",
        )}
      >
        {label}
      </span>
    </motion.span>
  );
}

function CategoryCard({
  icon,
  title,
  children,
  count,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  count: number;
}) {
  const reduceMotion = useReducedMotion();

  // Each card reveals on its own arrival rather than off one grid-wide trigger:
  // the grid is taller than the viewport, so a single parent would run the last
  // row's reveal while it was still below the fold. The chips inside cascade
  // off the card, tight enough that a ten-chip row finishes just after the card
  // itself settles.
  return (
    <motion.article
      className={CARD}
      {...revealOnScroll(reduceMotion, revealStagger(0.1, 0.025))}
    >
      <div className="mb-4 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:h-[19px] [&_svg]:w-[19px]"
        >
          {icon}
        </span>
        {/* Same icon-tile + title pattern as the Experience group headers, one
            step down the scale. */}
        <h2 className="min-w-0 font-bold text-base sm:text-lg">{title}</h2>
        {/* The count reads as a token rather than as grey noise beside the
            title: tabular figures on their own surface. */}
        <span className="ml-auto inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full border border-border/60 px-1.5 text-[11px] text-muted-foreground tabular-nums">
          {count}
        </span>
      </div>

      <motion.div
        className="flex flex-wrap gap-2"
        variants={stagger(0.02, 0.03)}
      >
        {children}
      </motion.div>
    </motion.article>
  );
}

export function SkillsSection() {
  const { language } = useLanguage();
  const t = translations[language].skills;

  // The sphere is desktop-only and skipped for reduced-motion users. Seeded on
  // the first client render so nothing shifts once the page is up.
  const [showSphere] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  return (
    <section className="section-padding" id="skills">
      <SectionHeading
        eyebrow={t.eyebrow}
        subtitle={t.subheading}
        title={t.heading}
      />

      {showSphere ? (
        <Suspense fallback={null}>
          <div className="-mt-2 mx-auto mb-12 h-[360px] w-full max-w-4xl sm:mb-16 sm:h-[460px] lg:h-[560px]">
            <SkillSphere />
          </div>
        </Suspense>
      ) : null}

      {/* No `items-start`: the row stretches, so two cards side by side share
          one height and the ragged bottom edge (and the dead space it left
          between columns) is gone. */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
        {skillCategories.map((category) => (
          <CategoryCard
            count={category.skills.length}
            icon={category.icon}
            key={category.key}
            title={t.categories[category.key]}
          >
            {category.skills.map((name, i) => (
              <Chip
                icon={getSkillIcon(name)}
                key={name}
                label={name}
                lead={i < category.lead}
              />
            ))}
          </CategoryCard>
        ))}

        {/* Spoken languages: names are translated, flags from the icon map */}
        <CategoryCard
          count={languageKeys.length}
          icon={<LanguagesIcon />}
          title={t.categories.languages}
        >
          {languageKeys.map((langKey) => (
            <Chip
              icon={getSkillIcon(langKey)}
              key={langKey}
              label={t.langNames[langKey]}
            />
          ))}
        </CategoryCard>
      </div>
    </section>
  );
}
