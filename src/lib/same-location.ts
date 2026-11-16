import { createPath, type Path, parsePath } from "react-router-dom";

/** True when `href` is the location already shown, where a `<Link>` replaces. */
export function isSameLocation(current: Partial<Path>, href: string): boolean {
  return createPath(current) === createPath(parsePath(href));
}
