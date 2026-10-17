import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

const VALIDATE_CODE = `fn validate_reg_file(path: &Path, hive: Hive, subpath: &str) -> Result<()> {
    let bytes = fs::read(path).context("reading backup file")?;
    if bytes.len() < 2 || bytes[0] != 0xFF || bytes[1] != 0xFE {
        bail!("missing UTF-16 LE byte-order mark");
    }
    let text = system::decode_utf16_or_utf8(&bytes).to_lowercase();
    if !text.contains("windows registry editor version 5.00") {
        bail!("missing 'Windows Registry Editor Version 5.00' header");
    }
    let section = format!("[{}\\\\{}]", hive.full_name(), subpath).to_lowercase();
    let at_line_start = text
        .match_indices(&section)
        .any(|(i, _)| i == 0 || text.as_bytes()[i - 1] == b'\\n');
    if !at_line_start {
        bail!(
            "backup does not contain the section [{}\\\\{}]",
            hive.full_name(),
            subpath
        );
    }
    Ok(())
}`;

export const oxidize: Record<Language, LocalizedContent> = {
  en: {
    tagline:
      "A Windows uninstaller that also removes the leftovers, with an undo.",
    description:
      "A thorough Windows uninstaller written in Rust: it closes what still runs from a program's folders, runs its uninstaller where one is needed, then finds and removes the registry keys, files, services, tasks, firewall rules and PATH entries it left behind, backing each one up first. Ships as a scriptable CLI and a native egui GUI sharing one engine.",
    overview:
      "Windows' built-in uninstall leaves junk behind constantly: orphaned registry keys, leftover files, and empty folders under AppData, ProgramData and Program Files. So I built Oxidize in Rust, straight against the Win32 API. It reads all three uninstall registry views and closes whatever still runs from the program's folders. A program installed for one user alone, with no service, firewall rule or machine-wide file or key, it removes by itself; any other program runs its registered uninstaller first (a synchronous msiexec for MSI products). Then it scans the registry and filesystem for leftovers, labelling each find with a high, medium or low confidence. By default no leftover is deleted without a validated .reg backup and file quarantine, and one command puts a removal back. Two binaries, one engine: oxidize for scripts, oxidize-gui if you would rather click. The Clean up tab also clears temporary files, crash dumps, the Recycle Bin, browser caches and what Windows' own tools can reclaim, and leaves recent files, running browsers and protected folders alone. Its Clean slate button clears the lists Windows keeps of what you opened, such as recent items, jump lists and the Run history; the files themselves stay. Browser history, cookies and a startup manager stay out of scope, because that is how these tools turn into suites.",
    roleSummary:
      "Just me: the engine, the CLI, the GUI, and the safety net that came before all three.",
    sections: [
      {
        heading: "An uninstaller's exit code is only a hint",
        body: [
          "MSI products are the easy case. Oxidize runs msiexec /x with the product code, which waits and returns an exit code that means something. EXE uninstallers are less honest: many copy themselves to %TEMP%, start that copy and exit at once, so the process I launched reports success while the real uninstall has barely begun.",
          "So completion is checked in the registry. After the launched process exits, Oxidize keeps waiting while the program's uninstall entry still exists and something that looks like its uninstaller is still running, and only calls it done once the entry is gone.",
          "The first version of that check matched running processes by file name, and it could wait for no reason: a game launcher's games uninstall through the launcher's own exe, which is running the whole time, and every Squirrel app uninstalls through Update.exe. A process now only counts if it runs from the program's own install folder or is an uninstaller copy under %TEMP%.",
        ],
      },
      {
        heading: "Leftovers go through one function",
        body: [
          "Every leftover Oxidize removes goes through safety::remove_leftovers, the folders of removed programs that Clean up finds included. A dry run stops there and changes nothing. If the backup folder cannot be created, the run aborts instead of carrying on without one; deleting permanently takes an explicit --no-backup. Two things delete elsewhere: the guarded Store-app removal, which Windows itself carries out, and the rest of Clean up. Its temporary files, crash dumps, browser caches and Recycle Bin items are deleted directly, each file checked again right before it goes, and they cannot be put back.",
          "Each registry key is exported with reg.exe first, and the export is checked before the key may go. Files and folders are moved into the backup with their original path kept, scheduled task definitions are copied, and a manifest records every step. oxidize restore replays that manifest in reverse, and its dry run checks that each quarantined copy is still there before promising to put it back.",
        ],
        code: {
          language: "rust",
          text: VALIDATE_CODE,
          caption:
            "From backup.rs, with its doc comment left out. A clean exit from reg.exe is not taken as proof of a usable backup: the key is only deleted once its export has the UTF-16 byte-order mark, the version header and a section for exactly that key.",
        },
      },
      {
        heading: "Grading what it finds before touching any of it",
        body: [
          "Every leftover gets a confidence. An exact name match is high, a partial one medium, and a folder no installed program claims is low. --remove takes the high ones only; --medium and --all have to be asked for.",
          "A vendor folder or key can hold other products from the same publisher, so the scanner descends into it and never flags it as a whole. It only goes once the removal has left it empty. Windows' own folders, drive roots and the user profile roots are refused outright.",
          "That guard compares paths the way Windows will read them at delete time. C:/Windows, C:\\PROGRA~1 and C:\\Windows. all name protected folders, so the path is resolved to its real name and stripped of the forward slashes, the extended-length prefix and the trailing dots and spaces Windows ignores before it is compared.",
        ],
      },
      {
        heading: "Leftovers of programs that are already gone",
        body: [
          "Most junk is found after the fact, so oxidize scan works on a program Windows no longer lists, by name alone. It takes the publisher, which tells vendor folders apart, from an earlier removal's backup or from the names Windows cached for the program's files, and needs --publisher only when neither knows it. oxidize orphans looks for PATH entries, autostart values, services and scheduled tasks whose executable no longer exists, plus folders no installed program claims. Those folders are a list to look at, since portable tools show up there too.",
          "oxidize trace goes the other way: given a running process or a stray exe, it finds the installed program it belongs to, matching on the install folder first. Store apps are not covered.",
        ],
      },
    ],
    captions: [
      "The Oxidize window with a set of example programs, sorted by size: 20 programs, 30.2 GB in total. Pick a program to uninstall it and see what it left behind.",
      "The Oxidize mark: a thick O, copper on one side and the verdigris it oxidises into on the other.",
    ],
    tags: ["Rust", "Windows", "CLI", "egui", "Systems"],
    stats: [
      { value: "2", label: "front-ends, one engine" },
      { value: "3", label: "registry views scanned" },
      { value: "9", label: "commands" },
      { value: "321", label: "unit tests" },
    ],
  },
  de: {
    tagline:
      "Ein Windows-Deinstallierer, der auch die Reste entfernt und alles zurückholen kann.",
    description:
      "Ein gründlicher Windows-Deinstallierer in Rust: Er schliesst, was noch aus den Ordnern eines Programms läuft, führt dessen Uninstaller aus, wo einer nötig ist, und entfernt danach die Registry-Schlüssel, Dateien, Dienste, Aufgaben, Firewall-Regeln und PATH-Einträge, die es hinterlassen hat, jeweils mit Backup zuerst. Kommt als skriptbare CLI und als native egui-GUI auf einer Engine.",
    overview:
      "Die eingebaute Deinstallation von Windows lässt ständig Müll zurück: verwaiste Registry-Schlüssel, übrige Dateien und leere Ordner unter AppData, ProgramData und Program Files. Also habe ich Oxidize in Rust gebaut, direkt gegen die Win32-API. Es liest alle drei Uninstall-Registry-Ansichten und schliesst, was noch aus den Ordnern des Programms läuft. Ein Programm, das nur für einen Benutzer installiert ist und weder Dienst noch Firewall-Regel noch maschinenweite Datei oder Schlüssel hat, entfernt es selbst; jedes andere führt zuerst seinen registrierten Uninstaller aus (bei MSI-Produkten ein synchrones msiexec). Danach durchsucht es Registry und Dateisystem nach Resten, wobei jeder Fund eine hohe, mittlere oder tiefe Sicherheit bekommt. Standardmässig wird kein Rest gelöscht ohne validiertes .reg-Backup und Datei-Quarantäne, und ein Befehl macht eine Entfernung wieder rückgängig. Zwei Binaries, eine Engine: oxidize für Skripte, oxidize-gui, wenn man lieber klickt. Der Tab Clean up leert ausserdem temporäre Dateien, Absturzabbilder, den Papierkorb, Browser-Caches und das, was die Windows-eigenen Werkzeuge freigeben können, und lässt neue Dateien, laufende Browser und geschützte Ordner in Ruhe. Sein Knopf Clean slate leert die Listen, die Windows über Geöffnetes führt, etwa zuletzt verwendete Elemente, Sprunglisten und den Verlauf von Ausführen; die Dateien selbst bleiben. Browserverlauf, Cookies und ein Autostart-Manager bleiben bewusst ausserhalb des Umfangs, denn genau so werden solche Werkzeuge zu Suiten.",
    roleSummary:
      "Nur ich: die Engine, die CLI, die GUI und das Sicherheitsnetz, das vor allen dreien kam.",
    sections: [
      {
        heading: "Der Exit-Code eines Uninstallers ist nur ein Hinweis",
        body: [
          "MSI-Produkte sind der einfache Fall. Oxidize ruft msiexec /x mit dem Produktcode auf, das wartet und einen Exit-Code liefert, der etwas bedeutet. EXE-Uninstaller sind weniger ehrlich: Viele kopieren sich nach %TEMP%, starten die Kopie und beenden sich sofort, also meldet der Prozess, den ich gestartet habe, Erfolg, während die eigentliche Deinstallation kaum begonnen hat.",
          "Ob sie fertig ist, wird deshalb in der Registry geprüft. Nachdem der gestartete Prozess beendet ist, wartet Oxidize weiter, solange der Uninstall-Eintrag des Programms noch existiert und etwas läuft, das nach seinem Uninstaller aussieht, und erklärt die Sache erst für erledigt, wenn der Eintrag weg ist.",
          "Die erste Version dieser Prüfung erkannte laufende Prozesse am Dateinamen und konnte grundlos warten: Die Spiele eines Spiele-Launchers deinstallieren über die exe des Launchers, die die ganze Zeit läuft, und jede Squirrel-App über Update.exe. Ein Prozess zählt jetzt nur noch, wenn er aus dem Installationsordner des Programms läuft oder eine Uninstaller-Kopie unter %TEMP% ist.",
        ],
      },
      {
        heading: "Reste laufen über eine Funktion",
        body: [
          "Jeder Rest, den Oxidize entfernt, läuft über safety::remove_leftovers, auch die Ordner entfernter Programme, die Clean up findet. Ein Dry Run hört dort auf und ändert nichts. Lässt sich der Backup-Ordner nicht anlegen, bricht der Lauf ab, statt ohne weiterzumachen; endgültig löschen geht nur mit einem ausdrücklichen --no-backup. Anderswo löschen nur zwei Dinge: die abgesicherte Entfernung von Store-Apps, die Windows selbst ausführt, und der Rest von Clean up. Seine temporären Dateien, Absturzabbilder, Browser-Caches und Elemente im Papierkorb werden direkt gelöscht, jede Datei wird unmittelbar davor noch einmal geprüft, und zurückholen lassen sie sich nicht.",
          "Jeder Registry-Schlüssel wird zuerst mit reg.exe exportiert, und der Export wird geprüft, bevor der Schlüssel weg darf. Dateien und Ordner werden mit ihrem ursprünglichen Pfad ins Backup verschoben, Definitionen geplanter Aufgaben werden kopiert, und ein Manifest hält jeden Schritt fest. oxidize restore spielt dieses Manifest rückwärts ab, und sein Dry Run prüft, ob jede Kopie in der Quarantäne noch da ist, bevor er verspricht, sie zurückzulegen.",
        ],
        code: {
          language: "rust",
          text: VALIDATE_CODE,
          caption:
            "Aus backup.rs, ohne den Doc-Kommentar. Ein sauberer Exit von reg.exe gilt nicht als Beweis für ein brauchbares Backup: Der Schlüssel wird erst gelöscht, wenn sein Export das UTF-16-Byte-Order-Mark, den Versions-Header und einen Abschnitt für genau diesen Schlüssel hat.",
        },
      },
      {
        heading: "Erst einstufen, dann anfassen",
        body: [
          "Jeder Rest bekommt eine Sicherheit. Ein exakter Namenstreffer ist hoch, ein teilweiser mittel, und ein Ordner, den kein installiertes Programm beansprucht, tief. --remove nimmt nur die hohen; --medium und --all muss man ausdrücklich verlangen.",
          "Ein Hersteller-Ordner oder -Schlüssel kann weitere Produkte desselben Herstellers enthalten, also steigt der Scanner hinein und markiert ihn nie als Ganzes. Er verschwindet erst, wenn die Entfernung ihn leer zurückgelassen hat. Die Ordner von Windows selbst, Laufwerkswurzeln und die Wurzeln des Benutzerprofils werden rundweg verweigert.",
          "Dieser Schutz vergleicht Pfade so, wie Windows sie beim Löschen liest. C:/Windows, C:\\PROGRA~1 und C:\\Windows. benennen alle geschützte Ordner, also wird der Pfad auf seinen echten Namen aufgelöst und von Schrägstrichen, dem Extended-Length-Präfix und den Punkten und Leerzeichen am Ende befreit, die Windows ignoriert, bevor er verglichen wird.",
        ],
      },
      {
        heading: "Reste von Programmen, die schon weg sind",
        body: [
          "Der meiste Müll fällt erst später auf, deshalb funktioniert oxidize scan auch bei einem Programm, das Windows nicht mehr auflistet, allein über den Namen. Den Hersteller, an dem es Hersteller-Ordner erkennt, nimmt es aus dem Backup einer früheren Entfernung oder aus den Namen, die Windows für die Dateien des Programms zwischengespeichert hat; --publisher braucht es nur, wenn keine der beiden Quellen ihn kennt. oxidize orphans sucht PATH-Einträge, Autostart-Werte, Dienste und geplante Aufgaben, deren Programmdatei nicht mehr existiert, dazu Ordner, die kein installiertes Programm beansprucht. Diese Ordner sind eine Liste zum Anschauen, denn portable Werkzeuge tauchen dort auch auf.",
          "oxidize trace geht den umgekehrten Weg: Zu einem laufenden Prozess oder einer herumliegenden exe findet es das installierte Programm, zu dem sie gehört, zuerst über den Installationsordner. Store-Apps deckt Oxidize nicht ab.",
        ],
      },
    ],
    captions: [
      "Das Oxidize-Fenster mit einer Reihe von Beispielprogrammen, nach Grösse sortiert: 20 Programme, 30,2 GB insgesamt. Ein Programm wählen, um es zu deinstallieren und zu sehen, was es zurückgelassen hat.",
      "Das Oxidize-Zeichen: ein dickes O, auf der einen Seite Kupfer, auf der anderen der Grünspan, zu dem es oxidiert.",
    ],
    tags: ["Rust", "Windows", "CLI", "egui", "Systems"],
    stats: [
      { value: "2", label: "Front-Ends, eine Engine" },
      { value: "3", label: "Registry-Ansichten" },
      { value: "9", label: "Befehle" },
      { value: "321", label: "Unit-Tests" },
    ],
  },
  fr: {
    tagline:
      "Un désinstalleur Windows qui retire aussi les restes, et sait tout annuler.",
    description:
      "Un désinstalleur Windows minutieux écrit en Rust : il ferme ce qui tourne encore depuis les dossiers du programme, lance son désinstalleur quand il en faut un, puis trouve et retire les clés de registre, fichiers, services, tâches, règles de pare-feu et entrées PATH laissés derrière, en sauvegardant chacun d'abord. Livré en CLI scriptable et en GUI egui native, partageant un seul moteur.",
    overview:
      "La désinstallation intégrée de Windows laisse constamment des restes : clés de registre orphelines, fichiers résiduels, dossiers vides sous AppData, ProgramData et Program Files. J'ai donc construit Oxidize en Rust, directement contre l'API Win32. Il lit les trois vues de registre de désinstallation et ferme ce qui tourne encore depuis les dossiers du programme. Un programme installé pour un seul utilisateur, sans service, règle de pare-feu ni fichier ou clé à l'échelle de la machine, il le retire lui-même ; tout autre programme lance d'abord son désinstalleur enregistré (un msiexec synchrone pour les produits MSI). Ensuite il parcourt registre et système de fichiers à la recherche des restes, en attribuant à chaque trouvaille une confiance haute, moyenne ou basse. Par défaut, aucun reste n'est supprimé sans une sauvegarde .reg validée et une mise en quarantaine des fichiers, et une seule commande annule une suppression. Deux binaires, un moteur : oxidize pour les scripts, oxidize-gui si vous préférez cliquer. L'onglet Clean up vide aussi les fichiers temporaires, les vidages de plantage, la Corbeille, les caches des navigateurs et ce que les outils de Windows peuvent libérer, en laissant de côté les fichiers récents, les navigateurs ouverts et les dossiers protégés. Son bouton Clean slate vide les listes que Windows tient de ce que vous avez ouvert, comme les éléments récents, les listes de raccourcis et l'historique d'Exécuter ; les fichiers eux-mêmes restent. L'historique de navigation, les cookies et un gestionnaire de démarrage restent délibérément hors périmètre, parce que c'est ainsi que ce genre d'outil devient une suite.",
    roleSummary:
      "Moi seul : le moteur, la CLI, la GUI, et le filet de sécurité qui est venu avant les trois.",
    sections: [
      {
        heading: "Le code de sortie d'un désinstalleur n'est qu'un indice",
        body: [
          "Les produits MSI sont le cas facile. Oxidize lance msiexec /x avec le code produit, qui attend et renvoie un code de sortie qui veut dire quelque chose. Les désinstalleurs EXE sont moins francs : beaucoup se copient dans %TEMP%, lancent cette copie et quittent aussitôt, si bien que le processus que j'ai lancé annonce un succès alors que la vraie désinstallation a à peine commencé.",
          "La fin se vérifie donc dans le registre. Une fois le processus lancé terminé, Oxidize continue d'attendre tant que l'entrée de désinstallation du programme existe et que quelque chose qui ressemble à son désinstalleur tourne encore, et ne conclut qu'une fois l'entrée disparue.",
          "La première version de ce contrôle reconnaissait les processus à leur nom de fichier, et pouvait attendre sans raison : les jeux d'un lanceur se désinstallent par l'exe du lanceur, qui tourne en permanence, et chaque application Squirrel par Update.exe. Un processus ne compte plus que s'il tourne depuis le dossier d'installation du programme ou s'il est une copie de désinstalleur sous %TEMP%.",
        ],
      },
      {
        heading: "Les restes passent par une seule fonction",
        body: [
          "Chaque reste que retire Oxidize passe par safety::remove_leftovers, y compris les dossiers de programmes supprimés que trouve Clean up. Un dry run s'arrête là et ne change rien. Si le dossier de sauvegarde ne peut pas être créé, l'exécution s'interrompt au lieu de continuer sans ; supprimer définitivement demande un --no-backup explicite. Deux choses seulement suppriment ailleurs : la suppression encadrée des applications du Store, que Windows exécute lui-même, et le reste de Clean up. Ses fichiers temporaires, vidages de plantage, caches de navigateur et éléments de la Corbeille sont supprimés directement, chaque fichier étant vérifié une dernière fois juste avant, et ils ne peuvent pas être restaurés.",
          "Chaque clé de registre est d'abord exportée avec reg.exe, et l'export est vérifié avant que la clé puisse partir. Fichiers et dossiers sont déplacés dans la sauvegarde avec leur chemin d'origine, les définitions de tâches planifiées sont copiées, et un manifeste consigne chaque étape. oxidize restore rejoue ce manifeste à l'envers, et son dry run vérifie que chaque copie en quarantaine est toujours là avant de promettre de la remettre en place.",
        ],
        code: {
          language: "rust",
          text: VALIDATE_CODE,
          caption:
            "Tiré de backup.rs, sans son commentaire de documentation. Une sortie propre de reg.exe ne vaut pas preuve d'une sauvegarde utilisable : la clé n'est supprimée qu'une fois que son export porte l'indicateur d'ordre des octets UTF-16, l'en-tête de version et une section pour exactement cette clé.",
        },
      },
      {
        heading: "Classer ce qu'il trouve avant d'y toucher",
        body: [
          "Chaque reste reçoit une confiance. Une correspondance exacte du nom est haute, une correspondance partielle moyenne, et un dossier qu'aucun programme installé ne réclame est bas. --remove ne prend que les hauts ; --medium et --all doivent être demandés.",
          "Un dossier ou une clé d'éditeur peut contenir d'autres produits du même éditeur, alors le scanner y descend et ne le signale jamais en bloc. Il ne part qu'une fois que la suppression l'a laissé vide. Les dossiers de Windows lui-même, les racines de lecteur et les racines du profil utilisateur sont refusés d'office.",
          "Cette protection compare les chemins comme Windows les lira au moment de supprimer. C:/Windows, C:\\PROGRA~1 et C:\\Windows. désignent tous des dossiers protégés, donc le chemin est résolu vers son vrai nom et débarrassé des barres obliques, du préfixe de longueur étendue et des points et espaces finaux que Windows ignore, avant d'être comparé.",
        ],
      },
      {
        heading: "Les restes de programmes déjà partis",
        body: [
          "La plupart des restes se découvrent après coup, alors oxidize scan fonctionne aussi pour un programme que Windows ne liste plus, par le nom seul. L'éditeur, qui permet de reconnaître ses dossiers, il le tire de la sauvegarde d'une suppression précédente ou des noms que Windows a mis en cache pour les fichiers du programme, et --publisher n'est nécessaire que si aucune des deux sources ne le connaît. oxidize orphans cherche les entrées PATH, valeurs de démarrage automatique, services et tâches planifiées dont l'exécutable n'existe plus, ainsi que les dossiers qu'aucun programme installé ne réclame. Ces dossiers sont une liste à examiner, car les outils portables y apparaissent aussi.",
          "oxidize trace fait le chemin inverse : à partir d'un processus en cours ou d'un exe égaré, il retrouve le programme installé auquel il appartient, en regardant d'abord le dossier d'installation. Les applications du Store ne sont pas couvertes.",
        ],
      },
    ],
    captions: [
      "La fenêtre d'Oxidize avec une série de programmes d'exemple, triés par taille : 20 programmes, 30,2 Go au total. Choisissez un programme pour le désinstaller et voir ce qu'il a laissé derrière lui.",
      "Le logo d'Oxidize : un O épais, cuivre d'un côté, et de l'autre le vert-de-gris en lequel il s'oxyde.",
    ],
    tags: ["Rust", "Windows", "CLI", "egui", "Systems"],
    stats: [
      { value: "2", label: "front-ends, un moteur" },
      { value: "3", label: "vues de registre" },
      { value: "9", label: "commandes" },
      { value: "321", label: "tests unitaires" },
    ],
  },
  zh: {
    tagline: "一个连残留也一并清掉的 Windows 卸载工具，而且随时可以撤销。",
    description:
      "一个用 Rust 写的彻底的 Windows 卸载工具：先关掉还在从程序文件夹里运行的进程，需要时再跑程序自带的卸载器，然后找出并清掉它留下的注册表项、文件、服务、计划任务、防火墙规则和 PATH 条目，每一项都先备份。同时提供可脚本化的 CLI 和原生 egui 图形界面，共用同一个引擎。",
    overview:
      "Windows 自带的卸载总在留下垃圾：孤立的注册表项、残余文件，以及 AppData、ProgramData 和 Program Files 下的空文件夹。于是我用 Rust 写了 Oxidize，直接对着 Win32 API。它会读全部三个卸载注册表视图，并关掉还在从程序文件夹里运行的进程。只为一个用户安装、没有服务、防火墙规则，也没有全机范围文件或注册表项的程序，由它自己直接移除；其他程序则先运行注册的卸载器（MSI 产品走同步的 msiexec）。然后扫描注册表和文件系统里的残留，并给每一处标上高、中或低的置信度。默认情况下，没有经过校验的 .reg 备份和文件隔离，任何残留都不会被删，而且一条命令就能把一次删除还原回去。两个可执行文件，一个引擎：oxidize 给脚本用，oxidize-gui 给想点鼠标的人用。“Clean up”标签页还会清理临时文件、崩溃转储、回收站、浏览器缓存，以及 Windows 自带工具能腾出的空间，同时不碰最近的文件、正在运行的浏览器和受保护的文件夹。其中的“Clean slate”按钮会清空 Windows 记录的打开历史，比如最近使用的项目、跳转列表和“运行”历史；文件本身不受影响。浏览历史、Cookie 和启动项管理仍然刻意不在范围内，因为这类工具正是这样变成「全家桶」的。",
    roleSummary: "只有我：引擎、CLI、图形界面，以及比这三样都更早写好的那道保险。",
    sections: [
      {
        heading: "卸载器的退出码只能当个提示",
        body: [
          "MSI 产品是简单的情况。Oxidize 用产品代码调用 msiexec /x，它会等到结束，返回的退出码也有意义。EXE 卸载器就没那么老实：很多会把自己复制到 %TEMP%，启动那份副本然后立刻退出，于是我启动的进程报告成功，真正的卸载却才刚开始。",
          "所以是否完成要到注册表里去确认。启动的进程退出之后，只要程序的卸载条目还在、而且还有看起来像它卸载器的东西在运行，Oxidize 就继续等，直到条目消失才算完成。",
          "这个检查的第一版按文件名匹配正在运行的进程，结果会白白地等：游戏启动器里的游戏通过启动器自己的 exe 卸载，而它一直在运行；每个 Squirrel 应用都通过 Update.exe 卸载。现在只有从程序自己的安装目录运行的进程，或者 %TEMP% 下的卸载器副本，才算数。",
        ],
      },
      {
        heading: "残留都走同一个函数",
        body: [
          "Oxidize 删除的每一处残留都经过 safety::remove_leftovers，Clean up 找到的已卸载程序的文件夹也一样。dry run 在这里就停下，什么都不改。如果备份目录建不起来，这次运行就中止，不会在没有备份的情况下继续；要永久删除，必须明确加上 --no-backup。只有两样东西在别处删除：受保护检查把关、由 Windows 自己执行的应用商店应用卸载，以及 Clean up 的其余部分。它的临时文件、崩溃转储、浏览器缓存和回收站项目会被直接删除，每个文件在删除前一刻都会再检查一次，删掉之后就无法恢复。",
          "每个注册表项先用 reg.exe 导出，导出文件校验通过后，这个项才允许删除。文件和文件夹连同原始路径一起移进备份，计划任务的定义被复制下来，每一步都记在一份清单里。oxidize restore 把这份清单倒着重放一遍；它的 dry run 会先确认隔离区里的每份副本都还在，才答应把它放回去。",
        ],
        code: {
          language: "rust",
          text: VALIDATE_CODE,
          caption:
            "摘自 backup.rs，省略了文档注释。reg.exe 正常退出并不能证明备份可用：只有当导出文件带有 UTF-16 字节序标记、版本头，以及正好对应这个项的小节时，这个项才会被删除。",
        },
      },
      {
        heading: "动手之前，先给找到的东西分级",
        body: [
          "每一处残留都有一个置信度。名称完全匹配是高，部分匹配是中，没有任何已安装程序认领的文件夹是低。--remove 只处理高的；--medium 和 --all 要明确指定才会生效。",
          "一个厂商文件夹或注册表项里可能还放着同一厂商的其他产品，所以扫描器会往里走，而不会把它整个标出来。只有在删除之后它变空了，它才会一起被删。Windows 自己的文件夹、驱动器根目录和用户配置文件的根目录一律拒绝。",
          "这道保护按 Windows 删除时实际读取路径的方式来比较。C:/Windows、C:\\PROGRA~1 和 C:\\Windows. 指的都是受保护的文件夹，所以比较之前，路径会先解析成真实名称，再去掉正斜杠、长路径前缀，以及 Windows 自己会忽略的末尾句点和空格。",
        ],
      },
      {
        heading: "已经卸掉的程序留下的东西",
        body: [
          "大多数垃圾都是事后才发现的，所以 oxidize scan 对 Windows 已经不再列出的程序也有效，只凭名称就能扫。用来认出厂商文件夹的厂商名，它会从之前一次卸载留下的备份里取，或者从 Windows 为程序文件缓存的名称里取；只有两边都不知道时，才需要 --publisher。oxidize orphans 查找可执行文件已经不存在的 PATH 条目、自启动值、服务和计划任务，以及没有任何已安装程序认领的文件夹。这些文件夹只是一份供人查看的清单，因为便携工具也会出现在里面。",
          "oxidize trace 反过来走：给它一个正在运行的进程或一个来路不明的 exe，它会找出这个文件属于哪个已安装的程序，先按安装目录匹配。应用商店的应用不在覆盖范围内。",
        ],
      },
    ],
    captions: [
      "Oxidize 窗口，列出一组示例程序并按大小排序：20 个程序，共 30.2 GB。选一个程序，就能卸载它并查看它留下了什么。",
      "Oxidize 的标志：一个粗粗的 O，一半是铜，另一半是它氧化后的铜绿。",
    ],
    tags: ["Rust", "Windows", "CLI", "egui", "Systems"],
    stats: [
      { value: "2", label: "前端，一个引擎" },
      { value: "3", label: "注册表视图" },
      { value: "9", label: "条命令" },
      { value: "321", label: "单元测试" },
    ],
  },
};
