import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

const FOLLOW_CODE = `// Windows Terminal and other ConPTY hosts: the owner is the window.
if let Ok(owner) = GetWindow(console, GW_OWNER)
    && !owner.is_invalid()
    && IsWindowVisible(owner).as_bool()
{
    let root = raw(GetAncestor(owner, GA_ROOT));
    if has_area(root) {
        return Some(root);
    }
}
// Never the pseudo console window itself: it reports itself
// visible, at zero size, while a new terminal is being set up.
let c = raw(console);
(window::class(c) != PSEUDO_CONSOLE && window::is_shown(c) && has_area(c))
    .then_some(c)`;

const en: LocalizedContent = {
  tagline: "Fleets of AI agent terminals on Windows, each border saying what its agent is doing.",
  description:
    "A Windows tool, written in Rust, for running many AI coding agents at once. One key opens a fleet of terminals in a grid, and each terminal's border shows whether its agent is working, waiting for you, done or failed.",
  overview:
    "When six agents run at the same time, the hard part is noticing which one is waiting for you. Daifuku opens them in a grid on the monitor you choose, with one key, and colours every terminal's border by what its agent is doing: blue while it works, yellow when it needs an answer, green when it is done, red when it failed. Another key jumps to the agent that has waited longest. It works with Claude Code and Codex in Windows Terminal, and runs beside Mochi without either getting in the other's way.",
  roleSummary: "Just me: the idea, the Win32 layer, the daemon and the tests.",
  sections: [
    {
      heading: "Which window is the agent in?",
      body: [
        "An agent reports its state through a hook: a small program it starts on every change. To colour the right border, that hook has to find the terminal window it runs in, and the obvious way does not work. Every Windows Terminal window on the desktop belongs to one and the same process, so a process id says nothing about which window.",
        "What does say it is the agent's console. Under Windows Terminal that is a hidden pseudo console window, and Windows Terminal makes the window hosting the tab its owner. The hook borrows its ancestors' consoles one by one until one leads to a window.",
        "The first real demo found the catch: an agent can start before its terminal is ready, and in that moment the only window its console points at is the hidden one, visible by its own account and zero pixels wide. All six demo agents named it. Now the hook never accepts that window, and the daemon follows it to its owner once the owner exists.",
      ],
      code: {
        language: "rust",
        text: FOLLOW_CODE,
        caption:
          "From console.rs. The size check is the fix: a window can report itself visible and still have nothing to draw a border around.",
      },
    },
    {
      heading: "It runs as administrator, so nothing ordinary may steer it",
      body: [
        "The daemon has to run elevated: Windows will not let a normal process move an administrator's window or draw beside it. That makes it a target, because anything that can change what it starts gets administrator rights for free.",
        "So nothing an ordinary program can touch decides what it starts. The binaries live in Program Files. The config lives in a folder only administrators can write, and the installer also hands that folder and everything in it to the Administrators group, because the owner of a file can always rewrite its access list. Commands arrive on a pipe only elevated processes can open, and Windows Terminal is found through its package, never through PATH.",
        "The hooks get a pipe of their own, open to the signed-in user, and the most a message on it can do is colour a border.",
      ],
    },
    {
      heading: "Colour is never the only signal",
      body: [
        "Four states in four colours is a design that fails the first person with red-green colour blindness. Every state also has its own border width: done is thin, working normal, failed thicker, and waiting the thickest, breathing slowly. The states read in greyscale.",
        "A colour-blind palette is one setting away, a high contrast theme gives the borders the theme's own colours, the pulse stops when Windows is set to show no animations, and a chime can play when an agent starts waiting, for when you are not looking.",
      ],
    },
    {
      heading: "Measured on a real desktop",
      body: [
        "The logic is unit tested like any library, but the bugs that mattered only showed on a real screen. A border lagged two seconds behind a moved window, because Windows delivers window events inside the message wait without ever ending it. Focus switches reported success and quietly did nothing. A window placed by its rectangle came out off by its invisible resize border.",
        "Each of those is fixed and pinned by a check. CI runs the whole path on a real Windows desktop on every push: the daemon, a console window, the hook inside it, and the border that has to appear around it and disappear with it.",
      ],
    },
  ],
  captions: [
    "Six demo agents on a portrait monitor: blue working, yellow waiting for an answer, green done, red failed.",
  ],
  tags: ["Rust", "Win32", "Windows", "AI agents"],
  stats: [
    { value: "5", label: "crates" },
    { value: "302", label: "tests" },
    { value: "4", label: "states" },
    { value: "0.3 s", label: "for a border to follow" },
  ],
};

