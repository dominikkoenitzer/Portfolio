import { PageLayout } from '@/components/layout/PageLayout';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
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
        <section className="section-padding pt-32">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Home
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">Privacy Policy</h1>
              <div className="w-20 h-1 bg-primary mx-auto"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose prose-lg max-w-none dark:prose-invert"
            >
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold mb-4 font-heading">Introduction</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    This personal portfolio website (<a href="https://dominikkoenitzer.ch" className="text-primary hover:underline">https://dominikkoenitzer.ch</a>) showcases my projects and freelance services. This privacy policy complies with the Swiss Federal Act on Data Protection (revFADP 2023) and the European General Data Protection Regulation (GDPR). It explains which data are processed when you visit this site and why.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    <strong>Data Controller:</strong> Dominik Könitzer, Switzerland<br />
                    <strong>Contact:</strong> <a href="mailto:dominik.koenitzer@gmail.com" className="text-primary hover:underline">dominik.koenitzer@gmail.com</a>
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 font-heading">Hosting</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    The site is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
                    Vercel automatically stores connection data — such as IP address, browser type, and time of access — in server logs to ensure secure and reliable website delivery.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    <strong>Legal basis:</strong> Art. 6 (1)(f) GDPR — Legitimate interest in operating and safeguarding the site.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 font-heading">Analytics</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Visitor statistics are collected with Vercel Analytics. All data are anonymised before storage; no cookies or cross-site identifiers are set.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    <strong>Legal basis:</strong> Art. 6 (1)(f) GDPR — Legitimate interest in analysing and improving site performance without infringing on user privacy.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 font-heading">Contact</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    You can contact me via the on-site contact form or email. I store the data you provide (name, email address, and message) solely to process your enquiry and for possible follow-up questions.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    <strong>Legal basis:</strong>
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground leading-relaxed ml-4">
                    <li>Art. 6 (1)(a) GDPR — Consent</li>
                    <li>Where relevant, Art. 6 (1)(b) GDPR — Pre-contractual measures at your request</li>
                  </ul>
                </section>


                <section>
                  <h2 className="text-2xl font-semibold mb-4 font-heading">Processors</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Data processed by Vercel and Vercel Analytics is governed by data-processing agreements compliant with Art. 28 GDPR and Art. 9 revFADP.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 font-heading">Your Rights</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    You have the right to request confirmation of whether personal data about you is processed and to obtain access to such data. You may also:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground leading-relaxed ml-4 mt-4">
                    <li>Request rectification or erasure</li>
                    <li>Request restriction of processing</li>
                    <li>Exercise your right to data portability</li>
                    <li>Object to processing based on legitimate interests, on grounds relating to your particular situation</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    To exercise these rights, please email <a href="mailto:dominik.koenitzer@gmail.com" className="text-primary hover:underline">dominik.koenitzer@gmail.com</a>.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Swiss residents may contact the Federal Data Protection and Information Commissioner (FDPIC).
                    EU residents may lodge a complaint with their local data protection supervisory authority.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 font-heading">Changes</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    This privacy policy may be updated to reflect changes in law or site functionality. The current version is always available at: <a href="https://dominikkoenitzer.ch/privacy" className="text-primary hover:underline">https://dominikkoenitzer.ch/privacy</a>
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 font-heading">Impressum</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>Responsible for this website:</strong><br />
                    Dominik Könitzer<br />
                    Zurich, Switzerland<br />
                    Email: <a href="mailto:dominik.koenitzer@gmail.com" className="text-primary hover:underline">dominik.koenitzer@gmail.com</a>
                  </p>
                </section>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PageLayout>
    </>
  );
};

export default Privacy;
