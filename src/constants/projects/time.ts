import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const time: Record<Language, LocalizedContent> = {
  en: {
    tagline:
      "Your device's clock is probably wrong. This one isn't.",
    description:
      "An NTP-synced web clock, accurate to a hundredth of a second, that turns the whole scale of time into one WebGL scene you scroll through.",
    overview:
      "I built Time because I stopped trusting the clock in the corner of my screen — it's only ever as right as whoever set the device. So I corrected it the way NTP does: hit a server endpoint several times, keep the fastest round-trip, compensate for half of it, and land within a hundredth of a second even when the machine showing it is set wrong. Then I made the home page worth looking at. It's one raw-WebGL scene, and you scroll to fall out of this second into the day, the year, and the Unix epoch.",
    roleSummary: "Designed it, built it, shipped it. Just me.",
    problemStatement:
      "A clock is only as honest as the device it runs on, and most of the web just parrots the local system time — drift and all. Time measures against the server instead, NTP-style, and refuses to be a bare digit while it's at it.",
    objectives: [
      "Show the actual current time, server-corrected to within a hundredth of a second.",
      "Stay right even when the local clock has drifted or been set wrong.",
      "Make the scale of time something you can feel — scroll from one second out to the Unix epoch.",
    ],
    architectureDecisions: [
      "Next.js with a single /api/time endpoint disciplined against public NTP servers, kept well away from the client-side sync logic.",
      "The client keeps the lowest round-trip sample, compensates for RTT/2, and treats that as the accuracy bound — no single request gets to be the source of truth.",
      "Raw WebGL for the kinetic home page. No animation library; just the timekeeping core and the scene, cleanly separated.",
    ],
    implementationHighlights: [
      "NTP-style sampling that re-measures on sleep/wake, manual clock changes, and whenever the tab comes back into view.",
      "A scrollable scene that falls through the second, the day, the year, and the Unix epoch over a live WebGL field.",
      "Time and timezone computed entirely client-side with the built-in Intl APIs — no external time API, no timezone data files.",
    ],
    qualityAndSecurity: [
      "Watchdogs re-sync the moment the wall-vs-monotonic baseline jumps, so the accuracy I show stays the accuracy I have.",
      "The server has exactly one job: return NTP-disciplined UTC, with an HTTP fallback for when UDP isn't on the table.",
      "Degrades quietly: with no fresh measurement, the clock keeps ticking from local time instead of falling over.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Trust one network request and you inherit whatever latency that one request happened to draw.",
        solution:
          "Sample several times, keep the fastest round-trip, shift the timestamp by half of it, and publish RTT/2 as the honest accuracy bound.",
      },
      {
        challenge:
          "Rendering the entire sweep of time — a second to the Unix epoch — as one continuous scene that never stutters.",
        solution:
          "Drove the scroll with raw WebGL instead of a heavy library, keeping the field alive without dropping frames.",
      },
    ],
    hiringSignals: [
      "Implemented real NTP-style clock discipline — round-trip sampling and offset correction — not a polite wrapper around Date.now().",
      "Comfortable dropping to raw WebGL for a bespoke, performant interactive scene.",
      "Full Next.js/TypeScript ownership, from the server endpoint to the rendered frame.",
    ],
    nextIterations: [
      "A visible accuracy readout, so you can see the current sync bound for yourself.",
      "Configurable timezones and side-by-side world clocks.",
      "Automated tests around the sampling and offset-correction edge cases.",
    ],
    tags: ["Next.js", "TypeScript", "WebGL", "NTP"],
    impactHeading: "How This Project Creates Impact",
    impactPoints: [
      "Gives people a clock they can trust even when their own device can't be.",
      "Turns an abstract idea — the scale of time — into something you feel by scrolling.",
      "Proves precision engineering and an immersive interface can share one product.",
    ],
    stats: [
      { value: "1/100s", label: "sync accuracy" },
      { value: "4", label: "time scales" },
      { value: "0", label: "external time APIs" },
      { value: "0", label: "animation libs" },
    ],
  },
  de: {
    tagline:
      "Die Uhr deines Geräts geht wahrscheinlich falsch. Diese nicht.",
    description:
      "Eine NTP-synchronisierte Web-Uhr, genau auf die Hundertstelsekunde, die die gesamte Dimension der Zeit in eine WebGL-Szene verwandelt, durch die du scrollst.",
    overview:
      "Ich habe Time gebaut, weil ich der Uhr in der Bildschirmecke nicht mehr getraut habe — sie ist nur so richtig wie derjenige, der das Gerät eingestellt hat. Also korrigiere ich sie so, wie NTP es tut: einen Server-Endpunkt mehrfach abfragen, den schnellsten Round-Trip behalten, um dessen Hälfte kompensieren und auf eine Hundertstelsekunde genau landen, selbst wenn die anzeigende Maschine falsch eingestellt ist. Und dann habe ich die Startseite sehenswert gemacht. Sie ist eine einzige reine WebGL-Szene, und du scrollst, um aus dieser Sekunde in den Tag, das Jahr und die Unix-Epoche zu fallen.",
    roleSummary: "Entworfen, gebaut, ausgeliefert. Nur ich.",
    problemStatement:
      "Eine Uhr ist nur so ehrlich wie das Gerät, auf dem sie läuft, und das meiste im Web plappert einfach die lokale Systemzeit nach — Abweichung inklusive. Time misst stattdessen gegen den Server, im NTP-Stil, und weigert sich dabei, eine nackte Ziffer zu sein.",
    objectives: [
      "Die tatsächliche aktuelle Zeit anzeigen, server-korrigiert auf eine Hundertstelsekunde genau.",
      "Richtig bleiben, selbst wenn die lokale Uhr abgedriftet oder falsch eingestellt ist.",
      "Die Dimension der Zeit spürbar machen — von einer Sekunde bis zur Unix-Epoche scrollen.",
    ],
    architectureDecisions: [
      "Next.js mit einem einzigen /api/time-Endpunkt, der gegen öffentliche NTP-Server diszipliniert wird — sauber getrennt von der client-seitigen Sync-Logik.",
      "Der Client behält das Sample mit dem niedrigsten Round-Trip, kompensiert um RTT/2 und behandelt das als Genauigkeitsgrenze — keine einzelne Anfrage darf die Wahrheit sein.",
      "Reines WebGL für die kinetische Startseite. Keine Animationsbibliothek; nur der Zeitmess-Kern und die Szene, sauber getrennt.",
    ],
    implementationHighlights: [
      "NTP-artiges Sampling, das bei Sleep/Wake, manuellen Uhrenänderungen und immer dann neu misst, wenn der Tab wieder sichtbar wird.",
      "Eine scrollbare Szene, die über ein lebendiges WebGL-Feld durch die Sekunde, den Tag, das Jahr und die Unix-Epoche fällt.",
      "Zeit und Zeitzone werden vollständig client-seitig mit den eingebauten Intl-APIs berechnet — keine externe Zeit-API, keine Zeitzonen-Dateien.",
    ],
    qualityAndSecurity: [
      "Watchdogs synchronisieren neu, sobald die Wall-vs-Monotonic-Basislinie springt — so bleibt die angezeigte Genauigkeit die tatsächliche.",
      "Der Server hat genau eine Aufgabe: NTP-diszipliniertes UTC zurückzugeben, mit HTTP-Fallback, wenn UDP nicht zur Verfügung steht.",
      "Degradiert leise: ohne frische Messung tickt die Uhr weiter aus der lokalen Zeit, statt umzukippen.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Vertrau einer einzigen Netzwerkanfrage und du erbst genau die Latenz, die diese eine Anfrage zufällig erwischt hat.",
        solution:
          "Mehrfach abtasten, den schnellsten Round-Trip behalten, den Zeitstempel um dessen Hälfte verschieben und RTT/2 als ehrliche Genauigkeitsgrenze offenlegen.",
      },
      {
        challenge:
          "Den gesamten Bogen der Zeit — von einer Sekunde bis zur Unix-Epoche — als eine durchgehende Szene rendern, die nie ruckelt.",
        solution:
          "Das Scrollen mit reinem WebGL statt einer schweren Bibliothek angetrieben und das Feld lebendig gehalten, ohne Frames zu verlieren.",
      },
    ],
    hiringSignals: [
      "Echte NTP-artige Uhren-Disziplin implementiert — Round-Trip-Sampling und Offset-Korrektur — kein höflicher Wrapper um Date.now().",
      "Sicher darin, für eine maßgeschneiderte, performante interaktive Szene auf reines WebGL hinunterzugehen.",
      "Vollständige Next.js/TypeScript-Ownership, vom Server-Endpunkt bis zum gerenderten Frame.",
    ],
    nextIterations: [
      "Eine sichtbare Genauigkeitsanzeige, damit du die aktuelle Sync-Grenze selbst siehst.",
      "Konfigurierbare Zeitzonen und nebeneinanderliegende Weltuhren.",
      "Automatisierte Tests rund um die Edge-Cases von Sampling und Offset-Korrektur.",
    ],
    tags: ["Next.js", "TypeScript", "WebGL", "NTP"],
    impactHeading: "Wie dieses Projekt Wirkung erzeugt",
    impactPoints: [
      "Gibt Menschen eine Uhr, der sie vertrauen können, selbst wenn ihr eigenes Gerät es nicht kann.",
      "Verwandelt eine abstrakte Idee — die Dimension der Zeit — durch Scrollen in etwas Spürbares.",
      "Beweist, dass Präzisions-Engineering und eine immersive Oberfläche in einem Produkt leben können.",
    ],
    stats: [
      { value: "1/100s", label: "Sync-Genauigkeit" },
      { value: "4", label: "Zeitskalen" },
      { value: "0", label: "externe Zeit-APIs" },
      { value: "0", label: "Animations-Libs" },
    ],
  },
  fr: {
    tagline:
      "L'horloge de votre appareil est sûrement fausse. Pas celle-ci.",
    description:
      "Une horloge web synchronisée par NTP, précise au centième de seconde, qui transforme toute l'échelle du temps en une scène WebGL que l'on parcourt en défilant.",
    overview:
      "J'ai construit Time parce que j'ai cessé de faire confiance à l'horloge dans le coin de mon écran — elle n'est juste que dans la mesure où celui qui a réglé l'appareil l'était. Alors je la corrige comme le fait NTP : interroger un endpoint serveur plusieurs fois, garder l'aller-retour le plus rapide, compenser de sa moitié, et tomber au centième de seconde près même quand la machine qui l'affiche est mal réglée. Ensuite, j'ai rendu la page d'accueil digne d'un regard. C'est une seule scène en WebGL brut, et vous défilez pour tomber de cette seconde vers le jour, l'année et l'époque Unix.",
    roleSummary: "Conçu, construit, livré. Moi, tout seul.",
    problemStatement:
      "Une horloge n'est honnête que dans la mesure où l'appareil qui la fait tourner l'est, et la plupart du web se contente de répéter l'heure système locale — dérive comprise. Time mesure plutôt face au serveur, à la manière de NTP, et refuse au passage de n'être qu'un simple chiffre.",
    objectives: [
      "Afficher l'heure réelle actuelle, corrigée par le serveur au centième de seconde près.",
      "Rester juste même quand l'horloge locale a dérivé ou a été mal réglée.",
      "Rendre l'échelle du temps palpable — défiler d'une seconde jusqu'à l'époque Unix.",
    ],
    architectureDecisions: [
      "Next.js avec un unique endpoint /api/time discipliné face à des serveurs NTP publics, tenu bien à l'écart de la logique de synchro côté client.",
      "Le client garde l'échantillon au plus faible aller-retour, compense de RTT/2 et le traite comme borne de précision — aucune requête seule n'a le droit d'être la vérité.",
      "WebGL brut pour la page d'accueil cinétique. Pas de bibliothèque d'animation ; juste le cœur de mesure du temps et la scène, proprement séparés.",
    ],
    implementationHighlights: [
      "Un échantillonnage à la manière de NTP qui remesure lors d'une veille/réveil, d'un changement manuel d'horloge et chaque fois que l'onglet redevient visible.",
      "Une scène défilable qui tombe à travers la seconde, le jour, l'année et l'époque Unix par-dessus un champ WebGL vivant.",
      "Heure et fuseau horaire calculés entièrement côté client avec les API Intl intégrées — aucune API de temps externe, aucun fichier de données de fuseaux.",
    ],
    qualityAndSecurity: [
      "Des chiens de garde resynchronisent dès que la base wall-vs-monotonic saute — ainsi la précision que j'affiche reste celle que j'ai.",
      "Le serveur a exactement une mission : renvoyer un UTC discipliné par NTP, avec un repli HTTP quand UDP n'est pas disponible.",
      "Se dégrade en silence : sans mesure fraîche, l'horloge continue de tourner à partir de l'heure locale au lieu de s'effondrer.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Faites confiance à une seule requête réseau et vous héritez de la latence que cette requête a tirée par hasard.",
        solution:
          "Échantillonner plusieurs fois, garder l'aller-retour le plus rapide, décaler l'horodatage de sa moitié et publier RTT/2 comme borne de précision honnête.",
      },
      {
        challenge:
          "Rendre tout l'arc du temps — de la seconde à l'époque Unix — en une seule scène continue qui ne saccade jamais.",
        solution:
          "Piloter le défilement avec du WebGL brut plutôt qu'une lourde bibliothèque, en gardant le champ vivant sans perdre d'images.",
      },
    ],
    hiringSignals: [
      "Mise en œuvre d'une vraie discipline d'horloge à la manière de NTP — échantillonnage aller-retour et correction d'offset — pas un habillage poli de Date.now().",
      "À l'aise pour descendre jusqu'au WebGL brut afin de bâtir une scène interactive sur mesure et performante.",
      "Ownership Next.js/TypeScript complète, de l'endpoint serveur à l'image rendue.",
    ],
    nextIterations: [
      "Un affichage visible de la précision, pour que vous voyiez la borne de synchro actuelle par vous-même.",
      "Des fuseaux horaires configurables et des horloges mondiales côte à côte.",
      "Des tests automatisés autour des cas limites de l'échantillonnage et de la correction d'offset.",
    ],
    tags: ["Next.js", "TypeScript", "WebGL", "NTP"],
    impactHeading: "Comment ce projet crée de l'impact",
    impactPoints: [
      "Donne aux gens une horloge à laquelle se fier même quand leur propre appareil ne le mérite pas.",
      "Transforme une idée abstraite — l'échelle du temps — en quelque chose que l'on ressent en défilant.",
      "Prouve que l'ingénierie de précision et une interface immersive peuvent partager un même produit.",
    ],
    stats: [
      { value: "1/100s", label: "précision de synchro" },
      { value: "4", label: "échelles de temps" },
      { value: "0", label: "API de temps externes" },
      { value: "0", label: "libs d'animation" },
    ],
  },
  zh: {
    tagline:
      "你设备上的时钟多半是错的。这一个不会。",
    description:
      "一款经 NTP 同步、精确到百分之一秒的网页时钟，它把整段时间的尺度化作一幕可滚动穿行的 WebGL 场景。",
    overview:
      "我做 Time，是因为我不再相信屏幕角落里的那个时钟——它只在设置设备的人没出错时才是对的。于是我用 NTP 的方式去校正它：多次请求一个服务器端点，保留最快的那次往返，按其一半进行补偿，即便显示它的机器时间设错，也能落在百分之一秒以内。然后，我把首页做得值得一看。它是一整幕原生 WebGL 场景，你滚动，便从这一秒坠入这一天、这一年，直至 Unix 纪元。",
    roleSummary: "设计、构建、发布。只有我一人。",
    problemStatement:
      "时钟有多诚实，取决于运行它的设备，而网络上大多数时钟只是照搬本地系统时间——连同它的偏差一起。Time 改为对照服务器、以 NTP 的方式去测量，并且顺带拒绝沦为一串干巴巴的数字。",
    objectives: [
      "显示真实的当前时间，由服务器校正到百分之一秒以内。",
      "即便本地时钟已漂移或被设错，仍保持准确。",
      "让时间的尺度变得可感——从一秒一路滚动到 Unix 纪元。",
    ],
    architectureDecisions: [
      "Next.js 配以单一的 /api/time 端点，对照公共 NTP 服务器进行校准，与客户端同步逻辑彻底分离。",
      "客户端保留往返最低的样本，按 RTT/2 补偿，并以此作为精度边界——任何单次请求都没资格充当真相。",
      "首页动感场景使用原生 WebGL。不依赖动画库；只有计时核心与场景，干净地分开。",
    ],
    implementationHighlights: [
      "NTP 式采样，会在睡眠/唤醒、手动更改时钟，以及每当标签页重新可见时重新测量。",
      "一幕可滚动的场景，在鲜活的 WebGL 场之上穿过这一秒、这一天、这一年与 Unix 纪元。",
      "时间与时区完全在客户端用内置的 Intl API 计算——无外部时间 API，无时区数据文件。",
    ],
    qualityAndSecurity: [
      "一旦墙钟与单调时钟的基线发生跳变，看门狗便立即重新同步——这样我显示的精度就是我实际拥有的精度。",
      "服务器只有一项职责：返回经 NTP 校准的 UTC，并在 UDP 不可用时回退到 HTTP。",
      "悄然降级：没有新鲜测量时，时钟仍会以本地时间继续走动，而不会崩掉。",
    ],
    challengesAndSolutions: [
      {
        challenge: "信任单次网络请求，就会继承那一次请求恰好抽到的延迟。",
        solution:
          "多次采样，保留最快的往返，将时间戳按其一半进行偏移，再把 RTT/2 作为诚实的精度边界公开出来。",
      },
      {
        challenge: "把时间的整段跨度——从一秒到 Unix 纪元——渲染成一幕连续且从不卡顿的场景。",
        solution: "用原生 WebGL 而非笨重的库来驱动滚动，让场景保持鲜活而不掉帧。",
      },
    ],
    hiringSignals: [
      "实现了真正 NTP 式的时钟校准——往返采样与偏移校正——而非对 Date.now() 客客气气的简单封装。",
      "能放下身段直接用原生 WebGL，打造定制、高性能的交互场景。",
      "端到端、完整的 Next.js/TypeScript 主导能力，从服务器端点到渲染的每一帧。",
    ],
    nextIterations: [
      "可见的精度读数，让你亲眼看到当前的同步边界。",
      "可配置的时区与并排的世界时钟。",
      "围绕采样与偏移校正边界情况的自动化测试。",
    ],
    tags: ["Next.js", "TypeScript", "WebGL", "NTP"],
    impactHeading: "本项目如何创造价值",
    impactPoints: [
      "即便用户自己的设备并不可信，也能给他们一款可信赖的时钟。",
      "通过滚动，把抽象的概念——时间的尺度——变成可以亲身感受的东西。",
      "证明精密的工程与沉浸式的界面能够共存于同一款产品之中。",
    ],
    stats: [
      { value: "1/100s", label: "同步精度" },
      { value: "4", label: "时间尺度" },
      { value: "0", label: "外部时间 API" },
      { value: "0", label: "动画库" },
    ],
  },
};
