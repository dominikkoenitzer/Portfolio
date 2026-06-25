import {
  SiBun,
  SiCplusplus,
  SiDotnet,
  SiElectron,
  SiFramer,
  SiGit,
  SiGithub,
  SiJavascript,
  SiMarkdown,
  SiNextdotjs,
  SiNodedotjs,
  SiPwa,
  SiRadixui,
  SiReact,
  SiSharp,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
  SiWebgl,
} from "react-icons/si";

import type { LogoItem } from "./LogoLoop";

/**
 * The tech stack shown in the LogoLoop marquee on every project page. Icons are
 * monochrome (they inherit the loop's currentColor) so they stay theme-safe
 * across all four themes; each links to the technology's home.
 */
export const TECH_LOGOS: LogoItem[] = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  {
    node: <SiTypescript />,
    title: "TypeScript",
    href: "https://www.typescriptlang.org",
  },
  {
    node: <SiJavascript />,
    title: "JavaScript",
    href: "https://developer.mozilla.org/docs/Web/JavaScript",
  },
  {
    node: <SiTailwindcss />,
    title: "Tailwind CSS",
    href: "https://tailwindcss.com",
  },
  { node: <SiVite />, title: "Vite", href: "https://vite.dev" },
  { node: <SiBun />, title: "Bun", href: "https://bun.sh" },
  { node: <SiVercel />, title: "Vercel", href: "https://vercel.com" },
  {
    node: <SiFramer />,
    title: "Framer Motion",
    href: "https://www.framer.com/motion/",
  },
  { node: <SiRadixui />, title: "Radix UI", href: "https://www.radix-ui.com" },
  { node: <SiNodedotjs />, title: "Node.js", href: "https://nodejs.org" },
  { node: <SiCplusplus />, title: "C++", href: "https://isocpp.org" },
  {
    node: <SiSharp />,
    title: "C#",
    href: "https://learn.microsoft.com/dotnet/csharp/",
  },
  { node: <SiDotnet />, title: ".NET", href: "https://dotnet.microsoft.com" },
  {
    node: <SiElectron />,
    title: "Electron",
    href: "https://www.electronjs.org",
  },
  { node: <SiWebgl />, title: "WebGL", href: "https://www.khronos.org/webgl/" },
  { node: <SiMarkdown />, title: "Markdown", href: "https://commonmark.org" },
  { node: <SiGit />, title: "Git", href: "https://git-scm.com" },
  { node: <SiGithub />, title: "GitHub", href: "https://github.com" },
  {
    node: <SiPwa />,
    title: "PWA",
    href: "https://web.dev/explore/progressive-web-apps",
  },
];
