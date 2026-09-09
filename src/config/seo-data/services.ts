import type { Language } from "@/config/languages";
import type { FAQItem, HowToSchema } from "@/types/seo";
import type { LocaleRecord } from "./types";

export const SERVICES_FAQS: LocaleRecord<FAQItem[]> = {
  en: [
    {
      question: "What web development services do you offer?",
      answer:
        "Here they all are, with prices: web development (from 2'000 CHF), custom software (from 3'000 CHF, priced per project), server setup (600 CHF), security consultation (100 CHF/hour), hosting and maintenance (50 CHF/month), website emergency (300 CHF fixed), SEO optimization (500 CHF), website relaunch (from 1'500 CHF) and support and content work (80 CHF/hour).",
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
        "50 CHF per month, hosting included. That covers the server, security updates, daily backups, uptime monitoring and small fixes, so the site does not quietly rot between releases.",
    },
    {
      question: "Do you provide security consultation services?",
      answer:
        "Yes, at 100 CHF per hour. Security audits, vulnerability assessments, hardening against the usual mistakes, and guidance on compliance. You get a written list of what I found and what to do about it.",
    },
    {
      question: "Can you help with custom software development?",
      answer:
        "Yes, from 3'000 CHF, priced per project. That runs from working out the requirements through design, development, testing and deployment, and I stay available for maintenance afterwards.",
    },
  ],
  de: [
    {
      question: "Welche Webentwicklungs-Leistungen bietest du an?",
      answer:
        "Hier sind sie alle, mit Preisen: Webentwicklung (ab 2'000 CHF), individuelle Software (ab 3'000 CHF, projektbezogen), Server-Setup (600 CHF), Security-Beratung (100 CHF/Stunde), Hosting und Wartung (50 CHF/Monat), Website-Notfall (300 CHF Fixpreis), SEO-Optimierung (500 CHF), Website-Relaunch (ab 1'500 CHF) sowie Support und Inhalte (80 CHF/Stunde).",
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
        "50 CHF pro Monat, Hosting inklusive. Darin enthalten sind der Server, Sicherheitsupdates, tägliche Backups, Uptime-Monitoring und kleine Korrekturen, damit die Seite zwischen zwei Releases nicht still vor sich hin verfällt.",
    },
    {
      question: "Bietest du Security-Beratungen an?",
      answer:
        "Ja, zu 100 CHF pro Stunde. Security-Audits, Schwachstellenbewertungen, Härtung gegen die üblichen Fehler und Begleitung bei der Compliance. Du bekommst schriftlich, was ich gefunden habe und was dagegen zu tun ist.",
    },
    {
      question: "Kannst du bei individueller Softwareentwicklung helfen?",
      answer:
        "Ja, ab 3'000 CHF, projektbezogen abgerechnet. Das reicht von der Anforderungsanalyse über Design, Entwicklung und Tests bis zum Deployment, und danach bleibe ich für die Wartung erreichbar.",
    },
  ],
  fr: [
    {
      question: "Quels services de développement web proposez-vous ?",
      answer:
        "Les voici tous, avec les tarifs : développement web (dès 2'000 CHF), logiciel sur mesure (à partir de 3'000 CHF au projet), configuration serveur (600 CHF), conseil en sécurité (100 CHF/heure), hébergement et maintenance (50 CHF/mois), urgence site web (300 CHF forfait), optimisation SEO (500 CHF), refonte de site (dès 1'500 CHF) et support et contenu (80 CHF/heure).",
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
        "50 CHF par mois, hébergement compris. Cela couvre le serveur, les mises à jour de sécurité, les sauvegardes quotidiennes, le monitoring de disponibilité et les petites corrections, pour que le site ne se dégrade pas en silence entre deux versions.",
    },
    {
      question: "Fournissez-vous des services de conseil en sécurité ?",
      answer:
        "Oui, à 100 CHF par heure. Audits, évaluations de vulnérabilités, durcissement contre les erreurs classiques et accompagnement à la conformité. Vous repartez avec la liste écrite de ce que j'ai trouvé et de ce qu'il faut corriger.",
    },
    {
      question: "Pouvez-vous aider au développement logiciel sur mesure ?",
      answer:
        "Oui, à partir de 3'000 CHF, facturé au projet. Cela va de l'analyse des besoins à la conception, au développement, aux tests et au déploiement, et je reste disponible ensuite pour la maintenance.",
    },
  ],
  zh: [
    {
      question: "您提供哪些网页开发服务？",
      answer:
        "全部在这里，附价格：网页开发（2'000 瑞士法郎起）、定制软件（按项目，3'000 瑞士法郎起）、服务器配置（600 瑞士法郎）、安全咨询（100 瑞士法郎/小时）、托管与维护（50 瑞士法郎/月）、网站急救（固定 300 瑞士法郎）、SEO 优化（500 瑞士法郎）、网站改版（1'500 瑞士法郎起）以及支持与内容（80 瑞士法郎/小时）。",
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
        "每月 50 瑞士法郎，含托管。包含服务器、安全更新、每日备份、正常运行监控和小修小补，让网站不会在两次发布之间悄悄坏掉。",
    },
    {
      question: "您是否提供安全咨询服务？",
      answer:
        "提供，每小时 100 瑞士法郎。安全审计、漏洞评估、针对常见疏漏的加固，以及合规方面的建议。你会拿到一份书面清单：我发现了什么，该怎么处理。",
    },
    {
      question: "您能否帮助定制软件开发？",
      answer:
        "可以，3'000 瑞士法郎起，按项目计价。从梳理需求到设计、开发、测试和部署，之后的维护我也接着管。",
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
        text: "Read through the services on this page: web development, custom software, server setup, security consultation, hosting and maintenance, website emergency, SEO optimization, website relaunch and support and content work.",
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
        text: "Sieh dir die Leistungen auf dieser Seite an: Webentwicklung, individuelle Software, Server-Setup, Security-Beratung, Hosting und Wartung, Website-Notfall, SEO-Optimierung, Website-Relaunch sowie Support und Inhalte.",
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
        text: "Parcourez les services de cette page : développement web, logiciel sur mesure, configuration serveur, conseil en sécurité, hébergement et maintenance, urgence site web, optimisation SEO, refonte de site et support et contenu.",
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
        text: "看一遍本页的服务：网页开发、定制软件、服务器配置、安全咨询、托管与维护、网站急救、SEO 优化、网站改版以及支持与内容。",
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
