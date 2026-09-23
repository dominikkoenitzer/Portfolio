import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const portfolio: Record<Language, LocalizedContent> = {
  en: {
    tagline:
      "The site you are reading right now. Yes, it is the portfolio piece.",
    description:
      "My personal portfolio: a fast React single-page app with hand-rolled i18n in four languages, JSON-LD structured data on every page, a real prerendered HTML file per route, and a WebGL background that stays off the critical path.",
    overview:
      "Most portfolios are a template with the developer's name swapped in. I wanted mine to be the work sample. It is React, TypeScript and Vite: four languages behind an i18n layer I wrote myself (English ships in the bundle, the other three load on demand), JSON-LD on every page so search engines and crawlers can actually read it, framer-motion page transitions, and one lazy WebGL aurora ribbon. Every route also ships as a real prerendered HTML file, so a link unfurler that never runs JavaScript still gets the right title and card.",
    roleSummary:
      "Just me: the architecture, the four languages, the SEO, and the visual system.",
    sections: [
      {
        heading: "A real file behind every URL",
        body: [
          "The site is a single-page app, so at first every URL served the same index.html, with the home page's title, description and preview image. Google runs JavaScript and coped. Link previews do not: a project page shared on LinkedIn, Slack or WhatsApp showed up as the home page.",
          "After the Vite build, a prerender script now writes one HTML file per route, each with its own title, description, canonical, preview image and JSON-LD in the head. The app markup in the body is left as Vite emitted it, so React mounts as usual and there is no hydration to reason about. That is 21 files today, nine pages and one per project, plus a 404.html.",
          "With a file behind every route I could drop the catch-all rewrite in vercel.json. A rewrite can only answer 200, so every junk URL had been a soft 404. Now anything without a file gets 404.html with a real 404 status, and the build fails if the router has a route the prerender step does not cover.",
        ],
      },
      {
        heading: "Four languages and no i18n library",
        body: [
          "English, German, French and Chinese are one module each, typed against the English one, and a single config file decides which languages exist. English ships in the bundle. The other three are fetched when a visitor asks for them, and the language provider renders nothing until that language has arrived, so no component can read a string that is not there yet.",
          "Types only guarantee the shape. A test checks what they cannot: the same list lengths as English, no blank strings, no leftover placeholders, and a failure if a language turns out to be English copied over. The case studies on these pages are written per language too, not machine-switched at runtime.",
        ],
      },
      {
        heading: "281 kB from one convenient import",
        body: [
          "Every page except the home page is lazy loaded, so a visitor should only pay for the page they open. For a while that was not true, because the pages imported their sections through a barrel file. A barrel re-export makes every section a static dependency of whichever chunk touches it, and the projects section brings the whole catalogue along, every case study in four languages.",
          "I measured it at 281 kB, 113 kB gzipped, on the entry chunk. Sections are now imported by their module path and the barrel only re-exports the layout, which mounts on every page anyway. The reason is written into the barrel file itself, where the next person tempted by the shortcut will read it.",
        ],
        figure: 1,
      },
      {
        heading: "One theme, and the two scenes that stayed",
        body: [
          "There is one theme: dusty violet, sage and blush on a warm cream page, with a single aurora ribbon in the same three colours across the top. The ribbon is a WebGL shader, loaded lazily so it stays off the critical path. There is no dark mode and no toggle.",
          "In September I took every decorative effect off the site in one pass: glow shadows, glass surfaces, gradient text, shimmer, parallax and count-up numbers. What is left is one fade per block, hovers that only change colour, the custom cursor and the aurora. Every card on the site is built from the same recipe.",
          "Two three.js scenes survived that pass: the tree on the services page and the sphere of logos on /skills. They are the reason three.js is in the build at all.",
        ],
        figure: 2,
      },
      {
        heading: "Overlays that can be open at the same time",
        body: [
          "Four things can cover the page: the navigation drawer, the search palette, the project lightbox and the CV preview. At first each one locked scrolling on its own. When two were open, the second read the scroll position after the first had already fixed the page, saved 0, and closing them in the wrong order left the page scrolling behind the one still open and dropped the visitor back at the top.",
          "The lock is now one counter and one saved position for the whole module: the page is fixed when the first overlay opens and released when the last one closes. Escape had the same flaw, one keypress closed everything, so the overlays register on a small stack and only the top one answers. The stack has its own tests, including overlays that close out of order.",
        ],
      },
    ],
    captions: [
      "The home page: the hero on the cream page, under the aurora in violet, sage and blush.",
      "The projects page, with the search field, the web and desktop filter and the sort order above the first card.",
      "The skills page, where the tools I work with sit as logos on a three.js sphere.",
    ],
    tags: ["React", "TypeScript", "Vite", "SEO"],
    stats: [
      { value: "4", label: "languages" },
      { value: "0", label: "i18n libraries" },
      { value: "24", label: "prerendered routes" },
      { value: "216", label: "tests" },
    ],
  },
  de: {
    tagline: "Die Seite, die du gerade liest. Ja, sie ist das Arbeitsbeispiel.",
    description:
      "Mein persönliches Portfolio: eine schnelle React-Single-Page-App mit selbst geschriebener i18n in vier Sprachen, JSON-LD auf jeder Seite, einer echten vorgerenderten HTML-Datei pro Route und einem WebGL-Hintergrund, der vom kritischen Pfad wegbleibt.",
    overview:
      "Die meisten Portfolios sind ein Template, in dem der Name ausgetauscht wurde. Ich wollte, dass meines das Arbeitsbeispiel ist. Es läuft auf React, TypeScript und Vite: vier Sprachen hinter einer i18n-Schicht, die ich selbst geschrieben habe (Englisch liegt im Bundle, die anderen drei laden auf Abruf), JSON-LD auf jeder Seite, damit Suchmaschinen und Crawler sie wirklich lesen können, Seitenübergänge mit framer-motion und ein einzelnes, lazy geladenes WebGL-Aurora-Band. Jede Route wird zusätzlich als echte vorgerenderte HTML-Datei ausgeliefert, damit ein Link-Vorschau-Dienst, der kein JavaScript ausführt, trotzdem den richtigen Titel und die richtige Karte bekommt.",
    roleSummary:
      "Nur ich: die Architektur, die vier Sprachen, das SEO und das visuelle System.",
    sections: [
      {
        heading: "Hinter jeder URL eine echte Datei",
        body: [
          "Die Seite ist eine Single-Page-App, also lieferte anfangs jede URL dieselbe index.html aus, mit Titel, Beschreibung und Vorschaubild der Startseite. Google führt JavaScript aus und kam damit zurecht. Link-Vorschauen tun das nicht: Eine Projektseite, auf LinkedIn, Slack oder WhatsApp geteilt, erschien als Startseite.",
          "Nach dem Vite-Build schreibt jetzt ein Prerender-Skript eine HTML-Datei pro Route, jede mit eigenem Titel, eigener Beschreibung, Canonical, Vorschaubild und JSON-LD im Head. Das App-Markup im Body bleibt so, wie Vite es ausgegeben hat, React startet also wie gewohnt, und es gibt keine Hydration, über die man nachdenken müsste. Heute sind das 21 Dateien, neun Seiten und eine pro Projekt, dazu eine 404.html.",
          "Mit einer Datei hinter jeder Route konnte der Catch-all-Rewrite in der vercel.json weg. Ein Rewrite kann nur mit 200 antworten, also war jede Müll-URL ein Soft-404. Jetzt bekommt alles ohne Datei die 404.html mit echtem 404-Status, und der Build bricht ab, wenn der Router eine Route kennt, die der Prerender-Schritt nicht abdeckt.",
        ],
      },
      {
        heading: "Vier Sprachen ohne i18n-Library",
        body: [
          "Englisch, Deutsch, Französisch und Chinesisch sind je ein Modul, typisiert gegen das englische, und eine einzige Konfigurationsdatei legt fest, welche Sprachen es gibt. Englisch liegt im Bundle. Die anderen drei werden geholt, wenn jemand sie will, und der Language-Provider rendert nichts, bis diese Sprache da ist. Keine Komponente kann also einen Text lesen, der noch fehlt.",
          "Typen garantieren nur die Form. Ein Test prüft, was sie nicht können: gleich lange Listen wie im Englischen, keine leeren Strings, keine übrig gebliebenen Platzhalter, und er schlägt fehl, wenn eine Sprache in Wahrheit kopiertes Englisch ist. Auch die Fallstudien auf diesen Seiten sind pro Sprache geschrieben und werden nicht zur Laufzeit maschinell umgeschaltet.",
        ],
      },
      {
        heading: "281 kB wegen eines bequemen Imports",
        body: [
          "Jede Seite ausser der Startseite lädt lazy, ein Besucher sollte also nur für die Seite bezahlen, die er öffnet. Eine Zeit lang stimmte das nicht, weil die Seiten ihre Sections über eine Barrel-Datei importierten. Ein Re-Export im Barrel macht jede Section zur statischen Abhängigkeit jedes Chunks, der ihn berührt, und die Projekt-Section bringt den ganzen Katalog mit, jede Fallstudie in vier Sprachen.",
          "Gemessen waren das 281 kB, gzipped 113 kB, im Entry-Chunk. Sections werden jetzt über ihren Modulpfad importiert, und das Barrel exportiert nur noch das Layout, das ohnehin auf jeder Seite hängt. Der Grund steht im Barrel selbst, dort, wo ihn die nächste Person liest, die die Abkürzung nehmen will.",
        ],
        figure: 1,
      },
      {
        heading: "Ein Theme und die zwei Szenen, die bleiben durften",
        body: [
          "Es gibt ein Theme: gedämpftes Violett, Salbei und Rosé auf warmem Crème, mit einem einzelnen Aurora-Band in denselben drei Farben am oberen Rand. Das Band ist ein WebGL-Shader und lädt lazy, damit es vom kritischen Pfad wegbleibt. Einen Dark Mode oder einen Umschalter gibt es nicht.",
          "Im September habe ich in einem Durchgang jeden dekorativen Effekt von der Seite genommen: Glow-Schatten, Glasflächen, Verlaufstext, Schimmer, Parallax und hochzählende Zahlen. Übrig sind ein Einblenden pro Block, Hovers, die nur die Farbe ändern, der eigene Cursor und die Aurora. Jede Karte auf der Seite folgt demselben Rezept.",
          "Zwei three.js-Szenen haben diesen Durchgang überlebt: der Baum auf der Services-Seite und die Logo-Kugel auf /skills. Ihretwegen ist three.js überhaupt im Build.",
        ],
        figure: 2,
      },
      {
        heading: "Overlays, die gleichzeitig offen sein können",
        body: [
          "Vier Dinge können die Seite überdecken: das Navigationsmenü, die Suchpalette, die Projekt-Lightbox und die Lebenslauf-Vorschau. Anfangs sperrte jedes das Scrollen für sich. Waren zwei offen, las das zweite die Scrollposition, nachdem das erste die Seite schon fixiert hatte, speicherte 0, und wer sie in der falschen Reihenfolge schloss, hatte eine Seite, die hinter dem noch offenen Overlay scrollte, und landete wieder ganz oben.",
          "Die Sperre ist jetzt ein Zähler und eine gespeicherte Position für das ganze Modul: Die Seite wird fixiert, wenn das erste Overlay aufgeht, und freigegeben, wenn das letzte zugeht. Escape hatte denselben Fehler, ein Tastendruck schloss alles, also melden sich die Overlays auf einem kleinen Stapel an, und nur das oberste antwortet. Der Stapel hat eigene Tests, auch für Overlays, die in anderer Reihenfolge zugehen.",
        ],
      },
    ],
    captions: [
      "Die Startseite: der Hero auf dem Crème-Grund, unter der Aurora in Violett, Salbei und Rosé.",
      "Die Projektseite mit Suchfeld, dem Filter für Web und Desktop und der Sortierung über der ersten Karte.",
      "Die Skills-Seite, auf der die Werkzeuge, mit denen ich arbeite, als Logos auf einer three.js-Kugel sitzen.",
    ],
    tags: ["React", "TypeScript", "Vite", "SEO"],
    stats: [
      { value: "4", label: "Sprachen" },
      { value: "0", label: "i18n-Libraries" },
      { value: "24", label: "vorgerenderte Routen" },
      { value: "216", label: "Tests" },
    ],
  },
  fr: {
    tagline: "Le site que vous lisez en ce moment. Oui, c'est lui, l'échantillon.",
    description:
      "Mon portfolio personnel : une application React monopage rapide avec une i18n écrite à la main en quatre langues, des données structurées JSON-LD sur chaque page, un vrai fichier HTML prérendu par route, et un fond WebGL qui reste hors du chemin critique.",
    overview:
      "La plupart des portfolios sont un template dans lequel on a remplacé le nom. Je voulais que le mien soit l'échantillon de travail. C'est React, TypeScript et Vite : quatre langues derrière une couche i18n que j'ai écrite moi-même (l'anglais est dans le bundle, les trois autres se chargent à la demande), du JSON-LD sur chaque page pour que moteurs et crawlers puissent vraiment la lire, des transitions framer-motion, et un seul ruban d'aurore WebGL chargé en lazy. Chaque route est aussi livrée comme un vrai fichier HTML prérendu, si bien qu'un service d'aperçu de lien qui n'exécute jamais de JavaScript obtient tout de même le bon titre et la bonne carte.",
    roleSummary:
      "Moi seul : l'architecture, les quatre langues, le SEO et le système visuel.",
    sections: [
      {
        heading: "Un vrai fichier derrière chaque URL",
        body: [
          "Le site est une application monopage, donc au début chaque URL servait le même index.html, avec le titre, la description et l'image d'aperçu de l'accueil. Google exécute le JavaScript et s'en sortait. Les aperçus de liens, non : une page de projet partagée sur LinkedIn, Slack ou WhatsApp s'affichait comme la page d'accueil.",
          "Après le build Vite, un script de prérendu écrit maintenant un fichier HTML par route, chacun avec son propre titre, sa description, son canonique, son image d'aperçu et son JSON-LD dans le head. Le balisage de l'app dans le body reste tel que Vite l'a produit, React démarre donc normalement et il n'y a pas d'hydratation à surveiller. Cela fait 21 fichiers aujourd'hui, neuf pages et un par projet, plus un 404.html.",
          "Avec un fichier derrière chaque route, j'ai pu retirer la réécriture attrape-tout de vercel.json. Une réécriture ne peut répondre que 200, donc chaque URL parasite était une 404 douce. Désormais, tout ce qui n'a pas de fichier reçoit 404.html avec un vrai statut 404, et le build échoue si le routeur connaît une route que l'étape de prérendu ne couvre pas.",
        ],
      },
      {
        heading: "Quatre langues sans bibliothèque i18n",
        body: [
          "L'anglais, l'allemand, le français et le chinois sont chacun un module, typé d'après le module anglais, et un seul fichier de configuration décide quelles langues existent. L'anglais est dans le bundle. Les trois autres sont récupérées quand un visiteur les demande, et le fournisseur de langue n'affiche rien tant que cette langue n'est pas arrivée : aucun composant ne peut lire un texte qui n'est pas encore là.",
          "Les types ne garantissent que la forme. Un test vérifie ce qu'ils ne voient pas : des listes de même longueur qu'en anglais, aucune chaîne vide, aucun placeholder oublié, et un échec si une langue s'avère être de l'anglais recopié. Les études de cas de ces pages sont elles aussi écrites dans chaque langue, pas traduites automatiquement à l'exécution.",
        ],
      },
      {
        heading: "281 ko pour un import pratique",
        body: [
          "Chaque page sauf l'accueil est chargée en lazy, un visiteur ne devrait donc payer que pour la page qu'il ouvre. Pendant un temps, ce n'était pas le cas, parce que les pages importaient leurs sections par un fichier barrel. Une réexportation dans un barrel fait de chaque section une dépendance statique de tout chunk qui le touche, et la section des projets entraîne tout le catalogue, chaque étude de cas en quatre langues.",
          "Mesuré : 281 ko, 113 ko gzippés, dans le chunk d'entrée. Les sections s'importent maintenant par leur chemin de module et le barrel ne réexporte plus que la mise en page, montée sur chaque page de toute façon. La raison est écrite dans le barrel lui-même, là où la lira la prochaine personne tentée par le raccourci.",
        ],
        figure: 1,
      },
      {
        heading: "Un seul thème, et les deux scènes restées",
        body: [
          "Il y a un seul thème : violet poudré, sauge et rose pâle sur une page crème chaude, avec un unique ruban d'aurore dans ces trois couleurs en haut de l'écran. Le ruban est un shader WebGL, chargé en lazy pour rester hors du chemin critique. Il n'y a ni mode sombre ni bouton pour en changer.",
          "En septembre, j'ai retiré tous les effets décoratifs du site en une seule passe : ombres lumineuses, surfaces de verre, texte en dégradé, reflets, parallaxe et chiffres qui s'incrémentent. Il reste un fondu par bloc, des survols qui ne changent que la couleur, le curseur maison et l'aurore. Chaque carte du site suit la même recette.",
          "Deux scènes three.js ont survécu à cette passe : l'arbre de la page Services et la sphère de logos sur /skills. C'est pour elles que three.js est dans le build.",
        ],
        figure: 2,
      },
      {
        heading: "Des overlays qui peuvent être ouverts en même temps",
        body: [
          "Quatre éléments peuvent recouvrir la page : le menu de navigation, la palette de recherche, la lightbox des projets et l'aperçu du CV. Au début, chacun bloquait le défilement de son côté. Avec deux ouverts, le second lisait la position de défilement alors que le premier avait déjà figé la page, enregistrait 0, et les fermer dans le mauvais ordre laissait la page défiler derrière celui encore ouvert, puis ramenait le visiteur tout en haut.",
          "Le verrou est désormais un compteur et une position enregistrée pour tout le module : la page est figée à l'ouverture du premier overlay et libérée à la fermeture du dernier. Échap avait le même défaut, une touche fermait tout, donc les overlays s'inscrivent sur une petite pile et seul celui du dessus répond. La pile a ses propres tests, y compris pour des overlays fermés dans le désordre.",
        ],
      },
    ],
    captions: [
      "La page d'accueil : le hero sur le fond crème, sous l'aurore violette, sauge et rose.",
      "La page des projets, avec le champ de recherche, le filtre web et bureau et l'ordre de tri au-dessus de la première carte.",
      "La page des compétences, où les outils avec lesquels je travaille forment une sphère de logos en three.js.",
    ],
    tags: ["React", "TypeScript", "Vite", "SEO"],
    stats: [
      { value: "4", label: "langues" },
      { value: "0", label: "bibliothèques i18n" },
      { value: "24", label: "routes prérendues" },
      { value: "216", label: "tests" },
    ],
  },
  zh: {
    tagline: "你此刻正在读的这个站。是的，它本身就是作品。",
    description:
      "我的个人作品集：一个快速的 React 单页应用，四种语言的 i18n 由我自己写，每页都有 JSON-LD 结构化数据，每条路由都对应一个真实的预渲染 HTML 文件，还有一层不占关键路径的 WebGL 背景。",
    overview:
      "多数作品集都是把模板里的名字换成自己的。我想让我的这一份本身就是作品。它跑在 React、TypeScript 和 Vite 上：四种语言背后是我自己写的 i18n 层（英文打进包里，另外三种按需加载），每页都有 JSON-LD，好让搜索引擎和抓取程序真的读得懂，页面切换用 framer-motion，还有一条懒加载的 WebGL 极光带。每条路由同时会输出一个真实的预渲染 HTML 文件，所以那些从不执行 JavaScript 的链接预览服务，也照样能拿到正确的标题和卡片。",
    roleSummary: "只有我：架构、四种语言、SEO，以及整套视觉。",
    sections: [
      {
        heading: "每个 URL 背后都有一个真实文件",
        body: [
          "这个站是单页应用，所以起初每个 URL 返回的都是同一个 index.html，带着首页的标题、描述和预览图。Google 会执行 JavaScript，还能应付。链接预览不会：把一个项目页分享到 LinkedIn、Slack 或 WhatsApp，显示出来的却是首页。",
          "现在 Vite 构建完成后，一个预渲染脚本会为每条路由写一个 HTML 文件，head 里各有自己的标题、描述、canonical、预览图和 JSON-LD。body 里的应用标记保持 Vite 输出的原样，React 照常挂载，不存在需要操心的 hydration。目前一共 21 个文件：九个页面，每个项目一个，另外还有一个 404.html。",
          "每条路由都有了文件，我就能去掉 vercel.json 里的通配重写。重写只能回 200，所以每个垃圾 URL 都曾是软 404。现在凡是没有文件的路径都会以真正的 404 状态拿到 404.html；如果路由器里有预渲染步骤没覆盖的路由，构建会直接失败。",
        ],
      },
      {
        heading: "四种语言，不用 i18n 库",
        body: [
          "英文、德文、法文和中文各是一个模块，按英文模块的类型来写，哪些语言存在由一个配置文件说了算。英文打进包里，另外三种在访客需要时才去取；那种语言到达之前，语言 provider 什么都不渲染，所以没有哪个组件会读到一段还不存在的文字。",
          "类型只保证结构。剩下的交给一个测试：列表长度要和英文一致，不能有空字符串，不能留下占位符，而且如果某种语言其实是照搬的英文，测试就会失败。这些页面上的项目案例也是按语言分别写的，不是运行时机器切换的。",
        ],
      },
      {
        heading: "一个图省事的 import，多出 281 kB",
        body: [
          "除首页外每个页面都是懒加载的，访客本该只为打开的那一页付出代价。有一阵子并非如此，因为各页面是通过一个 barrel 文件引入 section 的。barrel 里的重新导出会让每个 section 都成为所有碰到它的 chunk 的静态依赖，而项目 section 会把整个目录一起带进来，四种语言的每一篇案例。",
          "实测入口 chunk 因此多了 281 kB，gzip 后 113 kB。现在 section 按模块路径引入，barrel 只重新导出布局组件，反正它们每页都会挂载。原因就写在 barrel 文件里，下一个想走捷径的人一打开就会看到。",
        ],
        figure: 1,
      },
      {
        heading: "一套主题，和留下来的两个场景",
        body: [
          "全站只有一套主题：暖奶油色的页面上，灰调的紫、鼠尾草绿和淡粉，顶部横着一条同样三种颜色的极光带。极光带是一个 WebGL 着色器，懒加载，不占关键路径。没有深色模式，也没有切换开关。",
          "九月我一次性拿掉了站上所有装饰效果：发光阴影、玻璃质感、渐变文字、光泽扫过、视差和数字滚动。留下来的是每个区块一次淡入、只变颜色的悬停、自定义光标和极光。站上每张卡片都用同一套做法。",
          "有两个 three.js 场景留了下来：服务页上的树，以及 /skills 上的图标球体。three.js 之所以在构建里，就是因为它们。",
        ],
        figure: 2,
      },
      {
        heading: "可以同时打开的浮层",
        body: [
          "有四样东西会盖住页面：导航抽屉、搜索面板、项目灯箱和简历预览。起初它们各自锁定滚动。两个同时打开时，第二个读取滚动位置时第一个已经把页面固定住了，于是记下 0；关闭顺序一错，页面就会在还开着的那个浮层后面滚动，访客还会被送回顶部。",
          "现在锁是模块级的一个计数器加一个保存的位置：第一个浮层打开时固定页面，最后一个关闭时才释放。Esc 键也有同样的毛病，按一下全部关掉，所以浮层会登记到一个小栈上，只有最上面那个响应。这个栈有自己的测试，包括浮层不按顺序关闭的情况。",
        ],
      },
    ],
    captions: [
      "首页：奶油色底上的开场区，上方是紫、鼠尾草绿和粉三色的极光。",
      "项目页，第一张卡片上方是搜索框、网页与桌面的筛选，以及排序方式。",
      "技能页，我日常用的工具以图标的形式排成一个 three.js 球体。",
    ],
    tags: ["React", "TypeScript", "Vite", "SEO"],
    stats: [
      { value: "4", label: "语言" },
      { value: "0", label: "i18n 库" },
      { value: "24", label: "预渲染路由" },
      { value: "216", label: "测试" },
    ],
  },
};
