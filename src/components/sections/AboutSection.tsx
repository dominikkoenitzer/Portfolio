import { motion } from "framer-motion";
import { Award, GraduationCap } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { fadeInLeft, fadeInRight, fadeInUp } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { SectionHeading } from "../layout/SectionHeading";
import { Button } from "../ui/button";
import { GitHubContributions } from "./GitHubContributions";

export function AboutSection() {
  const { language } = useLanguage();
  const t = translations[language].about;

  // When the columns stack on mobile, the desktop left/right slide-ins read as
  // the content drifting sideways (the avatar visibly slides right on load). Use
  // a plain vertical fade there; keep the horizontal slides on the wide layout.
  const [isMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches,
  );
  const avatarReveal = isMobile ? fadeInUp : fadeInLeft;
  const bioReveal = isMobile ? fadeInUp : fadeInRight;

  return (
    <section className="section-padding" id="about">
      <SectionHeading subtitle={t.subheading} title={t.heading} />

      <div className="grid items-center gap-8 md:grid-cols-12 md:gap-10">
        <motion.div className="md:col-span-5 lg:col-span-5" {...avatarReveal}>
          <div className="relative mx-auto max-w-[268px] md:max-w-[348px]">
            <div className="aspect-square overflow-hidden rounded-2xl shadow-lg ring-1 ring-border/20">
              {/* LCP element on /about — fetchPriority high + async decode so it
                  paints fast; explicit square dimensions reserve space (no CLS).
                  &size=480 trims the payload vs the default 460→full-res avatar. */}
              <img
                alt="Dominik Könitzer"
                className="h-full w-full object-cover"
                decoding="async"
                fetchPriority="high"
                height={480}
                src="https://avatars.githubusercontent.com/u/82450286?v=4&size=480"
                width={480}
              />
            </div>
            <motion.div
              animate={{ opacity: 1, x: 0, y: 0 }}
              className="-bottom-4 -right-4 -z-10 absolute h-24 w-24 rounded-xl border border-primary/10 bg-primary/5 backdrop-blur-sm"
              initial={{ opacity: 0, x: isMobile ? 0 : 20, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <motion.div
              animate={{ opacity: 1, x: 0, y: 0 }}
              className="-top-4 -left-4 -z-10 absolute h-24 w-24 rounded-xl border border-primary/10"
              initial={{ opacity: 0, x: isMobile ? 0 : -20, y: -20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>

          <div className="mt-8 space-y-4 md:mt-10 md:space-y-6">
            <InfoCard
              delay={0.1}
              icon={<GraduationCap className="h-5 w-5" />}
              subtitle={t.cards.educationSubtitle}
              title={t.cards.educationTitle}
            />

            <InfoCard
              delay={0.2}
              icon={<Award className="h-5 w-5" />}
              subtitle={t.cards.specializedSubtitle}
              title={t.cards.specializedTitle}
            />
          </div>
        </motion.div>

        <motion.div className="md:col-span-7 lg:col-span-7" {...bioReveal}>
          <motion.div
            className="glass-card rounded-2xl border border-border/20 p-6 shadow-sm backdrop-blur-sm sm:p-8"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <motion.h3
              className="mb-4 font-heading font-semibold text-xl tracking-tight sm:mb-6 sm:text-2xl"
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              {t.passionate}{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {t.passionateRole}
              </span>
            </motion.h3>

            <div className="space-y-4 sm:space-y-5">
              <motion.p
                className="text-muted-foreground text-sm leading-relaxed sm:text-base"
                initial={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                {t.intro1Before}
                <span className="font-medium text-foreground">
                  {t.intro1Highlight}
                </span>
                {t.intro1After}
              </motion.p>

              <motion.p
                className="text-muted-foreground text-sm leading-relaxed sm:text-base"
                initial={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                {t.intro2}
              </motion.p>

              <motion.p
                className="text-muted-foreground text-sm leading-relaxed sm:text-base"
                initial={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                {t.intro3Before}
                <span className="font-medium text-foreground">
                  {t.intro3Word1}
                </span>
                {t.intro3Comma1}
                <span className="font-medium text-foreground">
                  {t.intro3Word2}
                </span>
                {t.intro3Comma2}
                <span className="font-medium text-foreground">
                  {t.intro3Word3}
                </span>
                {t.intro3After}
              </motion.p>
            </div>

            <motion.div
              className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4"
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <Button asChild className="group" variant="default">
                <Link to="/skills">
                  {t.exploreSkills}
                  <svg
                    className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </Link>
              </Button>
              <Button asChild className="group" variant="outline">
                <a
                  href="https://senbon.ch/journal"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                  {t.readJournal}
                  <svg
                    className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* GitHub Contributions */}
      <motion.div
        className="mt-12 md:mt-16"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <GitHubContributions />
      </motion.div>
    </section>
  );
}

// Info Card Component for better organization
interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  delay: number;
}

function InfoCard({ icon, title, subtitle, delay }: InfoCardProps) {
  return (
    <motion.div
      className="hover:-translate-y-1 flex transform items-center gap-2 rounded-lg border border-border/30 bg-background/50 p-3 shadow-primary/5 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:bg-background/80 hover:shadow-sm sm:gap-3 sm:p-4"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary sm:h-10 sm:w-10">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-sm sm:text-base">{title}</h3>
        <p className="text-muted-foreground text-xs sm:text-sm">{subtitle}</p>
      </div>
    </motion.div>
  );
}
