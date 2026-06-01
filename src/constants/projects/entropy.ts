import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const entropy: Record<Language, LocalizedContent> = {
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
    tagline: "由实验概念打磨为具有扎实技术基础的、面向生产的稳定体验。",
    description:
      "Entropy 通过自定义规则、强度评分与密码学级随机性，帮助你生成、评估并优化安全密码，从容地创建更安全的凭据。",
    overview:
      "Entropy 起源于一次创意探索，最终演化为结构化的产品实现。我专注于可维护性、交互质量与稳健行为，使其在真实使用中依然可靠。",
    roleSummary: "注重安全的前端工程师，交付提供清晰用户指引的可靠凭据工具。",
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
        challenge: "在不让非技术用户感到压力的情况下传达安全的复杂性。",
        solution: "将技术化的评分输出转化为通俗的建议与可执行的改进。",
      },
      {
        challenge: "在引入高级自定义控件时维持用户信任。",
        solution: "添加清晰的默认值、约束与即时反馈，防止配置出错。",
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
};
