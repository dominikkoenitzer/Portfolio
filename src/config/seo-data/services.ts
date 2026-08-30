import type { Language } from "@/config/languages";
import type { FAQItem, HowToSchema } from "@/types/seo";
import type { LocaleRecord } from "./types";

export const SERVICES_FAQS: LocaleRecord<FAQItem[]> = {
  en: [
    {
      question: "What web development services do you offer?",
      answer:
        "Here they all are, with prices: website maintenance (50 CHF/month), technical support (30 CHF/hour), content management (40 CHF/hour), security consultation (60 CHF/hour), data backup solutions (200 CHF setup + 50 CHF/month), SEO optimization (150 CHF one-time), custom web development (300 CHF one-time), server setup (350 CHF one-time), and custom software development (500 CHF project-based).",
    },
    {
      question: "Do you work with clients in Switzerland?",
      answer:
        "Yes. I am based in Switzerland and work with clients here and abroad, for companies and for individuals. Everything is priced in Swiss Francs (CHF).",
    },
    {
      question: "What technologies do you use for web development?",
      answer:
        "Mostly React, Next.js, TypeScript, JavaScript, Node.js, Java and the Spring Framework, on the frontend and the backend alike. On the data and tooling side: PostgreSQL, MongoDB, SQLite, Docker, Jenkins and Git.",
    },
    {
      question: "How much does website maintenance cost?",
      answer:
        "50 CHF per month. That covers security updates, bug fixes, performance monitoring, content updates and technical support, so the site does not quietly rot between releases.",
    },
    {
      question: "Do you provide security consultation services?",
      answer:
        "Yes, at 60 CHF per hour. Security audits, vulnerability assessments, hardening against the usual mistakes, and guidance on compliance. You get a written list of what I found and what to do about it.",
    },
    {
      question: "Can you help with custom software development?",
      answer:
        "Yes, from 500 CHF, priced per project. That runs from working out the requirements through design, development, testing and deployment, and I stay available for maintenance afterwards.",
    },
  ],
  de: [
    {
      question: "Welche Webentwicklungs-Leistungen bietest du an?",
      answer:
        "Hier sind sie alle, mit Preisen: Website-Wartung (50 CHF/Monat), technischer Support (30 CHF/Stunde), Content-Management (40 CHF/Stunde), Security-Beratung (60 CHF/Stunde), Backup-Lösungen (200 CHF Setup + 50 CHF/Monat), SEO-Optimierung (150 CHF einmalig), individuelle Webentwicklung (300 CHF einmalig), Server-Setup (350 CHF einmalig) und individuelle Softwareentwicklung (ab 500 CHF, projektbezogen).",
    },
    {
      question: "Arbeitest du mit Kunden in der Schweiz?",
      answer:
        "Ja. Ich sitze in der Schweiz und arbeite mit Kunden hier und im Ausland, für Firmen genauso wie für Privatpersonen. Alle Preise verstehen sich in Schweizer Franken (CHF).",
    },
    {
      question: "Welche Technologien nutzt du für die Webentwicklung?",
      answer:
        "Hauptsächlich React, Next.js, TypeScript, JavaScript, Node.js, Java und das Spring Framework, im Frontend wie im Backend. Bei Daten und Tooling: PostgreSQL, MongoDB, SQLite, Docker, Jenkins und Git.",
    },
    {
      question: "Wie viel kostet Website-Wartung?",
      answer:
        "50 CHF pro Monat. Darin enthalten sind Sicherheitsupdates, Bugfixes, Performance-Monitoring, Content-Updates und technischer Support, damit die Seite zwischen zwei Releases nicht still vor sich hin verfällt.",
    },
    {
      question: "Bietest du Security-Beratungen an?",
      answer:
        "Ja, zu 60 CHF pro Stunde. Security-Audits, Schwachstellenbewertungen, Härtung gegen die üblichen Fehler und Begleitung bei der Compliance. Du bekommst schriftlich, was ich gefunden habe und was dagegen zu tun ist.",
    },
    {
      question: "Kannst du bei individueller Softwareentwicklung helfen?",
      answer:
        "Ja, ab 500 CHF, projektbezogen abgerechnet. Das reicht von der Anforderungsanalyse über Design, Entwicklung und Tests bis zum Deployment, und danach bleibe ich für die Wartung erreichbar.",
    },
  ],
  fr: [
    {
      question: "Quels services de développement web proposez-vous ?",
      answer:
        "Les voici tous, avec les tarifs : maintenance de sites (50 CHF/mois), support technique (30 CHF/heure), gestion de contenu (40 CHF/heure), conseil en sécurité (60 CHF/heure), solutions de sauvegarde (200 CHF installation + 50 CHF/mois), optimisation SEO (150 CHF forfait), développement web sur mesure (300 CHF forfait), configuration serveur (350 CHF forfait) et développement logiciel sur mesure (à partir de 500 CHF au projet).",
    },
    {
      question: "Travaillez-vous avec des clients en Suisse ?",
      answer:
        "Oui. Je suis basé en Suisse et je travaille avec des clients ici comme à l'étranger, entreprises et particuliers. Tout est facturé en francs suisses (CHF).",
    },
    {
      question:
        "Quelles technologies utilisez-vous pour le développement web ?",
      answer:
        "Surtout React, Next.js, TypeScript, JavaScript, Node.js, Java et Spring Framework, côté frontend comme côté backend. Pour les données et l'outillage : PostgreSQL, MongoDB, SQLite, Docker, Jenkins et Git.",
    },
    {
      question: "Combien coûte la maintenance de site web ?",
      answer:
        "50 CHF par mois. Cela couvre les mises à jour de sécurité, les corrections de bugs, le suivi des performances, les mises à jour de contenu et le support technique, pour que le site ne se dégrade pas en silence entre deux versions.",
    },
    {
      question: "Fournissez-vous des services de conseil en sécurité ?",
      answer:
        "Oui, à 60 CHF par heure. Audits, évaluations de vulnérabilités, durcissement contre les erreurs classiques et accompagnement à la conformité. Vous repartez avec la liste écrite de ce que j'ai trouvé et de ce qu'il faut corriger.",
    },
    {
      question: "Pouvez-vous aider au développement logiciel sur mesure ?",
      answer:
        "Oui, à partir de 500 CHF, facturé au projet. Cela va de l'analyse des besoins à la conception, au développement, aux tests et au déploiement, et je reste disponible ensuite pour la maintenance.",
    },
  ],
  zh: [
    {
      question: "您提供哪些网页开发服务？",
      answer:
        "全部在这里，附价格：网站维护（50 瑞士法郎/月）、技术支持（30 瑞士法郎/小时）、内容管理（40 瑞士法郎/小时）、安全咨询（60 瑞士法郎/小时）、数据备份方案（设置 200 瑞士法郎 + 50 瑞士法郎/月）、SEO 优化（一次性 150 瑞士法郎）、定制网页开发（一次性 300 瑞士法郎）、服务器配置（一次性 350 瑞士法郎）以及定制软件开发（按项目，500 瑞士法郎起）。",
    },
    {
      question: "您是否服务瑞士客户？",
      answer:
        "是的。我常驻瑞士，本地和海外的客户都接，企业和个人都可以。所有服务均以瑞士法郎（CHF）计价。",
    },
    {
      question: "您使用哪些技术进行网页开发？",
      answer:
        "主要是 React、Next.js、TypeScript、JavaScript、Node.js、Java 和 Spring Framework，前端后端都写。数据和工具方面：PostgreSQL、MongoDB、SQLite、Docker、Jenkins 和 Git。",
    },
    {
      question: "网站维护费用是多少？",
      answer:
        "每月 50 瑞士法郎。包含安全更新、缺陷修复、性能监控、内容更新和技术支持，让网站不会在两次发布之间悄悄坏掉。",
    },
    {
      question: "您是否提供安全咨询服务？",
      answer:
        "提供，每小时 60 瑞士法郎。安全审计、漏洞评估、针对常见疏漏的加固，以及合规方面的建议。你会拿到一份书面清单：我发现了什么，该怎么处理。",
    },
    {
      question: "您能否帮助定制软件开发？",
      answer:
        "可以，500 瑞士法郎起，按项目计价。从梳理需求到设计、开发、测试和部署，之后的维护我也接着管。",
    },
  ],
};

