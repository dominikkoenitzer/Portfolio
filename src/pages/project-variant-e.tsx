import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";
import { useLenis } from "lenis/react";
import { type ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PrivateSource } from "@/components/sections/PrivateSource";
import { getProjects } from "@/constants/projects";
import { revealOnScroll } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { Demo, StillFigure } from "./e/kit";
import type { Block, Story } from "./e/types";
import type { VariantProps } from "./project-variants";

/**
 * Layout e of the project page (SPEC-e.md, 18.10.): a short, typography-led
 * essay in one 640px column, with live demos of the app's key moments in one
 * kind of box, and a quiet sticky index on wide screens.
 */

/** Each project's story is its own chunk: only the visited one downloads. */
const STORIES = import.meta.glob<{ story: Story }>("./e/stories/*.ts");

/** The project's story once loaded; undefined while it loads, null if it has none. */
function useStory(slug: string): Story | null | undefined {
  const load = STORIES[`./e/stories/${slug}.ts`];
  const [loaded, setLoaded] = useState<{ slug: string; story: Story | null } | null>(null);
  useEffect(() => {
    if (!load) return;
    let live = true;
    load().then(
      (module) => live && setLoaded({ slug, story: module.story }),
      () => live && setLoaded({ slug, story: null }),
    );
    return () => {
      live = false;
    };
  }, [load, slug]);
  if (!load) return null;
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

/** The project's links, as quiet text: open or install it, its page, its source. */
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
      <span className="shrink-0">{children}</span>
      <span aria-hidden className="h-px flex-1 bg-border/80" />
    </h2>
  );
}

function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="mt-4 space-y-4">
      {paragraphs.map((p) => (
        <p className="m-0 text-[1rem] text-foreground/85 leading-[1.625]" key={p}>
          {p}
        </p>
      ))}
    </div>
  );
}

/**
 * A story's blocks in reading order. Paragraphs sit 16px apart; a demo or a
 * still gets 32px of air on both sides, so the column breathes around it.
 */
function Blocks({ blocks, first = false }: { blocks: Block[]; first?: boolean }) {
  // Only the opening's first picture or demo loads eagerly.
  const eagerAt = first ? blocks.findIndex((b) => typeof b !== "string") : -1;
  return (
    <div className="mt-4">
      {blocks.map((block, i) => {
        const prev = blocks[i - 1];
        const gap = i === 0 ? "" : typeof block === "string" && typeof prev === "string" ? "mt-4" : "mt-8";
        if (typeof block === "string") {
          return (
            <p className={`m-0 text-[1rem] text-foreground/85 leading-[1.625] ${gap}`} key={block}>
              {block}
            </p>
          );
        }
        const eager = i === eagerAt;
        if ("Demo" in block) {
          return (
            <div className={gap} key={`demo-${i}`}>
              <block.Demo />
            </div>
          );
        }
        return (
          <div className={gap} key={block.still.name}>
            <StillFigure eager={eager} still={block.still} />
          </div>
        );
      })}
    </div>
  );
}

/** For a project without a story yet: its real screenshot, whole, in the demo box. */
function Screenshot({ props }: { props: VariantProps }) {
  const src = props.pictures[0];
  if (!src) return null;
  return (
    <Demo caption={props.captionFor(0) ?? ""} height={380} label={props.altFor(0)} phoneHeight={240}>
      <div className="absolute inset-3 flex items-center justify-center sm:inset-5">
        <img
          alt={props.altFor(0)}
          className="max-h-full max-w-full rounded-lg object-contain shadow-[0_1px_2px_rgb(0_0_0/0.08),0_20px_40px_-24px_rgb(0_0_0/0.4)]"
          decoding="async"
          fetchPriority="high"
          src={src}
        />
      </div>
    </Demo>
  );
}

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


  return (
    <div className="mx-auto w-full max-w-[1100px] px-6 pt-4 pb-32 sm:px-8 xl:grid xl:grid-cols-[168px_640px] xl:justify-center xl:gap-x-28 xl:px-0">
      {/* The index: quiet, sticky, only where there is room for it. */}
      <aside className="hidden xl:block">
        <nav aria-label={t.onThisPage} className="sticky top-28 pt-[4.25rem]">
          <Link
            className="inline-flex items-center gap-1.5 text-[0.8125rem] text-muted-foreground transition-colors hover:text-foreground"
            to="/projects"
          >
            <span aria-hidden>&larr;</span> {t.projects}
          </Link>
          {sections.length ? (
            <ol className="mt-8 list-none space-y-2.5 p-0">
              {[{ id: "e-top", label: t.overview }, ...sections.map((s) => ({ id: `e-${s.id}`, label: s.heading }))].map((entry) => {
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
                      className={`text-left text-[0.8125rem] leading-snug transition-colors duration-200 ease-bloom hover:text-foreground ${
                        current ? "text-foreground" : "text-muted-foreground"
                      }`}
                      onClick={() => jump(entry.id)}
                      type="button"
                    >
                      {entry.label}
                    </button>
                  </li>
                );
              })}
            </ol>
          ) : null}
        </nav>
      </aside>

      <article className="mx-auto w-full max-w-[640px] xl:mx-0">
        <nav aria-label={t.breadcrumb} className="xl:hidden">
          <Link
            className="inline-flex items-center gap-1.5 text-[0.8125rem] text-muted-foreground transition-colors hover:text-foreground"
            to="/projects"
          >
            <span aria-hidden>&larr;</span> {t.projects}
          </Link>
        </nav>

        <header className="mt-10 scroll-mt-28 xl:mt-16" id="e-top">
          <h1 className="title-serif m-0 ml-[-0.04em] font-bold text-[2.25rem] leading-[1.1] tracking-[-0.01em]">
            {project.title}
          </h1>
          {meta.length ? (
            <p className="m-0 mt-2 text-[0.875rem] text-muted-foreground">{meta.join(" · ")}</p>
          ) : null}
          <div className="mt-5">
            <Links project={project} />
          </div>
        </header>

        <div className="mt-8">
          {story === undefined ? (
            // Nothing visible while the story's chunk loads, and tall enough that
            // everything after it starts below the fold: what arrives is new
            // content, so nothing already on screen moves.
            <div aria-hidden className="min-h-[100svh]" />
          ) : story ? (
            <Blocks blocks={story.opening} first />
          ) : (
            <>
              <Prose paragraphs={[project.tagline]} />
              <div className="mt-8">
                <Screenshot props={props} />
              </div>
            </>
          )}
        </div>

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

        {/* The end: the neighbours, once the story is in. */}
        {story === undefined ? null : (
        <footer className="mt-24 sm:mt-28">
          <div className="h-px bg-border/80" />
          <div className="mt-8 grid grid-cols-2 gap-6">
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
  );
}
