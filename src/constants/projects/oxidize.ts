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
      "Uninstalls the program, then hunts down everything it forgot to take with it.",
    description:
      "A thorough Windows uninstaller written in Rust: it runs a program's own uninstaller, then finds and removes the registry keys, files, services, tasks and PATH entries it left behind, backing each one up first. Ships as a scriptable CLI and a native egui GUI sharing one engine.",
    overview:
      "Windows' built-in uninstall leaves junk behind constantly: orphaned registry keys, leftover files, and empty folders under AppData, ProgramData and Program Files. So I built Oxidize in Rust, straight against the Win32 API. It reads all three uninstall registry views, runs the program's registered uninstaller (a synchronous msiexec for MSI products), then scans the registry and filesystem for leftovers, labelling each find with a high, medium or low confidence. By default nothing is deleted without a validated .reg backup and file quarantine, and one command puts a removal back. Two binaries, one engine: oxidize for scripts, oxidize-gui if you would rather click. Junk cleaners, browser-trace cleaning and a startup manager are deliberately out of scope, because that is how these tools turn into suites.",
    roleSummary:
      "Just me: the engine, the CLI, the GUI, and the safety net that came before all three.",
    sections: [
      {
        heading: "An uninstaller's exit code is only a hint",
        body: [
          "MSI products are the easy case. Oxidize runs msiexec /x with the product code, which waits and returns an exit code that means something. EXE uninstallers are less honest: many copy themselves to %TEMP%, start that copy and exit at once, so the process I launched reports success while the real uninstall has barely begun.",
          "So completion is checked in the registry. After the launched process exits, Oxidize keeps waiting while the program's uninstall entry still exists and something that looks like its uninstaller is still running, and only calls it done once the entry is gone.",
          "The first version of that check matched running processes by file name, and it could wait for no reason: a Steam game uninstalls through steam.exe, which is running the whole time, and every Squirrel app uninstalls through Update.exe. A process now only counts if it runs from the program's own install folder or is an uninstaller copy under %TEMP%.",
        ],
      },
      {
        heading: "One function is allowed to delete",
        body: [
          "Every removal in Oxidize goes through safety::remove_leftovers, and nothing else in the engine deletes anything. A dry run stops there and changes nothing. If the backup folder cannot be created, the run aborts instead of carrying on without one; deleting permanently takes an explicit --no-backup.",
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
          "Most junk is found after the fact, so oxidize scan works on a program Windows no longer lists, by name alone, and recognises a vendor folder only when you name the publisher. oxidize orphans looks for PATH entries, autostart values, services and scheduled tasks whose executable no longer exists, plus folders no installed program claims. Those folders are a list to look at, since portable tools show up there too.",
          "oxidize trace goes the other way: given a running process or a stray exe, it finds the installed program it belongs to, matching on the install folder first. Store apps are not covered.",
        ],
      },
    ],
    captions: [
      "The Oxidize mark: a thick O, copper on one side and the verdigris it oxidises into on the other.",
    ],
    tags: ["Rust", "Windows", "CLI", "egui", "Systems"],
    stats: [
      { value: "2", label: "front-ends, one engine" },
      { value: "3", label: "registry views scanned" },
      { value: "7", label: "commands" },
      { value: "55", label: "unit tests" },
    ],
  },
  de: {
    tagline:
      "Deinstalliert das Programm und jagt dann alles, was es zurückgelassen hat.",
    description:
      "Ein gründlicher Windows-Deinstallierer in Rust: Er führt den eigenen Uninstaller eines Programms aus und entfernt danach die Registry-Schlüssel, Dateien, Dienste, Aufgaben und PATH-Einträge, die es hinterlassen hat, jeweils mit Backup zuerst. Kommt als skriptbare CLI und als native egui-GUI auf einer Engine.",
    overview:
      "Die eingebaute Deinstallation von Windows lässt ständig Müll zurück: verwaiste Registry-Schlüssel, übrige Dateien und leere Ordner unter AppData, ProgramData und Program Files. Also habe ich Oxidize in Rust gebaut, direkt gegen die Win32-API. Es liest alle drei Uninstall-Registry-Ansichten, führt den registrierten Uninstaller aus (bei MSI-Produkten ein synchrones msiexec) und durchsucht dann Registry und Dateisystem nach Resten, wobei jeder Fund eine hohe, mittlere oder tiefe Sicherheit bekommt. Standardmässig wird nichts gelöscht ohne validiertes .reg-Backup und Datei-Quarantäne, und ein Befehl macht eine Entfernung wieder rückgängig. Zwei Binaries, eine Engine: oxidize für Skripte, oxidize-gui, wenn man lieber klickt. Junk-Cleaner, Browser-Spuren und ein Autostart-Manager sind bewusst ausserhalb des Umfangs, denn genau so werden solche Werkzeuge zu Suiten.",
    roleSummary:
      "Nur ich: die Engine, die CLI, die GUI und das Sicherheitsnetz, das vor allen dreien kam.",
    sections: [
      {
        heading: "Der Exit-Code eines Uninstallers ist nur ein Hinweis",
        body: [
          "MSI-Produkte sind der einfache Fall. Oxidize ruft msiexec /x mit dem Produktcode auf, das wartet und einen Exit-Code liefert, der etwas bedeutet. EXE-Uninstaller sind weniger ehrlich: Viele kopieren sich nach %TEMP%, starten die Kopie und beenden sich sofort, also meldet der Prozess, den ich gestartet habe, Erfolg, während die eigentliche Deinstallation kaum begonnen hat.",
          "Ob sie fertig ist, wird deshalb in der Registry geprüft. Nachdem der gestartete Prozess beendet ist, wartet Oxidize weiter, solange der Uninstall-Eintrag des Programms noch existiert und etwas läuft, das nach seinem Uninstaller aussieht, und erklärt die Sache erst für erledigt, wenn der Eintrag weg ist.",
          "Die erste Version dieser Prüfung erkannte laufende Prozesse am Dateinamen und konnte grundlos warten: Ein Steam-Spiel deinstalliert über steam.exe, das die ganze Zeit läuft, und jede Squirrel-App über Update.exe. Ein Prozess zählt jetzt nur noch, wenn er aus dem Installationsordner des Programms läuft oder eine Uninstaller-Kopie unter %TEMP% ist.",
        ],
      },
      {
        heading: "Nur eine Funktion darf löschen",
        body: [
          "Jede Entfernung in Oxidize läuft über safety::remove_leftovers, und sonst löscht nichts in der Engine irgendetwas. Ein Dry Run hört dort auf und ändert nichts. Lässt sich der Backup-Ordner nicht anlegen, bricht der Lauf ab, statt ohne weiterzumachen; endgültig löschen geht nur mit einem ausdrücklichen --no-backup.",
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
          "Der meiste Müll fällt erst später auf, deshalb funktioniert oxidize scan auch bei einem Programm, das Windows nicht mehr auflistet, allein über den Namen, und erkennt einen Hersteller-Ordner nur, wenn man den Hersteller nennt. oxidize orphans sucht PATH-Einträge, Autostart-Werte, Dienste und geplante Aufgaben, deren Programmdatei nicht mehr existiert, dazu Ordner, die kein installiertes Programm beansprucht. Diese Ordner sind eine Liste zum Anschauen, denn portable Werkzeuge tauchen dort auch auf.",
          "oxidize trace geht den umgekehrten Weg: Zu einem laufenden Prozess oder einer herumliegenden exe findet es das installierte Programm, zu dem sie gehört, zuerst über den Installationsordner. Store-Apps deckt Oxidize nicht ab.",
        ],
      },
    ],
    captions: [
      "Das Oxidize-Zeichen: ein dickes O, auf der einen Seite Kupfer, auf der anderen der Grünspan, zu dem es oxidiert.",
    ],
    tags: ["Rust", "Windows", "CLI", "egui", "Systems"],
    stats: [
      { value: "2", label: "Front-Ends, eine Engine" },
      { value: "3", label: "Registry-Ansichten" },
      { value: "7", label: "Befehle" },
      { value: "55", label: "Unit-Tests" },
    ],
  },
  fr: {
    tagline:
      "Désinstalle le programme, puis traque tout ce qu'il a oublié d'emporter.",
    description:
      "Un désinstalleur Windows minutieux écrit en Rust : il lance le désinstalleur du programme, puis trouve et retire les clés de registre, fichiers, services, tâches et entrées PATH laissés derrière, en sauvegardant chacun d'abord. Livré en CLI scriptable et en GUI egui native, partageant un seul moteur.",
    overview:
      "La désinstallation intégrée de Windows laisse constamment des restes : clés de registre orphelines, fichiers résiduels, dossiers vides sous AppData, ProgramData et Program Files. J'ai donc construit Oxidize en Rust, directement contre l'API Win32. Il lit les trois vues de registre de désinstallation, lance le désinstalleur enregistré du programme (un msiexec synchrone pour les produits MSI), puis parcourt registre et système de fichiers à la recherche des restes, en attribuant à chaque trouvaille une confiance haute, moyenne ou basse. Par défaut, rien n'est supprimé sans une sauvegarde .reg validée et une mise en quarantaine des fichiers, et une seule commande annule une suppression. Deux binaires, un moteur : oxidize pour les scripts, oxidize-gui si vous préférez cliquer. Les nettoyeurs de fichiers temporaires, l'effacement des traces de navigation et un gestionnaire de démarrage sont délibérément hors périmètre, parce que c'est ainsi que ce genre d'outil devient une suite.",
    roleSummary:
      "Moi seul : le moteur, la CLI, la GUI, et le filet de sécurité qui est venu avant les trois.",
    sections: [
      {
        heading: "Le code de sortie d'un désinstalleur n'est qu'un indice",
        body: [
          "Les produits MSI sont le cas facile. Oxidize lance msiexec /x avec le code produit, qui attend et renvoie un code de sortie qui veut dire quelque chose. Les désinstalleurs EXE sont moins francs : beaucoup se copient dans %TEMP%, lancent cette copie et quittent aussitôt, si bien que le processus que j'ai lancé annonce un succès alors que la vraie désinstallation a à peine commencé.",
          "La fin se vérifie donc dans le registre. Une fois le processus lancé terminé, Oxidize continue d'attendre tant que l'entrée de désinstallation du programme existe et que quelque chose qui ressemble à son désinstalleur tourne encore, et ne conclut qu'une fois l'entrée disparue.",
          "La première version de ce contrôle reconnaissait les processus à leur nom de fichier, et pouvait attendre sans raison : un jeu Steam se désinstalle par steam.exe, qui tourne en permanence, et chaque application Squirrel par Update.exe. Un processus ne compte plus que s'il tourne depuis le dossier d'installation du programme ou s'il est une copie de désinstalleur sous %TEMP%.",
        ],
      },
      {
        heading: "Une seule fonction a le droit de supprimer",
        body: [
          "Chaque suppression dans Oxidize passe par safety::remove_leftovers, et rien d'autre dans le moteur ne supprime quoi que ce soit. Un dry run s'arrête là et ne change rien. Si le dossier de sauvegarde ne peut pas être créé, l'exécution s'interrompt au lieu de continuer sans ; supprimer définitivement demande un --no-backup explicite.",
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
          "Un dossier ou une clé d'éditeur peut contenir d'autres produits du même éditeur, alors le scanner y descend et ne le signale jamais en bloc. Il ne part qu'une fois la suppression l'ayant laissé vide. Les dossiers de Windows lui-même, les racines de lecteur et les racines du profil utilisateur sont refusés d'office.",
          "Cette protection compare les chemins comme Windows les lira au moment de supprimer. C:/Windows, C:\\PROGRA~1 et C:\\Windows. désignent tous des dossiers protégés, donc le chemin est résolu vers son vrai nom et débarrassé des barres obliques, du préfixe de longueur étendue et des points et espaces finaux que Windows ignore, avant d'être comparé.",
        ],
      },
      {
        heading: "Les restes de programmes déjà partis",
        body: [
          "La plupart des restes se découvrent après coup, alors oxidize scan fonctionne aussi pour un programme que Windows ne liste plus, par le nom seul, et ne reconnaît un dossier d'éditeur que si l'on nomme l'éditeur. oxidize orphans cherche les entrées PATH, valeurs de démarrage automatique, services et tâches planifiées dont l'exécutable n'existe plus, ainsi que les dossiers qu'aucun programme installé ne réclame. Ces dossiers sont une liste à examiner, car les outils portables y apparaissent aussi.",
          "oxidize trace fait le chemin inverse : à partir d'un processus en cours ou d'un exe égaré, il retrouve le programme installé auquel il appartient, en regardant d'abord le dossier d'installation. Les applications du Store ne sont pas couvertes.",
        ],
      },
    ],
    captions: [
      "Le logo d'Oxidize : un O épais, cuivre d'un côté, et de l'autre le vert-de-gris en lequel il s'oxyde.",
    ],
    tags: ["Rust", "Windows", "CLI", "egui", "Systems"],
    stats: [
      { value: "2", label: "front-ends, un moteur" },
      { value: "3", label: "vues de registre" },
      { value: "7", label: "commandes" },
      { value: "55", label: "tests unitaires" },
    ],
  },
  zh: {
    tagline: "先把程序卸掉，再去追它忘了带走的一切。",
    description:
      "一个用 Rust 写的彻底的 Windows 卸载工具：先跑程序自带的卸载器，再找出并清掉它留下的注册表项、文件、服务、计划任务和 PATH 条目，每一项都先备份。同时提供可脚本化的 CLI 和原生 egui 图形界面，共用同一个引擎。",
    overview:
      "Windows 自带的卸载总在留下垃圾：孤立的注册表项、残余文件，以及 AppData、ProgramData 和 Program Files 下的空文件夹。于是我用 Rust 写了 Oxidize，直接对着 Win32 API。它会读全部三个卸载注册表视图，运行程序注册的卸载器（MSI 产品走同步的 msiexec），然后扫描注册表和文件系统里的残留，并给每一处标上高、中或低的置信度。默认情况下，没有经过校验的 .reg 备份和文件隔离，什么都不会被删，而且一条命令就能把一次删除还原回去。两个可执行文件，一个引擎：oxidize 给脚本用，oxidize-gui 给想点鼠标的人用。垃圾清理、浏览器痕迹清理和启动项管理都刻意不在范围内，因为这类工具正是这样变成「全家桶」的。",
    roleSummary: "只有我：引擎、CLI、图形界面，以及比这三样都更早写好的那道保险。",
    sections: [
      {
        heading: "卸载器的退出码只能当个提示",
        body: [
          "MSI 产品是简单的情况。Oxidize 用产品代码调用 msiexec /x，它会等到结束，返回的退出码也有意义。EXE 卸载器就没那么老实：很多会把自己复制到 %TEMP%，启动那份副本然后立刻退出，于是我启动的进程报告成功，真正的卸载却才刚开始。",
          "所以是否完成要到注册表里去确认。启动的进程退出之后，只要程序的卸载条目还在、而且还有看起来像它卸载器的东西在运行，Oxidize 就继续等，直到条目消失才算完成。",
          "这个检查的第一版按文件名匹配正在运行的进程，结果会白白地等：Steam 游戏通过 steam.exe 卸载，而它一直在运行；每个 Squirrel 应用都通过 Update.exe 卸载。现在只有从程序自己的安装目录运行的进程，或者 %TEMP% 下的卸载器副本，才算数。",
        ],
      },
      {
        heading: "只有一个函数可以删除",
        body: [
          "Oxidize 里的每一次删除都经过 safety::remove_leftovers，引擎里别的地方什么都不删。dry run 在这里就停下，什么都不改。如果备份目录建不起来，这次运行就中止，不会在没有备份的情况下继续；要永久删除，必须明确加上 --no-backup。",
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
          "大多数垃圾都是事后才发现的，所以 oxidize scan 对 Windows 已经不再列出的程序也有效，只凭名称就能扫；只有你给出厂商名，它才会把某个文件夹认作厂商文件夹。oxidize orphans 查找可执行文件已经不存在的 PATH 条目、自启动值、服务和计划任务，以及没有任何已安装程序认领的文件夹。这些文件夹只是一份供人查看的清单，因为便携工具也会出现在里面。",
          "oxidize trace 反过来走：给它一个正在运行的进程或一个来路不明的 exe，它会找出这个文件属于哪个已安装的程序，先按安装目录匹配。应用商店的应用不在覆盖范围内。",
        ],
      },
    ],
    captions: [
      "Oxidize 的标志：一个粗粗的 O，一半是铜，另一半是它氧化后的铜绿。",
    ],
    tags: ["Rust", "Windows", "CLI", "egui", "Systems"],
    stats: [
      { value: "2", label: "前端，一个引擎" },
      { value: "3", label: "注册表视图" },
      { value: "7", label: "条命令" },
      { value: "55", label: "单元测试" },
    ],
  },
};
