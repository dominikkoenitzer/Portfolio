import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const remnants: Record<Language, LocalizedContent> = {
  en: {
    tagline: "VS Code, minus the parts that talk back.",
    description:
      "Remnants is a native Windows editor: my personal build of Code - OSS with Copilot, chat, agents, telemetry and sign-in cut out, and the editor, terminal, Git and debugger left fully intact.",
    overview:
      "I love VS Code. I do not love the chat panel, the agent window, the account prompt, or anything quietly reporting my keystrokes upstream. So I took Code - OSS, the open-source core, and removed every AI surface, telemetry hook and sign-in nag, without touching what actually matters: fast editing, IntelliSense, the integrated terminal, source control and the JavaScript/Node debugger. Extensions resolve through Open VSX. It ships as a per-user Windows installer, RemnantsUserSetup.exe. The whole change is roughly 759,000 lines removed and 2,800 added on top of upstream 1.125.0, and CHANGES.md lists all of it, because almost all the code here is Microsoft's and that should be easy to check.",
    roleSummary: "Just me: the cuts, the build, the installer, and the CHANGES file.",
    problemStatement:
      "VS Code is a great editor wrapped in a growing layer of cloud services, chat panels, agent windows and account prompts you never asked for. Remnants removes that layer entirely, and what's left is the editor.",
    objectives: [
      "Remove every built-in AI surface (Copilot, chat, agents, voice) without breaking the editor underneath.",
      "Kill telemetry and crash reporting at the product level, with no sign-in and no account prompts anywhere.",
      "Route extensions through Open VSX so the editor still works without Microsoft's Marketplace.",
      "Document every change, so my contribution can be audited instead of taken on faith.",
    ],
    architectureDecisions: [
      "Work inside the layered Code - OSS architecture (base, platform, editor, workbench, Electron main). Reimplementing an editor was never the point.",
      "Cut AI and telemetry at the product and contribution level, so the surfaces never register at all rather than sitting hidden behind a setting.",
      "Repoint the extension gallery at Open VSX, replacing the Marketplace dependency instead of switching it off.",
      "Keep the upstream tree marked linguist-vendored, so the repository's language stats measure my code and not Microsoft's.",
    ],
    implementationHighlights: [
      "An AI-free build: Copilot, the chat panel, agent sessions, voice and the bundled AI extension are all gone.",
      "Telemetry disabled at the product level, with no account prompt left in the title bar or the status bar.",
      "Reproducible Windows packaging through the Code - OSS gulp toolchain, emitting a per-user RemnantsUserSetup.exe.",
      "18 commits on top of a single base revision, so a diff against upstream 1.125.0 shows exactly what I did.",
    ],
    qualityAndSecurity: [
      "Telemetry, crash reporting and sign-in are gone. Nothing phones home, because there is no phone.",
      "The upstream TypeScript type-check runs across the source in CI, the same one the original project uses.",
      "The installer is unsigned and per-user (no admin rights), and the docs say so plainly, SmartScreen guidance included.",
      "Upstream's MIT licence and third-party notices are retained, and CHANGES.md is honest about the repository being a squashed import rather than a real git fork.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "AI and telemetry are woven deep into the editor. Pulling them out without destabilizing everything else was the hard part.",
        solution:
          "I cut the surfaces at the product and contribution layer so they never register, and left the editor, terminal, Git and debugger paths untouched.",
      },
      {
        challenge:
          "Code - OSS is enormous and moves fast. A personal fork drifts out of date the moment you blink.",
        solution:
          "I stay disciplined about the layered architecture and the upstream build toolchain, so my changes stay isolated and the fork stays mergeable.",
      },
    ],
    hiringSignals: [
      "I can work inside a codebase the size of VS Code and shape it on purpose.",
      "I am as comfortable removing complexity as adding it, which is the harder half.",
      "I own the whole native pipeline, from source changes to a finished Windows installer.",
      "I document provenance. CHANGES.md says what is mine, what is Microsoft's, and where I got the repository setup wrong.",
    ],
    nextIterations: [
      "Code-signing the installers, so SmartScreen and Gatekeeper stop glaring at them.",
      "Tooling for the upstream rebase, so keeping the fork current is less of a manual grind.",
      "Re-cutting the repository as a real fork, so the git history is Microsoft's where it should be.",
    ],
    tags: ["TypeScript", "Electron", "VS Code", "Privacy"],
    impactHeading: "What This Project Is Good For",
    impactPoints: [
      "Gives developers the editor they already know, without the AI clutter, telemetry or sign-in prompts.",
      "Real privacy here meant removing the surfaces at the source.",
      "Shows the discipline it takes to keep a serious fork of a large open-source project alive.",
    ],
    stats: [
      { value: "759k", label: "lines removed" },
      { value: "0", label: "telemetry" },
      { value: "0", label: "sign-in" },
      { value: "1", label: "maintainer" },
    ],
  },
  de: {
    tagline: "VS Code, ohne die Teile, die zurückreden.",
    description:
      "Remnants ist ein nativer Windows-Editor: mein persönlicher Build von Code - OSS, aus dem Copilot, Chat, Agenten, Telemetrie und Sign-in herausgeschnitten sind, während Editor, Terminal, Git und Debugger vollständig erhalten bleiben.",
    overview:
      "Ich liebe VS Code. Ich liebe nicht das Chat-Panel, das Agenten-Fenster, die Kontoaufforderung oder irgendetwas, das still meine Tastenanschläge nach oben meldet. Also nahm ich Code - OSS, den Open-Source-Kern, und entfernte jede KI-Oberfläche, jeden Telemetrie-Hook und jedes Sign-in-Genöle, ohne das anzufassen, worauf es ankommt: schnelles Editieren, IntelliSense, das integrierte Terminal, die Versionskontrolle und den JavaScript/Node-Debugger. Erweiterungen kommen über Open VSX. Ausgeliefert wird ein Per-User-Installer für Windows, RemnantsUserSetup.exe. Die ganze Änderung sind rund 759'000 entfernte und 2'800 hinzugefügte Zeilen auf Upstream 1.125.0, und CHANGES.md listet alles davon auf, weil fast der ganze Code hier von Microsoft ist und das leicht nachprüfbar sein soll.",
    roleSummary: "Nur ich: die Schnitte, der Build, der Installer und die CHANGES-Datei.",
    problemStatement:
      "VS Code ist ein grossartiger Editor, eingewickelt in eine wachsende Schicht aus Cloud-Diensten, Chat-Panels, Agenten-Fenstern und Kontoaufforderungen, um die niemand gebeten hat. Remnants entfernt diese Schicht vollständig, und was bleibt, ist der Editor.",
    objectives: [
      "Jede eingebaute KI-Oberfläche entfernen (Copilot, Chat, Agenten, Voice), ohne den Editor darunter zu beschädigen.",
      "Telemetrie und Crash-Reporting auf Produktebene abschalten, ohne Sign-in und ohne Kontoaufforderungen.",
      "Erweiterungen über Open VSX beziehen, damit der Editor auch ohne Microsofts Marketplace funktioniert.",
      "Jede Änderung dokumentieren, damit mein Beitrag prüfbar ist und nicht auf Vertrauen beruht.",
    ],
    architectureDecisions: [
      "Innerhalb der geschichteten Code-OSS-Architektur arbeiten (base, platform, editor, workbench, Electron main). Einen Editor neu zu schreiben war nie der Punkt.",
      "KI und Telemetrie auf Produkt- und Contribution-Ebene herausschneiden, damit die Oberflächen sich gar nie registrieren, statt hinter einer Einstellung zu warten.",
      "Die Extension-Gallery auf Open VSX umbiegen und die Marketplace-Abhängigkeit ersetzen, statt sie nur abzuschalten.",
      "Den Upstream-Baum als linguist-vendored markiert lassen, damit die Sprachstatistik des Repos meinen Code misst und nicht Microsofts.",
    ],
    implementationHighlights: [
      "Ein KI-freier Build: Copilot, Chat-Panel, Agenten-Sessions, Voice und die mitgelieferte KI-Erweiterung sind alle weg.",
      "Telemetrie auf Produktebene deaktiviert, ohne verbleibende Kontoaufforderung in Titel- oder Statusleiste.",
      "Reproduzierbares Windows-Packaging über die gulp-Toolchain von Code - OSS, die eine Per-User-Datei RemnantsUserSetup.exe ausgibt.",
      "18 Commits auf einer einzigen Basisrevision, damit ein Diff gegen Upstream 1.125.0 genau zeigt, was ich getan habe.",
    ],
    qualityAndSecurity: [
      "Telemetrie, Crash-Reporting und Sign-in sind weg. Nichts telefoniert nach Hause, weil es kein Telefon gibt.",
      "Der TypeScript-Typecheck von Upstream läuft in der CI über den Quellcode, derselbe, den das Originalprojekt nutzt.",
      "Der Installer ist unsigniert und per-user (keine Adminrechte), und die Dokumentation sagt das klar, samt SmartScreen-Hinweis.",
      "Die MIT-Lizenz und die Drittanbieter-Hinweise von Upstream bleiben erhalten, und CHANGES.md gibt offen zu, dass das Repo ein gequetschter Import ist und kein echter Git-Fork.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "KI und Telemetrie sind tief in den Editor eingewoben. Sie herauszuziehen, ohne alles andere zu destabilisieren, war der schwierige Teil.",
        solution:
          "Ich habe die Oberflächen auf Produkt- und Contribution-Ebene geschnitten, damit sie sich nie registrieren, und die Pfade für Editor, Terminal, Git und Debugger unangetastet gelassen.",
      },
      {
        challenge:
          "Code - OSS ist riesig und bewegt sich schnell. Ein persönlicher Fork veraltet, sobald man blinzelt.",
        solution:
          "Ich bleibe diszipliniert bei der geschichteten Architektur und der Upstream-Build-Toolchain, damit meine Änderungen isoliert und der Fork mergebar bleibt.",
      },
    ],
    hiringSignals: [
      "Ich kann in einer Codebasis von der Grösse von VS Code arbeiten und sie absichtlich formen.",
      "Komplexität zu entfernen liegt mir so gut wie sie hinzuzufügen, und das ist die schwierigere Hälfte.",
      "Ich verantworte die ganze native Pipeline, von den Quelländerungen bis zum fertigen Windows-Installer.",
      "Ich dokumentiere Herkunft. CHANGES.md sagt, was von mir ist, was von Microsoft, und wo ich das Repo-Setup verpatzt habe.",
    ],
    nextIterations: [
      "Die Installer signieren, damit SmartScreen und Gatekeeper aufhören, sie anzustarren.",
      "Werkzeuge für das Upstream-Rebase, damit der Fork aktuell zu halten weniger Handarbeit ist.",
      "Das Repo als echten Fork neu aufsetzen, damit die Git-Historie dort Microsofts ist, wo sie hingehört.",
    ],
    tags: ["TypeScript", "Electron", "VS Code", "Privacy"],
    impactHeading: "Wofür dieses Projekt gut ist",
    impactPoints: [
      "Gibt Entwicklern den Editor, den sie schon kennen, ohne KI-Ballast, Telemetrie oder Sign-in-Aufforderungen.",
      "Echte Privatsphäre hiess hier, die Oberflächen an der Quelle zu entfernen.",
      "Zeigt, wie viel Disziplin es braucht, einen ernsthaften Fork eines grossen Open-Source-Projekts am Leben zu halten.",
    ],
    stats: [
      { value: "759k", label: "entfernte Zeilen" },
      { value: "0", label: "Telemetrie" },
      { value: "0", label: "Sign-in" },
      { value: "1", label: "Maintainer" },
    ],
  },
  fr: {
    tagline: "VS Code, moins les parties qui répondent.",
    description:
      "Remnants est un éditeur Windows natif : mon build personnel de Code - OSS, avec Copilot, le chat, les agents, la télémétrie et la connexion retirés, et l'éditeur, le terminal, Git et le débogueur laissés entièrement intacts.",
    overview:
      "J'aime VS Code. Je n'aime pas le panneau de chat, la fenêtre d'agent, l'invite de compte, ni tout ce qui remonte discrètement mes frappes. J'ai donc pris Code - OSS, le cœur open source, et retiré chaque surface d'IA, chaque hook de télémétrie et chaque relance de connexion, sans toucher à ce qui compte vraiment : l'édition rapide, IntelliSense, le terminal intégré, le contrôle de version et le débogueur JavaScript/Node. Les extensions passent par Open VSX. Le tout est livré en installateur Windows par utilisateur, RemnantsUserSetup.exe. Le changement complet fait environ 759 000 lignes retirées et 2 800 ajoutées au-dessus de la version amont 1.125.0, et CHANGES.md les liste toutes, parce que presque tout le code ici est celui de Microsoft et que ça doit être facile à vérifier.",
    roleSummary: "Moi seul : les coupes, le build, l'installateur et le fichier CHANGES.",
    problemStatement:
      "VS Code est un excellent éditeur enveloppé dans une couche croissante de services cloud, de panneaux de chat, de fenêtres d'agent et d'invites de compte que personne n'a demandées. Remnants retire cette couche entièrement, et ce qui reste, c'est l'éditeur.",
    objectives: [
      "Retirer chaque surface d'IA intégrée (Copilot, chat, agents, voix) sans casser l'éditeur en dessous.",
      "Couper la télémétrie et les rapports de plantage au niveau du produit, sans connexion ni invite de compte.",
      "Faire passer les extensions par Open VSX, pour que l'éditeur fonctionne encore sans le Marketplace de Microsoft.",
      "Documenter chaque changement, pour que ma contribution s'audite au lieu de se croire.",
    ],
    architectureDecisions: [
      "Travailler à l'intérieur de l'architecture en couches de Code - OSS (base, platform, editor, workbench, Electron main). Réécrire un éditeur n'a jamais été l'objectif.",
      "Couper l'IA et la télémétrie au niveau du produit et des contributions, pour que ces surfaces ne s'enregistrent jamais plutôt que d'attendre derrière un réglage.",
      "Rediriger la galerie d'extensions vers Open VSX, en remplaçant la dépendance au Marketplace plutôt qu'en la désactivant.",
      "Garder l'arbre amont marqué linguist-vendored, pour que les statistiques de langage du dépôt mesurent mon code et non celui de Microsoft.",
    ],
    implementationHighlights: [
      "Un build sans IA : Copilot, le panneau de chat, les sessions d'agent, la voix et l'extension d'IA fournie ont tous disparu.",
      "Télémétrie désactivée au niveau du produit, sans invite de compte restante dans la barre de titre ni la barre d'état.",
      "Un empaquetage Windows reproductible via la toolchain gulp de Code - OSS, produisant un RemnantsUserSetup.exe par utilisateur.",
      "18 commits au-dessus d'une seule révision de base, si bien qu'un diff contre la version amont 1.125.0 montre exactement ce que j'ai fait.",
    ],
    qualityAndSecurity: [
      "Télémétrie, rapports de plantage et connexion ont disparu. Rien ne rappelle la maison, parce qu'il n'y a pas de téléphone.",
      "Le contrôle de types TypeScript de l'amont tourne sur les sources en CI, le même que celui du projet d'origine.",
      "L'installateur est non signé et par utilisateur (sans droits administrateur), et la documentation le dit clairement, consignes SmartScreen incluses.",
      "La licence MIT de l'amont et les notices tierces sont conservées, et CHANGES.md admet franchement que le dépôt est un import écrasé et non un vrai fork git.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "L'IA et la télémétrie sont tissées profondément dans l'éditeur. Les extraire sans déstabiliser tout le reste était la partie difficile.",
        solution:
          "J'ai coupé les surfaces au niveau du produit et des contributions pour qu'elles ne s'enregistrent jamais, en laissant intacts les chemins de l'éditeur, du terminal, de Git et du débogueur.",
      },
      {
        challenge:
          "Code - OSS est énorme et avance vite. Un fork personnel se périme dès qu'on cligne des yeux.",
        solution:
          "Je reste discipliné sur l'architecture en couches et la toolchain de build amont, pour que mes changements restent isolés et le fork fusionnable.",
      },
    ],
    hiringSignals: [
      "Je sais travailler dans une base de code de la taille de VS Code et la façonner exprès.",
      "Retirer de la complexité m'est aussi naturel qu'en ajouter, et c'est la moitié la plus difficile.",
      "Je porte toute la chaîne native, des changements de source à l'installateur Windows fini.",
      "Je documente la provenance. CHANGES.md dit ce qui est à moi, ce qui est à Microsoft, et là où j'ai mal monté le dépôt.",
    ],
    nextIterations: [
      "Signer les installateurs, pour que SmartScreen et Gatekeeper cessent de les fixer.",
      "Des outils pour le rebase amont, pour que maintenir le fork à jour soit moins manuel.",
      "Recréer le dépôt en vrai fork, pour que l'historique git soit celui de Microsoft là où il doit l'être.",
    ],
    tags: ["TypeScript", "Electron", "VS Code", "Privacy"],
    impactHeading: "À quoi sert ce projet",
    impactPoints: [
      "Donne aux développeurs l'éditeur qu'ils connaissent déjà, sans l'encombrement d'IA, la télémétrie ni les invites de connexion.",
      "Ici, la vraie confidentialité voulait dire retirer les surfaces à la source.",
      "Montre la discipline qu'il faut pour maintenir en vie un fork sérieux d'un grand projet open source.",
    ],
    stats: [
      { value: "759k", label: "lignes retirées" },
      { value: "0", label: "télémétrie" },
      { value: "0", label: "connexion" },
      { value: "1", label: "mainteneur" },
    ],
  },
  zh: {
    tagline: "VS Code，减去会跟你搭话的那些部分。",
    description:
      "Remnants 是一个原生 Windows 编辑器：我自己的 Code - OSS 构建版本，剔掉了 Copilot、聊天面板、智能体、遥测和登录，而编辑器、终端、Git 和调试器完整保留。",
    overview:
      "我喜欢 VS Code。我不喜欢聊天面板、智能体窗口、账号提示，也不喜欢任何悄悄把我的按键往上报的东西。于是我拿开源内核 Code - OSS，把每一处 AI 界面、每个遥测钩子和每一次登录催促都拆掉，同时不动那些真正要紧的部分：快速编辑、IntelliSense、集成终端、版本控制，以及 JavaScript/Node 调试器。扩展改走 Open VSX。交付形式是一个按用户安装的 Windows 安装包 RemnantsUserSetup.exe。整个改动在上游 1.125.0 之上大约是删掉 759,000 行、加上 2,800 行，CHANGES.md 把它们全列了出来，因为这里几乎所有代码都是微软的，这一点应该很容易核对。",
    roleSummary: "只有我：那些删减、构建、安装包，以及那份 CHANGES 文件。",
    problemStatement:
      "VS Code 是一个很好的编辑器，只是被一层越来越厚的云服务、聊天面板、智能体窗口和账号提示包住了，而这些谁也没要过。Remnants 把那一层整个拿掉，剩下的就是编辑器。",
    objectives: [
      "移除每一处内置 AI 界面（Copilot、聊天、智能体、语音），同时不弄坏底下的编辑器。",
      "在产品层关掉遥测和崩溃上报，不留登录，也不留账号提示。",
      "让扩展改走 Open VSX，这样没有微软商店编辑器也照样能用。",
      "把每一处改动都写下来，让我的贡献可以被核查，而不是被相信。",
    ],
    architectureDecisions: [
      "在 Code - OSS 的分层架构里干活（base、platform、editor、workbench、Electron main）。重写一个编辑器从来不是目的。",
      "在产品层和 contribution 层就把 AI 和遥测切掉，让这些界面根本不注册，而不是藏在某个设置背后等着。",
      "把扩展市场指向 Open VSX，把对微软商店的依赖替换掉，而不是只把它关掉。",
      "上游代码树保持 linguist-vendored 标记，让仓库的语言统计量的是我的代码，不是微软的。",
    ],
    implementationHighlights: [
      "一个无 AI 的构建：Copilot、聊天面板、智能体会话、语音，以及随包的 AI 扩展，全都没了。",
      "遥测在产品层被禁用，标题栏和状态栏里也不再留下任何账号提示。",
      "通过 Code - OSS 的 gulp 工具链做可复现的 Windows 打包，产出按用户安装的 RemnantsUserSetup.exe。",
      "在同一个基线版本之上 18 个提交，所以拿上游 1.125.0 做一次 diff，就能看清我到底做了什么。",
    ],
    qualityAndSecurity: [
      "遥测、崩溃上报和登录都没了。没有什么会往家里打电话，因为电话本身就不在。",
      "上游那套 TypeScript 类型检查在 CI 里跑遍源码，和原项目用的是同一套。",
      "安装包未签名，按用户安装（不需要管理员权限），文档里把这点写清楚了，也附上了 SmartScreen 的说明。",
      "上游的 MIT 许可和第三方声明都保留着，CHANGES.md 也坦白说这个仓库是一次压缩导入，而不是真正的 git fork。",
    ],
    challengesAndSolutions: [
      {
        challenge: "AI 和遥测在编辑器里织得很深。把它们抽出来又不动摇其余部分，这才是难的地方。",
        solution: "我在产品层和 contribution 层把这些界面切断，让它们根本不注册，同时编辑器、终端、Git 和调试器的路径一处未动。",
      },
      {
        challenge: "Code - OSS 体量巨大，走得也快。个人 fork 一眨眼就旧了。",
        solution: "我在分层架构和上游构建工具链上守规矩，让我的改动保持独立，fork 也保持可合并。",
      },
    ],
    hiringSignals: [
      "我能在 VS Code 这种量级的代码库里干活，并且是有意地去改它。",
      "删掉复杂度和加上复杂度，我都做得来，而前者是更难的那一半。",
      "整条原生流水线由我负责，从源码改动一直到做好的 Windows 安装包。",
      "我会把来源写清楚。CHANGES.md 说明了哪部分是我的、哪部分是微软的，以及仓库我是怎么建错的。",
    ],
    nextIterations: [
      "给安装包做代码签名，让 SmartScreen 和 Gatekeeper 别再瞪着它们。",
      "为上游 rebase 做点工具，让跟上上游不至于全靠手工。",
      "把仓库按真正的 fork 重新建一次，让 git 历史该属于微软的地方就属于微软。",
    ],
    tags: ["TypeScript", "Electron", "VS Code", "Privacy"],
    impactHeading: "这个项目有什么用",
    impactPoints: [
      "把开发者已经熟悉的编辑器给他们，只是没有 AI 的杂物、遥测和登录提示。",
      "在这里，真正的隐私意味着从源头把这些界面移除。",
      "展示要养住一个大型开源项目的正经 fork，需要多少纪律。",
    ],
    stats: [
      { value: "759k", label: "删除的行数" },
      { value: "0", label: "遥测" },
      { value: "0", label: "登录" },
      { value: "1", label: "维护者" },
    ],
  },
};
