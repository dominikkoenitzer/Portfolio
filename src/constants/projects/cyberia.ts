import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

const RACE_CODE = `const run = (candidate: string, skip: string[], timeout: number) => {
  const controller = new AbortController();
  controllers.push(controller);
  tried.push(candidate);
  pending += 1;
  void attempt(candidate, id, episode, audio, skip, { signal: controller.signal, timeout }).then((result) => {
    if (settled) return;
    all.push(result);
    pending -= 1;
    if (hasDirect(result)) return finish(result);
    if (pending) return;
    if (fallbackRan) finish(); else startFallback();
  });
};
function startFallback() {
  if (fallbackRan || settled) return;
  fallbackRan = true;
  const skip = [...new Set([...RACE_SKIP, ...racing.filter((c) => all.some((a) => a.candidate === c && !a.timedOut && !a.cancelled))])];
  run('auto', skip, Math.max(1, left()));
}`;

const en: LocalizedContent = {
  tagline: "An anime app for my own machine, built around waiting as little as possible.",
  description:
    "An anime discovery and streaming interface that runs locally: a React front end, an Express API and a small Python bridge. Most of the work went into answering fast and honestly when the sources behind it are slow or gone.",
  overview:
    "Cyberia is where I browse and watch anime at home. It runs only on my machine and is not published anywhere. The front end is React 19 with TypeScript and Vite, the catalogue comes from AniList, and an Express API sits between the browser and a Python bridge that listens on loopback and talks to the sources. The interface was the easy half. The hard half was the path from pressing play to a picture on screen, when every source behind it can be slow, broken or simply wrong.",
  roleSummary: "Just me: the interface, the API, the bridge and the tests.",
  sections: [
    {
      heading: "The first source that proves it plays gets to answer",
      body: [
        "When I press play, the API asks a short list of preferred sources at once. If none of them has produced something playable after six seconds, a wider search starts beside them, and the whole resolve is capped at 45 seconds. Past that it says plainly that nothing played instead of letting the spinner run.",
        "An answer only counts once it has been verified as real media. A page that merely returned 200 is not a stream. The first verified answer wins, and every other request still in flight is aborted through its own controller, so the losers stop costing anything the moment the race is decided.",
      ],
      code: {
        language: "ts",
        text: RACE_CODE,
        caption:
          "From server/app.ts, with the comments left out. Each attempt carries its own AbortController, the first attempt with verified direct media finishes the race, and the wider search only skips sources that failed for a real reason.",
      },
    },
    {
      heading: "Three memories, each with its own reason to forget",
      body: [
        "A resolved answer is reused for three minutes, but only after its first source has passed a fresh range request. Stream addresses expire, and serving one from memory without checking would hand the player a dead link.",
        "An episode where nothing played is remembered for 60 seconds, so the next attempt is told in milliseconds instead of paying the full race again. A source that just failed for a title is left out of the preferred list for 90 seconds, so episode two does not wait for it again. A source that was merely cancelled because another one won is not counted as a failure, and one that only ran out of time still gets its chance in the wider search.",
        "When I close a request halfway, nothing it saw is written down. An abandoned attempt says nothing about the title, so the caches stay exactly as they were.",
      ],
    },
    {
      heading: "Everything the player loads comes back through the app",
      body: [
        "Video arrives as playlists that point at segments on other hosts. The API rewrites every line of a playlist, including the addresses inside tags, so each segment is fetched through the app's own relay. The relay only talks to hosts it has learned from source results or its own configuration, never from anything the browser sends, and it follows redirects by hand so every hop is checked, not only the first.",
        "Subtitles come as SubRip or SubStation Alpha files, and a video track element accepts only WebVTT. The browser converts them itself, with its own parsers for both formats, before handing the result to the player.",
      ],
    },
    {
      heading: "A sandbox against the back button",
      body: [
        "Some sources only offer an external player, which runs in an iframe. A frame shares the tab's history, and ad scripts inside those pages called history.back(), which quietly pulled the whole app to an earlier route and changed the episode under me.",
        "The frame is now sandboxed. It may run scripts, use forms and go fullscreen, but it cannot navigate the top window, open popups or start downloads. The player itself still works, and the episode stays where I left it.",
      ],
    },
    {
      heading: "A still for every episode",
      body: [
        "The sources ship thumbnails for the first couple of dozen episodes at most. TMDB has a still for nearly every one, so it is the first choice and the source picture only the fallback.",
        "Matching them is less simple than it sounds. A sequel is often a later season of one show on TMDB, so the API picks the season that fits the episode count, or walks the seasons in order and adds up offsets. Some long-running shows number every season absolutely, so season two starts at 62, and there the offset is left out.",
      ],
      figure: 1,
    },
  ],
  captions: [
    "The home page: a large featured title with its episode countdown, genre chips below it, a tabbed grid of trending titles and a top airing list on the right.",
    "A title page: poster and banner at the top, tabs for overview, characters and episodes, and the synopsis, trailer and a details panel below.",
  ],
  tags: ["React", "TypeScript", "Express", "Python", "HLS"],
  stats: [
    { value: "466", label: "tests" },
    { value: "45 s", label: "longest wait for a source" },
    { value: "3 min", label: "reuse, re-checked each time" },
    { value: "60 s", label: "memory of a failed episode" },
  ],
};

