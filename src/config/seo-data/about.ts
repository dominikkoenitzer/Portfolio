import type { Language } from "@/config/languages";
import type { FAQItem } from "@/types/seo";
import type { LocaleRecord } from "./types";

export const ABOUT_FAQS: LocaleRecord<FAQItem[]> = {
  en: [
    {
      question: "How old is Dominik Könitzer?",
      answer:
        "Dominik Könitzer is 17 years old and currently in his sixth semester of a 4-year software engineering program at WISS Schulen für Wirtschaft Informatik Immobilien in Switzerland.",
    },
    {
      question: "What is Dominik Könitzer's educational background?",
      answer:
        "Dominik Könitzer is currently studying at WISS Schulen für Wirtschaft Informatik Immobilien in a 4-year software engineering program. The program consists of two years of coursework followed by two years of practical internship with ongoing studies, providing both theoretical knowledge and hands-on experience.",
    },
    {
      question: "What drives Dominik Könitzer's passion for web development?",
      answer:
        "Dominik Könitzer enjoys creating clean, functional, and visually appealing websites and applications that provide real value to users. Beyond technical skills, he values continuous learning, problem-solving, and effective communication in software development.",
    },
  ],
  de: [
    {
      question: "Wie alt ist Dominik Könitzer?",
      answer:
        "Dominik Könitzer ist 17 Jahre alt und befindet sich derzeit im sechsten Semester eines vierjährigen Software-Engineering-Programms an der WISS Schule für Wirtschaft Informatik Immobilien in der Schweiz.",
    },
    {
      question: "Was ist Dominik Könitzers Bildungshintergrund?",
      answer:
        "Dominik Könitzer studiert derzeit an der WISS Schule für Wirtschaft Informatik Immobilien in einem vierjährigen Software-Engineering-Programm. Das Programm besteht aus zwei Jahren theoretischem Unterricht und zwei Jahren praktischem Praktikum mit begleitenden Studien — eine Kombination aus Theorie und Praxis.",
    },
    {
      question:
        "Was treibt Dominik Könitzers Leidenschaft für Webentwicklung an?",
      answer:
        "Dominik Könitzer gestaltet gerne saubere, funktionale und ästhetisch ansprechende Websites und Anwendungen, die echten Mehrwert für Nutzer schaffen. Neben technischen Fähigkeiten legt er Wert auf kontinuierliches Lernen, Problemlösung und klare Kommunikation.",
    },
  ],
  fr: [
    {
      question: "Quel âge a Dominik Könitzer ?",
      answer:
        "Dominik Könitzer a 17 ans et se trouve actuellement dans son sixième semestre d'un programme d'ingénierie logicielle de 4 ans à la WISS Schulen für Wirtschaft Informatik Immobilien en Suisse.",
    },
    {
      question: "Quel est le parcours éducatif de Dominik Könitzer ?",
      answer:
        "Dominik Könitzer étudie actuellement à la WISS Schulen für Wirtschaft Informatik Immobilien dans un programme d'ingénierie logicielle de 4 ans. Le programme comprend deux années de cours suivies de deux années de stage pratique avec poursuite des études, combinant connaissances théoriques et expérience concrète.",
    },
    {
      question:
        "Qu'est-ce qui anime la passion de Dominik Könitzer pour le développement web ?",
      answer:
        "Dominik Könitzer aime créer des sites et applications propres, fonctionnels et visuellement attrayants qui apportent une vraie valeur aux utilisateurs. Au-delà des compétences techniques, il valorise l'apprentissage continu, la résolution de problèmes et une communication efficace.",
    },
  ],
  zh: [
    {
      question: "Dominik Könitzer 多大？",
      answer:
        "Dominik Könitzer 现年 17 岁，目前就读于瑞士 WISS Schulen für Wirtschaft Informatik Immobilien 的四年制软件工程项目第六学期。",
    },
    {
      question: "Dominik Könitzer 的教育背景是什么？",
      answer:
        "Dominik Könitzer 目前就读于 WISS Schulen für Wirtschaft Informatik Immobilien 的四年制软件工程项目。该项目包含两年课程学习，随后两年是边实习边学习的实践阶段，兼顾理论知识与实操经验。",
    },
    {
      question: "是什么驱动 Dominik Könitzer 对网页开发的热情？",
      answer:
        "Dominik Könitzer 喜欢创建整洁、实用且视觉上吸引人的网站与应用，为用户带来真实价值。除了技术能力，他也重视持续学习、解决问题与有效沟通。",
    },
  ],
};

export const getAboutFaqs = (lang: Language) =>
  ABOUT_FAQS[lang] ?? ABOUT_FAQS.en;
