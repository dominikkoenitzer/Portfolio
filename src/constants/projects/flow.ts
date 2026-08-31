import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const flow: Record<Language, LocalizedContent> = {
  en: {
    tagline: "Clicks faster than you can, and never needs a coffee break.",
    description:
      "A Windows desktop app in C++17 that records mouse and keyboard macros, replays them with sub-10 ms timing, and runs a high-speed auto-clicker. One statically linked exe, nothing to install.",
    overview:
      "Every auto-clicker I could find online was either spyware or a forum download from 2009, so I wrote my own in C++17, straight against the Win32 API and GDI+. It records mouse moves, clicks and keystrokes with millisecond timing, replays them at any speed and any loop count, and carries a separate high-priority auto-clicker. The timing is a busy-wait QueryPerformanceCounter loop, which holds precision under 10 ms where Sleep does not come close. The UI is drawn by hand with no framework, and everything links statically into one 3 MB FLOW.exe. It does have to run as Administrator: Windows only lets an elevated process install global input hooks.",
    roleSummary: "Just me: the engine, the hand-drawn UI, the build scripts.",
    problemStatement:
      "The automation tools I found were either cross-platform Electron installs or scripts whose timing quietly drifts until the macro starts missing. I wanted a small native binary that replays input at the speed it recorded it.",
    objectives: [
      "Record mouse moves, clicks and keystrokes with millisecond timing.",
      "Replay them at any speed, for a finite or infinite number of loops, and land in the same place every time.",
      "Ship a standalone high-speed auto-clicker that does not need a recording first.",
    ],
    architectureDecisions: [
      "The engine (recording, playback, auto-clicker, timing) is kept entirely separate from the Win32 GUI, so the core logic never depends on a particular button existing.",
      "A busy-wait QueryPerformanceCounter timer for sub-10 ms precision. Sleep is nowhere near fine-grained enough for this.",
      "The whole UI is drawn by hand in Win32 and GDI+, then linked statically, so the download is a single file with no runtime to install.",
    ],
    implementationHighlights: [
      "Global low-level input hooks to capture and inject mouse and keyboard events, which is also why the app asks for elevation on launch.",
      "Playback in absolute, virtual-desktop-normalized coordinates, so a click lands where it should on a multi-monitor setup with mismatched resolutions.",
      "Optional Gaussian jitter on the delays, for when you would rather the playback did not tick like a metronome.",
      "Four customizable global hotkeys, drag-and-drop for .rec files, and a window that reopens where you left it.",
    ],
    qualityAndSecurity: [
      "27 test cases over the engine, the macro format and the humanization math.",
      "CI runs objdump across the built exe and fails the release if a non-system DLL shows up, so the static linking is checked rather than assumed.",
      "Every release ships SHA-256 checksums. The exe is unsigned, so SmartScreen warns on first launch, and the README walks through it.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Sleep-based timing was far too coarse for accurate replay, so long macros drifted out of sync with themselves.",
        solution:
          "Wrote a busy-wait QueryPerformanceCounter timer that holds precision under 10 ms.",
      },
      {
        challenge:
          "Mouse playback drifted on multi-monitor setups with mismatched resolutions.",
        solution:
          "Every move replays as an absolute coordinate normalized against the whole virtual desktop, so clicks land correctly across all displays.",
      },
    ],
    hiringSignals: [
      "I am comfortable working low down: C++17, Win32, GDI+, input hooks, high-resolution timers.",
      "I drew the entire interface myself, owner-drawn buttons, switches and inline numeric fields included.",
      "I automated the release: CI builds the binary, verifies it is self-contained, and publishes it with checksums.",
    ],
    nextIterations: [
      "A conditional step type, so a macro can branch.",
      "Editing and trimming a recording inside the app, so one bad click does not mean recording the whole thing again.",
      "A code-signing certificate, so SmartScreen stops treating FLOW like a stranger.",
    ],
    tags: ["C++", "Win32", "GDI+", "Automation", "Low-latency"],
    impactHeading: "What This Project Demonstrates",
    impactPoints: [
      "Turns repetitive mouse and keyboard work into something you set up once.",
      "A desktop tool that ships as one native exe with nothing to install alongside it.",
      "Timing held under 10 ms against a hardware performance counter.",
    ],
    stats: [
      { value: "3 MB", label: "static exe" },
      { value: "0", label: "dependencies" },
      { value: "<10 ms", label: "timing precision" },
      { value: "0", label: "telemetry" },
    ],
  },
  de: {
    tagline: "Klickt schneller als du und braucht nie eine Kaffeepause.",
    description:
      "Eine Windows-Desktop-App in C++17, die Maus- und Tastaturmakros aufnimmt, sie mit unter 10 ms Genauigkeit abspielt und einen Hochgeschwindigkeits-Autoclicker mitbringt. Eine statisch gelinkte Exe, nichts zu installieren.",
    overview:
      "Jeder Autoclicker, den ich online fand, war entweder Spyware oder ein Forum-Download von 2009, also schrieb ich meinen eigenen in C++17, direkt gegen die Win32-API und GDI+. Er nimmt Mausbewegungen, Klicks und Tastenanschläge mit Millisekunden-Timing auf, spielt sie in jeder Geschwindigkeit und Wiederholungszahl ab und bringt einen eigenen Autoclicker mit hoher Priorität mit. Das Timing ist eine Busy-Wait-Schleife auf QueryPerformanceCounter, die die Genauigkeit unter 10 ms hält, wo Sleep nicht annähernd hinkommt. Die UI ist von Hand gezeichnet, ohne Framework, und alles linkt statisch in eine 3 MB grosse FLOW.exe. Sie muss als Administrator laufen: Windows erlaubt globale Input-Hooks nur einem erhöhten Prozess.",
    roleSummary: "Nur ich: die Engine, die handgezeichnete UI, die Build-Skripte.",
    problemStatement:
      "Die Automatisierungswerkzeuge, die ich fand, waren entweder plattformübergreifende Electron-Installationen oder Skripte, deren Timing still driftet, bis das Makro danebengreift. Ich wollte eine kleine native Binary, die Eingaben so schnell abspielt, wie sie sie aufgenommen hat.",
    objectives: [
      "Mausbewegungen, Klicks und Tastenanschläge mit Millisekunden-Timing aufnehmen.",
      "Sie in jeder Geschwindigkeit abspielen, endlich oder endlos oft, und jedes Mal an derselben Stelle landen.",
      "Einen eigenständigen Hochgeschwindigkeits-Autoclicker mitliefern, der keine Aufnahme voraussetzt.",
    ],
    architectureDecisions: [
      "Die Engine (Aufnahme, Wiedergabe, Autoclicker, Timing) bleibt vollständig von der Win32-GUI getrennt, damit die Kernlogik nie davon abhängt, dass ein bestimmter Button existiert.",
      "Ein Busy-Wait-Timer auf QueryPerformanceCounter für Genauigkeit unter 10 ms. Sleep ist dafür bei Weitem zu grob.",
      "Die gesamte UI ist von Hand in Win32 und GDI+ gezeichnet und dann statisch gelinkt, damit der Download eine einzige Datei ohne Runtime ist.",
    ],
    implementationHighlights: [
      "Globale Low-Level-Input-Hooks zum Erfassen und Einspeisen von Maus- und Tastaturereignissen, weshalb die App beim Start auch nach Adminrechten fragt.",
      "Wiedergabe in absoluten, auf den virtuellen Desktop normalisierten Koordinaten, damit ein Klick auch bei mehreren Monitoren mit unterschiedlichen Auflösungen dort landet, wo er soll.",
      "Optionaler gaussscher Jitter auf den Verzögerungen, für den Fall, dass die Wiedergabe nicht wie ein Metronom ticken soll.",
      "Vier anpassbare globale Hotkeys, Drag-and-drop für .rec-Dateien und ein Fenster, das dort aufgeht, wo man es verlassen hat.",
    ],
    qualityAndSecurity: [
      "27 Testfälle über die Engine, das Makroformat und die Humanization-Mathematik.",
      "Die CI lässt objdump über die gebaute Exe laufen und bricht das Release ab, sobald eine Nicht-System-DLL auftaucht; das statische Linken ist damit geprüft und nicht bloss behauptet.",
      "Jedes Release bringt SHA-256-Checksummen mit. Die Exe ist unsigniert, also warnt SmartScreen beim ersten Start, und die README führt hindurch.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Sleep-basiertes Timing war für genaue Wiedergabe viel zu grob, also liefen lange Makros mit sich selbst aus dem Takt.",
        solution:
          "Einen Busy-Wait-Timer auf QueryPerformanceCounter geschrieben, der die Genauigkeit unter 10 ms hält.",
      },
      {
        challenge:
          "Die Mauswiedergabe driftete bei Mehrmonitor-Setups mit unterschiedlichen Auflösungen.",
        solution:
          "Jede Bewegung wird als absolute, auf den ganzen virtuellen Desktop normalisierte Koordinate abgespielt, damit Klicks über alle Bildschirme korrekt landen.",
      },
    ],
    hiringSignals: [
      "Ich arbeite gern tief unten: C++17, Win32, GDI+, Input-Hooks, hochauflösende Timer.",
      "Ich habe die komplette Oberfläche selbst gezeichnet, samt owner-drawn Buttons, Schaltern und Inline-Zahlenfeldern.",
      "Ich habe das Release automatisiert: Die CI baut die Binary, prüft, dass sie eigenständig ist, und veröffentlicht sie mit Checksummen.",
    ],
    nextIterations: [
      "Ein bedingter Schritttyp, damit ein Makro verzweigen kann.",
      "Aufnahmen in der App bearbeiten und kürzen, damit ein Fehlklick nicht die ganze Aufnahme kostet.",
      "Ein Code-Signing-Zertifikat, damit SmartScreen FLOW nicht mehr wie einen Fremden behandelt.",
    ],
    tags: ["C++", "Win32", "GDI+", "Automation", "Low-latency"],
    impactHeading: "Was dieses Projekt zeigt",
    impactPoints: [
      "Macht aus wiederkehrender Maus- und Tastaturarbeit etwas, das man einmal einrichtet.",
      "Ein Desktop-Tool, das als eine einzige native Exe ausgeliefert wird, ohne Beipack.",
      "Timing, das gegen einen Hardware-Performance-Counter unter 10 ms bleibt.",
    ],
    stats: [
      { value: "3 MB", label: "statische Exe" },
      { value: "0", label: "Abhängigkeiten" },
      { value: "<10 ms", label: "Timing-Genauigkeit" },
      { value: "0", label: "Telemetrie" },
    ],
  },
  fr: {
    tagline: "Clique plus vite que vous, et ne prend jamais de pause café.",
    description:
      "Une application Windows en C++17 qui enregistre des macros souris et clavier, les rejoue avec une précision sous les 10 ms, et embarque un auto-clicker à haute vitesse. Un exe lié statiquement, rien à installer.",
    overview:
      "Tous les auto-clickers que j'ai trouvés en ligne étaient soit des spywares, soit un téléchargement de forum de 2009, alors j'ai écrit le mien en C++17, directement contre l'API Win32 et GDI+. Il enregistre les mouvements de souris, les clics et les frappes avec un timing à la milliseconde, les rejoue à n'importe quelle vitesse et n'importe quel nombre de boucles, et embarque un auto-clicker distinct à haute priorité. Le timing est une boucle d'attente active sur QueryPerformanceCounter, qui tient la précision sous les 10 ms là où Sleep n'en approche pas. L'interface est dessinée à la main, sans framework, et tout se lie statiquement en un seul FLOW.exe de 3 Mo. Il doit tourner en administrateur : Windows n'autorise les hooks d'entrée globaux qu'à un processus élevé.",
    roleSummary: "Moi seul : le moteur, l'interface dessinée à la main, les scripts de build.",
    problemStatement:
      "Les outils d'automatisation que je trouvais étaient soit des installations Electron multiplateformes, soit des scripts dont le timing dérive discrètement jusqu'à ce que la macro rate. Je voulais un petit binaire natif qui rejoue les entrées à la vitesse où il les a enregistrées.",
    objectives: [
      "Enregistrer mouvements de souris, clics et frappes avec un timing à la milliseconde.",
      "Les rejouer à n'importe quelle vitesse, pour un nombre fini ou infini de boucles, et retomber au même endroit chaque fois.",
      "Livrer un auto-clicker autonome à haute vitesse qui ne demande pas d'enregistrement préalable.",
    ],
    architectureDecisions: [
      "Le moteur (enregistrement, lecture, auto-clicker, timing) reste entièrement séparé de l'interface Win32, pour que la logique centrale ne dépende jamais de l'existence d'un bouton donné.",
      "Un minuteur à attente active sur QueryPerformanceCounter pour une précision sous les 10 ms. Sleep est bien trop grossier pour ça.",
      "Toute l'interface est dessinée à la main en Win32 et GDI+, puis liée statiquement, pour que le téléchargement soit un fichier unique sans runtime à installer.",
    ],
    implementationHighlights: [
      "Des hooks d'entrée globaux de bas niveau pour capturer et injecter les événements souris et clavier, ce qui explique aussi la demande d'élévation au lancement.",
      "Une lecture en coordonnées absolues normalisées sur le bureau virtuel, pour qu'un clic atterrisse au bon endroit sur un montage multi-écrans aux résolutions différentes.",
      "Un jitter gaussien optionnel sur les délais, pour les fois où vous préférez que la lecture ne batte pas comme un métronome.",
      "Quatre raccourcis globaux personnalisables, le glisser-déposer de fichiers .rec, et une fenêtre qui se rouvre là où vous l'avez laissée.",
    ],
    qualityAndSecurity: [
      "27 cas de test sur le moteur, le format de macro et les maths de l'humanisation.",
      "La CI passe objdump sur l'exe construit et fait échouer la release si une DLL non système apparaît : la liaison statique est donc vérifiée, pas supposée.",
      "Chaque release publie des sommes SHA-256. L'exe n'est pas signé, donc SmartScreen prévient au premier lancement, et le README explique la manœuvre.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Un timing basé sur Sleep était bien trop grossier pour une lecture précise, donc les longues macros se désynchronisaient d'elles-mêmes.",
        solution:
          "Écrit un minuteur à attente active sur QueryPerformanceCounter qui tient la précision sous les 10 ms.",
      },
      {
        challenge:
          "La lecture de la souris dérivait sur les configurations multi-écrans aux résolutions différentes.",
        solution:
          "Chaque mouvement est rejoué en coordonnée absolue normalisée sur tout le bureau virtuel, pour que les clics atterrissent correctement sur tous les écrans.",
      },
    ],
    hiringSignals: [
      "Je suis à l'aise tout en bas : C++17, Win32, GDI+, hooks d'entrée, minuteurs haute résolution.",
      "J'ai dessiné toute l'interface moi-même, boutons owner-drawn, interrupteurs et champs numériques en ligne compris.",
      "J'ai automatisé la release : la CI construit le binaire, vérifie qu'il est autonome, et le publie avec ses sommes de contrôle.",
    ],
    nextIterations: [
      "Un type d'étape conditionnel, pour qu'une macro puisse se ramifier.",
      "L'édition et le rognage d'un enregistrement dans l'app, pour qu'un mauvais clic ne coûte pas tout l'enregistrement.",
      "Un certificat de signature de code, pour que SmartScreen arrête de traiter FLOW comme un inconnu.",
    ],
    tags: ["C++", "Win32", "GDI+", "Automation", "Low-latency"],
    impactHeading: "Ce que ce projet démontre",
    impactPoints: [
      "Transforme le travail répétitif à la souris et au clavier en quelque chose qu'on règle une fois.",
      "Un outil de bureau livré en un seul exe natif, sans rien à installer à côté.",
      "Un timing tenu sous les 10 ms contre un compteur de performance matériel.",
    ],
    stats: [
      { value: "3 Mo", label: "exe statique" },
      { value: "0", label: "dépendances" },
      { value: "<10 ms", label: "précision du timing" },
      { value: "0", label: "télémétrie" },
    ],
  },
  zh: {
    tagline: "点得比你快，而且从不需要歇一杯咖啡。",
    description:
      "一个用 C++17 写的 Windows 桌面程序：录制鼠标与键盘宏，以低于 10 毫秒的精度回放，另带一个高速连点器。静态链接的单个 exe，无需安装。",
    overview:
      "网上能找到的连点器，要么是间谍软件，要么是 2009 年的论坛附件，于是我用 C++17 自己写了一个，直接对着 Win32 API 和 GDI+ 写。它以毫秒级时间戳录制鼠标移动、点击和按键，可以按任意速度、任意循环次数回放，另外还带一个独立的高优先级连点器。计时用的是基于 QueryPerformanceCounter 的忙等循环，把精度压在 10 毫秒以内，Sleep 差得远。界面全部手绘，没有框架，全部静态链接成一个 3 MB 的 FLOW.exe。它确实需要以管理员身份运行：Windows 只允许提权进程安装全局输入钩子。",
    roleSummary: "只有我：引擎、手绘界面、构建脚本。",
    problemStatement:
      "我找到的自动化工具，要么是跨平台的 Electron 安装包，要么是计时会悄悄漂移、直到宏开始点空的脚本。我想要一个小小的原生程序，用录下来的那个速度把输入放回去。",
    objectives: [
      "以毫秒级时间戳录制鼠标移动、点击和按键。",
      "以任意速度回放，循环有限次或无限次，每次都落在同一个位置。",
      "附带一个独立的高速连点器，不必先录一段宏。",
    ],
    architectureDecisions: [
      "引擎（录制、回放、连点、计时）与 Win32 界面彻底分开，核心逻辑绝不依赖某个按钮是否存在。",
      "用基于 QueryPerformanceCounter 的忙等计时器换取低于 10 毫秒的精度。Sleep 的粒度差得太远。",
      "整个界面用 Win32 和 GDI+ 手绘，然后静态链接，让下载下来的就是一个文件，不必再装运行库。",
    ],
    implementationHighlights: [
      "用全局低级输入钩子捕获并注入鼠标与键盘事件，这也是程序启动时要请求提权的原因。",
      "回放使用相对整个虚拟桌面归一化的绝对坐标，即使多显示器分辨率不一致，点击也落在该落的地方。",
      "延迟上可选的高斯抖动，适合你不想让回放像节拍器一样规整的时候。",
      "四个可自定义的全局快捷键、.rec 文件拖放，以及一个会回到你上次位置的窗口。",
    ],
    qualityAndSecurity: [
      "27 个测试用例，覆盖引擎、宏格式和拟人化抖动的数学部分。",
      "CI 会对构建出的 exe 跑 objdump，一旦出现非系统 DLL 就让发布失败，所以静态链接是查出来的，不是嘴上说的。",
      "每个发布都带 SHA-256 校验和。exe 未签名，所以 SmartScreen 会在首次启动时提示，README 里写了怎么走过去。",
    ],
    challengesAndSolutions: [
      {
        challenge: "基于 Sleep 的计时对精确回放来说太粗，长一点的宏会跟自己脱拍。",
        solution: "写了一个基于 QueryPerformanceCounter 的忙等计时器，把精度守在 10 毫秒以内。",
      },
      {
        challenge: "在分辨率不一致的多显示器配置下，鼠标回放会漂。",
        solution: "每次移动都按整个虚拟桌面归一化成绝对坐标回放，让点击在所有屏幕上都落对。",
      },
    ],
    hiringSignals: [
      "我乐意往底层走：C++17、Win32、GDI+、输入钩子、高分辨率计时器。",
      "整套界面是我自己画的，包括 owner-drawn 的按钮、开关和内嵌数字输入框。",
      "发布流程我自动化了：CI 负责构建、验证它是自包含的，再带上校验和发出去。",
    ],
    nextIterations: [
      "一种条件步骤类型，让宏可以分支。",
      "在程序内编辑和裁剪录制，免得点错一下就要整段重录。",
      "一张代码签名证书，让 SmartScreen 别再把 FLOW 当陌生人。",
    ],
    tags: ["C++", "Win32", "GDI+", "Automation", "Low-latency"],
    impactHeading: "这个项目展示了什么",
    impactPoints: [
      "把重复的鼠标键盘活儿变成设置一次就好的事。",
      "一个桌面工具，交付时就是一个原生 exe，旁边什么都不用装。",
      "对着硬件性能计数器，把计时守在 10 毫秒以内。",
    ],
    stats: [
      { value: "3 MB", label: "静态 exe" },
      { value: "0", label: "依赖" },
      { value: "<10 ms", label: "计时精度" },
      { value: "0", label: "遥测" },
    ],
  },
};