const de: LocalizedContent = {
  tagline: "Eine Anime-App für meinen eigenen Rechner, gebaut, damit man möglichst wenig wartet.",
  description:
    "Eine Oberfläche zum Entdecken und Streamen von Anime, die lokal läuft: ein React-Frontend, eine Express-API und eine kleine Python-Brücke. Die meiste Arbeit steckt darin, schnell und ehrlich zu antworten, wenn die Quellen dahinter langsam oder weg sind.",
  overview:
    "Cyberia ist der Ort, an dem ich zu Hause Anime suche und schaue. Es läuft nur auf meinem Rechner und ist nirgends veröffentlicht. Das Frontend ist React 19 mit TypeScript und Vite, der Katalog kommt von AniList, und zwischen dem Browser und einer Python-Brücke, die nur auf Loopback lauscht und mit den Quellen spricht, sitzt eine Express-API. Die Oberfläche war die leichte Hälfte. Die schwere war der Weg vom Druck auf Play bis zum Bild auf dem Schirm, wenn jede Quelle dahinter langsam, kaputt oder schlicht falsch sein kann.",
  roleSummary: "Nur ich: die Oberfläche, die API, die Brücke und die Tests.",
  sections: [
    {
      heading: "Die erste Quelle, die beweist, dass sie läuft, darf antworten",
      body: [
        "Wenn ich auf Play drücke, fragt die API eine kurze Liste bevorzugter Quellen gleichzeitig an. Hat nach sechs Sekunden keine davon etwas Abspielbares geliefert, startet daneben eine breitere Suche, und die ganze Auflösung ist bei 45 Sekunden gedeckelt. Danach sagt sie klar, dass nichts lief, statt den Spinner weiterdrehen zu lassen.",
        "Eine Antwort zählt erst, wenn sie als echtes Medium geprüft ist. Eine Seite, die bloss 200 zurückgegeben hat, ist kein Stream. Die erste geprüfte Antwort gewinnt, und jede andere Anfrage, die noch läuft, wird über ihren eigenen Controller abgebrochen. Die Verlierer kosten also nichts mehr, sobald das Rennen entschieden ist.",
      ],
      code: {
        language: "ts",
        text: RACE_CODE,
        caption:
          "Aus server/app.ts, ohne die Kommentare. Jeder Versuch hat seinen eigenen AbortController, der erste Versuch mit geprüftem direktem Medium beendet das Rennen, und die breitere Suche überspringt nur Quellen, die aus einem echten Grund gescheitert sind.",
      },
    },
    {
      heading: "Drei Gedächtnisse, jedes mit eigenem Grund zu vergessen",
      body: [
        "Eine aufgelöste Antwort wird drei Minuten lang wiederverwendet, aber erst, nachdem ihre erste Quelle eine frische Range-Anfrage bestanden hat. Stream-Adressen laufen ab, und eine ungeprüft aus dem Speicher gereichte Adresse gäbe dem Player einen toten Link.",
        "Eine Folge, bei der nichts lief, bleibt 60 Sekunden im Gedächtnis, damit der nächste Versuch die Antwort in Millisekunden bekommt, statt das ganze Rennen noch einmal zu bezahlen. Eine Quelle, die für einen Titel gerade gescheitert ist, bleibt 90 Sekunden aus der bevorzugten Liste, damit Folge zwei nicht wieder auf sie wartet. Eine Quelle, die nur abgebrochen wurde, weil eine andere gewonnen hat, gilt nicht als gescheitert, und eine, der bloss die Zeit ausging, bekommt in der breiteren Suche trotzdem ihre Chance.",
        "Schliesse ich eine Anfrage mittendrin, wird nichts von dem aufgeschrieben, was sie gesehen hat. Ein abgebrochener Versuch sagt nichts über den Titel, also bleiben die Caches genau, wie sie waren.",
      ],
    },
    {
      heading: "Alles, was der Player lädt, kommt durch die App zurück",
      body: [
        "Video kommt als Playlists, die auf Segmente auf anderen Hosts zeigen. Die API schreibt jede Zeile einer Playlist um, auch die Adressen in den Tags, sodass jedes Segment über ihr eigenes Relay geholt wird. Das Relay spricht nur mit Hosts, die es aus den Ergebnissen der Quellen oder aus seiner eigenen Konfiguration gelernt hat, nie aus etwas, das der Browser schickt, und es folgt Weiterleitungen von Hand, damit jeder Sprung geprüft wird und nicht nur der erste.",
        "Untertitel kommen als SubRip- oder SubStation-Alpha-Dateien, und ein Track-Element nimmt nur WebVTT. Der Browser wandelt sie selbst um, mit eigenen Parsern für beide Formate, bevor er das Ergebnis dem Player gibt.",
      ],
    },
    {
      heading: "Eine Sandbox gegen den Zurück-Knopf",
      body: [
        "Manche Quellen bieten nur einen externen Player an, der in einem iframe läuft. Ein Frame teilt sich den Verlauf des Tabs, und Werbeskripte in diesen Seiten riefen history.back() auf. Das zog die ganze App still auf eine frühere Route zurück und wechselte mir die Folge unter den Händen.",
        "Der Frame ist jetzt gesandboxt. Er darf Skripte ausführen, Formulare nutzen und in den Vollbildmodus gehen, aber er kann das oberste Fenster nicht navigieren, keine Popups öffnen und keine Downloads starten. Der Player selbst läuft weiter, und die Folge bleibt, wo ich sie gelassen habe.",
      ],
    },
    {
      heading: "Ein Standbild für jede Folge",
      body: [
        "Die Quellen liefern Vorschaubilder höchstens für die ersten paar Dutzend Folgen. TMDB hat für fast jede ein Standbild, also ist es die erste Wahl und das Bild der Quelle nur der Rückfall.",
        "Die Zuordnung ist weniger einfach, als sie klingt. Eine Fortsetzung ist auf TMDB oft eine spätere Staffel derselben Serie, also wählt die API die Staffel, die zur Folgenzahl passt, oder geht die Staffeln der Reihe nach durch und zählt Versätze zusammen. Manche lang laufenden Serien nummerieren alle Staffeln durchgehend, Staffel zwei beginnt dann bei 62, und dort fällt der Versatz weg.",
      ],
      figure: 1,
    },
  ],
  captions: [
    "Die Startseite: ein grosser hervorgehobener Titel mit dem Countdown zur nächsten Folge, darunter Genre-Chips, ein Raster mit Tabs für die Trends und rechts eine Liste der aktuell laufenden Serien.",
    "Eine Titelseite: Poster und Banner oben, Tabs für Übersicht, Figuren und Folgen, darunter Inhaltsangabe, Trailer und ein Detailfeld.",
  ],
  tags: ["React", "TypeScript", "Express", "Python", "HLS"],
  stats: [
    { value: "466", label: "Tests" },
    { value: "45 s", label: "längste Wartezeit auf eine Quelle" },
    { value: "3 min", label: "Wiederverwendung, jedes Mal geprüft" },
    { value: "60 s", label: "Gedächtnis für eine gescheiterte Folge" },
  ],
};

