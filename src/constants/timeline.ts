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
      "School in three countries, then an internship in Lucerne. Newest first.",
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
          "Full-stack web apps for real clients, built with React, Next.js, TypeScript and Tailwind CSS.",
          "Backend services and APIs in Java, Python and C++, plus the hosting and server work that keeps them running.",
          "Git-based CI/CD pipelines, so releases go out with fewer surprises.",
          "Day-to-day work in an agile team: planning, reviews, shipping.",
        ],
        tags: MPAI_TAGS,
      },
    ],
    education: [
      {
        role: "Computer Scientist EFZ - Application Development",
        organization: "WISS",
        organizationUrl: WISS_URL,
        logo: WISS_LOGO,
        monogram: "W",
        period: "Aug 2023 – Present",
        start: "2023-08",
        location: "Zürich, Switzerland",
        points: [
          "Application development track: programming, application design, databases and system architecture.",
          "Two years of coursework, then two years of internship with classes alongside.",
          "The MPAI internship above is part of that second half.",
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
          "Finished at Level A, the highest track.",
          "Maths and the sciences were the subjects I leaned into.",
          "Where I got used to working on my own.",
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
          "German curriculum, taught in Beijing.",
          "Classmates from everywhere; the first years of living between cultures.",
          "Where the Mandarin comes from.",
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
          "The first two school years, in Singapore.",
          "Swiss curriculum taught in German, in an English-speaking city.",
          "The start of growing up in more than one language.",
        ],
        tags: ["International Education", "Foundations", "Multilingual"],
      },
    ],
  },
  de: {
    eyebrow: "Beruf & Ausbildung",
    heading: "Werdegang",
    subheading:
      "Schule in drei Ländern, dann ein Praktikum in Luzern. Das Neueste zuerst.",
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
          "Full-Stack-Webanwendungen für echte Kunden, gebaut mit React, Next.js, TypeScript und Tailwind CSS.",
          "Backend-Services und APIs in Java, Python und C++, dazu das Hosting und der Serverbetrieb, damit sie laufen.",
          "Git-basierte CI/CD-Pipelines, damit Releases mit weniger Überraschungen rausgehen.",
          "Alltag in einem agilen Team: planen, reviewen, ausliefern.",
        ],
        tags: MPAI_TAGS,
      },
    ],
    education: [
      {
        role: "Informatiker EFZ - Applikationsentwicklung",
        organization: "WISS",
        organizationUrl: WISS_URL,
        logo: WISS_LOGO,
        monogram: "W",
        period: "Aug. 2023 – Heute",
        start: "2023-08",
        location: "Zürich, Schweiz",
        points: [
          "Fachrichtung Applikationsentwicklung: Programmierung, Applikationsdesign, Datenbanken und Systemarchitektur.",
          "Zwei Jahre Schule, danach zwei Jahre Praktikum mit Unterricht nebenbei.",
          "Das MPAI-Praktikum oben gehört zu dieser zweiten Hälfte.",
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
          "Abschluss im Niveau A, dem höchsten Zug.",
          "Mathe und die Naturwissenschaften waren meine Fächer.",
          "Hier habe ich gelernt, selbstständig zu arbeiten.",
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
          "Deutscher Lehrplan, unterrichtet in Peking.",
          "Mitschüler aus aller Welt; die ersten Jahre zwischen den Kulturen.",
          "Daher kommt das Mandarin.",
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
          "Die ersten zwei Schuljahre, in Singapur.",
          "Schweizer Lehrplan auf Deutsch, in einer englischsprachigen Stadt.",
          "Der Anfang vom Aufwachsen in mehr als einer Sprache.",
        ],
        tags: ["Internationale Bildung", "Grundlagen", "Mehrsprachig"],
      },
    ],
  },
  fr: {
    eyebrow: "Carrière & formation",
    heading: "Parcours",
    subheading:
      "L'école dans trois pays, puis un stage à Lucerne. Le plus récent d'abord.",
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
          "Des applications web full-stack pour de vrais clients, construites avec React, Next.js, TypeScript et Tailwind CSS.",
          "Des services backend et des API en Java, Python et C++, plus l'hébergement et l'exploitation des serveurs pour les faire tourner.",
          "Des pipelines CI/CD basés sur Git, pour des mises en production avec moins de surprises.",
          "Le quotidien d'une équipe agile : planifier, relire, livrer.",
        ],
        tags: MPAI_TAGS,
      },
    ],
    education: [
      {
        role: "Informaticien CFC - Développement d'applications",
        organization: "WISS",
        organizationUrl: WISS_URL,
        logo: WISS_LOGO,
        monogram: "W",
        period: "août 2023 – aujourd'hui",
        start: "2023-08",
        location: "Zürich, Suisse",
        points: [
          "Filière développement d'applications : programmation, conception d'applications, bases de données et architecture système.",
          "Deux ans de cours, puis deux ans de stage avec des cours en parallèle.",
          "Le stage MPAI ci-dessus fait partie de cette seconde moitié.",
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
          "Terminée au niveau A, la filière la plus exigeante.",
          "Les maths et les sciences étaient mes matières.",
          "C'est là que j'ai appris à travailler seul.",
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
          "Programme allemand, enseigné à Pékin.",
          "Des camarades du monde entier ; les premières années entre plusieurs cultures.",
          "C'est de là que vient le mandarin.",
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
          "Les deux premières années d'école, à Singapour.",
          "Programme suisse en allemand, dans une ville anglophone.",
          "Le début d'une enfance dans plus d'une langue.",
        ],
        tags: ["Éducation internationale", "Bases", "Multilingue"],
      },
    ],
  },
  zh: {
    eyebrow: "职业与教育",
    heading: "履历",
    subheading:
      "在三个国家上过学，之后在卢塞恩实习。最新的在前。",
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
          "为真实客户构建全栈 Web 应用，用的是 React、Next.js、TypeScript 和 Tailwind CSS。",
          "用 Java、Python 和 C++ 写后端服务与 API，同时负责托管和服务器运维。",
          "基于 Git 的 CI/CD 流水线，让发布少一些意外。",
          "敏捷团队的日常：计划、评审、交付。",
        ],
        tags: MPAI_TAGS,
      },
    ],
    education: [
      {
        role: "信息技术专家 EFZ - 应用开发",
        organization: "WISS",
        organizationUrl: WISS_URL,
        logo: WISS_LOGO,
        monogram: "W",
        period: "2023年8月 – 至今",
        start: "2023-08",
        location: "苏黎世，瑞士",
        points: [
          "应用开发方向：编程、应用设计、数据库和系统架构。",
          "两年课程，之后两年实习，同时继续上课。",
          "上面的 MPAI 实习就是后半段的一部分。",
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
          "以 A 级毕业，这是最高的分流。",
          "数学和理科是我投入最多的科目。",
          "在这里学会了独立完成学习。",
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
          "德国课程，在北京授课。",
          "同学来自世界各地，最早在多种文化之间生活的几年。",
          "我的普通话就是从这里来的。",
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
          "最初的两个学年，在新加坡。",
          "瑞士课程，德语授课，身处一座讲英语的城市。",
          "在多种语言中长大的开始。",
        ],
        tags: ["国际教育", "基础", "多语言"],
      },
    ],
  },
};

export const getTimeline = (lang: Language): TimelineContent =>
  TIMELINE[lang] ?? TIMELINE.en;
