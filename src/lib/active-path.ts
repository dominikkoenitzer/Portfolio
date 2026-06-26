/**
 * A nav link is active on its exact path AND on any sub-route nested under it,
 * so e.g. the "Projects" link stays highlighted on /projects/:slug. Home (`/`)
 * is never a nav link here, so the trailing-slash sub-route check is safe.
 */
export function isActivePath(pathname: string, targetId: string): boolean {
  return pathname === targetId || pathname.startsWith(`${targetId}/`);
}
