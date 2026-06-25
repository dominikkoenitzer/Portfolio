import { motion } from "framer-motion";
import {
  Briefcase,
  Database,
  Languages as LanguagesIcon,
  Layers,
  Network,
  Server,
} from "lucide-react";
import { lazy, type ReactNode, Suspense, useEffect, useState } from "react";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { SectionHeading } from "../layout/SectionHeading";
import { getSkillIcon } from "./skill-icons";

const EASE = [0.22, 1, 0.36, 1] as const;

// Draggable 3D logo sphere — lazy (three.js) and desktop-only.
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

function Chip({
  icon,
  label,
  index,
}: {
  icon: ReactNode;
  label: string;
  index: number;
}) {
  return (
    <motion.span
      className="group inline-flex items-center gap-2.5 rounded-xl border border-border/40 bg-secondary/30 px-3.5 py-2.5 text-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/[0.07] hover:shadow-[0_6px_18px_-6px_hsl(var(--primary)/0.35)]"
      initial={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.025, 0.25), ease: EASE }}
      viewport={{ once: true, margin: "-40px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-foreground/80 transition-transform duration-200 group-hover:scale-110">
        {icon}
      </span>
      <span className="font-medium text-foreground/90 transition-colors duration-200 group-hover:text-primary">
        {label}
      </span>
    </motion.span>
  );
}

function CategoryCard({
  icon,
  title,
  children,
  delay,
  count,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  delay: number;
  count: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
      viewport={{ once: true, margin: "-60px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="mb-4 flex items-center gap-3 border-border/40 border-b pb-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary [&_svg]:h-[18px] [&_svg]:w-[18px]">
          {icon}
        </span>
        <h3 className="font-semibold text-base sm:text-lg">{title}</h3>
        <span className="ml-auto font-mono text-muted-foreground/50 text-xs tabular-nums">
          {count}
        </span>
      </div>
      <div className="flex flex-wrap gap-2.5">{children}</div>
    </motion.div>
  );
}

export function SkillsSection() {
  const { language } = useLanguage();
  const t = translations[language].skills;

  // The 3D sphere is desktop-only and skipped for reduced-motion users.
  const [showSphere, setShowSphere] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ok =
      window.matchMedia("(min-width: 768px)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (ok) setShowSphere(true);
  }, []);

  return (
    <section className="section-padding relative overflow-hidden" id="skills">
      <div className="-z-10 absolute inset-0 bg-gradient-to-b from-transparent via-muted/10 to-transparent" />

      <SectionHeading subtitle={t.subheading} title={t.heading} />

      {showSphere ? (
        <Suspense fallback={null}>
          <div className="-mt-2 mx-auto mb-12 h-[360px] w-full max-w-3xl sm:mb-16 sm:h-[460px]">
            <SkillSphere />
          </div>
        </Suspense>
      ) : null}

      <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-x-12 gap-y-12 md:grid-cols-2">
        {skillCategories.map((category, catIndex) => (
          <CategoryCard
            count={category.skills.length}
            delay={Math.min(catIndex * 0.08, 0.4)}
            icon={category.icon}
            key={category.key}
            title={t.categories[category.key]}
          >
            {category.skills.map((name, index) => (
              <Chip
                icon={getSkillIcon(name)}
                index={index}
                key={name}
                label={name}
              />
            ))}
          </CategoryCard>
        ))}

        {/* Spoken languages — names are translated, flags from the icon map */}
        <CategoryCard
          count={languageKeys.length}
          delay={Math.min(skillCategories.length * 0.08, 0.4)}
          icon={<LanguagesIcon />}
          title={t.categories.languages}
        >
          {languageKeys.map((langKey, index) => (
            <Chip
              icon={getSkillIcon(langKey)}
              index={index}
              key={langKey}
              label={t.langNames[langKey]}
            />
          ))}
        </CategoryCard>
      </div>
    </section>
  );
}
