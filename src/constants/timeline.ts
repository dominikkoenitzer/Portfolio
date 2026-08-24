import type { Language } from "@/config/languages";

/**
 * One entry on the Timeline page: a single role or stage of education,
 * rendered as an experience card (logo, role, organization, meta, bullets,
 * tags). Roles/organizations/points are extracted from the public
 * CV/Lebenslauf; locations, tags and the start/end dates (used to compute a
 * live duration) round out the card. `logo` is an asset path under
 * public/timeline; when absent the `monogram` initials are shown instead.
 */
export interface TimelineEntry {
  role: string;
  organization: string;
  organizationUrl: string;
  logo?: string;
  /** Render the logo edge-to-edge (for full-bleed brand icons) instead of contained on a white tile. */
  logoFill?: boolean;
  monogram: string;
  /** Localized display range, e.g. "Aug 2023 – Present". */
  period: string;
  /** Machine range for the computed duration: "YYYY-MM" or "YYYY". */
  start: string;
  /** Omit for ongoing entries → duration runs to today. */
  end?: string;
  location: string;
  /** Work only: Hybrid / Remote (localized). */
  arrangement?: string;
  /** Work only: Internship / Part-time (localized). */
  commitment?: string;
  points: string[];
  tags: string[];
}

export interface TimelineContent {
  eyebrow: string;
  heading: string;
  subheading: string;
  experienceTitle: string;
  educationTitle: string;
  /** Accessible name for the chip that reveals the tags a card had no room for. */
  moreTags: (count: number) => string;
  experience: TimelineEntry[];
  education: TimelineEntry[];
}

const MPAI_URL = "https://mpai.ch/";

const WISS_URL = "https://wiss.ch";
const MPS_URL = "https://bezirksschulenschwyz.ch/oberarth/profil-oberarth";
// http, deliberately: the school's TLS certificate expired on 2024-10-13 and
// has not been renewed, so https serves a full-page browser interstitial. Plain
// http reaches the site. Re-check before "fixing" this back.
const DSP_URL = "http://dspeking.de/";
const SSS_URL = "https://swiss-school.edu.sg";

const WISS_LOGO = "/timeline/wiss.ico";
const MPAI_LOGO = "/timeline/mpai.png";
const SSS_LOGO = "/timeline/sss-singapore.png";
const MPS_LOGO = "/timeline/mps-oberarth.png";
const DSP_LOGO = "/timeline/dsp-beijing.png";
// The site's own brand icon: used for the self-employed / dk.punds.ch entry.

// Tech stacks are proper nouns: identical across languages.
const MPAI_TAGS = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Java",
  "Python",
  "C++",
  "Git",
  "CI/CD",
];

