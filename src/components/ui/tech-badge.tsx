import {
  Accessibility,
  AppWindow,
  Blocks,
  BookOpen,
  Braces,
  Brain,
  Brush,
  Clock,
  Code,
  Cpu,
  Database,
  FlaskConical,
  Globe,
  GraduationCap,
  KeyRound,
  Languages,
  LayoutTemplate,
  Lightbulb,
  Monitor,
  Network,
  NotebookPen,
  Palette,
  PanelsTopLeft,
  Rocket,
  Search,
  ShieldCheck,
  Speech,
  Terminal,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";
import { FaWindows } from "react-icons/fa";
import {
  SiCplusplus,
  SiDotnet,
  SiElectron,
  SiMarkdown,
  SiNextdotjs,
  SiPwa,
  SiRadixui,
  SiReact,
  SiRust,
  SiSharp,
  SiSqlite,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiVite,
  SiVscodium,
} from "react-icons/si";
import { getSkillIcon, hasSkillIcon } from "@/components/sections/skill-icons";
import { cn } from "@/lib/utils";
import { Badge, type BadgeProps } from "./badge";

type Tech = {
  /** The mark. Brand marks carry their brand colour, like on /skills. */
  icon: ReactNode;
  /** The tool's own home page, for the tech-stack loop. Concepts have none. */
  href?: string;
};

/**
 * Every tech and topic a project names, with its mark. Brand logos come from
 * simple-icons in their brand colour, black-and-white marks inherit
 * `currentColor`, and topics without a logo (CLI, Systems, Privacy) get a
 * lucide glyph that says what they are. Anything named on /skills resolves to
 * the same icon it has there, so a tech looks the same everywhere on the site.
 */
const TECH: Record<string, Tech> = {
  React: { icon: <SiReact color="#61DAFB" />, href: "https://react.dev" },
  "React 19": { icon: <SiReact color="#61DAFB" />, href: "https://react.dev" },
  "Next.js": { icon: <SiNextdotjs />, href: "https://nextjs.org" },
  TypeScript: {
    icon: <SiTypescript color="#3B86D1" />,
    href: "https://www.typescriptlang.org",
  },
  "Tailwind CSS": {
    icon: <SiTailwindcss color="#38BDF8" />,
    href: "https://tailwindcss.com",
  },
  "Radix UI": { icon: <SiRadixui />, href: "https://www.radix-ui.com" },
  Vite: { icon: <SiVite color="#9D7BFF" />, href: "https://vite.dev" },
  PWA: {
    icon: <SiPwa color="#7B61FF" />,
    href: "https://web.dev/explore/progressive-web-apps",
  },
  "Three.js": { icon: <SiThreedotjs />, href: "https://threejs.org" },
  Electron: {
    icon: <SiElectron color="#47848F" />,
    href: "https://www.electronjs.org",
  },
  SQLite: { icon: <SiSqlite color="#3F9FD6" />, href: "https://sqlite.org" },
  Markdown: { icon: <SiMarkdown />, href: "https://commonmark.org" },
  Rust: { icon: <SiRust />, href: "https://www.rust-lang.org" },
  "C#": {
    icon: <SiSharp color="#A074C4" />,
    href: "https://learn.microsoft.com/dotnet/csharp/",
  },
  "C++": { icon: <SiCplusplus color="#0086D4" />, href: "https://isocpp.org" },
  ".NET 9": {
    icon: <SiDotnet color="#8A6FE8" />,
    href: "https://dotnet.microsoft.com",
  },
  WPF: {
    icon: <PanelsTopLeft />,
    href: "https://learn.microsoft.com/dotnet/desktop/wpf/",
  },
  Windows: {
    icon: <FaWindows color="#2F8FE0" />,
    href: "https://www.microsoft.com/windows",
  },
  Win32: {
    icon: <FaWindows color="#2F8FE0" />,
    href: "https://learn.microsoft.com/windows/win32/",
  },
  "VS Code": { icon: <SiVscodium color="#2F80ED" />, href: "https://code.visualstudio.com" },
  egui: { icon: <AppWindow />, href: "https://www.egui.rs" },
  "GDI+": { icon: <Brush /> },
  CLI: { icon: <Terminal /> },
  Systems: { icon: <Cpu /> },
  Automation: { icon: <Workflow /> },
  "Low-latency": { icon: <Zap /> },
  Accessibility: { icon: <Accessibility /> },
  Color: { icon: <Palette /> },
  CRT: { icon: <Monitor /> },
  FSRS: { icon: <Brain /> },
  Intl: { icon: <Globe /> },
  Journal: { icon: <NotebookPen /> },
  NTP: { icon: <Clock /> },
  Privacy: { icon: <ShieldCheck /> },
  SEO: { icon: <Search /> },
  Security: { icon: <ShieldCheck /> },
  "Web Crypto": { icon: <KeyRound /> },
  // The Experience page: the skills and subjects a role or a school stood for.
  "CI/CD": { icon: <Rocket /> },
  "Software Development": { icon: <Code /> },
  "Application Design": { icon: <LayoutTemplate /> },
  Databases: { icon: <Database /> },
  "System Architecture": { icon: <Network /> },
  Programming: { icon: <Braces /> },
  STEM: { icon: <FlaskConical /> },
  "Analytical Thinking": { icon: <Lightbulb /> },
  "Independent Learning": { icon: <BookOpen /> },
  "International Curriculum": { icon: <GraduationCap /> },
  Intercultural: { icon: <Users /> },
  Languages: { icon: <Languages /> },
  "International Education": { icon: <Globe /> },
  Foundations: { icon: <Blocks /> },
  Multilingual: { icon: <Speech /> },
};

/** The mark for a tech or topic name, or null when there is none. */
export function getTechIcon(name: string): ReactNode {
  if (hasSkillIcon(name)) return getSkillIcon(name);
  return TECH[name]?.icon ?? null;
}

/** The tool's home page, for names that are a real product. */
export function getTechHref(name: string): string | undefined {
  return TECH[name]?.href;
}

/**
 * Sizes any mark to the text beside it. react-icons and lucide both write
 * width and height attributes; the CSS size wins over those.
 */
export function TechIcon({
  className,
  name,
}: {
  className?: string;
  name: string;
}) {
  const icon = getTechIcon(name);
  if (!icon) return null;
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center [&>svg]:h-full [&>svg]:w-full",
        className ?? "h-3.5 w-3.5",
      )}
    >
      {icon}
    </span>
  );
}

/** A tag pill with the tech's mark in front of its name. */
export function TechBadge({
  className,
  name,
  ...props
}: Omit<BadgeProps, "children"> & { name: string }) {
  return (
    <Badge className={cn("gap-1.5", className)} {...props}>
      <TechIcon name={name} />
      {name}
    </Badge>
  );
}
