import type { Translation } from "@/lib/translations";

/** A skills card, keyed by its heading in `translations.skills.categories`. */
export type SkillCategoryKey = keyof Translation["skills"]["categories"];

export interface SkillCategory {
  key: SkillCategoryKey;
  /**
   * How many of the leading skills wear the card's accent surface. The lists
   * are written most-used first, so the emphasis is the ordering signal: the
   * three chips a visitor should read are visibly the first three, and the
   * rest of the list reads as depth behind them. The spoken-languages card is
   * not in this list at all, because emphasising three of four languages would
   * be claiming a proficiency ranking the page never states.
   */
  lead: number;
  skills: string[];
}

/*
 * The chips on /skills. This is content, so it lives here rather than in the
 * section that renders it: the site search indexes the same list (through
 * `components/search/search-index.ts`) and a component module cannot be the
 * shared source of a constant without breaking Fast Refresh for the page.
 *
 * Categories are paired so adjacent cards sit at similar heights on the
 * two-column grid, and every skill name must match a key in
 * `components/sections/skill-icons.tsx` or the chip renders without a glyph.
 */
export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    key: "frontend",
    lead: 3,
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript (ES6+)",
      "Tailwind CSS",
      "shadcn/ui",
      "Radix UI",
      "Framer Motion",
      "Figma",
      "Lighthouse",
    ],
  },
  {
    key: "backend",
    lead: 3,
    skills: [
      "Java",
      "Kotlin",
      "Rust",
      "Node.js",
      "Bun",
      "Spring Framework",
      "Python",
      "C#",
      "C++",
      "GraphQL",
      "Bash",
    ],
  },
  {
    key: "devops",
    lead: 3,
    skills: [
      "Linux Server",
      "Ubuntu",
      "Windows Server",
      "NGINX",
      "Docker",
      "Vercel",
      "Jenkins",
      "Grafana",
      "Kali Linux",
      "Hardware Installation",
    ],
  },
  {
    key: "professional",
    lead: 3,
    skills: [
      "Communication",
      "Customer Service",
      "Project Management",
      "Direct Sales",
      "Social Media Outreach",
      "SEO Copywriting",
      "Video Editing",
    ],
  },
  {
    key: "databases",
    lead: 3,
    skills: ["PostgreSQL", "MongoDB", "Redis", "SQLite", "Git", "pnpm"],
  },
];
