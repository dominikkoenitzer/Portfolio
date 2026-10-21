import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

const QUALITY_CODE = `export const SLOW_FPS = 30
export const FAST_FPS = 58

export const SLOW_WINDOWS_TO_STEP_DOWN = 2
export const FAST_WINDOWS_TO_STEP_UP = 4
export const COOLDOWN_WINDOWS = 4`;

export const punds: Record<Language, LocalizedContent> = {
  en: {
    tagline: "My link hub, built as a shrine garden on an island above the clouds and rendered live in the browser.",
    description:
      "Punds is my one-page link hub: a quiet shrine garden on an island above the clouds, rendered live in the browser with Three.js. Look around with the pointer, walk up to the rack and open one of the three wooden plaques.",
    overview:
      "I got tired of pasting five links every time someone asked what I had built, so I made one page that points at all of them, and refused to make it a list. Punds is a place instead. You stand on the stone path of a small shrine garden, high above a sea of clouds in the late afternoon, and look around. The links hang on a rack as three wooden plaques: point at one and it turns to you on its cord, click it and it opens. The plaques swing and knock into each other, a click on the pond drops a ripple, the koi follow you and the shrine bell rings. The runtime dependencies are react, react-dom and three. That is all of it.",
    roleSummary: "Just me, including the parts nobody asked for: the koi, the bell, the wind in the cedars.",
    sections: [
      {
        heading: "Nothing on the page depends on scrolling",
        body: [
          "The camera stays on the path. You look around by moving the pointer toward an edge of the screen or by dragging, and on a phone by swiping. A click on the rack, the pond or the shrine walks you up to it, and Esc, the browser's back button or a click elsewhere takes you back to the path.",
          "Sound is generated in the browser, the wind, the water, the bell and the wood of the plaques, and it stays off until you turn it on with the small sound switch or the M key.",
        ],
      },
      {
        heading: "Built in code when the page loads",
        body: [
          "Grass, cherry, maples and cedars, the shrine, the torii, the lanterns, the stone wall and the plaque rack are all generated in code; only the rocks are scanned models, and the materials and the sky are public-domain scans. The heavy, pure work, like the tree pictures and the grass, runs in a background worker while the page waits for its images.",
          "Until the garden is ready, a picture of the same start view holds the screen within a fraction of a second, then crossfades into the live scene. Textures arrive at 1k first and sharpen to 2k once the garden is showing.",
        ],
      },
      {
        heading: "Stepping down fast and up slowly",
        body: [
          "A full-screen scene with reflections, haze, bloom and a raymarched cloud sea will happily overheat a laptop. Frames are capped at 60, at 30 when nothing moves and none while the tab is hidden. Every 1.5 seconds the frame rate is sampled and the quality moves between three tiers, which lower the resolution and the effects while the look stays the same. A device still below 14 frames a second at the lowest tier in its first half minute gets the still picture with the same links instead.",
          "The decision is a pure function in its own file, away from the renderer, so 18 tests can walk it through made-up frame-rate traces without a slow machine. Every change starts a cooldown, so a machine sitting right on the line never flips between two tiers every window.",
        ],
        code: {
          language: "ts",
          text: QUALITY_CODE,
          caption:
            "From src/realm/qualityStepper.ts, with the comments left out. The thresholds are uneven on purpose: a struggling machine gets relief after two slow windows, while a step up needs four fast ones in a row.",
        },
      },
      {
        heading: "The same three links, as plain HTML",
        body: [
          "The canvas is hidden from assistive technology. Underneath, the three links are written out for real, read from the same file as the plaques, so a screen reader or a crawler gets them without the scene. Tab walks through them, and focusing one turns its plaque on the rack.",
          "Without WebGL, or when the scene fails to start, the same list shows over the still picture of the garden, so nobody is left looking at a black screen.",
        ],
      },
    ],
    captions: [
      "The start view: the stone path between two lanterns, the shrine ahead under the cedars, and the rack with the three plaques on the right.",
    ],
    tags: ["React", "TypeScript", "Three.js", "Accessibility"],
    stats: [
      { value: "3", label: "runtime deps" },
      { value: "3", label: "plaques" },
      { value: "3", label: "quality tiers" },
      { value: "1", label: "page" },
    ],
  },
  de: {
    tagline: "Mein Link-Hub, gebaut als Schreingarten auf einer Insel über den Wolken und live im Browser gerendert.",
    description:
      "Punds ist mein einseitiger Link-Hub: ein stiller Schreingarten auf einer Insel über den Wolken, live im Browser mit Three.js gerendert. Mit dem Zeiger umsehen, zum Gestell gehen und eine der drei Holztafeln öffnen.",
    overview:
      "Ich hatte es satt, fünf Links zu kopieren, sobald jemand fragte, was ich gebaut habe. Also machte ich eine Seite, die auf alle zeigt, und weigerte mich, eine Liste daraus zu machen. Punds ist stattdessen ein Ort. Man steht auf dem Steinweg eines kleinen Schreingartens, hoch über einem Wolkenmeer am späten Nachmittag, und sieht sich um. Die Links hängen als drei Holztafeln an einem Gestell: Zeigt man auf eine, dreht sie sich an ihrer Schnur zu einem hin, klickt man sie an, öffnet sie sich. Die Tafeln schwingen und stossen aneinander, ein Klick auf den Teich lässt eine Welle kreisen, die Kois folgen einem und die Schreinglocke läutet. Die Laufzeit-Abhängigkeiten sind react, react-dom und three. Das ist alles.",
    roleSummary:
      "Nur ich, samt der Teile, nach denen niemand gefragt hat: die Kois, die Glocke, der Wind in den Zedern.",
    sections: [
      {
        heading: "Nichts auf der Seite hängt vom Scrollen ab",
        body: [
          "Die Kamera bleibt auf dem Weg. Man sieht sich um, indem man den Zeiger zu einem Bildschirmrand bewegt oder zieht, auf dem Handy durch Wischen. Ein Klick auf das Gestell, den Teich oder den Schrein führt einen dorthin, und Esc, der Zurück-Knopf des Browsers oder ein Klick anderswo bringt einen zurück auf den Weg.",
          "Der Klang wird im Browser erzeugt, der Wind, das Wasser, die Glocke und das Holz der Tafeln, und er bleibt aus, bis man ihn mit dem kleinen Tonschalter oder der Taste M einschaltet.",
        ],
      },
      {
        heading: "Beim Laden der Seite im Code gebaut",
        body: [
          "Gras, Kirsche, Ahorne und Zedern, der Schrein, das Torii, die Laternen, die Steinmauer und das Tafelgestell werden alle im Code erzeugt; nur die Felsen sind gescannte Modelle, und die Materialien und der Himmel sind gemeinfreie Scans. Die schwere, reine Arbeit, etwa die Baumbilder und das Gras, läuft in einem Hintergrund-Worker, während die Seite auf ihre Bilder wartet.",
          "Bis der Garten bereit ist, hält ein Bild derselben Startansicht innerhalb eines Sekundenbruchteils den Bildschirm und blendet dann in die Live-Szene über. Die Texturen kommen zuerst in 1k und schärfen sich auf 2k nach, sobald der Garten zu sehen ist.",
        ],
      },
      {
        heading: "Schnell zurückschalten, langsam hochschalten",
        body: [
          "Eine bildschirmfüllende Szene mit Spiegelungen, Dunst, Bloom und einem per Raymarching gezeichneten Wolkenmeer bringt einen Laptop gern zum Glühen. Die Frames sind auf 60 gedeckelt, auf 30, wenn sich nichts bewegt, und auf null, solange der Tab verborgen ist. Alle 1,5 Sekunden wird die Framerate gemessen, und die Qualität wechselt zwischen drei Stufen, die Auflösung und Effekte senken, während der Look gleich bleibt. Ein Gerät, das in seiner ersten halben Minute auf der tiefsten Stufe noch unter 14 Frames pro Sekunde liegt, bekommt stattdessen das Standbild mit denselben Links.",
          "Die Entscheidung ist eine reine Funktion in einer eigenen Datei, getrennt vom Renderer. So können 18 Tests sie durch erfundene Framerate-Verläufe führen, ohne dass es eine langsame Maschine braucht. Jeder Wechsel startet eine Abkühlphase, damit eine Maschine genau an der Grenze nie in jedem Fenster zwischen zwei Stufen hin und her springt.",
        ],
        code: {
          language: "ts",
          text: QUALITY_CODE,
          caption:
            "Aus src/realm/qualityStepper.ts, ohne die Kommentare. Die Schwellen sind absichtlich ungleich: Eine überforderte Maschine wird nach zwei langsamen Fenstern entlastet, für eine Stufe höher braucht es vier schnelle in Folge.",
        },
      },
      {
        heading: "Dieselben drei Links, als einfaches HTML",
        body: [
          "Das Canvas ist für Hilfstechnologien verborgen. Darunter sind die drei Links tatsächlich ausgeschrieben, gelesen aus derselben Datei wie die Tafeln. Ein Screenreader oder ein Crawler bekommt sie also ohne die Szene. Mit Tab geht man sie durch, und wer einen fokussiert, dreht seine Tafel am Gestell.",
          "Ohne WebGL, oder wenn die Szene nicht startet, erscheint dieselbe Liste über dem Standbild des Gartens. So schaut niemand auf einen schwarzen Bildschirm.",
        ],
      },
    ],
    captions: [
      "Die Startansicht: der Steinweg zwischen zwei Laternen, voraus der Schrein unter den Zedern und rechts das Gestell mit den drei Tafeln.",
    ],
    tags: ["React", "TypeScript", "Three.js", "Accessibility"],
    stats: [
      { value: "3", label: "Laufzeit-Deps" },
      { value: "3", label: "Tafeln" },
      { value: "3", label: "Qualitätsstufen" },
      { value: "1", label: "Seite" },
    ],
  },
  fr: {
    tagline: "Mon hub de liens, construit comme un jardin de sanctuaire sur une île au-dessus des nuages et rendu en direct dans le navigateur.",
    description:
      "Punds est mon hub de liens en une page : un jardin de sanctuaire paisible sur une île au-dessus des nuages, rendu en direct dans le navigateur avec Three.js. Regardez autour de vous avec le pointeur, approchez-vous du portant et ouvrez l'une des trois plaques de bois.",
    overview:
      "J'en avais assez de copier cinq liens chaque fois qu'on me demandait ce que j'avais construit, alors j'ai fait une page qui pointe vers tous, et j'ai refusé d'en faire une liste. Punds est plutôt un lieu. On se tient sur le chemin de pierre d'un petit jardin de sanctuaire, haut au-dessus d'une mer de nuages en fin d'après-midi, et on regarde autour de soi. Les liens pendent à un portant sous la forme de trois plaques de bois : pointez-en une et elle se tourne vers vous au bout de sa corde, cliquez et elle s'ouvre. Les plaques se balancent et s'entrechoquent, un clic sur l'étang y fait naître une ondulation, les carpes vous suivent et la cloche du sanctuaire sonne. Les dépendances d'exécution sont react, react-dom et three. C'est tout.",
    roleSummary:
      "Moi seul, y compris les parties que personne n'avait demandées : les carpes, la cloche, le vent dans les cèdres.",
    sections: [
      {
        heading: "Rien sur la page ne dépend du défilement",
        body: [
          "La caméra reste sur le chemin. On regarde autour de soi en déplaçant le pointeur vers un bord de l'écran ou en glissant, et sur un téléphone en balayant. Un clic sur le portant, l'étang ou le sanctuaire vous y amène, et Échap, le bouton retour du navigateur ou un clic ailleurs vous ramène sur le chemin.",
          "Le son est généré dans le navigateur, le vent, l'eau, la cloche et le bois des plaques, et il reste coupé tant qu'on ne l'allume pas avec le petit interrupteur de son ou la touche M.",
        ],
      },
      {
        heading: "Construit en code au chargement de la page",
        body: [
          "L'herbe, le cerisier, les érables et les cèdres, le sanctuaire, le torii, les lanternes, le mur de pierre et le portant des plaques sont tous générés en code ; seuls les rochers sont des modèles scannés, et les matériaux et le ciel sont des scans du domaine public. Le travail lourd et pur, comme les images des arbres et l'herbe, tourne dans un worker en arrière-plan pendant que la page attend ses images.",
          "Tant que le jardin n'est pas prêt, une image de la même vue de départ occupe l'écran en une fraction de seconde, puis se fond dans la scène en direct. Les textures arrivent d'abord en 1k et passent en 2k une fois le jardin affiché.",
        ],
      },
      {
        heading: "Descendre vite, remonter lentement",
        body: [
          "Une scène plein écran avec des reflets, de la brume, du bloom et une mer de nuages en raymarching fait volontiers chauffer un portable. Les images sont plafonnées à 60, à 30 quand rien ne bouge et à zéro tant que l'onglet est caché. Toutes les 1,5 secondes, la cadence est mesurée et la qualité passe entre trois paliers, qui baissent la résolution et les effets sans changer l'aspect. Un appareil encore sous 14 images par seconde au palier le plus bas pendant sa première demi-minute reçoit à la place l'image fixe avec les mêmes liens.",
          "La décision est une fonction pure dans son propre fichier, à l'écart du moteur de rendu, si bien que 18 tests peuvent la faire passer par des courbes de cadence inventées sans avoir besoin d'une machine lente. Chaque changement lance une période de refroidissement, pour qu'une machine pile à la limite ne bascule jamais entre deux paliers à chaque fenêtre.",
        ],
        code: {
          language: "ts",
          text: QUALITY_CODE,
          caption:
            "Tiré de src/realm/qualityStepper.ts, sans les commentaires. Les seuils sont inégaux exprès : une machine à la peine est soulagée après deux fenêtres lentes, alors qu'une montée de palier exige quatre fenêtres rapides d'affilée.",
        },
      },
      {
        heading: "Les trois mêmes liens, en HTML simple",
        body: [
          "Le canvas est caché aux technologies d'assistance. En dessous, les trois liens sont écrits pour de bon, lus dans le même fichier que les plaques, donc un lecteur d'écran ou un robot d'indexation les obtient sans la scène. Tab les parcourt, et donner le focus à l'un d'eux tourne sa plaque sur le portant.",
          "Sans WebGL, ou quand la scène ne démarre pas, la même liste s'affiche par-dessus l'image fixe du jardin, pour que personne ne reste devant un écran noir.",
        ],
      },
    ],
    captions: [
      "La vue de départ : le chemin de pierre entre deux lanternes, le sanctuaire devant sous les cèdres, et le portant avec les trois plaques à droite.",
    ],
    tags: ["React", "TypeScript", "Three.js", "Accessibility"],
    stats: [
      { value: "3", label: "dépendances" },
      { value: "3", label: "plaques" },
      { value: "3", label: "paliers de qualité" },
      { value: "1", label: "page" },
    ],
  },
  zh: {
    tagline: "我的链接中枢，做成云海之上一座岛屿上的神社庭园，在浏览器里实时渲染。",
    description:
      "Punds 是我的单页链接中枢：云海之上一座岛屿上安静的神社庭园，用 Three.js 在浏览器里实时渲染。用指针环顾四周，走到木架前，打开三块木牌中的一块。",
    overview:
      "每次有人问我做过什么，我都得复制五个链接，实在受够了，于是做了一个指向全部的页面，而且拒绝把它做成一份清单。Punds 是一个地方。你站在一座小神社庭园的石径上，傍晚时分，脚下是高高的云海，四处张望。链接挂在一个木架上，是三块木牌：指向其中一块，它会顺着绳子转向你，点一下就打开。木牌来回摆动、互相碰撞，点一下池塘会荡开一圈涟漪，锦鲤跟着你游，神社的钟会响。运行时依赖是 react、react-dom 和 three，就这三个。",
    roleSummary: "只有我，包括没人要求的那些部分：锦鲤、钟、杉林里的风。",
    sections: [
      {
        heading: "页面上没有任何东西依赖滚动",
        body: [
          "镜头一直停在石径上。把指针移到屏幕边缘或者拖动就能环顾四周，手机上则是滑动。点一下木架、池塘或神社，就会走到它跟前；按 Esc、浏览器的后退键，或者点别处，就回到石径上。",
          "声音在浏览器里生成，风声、水声、钟声和木牌的木头声，默认关着，直到你用那个小小的声音开关或 M 键打开。",
        ],
      },
      {
        heading: "页面加载时用代码搭建",
        body: [
          "草、樱树、枫树和杉树，神社、鸟居、灯笼、石墙和木牌架，全都由代码生成；只有石头是扫描模型，材质和天空则是公有领域的扫描素材。繁重的纯计算，比如树的图片和草，放在后台 worker 里跑，页面同时等着自己的图片。",
          "庭园就绪之前，同一个起始视角的图片会在几分之一秒内占住屏幕，然后淡入实时场景。贴图先以 1k 到达，等庭园显示出来后再锐化到 2k。",
        ],
      },
      {
        heading: "降档要快，升档要慢",
        body: [
          "一个带倒影、薄雾、泛光和光线步进云海的全屏场景，很容易把笔记本烧得发烫。帧率上限是 60，没有东西在动时是 30，标签页隐藏时则为零。每 1.5 秒采样一次帧率，画质在三档之间切换，各档降低分辨率和特效，外观保持不变。如果一台设备在最初半分钟里，即使处于最低档也还不到每秒 14 帧，就改为显示带同样链接的静态图片。",
          "这个判断是一个纯函数，单独放在一个文件里，与渲染器分开，所以 18 个测试可以用编造的帧率曲线把它走一遍，不需要一台真的慢机器。每次换档都会开始一段冷却期，所以一台刚好卡在临界线上的机器永远不会在每个窗口里来回切换两个档位。",
        ],
        code: {
          language: "ts",
          text: QUALITY_CODE,
          caption:
            "摘自 src/realm/qualityStepper.ts，省略了注释。阈值故意不对称：吃力的机器在两个慢窗口之后就能减负，而升一档需要连续四个快窗口。",
        },
      },
      {
        heading: "同样的三个链接，用纯 HTML 写一遍",
        body: [
          "canvas 对辅助技术是隐藏的。它下面真真切切写着那三个链接，和木牌读的是同一个文件，所以屏幕阅读器和爬虫不需要场景也能拿到它们。按 Tab 可以逐个走过，聚焦到某一个时，它在木架上的木牌就会转过来。",
          "没有 WebGL，或者场景启动失败时，同一份列表会显示在庭园的静态图片上，谁也不会对着一块黑屏发呆。",
        ],
      },
    ],
    captions: [
      "起始视角：两盏灯笼之间的石径，前方杉树下的神社，右侧是挂着三块木牌的木架。",
    ],
    tags: ["React", "TypeScript", "Three.js", "Accessibility"],
    stats: [
      { value: "3", label: "运行时依赖" },
      { value: "3", label: "块木牌" },
      { value: "3", label: "档画质" },
      { value: "1", label: "页面" },
    ],
  },
};
