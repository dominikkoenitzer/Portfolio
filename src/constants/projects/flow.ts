import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

// PreciseDelayMs from src/FlowEngine.cpp, comments left out. The same text in
// every language; only the caption is translated.
const DELAY_CODE = `void HighResTimer::PreciseDelayMs(DWORD milliseconds, const std::atomic<bool>* cancel) {
    if (milliseconds == 0) return;

    LARGE_INTEGER freq, start, now;
    QueryPerformanceFrequency(&freq);
    QueryPerformanceCounter(&start);
    const LONGLONG target = start.QuadPart + (freq.QuadPart * milliseconds) / 1000;

    if (milliseconds > 2) {
        DWORD remaining = milliseconds - 2;
        while (remaining > 0) {
            if (cancel && cancel->load()) return;
            const DWORD slice = remaining > 50 ? 50 : remaining;
            Sleep(slice);
            remaining -= slice;
        }
    }
    do {
        if (cancel && cancel->load()) return;
        QueryPerformanceCounter(&now);
    } while (now.QuadPart < target);
}`;

export const flow: Record<Language, LocalizedContent> = {
  en: {
    downloadNote:
      "First launch: Windows SmartScreen may appear. Choose “More info” → “Run anyway”, then approve the UAC prompt: Flow runs as administrator so it can also record and click into programs that do.",
    tagline: "Clicks faster than you can, and never needs a coffee break.",
    description:
      "A Windows desktop app in C++17 that records mouse and keyboard macros, replays them with sub-10 ms timing, and runs a high-speed auto-clicker. One statically linked exe, nothing to install.",
    overview:
      "Every auto-clicker I could find online was either spyware or a forum download from 2009, so I wrote my own in C++17, straight against the Win32 API and GDI+. It records mouse moves, clicks and keystrokes with millisecond timing, replays them at any speed and any loop count, and carries a separate high-priority auto-clicker. The timing sleeps through most of each delay and busy-waits the last two milliseconds on QueryPerformanceCounter, which holds precision under 10 ms where Sleep alone does not come close. The UI is drawn by hand with no framework, and everything links statically into one 3 MB FLOW.exe. It does run as Administrator, because Windows keeps a normal process from recording or clicking into programs that run elevated.",
    roleSummary: "Just me: the engine, the hand-drawn UI, the build scripts.",
    sections: [
      {
        heading: "Sleep for most of the wait, spin for the last two milliseconds",
        body: [
          "A macro is only as good as the gaps between its events. Sleep alone is far too coarse for that, and a pure busy-wait holds the precision but keeps a whole CPU core at full load for as long as a recording pauses.",
          "So every delay is measured against an absolute target on QueryPerformanceCounter. Flow sleeps away everything except the last two milliseconds and busy-waits only that tail. The sleep runs in slices of at most 50 ms, so pressing Stop during a long pause in a recording takes effect within 50 ms rather than when the pause is over.",
        ],
        code: {
          language: "cpp",
          text: DELAY_CODE,
          caption:
            "From src/FlowEngine.cpp, with its comments left out. The sleep covers all but the last two milliseconds, in slices of at most 50 ms so a stop is heard during a long pause, and the loop at the end checks against an absolute target, so slicing the sleep costs no accuracy.",
        },
      },
      {
        heading: "A click lands on the same pixel on every monitor",
        body: [
          "Recording stores screen coordinates. On a desk with several monitors at different resolutions, replaying them as relative moves drifted, so every mouse move goes back out as an absolute position.",
          "Flow normalises the point against the whole virtual desktop, clamps it and scales it to the 0 to 65535 range that SendInput expects with MOUSEEVENTF_VIRTUALDESK. The same number then means the same place on every display.",
        ],
      },
      {
        heading: "A .rec file is checked before it is believed",
        body: [
          "Macros are saved as a four-byte FLOW header, an event count and the raw event structs. That is quick and small, but it also means a broken download or a damaged file can declare any count it likes.",
          "LoadMacro measures the file first and rejects a count the remaining bytes cannot hold, so a bad header cannot trigger an allocation big enough to crash the program. It also rejects a truncated payload and a file whose timestamps run backwards: playback subtracts consecutive timestamps, and one step back would underflow into a pause of several weeks.",
          "The tests save and reload a macro byte for byte, and hand LoadMacro a file that is not a macro, a count the payload cannot hold and a truncated payload.",
        ],
      },
      {
        heading: "One table places everything in the window",
        body: [
          "There is no UI framework. The window is raw Win32 with GDI+ for the anti-aliased shapes, and every button, switch and number field is owner-drawn.",
          "Painting and control creation used to keep their own coordinates, and a nudge to one drifted silently from the other. Now both read every Y position from one header, Theme.h, in design units at 96 DPI that are scaled once at launch.",
        ],
      },
      {
        heading: "Admin rights and a single exe, both checked by CI",
        body: [
          "Recording relies on global low-level mouse and keyboard hooks, and FLOW.manifest declares requireAdministrator, so Windows shows a UAC prompt on every launch. If the hooks still fail to install, Flow says so in an error box and exits instead of opening a window that would record nothing.",
          "The build links statically. Without that, std::thread pulls in libwinpthread-1.dll and the exe will not start on a machine without MinGW. CI checks both on every push to main: it fails if objdump finds a MinGW runtime DLL among the imports, or if the manifest did not make it into the binary. Releases carry SHA-256 checksums. The exe is not code-signed, so SmartScreen warns on first launch.",
        ],
      },
    ],
    captions: ["The FLOW app icon: two white chevrons on a rounded blue square."],
    tags: ["C++", "Win32", "GDI+", "Automation", "Low-latency"],
    stats: [
      { value: "3 MB", label: "static exe" },
      { value: "0", label: "dependencies" },
      { value: "<10 ms", label: "timing precision" },
      { value: "0", label: "telemetry" },
    ],
  },
  de: {
    downloadNote:
      "Erster Start: Windows SmartScreen kann warnen. Wähle „Weitere Informationen“ → „Trotzdem ausführen“ und bestätige dann die UAC-Abfrage: Flow läuft als Administrator, damit es auch Programme aufnehmen und bedienen kann, die mit Administratorrechten laufen.",
    tagline: "Klickt schneller als du und braucht nie eine Kaffeepause.",
    description:
      "Eine Windows-Desktop-App in C++17, die Maus- und Tastaturmakros aufnimmt, sie mit unter 10 ms Genauigkeit abspielt und einen Hochgeschwindigkeits-Autoclicker mitbringt. Eine statisch gelinkte Exe, nichts zu installieren.",
    overview:
      "Jeder Autoclicker, den ich online fand, war entweder Spyware oder ein Forum-Download von 2009, also schrieb ich meinen eigenen in C++17, direkt gegen die Win32-API und GDI+. Er nimmt Mausbewegungen, Klicks und Tastenanschläge mit Millisekunden-Timing auf, spielt sie in jeder Geschwindigkeit und Wiederholungszahl ab und bringt einen eigenen Autoclicker mit hoher Priorität mit. Das Timing schläft den grössten Teil jeder Pause und wartet die letzten zwei Millisekunden aktiv auf QueryPerformanceCounter, das hält die Genauigkeit unter 10 ms, wo Sleep allein nicht annähernd hinkommt. Die UI ist von Hand gezeichnet, ohne Framework, und alles linkt statisch in eine 3 MB grosse FLOW.exe. Sie läuft als Administrator, weil Windows einem normalen Prozess nicht erlaubt, Programme mit erhöhten Rechten aufzunehmen oder in sie zu klicken.",
    roleSummary: "Nur ich: die Engine, die handgezeichnete UI, die Build-Skripte.",
    sections: [
      {
        heading: "Den grössten Teil verschlafen, die letzten zwei Millisekunden aktiv warten",
        body: [
          "Ein Makro ist nur so gut wie die Abstände zwischen seinen Ereignissen. Sleep allein ist dafür viel zu grob, und reines Busy-Waiting hält zwar die Genauigkeit, lastet aber einen ganzen CPU-Kern voll aus, solange eine Aufnahme pausiert.",
          "Deshalb wird jede Verzögerung gegen ein absolutes Ziel auf QueryPerformanceCounter gemessen. Flow verschläft alles bis auf die letzten zwei Millisekunden und wartet nur diesen Rest aktiv ab. Geschlafen wird in Stücken von höchstens 50 ms, damit ein Stop während einer langen Pause in der Aufnahme innert 50 ms greift und nicht erst, wenn die Pause vorbei ist.",
        ],
        code: {
          language: "cpp",
          text: DELAY_CODE,
          caption:
            "Aus src/FlowEngine.cpp, ohne die Kommentare. Geschlafen wird bis auf die letzten zwei Millisekunden, in Stücken von höchstens 50 ms, damit ein Stop auch in einer langen Pause ankommt. Die Schleife am Ende prüft gegen ein absolutes Ziel, also kostet das Zerstückeln keine Genauigkeit.",
        },
      },
      {
        heading: "Ein Klick landet auf jedem Monitor am selben Pixel",
        body: [
          "Die Aufnahme speichert Bildschirmkoordinaten. Auf einem Tisch mit mehreren Monitoren in unterschiedlichen Auflösungen drifteten relativ abgespielte Bewegungen, deshalb geht jede Mausbewegung als absolute Position wieder hinaus.",
          "Flow normalisiert den Punkt auf den ganzen virtuellen Desktop, begrenzt ihn und skaliert ihn auf den Bereich 0 bis 65535, den SendInput mit MOUSEEVENTF_VIRTUALDESK erwartet. So bedeutet dieselbe Zahl auf allen Bildschirmen dieselbe Stelle.",
        ],
      },
      {
        heading: "Eine .rec-Datei wird geprüft, bevor man ihr glaubt",
        body: [
          "Makros werden als vier Byte langer FLOW-Header, eine Ereigniszahl und die rohen Event-Structs gespeichert. Das ist schnell und klein, heisst aber auch, dass ein abgebrochener Download oder eine beschädigte Datei jede beliebige Zahl behaupten kann.",
          "LoadMacro misst zuerst die Datei und lehnt eine Zahl ab, für die die restlichen Bytes nicht reichen, damit ein kaputter Header keine Allokation auslösen kann, die das Programm abstürzen lässt. Abgelehnt werden auch ein abgeschnittener Inhalt und eine Datei, deren Zeitstempel rückwärts laufen: Die Wiedergabe subtrahiert aufeinanderfolgende Zeitstempel, und ein Schritt zurück würde zu einer Pause von mehreren Wochen überlaufen.",
          "Die Tests speichern ein Makro und laden es Byte für Byte wieder, und sie geben LoadMacro eine Datei, die kein Makro ist, eine Zahl, die der Inhalt nicht fassen kann, und einen abgeschnittenen Inhalt.",
        ],
      },
      {
        heading: "Eine Tabelle platziert alles im Fenster",
        body: [
          "Es gibt kein UI-Framework. Das Fenster ist rohes Win32 mit GDI+ für die geglätteten Formen, und jeder Button, jeder Schalter und jedes Zahlenfeld ist owner-drawn.",
          "Früher führten das Zeichnen und das Anlegen der Controls je eigene Koordinaten, und eine Korrektur an der einen Stelle driftete still von der anderen weg. Heute lesen beide jede Y-Position aus einem einzigen Header, Theme.h, in Designeinheiten bei 96 DPI, die beim Start einmal skaliert werden.",
        ],
      },
      {
        heading: "Adminrechte und eine einzelne Exe, beides von der CI geprüft",
        body: [
          "Die Aufnahme stützt sich auf globale Low-Level-Hooks für Maus und Tastatur, und FLOW.manifest verlangt requireAdministrator, also zeigt Windows bei jedem Start eine UAC-Abfrage. Lassen sich die Hooks trotzdem nicht installieren, meldet Flow das in einem Fehlerfenster und beendet sich, statt ein Fenster zu öffnen, das nichts aufnehmen würde.",
          "Gebaut wird statisch gelinkt. Ohne das zieht std::thread die libwinpthread-1.dll nach, und die Exe startet auf keinem Rechner ohne MinGW. Die CI prüft bei jedem Push auf main beides: Sie schlägt fehl, wenn objdump eine MinGW-Runtime-DLL unter den Imports findet oder wenn das Manifest nicht in der Binary gelandet ist. Releases bringen SHA-256-Checksummen mit. Die Exe ist nicht signiert, deshalb warnt SmartScreen beim ersten Start.",
        ],
      },
    ],
    captions: ["Das App-Icon von FLOW: zwei weisse Winkel auf einem abgerundeten blauen Quadrat."],
    tags: ["C++", "Win32", "GDI+", "Automation", "Low-latency"],
    stats: [
      { value: "3 MB", label: "statische Exe" },
      { value: "0", label: "Abhängigkeiten" },
      { value: "<10 ms", label: "Timing-Genauigkeit" },
      { value: "0", label: "Telemetrie" },
    ],
  },
  fr: {
    downloadNote:
      "Premier lancement : Windows SmartScreen peut s’afficher. Choisissez « Informations complémentaires » → « Exécuter quand même », puis approuvez l’invite UAC : Flow tourne en administrateur pour pouvoir aussi enregistrer et cliquer dans les programmes lancés en administrateur.",
    tagline: "Clique plus vite que vous, et ne prend jamais de pause café.",
    description:
      "Une application Windows en C++17 qui enregistre des macros souris et clavier, les rejoue avec une précision sous les 10 ms, et embarque un auto-clicker à haute vitesse. Un exe lié statiquement, rien à installer.",
    overview:
      "Tous les auto-clickers que j'ai trouvés en ligne étaient soit des spywares, soit un téléchargement de forum de 2009, alors j'ai écrit le mien en C++17, directement contre l'API Win32 et GDI+. Il enregistre les mouvements de souris, les clics et les frappes avec un timing à la milliseconde, les rejoue à n'importe quelle vitesse et n'importe quel nombre de boucles, et embarque un auto-clicker distinct à haute priorité. Le timing dort pendant l'essentiel de chaque délai et attend activement les deux dernières millisecondes sur QueryPerformanceCounter, ce qui tient la précision sous les 10 ms là où Sleep seul n'en approche pas. L'interface est dessinée à la main, sans framework, et tout se lie statiquement en un seul FLOW.exe de 3 Mo. Il tourne en administrateur, parce que Windows empêche un processus normal d'enregistrer ou de cliquer dans les programmes lancés avec des droits élevés.",
    roleSummary: "Moi seul : le moteur, l'interface dessinée à la main, les scripts de build.",
    sections: [
      {
        heading: "Dormir pendant l'essentiel de l'attente, boucler sur les deux dernières millisecondes",
        body: [
          "Une macro ne vaut que par les écarts entre ses événements. Sleep seul est bien trop grossier pour ça, et une attente active pure tient la précision mais occupe un cœur de processeur à plein tant qu'un enregistrement marque une pause.",
          "Chaque délai est donc mesuré contre une cible absolue sur QueryPerformanceCounter. Flow dort tout sauf les deux dernières millisecondes et n'attend activement que cette fin. Le sommeil est découpé en tranches de 50 ms au plus, pour qu'un Stop pendant une longue pause d'un enregistrement prenne effet en moins de 50 ms, et non à la fin de la pause.",
        ],
        code: {
          language: "cpp",
          text: DELAY_CODE,
          caption:
            "Tiré de src/FlowEngine.cpp, sans ses commentaires. Le sommeil couvre tout sauf les deux dernières millisecondes, par tranches de 50 ms au plus pour qu'un arrêt soit entendu pendant une longue pause, et la boucle finale vérifie contre une cible absolue : découper le sommeil ne coûte donc aucune précision.",
        },
      },
      {
        heading: "Un clic tombe sur le même pixel, quel que soit l'écran",
        body: [
          "L'enregistrement stocke des coordonnées d'écran. Sur un bureau à plusieurs écrans de résolutions différentes, les rejouer en mouvements relatifs dérivait, alors chaque mouvement de souris repart en position absolue.",
          "Flow normalise le point sur tout le bureau virtuel, le borne et le ramène à la plage de 0 à 65535 que SendInput attend avec MOUSEEVENTF_VIRTUALDESK. Le même nombre désigne ainsi le même endroit sur tous les écrans.",
        ],
      },
      {
        heading: "Un fichier .rec est vérifié avant d'être cru",
        body: [
          "Les macros sont enregistrées sous forme d'un en-tête FLOW de quatre octets, d'un nombre d'événements et des structures brutes. C'est rapide et compact, mais un téléchargement interrompu ou un fichier abîmé peut annoncer n'importe quel nombre.",
          "LoadMacro mesure d'abord le fichier et refuse un nombre que les octets restants ne peuvent pas contenir, pour qu'un en-tête corrompu ne déclenche pas une allocation assez grosse pour faire planter le programme. Il refuse aussi un contenu tronqué et un fichier dont les horodatages reculent : la lecture soustrait des horodatages consécutifs, et un pas en arrière déborderait en une pause de plusieurs semaines.",
          "Les tests enregistrent puis rechargent une macro octet pour octet, et soumettent à LoadMacro un fichier qui n'est pas une macro, un nombre que le contenu ne peut pas tenir et un contenu tronqué.",
        ],
      },
      {
        heading: "Une seule table place tout dans la fenêtre",
        body: [
          "Il n'y a aucun framework d'interface. La fenêtre est du Win32 brut, avec GDI+ pour les formes lissées, et chaque bouton, interrupteur et champ numérique est dessiné par l'application elle-même (owner-drawn).",
          "Le dessin et la création des contrôles tenaient autrefois chacun leurs propres coordonnées, et un ajustement de l'un dérivait en silence de l'autre. Aujourd'hui, les deux lisent chaque position verticale dans un seul en-tête, Theme.h, en unités de conception à 96 DPI mises à l'échelle une fois au lancement.",
        ],
      },
      {
        heading: "Droits administrateur et un seul exe, tous deux vérifiés par la CI",
        body: [
          "L'enregistrement repose sur des hooks globaux de bas niveau pour la souris et le clavier, et FLOW.manifest déclare requireAdministrator : Windows affiche donc une invite UAC à chaque lancement. Si les hooks ne s'installent toujours pas, Flow le dit dans une boîte d'erreur et se ferme, plutôt que d'ouvrir une fenêtre qui n'enregistrerait rien.",
          "Le build est lié statiquement. Sans cela, std::thread entraîne libwinpthread-1.dll et l'exe ne démarre sur aucune machine sans MinGW. La CI vérifie les deux à chaque push sur main : elle échoue si objdump trouve une DLL du runtime MinGW parmi les imports, ou si le manifeste n'a pas été intégré au binaire. Les releases sont accompagnées de sommes SHA-256. L'exe n'est pas signé, donc SmartScreen prévient au premier lancement.",
        ],
      },
    ],
    captions: ["L'icône de FLOW : deux chevrons blancs sur un carré bleu aux coins arrondis."],
    tags: ["C++", "Win32", "GDI+", "Automation", "Low-latency"],
    stats: [
      { value: "3 Mo", label: "exe statique" },
      { value: "0", label: "dépendances" },
      { value: "<10 ms", label: "précision du timing" },
      { value: "0", label: "télémétrie" },
    ],
  },
  zh: {
    downloadNote:
      "首次启动：Windows SmartScreen 可能会提示，选择“更多信息”→“仍要运行”，然后允许 UAC 提示：Flow 以管理员身份运行，这样也能录制和点击同样以管理员身份运行的程序。",
    tagline: "点得比你快，而且从不需要歇一杯咖啡。",
    description:
      "一个用 C++17 写的 Windows 桌面程序：录制鼠标与键盘宏，以低于 10 毫秒的精度回放，另带一个高速连点器。静态链接的单个 exe，无需安装。",
    overview:
      "网上能找到的连点器，要么是间谍软件，要么是 2009 年的论坛附件，于是我用 C++17 自己写了一个，直接对着 Win32 API 和 GDI+ 写。它以毫秒级时间戳录制鼠标移动、点击和按键，可以按任意速度、任意循环次数回放，另外还带一个独立的高优先级连点器。计时在每段延迟的大部分时间里休眠，只在最后两毫秒基于 QueryPerformanceCounter 忙等，把精度压在 10 毫秒以内，Sleep 差得远。界面全部手绘，没有框架，全部静态链接成一个 3 MB 的 FLOW.exe。它以管理员身份运行，因为 Windows 不允许普通进程录制或点击以提升权限运行的程序。",
    roleSummary: "只有我：引擎、手绘界面、构建脚本。",
    sections: [
      {
        heading: "大部分时间睡眠，最后两毫秒忙等",
        body: [
          "宏好不好用，取决于事件之间的间隔。单靠 Sleep 太粗；纯忙等虽然精度够，但只要录制里有停顿，就会把一整个 CPU 核心占满。",
          "所以每个延迟都对照 QueryPerformanceCounter 上的一个绝对目标时间来计算。Flow 先睡掉除最后两毫秒之外的全部时间，只在这段尾巴上忙等。睡眠被切成每段最多 50 毫秒，这样在录制中的长停顿里按下停止，50 毫秒内就会生效，不用等到停顿结束。",
        ],
        code: {
          language: "cpp",
          text: DELAY_CODE,
          caption:
            "摘自 src/FlowEngine.cpp，省略了注释。除最后两毫秒外全部用睡眠度过，每段最多 50 毫秒，好让长停顿中也能响应停止；结尾的循环对照绝对目标检查，所以切分睡眠不损失精度。",
        },
      },
      {
        heading: "在每块屏幕上，点击都落在同一个像素",
        body: [
          "录制保存的是屏幕坐标。在多台分辨率不同的显示器上，用相对移动回放会漂移，所以每次鼠标移动都以绝对位置发出。",
          "Flow 把坐标点按整个虚拟桌面归一化并限定范围，再缩放到 SendInput 配合 MOUSEEVENTF_VIRTUALDESK 所要求的 0 到 65535 区间。这样同一个数值在所有屏幕上都指向同一个位置。",
        ],
      },
      {
        heading: ".rec 文件先检查，再相信",
        body: [
          "宏文件的格式是四字节的 FLOW 文件头、一个事件数量，然后是原始的事件结构体。这样又快又小，但也意味着下载中断或文件损坏时，文件头可以声明任意数量。",
          "LoadMacro 会先测量文件大小，剩余字节装不下的数量直接拒绝，免得坏掉的文件头触发一次大到让程序崩溃的内存分配。被截断的内容也会被拒绝，时间戳倒退的文件同样如此：回放时要把相邻时间戳相减，倒退一步就会下溢成长达数周的停顿。",
          "测试会把宏逐字节地保存再读回，并把不是宏的文件、内容装不下的数量和被截断的内容分别交给 LoadMacro。",
        ],
      },
      {
        heading: "一张表决定窗口里的所有位置",
        body: [
          "没有任何界面框架。窗口是原生 Win32，抗锯齿图形用 GDI+ 绘制，每个按钮、开关和数字输入框都是 owner-drawn 自绘的。",
          "以前绘制代码和创建控件的代码各有一份坐标，改了一边，另一边就会悄悄错位。现在两边的每个纵向位置都从同一个头文件 Theme.h 读取，单位是 96 DPI 下的设计单位，启动时统一缩放一次。",
        ],
      },
      {
        heading: "管理员权限和单个 exe，都由 CI 检查",
        body: [
          "录制依赖全局的低级鼠标和键盘钩子，FLOW.manifest 声明了 requireAdministrator，所以 Windows 每次启动都会弹出 UAC 提示。如果钩子仍然装不上，Flow 会弹出错误框并退出，而不是打开一个什么都录不到的窗口。",
          "构建采用静态链接。否则 std::thread 会引入 libwinpthread-1.dll，exe 在没装 MinGW 的机器上根本启动不了。CI 在每次推送到 main 时检查这两点：objdump 在导入表里发现 MinGW 运行库 DLL，或者清单没有嵌进二进制文件，构建就会失败。每个发布都附带 SHA-256 校验和。exe 没有代码签名，所以首次启动时 SmartScreen 会提示。",
        ],
      },
    ],
    captions: ["FLOW 的应用图标：圆角蓝色方块上的两个白色箭头。"],
    tags: ["C++", "Win32", "GDI+", "Automation", "Low-latency"],
    stats: [
      { value: "3 MB", label: "静态 exe" },
      { value: "0", label: "依赖" },
      { value: "<10 ms", label: "计时精度" },
      { value: "0", label: "遥测" },
    ],
  },
};
