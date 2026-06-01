import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const spectrum: Record<Language, LocalizedContent> = {
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
    tagline: "为需要一致性与速度的团队打造的结构化、可扩展的 Web 产品基础。",
    description:
      "Spectrum 帮助你挑选、探索与转换颜色——提供对比度检查、渐变、配色查找与无障碍友好的选择工具。",
    overview:
      "Spectrum 兼具视觉质量与工程纪律。项目强调一致的组件行为、可扩展的布局系统与清晰的 UX 流程，让用户与团队都能获得更可靠的产品体验。",
    roleSummary: "UI 工程师与产品设计师，将色彩理论流程转化为生产级的工具。",
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
        challenge: "在保持高级颜色控件强大的同时，让新手也能轻松上手。",
        solution:
          "采用渐进披露与上下文提示，让默认流程保持简洁，同时保留深度功能。",
      },
      {
        challenge: "避免同一应用中多个颜色工具间的行为不一致。",
        solution: "集中共享的交互模式与校验逻辑，打造统一体验。",
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
};
