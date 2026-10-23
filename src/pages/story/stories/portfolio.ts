import type { Story } from "../types";

// Verbatim from scripts/prerender.ts, the error message trimmed.
const ROUTE_CHECK = `const covered = new Set(pages.map((p) => p.route));
const uncovered = [...routerSrc.matchAll(/path="([^"]+)"/g)]
  .map((m) => m[1])
  .filter((p) => p !== "*" && !p.includes(":") && !covered.has(p));

if (uncovered.length > 0) {
  // …
  process.exit(1);
}`;

/** The Portfolio, the site itself, told around its decisions. */
export const story: Story = {
  lead: "The site you are reading: my portfolio, in four languages, built with React, TypeScript and Vite.",
  hero: {
    name: "portfolio-hero",
    width: 3200,
    height: 2000,
    alt: "The home page of the portfolio: the name Dominik in violet on a cream page, under an aurora in violet, sage and blush",
    caption: "The home page, under the aurora in the light theme's violet, sage and blush.",
  },
  opening: [
    "Most portfolios are a template with a new name in it. I wanted mine to be the work sample, so the parts that make it work are my own: the language layer, the prerender step, the overlays and the visual system.",
    "It runs in English, German, French and Chinese. The project pages are written in English.",
  ],
  sections: [
    {
      id: "files",
      heading: "A real file behind every URL",
      blocks: [
        "As a single-page app, every URL first served the same index.html, with the home page's title and preview image. Link previews do not run JavaScript, so a project shared in a chat showed up as the home page.",
        "After the build, a prerender script now writes one HTML file per route, 24 of them, each with its own title, canonical, preview image and JSON-LD. Anything without a file gets 404.html with a real 404 status.",
        {
          code: {
            file: "scripts/prerender.ts",
            text: ROUTE_CHECK,
            caption: "The build reads the router's own paths and stops if one of them has no prerendered file behind it.",
          },
        },
      ],
    },
    {
      id: "languages",
      heading: "Four languages and no i18n library",
      blocks: [
        "Each language is one module, typed against the English one. English ships in the bundle; the other three are fetched when a visitor picks them, and nothing renders until that language has arrived, so no component can read a string that is not there yet.",
        "The types catch a missing key while I write. The translation tests check every language for what types cannot see:",
        {
          points: [
            { term: "Lists", text: "Every list exactly as long as the English one." },
            { term: "Blanks", text: "No empty strings anywhere." },
            { term: "Placeholders", text: "No TODO, TBD, FIXME or Lorem ipsum left over." },
            { term: "Copies", text: "Fails when half or more of the strings match English exactly." },
          ],
        },
      ],
    },
    {
      id: "barrel",
      heading: "One convenient import undid the code splitting",
      blocks: [
        "Every page except the home page is lazy loaded, so a visitor should only pay for the page they open. The pages imported their sections through a barrel file, and that made every section, the whole project catalogue in four languages with it, part of the entry chunk: 281 kB more, 113 kB of it after gzip.",
        "Sections are now imported by their module path, and the barrel is no longer imported anywhere.",
      ],
    },
    {
      id: "decoration",
      heading: "One pass took the decoration off",
      blocks: [
        "I took every decorative effect off the site at once: glow shadows, glass surfaces, gradient text, shimmer, parallax and count-up numbers. What stayed is one fade per block, hovers that only change colour, the custom cursor and the aurora, a WebGL shader that loads off the critical path.",
        "Two three.js scenes survived, the tree on the services page and the sphere of logos on /skills. They are the only reason three.js is in the build.",
        {
          pair: [
            {
              name: "portfolio-projects",
              width: 3200,
              height: 2000,
              crop: [0.13, 0.08, 0.87, 1],
              alt: "The projects page: its title, a short note, the search field with the web and desktop filter and the sort order, and the first project card",
            },
            {
              name: "portfolio-skills",
              width: 3200,
              height: 2000,
              crop: [0.21, 0.2, 0.79, 0.927],
              alt: "The skills page: the logos of the tools I work with, arranged on a sphere",
            },
          ],
          caption: "The projects page after the pass, and the sphere of logos on /skills, one of the two scenes that stayed.",
        },
      ],
    },
    {
      id: "overlays",
      heading: "Overlays that can be open at the same time",
      blocks: [
        "Four things can cover the page: the menu, the search palette, the project lightbox and the CV preview. Each used to lock scrolling on its own, so with two open, the second saved a scroll position of 0 and closing them out of order dropped the visitor at the top.",
        "Now one counter and one saved position serve all four. Escape closes only the top overlay on a small stack, and the stack has tests for overlays that close out of order.",
      ],
    },
  ],
};
