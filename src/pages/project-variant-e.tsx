import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";
import { useLenis } from "lenis/react";
import { type ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProjectTechLoop } from "@/components/effects/tech-stack";
import { PrivateSource } from "@/components/sections/PrivateSource";
import { getProjects } from "@/constants/projects";
import { revealOnScroll } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { CodePane, HeroPicture, PairFigure, Points, StillFigure } from "./e/kit";
import { hasStory, loadStory, storyNow } from "./e/story-loader";
import type { Block, Story } from "./e/types";
import type { VariantProps } from "./project-variants";

/**
 * Layout e of the project page: a short, typography-led essay in one 640px
 * column under a wide picture of the real app. Each section shows its point
 * in the form that suits it (a live demo, a still, two stills, code or a
 * short list), and a quiet sticky index runs beside it on wide screens.
 */

/** The project's story: at once if it has arrived, undefined while it loads, null if it has none. */
function useStory(slug: string): Story | null | undefined {
  const [loaded, setLoaded] = useState<{ slug: string; story: Story | null } | null>(null);
  const now = hasStory(slug) ? storyNow(slug) : null;
  useEffect(() => {
    if (now !== undefined) return;
    let live = true;
    void loadStory(slug).then((story) => live && setLoaded({ slug, story }));
    return () => {
      live = false;
    };
  }, [slug, now]);
  if (now !== undefined) return now;
  return loaded?.slug === slug ? loaded.story : undefined;
}

/** Which section is in view: the last one whose top has passed a third of the screen. */
function useActive(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join("|");
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const line = window.innerHeight / 3;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return active;
}

const LINK =
  "inline-flex items-center gap-1 text-[0.875rem] text-foreground/80 underline decoration-border underline-offset-[5px] transition-colors duration-200 ease-bloom hover:text-foreground hover:decoration-foreground/40";

/** The project's links, as quiet text: open or install it, its source. */
function Links({ project }: { project: VariantProps["project"] }) {
  const t = translations[useLanguage().language].projectDetails;
  const items: ReactNode[] = [];
  if (project.downloadUrl) {
    items.push(
      <a className={LINK} href={project.downloadUrl} key="dl" rel="noopener noreferrer" target="_blank">
        {t.download}
        <ArrowUpRight className="h-3.5 w-3.5" />
      </a>,
    );
  } else if (project.liveUrl) {
    items.push(
      <a className={LINK} href={project.liveUrl} key="live" rel="noopener noreferrer" target="_blank">
        {t.visitSite}
        <ArrowUpRight className="h-3.5 w-3.5" />
      </a>,
    );
  }
  items.push(
    project.sourcePrivate ? (
      <PrivateSource key="src">
        <button className={LINK} type="button">
          {t.sourceCode}
          <Lock className="h-3 w-3" />
        </button>
      </PrivateSource>
    ) : (
      <a className={LINK} href={project.repoUrl} key="src" rel="noopener noreferrer" target="_blank">
        {t.sourceCode}
        <ArrowUpRight className="h-3.5 w-3.5" />
      </a>
    ),
  );
  return <div className="flex flex-wrap items-center gap-x-6 gap-y-2">{items}</div>;
}

/** A section heading with a hairline running to the edge of the column. */
function Heading({ children }: { children: ReactNode }) {
  return (
    <h2 className="m-0 flex items-center gap-3 font-semibold text-[1rem] leading-[1.625] tracking-[-0.005em]">
      <span className="shrink-0 text-balance">{children}</span>
      <span aria-hidden className="h-px min-w-6 flex-1 bg-border/80" />
    </h2>
  );
}

