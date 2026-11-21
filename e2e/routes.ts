import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Every route the browser gate visits, read from the same sources the sitemap
 * check reads: the route table and the project list. A route added there is
 * tested here without anyone remembering to list it.
 */

const read = (path: string) =>
  readFileSync(fileURLToPath(new URL(`../${path}`, import.meta.url)), "utf8");

const staticPaths = [
  ...read("src/components/AnimatedRoutes.tsx").matchAll(/path="([^"]+)"/g),
]
  .map((m) => m[1])
  .filter((p) => p !== "*" && !p.includes(":"));

const projectPaths = [
  ...read("src/constants/projects/index.ts").matchAll(/slug:\s*"([^"]+)"/g),
].map((m) => `/projects/${m[1]}`);

/** Each project's title by its path, since a slug can outlive the name. */
export const PROJECT_TITLES = new Map(
  [
    ...read("src/constants/projects/index.ts").matchAll(
      /slug:\s*"([^"]+)",\s*title:\s*"([^"]+)"/g,
    ),
  ].map((m) => [`/projects/${m[1]}`, m[2]]),
);

export interface RouteCase {
  path: string;
  status: number;
}

export const ROUTES: RouteCase[] = [
  ...staticPaths.map((path) => ({ path, status: 200 })),
  ...projectPaths.map((path) => ({ path, status: 200 })),
  // Any path without a file behind it gets the 404 page with a 404 status.
  { path: "/no-such-page", status: 404 },
  // A project slug with no project gets the same page at its own address.
  { path: "/projects/no-such-project", status: 404 },
];

if (
  staticPaths.length < 10 ||
  projectPaths.length < 15 ||
  PROJECT_TITLES.size !== projectPaths.length
) {
  throw new Error(
    `route discovery found ${staticPaths.length} pages, ${projectPaths.length} projects and ${PROJECT_TITLES.size} titles; the patterns no longer match the sources`,
  );
}

/** The pages the visual snapshots and the screenshot sheet cover. */
export const SHOT_ROUTES = [
  "/",
  "/about",
  "/projects",
  "/projects/entropy",
  "/contact",
  "/no-such-page",
];

export const SIZES = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
  { width: 2560, height: 1440 },
];

export const slugOf = (path: string) =>
  path === "/" ? "home" : path.slice(1).replaceAll("/", "-");
