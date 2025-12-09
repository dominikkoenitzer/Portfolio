import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import ContactForm from "../forms/ContactForm";
import { SectionHeading } from "../layout/SectionHeading";

export default function ContactSection() {
  return (
    <section className="section-padding relative overflow-hidden" id="contact">
      <div className="-z-10 absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />

      <SectionHeading
        subtitle="Feel free to reach out with any questions or project inquiries."
        title="Get In Touch"
      />

      <div className="grid gap-8 md:grid-cols-12 md:gap-12">
        <motion.div
          className="md:col-span-5"
          initial={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <div className="glass-card h-full rounded-xl p-8">
            <h3 className="mb-8 font-heading font-semibold text-2xl">
              Contact Information
            </h3>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-lg">Email</p>
                  <a
                    className="link-hover inline-block text-muted-foreground transition-colors hover:text-primary"
                    href="mailto:dominik.koenitzer@wiss-edu.ch"
                  >
                    dominik.koenitzer@wiss-edu.ch
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-lg">Location</p>
                  <p className="text-muted-foreground">Zurich, Switzerland</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h4 className="mb-4 font-medium text-lg">Follow Me</h4>
              <div className="flex space-x-4">
                <a
                  aria-label="GitHub"
                  className="group flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background/50 text-muted-foreground transition-all duration-300 hover:border-primary hover:text-primary"
                  href="https://github.com/dominikkoenitzer"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <svg
                    className="lucide lucide-github transition-transform duration-300 group-hover:scale-110"
                    fill="none"
                    height="22"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="22"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="md:col-span-7"
          initial={{ opacity: 0, x: 30 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <div className="glass-card rounded-xl p-8">
            <h3 className="mb-8 font-heading font-semibold text-2xl">
              Send Me a Message
            </h3>
            <ContactForm />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
