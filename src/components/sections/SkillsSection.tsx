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
import { Link } from "react-router-dom";
import { countProjectsBySkill } from "@/constants/projects/stacks";
import { SKILL_CATEGORIES, type SkillCategoryKey } from "@/constants/skills";
import { revealOnScroll, revealStagger } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-context";
import { REVEAL, stagger } from "@/lib/motion";
import { translations } from "@/lib/translations";
import { SectionHeading } from "../layout/SectionHeading";
import { getSkillIcon } from "./skill-icons";

// The owner's draggable 3D logo sphere: lazy (three.js) and desktop-only.
const SkillSphere = lazy(() => import("@/components/effects/SkillSphere"));

type LangKey = keyof typeof translations.en.skills.langNames;

/* One lucide glyph per card, keyed by the same category key as the headings in
   the translations and the chip lists in `constants/skills.ts`. */
const CATEGORY_ICONS: Record<SkillCategoryKey, JSX.Element> = {
  frontend: <Layers />,
  backend: <Server />,
  devops: <Network />,
  professional: <Briefcase />,
  databases: <Database />,
  languages: <LanguagesIcon />,
};

const languageKeys: LangKey[] = ["english", "german", "chinese", "french"];

/** The card: a bordered cream panel that only changes its border on hover. */
const CARD =
  "flex h-full flex-col rounded-2xl border border-border/60 bg-card p-5 transition-colors duration-200 ease-out hover:border-primary/30 sm:p-6";

/**
 * A chip. The row above owns the timing: the chip only says how it arrives,
 * never when. Every chip wears the same surface: the tinted "lead" state was
 * removed on 2026-09-09 because two chip colours read as a skill ranking the
 * page never meant to make. Padding, font-weight and glyph size are constant
 * across hover, so a row of ten chips cannot re-wrap under the pointer.
 */
/** Projects per skill, counted once: the stacks never change at runtime. */
const PROJECT_COUNTS = countProjectsBySkill();

const CHIP_BODY =
  "inline-flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/50 px-3 py-2 text-[13.5px] transition-colors duration-200 ease-out hover:border-primary/30";

/**
 * A skill some project is built with links to those projects, and says how
 * many there are. The count sits on the same token surface as the category
 * count, so the page has one way of showing a number.
 */
function ProjectChip({
  icon,
  label,
  count,
  countLabel,
}: {
  icon: ReactNode;
  label: string;
  count: number;
  countLabel: string;
}) {
  return (
    <motion.span className="inline-flex" variants={REVEAL}>
      <Link
        aria-label={countLabel}
        className={`${CHIP_BODY} focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
        title={countLabel}
        to={`/projects?tech=${encodeURIComponent(label)}`}
      >
        <span
          aria-hidden="true"
          className="flex h-[17px] w-[17px] shrink-0 items-center justify-center text-foreground/75"
        >
          {icon}
        </span>
        <span className="font-medium text-foreground/85">{label}</span>
        <span
          aria-hidden="true"
          className="inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-border/60 px-1 text-[11px] text-muted-foreground tabular-nums"
        >
          {count}
        </span>
      </Link>
    </motion.span>
  );
}

function Chip({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <motion.span
      /* `bg-secondary/50` is the chip fill used by the identical chips on
         /experience and /projects; this one was the only `bg-background/50`,
         which composites blush over cream and reads as a different object. */
      className={CHIP_BODY}
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
      <span className="font-medium text-foreground/85">
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

      {/* The box sits outside the Suspense boundary, the way the services tree
          does it. Inside, `fallback={null}` meant the sphere's 560px of height
          did not exist in the layout until the three.js chunk had arrived, and
          the card grid below rendered against the heading, then dropped when it
          landed: 0.172 of layout shift on a throttled first visit, all of it
          after the page looked finished. Reserving the height first costs
          nothing and the shift goes to zero. */}
      {showSphere ? (
        <div className="-mt-2 mx-auto mb-12 h-[360px] w-full max-w-4xl sm:mb-16 sm:h-[460px] lg:h-[560px]">
          <Suspense fallback={null}>
            <SkillSphere />
          </Suspense>
        </div>
      ) : null}

      {/* No `items-start`: the row stretches, so two cards side by side share
          one height and the ragged bottom edge (and the dead space it left
          between columns) is gone. */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
        {SKILL_CATEGORIES.map((category) => (
          <CategoryCard
            count={category.skills.length}
            icon={CATEGORY_ICONS[category.key]}
            key={category.key}
            title={t.categories[category.key]}
          >
            {category.skills.map((name) => {
              const count = PROJECT_COUNTS.get(name);
              return count ? (
                <ProjectChip
                  count={count}
                  countLabel={(count === 1
                    ? t.projectCountOne
                    : t.projectCountMany
                  )
                    .replace("{count}", String(count))
                    .replace("{skill}", name)}
                  icon={getSkillIcon(name)}
                  key={name}
                  label={name}
                />
              ) : (
                <Chip
                  icon={getSkillIcon(name)}
                  key={name}
                  label={name}
                />
              );
            })}
          </CategoryCard>
        ))}

        {/* Spoken languages: names are translated, flags from the icon map */}
        <CategoryCard
          count={languageKeys.length}
          icon={CATEGORY_ICONS.languages}
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
