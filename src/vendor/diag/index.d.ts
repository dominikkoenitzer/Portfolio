// Types for the vendored diagnostic panel (index.js). Only what this site
// calls is declared. The JavaScript next to this file is copied from its own
// repository by scripts/sync-diag.mjs and is not edited here.

export interface DiagOptions {
  app: string;
  release?: string;
  endpoint?: string;
  lang?: "en" | "de";
  quality?: () => unknown;
  stats?: () => unknown;
  canvas?: () => HTMLCanvasElement | null | undefined;
  capture?: () => Promise<HTMLCanvasElement | string>;
  durationMs?: number;
  onReport?: (report: unknown) => void;
  onClose?: () => void;
}

export function installDiag(): void;
export function wantsDiag(path?: string, loc?: Location): boolean;
export function mountPanel(options: DiagOptions): { close: () => void };
