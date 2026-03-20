export interface PortfolioProject {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  overview: string;
  roleSummary: string;
  problemStatement: string;
  objectives: string[];
  architectureDecisions: string[];
  implementationHighlights: string[];
  qualityAndSecurity: string[];
  challengesAndSolutions: Array<{
    challenge: string;
    solution: string;
  }>;
  hiringSignals: string[];
  nextIterations: string[];
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
      "Zephyr helps you stay focused, manage tasks, plan your schedule, and track your progress.",
    overview:
      "Zephyr was built to reduce friction for users who need fast access to key information. I focused on clear UI structure, responsive behavior, and maintainable frontend architecture so the product can grow without losing usability.",
    roleSummary:
      "Product-focused frontend engineer responsible for UX architecture, component system design, and delivery quality.",
    problemStatement:
      "Most productivity tools become noisy over time. Zephyr was designed to keep the core flow fast and readable even as feature depth grows.",
    objectives: [
      "Create a single-flow experience for task capture, scheduling, and progress checks.",
      "Keep interactions low-friction on both desktop and mobile breakpoints.",
      "Establish reusable UI and state patterns that scale without adding cognitive load.",
    ],
    architectureDecisions: [
      "Modular component boundaries around task operations, schedule views, and progress summaries.",
      "Token-driven styling for theme consistency and maintainable visual updates.",
      "Clear route and section separation so features can evolve independently.",
    ],
    implementationHighlights: [
      "Built high-signal dashboard surfaces with concise hierarchy and fast scanability.",
      "Introduced reusable interaction patterns for list actions and status handling.",
      "Implemented subtle motion cues to guide focus without distracting from content.",
    ],
    qualityAndSecurity: [
      "Semantic structure and readable contrast to support accessibility requirements.",
      "Defensive UI behavior for empty and edge states to avoid broken interaction loops.",
      "Consistent responsiveness validated across common viewport groups.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Balancing feature depth with a calm interface as more task utilities were added.",
        solution:
          "Created a layered hierarchy where primary actions remain persistent and advanced actions are progressively disclosed.",
      },
      {
        challenge:
          "Preventing visual inconsistency while iterating quickly on new sections.",
        solution:
          "Standardized card, spacing, and typography primitives to preserve system-level coherence.",
      },
    ],
    hiringSignals: [
      "Demonstrates product judgment, not only component implementation.",
      "Shows ability to scale UI systems while preserving speed and clarity.",
      "Reflects ownership from concept through production-ready polish.",
    ],
    nextIterations: [
      "Add analytics-informed prioritization for high-frequency workflows.",
      "Introduce collaborative planning primitives for shared task ownership.",
      "Expand automated interaction tests for critical productivity paths.",
    ],
    year: "2024",
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
      "Spectrum helps you pick, explore, and transform colors with tools for contrast checks, gradients, color lookup, and accessibility-friendly choices.",
    overview:
      "Spectrum combines visual quality with engineering discipline. The project emphasizes consistent component behavior, scalable layout systems, and clear UX flows so users and teams both benefit from a more reliable product experience.",
    roleSummary:
      "UI engineer and product designer translating color theory workflows into production-grade tooling.",
    problemStatement:
      "Color workflows are often fragmented across disconnected tools. Spectrum unifies exploration, validation, and transformation into one coherent product flow.",
    objectives: [
      "Enable rapid palette exploration with immediate visual feedback.",
      "Support accessibility-aware choices without requiring expert-level color knowledge.",
      "Provide conversion and gradient tooling in the same interface context.",
    ],
    architectureDecisions: [
      "Utility-oriented feature modules for contrast, gradients, and lookup capabilities.",
      "Composable UI primitives to keep advanced controls consistent across tool surfaces.",
      "State design that keeps color updates predictable and easy to reason about.",
    ],
    implementationHighlights: [
      "Delivered fast visual iteration loops for experimenting with palettes and gradients.",
      "Implemented contrast-checking flows that are readable for both designers and engineers.",
      "Built conversion helpers that reduce repetitive manual color transformations.",
    ],
    qualityAndSecurity: [
      "Accessible semantic and contrast-conscious presentation throughout tooling screens.",
      "Input handling that reduces malformed color states and broken calculations.",
      "Responsive layouts that preserve utility density on smaller devices.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Keeping advanced color controls powerful while still approachable for first-time users.",
        solution:
          "Used progressive disclosure and context hints so default flows stay simple but depth remains available.",
      },
      {
        challenge:
          "Avoiding inconsistent behavior across multiple color tools in one app.",
        solution:
          "Centralized shared interaction patterns and validation logic for a unified experience.",
      },
    ],
    hiringSignals: [
      "Shows cross-functional thinking between design quality and engineering execution.",
      "Proves ability to build domain tooling with clear user-centered tradeoffs.",
      "Highlights consistency discipline at both UX and code architecture levels.",
    ],
    nextIterations: [
      "Add export presets for design tokens and team handoff workflows.",
      "Introduce saved sessions for repeatable palette experiments.",
      "Expand educational guidance for accessibility-first color decisions.",
    ],
    year: "2026",
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
      "Entropy helps you generate, evaluate, and refine secure passwords with tools for custom rules, strength scoring, and cryptography-backed randomness so you can create safer credentials with confidence.",
    overview:
      "Entropy started as a creative exploration and evolved into a structured product implementation. I focused on maintainability, interaction quality, and resilient behavior so the experience remains reliable under real usage conditions.",
    roleSummary:
      "Security-minded frontend engineer delivering reliable credential tooling with clear user guidance.",
    problemStatement:
      "Many password tools are either too simplistic or too technical. Entropy bridges that gap by making secure generation understandable and actionable.",
    objectives: [
      "Provide configurable password generation grounded in strong randomness principles.",
      "Make strength analysis readable so users can improve weak credentials confidently.",
      "Combine generation, evaluation, and refinement in one repeatable workflow.",
    ],
    architectureDecisions: [
      "Isolated generation, scoring, and rule configuration into explicit feature modules.",
      "Separated presentation and logic layers for easier testing and iteration.",
      "Designed deterministic UI states around validation and recommendation outputs.",
    ],
    implementationHighlights: [
      "Integrated cryptography-backed randomness for stronger generated outputs.",
      "Built transparent scoring feedback so users understand why passwords are weak or strong.",
      "Implemented custom-rule controls without sacrificing usability.",
    ],
    qualityAndSecurity: [
      "Security-first interaction design that avoids exposing sensitive data patterns.",
      "Robust input validation to guard against invalid rule combinations.",
      "Accessibility-aware UX to keep critical security workflows broadly usable.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Conveying security complexity without overwhelming non-technical users.",
        solution:
          "Translated technical scoring outputs into plain-language recommendations and actionable improvements.",
      },
      {
        challenge:
          "Maintaining trust while introducing advanced customization controls.",
        solution:
          "Added clear defaults, constraints, and immediate feedback to prevent misconfiguration.",
      },
    ],
    hiringSignals: [
      "Demonstrates applied security thinking in product UX.",
      "Shows ability to simplify complex domains into reliable interfaces.",
      "Reflects strong attention to risk, validation, and user trust.",
    ],
    nextIterations: [
      "Add optional passphrase mode and entropy-comparison utilities.",
      "Provide downloadable security reports for personal credential audits.",
      "Expand automated test coverage around edge-case rule combinations.",
    ],
    year: "2026",
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
