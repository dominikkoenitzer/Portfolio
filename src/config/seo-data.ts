/**
 * SEO data and configurations for different pages — localized per supported language.
 *
 * Pick the right bundle with the helpers at the bottom (getHomeFaqs(lang) etc.)
 */

import type { Language } from "@/config/languages";
import type { FAQItem, HowToSchema } from "@/types/seo";

type LocaleRecord<T> = Record<Language, T>;

export const HOME_FAQS: LocaleRecord<FAQItem[]> = {
  en: [
    {
      question: "Who is Dominik Könitzer?",
      answer:
        "Dominik Könitzer is a Software Engineer specializing in modern web development, currently studying at WISS Schulen für Wirtschaft Informatik Immobilien in Switzerland. He is an expert in React, TypeScript, and full-stack development with proficiency in frontend frameworks, backend technologies, and DevOps tools.",
    },
    {
      question: "What services does Dominik Könitzer offer?",
      answer:
        "Dominik Könitzer offers comprehensive software engineering and web development services including website maintenance, technical support, content management, security consultation, data backup solutions, SEO optimization, custom web development, server setup, and custom software development. Services are priced competitively and tailored to client needs.",
    },
    {
      question: "Where is Dominik Könitzer located?",
      answer:
        "Dominik Könitzer is based in Switzerland and provides software engineering services to clients in Switzerland and internationally. He is currently in his sixth semester of a 4-year software engineering program at WISS Schulen für Wirtschaft Informatik Immobilien.",
    },
    {
      question: "What technologies does Dominik Könitzer specialize in?",
      answer:
        "Dominik Könitzer specializes in React (95% proficiency), Next.js (90%), TypeScript (80%), Node.js (85%), Java (90%), Spring Framework (85%), and various frontend and backend technologies. He also has expertise in DevOps tools like Docker, Jenkins, and database management systems including PostgreSQL and MongoDB.",
    },
    {
      question: "How can I contact Dominik Könitzer for a project?",
      answer:
        "You can contact Dominik Könitzer through the contact form on this website at dominikkoenitzer.ch/contact. He is available for freelance work, collaborations, and consulting opportunities in software engineering and web development.",
    },
    {
      question: "What is Dominik Könitzer's educational background?",
      answer:
        "Dominik Könitzer is currently a student at WISS Schulen für Wirtschaft Informatik Immobilien, in his sixth semester of a 4-year software engineering program. The program includes two years of coursework followed by two years of practical internship with ongoing studies, providing both theoretical knowledge and hands-on experience.",
    },
  ],
  de: [
    {
      question: "Wer ist Dominik Könitzer?",
      answer:
        "Dominik Könitzer ist ein Software Engineer mit Spezialisierung auf moderne Webentwicklung und studiert derzeit an der WISS Schule für Wirtschaft Informatik Immobilien in der Schweiz. Er ist Experte für React, TypeScript und Full-Stack-Entwicklung mit Erfahrung in Frontend-Frameworks, Backend-Technologien und DevOps-Tools.",
    },
    {
      question: "Welche Leistungen bietet Dominik Könitzer an?",
      answer:
        "Dominik Könitzer bietet umfassende Software-Engineering- und Webentwicklungs-Leistungen, darunter Website-Wartung, technischen Support, Content-Management, Security-Beratung, Backup-Lösungen, SEO-Optimierung, individuelle Webentwicklung, Server-Setup und individuelle Softwareentwicklung. Die Preise sind wettbewerbsfähig und auf die Bedürfnisse der Kunden zugeschnitten.",
    },
    {
      question: "Wo ist Dominik Könitzer ansässig?",
      answer:
        "Dominik Könitzer hat seinen Sitz in der Schweiz und bietet Software-Engineering-Leistungen für Kunden in der Schweiz und weltweit an. Er befindet sich derzeit im sechsten Semester eines vierjährigen Software-Engineering-Programms an der WISS Schule für Wirtschaft Informatik Immobilien.",
    },
    {
      question: "Auf welche Technologien hat sich Dominik Könitzer spezialisiert?",
      answer:
        "Dominik Könitzer ist spezialisiert auf React (95 % Niveau), Next.js (90 %), TypeScript (80 %), Node.js (85 %), Java (90 %), Spring Framework (85 %) sowie verschiedene Frontend- und Backend-Technologien. Zudem verfügt er über Expertise in DevOps-Tools wie Docker, Jenkins und Datenbanksystemen wie PostgreSQL und MongoDB.",
    },
    {
      question: "Wie kann ich Dominik Könitzer für ein Projekt kontaktieren?",
      answer:
        "Du kannst Dominik Könitzer über das Kontaktformular auf dieser Website unter dominikkoenitzer.ch/contact erreichen. Er ist für Freelance-Aufträge, Kollaborationen und Beratungsprojekte im Software-Engineering und in der Webentwicklung verfügbar.",
    },
    {
      question: "Was ist der Bildungshintergrund von Dominik Könitzer?",
      answer:
        "Dominik Könitzer ist derzeit Schüler an der WISS Schule für Wirtschaft Informatik Immobilien und im sechsten Semester eines vierjährigen Software-Engineering-Programms. Das Programm umfasst zwei Jahre theoretischen Unterricht und zwei Jahre praktisches Praktikum mit begleitenden Studien — eine Kombination aus theoretischem Wissen und praktischer Erfahrung.",
    },
  ],
  fr: [
    {
      question: "Qui est Dominik Könitzer ?",
      answer:
        "Dominik Könitzer est un ingénieur logiciel spécialisé en développement web moderne, actuellement étudiant à la WISS Schulen für Wirtschaft Informatik Immobilien en Suisse. Il est expert en React, TypeScript et développement full-stack, avec une maîtrise des frameworks frontend, des technologies backend et des outils DevOps.",
    },
    {
      question: "Quels services Dominik Könitzer propose-t-il ?",
      answer:
        "Dominik Könitzer propose des services complets d'ingénierie logicielle et de développement web, incluant la maintenance de sites, le support technique, la gestion de contenu, le conseil en sécurité, les solutions de sauvegarde, l'optimisation SEO, le développement web sur mesure, la configuration serveur et le développement logiciel sur mesure. Les tarifs sont compétitifs et adaptés aux besoins des clients.",
    },
    {
      question: "Où est basé Dominik Könitzer ?",
      answer:
        "Dominik Könitzer est basé en Suisse et fournit des services d'ingénierie logicielle à des clients en Suisse et à l'international. Il est actuellement dans son sixième semestre d'un programme d'ingénierie logicielle de 4 ans à la WISS Schulen für Wirtschaft Informatik Immobilien.",
    },
    {
      question: "Dans quelles technologies Dominik Könitzer est-il spécialisé ?",
      answer:
        "Dominik Könitzer est spécialisé en React (95 % de maîtrise), Next.js (90 %), TypeScript (80 %), Node.js (85 %), Java (90 %), Spring Framework (85 %) et diverses technologies frontend et backend. Il possède également une expertise des outils DevOps tels que Docker, Jenkins et des systèmes de bases de données comme PostgreSQL et MongoDB.",
    },
    {
      question: "Comment contacter Dominik Könitzer pour un projet ?",
      answer:
        "Vous pouvez contacter Dominik Könitzer via le formulaire de contact de ce site à dominikkoenitzer.ch/contact. Il est disponible pour du freelance, des collaborations et des missions de conseil en ingénierie logicielle et en développement web.",
    },
    {
      question: "Quel est le parcours éducatif de Dominik Könitzer ?",
      answer:
        "Dominik Könitzer est actuellement étudiant à la WISS Schulen für Wirtschaft Informatik Immobilien, dans le sixième semestre d'un programme d'ingénierie logicielle de 4 ans. Le programme comprend deux années de cours suivies de deux années de stage pratique avec poursuite des études, offrant à la fois des connaissances théoriques et une expérience concrète.",
    },
  ],
  zh: [
    {
      question: "Dominik Könitzer 是谁？",
      answer:
        "Dominik Könitzer 是一位专注于现代网页开发的软件工程师，目前就读于瑞士的 WISS Schulen für Wirtschaft Informatik Immobilien。他是 React、TypeScript 与全栈开发方面的专家，熟悉前端框架、后端技术与 DevOps 工具。",
    },
    {
      question: "Dominik Könitzer 提供哪些服务？",
      answer:
        "Dominik Könitzer 提供全面的软件工程与网页开发服务，包括网站维护、技术支持、内容管理、安全咨询、数据备份方案、SEO 优化、定制网页开发、服务器配置与定制软件开发。价格具有竞争力，并根据客户需求量身定制。",
    },
    {
      question: "Dominik Könitzer 位于何处？",
      answer:
        "Dominik Könitzer 常驻瑞士，为瑞士本地及国际客户提供软件工程服务。他目前处于 WISS Schulen für Wirtschaft Informatik Immobilien 四年制软件工程项目的第六学期。",
    },
    {
      question: "Dominik Könitzer 擅长哪些技术？",
      answer:
        "Dominik Könitzer 擅长 React（熟练度 95%）、Next.js（90%）、TypeScript（80%）、Node.js（85%）、Java（90%）、Spring Framework（85%）以及多种前后端技术。他还熟悉 Docker、Jenkins 等 DevOps 工具，以及 PostgreSQL、MongoDB 等数据库系统。",
    },
    {
      question: "如何就项目联系 Dominik Könitzer？",
      answer:
        "您可以通过本网站的联系表单 dominikkoenitzer.ch/contact 与 Dominik Könitzer 联系。他可承接自由职业、合作项目以及软件工程与网页开发方面的咨询机会。",
    },
    {
      question: "Dominik Könitzer 的教育背景如何？",
      answer:
        "Dominik Könitzer 目前就读于 WISS Schulen für Wirtschaft Informatik Immobilien，处于四年制软件工程项目的第六学期。该项目包含两年课程学习，随后两年是带继续学习的实习实践阶段，兼顾理论知识与动手经验。",
    },
  ],
};

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
      question: "Quelles technologies utilisez-vous pour le développement web ?",
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
    description:
      "聘请 Dominik Könitzer 进行软件工程与网页开发服务的分步指南",
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
      question: "Quelles sont les principales compétences techniques de Dominik Könitzer ?",
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
      question: "Avec quelles bases de données Dominik Könitzer travaille-t-il ?",
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
      question: "Was treibt Dominik Könitzers Leidenschaft für Webentwicklung an?",
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
      question: "Qu'est-ce qui anime la passion de Dominik Könitzer pour le développement web ?",
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

