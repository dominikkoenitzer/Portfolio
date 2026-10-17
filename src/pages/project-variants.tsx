import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ProjectFigure, StatStrip } from "@/components/effects/project-effects";
import { TechBadge } from "@/components/ui/tech-badge";
import {
  cardImageSrc,
  getProjects,
  pictureSrcSet,
  type PortfolioProject,
} from "@/constants/projects";
import { revealOnScroll } from "@/lib/framer-animations";
import type { ProjectVariant } from "@/lib/project-variant";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

/**
 * Three layouts of one project page, for choosing between them (see
 * `lib/project-variant.ts`). Every screenshot is shown as it is: no filter,
 * no lean, no frame effects.
 */

export type VariantProps = {
  variant: ProjectVariant;
  project: PortfolioProject;
  actions: ReactNode;
  facts: Array<{ label: string; value: ReactNode }>;
  pictures: string[];
  captionFor: (position: number) => string | undefined;
  altFor: (position: number) => string;
  openLabelFor: (position: number) => string;
  open: (position: number) => void;
  next: PortfolioProject[];
};

const PAGE = "mx-auto w-full max-w-7xl px-6 sm:px-8 md:px-12 lg:px-16";

function Crumbs({ project, variant }: { project: PortfolioProject; variant: ProjectVariant }) {
  const t = translations[useLanguage().language].projectDetails;
  return (
    <nav aria-label={t.breadcrumb} className="flex items-center gap-2 text-muted-foreground text-sm">
      <Link className="inline-flex items-center transition-colors hover:text-foreground" to="/">
        {t.home}
      </Link>
      <span aria-hidden className="text-border">/</span>
      <Link
        className="inline-flex items-center transition-colors hover:text-foreground"
        to={`/projects?v=${variant}`}
      >
        {t.projects}
      </Link>
      <span aria-hidden className="text-border">/</span>
      <span className="text-foreground/80">{project.title}</span>
    </nav>
  );
}

/** The case study's text: overview, then each section with its code. */
function Sections({
  project,
  note,
  numbered,
}: {
  project: PortfolioProject;
  /** Where the heading goes: above the text, or as a note in the margin. */
  note?: boolean;
  /** Section numbers in the hand-written face (一, 二, 三). */
  numbered?: boolean;
}) {
  const t = translations[useLanguage().language].projectDetails;
  const reduceMotion = useReducedMotion();
  const kanji = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
  const all = [
    { heading: t.overview, body: [project.overview], code: undefined },
    ...project.sections,
  ];
  return (
    <div className="space-y-16">
      {all.map((section, index) => (
        <motion.section
          className={note ? "grid gap-4 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-12" : ""}
          key={section.heading}
          {...revealOnScroll(reduceMotion)}
        >
          {note ? (
            <p className="accent-jp text-muted-foreground text-base leading-snug lg:pt-1.5">
              {section.heading}
            </p>
          ) : (
            <h2 className="flex items-baseline gap-4 font-semibold text-xl leading-snug sm:text-2xl">
              {numbered ? (
                <span aria-hidden className="accent-jp w-6 shrink-0 text-primary">
                  {kanji[index] ?? index + 1}
                </span>
              ) : null}
              <span>{section.heading}</span>
            </h2>
          )}
          <div className={note ? "" : numbered ? "mt-4 sm:pl-10" : "mt-4"}>
            <div className="space-y-5">
              {section.body.map((paragraph) => (
                <p
                  className={
                    note
                      ? "text-foreground/90 text-lg leading-relaxed sm:text-xl"
                      : "text-foreground/90 leading-relaxed"
                  }
                  key={paragraph}
                >
                  {paragraph}
                </p>
              ))}
            </div>
            {section.code ? (
              <figure className="m-0 mt-8">
                <pre
                  className="code-excerpt overflow-x-auto rounded-2xl bg-secondary/50 p-5 text-[13px] leading-relaxed sm:p-6"
                  tabIndex={0}
                >
                  <code>{section.code.text}</code>
                </pre>
                <figcaption className="mt-3 max-w-prose text-foreground/80 text-sm leading-relaxed">
                  {section.code.caption}
                </figcaption>
              </figure>
            ) : null}
          </div>
        </motion.section>
      ))}
    </div>
  );
}