const de: LocalizedContent = {
  tagline: "Flotten von KI-Agenten-Terminals unter Windows, jeder Rahmen sagt, was sein Agent tut.",
  description:
    "Ein Windows-Werkzeug in Rust, um viele KI-Coding-Agenten gleichzeitig laufen zu lassen. Eine Taste öffnet eine Flotte von Terminals in einem Raster, und der Rahmen jedes Terminals zeigt, ob sein Agent arbeitet, auf dich wartet, fertig ist oder gescheitert ist.",
  overview:
    "Wenn sechs Agenten gleichzeitig laufen, ist das Schwierige, zu merken, welcher gerade auf dich wartet. Daifuku öffnet sie mit einer Taste in einem Raster auf dem Bildschirm deiner Wahl und färbt den Rahmen jedes Terminals nach dem, was sein Agent tut: blau, solange er arbeitet, gelb, wenn er eine Antwort braucht, grün, wenn er fertig ist, rot, wenn er gescheitert ist. Eine weitere Taste springt zum Agenten, der am längsten wartet. Es funktioniert mit Claude Code und Codex in Windows Terminal und läuft neben Mochi, ohne dass sich die beiden in die Quere kommen.",
  roleSummary: "Nur ich: die Idee, die Win32-Schicht, der Daemon und die Tests.",
  sections: [
    {
      heading: "In welchem Fenster steckt der Agent?",
      body: [
        "Ein Agent meldet seinen Zustand über einen Hook: ein kleines Programm, das er bei jeder Änderung startet. Um den richtigen Rahmen zu färben, muss dieser Hook das Terminalfenster finden, in dem er läuft, und der naheliegende Weg funktioniert nicht. Jedes Windows-Terminal-Fenster auf dem Desktop gehört zu ein und demselben Prozess, eine Prozess-ID sagt also nichts darüber, welches Fenster es ist.",
        "Was es verrät, ist die Konsole des Agenten. Unter Windows Terminal ist das ein verstecktes Pseudokonsolen-Fenster, und Windows Terminal macht das Fenster, in dem der Tab liegt, zu seinem Besitzer. Der Hook leiht sich nacheinander die Konsolen seiner Vorfahren, bis eine zu einem Fenster führt.",
        "Die erste echte Demo fand den Haken: Ein Agent kann starten, bevor sein Terminal bereit ist, und in diesem Moment zeigt seine Konsole nur auf das versteckte Fenster, nach eigener Aussage sichtbar und null Pixel breit. Alle sechs Demo-Agenten nannten es. Jetzt nimmt der Hook dieses Fenster nie an, und der Daemon folgt ihm zu seinem Besitzer, sobald es den gibt.",
      ],
      code: {
        language: "rust",
        text: FOLLOW_CODE,
        caption:
          "Aus console.rs. Die Grössenprüfung ist die Korrektur: Ein Fenster kann sich als sichtbar melden und trotzdem nichts haben, um das man einen Rahmen zeichnen kann.",
      },
    },
    {
      heading: "Es läuft als Administrator, also darf nichts Gewöhnliches es steuern",
      body: [
        "Der Daemon muss mit erhöhten Rechten laufen: Windows lässt einen normalen Prozess weder das Fenster eines Administrators verschieben noch daneben zeichnen. Das macht ihn zum Ziel, denn alles, was ändern kann, was er startet, bekommt Administratorrechte geschenkt.",
        "Deshalb entscheidet nichts, was ein gewöhnliches Programm anfassen kann, darüber, was er startet. Die Programme liegen unter Program Files. Die Konfiguration liegt in einem Ordner, in den nur Administratoren schreiben können, und der Installer übergibt diesen Ordner samt Inhalt ausserdem der Gruppe Administratoren, weil der Besitzer einer Datei ihre Zugriffsliste immer neu schreiben kann. Befehle kommen über eine Pipe, die nur Prozesse mit erhöhten Rechten öffnen können, und Windows Terminal wird über sein Paket gefunden, nie über PATH.",
        "Die Hooks bekommen eine eigene Pipe, offen für den angemeldeten Benutzer, und das Äusserste, was eine Nachricht darauf bewirken kann, ist einen Rahmen zu färben.",
      ],
    },
    {
      heading: "Farbe ist nie das einzige Signal",
      body: [
        "Vier Zustände in vier Farben ist ein Entwurf, der beim ersten Menschen mit Rot-Grün-Schwäche scheitert. Jeder Zustand hat deshalb auch seine eigene Rahmenbreite: fertig ist dünn, arbeitet normal, gescheitert dicker und wartet am dicksten, langsam atmend. Die Zustände sind auch in Graustufen lesbar.",
        "Eine Palette für Farbenblinde ist eine Einstellung entfernt, ein Kontrastdesign gibt den Rahmen die Farben des Designs, das Atmen hört auf, wenn Windows keine Animationen zeigen soll, und ein Ton kann erklingen, wenn ein Agent zu warten beginnt, für die Momente, in denen du nicht hinschaust.",
      ],
    },
    {
      heading: "Gemessen auf einem echten Desktop",
      body: [
        "Die Logik ist mit Unit-Tests abgedeckt wie jede Bibliothek, aber die Fehler, die zählten, zeigten sich nur auf einem echten Bildschirm. Ein Rahmen hing zwei Sekunden hinter einem verschobenen Fenster her, weil Windows Fensterereignisse innerhalb des Wartens auf Nachrichten zustellt, ohne es je zu beenden. Fokuswechsel meldeten Erfolg und taten still nichts. Ein nach seinem Rechteck platziertes Fenster lag um seinen unsichtbaren Rand daneben.",
        "Jeder dieser Fehler ist behoben und durch eine Prüfung festgenagelt. Die CI prüft bei jedem Push den ganzen Weg auf einem echten Windows-Desktop: den Daemon, ein Konsolenfenster, den Hook darin und den Rahmen, der darum erscheinen und mit ihm verschwinden muss.",
      ],
    },
  ],
  captions: [
    "Sechs Demo-Agenten auf einem Hochkant-Bildschirm: blau arbeitet, gelb wartet auf eine Antwort, grün fertig, rot gescheitert.",
  ],
  tags: ["Rust", "Win32", "Windows", "KI-Agenten"],
  stats: [
    { value: "5", label: "Crates" },
    { value: "302", label: "Tests" },
    { value: "4", label: "Zustände" },
    { value: "0,3 s", label: "bis ein Rahmen folgt" },
  ],
};

