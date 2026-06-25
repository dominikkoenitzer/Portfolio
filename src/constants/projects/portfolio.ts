import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const portfolio: Record<Language, LocalizedContent> = {
  en: {
    tagline:
      "The site you are reading right now. Yes, it is the portfolio piece.",
    description:
      "My personal portfolio: a fast React single-page app with hand-rolled i18n in four languages, JSON-LD structured data on every page, and a WebGL background that stays off the critical path.",
    overview:
      "Most portfolios are a template with the developer's name swapped in. I wanted mine to be the proof, not the brochure. So I built this in React, TypeScript, and Vite: four languages with a hand-rolled i18n layer (no library), JSON-LD Person/FAQ/HowTo schemas so search and AI can actually read it, framer-motion page transitions, smooth scrolling, and a lazy WebGL background. It is meta on purpose. The engineering is the sample.",
    roleSummary:
      "Designed it, built it, shipped it. Just me — architecture, four languages, SEO, and the visual system.",
    problemStatement:
      "A developer portfolio has to convince two very different readers: a recruiter skimming on their phone, and a crawler that only sees markup. Most sites pick one and shrug at the other. I built for both — clean copy for humans, rich structured data for machines, on top of a fast, accessible SPA.",
    objectives: [
      "Be genuinely multilingual (en/de/fr/zh) with native-quality copy — not a Google-Translate toggle bolted on at the end.",
      "Treat SEO and AI-readability as architecture, with structured data on every page instead of a meta tag and a prayer.",
      "Stay fast and accessible while still shipping real motion and a WebGL background.",
    ],
    architectureDecisions: [
      "React 18 + TypeScript + Vite with manual code-splitting, so the WebGL background loads lazily and never blocks the critical path.",
      "Hand-rolled i18n, no library: one typed translation module per language, recomposed into a single object.",
      "Split-module content pattern — projects, translations, and SEO data live as folders of small files joined by a stable index, so adding content never reshuffles the API.",
    ],
    implementationHighlights: [
      "Four-language UI driven by a typed Language source of truth and per-language copy modules.",
      "An SEO component that emits JSON-LD (Person, FAQ, HowTo) plus Helmet meta and self-canonical routes.",
      "Lazy WebGL themed backgrounds, framer-motion page transitions, and smooth scrolling that backs off when you ask for reduced motion.",
    ],
    qualityAndSecurity: [
      "Typecheck and production build are the CI gates — every push and pull request has to pass both.",
      "Accessible, responsive, reduced-motion-aware UI built on shadcn/ui (Radix) primitives.",
      "The GitHub token for the contributions widget stays server-side in a Vercel function. It never touches the client bundle.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Shipping real motion and a WebGL background without paying for it in load time or accessibility.",
        solution:
          "Manual chunking, a background that loads lazily and stays off the critical path, and animation that quietly stands down under reduced-motion.",
      },
      {
        challenge:
          "Keeping four languages and per-page structured data in sync as the content grows.",
        solution:
          "A split-module pattern with recomposing indexes: content lives in small files, the public API stays put.",
      },
    ],
    hiringSignals: [
      "I can own a real, deployed product alone — architecture, content, SEO, and design.",
      "I treat SEO and AI-readability as engineering, not marketing dressing.",
      "I hold performance and accessibility while still shipping polished motion and visuals.",
    ],
    nextIterations: [
      "Widen the structured-data coverage and add per-page Open Graph cards.",
      "More themed background variants and finer reduced-motion controls.",
      "Lightweight automated checks around translations and SEO metadata, so nothing drifts silently.",
    ],
    tags: ["React", "TypeScript", "Vite", "SEO"],
    stats: [
      { value: "4", label: "languages" },
      { value: "0", label: "i18n libraries" },
      { value: "3", label: "JSON-LD schemas" },
      { value: "0", label: "tokens leaked" },
    ],
    impactHeading: "How This Project Creates Impact",
    impactPoints: [
      "Presents my work clearly to recruiters in their own language.",
      "Stays discoverable through structured data built for search engines and AI.",
      "Proves the craft directly — the site itself is the engineering sample.",
    ],
  },
  de: {
    tagline:
      "Die Seite, die du gerade liest. Ja, sie ist das Portfolio-Stück.",
    description:
      "Mein persönliches Portfolio: eine schnelle React-Single-Page-App mit selbstgebauter i18n in vier Sprachen, JSON-LD-Daten auf jeder Seite und einem WebGL-Hintergrund, der den kritischen Pfad nicht belastet.",
    overview:
      "Die meisten Portfolios sind ein Template, in dem nur der Name ausgetauscht wurde. Meines sollte der Beweis sein, nicht die Broschüre. Also habe ich es in React, TypeScript und Vite gebaut: vier Sprachen mit selbstgebauter i18n-Schicht (ohne Bibliothek), JSON-LD-Schemata für Person/FAQ/HowTo, damit Suche und KI es wirklich lesen können, framer-motion-Seitenübergänge, sanftes Scrollen und einen lazy geladenen WebGL-Hintergrund. Bewusst meta. Die Technik ist die Probe.",
    roleSummary:
      "Entworfen, gebaut, ausgeliefert. Nur ich — Architektur, vier Sprachen, SEO und das visuelle System.",
    problemStatement:
      "Ein Entwickler-Portfolio muss zwei sehr unterschiedliche Leser überzeugen: einen Recruiter, der am Handy überfliegt, und einen Crawler, der nur Markup sieht. Die meisten Seiten wählen eines und zucken beim anderen mit den Schultern. Ich habe für beide gebaut — klare Texte für Menschen, reichhaltige strukturierte Daten für Maschinen, auf einer schnellen, barrierefreien SPA.",
    objectives: [
      "Wirklich mehrsprachig sein (en/de/fr/zh), mit Texten in Muttersprachenqualität — kein nachträglich angeschraubter Umschalter.",
      "SEO und KI-Lesbarkeit als Architektur behandeln, mit strukturierten Daten auf jeder Seite statt eines Meta-Tags und eines Stoßgebets.",
      "Schnell und barrierefrei bleiben und trotzdem echte Bewegung und einen WebGL-Hintergrund liefern.",
    ],
    architectureDecisions: [
      "React 18 + TypeScript + Vite mit manuellem Code-Splitting, damit der WebGL-Hintergrund lazy lädt und nie den kritischen Pfad blockiert.",
      "Selbstgebaute i18n, ohne Bibliothek: ein typisiertes Übersetzungsmodul pro Sprache, neu zusammengesetzt zu einem Objekt.",
      "Split-Modul-Muster für Inhalte — Projekte, Übersetzungen und SEO-Daten liegen als Ordner kleiner Dateien, verbunden durch einen stabilen Index, sodass neuer Inhalt die API nie umsortiert.",
    ],
    implementationHighlights: [
      "Viersprachige UI, getrieben von einer typisierten Language-Quelle der Wahrheit und Textmodulen pro Sprache.",
      "Eine SEO-Komponente, die JSON-LD (Person, FAQ, HowTo) sowie Helmet-Meta und selbst-kanonische Routen ausgibt.",
      "Lazy geladene WebGL-Themehintergründe, framer-motion-Seitenübergänge und sanftes Scrollen, das sich bei reduced-motion zurücknimmt.",
    ],
    qualityAndSecurity: [
      "Typecheck und Production-Build sind die CI-Gates — jeder Push und Pull Request muss beide bestehen.",
      "Barrierefreie, responsive, reduced-motion-bewusste UI auf Basis von shadcn/ui (Radix)-Primitiven.",
      "Das GitHub-Token für das Contributions-Widget bleibt server-seitig in einer Vercel-Funktion. Es berührt das Client-Bundle nie.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Echte Bewegung und einen WebGL-Hintergrund liefern, ohne mit Ladezeit oder Barrierefreiheit dafür zu bezahlen.",
        solution:
          "Manuelles Chunking, ein Hintergrund, der lazy lädt und abseits des kritischen Pfads bleibt, und Animation, die sich unter reduced-motion leise zurückzieht.",
      },
      {
        challenge:
          "Vier Sprachen und seitenweise strukturierte Daten synchron halten, während die Inhalte wachsen.",
        solution:
          "Ein Split-Modul-Muster mit neu zusammensetzenden Indizes: Inhalte leben in kleinen Dateien, die öffentliche API bleibt stehen.",
      },
    ],
    hiringSignals: [
      "Ich kann ein echtes, deploytes Produkt allein verantworten — Architektur, Inhalte, SEO und Design.",
      "Ich behandle SEO und KI-Lesbarkeit als Engineering, nicht als Marketing-Schmuck.",
      "Ich halte Performance und Barrierefreiheit und liefere trotzdem polierte Bewegung und Optik.",
    ],
    nextIterations: [
      "Die Abdeckung strukturierter Daten erweitern und Open-Graph-Cards pro Seite ergänzen.",
      "Mehr Theme-Hintergrundvarianten und feinere reduced-motion-Steuerungen.",
      "Leichtgewichtige automatisierte Checks rund um Übersetzungen und SEO-Metadaten, damit nichts unbemerkt abdriftet.",
    ],
    tags: ["React", "TypeScript", "Vite", "SEO"],
    stats: [
      { value: "4", label: "Sprachen" },
      { value: "0", label: "i18n-Bibliotheken" },
      { value: "3", label: "JSON-LD-Schemata" },
      { value: "0", label: "geleakte Tokens" },
    ],
    impactHeading: "Wie dieses Projekt Wirkung erzeugt",
    impactPoints: [
      "Präsentiert meine Arbeit Recruitern klar in ihrer eigenen Sprache.",
      "Bleibt auffindbar durch strukturierte Daten, gebaut für Suchmaschinen und KI.",
      "Beweist das Handwerk direkt — die Seite selbst ist die Engineering-Probe.",
    ],
  },
  fr: {
    tagline:
      "Le site que vous lisez en ce moment. Oui, c'est lui, la pièce du portfolio.",
    description:
      "Mon portfolio personnel : une single-page app React rapide, avec une i18n faite maison en quatre langues, des données structurées JSON-LD sur chaque page et un fond WebGL qui reste hors du chemin critique.",
    overview:
      "La plupart des portfolios sont un template où l'on a juste remplacé le nom. Je voulais que le mien soit la preuve, pas la brochure. Je l'ai donc bâti en React, TypeScript et Vite : quatre langues via une couche i18n faite maison (sans bibliothèque), des schémas JSON-LD Person/FAQ/HowTo pour que la recherche et l'IA puissent vraiment le lire, des transitions de page framer-motion, un défilement fluide et un fond WebGL chargé en lazy. Méta volontairement. L'ingénierie est l'échantillon.",
    roleSummary:
      "Conçu, construit, livré. Moi seul — architecture, quatre langues, SEO et système visuel.",
    problemStatement:
      "Un portfolio de développeur doit convaincre deux lecteurs très différents : un recruteur qui survole sur son téléphone, et un crawler qui ne voit que du markup. La plupart des sites en choisissent un et haussent les épaules pour l'autre. J'ai bâti pour les deux — un texte clair pour les humains, des données structurées riches pour les machines, sur une SPA rapide et accessible.",
    objectives: [
      "Être réellement multilingue (en/de/fr/zh), avec un texte de qualité native — pas un bouton de traduction ajouté à la fin.",
      "Traiter le SEO et la lisibilité par l'IA comme de l'architecture, avec des données structurées sur chaque page plutôt qu'une balise meta et une prière.",
      "Rester rapide et accessible tout en livrant une vraie animation et un fond WebGL.",
    ],
    architectureDecisions: [
      "React 18 + TypeScript + Vite avec découpage de code manuel, pour que le fond WebGL se charge en lazy et ne bloque jamais le chemin critique.",
      "i18n faite maison, sans bibliothèque : un module de traduction typé par langue, recomposé en un seul objet.",
      "Modèle de contenu en modules séparés — projets, traductions et données SEO vivent comme des dossiers de petits fichiers réunis par un index stable, si bien qu'ajouter du contenu ne réorganise jamais l'API.",
    ],
    implementationHighlights: [
      "Interface en quatre langues, pilotée par une source de vérité Language typée et des modules de texte par langue.",
      "Un composant SEO qui émet du JSON-LD (Person, FAQ, HowTo) ainsi que des balises Helmet et des routes auto-canoniques.",
      "Fonds thématiques WebGL chargés en lazy, transitions de page framer-motion et défilement fluide qui se retire quand on demande le reduced-motion.",
    ],
    qualityAndSecurity: [
      "Le typecheck et le build de production sont les garde-fous CI — chaque push et pull request doit passer les deux.",
      "Interface accessible, responsive et respectueuse du reduced-motion, bâtie sur les primitives shadcn/ui (Radix).",
      "Le token GitHub du widget de contributions reste côté serveur dans une fonction Vercel. Il ne touche jamais le bundle client.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Livrer une vraie animation et un fond WebGL sans le payer en temps de chargement ni en accessibilité.",
        solution:
          "Découpage manuel, un fond qui se charge en lazy et reste hors du chemin critique, et des animations qui se mettent en retrait sous reduced-motion.",
      },
      {
        challenge:
          "Garder quatre langues et des données structurées par page synchronisées à mesure que le contenu grandit.",
        solution:
          "Un modèle de modules séparés avec des index recomposés : le contenu vit dans de petits fichiers, l'API publique ne bouge pas.",
      },
    ],
    hiringSignals: [
      "Je peux porter seul un produit réel et déployé — architecture, contenu, SEO et design.",
      "Je traite le SEO et la lisibilité par l'IA comme de l'ingénierie, pas comme un habillage marketing.",
      "Je tiens la performance et l'accessibilité tout en livrant une animation et un visuel soignés.",
    ],
    nextIterations: [
      "Élargir la couverture des données structurées et ajouter des cartes Open Graph par page.",
      "Davantage de variantes de fond thématique et des contrôles reduced-motion plus fins.",
      "Des vérifications automatisées légères autour des traductions et des métadonnées SEO, pour que rien ne dérive en silence.",
    ],
    tags: ["React", "TypeScript", "Vite", "SEO"],
    stats: [
      { value: "4", label: "langues" },
      { value: "0", label: "bibliothèques i18n" },
      { value: "3", label: "schémas JSON-LD" },
      { value: "0", label: "tokens fuités" },
    ],
    impactHeading: "Comment ce projet crée de l'impact",
    impactPoints: [
      "Présente mon travail aux recruteurs, clairement, dans leur propre langue.",
      "Reste découvrable grâce à des données structurées pensées pour les moteurs de recherche et l'IA.",
      "Prouve le savoir-faire directement — le site lui-même est l'échantillon d'ingénierie.",
    ],
  },
  zh: {
    tagline: "你此刻正在看的这个网站。没错，它本身就是作品集的作品。",
    description:
      "我的个人作品集：一个快速的 React 单页应用，配有自研的四语言 i18n、贯穿每个页面的 JSON-LD 结构化数据，以及一个不阻塞关键路径的 WebGL 背景。",
    overview:
      "大多数作品集只是把模板里的名字换成自己的。我希望我的这个是证据，而不是宣传册。所以我用 React、TypeScript 和 Vite 把它做了出来：四种语言，基于自研的 i18n 层（不用任何库），配备 JSON-LD 的 Person/FAQ/HowTo 架构，让搜索与 AI 真正读得懂，再加上 framer-motion 页面过渡、平滑滚动，以及惰性加载的 WebGL 背景。刻意做成“元”的。工程实现本身就是样本。",
    roleSummary:
      "设计、构建、上线，全是我一个人——架构、四种语言、SEO 与视觉系统。",
    problemStatement:
      "开发者作品集得说服两类截然不同的读者：在手机上扫一眼的招聘者，以及只看得到标记的爬虫。大多数网站只顾其一，对另一个耸耸肩。我两者都做了——给人看的清晰文案，给机器读的丰富结构化数据，都建在一个快速、可访问的 SPA 之上。",
    objectives: [
      "做到真正多语言（en/de/fr/zh），文案达到母语级质量——而不是最后才拼上的一个翻译按钮。",
      "把 SEO 与 AI 可读性当作架构来对待，每个页面都带结构化数据，而不是一个 meta 标签外加一句祈祷。",
      "在提供真实动效与 WebGL 背景的同时，保持快速与可访问。",
    ],
    architectureDecisions: [
      "React 18 + TypeScript + Vite，配合手动代码分割，让 WebGL 背景惰性加载，绝不阻塞关键路径。",
      "自研 i18n，不用库：每种语言一个类型化的翻译模块，重新组合成单一对象。",
      "拆分模块的内容模式——项目、翻译与 SEO 数据都以小文件文件夹的形式存在，由稳定索引连接，因此新增内容绝不会打乱 API。",
    ],
    implementationHighlights: [
      "四语言 UI，由类型化的 Language 唯一真相来源与按语言拆分的文案模块驱动。",
      "一个 SEO 组件，输出 JSON-LD（Person、FAQ、HowTo）以及 Helmet 元标签与自规范化路由。",
      "惰性加载的 WebGL 主题背景、framer-motion 页面过渡，以及在你要求 reduced-motion 时主动退让的平滑滚动。",
    ],
    qualityAndSecurity: [
      "类型检查与生产构建是 CI 关卡——每次 push 与 pull request 都必须双双通过。",
      "基于 shadcn/ui（Radix）原语构建的可访问、响应式、尊重 reduced-motion 的 UI。",
      "贡献图组件所用的 GitHub 令牌保留在 Vercel 函数的服务端，绝不触碰客户端包。",
    ],
    challengesAndSolutions: [
      {
        challenge: "在不以加载时间或可访问性为代价的前提下，呈现真实动效与 WebGL 背景。",
        solution:
          "手动分块、让背景惰性加载并置于关键路径之外，以及在 reduced-motion 下悄然退让的动画。",
      },
      {
        challenge: "随着内容增长，保持四种语言与各页面结构化数据的同步。",
        solution: "采用拆分模块模式，配以重新组合的索引：内容存放在小文件中，公共 API 纹丝不动。",
      },
    ],
    hiringSignals: [
      "我能独自主导一个真实、已部署的产品——架构、内容、SEO 与设计。",
      "我把 SEO 与 AI 可读性当作工程，而非营销装饰。",
      "我守住性能与可访问性，同时仍交付打磨过的动效与视觉。",
    ],
    nextIterations: [
      "扩展结构化数据的覆盖范围，并为各页面增加 Open Graph 卡片。",
      "更多主题背景变体与更精细的 reduced-motion 控制。",
      "围绕翻译与 SEO 元数据引入轻量级的自动化检查，让一切不会悄悄走样。",
    ],
    tags: ["React", "TypeScript", "Vite", "SEO"],
    stats: [
      { value: "4", label: "种语言" },
      { value: "0", label: "个 i18n 库" },
      { value: "3", label: "种 JSON-LD 架构" },
      { value: "0", label: "个泄露的令牌" },
    ],
    impactHeading: "本项目如何创造价值",
    impactPoints: [
      "用招聘者自己的语言，清晰地呈现我的作品。",
      "凭借为搜索引擎与 AI 打造的结构化数据，保持可被发现。",
      "直接证明工艺——网站本身就是工程样本。",
    ],
  },
};
