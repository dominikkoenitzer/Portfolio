import type { Language } from "@/config/languages";
import type { FAQItem } from "@/types/seo";
import type { LocaleRecord } from "./types";

export const TIMELINE_FAQS: LocaleRecord<FAQItem[]> = {
  en: [
    {
      question: "What is Dominik Könitzer's work experience?",
      answer:
        "Dominik Könitzer is interning at MPAI (2025–2026), building full-stack applications with React, Next.js, TypeScript, and Tailwind CSS and maintaining backend services in Java, Python, and C++. Alongside the internship he works as a freelance web developer, delivering custom solutions for SMEs and individual clients with React, Next.js, Spring Boot, and Java.",
    },
    {
      question: "Where did Dominik Könitzer go to school?",
      answer:
        "Dominik Könitzer is studying Computer Science EFZ (Application Development) at WISS Schulen für Wirtschaft Informatik Immobilien since 2023. Earlier he attended secondary school (Level A) at MPS Oberarth, the German Embassy School in Beijing, and the Swiss School Singapore — giving him an international education across three continents.",
    },
    {
      question: "What is Dominik Könitzer currently working on?",
      answer:
        "Dominik Könitzer is currently completing a software engineering internship at MPAI while running freelance web development projects and continuing his 4-year software engineering program at WISS in Switzerland.",
    },
  ],
  de: [
    {
      question: "Welche Berufserfahrung hat Dominik Könitzer?",
      answer:
        "Dominik Könitzer absolviert ein Praktikum bei MPAI (2025–2026), entwickelt Full-Stack-Anwendungen mit React, Next.js, TypeScript und Tailwind CSS und betreut Backend-Services in Java, Python und C++. Parallel arbeitet er als freiberuflicher Webentwickler und liefert individuelle Lösungen für KMU und Privatkunden mit React, Next.js, Spring Boot und Java.",
    },
    {
      question: "Wo ist Dominik Könitzer zur Schule gegangen?",
      answer:
        "Dominik Könitzer absolviert seit 2023 die Ausbildung zum Informatiker EFZ (Applikationsentwicklung) an der WISS Schule für Wirtschaft Informatik Immobilien. Zuvor besuchte er die Sekundarschule (Niveau A) an der MPS Oberarth, die Deutsche Botschaftsschule Peking sowie die Swiss School Singapore — eine internationale Schulbildung auf drei Kontinenten.",
    },
    {
      question: "Woran arbeitet Dominik Könitzer derzeit?",
      answer:
        "Dominik Könitzer absolviert derzeit ein Software-Engineering-Praktikum bei MPAI, betreut freiberufliche Webentwicklungs-Projekte und setzt sein vierjähriges Software-Engineering-Programm an der WISS in der Schweiz fort.",
    },
  ],
  fr: [
    {
      question: "Quelle est l'expérience professionnelle de Dominik Könitzer ?",
      answer:
        "Dominik Könitzer effectue un stage chez MPAI (2025–2026), où il développe des applications full-stack avec React, Next.js, TypeScript et Tailwind CSS et maintient des services backend en Java, Python et C++. En parallèle, il travaille comme développeur web indépendant et livre des solutions sur mesure pour PME et particuliers avec React, Next.js, Spring Boot et Java.",
    },
    {
      question: "Où Dominik Könitzer a-t-il fait ses études ?",
      answer:
        "Dominik Könitzer suit depuis 2023 une formation d'Informaticien CFC (développement d'applications) à la WISS Schulen für Wirtschaft Informatik Immobilien. Auparavant, il a fréquenté l'école secondaire (niveau A) à MPS Oberarth, l'École de l'ambassade d'Allemagne à Pékin et l'École suisse de Singapour — une scolarité internationale sur trois continents.",
    },
    {
      question: "Sur quoi Dominik Könitzer travaille-t-il actuellement ?",
      answer:
        "Dominik Könitzer effectue actuellement un stage en ingénierie logicielle chez MPAI, mène des projets de développement web en freelance et poursuit son programme d'ingénierie logicielle de 4 ans à la WISS en Suisse.",
    },
  ],
  zh: [
    {
      question: "Dominik Könitzer 有哪些工作经历？",
      answer:
        "Dominik Könitzer 正在 MPAI 实习（2025–2026），使用 React、Next.js、TypeScript 和 Tailwind CSS 构建全栈应用，并以 Java、Python 和 C++ 维护后端服务。与此同时，他以自由网页开发者身份，使用 React、Next.js、Spring Boot 和 Java 为中小企业及个人客户交付定制方案。",
    },
    {
      question: "Dominik Könitzer 在哪里就读？",
      answer:
        "Dominik Könitzer 自 2023 年起在 WISS Schulen für Wirtschaft Informatik Immobilien 攻读信息技术专家 EFZ（应用开发）。此前他曾就读于 MPS Oberarth 中学（A 级）、北京德国使馆学校以及新加坡瑞士学校——横跨三大洲的国际化教育。",
    },
    {
      question: "Dominik Könitzer 目前在做什么？",
      answer:
        "Dominik Könitzer 目前正在 MPAI 完成软件工程实习，同时承接自由网页开发项目，并继续在瑞士 WISS 攻读为期四年的软件工程课程。",
    },
  ],
};

export const getTimelineFaqs = (lang: Language) =>
  TIMELINE_FAQS[lang] ?? TIMELINE_FAQS.en;
