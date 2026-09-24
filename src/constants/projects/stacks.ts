/**
 * What each project is actually built with, by skill name. Kept apart from the
 * case studies on purpose: /skills counts projects per skill from this, and
 * importing the catalogue there would pull every case study in four languages
 * into that page.
 *
 * Read from each repository's own manifests and lockfiles, not from the card
 * tags, which are a short display list. Every name must match a chip in
 * `constants/skills.ts` exactly; the project tests enforce it.
 */
export const PROJECT_STACKS: Record<string, readonly string[]> = {
  zephyr: ["React", "JavaScript (ES6+)", "Tailwind CSS", "shadcn/ui", "Radix UI", "Framer Motion", "Bun", "Vercel"],
  portfolio: ["React", "TypeScript", "Tailwind CSS", "shadcn/ui", "Radix UI", "Framer Motion", "Node.js", "Bun", "Vercel", "PostgreSQL"],
  entropy: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Bun", "Vercel"],
  spectrum: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Bun", "Vercel"],
  remnants: ["TypeScript", "Node.js"],
  time: ["React", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Radix UI", "Bun", "Vercel"],
  jester: ["C#"],
  flow: ["C++"],
  punds: ["React", "TypeScript", "Bun", "Vercel"],
  senbon: ["React", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Bun", "Vercel", "PostgreSQL"],
  oxidize: ["Rust"],
  inkling: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Bun", "SQLite"],
  mochi: ["Rust"],
};

/** How many projects use each skill. Skills no project uses are absent. */
export const countProjectsBySkill = (): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const stack of Object.values(PROJECT_STACKS)) {
    for (const skill of stack) {
      counts.set(skill, (counts.get(skill) ?? 0) + 1);
    }
  }
  return counts;
};