/** The shape of what comes first while the story is still on its way: a wide picture, then two paragraphs. */
function Placeholder() {
  const line = "h-[0.9rem] rounded-full bg-foreground/[0.06]";
  return (
    <div aria-hidden className="mx-auto max-w-[640px] xl:mx-0">
      {[0, 1].map((p) => (
        <div className={`${p ? "mt-4" : ""} flex flex-col gap-[0.85rem] py-[0.45rem]`} key={p}>
          {[100, 97, 99, 62].map((w, i) => (
            <span className={line} key={i} style={{ width: `${w}%` }} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Air above a block: paragraphs sit 16px apart, everything else gets 32px on both sides. */
function gapFor(block: Block, prev: Block | undefined): string {
  if (prev === undefined) return "";
  return typeof block === "string" && typeof prev === "string" ? "mt-4" : "mt-8";
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="mt-4">
      {blocks.map((block, i) => {
        const gap = gapFor(block, blocks[i - 1]);
        if (typeof block === "string") {
          return (
            <p className={`m-0 text-[1rem] text-foreground/85 leading-[1.625] ${gap}`} key={block}>
              {block}
            </p>
          );
        }
        const key = `block-${i}`;
        if ("Demo" in block) {
          return (
            <div className={gap} key={key}>
              <block.Demo />
            </div>
          );
        }
        if ("still" in block) {
          return (
            <div className={gap} key={key}>
              <StillFigure still={block.still} />
            </div>
          );
        }
        if ("pair" in block) {
          return (
            <div className={gap} key={key}>
              <PairFigure caption={block.caption} stills={block.pair} />
            </div>
          );
        }
        if ("code" in block) {
          return (
            <div className={gap} key={key}>
              <CodePane code={block.code} />
            </div>
          );
        }
        return (
          <div className={gap} key={key}>
            <Points items={block.points} />
          </div>
        );
      })}
    </div>
  );
}

/** Two columns on wide screens: the index rail, then the text column. */
const TWO_COLUMNS = "xl:grid xl:grid-cols-[168px_640px] xl:gap-x-28";

export function VariantE(props: VariantProps) {
  const { project } = props;
  const { language } = useLanguage();
  const t = translations[language].projectDetails;
  const reduceMotion = useReducedMotion();
  const lenis = useLenis();
  const story = useStory(project.slug);

  const host = project.liveUrl && !project.downloadUrl ? new URL(project.liveUrl).host : null;
  const meta = [project.operatingSystem ?? host, props.facts[0]?.value].filter(Boolean);
  const sections = story?.sections ?? [];
  const ids = ["e-top", ...sections.map((s) => `e-${s.id}`)];
  const active = useActive(ids);

  const catalogue = getProjects(language);
  const at = catalogue.findIndex((p) => p.slug === project.slug);
  const previous = catalogue[(at - 1 + catalogue.length) % catalogue.length];
  const next = catalogue[(at + 1) % catalogue.length];

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 112;
    if (lenis) lenis.scrollTo(top);
    else window.scrollTo({ top });
  };

  // Without a story the page still stands: the tagline as its lead and the
  // main screenshot as its picture.
  const lead = story ? story.lead : story === null ? project.tagline : null;
  const hero = story?.hero ?? null;
  const fallbackHero = story === null && props.pictures[0] ? props.pictures[0] : null;

  return (
    <div className="mx-auto w-full max-w-[968px] px-6 pt-4 pb-32 sm:px-8 xl:max-w-[920px] xl:px-0">
      <div className={TWO_COLUMNS}>
        <nav aria-label={t.breadcrumb} className="xl:pt-[0.7rem]">
          <Link
            className="inline-flex items-center gap-1.5 text-[0.8125rem] text-muted-foreground transition-colors hover:text-foreground"
            to="/projects"
          >
            <span aria-hidden>&larr;</span> {t.projects}
          </Link>
        </nav>

        <header className="mx-auto mt-10 w-full max-w-[640px] scroll-mt-28 xl:mx-0 xl:mt-0" id="e-top">
          <h1 className="title-serif m-0 ml-[-0.04em] font-bold text-[2.25rem] leading-[1.1] tracking-[-0.01em] sm:text-[2.5rem]">
            {project.title}
          </h1>
          {meta.length ? <p className="m-0 mt-2 text-[0.875rem] text-muted-foreground">{meta.join(" · ")}</p> : null}
          {lead ? (
            <p className="m-0 mt-5 text-pretty text-[1.1875rem] text-foreground/90 leading-[1.5] tracking-[-0.008em]">
              {lead}
            </p>
          ) : (
            <span aria-hidden className="mt-5 block h-[1.1rem] w-4/5 rounded-full bg-foreground/[0.06]" />
          )}
          <div className="mt-5">
            <Links project={project} />
          </div>
        </header>
      </div>

      {/* The app as it looks, wider than the text so it is the first thing seen. */}
      <motion.div className="mt-10 sm:mt-12 xl:mt-14" {...revealOnScroll(reduceMotion)}>
        {hero ? (
          <HeroPicture still={hero} />
        ) : fallbackHero ? (
          <img
            alt={props.altFor(0)}
            className="block h-auto w-full rounded-[18px] ring-1 ring-black/[0.06] dark:ring-white/[0.08]"
            decoding="async"
            fetchPriority="high"
            src={fallbackHero}
          />
        ) : (
          <div aria-hidden className="aspect-[8/5] w-full rounded-[18px] bg-card ring-1 ring-black/[0.06] dark:ring-white/[0.08]" />
        )}
      </motion.div>

      <div className={`mt-12 sm:mt-14 ${TWO_COLUMNS}`}>
        {/* The index: quiet, sticky, only where there is room for it. */}
        <aside className="hidden xl:block">
          {sections.length ? (
            <nav aria-label={t.onThisPage} className="sticky top-28">
              <ol className="m-0 list-none space-y-2.5 p-0">
                {[{ id: "e-top", label: t.overview }, ...sections.map((s) => ({ id: `e-${s.id}`, label: s.heading }))].map(
                  (entry) => {
                    const current = entry.id === active;
                    return (
                      <li className="relative" key={entry.id}>
                        {current ? (
                          <motion.span
                            aria-hidden
                            className="absolute top-[0.45em] -left-3.5 h-[0.8em] w-0.5 rounded-full bg-primary"
                            layoutId="e-index-tick"
                            transition={{ type: "spring", stiffness: 420, damping: 40 }}
                          />
                        ) : null}
                        <button
                          aria-current={current ? "location" : undefined}
                          className={`text-balance text-left text-[0.8125rem] leading-snug transition-colors duration-200 ease-bloom hover:text-foreground ${
                            current ? "text-foreground" : "text-muted-foreground"
                          }`}
                          onClick={() => jump(entry.id)}
                          type="button"
                        >
                          {entry.label}
                        </button>
                      </li>
                    );
                  },
                )}
              </ol>
            </nav>
          ) : null}
        </aside>

        <article className="mx-auto w-full max-w-[640px] xl:mx-0">
          {story === undefined ? <Placeholder /> : story ? <Blocks blocks={story.opening} /> : null}

          {sections.map((section) => (
            <motion.section
              className="mt-16 scroll-mt-28 sm:mt-24"
              id={`e-${section.id}`}
              key={section.id}
              {...revealOnScroll(reduceMotion)}
            >
              <Heading>{section.heading}</Heading>
              <Blocks blocks={section.blocks} />
            </motion.section>
          ))}

          {/* The end: what it is made with, where to get it, and the neighbours. */}
          {story === undefined ? null : (
            <footer className="mt-24 sm:mt-28">
              <ProjectTechLoop project={project} />
              <div className="mt-10 h-px bg-border/80" />
              <div className="mt-6">
                <Links project={project} />
              </div>
              <div className="mt-12 grid grid-cols-2 gap-6">
                {previous ? (
                  <Link className="group block" to={`/projects/${previous.slug}?v=e`}>
                    <span className="block text-[0.8125rem] text-muted-foreground">{t.previousProject}</span>
                    <span className="mt-0.5 block text-[0.9375rem] text-foreground/85 transition-colors group-hover:text-foreground">
                      {previous.title}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}
                {next ? (
                  <Link className="group block text-right" to={`/projects/${next.slug}?v=e`}>
                    <span className="block text-[0.8125rem] text-muted-foreground">{t.nextProject}</span>
                    <span className="mt-0.5 block text-[0.9375rem] text-foreground/85 transition-colors group-hover:text-foreground">
                      {next.title}
                    </span>
                  </Link>
                ) : null}
              </div>
            </footer>
          )}
        </article>
      </div>
    </div>
  );
}