const fr: LocalizedContent = {
  tagline: "Une application d'anime pour ma propre machine, construite pour attendre le moins possible.",
  description:
    "Une interface pour découvrir et regarder des anime, qui tourne en local : un front React, une API Express et un petit pont en Python. L'essentiel du travail consiste à répondre vite et honnêtement quand les sources derrière sont lentes ou absentes.",
  overview:
    "Cyberia, c'est là où je cherche et regarde des anime chez moi. Il ne tourne que sur ma machine et n'est publié nulle part. Le front est en React 19 avec TypeScript et Vite, le catalogue vient d'AniList, et une API Express se tient entre le navigateur et un pont en Python qui n'écoute qu'en loopback et parle aux sources. L'interface était la moitié facile. La difficile, c'était le chemin entre le bouton lecture et une image à l'écran, quand chaque source derrière peut être lente, cassée ou simplement fausse.",
  roleSummary: "Moi seul : l'interface, l'API, le pont et les tests.",
  sections: [
    {
      heading: "La première source qui prouve qu'elle joue a le droit de répondre",
      body: [
        "Quand j'appuie sur lecture, l'API interroge en même temps une courte liste de sources préférées. Si aucune n'a rien produit de lisible au bout de six secondes, une recherche plus large démarre à côté, et toute la résolution est plafonnée à 45 secondes. Au-delà, elle dit simplement que rien n'a joué au lieu de laisser tourner l'indicateur de chargement.",
        "Une réponse ne compte qu'une fois vérifiée comme un vrai média. Une page qui a seulement renvoyé 200 n'est pas un flux. La première réponse vérifiée gagne, et chaque autre requête encore en cours est annulée par son propre contrôleur, si bien que les perdants ne coûtent plus rien dès que la course est tranchée.",
      ],
      code: {
        language: "ts",
        text: RACE_CODE,
        caption:
          "Tiré de server/app.ts, sans les commentaires. Chaque tentative a son propre AbortController, la première qui apporte un média direct vérifié termine la course, et la recherche plus large n'écarte que les sources qui ont échoué pour une vraie raison.",
      },
    },
    {
      heading: "Trois mémoires, chacune avec sa raison d'oublier",
      body: [
        "Une réponse résolue est réutilisée pendant trois minutes, mais seulement après que sa première source a passé une nouvelle requête Range. Les adresses de flux expirent, et en servir une de mémoire sans vérifier donnerait au lecteur un lien mort.",
        "Un épisode pour lequel rien n'a joué reste en mémoire 60 secondes, pour que la tentative suivante ait sa réponse en quelques millisecondes au lieu de repayer toute la course. Une source qui vient d'échouer pour un titre reste hors de la liste préférée pendant 90 secondes, pour que l'épisode deux ne l'attende pas encore. Une source seulement annulée parce qu'une autre a gagné ne compte pas comme un échec, et celle qui a juste manqué de temps garde sa chance dans la recherche plus large.",
        "Quand je ferme une requête en cours de route, rien de ce qu'elle a vu n'est noté. Une tentative abandonnée ne dit rien du titre, donc les caches restent exactement tels qu'ils étaient.",
      ],
    },
    {
      heading: "Tout ce que le lecteur charge repasse par l'application",
      body: [
        "La vidéo arrive sous forme de playlists qui pointent vers des segments sur d'autres hôtes. L'API réécrit chaque ligne d'une playlist, y compris les adresses dans les balises, pour que chaque segment passe par son propre relais. Le relais ne parle qu'aux hôtes appris à partir des résultats des sources ou de sa propre configuration, jamais de ce qu'envoie le navigateur, et il suit les redirections à la main pour que chaque saut soit contrôlé, pas seulement le premier.",
        "Les sous-titres arrivent en SubRip ou en SubStation Alpha, et un élément track n'accepte que le WebVTT. Le navigateur les convertit lui-même, avec ses propres analyseurs pour les deux formats, avant de passer le résultat au lecteur.",
      ],
    },
    {
      heading: "Un bac à sable contre le bouton retour",
      body: [
        "Certaines sources ne proposent qu'un lecteur externe, qui tourne dans une iframe. Un cadre partage l'historique de l'onglet, et des scripts publicitaires dans ces pages appelaient history.back(), ce qui ramenait discrètement toute l'application à une route précédente et changeait l'épisode sous mes yeux.",
        "Le cadre est désormais placé dans un bac à sable. Il peut exécuter des scripts, utiliser des formulaires et passer en plein écran, mais il ne peut ni naviguer la fenêtre principale, ni ouvrir de popups, ni lancer de téléchargements. Le lecteur fonctionne toujours, et l'épisode reste là où je l'ai laissé.",
      ],
    },
    {
      heading: "Une image pour chaque épisode",
      body: [
        "Les sources fournissent des vignettes pour les deux ou trois premières dizaines d'épisodes au mieux. TMDB a une image pour presque chacun, c'est donc le premier choix, et l'image de la source n'est que le repli.",
        "Les faire correspondre est moins simple qu'il n'y paraît. Une suite est souvent une saison ultérieure d'une même série sur TMDB, alors l'API choisit la saison qui correspond au nombre d'épisodes, ou parcourt les saisons dans l'ordre en additionnant les décalages. Certaines séries au long cours numérotent toutes les saisons en continu, la saison deux commence alors à 62, et là le décalage est omis.",
      ],
      figure: 1,
    },
  ],
  captions: [
    "La page d'accueil : un grand titre mis en avant avec le compte à rebours du prochain épisode, des puces de genres en dessous, une grille à onglets des tendances et une liste des séries en cours de diffusion à droite.",
    "Une page de titre : affiche et bannière en haut, onglets pour la présentation, les personnages et les épisodes, puis le synopsis, la bande-annonce et un panneau de détails.",
  ],
  tags: ["React", "TypeScript", "Express", "Python", "HLS"],
  stats: [
    { value: "466", label: "tests" },
    { value: "45 s", label: "attente maximale pour une source" },
    { value: "3 min", label: "réutilisation, revérifiée à chaque fois" },
    { value: "60 s", label: "mémoire d'un épisode raté" },
  ],
};

