import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const entropy: Record<Language, LocalizedContent> = {
  en: {
    tagline: "Real randomness, and an honest guess at how long your password would last.",
    description:
      "A password generator and analyzer that runs entirely in the browser: randomness from Web Crypto, a strength estimator I wrote myself, and crack times for five attacker models. Nothing is sent anywhere.",
    overview:
      "I did not want to paste a password into a website to find out whether it was any good, and the generators that do not ask you to are usually the ones reaching for Math.random(). So I wrote my own in Next.js and TypeScript. Generation pulls its bytes from Web Crypto. The analyzer is mine too: it matches dictionary words (reversed and l33t spellings included), keyboard walks, repeats, sequences and dates, brute-forces whatever is left at the password's real cardinality, and runs a dynamic-programming search for the cheapest attack path. What comes out is a guess count, which becomes bits, which becomes crack times. There are no API routes, so nothing you type has anywhere to go.",
    roleSummary: "Just me, and the analyzer took longer than the rest of the app together.",
    problemStatement:
      "Half the password checkers online want you to type the password into their server, and plenty of the generators use Math.random(), which is not random enough to guard anything. I wanted one page that did both jobs and never sent a character out of the tab.",
    objectives: [
      "Generate with Web Crypto, so the randomness is genuinely unpredictable.",
      "Score a password by estimating how many guesses an attacker needs, then report that as a time.",
      "Show that time for a range of attackers, from a rate-limited login form to a GPU farm.",
      "Keep all of it in the browser: no API routes, no storage.",
    ],
    architectureDecisions: [
      "Next.js and TypeScript, with the generator, the analyzer and the crack-time formatting as separate pure modules the UI only calls into.",
      "Web Crypto for every random byte. Math.random() does not appear in the codebase.",
      "The analyzer's dictionaries are baked in at build time by a script, so looking up a word costs no network request while you type.",
    ],
    implementationHighlights: [
      "A guess estimator with matchers for dictionary words, l33t and reversed spellings, keyboard walks, repeats, sequences and dates, and a brute-force fallback at the password's true cardinality.",
      "A dynamic-programming search across those matches for the cheapest attack path, which is the number the entire score hangs on.",
      "Five attacker models, from a throttled login form at a hundred guesses an hour to a GPU farm at a trillion a second, with the tier labels calibrated against the offline fast-hash case so the word never argues with the time beside it.",
      "Feedback that names the pattern it matched and says what to change.",
    ],
    qualityAndSecurity: [
      "There is no backend, no API route and no persistence, so a password has nowhere to leak to.",
      "A test suite over the analyzer: one case per matcher, the cheapest-path search, monotonicity of guesses in length and character set, and the invariant that the bit count is the base-2 log of the guess count.",
      "Validation that refuses an impossible rule combination before it can produce a broken password.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Telling someone their password is weak is easy. Telling them why, without a lecture about entropy, is the hard part.",
        solution:
          "The analyzer names the pattern it matched (a dictionary word, a keyboard walk, a date) and suggests one concrete change, and the crack time next to it is in hours or years rather than bits.",
      },
      {
        challenge:
          "A meter that says \"strong\" beside a crack time of four minutes has destroyed its own credibility.",
        solution:
          "Every tier label is calibrated against one attacker model, the offline fast hash at ten billion guesses a second, so the word and the number always come from the same assumption.",
      },
    ],
    hiringSignals: [
      "I built a zxcvbn-grade guess estimator from scratch, dynamic-programming search included, instead of importing one.",
      "Cryptography handled correctly in the small places: every random byte comes from Web Crypto.",
      "I can take a subject that is normally explained in bits and make it legible on a page.",
    ],
    nextIterations: [
      "A passphrase mode, scored by the same estimator.",
      "A side-by-side comparison, so you can see what one more word actually buys you.",
    ],
    tags: ["Next.js", "TypeScript", "Web Crypto", "Security"],
    impactHeading: "What This Project Is Good For",
    impactPoints: [
      "Makes a password that is genuinely hard to guess, in one click, with no server involved.",
      "Explains why a password is weak in words you can act on.",
      "Keeps the password in the tab, because there is nowhere else for it to go.",
    ],
    stats: [
      { value: "100%", label: "client-side" },
      { value: "0", label: "secrets sent" },
      { value: "0", label: "Math.random()" },
      { value: "5", label: "attacker models" },
    ],
  },
  de: {
    tagline: "Echte Zufälligkeit und eine ehrliche Schätzung, wie lange dein Passwort hält.",
    description:
      "Ein Passwortgenerator und -analysator, der komplett im Browser läuft: Zufall aus Web Crypto, eine selbst geschriebene Stärkeschätzung und Knackzeiten für fünf Angreifermodelle. Nichts wird irgendwohin gesendet.",
    overview:
      "Ich wollte kein Passwort in eine Website tippen, nur um zu erfahren, ob es gut ist, und die Generatoren, die das nicht verlangen, greifen meist zu Math.random(). Also schrieb ich meinen eigenen in Next.js und TypeScript. Die Erzeugung holt ihre Bytes aus Web Crypto. Die Analyse ist ebenfalls meine: Sie erkennt Wörterbuchwörter (rückwärts und in Leetschreibweise inklusive), Tastaturwege, Wiederholungen, Sequenzen und Datumsangaben, brute-forced den Rest mit der echten Kardinalität des Passworts und sucht per dynamischer Programmierung den billigsten Angriffspfad. Heraus kommt eine Anzahl an Versuchen, daraus Bits, daraus Knackzeiten. Es gibt keine API-Routen, also hat das Getippte gar keinen Weg nach draussen.",
    roleSummary: "Nur ich, und die Analyse dauerte länger als der ganze Rest der App.",
    problemStatement:
      "Die Hälfte der Passwortprüfer im Netz will, dass man das Passwort in ihren Server tippt, und viele Generatoren nutzen Math.random(), was zu wenig Zufall ist, um irgendetwas zu bewachen. Ich wollte eine Seite, die beides erledigt und kein Zeichen aus dem Tab lässt.",
    objectives: [
      "Mit Web Crypto erzeugen, damit der Zufall wirklich unvorhersehbar ist.",
      "Ein Passwort danach bewerten, wie viele Versuche ein Angreifer braucht, und das als Zeit ausgeben.",
      "Diese Zeit für verschiedene Angreifer zeigen, vom ratenbegrenzten Login-Formular bis zur GPU-Farm.",
      "Alles im Browser halten: keine API-Routen, kein Speicher.",
    ],
    architectureDecisions: [
      "Next.js und TypeScript, mit Generator, Analyse und Knackzeit-Formatierung als getrennte reine Module, die das UI nur aufruft.",
      "Web Crypto für jedes Zufallsbyte. Math.random() kommt im Code nicht vor.",
      "Die Wörterbücher der Analyse werden zur Build-Zeit von einem Skript eingebacken, damit eine Wortsuche beim Tippen keinen Netzwerkaufruf kostet.",
    ],
    implementationHighlights: [
      "Eine Versuchsschätzung mit Matchern für Wörterbuchwörter, Leet- und Rückwärtsschreibweisen, Tastaturwege, Wiederholungen, Sequenzen und Datumsangaben, plus Brute-Force-Fallback mit der echten Kardinalität des Passworts.",
      "Eine Suche per dynamischer Programmierung über diese Treffer nach dem billigsten Angriffspfad, an dieser Zahl hängt die ganze Bewertung.",
      "Fünf Angreifermodelle, vom gebremsten Login-Formular mit hundert Versuchen pro Stunde bis zur GPU-Farm mit einer Billion pro Sekunde, wobei die Stufenlabels am Offline-Fast-Hash-Fall kalibriert sind, damit das Wort nie der Zeit daneben widerspricht.",
      "Rückmeldungen, die das erkannte Muster benennen und sagen, was zu ändern ist.",
    ],
    qualityAndSecurity: [
      "Es gibt kein Backend, keine API-Route und keine Persistenz, ein Passwort hat also gar keinen Ort, an den es leaken könnte.",
      "Eine Testsuite über die Analyse: ein Fall pro Matcher, die Suche nach dem billigsten Pfad, die Monotonie der Versuche in Länge und Zeichensatz und die Invariante, dass die Bitzahl der Zweierlogarithmus der Versuche ist.",
      "Validierung, die unmögliche Regelkombinationen ablehnt, bevor daraus ein kaputtes Passwort wird.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Jemandem zu sagen, sein Passwort sei schwach, ist einfach. Zu sagen, warum, ohne einen Vortrag über Entropie, ist der schwierige Teil.",
        solution:
          "Die Analyse benennt das erkannte Muster (ein Wörterbuchwort, ein Tastaturweg, ein Datum) und schlägt eine konkrete Änderung vor, und die Knackzeit daneben steht in Stunden oder Jahren statt in Bits.",
      },
      {
        challenge:
          "Eine Anzeige, die „stark“ neben eine Knackzeit von vier Minuten schreibt, hat ihre eigene Glaubwürdigkeit zerstört.",
        solution:
          "Jedes Stufenlabel ist an einem Angreifermodell kalibriert, dem Offline-Fast-Hash mit zehn Milliarden Versuchen pro Sekunde, damit Wort und Zahl immer aus derselben Annahme kommen.",
      },
    ],
    hiringSignals: [
      "Ich habe eine Versuchsschätzung auf zxcvbn-Niveau von Grund auf gebaut, dynamische Programmierung inklusive, statt eine zu importieren.",
      "Kryptografie an den kleinen Stellen richtig gemacht: jedes Zufallsbyte kommt aus Web Crypto.",
      "Ich kann ein Thema, das normalerweise in Bits erklärt wird, auf einer Seite lesbar machen.",
    ],
    nextIterations: [
      "Ein Passphrasen-Modus, von derselben Schätzung bewertet.",
      "Ein Vergleich nebeneinander, damit man sieht, was ein Wort mehr tatsächlich bringt.",
    ],
    tags: ["Next.js", "TypeScript", "Web Crypto", "Security"],
    impactHeading: "Wofür dieses Projekt gut ist",
    impactPoints: [
      "Erzeugt mit einem Klick ein Passwort, das wirklich schwer zu erraten ist, ohne Server.",
      "Erklärt in Worten, mit denen man etwas anfangen kann, warum ein Passwort schwach ist.",
      "Behält das Passwort im Tab, weil es nirgendwo anders hin kann.",
    ],
    stats: [
      { value: "100%", label: "im Browser" },
      { value: "0", label: "gesendete Secrets" },
      { value: "0", label: "Math.random()" },
      { value: "5", label: "Angreifermodelle" },
    ],
  },
  fr: {
    tagline: "Du vrai aléa, et une estimation honnête du temps que tiendrait votre mot de passe.",
    description:
      "Un générateur et analyseur de mots de passe qui tourne entièrement dans le navigateur : aléa issu de Web Crypto, un estimateur de robustesse que j'ai écrit moi-même, et des temps de cassage pour cinq modèles d'attaquant. Rien n'est envoyé nulle part.",
    overview:
      "Je ne voulais pas coller un mot de passe dans un site web pour savoir s'il valait quelque chose, et les générateurs qui ne le demandent pas sont en général ceux qui utilisent Math.random(). J'ai donc écrit le mien en Next.js et TypeScript. La génération tire ses octets de Web Crypto. L'analyseur est de moi aussi : il repère les mots du dictionnaire (à l'envers et en leet compris), les chemins de clavier, les répétitions, les suites et les dates, force le reste à la vraie cardinalité du mot de passe, et cherche le chemin d'attaque le moins coûteux par programmation dynamique. Il en sort un nombre d'essais, qui devient des bits, qui deviennent des temps de cassage. Il n'y a aucune route d'API, donc ce que vous tapez n'a nulle part où aller.",
    roleSummary: "Moi seul, et l'analyseur m'a pris plus de temps que tout le reste de l'app.",
    problemStatement:
      "La moitié des vérificateurs de mots de passe en ligne veut que vous tapiez le mot de passe dans leur serveur, et beaucoup de générateurs utilisent Math.random(), ce qui est trop peu aléatoire pour garder quoi que ce soit. Je voulais une page qui fasse les deux et ne laisse pas sortir un seul caractère de l'onglet.",
    objectives: [
      "Générer avec Web Crypto, pour que l'aléa soit vraiment imprévisible.",
      "Noter un mot de passe selon le nombre d'essais qu'il faudrait à un attaquant, puis rendre ça en temps.",
      "Montrer ce temps pour tout un éventail d'attaquants, du formulaire de connexion limité à la ferme de GPU.",
      "Tout garder dans le navigateur : pas de route d'API, pas de stockage.",
    ],
    architectureDecisions: [
      "Next.js et TypeScript, avec le générateur, l'analyseur et le formatage des temps de cassage en modules purs séparés que l'interface se contente d'appeler.",
      "Web Crypto pour chaque octet aléatoire. Math.random() n'apparaît nulle part dans le code.",
      "Les dictionnaires de l'analyseur sont intégrés au build par un script, si bien que chercher un mot ne coûte aucune requête pendant que vous tapez.",
    ],
    implementationHighlights: [
      "Un estimateur d'essais avec des détecteurs pour les mots du dictionnaire, les graphies leet et inversées, les chemins de clavier, les répétitions, les suites et les dates, et un repli en force brute à la vraie cardinalité du mot de passe.",
      "Une recherche par programmation dynamique sur ces détections pour trouver le chemin d'attaque le moins coûteux, le chiffre dont dépend toute la note.",
      "Cinq modèles d'attaquant, du formulaire bridé à cent essais par heure jusqu'à la ferme de GPU à mille milliards par seconde, avec des libellés de palier calibrés sur le cas du hachage rapide hors ligne, pour que le mot ne contredise jamais le temps affiché à côté.",
      "Un retour qui nomme le motif détecté et dit quoi changer.",
    ],
    qualityAndSecurity: [
      "Il n'y a ni backend, ni route d'API, ni persistance : un mot de passe n'a nulle part où fuiter.",
      "Une suite de tests sur l'analyseur : un cas par détecteur, la recherche du chemin le moins coûteux, la monotonie des essais selon la longueur et le jeu de caractères, et l'invariant voulant que le nombre de bits soit le logarithme binaire du nombre d'essais.",
      "Une validation qui refuse une combinaison de règles impossible avant qu'elle produise un mot de passe cassé.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Dire à quelqu'un que son mot de passe est faible est facile. Lui dire pourquoi, sans cours magistral sur l'entropie, est la partie difficile.",
        solution:
          "L'analyseur nomme le motif détecté (un mot du dictionnaire, un chemin de clavier, une date) et propose un changement concret, et le temps de cassage à côté est en heures ou en années plutôt qu'en bits.",
      },
      {
        challenge:
          "Une jauge qui affiche « fort » à côté d'un temps de cassage de quatre minutes a détruit sa propre crédibilité.",
        solution:
          "Chaque libellé de palier est calibré sur un seul modèle d'attaquant, le hachage rapide hors ligne à dix milliards d'essais par seconde, pour que le mot et le chiffre viennent toujours de la même hypothèse.",
      },
    ],
    hiringSignals: [
      "J'ai construit de zéro un estimateur d'essais du calibre de zxcvbn, recherche par programmation dynamique incluse, au lieu d'en importer un.",
      "De la cryptographie faite correctement dans les petits détails : chaque octet aléatoire vient de Web Crypto.",
      "Je sais prendre un sujet qu'on explique d'habitude en bits et le rendre lisible sur une page.",
    ],
    nextIterations: [
      "Un mode phrase de passe, noté par le même estimateur.",
      "Une comparaison côte à côte, pour voir ce qu'un mot de plus rapporte vraiment.",
    ],
    tags: ["Next.js", "TypeScript", "Web Crypto", "Security"],
    impactHeading: "À quoi sert ce projet",
    impactPoints: [
      "Fabrique en un clic un mot de passe vraiment difficile à deviner, sans serveur.",
      "Explique pourquoi un mot de passe est faible, en mots sur lesquels on peut agir.",
      "Garde le mot de passe dans l'onglet, parce qu'il n'a nulle part ailleurs où aller.",
    ],
    stats: [
      { value: "100%", label: "côté client" },
      { value: "0", label: "secrets envoyés" },
      { value: "0", label: "Math.random()" },
      { value: "5", label: "modèles d'attaquant" },
    ],
  },
  zh: {
    tagline: "真正的随机，加上一个诚实的估计：你的密码能撑多久。",
    description:
      "一个完全在浏览器里跑的密码生成与分析工具：随机数来自 Web Crypto，强度估算由我自己写，破解时间按五种攻击者模型给出。什么都不会被发出去。",
    overview:
      "我不想为了确认一个密码好不好，就把它粘进某个网站；而那些不要求你这么做的生成器，往下一翻往往在用 Math.random()。于是我用 Next.js 和 TypeScript 写了自己的一个。生成部分的每个字节都取自 Web Crypto。分析部分也是我写的：它会匹配词表里的单词（含倒写和 leet 拼法）、键盘走位、重复、递增序列和日期，剩下的按密码真实的字符空间做暴力估算，再用动态规划搜出最省力的那条攻击路径。算出来的是尝试次数，再换成比特，再换成破解时间。项目没有任何 API 路由，所以你输入的东西根本无处可去。",
    roleSummary: "只有我，而分析引擎花的时间比应用其余部分加起来还多。",
    problemStatement:
      "网上一半的密码检测器都要你把密码输进它们的服务器，而不少生成器用的是 Math.random()，那点随机性守不住任何东西。我想要一个页面把两件事都办了，并且一个字符都不许离开这个标签页。",
    objectives: [
      "用 Web Crypto 生成，让随机性真的不可预测。",
      "按攻击者需要多少次尝试来评分，再把它换算成时间。",
      "把这个时间按不同攻击者分别列出，从有速率限制的登录表单到 GPU 农场。",
      "全部留在浏览器里：没有 API 路由，也不存储。",
    ],
    architectureDecisions: [
      "Next.js 加 TypeScript，生成器、分析器和破解时间的格式化各自是独立的纯模块，界面只负责调用。",
      "每个随机字节都来自 Web Crypto。代码里根本没有 Math.random()。",
      "分析用的词表在构建时由脚本打包进去，所以你打字时查词不花一次网络请求。",
    ],
    implementationHighlights: [
      "一套尝试次数估算：匹配词表单词、leet 与倒写拼法、键盘走位、重复、递增序列和日期，剩余部分按密码真实的字符空间做暴力兜底。",
      "在这些匹配之上用动态规划搜索最省力的攻击路径，整个评分都挂在这个数字上。",
      "五种攻击者模型，从每小时一百次的受限登录表单，到每秒一万亿次的 GPU 农场；等级标签统一以离线快速哈希那一档校准，所以那个词永远不会跟旁边的时间自相矛盾。",
      "反馈会指名它匹配到的模式，并说清该改什么。",
    ],
    qualityAndSecurity: [
      "没有后端、没有 API 路由、也不做持久化，密码根本没有可以泄漏出去的地方。",
      "一整套针对分析器的测试：每个匹配器一个用例，最省力路径的搜索，尝试次数随长度和字符集的单调性，以及比特数等于尝试次数的二进制对数这条不变量。",
      "校验会在不可能的规则组合生成出一个坏密码之前就把它挡下来。",
    ],
    challengesAndSolutions: [
      {
        challenge: "告诉一个人他的密码很弱很容易，难的是说清为什么，又不给他上一堂熵的课。",
        solution: "分析器会点名它匹配到的模式（一个词表单词、一段键盘走位、一个日期），并给出一处具体的改法；旁边的破解时间用的是小时或年，而不是比特。",
      },
      {
        challenge: "一个在四分钟的破解时间旁边写着「很强」的强度条，已经自己毁掉了可信度。",
        solution: "每一档标签都以同一个攻击者模型校准，也就是每秒一百亿次的离线快速哈希，让这个词和这个数字始终出自同一套假设。",
      },
    ],
    hiringSignals: [
      "我从零写出了一个 zxcvbn 级别的尝试次数估算器，动态规划搜索也在里面，而不是直接引一个库。",
      "在细处把密码学做对：每一个随机字节都来自 Web Crypto。",
      "我能把一个通常靠比特来解释的主题，讲成一页能读懂的东西。",
    ],
    nextIterations: [
      "一个口令短语模式，用同一套估算来打分。",
      "并排对比，让人看清多加一个词到底换来了什么。",
    ],
    tags: ["Next.js", "TypeScript", "Web Crypto", "Security"],
    impactHeading: "这个项目有什么用",
    impactPoints: [
      "一键生成真正难猜的密码，全程不经过服务器。",
      "用你能照着改的话，解释一个密码为什么弱。",
      "把密码留在标签页里，因为它别处也去不了。",
    ],
    stats: [
      { value: "100%", label: "在浏览器内" },
      { value: "0", label: "外发的密码" },
      { value: "0", label: "Math.random()" },
      { value: "5", label: "攻击者模型" },
    ],
  },
};
