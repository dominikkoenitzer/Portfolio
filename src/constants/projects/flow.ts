import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const flow: Record<Language, LocalizedContent> = {
  en: {
    tagline: "Ultra-low-latency input automation for Windows, built in C++.",
    description:
      "Flow is a Windows automation tool for recording and replaying user input with minimal delay — frame-accurate macro playback and rapid auto-click execution, built in C++ for performance-critical workflows.",
    overview:
      "Flow captures keyboard and mouse input and replays it with frame-accurate timing, so recorded macros run exactly as performed. Written in C++ for the Windows platform, it focuses on ultra-low-latency execution — minimizing the gap between intent and action for repetitive tasks, testing, and high-speed auto-clicking.",
    roleSummary:
      "Systems engineer building a performance-critical native Windows automation tool in C++ from the ground up.",
    problemStatement:
      "Browser- and scripting-based automation tools add latency that breaks timing-sensitive workflows. Flow runs natively on Windows in C++, recording and replaying input with frame-accurate precision and minimal overhead.",
    objectives: [
      "Record keyboard and mouse input with precise, frame-accurate timing for faithful playback.",
      "Deliver ultra-low-latency macro execution that keeps overhead off the critical path.",
      "Provide rapid, configurable auto-click execution for high-speed repetitive tasks.",
    ],
    architectureDecisions: [
      "Native C++ implementation targeting the Windows input stack for minimal execution overhead.",
      "Timing model that preserves the original cadence of recorded events for frame-accurate playback.",
      "PowerShell tooling around the native core for setup and build automation.",
    ],
    implementationHighlights: [
      "Built a macro recorder that captures input events with high-resolution timing.",
      "Implemented frame-accurate playback that replays sequences exactly as recorded.",
      "Delivered a rapid auto-click engine tuned for ultra-low-latency execution.",
    ],
    qualityAndSecurity: [
      "Deterministic playback timing validated against the recorded event stream.",
      "Bounded input handling to keep automation predictable and avoid runaway execution.",
      "Native Windows integration kept self-contained, with no background network dependencies.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Replaying recorded input with timing accurate enough to match the original performance.",
        solution:
          "Captured high-resolution timestamps alongside each event and reconstructed the original cadence on playback for frame-accurate results.",
      },
      {
        challenge:
          "Keeping execution latency low enough for high-speed auto-clicking without dropping events.",
        solution:
          "Kept the hot path in native C++ with minimal allocation and overhead, so input dispatch stays tight under rapid repetition.",
      },
    ],
    hiringSignals: [
      "Demonstrates comfort with native C++ and the Windows platform, beyond the web stack.",
      "Shows a focus on performance, latency, and precise timing in systems-level code.",
      "Proves the ability to design and ship a complete tool around a performance-critical core.",
    ],
    nextIterations: [
      "Add a configurable UI for editing and managing recorded macro libraries.",
      "Introduce conditional and looped playback for more complex automation flows.",
      "Publish signed Windows releases with an installer for easy distribution.",
    ],
    tags: ["Automation", "C++", "Windows"],
    impactHeading: "How This Project Creates Impact",
    impactPoints: [
      "Eliminates repetitive manual input by replaying complex actions with frame-accurate precision.",
      "Demonstrates performance engineering in native C++ where latency genuinely matters.",
      "Shows range beyond web development — building low-level tooling on the Windows platform.",
    ],
  },
  de: {
    tagline:
      "Input-Automatisierung mit ultraniedriger Latenz für Windows, gebaut in C++.",
    description:
      "Flow ist ein Windows-Automatisierungstool zum Aufzeichnen und Wiedergeben von Benutzereingaben mit minimaler Verzögerung — frame-genaue Makro-Wiedergabe und schnelle Auto-Klick-Ausführung, in C++ für performance-kritische Workflows gebaut.",
    overview:
      "Flow erfasst Tastatur- und Mauseingaben und gibt sie mit frame-genauem Timing wieder, sodass aufgezeichnete Makros exakt wie durchgeführt ablaufen. In C++ für die Windows-Plattform geschrieben, konzentriert es sich auf Ausführung mit ultraniedriger Latenz — und minimiert die Lücke zwischen Absicht und Aktion bei repetitiven Aufgaben, Tests und schnellem Auto-Klicken.",
    roleSummary:
      "Systems-Engineer, der ein performance-kritisches natives Windows-Automatisierungstool in C++ von Grund auf aufbaut.",
    problemStatement:
      "Browser- und skriptbasierte Automatisierungstools fügen Latenz hinzu, die zeitkritische Workflows stört. Flow läuft nativ unter Windows in C++ und zeichnet Eingaben mit frame-genauer Präzision und minimalem Overhead auf und gibt sie wieder.",
    objectives: [
      "Tastatur- und Mauseingaben mit präzisem, frame-genauem Timing für originalgetreue Wiedergabe aufzeichnen.",
      "Makro-Ausführung mit ultraniedriger Latenz liefern, die Overhead vom kritischen Pfad fernhält.",
      "Schnelle, konfigurierbare Auto-Klick-Ausführung für repetitive Hochgeschwindigkeitsaufgaben bereitstellen.",
    ],
    architectureDecisions: [
      "Native C++-Implementierung, die auf den Windows-Input-Stack für minimalen Ausführungs-Overhead zielt.",
      "Timing-Modell, das die ursprüngliche Kadenz der aufgezeichneten Events für frame-genaue Wiedergabe bewahrt.",
      "PowerShell-Tooling rund um den nativen Kern für Setup- und Build-Automatisierung.",
    ],
    implementationHighlights: [
      "Makro-Recorder gebaut, der Eingabe-Events mit hochauflösendem Timing erfasst.",
      "Frame-genaue Wiedergabe umgesetzt, die Sequenzen exakt wie aufgezeichnet abspielt.",
      "Schnelle Auto-Klick-Engine geliefert, abgestimmt auf Ausführung mit ultraniedriger Latenz.",
    ],
    qualityAndSecurity: [
      "Deterministisches Wiedergabe-Timing, validiert gegen den aufgezeichneten Event-Stream.",
      "Begrenzte Eingabe-Verarbeitung, um Automatisierung vorhersehbar zu halten und unkontrollierte Ausführung zu vermeiden.",
      "Native Windows-Integration bleibt eigenständig, ohne Hintergrund-Netzwerkabhängigkeiten.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Aufgezeichnete Eingaben mit einem Timing wiedergeben, das genau genug ist, um die ursprüngliche Ausführung zu treffen.",
        solution:
          "Hochauflösende Zeitstempel zu jedem Event erfasst und die ursprüngliche Kadenz bei der Wiedergabe für frame-genaue Ergebnisse rekonstruiert.",
      },
      {
        challenge:
          "Die Ausführungslatenz niedrig genug für schnelles Auto-Klicken halten, ohne Events zu verlieren.",
        solution:
          "Den Hot Path in nativem C++ mit minimaler Allokation und Overhead gehalten, sodass das Input-Dispatch bei schneller Wiederholung präzise bleibt.",
      },
    ],
    hiringSignals: [
      "Beweist Souveränität mit nativem C++ und der Windows-Plattform, über den Web-Stack hinaus.",
      "Zeigt einen Fokus auf Performance, Latenz und präzises Timing in systemnahem Code.",
      "Beweist die Fähigkeit, ein vollständiges Tool rund um einen performance-kritischen Kern zu entwerfen und auszuliefern.",
    ],
    nextIterations: [
      "Eine konfigurierbare UI zum Bearbeiten und Verwalten aufgezeichneter Makro-Bibliotheken ergänzen.",
      "Bedingte und geloopte Wiedergabe für komplexere Automatisierungsabläufe einführen.",
      "Signierte Windows-Releases mit Installer für einfache Verteilung veröffentlichen.",
    ],
    tags: ["Automatisierung", "C++", "Windows"],
    impactHeading: "Wie dieses Projekt Wirkung erzeugt",
    impactPoints: [
      "Eliminiert repetitive manuelle Eingaben, indem komplexe Aktionen frame-genau wiedergegeben werden.",
      "Demonstriert Performance-Engineering in nativem C++, wo Latenz wirklich zählt.",
      "Zeigt Bandbreite über die Web-Entwicklung hinaus — Low-Level-Tooling auf der Windows-Plattform bauen.",
    ],
  },
  fr: {
    tagline:
      "Automatisation des entrées à ultra-faible latence pour Windows, conçue en C++.",
    description:
      "Flow est un outil d'automatisation Windows pour enregistrer et rejouer les entrées utilisateur avec un délai minimal — lecture de macros à la frame près et exécution rapide d'auto-clics, conçu en C++ pour les workflows critiques en performance.",
    overview:
      "Flow capture les entrées clavier et souris et les rejoue avec un timing à la frame près, afin que les macros enregistrées s'exécutent exactement comme réalisées. Écrit en C++ pour la plateforme Windows, il met l'accent sur une exécution à ultra-faible latence — réduisant l'écart entre l'intention et l'action pour les tâches répétitives, les tests et l'auto-clic à haute vitesse.",
    roleSummary:
      "Ingénieur systèmes construisant de zéro un outil d'automatisation Windows natif et critique en performance, en C++.",
    problemStatement:
      "Les outils d'automatisation basés sur le navigateur ou les scripts ajoutent une latence qui casse les workflows sensibles au timing. Flow s'exécute nativement sous Windows en C++, enregistrant et rejouant les entrées avec une précision à la frame près et un overhead minimal.",
    objectives: [
      "Enregistrer les entrées clavier et souris avec un timing précis, à la frame près, pour une lecture fidèle.",
      "Offrir une exécution de macros à ultra-faible latence qui garde l'overhead hors du chemin critique.",
      "Fournir une exécution d'auto-clic rapide et configurable pour les tâches répétitives à haute vitesse.",
    ],
    architectureDecisions: [
      "Implémentation native en C++ ciblant la pile d'entrées Windows pour un overhead d'exécution minimal.",
      "Modèle de timing qui préserve la cadence originale des événements enregistrés pour une lecture à la frame près.",
      "Outillage PowerShell autour du cœur natif pour l'automatisation de la configuration et du build.",
    ],
    implementationHighlights: [
      "Enregistreur de macros capturant les événements d'entrée avec un timing haute résolution.",
      "Lecture à la frame près rejouant les séquences exactement comme enregistrées.",
      "Moteur d'auto-clic rapide réglé pour une exécution à ultra-faible latence.",
    ],
    qualityAndSecurity: [
      "Timing de lecture déterministe validé par rapport au flux d'événements enregistré.",
      "Traitement des entrées borné pour garder l'automatisation prévisible et éviter une exécution incontrôlée.",
      "Intégration Windows native autonome, sans dépendances réseau en arrière-plan.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Rejouer les entrées enregistrées avec un timing assez précis pour correspondre à l'exécution originale.",
        solution:
          "Capture d'horodatages haute résolution à chaque événement et reconstruction de la cadence originale à la lecture pour des résultats à la frame près.",
      },
      {
        challenge:
          "Maintenir une latence d'exécution assez basse pour l'auto-clic à haute vitesse sans perdre d'événements.",
        solution:
          "Maintien du chemin critique en C++ natif avec allocation et overhead minimaux, afin que la distribution des entrées reste serrée en répétition rapide.",
      },
    ],
    hiringSignals: [
      "Démontre l'aisance avec le C++ natif et la plateforme Windows, au-delà de la stack web.",
      "Montre un souci de la performance, de la latence et du timing précis dans du code système.",
      "Prouve la capacité à concevoir et livrer un outil complet autour d'un cœur critique en performance.",
    ],
    nextIterations: [
      "Ajouter une UI configurable pour éditer et gérer des bibliothèques de macros enregistrées.",
      "Introduire une lecture conditionnelle et en boucle pour des flux d'automatisation plus complexes.",
      "Publier des releases Windows signées avec un installateur pour une distribution simple.",
    ],
    tags: ["Automatisation", "C++", "Windows"],
    impactHeading: "Comment ce projet crée de l'impact",
    impactPoints: [
      "Élimine les saisies manuelles répétitives en rejouant des actions complexes avec une précision à la frame près.",
      "Démontre l'ingénierie de la performance en C++ natif, là où la latence compte vraiment.",
      "Montre une polyvalence au-delà du développement web — construire des outils bas niveau sur la plateforme Windows.",
    ],
  },
  zh: {
    tagline: "面向 Windows 的超低延迟输入自动化工具，以 C++ 构建。",
    description:
      "Flow 是一款 Windows 自动化工具，用于以极小延迟录制并回放用户输入——帧级精确的宏回放与高速自动点击，以 C++ 为性能关键型工作流构建。",
    overview:
      "Flow 捕获键盘与鼠标输入，并以帧级精确的时序回放，使录制的宏完全按照操作时的方式执行。以 C++ 为 Windows 平台编写，专注于超低延迟执行——在重复任务、测试与高速自动点击中，尽量缩小意图与动作之间的间隔。",
    roleSummary:
      "系统工程师，从零用 C++ 打造性能关键型的原生 Windows 自动化工具。",
    problemStatement:
      "基于浏览器或脚本的自动化工具会引入延迟，破坏对时序敏感的工作流。Flow 以 C++ 在 Windows 上原生运行，以帧级精度和极小开销录制并回放输入。",
    objectives: [
      "以精确的帧级时序录制键盘与鼠标输入，实现忠实回放。",
      "提供超低延迟的宏执行，让开销远离关键路径。",
      "提供快速、可配置的自动点击执行，应对高速重复任务。",
    ],
    architectureDecisions: [
      "面向 Windows 输入栈的原生 C++ 实现，将执行开销降至最低。",
      "保留录制事件原始节奏的时序模型，实现帧级精确回放。",
      "围绕原生核心的 PowerShell 工具链，用于配置与构建自动化。",
    ],
    implementationHighlights: [
      "构建宏录制器，以高分辨率时序捕获输入事件。",
      "实现帧级精确回放，完全按录制内容重放操作序列。",
      "交付为超低延迟执行调优的高速自动点击引擎。",
    ],
    qualityAndSecurity: [
      "确定性的回放时序，依据录制的事件流进行校验。",
      "对输入处理设界限，使自动化可预期，避免失控执行。",
      "原生 Windows 集成保持自包含，无后台网络依赖。",
    ],
    challengesAndSolutions: [
      {
        challenge: "以足够精确的时序回放录制的输入，匹配原始操作。",
        solution:
          "为每个事件采集高分辨率时间戳，并在回放时重建原始节奏，实现帧级精确结果。",
      },
      {
        challenge:
          "在不丢失事件的前提下，将执行延迟保持得足够低以支持高速自动点击。",
        solution:
          "将热路径保持在原生 C++ 中，尽量减少分配与开销，使输入派发在快速重复下依然紧凑。",
      },
    ],
    hiringSignals: [
      "证明在原生 C++ 与 Windows 平台上的驾驭能力，超越 Web 技术栈。",
      "展示对系统级代码中性能、延迟与精确时序的关注。",
      "证明能够围绕性能关键型核心设计并交付完整工具。",
    ],
    nextIterations: [
      "增加可配置 UI，用于编辑与管理录制的宏库。",
      "引入条件与循环回放，支持更复杂的自动化流程。",
      "发布带安装程序的签名 Windows 版本，便于分发。",
    ],
    tags: ["自动化", "C++", "Windows"],
    impactHeading: "本项目如何创造价值",
    impactPoints: [
      "通过以帧级精度回放复杂操作，消除重复的手动输入。",
      "在延迟真正重要之处，展示原生 C++ 的性能工程能力。",
      "展现超越 Web 开发的广度——在 Windows 平台构建底层工具。",
    ],
  },
};
