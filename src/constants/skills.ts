import type { Translation } from "@/lib/translations";

/** A skills card, keyed by its heading in `translations.skills.categories`. */
export type SkillCategoryKey = keyof Translation["skills"]["categories"];

export interface SkillCategory {
  key: SkillCategoryKey;
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
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript (ES6+)",
      "Tailwind CSS",
      "shadcn/ui",
      "Radix UI",
      "Framer Motion",
    ],
  },
  {
    key: "backend",
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
    ],
  },
  {
    key: "devops",
    skills: [
      "NGINX",
      "Docker",
      "Vercel",
      "Jenkins",
      "Grafana",
      "Bash",
    ],
  },
  {
    key: "professional",
    skills: [
      "Communication",
      "Project Management",
      "Direct Sales",
      "Social Media Outreach",
    ],
  },
  {
    key: "databases",
    skills: ["PostgreSQL", "MongoDB", "Redis", "SQLite", "Git", "pnpm", "Figma", "Lighthouse"],
  },
];
