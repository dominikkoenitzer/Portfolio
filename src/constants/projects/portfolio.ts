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
    problemStatement:
      "A developer portfolio has to convince two very different readers: a recruiter skimming on their phone, and a crawler that only sees markup. Most sites pick one and shrug at the other. I built for both, with readable copy for humans and structured data for machines, on top of a fast, accessible SPA.",
    objectives: [
      "Be genuinely multilingual (en, de, fr, zh), with copy written per language, not a translate toggle bolted on at the end.",
      "Treat SEO and machine-readability as architecture: structured data on every page and a real HTML file behind every route.",
      "Stay fast and accessible while still shipping real motion and a WebGL background.",
    ],
    architectureDecisions: [
      "React 19, TypeScript and Vite with manual chunking, and the WebGL background loaded lazily so it never sits on the critical path.",
      "i18n written by hand: one typed module per language, recomposed into a single object, with English in the bundle and the other three fetched on demand.",
      "Content lives as folders of small modules behind a stable index (projects, translations, SEO data), so adding content never changes the API its consumers import.",
      "Sections are imported by module path, never through a barrel. Going through one made every section a static dependency of the entry chunk and cost 281 kB, 113 kB gzipped, on first load.",
    ],
    implementationHighlights: [
      "A four-language UI driven by one typed Language source of truth and per-language copy modules.",
      "An SEO component that emits Person and breadcrumb JSON-LD alongside the Helmet tags and a self-canonical for each route.",
      "A prerender step after the build that writes 20 real HTML files, one per route, plus a 404.html that says noindex in all three bot tags.",
      "One lazy WebGL aurora ribbon, framer-motion page transitions, and smooth scrolling that stands down when you ask for reduced motion.",
    ],
    qualityAndSecurity: [
      "CI gates every push and pull request on typecheck, lint, 89 unit tests, two SEO guard scripts and the production build.",
      "Production runs behind a Content-Security-Policy in vercel.json, scoped by host so preview deployments are unaffected.",
      "The GitHub token for the contributions widget lives in a Vercel serverless function. It never reaches the client bundle.",
      "Accessible, responsive, reduced-motion-aware UI built on shadcn/ui and Radix primitives.",
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
          "A single catch-all rewrite in vercel.json turned every junk URL into a soft 404, because a rewrite can only ever answer 200.",
        solution:
          "Dropped the rewrite and let the prerender step put a real file behind every route, so Vercel serves 404.html with an actual 404 status for anything else.",
      },
    ],
    hiringSignals: [
      "I can own a deployed product on my own: architecture, content, four languages, SEO and design.",
      "I treat SEO and machine-readability as engineering. Structured data has to describe what the page actually shows, or it is spam.",
      "I measure the cost of my own decisions. I found a barrel import dragging 281 kB into the entry chunk and fixed it.",
    ],
    nextIterations: [
      "Structured-data coverage for the pages that still do not have a schema of their own.",
      "A check that catches a de, fr or zh string still sitting at its English value, since the type system only guarantees the shape.",
    ],
    tags: ["React", "TypeScript", "Vite", "SEO"],
    stats: [
      { value: "4", label: "languages" },
      { value: "0", label: "i18n libraries" },
      { value: "20", label: "prerendered routes" },
      { value: "89", label: "tests" },
    ],
    impactHeading: "What This Project Is Good For",
    impactPoints: [
      "Presents my work to recruiters in their own language.",
      "Stays readable to search engines and AI crawlers, because every route is a real file with structured data in it.",
      "The site is the sample, so nothing here has to be taken on trust.",
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
    problemStatement:
      "Ein Entwickler-Portfolio muss zwei sehr verschiedene Leser überzeugen: eine Recruiterin, die auf dem Handy überfliegt, und einen Crawler, der nur Markup sieht. Die meisten Seiten entscheiden sich für eines und zucken beim anderen mit den Schultern. Ich habe für beide gebaut, mit lesbarem Text für Menschen und strukturierten Daten für Maschinen, auf einer schnellen, zugänglichen SPA.",
    objectives: [
      "Wirklich mehrsprachig sein (en, de, fr, zh), mit pro Sprache geschriebenem Text, nicht mit einem am Ende angeschraubten Übersetzungsschalter.",
      "SEO und Maschinenlesbarkeit als Architektur behandeln: strukturierte Daten auf jeder Seite und eine echte HTML-Datei hinter jeder Route.",
      "Schnell und zugänglich bleiben und trotzdem echte Animation und einen WebGL-Hintergrund ausliefern.",
    ],
    architectureDecisions: [
      "React 19, TypeScript und Vite mit manuellem Chunking, und der WebGL-Hintergrund lädt lazy, damit er nie auf dem kritischen Pfad liegt.",
      "i18n von Hand: ein typisiertes Modul pro Sprache, zu einem Objekt zusammengesetzt, Englisch im Bundle, die anderen drei auf Abruf.",
      "Inhalte liegen als Ordner kleiner Module hinter einem stabilen Index (Projekte, Übersetzungen, SEO-Daten), damit neuer Inhalt nie die API ändert, die ihre Konsumenten importieren.",
      "Sections werden über den Modulpfad importiert, nie über ein Barrel. Über ein Barrel wurde jede Section zur statischen Abhängigkeit des Entry-Chunks und kostete 281 kB, gzipped 113 kB, beim ersten Laden.",
    ],
    implementationHighlights: [
      "Eine viersprachige UI, getrieben von einer typisierten Language-Quelle der Wahrheit und Textmodulen pro Sprache.",
      "Eine SEO-Komponente, die Person- und Breadcrumb-JSON-LD ausgibt, dazu die Helmet-Tags und ein Self-Canonical pro Route.",
      "Ein Prerender-Schritt nach dem Build, der 20 echte HTML-Dateien schreibt, eine pro Route, plus eine 404.html, die in allen drei Bot-Tags noindex sagt.",
      "Ein lazy geladenes WebGL-Aurora-Band, Seitenübergänge mit framer-motion und sanftes Scrollen, das sich zurückzieht, wenn man weniger Bewegung verlangt.",
    ],
    qualityAndSecurity: [
      "Die CI hängt jeden Push und Pull Request an Typecheck, Lint, 89 Unit-Tests, zwei SEO-Guard-Skripte und den Produktions-Build.",
      "Die Produktion läuft hinter einer Content-Security-Policy in der vercel.json, per Host eingegrenzt, damit Preview-Deployments unberührt bleiben.",
      "Das GitHub-Token für das Contributions-Widget liegt in einer Vercel-Serverless-Funktion. Es erreicht das Client-Bundle nie.",
      "Zugängliche, responsive, Reduced-Motion-bewusste UI auf shadcn/ui- und Radix-Primitiven.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Echte Animation und einen WebGL-Hintergrund ausliefern, ohne das mit Ladezeit oder Zugänglichkeit zu bezahlen.",
        solution:
          "Manuelles Chunking, ein Hintergrund, der lazy lädt und vom kritischen Pfad wegbleibt, und Animation, die sich unter Reduced-Motion still zurückzieht.",
      },
      {
        challenge:
          "Ein einziger Catch-all-Rewrite in der vercel.json machte aus jeder Müll-URL einen Soft-404, weil ein Rewrite immer nur mit 200 antworten kann.",
        solution:
          "Den Rewrite entfernt und den Prerender-Schritt eine echte Datei hinter jede Route legen lassen, damit Vercel für alles andere die 404.html mit echtem 404-Status ausliefert.",
      },
    ],
    hiringSignals: [
      "Ich kann ein deployed Produkt allein verantworten: Architektur, Inhalt, vier Sprachen, SEO und Design.",
      "Ich behandle SEO und Maschinenlesbarkeit als Engineering. Strukturierte Daten müssen beschreiben, was die Seite wirklich zeigt, sonst sind sie Spam.",
      "Ich messe die Kosten meiner eigenen Entscheidungen. Ich habe einen Barrel-Import gefunden, der 281 kB in den Entry-Chunk zog, und ihn behoben.",
    ],
    nextIterations: [
      "Strukturierte Daten für die Seiten, die noch kein eigenes Schema haben.",
      "Eine Prüfung, die einen de-, fr- oder zh-String erkennt, der noch auf seinem englischen Wert steht, weil das Typsystem nur die Form garantiert.",
    ],
    tags: ["React", "TypeScript", "Vite", "SEO"],
    stats: [
      { value: "4", label: "Sprachen" },
      { value: "0", label: "i18n-Libraries" },
      { value: "20", label: "vorgerenderte Routen" },
      { value: "89", label: "Tests" },
    ],
    impactHeading: "Wofür dieses Projekt gut ist",
    impactPoints: [
      "Zeigt meine Arbeit Recruitern in ihrer eigenen Sprache.",
      "Bleibt für Suchmaschinen und KI-Crawler lesbar, weil jede Route eine echte Datei mit strukturierten Daten darin ist.",
      "Die Seite ist das Beispiel, also muss man hier nichts auf Vertrauen hinnehmen.",
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
    problemStatement:
      "Un portfolio de développeur doit convaincre deux lecteurs très différents : un recruteur qui survole sur son téléphone, et un crawler qui ne voit que du markup. La plupart des sites choisissent l'un et haussent les épaules pour l'autre. J'ai construit pour les deux, du texte lisible pour les humains et des données structurées pour les machines, sur une SPA rapide et accessible.",
    objectives: [
      "Être réellement multilingue (en, de, fr, zh), avec un texte écrit par langue, pas un bouton de traduction ajouté à la fin.",
      "Traiter le SEO et la lisibilité machine comme de l'architecture : des données structurées sur chaque page et un vrai fichier HTML derrière chaque route.",
      "Rester rapide et accessible tout en livrant de vraies animations et un fond WebGL.",
    ],
    architectureDecisions: [
      "React 19, TypeScript et Vite avec un découpage manuel des chunks, et le fond WebGL chargé en lazy pour qu'il ne soit jamais sur le chemin critique.",
      "Une i18n écrite à la main : un module typé par langue, recomposé en un seul objet, l'anglais dans le bundle et les trois autres récupérés à la demande.",
      "Le contenu vit en dossiers de petits modules derrière un index stable (projets, traductions, données SEO), donc ajouter du contenu ne change jamais l'API que ses consommateurs importent.",
      "Les sections s'importent par chemin de module, jamais par un barrel. Passer par un barrel faisait de chaque section une dépendance statique du chunk d'entrée et coûtait 281 ko, 113 ko gzippés, au premier chargement.",
    ],
    implementationHighlights: [
      "Une interface en quatre langues pilotée par une source de vérité Language typée et des modules de texte par langue.",
      "Un composant SEO qui émet du JSON-LD Person et breadcrumb en plus des balises Helmet et d'un canonique propre à chaque route.",
      "Une étape de prérendu après le build qui écrit 20 vrais fichiers HTML, un par route, plus un 404.html qui dit noindex dans les trois balises de bots.",
      "Un ruban d'aurore WebGL en lazy, des transitions framer-motion, et un défilement doux qui se retire si vous demandez moins de mouvement.",
    ],
    qualityAndSecurity: [
      "La CI conditionne chaque push et chaque pull request au typecheck, au lint, à 89 tests unitaires, à deux scripts de garde SEO et au build de production.",
      "La production tourne derrière une Content-Security-Policy dans vercel.json, restreinte par hôte pour que les déploiements de preview ne soient pas touchés.",
      "Le jeton GitHub du widget de contributions vit dans une fonction serverless Vercel. Il n'atteint jamais le bundle client.",
      "Une interface accessible, responsive et attentive au mouvement réduit, bâtie sur les primitives shadcn/ui et Radix.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Livrer de vraies animations et un fond WebGL sans le payer en temps de chargement ni en accessibilité.",
        solution:
          "Un découpage manuel des chunks, un fond qui charge en lazy et reste hors du chemin critique, et des animations qui se retirent discrètement sous mouvement réduit.",
      },
      {
        challenge:
          "Une seule réécriture attrape-tout dans vercel.json transformait chaque URL parasite en 404 douce, parce qu'une réécriture ne peut répondre que 200.",
        solution:
          "Retiré la réécriture et laissé l'étape de prérendu poser un vrai fichier derrière chaque route, si bien que Vercel sert 404.html avec un vrai statut 404 pour tout le reste.",
      },
    ],
    hiringSignals: [
      "Je peux porter seul un produit déployé : architecture, contenu, quatre langues, SEO et design.",
      "Je traite le SEO et la lisibilité machine comme de l'ingénierie. Les données structurées doivent décrire ce que la page montre vraiment, sinon c'est du spam.",
      "Je mesure le coût de mes propres décisions. J'ai trouvé un import par barrel qui tirait 281 ko dans le chunk d'entrée, et je l'ai corrigé.",
    ],
    nextIterations: [
      "Des données structurées pour les pages qui n'ont pas encore leur propre schéma.",
      "Un contrôle qui repère une chaîne de, fr ou zh restée sur sa valeur anglaise, puisque le système de types ne garantit que la forme.",
    ],
    tags: ["React", "TypeScript", "Vite", "SEO"],
    stats: [
      { value: "4", label: "langues" },
      { value: "0", label: "bibliothèques i18n" },
      { value: "20", label: "routes prérendues" },
      { value: "89", label: "tests" },
    ],
    impactHeading: "À quoi sert ce projet",
    impactPoints: [
      "Présente mon travail aux recruteurs dans leur propre langue.",
      "Reste lisible pour les moteurs de recherche et les crawlers d'IA, parce que chaque route est un vrai fichier avec des données structurées dedans.",
      "Le site est l'échantillon, donc rien ici n'est à prendre sur parole.",
    ],
  },
  zh: {
    tagline: "你此刻正在读的这个站。是的，它本身就是作品。",
    description:
      "我的个人作品集：一个快速的 React 单页应用，四种语言的 i18n 由我自己写，每页都有 JSON-LD 结构化数据，每条路由都对应一个真实的预渲染 HTML 文件，还有一层不占关键路径的 WebGL 背景。",
    overview:
      "多数作品集都是把模板里的名字换成自己的。我想让我的这一份本身就是作品。它跑在 React、TypeScript 和 Vite 上：四种语言背后是我自己写的 i18n 层（英文打进包里，另外三种按需加载），每页都有 JSON-LD，好让搜索引擎和抓取程序真的读得懂，页面切换用 framer-motion，还有一条懒加载的 WebGL 极光带。每条路由同时会输出一个真实的预渲染 HTML 文件，所以那些从不执行 JavaScript 的链接预览服务，也照样能拿到正确的标题和卡片。",
    roleSummary: "只有我：架构、四种语言、SEO，以及整套视觉。",
    problemStatement:
      "一份开发者作品集要说服两种截然不同的读者：一个在手机上快速翻看的招聘者，和一个只看得见标签的抓取程序。多数站点会选一个，然后对另一个耸耸肩。我为两者都做了：给人看的是能读的文字，给机器看的是结构化数据，底下是一个快速、可访问的单页应用。",
    objectives: [
      "真正做到多语言（en、de、fr、zh），文案按语言分别写，而不是最后挂一个翻译开关。",
      "把 SEO 和机器可读性当成架构：每页都有结构化数据，每条路由背后都有一个真实的 HTML 文件。",
      "在保持快速和可访问的同时，仍然交付真实的动效和一层 WebGL 背景。",
    ],
    architectureDecisions: [
      "React 19、TypeScript 和 Vite，手动分包，WebGL 背景懒加载，绝不落在关键路径上。",
      "i18n 手写：每种语言一个带类型的模块，再合成一个对象，英文在包内，另外三种按需取回。",
      "内容以小模块目录的形式存放在一个稳定的索引之后（项目、翻译、SEO 数据），所以新增内容永远不会改变使用方 import 的那套 API。",
      "各个 section 按模块路径 import，绝不走 barrel。走 barrel 会让每个 section 都变成入口 chunk 的静态依赖，首屏因此多出 281 kB，gzip 后 113 kB。",
    ],
    implementationHighlights: [
      "四语言界面，由一个带类型的 Language 单一真源和按语言拆分的文案模块驱动。",
      "一个 SEO 组件，除 Helmet 标签和每条路由的自指 canonical 之外，还输出 Person 与面包屑的 JSON-LD。",
      "构建之后有一步预渲染，写出 20 个真实的 HTML 文件，一条路由一个，另加一个在三处 bot 标签里都写着 noindex 的 404.html。",
      "一条懒加载的 WebGL 极光带、framer-motion 的页面转场，以及在你要求减少动态时会自行退下的平滑滚动。",
    ],
    qualityAndSecurity: [
      "CI 对每次推送和 PR 都设了闸：类型检查、lint、89 个单元测试、两个 SEO 守卫脚本，以及生产构建。",
      "生产环境跑在 vercel.json 里的一条 Content-Security-Policy 之后，按主机名限定，因此预览部署不受影响。",
      "贡献图用到的 GitHub token 放在一个 Vercel 无服务器函数里，永远不会进到客户端包。",
      "基于 shadcn/ui 与 Radix 基元的界面，可访问、响应式，并顾及减少动态的偏好。",
    ],
    challengesAndSolutions: [
      {
        challenge: "既要交付真实的动效和一层 WebGL 背景，又不能拿加载时间或可访问性去换。",
        solution: "手动分包，背景懒加载并留在关键路径之外，动效在减少动态的偏好下安静退下。",
      },
      {
        challenge: "vercel.json 里一条通配重写，把每个垃圾 URL 都变成了软 404，因为重写只能回 200。",
        solution: "去掉那条重写，让预渲染步骤给每条路由都放一个真实文件，其余路径 Vercel 就会以真正的 404 状态送出 404.html。",
      },
    ],
    hiringSignals: [
      "我能独自负责一个已上线的产品：架构、内容、四种语言、SEO 和设计。",
      "我把 SEO 和机器可读性当工程做。结构化数据必须描述页面真的展示了什么，否则那就是垃圾信息。",
      "我会衡量自己决策的代价。我发现一个 barrel import 往入口 chunk 里拖了 281 kB，然后把它改掉了。",
    ],
    nextIterations: [
      "给还没有自己 schema 的页面补上结构化数据。",
      "加一道检查，抓出 de、fr、zh 里仍停留在英文原值的字符串，毕竟类型系统只保证结构。",
    ],
    tags: ["React", "TypeScript", "Vite", "SEO"],
    stats: [
      { value: "4", label: "语言" },
      { value: "0", label: "i18n 库" },
      { value: "20", label: "预渲染路由" },
      { value: "89", label: "测试" },
    ],
    impactHeading: "这个项目有什么用",
    impactPoints: [
      "用招聘者自己的语言展示我的工作。",
      "对搜索引擎和 AI 抓取程序都保持可读，因为每条路由都是一个内含结构化数据的真实文件。",
      "这个站本身就是样本，所以这里没有什么需要你先信了再说。",
    ],
  },
};