export const PROJECTS_FAQS: LocaleRecord<FAQItem[]> = {
  en: [
    {
      question: "What kind of impact-focused projects are included in this portfolio?",
      answer:
        "This portfolio includes production-oriented projects focused on practical outcomes such as improved user experience, stronger performance, accessibility, and maintainable architecture. Each project highlights decisions that support real users and long-term product growth.",
    },
    {
      question: "Where can I review project code and live implementations?",
      answer:
        "Each project includes both a GitHub repository and a live deployment link so recruiters and hiring teams can evaluate implementation quality, code structure, UI decisions, and end-user behavior.",
    },
    {
      question: "How do these projects demonstrate job-ready software engineering skills?",
      answer:
        "The showcased work demonstrates end-to-end product thinking: planning structured interfaces, implementing modern frontend architecture, optimizing performance, and building reusable components that support collaboration and future iteration.",
    },
  ],
  de: [
    {
      question: "Welche wirkungsorientierten Projekte sind in diesem Portfolio enthalten?",
      answer:
        "Das Portfolio enthält produktionsnahe Projekte mit Fokus auf praktische Ergebnisse wie bessere User Experience, höhere Performance, Accessibility und wartbare Architektur. Jedes Projekt zeigt Entscheidungen, die echten Nutzern und langfristigem Produktwachstum dienen.",
    },
    {
      question: "Wo kann ich Code und Live-Implementierungen einsehen?",
      answer:
        "Jedes Projekt enthält ein GitHub-Repository und einen Live-Deployment-Link, damit Recruiter und Hiring-Teams Code-Qualität, Struktur, UI-Entscheidungen und Verhalten für Endnutzer bewerten können.",
    },
    {
      question: "Wie zeigen diese Projekte einsatzbereite Software-Engineering-Fähigkeiten?",
      answer:
        "Die gezeigten Arbeiten beweisen End-to-End-Produktdenken: strukturierte UI-Planung, moderne Frontend-Architektur, Performance-Optimierung und wiederverwendbare Komponenten, die Kollaboration und zukünftige Iteration unterstützen.",
    },
  ],
  fr: [
    {
      question: "Quels types de projets à fort impact figurent dans ce portfolio ?",
      answer:
        "Ce portfolio contient des projets orientés production, centrés sur des résultats concrets : meilleure expérience utilisateur, performance accrue, accessibilité et architecture maintenable. Chaque projet met en avant des décisions au service d'utilisateurs réels et de la croissance produit à long terme.",
    },
    {
      question: "Où puis-je consulter le code et les implémentations en ligne ?",
      answer:
        "Chaque projet inclut un dépôt GitHub et un lien de déploiement live afin que recruteurs et équipes de recrutement puissent évaluer la qualité d'implémentation, la structure du code, les choix UI et le comportement côté utilisateur.",
    },
    {
      question: "En quoi ces projets démontrent-ils des compétences d'ingénierie logicielle prêtes à l'emploi ?",
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

export const DONATE_FAQS: LocaleRecord<FAQItem[]> = {
  en: [
    {
      question: "Why should I donate to support this portfolio?",
      answer:
        "Donations directly support ongoing software project development, hosting costs, tooling, and time invested in shipping higher-quality features, better performance, and more useful public work.",
    },
    {
      question: "What does my donation help fund?",
      answer:
        "Your contribution helps fund infrastructure, software subscriptions, development tools, and focused build time for new projects, improvements, and educational engineering content.",
    },
    {
      question: "How can I donate?",
      answer:
        "You can donate securely via PayPal using the donation options on this page, or choose a custom amount through the main PayPal donation button.",
    },
  ],
  de: [
    {
      question: "Warum sollte ich für dieses Portfolio spenden?",
      answer:
        "Spenden unterstützen direkt die laufende Entwicklung von Software-Projekten, Hosting-Kosten, Tools und Zeit für hochwertige Features, bessere Performance und nützlichere öffentliche Arbeit.",
    },
    {
      question: "Wofür wird meine Spende verwendet?",
      answer:
        "Dein Beitrag finanziert Infrastruktur, Software-Abos, Entwicklungs-Tools sowie fokussierte Build-Zeit für neue Projekte, Verbesserungen und Engineering-Inhalte.",
    },
    {
      question: "Wie kann ich spenden?",
      answer:
        "Du kannst sicher über PayPal mit den Optionen auf dieser Seite spenden oder über den PayPal-Hauptbutton einen beliebigen Betrag wählen.",
    },
  ],
  fr: [
    {
      question: "Pourquoi soutenir ce portfolio par un don ?",
      answer:
        "Les dons soutiennent directement le développement continu des projets, les frais d'hébergement, l'outillage et le temps consacré à livrer des fonctionnalités de meilleure qualité, plus performantes et plus utiles publiquement.",
    },
    {
      question: "À quoi sert mon don ?",
      answer:
        "Votre contribution finance l'infrastructure, les abonnements logiciels, les outils de développement et un temps de build dédié à de nouveaux projets, des améliorations et du contenu pédagogique d'ingénierie.",
    },
    {
      question: "Comment faire un don ?",
      answer:
        "Vous pouvez faire un don de manière sécurisée via PayPal grâce aux options proposées sur cette page, ou choisir un montant personnalisé via le bouton principal PayPal.",
    },
  ],
  zh: [
    {
      question: "为什么要捐款支持这个作品集？",
      answer:
        "捐款直接支持软件项目的持续开发、托管费用、工具开销，以及投入到更高质量功能、更好性能与更有用公开作品上的时间。",
    },
    {
      question: "我的捐款会用于哪些方面？",
      answer:
        "您的支持将用于基础设施、软件订阅、开发工具，以及用于新项目、改进与工程教育内容的专注开发时间。",
    },
    {
      question: "如何进行捐款？",
      answer:
        "您可以通过本页面上的捐款选项使用 PayPal 安全捐款，或通过主 PayPal 按钮选择自定义金额。",
    },
  ],
};

export const DONATE_HOW_TO: LocaleRecord<HowToSchema> = {
  en: {
    name: "How to Support Dominik Konitzer's Work",
    description:
      "Simple steps to donate and support ongoing software projects and portfolio development.",
    step: [
      {
        name: "Choose Donation Option",
        text: "Select one of the suggested donation amounts or choose a custom amount.",
      },
      {
        name: "Open Secure PayPal Checkout",
        text: "Click a donation button to continue through PayPal's secure payment flow.",
      },
      {
        name: "Complete Donation",
        text: "Confirm your payment details and complete the donation.",
      },
      {
        name: "Support Ongoing Work",
        text: "Your contribution helps fund future project development, maintenance, and technical content.",
      },
    ],
  },
  de: {
    name: "So unterstützt du Dominik Konitzers Arbeit",
    description:
      "Einfache Schritte, um zu spenden und laufende Software-Projekte sowie die Portfolio-Entwicklung zu unterstützen.",
    step: [
      {
        name: "Spendenoption wählen",
        text: "Wähle einen der vorgeschlagenen Beträge oder gib einen individuellen Betrag ein.",
      },
      {
        name: "Sicheren PayPal-Checkout öffnen",
        text: "Klicke auf einen Spendenbutton, um den sicheren PayPal-Zahlungsprozess fortzusetzen.",
      },
      {
        name: "Spende abschliessen",
        text: "Bestätige deine Zahlungsdetails und schliesse die Spende ab.",
      },
      {
        name: "Laufende Arbeit unterstützen",
        text: "Dein Beitrag finanziert künftige Projektentwicklung, Wartung und technische Inhalte.",
      },
    ],
  },
  fr: {
    name: "Comment soutenir le travail de Dominik Konitzer",
    description:
      "Étapes simples pour faire un don et soutenir les projets logiciels en cours ainsi que le développement du portfolio.",
    step: [
      {
        name: "Choisir une option de don",
        text: "Sélectionnez l'un des montants suggérés ou choisissez un montant personnalisé.",
      },
      {
        name: "Ouvrir le paiement sécurisé PayPal",
        text: "Cliquez sur un bouton de don pour poursuivre via le flux de paiement sécurisé PayPal.",
      },
      {
        name: "Finaliser le don",
        text: "Vérifiez les détails de paiement et finalisez le don.",
      },
      {
        name: "Soutenir le travail en cours",
        text: "Votre contribution aide à financer le développement futur, la maintenance et le contenu technique.",
      },
    ],
  },
  zh: {
    name: "如何支持 Dominik Konitzer 的工作",
    description:
      "通过简单的步骤进行捐款，支持持续的软件项目与作品集开发。",
    step: [
      {
        name: "选择捐款方式",
        text: "选择推荐的捐款金额之一，或选择自定义金额。",
      },
      {
        name: "打开安全的 PayPal 结账",
        text: "点击捐款按钮，通过 PayPal 安全支付流程继续操作。",
      },
      {
        name: "完成捐款",
        text: "确认您的支付信息并完成捐款。",
      },
      {
        name: "支持持续工作",
        text: "您的支持将帮助资助未来的项目开发、维护与技术内容。",
      },
    ],
  },
};

export const getHomeFaqs = (lang: Language) => HOME_FAQS[lang] ?? HOME_FAQS.en;
export const getAboutFaqs = (lang: Language) => ABOUT_FAQS[lang] ?? ABOUT_FAQS.en;
export const getSkillsFaqs = (lang: Language) => SKILLS_FAQS[lang] ?? SKILLS_FAQS.en;
export const getProjectsFaqs = (lang: Language) => PROJECTS_FAQS[lang] ?? PROJECTS_FAQS.en;
export const getServicesFaqs = (lang: Language) => SERVICES_FAQS[lang] ?? SERVICES_FAQS.en;
export const getDonateFaqs = (lang: Language) => DONATE_FAQS[lang] ?? DONATE_FAQS.en;
export const getServicesHowTo = (lang: Language) =>
  SERVICES_HOW_TO[lang] ?? SERVICES_HOW_TO.en;
export const getDonateHowTo = (lang: Language) =>
  DONATE_HOW_TO[lang] ?? DONATE_HOW_TO.en;
