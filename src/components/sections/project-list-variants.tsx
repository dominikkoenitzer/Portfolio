import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { TechBadge } from "@/components/ui/tech-badge";
import { cardImageSrc, type PortfolioProject } from "@/constants/projects";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

/**
 * Two layouts of the project list under consideration (`?v=a`, `?v=c`; see
 * `lib/project-variant.ts`). Pictures are shown as they are.
 */

const isDesktop = (project: PortfolioProject) => project.platform === "desktop";

/** a: a numbered index, each row with a strip of the project's real pictures. */
export function ProjectIndexList({ projects }: { projects: PortfolioProject[] }) {
  const t = translations[useLanguage().language].projects;
  return (
    // Hovering one row lets the others step back; nothing moves.
    <ol className="divide-y divide-border/60 border-border/60 border-y [&:hover>li:not(:hover)]:opacity-40">
      {projects.map((project, index) => {
        const pictures = [project.image, ...(project.gallery ?? [])].filter(
          (src): src is string => Boolean(src),
        );
        return (
          <li className="transition-opacity duration-300 ease-out" key={project.slug}>
            <Link
              className="grid gap-5 py-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10"
              to={`/projects/${project.slug}?v=a`}
            >
              <div>
                <p className="accent-jp text-primary">{String(index + 1).padStart(2, "0")}</p>
                <h2 className="title-serif mt-1 font-bold text-2xl">{project.title}</h2>
                <p className="mt-1 text-muted-foreground text-sm">
                  {project.dateLabel} · {isDesktop(project) ? t.filterDesktop : t.filterWeb}
                </p>
                <p className="mt-3 text-foreground/85 text-sm leading-relaxed">{project.tagline}</p>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {pictures.slice(0, 4).map((src, position) => (
                  <div
                    className="w-64 shrink-0 rounded-2xl bg-secondary/50 p-2 sm:w-80"
                    key={src}
                  >
                    <img
                      alt=""
                      className="aspect-16/10 w-full rounded-xl object-cover object-top"
                      decoding="async"
                      loading="lazy"
                      src={position === 0 ? cardImageSrc(src) : src}
                    />
                  </div>
                ))}
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

/** c: a plain table, then a rail of thumbnails. */
export function ProjectTableList({ projects }: { projects: PortfolioProject[] }) {
  const t = translations[useLanguage().language].projects;
  return (
    <div>
      <table className="w-full text-left text-sm">
        <thead className="text-muted-foreground">
          <tr className="border-border/60 border-b">
            <th className="py-3 pr-4 font-medium" scope="col">Year</th>
            <th className="py-3 pr-4 font-medium" scope="col">Project</th>
            <th className="hidden py-3 pr-4 font-medium md:table-cell" scope="col">What it is</th>
            <th className="hidden py-3 pr-4 font-medium lg:table-cell" scope="col">Built with</th>
            <th className="py-3 font-medium" scope="col">
              <span className="sr-only">{t.details}</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {projects.map((project) => (
            <tr className="align-top" key={project.slug}>
              <td className="py-4 pr-4 text-muted-foreground tabular-nums">{project.year}</td>
              <td className="py-4 pr-4">
                <Link
                  className="title-serif text-base transition-colors duration-200 ease-out hover:text-primary"
                  to={`/projects/${project.slug}?v=c`}
                >
                  {project.title}
                </Link>
                <p className="mt-1 text-muted-foreground md:hidden">{project.tagline}</p>
              </td>
              <td className="hidden py-4 pr-4 text-foreground/85 leading-relaxed md:table-cell">
                {project.tagline}
              </td>
              <td className="hidden py-4 pr-4 lg:table-cell">
                <span className="flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 3).map((tag) => (
                    <TechBadge key={tag} name={tag} />
                  ))}
                </span>
              </td>
              <td className="py-4 text-right">
                <Link
                  aria-label={t.viewDetails.replace("{name}", project.title)}
                  className="inline-flex text-muted-foreground transition-colors duration-200 ease-out hover:text-primary"
                  to={`/projects/${project.slug}?v=c`}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-12 flex gap-4 overflow-x-auto pb-2">
        {projects.map((project) =>
          project.image ? (
            <Link
              className="w-48 shrink-0 overflow-hidden rounded-xl ring-1 ring-border/60 transition-shadow duration-200 ease-out hover:ring-primary/40"
              key={project.slug}
              to={`/projects/${project.slug}?v=c`}
            >
              <img
                alt={`${project.title} screenshot`}
                className="aspect-16/10 w-full object-cover object-top"
                decoding="async"
                loading="lazy"
                src={cardImageSrc(project.image)}
              />
            </Link>
          ) : null,
        )}
      </div>
    </div>
  );
}
