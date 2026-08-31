import { motion, useReducedMotion } from "framer-motion";
import { SEO } from "@/components/seo";
import { SITE_CONFIG } from "@/constants";
import { revealOnScroll } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-context";
import { LOCALE_TAG } from "@/lib/locale";
import { REVEAL, stagger } from "@/lib/motion";
import { translations } from "@/lib/translations";

// Bump this when the policy text actually changes (rendered in the active locale).
const PRIVACY_REVISED = "2026-06-26";

const EMAIL = "dominik.koenitzer@gmail.com";

/**
 * A panel of legal text is not a control: `.glass-card` ships a hover lift and
 * a deeper shadow for cards you can click, and both are cancelled here so the
 * page never offers an affordance it cannot honour. The overrides are utilities,
 * which out-rank the component-layer rule they undo.
 */
const PANEL =
  "glass-card rounded-2xl p-6 hover:[translate:none] hover:shadow-sm sm:p-8";

/** Caps the measure at a comfortable reading line for long-form copy. */
const PROSE = "max-w-[68ch] text-muted-foreground leading-relaxed";

const MAIL_LINK = "break-all text-primary underline-offset-4 hover:underline";

const Privacy = () => {
  const { language } = useLanguage();
  const t = translations[language].privacy;
  const seo = translations[language].seo.privacy;
  const s = t.sections;
  const reduceMotion = useReducedMotion();
  const privacyUrl = `${SITE_CONFIG.url}/privacy`;
  const lastRevised = new Date(PRIVACY_REVISED).toLocaleDateString(
    LOCALE_TAG[language],
    { year: "numeric", month: "long", day: "numeric" },
  );

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
      <div className="min-h-screen">
        <section className="reading-padding">
          <motion.div {...revealOnScroll(reduceMotion, stagger())}>
            {/* The revision date belongs with the title: it is what a reader
                checks first, and it was stranded under the last panel. */}
            <motion.header
              className="mb-10 text-center sm:mb-14"
              variants={REVEAL}
            >
              <h1 className="font-bold text-3xl sm:text-4xl">{t.title}</h1>
              <div className="mx-auto mt-4 h-0.5 w-16 bg-primary" />
              <p className="mt-5 text-muted-foreground text-sm">
                {s.lastUpdated}
                {lastRevised}
              </p>
            </motion.header>

            <div className="space-y-6 sm:space-y-8">
              <motion.section className={PANEL} variants={REVEAL}>
                <h2 className="mb-3 font-semibold text-xl sm:text-2xl">
                  {s.intro.heading}
                </h2>
                <p className={`mb-5 ${PROSE}`}>{s.intro.body}</p>
                <dl className="space-y-2 text-base">
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
              </motion.section>

              <motion.section className={PANEL} variants={REVEAL}>
                <h2 className="mb-3 font-semibold text-xl sm:text-2xl">
                  {s.collection.heading}
                </h2>
                <div className="space-y-4">
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
                </div>
              </motion.section>

              <motion.section className={PANEL} variants={REVEAL}>
                <h2 className="mb-3 font-semibold text-xl sm:text-2xl">
                  {s.rights.heading}
                </h2>
                <p className={`mb-4 ${PROSE}`}>{s.rights.body}</p>
                <p className={PROSE}>
                  {s.rights.contactPrompt}
                  <a className={MAIL_LINK} href={`mailto:${EMAIL}`}>
                    {EMAIL}
                  </a>
                </p>
              </motion.section>

              <motion.section className={PANEL} variants={REVEAL}>
                <h2 className="mb-3 font-semibold text-xl sm:text-2xl">
                  {s.impressum.heading}
                </h2>
                <address className="space-y-1.5 text-base text-foreground not-italic leading-relaxed">
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
              </motion.section>
            </div>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default Privacy;
