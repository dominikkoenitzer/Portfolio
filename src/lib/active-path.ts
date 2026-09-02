/**
 * A nav link is active on its exact path AND on any sub-route nested under it,
 * so e.g. the "Projects" link stays highlighted on /projects/:slug. Home (`/`)
 * only ever matches exactly: `"//"` is never a prefix of a real path, so the
 * sub-route check cannot light it on every page.
 */
export function isActivePath(pathname: string, targetId: string): boolean {
  return pathname === targetId || pathname.startsWith(`${targetId}/`);
}
