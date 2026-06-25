import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const spectrum: Record<Language, LocalizedContent> = {
  en: {
    tagline: "Five color tools that finally live under one roof — and never phone home.",
    description:
      "Spectrum is a client-side color toolkit: pull exact colors from an image, build gradients and palettes, check WCAG contrast, and simulate color blindness. All in the browser, nothing uploaded.",
    overview:
      "I built Spectrum because picking a color shouldn't mean keeping five browser tabs open, each doing one trick and none of them talking. So I put sampling, gradients, palettes, contrast, and color-blindness simulation in one place, in Next.js and TypeScript. Everything runs client-side through the Canvas API — your images are read on your machine and never leave it. No backend to trust, because there isn't one.",
    roleSummary: "Designed it, built it, shipped it. Just me — UX, Next.js build, and the color math.",
    problemStatement:
      "Designers and developers stitch together a pile of single-purpose color tools that never share state, and accessibility is usually the tab you forget to open. Spectrum keeps sampling, gradients, palettes, contrast, and CVD checks together — with accessibility treated as part of choosing a color, not a chore bolted on after.",
    objectives: [
      "Sample exact colors from any image, pixel by pixel, entirely in the browser.",
      "Fold gradients, palettes, WCAG contrast, and color-blindness simulation into one coherent flow.",
      "Make accessibility checks part of picking a color, not a separate detour.",
    ],
    architectureDecisions: [
      "Next.js + TypeScript with one route per tool, so each feature stays focused and loads on its own.",
      "Color logic lives in its own framework-agnostic lib (built on colord), kept well clear of the React UI.",
      "Fully client-side via the Canvas API — no backend means images stay private and the whole thing deploys as static files.",
    ],
    implementationHighlights: [
      "Pixel-accurate sampling from dropped or pasted images, with a color history kept in localStorage.",
      "Multi-stop gradient composition and palette generation that hand you copy-ready CSS.",
      "WCAG contrast checks and color-blindness simulation that put a design through real accessibility tests.",
    ],
    qualityAndSecurity: [
      "Private by design: images are processed on-device via Canvas and never uploaded — no upload button to misuse.",
      "TypeScript in strict mode, with the color math isolated in a testable, framework-agnostic library.",
      "WCAG-aware tooling is built in, so accessible color choices are the default path, not extra credit.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Putting five distinct color tools in one app without it turning into a cluttered grab-bag.",
        solution:
          "A neutral gallery-frame design where the only saturated color on screen is the one you're working with, plus one focused route per tool.",
      },
      {
        challenge:
          "Reading exact pixel colors from arbitrary images, fast and entirely in the browser.",
        solution:
          "Canvas API for client-side pixel sampling, with conversions handed off to a dedicated color library.",
      },
    ],
    hiringSignals: [
      "Ships accessibility (WCAG contrast, color-blindness simulation) as a real feature, not a checkbox.",
      "Separates domain logic from UI — framework-agnostic color math kept apart from React.",
      "Full Next.js/TypeScript ownership of a live, shipped product.",
    ],
    nextIterations: [
      "Export palettes and gradients in more formats — design tokens, SVG, code snippets.",
      "Saved projects and shareable links for color sets.",
      "Automated tests around the color-conversion and contrast logic.",
    ],
    tags: ["Next.js", "TypeScript", "Color", "Accessibility"],
    impactHeading: "How This Project Creates Impact",
    impactPoints: [
      "Replaces a handful of single-purpose color tools with one fast, cohesive toolkit.",
      "Makes accessible color choices the easy path by building WCAG and color-blindness checks right in.",
      "Keeps user images private by doing every bit of processing in the browser.",
    ],
    stats: [
      { value: "5", label: "tools, one app" },
      { value: "100%", label: "client-side" },
      { value: "0", label: "uploads" },
      { value: "0", label: "backend" },
    ],
  },
  de: {
    tagline: "Fünf Farb-Tools endlich unter einem Dach — und keines telefoniert nach Hause.",
    description:
      "Spectrum ist ein client-seitiges Farb-Toolkit: exakte Farben aus einem Bild ziehen, Gradienten und Paletten bauen, WCAG-Kontrast prüfen und Farbenblindheit simulieren. Alles im Browser, nichts wird hochgeladen.",
    overview:
      "Ich habe Spectrum gebaut, weil eine Farbe auszuwählen nicht bedeuten sollte, fünf Browser-Tabs offen zu halten, von denen jeder einen Trick beherrscht und keiner mit dem anderen redet. Also habe ich Sampling, Gradienten, Paletten, Kontrast und Farbenblindheits-Simulation an einen Ort gebracht — in Next.js und TypeScript. Alles läuft client-seitig über die Canvas-API: deine Bilder werden auf deinem Gerät gelesen und verlassen es nie. Kein Backend, dem man vertrauen müsste — weil es keines gibt.",
    roleSummary: "Entworfen, gebaut, ausgeliefert. Nur ich — UX, Next.js-Build und die Farb-Mathematik.",
    problemStatement:
      "Designer und Entwickler flicken sich einen Stapel Einzweck-Farbtools zusammen, die nie denselben Zustand teilen, und Barrierefreiheit ist meist der Tab, den man zu öffnen vergisst. Spectrum hält Sampling, Gradienten, Paletten, Kontrast und CVD-Checks zusammen — und behandelt Barrierefreiheit als Teil der Farbwahl, nicht als nachträglich angeschraubte Pflichtübung.",
    objectives: [
      "Exakte Farben aus jedem Bild pixelgenau aufnehmen, vollständig im Browser.",
      "Gradienten, Paletten, WCAG-Kontrast und Farbenblindheits-Simulation in einen zusammenhängenden Flow falten.",
      "Barrierefreiheits-Checks zum Teil der Farbwahl machen, nicht zu einem separaten Umweg.",
    ],
    architectureDecisions: [
      "Next.js + TypeScript mit einer Route pro Tool, damit jede Funktion fokussiert bleibt und für sich lädt.",
      "Die Farb-Logik lebt in einer eigenen, framework-unabhängigen Lib (auf colord aufgebaut), weit weg von der React-UI.",
      "Vollständig client-seitig über die Canvas-API — kein Backend heißt: Bilder bleiben privat und das Ganze deployt als statische Dateien.",
    ],
    implementationHighlights: [
      "Pixelgenaues Sampling aus abgelegten oder eingefügten Bildern, mit einer Farbhistorie im localStorage.",
      "Komposition von Multi-Stop-Gradienten und Paletten-Generierung, die dir kopierfertiges CSS in die Hand geben.",
      "WCAG-Kontrastprüfung und Farbenblindheits-Simulation, die ein Design durch echte Barrierefreiheits-Tests schicken.",
    ],
    qualityAndSecurity: [
      "Privat by Design: Bilder werden auf dem Gerät über Canvas verarbeitet und nie hochgeladen — es gibt schlicht keinen Upload-Button zum Missbrauchen.",
      "TypeScript im Strict-Modus, mit der Farb-Mathematik isoliert in einer testbaren, framework-unabhängigen Bibliothek.",
      "WCAG-bewusstes Tooling ist fest eingebaut, sodass barrierefreie Farbentscheidungen der Standardweg sind, nicht die Kür.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Fünf unterschiedliche Farbtools in eine App packen, ohne dass daraus eine überladene Wundertüte wird.",
        solution:
          "Ein neutrales Galerie-Rahmen-Design, bei dem die einzige gesättigte Farbe auf dem Bildschirm jene ist, mit der du gerade arbeitest, plus eine fokussierte Route pro Tool.",
      },
      {
        challenge:
          "Exakte Pixel-Farben aus beliebigen Bildern auslesen, schnell und vollständig im Browser.",
        solution:
          "Canvas-API fürs client-seitige Pixel-Sampling, die Konvertierung übernimmt eine dedizierte Farb-Bibliothek.",
      },
    ],
    hiringSignals: [
      "Liefert Barrierefreiheit (WCAG-Kontrast, Farbenblindheits-Simulation) als echtes Feature, nicht als Häkchen.",
      "Trennt Domänen-Logik von der UI — framework-unabhängige Farb-Mathematik getrennt von React.",
      "Vollständige Next.js/TypeScript-Ownership eines live ausgelieferten Produkts.",
    ],
    nextIterations: [
      "Paletten und Gradienten in mehr Formaten exportieren — Design-Tokens, SVG, Code-Snippets.",
      "Gespeicherte Projekte und teilbare Links für Farbsets.",
      "Automatisierte Tests rund um die Farbkonvertierungs- und Kontrast-Logik.",
    ],
    tags: ["Next.js", "TypeScript", "Color", "Barrierefreiheit"],
    impactHeading: "Wie dieses Projekt Wirkung erzeugt",
    impactPoints: [
      "Ersetzt eine Handvoll Einzweck-Farbtools durch ein schnelles, zusammenhängendes Toolkit.",
      "Macht barrierefreie Farbentscheidungen zum einfachen Weg, indem WCAG- und Farbenblindheits-Checks direkt eingebaut sind.",
      "Hält die Bilder der Nutzer privat, indem jedes bisschen Verarbeitung im Browser passiert.",
    ],
    stats: [
      { value: "5", label: "Tools, eine App" },
      { value: "100%", label: "client-seitig" },
      { value: "0", label: "Uploads" },
      { value: "0", label: "Backend" },
    ],
  },
  fr: {
    tagline: "Cinq outils couleur enfin sous le même toit — et aucun ne fait remonter vos données.",
    description:
      "Spectrum est une boîte à outils couleur côté client : prélever des couleurs exactes sur une image, construire dégradés et palettes, vérifier le contraste WCAG et simuler le daltonisme. Le tout dans le navigateur, rien n'est téléversé.",
    overview:
      "J'ai construit Spectrum parce que choisir une couleur ne devrait pas obliger à garder cinq onglets ouverts, chacun faisant un seul tour et aucun ne se parlant. J'ai donc réuni échantillonnage, dégradés, palettes, contraste et simulation du daltonisme au même endroit, en Next.js et TypeScript. Tout s'exécute côté client via l'API Canvas : vos images sont lues sur votre machine et n'en sortent jamais. Aucun backend à qui faire confiance — parce qu'il n'y en a pas.",
    roleSummary: "Conçu, construit, livré. Moi seul — l'UX, le build Next.js et les calculs de couleur.",
    problemStatement:
      "Designers et développeurs assemblent une pile d'outils couleur à usage unique qui ne partagent jamais d'état, et l'accessibilité est souvent l'onglet qu'on oublie d'ouvrir. Spectrum garde ensemble échantillonnage, dégradés, palettes, contraste et tests de daltonisme — en traitant l'accessibilité comme une partie du choix de la couleur, pas comme une corvée ajoutée après coup.",
    objectives: [
      "Échantillonner des couleurs exactes depuis n'importe quelle image, pixel par pixel, entièrement dans le navigateur.",
      "Replier dégradés, palettes, contraste WCAG et simulation du daltonisme en un flux cohérent.",
      "Faire des vérifications d'accessibilité une partie du choix des couleurs, pas un détour à part.",
    ],
    architectureDecisions: [
      "Next.js + TypeScript avec une route par outil, pour que chaque fonctionnalité reste ciblée et se charge seule.",
      "La logique couleur vit dans sa propre lib indépendante du framework (bâtie sur colord), bien à l'écart de l'UI React.",
      "Entièrement côté client via l'API Canvas — pas de backend signifie que les images restent privées et que le tout se déploie en fichiers statiques.",
    ],
    implementationHighlights: [
      "Échantillonnage au pixel près depuis des images déposées ou collées, avec un historique des couleurs dans le localStorage.",
      "Composition de dégradés multi-arrêts et génération de palettes qui vous remettent un CSS prêt à copier.",
      "Vérifications de contraste WCAG et simulation du daltonisme qui font passer un design par de vrais tests d'accessibilité.",
    ],
    qualityAndSecurity: [
      "Privé par conception : les images sont traitées sur l'appareil via Canvas et jamais téléversées — il n'y a tout simplement aucun bouton d'envoi à détourner.",
      "TypeScript en mode strict, avec les calculs de couleur isolés dans une bibliothèque testable et indépendante du framework.",
      "Un outillage soucieux de WCAG est intégré, pour que les choix de couleur accessibles soient le chemin par défaut, pas le bonus.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Mettre cinq outils couleur distincts dans une seule app sans qu'elle vire au fourre-tout encombré.",
        solution:
          "Un design en cadre de galerie neutre où la seule couleur saturée à l'écran est celle sur laquelle vous travaillez, plus une route ciblée par outil.",
      },
      {
        challenge:
          "Lire des couleurs de pixels exactes depuis des images arbitraires, vite et entièrement dans le navigateur.",
        solution:
          "API Canvas pour l'échantillonnage de pixels côté client, les conversions étant confiées à une bibliothèque couleur dédiée.",
      },
    ],
    hiringSignals: [
      "Livre l'accessibilité (contraste WCAG, simulation du daltonisme) comme une vraie fonctionnalité, pas une case à cocher.",
      "Sépare la logique métier de l'UI — calculs de couleur indépendants du framework, gardés à part de React.",
      "Ownership Next.js/TypeScript complète d'un produit livré et en ligne.",
    ],
    nextIterations: [
      "Exporter palettes et dégradés dans plus de formats — design tokens, SVG, extraits de code.",
      "Projets enregistrés et liens partageables pour les jeux de couleurs.",
      "Tests automatisés autour de la logique de conversion de couleur et de contraste.",
    ],
    tags: ["Next.js", "TypeScript", "Color", "Accessibilité"],
    impactHeading: "Comment ce projet crée de l'impact",
    impactPoints: [
      "Remplace une poignée d'outils couleur à usage unique par une boîte à outils rapide et cohérente.",
      "Fait des choix de couleur accessibles le chemin facile en intégrant directement les vérifications WCAG et daltonisme.",
      "Garde les images des utilisateurs privées en traitant le moindre calcul dans le navigateur.",
    ],
    stats: [
      { value: "5", label: "outils, une app" },
      { value: "100%", label: "côté client" },
      { value: "0", label: "téléversement" },
      { value: "0", label: "backend" },
    ],
  },
  zh: {
    tagline: "五个颜色工具终于聚到一处——而且没有一个会向外发送数据。",
    description:
      "Spectrum 是一个完全在客户端运行的颜色工具集：从图片中取出精确的颜色、构建渐变与调色板、检查 WCAG 对比度并模拟色盲。一切都在浏览器中完成，什么都不上传。",
    overview:
      "我做 Spectrum，是因为选一个颜色不应该意味着同时开着五个浏览器标签页——每个只会一招，彼此谁也不搭理谁。于是我用 Next.js 和 TypeScript，把取色、渐变、调色板、对比度和色盲模拟放到了同一处。一切都通过 Canvas API 在客户端运行：你的图片在你自己的机器上被读取，绝不离开。没有需要去信任的后端——因为压根就没有后端。",
    roleSummary: "我设计、构建、上线，全程一个人——UX、Next.js 构建，以及颜色运算。",
    problemStatement:
      "设计师和开发者把一堆从不共享状态的单一用途颜色工具拼凑在一起，而无障碍往往是那个忘了打开的标签页。Spectrum 把取色、渐变、调色板、对比度和色觉缺陷检查放在一起——并把无障碍当作选色过程的一部分，而不是事后硬加上去的一道杂活。",
    objectives: [
      "完全在浏览器中，从任意图片中逐像素取出精确的颜色。",
      "把渐变、调色板、WCAG 对比度与色盲模拟收拢进一个连贯的流程。",
      "让无障碍检查成为选色的一部分，而不是另外绕的一段路。",
    ],
    architectureDecisions: [
      "Next.js + TypeScript，每个工具对应一个路由，让每项功能保持专注、各自加载。",
      "颜色逻辑放在自己的、与框架无关的 lib 中（基于 colord），与 React UI 远远分开。",
      "通过 Canvas API 完全在客户端运行——没有后端意味着图片保持私密，整个应用以静态文件部署。",
    ],
    implementationHighlights: [
      "从拖入或粘贴的图片中进行像素级精确取色，并在 localStorage 中保存取色历史。",
      "多色标渐变的组合与调色板生成，直接交给你可复制的 CSS。",
      "WCAG 对比度检查与色盲模拟，让设计经受真实的无障碍测试。",
    ],
    qualityAndSecurity: [
      "隐私优先的设计：图片在设备本地通过 Canvas 处理，绝不上传——根本就没有可被滥用的上传按钮。",
      "严格模式的 TypeScript，颜色运算被隔离在可测试、与框架无关的库中。",
      "内建关注 WCAG 的工具，让无障碍的颜色选择成为默认路径，而非额外加分项。",
    ],
    challengesAndSolutions: [
      {
        challenge: "在把五个不同颜色工具放进同一个应用的同时，不让它变成杂乱无章的大杂烩。",
        solution:
          "采用中性的画廊画框式设计，屏幕上唯一的饱和色就是你正在处理的那种颜色，并为每个工具设置一个专注的路由。",
      },
      {
        challenge: "快速且完全在浏览器中，从任意图片读取精确的像素颜色。",
        solution: "用 Canvas API 进行客户端像素取色，颜色转换则交由专用的颜色库处理。",
      },
    ],
    hiringSignals: [
      "将无障碍（WCAG 对比度、色盲模拟）作为真正的功能交付，而非走过场。",
      "将领域逻辑与 UI 分离——与框架无关的颜色运算与 React 保持分开。",
      "对一个已上线的产品拥有完整的 Next.js/TypeScript 主导能力。",
    ],
    nextIterations: [
      "以更多格式导出调色板与渐变——设计令牌、SVG、代码片段。",
      "保存项目并为颜色集生成可分享的链接。",
      "围绕颜色转换与对比度逻辑的自动化测试。",
    ],
    tags: ["Next.js", "TypeScript", "Color", "无障碍"],
    impactHeading: "本项目如何创造价值",
    impactPoints: [
      "用一个快速、连贯的工具集，取代一堆单一用途的颜色工具。",
      "通过内建 WCAG 与色盲检查，让无障碍的颜色选择成为更容易走的那条路。",
      "把每一点处理都放在浏览器里完成，保护用户图片的私密性。",
    ],
    stats: [
      { value: "5", label: "工具，一个应用" },
      { value: "100%", label: "客户端" },
      { value: "0", label: "上传" },
      { value: "0", label: "后端" },
    ],
  },
};
