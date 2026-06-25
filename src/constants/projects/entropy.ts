import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const entropy: Record<Language, LocalizedContent> = {
  en: {
    tagline: "Real randomness, an honest strength score, and nothing leaves your browser.",
    description:
      "A password generator and strength analyzer that runs entirely in the browser — CSPRNG randomness, zxcvbn scoring, and zero round-trips to a server.",
    overview:
      "I built Entropy because most password tools fall into two camps: too dumb to trust, or happy to ship your secrets to someone's backend. So I wrote my own in Next.js and TypeScript. It pulls randomness from Web Crypto — never Math.random() — runs the password through zxcvbn for an honest strength read, and does all of it client-side. Nothing leaves the tab.",
    roleSummary: "Designed it, built it, shipped it. Just me.",
    problemStatement:
      "A password is only as strong as the randomness behind it, yet half the generators online reach for Math.random() and the other half want you to type your secrets into a server. I wanted one tool that was actually secure and would tell you the truth about your password.",
    objectives: [
      "Use cryptographically secure randomness (Web Crypto), not a predictable PRNG.",
      "Score strength with zxcvbn so the verdict is real, not a colored bar that lies.",
      "Generate, score, and tune in one flow — no copy-pasting between tools.",
    ],
    architectureDecisions: [
      "Next.js + TypeScript, with generation, scoring, and rule config as separate, testable modules.",
      "Web Crypto for randomness — the only acceptable source for something you'll guard an account with.",
      "Logic kept apart from the UI so each half can change without breaking the other.",
    ],
    implementationHighlights: [
      "Cryptographically secure generation that runs entirely in the browser.",
      "zxcvbn strength scoring with plain-language feedback, not a mystery meter.",
      "Custom rules — length, character sets, constraints — that stay usable instead of becoming a maze.",
    ],
    qualityAndSecurity: [
      "Everything is client-side. No secrets touch a network, because there is no network call.",
      "Validation that refuses impossible rule combinations before they become a broken password.",
      "Accessible UX, so the secure path is the easy path for everyone.",
    ],
    challengesAndSolutions: [
      {
        challenge: "Telling people their password is weak without burying them in cryptography.",
        solution: "Let zxcvbn do the math, then translate its verdict into plain advice and a concrete fix.",
      },
      {
        challenge: "Offering real customization without letting anyone build a deliberately weak config.",
        solution: "Sensible defaults, hard constraints, and instant feedback that catches a bad setup as you make it.",
      },
    ],
    hiringSignals: [
      "I reach for the right primitive — CSPRNG over Math.random() — and ship it in a real product.",
      "I can take a technical domain and make it legible through UX.",
      "Full Next.js/TypeScript ownership, design through deploy.",
    ],
    nextIterations: [
      "A passphrase mode and a side-by-side entropy comparison.",
      "Optional downloadable credential-audit reports.",
      "Automated tests around the gnarlier rule combinations.",
    ],
    tags: ["Next.js", "TypeScript", "Web Crypto", "Security"],
    impactHeading: "How This Project Creates Impact",
    impactPoints: [
      "Helps people create passwords that are genuinely hard to guess.",
      "Makes security legible instead of intimidating.",
      "Keeps secrets safe by never sending them anywhere.",
    ],
    stats: [
      { value: "100%", label: "client-side" },
      { value: "0", label: "secrets sent" },
      { value: "0", label: "Math.random()" },
    ],
  },
  de: {
    tagline: "Echte Zufälligkeit, eine ehrliche Stärke-Bewertung — und nichts verlässt deinen Browser.",
    description:
      "Ein Passwort-Generator und Stärke-Analyzer, der vollständig im Browser läuft — CSPRNG-Zufälligkeit, zxcvbn-Scoring und keine einzige Anfrage an einen Server.",
    overview:
      "Ich habe Entropy gebaut, weil die meisten Passwort-Tools in zwei Lager fallen: zu dumm, um ihnen zu vertrauen, oder gerne bereit, deine Geheimnisse an irgendein Backend zu schicken. Also habe ich mein eigenes in Next.js und TypeScript geschrieben. Es zieht Zufälligkeit aus Web Crypto — nie aus Math.random() — schickt das Passwort durch zxcvbn für eine ehrliche Stärke-Einschätzung und macht das alles client-seitig. Nichts verlässt den Tab.",
    roleSummary: "Entworfen, gebaut, veröffentlicht. Nur ich.",
    problemStatement:
      "Ein Passwort ist nur so stark wie die Zufälligkeit dahinter, und doch greift die Hälfte der Generatoren im Netz zu Math.random() und die andere Hälfte will, dass du deine Geheimnisse in einen Server tippst. Ich wollte ein Tool, das wirklich sicher ist und dir die Wahrheit über dein Passwort sagt.",
    objectives: [
      "Kryptografisch sichere Zufälligkeit (Web Crypto) nutzen, kein vorhersehbares PRNG.",
      "Stärke mit zxcvbn bewerten, damit das Urteil echt ist und nicht ein farbiger Balken, der lügt.",
      "Generieren, bewerten und feinjustieren in einem Flow — kein Kopieren zwischen Tools.",
    ],
    architectureDecisions: [
      "Next.js + TypeScript, mit Generierung, Scoring und Regel-Konfiguration als getrennte, testbare Module.",
      "Web Crypto für Zufälligkeit — die einzige akzeptable Quelle für etwas, das einen Account schützen soll.",
      "Logik von der UI getrennt, damit jede Hälfte sich ändern kann, ohne die andere zu brechen.",
    ],
    implementationHighlights: [
      "Kryptografisch sichere Generierung, die vollständig im Browser läuft.",
      "zxcvbn-Stärke-Scoring mit Feedback in einfacher Sprache, kein rätselhaftes Messgerät.",
      "Eigene Regeln — Länge, Zeichensätze, Einschränkungen — die nutzbar bleiben statt zum Labyrinth zu werden.",
    ],
    qualityAndSecurity: [
      "Alles läuft client-seitig. Kein Geheimnis berührt ein Netzwerk, weil es keinen Netzwerk-Aufruf gibt.",
      "Validierung, die unmögliche Regel-Kombinationen ablehnt, bevor sie zu einem kaputten Passwort werden.",
      "Barrierefreie UX, damit der sichere Weg für alle der einfache Weg ist.",
    ],
    challengesAndSolutions: [
      {
        challenge: "Menschen sagen, dass ihr Passwort schwach ist, ohne sie in Kryptografie zu begraben.",
        solution: "zxcvbn die Mathematik überlassen und sein Urteil in klare Ratschläge und eine konkrete Korrektur übersetzen.",
      },
      {
        challenge: "Echte Anpassung bieten, ohne dass jemand bewusst eine schwache Konfiguration bauen kann.",
        solution: "Sinnvolle Defaults, harte Einschränkungen und sofortiges Feedback, das eine schlechte Einstellung schon beim Erstellen abfängt.",
      },
    ],
    hiringSignals: [
      "Ich greife zur richtigen Primitive — CSPRNG statt Math.random() — und bringe sie in ein echtes Produkt.",
      "Ich kann eine technische Domäne nehmen und sie über UX lesbar machen.",
      "Vollständige Next.js/TypeScript-Ownership, vom Design bis zum Deploy.",
    ],
    nextIterations: [
      "Ein Passphrasen-Modus und ein direkter Entropie-Vergleich.",
      "Optionale herunterladbare Credential-Audit-Berichte.",
      "Automatisierte Tests rund um die kniffligeren Regel-Kombinationen.",
    ],
    tags: ["Next.js", "TypeScript", "Web Crypto", "Sicherheit"],
    impactHeading: "Wie dieses Projekt Wirkung erzeugt",
    impactPoints: [
      "Hilft Menschen, Passwörter zu erstellen, die wirklich schwer zu erraten sind.",
      "Macht Sicherheit lesbar statt einschüchternd.",
      "Hält Geheimnisse sicher, indem es sie nirgendwohin sendet.",
    ],
    stats: [
      { value: "100%", label: "client-seitig" },
      { value: "0", label: "Geheimnisse gesendet" },
      { value: "0", label: "Math.random()" },
    ],
  },
  fr: {
    tagline: "Du vrai aléa, un score de robustesse honnête, et rien qui ne quitte votre navigateur.",
    description:
      "Un générateur de mots de passe et analyseur de robustesse qui tourne entièrement dans le navigateur — aléa CSPRNG, scoring zxcvbn et aucun aller-retour vers un serveur.",
    overview:
      "J'ai construit Entropy parce que la plupart des outils de mots de passe tombent dans deux camps : trop bêtes pour qu'on leur fasse confiance, ou ravis d'envoyer vos secrets vers un backend. J'ai donc écrit le mien en Next.js et TypeScript. Il tire son aléa de Web Crypto — jamais de Math.random() — fait passer le mot de passe par zxcvbn pour une lecture honnête de sa robustesse, et fait tout cela côté client. Rien ne quitte l'onglet.",
    roleSummary: "Conçu, construit, déployé. Juste moi.",
    problemStatement:
      "Un mot de passe ne vaut que l'aléa qui le génère, et pourtant la moitié des générateurs en ligne se rabattent sur Math.random() tandis que l'autre moitié veut que vous tapiez vos secrets dans un serveur. Je voulais un outil réellement sûr, qui vous dise la vérité sur votre mot de passe.",
    objectives: [
      "Utiliser un aléa cryptographiquement sûr (Web Crypto), pas un PRNG prévisible.",
      "Évaluer la robustesse avec zxcvbn pour que le verdict soit réel, pas une barre colorée qui ment.",
      "Générer, évaluer et ajuster dans un seul flux — pas de copier-coller entre outils.",
    ],
    architectureDecisions: [
      "Next.js + TypeScript, avec génération, scoring et configuration des règles en modules séparés et testables.",
      "Web Crypto pour l'aléa — la seule source acceptable pour quelque chose qui protégera un compte.",
      "Logique tenue à l'écart de l'UI, pour que chaque moitié évolue sans casser l'autre.",
    ],
    implementationHighlights: [
      "Génération cryptographiquement sûre, entièrement dans le navigateur.",
      "Scoring de robustesse zxcvbn avec un retour en langage clair, pas un cadran mystérieux.",
      "Des règles personnalisées — longueur, jeux de caractères, contraintes — qui restent utilisables au lieu de devenir un labyrinthe.",
    ],
    qualityAndSecurity: [
      "Tout est côté client. Aucun secret ne touche un réseau, parce qu'il n'y a aucun appel réseau.",
      "Une validation qui refuse les combinaisons de règles impossibles avant qu'elles ne donnent un mot de passe cassé.",
      "Une UX accessible, pour que le chemin sûr soit le chemin facile pour tout le monde.",
    ],
    challengesAndSolutions: [
      {
        challenge: "Dire aux gens que leur mot de passe est faible sans les enterrer sous la cryptographie.",
        solution: "Laisser zxcvbn faire les calculs, puis traduire son verdict en conseils clairs et une correction concrète.",
      },
      {
        challenge: "Offrir une vraie personnalisation sans laisser quiconque bâtir une config délibérément faible.",
        solution: "Des défauts sensés, des contraintes fermes et un retour immédiat qui attrape une mauvaise config au moment où on la crée.",
      },
    ],
    hiringSignals: [
      "Je choisis la bonne primitive — CSPRNG plutôt que Math.random() — et je la livre dans un vrai produit.",
      "Je sais prendre un domaine technique et le rendre lisible grâce à l'UX.",
      "Ownership Next.js/TypeScript complète, du design au déploiement.",
    ],
    nextIterations: [
      "Un mode phrase de passe et une comparaison d'entropie côte à côte.",
      "Des rapports d'audit d'identifiants téléchargeables en option.",
      "Des tests automatisés autour des combinaisons de règles les plus retorses.",
    ],
    tags: ["Next.js", "TypeScript", "Web Crypto", "Sécurité"],
    impactHeading: "Comment ce projet crée de l'impact",
    impactPoints: [
      "Aide les gens à créer des mots de passe réellement difficiles à deviner.",
      "Rend la sécurité lisible plutôt qu'intimidante.",
      "Garde les secrets en sécurité en ne les envoyant nulle part.",
    ],
    stats: [
      { value: "100%", label: "côté client" },
      { value: "0", label: "secret envoyé" },
      { value: "0", label: "Math.random()" },
    ],
  },
  zh: {
    tagline: "真正的随机性、诚实的强度评分，且没有任何东西离开你的浏览器。",
    description:
      "一个完全在浏览器中运行的密码生成器与强度分析器——CSPRNG 随机性、zxcvbn 评分，且不向服务器发出任何请求。",
    overview:
      "我做 Entropy，是因为大多数密码工具都落入两个阵营：要么蠢到不值得信任，要么乐于把你的机密发往某个后端。于是我用 Next.js 和 TypeScript 写了自己的版本。它的随机性来自 Web Crypto——绝不用 Math.random()——再用 zxcvbn 给出诚实的强度判断，而且这一切都在客户端完成。没有任何东西离开这个标签页。",
    roleSummary: "设计、构建、上线，全是我一个人。",
    problemStatement:
      "一个密码的强度，取决于它背后的随机性；然而网上一半的生成器用的是 Math.random()，另一半则要你把机密敲进服务器。我想要一个真正安全、并且会对你的密码说实话的工具。",
    objectives: [
      "使用密码学安全的随机性（Web Crypto），而非可预测的 PRNG。",
      "用 zxcvbn 评估强度，让结论是真实的，而不是一条会撒谎的彩色进度条。",
      "在一个流程里完成生成、评分与微调——不必在工具之间复制粘贴。",
    ],
    architectureDecisions: [
      "Next.js + TypeScript，将生成、评分与规则配置拆分为独立、可测试的模块。",
      "用 Web Crypto 获取随机性——对于要用来守护账户的东西，这是唯一可接受的来源。",
      "把逻辑与 UI 分开，让任一侧都能改动而不破坏另一侧。",
    ],
    implementationHighlights: [
      "完全在浏览器中运行的、密码学安全的生成。",
      "zxcvbn 强度评分，配以通俗易懂的反馈，而非一块看不懂的仪表。",
      "自定义规则——长度、字符集、约束——保持易用，而不会变成迷宫。",
    ],
    qualityAndSecurity: [
      "一切都在客户端运行。没有任何机密接触网络，因为根本没有网络调用。",
      "校验机制会在不可能的规则组合变成一个坏密码之前就拒绝它们。",
      "无障碍的 UX，让安全的路径对每个人来说都是最简单的路径。",
    ],
    challengesAndSolutions: [
      {
        challenge: "在不把人埋进密码学的前提下，告诉他们密码很弱。",
        solution: "把数学交给 zxcvbn，再把它的判断翻译成清晰的建议和具体的修正办法。",
      },
      {
        challenge: "提供真正的自定义，又不让任何人刻意搭出脆弱的配置。",
        solution: "合理的默认值、硬性约束，以及在你设置时就能拦住坏配置的即时反馈。",
      },
    ],
    hiringSignals: [
      "我会选对原语——用 CSPRNG 而非 Math.random()——并把它落地到真实产品中。",
      "我能把一个技术领域，通过 UX 变得清晰易读。",
      "端到端、完整的 Next.js/TypeScript 主导能力，从设计到部署。",
    ],
    nextIterations: [
      "口令短语（passphrase）模式，以及并排的熵值对比。",
      "可选的、可下载的凭据审计报告。",
      "围绕更棘手的规则组合的自动化测试。",
    ],
    tags: ["Next.js", "TypeScript", "Web Crypto", "安全"],
    impactHeading: "本项目如何创造价值",
    impactPoints: [
      "帮助人们创建真正难以被猜到的密码。",
      "让安全变得清晰易读，而非令人生畏。",
      "通过从不把机密发往任何地方，确保它们的安全。",
    ],
    stats: [
      { value: "100%", label: "客户端运行" },
      { value: "0", label: "机密外发" },
      { value: "0", label: "Math.random()" },
    ],
  },
};
