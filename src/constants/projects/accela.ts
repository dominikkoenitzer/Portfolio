import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

const STORE_CODE = `const printable = v => v == null || typeof v === 'string' || typeof v === 'number';
export const isMedia = m => !!m && typeof m === 'object'
  && (typeof m.id === 'string' || typeof m.id === 'number')
  && String(m.id) !== ''
  && (m.type === 'movie' || m.type === 'tv')
  && typeof m.title === 'string'
  && m.title !== ''
  && printable(m.year) && printable(m.genre) && printable(m.rating)
  && printable(m.overview) && printable(m.poster) && printable(m.backdrop);

const read = () => {
  try {
    const raw = localStorage.getItem(KEY) ?? LEGACY.map(k => localStorage.getItem(k)).find(Boolean);
    const value = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value
      .filter(r => r && typeof r === 'object' && typeof r.key === 'string' && isMedia(r.media) && ownsKey(r.key, r.media))
      .slice(0, LIMIT);
  } catch { return []; }
};`;

export const accela: Record<Language, LocalizedContent> = {
  en: {
    tagline: "A films and series app that treats its own URL and storage as untrusted input.",
    description:
      "A films and series interface on TMDB data, built with React 19 and Vite in plain JSX. It runs only on my machine and keeps its watch history and saved list in the browser.",
    overview:
      "Accela is where I browse films and series and pick up what I was watching. The catalogue, the artwork and the episode lists come from TMDB; playback runs in an embedded player, and a picker switches between six servers when one of them stops answering. It is plain JSX on React 19 and Vite with two runtime dependencies, and it runs locally only. Most of the work went into the edges: a hash that arrives from an old link, a storage key someone edited by hand, a player frame that sends messages it should not, a season with more than a thousand episodes.",
    roleSummary: "Just me: the views, the data layer and the tests.",
    sections: [
      {
        heading: "The address bar is user input",
        body: [
          "Accela routes on the URL hash, so every view can be bookmarked, shared or reloaded without a server behind it. That also means the hash can say anything. It arrives from a shared link, a bookmark, an older build or a hand edit, and it goes straight into an embed URL and a history row.",
          "The router is one pure module that parses the hash before any view sees it. Only the two media types with real endpoints are accepted, and a season or episode number is clamped to a whole number between 1 and 9999, so a link carrying 1e99 never reaches the player. Links in an older format still resolve to the same watch view.",
        ],
      },
      {
        heading: "Storage somebody else can write",
        body: [
          "Watch history and the saved list live in localStorage. That is JSON anyone with a devtools panel can rewrite, so every row is validated again each time it is read back. A title that is an object used to throw straight into the error boundary and replace a whole view with a failure message. A row whose key did not match its own title drew a card that nothing in the app could remove.",
          "The caps apply on read as well as on write, so a blob left by an older build cannot render thousands of cards. A refused write is handled two ways. Progress updates that fire several times a minute fail silently. Saving a title, changing the server or removing a card is something the viewer asked for, so a write that did not land is said once in the banner, and the list on screen is the one storage actually holds.",
        ],
        code: {
          language: "js",
          text: STORE_CODE,
          caption:
            "From store.js, with its comments left out. Every field a card prints is checked, and ownsKey keeps only rows whose key the app itself could have written, which is the same test the remove action uses.",
        },
      },
      {
        heading: "The player lives in a sandbox",
        body: [
          "The embedded players are third-party pages with ads, and they have been caught hijacking the back button and opening tabs over the app. The iframe is sandboxed without top navigation and without popups, so it can play video but cannot move or cover the page it sits in.",
          "One of the players reports playback progress through postMessage, and that is what fills the progress bars and the resume points. Messages are only accepted from an allow list of origins. Each embed on screen also has an identity built from the title, server, season and episode, and a message that arrives before the current frame has loaded is dropped, because it came from the frame that was just replaced and would move the wrong row in history.",
        ],
      },
      {
        heading: "A season can be a thousand episodes long",
        body: [
          "Most seasons have ten or twenty episodes. One long-running series on TMDB has a single season of 1,216, and rendering all of it built more than twelve thousand elements for a panel that shows six rows at a time.",
          "The episode list now renders a window of 40 rows, seeded around the episode you are on, and grows at either end before you can scroll to where the missing rows would be. The arithmetic sits in its own module, so the tests can hold it to that promise without a DOM. The whole suite runs under node --test: 385 tests, no browser needed.",
        ],
        figure: 1,
      },
    ],
    captions: [
      "The home page: navigation and the search field across the top, a rotating featured banner with its own pause and counter, genre chips, tabbed rows of posters, and a ranked list of popular films at the side.",
      "A series page: the backdrop and poster, the rating, buttons to play the first episode, save or share, and the episode list with stills, air dates, runtimes and a season picker.",
    ],
    tags: ["React", "JavaScript", "Vite", "TMDB"],
    stats: [
      { value: "6", label: "servers in the picker" },
      { value: "385", label: "tests" },
      { value: "2", label: "runtime dependencies" },
    ],
  },
  de: {
    tagline: "Eine App für Filme und Serien, die ihrer eigenen URL und ihrem Speicher nicht traut.",
    description:
      "Eine Oberfläche für Filme und Serien auf TMDB-Daten, gebaut mit React 19 und Vite in reinem JSX. Sie läuft nur auf meinem Rechner und hält Verlauf und Merkliste im Browser.",
    overview:
      "In Accela stöbere ich durch Filme und Serien und mache dort weiter, wo ich aufgehört habe. Katalog, Bilder und Episodenlisten kommen von TMDB; abgespielt wird in einem eingebetteten Player, und eine Auswahl wechselt zwischen sechs Servern, wenn einer nicht mehr antwortet. Die App ist reines JSX auf React 19 und Vite mit zwei Laufzeit-Abhängigkeiten, und sie läuft nur lokal. Die meiste Arbeit steckt in den Rändern: ein Hash aus einem alten Link, ein von Hand bearbeiteter Speicherschlüssel, ein Player-Frame, der Nachrichten schickt, die er nicht schicken sollte, eine Staffel mit über tausend Folgen.",
    roleSummary: "Nur ich: die Ansichten, die Datenschicht und die Tests.",
    sections: [
      {
        heading: "Die Adresszeile ist Benutzereingabe",
        body: [
          "Accela routet über den URL-Hash, jede Ansicht lässt sich also ohne Server dahinter als Lesezeichen speichern, teilen oder neu laden. Das heisst auch, dass im Hash alles stehen kann. Er kommt aus einem geteilten Link, einem Lesezeichen, einem älteren Build oder einer Handänderung, und er landet direkt in einer Embed-URL und in einer Zeile des Verlaufs.",
          "Der Router ist ein einzelnes reines Modul, das den Hash zerlegt, bevor eine Ansicht ihn sieht. Nur die zwei Medientypen mit echten Endpunkten werden angenommen, und Staffel- und Folgennummern werden auf eine ganze Zahl zwischen 1 und 9999 begrenzt, damit ein Link mit 1e99 nie beim Player ankommt. Links im älteren Format führen weiterhin zur selben Ansicht.",
        ],
      },
      {
        heading: "Ein Speicher, in den auch andere schreiben können",
        body: [
          "Verlauf und Merkliste liegen im localStorage. Das ist JSON, das jeder mit den Entwicklerwerkzeugen umschreiben kann, deshalb wird jede Zeile bei jedem Lesen erneut geprüft. Ein Titel, der ein Objekt war, warf früher direkt in die Error Boundary und ersetzte eine ganze Ansicht durch eine Fehlermeldung. Eine Zeile, deren Schlüssel nicht zu ihrem eigenen Titel passte, zeichnete eine Karte, die nichts in der App entfernen konnte.",
          "Die Obergrenzen gelten beim Lesen wie beim Schreiben, ein Überbleibsel aus einem älteren Build kann also nicht Tausende Karten rendern. Ein abgelehnter Schreibvorgang wird zweifach behandelt. Fortschrittsmeldungen, die mehrmals pro Minute kommen, scheitern still. Einen Titel merken, den Server wechseln oder eine Karte entfernen hat der Zuschauer selbst ausgelöst, also wird ein Schreibvorgang, der nicht angekommen ist, einmal im Banner gesagt, und die Liste auf dem Bildschirm ist die, die im Speicher wirklich steht.",
        ],
        code: {
          language: "js",
          text: STORE_CODE,
          caption:
            "Aus store.js, ohne die Kommentare. Jedes Feld, das eine Karte ausgibt, wird geprüft, und ownsKey behält nur Zeilen, deren Schlüssel die App selbst geschrieben haben könnte. Es ist derselbe Test, den die Entfernen-Aktion benutzt.",
        },
      },
      {
        heading: "Der Player lebt in einer Sandbox",
        body: [
          "Die eingebetteten Player sind fremde Seiten mit Werbung, und sie wurden dabei erwischt, wie sie die Zurück-Taste kaperten und Tabs über der App öffneten. Das iframe ist ohne Top-Navigation und ohne Popups gesandboxt, es kann also Video abspielen, aber die Seite, in der es sitzt, weder wegbewegen noch überdecken.",
          "Einer der Player meldet den Wiedergabefortschritt per postMessage, und daraus entstehen die Fortschrittsbalken und die Stellen zum Weiterschauen. Nachrichten werden nur von einer Liste erlaubter Origins angenommen. Jedes Embed auf dem Bildschirm hat zudem eine Identität aus Titel, Server, Staffel und Folge, und eine Nachricht, die eintrifft, bevor der aktuelle Frame geladen ist, wird verworfen. Sie kam vom Frame, der gerade ersetzt wurde, und würde die falsche Zeile im Verlauf verschieben.",
        ],
      },
      {
        heading: "Eine Staffel kann tausend Folgen lang sein",
        body: [
          "Die meisten Staffeln haben zehn oder zwanzig Folgen. Eine langlaufende Serie auf TMDB hat eine einzige Staffel mit 1216, und alle zu rendern ergab über zwölftausend Elemente für ein Panel, das sechs Zeilen auf einmal zeigt.",
          "Die Episodenliste rendert jetzt ein Fenster von 40 Zeilen um die aktuelle Folge herum und wächst an beiden Enden, bevor man dorthin scrollen kann, wo die fehlenden Zeilen wären. Die Rechnung steckt in einem eigenen Modul, damit die Tests sie ohne DOM an diesem Versprechen messen können. Die ganze Suite läuft unter node --test: 385 Tests, ohne Browser.",
        ],
        figure: 1,
      },
    ],
    captions: [
      "Die Startseite: oben Navigation und Suchfeld, ein wechselndes Titelbanner mit eigener Pause und Zähler, Genre-Chips, Posterreihen in Tabs und seitlich eine Rangliste beliebter Filme.",
      "Eine Serienseite: Hintergrundbild und Poster, die Bewertung, Knöpfe zum Abspielen der ersten Folge, Merken und Teilen, und die Episodenliste mit Standbildern, Ausstrahlungsdaten, Laufzeiten und einer Staffelauswahl.",
    ],
    tags: ["React", "JavaScript", "Vite", "TMDB"],
    stats: [
      { value: "6", label: "Server zur Auswahl" },
      { value: "385", label: "Tests" },
      { value: "2", label: "Laufzeit-Abhängigkeiten" },
    ],
  },
  fr: {
    tagline: "Une application de films et de séries qui traite sa propre URL et son stockage comme des entrées non fiables.",
    description:
      "Une interface de films et de séries sur les données de TMDB, construite avec React 19 et Vite en JSX simple. Elle ne tourne que sur ma machine et garde l'historique et la liste enregistrée dans le navigateur.",
    overview:
      "Accela, c'est là où je parcours films et séries et où je reprends ce que je regardais. Le catalogue, les visuels et les listes d'épisodes viennent de TMDB ; la lecture se fait dans un lecteur intégré, et un sélecteur passe d'un serveur à l'autre parmi six quand l'un d'eux ne répond plus. C'est du JSX simple sur React 19 et Vite avec deux dépendances d'exécution, et il ne tourne qu'en local. L'essentiel du travail est allé dans les bords : un hash venu d'un vieux lien, une clé de stockage modifiée à la main, un cadre de lecteur qui envoie des messages qu'il ne devrait pas envoyer, une saison de plus de mille épisodes.",
    roleSummary: "Moi seul : les vues, la couche de données et les tests.",
    sections: [
      {
        heading: "La barre d'adresse est une saisie de l'utilisateur",
        body: [
          "Accela route sur le hash de l'URL, donc chaque vue peut être mise en favori, partagée ou rechargée sans serveur derrière. Cela veut aussi dire que le hash peut contenir n'importe quoi. Il arrive d'un lien partagé, d'un favori, d'une ancienne version ou d'une modification à la main, et il va droit dans une URL d'intégration et dans une ligne d'historique.",
          "Le routeur est un seul module pur qui analyse le hash avant qu'une vue ne le voie. Seuls les deux types de média qui ont de vrais points d'API sont acceptés, et un numéro de saison ou d'épisode est ramené à un entier entre 1 et 9999, si bien qu'un lien portant 1e99 n'atteint jamais le lecteur. Les liens dans l'ancien format mènent toujours à la même vue.",
        ],
      },
      {
        heading: "Un stockage que d'autres peuvent écrire",
        body: [
          "L'historique et la liste enregistrée vivent dans le localStorage. C'est du JSON que n'importe qui peut réécrire depuis les outils de développement, donc chaque ligne est revalidée à chaque lecture. Un titre qui était un objet faisait tomber toute une vue dans le gestionnaire d'erreurs. Une ligne dont la clé ne correspondait pas à son propre titre affichait une carte que rien dans l'application ne pouvait retirer.",
          "Les plafonds s'appliquent à la lecture comme à l'écriture, si bien qu'un reliquat d'une ancienne version ne peut pas afficher des milliers de cartes. Une écriture refusée est traitée de deux façons. Les mises à jour de progression, qui tombent plusieurs fois par minute, échouent en silence. Enregistrer un titre, changer de serveur ou retirer une carte, c'est le spectateur qui l'a demandé : une écriture qui n'a pas abouti est donc dite une fois dans le bandeau, et la liste à l'écran est celle que le stockage contient vraiment.",
        ],
        code: {
          language: "js",
          text: STORE_CODE,
          caption:
            "Tiré de store.js, sans les commentaires. Chaque champ qu'une carte affiche est vérifié, et ownsKey ne garde que les lignes dont la clé aurait pu être écrite par l'application elle-même, avec le même test que l'action de retrait.",
        },
      },
      {
        heading: "Le lecteur vit dans un bac à sable",
        body: [
          "Les lecteurs intégrés sont des pages tierces financées par la publicité, et on les a vus détourner le bouton retour et ouvrir des onglets par-dessus l'application. L'iframe est placée dans un bac à sable sans navigation de premier niveau et sans popups : elle peut lire une vidéo, mais ni déplacer ni recouvrir la page qui la contient.",
          "L'un des lecteurs signale sa progression par postMessage, et c'est ce qui remplit les barres de progression et les points de reprise. Les messages ne sont acceptés que depuis une liste d'origines autorisées. Chaque intégration à l'écran a en plus une identité faite du titre, du serveur, de la saison et de l'épisode, et un message qui arrive avant que le cadre actuel soit chargé est écarté, parce qu'il vient du cadre qui vient d'être remplacé et déplacerait la mauvaise ligne de l'historique.",
        ],
      },
      {
        heading: "Une saison peut compter mille épisodes",
        body: [
          "La plupart des saisons ont dix ou vingt épisodes. Une série au long cours sur TMDB a une seule saison de 1216, et tout afficher construisait plus de douze mille éléments pour un panneau qui montre six lignes à la fois.",
          "La liste d'épisodes affiche désormais une fenêtre de 40 lignes autour de l'épisode en cours et s'agrandit aux deux bouts avant qu'on puisse défiler jusqu'aux lignes manquantes. Le calcul vit dans son propre module, pour que les tests puissent le tenir à cette promesse sans DOM. Toute la suite tourne sous node --test : 385 tests, sans navigateur.",
        ],
        figure: 1,
      },
    ],
    captions: [
      "La page d'accueil : la navigation et le champ de recherche en haut, une bannière tournante avec sa propre pause et son compteur, des pastilles de genre, des rangées d'affiches par onglets et un classement des films populaires sur le côté.",
      "Une page de série : l'image de fond et l'affiche, la note, les boutons pour lire le premier épisode, enregistrer ou partager, et la liste d'épisodes avec images, dates de diffusion, durées et un sélecteur de saison.",
    ],
    tags: ["React", "JavaScript", "Vite", "TMDB"],
    stats: [
      { value: "6", label: "serveurs au choix" },
      { value: "385", label: "tests" },
      { value: "2", label: "dépendances d'exécution" },
    ],
  },
  zh: {
    tagline: "一个影视应用，把自己的网址和本地存储都当作不可信的输入。",
    description:
      "一个基于 TMDB 数据的电影和剧集界面，用 React 19 和 Vite 写成，纯 JSX。它只在我自己的电脑上运行，观看记录和收藏列表都存在浏览器里。",
    overview:
      "Accela 是我浏览电影和剧集、接着看上次没看完的内容的地方。片库、图片和分集列表来自 TMDB；播放在一个嵌入的播放器里进行，某个服务器不再响应时，可以在选择器里从六个服务器中换一个。它是跑在 React 19 和 Vite 上的纯 JSX，只有两个运行时依赖，只在本地运行。大部分功夫花在边缘情况上：从旧链接带来的 hash，被人手动改过的存储键，发来不该发的消息的播放器框架，还有一季超过一千集的剧。",
    roleSummary: "只有我：各个视图、数据层和测试。",
    sections: [
      {
        heading: "地址栏也是用户输入",
        body: [
          "Accela 用 URL 的 hash 做路由，所以每个视图都能收藏、分享或刷新，背后不需要服务器。这也意味着 hash 里可以是任何东西。它可能来自分享的链接、书签、旧版本或手动修改，并且会直接进入嵌入地址和一条观看记录。",
          "路由器是一个纯模块，在任何视图看到 hash 之前先把它解析好。只接受有真实接口的两种媒体类型，季数和集数被限制为 1 到 9999 之间的整数，所以带着 1e99 的链接永远到不了播放器。旧格式的链接仍然会打开同一个视图。",
        ],
      },
      {
        heading: "别人也能写的存储",
        body: [
          "观看记录和收藏列表放在 localStorage 里。那是任何人打开开发者工具都能改写的 JSON，所以每一行在每次读出时都会重新校验。标题如果是一个对象，过去会直接抛进错误边界，整个视图被一条错误信息取代。键和自身标题对不上的行，会画出一张应用里任何操作都删不掉的卡片。",
          "上限在读取和写入时都生效，旧版本留下的数据不会一下子渲染出几千张卡片。写入被拒绝时分两种处理。每分钟触发好几次的进度更新会静默失败。收藏标题、切换服务器或删除卡片是观众自己点的，所以没写进去的操作会在横幅里说一次，屏幕上的列表始终是存储里真实存在的那一份。",
        ],
        code: {
          language: "js",
          text: STORE_CODE,
          caption:
            "摘自 store.js，省略了注释。卡片会显示的每个字段都要检查，ownsKey 只保留那些键可能由应用自己写出的行，和删除操作用的是同一个判断。",
        },
      },
      {
        heading: "播放器待在沙箱里",
        body: [
          "嵌入的播放器是带广告的第三方页面，曾被发现劫持返回键、在应用上方打开新标签页。这个 iframe 的沙箱不允许顶层导航，也不允许弹窗，所以它能播放视频，却既不能把所在的页面带走，也不能盖住它。",
          "其中一个播放器会通过 postMessage 报告播放进度，进度条和续播位置就是由此而来。只接受白名单里的来源发来的消息。屏幕上的每个嵌入还有一个由标题、服务器、季和集组成的身份，在当前框架加载完成之前到达的消息会被丢弃，因为它来自刚被替换掉的框架，会把观看记录里错误的那一行挪动。",
        ],
      },
      {
        heading: "一季可以有上千集",
        body: [
          "大多数季只有十几二十集。TMDB 上有一部长篇连续剧只有一季，却有 1216 集，全部渲染会为一个一次只显示六行的面板生成一万两千多个元素。",
          "现在分集列表只渲染当前这一集附近的 40 行窗口，并在你滚到缺失的行之前从两端扩展。这部分计算放在单独的模块里，测试不需要 DOM 就能检验它是否守住了这个承诺。整套测试在 node --test 下运行：385 个测试，不需要浏览器。",
        ],
        figure: 1,
      },
    ],
    captions: [
      "首页：顶部是导航和搜索框，下面是一个带暂停和计数的轮播推荐横幅、类型标签、按标签页分组的海报行，侧边是一份热门电影排行。",
      "一个剧集页面：背景图和海报、评分、播放第一集、收藏和分享的按钮，以及带剧照、播出日期、时长和季选择器的分集列表。",
    ],
    tags: ["React", "JavaScript", "Vite", "TMDB"],
    stats: [
      { value: "6", label: "可选服务器" },
      { value: "385", label: "个测试" },
      { value: "2", label: "个运行时依赖" },
    ],
  },
};
