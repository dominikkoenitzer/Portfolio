import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

const CONTRAST_TESTS = `  it('puts #767676 on white just over the AA boundary', () => {
    const r = checkContrast('#767676', '#ffffff');
    expect(r.ratio).toBeCloseTo(4.54, 1);
    expect(r.aa.normalText).toBe(true);
    expect(r.aaa.normalText).toBe(false);
    expect(r.score).toBe('AA');
  });

  it('puts #595959 on white at the AAA boundary', () => {
    const r = checkContrast('#595959', '#ffffff');
    expect(r.ratio).toBeCloseTo(7.0, 1);
    expect(r.aaa.normalText).toBe(true);
    expect(r.score).toBe('AAA');
  });`;

export const spectrum: Record<Language, LocalizedContent> = {
  en: {
    tagline: "Seven color tools that finally live under one roof, and none of them phone home.",
    description:
      "Spectrum is a client-side color toolkit: pull exact colors out of an image, build gradients and palettes, check WCAG contrast, and simulate color blindness. All in the browser, nothing uploaded.",
    overview:
      "Picking a color should not mean keeping five browser tabs open, each doing one trick and none of them talking to each other. Spectrum puts sampling, generating, gradients, contrast, color-vision simulation, a browsable color library and a theory page on seven routes of one Next.js app. Every pixel is read through the Canvas API on your own machine, and the conversions run through colord in a lib folder that has never heard of React. There is no backend at all, so it deploys as static files and your images stay where they are.",
    roleSummary: "Just me: the UX, the Next.js build, and the color math.",
    sections: [
      {
        heading: "What happens to a picture you drop in",
        body: [
          "A dropped, pasted or chosen file is drawn onto a canvas inside the tab, and every click reads one pixel back with getImageData. Anything wider or taller than 4000 pixels is scaled down first so the canvas stays manageable, and anything over 16384 is refused with an error message.",
          "The URL tab is the one place a picture comes from somewhere else, and even then the browser fetches it directly. If the server does not allow cross-origin reads, Spectrum says so. There is no proxy to get around that, since a proxy would be a server.",
          "The last 24 picked colors stay in localStorage. Where the browser has the EyeDropper API, a second button samples any pixel on the screen, not only inside the page. In Safari and Firefox that button is simply not rendered.",
        ],
      },
      {
        heading: "Grey chrome, so the color is the only color",
        body: [
          "A color tool whose interface has colors of its own makes every swatch harder to judge, so I took color out of the interface. The page is a greige paper tone, #e8e6e2, text and buttons are near-black ink, and the only saturated thing on screen is the color being worked on: a swatch, a palette, a gradient preview.",
          "The rules live as tokens in one stylesheet, Tailwind v4's @theme, and every component uses the semantic names instead of raw greys. Buttons are solid ink, headings stay plain, and the app has a single light theme.",
        ],
        figure: 3,
      },
      {
        heading: "A contrast checker that passes its own check",
        body: [
          "The contrast checker is the first thing anyone will point at a color tool's own interface. So the three greys used for text, and the green and red that mark pass and fail, are tuned to clear 4.5:1 on every surface they sit on, and the green and red also clear it on their own pale tint.",
          "The ratio itself comes from colord's a11y plugin. The thresholds are mine to get right: 4.5 and 3 for AA, 7 and 4.5 for AAA. The tests pin them to WCAG reference pairs, check that swapping foreground and background never changes the ratio, and check that no level is reported that its ratio did not earn.",
        ],
        figure: 2,
        code: {
          language: "typescript",
          text: CONTRAST_TESTS,
          caption:
            "From src/lib/color.test.ts. Two greys that sit right on the AA and AAA lines against white, so a rounding change or a shifted threshold fails here before anyone sees it on the page.",
        },
      },
      {
        heading: "Hue 200 used to be two colors",
        body: [
          "There used to be three separate tables of hue names, and they disagreed: hue 200 was Blue in one tool and Cyan in another. Now there is one table in the color library, with nine names around the wheel, and every tool that names a hue reads from it.",
          "A test walks all 360 degrees and counts the name changes. There have to be exactly nine, because red owns both ends of the wheel, so a second table creeping back in fails CI.",
          "The vision simulator lives in the same folder: eight kinds of color blindness, each a 3x3 matrix run over every pixel of the image. Its tests check that greys pass through almost untouched and that complete color blindness collapses to a true grey. The library has 23 tests in all.",
        ],
        figure: 1,
      },
    ],
    captions: [
      "The picker's front page: a sample image with five points sampled, each listed with its hex code and a name, next to the drop zone and the screen eyedropper.",
      "The generator with #2596be entered, showing its HEX, RGB, HSL and CMYK values and placing it as a cool blue at 196 degrees on the hue bar.",
      "The contrast checker at black on white: 21.00:1, rated AAA, with a live preview of text and buttons in that pair.",
      "The gradient maker with a two-stop linear gradient at 90 degrees, presets beside it and the CSS ready to copy.",
    ],
    tags: ["Next.js", "TypeScript", "Color", "Accessibility"],
    stats: [
      { value: "7", label: "tools, one app" },
      { value: "100%", label: "client-side" },
      { value: "0", label: "uploads" },
      { value: "0", label: "backend" },
    ],
  },
  de: {
    tagline: "Sieben Farbwerkzeuge, endlich unter einem Dach, und keines telefoniert nach Hause.",
    description:
      "Spectrum ist ein clientseitiges Farb-Toolkit: exakte Farben aus einem Bild ziehen, Gradienten und Paletten bauen, WCAG-Kontrast prüfen und Farbenblindheit simulieren. Alles im Browser, nichts wird hochgeladen.",
    overview:
      "Eine Farbe zu wählen sollte nicht bedeuten, fünf Browser-Tabs offen zu halten, von denen jeder einen Trick kann und keiner mit dem anderen redet. Spectrum legt Sampling, Generieren, Gradienten, Kontrast, Farbsehsimulation, eine durchstöberbare Farbbibliothek und eine Theorieseite auf sieben Routen einer Next.js-App. Jeder Pixel wird über die Canvas-API auf dem eigenen Rechner gelesen, und die Umrechnungen laufen über colord in einem Lib-Ordner, der noch nie von React gehört hat. Es gibt überhaupt kein Backend, also deployt das Ganze als statische Dateien und die Bilder bleiben, wo sie sind.",
    roleSummary: "Nur ich: die UX, der Next.js-Build und die Farbmathematik.",
    sections: [
      {
        heading: "Was mit einem Bild passiert, das man hineinzieht",
        body: [
          "Eine hineingezogene, eingefügte oder ausgewählte Datei wird im Tab auf ein Canvas gezeichnet, und jeder Klick liest mit getImageData genau einen Pixel zurück. Was breiter oder höher als 4000 Pixel ist, wird vorher verkleinert, damit das Canvas handlich bleibt, und alles über 16384 Pixel wird mit einer Fehlermeldung abgelehnt.",
          "Der URL-Tab ist die einzige Stelle, an der ein Bild von anderswo kommt, und auch dann lädt der Browser es direkt. Erlaubt der Server keine Cross-Origin-Zugriffe, sagt Spectrum das. Einen Proxy, der das umgeht, gibt es nicht, denn ein Proxy wäre ein Server.",
          "Die letzten 24 gewählten Farben bleiben im localStorage. Wo der Browser die EyeDropper-API kennt, nimmt ein zweiter Button jeden Pixel auf dem Bildschirm auf, nicht nur auf der Seite. In Safari und Firefox wird dieser Button gar nicht erst gerendert.",
        ],
      },
      {
        heading: "Graue Oberfläche, damit die Farbe die einzige Farbe ist",
        body: [
          "Hat die Oberfläche eines Farbwerkzeugs eigene Farben, lässt sich jedes Farbmuster schlechter beurteilen, also habe ich die Farbe aus der Oberfläche genommen. Die Seite hat einen greigen Papierton, #e8e6e2, Text und Buttons sind fast schwarze Tinte, und das einzige gesättigte Element auf dem Schirm ist die Farbe, an der man gerade arbeitet: ein Farbfeld, eine Palette, eine Gradientenvorschau.",
          "Die Regeln stehen als Tokens in einem einzigen Stylesheet, im @theme von Tailwind v4, und jede Komponente nutzt die semantischen Namen statt roher Grautöne. Buttons sind voll in Tinte gefüllt, Überschriften bleiben schlicht, und die App hat genau ein helles Theme.",
        ],
        figure: 3,
      },
      {
        heading: "Ein Kontrast-Checker, der seine eigene Prüfung besteht",
        body: [
          "Bei einem Farbwerkzeug richtet man den Kontrast-Checker zuerst auf dessen eigene Oberfläche. Deshalb sind die drei Grautöne für Text und das Grün und Rot für bestanden und durchgefallen so abgestimmt, dass sie auf jeder Fläche, auf der sie stehen, 4,5:1 schaffen. Grün und Rot schaffen es auch auf ihrer eigenen blassen Tönung.",
          "Das Verhältnis selbst liefert das a11y-Plugin von colord. Die Schwellen muss ich richtig setzen: 4,5 und 3 für AA, 7 und 4,5 für AAA. Die Tests nageln sie an WCAG-Referenzpaaren fest, prüfen, dass das Vertauschen von Vorder- und Hintergrund das Verhältnis nie ändert, und dass keine Stufe gemeldet wird, die das Verhältnis nicht hergibt.",
        ],
        figure: 2,
        code: {
          language: "typescript",
          text: CONTRAST_TESTS,
          caption:
            "Aus src/lib/color.test.ts. Zwei Grautöne, die auf Weiss genau an der AA- und an der AAA-Grenze liegen, damit eine geänderte Rundung oder eine verschobene Schwelle hier auffällt, bevor sie jemand auf der Seite sieht.",
        },
      },
      {
        heading: "Farbton 200 war einmal zwei Farben",
        body: [
          "Früher gab es drei getrennte Tabellen mit Farbtonnamen, und sie waren sich nicht einig: Farbton 200 hiess im einen Werkzeug Blue, im anderen Cyan. Jetzt gibt es eine Tabelle in der Farbbibliothek, mit neun Namen rund um den Farbkreis, und jedes Werkzeug, das einen Farbton benennt, liest aus ihr.",
          "Ein Test läuft alle 360 Grad ab und zählt die Namenswechsel. Es müssen genau neun sein, weil Rot beide Enden des Kreises besetzt, und eine zweite Tabelle, die sich wieder einschleicht, lässt die CI scheitern.",
          "Der Farbsehsimulator liegt im selben Ordner: acht Arten von Farbenblindheit, jede eine 3x3-Matrix, die über jeden Pixel des Bildes läuft. Seine Tests prüfen, dass Grautöne fast unverändert durchgehen und dass vollständige Farbenblindheit zu einem echten Grau zusammenfällt. Insgesamt hat die Bibliothek 23 Tests.",
        ],
        figure: 1,
      },
    ],
    captions: [
      "Die Startseite des Pickers: ein Beispielbild mit fünf aufgenommenen Punkten, jeder mit Hex-Code und Namen aufgelistet, neben der Drop-Zone und der Bildschirm-Pipette.",
      "Der Generator mit #2596be: die Werte in HEX, RGB, HSL und CMYK, eingeordnet als kühles Blau bei 196 Grad auf dem Farbtonbalken.",
      "Der Kontrast-Checker bei Schwarz auf Weiss: 21.00:1, bewertet mit AAA, dazu eine Live-Vorschau von Text und Buttons in diesem Paar.",
      "Der Gradient-Maker mit einem linearen Verlauf aus zwei Stopps bei 90 Grad, daneben Presets und das CSS zum Kopieren.",
    ],
    tags: ["Next.js", "TypeScript", "Color", "Accessibility"],
    stats: [
      { value: "7", label: "Tools, eine App" },
      { value: "100%", label: "im Browser" },
      { value: "0", label: "Uploads" },
      { value: "0", label: "Backend" },
    ],
  },
  fr: {
    tagline: "Sept outils de couleur enfin sous le même toit, et aucun ne rappelle la maison.",
    description:
      "Spectrum est une boîte à outils couleur côté client : prélever des couleurs exactes dans une image, composer des dégradés et des palettes, vérifier le contraste WCAG et simuler le daltonisme. Tout dans le navigateur, rien n'est envoyé.",
    overview:
      "Choisir une couleur ne devrait pas obliger à garder cinq onglets ouverts, chacun sachant faire un tour et aucun ne parlant aux autres. Spectrum met le prélèvement, la génération, les dégradés, le contraste, la simulation de vision des couleurs, une bibliothèque de couleurs à parcourir et une page de théorie sur sept routes d'une même app Next.js. Chaque pixel est lu via l'API Canvas sur votre propre machine, et les conversions passent par colord dans un dossier lib qui n'a jamais entendu parler de React. Il n'y a aucun backend, donc tout se déploie en fichiers statiques et vos images restent où elles sont.",
    roleSummary: "Moi seul : l'UX, le build Next.js et les maths de la couleur.",
    sections: [
      {
        heading: "Ce que devient une image qu'on dépose",
        body: [
          "Un fichier déposé, collé ou choisi est dessiné sur un canvas dans l'onglet, et chaque clic relit un seul pixel avec getImageData. Au-delà de 4000 pixels de large ou de haut, l'image est d'abord réduite pour que le canvas reste maniable, et au-delà de 16384 elle est refusée avec un message d'erreur.",
          "L'onglet URL est le seul endroit où une image vient d'ailleurs, et même là, c'est le navigateur qui la récupère directement. Si le serveur n'autorise pas la lecture cross-origin, Spectrum le dit. Il n'y a pas de proxy pour contourner ça, puisqu'un proxy serait un serveur.",
          "Les 24 dernières couleurs prélevées restent dans localStorage. Quand le navigateur connaît l'API EyeDropper, un second bouton prélève n'importe quel pixel de l'écran, pas seulement de la page. Dans Safari et Firefox, ce bouton n'est tout simplement pas affiché.",
        ],
      },
      {
        heading: "Une interface grise, pour que la couleur soit la seule couleur",
        body: [
          "Quand l'interface d'un outil de couleur a ses propres couleurs, chaque échantillon devient plus difficile à juger, alors j'ai retiré la couleur de l'interface. La page est d'un ton papier grège, #e8e6e2, le texte et les boutons sont d'une encre presque noire, et la seule chose saturée à l'écran est la couleur sur laquelle on travaille : un échantillon, une palette, l'aperçu d'un dégradé.",
          "Les règles sont des tokens dans une seule feuille de style, le @theme de Tailwind v4, et chaque composant utilise les noms sémantiques plutôt que des gris bruts. Les boutons sont pleins, couleur encre, les titres restent sobres, et l'app n'a qu'un seul thème clair.",
        ],
        figure: 3,
      },
      {
        heading: "Un vérificateur de contraste qui passe son propre test",
        body: [
          "Face à un outil de couleur, la première chose qu'on fait est de pointer le vérificateur de contraste sur sa propre interface. Les trois gris du texte, ainsi que le vert et le rouge qui marquent réussite et échec, sont donc réglés pour dépasser 4,5:1 sur chaque surface où ils apparaissent, et le vert et le rouge le dépassent aussi sur leur propre teinte pâle.",
          "Le ratio lui-même vient du plugin a11y de colord. Les seuils, c'est à moi de les poser juste : 4,5 et 3 pour AA, 7 et 4,5 pour AAA. Les tests les fixent sur des paires de référence du WCAG, vérifient qu'inverser premier plan et arrière-plan ne change jamais le ratio, et qu'aucun niveau n'est annoncé sans que le ratio le justifie.",
        ],
        figure: 2,
        code: {
          language: "typescript",
          text: CONTRAST_TESTS,
          caption:
            "Extrait de src/lib/color.test.ts. Deux gris qui tombent pile sur les seuils AA et AAA sur fond blanc : un arrondi modifié ou un seuil décalé échoue ici avant que quiconque le voie sur la page.",
        },
      },
      {
        heading: "La teinte 200 était deux couleurs",
        body: [
          "Il y avait autrefois trois tables de noms de teintes séparées, et elles ne s'accordaient pas : la teinte 200 était Blue dans un outil et Cyan dans un autre. Il n'y a plus qu'une table, dans la bibliothèque de couleurs, avec neuf noms autour du cercle, et chaque outil qui nomme une teinte la lit.",
          "Un test parcourt les 360 degrés et compte les changements de nom. Il doit y en avoir exactement neuf, puisque le rouge occupe les deux bouts du cercle ; une deuxième table qui reviendrait en douce fait échouer la CI.",
          "Le simulateur de vision des couleurs vit dans le même dossier : huit formes de daltonisme, chacune une matrice 3x3 appliquée à chaque pixel de l'image. Ses tests vérifient que les gris passent presque intacts et qu'un daltonisme total ramène tout à un vrai gris. La bibliothèque compte 23 tests en tout.",
        ],
        figure: 1,
      },
    ],
    captions: [
      "La page d'accueil du sélecteur : une image d'exemple avec cinq points prélevés, chacun listé avec son code hex et un nom, à côté de la zone de dépôt et de la pipette d'écran.",
      "Le générateur avec #2596be : ses valeurs HEX, RGB, HSL et CMYK, et sa place de bleu froid à 196 degrés sur la barre des teintes.",
      "Le vérificateur de contraste en noir sur blanc : 21.00:1, noté AAA, avec un aperçu en direct de texte et de boutons dans cette paire.",
      "Le créateur de dégradés avec un dégradé linéaire à deux arrêts à 90 degrés, les préréglages à côté et le CSS prêt à copier.",
    ],
    tags: ["Next.js", "TypeScript", "Color", "Accessibility"],
    stats: [
      { value: "7", label: "outils, une app" },
      { value: "100%", label: "côté client" },
      { value: "0", label: "envois" },
      { value: "0", label: "backend" },
    ],
  },
  zh: {
    tagline: "七个颜色工具终于住到了一个屋檐下，而且没有一个会往外发数据。",
    description:
      "Spectrum 是一套纯客户端的颜色工具：从图片里取准确的颜色、做渐变与配色、检查 WCAG 对比度、模拟色盲。全在浏览器里跑，什么都不上传。",
    overview:
      "选个颜色，不该逼你开着五个标签页，每个只会一招，彼此还都不说话。Spectrum 把取色、生成、渐变、对比度、色觉模拟、一个可翻阅的颜色库和一页色彩理论，放进同一个 Next.js 应用的七条路由里。每个像素都通过 Canvas API 在你自己的机器上读取，换算则交给 lib 目录里的 colord，那个目录压根不知道 React 的存在。整个项目没有后端，所以它以静态文件部署，你的图片也就留在原处。",
    roleSummary: "只有我：交互、Next.js 构建，以及颜色相关的数学。",
    sections: [
      {
        heading: "拖进来的图片会经历什么",
        body: [
          "拖入、粘贴或选择的文件会被画到当前标签页里的一块 canvas 上，每次点击用 getImageData 读回一个像素。宽或高超过 4000 像素的图片会先缩小，让 canvas 保持可控；超过 16384 像素的直接拒绝，并给出错误提示。",
          "只有 URL 标签页会从别处拿图片，即便如此也是浏览器直接去取。服务器不允许跨域读取时，Spectrum 会直说。没有用代理绕过去，因为代理本身就是一台服务器。",
          "最近取过的 24 个颜色保存在 localStorage 里。浏览器支持 EyeDropper API 时，会多出一个按钮，可以取屏幕上任意位置的像素，而不只是页面里的。在 Safari 和 Firefox 里，这个按钮干脆不渲染。",
        ],
      },
      {
        heading: "界面是灰的，颜色才是唯一的颜色",
        body: [
          "颜色工具的界面如果自带颜色，每个色块都会更难判断，所以我把颜色从界面里拿掉了。页面是带灰的纸色 #e8e6e2，文字和按钮是接近黑色的墨色，屏幕上唯一饱和的东西就是你正在处理的颜色：一个色块、一组配色、一条渐变预览。",
          "这些规则以 token 的形式写在同一个样式表里，也就是 Tailwind v4 的 @theme，每个组件都用语义化的名字，不直接用原始灰色。按钮是实心墨色，标题保持朴素，整个应用只有一套浅色主题。",
        ],
        figure: 3,
      },
      {
        heading: "对比度检查器得先通过自己的检查",
        body: [
          "拿到一个颜色工具，人们往往第一件事就是用它的对比度检查器去测它自己的界面。所以正文用的三种灰，以及表示通过和失败的绿与红，都调到在它们出现的每一种底色上超过 4.5:1，绿和红在自己的浅色底上也一样。",
          "比值本身由 colord 的 a11y 插件算出，阈值则要我自己设对：AA 是 4.5 和 3，AAA 是 7 和 4.5。测试把它们钉在 WCAG 的参考色对上，检查前景和背景互换后比值不变，也检查不会报出比值够不上的等级。",
        ],
        figure: 2,
        code: {
          language: "typescript",
          text: CONTRAST_TESTS,
          caption:
            "摘自 src/lib/color.test.ts。这两种灰在白底上正好落在 AA 和 AAA 的分界线上，舍入方式变了或阈值偏了，会先在这里失败，而不是被人在页面上看到。",
        },
      },
      {
        heading: "色相 200 曾经是两种颜色",
        body: [
          "以前有三张各自独立的色相名称表，而且彼此对不上：色相 200 在一个工具里叫 Blue，在另一个里叫 Cyan。现在颜色库里只有一张表，色环上九个名字，所有要给色相命名的工具都从这里读。",
          "有一个测试把 360 度走一遍，数名字变了几次。必须正好九次，因为红色占着色环的两端；如果第二张表又悄悄回来，CI 就会失败。",
          "色觉模拟器也在同一个目录里：八种色盲，每种都是一个 3x3 矩阵，作用在图片的每个像素上。它的测试检查灰色几乎原样通过，全色盲会把一切变成真正的灰。整个库一共 23 个测试。",
        ],
        figure: 1,
      },
    ],
    captions: [
      "取色器首页：一张示例图上取了五个点，每个颜色列出十六进制值和名字，旁边是拖放区和屏幕取色器。",
      "输入 #2596be 后的生成器：列出它的 HEX、RGB、HSL 和 CMYK 值，并在色相条上把它定位为 196 度的冷蓝色。",
      "黑字白底下的对比度检查器：21.00:1，评为 AAA，附带这组颜色下文字和按钮的实时预览。",
      "渐变生成器：一条 90 度的双节点线性渐变，旁边是预设，CSS 可以直接复制。",
    ],
    tags: ["Next.js", "TypeScript", "Color", "Accessibility"],
    stats: [
      { value: "7", label: "工具，一个应用" },
      { value: "100%", label: "客户端" },
      { value: "0", label: "上传" },
      { value: "0", label: "后端" },
    ],
  },
};
