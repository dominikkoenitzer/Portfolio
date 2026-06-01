import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const entropy: Record<Language, LocalizedContent> = {
  en: {
    tagline:
      "Generate, score, and refine strong passwords — built on cryptographically secure randomness, not Math.random().",
    description:
      "Entropy helps you generate, evaluate, and refine secure passwords with custom rules, transparent strength scoring, and cryptography-backed randomness.",
    overview:
      "Entropy is a solo project built in Next.js and TypeScript. It generates passwords from the browser's cryptographic randomness (Web Crypto), scores their strength transparently, and lets you shape them with custom rules — turning 'is this password actually good?' into a clear, actionable answer.",
    roleSummary:
      "Sole designer and developer: security-minded UX plus the full Next.js/TypeScript build.",
    problemStatement:
      "Most password tools are either too basic to trust or too technical to use. Entropy makes secure generation understandable — strong randomness under the hood, plain-language strength feedback on top.",
    objectives: [
      "Generate passwords from cryptographically secure randomness, not predictable PRNGs.",
      "Score strength transparently so users understand why a password is weak or strong.",
      "Combine generation, scoring, and custom rules in one repeatable flow.",
    ],
    architectureDecisions: [
      "Next.js + TypeScript with generation, scoring, and rule config as separate, testable modules.",
      "Browser-native Web Crypto for randomness rather than Math.random().",
      "Logic separated from presentation for easier testing and iteration.",
    ],
    implementationHighlights: [
      "Cryptographically secure password generation, entirely client-side.",
      "Transparent strength scoring with plain-language feedback.",
      "Custom-rule controls (length, character sets, constraints) that stay usable.",
    ],
    qualityAndSecurity: [
      "Security-first: randomness from Web Crypto, and generation runs client-side — no secrets leave the browser.",
      "Validation that guards against impossible or contradictory rule combinations.",
      "Accessibility-aware UX so the security workflow stays broadly usable.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Explaining password strength without overwhelming non-technical users.",
        solution:
          "Translated scoring into plain-language recommendations and concrete fixes.",
      },
      {
        challenge:
          "Offering advanced customization without letting users build weak configs.",
        solution:
          "Sensible defaults, constraints, and immediate feedback to prevent misconfiguration.",
      },
    ],
    hiringSignals: [
      "Applied security thinking — CSPRNG randomness, client-side generation — in a real product.",
      "Makes a technical domain understandable through UX.",
      "Full Next.js/TypeScript ownership, end to end.",
    ],
    nextIterations: [
      "Passphrase mode and entropy-comparison tools.",
      "Optional downloadable credential-audit reports.",
      "Automated tests around edge-case rule combinations.",
    ],
    tags: ["Next.js", "TypeScript", "Web Crypto", "Security"],
    impactHeading: "How This Project Creates Impact",
    impactPoints: [
      "Helps people create genuinely strong passwords with confidence.",
      "Makes security understandable instead of intimidating.",
      "Keeps secrets safe by generating entirely client-side.",
    ],
  },
  de: {
    tagline:
      "Starke Passwörter generieren, bewerten und verfeinern — basierend auf kryptografisch sicherer Zufälligkeit, nicht auf Math.random().",
    description:
      "Entropy hilft dir, sichere Passwörter zu generieren, zu bewerten und zu verfeinern — mit eigenen Regeln, transparentem Strength-Scoring und kryptografisch gestützter Zufälligkeit.",
    overview:
      "Entropy ist ein Solo-Projekt, gebaut mit Next.js und TypeScript. Es generiert Passwörter aus der kryptografischen Zufälligkeit des Browsers (Web Crypto), bewertet ihre Stärke transparent und lässt dich sie über eigene Regeln formen — und macht aus der Frage, ob ein Passwort wirklich gut ist, eine klare, umsetzbare Antwort.",
    roleSummary:
      "Alleiniger Designer und Entwickler: sicherheitsbewusste UX plus der vollständige Next.js/TypeScript-Build.",
    problemStatement:
      "Die meisten Passwort-Tools sind entweder zu simpel, um ihnen zu vertrauen, oder zu technisch, um sie zu nutzen. Entropy macht sichere Generierung verständlich — starke Zufälligkeit im Hintergrund, klares Stärke-Feedback in einfacher Sprache obendrauf.",
    objectives: [
      "Passwörter aus kryptografisch sicherer Zufälligkeit generieren, nicht aus vorhersehbaren PRNGs.",
      "Stärke transparent bewerten, damit Nutzer verstehen, warum ein Passwort schwach oder stark ist.",
      "Generierung, Scoring und eigene Regeln in einem wiederholbaren Flow vereinen.",
    ],
    architectureDecisions: [
      "Next.js + TypeScript mit Generierung, Scoring und Regel-Konfiguration als getrennte, testbare Module.",
      "Browser-natives Web Crypto für Zufälligkeit statt Math.random().",
      "Logik von der Präsentation getrennt für einfacheres Testen und Iterieren.",
    ],
    implementationHighlights: [
      "Kryptografisch sichere Passwort-Generierung, vollständig client-seitig.",
      "Transparentes Strength-Scoring mit Feedback in einfacher Sprache.",
      "Eigene Regel-Controls (Länge, Zeichensätze, Einschränkungen), die nutzbar bleiben.",
    ],
    qualityAndSecurity: [
      "Security-first: Zufälligkeit aus Web Crypto, und die Generierung läuft client-seitig — keine Geheimnisse verlassen den Browser.",
      "Validierung, die gegen unmögliche oder widersprüchliche Regel-Kombinationen absichert.",
      "Barrierefreiheits-bewusste UX, damit der Security-Workflow breit nutzbar bleibt.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Passwort-Stärke erklären, ohne nicht-technische Nutzer zu überfordern.",
        solution:
          "Scoring in Empfehlungen in einfacher Sprache und konkrete Korrekturen übersetzt.",
      },
      {
        challenge:
          "Fortgeschrittene Anpassung bieten, ohne dass Nutzer schwache Konfigurationen bauen.",
        solution:
          "Sinnvolle Defaults, Einschränkungen und sofortiges Feedback, um Fehlkonfigurationen zu verhindern.",
      },
    ],
    hiringSignals: [
      "Angewandtes Security-Denken — CSPRNG-Zufälligkeit, client-seitige Generierung — in einem echten Produkt.",
      "Macht eine technische Domäne über UX verständlich.",
      "Vollständige Next.js/TypeScript-Ownership, Ende zu Ende.",
    ],
    nextIterations: [
      "Passphrasen-Modus und Entropie-Vergleichs-Tools.",
      "Optionale herunterladbare Credential-Audit-Berichte.",
      "Automatisierte Tests rund um Edge-Case-Regel-Kombinationen.",
    ],
    tags: ["Next.js", "TypeScript", "Web Crypto", "Sicherheit"],
    impactHeading: "Wie dieses Projekt Wirkung erzeugt",
    impactPoints: [
      "Hilft Menschen, mit Zuversicht wirklich starke Passwörter zu erstellen.",
      "Macht Sicherheit verständlich statt einschüchternd.",
      "Hält Geheimnisse sicher, indem alles client-seitig generiert wird.",
    ],
  },
  fr: {
    tagline:
      "Générer, évaluer et affiner des mots de passe forts — bâti sur un aléa cryptographiquement sûr, pas sur Math.random().",
    description:
      "Entropy vous aide à générer, évaluer et affiner des mots de passe sécurisés, avec des règles personnalisées, un scoring de robustesse transparent et un aléa adossé à la cryptographie.",
    overview:
      "Entropy est un projet solo bâti en Next.js et TypeScript. Il génère des mots de passe à partir de l'aléa cryptographique du navigateur (Web Crypto), évalue leur robustesse de façon transparente et permet de les façonner avec des règles personnalisées — transformant la question « ce mot de passe est-il vraiment bon ? » en une réponse claire et actionnable.",
    roleSummary:
      "Seul concepteur et développeur : UX soucieuse de sécurité et le build Next.js/TypeScript complet.",
    problemStatement:
      "La plupart des outils de mots de passe sont soit trop basiques pour être fiables, soit trop techniques pour être utilisés. Entropy rend la génération sécurisée compréhensible — un aléa fort sous le capot, un retour de robustesse en langage clair par-dessus.",
    objectives: [
      "Générer des mots de passe à partir d'un aléa cryptographiquement sûr, pas de PRNG prévisibles.",
      "Évaluer la robustesse de façon transparente pour que les utilisateurs comprennent pourquoi un mot de passe est faible ou fort.",
      "Combiner génération, scoring et règles personnalisées dans un flux reproductible.",
    ],
    architectureDecisions: [
      "Next.js + TypeScript avec génération, scoring et configuration des règles en modules séparés et testables.",
      "Web Crypto natif au navigateur pour l'aléa plutôt que Math.random().",
      "Logique séparée de la présentation pour faciliter les tests et l'itération.",
    ],
    implementationHighlights: [
      "Génération de mots de passe cryptographiquement sûre, entièrement côté client.",
      "Scoring de robustesse transparent avec un retour en langage clair.",
      "Des contrôles de règles personnalisées (longueur, jeux de caractères, contraintes) qui restent utilisables.",
    ],
    qualityAndSecurity: [
      "Sécurité d'abord : aléa issu de Web Crypto, et génération côté client — aucun secret ne quitte le navigateur.",
      "Une validation qui protège contre les combinaisons de règles impossibles ou contradictoires.",
      "Une UX soucieuse de l'accessibilité pour que le workflow de sécurité reste largement utilisable.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Expliquer la robustesse des mots de passe sans submerger les utilisateurs non techniques.",
        solution:
          "Traduction du scoring en recommandations en langage clair et corrections concrètes.",
      },
      {
        challenge:
          "Offrir une personnalisation avancée sans laisser les utilisateurs créer des configs faibles.",
        solution:
          "Des défauts sensés, des contraintes et un retour immédiat pour éviter les mauvaises configurations.",
      },
    ],
    hiringSignals: [
      "Une pensée sécurité appliquée — aléa CSPRNG, génération côté client — dans un vrai produit.",
      "Rend un domaine technique compréhensible grâce à l'UX.",
      "Ownership Next.js/TypeScript complète, de bout en bout.",
    ],
    nextIterations: [
      "Mode phrase de passe et outils de comparaison d'entropie.",
      "Rapports d'audit d'identifiants téléchargeables en option.",
      "Tests automatisés autour des combinaisons de règles aux cas limites.",
    ],
    tags: ["Next.js", "TypeScript", "Web Crypto", "Sécurité"],
    impactHeading: "Comment ce projet crée de l'impact",
    impactPoints: [
      "Aide les gens à créer des mots de passe réellement forts en toute confiance.",
      "Rend la sécurité compréhensible plutôt qu'intimidante.",
      "Garde les secrets en sécurité en générant entièrement côté client.",
    ],
  },
  zh: {
    tagline:
      "生成、评分并优化强密码——基于密码学安全的随机性，而非 Math.random()。",
    description:
      "Entropy 帮助你生成、评估并优化安全密码，支持自定义规则、透明的强度评分以及由密码学支撑的随机性。",
    overview:
      "Entropy 是一个使用 Next.js 与 TypeScript 构建的独立项目。它利用浏览器的密码学随机性（Web Crypto）生成密码，透明地评估其强度，并允许你通过自定义规则进行调整——把“这个密码到底好不好？”变成清晰、可执行的答案。",
    roleSummary:
      "唯一的设计者与开发者：以安全为导向的 UX，以及完整的 Next.js/TypeScript 构建。",
    problemStatement:
      "大多数密码工具要么过于简单而不可信，要么过于技术化而难以使用。Entropy 让安全的密码生成变得易懂——底层是强随机性，上层是通俗易懂的强度反馈。",
    objectives: [
      "使用密码学安全的随机性生成密码，而非可预测的 PRNG。",
      "透明地评估强度，让用户理解密码为何强或弱。",
      "将生成、评分与自定义规则整合到一个可重复的流程中。",
    ],
    architectureDecisions: [
      "Next.js + TypeScript，将生成、评分与规则配置拆分为独立、可测试的模块。",
      "使用浏览器原生的 Web Crypto 而非 Math.random() 来获取随机性。",
      "将逻辑与展示分离，便于测试与迭代。",
    ],
    implementationHighlights: [
      "完全在客户端进行的、密码学安全的密码生成。",
      "透明的强度评分，配以通俗易懂的反馈。",
      "自定义规则控件（长度、字符集、约束）依然保持易用。",
    ],
    qualityAndSecurity: [
      "安全优先：随机性来自 Web Crypto，且生成在客户端进行——没有任何机密离开浏览器。",
      "校验机制可防止不可能或相互矛盾的规则组合。",
      "关注无障碍的 UX，让安全流程对广泛用户都保持可用。",
    ],
    challengesAndSolutions: [
      {
        challenge: "在不让非技术用户感到不知所措的前提下，解释密码强度。",
        solution: "将评分转化为通俗易懂的建议与具体的改进措施。",
      },
      {
        challenge: "在提供高级自定义的同时，不让用户构建出脆弱的配置。",
        solution: "合理的默认值、约束与即时反馈，避免错误配置。",
      },
    ],
    hiringSignals: [
      "在真实产品中应用安全思维——CSPRNG 随机性、客户端生成。",
      "通过 UX 让一个技术领域变得易懂。",
      "端到端、完整的 Next.js/TypeScript 主导能力。",
    ],
    nextIterations: [
      "口令短语（passphrase）模式与熵值对比工具。",
      "可选的、可下载的凭据审计报告。",
      "围绕边界情况规则组合的自动化测试。",
    ],
    tags: ["Next.js", "TypeScript", "Web Crypto", "安全"],
    impactHeading: "本项目如何创造价值",
    impactPoints: [
      "帮助人们自信地创建真正强健的密码。",
      "让安全变得易懂，而非令人生畏。",
      "通过完全在客户端生成，确保机密的安全。",
    ],
  },
};
