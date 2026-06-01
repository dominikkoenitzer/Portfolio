import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const zephyr: Record<Language, LocalizedContent> = {
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
    tagline: "以性能为先的产品体验，帮助人们快速在复杂信息中导航。",
    description: "Zephyr 帮助你保持专注、管理任务、规划日程并追踪进度。",
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
        challenge: "在任务工具不断增加的情况下，平衡功能深度与平静的界面。",
        solution:
          "构建分层结构：主操作常驻可见，高级操作以渐进披露的方式呈现。",
      },
      {
        challenge: "在快速迭代新模块时保持视觉一致性。",
        solution: "标准化卡片、间距与排版基元，保持系统级一致性。",
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
};
