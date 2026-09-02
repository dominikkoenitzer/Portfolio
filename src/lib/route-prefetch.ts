import {
  chunkPathFor,
  ROUTE_CHUNKS,
  type RouteChunkPath,
} from "./route-chunks";

/**
 * Warming a lazy route chunk when the pointer or focus arrives on a link to
 * it, so the click has nothing left to download.
 *
 * Three guards keep it from being a tax rather than a saving: it fires once
 * per route, never before the first load has settled, and never on a
 * connection the visitor is paying for by the byte.
 */

/** Connection classes where an unrequested page is not ours to spend. */
const SLOW_TYPES = new Set(["slow-2g", "2g"]);

/** The slice of the Network Information API we act on. Absent in Safari and Firefox, hence optional throughout. */
export type ConnectionHint = {
  saveData?: boolean;
  effectiveType?: string;
};

export function allowsPrefetch(hint?: ConnectionHint | null): boolean {
  if (!hint) return true;
  if (hint.saveData) return false;
  return !SLOW_TYPES.has(hint.effectiveType ?? "");
}

function readConnection(): ConnectionHint | null {
  if (typeof navigator === "undefined") return null;
  const connection = (navigator as Navigator & { connection?: ConnectionHint })
    .connection;
  return connection ?? null;
}

export type PrefetchRegistry = {
  /** Open for business. Held back until the browser is idle. */
  arm: () => void;
  /** Warm the chunk behind an internal href, if there is one and it is new. */
  prefetch: (href: string) => void;
  /** Which routes have been warmed, for tests and for assertions. */
  warmed: () => RouteChunkPath[];
  reset: () => void;
};

export function createPrefetchRegistry(
  load: (path: RouteChunkPath) => Promise<unknown>,
  connection: () => ConnectionHint | null = readConnection,
): PrefetchRegistry {
  const warmed = new Set<RouteChunkPath>();
  let armed = false;

  return {
    arm: () => {
      armed = true;
    },
    prefetch: (href: string) => {
      if (!armed) return;
      const path = chunkPathFor(href);
      if (!path || warmed.has(path)) return;
      if (!allowsPrefetch(connection())) return;
      warmed.add(path);
      void Promise.resolve()
        .then(() => load(path))
        .catch(() => {
          // A failed warm-up is not the visitor's problem: forget it so the
          // click can retry through Suspense and report the failure there.
          warmed.delete(path);
        });
    },
    warmed: () => [...warmed],
    reset: () => {
      armed = false;
      warmed.clear();
    },
  };
}

/** The app's single registry, wired to the real route chunks. */
export const routePrefetch = createPrefetchRegistry((path) =>
  ROUTE_CHUNKS[path](),
);
