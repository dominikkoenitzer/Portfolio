import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const time: Record<Language, LocalizedContent> = {
  en: {
    tagline: "Your device's clock is probably wrong. This one isn't.",
    description:
      "An NTP-synced web clock, accurate to within hundredths of a second, that puts the corrected time on one bare screen: the date, the ISO week, the timezone and its offset, and nothing to press.",
    overview:
      "I stopped trusting the clock in the corner of my screen. It is only ever as right as whoever set the device. So I corrected it the way NTP does: hit a server endpoint several times, keep the fastest round trip, shift the timestamp by half of it, and land within hundredths of a second even when the machine showing it is set wrong. The server side is disciplined against Cloudflare, Google and pool.ntp.org over UDP, with an HTTP beacon as a fallback when UDP egress is blocked. The front of it is deliberately one screen: the weekday and date, the ISO week number, the corrected time with the seconds held back a shade, and the timezone spelled out with its UTC offset. No controls, no scrolling, nothing to configure. It reads the visitor's own timezone, so the answer is right wherever it gets opened.",
    roleSummary: "Just me: the sync layer, the API endpoint, and the typography.",
    problemStatement:
      "A clock is only as honest as the device it runs on, and most of the web just parrots the local system time, drift and all. Time measures against a server instead, NTP-style, and then gets out of the way: one screen, no chrome, nothing to press.",
    objectives: [
      "Show the actual current time, server-corrected to within hundredths of a second.",
      "Stay right even when the local clock has drifted or been set wrong.",
      "Answer in the visitor's own timezone, named in full and with its UTC offset, without asking them anything.",
    ],
    architectureDecisions: [
      "Next.js with a single /api/time endpoint disciplined against public NTP servers over UDP, kept well away from the client-side sync logic.",
      "The client keeps the lowest round-trip sample, compensates for RTT/2, and treats that as its accuracy bound, so no single request gets to be the source of truth.",
      "The interface is type and nothing else: no canvas, no animation library, no controls, so the only things that move on the page are the digits and the colons.",
    ],
    implementationHighlights: [
      "NTP-style sampling that re-measures on sleep and wake, on a manual clock change, and whenever the tab comes back into view after the result goes stale.",
      "One screen that fits any viewport without scrolling: weekday and date, ISO week number, the time with the seconds set a step back, and the timezone name beside its UTC offset.",
      "Time and timezone computed client-side with the built-in Intl APIs, so there is no external time API and no timezone data files.",
    ],
    qualityAndSecurity: [
      "Watchdogs re-sync the moment the wall-clock-versus-monotonic baseline jumps, so the accuracy I show stays the accuracy I have.",
      "The server has exactly one job: return NTP-disciplined UTC, with an HTTP fallback for when UDP is not on the table.",
      "34 test cases over the wall-clock helpers and the sync maths.",
      "It degrades quietly: with no fresh measurement, the clock keeps ticking from local time instead of falling over.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Trust one network request and you inherit whatever latency that one request happened to draw.",
        solution:
          "Sample several times, keep the fastest round trip, shift the timestamp by half of it, and publish RTT/2 as the honest accuracy bound.",
      },
      {
        challenge:
          "A clock with no chrome has nowhere to hide. Any layout shift, any font swap, any jitter in the digits is the whole page moving.",
        solution:
          "The digits sit in fixed cells and the layout reserves its boxes, so the number changes without anything around it moving.",
      },
    ],
    hiringSignals: [
      "Real NTP-style clock discipline: round-trip sampling, offset correction, and a stated accuracy bound rather than a polite wrapper around Date.now().",
      "I can leave a page almost empty on purpose. The hard part was the sync layer, and the interface is there to state its result, not to decorate it.",
      "I owned both halves, the server endpoint and the rendered page, and kept them from leaking into each other.",
    ],
    nextIterations: [
      "A visible accuracy readout, so you can see the current sync bound for yourself.",
      "Configurable timezones and side-by-side world clocks.",
    ],
    tags: ["Next.js", "TypeScript", "NTP", "Intl"],
    impactHeading: "What This Project Is Good For",
    impactPoints: [
      "Gives people a clock they can trust even when their own device can't be.",
      "Answers in the visitor's own timezone, spelled out, with no setting to change.",
      "Puts precision engineering behind an interface that keeps nothing in the way.",
    ],
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
    problemStatement:
      "Eine Uhr ist nur so ehrlich wie das Gerät, auf dem sie läuft, und das meiste Web plappert einfach die lokale Systemzeit nach, Drift inklusive. Time misst stattdessen gegen einen Server, NTP-artig, und geht dann aus dem Weg: ein Bildschirm, kein Beiwerk, nichts zum Drücken.",
    objectives: [
      "Die tatsächliche aktuelle Zeit zeigen, serverkorrigiert auf Hundertstelsekunden.",
      "Richtig bleiben, auch wenn die lokale Uhr gedriftet ist oder falsch gestellt wurde.",
      "In der Zeitzone des Besuchers antworten, voll ausgeschrieben und mit ihrem UTC-Offset, ohne ihn etwas zu fragen.",
    ],
    architectureDecisions: [
      "Next.js mit einem einzigen /api/time-Endpunkt, über UDP gegen öffentliche NTP-Server diszipliniert und klar getrennt von der Sync-Logik im Client.",
      "Der Client behält die Messung mit der kürzesten Laufzeit, kompensiert um RTT/2 und behandelt das als seine Genauigkeitsgrenze, damit keine einzelne Anfrage zur Quelle der Wahrheit wird.",
      "Die Oberfläche ist Typografie und sonst nichts: kein Canvas, keine Animationsbibliothek, keine Bedienelemente, sodass sich auf der Seite nur die Ziffern und die Doppelpunkte bewegen.",
    ],
    implementationHighlights: [
      "NTP-artiges Sampling, das bei Schlafen und Aufwachen, bei einer manuellen Uhrenänderung und immer dann neu misst, wenn der Tab nach abgelaufenem Ergebnis wieder sichtbar wird.",
      "Ein Bildschirm, der ohne Scrollen in jedes Viewport passt: Wochentag und Datum, die ISO-Kalenderwoche, die Zeit mit zurückgenommenen Sekunden und der Name der Zeitzone neben ihrem UTC-Offset.",
      "Zeit und Zeitzone werden clientseitig mit den eingebauten Intl-APIs berechnet, es gibt also keine externe Zeit-API und keine Zeitzonendateien.",
    ],
    qualityAndSecurity: [
      "Watchdogs synchronisieren neu, sobald die Basislinie aus Wandzeit und monotoner Zeit springt, damit die angezeigte Genauigkeit die tatsächliche bleibt.",
      "Der Server hat genau eine Aufgabe: NTP-diszipliniertes UTC zurückgeben, mit HTTP-Rückfall, wenn UDP nicht zur Verfügung steht.",
      "34 Testfälle über die Wandzeit-Helfer und die Sync-Mathematik.",
      "Es degradiert still: ohne frische Messung tickt die Uhr aus der lokalen Zeit weiter, statt umzufallen.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Traue einer einzigen Netzwerkanfrage, und du erbst genau die Latenz, die diese eine Anfrage gerade gezogen hat.",
        solution:
          "Mehrfach messen, die kürzeste Laufzeit behalten, den Zeitstempel um die Hälfte davon verschieben und RTT/2 als ehrliche Genauigkeitsgrenze veröffentlichen.",
      },
      {
        challenge:
          "Eine Uhr ohne Beiwerk hat keinen Ort, an dem sie sich verstecken kann. Jeder Layoutsprung, jeder Font-Wechsel, jedes Zittern in den Ziffern ist die ganze Seite, die sich bewegt.",
        solution:
          "Die Ziffern sitzen in festen Zellen und das Layout reserviert seine Kästen, also wechselt die Zahl, ohne dass sich drumherum etwas bewegt.",
      },
    ],
    hiringSignals: [
      "Echte NTP-artige Uhrendisziplin: Laufzeit-Sampling, Offset-Korrektur und eine ausgewiesene Genauigkeitsgrenze statt einer höflichen Hülle um Date.now().",
      "Ich kann eine Seite bewusst fast leer lassen. Der schwere Teil war die Sync-Schicht, und die Oberfläche ist da, um ihr Ergebnis zu nennen, nicht um es zu schmücken.",
      "Ich habe beide Hälften verantwortet, den Server-Endpunkt und die gerenderte Seite, und sie voneinander freigehalten.",
    ],
    nextIterations: [
      "Eine sichtbare Genauigkeitsanzeige, damit man die aktuelle Sync-Grenze selbst sehen kann.",
      "Konfigurierbare Zeitzonen und Weltzeituhren nebeneinander.",
    ],
    tags: ["Next.js", "TypeScript", "NTP", "Intl"],
    impactHeading: "Wofür dieses Projekt gut ist",
    impactPoints: [
      "Gibt Leuten eine Uhr, der sie trauen können, auch wenn das eigene Gerät es nicht verdient.",
      "Antwortet in der Zeitzone des Besuchers, ausgeschrieben, ohne eine Einstellung, die man ändern muss.",
      "Stellt Präzisionsarbeit hinter eine Oberfläche, die nichts dazwischenstellt.",
    ],
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
    problemStatement:
      "Une horloge n'est jamais plus honnête que l'appareil sur lequel elle tourne, et la plupart du web se contente de répéter l'heure système locale, dérive comprise. Time mesure plutôt contre un serveur, à la façon de NTP, puis s'efface : un écran, aucun habillage, rien à presser.",
    objectives: [
      "Montrer l'heure réelle, corrigée par le serveur à quelques centièmes de seconde.",
      "Rester juste même quand l'horloge locale a dérivé ou a été mal réglée.",
      "Répondre dans le fuseau du visiteur, nommé en entier et avec son décalage UTC, sans rien lui demander.",
    ],
    architectureDecisions: [
      "Next.js avec un unique point /api/time discipliné en UDP contre des serveurs NTP publics, tenu bien à l'écart de la logique de synchronisation côté client.",
      "Le client garde l'échantillon au plus court aller-retour, compense de RTT/2, et traite cela comme sa borne de précision, si bien qu'aucune requête seule ne devient la source de vérité.",
      "L'interface est de la typographie et rien d'autre : pas de canvas, pas de bibliothèque d'animation, aucune commande, si bien que seuls les chiffres et les deux-points bougent sur la page.",
    ],
    implementationHighlights: [
      "Un échantillonnage façon NTP qui remesure à la veille et au réveil, lors d'un changement manuel d'horloge, et chaque fois que l'onglet redevient visible après péremption du résultat.",
      "Un écran qui tient dans n'importe quelle fenêtre sans défilement : le jour et la date, le numéro de semaine ISO, l'heure avec les secondes d'un cran en retrait, et le nom du fuseau à côté de son décalage UTC.",
      "L'heure et le fuseau sont calculés côté client avec les API Intl intégrées, donc aucune API de temps externe et aucun fichier de données de fuseaux.",
    ],
    qualityAndSecurity: [
      "Des chiens de garde resynchronisent dès que l'écart entre horloge murale et horloge monotone saute, pour que la précision affichée reste la précision réelle.",
      "Le serveur a exactement une tâche : renvoyer de l'UTC discipliné par NTP, avec un repli HTTP quand l'UDP n'est pas disponible.",
      "34 cas de test sur les utilitaires d'horloge et les maths de la synchronisation.",
      "La dégradation est silencieuse : sans mesure fraîche, l'horloge continue de battre depuis l'heure locale au lieu de s'écrouler.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Faites confiance à une seule requête réseau et vous héritez de la latence que cette requête a tirée au hasard.",
        solution:
          "Échantillonner plusieurs fois, garder l'aller-retour le plus rapide, décaler l'horodatage de la moitié, et publier RTT/2 comme borne de précision honnête.",
      },
      {
        challenge:
          "Une horloge sans habillage n'a nulle part où se cacher. Le moindre décalage de mise en page, le moindre échange de police, la moindre secousse dans les chiffres, c'est toute la page qui bouge.",
        solution:
          "Les chiffres occupent des cases fixes et la mise en page réserve ses boîtes, si bien que le nombre change sans que rien autour ne se déplace.",
      },
    ],
    hiringSignals: [
      "Une vraie discipline d'horloge façon NTP : échantillonnage des allers-retours, correction d'offset, et une borne de précision annoncée plutôt qu'une enveloppe polie autour de Date.now().",
      "Je sais laisser une page presque vide exprès. Le difficile était la couche de synchronisation, et l'interface est là pour énoncer son résultat, pas pour le décorer.",
      "J'ai porté les deux moitiés, le point d'API et la page rendue, en les empêchant de se mélanger.",
    ],
    nextIterations: [
      "Un affichage visible de la précision, pour qu'on voie soi-même la borne de synchronisation actuelle.",
      "Des fuseaux configurables et des horloges du monde côte à côte.",
    ],
    tags: ["Next.js", "TypeScript", "NTP", "Intl"],
    impactHeading: "À quoi sert ce projet",
    impactPoints: [
      "Donne aux gens une horloge à laquelle se fier même quand leur propre appareil ne le mérite pas.",
      "Répond dans le fuseau du visiteur, écrit en entier, sans aucun réglage à changer.",
      "Met de l'ingénierie de précision derrière une interface qui ne laisse rien en travers.",
    ],
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
    problemStatement:
      "一个时钟有多诚实，取决于它跑在什么设备上，而网上多数时钟只是把本地系统时间照搬一遍，连漂移一起搬。Time 改成对着服务器测，用 NTP 那一套，然后就让开：一屏，没有多余装饰，也没有什么可按的。",
    objectives: [
      "显示真正的当前时间，由服务端校正到百分之几秒。",
      "即使本地时钟已经漂了或被调错，也依然准。",
      "用访客自己的时区回答，名字写全并带上 UTC 偏移，什么都不用问他。",
    ],
    architectureDecisions: [
      "Next.js，只有一个 /api/time 接口，通过 UDP 对公共 NTP 服务器校准，并与客户端的同步逻辑保持距离。",
      "客户端只留往返最短的那次采样，按 RTT/2 补偿，并把它当作自己的精度上界，这样没有任何单次请求能当真源。",
      "界面就是排版，别无他物：没有 canvas，没有动画库，没有控件，所以页面上会动的只有数字和冒号。",
    ],
    implementationHighlights: [
      "NTP 式采样，会在睡眠与唤醒、手动改动系统时钟，以及结果过期后标签页重新可见时重新测量。",
      "一整屏，不用滚动就能装进任何视窗：星期和日期、ISO 周数、把秒退后一档的时间，以及时区名紧挨着它的 UTC 偏移。",
      "时间和时区都用内置的 Intl API 在客户端算出来，所以没有外部时间 API，也没有时区数据文件。",
    ],
    qualityAndSecurity: [
      "看门狗会在墙上时钟与单调时钟的基线发生跳变时立刻重新同步，让我展示的精度就是我真有的精度。",
      "服务端只有一件事要做：返回经 NTP 校准的 UTC，UDP 不可用时退回 HTTP。",
      "34 个测试用例，覆盖墙上时钟的辅助函数和同步相关的数学。",
      "它会安静地退化：没有新的测量时，时钟就接着按本地时间走，而不是直接倒下。",
    ],
    challengesAndSolutions: [
      {
        challenge: "只信一次网络请求，你就得连那一次恰好抽到的延迟一起继承下来。",
        solution: "多测几次，留下最快的那次往返，把时间戳往前挪半个往返，并把 RTT/2 作为诚实的精度上界公布出来。",
      },
      {
        challenge: "一个没有装饰的时钟无处躲藏。任何一次布局位移、任何一次字体替换、数字上任何一点抖动，都是整页在动。",
        solution: "数字待在固定的格子里，布局把自己的盒子先占好，所以数值变了，周围什么都不会挪。",
      },
    ],
    hiringSignals: [
      "真正的 NTP 式时钟校准：往返采样、偏移修正，以及一个明说出来的精度上界，而不是给 Date.now() 套层客气的壳。",
      "我能故意把一页留得几乎是空的。难的部分在同步层，界面存在的意义是把结果说清楚，不是把它装饰起来。",
      "两头都由我负责，服务端接口和渲染出来的那一页，而且不让它们互相渗进去。",
    ],
    nextIterations: [
      "一个能看见的精度读数，让你自己看到当前的同步上界。",
      "可配置的时区，以及并排的世界时钟。",
    ],
    tags: ["Next.js", "TypeScript", "NTP", "Intl"],
    impactHeading: "这个项目有什么用",
    impactPoints: [
      "给人一个能信的时钟，哪怕他手上那台设备不值得信。",
      "用访客自己的时区回答，名字写全，没有任何设置要改。",
      "把精密工程放在一个不挡路的界面后面。",
    ],
    stats: [
      { value: "1/100s", label: "同步精度" },
      { value: "1", label: "屏幕（无滚动）" },
      { value: "0", label: "外部时间 API" },
      { value: "0", label: "可按的控件" },
    ],
  },
};
