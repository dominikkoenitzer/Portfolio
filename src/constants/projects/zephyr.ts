import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

const streakCode = `export function activeStreak(streak, today = new Date()) {
  const count = Math.max(0, Number(streak?.count) || 0);
  if (!count || !streak?.lastDate) return 0;

  const last = startOfDay(new Date(streak.lastDate));
  if (Number.isNaN(last.getTime())) return 0;

  const days = Math.round((startOfDay(today) - last) / 86400000);
  return days === 0 || days === 1 ? count : 0;
}`;

export const zephyr: Record<Language, LocalizedContent> = {
  en: {
    tagline: "A to-do list and a focus timer, all yours and all offline.",
    description:
      "Zephyr is a local-first productivity PWA: a to-do list and a Pomodoro focus timer in one place. There is no login and no backend, and nothing you enter ever leaves your browser.",
    overview:
      "I built Zephyr because every productivity app I tried wanted an account and a copy of my whole day on its server. So I wrote my own with React, Vite, Tailwind and Radix, and put every task and focus session in localStorage. Nothing is uploaded, there is nothing to sign up for, and once installed it keeps working with the Wi-Fi off. It once carried notes, a journal and a calendar too; I cut them, left the old routes redirecting, and kept the two tools that earn daily use.",
    roleSummary: "All of it, on my own.",
    sections: [
      {
        heading: "Two screens, and the rest came out",
        body: [
          "Zephyr used to have notes, a journal and a calendar next to the tasks and the timer. I removed them one by one, notes last in August 2026, and kept the two tools I actually opened every day. The old addresses redirect to the task list. Their storage keys are still known to the app, so a wipe still clears old data and an export still carries it.",
          "Two destinations did not justify a sidebar, so the top bar is the whole navigation. The two names are the only large type in the app: the active one is set in capitals over a rule, the other stays lowercase and muted. The bar is also the page title, so the task and focus pages carry no second heading saying the same word.",
        ],
        figure: 1,
      },
      {
        heading: "One store, and an event on every write",
        body: [
          "There is no global state library. Tasks, sessions and settings live in singleton services that write to localStorage under a zephyr_ prefix, and every write fires a zephyr:change event that a few small hooks subscribe to.",
          "The browser's own storage event only fires in the other tabs, which is why the second event exists: the tab that made the change has to hear about it as well. Between the two, the home figures, the list and a second open tab stay in step without a database behind them.",
        ],
        figure: 2,
      },
      {
        heading: "Quick add reads the sentence on the device",
        body: [
          "Typing \"Email Sam tomorrow !high #work\" gives a task called Email Sam, due tomorrow, high priority, tagged work. The parser is plain pattern matching in one small module, with no network call and no AI service, and a preview shows what it found before you press Enter.",
          "The date rules run from the most specific to the least, ISO dates first and bare weekdays last, and the first match wins. If parsing would leave the title empty, the original text is kept as the title.",
        ],
      },
      {
        heading: "Bugs that took a minute to show",
        body: [
          "Ids used to be the current time as a string. Two tasks quick-added in the same millisecond got the same id, and since delete matches on id, deleting one deleted both. Ids come from crypto.randomUUID now.",
          "Reminders were deduplicated by title inside a 60-second window, which was exactly the interval the poller ran on. Every due task announced itself again every minute, chime included. Each reminder now carries a key made of the task and the day.",
          "The chime also built a new AudioContext every time and never closed it. Browsers allow a page six, so the seventh chime threw and every chime after it was silent. There is one context now, and it is reused.",
        ],
      },
      {
        heading: "The parts of a timer you only notice when they are wrong",
        body: [
          "The timer has stored a day streak since the beginning, but the code that writes it never expires it. So the code that reads it decides: a streak whose last day is older than yesterday is worth nothing, whatever the stored count says, and on a day with no session yet the focus page warns that it is about to lapse.",
          "The theme is applied before React renders, so the page never flashes the wrong one, and the system setting is followed live. An installed app can stay open for days, so a new version asks before it reloads. Taking the update silently swapped the cached files under a running page, and a route loaded after that asked for a file that no longer existed.",
        ],
        figure: 3,
        code: {
          language: "javascript",
          text: streakCode,
          caption:
            "From src/lib/streak.js, with its comments left out. The stored count is never reset by the code that writes it, so this is where a missed day actually ends the streak: today and yesterday keep it, anything older returns 0.",
        },
      },
    ],
    captions: [
      "The home page on a fresh install: the date, the week's four figures at zero and nothing due today.",
      "The focus page in light mode, with the Pomodoro preset loaded at 25:00 and the preset list beside the dial.",
      "The home page again, now counting three active tasks, with nothing due today.",
      "The same focus page in dark mode.",
    ],
    tags: ["React", "Vite", "Tailwind CSS", "Radix UI", "PWA"],
    stats: [
      { value: "2", label: "tools, on purpose" },
      { value: "0", label: "backend" },
      { value: "100%", label: "on-device" },
      { value: "84", label: "tests" },
    ],
  },
  de: {
    tagline: "Eine To-do-Liste und ein Fokus-Timer, alles deins und alles offline.",
    description:
      "Zephyr ist eine local-first Produktivitäts-PWA: eine To-do-Liste und ein Pomodoro-Timer an einem Ort. Es gibt kein Login und kein Backend, und nichts, was du eingibst, verlässt je deinen Browser.",
    overview:
      "Ich habe Zephyr gebaut, weil jede Produktivitäts-App, die ich ausprobiert habe, ein Konto wollte und eine Kopie meines ganzen Tages auf ihrem Server. Also schrieb ich meine eigene, mit React, Vite, Tailwind und Radix, und legte jede Aufgabe und jede Fokus-Session in den localStorage. Nichts wird hochgeladen, es gibt nichts zum Anmelden, und installiert läuft es auch mit ausgeschaltetem WLAN. Früher trug es auch Notizen, ein Journal und einen Kalender; ich habe sie gestrichen, die alten Routen weiterleiten lassen und die zwei Tools behalten, die täglich gebraucht werden.",
    roleSummary: "Alles, allein.",
    sections: [
      {
        heading: "Zwei Screens, der Rest ist rausgeflogen",
        body: [
          "Zephyr hatte früher Notizen, ein Journal und einen Kalender neben den Aufgaben und dem Timer. Ich habe sie nacheinander entfernt, die Notizen zuletzt im August 2026, und die zwei Tools behalten, die ich wirklich jeden Tag geöffnet habe. Die alten Adressen leiten auf die Aufgabenliste weiter. Ihre Speicherschlüssel kennt die App noch, damit ein Zurücksetzen alte Daten weiterhin löscht und ein Export sie weiterhin mitnimmt.",
          "Für zwei Ziele lohnte sich keine Seitenleiste, also ist die obere Leiste die ganze Navigation. Die zwei Namen sind die einzige grosse Schrift in der App: Der aktive steht in Grossbuchstaben über einer Linie, der andere bleibt klein und gedämpft. Die Leiste ist zugleich der Seitentitel, darum tragen die Aufgaben- und die Fokus-Seite keine zweite Überschrift mit demselben Wort.",
        ],
        figure: 1,
      },
      {
        heading: "Ein Speicher und ein Event bei jedem Schreiben",
        body: [
          "Es gibt keine globale State-Bibliothek. Aufgaben, Sessions und Einstellungen leben in Singleton-Services, die unter einem zephyr_-Präfix in den localStorage schreiben, und jeder Schreibvorgang feuert ein zephyr:change-Event, das ein paar kleine Hooks abonnieren.",
          "Das storage-Event des Browsers feuert nur in den anderen Tabs, deshalb gibt es das zweite Event: Auch der Tab, der etwas geändert hat, muss davon erfahren. Zusammen halten die beiden die Zahlen auf der Startseite, die Liste und einen zweiten offenen Tab synchron, ohne Datenbank dahinter.",
        ],
        figure: 2,
      },
      {
        heading: "Quick-Add liest den Satz auf dem Gerät",
        body: [
          "Wer „Email Sam tomorrow !high #work“ tippt, bekommt eine Aufgabe namens Email Sam, fällig morgen, hohe Priorität, Tag work. Der Parser ist schlichtes Pattern-Matching in einem kleinen Modul, ohne Netzwerkanfrage und ohne KI-Dienst, und eine Vorschau zeigt, was er erkannt hat, bevor man Enter drückt.",
          "Die Datumsregeln laufen von der genausten zur ungenausten, zuerst ISO-Daten, zuletzt blosse Wochentage, und der erste Treffer gewinnt. Bliebe nach dem Parsen kein Titel übrig, wird der ursprüngliche Text zum Titel.",
        ],
      },
      {
        heading: "Fehler, die erst nach einer Minute auffielen",
        body: [
          "IDs waren früher die aktuelle Zeit als String. Zwei Aufgaben, die in derselben Millisekunde per Quick-Add entstanden, bekamen dieselbe ID, und weil Löschen über die ID geht, löschte das Löschen der einen beide. Heute kommen IDs aus crypto.randomUUID.",
          "Erinnerungen wurden per Titel innerhalb eines 60-Sekunden-Fensters dedupliziert, und genau in diesem Takt lief die Abfrage. Jede fällige Aufgabe meldete sich also jede Minute neu, samt Ton. Jede Erinnerung trägt jetzt einen Schlüssel aus Aufgabe und Tag.",
          "Der Ton baute ausserdem jedes Mal einen neuen AudioContext und schloss ihn nie. Browser erlauben einer Seite sechs, also warf der siebte Ton einen Fehler und jeder danach blieb stumm. Heute gibt es einen einzigen Context, der wiederverwendet wird.",
        ],
      },
      {
        heading: "Was man an einem Timer erst merkt, wenn es falsch ist",
        body: [
          "Der Timer speichert von Anfang an eine Tagesserie, aber der Code, der sie schreibt, lässt sie nie verfallen. Darum entscheidet der Code, der sie liest: Eine Serie, deren letzter Tag vor gestern liegt, zählt nichts mehr, egal was gespeichert ist, und an einem Tag ohne Session warnt die Fokus-Seite, dass sie gleich reisst.",
          "Das Theme wird angewendet, bevor React rendert, damit die Seite nie kurz das falsche zeigt, und die Systemeinstellung wird live verfolgt. Eine installierte App kann tagelang offen bleiben, darum fragt eine neue Version, bevor sie neu lädt. Das stille Update tauschte die gecachten Dateien unter einer laufenden Seite aus, und eine danach geladene Route verlangte eine Datei, die es nicht mehr gab.",
        ],
        figure: 3,
        code: {
          language: "javascript",
          text: streakCode,
          caption:
            "Aus src/lib/streak.js, ohne die Kommentare. Der Code, der die Serie schreibt, setzt sie nie zurück, also endet sie erst hier nach einem verpassten Tag: Heute und gestern halten sie, alles Ältere ergibt 0.",
        },
      },
    ],
    captions: [
      "Die Startseite nach einer frischen Installation: das Datum, die vier Wochenzahlen auf null und nichts fällig heute.",
      "Die Fokus-Seite im hellen Modus, mit dem Pomodoro-Preset auf 25:00 und der Preset-Liste neben dem Zifferblatt.",
      "Nochmals die Startseite, jetzt mit drei aktiven Aufgaben und nichts fällig heute.",
      "Dieselbe Fokus-Seite im dunklen Modus.",
    ],
    tags: ["React", "Vite", "Tailwind CSS", "Radix UI", "PWA"],
    stats: [
      { value: "2", label: "Tools, mit Absicht" },
      { value: "0", label: "Backend" },
      { value: "100%", label: "auf dem Gerät" },
      { value: "84", label: "Tests" },
    ],
  },
  fr: {
    tagline: "Une liste de tâches et un minuteur de focus, tout à vous et tout hors ligne.",
    description:
      "Zephyr est une PWA de productivité local-first : une liste de tâches et un minuteur Pomodoro au même endroit. Il n'y a ni connexion ni backend, et rien de ce que vous saisissez ne quitte votre navigateur.",
    overview:
      "J'ai construit Zephyr parce que chaque app de productivité que j'essayais voulait un compte et une copie de toute ma journée sur son serveur. Alors j'ai écrit la mienne, en React, Vite, Tailwind et Radix, et j'ai mis chaque tâche et chaque session de focus dans le localStorage. Rien n'est envoyé, il n'y a aucun compte à créer, et une fois installée elle marche même le Wi-Fi coupé. Elle a aussi porté des notes, un journal et un calendrier ; je les ai retirés, en laissant les anciennes routes rediriger, et j'ai gardé les deux outils utilisés chaque jour.",
    roleSummary: "Tout, seul.",
    sections: [
      {
        heading: "Deux écrans, le reste est parti",
        body: [
          "Zephyr avait autrefois des notes, un journal et un calendrier à côté des tâches et du minuteur. Je les ai retirés un par un, les notes en dernier en août 2026, et j'ai gardé les deux outils que j'ouvrais vraiment chaque jour. Les anciennes adresses redirigent vers la liste de tâches. L'app connaît encore leurs clés de stockage, si bien qu'une réinitialisation efface toujours les anciennes données et qu'un export les emporte toujours.",
          "Deux destinations ne justifiaient pas une barre latérale : la barre du haut est toute la navigation. Les deux noms sont le seul texte en grand de l'app : l'actif est en capitales sur un trait, l'autre reste en minuscules et atténué. La barre sert aussi de titre de page, donc les pages des tâches et du focus n'affichent pas un second titre qui répéterait le même mot.",
        ],
        figure: 1,
      },
      {
        heading: "Un seul stockage, et un événement à chaque écriture",
        body: [
          "Il n'y a pas de bibliothèque d'état global. Les tâches, les sessions et les réglages vivent dans des services singleton qui écrivent dans le localStorage sous un préfixe zephyr_, et chaque écriture émet un événement zephyr:change auquel quelques petits hooks s'abonnent.",
          "L'événement storage du navigateur ne se déclenche que dans les autres onglets, d'où ce second événement : l'onglet qui a fait la modification doit lui aussi l'apprendre. À eux deux, ils gardent les chiffres de l'accueil, la liste et un second onglet ouvert synchronisés, sans base de données derrière.",
        ],
        figure: 2,
      },
      {
        heading: "La saisie rapide lit la phrase sur l'appareil",
        body: [
          "Taper « Email Sam tomorrow !high #work » donne une tâche nommée Email Sam, due demain, priorité haute, avec le tag work. L'analyseur est un simple jeu de motifs dans un petit module, sans appel réseau ni service d'IA, et un aperçu montre ce qu'il a trouvé avant qu'on appuie sur Entrée.",
          "Les règles de date vont de la plus précise à la moins précise, les dates ISO d'abord, les jours de semaine seuls en dernier, et la première qui correspond l'emporte. Si l'analyse devait laisser un titre vide, le texte d'origine reste le titre.",
        ],
      },
      {
        heading: "Des bugs qui mettaient une minute à apparaître",
        body: [
          "Les identifiants étaient autrefois l'heure courante sous forme de chaîne. Deux tâches ajoutées dans la même milliseconde recevaient le même identifiant, et comme la suppression se fait par identifiant, supprimer l'une supprimait les deux. Ils viennent désormais de crypto.randomUUID.",
          "Les rappels étaient dédoublonnés par titre dans une fenêtre de 60 secondes, soit exactement l'intervalle de la vérification. Chaque tâche due s'annonçait donc de nouveau chaque minute, son compris. Chaque rappel porte maintenant une clé faite de la tâche et du jour.",
          "Le son créait aussi un nouvel AudioContext à chaque fois sans jamais le fermer. Les navigateurs en accordent six par page : le septième son levait une erreur et tous les suivants restaient muets. Il n'y a plus qu'un seul contexte, réutilisé.",
        ],
      },
      {
        heading: "Ce qu'on ne remarque dans un minuteur que lorsque c'est faux",
        body: [
          "Le minuteur enregistre une série de jours depuis le début, mais le code qui l'écrit ne la fait jamais expirer. C'est donc le code qui la lit qui tranche : une série dont le dernier jour est plus ancien qu'hier ne vaut plus rien, quoi que dise le compte enregistré, et un jour sans session la page de focus prévient qu'elle est sur le point de s'interrompre.",
          "Le thème est appliqué avant le rendu de React, pour que la page ne montre jamais brièvement le mauvais, et le réglage du système est suivi en direct. Une app installée peut rester ouverte des jours, alors une nouvelle version demande avant de recharger. La mise à jour silencieuse remplaçait les fichiers en cache sous une page en cours, et une route chargée ensuite demandait un fichier qui n'existait plus.",
        ],
        figure: 3,
        code: {
          language: "javascript",
          text: streakCode,
          caption:
            "Extrait de src/lib/streak.js, sans ses commentaires. Le code qui écrit la série ne la remet jamais à zéro, c'est donc ici qu'un jour manqué y met fin : aujourd'hui et hier la maintiennent, tout ce qui est plus ancien renvoie 0.",
        },
      },
    ],
    captions: [
      "L'accueil après une installation neuve : la date, les quatre chiffres de la semaine à zéro et rien de dû aujourd'hui.",
      "La page de focus en mode clair, avec le preset Pomodoro chargé à 25:00 et la liste des presets à côté du cadran.",
      "L'accueil à nouveau, qui compte maintenant trois tâches actives, sans rien de dû aujourd'hui.",
      "La même page de focus en mode sombre.",
    ],
    tags: ["React", "Vite", "Tailwind CSS", "Radix UI", "PWA"],
    stats: [
      { value: "2", label: "outils, à dessein" },
      { value: "0", label: "backend" },
      { value: "100%", label: "sur l'appareil" },
      { value: "84", label: "tests" },
    ],
  },
  zh: {
    tagline: "一份待办清单，一个专注计时器，全归你，也全离线。",
    description:
      "Zephyr 是一款本地优先的生产力 PWA：待办清单和番茄钟计时器集于一处。它不用登录，也没有后端，你输入的任何内容都不会离开你的浏览器。",
    overview:
      "我做 Zephyr，是因为我试过的每一款生产力应用都想要一个账号，还要把我一整天的安排复制到它的服务器上。于是我用 React、Vite、Tailwind 和 Radix 写了自己的一款，把每一条任务和专注记录都放进 localStorage。什么都不上传，不用注册，安装之后断了 Wi-Fi 也照样能用。它也曾装着笔记、日志和日历；我把它们砍掉了，旧路由留着重定向，只留下每天真正用得上的两个工具。",
    roleSummary: "全部由我一个人完成。",
    sections: [
      {
        heading: "两个界面，其余的都拿掉了",
        body: [
          "Zephyr 以前在任务和计时器旁边还有笔记、日志和日历。我把它们一个个删掉，最后删的是笔记，在 2026 年 8 月，只留下我每天真正会打开的两个工具。旧地址会重定向到任务列表。应用仍然认得它们的存储键，所以清除数据时旧数据照样会被清掉，导出时也照样会带上。",
          "只有两个去处，不值得做一个侧边栏，所以顶栏就是全部导航。这两个名字是应用里唯一的大号文字：当前的那个用大写，下面有一条线，另一个保持小写并变淡。顶栏同时也是页面标题，所以任务页和专注页不再放第二个重复同一个词的标题。",
        ],
        figure: 1,
      },
      {
        heading: "一个存储，每次写入一个事件",
        body: [
          "这里没有全局状态库。任务、专注记录和设置都放在单例服务里，写入带 zephyr_ 前缀的 localStorage，每次写入都会派发一个 zephyr:change 事件，由几个小 hooks 订阅。",
          "浏览器自带的 storage 事件只会在其他标签页触发，所以才需要第二个事件：做出修改的那个标签页自己也得知道。两者一起，让首页的数字、任务列表和另一个打开的标签页保持同步，背后并没有数据库。",
        ],
        figure: 2,
      },
      {
        heading: "速记在设备上读懂整句话",
        body: [
          "输入「Email Sam tomorrow !high #work」，就得到一条名为 Email Sam 的任务，明天到期，高优先级，标签是 work。解析器只是一个小模块里的模式匹配，没有网络请求，也没有 AI 服务，按回车之前会有预览显示它识别出了什么。",
          "日期规则从最具体的排到最宽泛的，ISO 日期最先，单独的星期几最后，第一个匹配的规则生效。如果解析后标题会变成空的，就保留原来的文字作为标题。",
        ],
      },
      {
        heading: "过了一分钟才冒出来的 bug",
        body: [
          "任务 ID 以前就是当前时间转成的字符串。在同一毫秒里速记添加的两条任务会拿到同一个 ID，而删除是按 ID 匹配的，删一条就把两条都删了。现在 ID 来自 crypto.randomUUID。",
          "提醒以前是按标题在 60 秒的窗口内去重，而轮询恰好也是每 60 秒一次。于是每条到期任务每分钟都会重新提醒一遍，连提示音一起。现在每条提醒都带一个由任务和日期组成的键。",
          "提示音还每次都新建一个 AudioContext，而且从不关闭。浏览器只允许一个页面开六个，所以第七次提示音会报错，之后全都没有声音。现在只有一个 context，反复使用。",
        ],
      },
      {
        heading: "计时器里那些出错了才会注意到的地方",
        body: [
          "计时器从一开始就记录连续天数，但写入它的代码从不让它过期。所以由读取它的代码来判断：最后一天早于昨天的连续记录一律算作零，不管存储的数字是多少；当天还没有专注记录时，专注页会提醒连续天数快要断了。",
          "主题在 React 渲染之前就应用好，页面不会先闪一下错的那个，系统设置的变化也会实时跟随。安装后的应用可能一连几天都开着，所以新版本会先询问再刷新。以前静默更新会在运行中的页面底下替换缓存文件，之后再加载的路由就会去请求一个已经不存在的文件。",
        ],
        figure: 3,
        code: {
          language: "javascript",
          text: streakCode,
          caption:
            "摘自 src/lib/streak.js，省略了注释。写入连续天数的代码从不把它归零，所以错过一天之后，是在这里真正结束的：今天和昨天都算数，更早的一律返回 0。",
        },
      },
    ],
    captions: [
      "全新安装后的首页：日期、本周的四个数字都是零，今天没有到期的任务。",
      "亮色模式下的专注页，已载入 25:00 的番茄钟预设，表盘旁边是预设列表。",
      "还是首页，现在显示三条进行中的任务，今天没有到期的任务。",
      "同一个专注页的暗色模式。",
    ],
    tags: ["React", "Vite", "Tailwind CSS", "Radix UI", "PWA"],
    stats: [
      { value: "2", label: "工具，有意为之" },
      { value: "0", label: "后端" },
      { value: "100%", label: "本地存储" },
      { value: "84", label: "测试" },
    ],
  },
};
