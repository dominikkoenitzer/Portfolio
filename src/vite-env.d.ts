/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Where /diag posts a report. Unset: the panel measures but sends nothing. */
  readonly VITE_DIAG_ENDPOINT?: string;
  /** Set by the host on every build; names the release in a report. */
  readonly VITE_VERCEL_GIT_COMMIT_SHA?: string;
}