const TIMELINE: Record<Language, TimelineContent> = {
  en: {
    eyebrow: "Career & education",
    heading: "Timeline",
    subheading:
      "The path that shaped me as a software engineer — from an international school upbringing to building production software today.",
    experienceTitle: "Work Experience",
    educationTitle: "Education",
    moreTags: (n) => `Show ${n} more skill${n === 1 ? "" : "s"}`,
    experience: [
      {
        role: "MPAI Intern",
        organization: "MPAI",
        organizationUrl: MPAI_URL,
        logo: MPAI_LOGO,
        monogram: "M",
        period: "Aug 2025 – Aug 2026",
        start: "2025-08",
        end: "2026-08",
        location: "Meggen, Lucerne",
        arrangement: "Hybrid",
        commitment: "Internship",
        points: [
          "Delivered high-performance full-stack applications with React, Next.js, TypeScript, and Tailwind CSS for production clients.",
          "Built and maintained backend services and APIs in Java, Python, and C++, including hosting and server operations.",
          "Streamlined releases with Git-based CI/CD workflows, reducing deployment risk and turnaround time.",
          "Partnered in agile teams to ship scalable features quickly with strong quality and reliability.",
        ],
        tags: MPAI_TAGS,
      },
    ],
    education: [
      {
        role: "Computer Scientist EFZ – Application Development",
        organization: "WISS",
        organizationUrl: WISS_URL,
        logo: WISS_LOGO,
        monogram: "W",
        period: "Aug 2023 – Present",
        start: "2023-08",
        location: "Zürich, Switzerland",
        points: [
          "Specialization in software development and programming.",
          "Focus on application design and modern technologies.",
          "Building strong foundations in databases and system architecture.",
        ],
        tags: [
          "Software Development",
          "Application Design",
          "Databases",
          "System Architecture",
          "Programming",
        ],
      },
      {
        role: "Secondary School (Level A)",
        organization: "MPS Oberarth",
        organizationUrl: MPS_URL,
        logo: MPS_LOGO,
        monogram: "MPS",
        period: "2021 – 2023",
        start: "2021",
        end: "2023",
        location: "Oberarth, Schwyz",
        points: [
          "Completed secondary school with highest level (Level A).",
          "Strong focus on analytical and STEM-related subjects.",
          "Developed structured and independent learning skills.",
        ],
        tags: ["STEM", "Analytical Thinking", "Independent Learning"],
      },
      {
        role: "Primary School (Grades 3–7)",
        organization: "German Embassy School Beijing",
        organizationUrl: DSP_URL,
        logo: DSP_LOGO,
        monogram: "DS",
        period: "2016 – 2020",
        start: "2016",
        end: "2020",
        location: "Beijing, China",
        points: [
          "Attended an international German curriculum abroad.",
          "Gained intercultural experience in a global environment.",
          "Strengthened adaptability and language skills.",
        ],
        tags: ["International Curriculum", "Intercultural", "Languages"],
      },
      {
        role: "Primary School (Grades 1–2)",
        organization: "Swiss School Singapore",
        organizationUrl: SSS_URL,
        logo: SSS_LOGO,
        monogram: "S",
        period: "2014 – 2016",
        start: "2014",
        end: "2016",
        location: "Singapore",
        points: [
          "Early education in an international setting.",
          "Developed foundational academic and social skills.",
          "First exposure to multilingual and diverse environments.",
        ],
        tags: ["International Education", "Foundations", "Multilingual"],
      },
    ],
  },
  de: {
    eyebrow: "Beruf & Ausbildung",
    heading: "Werdegang",
    subheading:
      "Der Weg, der mich als Software Engineer geprägt hat – von einer internationalen Schulzeit bis zur Entwicklung von Produktivsoftware heute.",
    experienceTitle: "Berufserfahrung",
    educationTitle: "Ausbildung",
    moreTags: (n) => `${n} weitere Fähigkeit${n === 1 ? "" : "en"} anzeigen`,
    experience: [
      {
        role: "Praktikant MPAI",
        organization: "MPAI",
        organizationUrl: MPAI_URL,
        logo: MPAI_LOGO,
        monogram: "M",
        period: "Aug. 2025 – Aug. 2026",
        start: "2025-08",
        end: "2026-08",
        location: "Meggen, Luzern",
        arrangement: "Hybrid",
        commitment: "Praktikum",
        points: [
          "Entwickelte leistungsstarke Full-Stack-Anwendungen mit React, Next.js, TypeScript und Tailwind CSS für Produktivkunden.",
          "Entwickelte und betrieb Backend-Services und APIs in Java, Python und C++, inklusive Hosting und Serverbetrieb.",
          "Optimierte Releases mit Git-basierten CI/CD-Workflows und reduzierte Risiko sowie Durchlaufzeit.",
          "Arbeitete in agilen Teams und lieferte skalierbare Features schnell und zuverlässig.",
        ],
        tags: MPAI_TAGS,
      },
    ],
    education: [
      {
        role: "Informatiker EFZ – Applikationsentwicklung",
        organization: "WISS",
        organizationUrl: WISS_URL,
        logo: WISS_LOGO,
        monogram: "W",
        period: "Aug. 2023 – Heute",
        start: "2023-08",
        location: "Zürich, Schweiz",
        points: [
          "Spezialisierung auf Softwareentwicklung und Programmierung.",
          "Fokus auf Applikationsdesign und moderne Technologien.",
          "Aufbau solider Grundlagen in Datenbanken und Systemarchitektur.",
        ],
        tags: [
          "Softwareentwicklung",
          "Applikationsdesign",
          "Datenbanken",
          "Systemarchitektur",
          "Programmierung",
        ],
      },
      {
        role: "Sekundarschule (Niveau A)",
        organization: "MPS Oberarth",
        organizationUrl: MPS_URL,
        logo: MPS_LOGO,
        monogram: "MPS",
        period: "2021 – 2023",
        start: "2021",
        end: "2023",
        location: "Oberarth, Schwyz",
        points: [
          "Sekundarschule auf höchstem Niveau (Niveau A) abgeschlossen.",
          "Starker Fokus auf analytische und MINT-bezogene Fächer.",
          "Strukturiertes und selbstständiges Lernen weiterentwickelt.",
        ],
        tags: ["MINT", "Analytisches Denken", "Selbstständiges Lernen"],
      },
      {
        role: "Primarschule (Klassen 3–7)",
        organization: "Deutsche Botschaftsschule Peking",
        organizationUrl: DSP_URL,
        logo: DSP_LOGO,
        monogram: "DS",
        period: "2016 – 2020",
        start: "2016",
        end: "2020",
        location: "Peking, China",
        points: [
          "Besuch eines internationalen deutschen Lehrplans im Ausland.",
          "Interkulturelle Erfahrungen in einem globalen Umfeld gesammelt.",
          "Anpassungsfähigkeit und Sprachkenntnisse gestärkt.",
        ],
        tags: ["Internationaler Lehrplan", "Interkulturell", "Sprachen"],
      },
      {
        role: "Primarschule (Klassen 1–2)",
        organization: "Swiss School Singapore",
        organizationUrl: SSS_URL,
        logo: SSS_LOGO,
        monogram: "S",
        period: "2014 – 2016",
        start: "2014",
        end: "2016",
        location: "Singapur",
        points: [
          "Frühe Schulbildung in einem internationalen Umfeld.",
          "Grundlegende fachliche und soziale Kompetenzen entwickelt.",
          "Erste Prägung in einem mehrsprachigen und vielfältigen Umfeld.",
        ],
        tags: ["Internationale Bildung", "Grundlagen", "Mehrsprachig"],
      },
    ],
  },
  fr: {
    eyebrow: "Carrière & formation",
    heading: "Parcours",
    subheading:
      "Le parcours qui m'a façonné en tant qu'ingénieur logiciel – d'une scolarité internationale au développement de logiciels en production aujourd'hui.",
    experienceTitle: "Expérience professionnelle",
    educationTitle: "Formation",
    moreTags: (n) => `Afficher ${n} compétence${n === 1 ? "" : "s"} de plus`,
    experience: [
      {
        role: "Stagiaire MPAI",
        organization: "MPAI",
        organizationUrl: MPAI_URL,
        logo: MPAI_LOGO,
        monogram: "M",
        period: "août 2025 – août 2026",
        start: "2025-08",
        end: "2026-08",
        location: "Meggen, Lucerne",
        arrangement: "Hybride",
        commitment: "Stage",
        points: [
          "Développé des applications full-stack performantes avec React, Next.js, TypeScript et Tailwind CSS pour des clients en production.",
          "Conçu et maintenu des services backend et des API en Java, Python et C++, y compris l'hébergement et l'exploitation des serveurs.",
          "Optimisé les mises en production avec des workflows CI/CD basés sur Git, réduisant les risques et les délais de déploiement.",
          "Collaboré au sein d'équipes agiles pour livrer rapidement des fonctionnalités évolutives, fiables et de qualité.",
        ],
        tags: MPAI_TAGS,
      },
    ],
    education: [
      {
        role: "Informaticien CFC – Développement d'applications",
        organization: "WISS",
        organizationUrl: WISS_URL,
        logo: WISS_LOGO,
        monogram: "W",
        period: "août 2023 – aujourd'hui",
        start: "2023-08",
        location: "Zürich, Suisse",
        points: [
          "Spécialisation en développement logiciel et programmation.",
          "Accent sur la conception d'applications et les technologies modernes.",
          "Acquisition de bases solides en bases de données et en architecture système.",
        ],
        tags: [
          "Développement logiciel",
          "Conception d'applications",
          "Bases de données",
          "Architecture système",
          "Programmation",
        ],
      },
      {
        role: "École secondaire (niveau A)",
        organization: "MPS Oberarth",
        organizationUrl: MPS_URL,
        logo: MPS_LOGO,
        monogram: "MPS",
        period: "2021 – 2023",
        start: "2021",
        end: "2023",
        location: "Oberarth, Schwytz",
        points: [
          "École secondaire achevée au plus haut niveau (niveau A).",
          "Fort accent sur les matières analytiques et STIM.",
          "Développement d'un apprentissage structuré et autonome.",
        ],
        tags: ["STIM", "Pensée analytique", "Apprentissage autonome"],
      },
      {
        role: "École primaire (degrés 3 à 7)",
        organization: "École de l'ambassade d'Allemagne à Pékin",
        organizationUrl: DSP_URL,
        logo: DSP_LOGO,
        monogram: "DS",
        period: "2016 – 2020",
        start: "2016",
        end: "2020",
        location: "Pékin, Chine",
        points: [
          "Suivi d'un cursus allemand international à l'étranger.",
          "Expérience interculturelle acquise dans un environnement mondial.",
          "Renforcement de l'adaptabilité et des compétences linguistiques.",
        ],
        tags: ["Cursus international", "Interculturel", "Langues"],
      },
      {
        role: "École primaire (degrés 1 à 2)",
        organization: "École suisse de Singapour",
        organizationUrl: SSS_URL,
        logo: SSS_LOGO,
        monogram: "S",
        period: "2014 – 2016",
        start: "2014",
        end: "2016",
        location: "Singapour",
        points: [
          "Premières années de scolarité dans un cadre international.",
          "Développement de compétences scolaires et sociales fondamentales.",
          "Première immersion dans un environnement multilingue et diversifié.",
        ],
        tags: ["Éducation internationale", "Bases", "Multilingue"],
      },
    ],
  },
  zh: {
    eyebrow: "职业与教育",
    heading: "履历",
    subheading:
      "塑造我成为软件工程师的历程——从国际化的求学经历，到如今打造生产级软件。",
    experienceTitle: "工作经历",
    educationTitle: "教育经历",
    moreTags: (n) => `显示另外 ${n} 项技能`,
    experience: [
      {
        role: "MPAI 实习生",
        organization: "MPAI",
        organizationUrl: MPAI_URL,
        logo: MPAI_LOGO,
        monogram: "M",
        period: "2025年8月 – 2026年8月",
        start: "2025-08",
        end: "2026-08",
        location: "梅根，卢塞恩",
        arrangement: "混合办公",
        commitment: "实习",
        points: [
          "为生产环境客户使用 React、Next.js、TypeScript 和 Tailwind CSS 交付高性能全栈应用。",
          "使用 Java、Python 和 C++ 构建并维护后端服务与 API，包括托管与服务器运维。",
          "通过基于 Git 的 CI/CD 流程优化发布，降低部署风险并缩短交付周期。",
          "在敏捷团队中协作，快速交付可扩展、高质量且可靠的功能。",
        ],
        tags: MPAI_TAGS,
      },
    ],
    education: [
      {
        role: "信息技术专家 EFZ – 应用开发",
        organization: "WISS",
        organizationUrl: WISS_URL,
        logo: WISS_LOGO,
        monogram: "W",
        period: "2023年8月 – 至今",
        start: "2023-08",
        location: "苏黎世，瑞士",
        points: [
          "专注于软件开发与编程。",
          "侧重应用设计与现代技术。",
          "夯实数据库与系统架构的基础。",
        ],
        tags: ["软件开发", "应用设计", "数据库", "系统架构", "编程"],
      },
      {
        role: "中学（A 级）",
        organization: "MPS Oberarth",
        organizationUrl: MPS_URL,
        logo: MPS_LOGO,
        monogram: "MPS",
        period: "2021年 – 2023年",
        start: "2021",
        end: "2023",
        location: "上阿尔特，施维茨",
        points: [
          "以最高级别（A 级）完成中学学业。",
          "重点学习分析类与 STEM 相关科目。",
          "培养结构化与独立的学习能力。",
        ],
        tags: ["STEM", "分析思维", "自主学习"],
      },
      {
        role: "小学（3–7 年级）",
        organization: "北京德国使馆学校",
        organizationUrl: DSP_URL,
        logo: DSP_LOGO,
        monogram: "DS",
        period: "2016年 – 2020年",
        start: "2016",
        end: "2020",
        location: "北京，中国",
        points: [
          "在海外就读国际化的德国课程。",
          "在全球化环境中积累跨文化经验。",
          "增强适应能力与语言能力。",
        ],
        tags: ["国际课程", "跨文化", "语言"],
      },
      {
        role: "小学（1–2 年级）",
        organization: "新加坡瑞士学校",
        organizationUrl: SSS_URL,
        logo: SSS_LOGO,
        monogram: "S",
        period: "2014年 – 2016年",
        start: "2014",
        end: "2016",
        location: "新加坡",
        points: [
          "在国际化环境中开启早期教育。",
          "培养基础的学业与社交能力。",
          "初次接触多语言、多元化的环境。",
        ],
        tags: ["国际教育", "基础", "多语言"],
      },
    ],
  },
};

export const getTimeline = (lang: Language): TimelineContent =>
  TIMELINE[lang] ?? TIMELINE.en;
