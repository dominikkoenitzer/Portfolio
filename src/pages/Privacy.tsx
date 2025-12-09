import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { SEO } from "@/components/seo";
import { SITE_CONFIG } from "@/constants";
import { generateAlternateLanguages } from "@/lib/seo-utils";

const Privacy = () => {
  const privacyUrl = `${SITE_CONFIG.url}/privacy`;

  return (
    <>
      <SEO
        alternateLanguages={generateAlternateLanguages("/privacy")}
        description="Privacy policy for dominikkoenitzer.ch. Learn how your data is collected, used, and protected when visiting this website. Compliant with Swiss FADP and EU GDPR regulations."
        keywords="privacy policy, data protection, GDPR, FADP, privacy statement, data privacy, Switzerland privacy"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Privacy Policy",
          description: "Privacy policy for dominikkoenitzer.ch",
          url: privacyUrl,
        }}
        title="Privacy Policy"
        url={privacyUrl}
      />
      <PageLayout>
        <div className="min-h-screen bg-background">
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
                  Privacy Policy
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
                    Introduction
                  </h2>
                  <p className="mb-3 text-muted-foreground text-sm leading-relaxed sm:mb-4 sm:text-base">
                    This personal portfolio website showcases my projects and
                    services. This privacy policy explains how your data is
                    handled when you visit this site.
                  </p>
                  <div className="space-y-1.5 text-sm sm:space-y-2 sm:text-base">
                    <p className="text-foreground">
                      <strong className="text-foreground">
                        Data Controller:
                      </strong>{" "}
                      Dominik Könitzer, Switzerland
                    </p>
                    <p className="text-foreground">
                      <strong className="text-foreground">Contact:</strong>{" "}
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
                    Data Collection
                  </h2>
                  <div className="space-y-3 text-muted-foreground text-sm leading-relaxed sm:space-y-4 sm:text-base">
                    <p>
                      <strong className="text-foreground">
                        Hosting & Analytics:
                      </strong>{" "}
                      This site is hosted by Vercel. Server logs (IP address,
                      browser type, access time) are stored for security and
                      reliability. Visitor statistics are collected via Vercel
                      Analytics with anonymized data only—no cookies or tracking
                      identifiers are used.
                    </p>
                    <p>
                      <strong className="text-foreground">Contact Form:</strong>{" "}
                      If you contact me via the contact form or email, I store
                      your provided information (name, email, message) solely to
                      process your enquiry and respond to follow-up questions.
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
                    Your Rights
                  </h2>
                  <p className="mb-3 text-muted-foreground text-sm leading-relaxed sm:mb-4 sm:text-base">
                    You have the right to access, rectify, or delete your
                    personal data. You may also request restriction of
                    processing or object to processing.
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                    To exercise these rights, please contact me at{" "}
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
                    Impressum
                  </h2>
                  <div className="space-y-1.5 text-foreground text-sm leading-relaxed sm:space-y-2 sm:text-base">
                    <p>
                      <strong>Responsible for this website:</strong>
                    </p>
                    <p>Dominik Könitzer</p>
                    <p>Zurich, Switzerland</p>
                    <p>
                      Email:{" "}
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
                    Last updated: {new Date().getFullYear()}
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </section>
        </div>
      </PageLayout>
    </>
  );
};

export default Privacy;