function Shot({
  props,
  position,
  sizes,
  className,
}: {
  props: VariantProps;
  position: number;
  sizes: string;
  className?: string;
}) {
  const src = props.pictures[position];
  return (
    <ProjectFigure
      alt={props.altFor(position)}
      caption={props.captionFor(position)}
      className={className}
      layoutId={`project-shot-${position}`}
      onOpen={() => props.open(position)}
      openLabel={props.openLabelFor(position)}
      priority={position === 0}
      sizes={sizes}
      src={src}
      srcSet={pictureSrcSet(src)}
    />
  );
}

function NextProjects({ props, title }: { props: VariantProps; title: string }) {
  return (
    <section className="mt-24">
      <h2 className="title-serif font-bold text-2xl sm:text-3xl">{title}</h2>
      <ul className="mt-6 divide-y divide-border/60 border-border/60 border-y">
        {props.next.map((item) => (
          <li key={item.slug}>
            <Link
              className="group flex items-baseline justify-between gap-6 py-4 transition-colors duration-200 ease-out"
              to={`/projects/${item.slug}?v=${props.variant}`}
            >
              <span className="flex min-w-0 items-baseline gap-4">
                <span className="title-serif text-lg group-hover:text-primary">{item.title}</span>
                <span className="truncate text-muted-foreground text-sm">{item.tagline}</span>
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* a: index and plate                                                  */
/* ------------------------------------------------------------------ */

function VariantA(props: VariantProps) {
  const { project } = props;
  const t = translations[useLanguage().language].projectDetails;
  const number = getProjects("en").findIndex((item) => item.slug === project.slug) + 1;
  return (
    <div className={`${PAGE} pt-4 pb-24`}>
      <Crumbs project={project} variant="a" />
      <div className="mt-10 grid gap-12 lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-20">
        {/* The facts stay in view while the pictures and notes scroll past. */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="accent-jp text-primary text-xl">{String(number).padStart(2, "0")}</p>
          <h1 className="title-serif mt-3 font-bold text-5xl leading-[0.95]">{project.title}</h1>
          <p className="mt-5 text-foreground/90 text-lg leading-relaxed">{project.tagline}</p>
          <dl className="mt-8 space-y-4 text-sm">
            {[...props.facts, { label: "Stack", value: project.tags.join(", ") }].map((row, index) => (
              <div className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-2" key={row.label}>
                <span aria-hidden className="text-muted-foreground tabular-nums">{index + 1}</span>
                <div>
                  <dt className="text-muted-foreground">{row.label}</dt>
                  <dd className="mt-0.5 text-foreground/90 leading-relaxed">{row.value}</dd>
                </div>
              </div>
            ))}
          </dl>
          <div className="mt-8">{props.actions}</div>
        </aside>

        <div className="min-w-0">
          {/* Every picture on its own plate, whole and at its own size. */}
          <div className="space-y-10">
            {props.pictures.map((_, position) => (
              <div className="rounded-3xl bg-secondary/50 p-4 sm:p-6" key={props.pictures[position]}>
                <Shot
                  position={position}
                  props={props}
                  sizes="(min-width: 1280px) 800px, (min-width: 1024px) 60vw, 90vw"
                />
              </div>
            ))}
          </div>
          {project.stats?.length ? (
            <div className="mt-14">
              <StatStrip stats={project.stats} />
            </div>
          ) : null}
          <div className="mt-16 max-w-2xl">
            <Sections project={project} />
          </div>
          <NextProjects props={props} title={t.moreProjects} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* b: evening light                                                    */
/* ------------------------------------------------------------------ */

/**
 * One muted tone per project, taken from its own screenshot and pulled
 * toward the site's palette. Light and night versions; text stays the site's
 * ink on both.
 */
const FIELDS: Record<string, string> = {
  oxidize: "bg-[#e7e2d4] dark:bg-[#24221b]",
  inkling: "bg-[#ebe3ea] dark:bg-[#251f27]",
  jester: "bg-[#e3e8de] dark:bg-[#1f241d]",
};
const FIELD_DEFAULT = "bg-[#ece6dc] dark:bg-[#22201c]";

function VariantB(props: VariantProps) {
  const { project } = props;
  const t = translations[useLanguage().language].projectDetails;
  const reduceMotion = useReducedMotion();
  const year = project.date.slice(0, 4);
  return (
    <div className={`${FIELDS[project.slug] ?? FIELD_DEFAULT} pb-24`}>
      <div className={`${PAGE} pt-6`}>
        <Crumbs project={project} variant="b" />
        <motion.div className="mt-24 sm:mt-32" {...revealOnScroll(reduceMotion)}>
          <h1 className="title-serif font-bold text-6xl leading-[0.95] sm:text-7xl lg:text-8xl">
            {project.title}
            <sup className="ml-2 align-super font-normal text-base text-muted-foreground sm:text-lg">
              {year}
            </sup>
          </h1>
          <p className="mt-6 max-w-2xl text-foreground/90 text-xl leading-relaxed sm:text-2xl">
            {project.tagline}
          </p>
          <div className="mt-8">{props.actions}</div>
        </motion.div>

        {/* The pictures float on the field, one at a time, alternating sides. */}
        <div className="mt-20 space-y-24">
          {props.pictures.map((src, position) => (
            <div
              className={`w-full lg:w-[68%] ${position % 2 === 1 ? "lg:ml-auto" : ""}`}
              key={src}
            >
              <Shot
                position={position}
                props={props}
                sizes="(min-width: 1280px) 780px, (min-width: 1024px) 60vw, 90vw"
              />
            </div>
          ))}
        </div>

        <dl className="mt-24 grid grid-cols-2 gap-x-8 gap-y-6 text-sm sm:grid-cols-4">
          {props.facts.map((row) => (
            <div key={row.label}>
              <dt className="text-muted-foreground">{row.label}</dt>
              <dd className="mt-1 text-foreground/90 leading-relaxed">{row.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-24 max-w-5xl">
          <Sections note project={project} />
        </div>

        {props.next[0] ? (
          <Link
            className="group mt-32 block"
            to={`/projects/${props.next[0].slug}?v=b`}
          >
            <span className="text-muted-foreground text-sm">{t.moreProjects}</span>
            <span className="title-serif mt-2 flex items-center gap-4 font-bold text-5xl transition-colors duration-200 ease-out group-hover:text-primary sm:text-6xl">
              {props.next[0].title}
              <ArrowUpRight className="h-8 w-8" />
            </span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* c: quiet console                                                    */
/* ------------------------------------------------------------------ */

function VariantC(props: VariantProps) {
  const { project } = props;
  const t = translations[useLanguage().language].projectDetails;
  return (
    <div className={`${PAGE} pt-4 pb-24`}>
      <Crumbs project={project} variant="c" />
      <div className="mt-10 max-w-3xl">
        <h1 className="title-serif font-bold text-5xl leading-[0.95] sm:text-6xl">{project.title}</h1>
        <p className="mt-5 text-foreground/90 text-lg leading-relaxed">{project.tagline}</p>

        {/* The facts as a plain table. */}
        <dl className="mt-10 divide-y divide-border/60 border-border/60 border-y text-sm">
          {[
            ...props.facts,
            {
              label: "Stack",
              value: (
                <span className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <TechBadge key={tag} name={tag} />
                  ))}
                </span>
              ),
            },
          ].map((row) => (
            <div className="grid grid-cols-[8rem_minmax(0,1fr)] gap-4 py-3" key={row.label}>
              <dt className="text-muted-foreground">{row.label}</dt>
              <dd className="text-foreground/90 leading-relaxed">{row.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8">{props.actions}</div>

        {/* The pictures as a row of thumbnails; each opens out of itself. */}
        <div className="mt-12">
          <p className="font-semibold text-sm">{t.gallery}</p>
          <div className="mt-3 flex flex-wrap gap-4">
            {props.pictures.map((src, position) => (
              <button
                aria-label={props.openLabelFor(position)}
                className="press w-44 overflow-hidden rounded-xl ring-1 ring-border/60 transition-shadow duration-200 ease-out hover:ring-primary/40 sm:w-56"
                data-cursor-ignore
                key={src}
                onClick={() => props.open(position)}
                type="button"
              >
                <motion.img
                  alt={props.altFor(position)}
                  className="aspect-16/10 w-full object-cover object-top"
                  layoutId={`project-shot-${position}`}
                  src={position === 0 ? cardImageSrc(src) : src}
                />
              </button>
            ))}
          </div>
        </div>

        {project.stats?.length ? (
          <div className="mt-14">
            <StatStrip stats={project.stats} />
          </div>
        ) : null}

        <div className="mt-16">
          <Sections numbered project={project} />
        </div>
        <NextProjects props={props} title={t.moreProjects} />
      </div>
    </div>
  );
}

export function ProjectVariantView(props: VariantProps) {
  if (props.variant === "a") return <VariantA {...props} />;
  if (props.variant === "b") return <VariantB {...props} />;
  return <VariantC {...props} />;
}
