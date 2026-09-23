import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

const RECOVER_CODE = `let temporary = path.with_extension("json.new");
let written = std::fs::File::create(&temporary).and_then(|mut file| {
    use std::io::Write as _;
    file.write_all(&bytes)?;
    file.sync_all()
});
if let Err(e) = written {
    tracing::error!(error = %e, "could not write the off screen record");
    let _ = std::fs::remove_file(&temporary);
    return;
}
if let Err(e) = std::fs::rename(&temporary, path) {
    tracing::error!(error = %e, "could not replace the off screen record");
    let _ = std::fs::remove_file(&temporary);
}`;

const en: LocalizedContent = {
  tagline: "A tiling window manager for Windows that always gives the desktop back.",
  description:
    "A tiling window manager for Windows, written in Rust. It tiles real windows, binds its own keys, and puts the desktop back exactly as it found it, even after a crash.",
  overview:
    "Mochi arranges every window on the screen into tiles and lets you move between them from the keyboard. I wrote it from scratch in Rust: seven crates, a pure core with no Win32 in it at all, and a daemon where one thread owns all the state and talks to Windows. It does layouts, workspaces, multiple monitors, rules, borders, transparency and animated moves, and every setting can be changed by a command that takes effect the moment it lands.",
  roleSummary: "Just me: the design, the Win32 layer and the test harness.",
  sections: [
    {
      heading: "It hides windows, so it has to be able to find them again",
      body: [
        "A tiling window manager takes windows off the screen all the time, whenever you switch workspace. That is the one thing Mochi does that outlives the process: if it gets killed while a window is hidden, the window stays hidden and you have no way to bring it back.",
        "So every change to the hidden set is written to a small file, and the next start puts those windows back before it does anything else. Windows reuses handles, so an entry is only trusted if the window still exists and still belongs to the same process and class.",
        "The file itself is written to a temporary name, flushed to disk and then renamed into place. A plain write truncates first, and a power cut halfway through would leave a record that does not parse and windows that nothing names anymore.",
      ],
      code: {
        language: "rust",
        text: RECOVER_CODE,
        caption:
          "From recover.rs, with its comments left out. Flushed before the rename, because NTFS journals the rename but not the data, so without sync_all a power cut can leave a correctly named file full of zeros.",
      },
    },
    {
      heading: "Tested on a real desktop, not only in memory",
      body: [
        "At the heart of Mochi is a pure core that knows nothing about Windows, so layouts, workspaces and rules are unit tested like any other library. That was never going to be enough for a program whose whole job is moving real windows.",
        "The end-to-end suite opens throwaway windows, injects real key presses and checks where the windows actually ended up. CI runs it, and the job fails if those tests skip, because a test that returns early still reports as passed.",
        "Then I ran it on my own desktop. The first supervised trial found a defect no test could have: every real application gets cloaked through the shell, and that path had never run once in a test, because the throwaway windows fell back to plain hiding. It is fixed and covered now, which is the argument for running software and not only testing it.",
      ],
    },
    {
      heading: "One key to stop, one key to leave",
      body: [
        "A tiling window manager rearranges every window on screen the moment it starts, so the way out matters more than the way in. Pause turns tiling off and leaves every window where it is; pressing it again puts them back in their tiles. Alt, Shift and E stops Mochi completely, shows every window it was hiding, takes the borders down and unbinds the keys.",
        "It binds keys itself, in process, with no second program to install. The arrow keys are deliberately left alone: Alt with an arrow is Back and Forward in every browser and the parent folder in Explorer, and taking that away everywhere with nothing on screen to explain it is not a fair trade. Game mode suspends every binding but one, so a game gets the whole keyboard.",
      ],
    },
    {
      heading: "Borders, and nothing else",
      body: [
        "Mochi draws a border around the focused window and nothing more. No bar, no tab strip, and none is planned. What it has instead is a way to explain itself: when a window is not being tiled and it is not obvious why, mochic why says what Mochi makes of that window and what can be done about it, in words rather than log terms.",
        "It runs as a normal user and asks for no admin rights. Windows will not let it move a window that belongs to an elevated program, so Mochi notices, says so once in the log and leaves that window alone instead of tiling around a hole it cannot fill.",
      ],
    },
  ],
  captions: [
      "The Mochi mark: three windows the way its default layout tiles them, one tall on the left and two stacked on the right.",
    ],
  tags: ["Rust", "Win32", "Windows", "Systems"],
  stats: [
    { value: "7", label: "crates" },
    { value: "965", label: "tests", liveTests: "mochi" },
    { value: "0", label: "admin rights" },
    { value: "1", label: "key to stop" },
  ],
};


