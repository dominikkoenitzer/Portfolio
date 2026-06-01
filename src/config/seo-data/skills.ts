import type { Language } from "@/config/languages";
import type { FAQItem } from "@/types/seo";
import type { LocaleRecord } from "./types";

export const SKILLS_FAQS: LocaleRecord<FAQItem[]> = {
  en: [
    {
      question: "What are Dominik Könitzer's top technical skills?",
      answer:
        "Dominik Könitzer's top technical skills include React (95% proficiency), Next.js (90%), Java (90%), shadcn/ui (90%), TypeScript (80%), Node.js (85%), Spring Framework (85%), and Tailwind CSS (85%). He also has strong skills in Git, Docker, and various database systems.",
    },
    {
      question: "What programming languages does Dominik Könitzer know?",
      answer:
        "Dominik Könitzer is proficient in multiple programming languages including JavaScript (ES6+), TypeScript, Java, Python, C#, C++, and Bash scripting. He also works with query languages like GraphQL and SQL for database management.",
    },
    {
      question: "Does Dominik Könitzer have DevOps experience?",
      answer:
        "Yes, Dominik Könitzer has DevOps experience including Windows Server (85%), Linux Server (80%), Ubuntu (80%), Jenkins (80%), Docker (85%), and Grafana (65%). He also has experience with hardware installation and server management.",
    },
    {
      question: "What databases does Dominik Könitzer work with?",
      answer:
        "Dominik Könitzer works with multiple database systems including SQLite (85%), PostgreSQL (80%), MongoDB (80%), and Redis (75%). He has experience in both relational and NoSQL database management.",
    },
  ],
  de: [
    {
      question: "Was sind Dominik Könitzers wichtigste technische Skills?",
      answer:
        "Zu Dominik Könitzers wichtigsten technischen Skills zählen React (95 %), Next.js (90 %), Java (90 %), shadcn/ui (90 %), TypeScript (80 %), Node.js (85 %), Spring Framework (85 %) und Tailwind CSS (85 %). Zudem ist er stark in Git, Docker und verschiedenen Datenbanksystemen.",
    },
    {
      question: "Welche Programmiersprachen kennt Dominik Könitzer?",
      answer:
        "Dominik Könitzer beherrscht mehrere Programmiersprachen, darunter JavaScript (ES6+), TypeScript, Java, Python, C#, C++ und Bash-Scripting. Er arbeitet zudem mit Query-Sprachen wie GraphQL und SQL für die Datenbankverwaltung.",
    },
    {
      question: "Hat Dominik Könitzer DevOps-Erfahrung?",
      answer:
        "Ja, Dominik Könitzer hat DevOps-Erfahrung, darunter Windows Server (85 %), Linux Server (80 %), Ubuntu (80 %), Jenkins (80 %), Docker (85 %) und Grafana (65 %). Er hat zudem Erfahrung mit Hardware-Installation und Server-Management.",
    },
    {
      question: "Mit welchen Datenbanken arbeitet Dominik Könitzer?",
      answer:
        "Dominik Könitzer arbeitet mit mehreren Datenbanksystemen, darunter SQLite (85 %), PostgreSQL (80 %), MongoDB (80 %) und Redis (75 %). Er hat Erfahrung sowohl mit relationalen als auch mit NoSQL-Datenbanken.",
    },
  ],
  fr: [
    {
      question:
        "Quelles sont les principales compétences techniques de Dominik Könitzer ?",
      answer:
        "Les principales compétences techniques de Dominik Könitzer incluent React (95 %), Next.js (90 %), Java (90 %), shadcn/ui (90 %), TypeScript (80 %), Node.js (85 %), Spring Framework (85 %) et Tailwind CSS (85 %). Il maîtrise également Git, Docker et divers systèmes de bases de données.",
    },
    {
      question: "Quels langages de programmation Dominik Könitzer connaît-il ?",
      answer:
        "Dominik Könitzer maîtrise plusieurs langages de programmation, dont JavaScript (ES6+), TypeScript, Java, Python, C#, C++ et le scripting Bash. Il travaille aussi avec des langages de requête tels que GraphQL et SQL pour la gestion des bases de données.",
    },
    {
      question: "Dominik Könitzer a-t-il une expérience DevOps ?",
      answer:
        "Oui, Dominik Könitzer a une expérience DevOps incluant Windows Server (85 %), Linux Server (80 %), Ubuntu (80 %), Jenkins (80 %), Docker (85 %) et Grafana (65 %). Il a également de l'expérience en installation matérielle et en gestion de serveurs.",
    },
    {
      question:
        "Avec quelles bases de données Dominik Könitzer travaille-t-il ?",
      answer:
        "Dominik Könitzer travaille avec plusieurs systèmes de bases de données dont SQLite (85 %), PostgreSQL (80 %), MongoDB (80 %) et Redis (75 %). Il a de l'expérience à la fois en bases de données relationnelles et NoSQL.",
    },
  ],
  zh: [
    {
      question: "Dominik Könitzer 的核心技术技能有哪些？",
      answer:
        "Dominik Könitzer 的核心技术技能包括 React（95%）、Next.js（90%）、Java（90%）、shadcn/ui（90%）、TypeScript（80%）、Node.js（85%）、Spring Framework（85%）与 Tailwind CSS（85%）。他在 Git、Docker 与多种数据库系统方面也具备扎实能力。",
    },
    {
      question: "Dominik Könitzer 熟悉哪些编程语言？",
      answer:
        "Dominik Könitzer 熟悉多种编程语言，包括 JavaScript（ES6+）、TypeScript、Java、Python、C#、C++ 以及 Bash 脚本。他也使用 GraphQL 与 SQL 等查询语言进行数据库管理。",
    },
    {
      question: "Dominik Könitzer 是否具备 DevOps 经验？",
      answer:
        "是的，Dominik Könitzer 具备 DevOps 经验，包括 Windows Server（85%）、Linux Server（80%）、Ubuntu（80%）、Jenkins（80%）、Docker（85%）与 Grafana（65%）。他也有硬件安装与服务器管理的经验。",
    },
    {
      question: "Dominik Könitzer 使用哪些数据库？",
      answer:
        "Dominik Könitzer 使用多种数据库系统，包括 SQLite（85%）、PostgreSQL（80%）、MongoDB（80%）与 Redis（75%）。他对关系型与 NoSQL 数据库均有经验。",
    },
  ],
};

export const getSkillsFaqs = (lang: Language) =>
  SKILLS_FAQS[lang] ?? SKILLS_FAQS.en;
