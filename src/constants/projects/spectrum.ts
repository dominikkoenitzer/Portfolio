import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const spectrum: Record<Language, LocalizedContent> = {
  en: {
    tagline:
      "A fast, accessible color workbench — pick, explore, and transform colors, then check them against real contrast standards.",
    description:
      "Spectrum is a color tool for picking, exploring, and transforming colors, with contrast checking, gradient generation, color lookup, and accessibility-aware recommendations.",
    overview:
      "Spectrum is a solo project built in Next.js and TypeScript. It pulls the scattered pieces of a color workflow — picking, converting, building gradients, and checking contrast — into one fast interface, with recommendations that steer toward WCAG-friendly choices.",
    roleSummary:
      "Sole designer and developer: product, UX, and the full Next.js/TypeScript implementation.",
    problemStatement:
      "Color work is usually spread across disconnected tools — one to pick, another to check contrast, another for gradients. Spectrum unifies exploration, conversion, and accessibility checking in a single flow.",
    objectives: [
      "Make palette exploration and color conversion fast, with immediate visual feedback.",
      "Build contrast checking in so accessibility is a default, not an afterthought.",
      "Keep advanced color tooling approachable for non-experts.",
    ],
    architectureDecisions: [
      "Built with Next.js and TypeScript for a type-safe, maintainable UI.",
      "Feature modules for contrast, gradients, and lookup that share composable primitives.",
      "Predictable color state so every tool reflects updates consistently.",
    ],
    implementationHighlights: [
      "A WCAG-style contrast checker that reads clearly for designers and engineers alike.",
      "Gradient generation and color-format conversion in the same context.",
      "Accessibility-aware recommendations that nudge toward usable color pairs.",
    ],
    qualityAndSecurity: [
      "Accessibility is first-class — contrast and semantics built into the core flow.",
      "Input handling that guards against malformed color values.",
      "Responsive layouts that keep tool density usable on small screens.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Keeping powerful color controls approachable for first-time users.",
        solution:
          "Progressive disclosure — simple defaults up front, with depth available on demand.",
      },
      {
        challenge: "Consistent behavior across several color tools in one app.",
        solution:
          "Shared interaction patterns and validation centralized across every tool surface.",
      },
    ],
    hiringSignals: [
      "Accessibility built in by default — a signal teams genuinely care about.",
      "A type-safe Next.js/TypeScript front end owned end to end.",
      "Turns a fuzzy domain (color) into a precise, usable tool.",
    ],
    nextIterations: [
      "Export presets for design tokens and developer handoff.",
      "Saved palettes and repeatable sessions.",
      "More guidance for accessibility-first color decisions.",
    ],
    tags: ["Next.js", "TypeScript", "Accessibility"],
    impactHeading: "How This Project Creates Impact",
    impactPoints: [
      "Makes accessible color choices the easy default.",
      "Saves time by unifying picking, converting, and contrast-checking in one place.",
      "Keeps quality high across devices with responsive, type-safe UI.",
    ],
  },
  de: {
    tagline:
      "Eine schnelle, barrierefreie Farb-Werkbank — Farben auswählen, erkunden und transformieren und sie dann gegen echte Kontrast-Standards prüfen.",
    description:
      "Spectrum ist ein Farb-Tool zum Auswählen, Erkunden und Transformieren von Farben, mit Kontrast-Prüfung, Gradient-Generierung, Farb-Lookup und barrierefreiheits-bewussten Empfehlungen.",
    overview:
      "Spectrum ist ein Solo-Projekt, gebaut mit Next.js und TypeScript. Es bündelt die verstreuten Teile eines Farb-Workflows — Auswählen, Konvertieren, Gradienten bauen und Kontrast prüfen — in einem schnellen Interface, mit Empfehlungen, die zu WCAG-konformen Entscheidungen führen.",
    roleSummary:
      "Alleiniger Designer und Entwickler: Produkt, UX und die vollständige Next.js/TypeScript-Implementierung.",
    problemStatement:
      "Farb-Arbeit ist meist über getrennte Tools verteilt — eines zum Auswählen, eines für Kontrast, eines für Gradienten. Spectrum vereint Erkundung, Konvertierung und Barrierefreiheits-Prüfung in einem einzigen Flow.",
    objectives: [
      "Paletten-Erkundung und Farb-Konvertierung schnell machen, mit sofortigem visuellem Feedback.",
      "Kontrast-Prüfung einbauen, damit Barrierefreiheit Standard ist, kein Nachgedanke.",
      "Fortgeschrittenes Farb-Tooling auch für Nicht-Experten zugänglich halten.",
    ],
    architectureDecisions: [
      "Mit Next.js und TypeScript gebaut für ein typsicheres, wartbares UI.",
      "Feature-Module für Kontrast, Gradienten und Lookup, die komponierbare Primitiven teilen.",
      "Vorhersehbarer Farb-State, damit jedes Tool Updates konsistent widerspiegelt.",
    ],
    implementationHighlights: [
      "Ein WCAG-artiger Kontrast-Checker, der für Designer und Engineers gleichermaßen klar lesbar ist.",
      "Gradient-Generierung und Farb-Format-Konvertierung im selben Kontext.",
      "Barrierefreiheits-bewusste Empfehlungen, die zu nutzbaren Farb-Paaren führen.",
    ],
    qualityAndSecurity: [
      "Barrierefreiheit ist erstklassig — Kontrast und Semantik sind im Kern-Flow verankert.",
      "Eingabe-Handling, das gegen fehlerhafte Farbwerte absichert.",
      "Responsive Layouts, die die Tool-Dichte auch auf kleinen Bildschirmen nutzbar halten.",
    ],
    challengesAndSolutions: [
      {
        challenge: "Mächtige Farb-Controls für Erstnutzer zugänglich halten.",
        solution:
          "Progressive Disclosure — einfache Defaults zuerst, Tiefe bei Bedarf verfügbar.",
      },
      {
        challenge:
          "Konsistentes Verhalten über mehrere Farb-Tools in einer App.",
        solution:
          "Geteilte Interaktionsmuster und Validierung, zentralisiert über alle Tool-Oberflächen.",
      },
    ],
    hiringSignals: [
      "Barrierefreiheit von Haus aus eingebaut — ein Signal, das Teams wirklich wichtig ist.",
      "Ein typsicheres Next.js/TypeScript-Frontend, Ende zu Ende verantwortet.",
      "Macht aus einer unscharfen Domäne (Farbe) ein präzises, nutzbares Tool.",
    ],
    nextIterations: [
      "Export-Presets für Design-Tokens und Entwickler-Handoff.",
      "Gespeicherte Paletten und wiederholbare Sessions.",
      "Mehr Anleitung für barrierefreiheits-orientierte Farb-Entscheidungen.",
    ],
    tags: ["Next.js", "TypeScript", "Barrierefreiheit"],
    impactHeading: "Wie dieses Projekt Wirkung erzeugt",
    impactPoints: [
      "Macht barrierefreie Farb-Entscheidungen zum einfachen Standard.",
      "Spart Zeit, indem Auswählen, Konvertieren und Kontrast-Prüfung an einem Ort vereint werden.",
      "Hält die Qualität geräteübergreifend hoch — mit responsivem, typsicherem UI.",
    ],
  },
  fr: {
    tagline:
      "Un atelier de couleurs rapide et accessible — choisir, explorer et transformer des couleurs, puis les vérifier face à de vrais standards de contraste.",
    description:
      "Spectrum est un outil de couleurs pour choisir, explorer et transformer des couleurs, avec vérification de contraste, génération de dégradés, recherche de couleurs et recommandations soucieuses de l'accessibilité.",
    overview:
      "Spectrum est un projet solo bâti en Next.js et TypeScript. Il rassemble les pièces éparpillées d'un workflow couleur — choisir, convertir, créer des dégradés et vérifier le contraste — dans une interface rapide, avec des recommandations qui orientent vers des choix conformes WCAG.",
    roleSummary:
      "Seul concepteur et développeur : produit, UX et l'implémentation Next.js/TypeScript complète.",
    problemStatement:
      "Le travail des couleurs est généralement éclaté entre des outils déconnectés — un pour choisir, un pour le contraste, un pour les dégradés. Spectrum unifie exploration, conversion et vérification d'accessibilité dans un seul flux.",
    objectives: [
      "Rendre l'exploration de palettes et la conversion de couleurs rapides, avec un retour visuel immédiat.",
      "Intégrer la vérification de contraste pour que l'accessibilité soit un défaut, pas une réflexion après coup.",
      "Garder l'outillage couleur avancé accessible aux non-experts.",
    ],
    architectureDecisions: [
      "Bâti en Next.js et TypeScript pour une UI typée et maintenable.",
      "Des modules de fonctionnalités pour le contraste, les dégradés et la recherche, partageant des primitives composables.",
      "Un état couleur prévisible pour que chaque outil reflète les mises à jour de façon cohérente.",
    ],
    implementationHighlights: [
      "Un vérificateur de contraste façon WCAG, lisible aussi bien pour les designers que pour les ingénieurs.",
      "Génération de dégradés et conversion de formats de couleur dans le même contexte.",
      "Des recommandations soucieuses de l'accessibilité qui orientent vers des paires de couleurs utilisables.",
    ],
    qualityAndSecurity: [
      "L'accessibilité est de premier plan — contraste et sémantique intégrés au flux principal.",
      "Une gestion des entrées qui protège contre les valeurs de couleur mal formées.",
      "Des mises en page responsives qui gardent la densité d'outils utilisable sur petits écrans.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Garder des contrôles couleur puissants accessibles aux nouveaux utilisateurs.",
        solution:
          "Dévoilement progressif — des défauts simples d'abord, la profondeur disponible à la demande.",
      },
      {
        challenge:
          "Un comportement cohérent à travers plusieurs outils couleur dans une même app.",
        solution:
          "Des schémas d'interaction et une validation partagés, centralisés sur chaque surface d'outil.",
      },
    ],
    hiringSignals: [
      "Accessibilité intégrée par défaut — un signal qui compte vraiment pour les équipes.",
      "Un frontend Next.js/TypeScript typé, porté de bout en bout.",
      "Transforme un domaine flou (la couleur) en un outil précis et utilisable.",
    ],
    nextIterations: [
      "Presets d'export pour les design tokens et le handoff développeur.",
      "Palettes sauvegardées et sessions reproductibles.",
      "Plus de guidage pour des décisions couleur centrées sur l'accessibilité.",
    ],
    tags: ["Next.js", "TypeScript", "Accessibilité"],
    impactHeading: "Comment ce projet crée de l'impact",
    impactPoints: [
      "Fait des choix de couleur accessibles le défaut évident.",
      "Fait gagner du temps en unifiant le choix, la conversion et la vérification de contraste au même endroit.",
      "Maintient une qualité élevée sur tous les appareils grâce à une UI responsive et typée.",
    ],
  },
  zh: {
    tagline:
      "一个快速且无障碍的颜色工作台——选取、探索与转换颜色，并对照真实的对比度标准进行检查。",
    description:
      "Spectrum 是一个颜色工具，用于选取、探索与转换颜色，具备对比度检查、渐变生成、颜色查找以及关注无障碍的推荐。",
    overview:
      "Spectrum 是一个使用 Next.js 与 TypeScript 构建的独立项目。它将颜色工作流中分散的环节——选取、转换、构建渐变与检查对比度——汇聚到一个快速的界面中，并通过推荐引导用户做出符合 WCAG 的选择。",
    roleSummary:
      "唯一的设计者与开发者：产品、UX，以及完整的 Next.js/TypeScript 实现。",
    problemStatement:
      "颜色相关的工作通常分散在彼此割裂的工具中——一个用于选取、一个用于对比度、一个用于渐变。Spectrum 将探索、转换与无障碍检查统一到一个流程里。",
    objectives: [
      "让调色板探索与颜色转换变得快速，并提供即时的视觉反馈。",
      "内置对比度检查，让无障碍成为默认，而非事后补救。",
      "让进阶的颜色工具对非专家也保持易用。",
    ],
    architectureDecisions: [
      "使用 Next.js 与 TypeScript 构建，打造类型安全、可维护的 UI。",
      "为对比度、渐变与查找设计的功能模块，共享可组合的基元。",
      "可预测的颜色状态，让每个工具都能一致地反映更新。",
    ],
    implementationHighlights: [
      "一个 WCAG 风格的对比度检查器，对设计师与工程师都清晰易读。",
      "在同一上下文中进行渐变生成与颜色格式转换。",
      "关注无障碍的推荐，引导用户选择可用的配色。",
    ],
    qualityAndSecurity: [
      "无障碍是头等大事——对比度与语义化融入核心流程。",
      "输入处理可防范格式错误的颜色值。",
      "响应式布局，在小屏幕上也能保持工具密度的可用性。",
    ],
    challengesAndSolutions: [
      {
        challenge: "在保持颜色控件强大的同时，让初次使用者也能上手。",
        solution: "渐进式披露——先给出简单的默认值，进阶能力按需提供。",
      },
      {
        challenge: "在一个应用中的多个颜色工具间保持一致的行为。",
        solution: "在每个工具界面间共享并集中化交互模式与校验逻辑。",
      },
    ],
    hiringSignals: [
      "默认内置无障碍——这是团队真正看重的信号。",
      "端到端独立负责的、类型安全的 Next.js/TypeScript 前端。",
      "把一个模糊的领域（颜色）变成精确、可用的工具。",
    ],
    nextIterations: [
      "面向设计 token 与开发交接的导出预设。",
      "可保存的调色板与可复现的会话。",
      "为以无障碍为先的配色决策提供更多指导。",
    ],
    tags: ["Next.js", "TypeScript", "无障碍"],
    impactHeading: "本项目如何创造价值",
    impactPoints: [
      "让无障碍的配色成为轻松的默认选择。",
      "通过将选取、转换与对比度检查统一在一处来节省时间。",
      "凭借响应式、类型安全的 UI，在各类设备上保持高质量。",
    ],
  },
};