const de: LocalizedContent = {
  tagline: "Ein Tiling-Fenstermanager für Windows, der den Desktop immer zurückgibt.",
  description:
    "Ein Tiling-Fenstermanager für Windows, geschrieben in Rust. Er kachelt echte Fenster, belegt seine eigenen Tasten und stellt den Desktop genau so wieder her, wie er ihn vorgefunden hat, auch nach einem Absturz.",
  overview:
    "Mochi ordnet jedes Fenster auf dem Bildschirm in Kacheln an und lässt dich mit der Tastatur zwischen ihnen wechseln. Ich habe ihn von Grund auf in Rust geschrieben: sieben Crates, ein reiner Kern ganz ohne Win32 und ein Daemon, in dem ein einziger Thread den ganzen Zustand besitzt und mit Windows spricht. Er kann Layouts, Arbeitsbereiche, mehrere Monitore, Regeln, Rahmen, Transparenz und animierte Verschiebungen, und jede Einstellung lässt sich mit einem Befehl ändern, der wirkt, sobald er ankommt.",
  roleSummary: "Nur ich: das Design, die Win32-Schicht und die Testumgebung.",
  sections: [
    {
      heading: "Er versteckt Fenster, also muss er sie wiederfinden können",
      body: [
        "Ein Tiling-Fenstermanager nimmt ständig Fenster vom Bildschirm, bei jedem Wechsel des Arbeitsbereichs. Das ist das Einzige, was Mochi tut, das den Prozess überdauert: Wird er beendet, während ein Fenster versteckt ist, bleibt das Fenster versteckt, und du hast keinen Weg, es zurückzuholen.",
        "Deshalb wird jede Änderung an den versteckten Fenstern in eine kleine Datei geschrieben, und der nächste Start holt diese Fenster zurück, bevor er irgendetwas anderes tut. Windows vergibt Handles neu, also gilt ein Eintrag nur, wenn das Fenster noch existiert und noch zum selben Prozess und zur selben Klasse gehört.",
        "Die Datei selbst wird unter einem temporären Namen geschrieben, vollständig auf die Platte gebracht und erst dann an ihren Platz umbenannt. Ein gewöhnliches Schreiben leert die Datei zuerst, und ein Stromausfall mittendrin hinterliesse einen Eintrag, der sich nicht mehr lesen lässt, und Fenster, die nichts mehr benennt.",
      ],
      code: {
        language: "rust",
        text: RECOVER_CODE,
        caption:
          "Aus recover.rs, ohne die Kommentare. Die Daten gehen vor dem Umbenennen auf die Platte, weil NTFS das Umbenennen im Journal festhält, die Daten aber nicht. Ohne sync_all kann ein Stromausfall eine richtig benannte Datei voller Nullen hinterlassen.",
      },
    },
    {
      heading: "Auf einem echten Desktop getestet, nicht nur im Speicher",
      body: [
        "Das Herz von Mochi ist ein reiner Kern, der nichts von Windows weiss, also werden Layouts, Arbeitsbereiche und Regeln wie jede andere Bibliothek mit Unit-Tests geprüft. Für ein Programm, dessen ganze Aufgabe es ist, echte Fenster zu verschieben, konnte das nie genügen.",
        "Die End-to-End-Suite öffnet Wegwerffenster, schickt echte Tastendrücke und prüft, wo die Fenster tatsächlich gelandet sind. Die CI führt sie aus, und der Job schlägt fehl, wenn diese Tests übersprungen werden, denn ein Test, der früh zurückkehrt, gilt trotzdem als bestanden.",
        "Dann habe ich ihn auf meinem eigenen Desktop laufen lassen. Der erste beaufsichtigte Versuch fand einen Fehler, den kein Test hätte finden können: Jede echte Anwendung wird über die Shell verborgen (Cloaking), und dieser Pfad war in keinem Test ein einziges Mal gelaufen, weil die Wegwerffenster auf gewöhnliches Verstecken auswichen. Er ist jetzt behoben und abgedeckt, und genau das spricht dafür, Software laufen zu lassen und sie nicht nur zu testen.",
      ],
    },
    {
      heading: "Eine Taste zum Anhalten, eine zum Aussteigen",
      body: [
        "Ein Tiling-Fenstermanager ordnet jedes Fenster auf dem Bildschirm neu an, sobald er startet, also zählt der Weg hinaus mehr als der Weg hinein. Pause schaltet das Kacheln aus und lässt jedes Fenster, wo es ist; ein zweiter Druck setzt sie zurück in ihre Kacheln. Alt, Shift und E beendet Mochi ganz, zeigt jedes Fenster, das er versteckt hatte, nimmt die Rahmen weg und gibt die Tasten frei.",
        "Die Tasten belegt er selbst, im eigenen Prozess, ohne ein zweites Programm, das man installieren müsste. Die Pfeiltasten lässt er bewusst in Ruhe: Alt mit einem Pfeil ist in jedem Browser Zurück und Vorwärts und im Explorer der übergeordnete Ordner, und das überall wegzunehmen, ohne dass etwas auf dem Bildschirm es erklärt, ist kein fairer Tausch. Der Spielmodus setzt jede Belegung bis auf eine aus, damit ein Spiel die ganze Tastatur bekommt.",
      ],
    },
    {
      heading: "Rahmen, und sonst nichts",
      body: [
        "Mochi zeichnet einen Rahmen um das fokussierte Fenster und nichts weiter. Es gibt keine Leiste und keine Tab-Leiste, und keine ist geplant. Stattdessen kann er sich erklären: Wenn ein Fenster nicht gekachelt wird und nicht klar ist, warum, sagt mochic why, was Mochi von diesem Fenster hält und was sich tun lässt, in Worten statt in Log-Begriffen.",
        "Er läuft als normaler Benutzer und verlangt keine Adminrechte. Windows lässt ihn kein Fenster verschieben, das zu einem Programm mit erhöhten Rechten gehört, also bemerkt Mochi das, sagt es einmal im Log und lässt dieses Fenster in Ruhe, statt um ein Loch herum zu kacheln, das er nicht füllen kann.",
      ],
    },
  ],
  captions: [
      "Das Mochi-Zeichen: drei Fenster so, wie das Standardlayout sie kachelt, eines hoch links und zwei übereinander rechts.",
    ],
  tags: ["Rust", "Win32", "Windows", "Systems"],
  stats: [
    { value: "7", label: "Crates" },
    { value: "965", label: "Tests", liveTests: "mochi" },
    { value: "0", label: "Adminrechte" },
    { value: "1", label: "Taste zum Anhalten" },
  ],
};

