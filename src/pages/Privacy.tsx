import { PageLayout } from '@/components/layout/PageLayout';
import { motion } from 'framer-motion';
import { SEO } from '@/components/seo';
import { SITE_CONFIG } from '@/constants';
import { generateAlternateLanguages } from '@/lib/seo-utils';

const Privacy = () => {
  const privacyUrl = `${SITE_CONFIG.url}/privacy`;

  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Privacy policy for dominikkoenitzer.ch. Learn how your data is collected, used, and protected when visiting this website. Compliant with Swiss FADP and EU GDPR regulations."
        keywords="privacy policy, data protection, GDPR, FADP, privacy statement, data privacy, Switzerland privacy"
        url={privacyUrl}
        alternateLanguages={generateAlternateLanguages('/privacy')}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Privacy Policy',
          description: 'Privacy policy for dominikkoenitzer.ch',
          url: privacyUrl,
        }}
      />
      <PageLayout>
        <div className="min-h-screen bg-background">
          <section className="px-4 sm:px-6 md:px-8 lg:px-16 py-8 sm:py-12 md:py-20 pt-[72px] sm:pt-[86px] md:pt-[101px]">
            <div className="max-w-3xl mx-auto">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center mb-4 sm:mb-8"
              >
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 font-heading">Privacy Policy</h1>
                <div className="w-12 sm:w-16 md:w-20 h-0.5 sm:h-1 bg-primary mx-auto"></div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="space-y-4 sm:space-y-6 md:space-y-8"
              >
                {/* Introduction Card */}
                <motion.section
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card/50 border border-border/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8"
                >
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 font-heading">Introduction</h2>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                    This personal portfolio website showcases my projects and services. This privacy policy explains how your data is handled when you visit this site.
                  </p>
                  <div className="space-y-1.5 sm:space-y-2 text-sm sm:text-base">
                    <p className="text-foreground">
                      <strong className="text-foreground">Data Controller:</strong> Dominik Könitzer, Switzerland
                    </p>
                    <p className="text-foreground">
                      <strong className="text-foreground">Contact:</strong>{' '}
                      <a href="mailto:dominik.koenitzer@gmail.com" className="text-primary hover:underline break-all">
                        dominik.koenitzer@gmail.com
                      </a>
                    </p>
                  </div>
                </motion.section>

                {/* Data Collection Card */}
                <motion.section
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-card/50 border border-border/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8"
                >
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 font-heading">Data Collection</h2>
                  <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                    <p>
                      <strong className="text-foreground">Hosting & Analytics:</strong> This site is hosted by Vercel. Server logs (IP address, browser type, access time) are stored for security and reliability. Visitor statistics are collected via Vercel Analytics with anonymized data only—no cookies or tracking identifiers are used.
                    </p>
                    <p>
                      <strong className="text-foreground">Contact Form:</strong> If you contact me via the contact form or email, I store your provided information (name, email, message) solely to process your enquiry and respond to follow-up questions.
                    </p>
                  </div>
                </motion.section>

                {/* Your Rights Card */}
                <motion.section
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-card/50 border border-border/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8"
                >
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 font-heading">Your Rights</h2>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                    You have the right to access, rectify, or delete your personal data. You may also request restriction of processing or object to processing.
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    To exercise these rights, please contact me at{' '}
                    <a href="mailto:dominik.koenitzer@gmail.com" className="text-primary hover:underline break-all">
                      dominik.koenitzer@gmail.com
                    </a>
                  </p>
                </motion.section>

                {/* Impressum Card */}
                <motion.section
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-card/50 border border-border/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8"
                >
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 font-heading">Impressum</h2>
                  <div className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-foreground leading-relaxed">
                    <p><strong>Responsible for this website:</strong></p>
                    <p>Dominik Könitzer</p>
                    <p>Zurich, Switzerland</p>
                    <p>
                      Email:{' '}
                      <a href="mailto:dominik.koenitzer@gmail.com" className="text-primary hover:underline break-all">
                        dominik.koenitzer@gmail.com
                      </a>
                    </p>
                  </div>
                </motion.section>

                {/* Last Updated */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center pt-2 sm:pt-4"
                >
                  <p className="text-xs sm:text-sm text-muted-foreground">
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