const fr: LocalizedContent = {
  tagline: "Des flottes de terminaux d'agents IA sous Windows, chaque bordure dit ce que fait son agent.",
  description:
    "Un outil Windows, écrit en Rust, pour faire tourner beaucoup d'agents de code IA à la fois. Une touche ouvre une flotte de terminaux en grille, et la bordure de chaque terminal montre si son agent travaille, t'attend, a fini ou a échoué.",
  overview:
    "Quand six agents tournent en même temps, le plus dur est de remarquer lequel t'attend. Daifuku les ouvre d'une seule touche en grille sur l'écran de ton choix, et colore la bordure de chaque terminal selon ce que fait son agent : bleu tant qu'il travaille, jaune quand il a besoin d'une réponse, vert quand il a fini, rouge quand il a échoué. Une autre touche saute à l'agent qui attend depuis le plus longtemps. Il fonctionne avec Claude Code et Codex dans Windows Terminal, et tourne à côté de Mochi sans que l'un gêne l'autre.",
  roleSummary: "Moi seul : l'idée, la couche Win32, le démon et les tests.",
  sections: [
    {
      heading: "Dans quelle fenêtre est l'agent ?",
      body: [
        "Un agent signale son état par un hook : un petit programme qu'il lance à chaque changement. Pour colorer la bonne bordure, ce hook doit trouver la fenêtre de terminal dans laquelle il tourne, et le chemin évident ne marche pas. Toutes les fenêtres de Windows Terminal du bureau appartiennent à un seul et même processus, donc un identifiant de processus ne dit rien de la fenêtre.",
        "Ce qui la dit, c'est la console de l'agent. Sous Windows Terminal, c'est une fenêtre de pseudo-console cachée, et Windows Terminal fait de la fenêtre qui héberge l'onglet son propriétaire. Le hook emprunte une à une les consoles de ses ancêtres jusqu'à ce que l'une mène à une fenêtre.",
        "La première vraie démo a trouvé le piège : un agent peut démarrer avant que son terminal soit prêt, et à ce moment-là sa console ne pointe que vers la fenêtre cachée, visible selon ses propres dires et large de zéro pixel. Les six agents de la démo l'ont désignée. Désormais le hook ne l'accepte jamais, et le démon la suit jusqu'à son propriétaire dès que celui-ci existe.",
      ],
      code: {
        language: "rust",
        text: FOLLOW_CODE,
        caption:
          "Tiré de console.rs. Le contrôle de taille est la correction : une fenêtre peut se dire visible et n'avoir pourtant rien autour de quoi dessiner une bordure.",
      },
    },
    {
      heading: "Il tourne en administrateur, donc rien d'ordinaire ne doit le piloter",
      body: [
        "Le démon doit tourner avec des droits élevés : Windows ne laisse pas un processus normal déplacer la fenêtre d'un administrateur ni dessiner à côté. Cela en fait une cible, car tout ce qui peut changer ce qu'il lance obtient les droits d'administrateur gratuitement.",
        "Donc rien de ce qu'un programme ordinaire peut toucher ne décide de ce qu'il lance. Les binaires sont dans Program Files. La configuration est dans un dossier où seuls les administrateurs peuvent écrire, et l'installateur donne en plus ce dossier et tout son contenu au groupe Administrateurs, parce que le propriétaire d'un fichier peut toujours réécrire sa liste d'accès. Les commandes arrivent par un tube que seuls les processus élevés peuvent ouvrir, et Windows Terminal est trouvé par son paquet, jamais par le PATH.",
        "Les hooks ont leur propre tube, ouvert à l'utilisateur connecté, et le plus qu'un message dessus puisse faire, c'est colorer une bordure.",
      ],
    },
    {
      heading: "La couleur n'est jamais le seul signal",
      body: [
        "Quatre états en quatre couleurs, c'est un design qui échoue devant la première personne daltonienne rouge-vert. Chaque état a donc aussi sa propre épaisseur de bordure : terminé est fin, en cours normal, échoué plus épais et en attente le plus épais, avec une respiration lente. Les états se lisent même en niveaux de gris.",
        "Une palette pour daltoniens est à un réglage près, un thème à contraste élevé donne aux bordures les couleurs du thème, la respiration s'arrête quand Windows ne doit pas montrer d'animations, et un son peut retentir quand un agent se met à attendre, pour les moments où tu ne regardes pas.",
      ],
    },
    {
      heading: "Mesuré sur un vrai bureau",
      body: [
        "La logique est couverte par des tests unitaires comme n'importe quelle bibliothèque, mais les bugs qui comptaient ne se sont montrés que sur un vrai écran. Une bordure traînait deux secondes derrière une fenêtre déplacée, parce que Windows livre les événements de fenêtre à l'intérieur de l'attente de messages sans jamais la terminer. Des changements de focus annonçaient un succès et ne faisaient rien. Une fenêtre placée selon son rectangle tombait à côté de la largeur de son bord invisible.",
        "Chacun est corrigé et verrouillé par une vérification. La CI exécute tout le chemin sur un vrai bureau Windows à chaque push : le démon, une fenêtre de console, le hook dedans, et la bordure qui doit apparaître autour et disparaître avec elle.",
      ],
    },
  ],
  captions: [
    "Six agents de démo sur un écran en portrait : bleu travaille, jaune attend une réponse, vert terminé, rouge échoué.",
  ],
  tags: ["Rust", "Win32", "Windows", "Agents IA"],
  stats: [
    { value: "5", label: "crates" },
    { value: "302", label: "tests" },
    { value: "4", label: "états" },
    { value: "0,3 s", label: "pour qu'une bordure suive" },
  ],
};