const fr: LocalizedContent = {
  tagline: "Un gestionnaire de fenêtres en mosaïque pour Windows qui rend toujours le bureau.",
  description:
    "Un gestionnaire de fenêtres en mosaïque pour Windows, écrit en Rust. Il dispose de vraies fenêtres en mosaïque, gère ses propres raccourcis et remet le bureau exactement comme il l'a trouvé, même après un plantage.",
  overview:
    "Mochi range chaque fenêtre de l'écran en tuiles et permet de passer de l'une à l'autre au clavier. Je l'ai écrit de zéro en Rust : sept crates, un cœur pur sans la moindre trace de Win32, et un démon où un seul thread détient tout l'état et parle à Windows. Il gère les dispositions, les espaces de travail, plusieurs écrans, les règles, les bordures, la transparence et les déplacements animés, et chaque réglage peut être changé par une commande qui prend effet dès qu'elle arrive.",
  roleSummary: "Moi seul : la conception, la couche Win32 et le banc de test.",
  sections: [
    {
      heading: "Il cache des fenêtres, il doit donc pouvoir les retrouver",
      body: [
        "Un gestionnaire de fenêtres en mosaïque retire sans cesse des fenêtres de l'écran, à chaque changement d'espace de travail. C'est la seule chose que fait Mochi qui survit au processus : s'il est tué pendant qu'une fenêtre est cachée, la fenêtre reste cachée et vous n'avez aucun moyen de la faire revenir.",
        "Chaque changement de l'ensemble des fenêtres cachées est donc écrit dans un petit fichier, et le démarrage suivant remet ces fenêtres en place avant de faire quoi que ce soit d'autre. Windows réutilise les handles, alors une entrée n'est crue que si la fenêtre existe encore et appartient toujours au même processus et à la même classe.",
        "Le fichier lui-même est écrit sous un nom temporaire, vidé sur le disque, puis renommé à sa place. Une écriture ordinaire commence par tronquer le fichier, et une coupure de courant en plein milieu laisserait un enregistrement illisible et des fenêtres que plus rien ne désigne.",
      ],
      code: {
        language: "rust",
        text: RECOVER_CODE,
        caption:
          "Tiré de recover.rs, sans ses commentaires. Les données sont vidées sur le disque avant le renommage, parce que NTFS journalise le renommage mais pas les données : sans sync_all, une coupure de courant peut laisser un fichier au bon nom rempli de zéros.",
      },
    },
    {
      heading: "Testé sur un vrai bureau, pas seulement en mémoire",
      body: [
        "Au centre de Mochi se trouve un cœur pur qui ne sait rien de Windows, si bien que les dispositions, les espaces de travail et les règles sont testés unitairement comme n'importe quelle bibliothèque. Cela ne pouvait pas suffire pour un programme dont tout le travail consiste à déplacer de vraies fenêtres.",
        "La suite de bout en bout ouvre des fenêtres jetables, injecte de vraies frappes au clavier et vérifie où les fenêtres ont réellement atterri. La CI l'exécute, et le job échoue si ces tests sont sautés, car un test qui s'arrête tôt est quand même compté comme réussi.",
        "Ensuite, je l'ai fait tourner sur mon propre bureau. Le premier essai sous surveillance a trouvé un défaut qu'aucun test n'aurait pu trouver : chaque vraie application est masquée par le shell (cloaking), et ce chemin n'avait jamais tourné une seule fois dans un test, parce que les fenêtres jetables se rabattaient sur un simple masquage. C'est corrigé et couvert maintenant, et c'est bien la raison de faire tourner un logiciel au lieu de seulement le tester.",
      ],
    },
    {
      heading: "Une touche pour mettre en pause, une pour partir",
      body: [
        "Un gestionnaire de fenêtres en mosaïque réorganise toutes les fenêtres de l'écran dès qu'il démarre, alors la sortie compte plus que l'entrée. Pause coupe la mosaïque et laisse chaque fenêtre où elle est ; un second appui les remet dans leurs tuiles. Alt, Maj et E arrête complètement Mochi, affiche toutes les fenêtres qu'il cachait, retire les bordures et libère les touches.",
        "Il gère les raccourcis lui-même, dans son propre processus, sans second programme à installer. Les flèches sont volontairement laissées tranquilles : Alt avec une flèche, c'est Précédent et Suivant dans tous les navigateurs et le dossier parent dans l'Explorateur, et retirer cela partout sans rien à l'écran pour l'expliquer n'est pas un échange honnête. Le mode jeu suspend tous les raccourcis sauf un, pour qu'un jeu ait tout le clavier.",
      ],
    },
    {
      heading: "Des bordures, et rien d'autre",
      body: [
        "Mochi dessine une bordure autour de la fenêtre active, et rien de plus. Il n'y a ni barre ni bande d'onglets, et aucune n'est prévue. À la place, il sait s'expliquer : quand une fenêtre n'est pas mise en mosaïque et que la raison n'est pas évidente, mochic why dit ce que Mochi pense de cette fenêtre et ce qu'on peut y faire, avec des mots plutôt qu'avec des termes de journal.",
        "Il tourne en utilisateur normal et ne demande aucun droit d'administrateur. Windows ne le laisse pas déplacer une fenêtre qui appartient à un programme élevé, alors Mochi le remarque, le signale une fois dans le journal et laisse cette fenêtre tranquille au lieu d'organiser la mosaïque autour d'un trou qu'il ne peut pas combler.",
      ],
    },
  ],
  captions: [
      "Le logo de Mochi : trois fenêtres telles que la disposition par défaut les place, une haute à gauche et deux empilées à droite.",
    ],
  tags: ["Rust", "Win32", "Windows", "Systems"],
  stats: [
    { value: "7", label: "crates" },
    { value: "965", label: "tests", liveTests: "mochi" },
    { value: "0", label: "droits d'admin" },
    { value: "1", label: "touche pour arrêter" },
  ],
};

