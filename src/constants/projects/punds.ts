import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const punds: Record<Language, LocalizedContent> = {
  en: {
    tagline: "A list of my links, hidden inside a 3D world you fly through.",
    description:
      "Punds is my one-page link hub, built as a navigable Three.js world in the style of Copland OS from Serial Experiments Lain. Drag to look around, scroll to fly, click a floating panel to open the link.",
    overview:
      "I got tired of pasting five links every time someone asked what I had built, so I made one page that points at all of them. Then I refused to make it a list. Punds boots like Copland OS, the operating system from Serial Experiments Lain: a logo splash, a streaming boot log, a low voice saying \"present day, present time\", and then you drop into a Three.js world. Holographic panels orbit a glowing logo in the fog, you drag to look and scroll to fly, and clicking a panel dives the camera into it before the link opens. The runtime dependency list is react, react-dom and three. That is all of it.",
    roleSummary:
      "Just me, including the parts nobody asked for: the boot log, the voice, the koi.",
    problemStatement:
      "A handful of scattered projects and profiles is annoying to share; you end up reciting URLs. Punds folds the pile into one address I can hand over, and since I was building it anyway, I used it as an excuse to learn real-time 3D.",
    objectives: [
      "Put every project, profile and site behind one shareable address.",
      "Learn Three.js on something with a scene in it, not a tutorial cube.",
      "Keep the runtime dependencies down to react, react-dom and three.",
    ],
    architectureDecisions: [
      "Three.js r185 with an EffectComposer chain for bloom, glitch and tone mapping, all owned by one CoplandScene class that holds the renderer, the camera and the loop.",
      "Every visual is a self-contained SceneFeature module (the reflective floor, the mirror city overhead, the data rain, the koi), so I can add or delete one without touching the rest.",
      "No router, no global store, no data layer. React keeps the boot phase in useState and the DOM overlays sit on top of the canvas.",
    ],
    implementationHighlights: [
      "A boot sequence: logo splash, a streaming Copland OS log, then a low-pitched Web Speech utterance greeting you.",
      "Billboarded link panels orbiting the central logo. Click one and the camera dives into it before the link opens.",
      "An ambient Web Audio drone whose bass level feeds back into the visuals, and an idle timer that slowly thickens the fog and the whispering if you sit still.",
      "An FPS sampler that steps the quality tier up and down at runtime so the scene keeps its frame rate on weaker machines.",
    ],
    qualityAndSecurity: [
      "A screen-reader and no-WebGL layer carries the same links as plain HTML underneath the canvas, so the page still works when the scene cannot run.",
      "Strict TypeScript across the project references, type-checked on every build.",
      "Static output and no server. Every crawler gets noindex and nofollow through meta tags and robots.txt; if you found it, you went looking.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "A full-screen WebGL scene with bloom, fog and fifteen moving things in it will happily melt a laptop.",
        solution:
          "An FPS sampler steps quality tiers up and down while it runs, and keeping each effect in its own module let me measure what every one of them costs.",
      },
      {
        challenge:
          "The whole page is a canvas, which means a screen reader sees nothing and a browser without WebGL sees less.",
        solution:
          "The real links live in an accessible HTML layer under the scene, and the canvas and every overlay are aria-hidden, so the fallback is the content itself.",
      },
    ],
    hiringSignals: [
      "Real-time 3D written by hand: Three.js, post-processing passes, and a render loop I have to keep inside a frame budget.",
      "Web Audio and Web Speech wired into the visuals, so the drone's bass level changes what you see.",
      "The dependency list stayed at three packages while the scene grew to fifteen modules.",
    ],
    nextIterations: [
      "Touch controls that feel as good as drag-and-scroll does on a desktop.",
      "More lore in the world worth flying over to find.",
    ],
    tags: ["React", "TypeScript", "Three.js", "CRT"],
    impactHeading: "What This Project Is Good For",
    impactPoints: [
      "Gives everything I build one address I can hand to someone.",
      "Taught me real-time 3D by making me keep a busy scene at frame rate.",
      "Shows the visual side of what I do, which a résumé bullet cannot.",
    ],
    stats: [
      { value: "3", label: "runtime deps" },
      { value: "15", label: "scene modules" },
      { value: "0", label: "UI frameworks" },
      { value: "1", label: "page" },
    ],
  },
  de: {
    tagline: "Eine Liste meiner Links, versteckt in einer 3D-Welt, durch die man fliegt.",
    description:
      "Punds ist mein einseitiger Link-Hub, gebaut als begehbare Three.js-Welt im Stil von Copland OS aus Serial Experiments Lain. Ziehen zum Umsehen, scrollen zum Fliegen, ein schwebendes Panel anklicken, um den Link zu öffnen.",
    overview:
      "Ich hatte es satt, fünf Links zu kopieren, sobald jemand fragte, was ich gebaut habe. Also machte ich eine Seite, die auf alle zeigt. Und weigerte mich dann, eine Liste daraus zu machen. Punds fährt hoch wie Copland OS, das Betriebssystem aus Serial Experiments Lain: ein Logo-Splash, ein durchlaufendes Boot-Log, eine tiefe Stimme, die „present day, present time“ sagt, und dann fällt man in eine Three.js-Welt. Holografische Panels kreisen im Nebel um ein leuchtendes Logo, man zieht, um sich umzusehen, und scrollt, um zu fliegen, und ein Klick lässt die Kamera in das Panel tauchen, bevor der Link aufgeht. Die Laufzeit-Abhängigkeiten sind react, react-dom und three. Das ist alles.",
    roleSummary:
      "Nur ich, samt der Teile, nach denen niemand gefragt hat: das Boot-Log, die Stimme, die Kois.",
    problemStatement:
      "Eine Handvoll verstreuter Projekte und Profile ist mühsam zu teilen; am Ende rasselt man URLs herunter. Punds faltet den Haufen auf eine Adresse zusammen, die ich weitergeben kann, und weil ich sowieso baute, nahm ich es als Vorwand, Echtzeit-3D zu lernen.",
    objectives: [
      "Jedes Projekt, Profil und jede Site hinter eine teilbare Adresse bringen.",
      "Three.js an etwas lernen, in dem eine Szene steckt, und nicht an einem Tutorial-Würfel.",
      "Die Laufzeit-Abhängigkeiten auf react, react-dom und three beschränken.",
    ],
    architectureDecisions: [
      "Three.js r185 mit einer EffectComposer-Kette für Bloom, Glitch und Tone Mapping, alles in einer CoplandScene-Klasse, die Renderer, Kamera und Loop hält.",
      "Jedes Visual ist ein eigenständiges SceneFeature-Modul (der spiegelnde Boden, die Spiegelstadt über Kopf, der Datenregen, die Kois), also kann ich eines ergänzen oder löschen, ohne den Rest anzufassen.",
      "Kein Router, kein globaler Store, keine Datenschicht. React hält die Boot-Phase in useState, und die DOM-Overlays liegen über dem Canvas.",
    ],
    implementationHighlights: [
      "Eine Boot-Sequenz: Logo-Splash, ein durchlaufendes Copland-OS-Log, dann eine tief gestimmte Web-Speech-Begrüssung.",
      "Als Billboards ausgerichtete Link-Panels, die um das zentrale Logo kreisen. Ein Klick, und die Kamera taucht hinein, bevor der Link aufgeht.",
      "Eine Web-Audio-Drone, deren Basspegel in die Visuals zurückläuft, und ein Idle-Timer, der Nebel und Geflüster langsam dichter macht, wenn man stillsitzt.",
      "Ein FPS-Sampler, der die Qualitätsstufe zur Laufzeit hoch- und runterschaltet, damit die Szene auch auf schwächeren Rechnern ihre Framerate hält.",
    ],
    qualityAndSecurity: [
      "Eine Screenreader- und No-WebGL-Schicht trägt dieselben Links als reines HTML unter dem Canvas, damit die Seite funktioniert, wenn die Szene nicht laufen kann.",
      "Striktes TypeScript über alle Projektreferenzen, bei jedem Build typgeprüft.",
      "Statische Ausgabe, kein Server. Jeder Crawler bekommt noindex und nofollow über Meta-Tags und robots.txt; wer die Seite gefunden hat, hat gesucht.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Eine bildschirmfüllende WebGL-Szene mit Bloom, Nebel und fünfzehn beweglichen Dingen bringt einen Laptop bereitwillig zum Schmelzen.",
        solution:
          "Ein FPS-Sampler schaltet die Qualitätsstufen im Betrieb hoch und runter, und weil jeder Effekt in seinem eigenen Modul steckt, konnte ich messen, was jeder einzelne kostet.",
      },
      {
        challenge:
          "Die ganze Seite ist ein Canvas, also sieht ein Screenreader nichts und ein Browser ohne WebGL noch weniger.",
        solution:
          "Die echten Links liegen in einer zugänglichen HTML-Schicht unter der Szene, und Canvas wie Overlays sind aria-hidden, damit der Fallback der Inhalt selbst ist.",
      },
    ],
    hiringSignals: [
      "Echtzeit-3D von Hand: Three.js, Post-Processing-Passes und ein Render-Loop, den ich im Frame-Budget halten muss.",
      "Web Audio und Web Speech greifen in die Visuals ein, sodass der Basspegel der Drone verändert, was man sieht.",
      "Die Abhängigkeitsliste blieb bei drei Paketen, während die Szene auf fünfzehn Module wuchs.",
    ],
    nextIterations: [
      "Touch-Steuerung, die sich so gut anfühlt wie Ziehen und Scrollen am Desktop.",
      "Mehr Lore in der Welt, für die es sich lohnt, hinzufliegen.",
    ],
    tags: ["React", "TypeScript", "Three.js", "CRT"],
    impactHeading: "Wofür dieses Projekt gut ist",
    impactPoints: [
      "Gibt allem, was ich baue, eine Adresse, die ich weitergeben kann.",
      "Hat mir Echtzeit-3D beigebracht, weil ich eine volle Szene auf Framerate halten musste.",
      "Zeigt die visuelle Seite meiner Arbeit, was ein Lebenslauf-Stichpunkt nicht kann.",
    ],
    stats: [
      { value: "3", label: "Laufzeit-Deps" },
      { value: "15", label: "Szenen-Module" },
      { value: "0", label: "UI-Frameworks" },
      { value: "1", label: "Seite" },
    ],
  },
  fr: {
    tagline: "La liste de mes liens, cachée dans un monde 3D que l'on traverse en vol.",
    description:
      "Punds est mon hub de liens en une page, construit comme un monde Three.js navigable dans le style de Copland OS, dans Serial Experiments Lain. Glissez pour regarder, scrollez pour voler, cliquez un panneau flottant pour ouvrir le lien.",
    overview:
      "J'en avais assez de copier cinq liens chaque fois qu'on me demandait ce que j'avais construit, alors j'ai fait une page qui pointe vers tous. Puis j'ai refusé d'en faire une liste. Punds démarre comme Copland OS, le système d'exploitation de Serial Experiments Lain : un logo, un journal de démarrage qui défile, une voix grave qui dit « present day, present time », et on tombe dans un monde Three.js. Des panneaux holographiques tournent autour d'un logo lumineux dans la brume, on glisse pour regarder et on scrolle pour voler, et un clic fait plonger la caméra dedans avant que le lien s'ouvre. Les dépendances d'exécution sont react, react-dom et three. C'est tout.",
    roleSummary:
      "Moi seul, y compris les parties que personne n'avait demandées : le journal de démarrage, la voix, les carpes.",
    problemStatement:
      "Une poignée de projets et de profils éparpillés est pénible à partager : on finit par réciter des URLs. Punds replie le tas en une seule adresse que je peux transmettre, et comme je construisais de toute façon, ça m'a servi de prétexte pour apprendre la 3D temps réel.",
    objectives: [
      "Mettre chaque projet, profil et site derrière une seule adresse partageable.",
      "Apprendre Three.js sur quelque chose qui contient une scène, pas sur un cube de tutoriel.",
      "Limiter les dépendances d'exécution à react, react-dom et three.",
    ],
    architectureDecisions: [
      "Three.js r185 avec une chaîne EffectComposer pour le bloom, le glitch et le tone mapping, le tout tenu par une classe CoplandScene qui possède le renderer, la caméra et la boucle.",
      "Chaque élément visuel est un module SceneFeature autonome (le sol réfléchissant, la ville-miroir au-dessus, la pluie de données, les carpes), donc je peux en ajouter ou en supprimer un sans toucher aux autres.",
      "Pas de routeur, pas de store global, pas de couche de données. React garde la phase de démarrage dans un useState et les superpositions DOM se posent sur le canvas.",
    ],
    implementationHighlights: [
      "Une séquence de démarrage : logo, un journal Copland OS qui défile, puis une salutation Web Speech à voix grave.",
      "Des panneaux de liens orientés en billboard qui tournent autour du logo central. Un clic, et la caméra plonge dedans avant que le lien s'ouvre.",
      "Un drone Web Audio dont le niveau de basses revient nourrir les visuels, et un minuteur d'inactivité qui épaissit lentement la brume et les murmures si vous restez immobile.",
      "Un échantillonneur de FPS qui monte et descend les paliers de qualité à l'exécution, pour que la scène tienne sa cadence sur les machines plus faibles.",
    ],
    qualityAndSecurity: [
      "Une couche lecteur d'écran et sans-WebGL porte les mêmes liens en HTML brut sous le canvas, donc la page marche encore quand la scène ne peut pas tourner.",
      "TypeScript strict sur toutes les références de projet, vérifié à chaque build.",
      "Sortie statique et aucun serveur. Chaque crawler reçoit noindex et nofollow via les balises meta et robots.txt ; si vous avez trouvé le site, c'est que vous cherchiez.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Une scène WebGL plein écran avec bloom, brume et quinze choses en mouvement fait volontiers fondre un portable.",
        solution:
          "Un échantillonneur de FPS déplace les paliers de qualité en cours de route, et garder chaque effet dans son propre module m'a permis de mesurer ce que chacun coûte.",
      },
      {
        challenge:
          "Toute la page est un canvas : un lecteur d'écran n'y voit rien et un navigateur sans WebGL encore moins.",
        solution:
          "Les vrais liens vivent dans une couche HTML accessible sous la scène, et le canvas comme les superpositions sont aria-hidden, si bien que le repli est le contenu lui-même.",
      },
    ],
    hiringSignals: [
      "De la 3D temps réel écrite à la main : Three.js, passes de post-traitement, et une boucle de rendu que je dois tenir dans un budget par image.",
      "Web Audio et Web Speech branchés sur les visuels, si bien que le niveau de basses du drone change ce que vous voyez.",
      "La liste de dépendances est restée à trois paquets pendant que la scène montait à quinze modules.",
    ],
    nextIterations: [
      "Des contrôles tactiles aussi agréables que le glisser-scroller sur un ordinateur.",
      "Plus de lore dans le monde, qui vaille le détour en vol.",
    ],
    tags: ["React", "TypeScript", "Three.js", "CRT"],
    impactHeading: "À quoi sert ce projet",
    impactPoints: [
      "Donne à tout ce que je construis une adresse que je peux transmettre.",
      "M'a appris la 3D temps réel en m'obligeant à tenir la cadence d'une scène chargée.",
      "Montre le côté visuel de mon travail, ce qu'un point de CV ne peut pas faire.",
    ],
    stats: [
      { value: "3", label: "dépendances" },
      { value: "15", label: "modules de scène" },
      { value: "0", label: "frameworks UI" },
      { value: "1", label: "page" },
    ],
  },
  zh: {
    tagline: "我的链接清单，藏在一个可以飞进去的 3D 世界里。",
    description:
      "Punds 是我的单页链接中枢，做成了一个可漫游的 Three.js 世界，取《玲音》里 Copland OS 的样子。拖动环顾，滚动飞行，点一块悬浮面板就能打开链接。",
    overview:
      "每次有人问我做过什么，我都得复制五个链接，实在受够了，于是做了一个指向全部的页面。然后我拒绝把它做成一份清单。Punds 的开机像 Copland OS，也就是《玲音》里那套系统：先是 logo，接着一段滚动的启动日志，一个低沉的声音说「present day, present time」，然后你就落进一个 Three.js 世界。全息面板在雾里绕着一枚发光的标志转，拖动可以环顾，滚动可以飞行，点一下面板，镜头会先俯冲进去，链接才打开。运行时依赖是 react、react-dom 和 three，就这三个。",
    roleSummary: "只有我，包括没人要求的那些部分：启动日志、那个声音、那几条锦鲤。",
    problemStatement:
      "一堆零散的项目和主页很难分享，最后只能一个个念网址。Punds 把这堆东西折进一个我能直接递出去的地址，反正都要动手，我就顺便拿它来学实时 3D。",
    objectives: [
      "把每个项目、主页和站点都收到一个可分享的地址背后。",
      "拿一个真有场景的东西来学 Three.js，而不是教程里那个方块。",
      "把运行时依赖控制在 react、react-dom 和 three 三个。",
    ],
    architectureDecisions: [
      "Three.js r185，配一条 EffectComposer 链做泛光、故障和色调映射，全部由一个 CoplandScene 类持有渲染器、相机和主循环。",
      "每个视觉元素都是自成一体的 SceneFeature 模块（反射地面、头顶的镜像城市、数据雨、锦鲤），所以增删任何一个都不必动其他。",
      "无路由、无全局状态、无数据层。React 只用 useState 记住开机阶段，DOM 覆盖层压在 canvas 上面。",
    ],
    implementationHighlights: [
      "一整段开机流程：logo、滚动的 Copland OS 日志，然后是一句压低了音调的 Web Speech 问候。",
      "始终朝向镜头的链接面板绕着中央标志旋转。点一下，镜头先俯冲进去，链接才打开。",
      "一段 Web Audio 环境低鸣，它的低频电平又反过来喂给画面；还有一个空闲计时器，你一动不动，雾和低语就慢慢变浓。",
      "一个 FPS 采样器在运行时上下调整画质档位，让场景在配置较弱的机器上也守住帧率。",
    ],
    qualityAndSecurity: [
      "canvas 底下有一层给读屏软件和无 WebGL 环境准备的纯 HTML，装着同样的链接，场景跑不起来时页面照样能用。",
      "所有项目引用都是严格模式 TypeScript，每次构建都做类型检查。",
      "纯静态产物，没有服务端。所有爬虫都通过 meta 标签和 robots.txt 拿到 noindex 与 nofollow；能找到这个站的人，本来就是在找。",
    ],
    challengesAndSolutions: [
      {
        challenge: "一个满屏的 WebGL 场景，带泛光、带雾，还有十五样东西在动，很乐意把笔记本烧了。",
        solution: "FPS 采样器在运行中上下切换画质档位，而每个效果都独立成模块，也让我能逐个量出它们各自的开销。",
      },
      {
        challenge: "整页就是一块 canvas，读屏软件什么也看不到，没有 WebGL 的浏览器看到的更少。",
        solution: "真正的链接放在场景底下一层可访问的 HTML 里，canvas 和各个覆盖层都标了 aria-hidden，于是退路本身就是内容。",
      },
    ],
    hiringSignals: [
      "手写的实时 3D：Three.js、后处理通道，以及一个必须卡在单帧预算内的渲染循环。",
      "Web Audio 和 Web Speech 接进了画面，低鸣的低频电平会改变你看到的东西。",
      "场景长到十五个模块，依赖清单依然停在三个包。",
    ],
    nextIterations: [
      "触屏操作，要做到和桌面上拖动加滚动一样顺手。",
      "世界里多一些值得飞过去找的设定。",
    ],
    tags: ["React", "TypeScript", "Three.js", "CRT"],
    impactHeading: "这个项目有什么用",
    impactPoints: [
      "让我做的每一样东西共用一个能直接递出去的地址。",
      "逼我把一个满载的场景守在帧率上，也就把实时 3D 学下来了。",
      "展示我工作里视觉的那一面，这是简历条目做不到的。",
    ],
    stats: [
      { value: "3", label: "运行时依赖" },
      { value: "15", label: "场景模块" },
      { value: "0", label: "UI 框架" },
      { value: "1", label: "页面" },
    ],
  },
};
