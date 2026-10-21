import type { Story } from "../types";

// From src/app/robots.ts: the rule for every crawler, with the comment's last
// line and the 21 named AI crawlers after it left out.
const ROBOTS_CODE = `const robots = (): MetadataRoute.Robots => ({
  rules: [
    // Search engines must be ALLOWED to crawl, or they never see the
    // noindex header/meta and index the bare URL from external links.
    // …
    { userAgent: "*", allow: "/" },
    // …
  ],
});`;

/** Senbon, a small project: how it stays unlisted, the files, the guestbook and what was taken out. */
export const story: Story = {
  lead: "My markdown journal and guestbook: plain files rendered into a quiet reading page, kept out of search engines on purpose.",
  hero: {
    name: "senbon-hero",
    width: 3200,
    height: 2000,
    alt: "Senbon's home page: the name in a large serif, a card to the journal and a card to the guestbook, on a warm background",
    caption: "The home page: the name and two cards, one to the journal and one to the guestbook.",
  },
  opening: [
    "I wanted somewhere to write that was not optimized to death. Every entry is a markdown file with four frontmatter keys, committed to the repo, and the site rebuilds when I push. Next.js and React Server Components turn those files into a reading page.",
  ],
  sections: [
    {
      id: "noindex",
      heading: "Search engines are let in so they can read the noindex",
      blocks: [
        "A robots.txt that disallows everything does the opposite of what it seems to: a crawler that may not fetch a page never sees its noindex, so the bare URL still gets indexed from any outside link.",
        "So every crawler may fetch, and every response carries an X-Robots-Tag header with noindex and six more directives like it. AI crawlers are the one group stopped at the door: 21 of them are named and disallowed.",
        {
          code: {
            file: "src/app/robots.ts",
            text: ROBOTS_CODE,
            caption: "Allow first, so the noindex gets read; the 21 AI crawlers named after it are each disallowed.",
          },
        },
      ],
    },
    {
      id: "files",
      heading: "A folder of markdown files is the whole database",
      blocks: [
        "Entries live in content/journal, one file each, and the slug is the filename. The loader parses the frontmatter, sorts newest first and is wrapped in React.cache, so a page that asks for the list twice reads the disk once.",
        "Markdown renders without a raw HTML step, so HTML written into a file never reaches the page.",
        {
          still: {
            name: "senbon-journal",
            width: 3200,
            height: 2000,
            crop: [0.29, 0.33, 0.71, 0.965],
            alt: "Senbon's journal index: three entries as cards, a month, two months and three months old, each with its title and excerpt",
            caption: "The journal index, newest first. Each card is one markdown file: its title, its excerpt and a relative date.",
          },
        },
      ],
    },
    {
      id: "guestbook",
      heading: "The guestbook checks a signature before it stores one",
      blocks: [
        "Signing is a server action, and the database is only ever reached from the server. Every check on the way is a pure function with its own unit tests.",
        {
          points: [
            { term: "Honeypot", text: "A hidden field; a bot that fills it is told it worked, and nothing is stored." },
            { term: "Invisible text", text: "Zero-width and bidirectional controls are stripped first." },
            { term: "Links", text: "Caught in their plain forms and spelled out, like spam dot com." },
            { term: "Slurs", text: "Short ones count only as whole words, since raccoon was once refused." },
            { term: "Rate limit", text: "One signature per visitor every 30 s, counted in the database under a hashed address." },
            { term: "Length", text: "40 for a name, 280 for a message, in the form, the action and the database." },
          ],
        },
      ],
    },
    {
      id: "subtraction",
      heading: "Things I built, measured and took back out",
      blocks: [
        "A command palette, full-text search, tag filters, pagination, a table of contents, reading-time estimates and a canvas background were all built and then deleted. Three routes do not need a launcher, and a few hundred words do not need a progress bar.",
        "Route changes once ran through a view transition. It needed a prerelease React build, and clicks stalled for seconds while the server answered in under 0.4 s, so I reverted it.",
      ],
    },
  ],
};
