import type { Language } from "@/config/languages";
import type { FAQItem, HowToSchema } from "@/types/seo";
import type { LocaleRecord } from "./types";

export const SERVICES_FAQS: LocaleRecord<FAQItem[]> = {
  en: [
    {
      question: "What web development services do you offer?",
      answer:
        "I offer comprehensive web development services including website maintenance (50 CHF/month), technical support (30 CHF/hour), content management (40 CHF/hour), security consultation (60 CHF/hour), data backup solutions (200 CHF setup + 50 CHF/month), SEO optimization (150 CHF one-time), custom web development (300 CHF one-time), server setup (350 CHF one-time), and custom software development (500 CHF project-based).",
    },
    {
      question: "Do you work with clients in Switzerland?",
      answer:
        "Yes, I am based in Switzerland and work with clients both locally and internationally. I can provide software engineering services to businesses and individuals in Switzerland and worldwide. All services are priced in Swiss Francs (CHF).",
    },
    {
      question: "What technologies do you use for web development?",
      answer:
        "I specialize in modern web technologies including React (95% proficiency), Next.js (90%), TypeScript (80%), JavaScript, Node.js (85%), Java (90%), Spring Framework (85%), and various frontend and backend frameworks. I also work with databases like PostgreSQL, MongoDB, and SQLite, and DevOps tools including Docker, Jenkins, and Git.",
    },
    {
      question: "How much does website maintenance cost?",
      answer:
        "Website maintenance is priced at 50 CHF per month and includes regular security updates, bug fixes, performance monitoring, content updates, and technical support to keep your website running smoothly and securely.",
    },
    {
      question: "Do you provide security consultation services?",
      answer:
        "Yes, I offer security consultation at 60 CHF per hour, which includes security audits, vulnerability assessments, security best practices implementation, risk mitigation strategies, and compliance guidance to protect your business from cyber threats.",
    },
    {
      question: "Can you help with custom software development?",
      answer:
        "Yes, I provide end-to-end custom software development services starting at 500 CHF (project-based pricing). This includes requirements analysis, custom solution design, development and testing, deployment assistance, and maintenance support tailored to your specific business needs.",
    },
  ],
  de: [
    {
      question: "Welche Webentwicklungs-Leistungen bietest du an?",
      answer:
        "Ich biete umfassende Webentwicklungs-Leistungen an, darunter Website-Wartung (50 CHF/Monat), technischen Support (30 CHF/Stunde), Content-Management (40 CHF/Stunde), Security-Beratung (60 CHF/Stunde), Backup-Lösungen (200 CHF Setup + 50 CHF/Monat), SEO-Optimierung (150 CHF einmalig), individuelle Webentwicklung (300 CHF einmalig), Server-Setup (350 CHF einmalig) und individuelle Softwareentwicklung (ab 500 CHF, projektbezogen).",
    },
    {
      question: "Arbeitest du mit Kunden in der Schweiz?",
      answer:
        "Ja, ich habe meinen Sitz in der Schweiz und arbeite sowohl mit lokalen als auch internationalen Kunden. Ich biete Software-Engineering-Leistungen für Unternehmen und Privatpersonen in der Schweiz und weltweit an. Alle Preise verstehen sich in Schweizer Franken (CHF).",
    },
    {
      question: "Welche Technologien nutzt du für die Webentwicklung?",
      answer:
        "Ich bin spezialisiert auf moderne Web-Technologien wie React (95 %), Next.js (90 %), TypeScript (80 %), JavaScript, Node.js (85 %), Java (90 %), Spring Framework (85 %) sowie verschiedene Frontend- und Backend-Frameworks. Ich arbeite zudem mit Datenbanken wie PostgreSQL, MongoDB und SQLite sowie DevOps-Tools wie Docker, Jenkins und Git.",
    },
    {
      question: "Wie viel kostet Website-Wartung?",
      answer:
        "Die Website-Wartung kostet 50 CHF pro Monat und umfasst regelmässige Sicherheitsupdates, Bugfixes, Performance-Monitoring, Content-Updates und technischen Support, damit deine Website reibungslos und sicher läuft.",
    },
    {
      question: "Bietest du Security-Beratungen an?",
      answer:
        "Ja, ich biete Security-Beratungen zu 60 CHF pro Stunde an. Diese umfasst Security-Audits, Schwachstellenbewertungen, Umsetzung von Best Practices, Strategien zur Risikominderung sowie Compliance-Begleitung, um dein Geschäft vor Cyberbedrohungen zu schützen.",
    },
    {
      question: "Kannst du bei individueller Softwareentwicklung helfen?",
      answer:
        "Ja, ich biete End-to-End-Entwicklung individueller Software ab 500 CHF (projektbasierte Preise). Das umfasst Anforderungsanalyse, individuelles Lösungsdesign, Entwicklung und Tests, Deployment-Unterstützung und Wartung — zugeschnitten auf deine geschäftlichen Anforderungen.",
    },
  ],
  fr: [
    {
      question: "Quels services de développement web proposez-vous ?",
      answer:
        "Je propose des services complets de développement web, dont la maintenance de sites (50 CHF/mois), le support technique (30 CHF/heure), la gestion de contenu (40 CHF/heure), le conseil en sécurité (60 CHF/heure), les solutions de sauvegarde (200 CHF installation + 50 CHF/mois), l'optimisation SEO (150 CHF forfait), le développement web sur mesure (300 CHF forfait), la configuration serveur (350 CHF forfait) et le développement logiciel sur mesure (à partir de 500 CHF au projet).",
    },
    {
      question: "Travaillez-vous avec des clients en Suisse ?",
      answer:
        "Oui, je suis basé en Suisse et je travaille avec des clients locaux et internationaux. Je peux fournir des services d'ingénierie logicielle à des entreprises et particuliers en Suisse et dans le monde entier. Tous les services sont facturés en francs suisses (CHF).",
    },
    {
      question:
        "Quelles technologies utilisez-vous pour le développement web ?",
      answer:
        "Je suis spécialisé dans les technologies web modernes : React (95 %), Next.js (90 %), TypeScript (80 %), JavaScript, Node.js (85 %), Java (90 %), Spring Framework (85 %) et divers frameworks frontend et backend. Je travaille aussi avec des bases de données comme PostgreSQL, MongoDB et SQLite, et des outils DevOps tels que Docker, Jenkins et Git.",
    },
    {
      question: "Combien coûte la maintenance de site web ?",
      answer:
        "La maintenance de site web est facturée 50 CHF par mois et inclut les mises à jour de sécurité régulières, les corrections de bugs, le suivi des performances, les mises à jour de contenu et le support technique pour maintenir votre site rapide et sécurisé.",
    },
    {
      question: "Fournissez-vous des services de conseil en sécurité ?",
      answer:
        "Oui, je propose des consultations en sécurité à 60 CHF par heure, comprenant audits de sécurité, évaluations de vulnérabilités, mise en place de bonnes pratiques, stratégies de réduction des risques et accompagnement à la conformité pour protéger votre activité contre les cybermenaces.",
    },
    {
      question: "Pouvez-vous aider au développement logiciel sur mesure ?",
      answer:
        "Oui, je propose un service complet de développement logiciel sur mesure à partir de 500 CHF (tarification au projet). Cela inclut l'analyse des besoins, la conception sur mesure, le développement et les tests, l'aide au déploiement et le support de maintenance, adaptés à vos besoins métiers spécifiques.",
    },
  ],
  zh: [
    {
      question: "您提供哪些网页开发服务？",
      answer:
        "我提供全面的网页开发服务，包括网站维护（50 瑞士法郎/月）、技术支持（30 瑞士法郎/小时）、内容管理（40 瑞士法郎/小时）、安全咨询（60 瑞士法郎/小时）、数据备份方案（设置 200 瑞士法郎 + 50 瑞士法郎/月）、SEO 优化（一次性 150 瑞士法郎）、定制网页开发（一次性 300 瑞士法郎）、服务器配置（一次性 350 瑞士法郎）以及定制软件开发（按项目，500 瑞士法郎起）。",
    },
    {
      question: "您是否服务瑞士客户？",
      answer:
        "是的，我常驻瑞士，同时为本地与国际客户提供服务。我可以为瑞士及全球的企业与个人提供软件工程服务。所有服务均以瑞士法郎（CHF）计价。",
    },
    {
      question: "您使用哪些技术进行网页开发？",
      answer:
        "我擅长现代网页技术，包括 React（95%）、Next.js（90%）、TypeScript（80%）、JavaScript、Node.js（85%）、Java（90%）、Spring Framework（85%）以及多种前后端框架。我也使用 PostgreSQL、MongoDB、SQLite 等数据库，以及 Docker、Jenkins、Git 等 DevOps 工具。",
    },
    {
      question: "网站维护费用是多少？",
      answer:
        "网站维护费用为每月 50 瑞士法郎，包括定期安全更新、缺陷修复、性能监控、内容更新及技术支持，确保您的网站安全稳定地运行。",
    },
    {
      question: "您是否提供安全咨询服务？",
      answer:
        "是的，我提供安全咨询服务，每小时 60 瑞士法郎，包括安全审计、漏洞评估、安全最佳实践落地、风险缓解策略与合规指导，帮助您的业务抵御网络威胁。",
    },
    {
      question: "您能否帮助定制软件开发？",
      answer:
        "可以。我提供端到端的定制软件开发服务，起价为 500 瑞士法郎（按项目计价）。包含需求分析、方案设计、开发与测试、部署支持以及维护服务，根据您的具体业务需求量身打造。",
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
        name: "Review Services",
        text: "Browse the available services on this page including website maintenance, technical support, content management, security consultation, data backup, SEO optimization, web development, server setup, and custom software development.",
      },
      {
        name: "Contact for Consultation",
        text: "Use the contact form at dominikkoenitzer.ch/contact to discuss your project requirements, timeline, and budget. Provide details about your current website or software needs.",
      },
      {
        name: "Receive Proposal",
        text: "Receive a detailed proposal outlining the scope of work, timeline, pricing, and deliverables based on your specific requirements and the service packages available.",
      },
      {
        name: "Project Execution",
        text: "Once approved, the project begins with regular updates and communication throughout the development process, ensuring transparency and alignment with your expectations.",
      },
      {
        name: "Delivery and Support",
        text: "Receive the completed project with documentation, and ongoing support options including maintenance packages to keep your website or software running optimally.",
      },
    ],
  },
  de: {
    name: "Wie du Dominik Könitzer für Webentwicklungs-Leistungen engagierst",
    description:
      "Schritt-für-Schritt-Anleitung, um Dominik Könitzer für Software-Engineering- und Webentwicklungs-Leistungen zu beauftragen",
    step: [
      {
        name: "Leistungen prüfen",
        text: "Sieh dir die verfügbaren Leistungen auf dieser Seite an, darunter Website-Wartung, technischer Support, Content-Management, Security-Beratung, Datensicherung, SEO-Optimierung, Webentwicklung, Server-Setup und individuelle Softwareentwicklung.",
      },
      {
        name: "Kontakt für Beratung",
        text: "Nutze das Kontaktformular unter dominikkoenitzer.ch/contact, um deine Projektanforderungen, deinen Zeitplan und dein Budget zu besprechen. Beschreibe deine aktuellen Website- oder Software-Anforderungen.",
      },
      {
        name: "Angebot erhalten",
        text: "Erhalte ein detailliertes Angebot mit Umfang, Zeitplan, Preisen und Deliverables, basierend auf deinen Anforderungen und den verfügbaren Leistungspaketen.",
      },
      {
        name: "Projektdurchführung",
        text: "Nach Genehmigung startet das Projekt mit regelmässigen Updates und transparenter Kommunikation während des gesamten Entwicklungsprozesses.",
      },
      {
        name: "Lieferung und Support",
        text: "Erhalte das fertige Projekt inklusive Dokumentation sowie laufende Support-Optionen — etwa Wartungspakete, damit deine Website oder Software optimal läuft.",
      },
    ],
  },
  fr: {
    name: "Comment engager Dominik Könitzer pour des services de développement web",
    description:
      "Guide étape par étape pour faire appel à Dominik Könitzer pour des services d'ingénierie logicielle et de développement web",
    step: [
      {
        name: "Consulter les services",
        text: "Parcourez les services disponibles sur cette page : maintenance de site, support technique, gestion de contenu, conseil en sécurité, sauvegarde de données, optimisation SEO, développement web, configuration serveur et développement logiciel sur mesure.",
      },
      {
        name: "Contacter pour consultation",
        text: "Utilisez le formulaire de contact sur dominikkoenitzer.ch/contact pour discuter de vos besoins, du calendrier et du budget. Précisez vos besoins actuels en site web ou en logiciel.",
      },
      {
        name: "Recevoir une proposition",
        text: "Recevez une proposition détaillée précisant la portée des travaux, le calendrier, les tarifs et les livrables, en fonction de vos besoins et des forfaits disponibles.",
      },
      {
        name: "Exécution du projet",
        text: "Une fois approuvé, le projet démarre avec des mises à jour régulières et une communication continue tout au long du processus de développement, garantissant transparence et alignement.",
      },
      {
        name: "Livraison et support",
        text: "Recevez le projet livré accompagné de sa documentation, ainsi que des options de support continu, dont des forfaits de maintenance, pour garder votre site ou logiciel optimal.",
      },
    ],
  },
  zh: {
    name: "如何聘请 Dominik Könitzer 提供网页开发服务",
    description: "聘请 Dominik Könitzer 进行软件工程与网页开发服务的分步指南",
    step: [
      {
        name: "查看服务",
        text: "浏览本页面上的服务，包括网站维护、技术支持、内容管理、安全咨询、数据备份、SEO 优化、网页开发、服务器配置以及定制软件开发。",
      },
      {
        name: "联系咨询",
        text: "通过 dominikkoenitzer.ch/contact 上的联系表单沟通您的项目需求、时间安排与预算。请详细描述您现有的网站或软件需求。",
      },
      {
        name: "获取方案",
        text: "根据您的具体需求与可选的服务套餐，您将收到一份包含工作范围、时间表、价格与交付物的详细方案。",
      },
      {
        name: "项目执行",
        text: "一旦确认，项目即开始，整个开发过程中将持续提供进度更新与透明沟通，确保符合您的期望。",
      },
      {
        name: "交付与支持",
        text: "您将获得交付的项目及相关文档，并可选择持续的支持方案，包括维护套餐，确保您的网站或软件长期保持最佳状态。",
      },
    ],
  },
};

export const getServicesFaqs = (lang: Language) =>
  SERVICES_FAQS[lang] ?? SERVICES_FAQS.en;
export const getServicesHowTo = (lang: Language) =>
  SERVICES_HOW_TO[lang] ?? SERVICES_HOW_TO.en;
