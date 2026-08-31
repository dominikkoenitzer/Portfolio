import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const zephyr: Record<Language, LocalizedContent> = {
  en: {
    tagline: "A to-do list and a focus timer, all yours and all offline.",
    description:
      "Zephyr is a local-first productivity PWA: a to-do list and a Pomodoro focus timer in one place. No login, no backend, no data ever leaving your browser.",
    overview:
      "I built Zephyr because every productivity app wants an account, a subscription, and a copy of your whole day on someone else's server. So I wrote my own with React, Vite, Tailwind and Radix, and put every task and focus session in localStorage. Nothing uploads, there is nothing to sign up for, and it still works with the Wi-Fi off. It once carried notes, a journal and a calendar too; I cut them, left the old routes redirecting, and kept the two tools that earn daily use.",
    roleSummary: "Designed it, built it, shipped it. Just me.",
    problemStatement:
      "I wanted one place for tasks and focus sessions, without handing my day to a backend or paying rent on my own data. Every option I found did the opposite.",
    objectives: [
      "Put a to-do list and a Pomodoro timer under one roof without a login.",
      "Keep every byte on-device: no account, no server, works offline.",
      "Make the everyday loop of capture, plan and focus fast on a phone and a laptop alike.",
    ],
    architectureDecisions: [
      "Local-first by design: everything lives in localStorage under a zephyr_ prefix, so there is no backend to breach or bill.",
      "Singleton service classes rather than Redux. Every write broadcasts a zephyr:change event that reactive hooks subscribe to, and the native storage event covers the other open tabs.",
      "React 19 and Vite (SWC) with lazy-loaded routes, so a page only loads when you open it.",
    ],
    implementationHighlights: [
      "Tasks with due dates, priorities, tags and a natural-language quick add, so \"call mum friday #family\" parses into a real task.",
      "A Pomodoro timer with presets, session logging and a streak counter.",
      "A Cmd/Ctrl+K command palette that searches every task by title, description and tag.",
      "An installable PWA with optional reminders and full export/import. When a new version ships it asks before reloading, rather than swapping itself out mid-session.",
    ],
    qualityAndSecurity: [
      "With no server, there is nothing to leak and no terms of service to read.",
      "85 Vitest cases across the storage layer, the quick-add parser, the task filters, the streak maths and the timer presets.",
      "Light, dark and system themes, applied before React renders so the page never flashes the wrong one.",
    ],
    challengesAndSolutions: [
      {
        challenge: "Keeping every view in sync with no database and no global store.",
        solution:
          "The services own the data and fire a zephyr:change event on every write; hooks subscribe to it, and to the browser's own storage event, so an edit in one tab shows up in the next.",
      },
      {
        challenge: "Knowing what to cut: four feature areas had grown into clutter.",
        solution:
          "Notes, the journal and the calendar came out, with their routes left redirecting to the task list. Shared Tailwind and Radix primitives and one command palette hold the rest together.",
      },
    ],
    hiringSignals: [
      "I shipped a privacy-first idea end to end, then cut it back to the two screens people actually opened.",
      "I reached for singleton services and an event bus because the app did not need Redux, and said so in the README.",
      "A full React, Vite and Tailwind PWA maintained on my own, with the tests to go with it.",
    ],
    nextIterations: [
      "Optional end-to-end encrypted sync, so the plan can follow you across devices without giving up local-first.",
      "Recurring tasks, the one thing I keep wishing I had added sooner.",
    ],
    tags: ["React", "Vite", "Tailwind CSS", "Radix UI", "PWA"],
    stats: [
      { value: "2", label: "tools, on purpose" },
      { value: "0", label: "backend" },
      { value: "100%", label: "on-device" },
      { value: "85", label: "tests" },
    ],
    impactHeading: "What This Project Is Good For",
    impactPoints: [
      "Replaces a handful of logged-in apps with one you can install and use entirely offline.",
      "Keeps personal data on your device, because nothing is ever uploaded.",
      "A real productivity app with no server, no account and no subscription behind it.",
    ],
  },
  de: {
    tagline: "Eine To-do-Liste und ein Fokus-Timer, alles deins und alles offline.",
    description:
      "Zephyr ist eine local-first Produktivitäts-PWA: eine To-do-Liste und ein Pomodoro-Timer an einem Ort. Kein Login, kein Backend, keine Daten, die je deinen Browser verlassen.",
    overview:
      "Ich habe Zephyr gebaut, weil jede Produktivitäts-App ein Konto will, ein Abo und eine Kopie deines ganzen Tages auf fremden Servern. Also schrieb ich meine eigene, mit React, Vite, Tailwind und Radix, und legte jede Aufgabe und jede Fokus-Session in den localStorage. Nichts wird hochgeladen, es gibt nichts zum Anmelden, und es läuft auch mit ausgeschaltetem WLAN. Früher trug es auch Notizen, ein Journal und einen Kalender; ich habe sie gestrichen, die alten Routen weiterleiten lassen und die zwei Tools behalten, die täglich gebraucht werden.",
    roleSummary: "Entworfen, gebaut, ausgeliefert. Alles ich.",
    problemStatement:
      "Ich wollte einen Ort für Aufgaben und Fokus-Sessions, ohne meinen Tag einem Backend zu überlassen oder Miete für meine eigenen Daten zu zahlen. Jede Option, die ich fand, machte das Gegenteil.",
    objectives: [
      "Eine To-do-Liste und einen Pomodoro-Timer unter ein Dach bringen, ohne Login.",
      "Jedes Byte auf dem Gerät halten: kein Konto, kein Server, funktioniert offline.",
      "Den Alltags-Loop aus Erfassen, Planen und Fokussieren auf Handy und Laptop gleichermassen schnell machen.",
    ],
    architectureDecisions: [
      "Local-first by Design: Alles lebt im localStorage unter einem zephyr_-Präfix, es gibt also kein Backend, das man angreifen oder abrechnen könnte.",
      "Singleton-Service-Klassen statt Redux. Jeder Schreibvorgang feuert ein zephyr:change-Event, das reaktive Hooks abonnieren, und das native storage-Event deckt die anderen offenen Tabs ab.",
      "React 19 und Vite (SWC) mit lazy geladenen Routen, sodass eine Seite erst lädt, wenn du sie öffnest.",
    ],
    implementationHighlights: [
      "Aufgaben mit Fälligkeit, Prioritäten, Tags und einem Quick-Add in natürlicher Sprache, sodass aus „mama freitag anrufen #familie“ eine echte Aufgabe wird.",
      "Ein Pomodoro-Timer mit Presets, Sitzungsprotokoll und Streak-Zähler.",
      "Eine Cmd/Ctrl+K-Befehlspalette, die jede Aufgabe über Titel, Beschreibung und Tag findet.",
      "Eine installierbare PWA mit optionalen Erinnerungen und vollem Export/Import. Kommt eine neue Version, fragt sie vor dem Neuladen, statt sich mitten in der Sitzung auszutauschen.",
    ],
    qualityAndSecurity: [
      "Ohne Server gibt es nichts zu leaken und keine AGB zu lesen.",
      "85 Vitest-Fälle über die Speicherschicht, den Quick-Add-Parser, die Aufgabenfilter, die Streak-Berechnung und die Timer-Presets.",
      "Helle, dunkle und System-Themes, angewendet bevor React rendert, damit die Seite nie kurz das falsche zeigt.",
    ],
    challengesAndSolutions: [
      {
        challenge: "Jede View synchron halten, ohne Datenbank und ohne globalen Store.",
        solution:
          "Die Services besitzen die Daten und feuern bei jedem Schreibvorgang ein zephyr:change-Event; Hooks abonnieren es und dazu das storage-Event des Browsers, sodass eine Änderung im einen Tab im nächsten auftaucht.",
      },
      {
        challenge: "Wissen, was gestrichen gehört: Vier Funktionsbereiche waren zu Ballast geworden.",
        solution:
          "Notizen, Journal und Kalender flogen raus, ihre Routen leiten weiter auf die Aufgabenliste. Geteilte Tailwind- und Radix-Primitiven und eine einzige Befehlspalette halten den Rest zusammen.",
      },
    ],
    hiringSignals: [
      "Ich habe eine Privacy-First-Idee komplett ausgeliefert und sie danach auf die zwei Screens zurückgeschnitten, die Leute wirklich geöffnet haben.",
      "Ich griff zu Singleton-Services und einem Event-Bus, weil die App kein Redux brauchte, und habe das in der README begründet.",
      "Eine vollständige React-, Vite- und Tailwind-PWA allein betreut, mit den Tests dazu.",
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
      { value: "85", label: "Tests" },
    ],
    impactHeading: "Wofür dieses Projekt gut ist",
    impactPoints: [
      "Ersetzt eine Handvoll eingeloggter Apps durch eine, die man installieren und komplett offline nutzen kann.",
      "Hält persönliche Daten auf dem Gerät, weil nie etwas hochgeladen wird.",
      "Eine echte Produktivitäts-App, hinter der kein Server, kein Konto und kein Abo steht.",
    ],
  },
  fr: {
    tagline: "Une liste de tâches et un minuteur de focus, tout à vous et tout hors ligne.",
    description:
      "Zephyr est une PWA de productivité local-first : une liste de tâches et un minuteur Pomodoro au même endroit. Pas de connexion, pas de backend, aucune donnée qui ne quitte jamais votre navigateur.",
    overview:
      "J'ai construit Zephyr parce que chaque app de productivité veut un compte, un abonnement et une copie de toute votre journée sur le serveur d'un autre. Alors j'ai écrit la mienne, en React, Vite, Tailwind et Radix, et j'ai mis chaque tâche et chaque session de focus dans le localStorage. Rien n'est envoyé, il n'y a aucun compte à créer, et ça marche même le Wi-Fi coupé. Elle a aussi porté des notes, un journal et un calendrier ; je les ai retirés, en laissant les anciennes routes rediriger, et j'ai gardé les deux outils utilisés chaque jour.",
    roleSummary: "Conçu, développé, déployé. Moi, seul.",
    problemStatement:
      "Je voulais un seul endroit pour les tâches et les sessions de focus, sans confier ma journée à un backend ni payer un loyer pour mes propres données. Chaque option trouvée faisait l'inverse.",
    objectives: [
      "Réunir une liste de tâches et un minuteur Pomodoro sous un même toit, sans connexion.",
      "Garder chaque octet sur l'appareil : pas de compte, pas de serveur, ça marche hors ligne.",
      "Rendre la boucle du quotidien (capturer, planifier, se concentrer) rapide aussi bien sur téléphone que sur portable.",
    ],
    architectureDecisions: [
      "Local-first par conception : tout vit dans le localStorage sous un préfixe zephyr_, il n'y a donc aucun backend à pirater ou à facturer.",
      "Des classes de service singleton plutôt que Redux. Chaque écriture émet un événement zephyr:change auquel des hooks réactifs s'abonnent, et l'événement storage natif couvre les autres onglets ouverts.",
      "React 19 et Vite (SWC) avec des routes chargées en lazy, pour qu'une page ne se charge qu'à son ouverture.",
    ],
    implementationHighlights: [
      "Des tâches avec échéances, priorités, tags et une saisie rapide en langage naturel, si bien que « appeler maman vendredi #famille » devient une vraie tâche.",
      "Un minuteur Pomodoro avec presets, journal de sessions et compteur de séries.",
      "Une palette de commandes Cmd/Ctrl+K qui retrouve chaque tâche par titre, description et tag.",
      "Une PWA installable avec rappels optionnels et export/import complet. Quand une nouvelle version arrive, elle demande avant de recharger plutôt que de se remplacer en pleine session.",
    ],
    qualityAndSecurity: [
      "Sans serveur, il n'y a rien à fuiter ni de conditions à lire.",
      "85 cas Vitest sur la couche de stockage, l'analyseur de saisie rapide, les filtres de tâches, le calcul des séries et les presets du minuteur.",
      "Thèmes clair, sombre et système, appliqués avant le rendu de React pour que la page ne montre jamais brièvement le mauvais.",
    ],
    challengesAndSolutions: [
      {
        challenge: "Garder chaque vue synchronisée sans base de données ni store global.",
        solution:
          "Les services possèdent les données et émettent un événement zephyr:change à chaque écriture ; les hooks s'y abonnent, ainsi qu'à l'événement storage du navigateur, si bien qu'une modification faite dans un onglet apparaît dans le suivant.",
      },
      {
        challenge: "Savoir quoi retirer : quatre domaines fonctionnels étaient devenus du fouillis.",
        solution:
          "Les notes, le journal et le calendrier sont sortis, leurs routes redirigent vers la liste de tâches. Des primitives Tailwind et Radix partagées et une seule palette de commandes tiennent le reste ensemble.",
      },
    ],
    hiringSignals: [
      "J'ai livré une idée privacy-first de bout en bout, puis je l'ai retaillée aux deux écrans que les gens ouvraient vraiment.",
      "J'ai choisi des services singleton et un bus d'événements parce que l'app n'avait pas besoin de Redux, et je l'ai justifié dans le README.",
      "Une PWA React, Vite et Tailwind complète, maintenue seul, avec les tests qui vont avec.",
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
      { value: "85", label: "tests" },
    ],
    impactHeading: "À quoi sert ce projet",
    impactPoints: [
      "Remplace une poignée d'apps avec connexion par une seule, installable et utilisable entièrement hors ligne.",
      "Garde les données personnelles sur l'appareil, puisque rien n'est jamais envoyé.",
      "Une vraie app de productivité, sans serveur, sans compte et sans abonnement derrière.",
    ],
  },
  zh: {
    tagline: "一份待办清单，一个专注计时器，全归你，也全离线。",
    description:
      "Zephyr 是一款本地优先的生产力 PWA：待办清单和番茄钟计时器集于一处。无需登录，没有后端，任何数据都不会离开你的浏览器。",
    overview:
      "我做 Zephyr，是因为每一款生产力应用都想要一个账号、一份订阅，外加把你一整天的安排复制到别人的服务器上。于是我用 React、Vite、Tailwind 和 Radix 写了自己的一款，把每一条任务和专注记录都放进 localStorage。什么都不上传，不用注册，断了 Wi-Fi 也照样能用。它也曾装着笔记、日志和日历；我把它们砍掉了，旧路由留着重定向，只留下每天真正用得上的两个工具。",
    roleSummary: "设计、开发、上线，全是我一个人。",
    problemStatement:
      "我想要一个地方装下任务和专注记录，既不必把日程交给后端，也不用为自己的数据交租。可我找到的每个方案做的都恰恰相反。",
    objectives: [
      "把待办清单和番茄钟计时器收进同一屋檐下，无需登录。",
      "把每个字节都留在设备上：没有账号、没有服务器、离线可用。",
      "让日常循环（捕获、规划、专注）在手机和笔记本上都同样快。",
    ],
    architectureDecisions: [
      "本地优先是设计前提：一切都存在带 zephyr_ 前缀的 localStorage 里，因此没有可被攻破、可被计费的后端。",
      "用单例服务类而不是 Redux。每次写入都派发一个 zephyr:change 事件，由响应式 hooks 订阅；跨标签页则交给浏览器原生的 storage 事件。",
      "React 19 加 Vite（SWC），路由懒加载，页面只在你打开时才加载。",
    ],
    implementationHighlights: [
      "任务带截止日期、优先级、标签和自然语言速记，所以「周五给妈妈打电话 #家人」会被解析成一条真正的任务。",
      "番茄钟带预设、会话记录和连续天数计数。",
      "一个 Cmd/Ctrl+K 命令面板，可按标题、描述和标签找到任何任务。",
      "可安装的 PWA，带可选提醒和完整的导出导入。新版本上线时它会先问一句再刷新，而不是在你用着的时候把自己换掉。",
    ],
    qualityAndSecurity: [
      "没有服务器，就没有什么可泄露，也没有条款要读。",
      "85 个 Vitest 用例，覆盖存储层、速记解析、任务筛选、连续天数的计算和计时器预设。",
      "明色、暗色和跟随系统三种主题，在 React 渲染之前就应用好，页面不会先闪一下错的那个。",
    ],
    challengesAndSolutions: [
      {
        challenge: "在没有数据库、没有全局状态库的情况下，让每个视图保持同步。",
        solution: "数据由服务持有，每次写入都派发 zephyr:change 事件；hooks 订阅它，也订阅浏览器自带的 storage 事件，所以在一个标签页里的改动，在另一个里也会出现。",
      },
      {
        challenge: "知道该砍什么：四个功能板块已经变成了负担。",
        solution: "笔记、日志和日历被移除，它们的路由留着重定向到任务列表。共享的 Tailwind 与 Radix 基元，加上一个统一的命令面板，把剩下的部分兜住。",
      },
    ],
    hiringSignals: [
      "我把一个隐私优先的想法完整做完，然后把它裁到只剩下人们真的会打开的那两个界面。",
      "我选了单例服务加事件总线，因为这个应用不需要 Redux，我也在 README 里写清了理由。",
      "一整套 React、Vite、Tailwind 的 PWA 由我一个人维护，测试也在里面。",
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
      { value: "85", label: "测试" },
    ],
    impactHeading: "这个项目有什么用",
    impactPoints: [
      "用一款可安装、可完全离线使用的应用，取代几款需要登录的应用。",
      "把个人数据留在设备上，因为什么都不会上传。",
      "一款真正的生产力应用，背后没有服务器、没有账号、也没有订阅。",
    ],
  },
};
