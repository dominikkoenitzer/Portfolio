import { NavLink } from '@/types';

export const NAV_LINKS: NavLink[] = [
  { name: "About", targetId: "about" },
  { name: "Skills", targetId: "skills" },
  { name: "Services", targetId: "services" },
  { name: "Contact", targetId: "contact" },
  { name: "Donate", targetId: "donate" },
];

export const SITE_CONFIG = {
  name: "Dominik Könitzer",
  title: "Software Engineer & Web Developer",
  description: "Passionate Software Engineer specializing in modern web development",
  author: "Dominik Könitzer",
  url: "https://dominik-portfolio.vercel.app",
  ogImage: "/og-image.png",
  email: "dominik@example.com",
  github: "https://github.com/dominikkoenitzer",
  linkedin: "https://linkedin.com/in/dominik-koenitzer",
} as const;

export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
} as const;

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;