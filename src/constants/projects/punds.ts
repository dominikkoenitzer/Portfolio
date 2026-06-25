import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const punds: Record<Language, LocalizedContent> = {
  en: {
    tagline: "A CRT terminal that boots up just to tell you where everything else lives.",
    description:
      "Punds is my single-page hub dressed as a glowing cathode-ray terminal — one place that links out to every project, profile, and site I keep online.",
    overview:
      "I got tired of pasting five different links every time someone asked what I'd built, so I made one page that points to all of them — and then refused to make it boring. Punds is a Serial-Experiments-Lain-flavored CRT terminal: scanlines, screen curvature, glitch, a NAVI-style boot sequence, all hand-written CSS. React, TypeScript, Vite, no UI framework. It's a link page that earns the word \"hub.\"",
    roleSummary: "Designed it, built it, shipped it. Just me.",
    problemStatement:
      "A handful of scattered projects and profiles is annoying to share — you end up reciting URLs. Punds collapses the whole pile into one page that's unmistakably mine and easy to point people at.",
    objectives: [
      "Put every project, profile, and site behind a single shareable link.",
      "Pull off a believable CRT terminal look with nothing but hand-written CSS.",
      "Keep it fast and dependency-light despite all the visual theatrics.",
    ],
    architectureDecisions: [
      "React + TypeScript on Vite, kept deliberately small and self-contained.",
      "No router, no global store, no data layer — state stays local and copy comes from constants.",
      "Every CRT effect is hand-written CSS, not a framework, so the look is entirely mine.",
    ],
    implementationHighlights: [
      "Layered CRT presentation: scanline overlay, screen curvature, and glitch, stacked over the content.",
      "A NAVI-style boot sequence plus a self-contained canvas oscilloscope running on requestAnimationFrame.",
      "Interactive console widgets — a browsable fake filesystem, a hex-to-ASCII decoder, and an idle quote cycler.",
    ],
    qualityAndSecurity: [
      "Strict TypeScript throughout, type-checked on every build.",
      "Static output, no server — there's nothing to attack at runtime.",
      "Responsive by design: a three-column desktop grid that folds into a mobile tab bar.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Selling a convincing CRT without reaching for a UI framework or a pile of libraries.",
        solution:
          "Hand-wrote the scanlines, curvature, and glitch keyframes in CSS and layered them as overlays over the page.",
      },
      {
        challenge:
          "Keeping the canvas oscilloscope sharp across HiDPI screens and resizes.",
        solution:
          "Drew with devicePixelRatio awareness and a ResizeObserver, and waited on the custom font before the first frame.",
      },
    ],
    hiringSignals: [
      "Front-end craft that isn't off the shelf — bespoke CSS effects and a canvas animation built from scratch.",
      "Restraint where it counts: no router, no state library, just local state and constants.",
      "Owned design and build end to end, live at punds.ch.",
    ],
    nextIterations: [
      "A real command-line interpreter for the console instead of a few canned widgets.",
      "More widgets and lore worth poking at.",
      "Tighter motion with proper reduced-motion handling.",
    ],
    tags: ["React", "TypeScript", "Vite", "CRT"],
    impactHeading: "How This Project Creates Impact",
    impactPoints: [
      "Gives everything I build one memorable address.",
      "Shows front-end and visual craft a résumé bullet never could.",
      "Stays fast and lightweight despite the elaborate look.",
    ],
    stats: [
      { value: "1", label: "page" },
      { value: "0", label: "UI frameworks" },
      { value: "0", label: "server" },
      { value: "3", label: "console widgets" },
    ],
  },
  de: {
    tagline: "Ein CRT-Terminal, das nur hochfährt, um dir zu sagen, wo alles andere wohnt.",
    description:
      "Punds ist mein Single-Page-Hub im Gewand eines leuchtenden Kathodenstrahl-Terminals — eine Seite, die zu jedem Projekt, Profil und Site verlinkt, das ich online halte.",
    overview:
      "Ich hatte es satt, fünf verschiedene Links zu kopieren, sobald jemand fragte, was ich gebaut habe — also habe ich eine Seite gemacht, die auf alle zeigt, und mich dann geweigert, sie langweilig zu machen. Punds ist ein CRT-Terminal im Stil von Serial Experiments Lain: Scanlines, Bildschirmwölbung, Glitch, eine NAVI-artige Boot-Sequenz, alles handgeschriebenes CSS. React, TypeScript, Vite, kein UI-Framework. Eine Linkseite, die sich das Wort „Hub“ verdient.",
    roleSummary: "Entworfen, gebaut, veröffentlicht. Nur ich.",
    problemStatement:
      "Eine Handvoll verstreuter Projekte und Profile ist mühsam zu teilen — man rasselt am Ende URLs herunter. Punds fasst den ganzen Haufen auf einer Seite zusammen, die unverkennbar meine und leicht weiterzugeben ist.",
    objectives: [
      "Jedes Projekt, Profil und jede Site hinter einen einzigen teilbaren Link bringen.",
      "Einen glaubwürdigen CRT-Terminal-Look mit nichts als handgeschriebenem CSS hinbekommen.",
      "Trotz aller visuellen Theatralik schnell und abhängigkeitsarm bleiben.",
    ],
    architectureDecisions: [
      "React + TypeScript auf Vite, bewusst klein und in sich geschlossen gehalten.",
      "Kein Router, kein globaler Store, keine Datenschicht — der State bleibt lokal, die Texte kommen aus Konstanten.",
      "Jeder CRT-Effekt ist handgeschriebenes CSS, kein Framework, damit der Look ganz mir gehört.",
    ],
    implementationHighlights: [
      "Mehrschichtige CRT-Darstellung: Scanline-Overlay, Bildschirmwölbung und Glitch, über den Inhalt gestapelt.",
      "Eine NAVI-artige Boot-Sequenz plus ein eigenständiges Canvas-Oszilloskop auf requestAnimationFrame.",
      "Interaktive Konsolen-Widgets — ein durchstöberbares Fake-Dateisystem, ein Hex-zu-ASCII-Decoder und ein Idle-Zitat-Cycler.",
    ],
    qualityAndSecurity: [
      "Striktes TypeScript durchgehend, bei jedem Build typgeprüft.",
      "Statische Ausgabe, kein Server — zur Laufzeit gibt es nichts anzugreifen.",
      "Responsiv von Grund auf: ein dreispaltiges Desktop-Grid, das auf Mobilgeräten zur Tab-Leiste zusammenklappt.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Ein überzeugendes CRT verkaufen, ohne zu einem UI-Framework oder einem Stapel Libraries zu greifen.",
        solution:
          "Scanlines, Wölbung und Glitch-Keyframes von Hand in CSS geschrieben und als Overlays über die Seite gelegt.",
      },
      {
        challenge:
          "Das Canvas-Oszilloskop auf HiDPI-Bildschirmen und bei Größenänderungen scharf halten.",
        solution:
          "Mit devicePixelRatio-Bewusstsein und einem ResizeObserver gezeichnet und vor dem ersten Frame auf die eigene Schrift gewartet.",
      },
    ],
    hiringSignals: [
      "Frontend-Handwerk von der Stange ist es nicht — maßgeschneiderte CSS-Effekte und eine von Grund auf gebaute Canvas-Animation.",
      "Zurückhaltung, wo sie zählt: kein Router, keine State-Library, nur lokaler State und Konstanten.",
      "Design und Build end-to-end verantwortet, live auf punds.ch.",
    ],
    nextIterations: [
      "Ein echter Kommandozeilen-Interpreter für die Konsole statt ein paar fertiger Widgets.",
      "Mehr Widgets und Lore, die das Stöbern lohnen.",
      "Straffere Animationen mit sauberer Reduced-Motion-Behandlung.",
    ],
    tags: ["React", "TypeScript", "Vite", "CRT"],
    impactHeading: "Wie dieses Projekt Wirkung erzeugt",
    impactPoints: [
      "Gibt allem, was ich baue, eine einprägsame Adresse.",
      "Zeigt Frontend- und visuelles Handwerk, wie es ein Lebenslauf-Stichpunkt nie könnte.",
      "Bleibt trotz aufwendigem Look schnell und leichtgewichtig.",
    ],
    stats: [
      { value: "1", label: "Seite" },
      { value: "0", label: "UI-Frameworks" },
      { value: "0", label: "Server" },
      { value: "3", label: "Konsolen-Widgets" },
    ],
  },
  fr: {
    tagline: "Un terminal CRT qui démarre juste pour te dire où vit tout le reste.",
    description:
      "Punds est mon hub mono-page déguisé en terminal à tube cathodique lumineux — une page qui renvoie vers chaque projet, profil et site que je garde en ligne.",
    overview:
      "J'en avais assez de copier cinq liens différents chaque fois qu'on me demandait ce que j'avais construit, alors j'ai fait une page qui pointe vers tous — puis j'ai refusé de la rendre ennuyeuse. Punds est un terminal CRT à la Serial Experiments Lain : lignes de balayage, courbure d'écran, glitch, une séquence de démarrage façon NAVI, le tout en CSS écrit à la main. React, TypeScript, Vite, aucun framework UI. Une page de liens qui mérite le mot « hub ».",
    roleSummary: "Conçu, construit, mis en ligne. Moi, seul.",
    problemStatement:
      "Une poignée de projets et de profils éparpillés est pénible à partager — on finit par réciter des URLs. Punds réunit tout le tas sur une page indéniablement mienne et facile à transmettre.",
    objectives: [
      "Mettre chaque projet, profil et site derrière un seul lien partageable.",
      "Réussir un look terminal CRT crédible avec rien d'autre que du CSS écrit à la main.",
      "Rester rapide et léger en dépendances malgré toute la mise en scène visuelle.",
    ],
    architectureDecisions: [
      "React + TypeScript sur Vite, volontairement réduit et autonome.",
      "Pas de routeur, pas de store global, pas de couche de données — l'état reste local et le texte vient de constantes.",
      "Chaque effet CRT est du CSS écrit à la main, pas un framework, pour que le rendu soit entièrement le mien.",
    ],
    implementationHighlights: [
      "Présentation CRT en couches : superposition de lignes de balayage, courbure d'écran et glitch, empilées sur le contenu.",
      "Une séquence de démarrage façon NAVI plus un oscilloscope sur canvas autonome piloté par requestAnimationFrame.",
      "Des widgets de console interactifs — un faux système de fichiers explorable, un décodeur hex-vers-ASCII et un cycleur de citations en veille.",
    ],
    qualityAndSecurity: [
      "TypeScript strict de bout en bout, vérifié à chaque build.",
      "Sortie statique, aucun serveur — rien à attaquer à l'exécution.",
      "Responsive par conception : une grille de bureau à trois colonnes qui se replie en barre d'onglets sur mobile.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Vendre un CRT crédible sans recourir à un framework UI ni à une pile de bibliothèques.",
        solution:
          "Écrit à la main les lignes de balayage, la courbure et les keyframes de glitch en CSS, posés en superpositions sur la page.",
      },
      {
        challenge:
          "Garder l'oscilloscope sur canvas net sur les écrans HiDPI et lors des redimensionnements.",
        solution:
          "Dessiné en tenant compte de devicePixelRatio avec un ResizeObserver, en attendant la police personnalisée avant la première image.",
      },
    ],
    hiringSignals: [
      "Du savoir-faire front-end qui ne sort pas d'une étagère — effets CSS sur mesure et animation sur canvas construite de zéro.",
      "De la retenue là où ça compte : pas de routeur, pas de bibliothèque d'état, juste de l'état local et des constantes.",
      "Design et build maîtrisés de bout en bout, en ligne sur punds.ch.",
    ],
    nextIterations: [
      "Un vrai interpréteur en ligne de commande pour la console plutôt que quelques widgets prêts à l'emploi.",
      "Davantage de widgets et de lore qui valent qu'on fouille.",
      "Des animations plus serrées avec une vraie prise en charge du mouvement réduit.",
    ],
    tags: ["React", "TypeScript", "Vite", "CRT"],
    impactHeading: "Comment ce projet crée de l'impact",
    impactPoints: [
      "Donne à tout ce que je construis une adresse mémorable.",
      "Montre un savoir-faire front-end et visuel comme un point de CV ne le pourrait jamais.",
      "Reste rapide et léger malgré un look élaboré.",
    ],
    stats: [
      { value: "1", label: "page" },
      { value: "0", label: "frameworks UI" },
      { value: "0", label: "serveur" },
      { value: "3", label: "widgets console" },
    ],
  },
  zh: {
    tagline: "一台 CRT 终端，开机的唯一目的，就是告诉你其他一切都住在哪里。",
    description:
      "Punds 是我的单页中枢，伪装成一台发光的阴极射线终端——一个页面，链接到我在线维护的每一个项目、主页与站点。",
    overview:
      "每次有人问我做过什么，我都得复制五个不同的链接，实在受够了，于是我做了一个指向全部的页面——然后拒绝让它变得无聊。Punds 是一台《玲音》（Serial Experiments Lain）风格的 CRT 终端：扫描线、屏幕弯曲、故障效果、NAVI 风格的开机序列，全部由手写 CSS 完成。React、TypeScript、Vite，没有 UI 框架。一个配得上「中枢」二字的链接页。",
    roleSummary: "设计、构建、上线。只有我一个人。",
    problemStatement:
      "一堆零散的项目和主页很难分享——最后你只能逐个念出网址。Punds 把这一整堆收拢到一个页面里，明确属于我，且易于转发。",
    objectives: [
      "把每个项目、主页与站点都放到一个可分享的链接背后。",
      "只用手写 CSS 就实现一个令人信服的 CRT 终端外观。",
      "尽管视觉花活繁多，仍保持快速且依赖精简。",
    ],
    architectureDecisions: [
      "在 Vite 上使用 React + TypeScript，刻意保持小巧且自成一体。",
      "无路由、无全局状态、无数据层——状态保持本地，文案来自常量。",
      "每一个 CRT 效果都是手写 CSS，而非框架，让外观完全属于我自己。",
    ],
    implementationHighlights: [
      "分层的 CRT 呈现：扫描线叠加、屏幕弯曲与故障效果，层叠在内容之上。",
      "NAVI 风格的开机序列，外加一个由 requestAnimationFrame 驱动的自包含 canvas 示波器。",
      "交互式控制台小组件——可浏览的伪文件系统、十六进制转 ASCII 解码器，以及空闲引言轮播。",
    ],
    qualityAndSecurity: [
      "全程严格的 TypeScript，每次构建都做类型检查。",
      "纯静态产物，没有服务端——运行时没有可攻击面。",
      "天生响应式：桌面端为三列网格，在移动端折叠为标签栏。",
    ],
    challengesAndSolutions: [
      {
        challenge: "在不依赖 UI 框架或一堆库的情况下，呈现可信的 CRT 外观。",
        solution: "用 CSS 手写扫描线、弯曲与故障关键帧，并作为叠加层覆盖在页面之上。",
      },
      {
        challenge: "在 HiDPI 屏幕与尺寸变化时保持 canvas 示波器清晰。",
        solution: "考虑 devicePixelRatio 进行绘制并使用 ResizeObserver，在首帧前等待自定义字体加载完成。",
      },
    ],
    hiringSignals: [
      "并非现成可取的前端工艺——定制的 CSS 效果与从零构建的 canvas 动画。",
      "在关键处的克制：无路由、无状态库，只有本地状态与常量。",
      "对设计与构建的端到端主导，已在 punds.ch 上线。",
    ],
    nextIterations: [
      "为控制台做一个真正的命令行解释器，而不只是几个预设小组件。",
      "更多值得把玩的小组件与设定内容。",
      "更紧凑的动效，以及妥善的减少动态处理。",
    ],
    tags: ["React", "TypeScript", "Vite", "CRT"],
    impactHeading: "本项目如何创造价值",
    impactPoints: [
      "为我所构建的一切提供一个令人难忘的地址。",
      "以简历条目永远做不到的方式展示前端与视觉工艺。",
      "尽管外观繁复，仍保持快速与轻量。",
    ],
    stats: [
      { value: "1", label: "页面" },
      { value: "0", label: "UI 框架" },
      { value: "0", label: "服务端" },
      { value: "3", label: "控制台组件" },
    ],
  },
};
