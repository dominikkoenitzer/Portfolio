import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { Link } from "react-router-dom";
import { PORTFOLIO_PROJECTS } from "@/constants/projects";
import { SectionHeading } from "../layout/SectionHeading";

export default function ProjectsSection() {
  return (
    <section className="section-padding" id="projects">
      <SectionHeading
        subtitle="A focused collection of products built with clarity, consistency, and performance in mind."
        title="Projects"
      />

      <div className="space-y-5 sm:space-y-6">
        {PORTFOLIO_PROJECTS.map((project, index) => (
          <motion.article
            className="glass-deep group relative overflow-hidden rounded-2xl border border-border/30 bg-background/60 backdrop-blur-xl"
            initial={{ opacity: 0, y: 28 }}
            key={project.slug}
            transition={{
              duration: 0.55,
              delay: 0.06 + index * 0.09,
              ease: [0.22, 1, 0.36, 1],
            }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            {/* Top animated border */}
            <span className="absolute top-0 left-0 z-10 h-[2px] w-0 bg-gradient-to-r from-primary via-primary/70 to-primary/30 transition-all duration-700 group-hover:w-full" />

            {/* Large faded index number */}
            <span className="pointer-events-none absolute right-4 top-3 z-10 select-none font-bold font-mono text-6xl text-foreground/[0.04] sm:text-7xl">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div className="grid min-h-[300px] md:grid-cols-[1fr_1.15fr]">

              {/* Left visual panel */}
              <div className="shimmer-on-hover relative overflow-hidden border-b border-border/20 md:border-b-0 md:border-r">
                <div className={`absolute inset-0 ${project.toneClass}`} />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,_transparent_20%,_hsl(var(--foreground)/0.025)_50%,_transparent_80%)]" />
                <div className="absolute inset-0 opacity-40 [background:repeating-linear-gradient(135deg,transparent,transparent_22px,hsl(var(--foreground)/0.025)_22px,hsl(var(--foreground)/0.025)_23px)]" />

                <div className="relative flex h-full min-h-[220px] flex-col items-center justify-center px-8 py-10 text-center">
                  <h3 className="font-heading font-bold text-4xl tracking-tight sm:text-5xl">
                    {project.title}
                  </h3>
                  <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                    {project.tags.slice(0, 2).map((tag) => (
                      <span
                        className="rounded-full border border-border/40 bg-background/30 px-2.5 py-0.5 text-muted-foreground text-xs backdrop-blur-sm"
                        key={tag}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right content panel */}
              <div className="flex flex-col p-5 sm:p-6">
                <div className="mb-3.5 flex items-start justify-between gap-2 border-b border-border/25 pb-3.5">
                  <div>
                    <p className="font-semibold text-xl leading-tight">{project.title}</p>
                    <p className="mt-1 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/60">
                      {project.year}
                    </p>
                  </div>
                  <span className="rounded-full border border-border/40 bg-secondary/50 px-2.5 py-1 text-muted-foreground/70 text-xs backdrop-blur-sm">
                    {project.tags[0]}
                  </span>
                </div>

                <p className="mb-5 flex-1 text-muted-foreground text-sm leading-relaxed">
                  {project.description}
                </p>

                <div className="mt-auto grid grid-cols-3 gap-2 border-t border-border/25 pt-3.5">
                  <a
                    aria-label={`Open ${project.title} repository`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border/40 bg-secondary/50 px-3 py-2.5 font-medium text-xs backdrop-blur-sm transition-all duration-200 hover:border-border/70 hover:bg-secondary"
                    href={project.repoUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Github className="h-3.5 w-3.5" />
                    Source
                  </a>
                  <a
                    aria-label={`Open ${project.title} live site`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary/10 px-3 py-2.5 font-medium text-primary text-xs backdrop-blur-sm transition-all duration-200 hover:bg-primary/20 hover:shadow-[0_2px_12px_hsl(var(--primary)/0.2)]"
                    href={project.liveUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Live
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <Link
                    aria-label={`View details about ${project.title}`}
                    className="inline-flex items-center justify-center gap-1 rounded-xl border border-border/40 bg-background/60 px-3 py-2.5 font-medium text-primary text-xs backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:bg-primary/[0.06]"
                    to={`/projects/${project.slug}`}
                  >
                    Details
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
