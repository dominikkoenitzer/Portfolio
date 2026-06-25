import { FaWindows } from "react-icons/fa";
import {
  SiBun,
  SiCplusplus,
  SiCss,
  SiDotnet,
  SiElectron,
  SiFramer,
  SiJavascript,
  SiMarkdown,
  SiNextdotjs,
  SiNodedotjs,
  SiPwa,
  SiRadixui,
  SiReact,
  SiShadcnui,
  SiSharp,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiVercel,
  SiVite,
  SiWebgl,
} from "react-icons/si";

import type { LogoItem } from "./LogoLoop";

/**
 * Tech registry → LogoItem. Icons are monochrome (they inherit the LogoLoop's
 * currentColor) so they stay theme-safe. Used to build each project's own
 * tech-stack marquee from PROJECT_STACKS below.
 */
const TECH: Record<string, LogoItem> = {
  React: { node: <SiReact />, title: "React", href: "https://react.dev" },
  "Next.js": {
    node: <SiNextdotjs />,
    title: "Next.js",
    href: "https://nextjs.org",
  },
  TypeScript: {
    node: <SiTypescript />,
    title: "TypeScript",
    href: "https://www.typescriptlang.org",
  },
  JavaScript: {
    node: <SiJavascript />,
    title: "JavaScript",
    href: "https://developer.mozilla.org/docs/Web/JavaScript",
  },
  "Tailwind CSS": {
    node: <SiTailwindcss />,
    title: "Tailwind CSS",
    href: "https://tailwindcss.com",
  },
  CSS: {
    node: <SiCss />,
    title: "CSS",
    href: "https://developer.mozilla.org/docs/Web/CSS",
  },
  "Radix UI": {
    node: <SiRadixui />,
    title: "Radix UI",
    href: "https://www.radix-ui.com",
  },
  "shadcn/ui": {
    node: <SiShadcnui />,
    title: "shadcn/ui",
    href: "https://ui.shadcn.com",
  },
  "Framer Motion": {
    node: <SiFramer />,
    title: "Framer Motion",
    href: "https://www.framer.com/motion/",
  },
  Vite: { node: <SiVite />, title: "Vite", href: "https://vite.dev" },
  Bun: { node: <SiBun />, title: "Bun", href: "https://bun.sh" },
  Vercel: { node: <SiVercel />, title: "Vercel", href: "https://vercel.com" },
  WebGL: {
    node: <SiWebgl />,
    title: "WebGL",
    href: "https://www.khronos.org/webgl/",
  },
  "Three.js": {
    node: <SiThreedotjs />,
    title: "Three.js",
    href: "https://threejs.org",
  },
  Markdown: {
    node: <SiMarkdown />,
    title: "Markdown",
    href: "https://commonmark.org",
  },
  PWA: {
    node: <SiPwa />,
    title: "PWA",
    href: "https://web.dev/explore/progressive-web-apps",
  },
  "Node.js": {
    node: <SiNodedotjs />,
    title: "Node.js",
    href: "https://nodejs.org",
  },
  Electron: {
    node: <SiElectron />,
    title: "Electron",
    href: "https://www.electronjs.org",
  },
  "C++": {
    node: <SiCplusplus />,
    title: "C++",
    href: "https://isocpp.org",
  },
  "C#": {
    node: <SiSharp />,
    title: "C#",
    href: "https://learn.microsoft.com/dotnet/csharp/",
  },
  ".NET": {
    node: <SiDotnet />,
    title: ".NET",
    href: "https://dotnet.microsoft.com",
  },
  Windows: {
    node: <FaWindows />,
    title: "Windows",
    href: "https://www.microsoft.com/windows",
  },
};

/**
 * The real stack per project (slug → tech keys), derived from each repo's
 * languages, package.json, and topics — only the icon-able tech each one
 * actually uses. Keep these accurate to the repo.
 */
const PROJECT_STACKS: Record<string, string[]> = {
  zephyr: ["React", "JavaScript", "Tailwind CSS", "Radix UI", "Vite", "PWA"],
  portfolio: [
    "React",
    "TypeScript",
    "Vite",
    "Tailwind CSS",
    "Framer Motion",
    "Three.js",
    "Radix UI",
    "Bun",
    "Vercel",
  ],
  entropy: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Bun", "Vercel"],
  spectrum: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Bun", "Vercel"],
  remnants: ["TypeScript", "Electron", "Node.js"],
  time: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Radix UI",
    "shadcn/ui",
    "WebGL",
    "Bun",
  ],
  jester: ["C#", ".NET", "Windows"],
  flow: ["C++", "Windows"],
  punds: ["React", "TypeScript", "Vite", "Bun", "CSS"],
  senbon: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Radix UI",
    "Framer Motion",
    "Markdown",
    "Vercel",
  ],
};

/** The LogoLoop items for a given project's real stack. */
export function getProjectLogos(slug: string): LogoItem[] {
  return (PROJECT_STACKS[slug] ?? [])
    .map((key) => TECH[key])
    .filter((item): item is LogoItem => Boolean(item));
}
