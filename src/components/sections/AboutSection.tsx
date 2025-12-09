import { motion } from "framer-motion";
import { Award, GraduationCap } from "lucide-react";
import { fadeInLeft, fadeInRight } from "@/lib/framer-animations";
import { SectionHeading } from "../layout/SectionHeading";
import { Button } from "../ui/button";
import GitHubContributions from "./GitHubContributions";

export default function AboutSection() {
  return (
    <section className="section-padding" id="about">
      <SectionHeading
        subtitle="Get to know me better and what drives my passion for web development."
        title="About Me"
      />

      <div className="grid items-center gap-8 md:grid-cols-12 md:gap-10">
        <motion.div className="md:col-span-5 lg:col-span-5" {...fadeInLeft}>
          <div className="relative mx-auto max-w-xs md:max-w-none">
            <div className="aspect-square overflow-hidden rounded-2xl bg-background/80 shadow-lg">
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                <motion.div
                  animate={{ opacity: 1, scale: 1 }}
                  aria-label="Dominik Könitzer - Software Engineer"
                  className="flex h-3/4 w-3/4 items-center justify-center rounded-xl bg-primary/5 font-semibold text-4xl text-primary/80 tracking-tight"
                  initial={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <span aria-hidden="true">DK</span>
                </motion.div>
              </div>
            </div>
            <motion.div
              animate={{ opacity: 1, x: 0, y: 0 }}
              className="-bottom-4 -right-4 -z-10 absolute h-24 w-24 rounded-xl border border-primary/10 bg-primary/5 backdrop-blur-sm"
              initial={{ opacity: 0, x: 20, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <motion.div
              animate={{ opacity: 1, x: 0, y: 0 }}
              className="-top-4 -left-4 -z-10 absolute h-24 w-24 rounded-xl border border-primary/10"
              initial={{ opacity: 0, x: -20, y: -20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>

          <div className="mt-8 space-y-4 md:mt-10 md:space-y-6">
            <InfoCard
              delay={0.1}
              icon={<GraduationCap className="h-5 w-5" />}
              subtitle="4-year program at WISS"
              title="Education"
            />

            <InfoCard
              delay={0.2}
              icon={<Award className="h-5 w-5" />}
              subtitle="Modern Web Development"
              title="Specialized In"
            />
          </div>
        </motion.div>

        <motion.div className="md:col-span-7 lg:col-span-7" {...fadeInRight}>
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
              Passionate{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Software Engineer
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
                I'm Dominik Könitzer, a 17-year-old software engineer at WISS
                Schulen für Wirtschaft Informatik Immobilien, currently in my{" "}
                <span className="font-medium text-foreground">fifth</span>{" "}
                semester of a 4-year software engineering program.
              </motion.p>

              <motion.p
                className="text-muted-foreground text-sm leading-relaxed sm:text-base"
                initial={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                The first two years of my program focus on coursework, followed
                by two years of practical internship with ongoing studies.
                Throughout this journey, I'm developing a strong foundation in
                both theoretical knowledge and hands-on experience.
              </motion.p>

              <motion.p
                className="text-muted-foreground text-sm leading-relaxed sm:text-base"
                initial={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                I enjoy creating{" "}
                <span className="font-medium text-foreground">clean</span>,{" "}
                <span className="font-medium text-foreground">functional</span>,
                and{" "}
                <span className="font-medium text-foreground">
                  visually appealing
                </span>{" "}
                websites and applications that provide real value to users.
                Beyond technical skills, I value continuous learning,
                problem-solving, and effective communication.
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
                <a href="/skills">
                  Explore my skills
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
                </a>
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
                  Read my journal
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
        <h4 className="font-medium text-sm sm:text-base">{title}</h4>
        <p className="text-muted-foreground text-xs sm:text-sm">{subtitle}</p>
      </div>
    </motion.div>
  );
}
