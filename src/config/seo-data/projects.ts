import type { Language } from "@/config/languages";
import type { FAQItem } from "@/types/seo";
import type { LocaleRecord } from "./types";

export const PROJECTS_FAQS: LocaleRecord<FAQItem[]> = {
  en: [
    {
      question:
        "What kind of impact-focused projects are included in this portfolio?",
      answer:
        "This portfolio includes production-oriented projects focused on practical outcomes such as improved user experience, stronger performance, accessibility, and maintainable architecture. Each project highlights decisions that support real users and long-term product growth.",
    },
    {
      question: "Where can I review project code and live implementations?",
      answer:
        "Each project includes both a GitHub repository and a live deployment link so recruiters and hiring teams can evaluate implementation quality, code structure, UI decisions, and end-user behavior.",
    },
    {
      question:
        "How do these projects demonstrate job-ready software engineering skills?",
      answer:
        "The showcased work demonstrates end-to-end product thinking: planning structured interfaces, implementing modern frontend architecture, optimizing performance, and building reusable components that support collaboration and future iteration.",
    },
  ],
  de: [
    {
      question:
        "Welche wirkungsorientierten Projekte sind in diesem Portfolio enthalten?",
      answer:
        "Das Portfolio enthält produktionsnahe Projekte mit Fokus auf praktische Ergebnisse wie bessere User Experience, höhere Performance, Accessibility und wartbare Architektur. Jedes Projekt zeigt Entscheidungen, die echten Nutzern und langfristigem Produktwachstum dienen.",
    },
    {
      question: "Wo kann ich Code und Live-Implementierungen einsehen?",
      answer:
        "Jedes Projekt enthält ein GitHub-Repository und einen Live-Deployment-Link, damit Recruiter und Hiring-Teams Code-Qualität, Struktur, UI-Entscheidungen und Verhalten für Endnutzer bewerten können.",
    },
    {
      question:
        "Wie zeigen diese Projekte einsatzbereite Software-Engineering-Fähigkeiten?",
      answer:
        "Die gezeigten Arbeiten beweisen End-to-End-Produktdenken: strukturierte UI-Planung, moderne Frontend-Architektur, Performance-Optimierung und wiederverwendbare Komponenten, die Kollaboration und zukünftige Iteration unterstützen.",
    },
  ],
  fr: [
    {
      question:
        "Quels types de projets à fort impact figurent dans ce portfolio ?",
      answer:
        "Ce portfolio contient des projets orientés production, centrés sur des résultats concrets : meilleure expérience utilisateur, performance accrue, accessibilité et architecture maintenable. Chaque projet met en avant des décisions au service d'utilisateurs réels et de la croissance produit à long terme.",
    },
    {
      question:
        "Où puis-je consulter le code et les implémentations en ligne ?",
      answer:
        "Chaque projet inclut un dépôt GitHub et un lien de déploiement live afin que recruteurs et équipes de recrutement puissent évaluer la qualité d'implémentation, la structure du code, les choix UI et le comportement côté utilisateur.",
    },
    {
      question:
        "En quoi ces projets démontrent-ils des compétences d'ingénierie logicielle prêtes à l'emploi ?",
      answer:
        "Les réalisations présentées démontrent une pensée produit de bout en bout : planification d'interfaces structurées, architecture frontend moderne, optimisation des performances et composants réutilisables prêts pour la collaboration et l'itération future.",
    },
  ],
  zh: [
    {
      question: "本作品集包含哪些注重影响力的项目？",
      answer:
        "本作品集包含面向生产的项目，聚焦于切实的成果——更好的用户体验、更强的性能、可访问性与可维护的架构。每个项目都体现了服务真实用户与长期产品成长的取舍。",
    },
    {
      question: "在哪里可以查看项目代码与线上版本？",
      answer:
        "每个项目都附有 GitHub 仓库与在线部署链接，方便招聘者与团队评估实现质量、代码结构、UI 决策以及最终用户的体验。",
    },
    {
      question: "这些项目如何体现可即时上岗的软件工程能力？",
      answer:
        "展示的作品体现了端到端的产品思维：规划结构化的界面、落地现代化的前端架构、优化性能，以及构建支持协作与未来迭代的可复用组件。",
    },
  ],
};

export const getProjectsFaqs = (lang: Language) =>
  PROJECTS_FAQS[lang] ?? PROJECTS_FAQS.en;
