import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
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
            className="glass-card group relative overflow-hidden rounded-2xl border border-border/40 bg-background/60 transition-all duration-300 hover:border-primary/35"
            initial={{ opacity: 0, y: 20 }}
            key={project.slug}
            transition={{
              duration: 0.4,
              delay: 0.08 + index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            viewport={{ once: true }}
            whileHover={{ y: -3, scale: 1.002 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <span
              className="absolute top-0 left-0 h-[2px] w-0 bg-primary/80 transition-all duration-500 group-hover:w-full"
            />

            <div className="grid min-h-[300px] md:grid-cols-[1.02fr_1fr]">
              <div className="relative overflow-hidden border-border/30 border-b md:border-r md:border-b-0">
                <div className={`absolute inset-0 ${project.toneClass}`} />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,_transparent_20%,_hsl(var(--foreground)/0.03)_50%,_transparent_80%)]" />
                <div className="absolute inset-0 opacity-50 [background:repeating-linear-gradient(135deg,transparent,transparent_18px,hsl(var(--foreground)/0.03)_18px,hsl(var(--foreground)/0.03)_19px)]" />

                <div className="relative flex h-full min-h-[220px] flex-col items-center justify-center px-6 py-10 text-center sm:px-8">
                  <h3 className="font-heading font-semibold text-4xl tracking-tight sm:text-[2.9rem]">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-muted-foreground text-sm">
                    {project.tags[0]} project
                  </p>
                </div>
              </div>

              <div className="flex flex-col p-5 sm:p-6">
                <div className="mb-4 flex items-start justify-between gap-3 border-border/35 border-b pb-3">
                  <div>
                    <p className="font-semibold text-xl leading-tight">{project.title}</p>
                    <p className="mt-1 text-muted-foreground text-xs uppercase tracking-wide">
                      {project.year} - Present
                    </p>
                  </div>
                </div>

                <p className="mb-4 text-muted-foreground text-sm leading-relaxed">
                  {project.description}
                </p>

                <div className="mb-5 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      className="rounded-full border border-border/50 bg-background/70 px-2.5 py-1 text-foreground/80 text-xs"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto grid grid-cols-3 gap-2 border-border/40 border-t pt-3">
                  <a
                    aria-label={`Open ${project.title} repository`}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-secondary/70 px-3 py-2 font-medium text-sm transition-colors hover:bg-secondary"
                    href={project.repoUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Github className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    Source
                  </a>
                  <a
                    aria-label={`Open ${project.title} live site`}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-primary/10 px-3 py-2 font-medium text-primary text-sm transition-colors hover:bg-primary/20"
                    href={project.liveUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Live
                    <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                  <Link
                    aria-label={`View details about ${project.title}`}
                    className="inline-flex items-center justify-center rounded-md border border-border/60 bg-background/80 px-3 py-2 font-medium text-primary text-sm transition-colors hover:border-primary/30 hover:bg-background"
                    to={`/projects/${project.slug}`}
                  >
                    Learn more
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
