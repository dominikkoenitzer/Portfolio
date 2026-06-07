import { motion } from "framer-motion";
import { SEO } from "@/components/seo";
import { SITE_CONFIG } from "@/constants";
import { useLanguage } from "@/lib/language-provider";
import { generateAlternateLanguages } from "@/lib/seo-utils";
import { translations } from "@/lib/translations";

const Privacy = () => {
  const { language } = useLanguage();
  const t = translations[language].privacy;
  const seo = translations[language].seo.privacy;
  const s = t.sections;
  const privacyUrl = `${SITE_CONFIG.url}/privacy`;

  return (
    <>
      <SEO
        alternateLanguages={generateAlternateLanguages("/privacy")}
        description={seo.description}
        keywords={seo.keywords}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Privacy Policy",
          description: "Privacy policy for dominikkoenitzer.ch",
          url: privacyUrl,
        }}
        title={seo.title}
        url={privacyUrl}
      />
      <div className="min-h-screen">
        <section className="px-4 py-8 pt-[72px] sm:px-6 sm:py-12 sm:pt-[86px] md:px-8 md:py-20 md:pt-[101px] lg:px-16">
          <div className="mx-auto max-w-3xl">
            {/* Header */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 text-center sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="mb-2 font-bold font-heading text-2xl sm:mb-3 sm:text-3xl md:text-4xl lg:text-5xl">
                {t.title}
              </h1>
              <div className="mx-auto h-0.5 w-12 bg-primary sm:h-1 sm:w-16 md:w-20" />
            </motion.div>

            {/* Content */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 sm:space-y-6 md:space-y-8"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {/* Introduction Card */}
              <motion.section
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border/50 bg-card/50 p-4 sm:rounded-2xl sm:p-5 md:p-6 lg:p-8"
                initial={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="mb-2 font-heading font-semibold text-lg sm:mb-3 sm:text-xl md:text-2xl">
                  {s.intro.heading}
                </h2>
                <p className="mb-3 text-muted-foreground text-sm leading-relaxed sm:mb-4 sm:text-base">
                  {s.intro.body}
                </p>
                <div className="space-y-1.5 text-sm sm:space-y-2 sm:text-base">
                  <p className="text-foreground">
                    <strong className="text-foreground">
                      {s.intro.controllerLabel}
                    </strong>{" "}
                    {s.intro.controllerValue}
                  </p>
                  <p className="text-foreground">
                    <strong className="text-foreground">
                      {s.intro.contactLabel}
                    </strong>{" "}
                    <a
                      className="break-all text-primary hover:underline"
                      href="mailto:dominik.koenitzer@gmail.com"
                    >
                      dominik.koenitzer@gmail.com
                    </a>
                  </p>
                </div>
              </motion.section>

              {/* Data Collection Card */}
              <motion.section
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border/50 bg-card/50 p-4 sm:rounded-2xl sm:p-5 md:p-6 lg:p-8"
                initial={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="mb-2 font-heading font-semibold text-lg sm:mb-3 sm:text-xl md:text-2xl">
                  {s.collection.heading}
                </h2>
                <div className="space-y-3 text-muted-foreground text-sm leading-relaxed sm:space-y-4 sm:text-base">
                  <p>
                    <strong className="text-foreground">
                      {s.collection.hostingLabel}
                    </strong>{" "}
                    {s.collection.hostingBody}
                  </p>
                  <p>
                    <strong className="text-foreground">
                      {s.collection.contactLabel}
                    </strong>{" "}
                    {s.collection.contactBody}
                  </p>
                </div>
              </motion.section>

              {/* Your Rights Card */}
              <motion.section
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border/50 bg-card/50 p-4 sm:rounded-2xl sm:p-5 md:p-6 lg:p-8"
                initial={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="mb-2 font-heading font-semibold text-lg sm:mb-3 sm:text-xl md:text-2xl">
                  {s.rights.heading}
                </h2>
                <p className="mb-3 text-muted-foreground text-sm leading-relaxed sm:mb-4 sm:text-base">
                  {s.rights.body}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                  {s.rights.contactPrompt}
                  <a
                    className="break-all text-primary hover:underline"
                    href="mailto:dominik.koenitzer@gmail.com"
                  >
                    dominik.koenitzer@gmail.com
                  </a>
                </p>
              </motion.section>

              {/* Impressum Card */}
              <motion.section
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border/50 bg-card/50 p-4 sm:rounded-2xl sm:p-5 md:p-6 lg:p-8"
                initial={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="mb-2 font-heading font-semibold text-lg sm:mb-3 sm:text-xl md:text-2xl">
                  {s.impressum.heading}
                </h2>
                <div className="space-y-1.5 text-foreground text-sm leading-relaxed sm:space-y-2 sm:text-base">
                  <p>
                    <strong>{s.impressum.responsibleFor}</strong>
                  </p>
                  <p>{s.impressum.name}</p>
                  <p>{s.impressum.city}</p>
                  <p>
                    {s.impressum.emailLabel}
                    <a
                      className="break-all text-primary hover:underline"
                      href="mailto:dominik.koenitzer@gmail.com"
                    >
                      dominik.koenitzer@gmail.com
                    </a>
                  </p>
                </div>
              </motion.section>

              {/* Last Updated */}
              <motion.div
                animate={{ opacity: 1 }}
                className="pt-2 text-center sm:pt-4"
                initial={{ opacity: 0 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {s.lastUpdated}
                  {new Date().getFullYear()}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Privacy;