const zh: LocalizedContent = {
  tagline: "一个只在我自己电脑上跑的动画应用，围绕尽量少等待来构建。",
  description:
    "一个在本地运行的动画发现与播放界面：React 前端、Express API，加上一个小小的 Python 桥接层。大部分功夫花在这里：背后的来源变慢或消失时，依然能快速而诚实地给出回答。",
  overview:
    "Cyberia 是我在家里找动画、看动画的地方。它只在我的电脑上运行，没有发布到任何地方。前端是 React 19 加 TypeScript 和 Vite，番剧目录来自 AniList，浏览器和一个只监听回环地址、负责与各个来源通信的 Python 桥接层之间，隔着一层 Express API。界面是容易的那一半。难的一半是从按下播放到画面出现的这段路，因为背后的每个来源都可能很慢、坏掉，或者干脆是错的。",
  roleSummary: "只有我：界面、API、桥接层和测试。",
  sections: [
    {
      heading: "先证明自己能播放的来源，才有资格回答",
      body: [
        "我按下播放时，API 会同时询问一小串优先来源。如果六秒后它们都还没给出可播放的内容，就在旁边启动一次范围更广的搜索，整个解析过程最多 45 秒。超过这个时间，它会直接说明没有找到能播放的，而不是让加载动画一直转下去。",
        "回答只有在被验证为真实媒体后才算数。一个只是返回了 200 的页面不是视频流。第一个通过验证的回答获胜，其余仍在进行的请求都会通过各自的控制器中止，所以比赛一旦分出结果，输家就不再消耗任何资源。",
      ],
      code: {
        language: "ts",
        text: RACE_CODE,
        caption:
          "摘自 server/app.ts，省略了注释。每次尝试都有自己的 AbortController，第一个拿到经过验证的直接媒体的尝试结束比赛，而更广的搜索只跳过那些因真正原因失败的来源。",
      },
    },
    {
      heading: "三种记忆，各有各的遗忘理由",
      body: [
        "解析好的回答会被复用三分钟，但前提是它的第一个来源重新通过一次 Range 请求。视频流地址会过期，不经检查就从内存里拿出来，只会交给播放器一个失效的链接。",
        "一集什么都没播出来的结果会被记住 60 秒，这样下一次尝试几毫秒就能得到答案，而不必再跑一遍完整的比赛。某个来源刚在某部作品上失败，就会在 90 秒内被移出优先列表，第二集不用再等它。只是因为别人先赢而被取消的来源不算失败，仅仅超时的来源在更广的搜索里仍然有机会。",
        "如果我中途关掉一个请求，它看到的一切都不会被记录。被放弃的尝试说明不了这部作品的任何情况，所以缓存保持原样。",
      ],
    },
    {
      heading: "播放器加载的一切都经由应用本身返回",
      body: [
        "视频以播放列表的形式到来，列表指向其他主机上的分片。API 会改写播放列表的每一行，包括标签里的地址，让每个分片都经过应用自己的中继获取。中继只和从来源结果或自身配置中学到的主机通信，绝不采信浏览器发来的内容；它还手动跟随重定向，确保每一跳都经过检查，而不只是第一跳。",
        "字幕以 SubRip 或 SubStation Alpha 格式到来，而 track 元素只接受 WebVTT。浏览器会自己转换，两种格式各有专门的解析器，然后再把结果交给播放器。",
      ],
    },
    {
      heading: "用沙箱挡住后退键",
      body: [
        "有些来源只提供外部播放器，运行在 iframe 里。框架与标签页共享浏览历史，这些页面里的广告脚本会调用 history.back()，悄悄把整个应用拉回之前的路由，在我眼皮底下换掉正在看的那一集。",
        "现在这个框架被放进了沙箱。它可以运行脚本、使用表单、进入全屏，但不能导航顶层窗口，不能打开弹窗，也不能发起下载。播放器本身照常工作，那一集也停在我离开的地方。",
      ],
    },
    {
      heading: "每一集都有一张剧照",
      body: [
        "各个来源最多只为前二三十集提供缩略图。TMDB 几乎每一集都有剧照，所以它是首选，来源自带的图片只作后备。",
        "对上号比听起来难。续作在 TMDB 上常常是同一部剧的后续季，所以 API 会挑选集数吻合的那一季，或者按顺序遍历各季并累加偏移量。有些长篇剧集的所有季都连续编号，第二季从第 62 集开始，这种情况下就不加偏移。",
      ],
      figure: 1,
    },
  ],
  captions: [
    "首页：一个大幅的推荐作品，带下一集倒计时，下方是类型标签，再往下是带标签页的热门网格，右侧是正在播出的列表。",
    "作品页：顶部是海报和横幅，下面是简介、角色和剧集三个标签页，再往下是剧情简介、预告片和一个详情面板。",
  ],
  tags: ["React", "TypeScript", "Express", "Python", "HLS"],
  stats: [
    { value: "466", label: "个测试" },
    { value: "45 秒", label: "等待来源的上限" },
    { value: "3 分钟", label: "复用，每次都重新检查" },
    { value: "60 秒", label: "记住一集失败的时长" },
  ],
};

export const cyberia: Record<Language, LocalizedContent> = { en, de, fr, zh };
