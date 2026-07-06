import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const oxidize: Record<Language, LocalizedContent> = {
  en: {
    tagline:
      "Uninstalls the program, then hunts down everything it forgot to take with it.",
    description:
      "A thorough Windows uninstaller written in Rust: it runs a program's own uninstaller, then finds and removes the registry keys and files it left behind — always backing up first. Ships as a scriptable CLI and a native egui GUI sharing one engine.",
    overview:
      "Windows' built-in uninstall leaves junk behind constantly: orphaned registry keys, leftover files, and empty folders under AppData, ProgramData, and Program Files. So I built Oxidize in Rust, straight against the Win32 API. It reads all three uninstall registry views, runs the program's registered uninstaller (a synchronous msiexec for MSI products), then scans the registry and filesystem for leftovers — each one labeled with a HIGH/MED/LOW confidence level. Nothing gets deleted without a validated .reg backup and file quarantine. Two binaries, one engine: oxidize-cli for scripts, oxidize-gui if you'd rather click.",
    roleSummary:
      "Designed it, built it, shipped it — engine, CLI, GUI, safety net. Just me.",
    problemStatement:
      "Windows uninstalls leave junk, and the tools that promise to clean it are bloated suites full of upsells that also want to 'optimize' half your machine. I wanted a focused, scriptable tool that does exactly one thing thoroughly and safely: remove a program, all of it.",
    objectives: [
      "List every installed program from all three registry views (64-bit, 32-bit WOW6432Node, per-user).",
      "Run the program's own uninstaller, verify it actually finished, then find what it left behind.",
      "Never destroy anything without a validated backup and a way back.",
    ],
    architectureDecisions: [
      "One engine in a Rust library crate with two thin front-ends — a scriptable CLI with JSON output and a native egui window — so every feature lands in both at once.",
      "A single destructive choke point in the safety module: every delete flows through dry-run, backup validation, and confirmation before anything happens.",
      "Confidence-scored scanning (HIGH/MED/LOW) with hard denylists for OS and shared locations — publisher folders get descended into, never deleted wholesale.",
    ],
    implementationHighlights: [
      "WOW64-aware registry work: reads the 64-bit HKLM, WOW6432Node, and HKCU views and addresses every key by its physical path with KEY_WOW64_64KEY.",
      "Parses uninstall command lines with the real CommandLineToArgvW rules, and confirms completion by re-checking the registry, because some EXE uninstallers relaunch from %TEMP% and exit early.",
      "Hunter mode traces a running process or a stray exe back to the installed program it belongs to — then can uninstall it on the spot.",
    ],
    qualityAndSecurity: [
      "Every registry key is exported to a .reg file before deletion, and the export is validated (UTF-16 BOM + header) before the delete is allowed; restoring is a double-click.",
      "Files go into quarantine — moved to a timestamped backup folder with their original path preserved — never destroyed outright.",
      "Elevation is detected via the TOKEN_ELEVATION token-information class (not a fragile write-probe), with an opt-in UAC relaunch; unit tests and clippy run in CI.",
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
          "An overeager leftover scanner is worse than none — one bad match in Program Files or SOFTWARE\\Microsoft could break the machine.",
        solution:
          "Confidence scoring with conservative defaults, hard denylists for OS and shared paths, and descending into shared publisher folders instead of deleting them wholesale.",
      },
    ],
    hiringSignals: [
      "Systems Rust straight against Win32: registry views, tokens, process-to-program mapping, MSI vs. EXE uninstall semantics.",
      "I design for failure first: dry-run, validated backups, quarantine, and a single destructive choke point came before any feature work.",
      "One engine, two front-ends: I keep the core logic reusable instead of welding it to a UI.",
    ],
    nextIterations: [
      "A restore subcommand that re-imports a backup directory in one step.",
      "Reading executable version info (CompanyName) to strengthen hunter-mode matching.",
      "A deeper 'Advanced' scan mode that walks more registry surface for the stubborn cases.",
    ],
    tags: ["Rust", "Windows", "CLI", "egui", "Systems"],
    impactHeading: "What This Project Demonstrates",
    impactPoints: [
      "Leaves a Windows machine actually clean after an uninstall, instead of quietly piling up years of leftovers.",
      "Shows destructive tooling can be safe by design: every action previewable, every deletion reversible.",
      "Proves one Rust engine can serve a scriptable CLI and a native GUI without duplicating logic.",
    ],
    stats: [
      { value: "2", label: "front-ends, one engine" },
      { value: "3", label: "registry views scanned" },
      { value: "0", label: "deletes without backup" },
      { value: "5/5", label: "milestones shipped" },
    ],
  },
  de: {
    tagline:
      "Deinstalliert das Programm — und jagt dann alles, was es vergessen hat mitzunehmen.",
    description:
      "Ein gründlicher Windows-Uninstaller in Rust: Er führt den eigenen Uninstaller eines Programms aus und findet und entfernt danach die Registry-Schlüssel und Dateien, die er zurückgelassen hat — immer mit Backup zuerst. Ausgeliefert als skriptbare CLI und natives egui-GUI mit gemeinsamer Engine.",
    overview:
      "Die eingebaute Deinstallation von Windows lässt ständig Müll zurück: verwaiste Registry-Schlüssel, übrig gebliebene Dateien und leere Ordner unter AppData, ProgramData und Program Files. Also habe ich Oxidize gebaut, in Rust, direkt gegen die Win32-API. Es liest alle drei Uninstall-Registry-Sichten, führt den registrierten Uninstaller des Programms aus (bei MSI-Produkten ein synchrones msiexec) und durchsucht danach Registry und Dateisystem nach Überresten — jeder Fund mit einer Konfidenzstufe HIGH/MED/LOW. Gelöscht wird nichts ohne validiertes .reg-Backup und Datei-Quarantäne. Zwei Binaries, eine Engine: oxidize-cli für Skripte, oxidize-gui, wenn man lieber klickt.",
    roleSummary:
      "Entworfen, gebaut, ausgeliefert — Engine, CLI, GUI, Sicherheitsnetz. Nur ich.",
    problemStatement:
      "Windows-Deinstallationen hinterlassen Müll, und die Tools, die das Aufräumen versprechen, sind aufgeblähte Suiten voller Upsells, die nebenbei den halben Rechner 'optimieren' wollen. Ich wollte ein fokussiertes, skriptbares Werkzeug, das genau eine Sache gründlich und sicher erledigt: ein Programm entfernen — restlos.",
    objectives: [
      "Jedes installierte Programm aus allen drei Registry-Sichten auflisten (64-Bit, 32-Bit WOW6432Node, pro Benutzer).",
      "Den eigenen Uninstaller des Programms ausführen, prüfen, ob er wirklich fertig wurde, und dann finden, was er zurückgelassen hat.",
      "Niemals etwas zerstören ohne validiertes Backup und einen Weg zurück.",
    ],
    architectureDecisions: [
      "Eine Engine als Rust-Library-Crate mit zwei schlanken Frontends — eine skriptbare CLI mit JSON-Ausgabe und ein natives egui-Fenster — damit jedes Feature in beiden gleichzeitig landet.",
      "Ein einziger destruktiver Engpass im safety-Modul: Jede Löschung läuft durch Dry-Run, Backup-Validierung und Bestätigung, bevor irgendetwas passiert.",
      "Konfidenz-bewertetes Scannen (HIGH/MED/LOW) mit harten Denylists für Betriebssystem- und geteilte Pfade — in Publisher-Ordner wird hinabgestiegen, nie pauschal gelöscht.",
    ],
    implementationHighlights: [
      "WOW64-bewusste Registry-Arbeit: liest die 64-Bit-HKLM-, die WOW6432Node- und die HKCU-Sicht und adressiert jeden Schlüssel über seinen physischen Pfad mit KEY_WOW64_64KEY.",
      "Parst Uninstall-Kommandozeilen nach den echten CommandLineToArgvW-Regeln und bestätigt den Abschluss per erneutem Registry-Check, weil manche EXE-Uninstaller sich aus %TEMP% neu starten und sofort beenden.",
      "Der Hunter-Modus verfolgt einen laufenden Prozess oder eine herrenlose Exe zurück zum installierten Programm, zu dem sie gehört — und kann es direkt deinstallieren.",
    ],
    qualityAndSecurity: [
      "Jeder Registry-Schlüssel wird vor der Löschung in eine .reg-Datei exportiert, und der Export wird validiert (UTF-16-BOM + Header), bevor die Löschung erlaubt ist; die Wiederherstellung ist ein Doppelklick.",
      "Dateien kommen in Quarantäne — verschoben in einen zeitgestempelten Backup-Ordner mit erhaltenem Originalpfad — statt endgültig zerstört zu werden.",
      "Adminrechte werden über die TOKEN_ELEVATION-Token-Information erkannt (kein fragiler Schreibtest), mit optionalem UAC-Neustart; Unit-Tests und Clippy laufen in der CI.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "EXE-Uninstaller starten oft eine Kopie von sich selbst aus %TEMP% und beenden sich sofort — der Exit-Code lügt also darüber, ob die Deinstallation wirklich fertig ist.",
        solution:
          "Den Exit-Code nur als Hinweis behandelt und den Abschluss durch erneutes Prüfen des Uninstall-Registry-Schlüssels bestätigt.",
      },
      {
        challenge:
          "Ein zu eifriger Überreste-Scanner ist schlimmer als keiner — ein falscher Treffer in Program Files oder SOFTWARE\\Microsoft könnte die Maschine lahmlegen.",
        solution:
          "Konfidenzbewertung mit konservativen Voreinstellungen, harte Denylists für OS- und geteilte Pfade, und Abstieg in geteilte Publisher-Ordner statt pauschalem Löschen.",
      },
    ],
    hiringSignals: [
      "Systemnahes Rust direkt gegen Win32: Registry-Sichten, Tokens, Prozess-zu-Programm-Zuordnung, MSI- vs. EXE-Deinstallationssemantik.",
      "Ich entwerfe zuerst für den Fehlerfall: Dry-Run, validierte Backups, Quarantäne und ein einziger destruktiver Engpass standen vor jedem Feature.",
      "Eine Engine, zwei Frontends: Ich halte die Kernlogik wiederverwendbar, statt sie an eine UI zu schweißen.",
    ],
    nextIterations: [
      "Ein restore-Unterbefehl, der ein Backup-Verzeichnis in einem Schritt zurückspielt.",
      "Versionsinfos der Executables (CompanyName) lesen, um das Matching im Hunter-Modus zu stärken.",
      "Ein tieferer 'Advanced'-Scanmodus, der für hartnäckige Fälle mehr Registry-Oberfläche abläuft.",
    ],
    tags: ["Rust", "Windows", "CLI", "egui", "Systems"],
    impactHeading: "Was dieses Projekt zeigt",
    impactPoints: [
      "Hinterlässt nach einer Deinstallation eine wirklich saubere Windows-Maschine, statt still Jahre an Überresten anzusammeln.",
      "Zeigt, dass destruktives Tooling by design sicher sein kann: jede Aktion vorab einsehbar, jede Löschung umkehrbar.",
      "Beweist, dass eine Rust-Engine eine skriptbare CLI und ein natives GUI bedienen kann, ohne Logik zu duplizieren.",
    ],
    stats: [
      { value: "2", label: "Frontends, eine Engine" },
      { value: "3", label: "Registry-Sichten" },
      { value: "0", label: "Löschungen ohne Backup" },
      { value: "5/5", label: "Meilensteine geliefert" },
    ],
  },
  fr: {
    tagline:
      "Désinstalle le programme, puis traque tout ce qu'il a oublié d'emporter.",
    description:
      "Un désinstalleur Windows minutieux écrit en Rust : il lance le propre désinstalleur d'un programme, puis trouve et supprime les clés de registre et les fichiers laissés derrière — toujours avec une sauvegarde d'abord. Livré en CLI scriptable et en GUI native egui partageant le même moteur.",
    overview:
      "La désinstallation intégrée de Windows laisse sans arrêt des déchets : clés de registre orphelines, fichiers oubliés et dossiers vides sous AppData, ProgramData et Program Files. Alors j'ai construit Oxidize, en Rust, directement contre l'API Win32. Il lit les trois vues de registre de désinstallation, lance le désinstalleur enregistré du programme (un msiexec synchrone pour les produits MSI), puis balaie le registre et le système de fichiers à la recherche de restes — chacun étiqueté d'un niveau de confiance HIGH/MED/LOW. Rien n'est supprimé sans une sauvegarde .reg validée et une quarantaine de fichiers. Deux binaires, un moteur : oxidize-cli pour les scripts, oxidize-gui si tu préfères cliquer.",
    roleSummary:
      "Conçu, construit, livré — moteur, CLI, GUI, filet de sécurité. Juste moi.",
    problemStatement:
      "Les désinstallations Windows laissent des déchets, et les outils qui promettent de nettoyer sont des suites obèses pleines d'upsells qui veulent au passage « optimiser » la moitié de la machine. Je voulais un outil focalisé et scriptable qui fasse exactement une chose, à fond et en sécurité : retirer un programme, en entier.",
    objectives: [
      "Lister chaque programme installé depuis les trois vues de registre (64 bits, 32 bits WOW6432Node, par utilisateur).",
      "Lancer le propre désinstalleur du programme, vérifier qu'il a vraiment terminé, puis trouver ce qu'il a laissé derrière.",
      "Ne jamais rien détruire sans une sauvegarde validée et un moyen de revenir en arrière.",
    ],
    architectureDecisions: [
      "Un moteur dans une crate bibliothèque Rust avec deux front-ends légers — une CLI scriptable avec sortie JSON et une fenêtre native egui — pour que chaque fonctionnalité arrive dans les deux à la fois.",
      "Un unique goulot destructif dans le module safety : chaque suppression passe par le dry-run, la validation de sauvegarde et la confirmation avant que quoi que ce soit n'arrive.",
      "Un scan à niveaux de confiance (HIGH/MED/LOW) avec des denylists strictes pour les emplacements OS et partagés — on descend dans les dossiers d'éditeurs, on ne les supprime jamais en bloc.",
    ],
    implementationHighlights: [
      "Un travail de registre conscient de WOW64 : lit les vues HKLM 64 bits, WOW6432Node et HKCU, et adresse chaque clé par son chemin physique avec KEY_WOW64_64KEY.",
      "Parse les lignes de commande de désinstallation selon les vraies règles de CommandLineToArgvW, et confirme la fin par une relecture du registre, car certains désinstalleurs EXE se relancent depuis %TEMP% et quittent aussitôt.",
      "Le mode hunter remonte d'un processus en cours ou d'un exe égaré jusqu'au programme installé auquel il appartient — puis peut le désinstaller dans la foulée.",
    ],
    qualityAndSecurity: [
      "Chaque clé de registre est exportée en fichier .reg avant suppression, et l'export est validé (BOM UTF-16 + en-tête) avant d'autoriser la suppression ; la restauration tient en un double-clic.",
      "Les fichiers partent en quarantaine — déplacés dans un dossier de sauvegarde horodaté, chemin d'origine préservé — jamais détruits directement.",
      "L'élévation est détectée via la classe d'information de jeton TOKEN_ELEVATION (pas un fragile test d'écriture), avec relance UAC en option ; tests unitaires et clippy tournent en CI.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Les désinstalleurs EXE relancent souvent une copie d'eux-mêmes depuis %TEMP% et quittent immédiatement — le code de sortie ment donc sur la fin réelle de la désinstallation.",
        solution:
          "Traité le code de sortie comme un simple indice et confirmé l'achèvement en revérifiant la clé de registre de désinstallation du programme.",
      },
      {
        challenge:
          "Un scanner de restes trop zélé est pire que pas de scanner du tout — une seule mauvaise correspondance dans Program Files ou SOFTWARE\\Microsoft pourrait casser la machine.",
        solution:
          "Notation par confiance avec des défauts conservateurs, denylists strictes pour les chemins OS et partagés, et descente dans les dossiers d'éditeurs partagés au lieu de les supprimer en bloc.",
      },
    ],
    hiringSignals: [
      "Du Rust système directement contre Win32 : vues de registre, jetons, mappage processus → programme, sémantique de désinstallation MSI vs EXE.",
      "Je conçois d'abord pour la panne : dry-run, sauvegardes validées, quarantaine et un unique goulot destructif sont arrivés avant toute fonctionnalité.",
      "Un moteur, deux front-ends : je garde la logique cœur réutilisable au lieu de la souder à une UI.",
    ],
    nextIterations: [
      "Une sous-commande restore qui réimporte un dossier de sauvegarde en une étape.",
      "Lire les informations de version des exécutables (CompanyName) pour renforcer le matching du mode hunter.",
      "Un mode de scan « Advanced » plus profond qui parcourt davantage de surface de registre pour les cas coriaces.",
    ],
    tags: ["Rust", "Windows", "CLI", "egui", "Systems"],
    impactHeading: "Ce que ce projet démontre",
    impactPoints: [
      "Laisse une machine Windows réellement propre après une désinstallation, au lieu d'accumuler en silence des années de restes.",
      "Montre qu'un outil destructif peut être sûr par conception : chaque action prévisualisable, chaque suppression réversible.",
      "Prouve qu'un seul moteur Rust peut servir une CLI scriptable et une GUI native sans dupliquer la logique.",
    ],
    stats: [
      { value: "2", label: "front-ends, un moteur" },
      { value: "3", label: "vues de registre scannées" },
      { value: "0", label: "suppression sans sauvegarde" },
      { value: "5/5", label: "jalons livrés" },
    ],
  },
  zh: {
    tagline: "卸载程序，然后把它忘了带走的东西一件件揪出来。",
    description:
      "一款用 Rust 编写的彻底的 Windows 卸载器：先运行程序自带的卸载器，再找出并清除它留下的注册表键和文件——动手前必先备份。以共享同一引擎的可脚本化 CLI 和原生 egui 图形界面发布。",
    overview:
      "Windows 自带的卸载总会留下垃圾：孤立的注册表键、残留文件，以及 AppData、ProgramData 和 Program Files 下的空文件夹。所以我用 Rust 直接面向 Win32 API 写了 Oxidize。它读取全部三个卸载注册表视图，运行程序注册的卸载器（MSI 产品用同步的 msiexec），然后扫描注册表和文件系统寻找残留——每一项都标注 HIGH/MED/LOW 置信度。没有经过验证的 .reg 备份和文件隔离区，任何东西都不会被删除。两个二进制文件，一个引擎：oxidize-cli 用于脚本，oxidize-gui 留给想点鼠标的时候。",
    roleSummary: "我设计、我构建、我发布——引擎、CLI、GUI、安全网。就我一个人。",
    problemStatement:
      "Windows 的卸载会留下垃圾，而号称能清理的工具都是塞满推销的臃肿套件，顺手还想'优化'半台机器。我想要一个专注、可脚本化的工具，只把一件事做彻底、做安全：把一个程序连根移除。",
    objectives: [
      "从全部三个注册表视图（64 位、32 位 WOW6432Node、按用户）列出每一个已安装的程序。",
      "运行程序自带的卸载器，验证它确实完成了，然后找出它留下了什么。",
      "没有经过验证的备份和一条回头路，绝不销毁任何东西。",
    ],
    architectureDecisions: [
      "引擎做成一个 Rust 库 crate，配两个轻薄前端——支持 JSON 输出、可脚本化的 CLI 和原生 egui 窗口——每个功能同时落地到两边。",
      "safety 模块里只有一个破坏性总闸：每次删除都要先经过 dry-run、备份验证和确认，才允许发生。",
      "带置信度评分的扫描（HIGH/MED/LOW），加上针对操作系统和共享路径的硬性排除清单——对厂商共享文件夹只深入查找，绝不整个删除。",
    ],
    implementationHighlights: [
      "感知 WOW64 的注册表处理：读取 HKLM 64 位、WOW6432Node 和 HKCU 视图，并用 KEY_WOW64_64KEY 按物理路径寻址每个键。",
      "按真正的 CommandLineToArgvW 规则解析卸载命令行，并通过复查注册表来确认完成——因为有些 EXE 卸载器会从 %TEMP% 重启一份副本然后立刻退出。",
      "Hunter 模式能从一个正在运行的进程或一个来路不明的 exe 追溯到它所属的已安装程序——然后当场卸载它。",
    ],
    qualityAndSecurity: [
      "每个注册表键在删除前都会导出为 .reg 文件，且导出经过验证（UTF-16 BOM + 文件头）后才允许删除；恢复只需双击。",
      "文件进入隔离区——移动到带时间戳、保留原始路径的备份文件夹——而不是直接销毁。",
      "通过 TOKEN_ELEVATION 令牌信息类检测管理员权限（而不是脆弱的写入试探），可选 UAC 重启；单元测试和 clippy 在 CI 中运行。",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "EXE 卸载器常常从 %TEMP% 重启一份自己的副本然后立即退出——退出码因此谎报卸载是否真正完成。",
        solution: "只把退出码当作参考，通过复查程序的卸载注册表键来确认真正完成。",
      },
      {
        challenge:
          "过于激进的残留扫描器比没有更糟——在 Program Files 或 SOFTWARE\\Microsoft 里错删一项就可能弄坏整台机器。",
        solution:
          "置信度评分配合保守的默认值、针对系统与共享路径的硬性排除清单，并对共享的厂商文件夹深入查找而不是整个删除。",
      },
    ],
    hiringSignals: [
      "直接面向 Win32 的系统级 Rust：注册表视图、令牌、进程到程序的映射、MSI 与 EXE 的卸载语义。",
      "我先为失败设计：dry-run、经过验证的备份、隔离区和唯一的破坏性总闸，都排在任何功能之前。",
      "一个引擎、两个前端：我让核心逻辑保持可复用，而不是把它焊死在某个界面上。",
    ],
    nextIterations: [
      "一个 restore 子命令，一步就把备份目录导回去。",
      "读取可执行文件的版本信息（CompanyName），强化 hunter 模式的匹配。",
      "更深入的'Advanced'扫描模式，为顽固案例走查更多注册表面。",
    ],
    tags: ["Rust", "Windows", "CLI", "egui", "系统级"],
    impactHeading: "本项目展示了什么",
    impactPoints: [
      "让 Windows 机器在卸载后真正干净，而不是悄悄积累多年的残留。",
      "证明破坏性工具可以在设计层面就做到安全：每个动作可预览，每次删除可撤销。",
      "证明一个 Rust 引擎可以同时支撑可脚本化的 CLI 和原生 GUI，而不用复制逻辑。",
    ],
    stats: [
      { value: "2", label: "前端，一个引擎" },
      { value: "3", label: "注册表视图" },
      { value: "0", label: "无备份删除" },
      { value: "5/5", label: "里程碑已交付" },
    ],
  },
};
