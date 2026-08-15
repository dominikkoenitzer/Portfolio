import type { Language } from "@/config/languages";
import type { FAQItem } from "@/types/seo";
import type { LocaleRecord } from "./types";

export const SKILLS_FAQS: LocaleRecord<FAQItem[]> = {
  en: [
    {
      question: "What are Dominik Könitzer's top technical skills?",
      answer:
        "Dominik Könitzer's top technical skills include React, Next.js, Java, shadcn/ui, TypeScript, Node.js, Spring Framework, and Tailwind CSS. He also has strong skills in Git, Docker, and various database systems.",
    },
    {
      question: "What programming languages does Dominik Könitzer know?",
      answer:
        "Dominik Könitzer is proficient in multiple programming languages including JavaScript (ES6+), TypeScript, Java, Python, C#, C++, and Bash scripting. He also works with query languages like GraphQL and SQL for database management.",
    },
    {
      question: "Does Dominik Könitzer have DevOps experience?",
      answer:
        "Yes, Dominik Könitzer has DevOps experience including Windows Server, Linux Server, Ubuntu, Jenkins, Docker, and Grafana. He also has experience with hardware installation and server management.",
    },
    {
      question: "What databases does Dominik Könitzer work with?",
      answer:
        "Dominik Könitzer works with multiple database systems including SQLite, PostgreSQL, MongoDB, and Redis. He has experience in both relational and NoSQL database management.",
    },
  ],
  de: [
    {
      question: "Was sind Dominik Könitzers wichtigste technische Skills?",
      answer:
        "Zu Dominik Könitzers wichtigsten technischen Skills zählen React, Next.js, Java, shadcn/ui, TypeScript, Node.js, Spring Framework und Tailwind CSS. Zudem ist er stark in Git, Docker und verschiedenen Datenbanksystemen.",
    },
    {
      question: "Welche Programmiersprachen kennt Dominik Könitzer?",
      answer:
        "Dominik Könitzer beherrscht mehrere Programmiersprachen, darunter JavaScript (ES6+), TypeScript, Java, Python, C#, C++ und Bash-Scripting. Er arbeitet zudem mit Query-Sprachen wie GraphQL und SQL für die Datenbankverwaltung.",
    },
    {
      question: "Hat Dominik Könitzer DevOps-Erfahrung?",
      answer:
        "Ja, Dominik Könitzer hat DevOps-Erfahrung, darunter Windows Server, Linux Server, Ubuntu, Jenkins, Docker und Grafana. Er hat zudem Erfahrung mit Hardware-Installation und Server-Management.",
    },
    {
      question: "Mit welchen Datenbanken arbeitet Dominik Könitzer?",
      answer:
        "Dominik Könitzer arbeitet mit mehreren Datenbanksystemen, darunter SQLite, PostgreSQL, MongoDB und Redis. Er hat Erfahrung sowohl mit relationalen als auch mit NoSQL-Datenbanken.",
    },
  ],
  fr: [
    {
      question:
        "Quelles sont les principales compétences techniques de Dominik Könitzer ?",
      answer:
        "Les principales compétences techniques de Dominik Könitzer incluent React, Next.js, Java, shadcn/ui, TypeScript, Node.js, Spring Framework et Tailwind CSS. Il maîtrise également Git, Docker et divers systèmes de bases de données.",
    },
    {
      question: "Quels langages de programmation Dominik Könitzer connaît-il ?",
      answer:
        "Dominik Könitzer maîtrise plusieurs langages de programmation, dont JavaScript (ES6+), TypeScript, Java, Python, C#, C++ et le scripting Bash. Il travaille aussi avec des langages de requête tels que GraphQL et SQL pour la gestion des bases de données.",
    },
    {
      question: "Dominik Könitzer a-t-il une expérience DevOps ?",
      answer:
        "Oui, Dominik Könitzer a une expérience DevOps incluant Windows Server, Linux Server, Ubuntu, Jenkins, Docker et Grafana. Il a également de l'expérience en installation matérielle et en gestion de serveurs.",
    },
    {
      question:
        "Avec quelles bases de données Dominik Könitzer travaille-t-il ?",
      answer:
        "Dominik Könitzer travaille avec plusieurs systèmes de bases de données dont SQLite, PostgreSQL, MongoDB et Redis. Il a de l'expérience à la fois en bases de données relationnelles et NoSQL.",
    },
  ],
  zh: [
    {
      question: "Dominik Könitzer 的核心技术技能有哪些？",
      answer:
        "Dominik Könitzer 的核心技术技能包括 React、Next.js、Java、shadcn/ui、TypeScript、Node.js、Spring Framework 与 Tailwind CSS。他在 Git、Docker 与多种数据库系统方面也具备扎实能力。",
    },
    {
      question: "Dominik Könitzer 熟悉哪些编程语言？",
      answer:
        "Dominik Könitzer 熟悉多种编程语言，包括 JavaScript（ES6+）、TypeScript、Java、Python、C#、C++ 以及 Bash 脚本。他也使用 GraphQL 与 SQL 等查询语言进行数据库管理。",
    },
    {
      question: "Dominik Könitzer 是否具备 DevOps 经验？",
      answer:
        "是的，Dominik Könitzer 具备 DevOps 经验，包括 Windows Server、Linux Server、Ubuntu、Jenkins、Docker 与 Grafana。他也有硬件安装与服务器管理的经验。",
    },
    {
      question: "Dominik Könitzer 使用哪些数据库？",
      answer:
        "Dominik Könitzer 使用多种数据库系统，包括 SQLite、PostgreSQL、MongoDB 与 Redis。他对关系型与 NoSQL 数据库均有经验。",
    },
  ],
};

export const getSkillsFaqs = (lang: Language) =>
  SKILLS_FAQS[lang] ?? SKILLS_FAQS.en;
