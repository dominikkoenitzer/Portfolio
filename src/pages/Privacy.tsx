import { useEffect } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Privacy = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
    
    document.body.style.fontFamily = "'Inter', sans-serif";
    
    const rootStyles = document.documentElement.style;
    rootStyles.setProperty('--primary-rgb', '37, 99, 235');
    
    const style = document.createElement('style');
    style.textContent = `
      .highlight-text {
        display: inline-block;
        position: relative;
        color: var(--foreground);
        font-weight: 500;
      }
      
      .highlight-text::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 5px;
        background: linear-gradient(to right, rgba(var(--primary-rgb), 0.2), rgba(var(--primary-rgb), 0.05));
        border-radius: 4px;
        z-index: -1;
      }
      
      .gradient-border {
        position: relative;
      }
      
      .gradient-border::before {
        content: '';
        position: absolute;
        inset: -1px;
        background: linear-gradient(45deg, rgba(var(--primary-rgb), 0.3), transparent, rgba(var(--primary-rgb), 0.3));
        border-radius: inherit;
        z-index: -1;
        animation: border-rotate 8s linear infinite;
      }
      
      @keyframes border-rotate {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
      
      .link-hover {
        position: relative;
      }
      
      .link-hover::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 2px;
        bottom: -2px;
        left: 0;
        background: currentColor;
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 0.3s ease;
      }
      
      .link-hover:hover::after {
        transform: scaleX(1);
        transform-origin: left;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(fontLink);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <ThemeProvider defaultTheme="system">
      <motion.div 
        className="progress-bar fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/70 via-primary to-primary/70 z-[100]"
        style={{ scaleX, transformOrigin: "0%" }}
      />
      
      <Navbar />
      
      <main className="min-h-screen bg-background">
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
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
                  <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    This personal portfolio website (<a href="https://dominikkoenitzer.ch" className="text-primary hover:underline">https://dominikkoenitzer.ch</a>) showcases my projects and freelance services. This privacy policy complies with the Swiss Federal Act on Data Protection (revFADP 2023) and the European General Data Protection Regulation (GDPR). It explains which data are processed when you visit this site and why.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    <strong>Data Controller:</strong> Dominik Könitzer, Switzerland<br />
                    <strong>Contact:</strong> <a href="mailto:dominik.koenitzer@gmail.com" className="text-primary hover:underline">dominik.koenitzer@gmail.com</a>
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Hosting</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    The site is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
                    Vercel automatically stores connection data — such as IP address, browser type, and time of access — in server logs to ensure secure and reliable website delivery.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    <strong>Legal basis:</strong> Art. 6 (1)(f) GDPR — Legitimate interest in operating and safeguarding the site.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Analytics</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Visitor statistics are collected with Vercel Analytics. All data are anonymised before storage; no cookies or cross-site identifiers are set.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    <strong>Legal basis:</strong> Art. 6 (1)(f) GDPR — Legitimate interest in analysing and improving site performance without infringing on user privacy.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Contact</h2>
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
                  <h2 className="text-2xl font-semibold mb-4">Processors</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Data processed by Vercel and Vercel Analytics is governed by data-processing agreements compliant with Art. 28 GDPR and Art. 9 revFADP.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
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
                  <h2 className="text-2xl font-semibold mb-4">Changes</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    This privacy policy may be updated to reflect changes in law or site functionality. The current version is always available at: <a href="https://dominikkoenitzer.ch/privacy" className="text-primary hover:underline">https://dominikkoenitzer.ch/privacy</a>
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Impressum</h2>
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
      </main>
      
      <Footer />
    </ThemeProvider>
  );
};

export default Privacy;