const zh: LocalizedContent = {
  tagline: "一个 Windows 平铺窗口管理器，总会把桌面原样还给你。",
  description:
    "一个用 Rust 写的 Windows 平铺窗口管理器。它平铺的是真实的窗口，自己绑定快捷键，并且会把桌面恢复成它接手时的样子，哪怕是在崩溃之后。",
  overview:
    "Mochi 把屏幕上的每个窗口排成平铺的格子，让你用键盘在它们之间移动。我用 Rust 从零写了它：七个 crate，一个完全不含 Win32 的纯核心，以及一个守护进程，其中只有一个线程持有全部状态并与 Windows 打交道。它支持布局、工作区、多显示器、规则、边框、透明度和带动画的移动，而且每一项设置都能用一条命令修改，命令一到就立刻生效。",
  roleSummary: "只有我：设计、Win32 层和测试框架。",
  sections: [
    {
      heading: "它会藏起窗口，所以必须能把它们找回来",
      body: [
        "平铺窗口管理器每次切换工作区，都会把窗口从屏幕上拿走。这是 Mochi 唯一一件会比进程活得更久的事：如果它在某个窗口被藏起时被杀掉，这个窗口就会一直藏着，而你没有任何办法把它找回来。",
        "所以隐藏窗口集合的每一次变化都会写进一个小文件，下次启动时，在做任何别的事之前先把这些窗口放回来。Windows 会复用窗口句柄，所以只有当窗口仍然存在，并且仍属于同一个进程和同一个窗口类时，一条记录才会被采信。",
        "这个文件本身先写到一个临时文件名下，刷到磁盘上，再重命名到原位。普通的写入会先把文件截断，写到一半时断电，就会留下一份无法解析的记录，以及再也没有任何东西指认的窗口。",
      ],
      code: {
        language: "rust",
        text: RECOVER_CODE,
        caption:
          "摘自 recover.rs，省略了注释。重命名之前先刷盘，因为 NTFS 会为重命名记日志，却不会为数据记；没有 sync_all，一次断电可能留下一个名字正确、内容却全是零的文件。",
      },
    },
    {
      heading: "在真实桌面上测试，而不只是在内存里",
      body: [
        "Mochi 的中心是一个对 Windows 一无所知的纯核心，所以布局、工作区和规则都能像普通的库一样做单元测试。可对一个全部工作就是移动真实窗口的程序来说，这从来都不够。",
        "端到端测试套件会打开一次性的窗口，注入真实的按键，再检查窗口实际落在了哪里。CI 会运行它，而且只要这些测试被跳过，任务就会失败，因为提前返回的测试照样会报告通过。",
        "然后我在自己的桌面上运行了它。第一次有人盯着的试运行，就发现了一个任何测试都不可能发现的缺陷：每个真实的应用都是通过 shell 隐藏（cloak）的，而这条路径在测试里一次都没跑过，因为那些一次性窗口退回了普通的隐藏方式。现在它已经修好，也有测试覆盖，这正是要把软件真正跑起来、而不只是测试它的理由。",
      ],
    },
    {
      heading: "一个键暂停，一个键退出",
      body: [
        "平铺窗口管理器一启动就会重新排列屏幕上的每个窗口，所以怎么退出比怎么进入更重要。Pause 键关闭平铺，让每个窗口留在原地；再按一次，它们就回到各自的格子里。Alt、Shift 加 E 会彻底停止 Mochi，显示它藏起的每一个窗口，撤掉边框，并释放所有快捷键。",
        "快捷键由它自己在进程内绑定，不需要另装第二个程序。方向键被刻意留着不动：Alt 加方向键在每个浏览器里是后退和前进，在资源管理器里是上一级文件夹，在所有地方把它拿走，屏幕上又没有任何说明，这笔交换并不公平。游戏模式会暂停除一个之外的所有快捷键，让游戏拿到整个键盘。",
      ],
    },
    {
      heading: "只有边框，别的都没有",
      body: [
        "Mochi 在获得焦点的窗口周围画一圈边框，仅此而已。没有状态栏，也没有标签条，将来也不打算加。它有的是一种解释自己的办法：当某个窗口没有被平铺、原因又不明显时，mochic why 会说出 Mochi 怎么看这个窗口、可以怎么处理，用的是人话，而不是日志术语。",
        "它以普通用户身份运行，不要求任何管理员权限。Windows 不允许它移动属于提权程序的窗口，所以 Mochi 会察觉到，在日志里说一次，然后不去碰那个窗口，而不是围着一个它填不上的空洞去平铺。",
      ],
    },
  ],
  captions: [
      "Mochi 的标志：三个窗口按默认布局平铺，左边一个竖长的，右边两个上下叠放。",
    ],
  tags: ["Rust", "Win32", "Windows", "Systems"],
  stats: [
    { value: "7", label: "个 crate" },
    { value: "965", label: "个测试", liveTests: "mochi" },
    { value: "0", label: "管理员权限" },
    { value: "1", label: "个键即可停止" },
  ],
};

export const mochi: Record<Language, LocalizedContent> = { en, de, fr, zh };
