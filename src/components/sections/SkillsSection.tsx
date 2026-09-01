import { motion, useReducedMotion } from "framer-motion";
import {
  Briefcase,
  Database,
  Languages as LanguagesIcon,
  Layers,
  Network,
  Server,
} from "lucide-react";
import type { JSX, ReactNode } from "react";
import { revealOnScroll, revealStagger } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-context";
import { REVEAL, SPRING_SOFT, stagger } from "@/lib/motion";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { SectionHeading } from "../layout/SectionHeading";
import { getSkillIcon } from "./skill-icons";

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

/**
 * The card. Same construction as the /donate tiles, which are the site's
 * reference surface: a bordered cream panel on the page, a shadow that only
 * deepens on hover, and the lift riding the independent `translate` property
 * rather than a transform utility, because framer writes a finished entrance
 * back as an inline `transform: none` that would out-rank a class rule for
 * good. Only colour, shadow and translate move, so a hover never reflows the
 * chip rows inside.
 */
const CARD =
  "group/card relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/85 p-5 shadow-[0_1px_2px_-1px_hsl(var(--primary)/0.10)] transition-[translate,border-color,background-color,box-shadow] duration-200 ease-out hover:[translate:0_-3px] hover:border-primary/45 hover:bg-card hover:shadow-[0_20px_44px_-26px_hsl(var(--primary)/0.55)] sm:p-6";

/**
 * A chip. Entrance and hover sit on separate elements so the cascade delay
 * never applies to the hover lift. The wrapper is inline-flex so the chip stays
 * a flex item and the row keeps its exact height. The row above owns the
 * timing: the chip only says how it arrives, never when.
 *
 * `lead` swaps the surface only. Padding, font-weight and glyph size are
 * constant across both states and across hover, which is the one chip pattern
 * on this site that provably never reflows (the /services category row), so a
 * row of ten chips cannot re-wrap under the pointer.
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
    <motion.span className="inline-flex" variants={REVEAL}>
      <motion.span
        className={cn(
          "group/chip inline-flex transform-gpu items-center gap-2 rounded-lg border px-3 py-2 text-[13.5px] transition-[background-color,border-color,box-shadow] duration-200 ease-out",
          lead
            ? "border-primary/25 bg-primary/[0.07] hover:border-primary/50 hover:bg-primary/[0.12]"
            : "border-border/50 bg-background/45 hover:border-primary/40 hover:bg-primary/[0.06]",
        )}
        transition={SPRING_SOFT}
        whileHover={{ y: -2 }}
      >
        {/* Decorative: the skill's name is the text right beside it, and the
            react-icons glyphs carry role="img" without a name of their own. */}
        <span
          aria-hidden="true"
          className="flex h-[17px] w-[17px] shrink-0 items-center justify-center text-foreground/75 transition-transform duration-200 ease-out group-hover/chip:scale-110"
        >
          {icon}
        </span>
        <span
          className={cn(
            "font-medium transition-colors duration-200 ease-out group-hover/chip:text-primary",
            lead ? "text-foreground" : "text-foreground/85",
          )}
        >
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
  // row's reveal while it was still below the fold. The chips inside cascade
  // off the card, tight enough that a ten-chip row finishes just after the card
  // itself settles.
  return (
    <motion.article
      className={CARD}
      {...revealOnScroll(reduceMotion, revealStagger(0.1, 0.025))}
    >
      {/* Two static decorations, no animation of either: a hairline of the site
          gradient across the top edge, and an accent bloom in the top-right
          corner that fades up on hover. The bloom is a radial gradient rather
          than a blurred disc, so hovering a card costs one opacity change. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-primary/55 via-lilac/40 to-transparent"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.10),transparent_58%)] opacity-0 transition-opacity duration-300 ease-out group-hover/card:opacity-100"
      />

      <div className="relative mb-4 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/[0.12] text-primary ring-1 ring-primary/[0.14] transition-[background-color,scale] duration-200 ease-out group-hover/card:bg-primary/[0.18] group-hover/card:[scale:1.06] [&_svg]:h-[19px] [&_svg]:w-[19px]"
        >
          {icon}
        </span>
        {/* Same icon-tile + title pattern as the Timeline group headers, one
            step down the scale. */}
        <h2 className="min-w-0 font-bold text-base sm:text-lg">{title}</h2>
        {/* The count reads as a token rather than as grey noise beside the
            title: mono, tabular, on its own surface. */}
        <span className="ml-auto inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full border border-border/55 bg-background/70 px-1.5 font-mono text-[11px] text-muted-foreground tabular-nums">
          {count}
        </span>
      </div>

      <motion.div
        className="relative flex flex-wrap gap-2"
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

  /* The 3D logo sphere that used to sit above this grid is gone (2026-08-31).
     It was ~29 full-colour brand logos tumbling over the cream page, which is
     exactly the "texture across the whole viewport" the background rule exists
     to prevent, it overlapped and clipped itself, it cost ~560px of height, and
     it said nothing the cards below do not. Removing it also takes
     @react-three/fiber and three.js off this route entirely (the Services tree
     is now the only three.js consumer) and with it the `THREE.Clock` deprecation
     warning that r3f's store logged on every visit. Do not add it back: if this
     page ever wants an ambient element again it has to be one soft element, in
     the bloom palette, not a logo swarm. */

  return (
    <section className="section-padding" id="skills">
      <SectionHeading
        eyebrow={t.eyebrow}
        subtitle={t.subheading}
        title={t.heading}
      />

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
