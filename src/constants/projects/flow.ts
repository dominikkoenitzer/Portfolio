import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const flow: Record<Language, LocalizedContent> = {
  en: {
    tagline: "Clicks faster than you can, and never needs a coffee break.",
    description:
      "A native Windows desktop app in C++17 that records mouse and keyboard macros, replays them frame-accurately, and runs a high-speed auto-clicker. One exe, no runtime, no lag.",
    overview:
      "I built FLOW because every auto-clicker online was either spyware or a 2009 forum download. So I wrote my own in C++17, straight against the Win32 API and GDI+. It captures input with millisecond timing, replays it at any speed or loop count, and ships a dedicated high-priority auto-clicker. A busy-wait QueryPerformanceCounter timer holds it under 10 ms, and the whole thing is one statically linked FLOW.exe. Nothing to install. It just works, fast.",
    roleSummary: "Designed it, built it, shipped it. Just me.",
    problemStatement:
      "Automation tools come in two flavors: bloated cross-platform Electron apps, or scripts whose timing quietly drifts until your macro misses. I wanted neither. FLOW is a lean native binary for repeatable, frame-accurate input on Windows.",
    objectives: [
      "Record mouse, click, and keystroke events with millisecond-accurate timing.",
      "Replay macros frame-accurately, at any speed, for a finite or infinite number of loops.",
      "Run a standalone high-speed auto-clicker at a configurable interval, separate from any recording.",
    ],
    architectureDecisions: [
      "Kept the engine (recording, playback, auto-clicker, timing) completely separate from the Win32 GUI, so the core logic doesn't depend on a single button.",
      "Used a busy-wait QueryPerformanceCounter timer for sub-10 ms precision. Sleep was never going to cut it.",
      "Hand-drew the entire UI in Win32 + GDI+ with no framework, then statically linked it into one self-contained exe.",
    ],
    implementationHighlights: [
      "Global low-level input hooks to capture and inject mouse and keyboard events.",
      "Multi-monitor-aware playback using absolute, virtual-desktop-normalized coordinates, so clicks land where they should on any display.",
      "Optional Gaussian jitter on delays, so the playback doesn't tick like a metronome when you'd rather it didn't.",
    ],
    qualityAndSecurity: [
      "A statically linked binary with no external runtime, so timing and behavior stay identical from one machine to the next.",
      "Frame-accurate precision from a high-resolution performance counter, not the coarse OS sleeps everything else settles for.",
      "Every release ships with SHA-256 checksums, and CI verifies the binary is self-contained before it goes out.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Sleep-based timing was far too coarse for frame-accurate replay, so macros drifted out of sync.",
        solution:
          "Wrote a busy-wait QueryPerformanceCounter timer that holds precision under 10 ms.",
      },
      {
        challenge:
          "Mouse playback drifted on multi-monitor setups with mismatched resolutions.",
        solution:
          "Replayed every move as an absolute, virtual-desktop-normalized coordinate, so clicks land correctly across all displays.",
      },
    ],
    hiringSignals: [
      "I'm comfortable down at the metal: native C++17, Win32, GDI+, input hooks, high-resolution timing.",
      "I own the whole thing end to end: engine, hand-drawn UI, build scripts, automated releases.",
      "I optimize for real performance: deterministic, frame-accurate timing instead of close-enough.",
    ],
    nextIterations: [
      "A conditional/branching macro step type for smarter automation flows.",
      "Macro editing and trimming inside the UI, so a small mistake doesn't mean re-recording the whole thing.",
      "A code-signing certificate to stop SmartScreen from acting like FLOW is a stranger on first launch.",
    ],
    tags: ["C++", "Win32", "GDI+", "Automation", "Low-latency"],
    impactHeading: "What This Project Demonstrates",
    impactPoints: [
      "Turns repetitive mouse and keyboard work into something you set up once and forget.",
      "Proves a fast, polished desktop tool can ship as a single native exe with zero dependencies.",
      "Hits timing accuracy that scripting tools and Electron apps simply can't reach.",
    ],
    stats: [
      { value: "9 KB", label: "binary size" },
      { value: "0", label: "dependencies" },
      { value: "<10 ms", label: "input latency" },
      { value: "0", label: "telemetry" },
    ],
  },
  de: {
    tagline: "Klickt schneller als du, und braucht nie eine Kaffeepause.",
    description:
      "Eine native Windows-Desktop-App in C++17, die Maus- und Tastatur-Makros aufnimmt, sie frame-genau abspielt und einen Hochgeschwindigkeits-Auto-Clicker betreibt. Eine Exe, keine Laufzeitumgebung, keine Verzögerung.",
    overview:
      "Ich habe FLOW gebaut, weil jeder Auto-Clicker im Netz entweder Spyware oder ein Forum-Download von 2009 war. Also habe ich meinen eigenen geschrieben, in C++17, direkt gegen die Win32-API und GDI+. Er erfasst Eingaben mit Millisekunden-Timing, spielt sie mit beliebiger Geschwindigkeit und Schleifenanzahl ab und bringt einen dedizierten Auto-Clicker mit hoher Priorität mit. Ein Busy-Wait-Timer auf Basis von QueryPerformanceCounter hält ihn unter 10 ms, und das Ganze ist eine einzige statisch gelinkte FLOW.exe. Nichts zu installieren. Es läuft einfach, und zwar schnell.",
    roleSummary: "Entworfen, gebaut, ausgeliefert. Nur ich.",
    problemStatement:
      "Automatisierungstools gibt es in zwei Geschmacksrichtungen: aufgeblähte plattformübergreifende Electron-Apps oder Skripte, deren Timing leise driftet, bis dein Makro daneben klickt. Ich wollte keins von beidem. FLOW ist ein schlankes natives Binary für wiederholbare, frame-genaue Eingaben unter Windows.",
    objectives: [
      "Maus-, Klick- und Tastenereignisse mit millisekunden-genauem Timing aufnehmen.",
      "Makros frame-genau abspielen, mit beliebiger Geschwindigkeit und endlichen oder unendlichen Schleifen.",
      "Einen eigenständigen Hochgeschwindigkeits-Auto-Clicker mit konfigurierbarem Intervall betreiben, getrennt von jeder Aufnahme.",
    ],
    architectureDecisions: [
      "Die Engine (Aufnahme, Wiedergabe, Auto-Clicker, Timing) vollständig von der Win32-GUI getrennt, damit die Kernlogik nicht an einem einzigen Button hängt.",
      "Einen Busy-Wait-Timer auf Basis von QueryPerformanceCounter für Präzision unter 10 ms genutzt. Sleep hätte das nie geschafft.",
      "Die gesamte UI von Hand in Win32 + GDI+ gezeichnet, ohne Framework, und dann statisch in eine einzige eigenständige Exe gelinkt.",
    ],
    implementationHighlights: [
      "Globale Low-Level-Input-Hooks zum Erfassen und Einspeisen von Maus- und Tastaturereignissen.",
      "Multi-Monitor-fähige Wiedergabe mit absoluten, auf den virtuellen Desktop normalisierten Koordinaten, sodass Klicks auf jedem Display dort landen, wo sie sollen.",
      "Optionaler gaußscher Jitter auf Verzögerungen, damit die Wiedergabe nicht wie ein Metronom tickt, wenn man das gerade nicht will.",
    ],
    qualityAndSecurity: [
      "Ein statisch gelinktes Binary ohne externe Laufzeitumgebung, sodass Timing und Verhalten von einer Maschine zur nächsten identisch bleiben.",
      "Frame-genaue Präzision durch einen hochauflösenden Performance-Counter, nicht die groben Betriebssystem-Sleeps, mit denen sich alle anderen zufriedengeben.",
      "Jedes Release kommt mit SHA-256-Prüfsummen, und die CI verifiziert vor der Veröffentlichung, dass das Binary eigenständig ist.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Sleep-basiertes Timing war für frame-genaue Wiedergabe viel zu grob, also driftete das Makro aus dem Takt.",
        solution:
          "Einen Busy-Wait-Timer auf Basis von QueryPerformanceCounter geschrieben, der die Präzision unter 10 ms hält.",
      },
      {
        challenge:
          "Die Maus-Wiedergabe driftete bei Multi-Monitor-Setups mit unterschiedlichen Auflösungen.",
        solution:
          "Jede Bewegung als absolute, auf den virtuellen Desktop normalisierte Koordinate abgespielt, damit Klicks über alle Displays hinweg korrekt landen.",
      },
    ],
    hiringSignals: [
      "Ich bin hardwarenah zu Hause: natives C++17, Win32, GDI+, Input-Hooks, hochauflösendes Timing.",
      "Ich verantworte das Ganze von vorne bis hinten: Engine, von Hand gezeichnete UI, Build-Skripte, automatisierte Releases.",
      "Ich optimiere auf echte Performance: deterministisches, frame-genaues Timing statt 'reicht schon'.",
    ],
    nextIterations: [
      "Ein bedingter/verzweigender Makro-Schritttyp für intelligentere Automatisierungsabläufe.",
      "Makro-Bearbeitung und -Trimmen direkt in der UI, damit ein kleiner Fehler nicht das komplette Neuaufnehmen bedeutet.",
      "Ein Code-Signing-Zertifikat, damit SmartScreen FLOW beim ersten Start nicht wie einen Fremden behandelt.",
    ],
    tags: ["C++", "Win32", "GDI+", "Automatisierung", "Low-latency"],
    impactHeading: "Was dieses Projekt zeigt",
    impactPoints: [
      "Macht aus wiederholender Maus- und Tastaturarbeit etwas, das man einmal einrichtet und dann vergisst.",
      "Beweist, dass ein schnelles, ausgereiftes Desktop-Tool als einzelne native Exe ohne Abhängigkeiten ausgeliefert werden kann.",
      "Erreicht eine Timing-Genauigkeit, die Skript-Tools und Electron-Apps schlicht nicht hinbekommen.",
    ],
    stats: [
      { value: "9 KB", label: "Binärgröße" },
      { value: "0", label: "Abhängigkeiten" },
      { value: "<10 ms", label: "Eingabelatenz" },
      { value: "0", label: "Telemetrie" },
    ],
  },
  fr: {
    tagline: "Clique plus vite que toi, et ne fait jamais de pause café.",
    description:
      "Une application de bureau Windows native en C++17 qui enregistre des macros souris et clavier, les rejoue au frame près et exécute un auto-clicker haute vitesse. Un seul exe, pas de runtime, pas de latence.",
    overview:
      "J'ai construit FLOW parce que chaque auto-clicker en ligne était soit un spyware, soit un téléchargement de forum datant de 2009. Alors j'ai écrit le mien, en C++17, directement contre l'API Win32 et GDI+. Il capture les entrées à la milliseconde près, les rejoue à n'importe quelle vitesse et nombre de boucles, et embarque un auto-clicker dédié à haute priorité. Un timer busy-wait basé sur QueryPerformanceCounter le maintient sous les 10 ms, et l'ensemble tient dans un unique FLOW.exe lié statiquement. Rien à installer. Ça marche, et c'est rapide.",
    roleSummary: "Conçu, construit, livré. Juste moi.",
    problemStatement:
      "Les outils d'automatisation se déclinent en deux saveurs : des applications Electron multiplateformes lourdes, ou des scripts dont le timing dérive doucement jusqu'à ce que la macro rate sa cible. Je n'en voulais aucun des deux. FLOW est un binaire natif et léger pour des entrées reproductibles et précises au frame sous Windows.",
    objectives: [
      "Enregistrer les événements de souris, de clic et de frappe avec un timing précis à la milliseconde.",
      "Rejouer les macros au frame près, à n'importe quelle vitesse, en boucles finies ou infinies.",
      "Exécuter un auto-clicker haute vitesse autonome à un intervalle configurable, distinct de tout enregistrement.",
    ],
    architectureDecisions: [
      "Le moteur (enregistrement, lecture, auto-clicker, timing) est complètement séparé de la GUI Win32, pour que la logique cœur ne dépende pas d'un seul bouton.",
      "Utilisé un timer busy-wait basé sur QueryPerformanceCounter pour une précision sous les 10 ms. Sleep n'aurait jamais suffi.",
      "Dessiné toute l'UI à la main en Win32 + GDI+, sans framework, puis liée statiquement en un seul exe autonome.",
    ],
    implementationHighlights: [
      "Hooks d'entrée globaux de bas niveau pour capturer et injecter les événements souris et clavier.",
      "Lecture compatible multi-écran en coordonnées absolues normalisées sur le bureau virtuel, pour que les clics atterrissent au bon endroit sur n'importe quel affichage.",
      "Jitter gaussien optionnel sur les délais, pour que la lecture ne tique pas comme un métronome quand on préfère l'éviter.",
    ],
    qualityAndSecurity: [
      "Un binaire lié statiquement sans runtime externe, pour que le timing et le comportement restent identiques d'une machine à l'autre.",
      "Précision au frame près grâce à un compteur de performance haute résolution, pas les pauses grossières de l'OS dont tout le monde se contente.",
      "Chaque release est livrée avec des sommes de contrôle SHA-256, et la CI vérifie que le binaire est autonome avant publication.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Le timing basé sur Sleep était bien trop grossier pour une lecture au frame près, donc la macro se désynchronisait.",
        solution:
          "Écrit un timer busy-wait basé sur QueryPerformanceCounter qui maintient la précision sous les 10 ms.",
      },
      {
        challenge:
          "La lecture de la souris dérivait sur les configurations multi-écran aux résolutions différentes.",
        solution:
          "Rejoué chaque mouvement en coordonnées absolues normalisées sur le bureau virtuel, pour que les clics atterrissent correctement sur tous les écrans.",
      },
    ],
    hiringSignals: [
      "Je suis à l'aise tout en bas, près du métal : C++17 natif, Win32, GDI+, hooks d'entrée, timing haute résolution.",
      "Je porte tout de bout en bout : moteur, UI dessinée à la main, scripts de build, releases automatisées.",
      "J'optimise pour la vraie performance : un timing déterministe et précis au frame plutôt qu'à peu près correct.",
    ],
    nextIterations: [
      "Un type d'étape de macro conditionnel/à branchement pour des flux d'automatisation plus intelligents.",
      "Édition et rognage des macros dans l'UI, pour qu'une petite erreur ne signifie pas tout réenregistrer.",
      "Un certificat de signature de code pour que SmartScreen arrête de traiter FLOW en inconnu au premier lancement.",
    ],
    tags: ["C++", "Win32", "GDI+", "Automatisation", "Low-latency"],
    impactHeading: "Ce que ce projet démontre",
    impactPoints: [
      "Transforme le travail répétitif de souris et de clavier en quelque chose qu'on configure une fois puis qu'on oublie.",
      "Prouve qu'un outil de bureau rapide et soigné peut se livrer en un seul exe natif, sans aucune dépendance.",
      "Atteint une précision de timing que les outils de script et les applis Electron ne peuvent tout simplement pas viser.",
    ],
    stats: [
      { value: "9 KB", label: "taille du binaire" },
      { value: "0", label: "dépendances" },
      { value: "<10 ms", label: "latence d'entrée" },
      { value: "0", label: "télémétrie" },
    ],
  },
  zh: {
    tagline: "点得比你快，而且从不需要喝咖啡休息。",
    description:
      "一款用 C++17 编写的原生 Windows 桌面应用，录制鼠标和键盘宏、逐帧精确回放，并运行高速连点器。一个 exe，无运行时，无延迟。",
    overview:
      "我做 FLOW，是因为网上的每个连点器要么是间谍软件，要么是 2009 年的论坛下载。所以我自己写了一个，用 C++17，直接面向 Win32 API 与 GDI+。它以毫秒级时序捕获输入，以任意速度和循环次数回放，并内置一个高优先级的专用连点器。基于 QueryPerformanceCounter 的忙等待计时器把它控制在 10 毫秒以内，整个程序就是一个静态链接的 FLOW.exe。无需安装。它就是能跑，而且快。",
    roleSummary: "我设计、我构建、我发布。就我一个人。",
    problemStatement:
      "自动化工具只有两种口味：臃肿的跨平台 Electron 应用，或是时序悄悄漂移、直到宏点偏的脚本。两种我都不想要。FLOW 是一个精简的原生二进制文件，专为 Windows 上可重复、逐帧精确的输入而生。",
    objectives: [
      "以毫秒级精确时序录制鼠标、点击与按键事件。",
      "逐帧精确地回放宏，任意速度，有限或无限循环。",
      "运行一个独立的高速连点器，间隔可配置，与任何录制相互独立。",
    ],
    architectureDecisions: [
      "把引擎（录制、回放、连点器、计时）与 Win32 GUI 彻底分离，让核心逻辑不依赖于某一个按钮。",
      "使用基于 QueryPerformanceCounter 的忙等待计时器实现低于 10 毫秒的精度。Sleep 永远做不到这一点。",
      "整个 UI 都用 Win32 + GDI+ 手工绘制，无框架，再静态链接为单个自包含的 exe。",
    ],
    implementationHighlights: [
      "全局低级输入钩子，用于捕获并注入鼠标与键盘事件。",
      "支持多显示器的回放，采用绝对的、按虚拟桌面归一化的坐标，让点击在任何显示器上都落在该落的位置。",
      "对延迟可选地施加高斯抖动，这样不想让回放像节拍器一样规律时，它就不会。",
    ],
    qualityAndSecurity: [
      "静态链接的二进制文件，无外部运行时，因此时序与行为在不同机器之间保持一致。",
      "通过高分辨率的性能计数器实现逐帧精度，而不是其他人将就用的粗糙操作系统休眠。",
      "每个版本都附带 SHA-256 校验和，CI 在发布前会验证二进制文件是自包含的。",
    ],
    challengesAndSolutions: [
      {
        challenge: "基于 Sleep 的时序对于逐帧精确回放过于粗糙，于是宏会失去同步。",
        solution: "编写了基于 QueryPerformanceCounter 的忙等待计时器，把精度稳定保持在 10 毫秒以内。",
      },
      {
        challenge: "在分辨率不同的多显示器环境下，鼠标回放会发生漂移。",
        solution: "将每次移动都以绝对的、按虚拟桌面归一化的坐标回放，使点击在所有显示器上都能正确落点。",
      },
    ],
    hiringSignals: [
      "我在底层很自在：原生 C++17、Win32、GDI+、输入钩子、高分辨率计时。",
      "我从头到尾把控全局：引擎、手绘 UI、构建脚本、自动化发布。",
      "我为真正的性能而优化：确定性的逐帧精确时序，而非差不多就行。",
    ],
    nextIterations: [
      "用于更智能自动化流程的条件/分支宏步骤类型。",
      "在 UI 中直接编辑与裁剪宏，让一个小失误不至于要重录整段。",
      "申请代码签名证书，让 SmartScreen 别在首次启动时把 FLOW 当作陌生人。",
    ],
    tags: ["C++", "Win32", "GDI+", "自动化", "Low-latency"],
    impactHeading: "本项目展示了什么",
    impactPoints: [
      "把重复的鼠标与键盘操作变成设置一次就可以忘掉的事。",
      "证明一个快速、精致的桌面工具可以作为单个零依赖的原生 exe 交付。",
      "达到脚本工具和 Electron 应用根本无法企及的时序精度。",
    ],
    stats: [
      { value: "9 KB", label: "二进制大小" },
      { value: "0", label: "依赖项" },
      { value: "<10 ms", label: "输入延迟" },
      { value: "0", label: "遥测" },
    ],
  },
};
