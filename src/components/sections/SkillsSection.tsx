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
import { REVEAL, SPRING_SOFT, stagger } from "@/lib/motion";
import { translations } from "@/lib/translations";
import { SectionHeading } from "../layout/SectionHeading";
import { getSkillIcon } from "./skill-icons";

// Draggable 3D logo sphere: lazy (three.js) and desktop-only.
const SkillSphere = lazy(() => import("@/components/effects/SkillSphere"));

type CategoryKey = keyof typeof translations.en.skills.categories;
type LangKey = keyof typeof translations.en.skills.langNames;

interface SkillCategory {
  key: CategoryKey;
  icon: JSX.Element;
  skills: string[];
}

/* Categories paired so adjacent cards sit at similar heights on the 2-col grid.
   Skill names must match the keys in skill-icons.tsx. */
const skillCategories: SkillCategory[] = [
  {
    key: "frontend",
    icon: <Layers />,
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
    skills: ["PostgreSQL", "MongoDB", "Redis", "SQLite", "Git", "pnpm"],
  },
];

const languageKeys: LangKey[] = ["english", "german", "chinese", "french"];

function Chip({ icon, label }: { icon: ReactNode; label: string }) {
  // Entrance and hover sit on separate elements so the cascade delay never
  // applies to the hover lift. The wrapper is inline-flex so the chip stays a
  // flex item and the row keeps its exact height. The row above owns the
  // timing: the chip only says how it arrives, never when.
  return (
    <motion.span className="inline-flex" variants={REVEAL}>
      <motion.span
        className="group inline-flex transform-gpu items-center gap-2.5 rounded-xl border border-border/40 bg-secondary/30 px-3.5 py-2.5 text-sm backdrop-blur-sm transition-[background-color,border-color,box-shadow] duration-200 ease-out hover:border-primary/40 hover:bg-primary/[0.07] hover:shadow-[0_6px_18px_-6px_hsl(var(--primary)/0.35)]"
        transition={SPRING_SOFT}
        whileHover={{ y: -2 }}
      >
        {/* Decorative: the skill's name is the text right beside it, and the
            react-icons glyphs carry role="img" without a name of their own. */}
        <span
          aria-hidden="true"
          className="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-foreground/80 transition-transform duration-200 ease-out group-hover:scale-110"
        >
          {icon}
        </span>
        <span className="font-medium text-foreground/90 transition-colors duration-200 ease-out group-hover:text-primary">
          {label}
        </span>
      </motion.span>
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
  // row's reveal while it was still below the fold.
  return (
    <motion.div {...revealOnScroll(reduceMotion, revealStagger())}>
      <div className="mb-4 flex items-center gap-3 border-border/40 border-b pb-3">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary [&_svg]:h-[18px] [&_svg]:w-[18px]"
        >
          {icon}
        </span>
        {/* Same icon-tile + title pattern as the Timeline group headers, one
            step down the scale: bold title, 36px tile, 18px glyph, gap-3. */}
        <h2 className="font-bold text-base sm:text-lg">{title}</h2>
        <span className="ml-auto font-mono text-muted-foreground text-xs tabular-nums">
          {count}
        </span>
      </div>
      {/* The chips cascade left to right inside the card, tight enough that a
          ten-chip row still finishes just after the card itself settles. */}
      <motion.div
        className="flex flex-wrap gap-2.5"
        variants={stagger(0.02, 0.03)}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function SkillsSection() {
  const { language } = useLanguage();
  const t = translations[language].skills;

  // The 3D sphere is desktop-only and skipped for reduced-motion users.
  const [showSphere] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  return (
    <section className="section-padding relative overflow-hidden" id="skills">
      <div className="-z-10 absolute inset-0 bg-gradient-to-b from-transparent via-muted/10 to-transparent" />

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

      <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-x-12 gap-y-12 md:grid-cols-2">
        {skillCategories.map((category) => (
          <CategoryCard
            count={category.skills.length}
            icon={category.icon}
            key={category.key}
            title={t.categories[category.key]}
          >
            {category.skills.map((name) => (
              <Chip icon={getSkillIcon(name)} key={name} label={name} />
            ))}
          </CategoryCard>
        ))}

        {/* Spoken languages — names are translated, flags from the icon map */}
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
