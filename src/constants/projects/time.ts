import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

const SYNC_CODE = `export function sampleOffsetMs(
  serverNowMs: number,
  startWallMs: number,
  rttMs: number
): number {
  return serverNowMs - (startWallMs + rttMs / 2)
}

export function pickBestSample(samples: readonly SyncSample[]): SyncSample {
  return samples.reduce((a, b) => (b.rttMs < a.rttMs ? b : a))
}`;

export const time: Record<Language, LocalizedContent> = {
  en: {
    tagline: "Your device's clock is probably wrong. This one isn't.",
    description:
      "An NTP-synced web clock, accurate to within hundredths of a second, that puts the corrected time on one bare screen: the date, the ISO week, the timezone and its offset, and nothing to press.",
    overview:
      "I stopped trusting the clock in the corner of my screen. It is only ever as right as whoever set the device. So I corrected it the way NTP does: hit a server endpoint several times, keep the fastest round trip, shift the timestamp by half of it, and land within hundredths of a second even when the machine showing it is set wrong. The server side is disciplined against Cloudflare, Google and pool.ntp.org over UDP, with an HTTP beacon as a fallback when UDP egress is blocked. The front of it is deliberately one screen: the weekday and date, the ISO week number, the corrected time with the seconds held back a shade, and the timezone spelled out with its UTC offset. No controls, no scrolling, nothing to configure. It reads the visitor's own timezone, so the answer is right wherever it gets opened.",
    roleSummary: "Just me: the sync layer, the API endpoint, and the typography.",
    sections: [
      {
        heading: "The server's own clock is not trusted either",
        body: [
          "Correcting a visitor's clock against a server only helps if the server is right, and a serverless host can easily sit a second off. So /api/time does not hand out the host's Date.now(). It measures the host's offset against Cloudflare, Google and pool.ntp.org over UDP, takes whichever answers first, and keeps that offset for five minutes. Requests that arrive during a refresh share the one measurement.",
          "If UDP is blocked on the way out, it falls back to Cloudflare's HTTP trace, which is good to tens of milliseconds. If that fails as well, it returns the raw host clock and labels the result as uncorrected.",
          "Taking the first answer has a trap in it. An NTP server that is not synchronised, or is turning the client away, replies with zeroed timestamps. Read literally, that puts the site in 1900, and a quick refusal would win the race. So a reply with an alarm leap indicator, the wrong mode, an out-of-range stratum or an empty transmit timestamp is thrown out before it can count.",
        ],
      },
      {
        heading: "Five round trips, and only the fastest one counts",
        body: [
          "In the browser, lib/clock-sync.ts asks /api/time five times in a row. Each round trip is timed with performance.now(), which is monotonic, so a clock change in the middle of a measurement cannot corrupt it. The server's stamp is assumed to sit halfway through the trip, which means a sample can be wrong by at most half its round trip.",
          "The sample with the shortest round trip wins and the rest are discarded. The winning offset lives in its own variable, so the clock never drops back to raw device time while a new measurement is running. 28 tests cover this maths and the date helpers around it.",
          "It measures again when it has a reason to. Every five seconds it compares the wall clock with the monotonic one, and a jump of more than a second means the clock was changed or the machine slept. A tab that comes back into view more than five minutes after the last measurement measures again too.",
        ],
        code: {
          language: "ts",
          text: SYNC_CODE,
          caption:
            "From lib/clock-sync.ts, with the doc comments left out. The server's stamp is placed halfway through the round trip, and the fastest sample wins outright, because an average would let one slow response pull the result off.",
        },
      },
      {
        heading: "A centred block whose captions hang on its edges",
        body: [
          "The page is one screen that cannot scroll. The clock is centred, its captions are not: the long date and the ISO week sit on the clock's top corners, the zone name and the UTC offset on its bottom corners, so the four of them mark out a rectangle that is never drawn.",
          "The zone is named in full from the browser's own Intl data, so it follows the visitor in and out of summer time without any timezone files. Each formatter rebuilds its string from formatToParts, so the wording and order stay the same whatever locale the browser reports.",
          "Until the page has mounted, every pair of digits renders as two dashes in the same monospaced cells. The first client paint matches the server HTML, and nothing shifts when the real time arrives.",
        ],
        figure: 1,
      },
      {
        heading: "The colons are the only thing that keeps moving",
        body: [
          "The face assembles once: the three pairs rise into place, hours first, 110 ms apart. After that the digits change in a single frame with no transition.",
          "The colons are the exception, and the only colour on the page. They go dark for the last 100 ms of every second and come back exactly on the tick. The loop is locked to the corrected time, so on a machine whose own clock is wrong it still lands on the true second. It runs on the Web Animations API with no animation library, and with reduced motion turned on none of it runs.",
        ],
      },
    ],
    captions: [
      "The clock in Central European Summer Time: the long date and ISO week above, the zone name and UTC offset below, the seconds in grey and the colons in red.",
      "The same moment three seconds later in Japan Standard Time, where it is already Thursday.",
    ],
    tags: ["Next.js", "TypeScript", "NTP", "Intl"],
    stats: [
      { value: "1/100s", label: "sync accuracy" },
      { value: "1", label: "screen, no scroll" },
      { value: "0", label: "external time APIs" },
      { value: "0", label: "controls to press" },
    ],
  },
  de: {
    tagline: "Die Uhr deines Geräts liegt wahrscheinlich falsch. Diese nicht.",
    description:
      "Eine NTP-synchronisierte Web-Uhr, genau auf Hundertstelsekunden, die die korrigierte Zeit auf einen nackten Bildschirm stellt: das Datum, die ISO-Kalenderwoche, die Zeitzone und ihren Offset, und nichts zum Drücken.",
    overview:
      "Ich habe aufgehört, der Uhr in der Ecke meines Bildschirms zu trauen. Sie ist immer nur so richtig wie derjenige, der das Gerät gestellt hat. Also habe ich sie korrigiert, wie NTP es tut: einen Server-Endpunkt mehrfach abfragen, die schnellste Laufzeit behalten, den Zeitstempel um die Hälfte davon verschieben und auf Hundertstelsekunden landen, selbst wenn die Maschine, die es anzeigt, falsch gestellt ist. Die Serverseite ist über UDP gegen Cloudflare, Google und pool.ntp.org diszipliniert, mit einem HTTP-Beacon als Rückfall, wenn UDP nach draussen blockiert ist. Die Vorderseite ist bewusst ein einziger Bildschirm: Wochentag und Datum, die ISO-Kalenderwoche, die korrigierte Zeit mit einen Ton zurückgenommenen Sekunden, und die ausgeschriebene Zeitzone mit ihrem UTC-Offset. Keine Bedienelemente, kein Scrollen, nichts zu konfigurieren. Sie liest die Zeitzone des Besuchers, damit die Antwort überall stimmt, wo man sie öffnet.",
    roleSummary: "Nur ich: die Sync-Schicht, der API-Endpunkt und die Typografie.",
    sections: [
      {
        heading: "Auch der eigenen Serveruhr wird nicht getraut",
        body: [
          "Die Uhr eines Besuchers gegen einen Server zu korrigieren, hilft nur, wenn der Server richtig geht, und ein Serverless-Host liegt schnell eine Sekunde daneben. Deshalb gibt /api/time nicht einfach Date.now() des Hosts heraus. Der Endpunkt misst die Abweichung des Hosts über UDP gegen Cloudflare, Google und pool.ntp.org, nimmt die Antwort, die zuerst kommt, und behält diesen Offset fünf Minuten lang. Anfragen, die während einer Auffrischung eintreffen, teilen sich die eine Messung.",
          "Ist UDP nach draussen gesperrt, weicht er auf Cloudflares HTTP-Trace aus, der auf einige Dutzend Millisekunden genau ist. Scheitert auch das, gibt er die rohe Hostzeit zurück und kennzeichnet sie als unkorrigiert.",
          "Die erste Antwort zu nehmen, hat eine Falle. Ein NTP-Server, der nicht synchronisiert ist oder den Client abweist, antwortet mit genullten Zeitstempeln. Wörtlich gelesen landet die Seite damit im Jahr 1900, und eine schnelle Absage würde das Rennen gewinnen. Eine Antwort mit Alarm im Leap-Indikator, falschem Modus, einem Stratum ausserhalb des gültigen Bereichs oder leerem Sendezeitstempel fliegt deshalb raus, bevor sie zählt.",
        ],
      },
      {
        heading: "Fünf Messungen, und nur die schnellste zählt",
        body: [
          "Im Browser fragt lib/clock-sync.ts fünfmal hintereinander /api/time ab. Jede Laufzeit wird mit performance.now() gemessen, das monoton läuft, also kann eine Uhrenänderung mitten in der Messung sie nicht verfälschen. Der Zeitstempel des Servers wird in der Mitte der Laufzeit angenommen, damit liegt eine Messung höchstens um die halbe Laufzeit daneben.",
          "Die Messung mit der kürzesten Laufzeit gewinnt, die anderen werden verworfen. Der gewonnene Offset steht in einer eigenen Variable, damit die Uhr nie auf die rohe Gerätezeit zurückfällt, während eine neue Messung läuft. 28 Tests decken diese Rechnung und die Datumshelfer darum herum ab.",
          "Neu gemessen wird, wenn es einen Grund gibt. Alle fünf Sekunden vergleicht der Client die Wanduhr mit der monotonen Uhr, und ein Sprung von mehr als einer Sekunde heisst, dass die Uhr verstellt wurde oder das Gerät geschlafen hat. Ein Tab, der mehr als fünf Minuten nach der letzten Messung wieder sichtbar wird, misst ebenfalls neu.",
        ],
        code: {
          language: "ts",
          text: SYNC_CODE,
          caption:
            "Aus lib/clock-sync.ts, ohne die Doc-Kommentare. Der Zeitstempel des Servers wird in die Mitte der Laufzeit gelegt, und die schnellste Messung gewinnt allein, weil ein Durchschnitt sich von einer einzigen langsamen Antwort verziehen liesse.",
        },
      },
      {
        heading: "Ein zentrierter Block, dessen Beschriftungen an seinen Kanten hängen",
        body: [
          "Die Seite ist ein einziger Bildschirm, der nicht scrollen kann. Die Uhr ist zentriert, ihre Beschriftungen sind es nicht: Das lange Datum und die ISO-Kalenderwoche sitzen an den oberen Ecken der Uhr, Zonenname und UTC-Offset an den unteren, sodass die vier ein Rechteck abstecken, das nie gezeichnet wird.",
          "Die Zone wird aus den Intl-Daten des Browsers voll ausgeschrieben, sie folgt dem Besucher also ohne Zeitzonendateien in die Sommerzeit und wieder hinaus. Jeder Formatierer baut seinen Text aus formatToParts selbst zusammen, damit Wortlaut und Reihenfolge gleich bleiben, egal welche Locale der Browser meldet.",
          "Bis die Seite gemountet ist, erscheint jedes Ziffernpaar als zwei Striche in denselben Monospace-Zellen. Das erste Rendern im Client stimmt mit dem Server-HTML überein, und nichts verschiebt sich, wenn die echte Zeit ankommt.",
        ],
        figure: 1,
      },
      {
        heading: "Nur die Doppelpunkte bewegen sich weiter",
        body: [
          "Das Zifferblatt baut sich einmal auf: Die drei Paare steigen an ihren Platz, Stunden zuerst, im Abstand von 110 ms. Danach wechseln die Ziffern in einem einzigen Frame, ohne Übergang.",
          "Die Doppelpunkte sind die Ausnahme und die einzige Farbe auf der Seite. Sie werden in den letzten 100 ms jeder Sekunde dunkel und kommen genau auf den Takt zurück. Die Schleife hängt an der korrigierten Zeit, auf einem Gerät mit falsch gestellter Uhr trifft sie also trotzdem die wahre Sekunde. Sie läuft über die Web Animations API ohne Animationsbibliothek, und mit reduzierter Bewegung läuft nichts davon.",
        ],
      },
    ],
    captions: [
      "Die Uhr in mitteleuropäischer Sommerzeit: oben das lange Datum und die ISO-Kalenderwoche, unten Zonenname und UTC-Offset, die Sekunden grau und die Doppelpunkte rot.",
      "Derselbe Moment drei Sekunden später in japanischer Normalzeit, wo es schon Donnerstag ist.",
    ],
    tags: ["Next.js", "TypeScript", "NTP", "Intl"],
    stats: [
      { value: "1/100s", label: "Sync-Genauigkeit" },
      { value: "1", label: "Bildschirm ohne Scrollen" },
      { value: "0", label: "externe Zeit-APIs" },
      { value: "0", label: "Bedienelemente" },
    ],
  },
  fr: {
    tagline: "L'horloge de votre appareil est probablement fausse. Celle-ci ne l'est pas.",
    description:
      "Une horloge web synchronisée par NTP, juste à quelques centièmes de seconde, qui pose l'heure corrigée sur un seul écran nu : la date, la semaine ISO, le fuseau et son décalage, et rien à presser.",
    overview:
      "J'ai cessé de faire confiance à l'horloge dans le coin de mon écran. Elle n'est jamais plus juste que la personne qui a réglé l'appareil. Je l'ai donc corrigée comme le fait NTP : interroger un point d'API plusieurs fois, garder l'aller-retour le plus rapide, décaler l'horodatage de la moitié, et retomber à quelques centièmes de seconde même quand la machine qui l'affiche est mal réglée. Côté serveur, la discipline se fait contre Cloudflare, Google et pool.ntp.org en UDP, avec une balise HTTP en repli si l'UDP sortant est bloqué. La façade, elle, est délibérément un seul écran : le jour et la date, le numéro de semaine ISO, l'heure corrigée avec les secondes retenues d'un ton, et le fuseau écrit en entier avec son décalage UTC. Aucune commande, aucun défilement, rien à configurer. Elle lit le fuseau du visiteur, donc la réponse est juste partout où on l'ouvre.",
    roleSummary: "Moi seul : la couche de synchronisation, le point d'API et la typographie.",
    sections: [
      {
        heading: "L'horloge du serveur n'a pas droit à la confiance non plus",
        body: [
          "Corriger l'horloge d'un visiteur contre un serveur ne sert que si le serveur est juste, et un hôte serverless peut facilement être décalé d'une seconde. /api/time ne renvoie donc pas le Date.now() de l'hôte. Il mesure l'écart de l'hôte contre Cloudflare, Google et pool.ntp.org en UDP, prend la première réponse arrivée et garde ce décalage cinq minutes. Les requêtes qui arrivent pendant un rafraîchissement se partagent la même mesure.",
          "Si l'UDP sortant est bloqué, il se rabat sur la trace HTTP de Cloudflare, juste à quelques dizaines de millisecondes. Si cela échoue aussi, il renvoie l'horloge brute de l'hôte et marque le résultat comme non corrigé.",
          "Prendre la première réponse cache un piège. Un serveur NTP qui n'est pas synchronisé, ou qui éconduit le client, répond avec des horodatages à zéro. Lus tels quels, ils placent le site en 1900, et un refus rapide gagnerait la course. Une réponse avec un indicateur de saut en alarme, le mauvais mode, une strate hors limites ou un horodatage d'émission vide est donc écartée avant de compter.",
        ],
      },
      {
        heading: "Cinq allers-retours, et seul le plus rapide compte",
        body: [
          "Dans le navigateur, lib/clock-sync.ts interroge /api/time cinq fois de suite. Chaque aller-retour est chronométré avec performance.now(), qui est monotone, si bien qu'un changement d'horloge en pleine mesure ne peut pas la fausser. L'horodatage du serveur est supposé tomber au milieu du trajet, donc une mesure se trompe au plus de la moitié de son aller-retour.",
          "La mesure au plus court aller-retour l'emporte et les autres sont jetées. Le décalage retenu vit dans sa propre variable, pour que l'horloge ne retombe jamais sur l'heure brute de l'appareil pendant qu'une nouvelle mesure tourne. 28 tests couvrent ce calcul et les utilitaires de date qui l'entourent.",
          "Elle remesure quand elle a une raison de le faire. Toutes les cinq secondes, elle compare l'horloge murale à l'horloge monotone, et un saut de plus d'une seconde signifie que l'horloge a été changée ou que la machine a dormi. Un onglet qui redevient visible plus de cinq minutes après la dernière mesure remesure aussi.",
        ],
        code: {
          language: "ts",
          text: SYNC_CODE,
          caption:
            "Tiré de lib/clock-sync.ts, sans les commentaires de documentation. L'horodatage du serveur est placé au milieu de l'aller-retour, et la mesure la plus rapide gagne seule, parce qu'une moyenne laisserait une seule réponse lente tirer le résultat de travers.",
        },
      },
      {
        heading: "Un bloc centré dont les légendes s'accrochent aux bords",
        body: [
          "La page est un seul écran qui ne peut pas défiler. L'horloge est centrée, ses légendes ne le sont pas : la date longue et la semaine ISO se posent aux coins supérieurs de l'horloge, le nom du fuseau et le décalage UTC aux coins inférieurs, si bien que les quatre dessinent un rectangle qui n'est jamais tracé.",
          "Le fuseau est nommé en entier à partir des données Intl du navigateur, il suit donc le visiteur à l'entrée et à la sortie de l'heure d'été sans aucun fichier de fuseaux. Chaque formateur reconstruit sa chaîne à partir de formatToParts, pour que la formulation et l'ordre restent les mêmes quelle que soit la locale annoncée par le navigateur.",
          "Tant que la page n'est pas montée, chaque paire de chiffres s'affiche en deux tirets dans les mêmes cases à chasse fixe. Le premier rendu côté client correspond au HTML du serveur, et rien ne bouge quand l'heure réelle arrive.",
        ],
        figure: 1,
      },
      {
        heading: "Seuls les deux-points continuent de bouger",
        body: [
          "Le cadran se compose une seule fois : les trois paires montent à leur place, les heures d'abord, à 110 ms d'intervalle. Ensuite, les chiffres changent en une seule image, sans transition.",
          "Les deux-points font exception, et ce sont la seule couleur de la page. Ils s'éteignent pendant les 100 dernières ms de chaque seconde et reviennent exactement sur le top. La boucle est calée sur l'heure corrigée, donc sur une machine dont l'horloge est fausse elle tombe quand même sur la vraie seconde. Elle tourne sur la Web Animations API sans bibliothèque d'animation, et avec le mouvement réduit activé, rien de tout cela ne tourne.",
        ],
      },
    ],
    captions: [
      "L'horloge à l'heure d'été d'Europe centrale : la date longue et la semaine ISO en haut, le nom du fuseau et le décalage UTC en bas, les secondes en gris et les deux-points en rouge.",
      "Le même instant trois secondes plus tard à l'heure normale du Japon, où l'on est déjà jeudi.",
    ],
    tags: ["Next.js", "TypeScript", "NTP", "Intl"],
    stats: [
      { value: "1/100s", label: "précision de sync" },
      { value: "1", label: "écran, sans défilement" },
      { value: "0", label: "API de temps externes" },
      { value: "0", label: "commandes à presser" },
    ],
  },
  zh: {
    tagline: "你设备上的时钟大概是错的。这一个不是。",
    description:
      "一个用 NTP 校准的网页时钟，误差在百分之几秒以内，并把校正后的时间放在一整块空屏上：日期、ISO 周数、时区和它的偏移量，没有任何东西可按。",
    overview:
      "我不再相信屏幕角落那个时钟了。它能有多准，全看是谁把这台设备调的。于是我照着 NTP 的做法去纠正它：对服务端接口连打几次，留下往返最快的那一次，把时间戳往前挪半个往返，最后落在百分之几秒之内，哪怕显示它的那台机器本身调错了。服务端这一侧通过 UDP 对 Cloudflare、Google 和 pool.ntp.org 校准，若 UDP 出站被封，就退回一个 HTTP 时间信标。前面这一层是刻意做成一整屏的：星期和日期、ISO 周数、把秒压暗一档的校正时间，以及写全的时区名和它的 UTC 偏移。没有控件，不用滚动，没什么要配置的。它读的是访客自己的时区，所以在哪儿打开，答案都是对的。",
    roleSummary: "只有我：同步层、API 接口，以及排版。",
    sections: [
      {
        heading: "服务器自己的时钟也不能信",
        body: [
          "拿服务器去校正访客的时钟，前提是服务器本身是准的，而一台 serverless 主机偏个一秒并不稀奇。所以 /api/time 不直接交出主机的 Date.now()。它通过 UDP 对 Cloudflare、Google 和 pool.ntp.org 测出主机的偏差，谁先回答就用谁，并把这个偏移量保留五分钟。刷新期间进来的请求共用同一次测量。",
          "如果出站的 UDP 被封，它就退到 Cloudflare 的 HTTP trace，精度在几十毫秒。要是这一步也失败，它就返回主机的原始时间，并把结果标成未校正。",
          "谁先回答就用谁，这里面有个坑。一台没有同步好、或者正在拒绝客户端的 NTP 服务器，会回一个全是零的时间戳。照字面读，网站就回到了 1900 年，而一次快速的拒绝还会赢下这场比赛。所以闰秒指示为告警、模式不对、层级超出范围，或者发送时间戳为空的回复，都会在算数之前被丢掉。",
        ],
      },
      {
        heading: "测五次往返，只算最快的那一次",
        body: [
          "在浏览器里，lib/clock-sync.ts 连续向 /api/time 请求五次。每次往返都用单调递增的 performance.now() 计时，所以测量途中改了系统时钟也破坏不了它。服务器的时间戳被假定落在往返的正中间，因此一次采样最多错半个往返。",
          "往返最短的那次采样胜出，其余的直接丢掉。胜出的偏移量存在自己的变量里，这样在新一轮测量进行时，时钟也不会退回设备的原始时间。28 个测试覆盖了这段计算和它周围的日期辅助函数。",
          "有理由的时候它才重新测量。每隔五秒，它比较一次墙上时钟和单调时钟，跳变超过一秒就说明时钟被改过，或者机器睡过一觉。距离上次测量超过五分钟后重新变为可见的标签页，也会重新测量。",
        ],
        code: {
          language: "ts",
          text: SYNC_CODE,
          caption:
            "摘自 lib/clock-sync.ts，省略了文档注释。服务器的时间戳被放在往返的正中间，最快的那次采样直接胜出，因为取平均的话，一次慢响应就能把结果拖偏。",
        },
      },
      {
        heading: "居中的方块，说明文字挂在它的边上",
        body: [
          "整页就是一屏，而且无法滚动。时钟是居中的，它的说明文字却不是：长日期和 ISO 周数贴在时钟上方的两角，时区名和 UTC 偏移贴在下方的两角，四者围出一个从来没有画出来的矩形。",
          "时区名取自浏览器自带的 Intl 数据并写全，所以进出夏令时它都会跟着访客走，不需要任何时区数据文件。每个格式化函数都用 formatToParts 自己拼出字符串，所以不管浏览器报的是哪种区域设置，措辞和顺序都不变。",
          "页面挂载之前，每一对数字都显示成两个短横，占的是同样的等宽格子。客户端的第一次绘制和服务端的 HTML 一致，真实时间到来时，什么都不会移位。",
        ],
        figure: 1,
      },
      {
        heading: "只有冒号还在动",
        body: [
          "表盘只组装一次：三对数字依次升到位，小时在先，间隔 110 毫秒。之后数字在一帧之内直接切换，没有过渡。",
          "冒号是唯一的例外，也是页面上唯一的颜色。它们在每一秒的最后 100 毫秒变暗，正好在整秒时亮回来。这个循环锁定的是校正后的时间，所以即使机器自己的时钟不准，它依然落在真正的那一秒上。它跑在 Web Animations API 上，没有用动画库；开启减少动态效果时，这些全都不会运行。",
        ],
      },
    ],
    captions: [
      "处于中欧夏令时的时钟：上方是长日期和 ISO 周数，下方是时区名和 UTC 偏移，秒是灰色，冒号是红色。",
      "三秒之后的同一时刻，换成日本标准时间，那边已经是星期四。",
    ],
    tags: ["Next.js", "TypeScript", "NTP", "Intl"],
    stats: [
      { value: "1/100s", label: "同步精度" },
      { value: "1", label: "屏幕（无滚动）" },
      { value: "0", label: "外部时间 API" },
      { value: "0", label: "可按的控件" },
    ],
  },
};
