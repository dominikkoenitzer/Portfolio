export interface PortfolioProject {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  overview: string;
  year: string;
  repoUrl: string;
  liveUrl: string;
  priority: number;
  toneClass: string;
  tags: string[];
  impactHeading: string;
  impactPoints: string[];
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    slug: "zephyr",
    title: "Zephyr",
    tagline:
      "A performance-first product experience designed to help people navigate complex information quickly.",
    description:
      "A polished modern web experience with a strong focus on speed, clarity, and clean interface design. Built to feel lightweight while still providing rich interactions.",
    overview:
      "Zephyr was built to reduce friction for users who need fast access to key information. I focused on clear UI structure, responsive behavior, and maintainable frontend architecture so the product can grow without losing usability.",
    year: "2026",
    repoUrl: "https://github.com/dominikkoenitzer/Zephyr",
    liveUrl: "https://zephyr.punds.ch/",
    priority: 1,
    toneClass:
      "bg-[radial-gradient(circle_at_50%_50%,_hsl(var(--primary)/0.18),_transparent_70%)]",
    tags: ["Frontend", "Performance", "UI/UX"],
    impactHeading: "How This Project Creates Impact",
    impactPoints: [
      "Improves day-to-day usability by simplifying navigation and reducing interaction overhead.",
      "Helps people complete tasks faster through clearer hierarchy and better responsiveness.",
      "Supports long-term growth with reusable components and predictable patterns for team collaboration.",
    ],
  },
  {
    slug: "spectrum",
    title: "Spectrum",
    tagline:
      "A structured and scalable web product foundation for teams that need consistency and speed.",
    description:
      "A flexible project centered around vibrant visuals and structured content, designed to scale with additional modules and evolving feature needs.",
    overview:
      "Spectrum combines visual quality with engineering discipline. The project emphasizes consistent component behavior, scalable layout systems, and clear UX flows so users and teams both benefit from a more reliable product experience.",
    year: "2025",
    repoUrl: "https://github.com/dominikkoenitzer/Spectrum",
    liveUrl: "https://spectrum.punds.ch/",
    priority: 2,
    toneClass:
      "bg-[radial-gradient(circle_at_50%_50%,_hsl(var(--primary)/0.18),_transparent_70%)]",
    tags: ["Scalable", "Design System", "Web App"],
    impactHeading: "How This Project Creates Impact",
    impactPoints: [
      "Gives teams a cleaner system to ship features without sacrificing consistency.",
      "Makes interfaces easier to understand for users through repeatable visual language.",
      "Balances aesthetics and performance to keep quality high across devices.",
    ],
  },
  {
    slug: "entropy",
    title: "Entropy",
    tagline:
      "An experimental concept refined into a stable, production-minded experience with strong technical foundations.",
    description:
      "An experimental build that blends creative interaction with robust engineering patterns, emphasizing maintainability and responsive performance.",
    overview:
      "Entropy started as a creative exploration and evolved into a structured product implementation. I focused on maintainability, interaction quality, and resilient behavior so the experience remains reliable under real usage conditions.",
    year: "2025",
    repoUrl: "https://github.com/dominikkoenitzer/Entropy",
    liveUrl: "https://entropy.punds.ch/",
    priority: 3,
    toneClass:
      "bg-[radial-gradient(circle_at_50%_50%,_hsl(var(--primary)/0.18),_transparent_70%)]",
    tags: ["Experimental", "Responsive", "Engineering"],
    impactHeading: "How This Project Creates Impact",
    impactPoints: [
      "Turns complex interactions into a stable flow that users can trust.",
      "Improves maintainability with clearer architecture and component boundaries.",
      "Demonstrates product-level thinking beyond visuals by prioritizing reliability and UX outcomes.",
    ],
  },
];
