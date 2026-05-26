import type { Language } from "@/config/languages";

export interface PortfolioProject {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  overview: string;
  roleSummary: string;
  problemStatement: string;
  objectives: string[];
  architectureDecisions: string[];
  implementationHighlights: string[];
  qualityAndSecurity: string[];
  challengesAndSolutions: Array<{
    challenge: string;
    solution: string;
  }>;
  hiringSignals: string[];
  nextIterations: string[];
  year: string;
  repoUrl: string;
  liveUrl: string;
  priority: number;
  toneClass: string;
  tags: string[];
  impactHeading: string;
  impactPoints: string[];
}

type LocalizedContent = {
  tagline: string;
  description: string;
  overview: string;
  roleSummary: string;
  problemStatement: string;
  objectives: string[];
  architectureDecisions: string[];
  implementationHighlights: string[];
  qualityAndSecurity: string[];
  challengesAndSolutions: Array<{ challenge: string; solution: string }>;
  hiringSignals: string[];
  nextIterations: string[];
  tags: string[];
  impactHeading: string;
  impactPoints: string[];
};

type ProjectBase = {
  slug: string;
  title: string;
  year: string;
  repoUrl: string;
  liveUrl: string;
  priority: number;
  toneClass: string;
};

const TONE_RADIAL =
  "bg-[radial-gradient(circle_at_50%_50%,_hsl(var(--primary)/0.18),_transparent_70%)]";

const PROJECT_BASE: ProjectBase[] = [
  {
    slug: "zephyr",
    title: "Zephyr",
    year: "2024",
    repoUrl: "https://github.com/dominikkoenitzer/Zephyr",
    liveUrl: "https://zephyr.punds.ch/",
    priority: 1,
    toneClass: TONE_RADIAL,
  },
  {
    slug: "spectrum",
    title: "Spectrum",
    year: "2026",
    repoUrl: "https://github.com/dominikkoenitzer/Spectrum",
    liveUrl: "https://spectrum.punds.ch/",
    priority: 2,
    toneClass: TONE_RADIAL,
  },
  {
    slug: "entropy",
    title: "Entropy",
    year: "2026",
    repoUrl: "https://github.com/dominikkoenitzer/Entropy",
    liveUrl: "https://entropy.punds.ch/",
    priority: 3,
    toneClass: TONE_RADIAL,
  },
  {
    slug: "remnants",
    title: "Remnants",
    year: "2026",
    repoUrl: "https://github.com/dominikkoenitzer/Remnants",
    liveUrl: "https://remnants.punds.ch/",
    priority: 4,
    toneClass: TONE_RADIAL,
  },
];

