import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const jester: Record<Language, LocalizedContent> = {
  en: {
    tagline: "Notepad, but it grew up. Tabs, line numbers, find-in-files, PDF export.",
    description:
      "Jester is a native Windows notepad with tabbed editing, a line-number gutter, find-in-files and PDF export, all in one portable Jester.exe with no installer.",
    overview:
      "I wanted a notepad that opens before I let go of the mouse, but still does the few things Notepad refuses to. So I built one in C# and WPF on .NET 9: tabs, a line-number gutter, find across a whole folder, and clean A4 PDF export through QuestPDF. It also has the small things you only miss once they are gone, like session restore, Open Recent, and \"Open with Jester\" in the Explorer context menu. It ships as a single portable executable with the runtime baked in, so there is no installer and no \"please install .NET\" dialog.",
    roleSummary: "Just me: the WPF UI and the whole .NET 9 build.",
    problemStatement:
      "Windows Notepad is too bare to live in, and a full editor takes a coffee break to launch. Jester is the middle I actually wanted: instant start, plus the handful of power features that earn their keep every day.",
    objectives: [
      "Launch instantly and stay light, with no splash screen and no warm-up.",
      "Add the features that matter (tabs, line numbers, find-in-files, PDF export) and skip the rest.",
      "Ship one portable .exe that runs on Windows 10 and 11 with zero install steps.",
    ],
    architectureDecisions: [
      "C# and WPF on .NET 9, with per-tab document state, the editor surface and the line-number margin as separate, focused components.",
      "Settings and the last session saved as JSON, so the window, the tabs and the preferences come back where I left them.",
      "QuestPDF for paginated A4 rendering, walled off in its own exporter so it never touches the startup path.",
    ],
    implementationHighlights: [
      "Tabbed editing where every document keeps its own undo history and encoding, with a line-number gutter and a current-line highlight.",
      "Find in Files that sweeps an entire folder, filters and subfolders included, and jumps straight to the hit on double-click.",
      "Export to PDF that turns any note into a clean, paginated A4 document with one keystroke.",
      "The unglamorous half: find and replace with wrap-around, go to line, insert time and date, a font picker, encoding and line-ending conversion, and a status bar that tells you which of those you are in.",
    ],
    qualityAndSecurity: [
      "It asks before throwing away unsaved work, including on sign-out or shutdown, and writes atomically, so a crash cannot leave you a half-written file.",
      "Encoding-aware: it reads UTF-8 and UTF-16 BOMs and hands every file back with its original encoding and line endings intact.",
      "57 test cases over the document, encoding and search logic.",
      "Self-contained and portable, runtime bundled, so it never leans on a system-wide .NET install.",
    ],
    challengesAndSolutions: [
      {
        challenge: "Keeping startup instant while still carrying tabs, search and PDF export.",
        solution:
          "I split the app into small WPF components and kept the heavy lifting, PDF rendering above all, off the launch path entirely.",
      },
      {
        challenge: "Handing every file back byte-faithful, encoding and line endings included.",
        solution:
          "I detect the BOM on open, track encoding and line endings per tab, and write them straight back on save, with no silent \"helpful\" conversions.",
      },
    ],
    hiringSignals: [
      "Native Windows desktop work in C# and WPF on a current .NET 9 stack.",
      "Care in the places nobody demos: atomic saves, crash safety, encoding fidelity.",
      "A desktop app owned start to finish, from the custom UI down to a single portable build.",
    ],
    nextIterations: [
      "Syntax highlighting and a code-oriented editing mode.",
      "A plugin or scripting hook for custom commands.",
      "Multi-caret editing and a richer find-and-replace across files.",
    ],
    tags: ["C#", "WPF", ".NET 9", "Windows"],
    impactHeading: "What This Project Is Good For",
    impactPoints: [
      "Gives Windows users a notepad that opens instantly and then gets out of the way.",
      "Adds a few power features (tabs, search, PDF export) without the weight of a full IDE.",
      "Keeps work safe with crash-proof saves and faithful encoding handling.",
    ],
    stats: [
      { value: "1", label: "portable exe" },
      { value: "0", label: "installers" },
      { value: "57", label: "tests" },
      { value: "A4", label: "PDF export" },
    ],
  },
  de: {
    tagline: "Notepad, aber erwachsen. Tabs, Zeilennummern, Suche im Ordner, PDF-Export.",
    description:
      "Jester ist ein nativer Windows-Notizblock mit Tabs, Zeilennummern-Spalte, Suche über ganze Ordner und PDF-Export, alles in einer portablen Jester.exe ohne Installer.",
    overview:
      "Ich wollte einen Notizblock, der aufgeht, bevor ich die Maus loslasse, der aber die paar Dinge kann, die Notepad verweigert. Also habe ich einen in C# und WPF auf .NET 9 gebaut: Tabs, eine Zeilennummern-Spalte, Suche über einen ganzen Ordner und saubere A4-PDF-Ausgabe über QuestPDF. Dazu die kleinen Dinge, die man erst vermisst, wenn sie fehlen: Sitzungswiederherstellung, „Zuletzt verwendet“ und „Mit Jester öffnen“ im Explorer-Kontextmenü. Ausgeliefert wird eine einzige portable Datei mit eingebackener Runtime, also kein Installer und kein „bitte .NET installieren“-Dialog.",
    roleSummary: "Nur ich: die WPF-Oberfläche und der ganze .NET-9-Build.",
    problemStatement:
      "Windows Notepad ist zu nackt, um darin zu wohnen, und ein vollwertiger Editor braucht eine Kaffeepause zum Starten. Jester ist die Mitte, die ich wirklich wollte: sofortiger Start plus die Handvoll Funktionen, die sich täglich rechtfertigen.",
    objectives: [
      "Sofort starten und leicht bleiben, ohne Splashscreen und ohne Aufwärmen.",
      "Die Funktionen einbauen, die zählen (Tabs, Zeilennummern, Suche im Ordner, PDF-Export), und den Rest weglassen.",
      "Eine portable .exe ausliefern, die auf Windows 10 und 11 ohne einen einzigen Installationsschritt läuft.",
    ],
    architectureDecisions: [
      "C# und WPF auf .NET 9, mit Dokumentzustand pro Tab, der Editor-Fläche und der Zeilennummern-Spalte als getrennte, fokussierte Komponenten.",
      "Einstellungen und die letzte Sitzung als JSON gespeichert, damit Fenster, Tabs und Vorlieben dort wieder aufgehen, wo ich sie verlassen habe.",
      "QuestPDF für das paginierte A4-Rendering, abgeschottet in seinem eigenen Exporter, damit es den Startpfad nie berührt.",
    ],
    implementationHighlights: [
      "Tab-Editing, in dem jedes Dokument seine eigene Undo-Historie und Kodierung behält, mit Zeilennummern-Spalte und Markierung der aktuellen Zeile.",
      "Eine Suche im Ordner, die einen ganzen Baum durchgeht, Filter und Unterordner inklusive, und per Doppelklick direkt zum Treffer springt.",
      "PDF-Export, der aus jeder Notiz mit einem Tastendruck ein sauberes, paginiertes A4-Dokument macht.",
      "Die unglamouröse Hälfte: Suchen und Ersetzen mit Umlauf, Gehe-zu-Zeile, Datum und Zeit einfügen, ein Schriftwähler, Umwandlung von Kodierung und Zeilenenden, und eine Statusleiste, die sagt, in welcher davon man steckt.",
    ],
    qualityAndSecurity: [
      "Es fragt, bevor ungespeicherte Arbeit verworfen wird, auch beim Abmelden oder Herunterfahren, und schreibt atomar, damit ein Absturz keine halb geschriebene Datei hinterlässt.",
      "Kodierungsbewusst: Es liest UTF-8- und UTF-16-BOMs und gibt jede Datei mit ihrer ursprünglichen Kodierung und ihren Zeilenenden zurück.",
      "57 Testfälle über die Dokument-, Kodierungs- und Suchlogik.",
      "Eigenständig und portabel, Runtime mitgebracht, damit es sich nie auf eine systemweite .NET-Installation stützt.",
    ],
    challengesAndSolutions: [
      {
        challenge: "Den Start sofort halten und trotzdem Tabs, Suche und PDF-Export mitschleppen.",
        solution:
          "Ich habe die App in kleine WPF-Komponenten geteilt und die schwere Arbeit, vor allem das PDF-Rendering, komplett vom Startpfad genommen.",
      },
      {
        challenge: "Jede Datei bytetreu zurückgeben, Kodierung und Zeilenenden inklusive.",
        solution:
          "Ich erkenne beim Öffnen die BOM, verfolge Kodierung und Zeilenenden pro Tab und schreibe sie beim Speichern direkt zurück, ohne stille „hilfreiche“ Umwandlungen.",
      },
    ],
    hiringSignals: [
      "Native Windows-Desktop-Arbeit in C# und WPF auf einem aktuellen .NET-9-Stack.",
      "Sorgfalt an den Stellen, die niemand vorführt: atomare Speicherungen, Absturzsicherheit, Kodierungstreue.",
      "Eine Desktop-App von Anfang bis Ende verantwortet, von der eigenen Oberfläche bis zum einzelnen portablen Build.",
    ],
    nextIterations: [
      "Syntax-Highlighting und ein Code-orientierter Editiermodus.",
      "Ein Plugin- oder Scripting-Hook für eigene Befehle.",
      "Multi-Caret-Editing und ein reichhaltigeres Suchen-und-Ersetzen über Dateien hinweg.",
    ],
    tags: ["C#", "WPF", ".NET 9", "Windows"],
    impactHeading: "Wofür dieses Projekt gut ist",
    impactPoints: [
      "Gibt Windows-Nutzern einen Notizblock, der sofort aufgeht und dann aus dem Weg ist.",
      "Ergänzt ein paar Power-Funktionen (Tabs, Suche, PDF-Export) ohne das Gewicht einer vollen IDE.",
      "Hält Arbeit sicher, mit absturzfesten Speicherungen und treuer Kodierungsbehandlung.",
    ],
    stats: [
      { value: "1", label: "portable Exe" },
      { value: "0", label: "Installer" },
      { value: "57", label: "Tests" },
      { value: "A4", label: "PDF-Export" },
    ],
  },
  fr: {
    tagline: "Notepad, mais il a grandi. Onglets, numéros de ligne, recherche dans les fichiers, export PDF.",
    description:
      "Jester est un bloc-notes Windows natif avec édition par onglets, une gouttière de numéros de ligne, la recherche dans un dossier et l'export PDF, le tout dans un seul Jester.exe portable, sans installateur.",
    overview:
      "Je voulais un bloc-notes qui s'ouvre avant que je lâche la souris, mais qui fasse les quelques choses que Notepad refuse. J'en ai donc construit un en C# et WPF sur .NET 9 : onglets, gouttière de numéros de ligne, recherche dans un dossier entier, et export A4 propre via QuestPDF. Avec aussi les petites choses qui ne manquent qu'une fois disparues : la restauration de session, « Fichiers récents », et « Ouvrir avec Jester » dans le menu contextuel de l'Explorateur. Il se livre en un exécutable portable unique, runtime inclus, donc pas d'installateur et pas de boîte de dialogue « veuillez installer .NET ».",
    roleSummary: "Moi seul : l'interface WPF et tout le build .NET 9.",
    problemStatement:
      "Le Bloc-notes de Windows est trop nu pour y vivre, et un éditeur complet prend une pause café pour démarrer. Jester est le milieu que je voulais vraiment : démarrage instantané, plus la poignée de fonctions qui justifient leur place chaque jour.",
    objectives: [
      "Démarrer instantanément et rester léger, sans écran de démarrage ni mise en chauffe.",
      "Ajouter les fonctions qui comptent (onglets, numéros de ligne, recherche dans les fichiers, export PDF) et laisser le reste.",
      "Livrer un .exe portable qui tourne sur Windows 10 et 11 sans une seule étape d'installation.",
    ],
    architectureDecisions: [
      "C# et WPF sur .NET 9, avec l'état du document par onglet, la surface d'édition et la marge des numéros de ligne en composants séparés et ciblés.",
      "Les réglages et la dernière session enregistrés en JSON, pour que la fenêtre, les onglets et les préférences reviennent là où je les ai laissés.",
      "QuestPDF pour le rendu A4 paginé, isolé dans son propre exporteur pour qu'il ne touche jamais au chemin de démarrage.",
    ],
    implementationHighlights: [
      "Une édition par onglets où chaque document garde son propre historique d'annulation et son encodage, avec gouttière de numéros et surlignage de la ligne courante.",
      "Une recherche dans les fichiers qui balaie un dossier entier, filtres et sous-dossiers compris, et saute droit au résultat au double-clic.",
      "Un export PDF qui transforme n'importe quelle note en un document A4 propre et paginé, d'une seule frappe.",
      "La moitié sans gloire : rechercher-remplacer avec bouclage, aller à la ligne, insérer la date et l'heure, un sélecteur de police, la conversion d'encodage et de fins de ligne, et une barre d'état qui dit dans laquelle vous êtes.",
    ],
    qualityAndSecurity: [
      "Il demande avant de jeter un travail non enregistré, y compris à la déconnexion ou à l'extinction, et écrit de façon atomique, pour qu'un plantage ne laisse pas un fichier à moitié écrit.",
      "Attentif à l'encodage : il lit les BOM UTF-8 et UTF-16 et rend chaque fichier avec son encodage et ses fins de ligne d'origine.",
      "57 cas de test sur la logique de document, d'encodage et de recherche.",
      "Autonome et portable, runtime embarqué, pour qu'il ne s'appuie jamais sur une installation .NET du système.",
    ],
    challengesAndSolutions: [
      {
        challenge: "Garder un démarrage instantané tout en portant onglets, recherche et export PDF.",
        solution:
          "J'ai découpé l'app en petits composants WPF et sorti le gros du travail, le rendu PDF avant tout, du chemin de lancement.",
      },
      {
        challenge: "Rendre chaque fichier fidèle à l'octet, encodage et fins de ligne compris.",
        solution:
          "Je détecte le BOM à l'ouverture, je suis l'encodage et les fins de ligne par onglet, et je les réécris tels quels à l'enregistrement, sans conversion « utile » silencieuse.",
      },
    ],
    hiringSignals: [
      "Du développement bureau Windows natif en C# et WPF sur une pile .NET 9 actuelle.",
      "Du soin là où personne ne fait de démo : enregistrements atomiques, sûreté au plantage, fidélité de l'encodage.",
      "Une application de bureau portée du début à la fin, de l'interface sur mesure jusqu'à un unique build portable.",
    ],
    nextIterations: [
      "La coloration syntaxique et un mode d'édition orienté code.",
      "Un point d'extension ou de script pour des commandes personnalisées.",
      "L'édition multi-curseurs et un rechercher-remplacer plus riche à travers les fichiers.",
    ],
    tags: ["C#", "WPF", ".NET 9", "Windows"],
    impactHeading: "À quoi sert ce projet",
    impactPoints: [
      "Donne aux utilisateurs de Windows un bloc-notes qui s'ouvre instantanément puis s'efface.",
      "Ajoute quelques fonctions avancées (onglets, recherche, export PDF) sans le poids d'un IDE complet.",
      "Garde le travail en sûreté, avec des enregistrements à l'épreuve des plantages et un traitement fidèle des encodages.",
    ],
    stats: [
      { value: "1", label: "exe portable" },
      { value: "0", label: "installateurs" },
      { value: "57", label: "tests" },
      { value: "A4", label: "export PDF" },
    ],
  },
  zh: {
    tagline: "记事本，但长大了。标签页、行号、跨文件查找、PDF 导出。",
    description:
      "Jester 是一个原生 Windows 记事本，带标签页编辑、行号栏、跨文件夹查找和 PDF 导出，全部装在一个便携的 Jester.exe 里，不需要安装。",
    overview:
      "我想要一个我松开鼠标之前就已经打开的记事本，同时还能做记事本拒绝做的那几件事。于是我用 C# 和 WPF、跑在 .NET 9 上做了一个：标签页、行号栏、跨整个文件夹查找，以及通过 QuestPDF 输出干净的 A4 PDF。还有那些丢了才会想起来的小事：会话恢复、最近打开，以及资源管理器右键菜单里的「用 Jester 打开」。它是一个便携可执行文件，运行时已经打包在内，所以没有安装程序，也没有那句「请先安装 .NET」。",
    roleSummary: "只有我：WPF 界面和整套 .NET 9 构建。",
    problemStatement:
      "Windows 记事本太素，住不下去；而完整的编辑器启动起来够你去泡杯咖啡。Jester 就是我真正想要的中间那档：立刻打开，再加上每天都能自证价值的那几个功能。",
    objectives: [
      "立刻启动、保持轻，没有启动画面，也不用预热。",
      "把要紧的功能做进去（标签页、行号、跨文件查找、PDF 导出），其余的放过。",
      "交付一个便携 .exe，在 Windows 10 和 11 上零安装步骤即可运行。",
    ],
    architectureDecisions: [
      "C# 和 WPF 跑在 .NET 9 上，每个标签页的文档状态、编辑区和行号边栏是各自独立、各管一事的组件。",
      "设置和上一次会话以 JSON 保存，所以窗口、标签页和偏好都回到我离开时的样子。",
      "分页 A4 渲染用 QuestPDF，关在自己的导出器里，绝不碰启动路径。",
    ],
    implementationHighlights: [
      "标签页编辑，每个文档各自保有撤销历史和编码，配行号栏与当前行高亮。",
      "跨文件查找会扫过整个文件夹，含过滤和子目录，双击结果直接跳到那一行。",
      "PDF 导出，一个按键就把任意一篇笔记变成干净的分页 A4 文档。",
      "不上台面的那一半：带回环的查找替换、跳转到行、插入日期时间、字体选择、编码与行尾转换，以及一条会告诉你此刻处于哪一种的状态栏。",
    ],
    qualityAndSecurity: [
      "丢弃未保存的内容前它会问一声，注销或关机时也一样；写入是原子的，崩溃不会留给你一个写了一半的文件。",
      "对编码敏感：它会读 UTF-8 和 UTF-16 的 BOM，并按文件原本的编码和行尾原样写回。",
      "57 个测试用例，覆盖文档、编码和查找的逻辑。",
      "自包含且便携，运行时随包，因此从不依赖系统里装了哪个 .NET。",
    ],
    challengesAndSolutions: [
      {
        challenge: "既要让启动保持瞬时，又得背着标签页、查找和 PDF 导出。",
        solution: "我把程序拆成小的 WPF 组件，并把重活儿，尤其是 PDF 渲染，整个挪出启动路径。",
      },
      {
        challenge: "把每个文件按字节原样交回去，编码和行尾都要保住。",
        solution: "打开时检测 BOM，按标签页跟踪编码和行尾，保存时原样写回，不做任何「体贴的」静默转换。",
      },
    ],
    hiringSignals: [
      "在当前的 .NET 9 技术栈上，用 C# 和 WPF 做原生 Windows 桌面开发。",
      "在没人演示的地方也上心：原子保存、崩溃安全、编码保真。",
      "一个桌面应用从头负责到尾，从自定义界面一直到单个便携构建。",
    ],
    nextIterations: [
      "语法高亮，以及一个偏代码的编辑模式。",
      "一个插件或脚本入口，用来接自定义命令。",
      "多光标编辑，以及跨文件更完整的查找替换。",
    ],
    tags: ["C#", "WPF", ".NET 9", "Windows"],
    impactHeading: "这个项目有什么用",
    impactPoints: [
      "给 Windows 用户一个立刻就开、然后让路的记事本。",
      "补上几个进阶功能（标签页、查找、PDF 导出），却不背完整 IDE 的重量。",
      "用抗崩溃的保存和忠实的编码处理，把你的内容守住。",
    ],
    stats: [
      { value: "1", label: "便携 exe" },
      { value: "0", label: "安装程序" },
      { value: "57", label: "测试" },
      { value: "A4", label: "PDF 导出" },
    ],
  },
};
