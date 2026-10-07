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
  mochi: "Mochi, a Windows tiling window manager",
  daifuku: "Daifuku, a Windows AI agent fleet tool",
  psyche: "Psyche, a 2FA authenticator for Windows",
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
 * The snippet a project page offers Google, cut from the page's own
 * `description` to fit under the ~155 characters Google shows before it
 * truncates. Language-neutral for the same reason as the titles above.
 */
const PROJECT_SEO_DESCRIPTIONS: Record<string, string> = {
  zephyr:
    "Zephyr is a local-first to-do list and Pomodoro focus timer in one place. No login, no backend, and nothing you enter ever leaves your browser.",
  portfolio:
    "My personal portfolio: a fast React single-page app in four languages, with a prerendered HTML file per route and structured data on every page.",
  entropy:
    "A password generator and analyzer that runs entirely in the browser, with Web Crypto randomness and crack times for five attacker models.",
  spectrum:
    "A client-side color toolkit: pull colors out of an image, build gradients and palettes, check WCAG contrast and simulate color blindness.",
  remnants:
    "My build of Code - OSS for Windows, macOS and Linux, with Copilot, chat, agents, telemetry and sign-in cut out and the editor fully intact.",
  time: "An NTP-synced web clock, accurate to hundredths of a second: the time, date, ISO week and timezone on one bare screen, with nothing to press.",
  jester:
    "A native Windows notepad with tabs, line numbers, find-in-files and PDF export, all in one portable Jester.exe with no installer.",
  flow: "A C++17 Windows app that records mouse and keyboard macros, replays them with sub-10 ms timing and runs a fast auto-clicker. One exe, no install.",
  punds:
    "My one-page link hub, built as a navigable Three.js world in the style of Copland OS from Serial Experiments Lain. Drag to look, scroll to fly.",
  senbon:
    "My markdown journal: plain files with four frontmatter keys, rendered into an unhurried reading page, with no CMS and no third-party trackers.",
  oxidize:
    "A Windows uninstaller in Rust: it runs the program's own uninstaller, then removes leftover registry keys, files, services and tasks, backing each up.",
  inkling:
    "A desktop study companion for notes, tasks, flashcards and grades, kept in one SQLite file on your machine. A checkbox in a note becomes a task.",
  mochi:
    "A tiling window manager for Windows, written in Rust. It tiles real windows, binds its own keys, and puts the desktop back exactly as it found it.",
  daifuku:
    "Fleets of AI agent terminals on Windows: one key opens them in a grid, and each border shows if its agent works, waits for you, is done or failed.",
  psyche:
    "Two-factor codes on the Windows desktop: press Alt+P on any 2FA prompt and Psyche types the code for the site in front. No phone needed.",
};

/**
 * Meta description for one project page: the short snippet above, falling
 * back to `description` and then `tagline` for a project without one.
 */
export const getProjectSeoDescription = (project: {
  slug: string;
  description: string;
  tagline: string;
}): string =>
  PROJECT_SEO_DESCRIPTIONS[project.slug] ??
  (project.description || project.tagline);
