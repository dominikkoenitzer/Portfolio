import type { NavLink } from "@/types";

export const NAV_LINKS: NavLink[] = [
  { name: "Home", targetId: "/" },
  { name: "About", targetId: "/about" },
  { name: "Experience", targetId: "/experience" },
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
    "Software engineer in Switzerland, studying at WISS Schulen für Wirtschaft Informatik Immobilien and building web apps with React, TypeScript and Node.",
  author: "Dominik Könitzer",
  url: "https://dk.punds.ch",
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


