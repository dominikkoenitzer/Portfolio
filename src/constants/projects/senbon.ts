import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const senbon: Record<Language, LocalizedContent> = {
  en: {
    tagline: "A digital garden that refuses to be found on Google. On purpose.",
    description:
      "Senbon is my zen-themed journal where every entry is a plain markdown file, rendered into an unhurried reading experience. No CMS, no trackers, no SEO theatrics.",
    overview:
      "I built Senbon (千本, 'one thousand') because I wanted somewhere to write that wasn't optimized to death. Every entry is a markdown file with frontmatter — no database, no CMS, no third party watching the reader. Next.js App Router and React 19 turn those files into an editorial reading experience: auto-generated table of contents, reading-time estimates, a ⌘K command palette. And robots.ts politely tells search engines and AI crawlers to leave. It's a blog that doesn't want an audience, which is the whole point.",
    roleSummary: "Designed it, built it, shipped it. Just me.",
    problemStatement:
      "Every blogging tool optimizes for reach — SEO, feeds, engagement graphs. I wanted the opposite: a private, hand-tended place to think and write, fast and accessible, and deliberately kept out of the public index.",
    objectives: [
      "Publish long-form entries straight from markdown files — no CMS, no third-party tracking.",
      "Make reading feel unhurried, like the page actually respects your attention.",
      "Build atmosphere with motion and typography without slowing the page or breaking accessibility.",
    ],
    architectureDecisions: [
      "Next.js App Router with React Server Components, reading entries from markdown on the filesystem instead of a database — the files are the database.",
      "react-markdown with remark-gfm and rehype-highlight for rendering, and the table of contents built straight from the headings.",
      "Framer Motion only for entrance animations, with prefers-reduced-motion respected throughout — calm shouldn't cost anyone a migraine.",
    ],
    implementationHighlights: [
      "A markdown pipeline: frontmatter-driven entries with search across titles, excerpts and tags, tag filtering, and load-more pagination.",
      "A reading experience with auto-generated TOC, a reading-progress hairline, reading-time estimates, prev/next navigation, and copy buttons on every code block.",
      "A ⌘/Ctrl + K command palette and an ambient aurora-and-river background drawn entirely in CSS and SVG.",
    ],
    qualityAndSecurity: [
      "Privacy-first by design: robots.ts turns away search engines and AI crawlers, backed by noindex headers and zero OG or structured-data metadata.",
      "First-party Vercel Analytics only — no third-party tracker ever touches the reader.",
      "Accessibility taken seriously: skip-to-content link, per-route scroll restoration, themed error boundaries, and motion that honors user preferences.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Making the page feel rich and atmospheric without bloating it or wrecking accessibility.",
        solution:
          "One ambient CSS/SVG background and motion gated behind prefers-reduced-motion. Atmospheric for those who want it, invisible for those who don't.",
      },
      {
        challenge:
          "Letting markdown drive everything while keeping the reading experience polished.",
        solution:
          "A frontmatter convention plus a generated TOC and graceful fallbacks, so a missing hero image or field degrades silently instead of exploding.",
      },
    ],
    hiringSignals: [
      "Modern Next.js — App Router and React Server Components — in a shipped, live product, not a tutorial.",
      "An eye for craft: typography, motion and reading ergonomics treated as engineering, not decoration.",
      "Full ownership of a markdown content pipeline, from frontmatter to rendered entry.",
    ],
    nextIterations: [
      "Re-tend the guestbook backend so visitors can sign it again.",
      "Richer entry tooling — series, cross-links, and a related-entries surface.",
      "An offline-friendly reading mode for saved entries.",
    ],
    tags: ["Next.js", "React 19", "Markdown", "Digital Garden"],
    impactHeading: "How This Project Creates Impact",
    impactPoints: [
      "Offers a calm, distraction-free place to read long-form writing.",
      "Proves a content site can be fast and accessible without surveillance or SEO theatrics.",
      "Turns plain markdown into a polished, editorial reading experience.",
    ],
    stats: [
      { value: "0", label: "trackers" },
      { value: "100%", label: "markdown" },
      { value: "⌘K", label: "command palette" },
      { value: "noindex", label: "on purpose" },
    ],
  },
  de: {
    tagline: "Ein Digital Garden, der absichtlich nicht bei Google auftaucht.",
    description:
      "Senbon ist mein zen-inspiriertes Journal, in dem jeder Eintrag eine schlichte Markdown-Datei ist — gerendert in ein unaufgeregtes Leseerlebnis. Kein CMS, keine Tracker, kein SEO-Theater.",
    overview:
      "Ich habe Senbon (千本, „eintausend“) gebaut, weil ich einen Ort zum Schreiben wollte, der nicht zu Tode optimiert ist. Jeder Eintrag ist eine Markdown-Datei mit Frontmatter — keine Datenbank, kein CMS, niemand Drittes, der den Leser beobachtet. Next.js App Router und React 19 machen aus diesen Dateien ein redaktionelles Leseerlebnis: automatisch erzeugtes Inhaltsverzeichnis, Lesezeit-Schätzungen, eine ⌘K-Befehlspalette. Und robots.ts bittet Suchmaschinen und KI-Crawler höflich, draußen zu bleiben. Ein Blog, der kein Publikum will — genau das ist der Sinn.",
    roleSummary: "Entworfen, gebaut, ausgeliefert. Nur ich.",
    problemStatement:
      "Jedes Blogging-Tool optimiert auf Reichweite — SEO, Feeds, Engagement-Kurven. Ich wollte das Gegenteil: einen privaten, von Hand gepflegten Ort zum Denken und Schreiben, schnell und barrierefrei, und bewusst aus dem öffentlichen Index herausgehalten.",
    objectives: [
      "Langform-Einträge direkt aus Markdown-Dateien veröffentlichen — kein CMS, kein Drittanbieter-Tracking.",
      "Lesen unaufgeregt anfühlen lassen, als würde die Seite die Aufmerksamkeit der Lesenden tatsächlich respektieren.",
      "Atmosphäre mit Bewegung und Typografie erzeugen, ohne die Seite zu bremsen oder die Barrierefreiheit zu brechen.",
    ],
    architectureDecisions: [
      "Next.js App Router mit React Server Components, der Einträge aus Markdown im Dateisystem statt aus einer Datenbank liest — die Dateien sind die Datenbank.",
      "react-markdown mit remark-gfm und rehype-highlight fürs Rendering, das Inhaltsverzeichnis direkt aus den Überschriften gebaut.",
      "Framer Motion nur für Entrance-Animationen, durchgängig unter Beachtung von prefers-reduced-motion — Ruhe darf niemandem Kopfschmerzen kosten.",
    ],
    implementationHighlights: [
      "Eine Markdown-Pipeline: Frontmatter-getriebene Einträge mit Suche über Titel, Auszüge und Tags, Tag-Filterung und Load-More-Pagination.",
      "Ein Leseerlebnis mit automatischem Inhaltsverzeichnis, Lesefortschritts-Linie, Lesezeit-Schätzungen, Vor-/Zurück-Navigation und Kopier-Buttons an jedem Code-Block.",
      "Eine ⌘/Strg + K-Befehlspalette und ein ruhiger Aurora-und-Fluss-Hintergrund, vollständig in CSS und SVG gezeichnet.",
    ],
    qualityAndSecurity: [
      "Privacy-first von Grund auf: robots.ts weist Suchmaschinen und KI-Crawler ab, gestützt von noindex-Headern und null OG- oder strukturierten Metadaten.",
      "Ausschließlich First-Party-Vercel-Analytics — kein Drittanbieter-Tracker erreicht jemals den Leser.",
      "Barrierefreiheit ernst genommen: Skip-to-Content-Link, Scroll-Wiederherstellung pro Route, thematisierte Error Boundaries und Bewegung, die Nutzerpräferenzen achtet.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Die Seite reichhaltig und atmosphärisch wirken lassen, ohne sie aufzublähen oder die Barrierefreiheit zu ruinieren.",
        solution:
          "Ein einziger ruhiger CSS/SVG-Hintergrund und Bewegung hinter prefers-reduced-motion. Atmosphärisch für die, die es wollen, unsichtbar für die anderen.",
      },
      {
        challenge:
          "Alles von Markdown steuern lassen und das Leseerlebnis trotzdem poliert halten.",
        solution:
          "Eine Frontmatter-Konvention plus generiertes Inhaltsverzeichnis und sanfte Fallbacks, sodass ein fehlendes Hero-Bild oder Feld lautlos degradiert statt zu zerbrechen.",
      },
    ],
    hiringSignals: [
      "Modernes Next.js — App Router und React Server Components — in einem ausgelieferten, live laufenden Produkt, nicht in einem Tutorial.",
      "Ein Auge fürs Handwerk: Typografie, Bewegung und Lese-Ergonomie als Engineering behandelt, nicht als Deko.",
      "Vollständige Ownership einer Markdown-Content-Pipeline, vom Frontmatter bis zum gerenderten Eintrag.",
    ],
    nextIterations: [
      "Das Gästebuch-Backend wieder in Stand setzen, damit Besucher erneut signieren können.",
      "Reichhaltigeres Eintrags-Tooling — Serien, Querverweise und eine Fläche für verwandte Einträge.",
      "Ein offline-fähiger Lesemodus für gespeicherte Einträge.",
    ],
    tags: ["Next.js", "React 19", "Markdown", "Digital Garden"],
    impactHeading: "Wie dieses Projekt Wirkung erzeugt",
    impactPoints: [
      "Bietet einen ruhigen, ablenkungsfreien Ort zum Lesen von Langform-Texten.",
      "Zeigt, dass eine Content-Seite schnell und barrierefrei sein kann, ohne Überwachung oder SEO-Theater.",
      "Verwandelt schlichtes Markdown in ein poliertes, redaktionelles Leseerlebnis.",
    ],
    stats: [
      { value: "0", label: "Tracker" },
      { value: "100%", label: "Markdown" },
      { value: "⌘K", label: "Befehlspalette" },
      { value: "noindex", label: "mit Absicht" },
    ],
  },
  fr: {
    tagline: "Un jardin numérique introuvable sur Google. Volontairement.",
    description:
      "Senbon est mon journal d'inspiration zen, où chaque entrée est un simple fichier markdown, rendu dans une expérience de lecture sans hâte. Sans CMS, sans traceurs, sans artifices SEO.",
    overview:
      "J'ai construit Senbon (千本, « mille ») parce que je voulais un endroit pour écrire qui ne soit pas optimisé à mort. Chaque entrée est un fichier markdown avec frontmatter — pas de base de données, pas de CMS, personne d'extérieur qui observe le lecteur. Next.js App Router et React 19 transforment ces fichiers en une expérience de lecture éditoriale : table des matières auto-générée, estimations du temps de lecture, une palette de commandes ⌘K. Et robots.ts demande poliment aux moteurs de recherche et aux robots d'IA de rester dehors. Un blog qui ne veut pas d'audience — c'est tout l'intérêt.",
    roleSummary: "Conçu, construit, livré. Moi seul.",
    problemStatement:
      "Chaque outil de blog optimise la portée — SEO, flux, courbes d'engagement. Je voulais l'inverse : un espace privé et entretenu à la main pour penser et écrire, rapide et accessible, et délibérément tenu à l'écart de l'index public.",
    objectives: [
      "Publier des entrées longues directement depuis des fichiers markdown — sans CMS, sans traçage tiers.",
      "Rendre la lecture posée, comme si la page respectait vraiment l'attention du lecteur.",
      "Construire une atmosphère par le mouvement et la typographie, sans ralentir la page ni casser l'accessibilité.",
    ],
    architectureDecisions: [
      "Next.js App Router avec React Server Components, lisant les entrées depuis le markdown du système de fichiers plutôt qu'une base de données — les fichiers sont la base de données.",
      "react-markdown avec remark-gfm et rehype-highlight pour le rendu, la table des matières étant construite directement à partir des titres.",
      "Framer Motion uniquement pour les animations d'entrée, avec prefers-reduced-motion respecté de bout en bout — le calme ne devrait donner de migraine à personne.",
    ],
    implementationHighlights: [
      "Un pipeline markdown : des entrées pilotées par le frontmatter avec recherche sur les titres, extraits et tags, filtrage par tag et pagination « voir plus ».",
      "Une expérience de lecture avec table des matières auto-générée, ligne de progression de lecture, estimations du temps de lecture, navigation précédent/suivant et boutons de copie sur chaque bloc de code.",
      "Une palette de commandes ⌘/Ctrl + K et un arrière-plan ambiant d'aurore et de rivière, entièrement dessiné en CSS et SVG.",
    ],
    qualityAndSecurity: [
      "Confidentialité d'abord, dès la conception : robots.ts éconduit les moteurs de recherche et les robots d'IA, appuyé par des en-têtes noindex et zéro métadonnée OG ou structurée.",
      "Uniquement Vercel Analytics en première partie — aucun traceur tiers n'atteint jamais le lecteur.",
      "Accessibilité prise au sérieux : lien d'évitement vers le contenu, restauration du défilement par route, error boundaries thématisées et un mouvement qui respecte les préférences de l'utilisateur.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Rendre la page riche et atmosphérique sans l'alourdir ni ruiner l'accessibilité.",
        solution:
          "Un seul arrière-plan CSS/SVG ambiant et un mouvement conditionné par prefers-reduced-motion. Atmosphérique pour qui le veut, invisible pour les autres.",
      },
      {
        challenge:
          "Laisser le markdown tout piloter tout en gardant une expérience de lecture soignée.",
        solution:
          "Une convention de frontmatter plus une table des matières générée et des replis gracieux, pour qu'une image hero ou un champ manquant se dégrade en silence plutôt que d'exploser.",
      },
    ],
    hiringSignals: [
      "Next.js moderne — App Router et React Server Components — dans un produit livré et en ligne, pas dans un tutoriel.",
      "Le souci du métier : typographie, mouvement et ergonomie de lecture traités comme de l'ingénierie, pas de la décoration.",
      "Maîtrise complète d'un pipeline de contenu markdown, du frontmatter à l'entrée rendue.",
    ],
    nextIterations: [
      "Remettre en état le backend du livre d'or pour que les visiteurs puissent à nouveau signer.",
      "Un outillage d'entrées plus riche — séries, liens croisés et une surface d'entrées connexes.",
      "Un mode de lecture compatible hors ligne pour les entrées enregistrées.",
    ],
    tags: ["Next.js", "React 19", "Markdown", "Digital Garden"],
    impactHeading: "Comment ce projet crée de l'impact",
    impactPoints: [
      "Offre un espace calme et sans distraction pour lire des textes longs.",
      "Prouve qu'un site de contenu peut être rapide et accessible sans surveillance ni artifices SEO.",
      "Transforme du simple markdown en une expérience de lecture éditoriale soignée.",
    ],
    stats: [
      { value: "0", label: "traceurs" },
      { value: "100%", label: "markdown" },
      { value: "⌘K", label: "palette de commandes" },
      { value: "noindex", label: "volontairement" },
    ],
  },
  zh: {
    tagline: "一座刻意不让 Google 找到的数字花园。",
    description:
      "Senbon 是我那座带禅意的日志：每一篇条目都是纯 Markdown 文件，渲染成从容的阅读体验。没有 CMS，没有追踪器，也没有 SEO 噱头。",
    overview:
      "我做 Senbon（千本，“一千”），是因为想要一个不被优化到死的写作之所。每篇条目都是带 frontmatter 的 Markdown 文件——没有数据库，没有 CMS，没有任何第三方盯着读者。Next.js App Router 与 React 19 把这些文件变成编辑式的阅读体验：自动生成目录、阅读时长估算、一个 ⌘K 命令面板。而 robots.ts 则礼貌地请搜索引擎和 AI 爬虫止步门外。一个不想要观众的博客——这正是它的意义所在。",
    roleSummary: "设计、构建、上线，都是我一个人。",
    problemStatement:
      "每一款博客工具都在为传播而优化——SEO、订阅源、互动曲线。我想要的恰恰相反：一个私密、亲手打理的思考与写作空间，快速且无障碍，并刻意不进入公开索引。",
    objectives: [
      "直接用纯 Markdown 文件发布长篇条目——不依赖 CMS，也无第三方追踪。",
      "让阅读变得从容，仿佛页面真的尊重读者的注意力。",
      "用动效与排版营造氛围，同时不拖慢页面、不破坏无障碍性。",
    ],
    architectureDecisions: [
      "采用 Next.js App Router 与 React Server Components，从文件系统的 Markdown 读取条目，而非数据库——文件本身就是数据库。",
      "使用 react-markdown 搭配 remark-gfm 与 rehype-highlight 渲染，目录直接由标题生成。",
      "Framer Motion 仅用于入场动画，并全程遵循 prefers-reduced-motion——宁静不该让任何人头疼。",
    ],
    implementationHighlights: [
      "一条 Markdown 管线：由 frontmatter 驱动的条目，支持按标题、摘要与标签搜索、标签筛选以及加载更多分页。",
      "阅读体验包含自动生成目录、阅读进度细线、阅读时长估算、上一篇/下一篇导航，以及每个代码块上的复制按钮。",
      "一个 ⌘/Ctrl + K 命令面板，以及一片完全用 CSS 与 SVG 绘制的、由极光与河流构成的舒缓背景。",
    ],
    qualityAndSecurity: [
      "从设计之初就隐私优先：robots.ts 拒绝搜索引擎与 AI 爬虫，并以 noindex 响应头、以及零 OG 或结构化元数据加以支撑。",
      "仅使用第一方的 Vercel Analytics——没有任何第三方追踪器接触到读者。",
      "认真对待无障碍：跳转到正文链接、按路由恢复滚动位置、主题化的错误边界，以及尊重用户偏好的动效。",
    ],
    challengesAndSolutions: [
      {
        challenge: "让页面显得丰富而有氛围，却不增加负担、也不毁掉无障碍性。",
        solution: "采用单一的舒缓 CSS/SVG 背景，并将动效置于 prefers-reduced-motion 之后。想要的人有氛围，不想要的人则完全无感。",
      },
      {
        challenge: "让 Markdown 驱动一切，同时保持阅读体验的精致。",
        solution: "一套 frontmatter 约定，加上自动生成的目录与优雅的回退，使缺失的主图或字段都能悄然降级，而不是直接崩掉。",
      },
    ],
    hiringSignals: [
      "现代 Next.js——App Router 与 React Server Components——体现在一个已上线交付的产品中，而非教程里。",
      "对工艺的讲究：把排版、动效与阅读人体工学都当作工程，而非装饰。",
      "对 Markdown 内容管线的完整主导，从 frontmatter 到渲染后的条目。",
    ],
    nextIterations: [
      "重新整备留言墙后端，让访客可以再次签名。",
      "更丰富的条目工具——系列、交叉链接，以及相关条目展示面。",
      "为已保存条目提供可离线阅读的模式。",
    ],
    tags: ["Next.js", "React 19", "Markdown", "Digital Garden"],
    impactHeading: "本项目如何创造价值",
    impactPoints: [
      "提供一个宁静、无干扰的空间来阅读长篇文字。",
      "证明内容网站无需监控或 SEO 噱头，也能做到快速且无障碍。",
      "把纯 Markdown 转化为精致的编辑式阅读体验。",
    ],
    stats: [
      { value: "0", label: "追踪器" },
      { value: "100%", label: "Markdown" },
      { value: "⌘K", label: "命令面板" },
      { value: "noindex", label: "刻意为之" },
    ],
  },
};
