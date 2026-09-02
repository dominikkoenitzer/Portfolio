import { motion, useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { SEO } from "@/components/seo";
import { SITE_CONFIG } from "@/constants";
import { revealOnScroll } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-context";
import { LOCALE_TAG } from "@/lib/locale";
import { DUR, EASE_OUT, REVEAL, stagger } from "@/lib/motion";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";

// Bump this when the policy text actually changes (rendered in the active locale).
const PRIVACY_REVISED = "2026-06-26";

const EMAIL = "dominik.koenitzer@gmail.com";

/**
 * Anchor ids stay English in every language, so a link someone saved or shared
 * keeps working after they switch the site to another one.
 */
const SECTION_IDS = [
  "introduction",
  "data-collection",
  "your-rights",
  "impressum",
] as const;

type SectionId = (typeof SECTION_IDS)[number];

/** Matches `scroll-mt-28` on the sections, so a jump clears the fixed header. */
const SCROLL_OFFSET = 112;

/** One row of the contents rail, and the height the marker travels in. */
const TOC_ROW = 44;

/**
 * Long-form body copy. The measure is capped by the column itself rather than
 * by a `max-w` on the paragraph: the old page put a 68ch paragraph inside a
 * 574px card, which left the text with two different side gaps. The column is
 * 34rem, which is that same comfortable measure, so the text now fills it and
 * every left and right edge on the page lines up.
 */
const PROSE = "text-muted-foreground leading-[1.75]";

// Always underlined: inside a paragraph the colour alone does not mark it as
// a link (axe link-in-text-block, 1.61:1 against the surrounding text).
// `anywhere` rather than `break-all`: the address may only wrap when the line
// cannot hold it, not mid-word on a 390px screen ("dom / inik@...").
const MAIL_LINK =
  "[overflow-wrap:anywhere] text-primary underline underline-offset-4";

/** Mono micro-label. Violet is the structural colour; sage stays for signals. */
const INDEX_LABEL = "text-primary text-xs tracking-[0.14em]";

/**
 * One clause of the policy: a hairline, a number, a heading, then the text. No
 * panel, no shadow, no hover state. A rule between two blocks of prose says
 * "new section" without pretending the paragraph is a card you can click.
 */
function Clause({
  children,
  heading,
  id,
  index,
}: {
  children: ReactNode;
  heading: string;
  id: string;
  index: number;
}) {
  return (
    <motion.section
      className="scroll-mt-28 border-border/50 border-t pt-10 first:border-t-0 first:pt-0"
      id={id}
      variants={REVEAL}
    >
      <h2 className="font-semibold text-foreground text-xl sm:text-2xl">
        {/* The number is decoration for the eye and for the rail beside it, so
            it is hidden from the accessible name of the heading. */}
        <span aria-hidden="true" className={`${INDEX_LABEL} mb-2 block`}>
          {String(index + 1).padStart(2, "0")}
        </span>
        {heading}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </motion.section>
  );
}

const Privacy = () => {
  const { language } = useLanguage();
  const t = translations[language].privacy;
  const seo = translations[language].seo.privacy;
  const s = t.sections;
  const reduceMotion = useReducedMotion();
  const lenis = useLenis();
  const [active, setActive] = useState<SectionId>(SECTION_IDS[0]);
  const privacyUrl = `${SITE_CONFIG.url}/privacy`;
  const lastRevised = new Date(PRIVACY_REVISED).toLocaleDateString(
    LOCALE_TAG[language],
    { year: "numeric", month: "long", day: "numeric" },
  );

  const contents = [
    s.intro.heading,
    s.collection.heading,
    s.rights.heading,
    s.impressum.heading,
  ];

  /**
   * Which clause the reader is in. The observer band is the upper third of the
   * viewport, so the rail marks the section being read rather than whichever
   * one happens to be on screen, and the last match wins when two overlap.
   */
  useEffect(() => {
    const nodes = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (node): node is HTMLElement => node !== null,
    );
    if (nodes.length === 0) return;

    const onScreen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onScreen.add(entry.target.id);
          else onScreen.delete(entry.target.id);
        }
        const first = SECTION_IDS.find((id) => onScreen.has(id));
        if (first) setActive(first);
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const activeIndex = Math.max(SECTION_IDS.indexOf(active), 0);

  return (
    <>
      <SEO
        description={seo.description}
        keywords={seo.keywords}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Privacy Policy",
          description: "Privacy policy for dk.punds.ch",
          url: privacyUrl,
        }}
        title={seo.title}
        url={privacyUrl}
      />
      <section className="section-padding">
        {/* One reading column, centred, with the contents rail sitting in the
            page margin from xl up. Below that the rail is dropped rather than
            stacked: four headings above four short sections is furniture, not
            navigation, and the whole policy is a couple of screens on a phone. */}
        <div className="mx-auto w-full max-w-[34rem] xl:mx-0 xl:grid xl:max-w-none xl:grid-cols-[13rem_34rem_13rem] xl:justify-center xl:gap-x-10">
          <div className="xl:col-start-2">
            <SectionHeading
              align="left"
              className="mb-5"
              eyebrow={t.eyebrow}
              title={t.title}
            />

            <motion.p
              className="mb-12 text-muted-foreground text-sm"
              {...revealOnScroll(reduceMotion)}
            >
              {s.lastUpdated}
              <time dateTime={PRIVACY_REVISED}>{lastRevised}</time>
            </motion.p>

            <motion.article
              className="space-y-10"
              {...revealOnScroll(reduceMotion, stagger())}
            >
              <Clause heading={s.intro.heading} id={SECTION_IDS[0]} index={0}>
                <p className={PROSE}>{s.intro.body}</p>
                {/* The two facts a reader came for, set off by a rule in the
                    margin instead of a box: it reads as a citation, which is
                    what it is. */}
                <dl className="space-y-2 border-primary/25 border-l-2 pl-5 text-base">
                  <div className="flex flex-col gap-x-2 sm:flex-row sm:flex-wrap">
                    <dt className="font-semibold text-foreground">
                      {s.intro.controllerLabel}
                    </dt>
                    <dd className="text-foreground">
                      {s.intro.controllerValue}
                    </dd>
                  </div>
                  <div className="flex flex-col gap-x-2 sm:flex-row sm:flex-wrap">
                    <dt className="font-semibold text-foreground">
                      {s.intro.contactLabel}
                    </dt>
                    <dd className="min-w-0">
                      <a className={MAIL_LINK} href={`mailto:${EMAIL}`}>
                        {EMAIL}
                      </a>
                    </dd>
                  </div>
                </dl>
              </Clause>

              <Clause
                heading={s.collection.heading}
                id={SECTION_IDS[1]}
                index={1}
              >
                <p className={PROSE}>
                  <strong className="font-semibold text-foreground">
                    {s.collection.hostingLabel}
                  </strong>{" "}
                  {s.collection.hostingBody}
                </p>
                <p className={PROSE}>
                  <strong className="font-semibold text-foreground">
                    {s.collection.contactLabel}
                  </strong>{" "}
                  {s.collection.contactBody}
                </p>
              </Clause>

              <Clause heading={s.rights.heading} id={SECTION_IDS[2]} index={2}>
                <p className={PROSE}>{s.rights.body}</p>
                <p className={PROSE}>
                  {s.rights.contactPrompt}
                  <a className={MAIL_LINK} href={`mailto:${EMAIL}`}>
                    {EMAIL}
                  </a>
                </p>
              </Clause>

              <Clause
                heading={s.impressum.heading}
                id={SECTION_IDS[3]}
                index={3}
              >
                <address className="space-y-1.5 border-primary/25 border-l-2 pl-5 text-base text-foreground not-italic leading-relaxed">
                  <p className="font-semibold">{s.impressum.responsibleFor}</p>
                  <p>{s.impressum.name}</p>
                  <p>{s.impressum.city}</p>
                  <p className="min-w-0">
                    {s.impressum.emailLabel}
                    <a className={MAIL_LINK} href={`mailto:${EMAIL}`}>
                      {EMAIL}
                    </a>
                  </p>
                </address>
              </Clause>
            </motion.article>
          </div>

          {/* Contents rail. Sticky, so it stays in reach through a page that is
              mostly scrolling, and the marker slides on transform alone. */}
          <aside className="hidden xl:col-start-3 xl:block">
            <nav aria-labelledby="privacy-toc" className="sticky top-28">
              <p
                className="text-[11px] text-muted-foreground uppercase tracking-[0.18em]"
                id="privacy-toc"
              >
                {t.onThisPage}
              </p>
              <ol className="relative mt-4 border-border/60 border-l">
                <motion.span
                  animate={{ y: activeIndex * TOC_ROW }}
                  aria-hidden="true"
                  className="absolute top-0 -left-px block w-0.5 bg-primary"
                  initial={false}
                  style={{ height: TOC_ROW }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: DUR.fast, ease: EASE_OUT }
                  }
                />
                {contents.map((label, index) => {
                  const id = SECTION_IDS[index];
                  const isActive = id === active;
                  return (
                    <li key={id}>
                      <a
                        aria-current={isActive ? "true" : undefined}
                        className={cn(
                          "flex h-11 items-center gap-3 pl-5 text-sm transition-colors duration-200 ease-out",
                          isActive
                            ? "font-medium text-primary"
                            : "text-muted-foreground hover:text-primary",
                        )}
                        href={`#${id}`}
                        onClick={(e) => {
                          // Lenis owns the scroll position: a native hash jump
                          // moves the window out from under it. Without Lenis
                          // (reduced motion) the default jump is correct and
                          // `scroll-mt-28` already clears the header.
                          //
                          // The destination is worked out here and handed over
                          // as an absolute offset rather than as a selector,
                          // because Lenis resolving the element itself landed
                          // it 112px lower than asked. Lenis drives the real
                          // window scroll, so `scrollY` is authoritative.
                          const node = document.getElementById(id);
                          if (!lenis || !node) return;
                          e.preventDefault();
                          lenis.scrollTo(
                            node.getBoundingClientRect().top +
                              window.scrollY -
                              SCROLL_OFFSET,
                          );
                        }}
                      >
                        <span
                          aria-hidden="true"
                          className="text-[11px] tabular-nums"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {label}
                      </a>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </aside>
        </div>
      </section>
    </>
  );
};

export default Privacy;
