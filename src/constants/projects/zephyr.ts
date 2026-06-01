import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const zephyr: Record<Language, LocalizedContent> = {
  en: {
    tagline:
      "A focus-first productivity app for capturing tasks, planning your day, and tracking progress — built to stay fast as it grows.",
    description:
      "Zephyr is a productivity web app for managing tasks, planning a schedule, and tracking progress, with a focus mode that keeps the core flow distraction-free.",
    overview:
      "Zephyr is a solo project I designed and built end to end in React with Vite, Tailwind CSS, and Radix UI, deployed on Vercel. Across 200+ commits it grew from a simple task list into a focus-oriented productivity tool — tasks, scheduling, and progress tracking — while staying fast and uncluttered.",
    roleSummary:
      "Sole designer and developer: product direction, UI/UX, React component architecture, state, and deployment.",
    problemStatement:
      "Most task apps get noisier as features pile up. I wanted Zephyr's day-to-day loop — capture a task, plan it, check progress — to stay fast and readable even as capability grows.",
    objectives: [
      "Make task capture, scheduling, and progress tracking feel like one continuous flow.",
      "Keep the interface fast and low-friction on both desktop and mobile.",
      "Build a reusable React component system so features can be added without bloat.",
    ],
    architectureDecisions: [
      "React 18 + Vite (SWC) for a fast, component-driven front end.",
      "Tailwind CSS with Radix UI primitives for an accessible, consistent design system.",
      "Composable, single-responsibility components split across task, schedule, and progress views.",
    ],
    implementationHighlights: [
      "A focus surface that foregrounds the current task and the day's plan.",
      "Reusable list and status interactions for fast task operations.",
      "Subtle motion cues that guide attention without distracting from content.",
    ],
    qualityAndSecurity: [
      "Responsive across mobile and desktop breakpoints.",
      "Defensive handling of empty and edge states so flows never dead-end.",
      "Sustained over 200+ commits — iterated and maintained, not a throwaway demo.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Keeping the interface calm as more task utilities were added.",
        solution:
          "A layered hierarchy: primary actions stay persistent, advanced ones are progressively disclosed.",
      },
      {
        challenge:
          "Staying visually consistent while iterating quickly on new sections.",
        solution:
          "Standardized Tailwind card, spacing, and typography primitives for system-level coherence.",
      },
    ],
    hiringSignals: [
      "Shows product judgment, not just component implementation.",
      "Demonstrates sustained ownership — 200+ commits from concept to deployed product.",
      "Comfortable owning a full React + Vite + Tailwind front end end to end.",
    ],
    nextIterations: [
      "Persistence and sync so plans carry across devices.",
      "Keyboard-first quick capture for power users.",
      "Automated interaction tests for the core task flow.",
    ],
    tags: ["React", "Vite", "Tailwind CSS", "Vercel"],
    impactHeading: "How This Project Creates Impact",
    impactPoints: [
      "Keeps the daily plan-and-do loop fast by reducing interaction overhead.",
      "Helps people stay focused through clear hierarchy and a distraction-free core flow.",
      "Stays maintainable and extensible thanks to a reusable component system.",
    ],
  },
  de: {
    tagline:
      "Eine fokus-orientierte Produktivitäts-App zum Erfassen von Aufgaben, Planen des Tages und Verfolgen des Fortschritts — gebaut, um schnell zu bleiben, während sie wächst.",
    description:
      "Zephyr ist eine Produktivitäts-Web-App zum Verwalten von Aufgaben, Planen eines Zeitplans und Verfolgen des Fortschritts, mit einem Fokus-Modus, der den Kern-Flow ablenkungsfrei hält.",
    overview:
      "Zephyr ist ein Solo-Projekt, das ich von Anfang bis Ende in React mit Vite, Tailwind CSS und Radix UI entworfen und gebaut habe, deployed auf Vercel. Über 200+ Commits wuchs es von einer einfachen Aufgabenliste zu einem fokus-orientierten Produktivitäts-Tool — Aufgaben, Planung und Fortschritts-Tracking — und blieb dabei schnell und aufgeräumt.",
    roleSummary:
      "Alleiniger Designer und Entwickler: Produktrichtung, UI/UX, React-Komponenten-Architektur, State und Deployment.",
    problemStatement:
      "Die meisten Aufgaben-Apps werden lauter, je mehr Funktionen sich anhäufen. Ich wollte, dass Zephyrs täglicher Ablauf — Aufgabe erfassen, planen, Fortschritt prüfen — schnell und lesbar bleibt, auch wenn die Funktionalität wächst.",
    objectives: [
      "Aufgabenerfassung, Planung und Fortschritts-Tracking als einen durchgängigen Flow erlebbar machen.",
      "Das Interface auf Desktop und Mobile schnell und reibungsarm halten.",
      "Ein wiederverwendbares React-Komponenten-System bauen, damit Features ohne Ballast ergänzt werden können.",
    ],
    architectureDecisions: [
      "React 18 + Vite (SWC) für ein schnelles, komponenten-getriebenes Frontend.",
      "Tailwind CSS mit Radix-UI-Primitiven für ein barrierefreies, konsistentes Design-System.",
      "Komponierbare Komponenten mit klarer Einzelverantwortung, aufgeteilt auf Aufgaben-, Plan- und Fortschritts-Ansichten.",
    ],
    implementationHighlights: [
      "Eine Fokus-Oberfläche, die die aktuelle Aufgabe und den Tagesplan in den Vordergrund stellt.",
      "Wiederverwendbare Listen- und Status-Interaktionen für schnelle Aufgaben-Operationen.",
      "Dezente Bewegungs-Cues, die die Aufmerksamkeit lenken, ohne vom Inhalt abzulenken.",
    ],
    qualityAndSecurity: [
      "Responsiv über Mobile- und Desktop-Breakpoints.",
      "Defensives Handling von leeren und Edge-States, damit Abläufe nie in eine Sackgasse laufen.",
      "Über 200+ Commits gepflegt — iteriert und gewartet, kein Wegwerf-Demo.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Das Interface ruhig halten, während mehr Aufgaben-Funktionen hinzukamen.",
        solution:
          "Eine geschichtete Hierarchie: Primäraktionen bleiben sichtbar, fortgeschrittene werden progressiv enthüllt.",
      },
      {
        challenge:
          "Visuell konsistent bleiben, während neue Bereiche schnell iteriert wurden.",
        solution:
          "Standardisierte Tailwind-Karten-, Abstands- und Typografie-Primitiven für system-weite Kohärenz.",
      },
    ],
    hiringSignals: [
      "Zeigt Produktverständnis, nicht nur Komponenten-Implementierung.",
      "Beweist nachhaltige Ownership — 200+ Commits vom Konzept bis zum deployten Produkt.",
      "Souverän im Verantworten eines vollständigen React + Vite + Tailwind Frontends, Ende zu Ende.",
    ],
    nextIterations: [
      "Persistenz und Sync, damit Pläne geräteübergreifend erhalten bleiben.",
      "Tastatur-First-Schnellerfassung für Power-User.",
      "Automatisierte Interaktionstests für den zentralen Aufgaben-Flow.",
    ],
    tags: ["React", "Vite", "Tailwind CSS", "Vercel"],
    impactHeading: "Wie dieses Projekt Wirkung erzeugt",
    impactPoints: [
      "Hält die tägliche Plan-und-Erledige-Schleife schnell, indem Interaktions-Overhead reduziert wird.",
      "Hilft Menschen, fokussiert zu bleiben — durch klare Hierarchie und einen ablenkungsfreien Kern-Flow.",
      "Bleibt wartbar und erweiterbar dank eines wiederverwendbaren Komponenten-Systems.",
    ],
  },
  fr: {
    tagline:
      "Une app de productivité axée focus pour capturer des tâches, planifier sa journée et suivre ses progrès — conçue pour rester rapide à mesure qu'elle grandit.",
    description:
      "Zephyr est une app web de productivité pour gérer des tâches, planifier un emploi du temps et suivre les progrès, avec un mode focus qui garde le flux principal sans distraction.",
    overview:
      "Zephyr est un projet solo que j'ai conçu et développé de bout en bout en React avec Vite, Tailwind CSS et Radix UI, déployé sur Vercel. Au fil de 200+ commits, il est passé d'une simple liste de tâches à un outil de productivité axé focus — tâches, planification et suivi de progression — tout en restant rapide et épuré.",
    roleSummary:
      "Seul concepteur et développeur : direction produit, UI/UX, architecture de composants React, état et déploiement.",
    problemStatement:
      "La plupart des apps de tâches deviennent bruyantes à mesure que les fonctionnalités s'accumulent. Je voulais que la boucle quotidienne de Zephyr — capturer une tâche, la planifier, vérifier les progrès — reste rapide et lisible même quand les capacités grandissent.",
    objectives: [
      "Faire de la capture de tâches, de la planification et du suivi de progression un seul flux continu.",
      "Garder l'interface rapide et fluide sur desktop comme sur mobile.",
      "Construire un système de composants React réutilisable pour ajouter des fonctionnalités sans alourdir.",
    ],
    architectureDecisions: [
      "React 18 + Vite (SWC) pour un frontend rapide et orienté composants.",
      "Tailwind CSS avec les primitives Radix UI pour un design system accessible et cohérent.",
      "Des composants composables à responsabilité unique, répartis entre les vues tâches, planning et progression.",
    ],
    implementationHighlights: [
      "Une surface focus qui met en avant la tâche en cours et le plan du jour.",
      "Des interactions de liste et de statut réutilisables pour des opérations de tâches rapides.",
      "Des indices de mouvement subtils qui guident l'attention sans distraire du contenu.",
    ],
    qualityAndSecurity: [
      "Responsive sur les breakpoints mobile et desktop.",
      "Gestion défensive des états vides et limites pour que les flux ne mènent jamais à une impasse.",
      "Maintenu sur 200+ commits — itéré et entretenu, pas une démo jetable.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Garder l'interface calme à mesure que des utilitaires de tâches s'ajoutaient.",
        solution:
          "Une hiérarchie en couches : les actions primaires restent persistantes, les avancées sont dévoilées progressivement.",
      },
      {
        challenge:
          "Rester visuellement cohérent tout en itérant vite sur de nouvelles sections.",
        solution:
          "Primitives Tailwind de cartes, d'espacement et de typographie standardisées pour une cohérence au niveau système.",
      },
    ],
    hiringSignals: [
      "Montre du jugement produit, pas seulement de l'implémentation de composants.",
      "Démontre une ownership durable — 200+ commits du concept au produit déployé.",
      "À l'aise pour porter un frontend React + Vite + Tailwind complet, de bout en bout.",
    ],
    nextIterations: [
      "Persistance et synchronisation pour que les plans suivent d'un appareil à l'autre.",
      "Capture rapide au clavier pour les power-users.",
      "Tests d'interaction automatisés pour le flux de tâches central.",
    ],
    tags: ["React", "Vite", "Tailwind CSS", "Vercel"],
    impactHeading: "Comment ce projet crée de l'impact",
    impactPoints: [
      "Garde la boucle quotidienne planifier-et-faire rapide en réduisant la charge d'interaction.",
      "Aide à rester concentré grâce à une hiérarchie claire et un flux central sans distraction.",
      "Reste maintenable et extensible grâce à un système de composants réutilisable.",
    ],
  },
  zh: {
    tagline:
      "一款以专注为核心的生产力应用，用于捕获任务、规划一天并追踪进度——并在不断成长时依然保持快速。",
    description:
      "Zephyr 是一款生产力 Web 应用，用于管理任务、规划日程与追踪进度，并通过专注模式让核心流程保持无干扰。",
    overview:
      "Zephyr 是我独立从头到尾设计与开发的项目，使用 React、Vite、Tailwind CSS 与 Radix UI，部署在 Vercel 上。在 200+ 次提交中，它从一个简单的任务清单成长为以专注为核心的生产力工具——任务、日程与进度追踪——同时保持快速与简洁。",
    roleSummary:
      "唯一的设计者与开发者：产品方向、UI/UX、React 组件架构、状态管理与部署。",
    problemStatement:
      "大多数任务应用会随着功能堆叠而变得嘈杂。我希望 Zephyr 的日常循环——捕获任务、规划、查看进度——即使功能增长也依然快速、易读。",
    objectives: [
      "让任务捕获、日程规划与进度追踪成为一个连贯的流程。",
      "在桌面与移动端都保持界面快速、低摩擦。",
      "构建可复用的 React 组件体系，让功能可以在不臃肿的前提下扩展。",
    ],
    architectureDecisions: [
      "React 18 + Vite（SWC），打造快速、以组件驱动的前端。",
      "Tailwind CSS 搭配 Radix UI 基元，构建无障碍、一致的设计系统。",
      "职责单一、可组合的组件，分布在任务、日程与进度视图中。",
    ],
    implementationHighlights: [
      "专注界面，将当前任务与当天计划置于前台。",
      "可复用的列表与状态交互，支持快速的任务操作。",
      "细腻的动效线索，引导注意力而不干扰内容。",
    ],
    qualityAndSecurity: [
      "在移动与桌面断点上保持响应式。",
      "对空态与边界态进行防御式处理，让流程不会走入死胡同。",
      "历经 200+ 次提交的持续维护——经过迭代与维护，而非一次性 demo。",
    ],
    challengesAndSolutions: [
      {
        challenge: "在不断加入任务功能时，保持界面的平静。",
        solution:
          "采用分层结构：主操作常驻可见，高级操作以渐进披露的方式呈现。",
      },
      {
        challenge: "在快速迭代新模块时保持视觉一致性。",
        solution: "标准化 Tailwind 的卡片、间距与排版基元，保持系统级一致性。",
      },
    ],
    hiringSignals: [
      "体现产品判断力，而不仅是组件实现。",
      "展示持续的主导能力——从概念到上线产品的 200+ 次提交。",
      "能够端到端地独立负责完整的 React + Vite + Tailwind 前端。",
    ],
    nextIterations: [
      "加入持久化与同步，让计划在多设备间保留。",
      "为高级用户提供键盘优先的快速捕获。",
      "为核心任务流程加入自动化交互测试。",
    ],
    tags: ["React", "Vite", "Tailwind CSS", "Vercel"],
    impactHeading: "本项目如何创造价值",
    impactPoints: [
      "通过减少交互负担，让每天的“规划—执行”循环保持快速。",
      "通过清晰的层次与无干扰的核心流程，帮助人们保持专注。",
      "凭借可复用的组件体系，保持可维护与可扩展。",
    ],
  },
};
