import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const zephyr: Record<Language, LocalizedContent> = {
  en: {
    tagline: "Tasks, notes, calendar, and a focus timer — all yours, all offline.",
    description:
      "Zephyr is a local-first productivity PWA: tasks, notes, a calendar, and a Pomodoro timer in one place. No login, no backend, no data ever leaving your browser.",
    overview:
      "I built Zephyr because every productivity app wants an account, a subscription, and a copy of your whole day on someone else's server. So I wrote my own with React, Vite, Tailwind, and Radix — and put every task, note, event, and focus session in localStorage. Nothing uploads, nothing to sign up for, and it still works with the Wi-Fi off. Four tools that usually mean four tabs, in one app you actually own.",
    roleSummary: "Designed it, built it, shipped it. Just me.",
    problemStatement:
      "I wanted one place for tasks, notes, a calendar, and focus sessions — without handing my day to a backend or paying rent on my own data. Every option I found did the opposite.",
    objectives: [
      "Put tasks, notes, calendar, and a Pomodoro timer under one roof without four logins.",
      "Keep every byte on-device: no account, no server, works offline.",
      "Make the everyday loop — capture, plan, focus — fast on a phone and a laptop alike.",
    ],
    architectureDecisions: [
      "Local-first by design: everything lives in localStorage under a zephyr_ prefix, so there is simply no backend to breach or bill.",
      "Singleton service classes over Redux, with hooks subscribed to a zephyr:change event — state stays live, even across tabs.",
      "React 18 + Vite (SWC) and lazy-loaded routes, so each tool only loads when you open it.",
    ],
    implementationHighlights: [
      "Four real tools, not stubs: tasks with due dates, priorities and tags; notes with pinning and color; a month calendar; a Pomodoro timer with presets and a streak counter.",
      "Cmd/Ctrl+K search across every task, note, and event at once.",
      "An installable PWA with optional reminders — add it to the dock, close the tab, keep the data.",
    ],
    qualityAndSecurity: [
      "Privacy is the architecture, not a setting: with no server, there is nothing to leak and no terms to read.",
      "Vitest coverage around the core logic, plus deliberate empty and edge states so the flow never dead-ends.",
      "Responsive and theme-aware from phone to desktop, light or dark — built for both, not retrofitted for one.",
    ],
    challengesAndSolutions: [
      {
        challenge: "Keeping four separate tools in sync with no database and no global store.",
        solution:
          "Singleton services own the data and emit a zephyr:change event; every view subscribes, so edits propagate instantly — even between open tabs.",
      },
      {
        challenge: "Four feature areas that could easily turn into four cluttered apps.",
        solution:
          "Shared Tailwind and Radix primitives plus a single command palette, so the whole thing reads as one product instead of four bolted together.",
      },
    ],
    hiringSignals: [
      "I can take a privacy-first idea and ship the whole thing — four real feature areas, no backend to hide behind.",
      "Pragmatic architecture: I reached for singleton services and an event bus instead of cargo-culting Redux.",
      "Comfortable owning a full React + Vite + Tailwind PWA on my own, tests included.",
    ],
    nextIterations: [
      "Optional end-to-end encrypted sync, so the plan can follow you across devices without giving up local-first.",
      "Export and import, so your data is as portable as it is private.",
      "Recurring tasks and events, the one thing I keep wishing I'd added sooner.",
    ],
    tags: ["React", "Vite", "Tailwind CSS", "Radix UI", "PWA"],
    stats: [
      { value: "4", label: "tools, one app" },
      { value: "0", label: "backend" },
      { value: "100%", label: "on-device" },
      { value: "0", label: "accounts" },
    ],
    impactHeading: "How This Project Creates Impact",
    impactPoints: [
      "Replaces four logged-in apps with one you can install and use entirely offline.",
      "Keeps personal data personal — nothing is ever uploaded, so there is nothing to leak.",
      "Proves a real productivity suite can ship without a server, an account, or a subscription.",
    ],
  },
  de: {
    tagline: "Aufgaben, Notizen, Kalender und ein Fokus-Timer — alles deins, alles offline.",
    description:
      "Zephyr ist eine local-first Produktivitäts-PWA: Aufgaben, Notizen, ein Kalender und ein Pomodoro-Timer an einem Ort. Kein Login, kein Backend, keine Daten, die je deinen Browser verlassen.",
    overview:
      "Ich habe Zephyr gebaut, weil jede Produktivitäts-App ein Konto will, ein Abo und eine Kopie deines ganzen Tages auf fremden Servern. Also schrieb ich meine eigene — mit React, Vite, Tailwind und Radix — und legte jede Aufgabe, Notiz, jeden Termin und jede Fokus-Session in den localStorage. Nichts wird hochgeladen, nichts zum Anmelden, und es läuft auch mit ausgeschaltetem WLAN. Vier Tools, die sonst vier Tabs bedeuten, in einer App, die wirklich dir gehört.",
    roleSummary: "Entworfen, gebaut, ausgeliefert. Alles ich.",
    problemStatement:
      "Ich wollte einen Ort für Aufgaben, Notizen, einen Kalender und Fokus-Sessions — ohne meinen Tag einem Backend zu überlassen oder Miete für meine eigenen Daten zu zahlen. Jede Option, die ich fand, machte das Gegenteil.",
    objectives: [
      "Aufgaben, Notizen, Kalender und einen Pomodoro-Timer unter ein Dach bringen, ohne vier Logins.",
      "Jedes Byte auf dem Gerät halten: kein Konto, kein Server, funktioniert offline.",
      "Den Alltags-Loop — erfassen, planen, fokussieren — auf Handy und Laptop gleichermaßen schnell machen.",
    ],
    architectureDecisions: [
      "Local-first by Design: Alles lebt im localStorage unter einem zephyr_-Präfix — es gibt schlicht kein Backend, das man angreifen oder abrechnen könnte.",
      "Singleton-Service-Klassen statt Redux, mit Hooks, die ein zephyr:change-Event abonnieren — der State bleibt live, sogar über Tabs hinweg.",
      "React 18 + Vite (SWC) und lazy geladene Routen, sodass jedes Tool erst lädt, wenn du es öffnest.",
    ],
    implementationHighlights: [
      "Vier echte Tools, keine Platzhalter: Aufgaben mit Fälligkeit, Prioritäten und Tags; Notizen mit Anpinnen und Farbe; ein Monatskalender; ein Pomodoro-Timer mit Presets und Streak-Zähler.",
      "Cmd/Ctrl+K-Suche über alle Aufgaben, Notizen und Termine auf einmal.",
      "Eine installierbare PWA mit optionalen Erinnerungen — ins Dock legen, Tab schließen, Daten behalten.",
    ],
    qualityAndSecurity: [
      "Privatsphäre ist die Architektur, keine Einstellung: ohne Server gibt es nichts zu leaken und keine AGB zu lesen.",
      "Vitest-Abdeckung um die Kernlogik, plus bewusst behandelte Leer- und Edge-States, damit der Flow nie in einer Sackgasse endet.",
      "Responsiv und theme-fähig vom Handy bis zum Desktop, hell oder dunkel — für beides gebaut, nicht für eines nachgerüstet.",
    ],
    challengesAndSolutions: [
      {
        challenge: "Vier separate Tools synchron halten — ohne Datenbank und ohne globalen Store.",
        solution:
          "Singleton-Services besitzen die Daten und feuern ein zephyr:change-Event; jede View abonniert es, also verbreiten sich Änderungen sofort — sogar zwischen offenen Tabs.",
      },
      {
        challenge: "Vier Funktionsbereiche, aus denen leicht vier unübersichtliche Apps werden könnten.",
        solution:
          "Geteilte Tailwind- und Radix-Primitiven plus eine einzige Befehlspalette, damit sich das Ganze wie ein Produkt liest statt wie vier zusammengeschraubte.",
      },
    ],
    hiringSignals: [
      "Ich kann eine Privacy-First-Idee nehmen und das Ganze ausliefern — vier echte Funktionsbereiche, kein Backend zum Verstecken.",
      "Pragmatische Architektur: Ich griff zu Singleton-Services und einem Event-Bus, statt Redux nachzuplappern.",
      "Souverän darin, eine vollständige React + Vite + Tailwind PWA allein zu verantworten, Tests inklusive.",
    ],
    nextIterations: [
      "Optionale Ende-zu-Ende-verschlüsselte Sync, damit der Plan dir über Geräte folgt, ohne local-first aufzugeben.",
      "Export und Import, damit deine Daten so portabel wie privat sind.",
      "Wiederkehrende Aufgaben und Termine — das Eine, von dem ich ständig wünschte, ich hätte es früher eingebaut.",
    ],
    tags: ["React", "Vite", "Tailwind CSS", "Radix UI", "PWA"],
    stats: [
      { value: "4", label: "Tools, eine App" },
      { value: "0", label: "Backend" },
      { value: "100%", label: "auf dem Gerät" },
      { value: "0", label: "Konten" },
    ],
    impactHeading: "Wie dieses Projekt Wirkung erzeugt",
    impactPoints: [
      "Ersetzt vier eingeloggte Apps durch eine, die man installieren und komplett offline nutzen kann.",
      "Hält persönliche Daten persönlich — nichts wird je hochgeladen, also gibt es nichts zu leaken.",
      "Beweist, dass eine echte Produktivitäts-Suite ohne Server, Konto oder Abo ausliefern kann.",
    ],
  },
  fr: {
    tagline: "Tâches, notes, calendrier et minuteur de focus — tout à vous, tout hors ligne.",
    description:
      "Zephyr est une PWA de productivité local-first : tâches, notes, calendrier et minuteur Pomodoro au même endroit. Pas de connexion, pas de backend, aucune donnée qui ne quitte jamais votre navigateur.",
    overview:
      "J'ai construit Zephyr parce que chaque app de productivité veut un compte, un abonnement et une copie de toute votre journée sur le serveur d'un autre. Alors j'ai écrit la mienne — en React, Vite, Tailwind et Radix — et j'ai mis chaque tâche, note, événement et session de focus dans le localStorage. Rien n'est envoyé, rien à créer comme compte, et ça marche même le Wi-Fi coupé. Quatre outils qui signifient d'habitude quatre onglets, dans une app qui vous appartient vraiment.",
    roleSummary: "Conçu, développé, déployé. Moi, seul.",
    problemStatement:
      "Je voulais un seul endroit pour les tâches, les notes, un calendrier et les sessions de focus — sans confier ma journée à un backend ni payer un loyer pour mes propres données. Chaque option trouvée faisait l'inverse.",
    objectives: [
      "Réunir tâches, notes, calendrier et minuteur Pomodoro sous un même toit, sans quatre connexions.",
      "Garder chaque octet sur l'appareil : pas de compte, pas de serveur, ça marche hors ligne.",
      "Rendre la boucle du quotidien — capturer, planifier, se concentrer — rapide aussi bien sur téléphone que sur portable.",
    ],
    architectureDecisions: [
      "Local-first par conception : tout vit dans le localStorage sous un préfixe zephyr_, il n'y a donc tout simplement aucun backend à pirater ou à facturer.",
      "Des classes de service singleton plutôt que Redux, avec des hooks abonnés à un événement zephyr:change — l'état reste vivant, même d'un onglet à l'autre.",
      "React 18 + Vite (SWC) et des routes chargées en lazy, pour que chaque outil ne se charge qu'à son ouverture.",
    ],
    implementationHighlights: [
      "Quatre vrais outils, pas des ébauches : des tâches avec échéances, priorités et tags ; des notes avec épinglage et couleur ; un calendrier mensuel ; un minuteur Pomodoro avec presets et compteur de séries.",
      "Recherche Cmd/Ctrl+K sur toutes les tâches, notes et événements d'un coup.",
      "Une PWA installable avec rappels optionnels — ajoutez-la au dock, fermez l'onglet, gardez les données.",
    ],
    qualityAndSecurity: [
      "La confidentialité est l'architecture, pas un réglage : sans serveur, il n'y a rien à fuiter ni de conditions à lire.",
      "Couverture Vitest autour de la logique centrale, plus des états vides et limites gérés volontairement pour que le flux ne mène jamais à une impasse.",
      "Responsive et adaptée aux thèmes du téléphone au desktop, clair ou sombre — pensée pour les deux, pas rafistolée pour un seul.",
    ],
    challengesAndSolutions: [
      {
        challenge: "Garder quatre outils distincts synchronisés sans base de données ni store global.",
        solution:
          "Des services singleton possèdent les données et émettent un événement zephyr:change ; chaque vue s'y abonne, donc les modifications se propagent instantanément — même entre onglets ouverts.",
      },
      {
        challenge: "Quatre domaines fonctionnels qui pourraient vite devenir quatre apps encombrées.",
        solution:
          "Des primitives Tailwind et Radix partagées plus une seule palette de commandes, pour que l'ensemble se lise comme un produit et non comme quatre choses vissées ensemble.",
      },
    ],
    hiringSignals: [
      "Je sais prendre une idée privacy-first et livrer le tout — quatre vrais domaines fonctionnels, aucun backend derrière lequel me cacher.",
      "Une architecture pragmatique : j'ai choisi des services singleton et un bus d'événements au lieu de répéter Redux par réflexe.",
      "À l'aise pour porter seul une PWA React + Vite + Tailwind complète, tests compris.",
    ],
    nextIterations: [
      "Une synchronisation chiffrée de bout en bout optionnelle, pour que le plan vous suive d'un appareil à l'autre sans renoncer au local-first.",
      "Export et import, pour que vos données soient aussi portables que privées.",
      "Tâches et événements récurrents — la seule chose que je regrette de ne pas avoir ajoutée plus tôt.",
    ],
    tags: ["React", "Vite", "Tailwind CSS", "Radix UI", "PWA"],
    stats: [
      { value: "4", label: "outils, une app" },
      { value: "0", label: "backend" },
      { value: "100%", label: "sur l'appareil" },
      { value: "0", label: "comptes" },
    ],
    impactHeading: "Comment ce projet crée de l'impact",
    impactPoints: [
      "Remplace quatre apps avec connexion par une seule, installable et utilisable entièrement hors ligne.",
      "Garde les données personnelles personnelles — rien n'est jamais envoyé, donc il n'y a rien à fuiter.",
      "Prouve qu'une vraie suite de productivité peut se livrer sans serveur, sans compte et sans abonnement.",
    ],
  },
  zh: {
    tagline: "任务、笔记、日历，再加一个专注计时器——全归你，全离线。",
    description:
      "Zephyr 是一款本地优先的生产力 PWA：任务、笔记、日历和番茄钟计时器集于一处。无需登录，没有后端，任何数据都不会离开你的浏览器。",
    overview:
      "我做 Zephyr，是因为每一款生产力应用都想要一个账号、一份订阅，外加把你一整天的安排复制到别人的服务器上。于是我用 React、Vite、Tailwind 和 Radix 写了自己的一款，把每一条任务、笔记、事件和专注记录都放进 localStorage。什么都不上传，不用注册，断了 Wi-Fi 也照样能用。原本要开四个标签页的四种工具，如今装进一个真正属于你的应用里。",
    roleSummary: "设计、开发、上线，全是我一个人。",
    problemStatement:
      "我想要一个地方装下任务、笔记、日历和专注记录——既不必把日程交给后端，也不用为自己的数据交租。可我找到的每个方案做的都恰恰相反。",
    objectives: [
      "把任务、笔记、日历和番茄钟计时器收进同一屋檐下，免去四次登录。",
      "把每个字节都留在设备上：没有账号、没有服务器、离线可用。",
      "让日常循环——捕获、规划、专注——在手机和笔记本上都同样快。",
    ],
    architectureDecisions: [
      "本地优先是设计前提：一切都存在带 zephyr_ 前缀的 localStorage 里，因此根本没有可被攻破、可被计费的后端。",
      "用单例服务类而非 Redux，配合订阅 zephyr:change 事件的 hooks——状态始终鲜活，跨标签页也是。",
      "React 18 + Vite（SWC）加懒加载路由，让每个工具只在你打开时才加载。",
    ],
    implementationHighlights: [
      "四种真正的工具，而非占位：带截止日期、优先级与标签的任务；可置顶、带配色的笔记；月视图日历；带预设与连续天数计数的番茄钟。",
      "用 Cmd/Ctrl+K 一次性搜索全部任务、笔记和事件。",
      "可安装的 PWA，带可选提醒——把它放进程序坞，关掉标签页，数据照样还在。",
    ],
    qualityAndSecurity: [
      "隐私就是架构本身，而非一个开关：没有服务器，就没有什么可泄露，也没有条款要读。",
      "围绕核心逻辑的 Vitest 覆盖，外加有意处理的空态与边界态，让流程绝不在你面前走入死胡同。",
      "从手机到桌面、明暗主题皆宜的响应式——为两者而生，而非为其一后补。",
    ],
    challengesAndSolutions: [
      {
        challenge: "在没有数据库、没有全局状态库的情况下，让四个独立工具保持同步。",
        solution: "由单例服务持有数据并派发 zephyr:change 事件；每个视图都订阅它，于是改动会即时传播——哪怕在多个打开的标签页之间。",
      },
      {
        challenge: "四个功能板块，一不小心就会变成四个杂乱的应用。",
        solution: "共享 Tailwind 与 Radix 基元，再加一个统一的命令面板，让整体读起来像一个产品，而不是四样东西硬拼在一起。",
      },
    ],
    hiringSignals: [
      "我能把一个隐私优先的想法整体做出来——四个真实功能板块，没有可供躲藏的后端。",
      "务实的架构：我选了单例服务加事件总线，而不是条件反射式地照搬 Redux。",
      "能独自负责一整套 React + Vite + Tailwind 的 PWA，连测试也一起。",
    ],
    nextIterations: [
      "可选的端到端加密同步，让计划跟着你跨设备走，又不放弃本地优先。",
      "导出与导入，让你的数据既私密又便携。",
      "重复的任务与事件——这是我一直懊悔没早点加上的那一项。",
    ],
    tags: ["React", "Vite", "Tailwind CSS", "Radix UI", "PWA"],
    stats: [
      { value: "4", label: "工具，一应用" },
      { value: "0", label: "后端" },
      { value: "100%", label: "本地存储" },
      { value: "0", label: "账号" },
    ],
    impactHeading: "本项目如何创造价值",
    impactPoints: [
      "用一款可安装、可完全离线使用的应用，取代四款需要登录的应用。",
      "让个人数据始终归个人——什么都不上传，自然也没什么可泄露。",
      "证明一套真正的生产力套件，无需服务器、账号或订阅也能上线。",
    ],
  },
};
