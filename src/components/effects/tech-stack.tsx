import { ErrorBoundary } from "@/components/ErrorBoundary";
import type { PortfolioProject } from "@/constants/projects";
import { getTechHref, getTechIcon, TechIcon } from "@/components/ui/tech-badge";
import LogoLoop, { type LogoItem } from "./LogoLoop";

/**
 * Everything a project names, each once: the stack first (what it is built
 * with), then the tags (what it is about). This strip is the page's one list
 * of its tech, so topics without a website (CLI, Systems, Security) ride along
 * unlinked, and the tools link to their own sites.
 */
function getProjectLogos(project: PortfolioProject): LogoItem[] {
  const names = [...new Set([...project.stack, ...project.tags])];
  return names.flatMap((name) => {
    if (!getTechIcon(name)) return [];
    const href = getTechHref(name);
    return [
      {
        ariaLabel: name,
        ...(href ? { href } : {}),
        node: (
          <span className="inline-flex items-center gap-2.5">
            <TechIcon className="h-[1em] w-[1em]" name={name} />
            <span className="font-medium text-[0.55em]">{name}</span>
          </span>
        ),
        title: name,
      },
    ];
  });
}

/**
 * The project's tech stack as a slow, endless strip of logos, each linking to
 * the tool's own site. It pauses under the pointer and stands still for anyone
 * who asks for reduced motion. The edges fade through a mask rather than a
 * coloured overlay, so the strip sits on either theme without a seam.
 */
export function ProjectTechLoop({ project }: { project: PortfolioProject }) {
  const logos = getProjectLogos(project);
  if (logos.length === 0) return null;
  const label = `${project.title} tech stack`;
  return (
    <ErrorBoundary fallback={<StaticTechList label={label} logos={logos} />}>
      <div className="relative overflow-hidden text-foreground/75 [-webkit-mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)] [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
        <LogoLoop
          ariaLabel={label}
          gap={48}
          logoHeight={28}
          logos={logos}
          pauseOnHover
          scaleOnHover
          speed={34}
        />
      </div>
    </ErrorBoundary>
  );
}

/**
 * The same logos standing still and wrapped, for when the moving strip throws:
 * this is the page's only list of its tech, so it must not simply vanish.
 */
function StaticTechList({ label, logos }: { label: string; logos: LogoItem[] }) {
  return (
    <ul
      aria-label={label}
      className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-[28px] text-foreground/75"
    >
      {logos.map((item) => {
        const node = "node" in item ? item.node : null;
        return (
          <li key={item.title ?? item.ariaLabel}>
            {item.href ? (
              <a
                aria-label={item.ariaLabel ?? item.title}
                href={item.href}
                rel="noreferrer noopener"
                target="_blank"
              >
                <span aria-hidden="true">{node}</span>
              </a>
            ) : (
              node
            )}
          </li>
        );
      })}
    </ul>
  );
}
