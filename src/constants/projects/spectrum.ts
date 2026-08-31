import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const spectrum: Record<Language, LocalizedContent> = {
  en: {
    tagline: "Seven color tools that finally live under one roof, and none of them phone home.",
    description:
      "Spectrum is a client-side color toolkit: pull exact colors out of an image, build gradients and palettes, check WCAG contrast, and simulate color blindness. All in the browser, nothing uploaded.",
    overview:
      "Picking a color should not mean keeping five browser tabs open, each doing one trick and none of them talking to each other. Spectrum puts sampling, generating, gradients, contrast, color-vision simulation, a browsable color library and a theory page on seven routes of one Next.js app. Every pixel is read through the Canvas API on your own machine, and the conversions run through colord in a lib folder that has never heard of React. There is no backend at all, so it deploys as static files and your images stay where they are.",
    roleSummary: "Just me: the UX, the Next.js build, and the color math.",
    problemStatement:
      "Designers and developers end up stitching together a pile of single-purpose color tools that never share state, and the contrast checker is usually the tab you forget to open. Spectrum keeps all of it in one place and puts the accessibility checks one click from the color you are picking.",
    objectives: [
      "Sample exact colors from any image, pixel by pixel, entirely in the browser.",
      "Fold gradients, palettes, WCAG contrast and color-vision simulation into one app.",
      "Make the accessibility check part of picking a color, not a separate detour.",
    ],
    architectureDecisions: [
      "Next.js and TypeScript with one route per tool, so each stays focused and loads on its own.",
      "The color logic lives in a framework-agnostic lib built on colord, kept well clear of the React components.",
      "Fully client-side through the Canvas API. With no backend, images never leave the machine and the whole thing deploys as static files.",
    ],
    implementationHighlights: [
      "Pixel-accurate sampling from dropped or pasted images, with the picked-color history kept in localStorage.",
      "Multi-stop gradient composition and palette generation that hand you copy-ready CSS.",
      "WCAG contrast checks and color-vision-deficiency simulation, so a design can be put through the accessibility tests while it is still being made.",
      "A browsable library of named colors, palettes and brand colors, plus a theory page for the harmonies.",
    ],
    qualityAndSecurity: [
      "Images are processed on-device through Canvas and never uploaded. There is no upload button to misuse.",
      "TypeScript in strict mode, with the color math isolated in a testable library and 23 test cases over it.",
      "CI installs, type-checks and builds on every push and pull request.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Seven distinct color tools in one app is a grab-bag waiting to happen.",
        solution:
          "A neutral gallery-frame design where the only saturated color on screen is the one you are working with, and one focused route per tool.",
      },
      {
        challenge:
          "Reading exact pixel colors from arbitrary images, fast, and entirely in the browser.",
        solution:
          "The Canvas API for client-side pixel sampling, with the conversions handed off to colord in the shared lib.",
      },
    ],
    hiringSignals: [
      "Accessibility shipped as an actual feature: WCAG contrast and color-vision simulation sit next to the picker.",
      "Domain logic kept out of the UI: the color math is framework-agnostic and tested on its own.",
      "I took a live product from the first route to the seventh without the codebase turning into a pile.",
    ],
    nextIterations: [
      "Export palettes and gradients in more formats: design tokens, SVG, code snippets.",
      "Saved projects and shareable links for a color set.",
    ],
    tags: ["Next.js", "TypeScript", "Color", "Accessibility"],
    impactHeading: "What This Project Is Good For",
    impactPoints: [
      "Replaces a handful of single-purpose color tools with one fast, cohesive toolkit.",
      "Makes the accessible color choice the easy one, by keeping the WCAG and color-vision checks in reach.",
      "Keeps images private, because every bit of processing happens in the browser.",
    ],
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
    problemStatement:
      "Designer und Entwickler flicken sich am Ende einen Haufen Einzweck-Farbwerkzeuge zusammen, die nie denselben State teilen, und der Kontrast-Checker ist meist der Tab, den man vergisst. Spectrum hält alles an einem Ort und legt die Accessibility-Prüfung einen Klick neben die Farbe, die man gerade wählt.",
    objectives: [
      "Exakte Farben aus jedem Bild ziehen, Pixel für Pixel, vollständig im Browser.",
      "Gradienten, Paletten, WCAG-Kontrast und Farbsehsimulation in einer App zusammenfassen.",
      "Die Accessibility-Prüfung zum Teil der Farbwahl machen, nicht zu einem Umweg.",
    ],
    architectureDecisions: [
      "Next.js und TypeScript mit einer Route pro Werkzeug, damit jedes fokussiert bleibt und für sich lädt.",
      "Die Farblogik liegt in einer framework-agnostischen Lib auf Basis von colord, klar getrennt von den React-Komponenten.",
      "Vollständig clientseitig über die Canvas-API. Ohne Backend verlassen Bilder den Rechner nie, und das Ganze deployt als statische Dateien.",
    ],
    implementationHighlights: [
      "Pixelgenaues Sampling aus per Drop oder Paste eingefügten Bildern, mit der Farbhistorie im localStorage.",
      "Mehrstufige Gradienten-Komposition und Palettengenerierung, die fertiges CSS zum Kopieren ausgeben.",
      "WCAG-Kontrastprüfungen und Simulation von Farbfehlsichtigkeiten, damit ein Design die Accessibility-Tests schon während der Entstehung durchläuft.",
      "Eine durchstöberbare Bibliothek benannter Farben, Paletten und Markenfarben, dazu eine Theorieseite für die Harmonien.",
    ],
    qualityAndSecurity: [
      "Bilder werden per Canvas auf dem Gerät verarbeitet und nie hochgeladen. Es gibt keinen Upload-Button, den man missbrauchen könnte.",
      "TypeScript im Strict Mode, die Farbmathematik in einer testbaren Library isoliert, mit 23 Testfällen darüber.",
      "Die CI installiert, typprüft und baut bei jedem Push und Pull Request.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Sieben verschiedene Farbwerkzeuge in einer App sind eine Wundertüte, die nur darauf wartet zu passieren.",
        solution:
          "Ein neutrales Galerierahmen-Design, in dem die einzige gesättigte Farbe auf dem Schirm die ist, mit der man arbeitet, plus eine fokussierte Route pro Werkzeug.",
      },
      {
        challenge:
          "Exakte Pixelfarben aus beliebigen Bildern lesen, schnell und vollständig im Browser.",
        solution:
          "Die Canvas-API für clientseitiges Pixel-Sampling, die Umrechnungen an colord in der gemeinsamen Lib übergeben.",
      },
    ],
    hiringSignals: [
      "Accessibility als echtes Feature ausgeliefert: WCAG-Kontrast und Farbsehsimulation stehen direkt neben dem Picker.",
      "Domänenlogik bleibt aus dem UI: die Farbmathematik ist framework-agnostisch und für sich getestet.",
      "Ich habe ein Live-Produkt von der ersten bis zur siebten Route gebracht, ohne dass der Code zum Haufen wurde.",
    ],
    nextIterations: [
      "Paletten und Gradienten in mehr Formaten exportieren: Design Tokens, SVG, Code-Snippets.",
      "Gespeicherte Projekte und teilbare Links für ein Farbset.",
    ],
    tags: ["Next.js", "TypeScript", "Color", "Accessibility"],
    impactHeading: "Wofür dieses Projekt gut ist",
    impactPoints: [
      "Ersetzt eine Handvoll Einzweck-Farbwerkzeuge durch ein schnelles, zusammenhängendes Toolkit.",
      "Macht die zugängliche Farbwahl zur einfachen, weil WCAG- und Farbsehprüfung in Reichweite bleiben.",
      "Hält Bilder privat, weil jede Verarbeitung im Browser passiert.",
    ],
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
    problemStatement:
      "Designers et développeurs finissent par recoudre une pile d'outils couleur mono-usage qui ne partagent jamais d'état, et le vérificateur de contraste est en général l'onglet qu'on oublie d'ouvrir. Spectrum garde tout au même endroit et place le contrôle d'accessibilité à un clic de la couleur qu'on est en train de choisir.",
    objectives: [
      "Prélever des couleurs exactes dans n'importe quelle image, pixel par pixel, entièrement dans le navigateur.",
      "Réunir dégradés, palettes, contraste WCAG et simulation de vision des couleurs dans une seule app.",
      "Faire du contrôle d'accessibilité une partie du choix de la couleur, pas un détour séparé.",
    ],
    architectureDecisions: [
      "Next.js et TypeScript avec une route par outil, pour que chacun reste ciblé et se charge de son côté.",
      "La logique couleur vit dans une lib indépendante du framework, bâtie sur colord, bien à l'écart des composants React.",
      "Entièrement côté client via l'API Canvas. Sans backend, les images ne quittent jamais la machine et le tout se déploie en fichiers statiques.",
    ],
    implementationHighlights: [
      "Un prélèvement au pixel près depuis des images déposées ou collées, avec l'historique des couleurs gardé dans localStorage.",
      "Composition de dégradés multi-arrêts et génération de palettes qui vous rendent du CSS prêt à copier.",
      "Contrôles de contraste WCAG et simulation des déficiences de vision des couleurs, pour qu'un design passe les tests d'accessibilité pendant qu'on le fabrique encore.",
      "Une bibliothèque de couleurs nommées, de palettes et de couleurs de marque à parcourir, plus une page de théorie pour les harmonies.",
    ],
    qualityAndSecurity: [
      "Les images sont traitées sur l'appareil via Canvas et jamais envoyées. Il n'y a aucun bouton d'upload à détourner.",
      "TypeScript en mode strict, avec les maths de la couleur isolées dans une bibliothèque testable et 23 cas de test dessus.",
      "La CI installe, vérifie les types et construit à chaque push et chaque pull request.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Sept outils de couleur distincts dans une seule app, c'est un fourre-tout qui n'attend que d'arriver.",
        solution:
          "Un design de cadre de galerie neutre où la seule couleur saturée à l'écran est celle sur laquelle vous travaillez, et une route ciblée par outil.",
      },
      {
        challenge:
          "Lire les couleurs exactes des pixels d'images quelconques, vite, et entièrement dans le navigateur.",
        solution:
          "L'API Canvas pour l'échantillonnage de pixels côté client, les conversions confiées à colord dans la lib partagée.",
      },
    ],
    hiringSignals: [
      "L'accessibilité livrée comme une vraie fonctionnalité : contraste WCAG et simulation de vision des couleurs se trouvent juste à côté du sélecteur.",
      "La logique métier tenue hors de l'interface : les maths de la couleur sont indépendantes du framework et testées à part.",
      "J'ai mené un produit en ligne de la première à la septième route sans que le code se transforme en tas.",
    ],
    nextIterations: [
      "Exporter palettes et dégradés dans plus de formats : design tokens, SVG, extraits de code.",
      "Des projets sauvegardés et des liens partageables pour un jeu de couleurs.",
    ],
    tags: ["Next.js", "TypeScript", "Color", "Accessibility"],
    impactHeading: "À quoi sert ce projet",
    impactPoints: [
      "Remplace une poignée d'outils couleur mono-usage par une boîte à outils rapide et cohérente.",
      "Rend le choix de couleur accessible plus facile, en gardant les contrôles WCAG et vision des couleurs à portée.",
      "Garde les images privées, puisque tout le traitement se fait dans le navigateur.",
    ],
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
    problemStatement:
      "设计师和开发者最后总要把一堆单一用途的颜色工具拼在一起，它们从不共享状态，而对比度检查器往往是你忘了开的那个标签页。Spectrum 把这些都放在一处，让无障碍检查离你正在挑的那个颜色只有一次点击。",
    objectives: [
      "从任意图片里逐像素取出准确的颜色，全程在浏览器内完成。",
      "把渐变、配色、WCAG 对比度和色觉模拟收进同一个应用。",
      "让无障碍检查成为选色过程的一部分，而不是另跑一趟。",
    ],
    architectureDecisions: [
      "Next.js 加 TypeScript，一个工具一条路由，各自专注、各自加载。",
      "颜色逻辑放在一个与框架无关、基于 colord 的 lib 里，和 React 组件保持距离。",
      "通过 Canvas API 完全在客户端处理。没有后端，图片就不会离开机器，整个项目也能以静态文件部署。",
    ],
    implementationHighlights: [
      "对拖入或粘贴的图片做像素级取色，取过的颜色历史存在 localStorage 里。",
      "多节点渐变的组合与配色生成，直接给你可复制的 CSS。",
      "WCAG 对比度检查与色觉障碍模拟，让一个设计在还在做的时候就跑完无障碍测试。",
      "一个可翻阅的命名色、配色与品牌色库，外加一页讲配色和谐的理论。",
    ],
    qualityAndSecurity: [
      "图片通过 Canvas 在设备上处理，从不上传。这里连一个可被滥用的上传按钮都没有。",
      "TypeScript 严格模式，颜色数学隔离在一个可测试的库里，配 23 个测试用例。",
      "CI 在每次推送和 PR 上安装依赖、检查类型并构建。",
    ],
    challengesAndSolutions: [
      {
        challenge: "七个各不相同的颜色工具塞进一个应用，很容易就变成一个杂物袋。",
        solution: "用中性的「画廊画框」式设计，屏幕上唯一饱和的颜色就是你正在处理的那一个，再给每个工具一条专注的路由。",
      },
      {
        challenge: "要从任意图片里读出准确的像素颜色，还要快，还要全在浏览器里。",
        solution: "用 Canvas API 做客户端像素取样，换算交给共享 lib 里的 colord。",
      },
    ],
    hiringSignals: [
      "无障碍是当成真功能来交付的：WCAG 对比度和色觉模拟就摆在取色器旁边。",
      "领域逻辑不进界面：颜色数学与框架无关，也单独测过。",
      "我把一个线上产品从第一条路由做到第七条，代码没有变成一堆。",
    ],
    nextIterations: [
      "把配色和渐变导出成更多格式：设计变量、SVG、代码片段。",
      "可保存的项目，以及一组配色的可分享链接。",
    ],
    tags: ["Next.js", "TypeScript", "Color", "Accessibility"],
    impactHeading: "这个项目有什么用",
    impactPoints: [
      "用一套快而连贯的工具箱，替掉几个单一用途的颜色工具。",
      "把 WCAG 和色觉检查留在手边，让无障碍的那个选择成为省事的选择。",
      "所有处理都在浏览器里完成，图片因此留在本地。",
    ],
    stats: [
      { value: "7", label: "工具，一个应用" },
      { value: "100%", label: "客户端" },
      { value: "0", label: "上传" },
      { value: "0", label: "后端" },
    ],
  },
};
