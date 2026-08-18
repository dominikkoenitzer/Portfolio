import type { Group3 } from "./theme";

/**
 * Where the sapling grows, in design space. The handoff prototype fixed these
 * positions by eye, so they are data rather than anything derived — keeping
 * them here means the geometry can be adjusted without opening the renderer.
 */

// ── Design-space layout (handoff spec) ──────────────────────────────────────
export const ROOT: [number, number, number] = [0, -3.25, 0];
export const FORK: [number, number, number] = [0, -1.3, 0];
export const CATS: Group3[] = ["build", "protect", "grow"];
export const HUBS: Record<Group3, [number, number, number]> = {
  build: [-2.3, 0.3, 0.5],
  protect: [0.2, 1.7, -1.3],
  grow: [2.4, 0.1, 0.8],
};
// Three leaf slots per bough, filled in service order (handoff positions).
export const LEAVES: Record<Group3, [number, number, number][]> = {
  build: [
    [-4.0, 1.4, 1.0],
    [-3.7, -0.5, -0.4],
    [-2.7, 1.8, -0.9],
  ],
  protect: [
    [-0.9, 3.0, -1.6],
    [1.6, 2.8, -2.0],
    [0.3, 2.5, -3.0],
  ],
  grow: [
    [4.1, 1.1, 1.4],
    [3.8, -0.9, 0.3],
    [3.0, 1.5, 2.2],
  ],
};
// Per-bough grow-in window (the main bough's draw-range reveal).
export const TIMING: Record<Group3, { t0: number; t1: number }> = {
  build: { t0: 0.45, t1: 1.05 },
  protect: { t0: 0.5, t1: 1.15 },
  grow: { t0: 0.55, t1: 1.2 },
};
