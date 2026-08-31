import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const time: Record<Language, LocalizedContent> = {
  en: {
    tagline: "Your device's clock is probably wrong. This one isn't.",
    description:
      "An NTP-synced web clock, accurate to within hundredths of a second, that turns the whole scale of time into one WebGL scene you scroll through.",
    overview:
      "I stopped trusting the clock in the corner of my screen. It is only ever as right as whoever set the device. So I corrected it the way NTP does: hit a server endpoint several times, keep the fastest round trip, shift the timestamp by half of it, and land within hundredths of a second even when the machine showing it is set wrong. The server side is disciplined against Cloudflare, Google and pool.ntp.org over UDP, with an HTTP beacon as a fallback when UDP egress is blocked. Then I made the home page worth looking at: one raw-WebGL scene, where you scroll to fall out of this second into the day, the year and the Unix epoch.",
    roleSummary: "Just me: the sync layer, the API endpoint, and the WebGL scene.",
    problemStatement:
      "A clock is only as honest as the device it runs on, and most of the web just parrots the local system time, drift and all. Time measures against a server instead, NTP-style, and refuses to be a bare digit while it's at it.",
    objectives: [
      "Show the actual current time, server-corrected to within hundredths of a second.",
      "Stay right even when the local clock has drifted or been set wrong.",
      "Make the scale of time something you can feel by scrolling from one second out to the Unix epoch.",
    ],
    architectureDecisions: [
      "Next.js with a single /api/time endpoint disciplined against public NTP servers over UDP, kept well away from the client-side sync logic.",
      "The client keeps the lowest round-trip sample, compensates for RTT/2, and treats that as its accuracy bound, so no single request gets to be the source of truth.",
      "Raw WebGL for the kinetic home page. No animation library, and the timekeeping core and the scene stay cleanly separated.",
    ],
    implementationHighlights: [
      "NTP-style sampling that re-measures on sleep and wake, on a manual clock change, and whenever the tab comes back into view after the result goes stale.",
      "A scrollable scene that falls through the second, the day, the year and the Unix epoch over a live WebGL field.",
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
          "Rendering the entire sweep of time, a second out to the Unix epoch, as one continuous scene that never stutters.",
        solution:
          "Drove the scroll with raw WebGL and a set of easing curves, keeping the field alive without dropping frames.",
      },
    ],
    hiringSignals: [
      "Real NTP-style clock discipline: round-trip sampling, offset correction, and a stated accuracy bound rather than a polite wrapper around Date.now().",
      "I am comfortable dropping to raw WebGL when a scene needs to be exactly one thing.",
      "I owned both halves, the server endpoint and the rendered frame, and kept them from leaking into each other.",
    ],
    nextIterations: [
      "A visible accuracy readout, so you can see the current sync bound for yourself.",
      "Configurable timezones and side-by-side world clocks.",
    ],
    tags: ["Next.js", "TypeScript", "WebGL", "NTP"],
    impactHeading: "What This Project Is Good For",
    impactPoints: [
      "Gives people a clock they can trust even when their own device can't be.",
      "Turns the scale of time into something you feel by scrolling.",
      "Puts precision engineering and an immersive interface in the same small product.",
    ],
    stats: [
      { value: "1/100s", label: "sync accuracy" },
      { value: "4", label: "time scales" },
      { value: "0", label: "external time APIs" },
      { value: "0", label: "animation libs" },
    ],
  },
  de: {
    tagline: "Die Uhr deines Geräts liegt wahrscheinlich falsch. Diese nicht.",
    description:
      "Eine NTP-synchronisierte Web-Uhr, genau auf Hundertstelsekunden, die die ganze Grössenordnung der Zeit in eine WebGL-Szene verwandelt, durch die man scrollt.",
    overview:
      "Ich habe aufgehört, der Uhr in der Ecke meines Bildschirms zu trauen. Sie ist immer nur so richtig wie derjenige, der das Gerät gestellt hat. Also habe ich sie korrigiert, wie NTP es tut: einen Server-Endpunkt mehrfach abfragen, die schnellste Laufzeit behalten, den Zeitstempel um die Hälfte davon verschieben und auf Hundertstelsekunden landen, selbst wenn die Maschine, die es anzeigt, falsch gestellt ist. Die Serverseite ist über UDP gegen Cloudflare, Google und pool.ntp.org diszipliniert, mit einem HTTP-Beacon als Rückfall, wenn UDP nach draussen blockiert ist. Danach habe ich die Startseite sehenswert gemacht: eine einzige Raw-WebGL-Szene, in der man scrollt, um aus dieser Sekunde in den Tag, das Jahr und die Unix-Epoche zu fallen.",
    roleSummary: "Nur ich: die Sync-Schicht, der API-Endpunkt und die WebGL-Szene.",
    problemStatement:
      "Eine Uhr ist nur so ehrlich wie das Gerät, auf dem sie läuft, und das meiste Web plappert einfach die lokale Systemzeit nach, Drift inklusive. Time misst stattdessen gegen einen Server, NTP-artig, und weigert sich dabei, bloss eine Ziffer zu sein.",
    objectives: [
      "Die tatsächliche aktuelle Zeit zeigen, serverkorrigiert auf Hundertstelsekunden.",
      "Richtig bleiben, auch wenn die lokale Uhr gedriftet ist oder falsch gestellt wurde.",
      "Die Grössenordnung der Zeit spürbar machen, indem man von einer Sekunde bis zur Unix-Epoche scrollt.",
    ],
    architectureDecisions: [
      "Next.js mit einem einzigen /api/time-Endpunkt, über UDP gegen öffentliche NTP-Server diszipliniert und klar getrennt von der Sync-Logik im Client.",
      "Der Client behält die Messung mit der kürzesten Laufzeit, kompensiert um RTT/2 und behandelt das als seine Genauigkeitsgrenze, damit keine einzelne Anfrage zur Quelle der Wahrheit wird.",
      "Raw WebGL für die kinetische Startseite. Keine Animationsbibliothek, und der Zeitmess-Kern bleibt sauber von der Szene getrennt.",
    ],
    implementationHighlights: [
      "NTP-artiges Sampling, das bei Schlafen und Aufwachen, bei einer manuellen Uhrenänderung und immer dann neu misst, wenn der Tab nach abgelaufenem Ergebnis wieder sichtbar wird.",
      "Eine scrollbare Szene, die durch die Sekunde, den Tag, das Jahr und die Unix-Epoche fällt, über einem lebendigen WebGL-Feld.",
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
          "Den ganzen Bogen der Zeit rendern, von einer Sekunde bis zur Unix-Epoche, als eine durchgehende Szene, die nie stockt.",
        solution:
          "Das Scrollen mit Raw WebGL und einem Satz Easing-Kurven getrieben, sodass das Feld lebendig bleibt, ohne Frames zu verlieren.",
      },
    ],
    hiringSignals: [
      "Echte NTP-artige Uhrendisziplin: Laufzeit-Sampling, Offset-Korrektur und eine ausgewiesene Genauigkeitsgrenze statt einer höflichen Hülle um Date.now().",
      "Ich greife problemlos zu Raw WebGL, wenn eine Szene genau eine Sache sein muss.",
      "Ich habe beide Hälften verantwortet, den Server-Endpunkt und das gerenderte Bild, und sie voneinander freigehalten.",
    ],
    nextIterations: [
      "Eine sichtbare Genauigkeitsanzeige, damit man die aktuelle Sync-Grenze selbst sehen kann.",
      "Konfigurierbare Zeitzonen und Weltzeituhren nebeneinander.",
    ],
    tags: ["Next.js", "TypeScript", "WebGL", "NTP"],
    impactHeading: "Wofür dieses Projekt gut ist",
    impactPoints: [
      "Gibt Leuten eine Uhr, der sie trauen können, auch wenn das eigene Gerät es nicht verdient.",
      "Macht die Grössenordnung der Zeit zu etwas, das man beim Scrollen spürt.",
      "Bringt Präzisionsarbeit und eine immersive Oberfläche in dasselbe kleine Produkt.",
    ],
    stats: [
      { value: "1/100s", label: "Sync-Genauigkeit" },
      { value: "4", label: "Zeitskalen" },
      { value: "0", label: "externe Zeit-APIs" },
      { value: "0", label: "Animations-Libs" },
    ],
  },
  fr: {
    tagline: "L'horloge de votre appareil est probablement fausse. Celle-ci ne l'est pas.",
    description:
      "Une horloge web synchronisée par NTP, juste à quelques centièmes de seconde, qui transforme toute l'échelle du temps en une scène WebGL que l'on parcourt au scroll.",
    overview:
      "J'ai cessé de faire confiance à l'horloge dans le coin de mon écran. Elle n'est jamais plus juste que la personne qui a réglé l'appareil. Je l'ai donc corrigée comme le fait NTP : interroger un point d'API plusieurs fois, garder l'aller-retour le plus rapide, décaler l'horodatage de la moitié, et retomber à quelques centièmes de seconde même quand la machine qui l'affiche est mal réglée. Côté serveur, la discipline se fait contre Cloudflare, Google et pool.ntp.org en UDP, avec une balise HTTP en repli si l'UDP sortant est bloqué. Ensuite j'ai rendu la page d'accueil digne d'un regard : une seule scène en WebGL brut, où l'on scrolle pour tomber de cette seconde vers le jour, l'année et l'epoch Unix.",
    roleSummary: "Moi seul : la couche de synchronisation, le point d'API et la scène WebGL.",
    problemStatement:
      "Une horloge n'est jamais plus honnête que l'appareil sur lequel elle tourne, et la plupart du web se contente de répéter l'heure système locale, dérive comprise. Time mesure plutôt contre un serveur, à la façon de NTP, et refuse au passage de n'être qu'un chiffre nu.",
    objectives: [
      "Montrer l'heure réelle, corrigée par le serveur à quelques centièmes de seconde.",
      "Rester juste même quand l'horloge locale a dérivé ou a été mal réglée.",
      "Rendre l'échelle du temps sensible, en scrollant d'une seconde jusqu'à l'epoch Unix.",
    ],
    architectureDecisions: [
      "Next.js avec un unique point /api/time discipliné en UDP contre des serveurs NTP publics, tenu bien à l'écart de la logique de synchronisation côté client.",
      "Le client garde l'échantillon au plus court aller-retour, compense de RTT/2, et traite cela comme sa borne de précision, si bien qu'aucune requête seule ne devient la source de vérité.",
      "Du WebGL brut pour la page d'accueil cinétique. Pas de bibliothèque d'animation, et le cœur de la mesure du temps reste proprement séparé de la scène.",
    ],
    implementationHighlights: [
      "Un échantillonnage façon NTP qui remesure à la veille et au réveil, lors d'un changement manuel d'horloge, et chaque fois que l'onglet redevient visible après péremption du résultat.",
      "Une scène scrollable qui traverse la seconde, le jour, l'année et l'epoch Unix, au-dessus d'un champ WebGL vivant.",
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
          "Rendre tout l'arc du temps, de la seconde à l'epoch Unix, en une scène continue qui ne saccade jamais.",
        solution:
          "Piloté le scroll en WebGL brut avec un jeu de courbes d'accélération, en gardant le champ vivant sans perdre d'images.",
      },
    ],
    hiringSignals: [
      "Une vraie discipline d'horloge façon NTP : échantillonnage des allers-retours, correction d'offset, et une borne de précision annoncée plutôt qu'une enveloppe polie autour de Date.now().",
      "Je descends volontiers au WebGL brut quand une scène doit être exactement une seule chose.",
      "J'ai porté les deux moitiés, le point d'API et l'image rendue, en les empêchant de se mélanger.",
    ],
    nextIterations: [
      "Un affichage visible de la précision, pour qu'on voie soi-même la borne de synchronisation actuelle.",
      "Des fuseaux configurables et des horloges du monde côte à côte.",
    ],
    tags: ["Next.js", "TypeScript", "WebGL", "NTP"],
    impactHeading: "À quoi sert ce projet",
    impactPoints: [
      "Donne aux gens une horloge à laquelle se fier même quand leur propre appareil ne le mérite pas.",
      "Transforme l'échelle du temps en quelque chose qu'on ressent au scroll.",
      "Met de l'ingénierie de précision et une interface immersive dans le même petit produit.",
    ],
    stats: [
      { value: "1/100s", label: "précision de sync" },
      { value: "4", label: "échelles de temps" },
      { value: "0", label: "API de temps externes" },
      { value: "0", label: "libs d'animation" },
    ],
  },
  zh: {
    tagline: "你设备上的时钟大概是错的。这一个不是。",
    description:
      "一个用 NTP 校准的网页时钟，误差在百分之几秒以内，并把时间的整个尺度做成一幕可以滚动穿过的 WebGL 场景。",
    overview:
      "我不再相信屏幕角落那个时钟了。它能有多准，全看是谁把这台设备调的。于是我照着 NTP 的做法去纠正它：对服务端接口连打几次，留下往返最快的那一次，把时间戳往前挪半个往返，最后落在百分之几秒之内，哪怕显示它的那台机器本身调错了。服务端这一侧通过 UDP 对 Cloudflare、Google 和 pool.ntp.org 校准，若 UDP 出站被封，就退回一个 HTTP 时间信标。然后我把首页做得值得一看：一整幕原生 WebGL 场景，滚动就能从这一秒里掉出去，掉进这一天、这一年，以及 Unix 纪元。",
    roleSummary: "只有我：同步层、API 接口，以及那幕 WebGL 场景。",
    problemStatement:
      "一个时钟有多诚实，取决于它跑在什么设备上，而网上多数时钟只是把本地系统时间照搬一遍，连漂移一起搬。Time 改成对着服务器测，用 NTP 那一套，顺便还拒绝只当一串数字。",
    objectives: [
      "显示真正的当前时间，由服务端校正到百分之几秒。",
      "即使本地时钟已经漂了或被调错，也依然准。",
      "让时间的尺度变成可以感觉到的东西：从一秒一路滚到 Unix 纪元。",
    ],
    architectureDecisions: [
      "Next.js，只有一个 /api/time 接口，通过 UDP 对公共 NTP 服务器校准，并与客户端的同步逻辑保持距离。",
      "客户端只留往返最短的那次采样，按 RTT/2 补偿，并把它当作自己的精度上界，这样没有任何单次请求能当真源。",
      "首页的动态场景用原生 WebGL。不用动画库，计时内核和场景各自分明。",
    ],
    implementationHighlights: [
      "NTP 式采样，会在睡眠与唤醒、手动改动系统时钟，以及结果过期后标签页重新可见时重新测量。",
      "一幕可滚动的场景，在活着的 WebGL 场之上，穿过这一秒、这一天、这一年和 Unix 纪元。",
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
        challenge: "要把时间的整段跨度，从一秒直到 Unix 纪元，渲染成一幕从不卡顿的连续场景。",
        solution: "用原生 WebGL 加一组缓动曲线驱动滚动，让那个场保持活着，又不掉帧。",
      },
    ],
    hiringSignals: [
      "真正的 NTP 式时钟校准：往返采样、偏移修正，以及一个明说出来的精度上界，而不是给 Date.now() 套层客气的壳。",
      "当一幕场景必须只是一件事时，我乐意直接下到原生 WebGL。",
      "两头都由我负责，服务端接口和渲染出来的那一帧，而且不让它们互相渗进去。",
    ],
    nextIterations: [
      "一个能看见的精度读数，让你自己看到当前的同步上界。",
      "可配置的时区，以及并排的世界时钟。",
    ],
    tags: ["Next.js", "TypeScript", "WebGL", "NTP"],
    impactHeading: "这个项目有什么用",
    impactPoints: [
      "给人一个能信的时钟，哪怕他手上那台设备不值得信。",
      "把时间的尺度变成滚动时能感觉到的东西。",
      "让精密工程和沉浸式界面待在同一个小产品里。",
    ],
    stats: [
      { value: "1/100s", label: "同步精度" },
      { value: "4", label: "时间尺度" },
      { value: "0", label: "外部时间 API" },
      { value: "0", label: "动画库" },
    ],
  },
};
