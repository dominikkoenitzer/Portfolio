/**
 * The `<title>` a project detail page claims in search results.
 *
 * `project.title` on its own is a one-word product name ("Zephyr", "Flow"),
 * so every project page used to ship a title with no query surface at
 * all: nobody searches for "Zephyr". Each entry here appends the short, factual
 * description of what the thing actually is, which is also what the page
 * renders below the heading, so the title matches the page and adds the terms a
 * person would really type ("windows auto clicker", "ntp synced clock").
 *
 * Deliberately **not localized**, unlike the FAQ/HowTo copy next door. Helmet
 * appends its tags to the ones already in the served document, and
 * scripts/prerender.ts writes that document from English, so a localized title
 * would put two disagreeing `<title>` tags in the head of every non-English
 * visit. A language-neutral string agrees with the prerendered one in all four
 * languages, and only the English text is ever indexed anyway (one URL per
 * route, language switched client-side).
 *
 * Keep each value under ~40 characters: the site appends " | Dominik Könitzer"
 * (19), and Google truncates a desktop title at roughly 600px.
 */
const PROJECT_SEO_TITLES: Record<string, string> = {
  zephyr: "Zephyr, an offline to-do list and timer",
  portfolio: "Portfolio, a React and TypeScript site",
  entropy: "Entropy, a browser password generator",
  spectrum: "Spectrum, a browser color toolkit",
  remnants: "Remnants, a telemetry-free VS Code fork",
  time: "Time, an NTP-synced web clock",
  jester: "Jester, a tabbed Windows notepad",
  flow: "Flow, a Windows macro and auto-clicker",
  punds: "Punds, a 3D Lain-style link hub",
  senbon: "Senbon, a markdown digital garden",
  oxidize: "Oxidize, a thorough Windows uninstaller",
  inkling: "Inkling, a desktop study companion",
  mochi: "Mochi, a tiling window manager in Rust",
};

/**
 * Search title for one project page. Falls back to the bare project name so a
 * project added without an entry here still ships a valid title rather than
 * `undefined`.
 *
 * Called from both `ProjectDetails` (via `<SEO>`) and `scripts/prerender.ts`,
 * which is the point: the two must produce the same bytes.
 */
export const getProjectSeoTitle = (slug: string, fallback: string): string =>
  PROJECT_SEO_TITLES[slug] ?? fallback;

/**
 * Meta description for one project page.
 *
 * Prefers `description` over `tagline`. The taglines are one-line jokes written
 * for the page ("VS Code, minus the parts that talk back.", 40 characters) and
 * gave Google almost nothing to build a snippet from; `description` is the
 * 130 to 240 character factual paragraph, which is exactly the shape a meta
 * description wants.
 */
export const getProjectSeoDescription = (project: {
  description: string;
  tagline: string;
}): string => project.description || project.tagline;