const zh: LocalizedContent = {
  tagline: "Windows 上成组的 AI 智能体终端，每个边框都说明它的智能体在做什么。",
  description:
    "一个用 Rust 写的 Windows 工具，用来同时运行许多 AI 编程智能体。一个快捷键就能把一组终端排成网格打开，每个终端的边框显示它的智能体是在工作、在等你、已完成还是失败了。",
  overview:
    "六个智能体同时运行时，难的是注意到哪一个正在等你。Daifuku 用一个快捷键把它们排成网格，打开在你选的显示器上，并按每个智能体在做的事给终端边框上色：工作时是蓝色，需要回答时是黄色，完成时是绿色，失败时是红色。另一个快捷键会跳到等得最久的那个智能体。它支持 Windows Terminal 里的 Claude Code 和 Codex，并能和 Mochi 同时运行，互不干扰。",
  roleSummary: "只有我：想法、Win32 层、守护进程和测试。",
  sections: [
    {
      heading: "智能体在哪个窗口里？",
      body: [
        "智能体通过钩子报告自己的状态：它在每次变化时启动的一个小程序。要给正确的边框上色，这个钩子必须找到自己所在的终端窗口，而最直接的办法行不通。桌面上所有 Windows Terminal 窗口都属于同一个进程，所以进程 ID 说明不了是哪个窗口。",
        "能说明的是智能体的控制台。在 Windows Terminal 下，它是一个隐藏的伪控制台窗口，而 Windows Terminal 会把承载该标签页的窗口设为它的所有者。钩子逐个借用祖先进程的控制台，直到有一个通向某个窗口。",
        "第一次真正的演示发现了陷阱：智能体可能在终端准备好之前就启动了，那一刻它的控制台只指向那个隐藏窗口，它自称可见，宽度却是零像素。六个演示智能体全都指向了它。现在钩子从不接受这个窗口，而守护进程会在所有者出现后顺着它找到所有者。",
      ],
      code: {
        language: "rust",
        text: FOLLOW_CODE,
        caption: "摘自 console.rs。尺寸检查就是修复：一个窗口可以自称可见，却仍然没有可以画边框的地方。",
      },
    },
    {
      heading: "它以管理员身份运行，所以任何普通程序都不能操纵它",
      body: [
        "守护进程必须以提升的权限运行：Windows 不允许普通进程移动管理员的窗口，也不允许在旁边绘制。这让它成了目标，因为任何能改变它启动什么的东西，都会白白得到管理员权限。",
        "所以，普通程序能碰到的任何东西都不能决定它启动什么。程序文件放在 Program Files。配置放在只有管理员能写入的文件夹里，安装程序还会把这个文件夹及其中所有内容交给 Administrators 组，因为文件的所有者总能改写它的访问列表。命令只能通过只有提升权限的进程才能打开的管道传入，而 Windows Terminal 是通过它的软件包找到的，从不通过 PATH。",
        "钩子有自己的管道，对已登录的用户开放，而其中的一条消息最多只能给一个边框上色。",
      ],
    },
    {
      heading: "颜色从来不是唯一的信号",
      body: [
        "四种状态配四种颜色，这种设计遇到第一个红绿色盲的人就会失效。所以每种状态还有自己的边框宽度：完成最细，工作正常，失败更粗，等待最粗并且缓慢地呼吸。这些状态在灰度下也能分辨。",
        "色盲友好的配色只需一个设置，高对比度主题会让边框使用主题自己的颜色，当 Windows 设置为不显示动画时呼吸效果会停止，还可以在智能体开始等待时播放提示音，照顾你没在看屏幕的时候。",
      ],
    },
    {
      heading: "在真实桌面上测量",
      body: [
        "逻辑部分像任何库一样有单元测试，但真正要紧的 bug 只在真实屏幕上出现。边框会落后被移动的窗口两秒，因为 Windows 在消息等待内部投递窗口事件，却从不结束这次等待。焦点切换报告成功，却悄悄什么也没做。按矩形放置的窗口会偏出它那条看不见的边框的宽度。",
        "这些都已修复，并由检查固定下来。每次推送，CI 都会在真实的 Windows 桌面上跑完整条路径：守护进程、一个控制台窗口、其中的钩子，以及必须出现在它周围、又随它消失的边框。",
      ],
    },
  ],
  captions: ["竖屏显示器上的六个演示智能体：蓝色在工作，黄色在等回答，绿色已完成，红色失败。"],
  tags: ["Rust", "Win32", "Windows", "AI 智能体"],
  stats: [
    { value: "5", label: "个 crate" },
    { value: "302", label: "个测试" },
    { value: "4", label: "种状态" },
    { value: "0.3 秒", label: "边框跟上" },
  ],
};

export const daifuku: Record<Language, LocalizedContent> = { en, de, fr, zh };
