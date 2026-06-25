import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const remnants: Record<Language, LocalizedContent> = {
  en: {
    tagline: "VS Code, minus the parts that talk back.",
    description:
      "Remnants is a native Windows editor: my personal fork of Code - OSS with Copilot, chat, agents, telemetry, and sign-in cut out, and the editor, terminal, Git, and debugger left fully intact.",
    overview:
      "I love VS Code. I do not love the chat panel, the agent window, the account prompt, or anything quietly reporting my keystrokes upstream. So I forked Code - OSS, the open-source core, and surgically removed every AI surface, telemetry hook, and sign-in nag — without touching what actually matters: fast editing, IntelliSense, the integrated terminal, source control, and the JavaScript/Node debugger. Extensions resolve through Open VSX instead of Microsoft's Marketplace. It ships as a per-user Windows installer, RemnantsUserSetup.exe. Same editor, none of the noise.",
    roleSummary: "Forked it, gutted the AI, built the installer. Just me.",
    problemStatement:
      "VS Code is a great editor wrapped in a growing layer of cloud services, chat panels, agent windows, and account prompts you never asked for. Remnants removes that layer entirely. What's left is the editor — fast, private, quiet.",
    objectives: [
      "Remove every built-in AI surface — Copilot, chat, agents, voice — without breaking the editor underneath.",
      "Kill telemetry and crash reporting at the product level. No sign-in, no account prompts, nothing optional about it.",
      "Route extensions through Open VSX so the editor still works without Microsoft's Marketplace.",
    ],
    architectureDecisions: [
      "Fork Code - OSS and work inside its layered architecture (base, platform, editor, workbench, Electron main) — reimplementing an editor from scratch was never the point.",
      "Strip AI and telemetry at the product and contribution level so the surfaces never register at all, instead of hiding them behind a setting.",
      "Repoint the extension gallery at Open VSX — replacing the Marketplace dependency cleanly, not just switching it off.",
    ],
    implementationHighlights: [
      "AI-free build: Copilot, the chat panel, agent sessions, voice, and the bundled AI extension are all gone.",
      "Telemetry disabled at the product level, with no account prompt anywhere in the title bar or status bar.",
      "Reproducible Windows packaging through the Code - OSS gulp toolchain, emitting a per-user RemnantsUserSetup.exe.",
    ],
    qualityAndSecurity: [
      "Private by default: no telemetry, no crash reporting, no sign-in. Nothing phones home, because there's no phone.",
      "Full TypeScript type-checking across the source as part of the build, matching the upstream toolchain.",
      "Honest distribution: the installer is unsigned and per-user (no admin rights), and the docs say so plainly, SmartScreen guidance included.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "AI and telemetry are woven deep into the editor — pulling them out without destabilizing everything else.",
        solution:
          "I cut the surfaces at the product and contribution layer so they never register, and left the editor, terminal, Git, and debugger paths untouched. Remove, don't refactor.",
      },
      {
        challenge:
          "Code - OSS is enormous and moves fast. A personal fork drifts out of date the moment you blink.",
        solution:
          "I stay disciplined about the layered architecture and the upstream build toolchain, so my changes stay isolated and the fork stays mergeable.",
      },
    ],
    hiringSignals: [
      "I can work inside a massive real-world codebase (VS Code) and shape it on purpose, not by accident.",
      "Privacy and de-bloating judgement — I'm as comfortable removing complexity as adding it, which is the harder skill.",
      "I own the full native pipeline, from source changes all the way to a finished Windows installer.",
    ],
    nextIterations: [
      "Verified macOS and Linux builds with prebuilt downloads.",
      "Code-signing the Windows installer so SmartScreen stops glaring at it.",
      "Automated upstream-rebase tooling, so keeping the fork current is less of a manual grind.",
    ],
    tags: ["TypeScript", "Electron", "VS Code", "Privacy"],
    impactHeading: "How This Project Creates Impact",
    impactPoints: [
      "Gives developers the editor they already know, without the AI clutter, telemetry, or sign-in prompts.",
      "Proves real privacy means removing surfaces at the source, not hiding them behind a toggle.",
      "Shows the discipline it takes to maintain a serious fork of a large open-source project.",
    ],
    stats: [
      { value: "0", label: "telemetry" },
      { value: "0", label: "sign-in" },
      { value: "100%", label: "open source core" },
      { value: "1", label: "maintainer" },
    ],
  },
  de: {
    tagline: "VS Code, ohne die Teile, die zurückreden.",
    description:
      "Remnants ist ein nativer Windows-Editor: mein persönlicher Fork von Code - OSS, bei dem Copilot, Chat, Agents, Telemetrie und Anmeldung herausgeschnitten sind und Editor, Terminal, Git und Debugger vollständig erhalten bleiben.",
    overview:
      "Ich liebe VS Code. Das Chat-Panel, das Agent-Fenster, die Konto-Aufforderung und alles, was still meine Tastenanschläge nach oben meldet, liebe ich nicht. Also habe ich Code - OSS — den quelloffenen Kern — geforkt und jede KI-Oberfläche, jeden Telemetrie-Hook und jede Anmelde-Nerverei chirurgisch entfernt — ohne anzurühren, was wirklich zählt: schnelles Editieren, IntelliSense, das integrierte Terminal, Versionskontrolle und den JavaScript/Node-Debugger. Erweiterungen kommen über Open VSX statt über Microsofts Marketplace. Ausgeliefert wird es als Windows-Installer pro Benutzer, RemnantsUserSetup.exe. Derselbe Editor, ohne den Lärm.",
    roleSummary: "Geforkt, die KI entkernt, den Installer gebaut. Nur ich.",
    problemStatement:
      "VS Code ist ein großartiger Editor, umhüllt von einer wachsenden Schicht aus Cloud-Diensten, Chat-Panels, Agent-Fenstern und Konto-Aufforderungen, um die niemand gebeten hat. Remnants entfernt diese Schicht vollständig. Übrig bleibt der Editor — schnell, privat, ruhig.",
    objectives: [
      "Jede eingebaute KI-Oberfläche entfernen — Copilot, Chat, Agents, Voice — ohne den Editor darunter zu beschädigen.",
      "Telemetrie und Absturzberichte auf Produktebene abschalten. Keine Anmeldung, keine Konto-Aufforderungen, nichts davon optional.",
      "Erweiterungen über Open VSX beziehen, damit der Editor auch ohne Microsofts Marketplace funktioniert.",
    ],
    architectureDecisions: [
      "Code - OSS forken und innerhalb seiner geschichteten Architektur arbeiten (base, platform, editor, workbench, Electron-Main) — einen Editor von Grund auf neu zu bauen war nie das Ziel.",
      "KI und Telemetrie auf Produkt- und Contribution-Ebene entfernen, sodass die Oberflächen sich gar nicht erst registrieren, statt sie hinter einer Einstellung zu verstecken.",
      "Die Erweiterungs-Galerie auf Open VSX umlenken — die Marketplace-Abhängigkeit sauber ersetzen, nicht nur abschalten.",
    ],
    implementationHighlights: [
      "KI-freier Build: Copilot, das Chat-Panel, Agent-Sitzungen, Voice und die mitgelieferte KI-Erweiterung sind allesamt weg.",
      "Telemetrie auf Produktebene deaktiviert, ohne Konto-Aufforderung in Titel- oder Statusleiste.",
      "Reproduzierbares Windows-Packaging über die Gulp-Toolchain von Code - OSS, das einen RemnantsUserSetup.exe pro Benutzer erzeugt.",
    ],
    qualityAndSecurity: [
      "Privat als Standard: keine Telemetrie, keine Absturzberichte, keine Anmeldung. Nichts funkt nach Hause, weil es kein Funkgerät gibt.",
      "Volle TypeScript-Typprüfung über den Quellcode als Teil des Builds, passend zur Upstream-Toolchain.",
      "Ehrliche Distribution: der Installer ist unsigniert und läuft pro Benutzer (ohne Admin-Rechte), und die Doku sagt das klar — inklusive SmartScreen-Hinweisen.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "KI und Telemetrie sind tief in den Editor eingewoben — sie herauszulösen, ohne alles andere zu destabilisieren.",
        solution:
          "Ich schneide die Oberflächen auf Produkt- und Contribution-Ebene, sodass sie sich nie registrieren, und lasse die Pfade von Editor, Terminal, Git und Debugger unberührt. Entfernen, nicht umbauen.",
      },
      {
        challenge:
          "Code - OSS ist riesig und bewegt sich schnell. Ein persönlicher Fork veraltet, sobald man blinzelt.",
        solution:
          "Ich halte mich diszipliniert an die geschichtete Architektur und die Upstream-Build-Toolchain, damit meine Änderungen isoliert und der Fork mergebar bleibt.",
      },
    ],
    hiringSignals: [
      "Ich kann in einer riesigen realen Codebasis (VS Code) arbeiten und sie bewusst gestalten, nicht zufällig.",
      "Urteilsvermögen bei Datenschutz und Entschlackung — Komplexität zu entfernen fällt mir genauso leicht wie sie hinzuzufügen, und das ist das Schwierigere.",
      "Ich verantworte die komplette native Pipeline, von Quellcode-Änderungen bis zum fertigen Windows-Installer.",
    ],
    nextIterations: [
      "Verifizierte macOS- und Linux-Builds mit vorgefertigten Downloads.",
      "Code-Signierung des Windows-Installers, damit SmartScreen aufhört, ihn anzustarren.",
      "Automatisiertes Upstream-Rebase-Tooling, damit das Aktuellhalten des Forks weniger manuelle Plackerei ist.",
    ],
    tags: ["TypeScript", "Electron", "VS Code", "Datenschutz"],
    impactHeading: "Wie dieses Projekt Wirkung erzeugt",
    impactPoints: [
      "Gibt Entwicklern den Editor, den sie schon kennen, ohne KI-Ballast, Telemetrie oder Anmelde-Aufforderungen.",
      "Beweist, dass echter Datenschutz bedeutet, Oberflächen an der Quelle zu entfernen, statt sie hinter einem Schalter zu verstecken.",
      "Zeigt die Disziplin, die es braucht, einen ernsthaften Fork eines großen Open-Source-Projekts zu pflegen.",
    ],
    stats: [
      { value: "0", label: "Telemetrie" },
      { value: "0", label: "Anmeldung" },
      { value: "100%", label: "Open-Source-Kern" },
      { value: "1", label: "Maintainer" },
    ],
  },
  fr: {
    tagline: "VS Code, sans les parties qui répondent.",
    description:
      "Remnants est un éditeur Windows natif : mon fork personnel de Code - OSS dont Copilot, le chat, les agents, la télémétrie et la connexion ont été retirés, tout en conservant l'éditeur, le terminal, Git et le débogueur intacts.",
    overview:
      "J'adore VS Code. Je n'adore pas le panneau de chat, la fenêtre d'agent, l'invite de compte, ni tout ce qui rapporte discrètement mes frappes en amont. Alors j'ai forké Code - OSS — le cœur open source — et retiré chirurgicalement chaque surface d'IA, chaque hook de télémétrie et chaque relance de connexion — sans toucher à ce qui compte vraiment : édition rapide, IntelliSense, terminal intégré, contrôle de version et débogueur JavaScript/Node. Les extensions passent par Open VSX au lieu du Marketplace de Microsoft. Il est distribué sous forme d'installateur Windows par utilisateur, RemnantsUserSetup.exe. Le même éditeur, sans le bruit.",
    roleSummary: "Forké, vidé de son IA, installateur compris. Moi seul.",
    problemStatement:
      "VS Code est un excellent éditeur enveloppé d'une couche croissante de services cloud, de panneaux de chat, de fenêtres d'agents et d'invites de compte que personne n'a demandées. Remnants supprime entièrement cette couche. Ce qui reste, c'est l'éditeur — rapide, privé, silencieux.",
    objectives: [
      "Supprimer chaque surface d'IA intégrée — Copilot, chat, agents, voix — sans casser l'éditeur en dessous.",
      "Couper la télémétrie et les rapports de plantage au niveau du produit. Pas de connexion, pas d'invite de compte, rien d'optionnel là-dedans.",
      "Faire passer les extensions par Open VSX pour que l'éditeur fonctionne toujours sans le Marketplace de Microsoft.",
    ],
    architectureDecisions: [
      "Forker Code - OSS et travailler dans son architecture en couches (base, platform, editor, workbench, processus principal Electron) — réécrire un éditeur de zéro n'a jamais été le but.",
      "Retirer l'IA et la télémétrie au niveau du produit et des contributions, pour que les surfaces ne s'enregistrent jamais, plutôt que de les cacher derrière un réglage.",
      "Rediriger la galerie d'extensions vers Open VSX — remplacer proprement la dépendance au Marketplace, pas seulement la désactiver.",
    ],
    implementationHighlights: [
      "Build sans IA : Copilot, le panneau de chat, les sessions d'agents, la voix et l'extension d'IA fournie ont tous disparu.",
      "Télémétrie désactivée au niveau du produit, sans aucune invite de compte dans la barre de titre ou la barre d'état.",
      "Packaging Windows reproductible via la toolchain gulp de Code - OSS, produisant un RemnantsUserSetup.exe par utilisateur.",
    ],
    qualityAndSecurity: [
      "Privé par défaut : aucune télémétrie, aucun rapport de plantage, aucune connexion. Rien ne communique vers l'extérieur, parce qu'il n'y a pas de canal.",
      "Vérification de types TypeScript complète sur l'ensemble du code dans le cadre du build, alignée sur la toolchain amont.",
      "Distribution honnête : l'installateur est non signé et par utilisateur (sans droits administrateur), et la documentation le dit clairement, consignes SmartScreen incluses.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "L'IA et la télémétrie sont profondément tissées dans l'éditeur — les en extraire sans déstabiliser tout le reste.",
        solution:
          "Je coupe les surfaces au niveau du produit et des contributions pour qu'elles ne s'enregistrent jamais, et je laisse intacts les chemins de l'éditeur, du terminal, de Git et du débogueur. Retirer, pas refactoriser.",
      },
      {
        challenge:
          "Code - OSS est énorme et évolue vite. Un fork personnel prend du retard dès qu'on cligne des yeux.",
        solution:
          "Je reste discipliné sur l'architecture en couches et la toolchain de build amont, pour que mes changements restent isolés et le fork fusionnable.",
      },
    ],
    hiringSignals: [
      "Je sais travailler dans une base de code réelle et massive (VS Code) et la façonner exprès, pas par accident.",
      "Jugement en matière de confidentialité et d'allègement — retirer de la complexité m'est aussi naturel que d'en ajouter, et c'est le plus difficile des deux.",
      "Je maîtrise la chaîne native complète, des modifications du code jusqu'à un installateur Windows finalisé.",
    ],
    nextIterations: [
      "Builds macOS et Linux vérifiés avec des téléchargements préfabriqués.",
      "Signature de code de l'installateur Windows pour que SmartScreen arrête de le foudroyer du regard.",
      "Outillage de rebase amont automatisé, pour que maintenir le fork à jour soit moins une corvée manuelle.",
    ],
    tags: ["TypeScript", "Electron", "VS Code", "Confidentialité"],
    impactHeading: "Comment ce projet crée de l'impact",
    impactPoints: [
      "Offre aux développeurs l'éditeur qu'ils connaissent déjà, sans l'encombrement d'IA, la télémétrie ni les invites de connexion.",
      "Prouve qu'une vraie confidentialité, c'est retirer les surfaces à la source, pas les cacher derrière un interrupteur.",
      "Montre la discipline qu'il faut pour maintenir un fork sérieux d'un grand projet open source.",
    ],
    stats: [
      { value: "0", label: "télémétrie" },
      { value: "0", label: "connexion" },
      { value: "100%", label: "cœur open source" },
      { value: "1", label: "mainteneur" },
    ],
  },
  zh: {
    tagline: "VS Code，去掉了会顶嘴的那些部分。",
    description:
      "Remnants 是一款原生 Windows 编辑器：我个人的 Code - OSS 分支，移除了 Copilot、聊天、智能体、遥测与登录，同时完整保留编辑器、终端、Git 与调试器。",
    overview:
      "我喜欢 VS Code。但我不喜欢聊天面板、智能体窗口、账户提示，以及任何悄悄把我的击键上报到上游的东西。于是我分支了 Code - OSS——它的开源内核——并精准移除了每一处 AI 界面、每个遥测钩子和每一次登录催促——而对真正重要的东西毫发无损：快速编辑、IntelliSense、集成终端、版本控制以及 JavaScript/Node 调试器。扩展通过 Open VSX 解析，而非 Microsoft 的 Marketplace。它以按用户安装的 Windows 安装程序 RemnantsUserSetup.exe 形式发布。同一个编辑器，没有那些噪音。",
    roleSummary: "我分支它、掏空 AI、做好安装程序。就我一个人。",
    problemStatement:
      "VS Code 是一款出色的编辑器，却被日益增长的云服务、聊天面板、智能体窗口和没人要的账户提示层层包裹。Remnants 彻底移除这一层。剩下的就是编辑器——快速、私密、安静。",
    objectives: [
      "移除每一处内置 AI 界面——Copilot、聊天、智能体、语音——同时不破坏底层的编辑器。",
      "在产品层面砍掉遥测与崩溃报告。没有登录、没有账户提示，这些都没得商量。",
      "通过 Open VSX 解析扩展，让编辑器在没有 Microsoft Marketplace 的情况下仍可用。",
    ],
    architectureDecisions: [
      "分支 Code - OSS 并在其分层架构（base、platform、editor、workbench、Electron 主进程）内工作——从零重写一个编辑器从来不是目标。",
      "在产品层与贡献层移除 AI 与遥测，使这些界面根本不会注册，而不是把它们藏在某个设置后面。",
      "将扩展库重新指向 Open VSX——干净地替换对 Marketplace 的依赖，而非仅仅关掉它。",
    ],
    implementationHighlights: [
      "无 AI 构建：Copilot、聊天面板、智能体会话、语音以及随附的 AI 扩展全部消失。",
      "在产品层面禁用遥测，标题栏与状态栏中没有任何账户提示。",
      "通过 Code - OSS 的 gulp 工具链实现可复现的 Windows 打包，产出按用户安装的 RemnantsUserSetup.exe。",
    ],
    qualityAndSecurity: [
      "默认私密：没有遥测、没有崩溃报告、没有登录。什么都不会向外回传，因为根本没有那条线。",
      "作为构建的一部分，对源代码进行完整的 TypeScript 类型检查，与上游工具链保持一致。",
      "诚实的分发：安装程序未签名，按用户安装（无需管理员权限），文档把这一点说清楚——附带 SmartScreen 说明。",
    ],
    challengesAndSolutions: [
      {
        challenge: "AI 与遥测深深织入编辑器——要把它们抽出来，又不能动摇其余一切。",
        solution:
          "我在产品层与贡献层切断这些界面，使其永不注册，同时让编辑器、终端、Git 与调试器的路径保持原样。是移除，不是重构。",
      },
      {
        challenge: "Code - OSS 庞大且演进迅速。个人分支一眨眼就过时了。",
        solution:
          "我严守分层架构与上游构建工具链，让我的改动保持隔离，分支保持可合并。",
      },
    ],
    hiringSignals: [
      "我能在庞大的真实代码库（VS Code）中工作，并有意识地去塑造它，而不是碰运气。",
      "在隐私与精简方面的判断力——移除复杂性对我和叠加它一样自然，而前者才是更难的那个。",
      "我端到端掌控完整的原生流水线，从源代码改动一直到成型的 Windows 安装程序。",
    ],
    nextIterations: [
      "经过验证的 macOS 与 Linux 构建，并提供预编译下载。",
      "为 Windows 安装程序进行代码签名，好让 SmartScreen 别再瞪着它。",
      "自动化的上游变基工具，让维护分支不再那么费手。",
    ],
    tags: ["TypeScript", "Electron", "VS Code", "隐私"],
    impactHeading: "本项目如何创造价值",
    impactPoints: [
      "为开发者提供他们早已熟悉的编辑器，没有 AI 杂乱、遥测或登录提示。",
      "证明真正的隐私是在源头移除界面，而不是藏在一个开关后面。",
      "展示了维护一个大型开源项目的严肃分支所需要的纪律。",
    ],
    stats: [
      { value: "0", label: "遥测" },
      { value: "0", label: "登录" },
      { value: "100%", label: "开源内核" },
      { value: "1", label: "维护者" },
    ],
  },
};
