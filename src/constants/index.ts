import { NavLink } from '@/types';

export const NAV_LINKS: NavLink[] = [
  { name: "About", targetId: "/about" },
  { name: "Skills", targetId: "/skills" },
  { name: "Services", targetId: "/services" },
  { name: "Contact", targetId: "/contact" },
  { name: "Donate", targetId: "/donate" },
];

export const SITE_CONFIG = {
  name: "Dominik Könitzer",
  title: "Software Engineer & Web Developer",
  description: "Passionate Software Engineer specializing in modern web development. Based in Switzerland, currently studying at WISS Schulen für Wirtschaft Informatik Immobilien. Expert in React, TypeScript, and full-stack development.",
  author: "Dominik Könitzer",
  url: "https://dominikkoenitzer.ch",
  ogImage: "/og-image.png",
  email: "dominik@example.com",
  github: "https://github.com/dominikkoenitzer",
  location: {
    country: "Switzerland",
    countryCode: "CH",
    region: "CH",
    latitude: 46.8182,
    longitude: 8.2275,
  },
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