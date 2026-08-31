import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const senbon: Record<Language, LocalizedContent> = {
  en: {
    tagline: "A journal that refuses to be found on Google. On purpose.",
    description:
      "Senbon is my markdown journal: plain files with four frontmatter keys, rendered into an unhurried reading page. No CMS, no third-party trackers, and noindex on every response.",
    overview:
      "I wanted somewhere to write that was not optimized to death. Every entry in Senbon (千本, \"one thousand\") is a markdown file with four frontmatter keys, committed to the repo, and the site rebuilds when I push. Next.js App Router and React Server Components turn those files into a reading page, and a robots file plus an X-Robots-Tag header tell search engines and AI crawlers to leave. Most of the work since has been subtraction: a command palette, full-text search, tag filters, pagination, a table of contents, reading-time estimates and a canvas background were all built and then deleted. Three routes do not need a launcher, and a few hundred words do not need a progress bar.",
    roleSummary: "Just me, and lately mostly deleting things I had already written.",
    problemStatement:
      "Every blogging tool optimizes for reach: SEO, feeds, engagement graphs. I wanted the opposite. A private, hand-tended place to think and write, fast and accessible, and deliberately kept out of the public index.",
    objectives: [
      "Publish long-form entries straight from markdown files, with no CMS and no third-party tracking.",
      "Make reading feel unhurried, on a page that is not asking anything of you.",
      "Stay out of the index without hiding, which turns out to be a specific technical problem rather than a switch.",
    ],
    architectureDecisions: [
      "Next.js App Router with React Server Components, reading entries from markdown on the filesystem. The files are the database.",
      "Four frontmatter keys and nothing more: title, excerpt, publishedAt, tags. The slug is the filename.",
      "react-markdown with remark-gfm and rehype-highlight for rendering, and heading anchors generated from the H2 to H4 levels.",
      "No Framer Motion, no shadcn, no Radix. The entrance animation is a CSS class, and Lenis handles the smooth scrolling and switches itself off under reduced motion.",
    ],
    implementationHighlights: [
      "A warm ambient background built from three CSS layers, with no SVG and no canvas anywhere in it.",
      "Small reading details: copy buttons on code blocks, markers on external links, relative dates with the absolute one on hover, a skip-to-content link, themed 404 and error boundaries.",
      "A guestbook at /guestbook, rate-limited and honeypot-protected, with moderation behind a password gate, that degrades to an offline notice when its backend is not configured.",
    ],
    qualityAndSecurity: [
      "Every response carries X-Robots-Tag with noindex, nofollow, noarchive, nosnippet, noimageindex, noai and noimageai. The AI crawlers are named and disallowed outright.",
      "No OG images, no sitemap, no structured data. Nothing here is built to be found.",
      "First-party Vercel Analytics only, so no third-party tracker ever touches the reader.",
      "prefers-reduced-motion is respected throughout, and the smooth scrolling switches itself off completely.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Every feature I added made the site feel more like a product and less like a page.",
        solution:
          "I deleted them. The command palette, the search, the tag filters, the pagination, the table of contents and the reading-time estimate all shipped and then came back out, and what is left is what earned its place.",
      },
      {
        challenge:
          "A blanket disallow in robots.txt does not keep you out of the index. It just stops anyone from reading the noindex, so search engines index the bare URL from an external link anyway.",
        solution:
          "Crawlers are allowed to fetch precisely so they can see the noindex, and the AI crawlers are named and blocked separately.",
      },
    ],
    hiringSignals: [
      "Modern Next.js in a live product: App Router, React Server Components, and Tailwind configured entirely in CSS.",
      "I can tell when a feature is not paying for itself and take it out, which is harder than adding it.",
      "I read the specs I depend on. The robots setup here is the shape it is because the obvious version would have done the opposite of what I wanted.",
    ],
    nextIterations: [
      "Fewer entries and better ones, which is not a feature but is the actual plan.",
      "Series and cross-links between entries, if I can add them without adding a launcher.",
    ],
    tags: ["Next.js", "React 19", "Markdown", "Journal"],
    impactHeading: "What This Project Is Good For",
    impactPoints: [
      "A calm place to read something long.",
      "A content site that is fast and accessible with no surveillance and no SEO on it at all.",
      "Plain markdown turned into a page that is worth reading on.",
    ],
    stats: [
      { value: "0", label: "third-party trackers" },
      { value: "4", label: "frontmatter keys" },
      { value: "3", label: "CSS layers" },
      { value: "noindex", label: "on purpose" },
    ],
  },
  de: {
    tagline: "Ein Journal, das sich weigert, bei Google zu landen. Mit Absicht.",
    description:
      "Senbon ist mein Markdown-Journal: einfache Dateien mit vier Frontmatter-Feldern, gerendert zu einer Leseseite ohne Eile. Kein CMS, keine Fremdtracker und noindex in jeder Antwort.",
    overview:
      "Ich wollte einen Ort zum Schreiben, der nicht zu Tode optimiert ist. Jeder Eintrag in Senbon (千本, „eintausend“) ist eine Markdown-Datei mit vier Frontmatter-Feldern, ins Repo committet, und die Seite baut sich neu, wenn ich pushe. Next.js App Router und React Server Components machen aus diesen Dateien eine Leseseite, und eine robots-Datei plus ein X-Robots-Tag-Header sagen Suchmaschinen und KI-Crawlern, sie sollen gehen. Die meiste Arbeit seither war Subtraktion: eine Befehlspalette, Volltextsuche, Tag-Filter, Pagination, ein Inhaltsverzeichnis, Lesezeit-Schätzungen und ein Canvas-Hintergrund wurden alle gebaut und dann gelöscht. Drei Routen brauchen keinen Launcher, und ein paar hundert Wörter brauchen keinen Fortschrittsbalken.",
    roleSummary: "Nur ich, und in letzter Zeit hauptsächlich beim Löschen des eigenen Codes.",
    problemStatement:
      "Jedes Blogging-Werkzeug optimiert auf Reichweite: SEO, Feeds, Engagement-Kurven. Ich wollte das Gegenteil. Einen privaten, von Hand gepflegten Ort zum Denken und Schreiben, schnell und zugänglich, und bewusst aus dem öffentlichen Index heraus.",
    objectives: [
      "Lange Einträge direkt aus Markdown-Dateien veröffentlichen, ohne CMS und ohne Fremdtracking.",
      "Lesen soll sich ohne Eile anfühlen, auf einer Seite, die nichts von dir will.",
      "Aus dem Index bleiben, ohne sich zu verstecken, und das ist ein konkretes technisches Problem und kein Schalter.",
    ],
    architectureDecisions: [
      "Next.js App Router mit React Server Components, die Einträge als Markdown vom Dateisystem lesen. Die Dateien sind die Datenbank.",
      "Vier Frontmatter-Felder und nicht mehr: title, excerpt, publishedAt, tags. Der Slug ist der Dateiname.",
      "react-markdown mit remark-gfm und rehype-highlight fürs Rendering, und Heading-Anker, die aus den Ebenen H2 bis H4 erzeugt werden.",
      "Kein Framer Motion, kein shadcn, kein Radix. Die Einblend-Animation ist eine CSS-Klasse, und Lenis macht das sanfte Scrollen und schaltet sich unter Reduced-Motion selbst ab.",
    ],
    implementationHighlights: [
      "Ein warmer Ambient-Hintergrund aus drei CSS-Schichten, ohne SVG und ohne Canvas darin.",
      "Kleine Lesedetails: Kopier-Buttons auf Codeblöcken, Markierungen an externen Links, relative Daten mit dem absoluten beim Hover, ein Skip-to-Content-Link, thematisierte 404- und Error-Boundaries.",
      "Ein Gästebuch unter /guestbook, ratenbegrenzt und mit Honeypot geschützt, Moderation hinter einem Passwort, das ohne konfiguriertes Backend zu einem Offline-Hinweis degradiert.",
    ],
    qualityAndSecurity: [
      "Jede Antwort trägt X-Robots-Tag mit noindex, nofollow, noarchive, nosnippet, noimageindex, noai und noimageai. Die KI-Crawler sind namentlich und vollständig ausgeschlossen.",
      "Keine OG-Bilder, keine Sitemap, keine strukturierten Daten. Hier ist nichts darauf gebaut, gefunden zu werden.",
      "Nur First-Party-Analytics von Vercel, damit kein Fremdtracker den Leser je berührt.",
      "prefers-reduced-motion wird durchgehend respektiert, und das sanfte Scrollen schaltet sich ganz ab.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Jedes Feature, das ich hinzufügte, liess die Seite mehr wie ein Produkt und weniger wie eine Seite wirken.",
        solution:
          "Ich habe sie gelöscht. Befehlspalette, Suche, Tag-Filter, Pagination, Inhaltsverzeichnis und Lesezeit-Schätzung waren alle live und kamen wieder heraus, und was bleibt, hat seinen Platz verdient.",
      },
      {
        challenge:
          "Ein pauschales Disallow in der robots.txt hält dich nicht aus dem Index. Es verhindert nur, dass jemand das noindex liest, also indexieren Suchmaschinen die nackte URL trotzdem, aus einem externen Link.",
        solution:
          "Crawler dürfen genau deshalb abrufen, damit sie das noindex sehen, und die KI-Crawler werden separat namentlich blockiert.",
      },
    ],
    hiringSignals: [
      "Modernes Next.js in einem Live-Produkt: App Router, React Server Components und Tailwind vollständig in CSS konfiguriert.",
      "Ich merke, wenn ein Feature sich nicht rechnet, und nehme es heraus, was schwerer ist als es einzubauen.",
      "Ich lese die Spezifikationen, von denen ich abhänge. Das robots-Setup hat diese Form, weil die naheliegende Variante das Gegenteil bewirkt hätte.",
    ],
    nextIterations: [
      "Weniger Einträge und bessere, was kein Feature ist, aber der eigentliche Plan.",
      "Serien und Querverweise zwischen Einträgen, falls ich sie ohne Launcher hinbekomme.",
    ],
    tags: ["Next.js", "React 19", "Markdown", "Journal"],
    impactHeading: "Wofür dieses Projekt gut ist",
    impactPoints: [
      "Ein ruhiger Ort, um etwas Langes zu lesen.",
      "Eine Content-Seite, die schnell und zugänglich ist, ganz ohne Überwachung und ohne SEO.",
      "Reines Markdown, verwandelt in eine Seite, auf der es sich lesen lässt.",
    ],
    stats: [
      { value: "0", label: "Fremdtracker" },
      { value: "4", label: "Frontmatter-Felder" },
      { value: "3", label: "CSS-Schichten" },
      { value: "noindex", label: "mit Absicht" },
    ],
  },
  fr: {
    tagline: "Un journal qui refuse d'être trouvé sur Google. Exprès.",
    description:
      "Senbon est mon journal en markdown : de simples fichiers avec quatre clés de frontmatter, rendus en une page de lecture sans hâte. Pas de CMS, aucun traqueur tiers, et noindex sur chaque réponse.",
    overview:
      "Je voulais un endroit pour écrire qui ne soit pas optimisé à mort. Chaque entrée de Senbon (千本, « mille ») est un fichier markdown avec quatre clés de frontmatter, commité dans le dépôt, et le site se reconstruit quand je pousse. Next.js App Router et les React Server Components transforment ces fichiers en une page de lecture, et un fichier robots plus un en-tête X-Robots-Tag disent aux moteurs et aux crawlers d'IA de repartir. L'essentiel du travail depuis a été de la soustraction : une palette de commandes, une recherche plein texte, des filtres par tag, la pagination, une table des matières, des estimations de temps de lecture et un fond en canvas ont tous été construits puis supprimés. Trois routes n'ont pas besoin d'un lanceur, et quelques centaines de mots n'ont pas besoin d'une barre de progression.",
    roleSummary: "Moi seul, et ces derniers temps surtout à supprimer mon propre code.",
    problemStatement:
      "Chaque outil de blog optimise la portée : SEO, flux, courbes d'engagement. Je voulais l'inverse. Un endroit privé, entretenu à la main, pour penser et écrire, rapide et accessible, et délibérément tenu hors de l'index public.",
    objectives: [
      "Publier des entrées longues directement depuis des fichiers markdown, sans CMS ni pistage tiers.",
      "Rendre la lecture sans hâte, sur une page qui ne vous demande rien.",
      "Rester hors de l'index sans se cacher, ce qui s'avère être un problème technique précis et non un interrupteur.",
    ],
    architectureDecisions: [
      "Next.js App Router avec des React Server Components, qui lisent les entrées en markdown depuis le système de fichiers. Les fichiers sont la base de données.",
      "Quatre clés de frontmatter et rien de plus : title, excerpt, publishedAt, tags. Le slug est le nom du fichier.",
      "react-markdown avec remark-gfm et rehype-highlight pour le rendu, et des ancres de titre générées depuis les niveaux H2 à H4.",
      "Pas de Framer Motion, pas de shadcn, pas de Radix. L'animation d'entrée est une classe CSS, et Lenis gère le défilement doux et se coupe de lui-même sous mouvement réduit.",
    ],
    implementationHighlights: [
      "Un fond d'ambiance chaud bâti sur trois couches CSS, sans le moindre SVG ni canvas dedans.",
      "De petits détails de lecture : boutons de copie sur les blocs de code, marqueurs sur les liens externes, dates relatives avec l'absolue au survol, un lien d'évitement, des 404 et error boundaries thématisés.",
      "Un livre d'or sur /guestbook, limité en débit et protégé par honeypot, avec modération derrière un mot de passe, qui se replie sur un avis hors ligne quand son backend n'est pas configuré.",
    ],
    qualityAndSecurity: [
      "Chaque réponse porte un X-Robots-Tag avec noindex, nofollow, noarchive, nosnippet, noimageindex, noai et noimageai. Les crawlers d'IA sont nommés et interdits d'entrée.",
      "Pas d'images OG, pas de sitemap, pas de données structurées. Rien ici n'est fait pour être trouvé.",
      "Uniquement des analytics Vercel de première partie, pour qu'aucun traqueur tiers ne touche jamais le lecteur.",
      "prefers-reduced-motion est respecté partout, et le défilement doux se coupe entièrement.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Chaque fonctionnalité ajoutée donnait au site l'air d'un produit et de moins en moins l'air d'une page.",
        solution:
          "Je les ai supprimées. La palette de commandes, la recherche, les filtres par tag, la pagination, la table des matières et l'estimation de temps de lecture ont toutes été livrées puis retirées, et ce qui reste a mérité sa place.",
      },
      {
        challenge:
          "Un disallow global dans robots.txt ne vous garde pas hors de l'index. Il empêche seulement quiconque de lire le noindex, donc les moteurs indexent quand même l'URL nue trouvée dans un lien externe.",
        solution:
          "Les crawlers sont autorisés à récupérer la page précisément pour qu'ils voient le noindex, et les crawlers d'IA sont nommés et bloqués séparément.",
      },
    ],
    hiringSignals: [
      "Du Next.js moderne dans un produit en ligne : App Router, React Server Components, et Tailwind configuré entièrement en CSS.",
      "Je sais reconnaître une fonctionnalité qui ne se rentabilise pas et la retirer, ce qui est plus dur que de l'ajouter.",
      "Je lis les spécifications dont je dépends. La configuration robots a cette forme parce que la version évidente aurait fait l'inverse de ce que je voulais.",
    ],
    nextIterations: [
      "Moins d'entrées et de meilleures, ce qui n'est pas une fonctionnalité mais bien le plan.",
      "Des séries et des liens croisés entre entrées, si j'arrive à les ajouter sans ajouter un lanceur.",
    ],
    tags: ["Next.js", "React 19", "Markdown", "Journal"],
    impactHeading: "À quoi sert ce projet",
    impactPoints: [
      "Un endroit calme pour lire quelque chose de long.",
      "Un site de contenu rapide et accessible, sans aucune surveillance et sans le moindre SEO.",
      "Du markdown brut transformé en une page sur laquelle il vaut la peine de lire.",
    ],
    stats: [
      { value: "0", label: "traqueurs tiers" },
      { value: "4", label: "clés de frontmatter" },
      { value: "3", label: "couches CSS" },
      { value: "noindex", label: "exprès" },
    ],
  },
  zh: {
    tagline: "一本拒绝被谷歌搜到的日志。有意为之。",
    description:
      "Senbon 是我的 markdown 日志：普通文件，四个 frontmatter 字段，渲染成一页不催人的阅读页。没有 CMS，没有第三方追踪，每个响应都带 noindex。",
    overview:
      "我想要一个写字的地方，不必被优化到死。Senbon（千本）里的每一篇都是一个 markdown 文件，只有四个 frontmatter 字段，提交进仓库，我一推送站点就重建。Next.js 的 App Router 和 React 服务端组件把这些文件变成一页可读的东西，而一个 robots 文件加上 X-Robots-Tag 响应头，则请搜索引擎和 AI 抓取程序离开。此后大部分工作其实是减法：命令面板、全文搜索、标签筛选、分页、目录、阅读时长估算和一层 canvas 背景，全都做过，然后又都删了。三条路由用不上启动器，几百个字也用不上进度条。",
    roleSummary: "只有我，而最近主要是在删自己写过的东西。",
    problemStatement:
      "每一种写博客的工具都在为触达优化：SEO、订阅源、互动曲线。我想要相反的东西。一个私人的、手工照料的地方，用来想事情和写字，快而可访问，并且刻意留在公共索引之外。",
    objectives: [
      "直接从 markdown 文件发布长文，不用 CMS，也不用第三方追踪。",
      "让阅读不催人，页面本身不向你索取任何东西。",
      "留在索引之外，但不靠躲藏，而这其实是个具体的技术问题，不是一个开关。",
    ],
    architectureDecisions: [
      "Next.js App Router 配 React 服务端组件，直接从文件系统读取 markdown 条目。文件就是数据库。",
      "四个 frontmatter 字段，没有更多：title、excerpt、publishedAt、tags。slug 就是文件名。",
      "渲染用 react-markdown 加 remark-gfm 和 rehype-highlight，标题锚点从 H2 到 H4 生成。",
      "没有 Framer Motion，没有 shadcn，没有 Radix。入场动画是一个 CSS class，平滑滚动由 Lenis 负责，在减少动态的偏好下它会自己关掉。",
    ],
    implementationHighlights: [
      "一层温暖的环境背景，由三层 CSS 叠成，里面没有 SVG，也没有 canvas。",
      "阅读上的一些小讲究：代码块上的复制按钮、外链的标记、相对日期（悬停时显示绝对日期）、跳到正文的链接，以及配了主题的 404 和错误边界。",
      "/guestbook 上有一面留言墙，带限流和蜜罐防护，审核藏在一道密码后面；后端没配置时，它会退化成一条离线提示。",
    ],
    qualityAndSecurity: [
      "每个响应都带 X-Robots-Tag：noindex、nofollow、noarchive、nosnippet、noimageindex、noai 和 noimageai。AI 抓取程序是被逐个点名、直接拒之门外的。",
      "没有 OG 图、没有 sitemap、没有结构化数据。这里没有任何东西是为了被找到而做的。",
      "只有第一方的 Vercel 分析，任何第三方追踪器都不会碰到读者。",
      "全程尊重 prefers-reduced-motion，平滑滚动会整个关掉。",
    ],
    challengesAndSolutions: [
      {
        challenge: "我每加一个功能，这个站就更像一个产品，更不像一个页面。",
        solution: "我把它们删了。命令面板、搜索、标签筛选、分页、目录和阅读时长估算，全都上线过又都撤了下来；留下的是配得上位置的那些。",
      },
      {
        challenge: "在 robots.txt 里一刀切地 disallow，并不能让你不进索引。它只是让没人读得到那句 noindex，于是搜索引擎照样会从外链把那个裸网址收进去。",
        solution: "抓取程序被允许取回页面，正是为了让它们看到 noindex；AI 抓取程序则单独点名拦下。",
      },
    ],
    hiringSignals: [
      "现代 Next.js 用在一个已上线的产品里：App Router、React 服务端组件，以及完全在 CSS 里配置的 Tailwind。",
      "我看得出一个功能不划算，也下得了手把它拿掉，而这比加上它更难。",
      "我会去读我依赖的那些规范。这里的 robots 设置是这个样子，是因为看起来最顺手的那种写法会得到相反的结果。",
    ],
    nextIterations: [
      "少写几篇、写好一点，这不算功能，但它是真正的计划。",
      "条目之间的系列与互链，前提是我能加上它们而不必再加一个启动器。",
    ],
    tags: ["Next.js", "React 19", "Markdown", "Journal"],
    impactHeading: "这个项目有什么用",
    impactPoints: [
      "一个安静的地方，读一点长的东西。",
      "一个快而可访问的内容站，完全没有监视，也完全没有 SEO。",
      "把纯 markdown 变成一页值得在上面读字的东西。",
    ],
    stats: [
      { value: "0", label: "第三方追踪器" },
      { value: "4", label: "frontmatter 字段" },
      { value: "3", label: "CSS 层" },
      { value: "noindex", label: "有意为之" },
    ],
  },
};
