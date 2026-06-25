import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const jester: Record<Language, LocalizedContent> = {
  en: {
    tagline: "Notepad, but it grew up. Tabs, line numbers, find-in-files, PDF export.",
    description:
      "Jester is a native Windows notepad with tabbed editing, a line-number gutter, find-in-files, and PDF export — one portable Jester.exe, no installer.",
    overview:
      "I wanted a notepad that opens before I let go of the mouse, but still does the few things Notepad refuses to. So I built one in C# and WPF on .NET 9: tabs, a line-number gutter, find across a whole folder, and clean A4 PDF export. It ships as a single portable executable with the runtime baked in — no installer, no \"please install .NET\" dialog, no excuses.",
    roleSummary: "Designed it, built it, shipped it. Just me — the WPF UI and the whole .NET 9 build.",
    problemStatement:
      "Windows Notepad is too bare to live in, and a full editor takes a coffee break to launch. Jester is the middle I actually wanted: instant start, plus the handful of power features that earn their keep every day.",
    objectives: [
      "Launch instantly and stay light — no splash screen, no warm-up.",
      "Add the features that matter — tabs, line numbers, find-in-files, PDF export — and nothing that doesn't.",
      "Ship one portable .exe that runs on Windows 10/11 with zero install steps.",
    ],
    architectureDecisions: [
      "C# and WPF on .NET 9, with per-tab document state, the editor surface, and the line-number margin as separate, focused components.",
      "Settings and the last session saved as JSON, so the window, tabs, and preferences come back exactly where I left them.",
      "QuestPDF for paginated A4 rendering, walled off in its own exporter so it never touches the startup path.",
    ],
    implementationHighlights: [
      "Tabbed editing where every document keeps its own undo history and encoding, with a line-number gutter and current-line highlight.",
      "Find in Files that sweeps an entire folder — filters, subfolders, the lot — and jumps straight to the hit on double-click.",
      "Export to PDF that turns any note into a clean, paginated A4 document with a single keystroke.",
    ],
    qualityAndSecurity: [
      "Safe by default: it asks before throwing away unsaved work — even on sign-out or shutdown — and writes atomically, so a crash can't leave you a corrupted file.",
      "Encoding-aware: it reads UTF-8/UTF-16 BOMs and hands every file back with its original encoding and line endings intact.",
      "Self-contained and portable, runtime bundled, so it never leans on a system-wide .NET install.",
    ],
    challengesAndSolutions: [
      {
        challenge: "Keeping startup instant while still carrying tabs, search, and PDF export.",
        solution:
          "I split the app into small WPF components and kept the heavy lifting — PDF rendering above all — off the launch path entirely.",
      },
      {
        challenge: "Handing every file back byte-faithful, encoding and line endings included.",
        solution:
          "I detect the BOM on open, track encoding and line endings per tab, and write them straight back on save — no silent \"helpful\" conversions.",
      },
    ],
    hiringSignals: [
      "Native Windows desktop development in C# and WPF on a current .NET 9 stack.",
      "Care where it counts — atomic saves, crash safety, and encoding fidelity, not just happy-path features.",
      "Owning a desktop app start to finish, from the custom UI down to a single portable build.",
    ],
    nextIterations: [
      "Syntax highlighting and a code-oriented editing mode.",
      "A plugin or scripting hook for custom commands.",
      "Multi-caret editing and a richer find-and-replace across files.",
    ],
    tags: ["C#", "WPF", ".NET 9", "Windows"],
    impactHeading: "How This Project Creates Impact",
    impactPoints: [
      "Gives Windows users a notepad that opens instantly and gets out of the way.",
      "Adds the few power features that earn their place — tabs, search, PDF export — without the weight of a full IDE.",
      "Keeps work safe with crash-proof saves and faithful encoding handling.",
    ],
    stats: [
      { value: "1", label: "portable exe" },
      { value: "0", label: "installers" },
      { value: ".NET 9", label: "runtime bundled" },
      { value: "A4", label: "PDF export" },
    ],
  },
  de: {
    tagline: "Notepad, aber erwachsen geworden. Tabs, Zeilennummern, Find-in-Files, PDF-Export.",
    description:
      "Jester ist ein nativer Windows-Notepad mit Tab-Bearbeitung, Zeilennummern-Leiste, Find-in-Files und PDF-Export — eine portable Jester.exe, kein Installer.",
    overview:
      "Ich wollte einen Notepad, der offen ist, bevor ich die Maus loslasse, der aber trotzdem die paar Dinge kann, die Notepad verweigert. Also habe ich einen in C# und WPF auf .NET 9 gebaut: Tabs, eine Zeilennummern-Leiste, Suche über einen ganzen Ordner und sauberer A4-PDF-Export. Er kommt als eine einzige portable Datei mit eingebackener Runtime — kein Installer, kein \"Bitte .NET installieren\"-Dialog, keine Ausreden.",
    roleSummary: "Entworfen, gebaut, ausgeliefert. Nur ich — die WPF-Oberfläche und der gesamte .NET-9-Build.",
    problemStatement:
      "Der Windows-Notepad ist zu spärlich zum Arbeiten, und ein vollwertiger Editor macht erst mal Kaffeepause beim Start. Jester ist die Mitte, die ich tatsächlich wollte: sofortiger Start plus die Handvoll Power-Features, die sich täglich auszahlen.",
    objectives: [
      "Sofort starten und leicht bleiben — kein Splash-Screen, kein Warmlaufen.",
      "Die Features hinzufügen, die zählen — Tabs, Zeilennummern, Find-in-Files, PDF-Export — und nichts darüber hinaus.",
      "Eine einzige portable .exe ausliefern, die auf Windows 10/11 ohne Installationsschritte läuft.",
    ],
    architectureDecisions: [
      "C# und WPF auf .NET 9, mit Pro-Tab-Dokumentstatus, Editor-Oberfläche und Zeilennummern-Leiste als getrennte, fokussierte Komponenten.",
      "Einstellungen und die letzte Sitzung als JSON gespeichert, sodass Fenster, Tabs und Präferenzen genau dort zurückkommen, wo ich aufgehört habe.",
      "QuestPDF für paginiertes A4-Rendering, abgeschottet in einem eigenen Exporter, sodass es den Startpfad nie berührt.",
    ],
    implementationHighlights: [
      "Tab-Bearbeitung, bei der jedes Dokument seine eigene Undo-Historie und Kodierung behält, mit Zeilennummern-Leiste und Aktuelle-Zeile-Hervorhebung.",
      "Find in Files, das einen ganzen Ordner durchkämmt — Filter, Unterordner, alles — und per Doppelklick direkt zum Treffer springt.",
      "Export to PDF, das jede Notiz mit einem einzigen Tastendruck in ein sauberes, paginiertes A4-Dokument verwandelt.",
    ],
    qualityAndSecurity: [
      "Sicher per Default: fragt nach, bevor ungespeicherte Arbeit verworfen wird — auch bei Abmeldung oder Herunterfahren — und schreibt atomar, sodass ein Absturz keine beschädigte Datei hinterlässt.",
      "Kodierungs-bewusst: liest UTF-8/UTF-16-BOMs und gibt jede Datei mit unveränderter ursprünglicher Kodierung und Zeilenenden zurück.",
      "Eigenständig und portabel, Runtime gebündelt, sodass es sich nie auf eine systemweite .NET-Installation verlässt.",
    ],
    challengesAndSolutions: [
      {
        challenge: "Den Start sofort halten und trotzdem Tabs, Suche und PDF-Export mitschleppen.",
        solution:
          "Ich habe die App in kleine WPF-Komponenten aufgeteilt und die schwere Arbeit — allen voran das PDF-Rendering — komplett vom Startpfad ferngehalten.",
      },
      {
        challenge: "Jede Datei byte-getreu zurückgeben, samt Kodierung und Zeilenenden.",
        solution:
          "Ich erkenne das BOM beim Öffnen, verfolge Kodierung und Zeilenenden pro Tab und schreibe sie beim Speichern direkt zurück — keine stillen \"hilfreichen\" Konvertierungen.",
      },
    ],
    hiringSignals: [
      "Native Windows-Desktop-Entwicklung in C# und WPF auf einem aktuellen .NET-9-Stack.",
      "Sorgfalt dort, wo sie zählt — atomare Speicherungen, Absturzsicherheit und Kodierungstreue, nicht nur Happy-Path-Features.",
      "Eine Desktop-App von Anfang bis Ende verantworten, von der eigenen UI bis zum einzelnen portablen Build.",
    ],
    nextIterations: [
      "Syntax-Hervorhebung und ein code-orientierter Bearbeitungsmodus.",
      "Ein Plugin- oder Scripting-Hook für eigene Befehle.",
      "Multi-Cursor-Bearbeitung und ein reichhaltigeres Suchen-und-Ersetzen über Dateien hinweg.",
    ],
    tags: ["C#", "WPF", ".NET 9", "Windows"],
    impactHeading: "Wie dieses Projekt Wirkung erzeugt",
    impactPoints: [
      "Gibt Windows-Nutzern einen Notepad, der sofort öffnet und aus dem Weg geht.",
      "Fügt die wenigen Power-Features hinzu, die sich lohnen — Tabs, Suche, PDF-Export — ohne das Gewicht einer vollen IDE.",
      "Hält die Arbeit sicher mit absturzfesten Speicherungen und getreuer Kodierungs-Behandlung.",
    ],
    stats: [
      { value: "1", label: "portable EXE" },
      { value: "0", label: "Installer" },
      { value: ".NET 9", label: "Runtime gebündelt" },
      { value: "A4", label: "PDF-Export" },
    ],
  },
  fr: {
    tagline: "Le bloc-notes, mais devenu adulte. Onglets, numéros de ligne, recherche dans les fichiers, export PDF.",
    description:
      "Jester est un bloc-notes Windows natif avec édition par onglets, gouttière de numéros de ligne, recherche dans les fichiers et export PDF — un seul Jester.exe portable, aucun installeur.",
    overview:
      "Je voulais un bloc-notes ouvert avant même que je lâche la souris, mais qui sache faire les quelques choses que Notepad refuse. Alors je l'ai écrit en C# et WPF sur .NET 9 : onglets, gouttière de numéros de ligne, recherche dans un dossier entier et export PDF A4 soigné. Il se livre en un seul exécutable portable, runtime intégré — aucun installeur, aucune boîte de dialogue \"installez .NET\", aucune excuse.",
    roleSummary: "Conçu, codé, livré. Moi seul — l'interface WPF et tout le build .NET 9.",
    problemStatement:
      "Le bloc-notes de Windows est trop dépouillé pour y vivre, et un éditeur complet prend une pause-café au démarrage. Jester est le juste milieu que je cherchais : démarrage instantané, plus la poignée de fonctions avancées qui se justifient au quotidien.",
    objectives: [
      "Démarrer instantanément et rester léger — pas d'écran de démarrage, pas de mise en chauffe.",
      "Ajouter les fonctions qui comptent — onglets, numéros de ligne, recherche dans les fichiers, export PDF — et rien de superflu.",
      "Livrer un seul .exe portable qui tourne sous Windows 10/11 sans aucune étape d'installation.",
    ],
    architectureDecisions: [
      "C# et WPF sur .NET 9, avec l'état du document par onglet, la surface d'édition et la marge des numéros de ligne en composants séparés et ciblés.",
      "Préférences et dernière session enregistrées en JSON, pour que la fenêtre, les onglets et les préférences reviennent exactement là où je les avais laissés.",
      "QuestPDF pour le rendu A4 paginé, cloisonné dans son propre module d'export pour qu'il ne touche jamais au chemin de démarrage.",
    ],
    implementationHighlights: [
      "Édition par onglets où chaque document garde son propre historique d'annulation et son encodage, avec gouttière de numéros de ligne et mise en évidence de la ligne courante.",
      "Recherche dans les fichiers qui ratisse un dossier entier — filtres, sous-dossiers, tout — et saute droit au résultat au double-clic.",
      "Export PDF qui transforme toute note en un document A4 paginé et soigné d'une seule touche.",
    ],
    qualityAndSecurity: [
      "Sûr par défaut : il demande avant de jeter un travail non enregistré — y compris à la déconnexion ou à l'arrêt — et écrit de façon atomique, pour qu'un plantage ne laisse jamais un fichier corrompu.",
      "Conscient de l'encodage : il lit les BOM UTF-8/UTF-16 et rend chaque fichier avec son encodage et ses fins de ligne d'origine intacts.",
      "Autonome et portable, runtime intégré, pour ne jamais dépendre d'une installation .NET à l'échelle du système.",
    ],
    challengesAndSolutions: [
      {
        challenge: "Garder un démarrage instantané tout en trimballant onglets, recherche et export PDF.",
        solution:
          "J'ai découpé l'application en petits composants WPF et tenu les tâches lourdes — le rendu PDF en tête — entièrement hors du chemin de lancement.",
      },
      {
        challenge: "Rendre chaque fichier fidèle à l'octet près, encodage et fins de ligne compris.",
        solution:
          "Je détecte le BOM à l'ouverture, je suis l'encodage et les fins de ligne par onglet, et je les réécris tels quels à l'enregistrement — pas de conversions \"serviables\" silencieuses.",
      },
    ],
    hiringSignals: [
      "Développement desktop Windows natif en C# et WPF sur une pile .NET 9 actuelle.",
      "Du soin là où ça compte — enregistrements atomiques, sûreté face aux plantages et fidélité d'encodage, pas seulement le chemin idéal.",
      "Mener une application desktop de bout en bout, de l'UI sur mesure jusqu'à un build portable unique.",
    ],
    nextIterations: [
      "Coloration syntaxique et un mode d'édition orienté code.",
      "Un point d'extension plugin ou scripting pour des commandes personnalisées.",
      "Édition multi-curseurs et un rechercher-remplacer plus riche à travers les fichiers.",
    ],
    tags: ["C#", "WPF", ".NET 9", "Windows"],
    impactHeading: "Comment ce projet crée de l'impact",
    impactPoints: [
      "Donne aux utilisateurs de Windows un bloc-notes qui s'ouvre instantanément et s'efface.",
      "Ajoute les quelques fonctions avancées qui se justifient — onglets, recherche, export PDF — sans le poids d'un IDE complet.",
      "Garde le travail en sécurité grâce à des enregistrements à l'épreuve des plantages et un traitement fidèle de l'encodage.",
    ],
    stats: [
      { value: "1", label: "exe portable" },
      { value: "0", label: "installeur" },
      { value: ".NET 9", label: "runtime intégré" },
      { value: "A4", label: "export PDF" },
    ],
  },
  zh: {
    tagline: "记事本，但长大了。标签页、行号、跨文件查找、PDF 导出。",
    description:
      "Jester 是一款原生 Windows 记事本，支持标签页编辑、行号边栏、跨文件查找与 PDF 导出——单个可移植的 Jester.exe，无需安装程序。",
    overview:
      "我想要一款在我松开鼠标之前就已经打开的记事本，但它还得会做那几件系统记事本拒绝做的事。于是我用 C# 与 WPF、基于 .NET 9 写了一个：标签页、行号边栏、跨整个文件夹的查找，以及干净的 A4 PDF 导出。它以单个可移植可执行文件发布，运行时已内置——没有安装程序，没有\"请安装 .NET\"的弹窗，也没有借口。",
    roleSummary: "我一个人设计、构建并发布——WPF 界面与整个 .NET 9 构建。",
    problemStatement:
      "Windows 自带的记事本太简陋，住不进去；而功能完整的编辑器一启动就先去喝杯咖啡。Jester 正是我想要的折中：瞬时启动，外加那几个每天都对得起自己分量的强力功能。",
    objectives: [
      "瞬时启动并保持轻量——没有启动画面，没有预热。",
      "加入真正重要的功能——标签页、行号、跨文件查找、PDF 导出——多余的一概不加。",
      "发布单个可移植的 .exe，在 Windows 10/11 上无需任何安装步骤即可运行。",
    ],
    architectureDecisions: [
      "基于 .NET 9 的 C# 与 WPF，将每个标签页的文档状态、编辑器界面与行号边栏拆分为独立、聚焦的组件。",
      "以 JSON 保存设置与上次会话，使窗口、标签页与偏好原样回到我离开时的位置。",
      "使用 QuestPDF 进行分页 A4 渲染，隔离在专门的导出模块中，使其永不触及启动路径。",
    ],
    implementationHighlights: [
      "标签页编辑，每个文档保留各自的撤销历史与编码，并配有行号边栏与当前行高亮。",
      "跨文件查找可横扫整个文件夹——筛选条件、子文件夹，一应俱全——双击结果即可直接跳转。",
      "PDF 导出只需一个按键，便能把任意笔记变成干净的分页 A4 文档。",
    ],
    qualityAndSecurity: [
      "默认安全：在丢弃未保存的工作前会询问——包括注销或关机时——并以原子方式写入，使崩溃绝不会留下损坏的文件。",
      "编码感知：识别 UTF-8/UTF-16 BOM，并把每个文件原样交还，编码与行尾完好无损。",
      "自包含且可移植，内置运行时，因此永不依赖系统级的 .NET 安装。",
    ],
    challengesAndSolutions: [
      {
        challenge: "在背负标签页、搜索与 PDF 导出的同时，保持瞬时启动。",
        solution:
          "我把应用拆分为小而聚焦的 WPF 组件，并把繁重的工作——尤其是 PDF 渲染——彻底移出启动路径。",
      },
      {
        challenge: "把每个文件原样交还，精确到字节，连同编码与行尾。",
        solution:
          "我在打开时检测 BOM，按标签页跟踪编码与行尾，并在保存时原样写回——绝不做悄无声息的\"贴心\"转换。",
      },
    ],
    hiringSignals: [
      "在当前的 .NET 9 技术栈上以 C# 与 WPF 进行原生 Windows 桌面开发。",
      "在关键处用心——原子保存、崩溃安全与编码保真，而不只是顺风顺水的那条路。",
      "从定制 UI 到单个可移植构建，端到端地主导一款桌面应用。",
    ],
    nextIterations: [
      "语法高亮与面向代码的编辑模式。",
      "用于自定义命令的插件或脚本扩展点。",
      "多光标编辑以及更丰富的跨文件查找与替换。",
    ],
    tags: ["C#", "WPF", ".NET 9", "Windows"],
    impactHeading: "本项目如何创造价值",
    impactPoints: [
      "为 Windows 用户提供一款瞬时打开、随即让路的记事本。",
      "加入那几个对得起分量的强力功能——标签页、搜索、PDF 导出——而无需完整 IDE 的负担。",
      "用崩溃无忧的保存与忠实的编码处理，让用户的工作万无一失。",
    ],
    stats: [
      { value: "1", label: "可移植 EXE" },
      { value: "0", label: "安装程序" },
      { value: ".NET 9", label: "内置运行时" },
      { value: "A4", label: "PDF 导出" },
    ],
  },
};
