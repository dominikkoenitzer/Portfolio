import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

const ADDRESS_CODE = `const visitorAddress = async (): Promise<string> => {
  const headerList = await headers();
  const realIp = headerList.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const hops =
    headerList
      .get("x-forwarded-for")
      ?.split(",")
      .map((hop) => hop.trim())
      .filter(Boolean) ?? [];
  return hops[hops.length - 1] ?? "";
};`;

export const senbon: Record<Language, LocalizedContent> = {
  en: {
    tagline: "A journal that refuses to be found on Google. On purpose.",
    description:
      "Senbon is my markdown journal: plain files with four frontmatter keys, rendered into an unhurried reading page. It runs without a CMS or third-party trackers, and every response carries noindex.",
    overview:
      "I wanted somewhere to write that was not optimized to death. Every entry in Senbon (千本, \"one thousand\") is a markdown file with four frontmatter keys, committed to the repo, and the site rebuilds when I push. Next.js App Router and React Server Components turn those files into a reading page, and a robots file plus an X-Robots-Tag header tell search engines and AI crawlers to leave. Most of the work since has been subtraction: a command palette, full-text search, tag filters, pagination, a table of contents, reading-time estimates and a canvas background were all built and then deleted. Three routes do not need a launcher, and a few hundred words do not need a progress bar.",
    roleSummary: "Just me, and lately mostly deleting things I had already written.",
    sections: [
      {
        heading: "Search engines are let in so they can read the noindex",
        body: [
          "The obvious way to keep a site out of Google is a robots.txt that disallows everything, and it does the opposite. A crawler that may not fetch a page never sees its noindex, so the bare URL still gets indexed from any outside link that points at it.",
          "So robots.ts allows every crawler by default, and next.config.ts puts an X-Robots-Tag header with noindex, nofollow, noarchive, nosnippet, noimageindex, noai and noimageai on every response. The root layout says noindex in its metadata as well. The site also ships without a sitemap, an Open Graph image or structured data.",
          "AI crawlers are the one group that is shut out at the door. For them the aim is to stop the fetch itself, which is exactly what robots.txt is for, so 21 of them are named and disallowed.",
        ],
      },
      {
        heading: "A folder of markdown files is the whole database",
        body: [
          "Entries live in content/journal, one file each. The loader reads the folder, parses the frontmatter with gray-matter and sorts newest first. The slug is the filename, and the four keys are title, excerpt, publishedAt and tags. Every read is wrapped in React.cache, so a page that asks for the list twice reads the disk once.",
          "The path to that folder is written out as literals on purpose. Turbopack resolves filesystem access statically, and a directory it cannot follow, such as one built from an imported constant, makes it trace the whole project into the server bundle.",
          "Rendering goes through react-markdown with remark-gfm and rehype-highlight, and without rehype-raw, so raw HTML in a file is never passed through to the page.",
        ],
        figure: 1,
      },
      {
        heading: "The guestbook checks a signature before it stores one",
        body: [
          "Signing is a server action, and the database is only ever reached from the server. The form carries a hidden honeypot field with a deliberately dull name, because browsers autofill fields called website or email, and a hidden one filled that way would throw away a real visitor as a bot. A bot that fills it gets the same success message a real signature would get in the current mode, and nothing is written.",
          "Everything else goes through pure functions that are unit tested on their own. Zero-width and bidirectional control characters are stripped first, since they are useless to an honest signer and let a link slip past the filter. Links are caught in their obvious forms and the spelled-out ones like spam dot com. Short slurs are matched only as whole words, after an earlier version rejected raccoon and cocoon. A keyboard mash is caught by three separate signals.",
          "The length caps of 40 and 280 characters are enforced in three places: the constants the form reads, the sign action, and CHECK constraints in the migration.",
        ],
      },
      {
        heading: "The rate limit counts in the database, per hashed visitor",
        body: [
          "One signature per visitor every 30 seconds, counted against the entries table itself, so the limit survives serverless instances starting and stopping. The visitor address is stored only as an HMAC keyed by a server secret, so the table holds nothing that leads back to an address.",
          "The address comes from the platform's x-real-ip header, or the right-most hop of x-forwarded-for. The left-most entries are whatever the client sent, and keying on them would let a script send a new value per request. A request with no usable address shares one bucket with every other such request. That rule exists because the limiter once failed open when the address was missing.",
          "Moderation is a password-gated admin page with a signed session cookie. Whether new signatures go straight onto the wall or wait for approval is a switch stored in the database, read at the moment of writing, and the confirmation says which of the two actually happened.",
        ],
        code: {
          language: "ts",
          text: ADDRESS_CODE,
          caption:
            "From app/guestbook/actions.ts, with its comments left out. The right-most forwarded hop is the one the platform appended; the ones before it can be forged by the client.",
        },
      },
      {
        heading: "Things I built, measured and took back out",
        body: [
          "Route changes ran through React's ViewTransition for a few hours, with each journal card's title morphing into the entry's headline. It needed an experimental flag that moves the whole app onto a prerelease React build, and clicks stalled for seconds while the server answered in under 0.4 s. I reverted it.",
          "The background used to have eleven layers, including three SVG ribbons and several large blur filters. It has three CSS layers now. Nine shadcn components that nothing imported went too, along with their five Radix dependencies, and so did a Tailwind config file that nothing loaded and whose colours disagreed with the real ones.",
        ],
      },
    ],
    captions: [
      "The home page: the site's name and two cards, one to the journal and one to the guestbook, on the warm background.",
      "The journal index, newest first: each card is one markdown file, with its title, its excerpt and a relative date.",
    ],
    tags: ["Next.js", "React 19", "Markdown", "Journal"],
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
      "Senbon ist mein Markdown-Journal: einfache Dateien mit vier Frontmatter-Feldern, gerendert zu einer Leseseite ohne Eile. Es läuft ohne CMS und ohne Fremdtracker, und jede Antwort trägt noindex.",
    overview:
      "Ich wollte einen Ort zum Schreiben, der nicht zu Tode optimiert ist. Jeder Eintrag in Senbon (千本, „eintausend“) ist eine Markdown-Datei mit vier Frontmatter-Feldern, ins Repo committet, und die Seite baut sich neu, wenn ich pushe. Next.js App Router und React Server Components machen aus diesen Dateien eine Leseseite, und eine robots-Datei plus ein X-Robots-Tag-Header sagen Suchmaschinen und KI-Crawlern, sie sollen gehen. Die meiste Arbeit seither war Subtraktion: eine Befehlspalette, Volltextsuche, Tag-Filter, Pagination, ein Inhaltsverzeichnis, Lesezeit-Schätzungen und ein Canvas-Hintergrund wurden alle gebaut und dann gelöscht. Drei Routen brauchen keinen Launcher, und ein paar hundert Wörter brauchen keinen Fortschrittsbalken.",
    roleSummary: "Nur ich, und in letzter Zeit hauptsächlich beim Löschen des eigenen Codes.",
    sections: [
      {
        heading: "Suchmaschinen dürfen rein, damit sie das noindex lesen",
        body: [
          "Der naheliegende Weg, eine Seite aus Google herauszuhalten, ist eine robots.txt, die alles verbietet, und sie bewirkt das Gegenteil. Ein Crawler, der eine Seite nicht abrufen darf, sieht ihr noindex nie, also landet die nackte URL trotzdem im Index, sobald irgendwo ein Link darauf zeigt.",
          "Deshalb erlaubt robots.ts standardmässig jeden Crawler, und next.config.ts setzt auf jede Antwort einen X-Robots-Tag-Header mit noindex, nofollow, noarchive, nosnippet, noimageindex, noai und noimageai. Das Root-Layout sagt noindex zusätzlich in seinen Metadaten. Eine Sitemap, ein Open-Graph-Bild oder strukturierte Daten liefert die Seite gar nicht erst aus.",
          "KI-Crawler sind die eine Gruppe, die schon an der Tür abgewiesen wird. Bei ihnen geht es darum, schon den Abruf zu verhindern, und genau dafür ist robots.txt da, also sind 21 von ihnen namentlich gesperrt.",
        ],
      },
      {
        heading: "Ein Ordner mit Markdown-Dateien ist die ganze Datenbank",
        body: [
          "Die Einträge liegen in content/journal, eine Datei pro Eintrag. Der Loader liest den Ordner, parst das Frontmatter mit gray-matter und sortiert die neuesten zuerst. Der Slug ist der Dateiname, und die vier Felder sind title, excerpt, publishedAt und tags. Jeder Lesezugriff steckt in React.cache, eine Seite, die zweimal nach der Liste fragt, liest die Festplatte also nur einmal.",
          "Der Pfad zu diesem Ordner steht mit Absicht als Literal im Code. Turbopack löst Dateizugriffe statisch auf, und ein Verzeichnis, dem es nicht folgen kann, etwa eines aus einer importierten Konstante, bringt es dazu, das ganze Projekt ins Server-Bundle zu ziehen.",
          "Gerendert wird mit react-markdown, remark-gfm und rehype-highlight, und ohne rehype-raw, rohes HTML in einer Datei kommt also nie bis auf die Seite.",
        ],
        figure: 1,
      },
      {
        heading: "Das Gästebuch prüft einen Eintrag, bevor es ihn speichert",
        body: [
          "Das Unterschreiben ist eine Server Action, und die Datenbank wird nur vom Server aus erreicht. Das Formular hat ein verstecktes Honeypot-Feld mit bewusst langweiligem Namen, weil Browser Felder namens website oder email automatisch ausfüllen, und ein verstecktes Feld, das so gefüllt wird, würde einen echten Besucher als Bot verwerfen. Ein Bot, der es ausfüllt, bekommt dieselbe Erfolgsmeldung wie ein echter Eintrag im aktuellen Modus, und gespeichert wird nichts.",
          "Alles andere läuft durch reine Funktionen, die einzeln getestet sind. Zuerst fallen Zeichen mit Nullbreite und bidirektionale Steuerzeichen weg, weil sie ehrlichen Besuchern nichts bringen und einen Link am Filter vorbeischmuggeln. Links werden in ihrer offensichtlichen Form erkannt und auch ausgeschrieben, wie spam dot com. Kurze Beleidigungen werden nur als ganze Wörter erkannt, nachdem eine frühere Version raccoon und cocoon abgelehnt hatte. Wildes Tastaturgehämmer fällt über drei voneinander unabhängige Signale auf.",
          "Die Längengrenzen von 40 und 280 Zeichen gelten an drei Stellen: in den Konstanten, die das Formular liest, in der Server Action und als CHECK-Constraints in der Migration.",
        ],
      },
      {
        heading: "Das Rate-Limit zählt in der Datenbank, pro gehashtem Besucher",
        body: [
          "Ein Eintrag pro Besucher alle 30 Sekunden, gezählt direkt in der Tabelle mit den Einträgen, damit die Grenze auch hält, wenn Serverless-Instanzen starten und verschwinden. Die Adresse des Besuchers wird nur als HMAC mit einem Server-Secret gespeichert, in der Tabelle steht also nichts, das zu einer Adresse zurückführt.",
          "Die Adresse kommt aus dem x-real-ip-Header der Plattform oder aus dem letzten Eintrag von x-forwarded-for. Die vorderen Einträge schickt der Client selbst, und wer darauf schlüsselt, lässt ein Skript bei jeder Anfrage einen neuen Wert mitschicken. Anfragen ohne brauchbare Adresse teilen sich alle einen gemeinsamen Topf. Diese Regel gibt es, weil das Limit einmal ganz offen stand, als die Adresse fehlte.",
          "Moderiert wird auf einer passwortgeschützten Admin-Seite mit signiertem Session-Cookie. Ob neue Einträge direkt an die Wand gehen oder auf Freigabe warten, ist ein Schalter in der Datenbank, der im Moment des Schreibens gelesen wird, und die Bestätigung sagt, welcher der beiden Fälle wirklich eingetreten ist.",
        ],
        code: {
          language: "ts",
          text: ADDRESS_CODE,
          caption:
            "Aus app/guestbook/actions.ts, ohne die Kommentare. Der letzte weitergeleitete Hop ist der, den die Plattform angehängt hat; die davor kann der Client fälschen.",
        },
      },
      {
        heading: "Gebaut, gemessen und wieder ausgebaut",
        body: [
          "Seitenwechsel liefen ein paar Stunden lang über Reacts ViewTransition, wobei der Titel jeder Journalkarte in die Überschrift des Eintrags überging. Dafür brauchte es ein experimentelles Flag, das die ganze App auf eine Vorabversion von React umstellt, und Klicks hingen sekundenlang, während der Server in unter 0,4 s antwortete. Ich habe es zurückgebaut.",
          "Der Hintergrund hatte früher elf Ebenen, darunter drei SVG-Bänder und mehrere grosse Blur-Filter. Heute sind es drei CSS-Schichten. Neun shadcn-Komponenten, die nirgends importiert wurden, sind ebenfalls weg, mitsamt ihren fünf Radix-Abhängigkeiten, und auch eine Tailwind-Konfiguration, die nichts geladen hat und deren Farben den echten widersprachen.",
        ],
      },
    ],
    captions: [
      "Die Startseite: der Name der Seite und zwei Karten, eine zum Journal und eine zum Gästebuch, auf dem warmen Hintergrund.",
      "Die Journalübersicht, die neuesten zuerst: Jede Karte ist eine Markdown-Datei, mit Titel, Auszug und relativem Datum.",
    ],
    tags: ["Next.js", "React 19", "Markdown", "Journal"],
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
      "Senbon est mon journal en markdown : de simples fichiers avec quatre clés de frontmatter, rendus en une page de lecture sans hâte. Il tourne sans CMS ni traqueur tiers, et chaque réponse porte noindex.",
    overview:
      "Je voulais un endroit pour écrire qui ne soit pas optimisé à mort. Chaque entrée de Senbon (千本, « mille ») est un fichier markdown avec quatre clés de frontmatter, commité dans le dépôt, et le site se reconstruit quand je pousse. Next.js App Router et les React Server Components transforment ces fichiers en une page de lecture, et un fichier robots plus un en-tête X-Robots-Tag disent aux moteurs et aux crawlers d'IA de repartir. L'essentiel du travail depuis a été de la soustraction : une palette de commandes, une recherche plein texte, des filtres par tag, la pagination, une table des matières, des estimations de temps de lecture et un fond en canvas ont tous été construits puis supprimés. Trois routes n'ont pas besoin d'un lanceur, et quelques centaines de mots n'ont pas besoin d'une barre de progression.",
    roleSummary: "Moi seul, et ces derniers temps surtout à supprimer mon propre code.",
    sections: [
      {
        heading: "Les moteurs de recherche entrent, pour pouvoir lire le noindex",
        body: [
          "La manière évidente de garder un site hors de Google est un robots.txt qui interdit tout, et elle produit l'effet inverse. Un crawler qui n'a pas le droit de charger une page ne voit jamais son noindex, et l'URL nue finit quand même dans l'index dès qu'un lien extérieur pointe dessus.",
          "robots.ts autorise donc tous les crawlers par défaut, et next.config.ts pose sur chaque réponse un en-tête X-Robots-Tag avec noindex, nofollow, noarchive, nosnippet, noimageindex, noai et noimageai. Le layout racine dit aussi noindex dans ses métadonnées. Le site ne publie par ailleurs ni sitemap, ni image Open Graph, ni données structurées.",
          "Les crawlers d'IA sont le seul groupe arrêté dès la porte. Pour eux, le but est d'empêcher le chargement lui-même, ce qui est précisément le rôle de robots.txt, et 21 d'entre eux sont donc nommés et bloqués.",
        ],
      },
      {
        heading: "Un dossier de fichiers markdown fait toute la base de données",
        body: [
          "Les entrées vivent dans content/journal, un fichier chacune. Le chargeur lit le dossier, analyse le frontmatter avec gray-matter et trie du plus récent au plus ancien. Le slug est le nom du fichier, et les quatre clés sont title, excerpt, publishedAt et tags. Chaque lecture passe par React.cache, si bien qu'une page qui demande la liste deux fois ne lit le disque qu'une fois.",
          "Le chemin de ce dossier est écrit en littéraux, exprès. Turbopack résout les accès au système de fichiers de façon statique, et un dossier qu'il ne peut pas suivre, par exemple construit à partir d'une constante importée, lui fait embarquer tout le projet dans le bundle serveur.",
          "Le rendu passe par react-markdown avec remark-gfm et rehype-highlight, sans rehype-raw, donc le HTML brut d'un fichier n'arrive jamais jusqu'à la page.",
        ],
        figure: 1,
      },
      {
        heading: "Le livre d'or vérifie une signature avant de l'enregistrer",
        body: [
          "Signer est une server action, et la base de données n'est jamais jointe que depuis le serveur. Le formulaire contient un champ pot de miel caché au nom volontairement terne, parce que les navigateurs remplissent automatiquement les champs appelés website ou email, et un champ caché rempli ainsi ferait rejeter un vrai visiteur comme un bot. Un bot qui le remplit reçoit le même message de succès qu'une vraie signature dans le mode en cours, et rien n'est écrit.",
          "Tout le reste passe par des fonctions pures, testées chacune de leur côté. Les caractères de largeur nulle et les contrôles bidirectionnels sont retirés en premier, car ils ne servent à rien à un signataire honnête et permettent de glisser un lien sous le filtre. Les liens sont repérés sous leur forme évidente et sous leur forme épelée, comme spam dot com. Les insultes courtes ne sont reconnues que comme mots entiers, après qu'une version antérieure a refusé raccoon et cocoon. Le martèlement de clavier est détecté par trois signaux indépendants.",
          "Les limites de 40 et 280 caractères sont appliquées à trois endroits : les constantes que lit le formulaire, la server action et des contraintes CHECK dans la migration.",
        ],
      },
      {
        heading: "La limite de débit compte dans la base, par visiteur haché",
        body: [
          "Une signature par visiteur toutes les 30 secondes, comptée directement dans la table des entrées, pour que la limite tienne quand des instances serverless démarrent et s'arrêtent. L'adresse du visiteur n'est stockée que sous forme de HMAC avec un secret serveur, et la table ne contient rien qui ramène à une adresse.",
          "L'adresse vient de l'en-tête x-real-ip de la plateforme, ou du saut le plus à droite de x-forwarded-for. Les entrées de gauche sont ce que le client a envoyé, et s'appuyer dessus laisserait un script envoyer une nouvelle valeur à chaque requête. Une requête sans adresse exploitable partage un seul compteur avec toutes les autres dans le même cas. Cette règle existe parce que la limite s'est déjà ouverte en grand quand l'adresse manquait.",
          "La modération se fait sur une page d'administration protégée par mot de passe, avec un cookie de session signé. Que les nouvelles signatures aillent directement sur le mur ou attendent une validation, c'est un interrupteur stocké dans la base, lu au moment de l'écriture, et la confirmation dit lequel des deux cas s'est réellement produit.",
        ],
        code: {
          language: "ts",
          text: ADDRESS_CODE,
          caption:
            "Tiré de app/guestbook/actions.ts, sans ses commentaires. Le saut le plus à droite est celui que la plateforme a ajouté ; ceux qui le précèdent peuvent être falsifiés par le client.",
        },
      },
      {
        heading: "Construit, mesuré, puis retiré",
        body: [
          "Les changements de route sont passés quelques heures par la ViewTransition de React, le titre de chaque carte du journal se transformant en titre de l'entrée. Il fallait un drapeau expérimental qui fait tourner toute l'application sur une version préliminaire de React, et les clics restaient bloqués plusieurs secondes alors que le serveur répondait en moins de 0,4 s. Je l'ai retiré.",
          "Le fond avait autrefois onze couches, dont trois rubans SVG et plusieurs grands filtres de flou. Il a aujourd'hui trois couches CSS. Neuf composants shadcn que rien n'importait sont partis aussi, avec leurs cinq dépendances Radix, tout comme un fichier de configuration Tailwind que rien ne chargeait et dont les couleurs contredisaient les vraies.",
        ],
      },
    ],
    captions: [
      "La page d'accueil : le nom du site et deux cartes, l'une vers le journal, l'autre vers le livre d'or, sur le fond chaud.",
      "L'index du journal, du plus récent au plus ancien : chaque carte est un fichier markdown, avec son titre, son extrait et une date relative.",
    ],
    tags: ["Next.js", "React 19", "Markdown", "Journal"],
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
      "Senbon 是我的 markdown 日志：普通文件，四个 frontmatter 字段，渲染成一页不催人的阅读页。它不用 CMS，也没有第三方追踪，每个响应都带着 noindex。",
    overview:
      "我想要一个写字的地方，不必被优化到死。Senbon（千本）里的每一篇都是一个 markdown 文件，只有四个 frontmatter 字段，提交进仓库，我一推送站点就重建。Next.js 的 App Router 和 React 服务端组件把这些文件变成一页可读的东西，而一个 robots 文件加上 X-Robots-Tag 响应头，则请搜索引擎和 AI 抓取程序离开。此后大部分工作其实是减法：命令面板、全文搜索、标签筛选、分页、目录、阅读时长估算和一层 canvas 背景，全都做过，然后又都删了。三条路由用不上启动器，几百个字也用不上进度条。",
    roleSummary: "只有我，而最近主要是在删自己写过的东西。",
    sections: [
      {
        heading: "放搜索引擎进来，它们才读得到 noindex",
        body: [
          "想让网站不进谷歌，最直接的做法是写一个禁止一切的 robots.txt，而它的效果恰恰相反。不许抓取某个页面的爬虫永远看不到那页的 noindex，只要外面有链接指过来，这个光秃秃的 URL 照样会被收录。",
          "所以 robots.ts 默认允许所有爬虫，next.config.ts 则在每个响应上加一个 X-Robots-Tag 头，内容是 noindex、nofollow、noarchive、nosnippet、noimageindex、noai 和 noimageai。根布局的元数据里也写了 noindex。网站也不提供 sitemap、Open Graph 图片或结构化数据。",
          "AI 爬虫是唯一在门口就被拦下的一类。对它们来说，目的是连抓取本身都阻止，这正是 robots.txt 的本职，所以其中 21 个被点名禁止。",
        ],
      },
      {
        heading: "一个 markdown 文件夹就是全部的数据库",
        body: [
          "日志放在 content/journal 里，一篇一个文件。加载器读取这个文件夹，用 gray-matter 解析 frontmatter，再按时间从新到旧排序。slug 就是文件名，四个字段是 title、excerpt、publishedAt 和 tags。每次读取都包在 React.cache 里，所以一个页面要两次列表，也只读一次磁盘。",
          "这个文件夹的路径是故意用字面量写死的。Turbopack 静态解析文件系统访问，遇到它跟踪不了的目录，比如由导入的常量拼出来的路径，就会把整个项目都打进服务端包里。",
          "渲染用的是 react-markdown，配 remark-gfm 和 rehype-highlight，但没有 rehype-raw，所以文件里的原始 HTML 永远不会原样出现在页面上。",
        ],
        figure: 1,
      },
      {
        heading: "留言簿先检查，再保存",
        body: [
          "签名是一个 server action，数据库只会从服务端访问。表单里有一个隐藏的蜜罐字段，名字故意起得很平淡，因为浏览器会自动填写叫 website 或 email 的字段，隐藏字段一旦被这样填上，真实访客就会被当成机器人丢掉。填了它的机器人会收到和当前模式下真实签名一模一样的成功提示，而数据库里什么也没写。",
          "其余检查都是纯函数，各自单独测试。零宽字符和双向控制字符最先被去掉，它们对诚实的访客毫无用处，却能让链接混过过滤。链接无论是直接写出来，还是拼成 spam dot com 这种形式，都会被识别。较短的侮辱词只按完整单词匹配，因为之前的一个版本把 raccoon 和 cocoon 都拒了。乱敲键盘则由三个互相独立的信号来判断。",
          "名字 40 个字符、留言 280 个字符的上限在三处执行：表单读取的常量、server action，以及迁移里的 CHECK 约束。",
        ],
      },
      {
        heading: "频率限制记在数据库里，按哈希后的访客计算",
        body: [
          "每位访客每 30 秒只能签一次，直接按留言表本身来计数，这样 serverless 实例起起停停，限制依然有效。访客地址只以 HMAC 的形式保存，密钥在服务端，所以表里没有任何能追回地址的东西。",
          "地址取自平台设置的 x-real-ip 头，或者 x-forwarded-for 最右边的那一跳。左边那些是客户端自己填的，拿它们当依据，脚本就可以每次请求换一个新值。拿不到可用地址的请求，全都共用同一个计数。有这条规则，是因为限制曾经在缺少地址时完全失效过。",
          "审核在一个有密码保护的管理页面上进行，会话用签名的 cookie。新签名是直接上墙还是等待审核，是存在数据库里的一个开关，在写入那一刻读取，提示信息说的是实际发生的那一种。",
        ],
        code: {
          language: "ts",
          text: ADDRESS_CODE,
          caption:
            "摘自 app/guestbook/actions.ts，省略了注释。最右边的转发跳是平台追加的，前面那些都可能被客户端伪造。",
        },
      },
      {
        heading: "做过、量过，又拆掉的东西",
        body: [
          "路由切换曾经用 React 的 ViewTransition 跑了几个小时，每张日志卡片的标题会过渡成文章的大标题。它需要一个实验性开关，会把整个应用切到 React 的预发布版本上，结果点击要卡好几秒，而服务器的响应不到 0.4 秒。我把它撤掉了。",
          "背景以前有十一层，包括三条 SVG 光带和好几个大尺寸的模糊滤镜。现在只剩三层 CSS。九个从未被导入的 shadcn 组件也删了，连同它们的五个 Radix 依赖，还有一个没有任何东西加载、颜色又和真实配色对不上的 Tailwind 配置文件。",
        ],
      },
    ],
    captions: [
      "首页：站名和两张卡片，一张通往日志，一张通往留言簿，底色是暖色调。",
      "日志列表，从新到旧：每张卡片对应一个 markdown 文件，显示标题、摘要和相对日期。",
    ],
    tags: ["Next.js", "React 19", "Markdown", "Journal"],
    stats: [
      { value: "0", label: "第三方追踪器" },
      { value: "4", label: "frontmatter 字段" },
      { value: "3", label: "CSS 层" },
      { value: "noindex", label: "有意为之" },
    ],
  },
};
