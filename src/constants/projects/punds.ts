import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

const QUALITY_CODE = `export const SLOW_FPS = 30
export const FAST_FPS = 58

export const SLOW_WINDOWS_TO_STEP_DOWN = 2
export const FAST_WINDOWS_TO_STEP_UP = 4
export const COOLDOWN_WINDOWS = 4`;

export const punds: Record<Language, LocalizedContent> = {
  en: {
    tagline: "A list of my links, hidden inside a 3D world you fly through.",
    description:
      "Punds is my one-page link hub, built as a navigable Three.js world in the style of Copland OS from Serial Experiments Lain. Drag to look around, scroll to fly, click a floating panel to open the link.",
    overview:
      "I got tired of pasting five links every time someone asked what I had built, so I made one page that points at all of them. Then I refused to make it a list. Punds boots like Copland OS, the operating system from Serial Experiments Lain: a logo splash, a streaming boot log, a low voice saying \"present day, present time\", and then you drop into a Three.js world. Holographic panels orbit a glowing logo in the fog, you drag to look and scroll to fly, and clicking a panel dives the camera into it before the link opens. The runtime dependency list is react, react-dom and three. That is all of it.",
    roleSummary:
      "Just me, including the parts nobody asked for: the boot log, the voice, the koi.",
    sections: [
      {
        heading: "The boot log plays while the 3D loads",
        body: [
          "The page opens on a logo, then a boot log that prints a line every 250 ms, then a voice saying \"present day, present time\". It is set dressing, and it also covers for the heavy part. Three.js is imported lazily after the first render, so the CRT shell and the log paint straight away while the scene is still downloading. When the scene arrives, it jumps to whatever phase the boot has reached by then.",
          "Tapping during the boot skips straight into the world. If the browser has no WebGL, the chunk never arrives or the scene throws while starting, the page drops the canvas and shows the links as plain text in its place, so nobody is left looking at a black screen.",
        ],
      },
      {
        heading: "Fifteen modules that know three methods",
        body: [
          "Apart from the logo, the particles and the panels, everything in the world is its own module: the reflective floor, the city of spires, the data rain, the koi, the eyes, the network graph you can click into a layer deeper. Each one implements the same small interface, a group to add to the scene, an update called every frame and a dispose for teardown, and is registered in one place. Deleting one touches nothing else.",
          "The colours are CSS custom properties that the scene reads back with getComputedStyle, so changing a variable in the stylesheet recolours the 3D along with the overlays. The ambient drone is Web Audio with a bass analyser, and the scene reads its level every frame to push the bloom, the particles and the size of the logo.",
          "Sitting still has an effect too. After 15 seconds without input a dread value starts to climb and reaches its maximum at 45. It thickens the fog, retunes the drone and makes the whispered lines more frequent.",
        ],
      },
      {
        heading: "Stepping down fast and up slowly",
        body: [
          "A full-screen scene with bloom, fog and fifteen moving parts will happily overheat a laptop, so the frame rate is sampled in windows of 1.5 seconds and the quality moves between three tiers: low, high and ultra. The tier caps the pixel ratio, scales the bloom and switches multisampling on or off. On low it also hides the four heaviest things: the reflective floor, the mirrored city overhead, the sideways city and the koi.",
          "The decision is a pure function in its own file, away from the renderer, so 18 tests can walk it through synthetic frame-rate traces without needing a slow machine. Every change starts a cooldown. Without it, a machine sitting right on the line would flip between two tiers every window, and each flip pops the reflection in or out and reallocates the GPU render targets.",
        ],
        code: {
          language: "ts",
          text: QUALITY_CODE,
          caption:
            "From src/scene/qualityStepper.ts, with the comments left out. The thresholds are uneven on purpose: a struggling machine gets relief after two slow windows, while a step up needs four fast ones in a row.",
        },
      },
      {
        heading: "The same links again, as plain HTML",
        body: [
          "The canvas and every overlay on it are marked aria-hidden. Underneath sits a plain HTML list of the same four links, read from the same data file as the floating panels, so a screen reader or a crawler gets the content without the scene. It is the same list the page shows when WebGL is missing.",
          "Clicking a panel turns the camera toward it, lunges in with a short glitch warp, opens the link in a new tab and eases back out, so the world is still there when you return. With reduced motion turned on, the glitch warp is off, the scene moves at a quarter of its usual pace and it draws 1,100 particles instead of 3,200.",
          "Until September 2026 the site told every search engine to stay away. It is the address my GitHub profile points to, and blocking it made that link a dead end, so robots.txt now lets every crawler in and names a sitemap.",
        ],
      },
    ],
    captions: [
      "Inside the city: towers tiled in blue and amber, rain and falling glyphs, the glowing logo in the centre and the JOURNAL and REPOSITORY panels floating on either side.",
    ],
    tags: ["React", "TypeScript", "Three.js", "CRT"],
    stats: [
      { value: "3", label: "runtime deps" },
      { value: "15", label: "scene modules" },
      { value: "4", label: "links" },
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
    sections: [
      {
        heading: "Das Boot-Log läuft, während das 3D lädt",
        body: [
          "Die Seite beginnt mit einem Logo, dann folgt ein Boot-Log, das alle 250 ms eine Zeile schreibt, dann eine Stimme, die „present day, present time“ sagt. Das ist Kulisse, und es überbrückt nebenbei den schweren Teil. Three.js wird erst nach dem ersten Rendern nachgeladen, also stehen die Röhren-Hülle und das Log sofort da, während die Szene noch herunterlädt. Kommt die Szene an, springt sie in die Phase, die der Boot bis dahin erreicht hat.",
          "Ein Tippen während des Boots springt direkt in die Welt. Hat der Browser kein WebGL, kommt der Chunk nie an oder wirft die Szene beim Start einen Fehler, lässt die Seite das Canvas weg und zeigt an seiner Stelle die Links als einfachen Text. So schaut niemand auf einen schwarzen Bildschirm.",
        ],
      },
      {
        heading: "Fünfzehn Module, die drei Methoden kennen",
        body: [
          "Ausser dem Logo, den Partikeln und den Panels ist alles in der Welt ein eigenes Modul: der spiegelnde Boden, die Stadt aus Türmen, der Datenregen, die Kois, die Augen, der Netzwerkgraph, in den man sich eine Ebene tiefer klicken kann. Jedes setzt dieselbe kleine Schnittstelle um, eine Gruppe für die Szene, ein update in jedem Frame und ein dispose zum Abbauen, und wird an einer einzigen Stelle registriert. Wer eines löscht, berührt nichts anderes.",
          "Die Farben sind CSS-Custom-Properties, die die Szene mit getComputedStyle zurückliest. Eine Variable im Stylesheet zu ändern, färbt also das 3D zusammen mit den Overlays um. Der Hintergrundklang ist Web Audio mit einem Bass-Analyser, und die Szene liest dessen Pegel in jedem Frame, um Bloom, Partikel und die Grösse des Logos anzutreiben.",
          "Auch Stillsitzen hat eine Wirkung. Nach 15 Sekunden ohne Eingabe beginnt ein Unbehagen-Wert zu steigen, der bei 45 Sekunden sein Maximum erreicht. Er verdichtet den Nebel, stimmt den Klang um und lässt die geflüsterten Sätze häufiger kommen.",
        ],
      },
      {
        heading: "Schnell zurückschalten, langsam hochschalten",
        body: [
          "Eine bildschirmfüllende Szene mit Bloom, Nebel und fünfzehn bewegten Teilen bringt einen Laptop gern zum Glühen. Deshalb wird die Framerate in Fenstern von 1,5 Sekunden gemessen, und die Qualität wechselt zwischen drei Stufen: low, high und ultra. Die Stufe deckelt die Pixel-Ratio, skaliert den Bloom und schaltet Multisampling ein oder aus. Auf low blendet sie zusätzlich die vier schwersten Dinge aus: den spiegelnden Boden, die gespiegelte Stadt über einem, die seitliche Stadt und die Kois.",
          "Die Entscheidung ist eine reine Funktion in einer eigenen Datei, getrennt vom Renderer. So können 18 Tests sie durch künstliche Framerate-Verläufe führen, ohne dass es eine langsame Maschine braucht. Jeder Wechsel startet eine Abkühlphase. Ohne sie würde eine Maschine genau an der Grenze in jedem Fenster zwischen zwei Stufen hin und her springen, und jeder Sprung lässt die Spiegelung auftauchen oder verschwinden und legt die Render-Targets auf der GPU neu an.",
        ],
        code: {
          language: "ts",
          text: QUALITY_CODE,
          caption:
            "Aus src/scene/qualityStepper.ts, ohne die Kommentare. Die Schwellen sind absichtlich ungleich: Eine überforderte Maschine wird nach zwei langsamen Fenstern entlastet, für eine Stufe höher braucht es vier schnelle in Folge.",
        },
      },
      {
        heading: "Dieselben Links noch einmal, als einfaches HTML",
        body: [
          "Das Canvas und jedes Overlay darauf sind als aria-hidden markiert. Darunter liegt eine einfache HTML-Liste mit denselben vier Links, gelesen aus derselben Datendatei wie die schwebenden Panels. Ein Screenreader oder ein Crawler bekommt den Inhalt also ohne die Szene. Es ist dieselbe Liste, die die Seite zeigt, wenn WebGL fehlt.",
          "Ein Klick auf ein Panel dreht die Kamera dorthin, stösst mit einem kurzen Glitch hinein, öffnet den Link in einem neuen Tab und gleitet wieder zurück, damit die Welt noch da ist, wenn man zurückkommt. Mit reduzierter Bewegung ist der Glitch aus, die Szene bewegt sich mit einem Viertel ihres üblichen Tempos und zeichnet 1100 statt 3200 Partikel.",
          "Bis September 2026 hat die Seite jede Suchmaschine ferngehalten. Sie ist die Adresse, auf die mein GitHub-Profil verweist, und die Sperre machte diesen Link zur Sackgasse. Deshalb lässt robots.txt jetzt jeden Crawler herein und nennt eine Sitemap.",
        ],
      },
    ],
    captions: [
      "Mitten in der Stadt: Türme mit blauen und bernsteinfarbenen Kacheln, Regen und fallende Zeichen, in der Mitte das leuchtende Logo, links und rechts schweben die Panels JOURNAL und REPOSITORY.",
    ],
    tags: ["React", "TypeScript", "Three.js", "CRT"],
    stats: [
      { value: "3", label: "Laufzeit-Deps" },
      { value: "15", label: "Szenen-Module" },
      { value: "4", label: "Links" },
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
    sections: [
      {
        heading: "Le journal de démarrage défile pendant que la 3D charge",
        body: [
          "La page s'ouvre sur un logo, puis un journal de démarrage qui écrit une ligne toutes les 250 ms, puis une voix qui dit « present day, present time ». C'est du décor, et ça couvre aussi la partie lourde. Three.js n'est importé qu'après le premier rendu, donc l'habillage cathodique et le journal s'affichent tout de suite pendant que la scène se télécharge encore. Quand la scène arrive, elle saute à la phase que le démarrage a atteinte entre-temps.",
          "Un appui pendant le démarrage mène directement dans le monde. Si le navigateur n'a pas de WebGL, si le chunk n'arrive jamais ou si la scène plante au lancement, la page abandonne le canvas et affiche les liens en texte simple à sa place. Personne ne reste devant un écran noir.",
        ],
      },
      {
        heading: "Quinze modules qui connaissent trois méthodes",
        body: [
          "À part le logo, les particules et les panneaux, tout dans ce monde est un module à part : le sol réfléchissant, la ville de flèches, la pluie de données, les carpes, les yeux, le graphe réseau où l'on peut cliquer pour descendre d'une couche. Chacun implémente la même petite interface, un groupe à ajouter à la scène, un update appelé à chaque image et un dispose pour le démontage, et il est enregistré à un seul endroit. En supprimer un ne touche à rien d'autre.",
          "Les couleurs sont des propriétés personnalisées CSS que la scène relit avec getComputedStyle, donc changer une variable dans la feuille de style recolore la 3D en même temps que les overlays. Le bourdon d'ambiance est en Web Audio avec un analyseur de basses, et la scène lit son niveau à chaque image pour pousser le bloom, les particules et la taille du logo.",
          "Rester immobile a aussi un effet. Après 15 secondes sans action, une valeur de malaise commence à monter et atteint son maximum à 45. Elle épaissit la brume, réaccorde le bourdon et rend les phrases chuchotées plus fréquentes.",
        ],
      },
      {
        heading: "Descendre vite, remonter lentement",
        body: [
          "Une scène plein écran avec du bloom, de la brume et quinze éléments en mouvement fait volontiers chauffer un portable. La cadence est donc mesurée par fenêtres de 1,5 seconde, et la qualité passe entre trois paliers : low, high et ultra. Le palier plafonne le ratio de pixels, dose le bloom et active ou coupe le multisampling. En low, il masque aussi les quatre éléments les plus lourds : le sol réfléchissant, la ville en miroir au-dessus, la ville couchée sur le côté et les carpes.",
          "La décision est une fonction pure dans son propre fichier, à l'écart du moteur de rendu, si bien que 18 tests peuvent la faire passer par des courbes de cadence synthétiques sans avoir besoin d'une machine lente. Chaque changement lance une période de refroidissement. Sans elle, une machine pile à la limite basculerait entre deux paliers à chaque fenêtre, et chaque bascule fait apparaître ou disparaître le reflet et réalloue les cibles de rendu du GPU.",
        ],
        code: {
          language: "ts",
          text: QUALITY_CODE,
          caption:
            "Tiré de src/scene/qualityStepper.ts, sans les commentaires. Les seuils sont inégaux exprès : une machine à la peine est soulagée après deux fenêtres lentes, alors qu'une montée de palier exige quatre fenêtres rapides d'affilée.",
        },
      },
      {
        heading: "Les mêmes liens une seconde fois, en HTML simple",
        body: [
          "Le canvas et chaque overlay posé dessus sont marqués aria-hidden. En dessous se trouve une simple liste HTML des quatre mêmes liens, lue dans le même fichier de données que les panneaux flottants, donc un lecteur d'écran ou un robot d'indexation obtient le contenu sans la scène. C'est la même liste que la page affiche quand WebGL manque.",
          "Un clic sur un panneau tourne la caméra vers lui, plonge dedans avec un bref glitch, ouvre le lien dans un nouvel onglet puis recule en douceur, pour que le monde soit encore là au retour. Avec le mouvement réduit activé, le glitch est coupé, la scène bouge au quart de son allure habituelle et dessine 1 100 particules au lieu de 3 200.",
          "Jusqu'en septembre 2026, le site demandait à tous les moteurs de recherche de rester dehors. C'est l'adresse vers laquelle pointe mon profil GitHub, et ce blocage faisait de ce lien une impasse ; robots.txt laisse donc maintenant entrer tous les robots et indique un sitemap.",
        ],
      },
    ],
    captions: [
      "Au cœur de la ville : des tours en carreaux bleus et ambre, de la pluie et des signes qui tombent, le logo lumineux au centre et les panneaux JOURNAL et REPOSITORY qui flottent de part et d'autre.",
    ],
    tags: ["React", "TypeScript", "Three.js", "CRT"],
    stats: [
      { value: "3", label: "dépendances" },
      { value: "15", label: "modules de scène" },
      { value: "4", label: "liens" },
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
    sections: [
      {
        heading: "3D 加载的时候，启动日志在滚",
        body: [
          "页面先出一个 logo，然后是每 250 毫秒打出一行的启动日志，再是一个声音说「present day, present time」。这是布景，同时也替最重的那部分打了掩护。Three.js 在首次渲染之后才懒加载，所以 CRT 外壳和日志立刻就能画出来，场景则还在下载。场景到了以后，会直接跳到开机流程当时走到的那个阶段。",
          "开机途中点一下，就直接进入世界。如果浏览器没有 WebGL、代码块一直没到，或者场景启动时报错，页面就不要 canvas 了，改在原处用纯文本列出链接，谁也不会对着一块黑屏发呆。",
        ],
      },
      {
        heading: "十五个模块，只认三个方法",
        body: [
          "除了中央的标志、粒子和面板，世界里的每样东西都是一个独立模块：反光的地面、尖塔组成的城市、数据雨、锦鲤、那些眼睛，还有能点进去再深入一层的网络图。它们都实现同一个小接口：一个加进场景的 group、每帧调用的 update、拆除时调用的 dispose，并且只在一个地方注册。删掉其中一个，别的都不受影响。",
          "颜色是 CSS 自定义属性，场景用 getComputedStyle 把它们读回来，所以改样式表里的一个变量，3D 和叠加层会一起换色。背景的低鸣用 Web Audio 做，带一个低音分析器，场景每帧读取它的电平，用来推动泛光、粒子和标志的大小。",
          "一动不动也会有后果。15 秒没有任何输入后，一个“不安”值开始上升，到 45 秒时达到最大。它会让雾变浓、让低鸣变调，也让耳语出现得更频繁。",
        ],
      },
      {
        heading: "降档要快，升档要慢",
        body: [
          "一个带泛光、雾和十五个活动部件的全屏场景，很容易把笔记本烧得发烫。所以帧率按 1.5 秒一个窗口采样，画质在 low、high、ultra 三档之间切换。档位决定像素比上限、泛光强度，以及是否开启多重采样。到了 low 档，还会隐藏最重的四样东西：反光地面、头顶的镜像城市、横躺的城市和锦鲤。",
          "这个判断是一个纯函数，单独放在一个文件里，与渲染器分开，所以 18 个测试可以用合成的帧率曲线把它走一遍，不需要一台真的慢机器。每次换档后都有一段冷却期。没有它的话，一台刚好卡在临界线上的机器会在每个窗口里来回切换两个档位，而每切一次，倒影就会出现或消失，GPU 渲染目标也要重新分配。",
        ],
        code: {
          language: "ts",
          text: QUALITY_CODE,
          caption:
            "摘自 src/scene/qualityStepper.ts，省略了注释。阈值故意不对称：吃力的机器在两个慢窗口之后就能减负，而升一档需要连续四个快窗口。",
        },
      },
      {
        heading: "同样的链接，再用纯 HTML 写一遍",
        body: [
          "canvas 和它上面的每一层叠加都标了 aria-hidden。它们下面是一份纯 HTML 列表，放着同样的四个链接，和悬浮面板读的是同一个数据文件，所以屏幕阅读器和爬虫不需要场景也能拿到内容。WebGL 不可用时，页面显示的也正是这份列表。",
          "点击一块面板，镜头会转向它，带着一下短促的故障效果冲进去，在新标签页打开链接，再缓缓退出来，这样你回来时世界还在。开启减少动态效果后，故障效果关闭，场景以平时四分之一的速度运动，粒子也从 3200 个减到 1100 个。",
          "直到 2026 年 9 月，这个网站都让所有搜索引擎别进来。可它是我 GitHub 主页指向的地址，挡住它等于让这条链接走进死胡同，所以现在 robots.txt 放所有爬虫进来，并给出了 sitemap。",
        ],
      },
    ],
    captions: [
      "城市内部：蓝色和琥珀色方格拼成的高楼，雨和下落的字符，中间是发光的标志，JOURNAL 和 REPOSITORY 两块面板浮在两侧。",
    ],
    tags: ["React", "TypeScript", "Three.js", "CRT"],
    stats: [
      { value: "3", label: "运行时依赖" },
      { value: "15", label: "场景模块" },
      { value: "4", label: "个链接" },
      { value: "1", label: "页面" },
    ],
  },
};
