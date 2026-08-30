import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const zephyr: Record<Language, LocalizedContent> = {
  en: {
    tagline: "A to-do list and a focus timer, all yours and all offline.",
    description:
      "Zephyr is a local-first productivity PWA: a to-do list and a Pomodoro focus timer in one place. No login, no backend, no data ever leaving your browser.",
    overview:
      "I built Zephyr because every productivity app wants an account, a subscription, and a copy of your whole day on someone else's server. So I wrote my own with React, Vite, Tailwind, and Radix, and put every task and focus session in localStorage. Nothing uploads, there is nothing to sign up for, and it still works with the Wi-Fi off. It once carried notes, a journal, and a calendar too; I cut them so the two tools that earn daily use stay fast and obvious.",
    roleSummary: "Designed it, built it, shipped it. Just me.",
    problemStatement:
      "I wanted one place for tasks and focus sessions, without handing my day to a backend or paying rent on my own data. Every option I found did the opposite.",
    objectives: [
      "Put a to-do list and a Pomodoro timer under one roof without a login.",
      "Keep every byte on-device: no account, no server, works offline.",
      "Make the everyday loop of capture, plan, and focus fast on a phone and a laptop alike.",
    ],
    architectureDecisions: [
      "Local-first by design: everything lives in localStorage under a zephyr_ prefix, so there is simply no backend to breach or bill.",
      "Singleton service classes over Redux, with hooks subscribed to a zephyr:change event, so state stays live even across tabs.",
      "React 19 + Vite (SWC) and lazy-loaded routes, so each page only loads when you open it.",
    ],
    implementationHighlights: [
      "Two real tools, not stubs: tasks with due dates, priorities, tags, and natural-language quick add; a Pomodoro timer with presets, session logging, and a streak counter.",
      "A Cmd/Ctrl+K command palette that searches every task and runs every command.",
      "An installable PWA with optional reminders and full export/import: add it to the dock, close the tab, keep the data.",
    ],
    qualityAndSecurity: [
      "Privacy is the architecture, not a setting: with no server, there is nothing to leak and no terms to read.",
      "Vitest coverage around the core logic, plus deliberate empty and edge states so the flow never dead-ends.",
      "Responsive and theme-aware from phone to desktop, light or dark, built for both from the start rather than retrofitted.",
    ],
    challengesAndSolutions: [
      {
        challenge: "Keeping every view in sync with no database and no global store.",
        solution:
          "Singleton services own the data and emit a zephyr:change event; every view subscribes, so edits propagate instantly, even between open tabs.",
      },
      {
        challenge: "Knowing what to cut: four feature areas had grown into clutter.",
        solution:
          "Notes, the journal, and the calendar came out, and old links still redirect. Shared Tailwind and Radix primitives plus a single command palette make what remains read as one deliberate product.",
      },
    ],
    hiringSignals: [
      "I can take a privacy-first idea, ship the whole thing, and then cut it back to the features that earn their place.",
      "Pragmatic architecture: I reached for singleton services and an event bus instead of cargo-culting Redux.",
      "Comfortable owning a full React + Vite + Tailwind PWA on my own, tests included.",
    ],
    nextIterations: [
      "Optional end-to-end encrypted sync, so the plan can follow you across devices without giving up local-first.",
      "Recurring tasks, the one thing I keep wishing I'd added sooner.",
    ],
    tags: ["React", "Vite", "Tailwind CSS", "Radix UI", "PWA"],
    stats: [
      { value: "2", label: "tools, on purpose" },
      { value: "0", label: "backend" },
      { value: "100%", label: "on-device" },
      { value: "0", label: "accounts" },
    ],
    impactHeading: "What This Project Is Good For",
    impactPoints: [
      "Replaces a handful of logged-in apps with one you can install and use entirely offline.",
      "Keeps personal data on your device, because nothing is ever uploaded.",
      "Proves a real productivity app can ship without a server, an account, or a subscription.",
    ],
  },
  de: {
    tagline: "Eine To-do-Liste und ein Fokus-Timer, alles deins und alles offline.",
    description:
      "Zephyr ist eine local-first Produktivitäts-PWA: eine To-do-Liste und ein Pomodoro-Timer an einem Ort. Kein Login, kein Backend, keine Daten, die je deinen Browser verlassen.",
    overview:
      "Ich habe Zephyr gebaut, weil jede Produktivitäts-App ein Konto will, ein Abo und eine Kopie deines ganzen Tages auf fremden Servern. Also schrieb ich meine eigene, mit React, Vite, Tailwind und Radix, und legte jede Aufgabe und jede Fokus-Session in den localStorage. Nichts wird hochgeladen, es gibt nichts zum Anmelden, und es läuft auch mit ausgeschaltetem WLAN. Früher trug es auch Notizen, ein Journal und einen Kalender; ich habe sie gestrichen, damit die zwei Tools, die täglich gebraucht werden, schnell und klar bleiben.",
    roleSummary: "Entworfen, gebaut, ausgeliefert. Alles ich.",
    problemStatement:
      "Ich wollte einen Ort für Aufgaben und Fokus-Sessions, ohne meinen Tag einem Backend zu überlassen oder Miete für meine eigenen Daten zu zahlen. Jede Option, die ich fand, machte das Gegenteil.",
    objectives: [
      "Eine To-do-Liste und einen Pomodoro-Timer unter ein Dach bringen, ohne Login.",
      "Jedes Byte auf dem Gerät halten: kein Konto, kein Server, funktioniert offline.",
      "Den Alltags-Loop aus Erfassen, Planen und Fokussieren auf Handy und Laptop gleichermaßen schnell machen.",
    ],
    architectureDecisions: [
      "Local-first by Design: Alles lebt im localStorage unter einem zephyr_-Präfix; es gibt schlicht kein Backend, das man angreifen oder abrechnen könnte.",
      "Singleton-Service-Klassen statt Redux, mit Hooks, die ein zephyr:change-Event abonnieren, sodass der State live bleibt, sogar über Tabs hinweg.",
      "React 19 + Vite (SWC) und lazy geladene Routen, sodass jede Seite erst lädt, wenn du sie öffnest.",
    ],
    implementationHighlights: [
      "Zwei echte Tools, keine Platzhalter: Aufgaben mit Fälligkeit, Prioritäten, Tags und Quick-Add in natürlicher Sprache; ein Pomodoro-Timer mit Presets, Sitzungsprotokoll und Streak-Zähler.",
      "Eine Cmd/Ctrl+K-Befehlspalette, die jede Aufgabe findet und jeden Befehl ausführt.",
      "Eine installierbare PWA mit optionalen Erinnerungen und vollem Export/Import: ins Dock legen, Tab schließen, Daten behalten.",
    ],
    qualityAndSecurity: [
      "Privatsphäre ist die Architektur, keine Einstellung: ohne Server gibt es nichts zu leaken und keine AGB zu lesen.",
      "Vitest-Abdeckung um die Kernlogik, plus bewusst behandelte Leer- und Edge-States, damit der Flow nie in einer Sackgasse endet.",
      "Responsiv und theme-fähig vom Handy bis zum Desktop, hell oder dunkel, von Anfang an für beides gebaut statt nachgerüstet.",
    ],
    challengesAndSolutions: [
      {
        challenge: "Jede View synchron halten, ohne Datenbank und ohne globalen Store.",
        solution:
          "Singleton-Services besitzen die Daten und feuern ein zephyr:change-Event; jede View abonniert es, also verbreiten sich Änderungen sofort, sogar zwischen offenen Tabs.",
      },
      {
        challenge: "Wissen, was gestrichen gehört: Vier Funktionsbereiche waren zu Ballast geworden.",
        solution:
          "Notizen, Journal und Kalender flogen raus, alte Links leiten weiter. Geteilte Tailwind- und Radix-Primitiven plus eine einzige Befehlspalette lassen den Rest wie ein bewusstes Produkt wirken.",
      },
    ],
    hiringSignals: [
      "Ich kann eine Privacy-First-Idee komplett ausliefern und sie danach auf die Features zurückschneiden, die ihren Platz verdienen.",
      "Pragmatische Architektur: Ich griff zu Singleton-Services und einem Event-Bus, statt Redux nachzuplappern.",
      "Souverän darin, eine vollständige React + Vite + Tailwind PWA allein zu verantworten, Tests inklusive.",
    ],
    nextIterations: [
      "Optionale Ende-zu-Ende-verschlüsselte Sync, damit der Plan dir über Geräte folgt, ohne local-first aufzugeben.",
      "Wiederkehrende Aufgaben, das Eine, von dem ich ständig wünschte, ich hätte es früher eingebaut.",
    ],
    tags: ["React", "Vite", "Tailwind CSS", "Radix UI", "PWA"],
    stats: [
      { value: "2", label: "Tools, mit Absicht" },
      { value: "0", label: "Backend" },
      { value: "100%", label: "auf dem Gerät" },
      { value: "0", label: "Konten" },
    ],
    impactHeading: "Wofür dieses Projekt gut ist",
    impactPoints: [
      "Ersetzt eine Handvoll eingeloggter Apps durch eine, die man installieren und komplett offline nutzen kann.",
      "Hält persönliche Daten auf dem Gerät, weil nie etwas hochgeladen wird.",
      "Beweist, dass eine echte Produktivitäts-App ohne Server, Konto oder Abo ausliefern kann.",
    ],
  },
  fr: {
    tagline: "Une liste de tâches et un minuteur de focus, tout à vous et tout hors ligne.",
    description:
      "Zephyr est une PWA de productivité local-first : une liste de tâches et un minuteur Pomodoro au même endroit. Pas de connexion, pas de backend, aucune donnée qui ne quitte jamais votre navigateur.",
    overview:
      "J'ai construit Zephyr parce que chaque app de productivité veut un compte, un abonnement et une copie de toute votre journée sur le serveur d'un autre. Alors j'ai écrit la mienne, en React, Vite, Tailwind et Radix, et j'ai mis chaque tâche et chaque session de focus dans le localStorage. Rien n'est envoyé, il n'y a aucun compte à créer, et ça marche même le Wi-Fi coupé. Elle a aussi porté des notes, un journal et un calendrier ; je les ai retirés pour que les deux outils utilisés chaque jour restent rapides et évidents.",
    roleSummary: "Conçu, développé, déployé. Moi, seul.",
    problemStatement:
      "Je voulais un seul endroit pour les tâches et les sessions de focus, sans confier ma journée à un backend ni payer un loyer pour mes propres données. Chaque option trouvée faisait l'inverse.",
    objectives: [
      "Réunir une liste de tâches et un minuteur Pomodoro sous un même toit, sans connexion.",
      "Garder chaque octet sur l'appareil : pas de compte, pas de serveur, ça marche hors ligne.",
      "Rendre la boucle du quotidien (capturer, planifier, se concentrer) rapide aussi bien sur téléphone que sur portable.",
    ],
    architectureDecisions: [
      "Local-first par conception : tout vit dans le localStorage sous un préfixe zephyr_, il n'y a donc tout simplement aucun backend à pirater ou à facturer.",
      "Des classes de service singleton plutôt que Redux, avec des hooks abonnés à un événement zephyr:change, si bien que l'état reste vivant, même d'un onglet à l'autre.",
      "React 19 + Vite (SWC) et des routes chargées en lazy, pour que chaque page ne se charge qu'à son ouverture.",
    ],
    implementationHighlights: [
      "Deux vrais outils, pas des ébauches : des tâches avec échéances, priorités, tags et saisie rapide en langage naturel ; un minuteur Pomodoro avec presets, journal de sessions et compteur de séries.",
      "Une palette de commandes Cmd/Ctrl+K qui retrouve chaque tâche et lance chaque commande.",
      "Une PWA installable avec rappels optionnels et export/import complet : ajoutez-la au dock, fermez l'onglet, gardez les données.",
    ],
    qualityAndSecurity: [
      "La confidentialité est l'architecture, pas un réglage : sans serveur, il n'y a rien à fuiter ni de conditions à lire.",
      "Couverture Vitest autour de la logique centrale, plus des états vides et limites gérés volontairement pour que le flux ne mène jamais à une impasse.",
      "Responsive et adaptée aux thèmes du téléphone au desktop, clair ou sombre, pensée pour les deux dès le départ plutôt que rafistolée après coup.",
    ],
    challengesAndSolutions: [
      {
        challenge: "Garder chaque vue synchronisée sans base de données ni store global.",
        solution:
          "Des services singleton possèdent les données et émettent un événement zephyr:change ; chaque vue s'y abonne, donc les modifications se propagent instantanément, même entre onglets ouverts.",
      },
      {
        challenge: "Savoir quoi retirer : quatre domaines fonctionnels étaient devenus du fouillis.",
        solution:
          "Les notes, le journal et le calendrier sont sortis, les anciens liens redirigent toujours. Des primitives Tailwind et Radix partagées plus une seule palette de commandes font du reste un produit délibéré.",
      },
    ],
    hiringSignals: [
      "Je sais prendre une idée privacy-first, livrer le tout, puis le retailler aux fonctionnalités qui méritent leur place.",
      "Une architecture pragmatique : j'ai choisi des services singleton et un bus d'événements au lieu de répéter Redux par réflexe.",
      "À l'aise pour porter seul une PWA React + Vite + Tailwind complète, tests compris.",
    ],
    nextIterations: [
      "Une synchronisation chiffrée de bout en bout optionnelle, pour que le plan vous suive d'un appareil à l'autre sans renoncer au local-first.",
      "Les tâches récurrentes, la seule chose que je regrette de ne pas avoir ajoutée plus tôt.",
    ],
    tags: ["React", "Vite", "Tailwind CSS", "Radix UI", "PWA"],
    stats: [
      { value: "2", label: "outils, à dessein" },
      { value: "0", label: "backend" },
      { value: "100%", label: "sur l'appareil" },
      { value: "0", label: "comptes" },
    ],
    impactHeading: "À quoi sert ce projet",
    impactPoints: [
      "Remplace une poignée d'apps avec connexion par une seule, installable et utilisable entièrement hors ligne.",
      "Garde les données personnelles sur l'appareil, puisque rien n'est jamais envoyé.",
      "Prouve qu'une vraie app de productivité peut se livrer sans serveur, sans compte et sans abonnement.",
    ],
  },
  zh: {
    tagline: "一份待办清单，一个专注计时器，全归你，也全离线。",
    description:
      "Zephyr 是一款本地优先的生产力 PWA：待办清单和番茄钟计时器集于一处。无需登录，没有后端，任何数据都不会离开你的浏览器。",
    overview:
      "我做 Zephyr，是因为每一款生产力应用都想要一个账号、一份订阅，外加把你一整天的安排复制到别人的服务器上。于是我用 React、Vite、Tailwind 和 Radix 写了自己的一款，把每一条任务和专注记录都放进 localStorage。什么都不上传，不用注册，断了 Wi-Fi 也照样能用。它也曾装着笔记、日志和日历；我把它们砍掉了，好让每天真正用得上的两个工具保持快速、清晰。",
    roleSummary: "设计、开发、上线，全是我一个人。",
    problemStatement:
      "我想要一个地方装下任务和专注记录，既不必把日程交给后端，也不用为自己的数据交租。可我找到的每个方案做的都恰恰相反。",
    objectives: [
      "把待办清单和番茄钟计时器收进同一屋檐下，无需登录。",
      "把每个字节都留在设备上：没有账号、没有服务器、离线可用。",
      "让日常循环（捕获、规划、专注）在手机和笔记本上都同样快。",
    ],
    architectureDecisions: [
      "本地优先是设计前提：一切都存在带 zephyr_ 前缀的 localStorage 里，因此根本没有可被攻破、可被计费的后端。",
      "用单例服务类而非 Redux，配合订阅 zephyr:change 事件的 hooks，状态始终鲜活，跨标签页也是。",
      "React 19 + Vite（SWC）加懒加载路由，让每个页面只在你打开时才加载。",
    ],
    implementationHighlights: [
      "两种真正的工具，而非占位：带截止日期、优先级、标签与自然语言速记的任务；带预设、会话记录与连续天数计数的番茄钟。",
      "一个 Cmd/Ctrl+K 命令面板，找得到每条任务，跑得动每个命令。",
      "可安装的 PWA，带可选提醒和完整的导出导入：把它放进程序坞，关掉标签页，数据照样还在。",
    ],
    qualityAndSecurity: [
      "隐私就是架构本身，而非一个开关：没有服务器，就没有什么可泄露，也没有条款要读。",
      "围绕核心逻辑的 Vitest 覆盖，外加有意处理的空态与边界态，让流程绝不在你面前走入死胡同。",
      "从手机到桌面、明暗主题皆宜的响应式，一开始就为两者而建，而不是事后补上其一。",
    ],
    challengesAndSolutions: [
      {
        challenge: "在没有数据库、没有全局状态库的情况下，让每个视图保持同步。",
        solution: "由单例服务持有数据并派发 zephyr:change 事件；每个视图都订阅它，于是改动会即时传播，哪怕在多个打开的标签页之间。",
      },
      {
        challenge: "知道该砍什么：四个功能板块已经变成了负担。",
        solution: "笔记、日志和日历被移除，旧链接依然重定向。共享 Tailwind 与 Radix 基元，再加一个统一的命令面板，让留下的部分读起来像一个深思熟虑的产品。",
      },
    ],
    hiringSignals: [
      "我能把一个隐私优先的想法整体做出来，再把它裁剪到只留下配得上位置的功能。",
      "务实的架构：我选了单例服务加事件总线，而不是条件反射式地照搬 Redux。",
      "能独自负责一整套 React + Vite + Tailwind 的 PWA，连测试也一起。",
    ],
    nextIterations: [
      "可选的端到端加密同步，让计划跟着你跨设备走，又不放弃本地优先。",
      "重复任务，这是我一直懊悔没早点加上的那一项。",
    ],
    tags: ["React", "Vite", "Tailwind CSS", "Radix UI", "PWA"],
    stats: [
      { value: "2", label: "工具，有意为之" },
      { value: "0", label: "后端" },
      { value: "100%", label: "本地存储" },
      { value: "0", label: "账号" },
    ],
    impactHeading: "这个项目有什么用",
    impactPoints: [
      "用一款可安装、可完全离线使用的应用，取代几款需要登录的应用。",
      "把个人数据留在设备上，因为什么都不会上传。",
      "证明一款真正的生产力应用，无需服务器、账号或订阅也能上线。",
    ],
  },
};
