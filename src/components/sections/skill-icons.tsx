import {
  Clapperboard,
  Cpu,
  Handshake,
  Headphones,
  ListChecks,
  Megaphone,
  MessagesSquare,
  Search,
  Server,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  SiBun,
  SiCplusplus,
  SiDocker,
  SiFigma,
  SiFramer,
  SiGit,
  SiGnubash,
  SiGrafana,
  SiGraphql,
  SiJavascript,
  SiJenkins,
  SiKalilinux,
  SiKotlin,
  SiLighthouse,
  SiLinux,
  SiMongodb,
  SiNextdotjs,
  SiNginx,
  SiNodedotjs,
  SiOpenjdk,
  SiPnpm,
  SiPostgresql,
  SiPython,
  SiRadixui,
  SiReact,
  SiRedis,
  SiRust,
  SiSharp,
  SiShadcnui,
  SiSpring,
  SiSqlite,
  SiTailwindcss,
  SiTypescript,
  SiUbuntu,
  SiVercel,
} from "react-icons/si";

const S = 18;

/**
 * Per-skill icon. Tech gets its brand colour; black/white marks (Next.js,
 * Vercel, Radix, Rust, Bun, Linux, …) and the soft-skill lucide icons inherit
 * `currentColor` so they stay legible across all four themes. Spoken languages
 * use flags.
 */
const SKILL_ICONS: Record<string, ReactNode> = {
  // Frontend
  React: <SiReact color="#61DAFB" size={S} />,
  "Next.js": <SiNextdotjs size={S} />,
  TypeScript: <SiTypescript color="#3B86D1" size={S} />,
  "JavaScript (ES6+)": <SiJavascript color="#F7DF1E" size={S} />,
  "Tailwind CSS": <SiTailwindcss color="#38BDF8" size={S} />,
  "shadcn/ui": <SiShadcnui size={S} />,
  "Radix UI": <SiRadixui size={S} />,
  "Framer Motion": <SiFramer color="#1466FF" size={S} />,
  Figma: <SiFigma color="#F24E1E" size={S} />,
  Lighthouse: <SiLighthouse color="#F44B21" size={S} />,

  // Backend
  Java: <SiOpenjdk color="#ED8B00" size={S} />,
  Kotlin: <SiKotlin color="#7F52FF" size={S} />,
  Rust: <SiRust size={S} />,
  "Node.js": <SiNodedotjs color="#5FA04E" size={S} />,
  Bun: <SiBun size={S} />,
  "Spring Framework": <SiSpring color="#6DB33F" size={S} />,
  Python: <SiPython color="#4B8BBE" size={S} />,
  "C#": <SiSharp color="#A074C4" size={S} />,
  "C++": <SiCplusplus color="#0086D4" size={S} />,
  GraphQL: <SiGraphql color="#E535AB" size={S} />,
  Bash: <SiGnubash color="#5AB552" size={S} />,

  // Infrastructure
  "Linux Server": <SiLinux size={S} />,
  Ubuntu: <SiUbuntu color="#E95420" size={S} />,
  "Windows Server": <Server size={S} />,
  NGINX: <SiNginx color="#009639" size={S} />,
  Docker: <SiDocker color="#2496ED" size={S} />,
  Vercel: <SiVercel size={S} />,
  Jenkins: <SiJenkins color="#E0584B" size={S} />,
  Grafana: <SiGrafana color="#F46800" size={S} />,
  "Kali Linux": <SiKalilinux size={S} />,
  "Hardware Installation": <Cpu size={S} />,

  // Data & Tooling
  PostgreSQL: <SiPostgresql color="#5A8DD6" size={S} />,
  MongoDB: <SiMongodb color="#4DB33D" size={S} />,
  Redis: <SiRedis color="#FF5A4D" size={S} />,
  SQLite: <SiSqlite size={S} />,
  Git: <SiGit color="#F05032" size={S} />,
  pnpm: <SiPnpm color="#F69220" size={S} />,

  // Professional (soft skills) — themed lucide marks
  "Customer Service": <Headphones size={S} />,
  Communication: <MessagesSquare size={S} />,
  "Project Management": <ListChecks size={S} />,
  "Direct Sales": <Handshake size={S} />,
  "Social Media Outreach": <Megaphone size={S} />,
  "SEO Copywriting": <Search size={S} />,
  "Video Editing": <Clapperboard size={S} />,

  // Spoken languages — flags
  english: <span className="text-[1.05rem] leading-none">🇬🇧</span>,
  german: <span className="text-[1.05rem] leading-none">🇩🇪</span>,
  chinese: <span className="text-[1.05rem] leading-none">🇨🇳</span>,
  french: <span className="text-[1.05rem] leading-none">🇫🇷</span>,
};

export function getSkillIcon(key: string): ReactNode {
  return SKILL_ICONS[key] ?? <Sparkles size={S} />;
}
