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
  return (
    <div className="relative overflow-hidden text-foreground/75 [-webkit-mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)] [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
      <LogoLoop
        ariaLabel={`${project.title} tech stack`}
        gap={48}
        logoHeight={28}
        logos={logos}
        pauseOnHover
        scaleOnHover
        speed={34}
      />
    </div>
  );
}
