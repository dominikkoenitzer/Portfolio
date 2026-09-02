/**
 * The one import site per lazy route. `React.lazy` in AnimatedRoutes and the
 * prefetcher both read this map, so warming a route on hover can only ever
 * fetch the chunk the click is about to need: two independent `import()`
 * calls for the same page would be two places to forget.
 *
 * Home is absent on purpose. It ships in the entry chunk, so there is nothing
 * to warm.
 */
export const ROUTE_CHUNKS = {
  "/about": () => import("@/pages/About"),
  "/experience": () => import("@/pages/Experience"),
  "/skills": () => import("@/pages/Skills"),
  "/projects": () => import("@/pages/Projects"),
  "/projects/:projectSlug": () => import("@/pages/ProjectDetails"),
  "/services": () => import("@/pages/Services"),
  "/contact": () => import("@/pages/Contact"),
  "/donate": () => import("@/pages/Donate"),
  "/privacy": () => import("@/pages/Privacy"),
} as const;

export type RouteChunkPath = keyof typeof ROUTE_CHUNKS;

const CHUNK_PATHS = Object.keys(ROUTE_CHUNKS) as RouteChunkPath[];

/**
 * The chunk an internal href resolves to, or `undefined` for anything with no
 * chunk of its own: an off-site link, a mailto, a hash, Home, or a path no
 * route matches (which lands on NotFound and is not worth warming).
 */
export function chunkPathFor(href: string): RouteChunkPath | undefined {
  if (!href.startsWith("/") || href.startsWith("//")) return undefined;

  const path = href.split(/[?#]/)[0].replace(/\/+$/, "");
  if (!path) return undefined;
  const segments = path.slice(1).split("/");

  return CHUNK_PATHS.find((candidate) => {
    const parts = candidate.slice(1).split("/");
    if (parts.length !== segments.length) return false;
    return parts.every((part, index) =>
      part.startsWith(":") ? segments[index].length > 0 : part === segments[index],
    );
  });
}