const PROJECT_CONTENT: Record<string, Record<Language, LocalizedContent>> = {
  zephyr: {
    en: {
      tagline:
        "A performance-first product experience designed to help people navigate complex information quickly.",
      description:
        "Zephyr helps you stay focused, manage tasks, plan your schedule, and track your progress.",
      overview:
        "Zephyr was built to reduce friction for users who need fast access to key information. I focused on clear UI structure, responsive behavior, and maintainable frontend architecture so the product can grow without losing usability.",
      roleSummary:
        "Product-focused frontend engineer responsible for UX architecture, component system design, and delivery quality.",
      problemStatement:
        "Most productivity tools become noisy over time. Zephyr was designed to keep the core flow fast and readable even as feature depth grows.",
      objectives: [
        "Create a single-flow experience for task capture, scheduling, and progress checks.",
        "Keep interactions low-friction on both desktop and mobile breakpoints.",
        "Establish reusable UI and state patterns that scale without adding cognitive load.",
      ],
      architectureDecisions: [
        "Modular component boundaries around task operations, schedule views, and progress summaries.",
        "Token-driven styling for theme consistency and maintainable visual updates.",
        "Clear route and section separation so features can evolve independently.",
      ],
      implementationHighlights: [
        "Built high-signal dashboard surfaces with concise hierarchy and fast scanability.",
        "Introduced reusable interaction patterns for list actions and status handling.",
        "Implemented subtle motion cues to guide focus without distracting from content.",
      ],
      qualityAndSecurity: [
        "Semantic structure and readable contrast to support accessibility requirements.",
        "Defensive UI behavior for empty and edge states to avoid broken interaction loops.",
        "Consistent responsiveness validated across common viewport groups.",
      ],
      challengesAndSolutions: [
        {
          challenge:
            "Balancing feature depth with a calm interface as more task utilities were added.",
          solution:
            "Created a layered hierarchy where primary actions remain persistent and advanced actions are progressively disclosed.",
        },
        {
          challenge:
            "Preventing visual inconsistency while iterating quickly on new sections.",
          solution:
            "Standardized card, spacing, and typography primitives to preserve system-level coherence.",
        },
      ],
      hiringSignals: [
        "Demonstrates product judgment, not only component implementation.",
        "Shows ability to scale UI systems while preserving speed and clarity.",
        "Reflects ownership from concept through production-ready polish.",
      ],
      nextIterations: [
        "Add analytics-informed prioritization for high-frequency workflows.",
        "Introduce collaborative planning primitives for shared task ownership.",
        "Expand automated interaction tests for critical productivity paths.",
      ],
      tags: ["Frontend", "Performance", "UI/UX"],
      impactHeading: "How This Project Creates Impact",
      impactPoints: [
        "Improves day-to-day usability by simplifying navigation and reducing interaction overhead.",
        "Helps people complete tasks faster through clearer hierarchy and better responsiveness.",
        "Supports long-term growth with reusable components and predictable patterns for team collaboration.",
      ],
    },
    de: {
      tagline:
        "Eine performance-orientierte Produkterfahrung, die Menschen hilft, sich schnell durch komplexe Informationen zu bewegen.",
      description:
        "Zephyr hilft dir, fokussiert zu bleiben, Aufgaben zu verwalten, deinen Tag zu planen und Fortschritt nachzuverfolgen.",
      overview:
        "Zephyr wurde gebaut, um die Reibung für Nutzer zu reduzieren, die schnell auf wichtige Informationen zugreifen müssen. Ich habe auf klare UI-Struktur, responsives Verhalten und wartbare Frontend-Architektur geachtet, damit das Produkt wachsen kann, ohne an Usability zu verlieren.",
      roleSummary:
        "Produktfokussierter Frontend Engineer mit Verantwortung für UX-Architektur, Komponenten-System-Design und Lieferqualität.",
      problemStatement:
        "Die meisten Produktivitäts-Tools werden mit der Zeit überladen. Zephyr wurde so gestaltet, dass der Kern-Flow auch bei wachsender Funktionstiefe schnell und lesbar bleibt.",
      objectives: [
        "Einen durchgängigen Flow für Aufgabenerfassung, Planung und Fortschrittsprüfung schaffen.",
        "Interaktionen sowohl auf Desktop- als auch Mobile-Breakpoints reibungsarm halten.",
        "Wiederverwendbare UI- und State-Patterns etablieren, die ohne zusätzliche kognitive Last skalieren.",
      ],
      architectureDecisions: [
        "Modulare Komponenten-Grenzen rund um Task-Operationen, Schedule-Ansichten und Fortschritts-Zusammenfassungen.",
        "Token-getriebenes Styling für Theme-Konsistenz und wartbare visuelle Updates.",
        "Klare Routen- und Bereichstrennung, damit Features unabhängig wachsen können.",
      ],
      implementationHighlights: [
        "High-Signal-Dashboard-Oberflächen mit klarer Hierarchie und schneller Scanability gebaut.",
        "Wiederverwendbare Interaktionsmuster für Listen-Aktionen und Status-Handling eingeführt.",
        "Dezente Motion-Cues implementiert, die Fokus lenken, ohne vom Inhalt abzulenken.",
      ],
      qualityAndSecurity: [
        "Semantische Struktur und lesbarer Kontrast, um Accessibility-Anforderungen zu erfüllen.",
        "Defensives UI-Verhalten für leere und Edge-States, um kaputte Interaktionsschleifen zu vermeiden.",
        "Konsistente Responsiveness, validiert über übliche Viewport-Gruppen.",
      ],
      challengesAndSolutions: [
        {
          challenge:
            "Feature-Tiefe mit einem ruhigen Interface ausbalancieren, während mehr Task-Utilities hinzukommen.",
          solution:
            "Eine geschichtete Hierarchie eingeführt, in der Primäraktionen sichtbar bleiben und fortgeschrittene Aktionen progressiv enthüllt werden.",
        },
        {
          challenge:
            "Visuelle Inkonsistenzen vermeiden, während neue Bereiche schnell iteriert werden.",
          solution:
            "Card-, Spacing- und Typografie-Primitiven standardisiert, um system-weite Kohärenz zu erhalten.",
        },
      ],
      hiringSignals: [
        "Zeigt Produktverständnis — nicht nur Komponenten-Implementierung.",
        "Beweist die Fähigkeit, UI-Systeme zu skalieren und dabei Tempo und Klarheit zu bewahren.",
        "Spiegelt Ownership vom Konzept bis zum produktionsreifen Feinschliff.",
      ],
      nextIterations: [
        "Analytics-informierte Priorisierung für hochfrequente Workflows einführen.",
        "Kollaborative Planungs-Primitiven für geteilte Task-Verantwortung ergänzen.",
        "Automatisierte Interaktionstests für kritische Produktivitätspfade ausbauen.",
      ],
      tags: ["Frontend", "Performance", "UI/UX"],
      impactHeading: "Wie dieses Projekt Wirkung erzeugt",
      impactPoints: [
        "Verbessert die tägliche Usability durch einfachere Navigation und reduzierten Interaktions-Overhead.",
        "Hilft Menschen, Aufgaben schneller zu erledigen — durch klarere Hierarchie und bessere Responsiveness.",
        "Unterstützt langfristiges Wachstum mit wiederverwendbaren Komponenten und vorhersehbaren Patterns für Team-Kollaboration.",
      ],
    },
    fr: {
      tagline:
        "Une expérience produit axée performance, conçue pour aider les utilisateurs à naviguer rapidement dans une information complexe.",
      description:
        "Zephyr vous aide à rester concentré, gérer vos tâches, planifier votre emploi du temps et suivre vos progrès.",
      overview:
        "Zephyr a été conçu pour réduire la friction pour les utilisateurs qui ont besoin d'un accès rapide à des informations clés. J'ai mis l'accent sur une structure UI claire, un comportement responsive et une architecture frontend maintenable afin que le produit puisse évoluer sans perdre en utilisabilité.",
      roleSummary:
        "Ingénieur frontend axé produit, responsable de l'architecture UX, de la conception du système de composants et de la qualité de livraison.",
      problemStatement:
        "La plupart des outils de productivité deviennent bruyants avec le temps. Zephyr est pensé pour garder le flux principal rapide et lisible, même quand les fonctionnalités s'enrichissent.",
      objectives: [
        "Créer un flux unique pour la saisie de tâches, la planification et le suivi des progrès.",
        "Garder les interactions fluides sur les breakpoints desktop et mobile.",
        "Établir des patterns UI et de state réutilisables qui passent à l'échelle sans charge cognitive supplémentaire.",
      ],
      architectureDecisions: [
        "Frontières de composants modulaires autour des opérations sur les tâches, des vues de planning et des résumés de progression.",
        "Styling piloté par tokens pour une cohérence des thèmes et des mises à jour visuelles maintenables.",
        "Séparation claire des routes et des sections pour que les fonctionnalités évoluent indépendamment.",
      ],
      implementationHighlights: [
        "Construction de surfaces de tableau de bord à fort signal, hiérarchie concise et lisibilité rapide.",
        "Introduction de patterns d'interaction réutilisables pour les actions de liste et la gestion d'état.",
        "Mise en place d'indices de mouvement subtils pour guider le focus sans distraire du contenu.",
      ],
      qualityAndSecurity: [
        "Structure sémantique et contraste lisible pour répondre aux exigences d'accessibilité.",
        "Comportement UI défensif pour les états vides et limites afin d'éviter les boucles d'interaction cassées.",
        "Responsive cohérente, validée sur les groupes de viewports usuels.",
      ],
      challengesAndSolutions: [
        {
          challenge:
            "Équilibrer la profondeur fonctionnelle et une interface calme à mesure que des utilitaires de tâches s'ajoutent.",
          solution:
            "Création d'une hiérarchie en couches où les actions primaires restent persistantes et les actions avancées sont dévoilées progressivement.",
        },
        {
          challenge:
            "Éviter l'incohérence visuelle tout en itérant rapidement sur de nouvelles sections.",
          solution:
            "Standardisation des primitives de cartes, d'espacement et de typographie pour préserver la cohérence au niveau système.",
        },
      ],
      hiringSignals: [
        "Démontre un jugement produit, pas seulement de l'implémentation de composants.",
        "Montre la capacité de passer à l'échelle des systèmes UI tout en préservant rapidité et clarté.",
        "Reflète une vraie ownership, du concept jusqu'au polish prêt pour la production.",
      ],
      nextIterations: [
        "Ajouter une priorisation guidée par l'analytics pour les workflows à forte fréquence.",
        "Introduire des primitives de planification collaborative pour la propriété partagée des tâches.",
        "Étendre les tests d'interaction automatisés pour les chemins de productivité critiques.",
      ],
      tags: ["Frontend", "Performance", "UI/UX"],
      impactHeading: "Comment ce projet crée de l'impact",
      impactPoints: [
        "Améliore l'utilisabilité quotidienne en simplifiant la navigation et en réduisant la charge d'interaction.",
        "Aide les utilisateurs à accomplir leurs tâches plus rapidement grâce à une hiérarchie plus claire et une meilleure réactivité.",
        "Soutient une croissance à long terme avec des composants réutilisables et des patterns prévisibles pour la collaboration en équipe.",
      ],
    },
    zh: {
      tagline:
        "以性能为先的产品体验，帮助人们快速在复杂信息中导航。",
      description:
        "Zephyr 帮助你保持专注、管理任务、规划日程并追踪进度。",
      overview:
        "Zephyr 旨在为需要快速访问关键信息的用户降低使用阻力。我专注于清晰的 UI 结构、响应式行为与可维护的前端架构，让产品在不损失易用性的前提下持续成长。",
      roleSummary:
        "以产品为导向的前端工程师，负责 UX 架构、组件系统设计与交付质量。",
      problemStatement:
        "多数生产力工具会随着时间变得繁杂。Zephyr 的设计保证核心流程在功能增加后依然快速且易读。",
      objectives: [
        "为任务捕获、日程安排与进度查看打造统一流程的体验。",
        "在桌面与移动断点上都保持低摩擦的交互。",
        "建立可复用的 UI 与状态模式，在不增加认知负担的前提下扩展。",
      ],
      architectureDecisions: [
        "围绕任务操作、日程视图与进度概要划分模块化组件边界。",
        "以设计 token 驱动样式，保证主题一致与可维护的视觉更新。",
        "清晰的路由与区段划分，便于功能独立演进。",
      ],
      implementationHighlights: [
        "构建高信噪比的仪表盘界面，层次精炼、易于快速扫读。",
        "为列表操作与状态处理引入可复用的交互模式。",
        "实现细腻的动效线索，引导注意力而不干扰内容。",
      ],
      qualityAndSecurity: [
        "采用语义化结构与可读对比度，满足可访问性要求。",
        "对空态与边界态进行防御式 UI 处理，避免交互闭环被打断。",
        "在常见视口组合上验证一致的响应式表现。",
      ],
      challengesAndSolutions: [
        {
          challenge:
            "在任务工具不断增加的情况下，平衡功能深度与平静的界面。",
          solution:
            "构建分层结构：主操作常驻可见，高级操作以渐进披露的方式呈现。",
        },
        {
          challenge:
            "在快速迭代新模块时保持视觉一致性。",
          solution:
            "标准化卡片、间距与排版基元，保持系统级一致性。",
        },
      ],
      hiringSignals: [
        "体现产品判断力，而不仅是组件实现。",
        "证明可在保持速度与清晰度的同时扩展 UI 系统。",
        "展示从概念到生产级打磨的全程主导能力。",
      ],
      nextIterations: [
        "为高频工作流加入由分析驱动的优先级排序。",
        "引入用于共享任务所有权的协作规划基元。",
        "扩展关键生产力路径的自动化交互测试。",
      ],
      tags: ["前端", "性能", "UI/UX"],
      impactHeading: "本项目如何创造价值",
      impactPoints: [
        "通过简化导航与减少交互负担，提升日常可用性。",
        "通过更清晰的层次与更好的响应性，帮助用户更快完成任务。",
        "通过可复用组件与可预期的模式，支持长期增长与团队协作。",
      ],
    },
  },
  spectrum: {
    en: {
      tagline:
        "A structured and scalable web product foundation for teams that need consistency and speed.",
      description:
        "Spectrum helps you pick, explore, and transform colors with tools for contrast checks, gradients, color lookup, and accessibility-friendly choices.",
      overview:
        "Spectrum combines visual quality with engineering discipline. The project emphasizes consistent component behavior, scalable layout systems, and clear UX flows so users and teams both benefit from a more reliable product experience.",
      roleSummary:
        "UI engineer and product designer translating color theory workflows into production-grade tooling.",
      problemStatement:
        "Color workflows are often fragmented across disconnected tools. Spectrum unifies exploration, validation, and transformation into one coherent product flow.",
      objectives: [
        "Enable rapid palette exploration with immediate visual feedback.",
        "Support accessibility-aware choices without requiring expert-level color knowledge.",
        "Provide conversion and gradient tooling in the same interface context.",
      ],
      architectureDecisions: [
        "Utility-oriented feature modules for contrast, gradients, and lookup capabilities.",
        "Composable UI primitives to keep advanced controls consistent across tool surfaces.",
        "State design that keeps color updates predictable and easy to reason about.",
      ],
      implementationHighlights: [
        "Delivered fast visual iteration loops for experimenting with palettes and gradients.",
        "Implemented contrast-checking flows that are readable for both designers and engineers.",
        "Built conversion helpers that reduce repetitive manual color transformations.",
      ],
      qualityAndSecurity: [
        "Accessible semantic and contrast-conscious presentation throughout tooling screens.",
        "Input handling that reduces malformed color states and broken calculations.",
        "Responsive layouts that preserve utility density on smaller devices.",
      ],
      challengesAndSolutions: [
        {
          challenge:
            "Keeping advanced color controls powerful while still approachable for first-time users.",
          solution:
            "Used progressive disclosure and context hints so default flows stay simple but depth remains available.",
        },
        {
          challenge:
            "Avoiding inconsistent behavior across multiple color tools in one app.",
          solution:
            "Centralized shared interaction patterns and validation logic for a unified experience.",
        },
      ],
      hiringSignals: [
        "Shows cross-functional thinking between design quality and engineering execution.",
        "Proves ability to build domain tooling with clear user-centered tradeoffs.",
        "Highlights consistency discipline at both UX and code architecture levels.",
      ],
      nextIterations: [
        "Add export presets for design tokens and team handoff workflows.",
        "Introduce saved sessions for repeatable palette experiments.",
        "Expand educational guidance for accessibility-first color decisions.",
      ],
      tags: ["Scalable", "Design System", "Web App"],
      impactHeading: "How This Project Creates Impact",
      impactPoints: [
        "Gives teams a cleaner system to ship features without sacrificing consistency.",
        "Makes interfaces easier to understand for users through repeatable visual language.",
        "Balances aesthetics and performance to keep quality high across devices.",
      ],
    },
    de: {
      tagline:
        "Eine strukturierte und skalierbare Web-Produktbasis für Teams, die Konsistenz und Tempo brauchen.",
      description:
        "Spectrum hilft dir, Farben auszuwählen, zu erkunden und zu transformieren — mit Tools für Kontrast-Checks, Gradients, Farb-Lookups und barrierearmen Entscheidungen.",
      overview:
        "Spectrum verbindet visuelle Qualität mit Engineering-Disziplin. Der Fokus liegt auf konsistentem Komponentenverhalten, skalierbaren Layout-Systemen und klaren UX-Flows, sodass Nutzer und Teams gleichermassen von einer verlässlicheren Produkterfahrung profitieren.",
      roleSummary:
        "UI Engineer und Produktdesigner, der Farbtheorie-Workflows in produktionsreifes Tooling übersetzt.",
      problemStatement:
        "Farb-Workflows sind oft auf unverbundene Tools verteilt. Spectrum vereint Exploration, Validierung und Transformation in einem zusammenhängenden Produkt-Flow.",
      objectives: [
        "Schnelle Paletten-Exploration mit unmittelbarem visuellen Feedback ermöglichen.",
        "Accessibility-bewusste Entscheidungen unterstützen, ohne Expertenwissen über Farbe vorauszusetzen.",
        "Konvertierungs- und Gradient-Tools im selben Interface-Kontext anbieten.",
      ],
      architectureDecisions: [
        "Utility-orientierte Feature-Module für Kontrast, Gradients und Lookup-Fähigkeiten.",
        "Komponierbare UI-Primitiven, damit fortgeschrittene Controls über Tool-Oberflächen konsistent bleiben.",
        "State-Design, das Farb-Updates vorhersehbar und gut nachvollziehbar hält.",
      ],
      implementationHighlights: [
        "Schnelle Visualisierungs-Loops zum Experimentieren mit Paletten und Gradients geliefert.",
        "Kontrast-Check-Flows umgesetzt, die für Designer und Engineers gleichermassen lesbar sind.",
        "Konvertierungs-Helfer gebaut, die wiederkehrende manuelle Farb-Transformationen reduzieren.",
      ],
      qualityAndSecurity: [
        "Barrierearme Semantik und kontrastbewusste Darstellung über alle Tool-Screens hinweg.",
        "Eingabe-Handling, das fehlerhafte Farbzustände und kaputte Berechnungen vermeidet.",
        "Responsive Layouts, die die Utility-Dichte auch auf kleineren Geräten erhalten.",
      ],
      challengesAndSolutions: [
        {
          challenge:
            "Fortgeschrittene Farb-Controls leistungsstark, aber für Einsteiger zugänglich halten.",
          solution:
            "Progressive Disclosure und Kontext-Hinweise eingesetzt, sodass Default-Flows einfach bleiben, Tiefe aber verfügbar ist.",
        },
        {
          challenge:
            "Inkonsistentes Verhalten zwischen mehreren Farb-Tools in einer App vermeiden.",
          solution:
            "Geteilte Interaktionsmuster und Validierungs-Logik zentralisiert — für ein einheitliches Erlebnis.",
        },
      ],
      hiringSignals: [
        "Zeigt cross-funktionales Denken zwischen Design-Qualität und Engineering-Umsetzung.",
        "Beweist die Fähigkeit, Domain-Tooling mit klaren nutzerzentrierten Trade-offs zu bauen.",
        "Hebt Konsistenz-Disziplin auf UX- und Code-Architektur-Ebene hervor.",
      ],
      nextIterations: [
        "Export-Presets für Design-Tokens und Team-Handoff-Workflows hinzufügen.",
        "Gespeicherte Sessions für wiederholbare Paletten-Experimente einführen.",
        "Lern-Hilfen für Accessibility-First-Farbentscheidungen ausbauen.",
      ],
      tags: ["Skalierbar", "Design-System", "Web-App"],
      impactHeading: "Wie dieses Projekt Wirkung erzeugt",
      impactPoints: [
        "Gibt Teams ein klareres System, um Features ohne Konsistenz-Verlust zu liefern.",
        "Macht Oberflächen durch wiederholbare visuelle Sprache verständlicher für Nutzer.",
        "Balanciert Ästhetik und Performance, um Qualität auf allen Geräten hochzuhalten.",
      ],
    },
    fr: {
      tagline:
        "Une base de produit web structurée et scalable pour les équipes qui ont besoin de cohérence et de rapidité.",
      description:
        "Spectrum vous aide à choisir, explorer et transformer les couleurs avec des outils de vérification de contraste, de dégradés, de recherche de couleur et de choix accessibles.",
      overview:
        "Spectrum combine qualité visuelle et discipline d'ingénierie. Le projet met l'accent sur un comportement de composants cohérent, des systèmes de layout scalables et des flux UX clairs pour que utilisateurs et équipes bénéficient d'une expérience produit plus fiable.",
      roleSummary:
        "Ingénieur UI et designer produit traduisant les workflows de théorie des couleurs en outils de qualité production.",
      problemStatement:
        "Les workflows liés à la couleur sont souvent fragmentés entre plusieurs outils non connectés. Spectrum réunit exploration, validation et transformation dans un flux produit cohérent.",
      objectives: [
        "Permettre une exploration rapide des palettes avec un retour visuel immédiat.",
        "Soutenir des choix orientés accessibilité sans nécessiter une expertise en couleur.",
        "Proposer outils de conversion et de dégradés dans le même contexte d'interface.",
      ],
      architectureDecisions: [
        "Modules fonctionnels orientés utilitaire pour le contraste, les dégradés et la recherche.",
        "Primitives UI composables pour garder les contrôles avancés cohérents sur toutes les surfaces.",
        "Design d'état qui rend les mises à jour de couleur prévisibles et faciles à raisonner.",
      ],
      implementationHighlights: [
        "Boucles d'itération visuelle rapides pour expérimenter palettes et dégradés.",
        "Flux de vérification de contraste lisibles pour designers et ingénieurs.",
        "Aides à la conversion réduisant les transformations de couleur manuelles répétitives.",
      ],
      qualityAndSecurity: [
        "Sémantique accessible et présentation soucieuse du contraste sur l'ensemble des écrans.",
        "Gestion des entrées limitant les états de couleur mal formés et les calculs cassés.",
        "Mises en page responsives qui préservent la densité d'outillage sur les petits écrans.",
      ],
      challengesAndSolutions: [
        {
          challenge:
            "Garder les contrôles avancés puissants tout en restant accessibles aux utilisateurs débutants.",
          solution:
            "Utilisation du dévoilement progressif et d'indices contextuels pour des flux par défaut simples mais une profondeur disponible.",
        },
        {
          challenge:
            "Éviter un comportement incohérent entre plusieurs outils de couleur dans la même app.",
          solution:
            "Centralisation des patterns d'interaction et de la logique de validation pour une expérience unifiée.",
        },
      ],
      hiringSignals: [
        "Démontre une pensée transverse entre qualité de design et exécution d'ingénierie.",
        "Prouve la capacité à construire un outillage de domaine avec des compromis clairs centrés utilisateur.",
        "Met en avant la discipline de cohérence au niveau UX et architecture de code.",
      ],
      nextIterations: [
        "Ajouter des presets d'export pour design tokens et workflows de remise aux équipes.",
        "Introduire des sessions sauvegardées pour des expérimentations de palettes répétables.",
        "Étendre les conseils pédagogiques pour des décisions de couleur orientées accessibilité.",
      ],
      tags: ["Scalable", "Design System", "Application Web"],
      impactHeading: "Comment ce projet crée de l'impact",
      impactPoints: [
        "Offre aux équipes un système plus net pour livrer des fonctionnalités sans sacrifier la cohérence.",
        "Rend les interfaces plus faciles à comprendre via un langage visuel répétable.",
        "Équilibre esthétique et performance pour maintenir une qualité élevée sur tous les appareils.",
      ],
    },
    zh: {
      tagline:
        "为需要一致性与速度的团队打造的结构化、可扩展的 Web 产品基础。",
      description:
        "Spectrum 帮助你挑选、探索与转换颜色——提供对比度检查、渐变、配色查找与无障碍友好的选择工具。",
      overview:
        "Spectrum 兼具视觉质量与工程纪律。项目强调一致的组件行为、可扩展的布局系统与清晰的 UX 流程，让用户与团队都能获得更可靠的产品体验。",
      roleSummary:
        "UI 工程师与产品设计师，将色彩理论流程转化为生产级的工具。",
      problemStatement:
        "色彩工作流常被碎片化地散落在不同工具中。Spectrum 将探索、校验与转换整合到统一的产品流程中。",
      objectives: [
        "通过即时视觉反馈实现快速的调色板探索。",
        "在不依赖专家级色彩知识的情况下支持无障碍友好的选择。",
        "在同一界面上下文中提供转换与渐变工具。",
      ],
      architectureDecisions: [
        "围绕对比度、渐变与查找能力构建以工具为导向的功能模块。",
        "通过可组合的 UI 基元，使高级控件在不同工具界面保持一致。",
        "状态设计让颜色更新可预期、易于推理。",
      ],
      implementationHighlights: [
        "提供快速的视觉迭代循环，用于尝试调色板与渐变。",
        "构建对设计师与工程师都友好的对比度检查流程。",
        "提供可减少重复手动颜色转换的转换辅助。",
      ],
      qualityAndSecurity: [
        "在所有工具界面采用可访问的语义结构与对比度敏感的呈现。",
        "输入处理减少异常颜色状态与失效计算。",
        "响应式布局在小屏设备上仍保留工具密度。",
      ],
      challengesAndSolutions: [
        {
          challenge:
            "在保持高级颜色控件强大的同时，让新手也能轻松上手。",
          solution:
            "采用渐进披露与上下文提示，让默认流程保持简洁，同时保留深度功能。",
        },
        {
          challenge:
            "避免同一应用中多个颜色工具间的行为不一致。",
          solution:
            "集中共享的交互模式与校验逻辑，打造统一体验。",
        },
      ],
      hiringSignals: [
        "体现设计质量与工程执行之间的跨职能思维。",
        "证明能够构建以用户为中心、取舍清晰的领域工具。",
        "在 UX 与代码架构层面都体现一致性纪律。",
      ],
      nextIterations: [
        "为设计 token 与团队交接流程添加导出预设。",
        "引入可保存的会话，便于重复进行调色板实验。",
        "扩展面向无障碍优先的色彩决策学习指导。",
      ],
      tags: ["可扩展", "设计系统", "Web 应用"],
      impactHeading: "本项目如何创造价值",
      impactPoints: [
        "为团队提供更清晰的系统，在不牺牲一致性的前提下交付功能。",
        "通过可复用的视觉语言，让界面更易被用户理解。",
        "在美学与性能之间取得平衡，在各类设备上保持高质量。",
      ],
    },
  },
  entropy: {
    en: {
      tagline:
        "An experimental concept refined into a stable, production-minded experience with strong technical foundations.",
      description:
        "Entropy helps you generate, evaluate, and refine secure passwords with tools for custom rules, strength scoring, and cryptography-backed randomness so you can create safer credentials with confidence.",
      overview:
        "Entropy started as a creative exploration and evolved into a structured product implementation. I focused on maintainability, interaction quality, and resilient behavior so the experience remains reliable under real usage conditions.",
      roleSummary:
        "Security-minded frontend engineer delivering reliable credential tooling with clear user guidance.",
      problemStatement:
        "Many password tools are either too simplistic or too technical. Entropy bridges that gap by making secure generation understandable and actionable.",
      objectives: [
        "Provide configurable password generation grounded in strong randomness principles.",
        "Make strength analysis readable so users can improve weak credentials confidently.",
        "Combine generation, evaluation, and refinement in one repeatable workflow.",
      ],
      architectureDecisions: [
        "Isolated generation, scoring, and rule configuration into explicit feature modules.",
        "Separated presentation and logic layers for easier testing and iteration.",
        "Designed deterministic UI states around validation and recommendation outputs.",
      ],
      implementationHighlights: [
        "Integrated cryptography-backed randomness for stronger generated outputs.",
        "Built transparent scoring feedback so users understand why passwords are weak or strong.",
        "Implemented custom-rule controls without sacrificing usability.",
      ],
      qualityAndSecurity: [
        "Security-first interaction design that avoids exposing sensitive data patterns.",
        "Robust input validation to guard against invalid rule combinations.",
        "Accessibility-aware UX to keep critical security workflows broadly usable.",
      ],
      challengesAndSolutions: [
        {
          challenge:
            "Conveying security complexity without overwhelming non-technical users.",
          solution:
            "Translated technical scoring outputs into plain-language recommendations and actionable improvements.",
        },
        {
          challenge:
            "Maintaining trust while introducing advanced customization controls.",
          solution:
            "Added clear defaults, constraints, and immediate feedback to prevent misconfiguration.",
        },
      ],
      hiringSignals: [
        "Demonstrates applied security thinking in product UX.",
        "Shows ability to simplify complex domains into reliable interfaces.",
        "Reflects strong attention to risk, validation, and user trust.",
      ],
      nextIterations: [
        "Add optional passphrase mode and entropy-comparison utilities.",
        "Provide downloadable security reports for personal credential audits.",
        "Expand automated test coverage around edge-case rule combinations.",
      ],
      tags: ["Experimental", "Responsive", "Engineering"],
      impactHeading: "How This Project Creates Impact",
      impactPoints: [
        "Turns complex interactions into a stable flow that users can trust.",
        "Improves maintainability with clearer architecture and component boundaries.",
        "Demonstrates product-level thinking beyond visuals by prioritizing reliability and UX outcomes.",
      ],
    },
    de: {
      tagline:
        "Ein experimentelles Konzept, verfeinert zu einem stabilen, produktionsorientierten Erlebnis mit starken technischen Grundlagen.",
      description:
        "Entropy hilft dir, sichere Passwörter zu erzeugen, zu bewerten und zu verfeinern — mit Tools für individuelle Regeln, Stärke-Scoring und Kryptografie-basierter Zufälligkeit, damit du sichere Zugangsdaten mit Vertrauen erstellst.",
      overview:
        "Entropy begann als kreative Erkundung und entwickelte sich zu einer strukturierten Produkt-Umsetzung. Ich habe Wert auf Wartbarkeit, Interaktionsqualität und resilientes Verhalten gelegt, damit die Erfahrung unter echten Nutzungsbedingungen zuverlässig bleibt.",
      roleSummary:
        "Sicherheitsbewusster Frontend Engineer, der verlässliches Credential-Tooling mit klarer Nutzerführung liefert.",
      problemStatement:
        "Viele Passwort-Tools sind entweder zu simpel oder zu technisch. Entropy schliesst diese Lücke, indem sichere Generierung verständlich und umsetzbar wird.",
      objectives: [
        "Konfigurierbare Passwort-Generierung auf Basis starker Zufallsprinzipien bereitstellen.",
        "Stärke-Analyse lesbar machen, damit Nutzer schwache Credentials selbstbewusst verbessern können.",
        "Generierung, Bewertung und Verfeinerung in einem wiederholbaren Workflow vereinen.",
      ],
      architectureDecisions: [
        "Generierung, Scoring und Regel-Konfiguration in explizite Feature-Module isoliert.",
        "Präsentations- und Logik-Schichten getrennt — für einfacheres Testen und Iterieren.",
        "Deterministische UI-States rund um Validierungs- und Empfehlungs-Outputs gestaltet.",
      ],
      implementationHighlights: [
        "Kryptografie-basierte Zufälligkeit für stärkere Outputs integriert.",
        "Transparentes Scoring-Feedback gebaut, damit Nutzer verstehen, warum Passwörter schwach oder stark sind.",
        "Custom-Rule-Controls implementiert, ohne Usability zu opfern.",
      ],
      qualityAndSecurity: [
        "Security-First-Interaktionsdesign, das keine sensiblen Muster offenlegt.",
        "Robuste Eingabe-Validierung gegen ungültige Regel-Kombinationen.",
        "Accessibility-bewusste UX, damit kritische Security-Workflows breit nutzbar bleiben.",
      ],
      challengesAndSolutions: [
        {
          challenge:
            "Security-Komplexität vermitteln, ohne nicht-technische Nutzer zu überfordern.",
          solution:
            "Technische Scoring-Outputs in einfache Empfehlungen und umsetzbare Verbesserungen übersetzt.",
        },
        {
          challenge:
            "Vertrauen erhalten, während fortgeschrittene Customization-Controls eingeführt werden.",
          solution:
            "Klare Defaults, Constraints und unmittelbares Feedback ergänzt, um Fehlkonfigurationen zu verhindern.",
        },
      ],
      hiringSignals: [
        "Zeigt angewandtes Security-Denken in Produkt-UX.",
        "Beweist die Fähigkeit, komplexe Domains in verlässliche Interfaces zu übersetzen.",
        "Spiegelt starken Fokus auf Risiko, Validierung und Nutzervertrauen.",
      ],
      nextIterations: [
        "Optionalen Passphrase-Modus und Entropy-Vergleichs-Utilities ergänzen.",
        "Herunterladbare Security-Reports für persönliche Credential-Audits bereitstellen.",
        "Automatisierte Test-Abdeckung für Edge-Case-Regelkombinationen ausbauen.",
      ],
      tags: ["Experimentell", "Responsive", "Engineering"],
      impactHeading: "Wie dieses Projekt Wirkung erzeugt",
      impactPoints: [
        "Verwandelt komplexe Interaktionen in einen stabilen Flow, dem Nutzer vertrauen können.",
        "Verbessert die Wartbarkeit durch klarere Architektur und Komponenten-Grenzen.",
        "Beweist produktorientiertes Denken jenseits des Visuellen — durch Priorisierung von Zuverlässigkeit und UX-Ergebnissen.",
      ],
    },
    fr: {
      tagline:
        "Un concept expérimental affiné en une expérience stable et orientée production, avec des fondations techniques solides.",
      description:
        "Entropy vous aide à générer, évaluer et affiner des mots de passe sécurisés grâce à des règles personnalisées, un scoring de robustesse et une aléatoire cryptographique, pour créer des identifiants plus sûrs en toute confiance.",
      overview:
        "Entropy a commencé comme une exploration créative pour évoluer en implémentation produit structurée. J'ai mis l'accent sur la maintenabilité, la qualité d'interaction et un comportement résilient pour que l'expérience reste fiable en conditions réelles.",
      roleSummary:
        "Ingénieur frontend orienté sécurité fournissant un outillage d'identifiants fiable avec un guidage clair pour l'utilisateur.",
      problemStatement:
        "Beaucoup d'outils de mots de passe sont soit trop simplistes, soit trop techniques. Entropy comble cet écart en rendant la génération sécurisée compréhensible et actionnable.",
      objectives: [
        "Fournir une génération de mots de passe configurable basée sur des principes solides d'aléa.",
        "Rendre l'analyse de robustesse lisible pour que les utilisateurs améliorent leurs identifiants faibles en confiance.",
        "Combiner génération, évaluation et raffinement dans un seul workflow répétable.",
      ],
      architectureDecisions: [
        "Isolation de la génération, du scoring et de la configuration des règles dans des modules explicites.",
        "Séparation des couches de présentation et de logique pour faciliter tests et itérations.",
        "Conception d'états UI déterministes autour des résultats de validation et de recommandation.",
      ],
      implementationHighlights: [
        "Intégration d'une aléatoire cryptographique pour des sorties générées plus solides.",
        "Construction d'un feedback de scoring transparent pour expliquer la robustesse des mots de passe.",
        "Implémentation de contrôles de règles personnalisées sans sacrifier l'utilisabilité.",
      ],
      qualityAndSecurity: [
        "Design d'interaction orienté sécurité qui évite d'exposer des patterns de données sensibles.",
        "Validation d'entrée robuste contre les combinaisons de règles invalides.",
        "UX consciente de l'accessibilité pour garder les workflows de sécurité critiques largement utilisables.",
      ],
      challengesAndSolutions: [
        {
          challenge:
            "Communiquer la complexité de la sécurité sans submerger des utilisateurs non techniques.",
          solution:
            "Traduction des sorties techniques de scoring en recommandations en langage clair et améliorations actionnables.",
        },
        {
          challenge:
            "Maintenir la confiance tout en introduisant des contrôles de personnalisation avancés.",
          solution:
            "Ajout de valeurs par défaut claires, de contraintes et d'un feedback immédiat pour éviter les mauvaises configurations.",
        },
      ],
      hiringSignals: [
        "Démontre une pensée sécurité appliquée à l'UX produit.",
        "Montre la capacité à simplifier des domaines complexes en interfaces fiables.",
        "Reflète une forte attention au risque, à la validation et à la confiance utilisateur.",
      ],
      nextIterations: [
        "Ajouter un mode passphrase optionnel et des utilitaires de comparaison d'entropie.",
        "Fournir des rapports de sécurité téléchargeables pour audits d'identifiants personnels.",
        "Étendre la couverture de tests automatisés sur les combinaisons de règles limites.",
      ],
      tags: ["Expérimental", "Responsive", "Ingénierie"],
      impactHeading: "Comment ce projet crée de l'impact",
      impactPoints: [
        "Transforme des interactions complexes en un flux stable auquel les utilisateurs peuvent faire confiance.",
        "Améliore la maintenabilité grâce à une architecture et des frontières de composants plus claires.",
        "Démontre une pensée au niveau produit, au-delà du visuel, en priorisant fiabilité et résultats UX.",
      ],
    },
    zh: {
      tagline:
        "由实验概念打磨为具有扎实技术基础的、面向生产的稳定体验。",
      description:
        "Entropy 通过自定义规则、强度评分与密码学级随机性，帮助你生成、评估并优化安全密码，从容地创建更安全的凭据。",
      overview:
        "Entropy 起源于一次创意探索，最终演化为结构化的产品实现。我专注于可维护性、交互质量与稳健行为，使其在真实使用中依然可靠。",
      roleSummary:
        "注重安全的前端工程师，交付提供清晰用户指引的可靠凭据工具。",
      problemStatement:
        "许多密码工具要么过于简单，要么过于技术化。Entropy 通过把安全生成变得可理解、可执行，弥合了这一空白。",
      objectives: [
        "提供建立在强随机性原则之上的可配置密码生成。",
        "让强度分析可读，使用户能放心地改进弱凭据。",
        "在同一个可重复的工作流中整合生成、评估与优化。",
      ],
      architectureDecisions: [
        "将生成、评分与规则配置隔离为明确的功能模块。",
        "分离表现层与逻辑层，便于测试与迭代。",
        "围绕校验与建议输出设计确定性的 UI 状态。",
      ],
      implementationHighlights: [
        "集成密码学级随机性，生成更强的输出。",
        "提供透明的评分反馈，让用户理解为何密码弱或强。",
        "在不牺牲易用性的前提下实现自定义规则控件。",
      ],
      qualityAndSecurity: [
        "以安全为先的交互设计，避免暴露敏感数据模式。",
        "稳健的输入校验，防止非法的规则组合。",
        "考量可访问性的 UX，让关键安全流程保持广泛可用。",
      ],
      challengesAndSolutions: [
        {
          challenge:
            "在不让非技术用户感到压力的情况下传达安全的复杂性。",
          solution:
            "将技术化的评分输出转化为通俗的建议与可执行的改进。",
        },
        {
          challenge:
            "在引入高级自定义控件时维持用户信任。",
          solution:
            "添加清晰的默认值、约束与即时反馈，防止配置出错。",
        },
      ],
      hiringSignals: [
        "在产品 UX 中体现应用化的安全思维。",
        "证明可以把复杂领域简化为可信的界面。",
        "体现对风险、校验与用户信任的高度关注。",
      ],
      nextIterations: [
        "增加可选的口令短语模式与熵对比工具。",
        "提供可下载的安全报告用于个人凭据审计。",
        "扩展对边界规则组合的自动化测试覆盖。",
      ],
      tags: ["实验性", "响应式", "工程"],
      impactHeading: "本项目如何创造价值",
      impactPoints: [
        "把复杂交互转化为用户可信赖的稳定流程。",
        "通过更清晰的架构与组件边界提升可维护性。",
        "通过优先关注可靠性与 UX 结果，展示超越视觉的产品级思考。",
      ],
    },
  },
  remnants: {
    en: {
      tagline:
        "A browser-native code editor built for developers who think in files.",
      description:
        "Remnants is an in-browser IDE with persistent file tree management, multi-panel layouts, and syntax highlighting — a fully capable editing environment that lives entirely in your browser.",
      overview:
        "Remnants brings the IDE experience to the browser without any installation. Built with React and TypeScript, it delivers a familiar workspace with recursive file trees, split panel editing, quick-open navigation, and full syntax highlighting — all persisted locally across sessions.",
      roleSummary:
        "Full-stack frontend engineer architecting a production-grade in-browser development environment from scratch.",
      problemStatement:
        "Setting up a local development environment has a high barrier to entry. Remnants brings a capable, familiar editing workflow directly into the browser — instantly accessible from any device.",
      objectives: [
        "Build a persistent file tree with full create, rename, and delete operations that survives page reloads.",
        "Implement multi-panel layouts with independent scroll and focus state per panel.",
        "Deliver syntax-highlighted code editing with a responsive, IDE-like interface.",
      ],
      architectureDecisions: [
        "localStorage-backed persistence layer for both workspace tree structure and per-file content.",
        "Immutable recursive tree data structure enabling safe, predictable nested file operations.",
        "Component isolation between FileTree, Panel, and SyntaxHighlighter for independent scaling.",
      ],
      implementationHighlights: [
        "Built a fully recursive file tree with path-aware create, rename, delete, and duplicate prevention.",
        "Implemented quick-open functionality for fast keyboard-driven navigation across nested file structures.",
        "Delivered real-time syntax highlighting with a custom-styled monospace editing experience.",
      ],
      qualityAndSecurity: [
        "Path-aware recursive state updates with operation success tracking to prevent tree corruption.",
        "Input validation on file and folder naming to reject invalid or conflicting entries.",
        "Graceful degradation for empty workspace states and missing or malformed storage entries.",
      ],
      challengesAndSolutions: [
        {
          challenge:
            "Maintaining correct tree state through deeply nested create, rename, and delete operations.",
          solution:
            "Built a path-aware recursive update system returning both the updated tree and an operation success flag, enabling reliable rollback on failure.",
        },
        {
          challenge:
            "Preserving editor content and scroll position when switching between open files.",
          solution:
            "Decoupled file content storage from panel rendering so each panel independently manages its own view state without cross-contamination.",
        },
      ],
      hiringSignals: [
        "Demonstrates ability to build complex stateful UIs with recursive tree data structures.",
        "Shows architectural thinking around component isolation and predictable data flow.",
        "Proves comfort building developer-facing tooling and editor-domain products.",
      ],
      nextIterations: [
        "Add real-time collaborative editing with cursor and selection sharing.",
        "Introduce file-type detection for smarter per-language syntax highlighting.",
        "Expand keyboard shortcut coverage for full power-user workflow parity.",
      ],
      tags: ["Dev Tools", "TypeScript", "Browser IDE"],
      impactHeading: "How This Project Creates Impact",
      impactPoints: [
        "Lowers the barrier to entry for coding by making a capable editor instantly accessible in any browser.",
        "Demonstrates deep mastery of complex tree-based UI state management at production quality.",
        "Reflects genuine developer empathy — building tools that developers themselves want to use.",
      ],
    },
    de: {
      tagline:
        "Ein browser-nativer Code-Editor für Entwickler, die in Dateien denken.",
      description:
        "Remnants ist eine im Browser laufende IDE mit persistentem Datei-Baum, Multi-Panel-Layouts und Syntax-Highlighting — eine voll funktionsfähige Editor-Umgebung, die komplett im Browser lebt.",
      overview:
        "Remnants bringt die IDE-Erfahrung ohne jegliche Installation in den Browser. Mit React und TypeScript gebaut, liefert es einen vertrauten Workspace mit rekursiven Datei-Bäumen, Split-Panel-Editing, Quick-Open-Navigation und vollständigem Syntax-Highlighting — alles lokal über Sessions hinweg persistent.",
      roleSummary:
        "Full-Stack-Frontend-Engineer, der eine produktionsreife In-Browser-Entwicklungs-Umgebung von Grund auf aufgebaut hat.",
      problemStatement:
        "Eine lokale Entwicklungs-Umgebung aufzusetzen hat eine hohe Einstiegshürde. Remnants bringt einen leistungsfähigen, vertrauten Editor-Workflow direkt in den Browser — sofort von jedem Gerät aus zugänglich.",
      objectives: [
        "Einen persistenten Datei-Baum mit vollständigen Create-, Rename- und Delete-Operationen bauen, der Seiten-Reloads übersteht.",
        "Multi-Panel-Layouts mit eigenem Scroll- und Fokus-State pro Panel umsetzen.",
        "Syntax-Highlighting-Editing mit einem responsiven, IDE-ähnlichen Interface liefern.",
      ],
      architectureDecisions: [
        "localStorage-basierte Persistenz für Baum-Struktur und Datei-Inhalte.",
        "Unveränderliche rekursive Baum-Datenstruktur für sichere, vorhersehbare verschachtelte Datei-Operationen.",
        "Komponenten-Isolation zwischen FileTree, Panel und SyntaxHighlighter für unabhängige Skalierung.",
      ],
      implementationHighlights: [
        "Voll rekursiver Datei-Baum mit pfadbasiertem Create, Rename, Delete und Duplikat-Prävention.",
        "Quick-Open-Funktion für schnelle Tastatur-Navigation durch verschachtelte Datei-Strukturen.",
        "Echtzeit-Syntax-Highlighting mit individuell gestyltem Monospace-Editing.",
      ],
      qualityAndSecurity: [
        "Pfadbasierte rekursive State-Updates mit Operation-Success-Tracking, um Baum-Korruption zu verhindern.",
        "Eingabe-Validierung bei Datei- und Ordner-Namen, um ungültige oder konfliktreiche Einträge abzulehnen.",
        "Graceful Degradation für leere Workspace-States und fehlende oder fehlerhafte Storage-Einträge.",
      ],
      challengesAndSolutions: [
        {
          challenge:
            "Korrekten Baum-State über tief verschachtelte Create-, Rename- und Delete-Operationen erhalten.",
          solution:
            "Pfadbasiertes rekursives Update-System gebaut, das sowohl den aktualisierten Baum als auch ein Operation-Success-Flag zurückgibt — zuverlässiges Rollback bei Fehlern.",
        },
        {
          challenge:
            "Editor-Inhalt und Scroll-Position beim Wechsel zwischen geöffneten Dateien erhalten.",
          solution:
            "Datei-Content-Speicher von der Panel-Rendering entkoppelt, sodass jedes Panel seinen View-State unabhängig verwaltet — ohne Kreuzwirkung.",
        },
      ],
      hiringSignals: [
        "Beweist die Fähigkeit, komplexe stateful UIs mit rekursiven Baum-Strukturen zu bauen.",
        "Zeigt architektonisches Denken rund um Komponenten-Isolation und vorhersehbaren Datenfluss.",
        "Beweist Souveränität beim Bauen entwicklerorientierter Tools und Editor-Produkte.",
      ],
      nextIterations: [
        "Echtzeit-Collaborative-Editing mit Cursor- und Selection-Sharing ergänzen.",
        "Datei-Typ-Erkennung für smarteres sprachspezifisches Syntax-Highlighting einführen.",
        "Tastatur-Shortcut-Abdeckung für vollständige Power-User-Workflow-Parität ausbauen.",
      ],
      tags: ["Dev Tools", "TypeScript", "Browser-IDE"],
      impactHeading: "Wie dieses Projekt Wirkung erzeugt",
      impactPoints: [
        "Senkt die Einstiegshürde fürs Programmieren — ein leistungsfähiger Editor, sofort in jedem Browser nutzbar.",
        "Beweist tiefe Beherrschung komplexer baum-basierter UI-State-Verwaltung auf Produktionsqualität.",
        "Spiegelt echte Developer-Empathie — Tools bauen, die Entwickler selbst nutzen wollen.",
      ],
    },
    fr: {
      tagline:
        "Un éditeur de code natif au navigateur, conçu pour les développeurs qui pensent en fichiers.",
      description:
        "Remnants est un IDE dans le navigateur avec gestion persistante de l'arborescence, mises en page multi-panneaux et coloration syntaxique — un environnement d'édition complet qui vit entièrement dans votre navigateur.",
      overview:
        "Remnants apporte l'expérience IDE au navigateur sans aucune installation. Bâti avec React et TypeScript, il offre un espace de travail familier avec arborescences récursives, édition en panneaux fractionnés, navigation rapide et coloration syntaxique complète — le tout persisté localement entre sessions.",
      roleSummary:
        "Ingénieur frontend full-stack ayant architecturé de zéro un environnement de développement de qualité production dans le navigateur.",
      problemStatement:
        "Configurer un environnement de développement local représente une vraie barrière. Remnants apporte un workflow d'édition complet et familier directement dans le navigateur — instantanément accessible depuis n'importe quel appareil.",
      objectives: [
        "Construire une arborescence persistante avec des opérations complètes de création, renommage et suppression survivant aux rechargements de page.",
        "Implémenter des mises en page multi-panneaux avec scroll et focus indépendants par panneau.",
        "Offrir une édition de code avec coloration syntaxique dans une interface responsive de type IDE.",
      ],
      architectureDecisions: [
        "Couche de persistance basée sur localStorage pour la structure de l'arborescence et le contenu des fichiers.",
        "Structure de données arborescente récursive immuable pour des opérations imbriquées sûres et prévisibles.",
        "Isolation des composants entre FileTree, Panel et SyntaxHighlighter pour une montée en charge indépendante.",
      ],
      implementationHighlights: [
        "Arborescence entièrement récursive avec création, renommage, suppression et prévention de doublons conscients du chemin.",
        "Fonction de navigation rapide pour parcourir au clavier des structures de fichiers imbriquées.",
        "Coloration syntaxique en temps réel avec une expérience d'édition monospace stylisée sur mesure.",
      ],
      qualityAndSecurity: [
        "Mises à jour d'état récursives conscientes du chemin avec suivi de succès pour éviter la corruption de l'arborescence.",
        "Validation d'entrée pour les noms de fichiers et dossiers rejetant les entrées invalides ou en conflit.",
        "Dégradation gracieuse pour les espaces vides et les entrées de stockage manquantes ou mal formées.",
      ],
      challengesAndSolutions: [
        {
          challenge:
            "Maintenir un état d'arborescence correct à travers des opérations imbriquées profondes de création, renommage et suppression.",
          solution:
            "Système de mise à jour récursif conscient du chemin retournant à la fois l'arborescence mise à jour et un drapeau de succès, permettant un rollback fiable en cas d'échec.",
        },
        {
          challenge:
            "Préserver le contenu de l'éditeur et la position de scroll lors du basculement entre fichiers ouverts.",
          solution:
            "Découplage du stockage du contenu des fichiers et du rendu des panneaux, chaque panneau gérant indépendamment son état de vue sans contamination croisée.",
        },
      ],
      hiringSignals: [
        "Démontre la capacité à bâtir des UIs stateful complexes avec des structures arborescentes récursives.",
        "Montre une pensée architecturale autour de l'isolation des composants et d'un flux de données prévisible.",
        "Prouve l'aisance à construire des outils destinés aux développeurs et des produits du domaine éditeur.",
      ],
      nextIterations: [
        "Ajouter l'édition collaborative en temps réel avec partage de curseur et de sélection.",
        "Introduire la détection du type de fichier pour une coloration syntaxique plus intelligente par langage.",
        "Étendre la couverture des raccourcis clavier pour une parité totale avec les workflows power-user.",
      ],
      tags: ["Outils Dev", "TypeScript", "IDE Navigateur"],
      impactHeading: "Comment ce projet crée de l'impact",
      impactPoints: [
        "Réduit la barrière à l'entrée pour coder en rendant un éditeur compétent instantanément accessible dans n'importe quel navigateur.",
        "Démontre une maîtrise approfondie de la gestion d'état UI à base d'arborescences, à un niveau de qualité production.",
        "Reflète une vraie empathie développeur — créer des outils que les développeurs eux-mêmes ont envie d'utiliser.",
      ],
    },
    zh: {
      tagline:
        "为以文件为思考单位的开发者打造的浏览器原生代码编辑器。",
      description:
        "Remnants 是一个浏览器内的 IDE，具备持久化的文件树管理、多面板布局与语法高亮——一个完全运行在浏览器中的全功能编辑环境。",
      overview:
        "Remnants 把 IDE 体验带入浏览器，无需任何安装。基于 React 与 TypeScript 构建，提供熟悉的工作区，包括递归文件树、分屏面板编辑、快速打开导航与完整语法高亮，所有内容跨会话本地持久化。",
      roleSummary:
        "全栈前端工程师，从零搭建生产级的浏览器内开发环境。",
      problemStatement:
        "搭建本地开发环境门槛较高。Remnants 把成熟且熟悉的编辑工作流直接带入浏览器——任意设备即点即用。",
      objectives: [
        "构建可经受页面刷新的持久化文件树，支持完整的创建、重命名与删除操作。",
        "实现多面板布局，每个面板拥有独立的滚动与焦点状态。",
        "提供具备语法高亮的代码编辑体验，配以响应式、类 IDE 的界面。",
      ],
      architectureDecisions: [
        "基于 localStorage 的持久化层，存储工作区树结构与各文件内容。",
        "不可变的递归树数据结构，保证安全、可预期的嵌套文件操作。",
        "FileTree、Panel 与 SyntaxHighlighter 之间的组件隔离，便于独立扩展。",
      ],
      implementationHighlights: [
        "构建完全递归的文件树，支持路径感知的创建、重命名、删除与重名防护。",
        "实现快速打开功能，便于在嵌套结构中通过键盘高速导航。",
        "提供实时语法高亮，并以自定义样式的等宽字体打造编辑体验。",
      ],
      qualityAndSecurity: [
        "路径感知的递归状态更新，并跟踪操作成功状态，防止树结构损坏。",
        "对文件与文件夹命名进行输入校验，拒绝非法或冲突的条目。",
        "对空工作区与缺失或异常的存储条目提供优雅降级。",
      ],
      challengesAndSolutions: [
        {
          challenge:
            "在深层嵌套的创建、重命名与删除操作中保持正确的树状态。",
          solution:
            "构建路径感知的递归更新系统，同时返回更新后的树与操作成功标志，使失败时可可靠回滚。",
        },
        {
          challenge:
            "在切换打开的文件时保留编辑器内容与滚动位置。",
          solution:
            "将文件内容存储与面板渲染解耦，让每个面板独立管理自己的视图状态，避免互相干扰。",
        },
      ],
      hiringSignals: [
        "证明能够基于递归树结构构建复杂的有状态 UI。",
        "展示在组件隔离与可预期数据流方面的架构思维。",
        "说明在开发者向工具与编辑器类产品方面驾驭自如。",
      ],
      nextIterations: [
        "加入带光标与选区共享的实时协作编辑。",
        "引入文件类型识别，实现按语言更智能的语法高亮。",
        "扩展快捷键覆盖，达到完整的高级用户工作流对等。",
      ],
      tags: ["开发工具", "TypeScript", "浏览器 IDE"],
      impactHeading: "本项目如何创造价值",
      impactPoints: [
        "通过让一款完备的编辑器在任意浏览器中即点即用，降低编码门槛。",
        "在生产级质量上展示对复杂树状 UI 状态管理的深度掌握。",
        "体现真正的开发者同理心——构建开发者自己愿意使用的工具。",
      ],
    },
  },
};

const resolveContent = (slug: string, lang: Language): LocalizedContent => {
  const entry = PROJECT_CONTENT[slug];
  return entry[lang] ?? entry.en;
};

const buildProject = (base: ProjectBase, lang: Language): PortfolioProject => {
  const content = resolveContent(base.slug, lang);
  return {
    ...base,
    ...content,
  };
};

export const getProjects = (lang: Language): PortfolioProject[] =>
  PROJECT_BASE.map((base) => buildProject(base, lang));

export const getProject = (
  slug: string,
  lang: Language
): PortfolioProject | undefined => {
  const base = PROJECT_BASE.find((item) => item.slug === slug);
  if (!base) return undefined;
  return buildProject(base, lang);
};

export const PORTFOLIO_PROJECTS: PortfolioProject[] = getProjects("en");
