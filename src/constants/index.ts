import type { NavLink } from "@/types";

export const NAV_LINKS: NavLink[] = [
  { name: "About", targetId: "/about" },
  { name: "Timeline", targetId: "/timeline" },
  { name: "Skills", targetId: "/skills" },
  { name: "Projects", targetId: "/projects" },
  { name: "Services", targetId: "/services" },
  { name: "Contact", targetId: "/contact" },
  { name: "Donate", targetId: "/donate" },
];

export const SITE_CONFIG = {
  name: "Dominik Könitzer",
  title: "Software Engineer & Web Developer",
  description:
    "Passionate Software Engineer specializing in modern web development. Based in Switzerland, currently studying at WISS Schulen für Wirtschaft Informatik Immobilien. Expert in React, TypeScript, and full-stack development.",
  author: "Dominik Könitzer",
  url: "https://dominikkoenitzer.ch",
  ogImage: "/og-image.png",
  email: "dominik.koenitzer@gmail.com",
  github: "https://github.com/dominikkoenitzer",
  location: {
    country: "Switzerland",
    countryCode: "CH",
    region: "CH-ZH",
    city: "Zürich",
    latitude: 47.3769,
    longitude: 8.5417,
  },
} as const;

export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
} as const;

export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;