export const SERVICES_HOW_TO: LocaleRecord<HowToSchema> = {
  en: {
    name: "How to Hire Dominik Könitzer for Web Development Services",
    description:
      "Step-by-step guide to engaging Dominik Könitzer for software engineering and web development services",
    step: [
      {
        name: "Pick what you need",
        text: "Read through the services on this page: website maintenance, technical support, content management, security consultation, data backup, SEO optimization, web development, server setup and custom software development.",
      },
      {
        name: "Send a message",
        text: "Head to dk.punds.ch/contact and pick what your message is about. That opens an email with the subject and a short template already filled in. Tell me what you need, roughly when you need it, and what the budget looks like.",
      },
      {
        name: "Get a proposal",
        text: "I come back with a written proposal: what is in scope, how long it takes, what it costs and what you end up holding at the end.",
      },
      {
        name: "The build",
        text: "Once you approve it, work starts. You get regular updates, so the state of the project is never a surprise.",
      },
      {
        name: "Handover",
        text: "You get the finished project and its documentation. If you want someone keeping an eye on it afterwards, there are maintenance packages for exactly that.",
      },
    ],
  },
  de: {
    name: "Wie du Dominik Könitzer für Webentwicklungs-Leistungen engagierst",
    description:
      "Schritt-für-Schritt-Anleitung, um Dominik Könitzer für Software-Engineering- und Webentwicklungs-Leistungen zu beauftragen",
    step: [
      {
        name: "Aussuchen, was du brauchst",
        text: "Sieh dir die Leistungen auf dieser Seite an: Website-Wartung, technischer Support, Content-Management, Security-Beratung, Datensicherung, SEO-Optimierung, Webentwicklung, Server-Setup und individuelle Softwareentwicklung.",
      },
      {
        name: "Nachricht schreiben",
        text: "Geh auf dk.punds.ch/contact und wähl aus, worum es geht. Damit öffnet sich eine E-Mail mit fertigem Betreff und kurzer Vorlage. Schreib rein, was du brauchst, bis wann ungefähr und wie das Budget aussieht.",
      },
      {
        name: "Angebot bekommen",
        text: "Ich melde mich mit einem schriftlichen Angebot: was dazugehört, wie lange es dauert, was es kostet und was am Ende bei dir liegt.",
      },
      {
        name: "Die Umsetzung",
        text: "Sobald du zusagst, geht es los. Du bekommst regelmässig Updates, damit der Stand des Projekts nie eine Überraschung ist.",
      },
      {
        name: "Übergabe",
        text: "Du bekommst das fertige Projekt samt Dokumentation. Wenn danach jemand ein Auge darauf haben soll, gibt es genau dafür Wartungspakete.",
      },
    ],
  },
  fr: {
    name: "Comment engager Dominik Könitzer pour des services de développement web",
    description:
      "Guide étape par étape pour faire appel à Dominik Könitzer pour des services d'ingénierie logicielle et de développement web",
    step: [
      {
        name: "Choisissez ce qu'il vous faut",
        text: "Parcourez les services de cette page : maintenance de site, support technique, gestion de contenu, conseil en sécurité, sauvegarde de données, optimisation SEO, développement web, configuration serveur et développement logiciel sur mesure.",
      },
      {
        name: "Écrivez-moi",
        text: "Rendez-vous sur dk.punds.ch/contact et choisissez l'objet de votre message. Un e-mail s'ouvre avec l'objet et un court modèle déjà prêts. Dites-moi ce qu'il vous faut, à peu près pour quand, et le budget envisagé.",
      },
      {
        name: "Recevez une proposition",
        text: "Je reviens vers vous avec une proposition écrite : ce qui est compris, le délai, le prix et ce que vous aurez entre les mains à la fin.",
      },
      {
        name: "La réalisation",
        text: "Dès que vous validez, le travail commence. Vous recevez des nouvelles régulièrement, donc l'état du projet ne vous surprend jamais.",
      },
      {
        name: "La remise",
        text: "Vous recevez le projet terminé et sa documentation. Si vous voulez que quelqu'un continue à le surveiller, il existe des forfaits de maintenance pour ça.",
      },
    ],
  },
  zh: {
    name: "如何聘请 Dominik Könitzer 提供网页开发服务",
    description: "聘请 Dominik Könitzer 进行软件工程与网页开发服务的分步指南",
    step: [
      {
        name: "挑出你需要的",
        text: "看一遍本页的服务：网站维护、技术支持、内容管理、安全咨询、数据备份、SEO 优化、网页开发、服务器配置以及定制软件开发。",
      },
      {
        name: "发一封邮件",
        text: "前往 dk.punds.ch/contact 并选择你想聊的主题，系统会打开一封主题和简短模板都已填好的邮件。写清楚你需要什么、大概什么时候要、预算大致多少。",
      },
      {
        name: "拿到方案",
        text: "我会回你一份书面方案：做哪些、要多久、多少钱，以及最后交到你手上的是什么。",
      },
      {
        name: "开始做",
        text: "你点头之后就开工。进度会定期同步，项目走到哪一步不会让你意外。",
      },
      {
        name: "交付",
        text: "你会拿到做完的项目和配套文档。如果之后想有人继续盯着，正好有维护套餐可以选。",
      },
    ],
  },
};

export const getServicesFaqs = (lang: Language) =>
  SERVICES_FAQS[lang] ?? SERVICES_FAQS.en;
export const getServicesHowTo = (lang: Language) =>
  SERVICES_HOW_TO[lang] ?? SERVICES_HOW_TO.en;
