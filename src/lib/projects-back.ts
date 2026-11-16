/**
 * Where a project page's back link goes. A card on the list passes the list's
 * search (`?type=desktop`) in router state, so the link returns to the list
 * as the visitor left it, the way the browser's Back does. Without that state
 * (a project opened from the site search or a shared link) it is the whole
 * list.
 */
export function projectsBackTarget(state: unknown): string {
  return typeof state === "string" && state.startsWith("?")
    ? `/projects${state}`
    : "/projects";
}
