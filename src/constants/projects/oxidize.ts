import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const oxidize: Record<Language, LocalizedContent> = {
  en: {
    tagline:
      "Uninstalls the program, then hunts down everything it forgot to take with it.",
    description:
      "A thorough Windows uninstaller written in Rust: it runs a program's own uninstaller, then finds and removes the registry keys and files it left behind, always backing up first. Ships as a scriptable CLI and a native egui GUI sharing one engine.",
    overview:
      "Windows' built-in uninstall leaves junk behind constantly: orphaned registry keys, leftover files, and empty folders under AppData, ProgramData and Program Files. So I built Oxidize in Rust, straight against the Win32 API. It reads all three uninstall registry views, runs the program's registered uninstaller (a synchronous msiexec for MSI products), then scans the registry and filesystem for leftovers, labelling each find HIGH, MED or LOW confidence. Nothing gets deleted without a validated .reg backup and file quarantine. Two binaries, one engine: oxidize-cli for scripts, oxidize-gui if you would rather click. Junk cleaners, browser-trace cleaning and a startup manager are all deliberately out of scope, because that is how these tools turn into suites.",
    roleSummary:
      "Just me: the engine, the CLI, the GUI, and the safety net that came before all three.",
    problemStatement:
      "Windows uninstalls leave junk, and the tools that promise to clean it are bloated suites full of upsells that also want to \"optimize\" half your machine. I wanted a focused, scriptable tool that does exactly one thing thoroughly and safely: remove a program, all of it.",
    objectives: [
      "List every installed program from all three registry views (64-bit, 32-bit WOW6432Node, per-user).",
      "Run the program's own uninstaller, verify it actually finished, then find what it left behind.",
      "Never destroy anything without a validated backup and a way back.",
    ],
    architectureDecisions: [
      "One engine in a Rust library crate with two thin front-ends, a scriptable CLI with JSON output and a native egui window, so every feature lands in both at once.",
      "A single destructive choke point in the safety module: every delete flows through dry-run, backup validation and confirmation before anything happens.",
      "Confidence-scored scanning (HIGH, MED, LOW) with hard denylists for OS and shared locations. Publisher folders get descended into, never deleted wholesale.",
    ],
    implementationHighlights: [
      "WOW64-aware registry work: it reads the 64-bit HKLM, WOW6432Node and HKCU views and addresses every key by its physical path with KEY_WOW64_64KEY.",
      "Uninstall command lines parsed with the real CommandLineToArgvW rules, and completion confirmed by re-checking the registry, because some EXE uninstallers relaunch from %TEMP% and exit early.",
      "Hunter mode traces a running process or a stray exe back to the installed program it belongs to, and can then uninstall it on the spot.",
    ],
    qualityAndSecurity: [
      "Every registry key is exported to a .reg file before deletion, and the export is validated (UTF-16 BOM and header) before the delete is allowed. Restoring is a double-click.",
      "Files go into quarantine, moved to a timestamped backup folder with their original path preserved, rather than being destroyed outright.",
      "Elevation is detected via the TOKEN_ELEVATION token-information class, not a fragile write-probe, with an opt-in UAC relaunch.",
      "25 unit tests and clippy run in CI.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "EXE uninstallers often relaunch a copy of themselves from %TEMP% and exit immediately, so the exit code lies about whether the uninstall actually finished.",
        solution:
          "Treated the exit code as a hint only and confirmed completion by re-checking the program's uninstall registry key.",
      },
      {
        challenge:
          "An overeager leftover scanner is worse than none: one bad match in Program Files or SOFTWARE\\Microsoft could break the machine.",
        solution:
          "Confidence scoring with conservative defaults, hard denylists for OS and shared paths, and descending into shared publisher folders rather than deleting them wholesale.",
      },
    ],
    hiringSignals: [
      "Systems Rust straight against Win32: registry views, tokens, process-to-program mapping, MSI versus EXE uninstall semantics.",
      "I design for failure first. Dry-run, validated backups, quarantine and a single destructive choke point all came before any feature work.",
      "One engine with two front-ends, so the core logic stays reusable and neither UI owns it.",
      "I wrote down what Oxidize is not going to do, which is the only reason it is still one tool.",
    ],
    nextIterations: [
      "A restore subcommand that re-imports a backup directory in one step.",
      "Reading executable version info (CompanyName) to strengthen hunter-mode matching.",
      "A deeper \"Advanced\" scan mode that walks more registry surface for the stubborn cases.",
    ],
    tags: ["Rust", "Windows", "CLI", "egui", "Systems"],
    impactHeading: "What This Project Demonstrates",
    impactPoints: [
      "Leaves a Windows machine actually clean after an uninstall, instead of quietly piling up years of leftovers.",
      "Destructive tooling that stays safe: every action is previewable and every deletion reversible.",
      "One Rust engine serving a scriptable CLI and a native GUI with no duplicated logic.",
    ],
    stats: [
      { value: "2", label: "front-ends, one engine" },
      { value: "3", label: "registry views scanned" },
      { value: "0", label: "deletes without backup" },
      { value: "25", label: "unit tests" },
    ],
  },
  de: {
    tagline:
      "Deinstalliert das Programm und jagt dann alles, was es zurückgelassen hat.",
    description:
      "Ein gründlicher Windows-Deinstallierer in Rust: Er führt den eigenen Uninstaller eines Programms aus und entfernt danach die Registry-Schlüssel und Dateien, die es hinterlassen hat, immer mit Backup zuerst. Kommt als skriptbare CLI und als native egui-GUI auf einer Engine.",
    overview:
      "Die eingebaute Deinstallation von Windows lässt ständig Müll zurück: verwaiste Registry-Schlüssel, übrige Dateien und leere Ordner unter AppData, ProgramData und Program Files. Also habe ich Oxidize in Rust gebaut, direkt gegen die Win32-API. Es liest alle drei Uninstall-Registry-Ansichten, führt den registrierten Uninstaller aus (bei MSI-Produkten ein synchrones msiexec) und durchsucht dann Registry und Dateisystem nach Resten, wobei jeder Fund als HIGH, MED oder LOW eingeordnet wird. Nichts wird gelöscht ohne validiertes .reg-Backup und Datei-Quarantäne. Zwei Binaries, eine Engine: oxidize-cli für Skripte, oxidize-gui, wenn man lieber klickt. Junk-Cleaner, Browser-Spuren und ein Autostart-Manager sind bewusst ausserhalb des Umfangs, denn genau so werden solche Werkzeuge zu Suiten.",
    roleSummary:
      "Nur ich: die Engine, die CLI, die GUI und das Sicherheitsnetz, das vor allen dreien kam.",
    problemStatement:
      "Windows-Deinstallationen lassen Müll zurück, und die Werkzeuge, die aufräumen wollen, sind überladene Suiten voller Upsells, die auch noch die halbe Maschine „optimieren“ möchten. Ich wollte ein fokussiertes, skriptbares Werkzeug, das genau eine Sache gründlich und sicher tut: ein Programm entfernen, und zwar ganz.",
    objectives: [
      "Jedes installierte Programm aus allen drei Registry-Ansichten auflisten (64-Bit, 32-Bit WOW6432Node, per-user).",
      "Den eigenen Uninstaller des Programms ausführen, prüfen, dass er wirklich fertig wurde, und dann finden, was er liegen liess.",
      "Nie etwas zerstören ohne validiertes Backup und einen Weg zurück.",
    ],
    architectureDecisions: [
      "Eine Engine in einer Rust-Library-Crate mit zwei dünnen Front-Ends, einer skriptbaren CLI mit JSON-Ausgabe und einem nativen egui-Fenster, damit jedes Feature in beiden gleichzeitig ankommt.",
      "Ein einziger destruktiver Engpass im Safety-Modul: Jedes Löschen läuft durch Dry-Run, Backup-Validierung und Bestätigung, bevor irgendetwas passiert.",
      "Scannen mit Konfidenz-Bewertung (HIGH, MED, LOW) und harten Denylists für OS- und geteilte Orte. In Publisher-Ordner wird hineingegangen, nie pauschal gelöscht.",
    ],
    implementationHighlights: [
      "WOW64-bewusste Registry-Arbeit: Es liest die 64-Bit-HKLM-, WOW6432Node- und HKCU-Ansichten und adressiert jeden Schlüssel über seinen physischen Pfad mit KEY_WOW64_64KEY.",
      "Uninstall-Kommandozeilen werden mit den echten CommandLineToArgvW-Regeln geparst, und der Abschluss wird durch erneutes Prüfen der Registry bestätigt, weil manche EXE-Uninstaller sich aus %TEMP% neu starten und früh beenden.",
      "Der Hunter-Modus verfolgt einen laufenden Prozess oder eine herumliegende Exe zurück zum installierten Programm und kann es dann direkt deinstallieren.",
    ],
    qualityAndSecurity: [
      "Jeder Registry-Schlüssel wird vor dem Löschen in eine .reg-Datei exportiert, und der Export wird validiert (UTF-16-BOM und Header), bevor das Löschen erlaubt ist. Wiederherstellen ist ein Doppelklick.",
      "Dateien gehen in Quarantäne, verschoben in einen Backup-Ordner mit Zeitstempel und erhaltenem Originalpfad, statt schlicht zerstört zu werden.",
      "Adminrechte werden über die TOKEN_ELEVATION-Token-Information erkannt, nicht über einen fragilen Schreibtest, mit optionalem UAC-Neustart.",
      "25 Unit-Tests und Clippy laufen in der CI.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "EXE-Uninstaller starten oft eine Kopie von sich aus %TEMP% und beenden sich sofort, sodass der Exit-Code darüber lügt, ob die Deinstallation wirklich fertig wurde.",
        solution:
          "Den Exit-Code nur als Hinweis behandelt und den Abschluss durch erneutes Prüfen des Uninstall-Registry-Schlüssels bestätigt.",
      },
      {
        challenge:
          "Ein übereifriger Reste-Scanner ist schlimmer als keiner: Ein falscher Treffer in Program Files oder SOFTWARE\\Microsoft könnte die Maschine zerlegen.",
        solution:
          "Konfidenz-Bewertung mit konservativen Standards, harte Denylists für OS- und geteilte Pfade, und in geteilte Publisher-Ordner hineingehen, statt sie pauschal zu löschen.",
      },
    ],
    hiringSignals: [
      "Systems-Rust direkt gegen Win32: Registry-Ansichten, Tokens, Prozess-zu-Programm-Zuordnung, MSI- gegen EXE-Uninstall-Semantik.",
      "Ich entwerfe zuerst für den Fehlerfall. Dry-Run, validierte Backups, Quarantäne und ein einziger destruktiver Engpass kamen vor jeder Feature-Arbeit.",
      "Eine Engine mit zwei Front-Ends, damit die Kernlogik wiederverwendbar bleibt und keine der beiden UIs sie besitzt.",
      "Ich habe aufgeschrieben, was Oxidize nicht tun wird, und nur deshalb ist es noch ein Werkzeug und keine Suite.",
    ],
    nextIterations: [
      "Ein restore-Unterbefehl, der ein Backup-Verzeichnis in einem Schritt zurückimportiert.",
      "Die Versionsinfos der Executable (CompanyName) lesen, um das Matching im Hunter-Modus zu schärfen.",
      "Ein tieferer „Advanced“-Scan-Modus, der für die hartnäckigen Fälle mehr Registry-Fläche abgeht.",
    ],
    tags: ["Rust", "Windows", "CLI", "egui", "Systems"],
    impactHeading: "Was dieses Projekt zeigt",
    impactPoints: [
      "Hinterlässt eine Windows-Maschine nach einer Deinstallation wirklich sauber, statt still Jahre an Resten anzuhäufen.",
      "Destruktives Werkzeug, das sicher bleibt: Jede Aktion ist vorher sichtbar und jede Löschung umkehrbar.",
      "Eine Rust-Engine, die eine skriptbare CLI und eine native GUI bedient, ohne Logik zu doppeln.",
    ],
    stats: [
      { value: "2", label: "Front-Ends, eine Engine" },
      { value: "3", label: "Registry-Ansichten" },
      { value: "0", label: "Löschungen ohne Backup" },
      { value: "25", label: "Unit-Tests" },
    ],
  },
  fr: {
    tagline:
      "Désinstalle le programme, puis traque tout ce qu'il a oublié d'emporter.",
    description:
      "Un désinstalleur Windows minutieux écrit en Rust : il lance le désinstalleur du programme, puis trouve et retire les clés de registre et les fichiers laissés derrière, toujours avec une sauvegarde d'abord. Livré en CLI scriptable et en GUI egui native, partageant un seul moteur.",
    overview:
      "La désinstallation intégrée de Windows laisse constamment des restes : clés de registre orphelines, fichiers résiduels, dossiers vides sous AppData, ProgramData et Program Files. J'ai donc construit Oxidize en Rust, directement contre l'API Win32. Il lit les trois vues de registre de désinstallation, lance le désinstalleur enregistré du programme (un msiexec synchrone pour les produits MSI), puis parcourt registre et système de fichiers à la recherche des restes, en étiquetant chaque trouvaille en confiance HIGH, MED ou LOW. Rien n'est supprimé sans une sauvegarde .reg validée et une mise en quarantaine des fichiers. Deux binaires, un moteur : oxidize-cli pour les scripts, oxidize-gui si vous préférez cliquer. Les nettoyeurs de fichiers temporaires, l'effacement des traces de navigation et un gestionnaire de démarrage sont délibérément hors périmètre, parce que c'est ainsi que ce genre d'outil devient une suite.",
    roleSummary:
      "Moi seul : le moteur, la CLI, la GUI, et le filet de sécurité qui est venu avant les trois.",
    problemStatement:
      "Les désinstallations Windows laissent des restes, et les outils qui promettent de nettoyer sont des suites gonflées, pleines de ventes additionnelles, qui veulent aussi « optimiser » la moitié de votre machine. Je voulais un outil ciblé et scriptable qui fait exactement une chose, à fond et sans danger : retirer un programme, en entier.",
    objectives: [
      "Lister chaque programme installé depuis les trois vues de registre (64 bits, 32 bits WOW6432Node, par utilisateur).",
      "Lancer le désinstalleur du programme, vérifier qu'il a réellement terminé, puis trouver ce qu'il a laissé.",
      "Ne jamais rien détruire sans une sauvegarde validée et un chemin de retour.",
    ],
    architectureDecisions: [
      "Un moteur dans une crate bibliothèque Rust avec deux front-ends minces, une CLI scriptable à sortie JSON et une fenêtre egui native, pour que chaque fonctionnalité arrive dans les deux d'un coup.",
      "Un unique point de passage destructeur dans le module de sûreté : chaque suppression traverse le dry-run, la validation de sauvegarde et la confirmation avant que quoi que ce soit ne se produise.",
      "Un balayage noté en confiance (HIGH, MED, LOW) avec des listes de refus strictes pour l'OS et les emplacements partagés. On descend dans les dossiers d'éditeur, on ne les supprime jamais en bloc.",
    ],
    implementationHighlights: [
      "Un travail de registre conscient de WOW64 : il lit les vues HKLM 64 bits, WOW6432Node et HKCU, et adresse chaque clé par son chemin physique avec KEY_WOW64_64KEY.",
      "Les lignes de commande de désinstallation sont analysées avec les vraies règles de CommandLineToArgvW, et l'achèvement est confirmé en revérifiant le registre, parce que certains désinstalleurs EXE se relancent depuis %TEMP% et sortent tôt.",
      "Le mode chasseur remonte d'un processus en cours ou d'un exe égaré jusqu'au programme installé auquel il appartient, et peut alors le désinstaller sur place.",
    ],
    qualityAndSecurity: [
      "Chaque clé de registre est exportée dans un fichier .reg avant suppression, et l'export est validé (BOM UTF-16 et en-tête) avant que la suppression soit autorisée. Restaurer est un double-clic.",
      "Les fichiers passent en quarantaine, déplacés dans un dossier de sauvegarde horodaté avec leur chemin d'origine conservé, plutôt que détruits d'emblée.",
      "L'élévation est détectée via la classe d'information de jeton TOKEN_ELEVATION, pas par un fragile test d'écriture, avec relance UAC en option.",
      "25 tests unitaires et clippy tournent en CI.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Les désinstalleurs EXE relancent souvent une copie d'eux-mêmes depuis %TEMP% et sortent immédiatement, si bien que le code de sortie ment sur l'achèvement réel.",
        solution:
          "Traité le code de sortie comme un simple indice et confirmé l'achèvement en revérifiant la clé de registre de désinstallation du programme.",
      },
      {
        challenge:
          "Un scanner de restes trop zélé est pire que rien : une mauvaise correspondance dans Program Files ou SOFTWARE\\Microsoft pourrait casser la machine.",
        solution:
          "Une notation de confiance aux réglages prudents, des listes de refus strictes pour l'OS et les chemins partagés, et une descente dans les dossiers d'éditeur partagés plutôt qu'une suppression en bloc.",
      },
    ],
    hiringSignals: [
      "Du Rust système directement contre Win32 : vues de registre, jetons, correspondance processus vers programme, sémantique de désinstallation MSI contre EXE.",
      "Je conçois d'abord pour l'échec. Dry-run, sauvegardes validées, quarantaine et un unique point de passage destructeur sont arrivés avant toute fonctionnalité.",
      "Un moteur, deux front-ends, si bien que la logique cœur reste réutilisable et qu'aucune des deux interfaces ne la possède.",
      "J'ai écrit ce qu'Oxidize ne fera pas, et c'est la seule raison pour laquelle c'est encore un outil.",
    ],
    nextIterations: [
      "Une sous-commande restore qui réimporte un dossier de sauvegarde en une étape.",
      "Lire les infos de version de l'exécutable (CompanyName) pour affiner la correspondance du mode chasseur.",
      "Un mode de balayage « Avancé » plus profond, qui parcourt davantage de registre pour les cas récalcitrants.",
    ],
    tags: ["Rust", "Windows", "CLI", "egui", "Systems"],
    impactHeading: "Ce que ce projet démontre",
    impactPoints: [
      "Laisse une machine Windows réellement propre après une désinstallation, au lieu d'empiler discrètement des années de restes.",
      "De l'outillage destructeur qui reste sûr : chaque action est prévisualisable et chaque suppression réversible.",
      "Un moteur Rust au service d'une CLI scriptable et d'une GUI native, sans logique dupliquée.",
    ],
    stats: [
      { value: "2", label: "front-ends, un moteur" },
      { value: "3", label: "vues de registre" },
      { value: "0", label: "suppressions sans sauvegarde" },
      { value: "25", label: "tests unitaires" },
    ],
  },
  zh: {
    tagline: "先把程序卸掉，再去追它忘了带走的一切。",
    description:
      "一个用 Rust 写的彻底的 Windows 卸载工具：先跑程序自带的卸载器，再找出并清掉它留下的注册表项和文件，而且总是先备份。同时提供可脚本化的 CLI 和原生 egui 图形界面，共用同一个引擎。",
    overview:
      "Windows 自带的卸载总在留下垃圾：孤立的注册表项、残余文件，以及 AppData、ProgramData 和 Program Files 下的空文件夹。于是我用 Rust 写了 Oxidize，直接对着 Win32 API。它会读全部三个卸载注册表视图，运行程序注册的卸载器（MSI 产品走同步的 msiexec），然后扫描注册表和文件系统里的残留，并把每一处标成 HIGH、MED 或 LOW 置信度。没有经过校验的 .reg 备份和文件隔离，什么都不会被删。两个可执行文件，一个引擎：oxidize-cli 给脚本用，oxidize-gui 给想点鼠标的人用。垃圾清理、浏览器痕迹清理和启动项管理都刻意不在范围内，因为这类工具正是这样变成「全家桶」的。",
    roleSummary: "只有我：引擎、CLI、图形界面，以及比这三样都更早写好的那道保险。",
    problemStatement:
      "Windows 卸载会留下垃圾，而承诺帮你清理的那些工具，往往是塞满推销的臃肿全家桶，顺手还想把你半台机器都「优化」一遍。我想要一个专注、可脚本化的工具，只把一件事做到彻底且安全：把一个程序整个移除。",
    objectives: [
      "从全部三个注册表视图列出每个已安装程序（64 位、32 位 WOW6432Node、按用户）。",
      "运行程序自带的卸载器，确认它真的跑完了，再去找它留下了什么。",
      "没有经过校验的备份和一条退路，就绝不销毁任何东西。",
    ],
    architectureDecisions: [
      "一个引擎放在 Rust 库 crate 里，配两个很薄的前端：可脚本化、带 JSON 输出的 CLI，和一个原生 egui 窗口，这样每个功能一次就落到两边。",
      "所有破坏性操作只有一个咽喉口，在 safety 模块里：每次删除都要先过 dry-run、备份校验和确认，才会真的动手。",
      "带置信度评分的扫描（HIGH、MED、LOW），对系统目录和共享位置有硬性拒绝名单。发行商目录只会往里走，绝不整个删掉。",
    ],
    implementationHighlights: [
      "对 WOW64 有意识的注册表处理：读取 64 位 HKLM、WOW6432Node 和 HKCU 三个视图，并用 KEY_WOW64_64KEY 按物理路径定位每个键。",
      "卸载命令行按 CommandLineToArgvW 的真实规则解析，是否完成则通过重新检查注册表来确认，因为有些 EXE 卸载器会从 %TEMP% 重启一份自己然后提前退出。",
      "猎手模式能从一个正在运行的进程或一个来路不明的 exe，反查到它属于哪个已安装程序，然后就地把它卸掉。",
    ],
    qualityAndSecurity: [
      "每个注册表项在删除前都会导出成 .reg 文件，并在允许删除之前校验这份导出（UTF-16 BOM 和文件头）。恢复只需双击。",
      "文件进隔离区，被移进一个带时间戳的备份目录并保留原路径，而不是直接销毁。",
      "管理员权限通过 TOKEN_ELEVATION 令牌信息类检测，而不是脆弱的写入试探，UAC 重启是可选的。",
      "25 个单元测试和 clippy 在 CI 中运行。",
    ],
    challengesAndSolutions: [
      {
        challenge: "EXE 卸载器常常从 %TEMP% 重启一份自己然后立刻退出，于是退出码会在「到底卸完了没有」这件事上骗你。",
        solution: "把退出码只当成一条线索，改为重新检查程序的卸载注册表项来确认是否真的完成。",
      },
      {
        challenge: "一个过于积极的残留扫描器比没有更糟：在 Program Files 或 SOFTWARE\\Microsoft 里错配一次，就可能把机器弄坏。",
        solution: "置信度评分配上保守的默认值，对系统和共享路径设硬性拒绝名单，共享的发行商目录只往里走，不整个删。",
      },
    ],
    hiringSignals: [
      "直接对着 Win32 的系统级 Rust：注册表视图、令牌、进程到程序的映射、MSI 与 EXE 卸载语义的区别。",
      "我先为失败而设计。dry-run、经校验的备份、隔离区，以及唯一的破坏性咽喉口，都排在任何功能开发之前。",
      "一个引擎两个前端，核心逻辑保持可复用，也不被其中任何一个界面据为己有。",
      "我把 Oxidize 不会做的事写下来了，也只有这样它才还是一个工具。",
    ],
    nextIterations: [
      "一个 restore 子命令，一步把备份目录重新导入。",
      "读取可执行文件的版本信息（CompanyName），把猎手模式的匹配做得更准。",
      "一个更深的「进阶」扫描模式，为那些顽固的情况多走一些注册表。",
    ],
    tags: ["Rust", "Windows", "CLI", "egui", "Systems"],
    impactHeading: "这个项目展示了什么",
    impactPoints: [
      "卸载之后，机器是真的干净，而不是悄悄堆了好几年的残留。",
      "破坏性工具也能保持安全：每一步都能先预览，每一次删除都能撤回。",
      "一个 Rust 引擎同时服务可脚本化的 CLI 和原生图形界面，逻辑不重复一遍。",
    ],
    stats: [
      { value: "2", label: "前端，一个引擎" },
      { value: "3", label: "注册表视图" },
      { value: "0", label: "无备份的删除" },
      { value: "25", label: "单元测试" },
    ],
  },
};
