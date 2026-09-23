import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

const RAND_INT = `function randInt(max: number): number {
  // unbiased rejection sampling over crypto bytes
  if (max <= 0) return 0;
  const limit = Math.floor(0xffffffff / max) * max;
  const buf = new Uint32Array(1);
  let x: number;
  do {
    crypto.getRandomValues(buf);
    x = buf[0];
  } while (x >= limit);
  return x % max;
}`;

export const entropy: Record<Language, LocalizedContent> = {
  en: {
    tagline: "Real randomness, and an honest guess at how long your password would last.",
    description:
      "A password generator and analyzer that runs entirely in the browser: randomness from Web Crypto, a strength estimator I wrote myself, and crack times for five attacker models. Nothing is sent anywhere.",
    overview:
      "I did not want to paste a password into a website to find out whether it was any good, and the generators that do not ask you to are usually the ones reaching for Math.random(). So I wrote my own in Next.js and TypeScript. Generation pulls its bytes from Web Crypto. The analyzer is mine too: it matches dictionary words (reversed and l33t spellings included), keyboard walks, repeats, sequences and dates, brute-forces whatever is left at the password's real cardinality, and runs a dynamic-programming search for the cheapest attack path. What comes out is a guess count, which becomes bits, which becomes crack times. There are no API routes, so nothing you type has anywhere to go.",
    roleSummary: "Just me, and the analyzer took longer than the rest of the app together.",
    sections: [
      {
        heading: "Random bytes, without the modulo bias",
        body: [
          "Taking a random 32-bit number modulo the size of the character pool looks fine and is slightly wrong: unless the pool divides 2³² evenly, the first few characters come up a little more often than the rest. So every pick goes through one small function that throws away the values from the uneven tail and draws again.",
          "The generator first takes one character from each set you switched on, fills the rest from the combined pool and then shuffles the whole thing with Fisher-Yates, using the same function for every swap. Passphrases draw from the EFF long wordlist, about 12.9 bits a word.",
          "Math.random() appears exactly once in the app: it seeds the generative art behind the password, which is decoration and guards nothing.",
        ],
        code: {
          language: "ts",
          text: RAND_INT,
          caption:
            "From src/lib/entropy-core.ts. Every character and every shuffle swap goes through this: values at or above the largest multiple of max are rejected, so each outcome is exactly as likely as the others.",
        },
      },
      {
        heading: "Counting guesses instead of character classes",
        body: [
          "The first version of the analyzer scored a password by its length and which character classes it used, so a dictionary word with a symbol and a digit on it scored like random text. I replaced it with an estimator that thinks like someone cracking it: find every word, keyboard walk, repeat, sequence and date inside the password, price each one in guesses, and let brute force cover whatever is left.",
          "The price of the whole password is then the cheapest way to cover it with those pieces, found by dynamic programming over every position. The attack path on the page is that result, piece by piece, so you can see which part of the password is doing the work and which part is a dictionary word in disguise.",
        ],
        figure: 1,
      },
      {
        heading: "The word and the time come from the same attacker",
        body: [
          "A meter that says strong beside a crack time of four minutes has lost the argument. Every tier label is therefore set against one attacker, an offline fast hash on a GPU at ten billion guesses a second: under 40 bits is weak, 96 and above is maximum, and the time shown under the Generate tab uses that same rate.",
          "The analyzer shows five attackers side by side, from a login form that allows 100 guesses an hour to a GPU farm at a trillion a second, because the honest answer to how long a password lasts depends on who has the hash. Advice follows the same scale: from 56 bits up the page stops warning, and at most suggests a little more length.",
        ],
      },
      {
        heading: "Nowhere for a password to go",
        body: [
          "The app has no API routes and stores nothing. A script downloads the dictionaries the analyzer needs and writes them into generated files that ship with the app, so looking up a word while you type costs no request. They sit in their own chunk that only loads when the Analyze tab opens, which keeps the generator light.",
          "The analyzer has a suite of 33 tests: one per pattern it recognises, the cheapest-path search, guesses rising with length and with a larger character set, and bits staying the base-2 log of the guess count.",
        ],
      },
    ],
    captions: [
      "The Generate tab: a 16-character password from all four character sets at 104 bits, rated maximum, with the generative art for its seed above it.",
      "The Analyze tab on a four-word passphrase: 84 bits, the five attacker scenarios, and the attack path that splits it into dictionary words and random pieces.",
    ],
    tags: ["Next.js", "TypeScript", "Web Crypto", "Security"],
    stats: [
      { value: "100%", label: "client-side" },
      { value: "0", label: "secrets sent" },
      { value: "0", label: "Math.random() in secrets" },
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
    sections: [
      {
        heading: "Zufallsbytes ohne Modulo-Verzerrung",
        body: [
          "Eine zufällige 32-Bit-Zahl modulo der Grösse des Zeichenvorrats zu nehmen, sieht richtig aus und ist leicht falsch: Solange der Vorrat 2³² nicht glatt teilt, kommen die ersten paar Zeichen etwas häufiger vor als der Rest. Deshalb läuft jede Auswahl durch eine kleine Funktion, die die Werte aus dem ungeraden Rest verwirft und neu zieht.",
          "Der Generator nimmt zuerst ein Zeichen aus jedem eingeschalteten Satz, füllt den Rest aus dem gemeinsamen Vorrat und mischt dann alles mit Fisher-Yates, wobei jeder Tausch dieselbe Funktion nutzt. Passphrasen kommen aus der langen EFF-Wortliste, etwa 12,9 Bit pro Wort.",
          "Math.random() kommt in der App genau einmal vor: Es setzt den Seed für die generative Grafik hinter dem Passwort, und die ist Dekoration und bewacht nichts.",
        ],
        code: {
          language: "ts",
          text: RAND_INT,
          caption:
            "Aus src/lib/entropy-core.ts. Jedes Zeichen und jeder Tausch beim Mischen geht hier durch: Werte ab dem grössten Vielfachen von max werden verworfen, damit jedes Ergebnis genau gleich wahrscheinlich ist.",
        },
      },
      {
        heading: "Versuche zählen statt Zeichenklassen",
        body: [
          "Die erste Version der Analyse bewertete ein Passwort nach Länge und verwendeten Zeichenklassen, und so zählte ein Wörterbuchwort mit einem Sonderzeichen und einer Ziffer dran wie zufälliger Text. Ich ersetzte sie durch eine Schätzung, die denkt wie jemand, der es knacken will: jedes Wort, jeden Tastaturweg, jede Wiederholung, Sequenz und jedes Datum im Passwort finden, jedes Stück in Versuchen bepreisen und den Rest per Brute Force abdecken.",
          "Der Preis des ganzen Passworts ist dann der billigste Weg, es mit diesen Stücken abzudecken, gefunden per dynamischer Programmierung über jede Position. Der Angriffspfad auf der Seite ist genau dieses Ergebnis, Stück für Stück, so sieht man, welcher Teil des Passworts die Arbeit macht und welcher ein verkleidetes Wörterbuchwort ist.",
        ],
        figure: 1,
      },
      {
        heading: "Wort und Zeit kommen vom selben Angreifer",
        body: [
          "Eine Anzeige, die „stark“ neben eine Knackzeit von vier Minuten schreibt, hat schon verloren. Deshalb ist jedes Stufenlabel an einem einzigen Angreifer ausgerichtet, einem Offline-Fast-Hash auf einer GPU mit zehn Milliarden Versuchen pro Sekunde: Unter 40 Bit ist schwach, ab 96 maximal, und die Zeit im Generieren-Tab rechnet mit derselben Rate.",
          "Die Analyse zeigt fünf Angreifer nebeneinander, vom Login-Formular mit 100 Versuchen pro Stunde bis zur GPU-Farm mit einer Billion pro Sekunde, weil die ehrliche Antwort auf die Frage, wie lange ein Passwort hält, davon abhängt, wer den Hash hat. Die Ratschläge folgen derselben Skala: Ab 56 Bit hört die Seite auf zu warnen und schlägt höchstens noch etwas mehr Länge vor.",
        ],
      },
      {
        heading: "Kein Ort, an den ein Passwort gehen könnte",
        body: [
          "Die App hat keine API-Routen und speichert nichts. Die Wörterbücher für die Analyse lädt ein Skript herunter und schreibt sie in generierte Dateien, die mit der App ausgeliefert werden, darum kostet eine Wortsuche beim Tippen keinen Request. Sie liegen in einem eigenen Chunk, der erst lädt, wenn der Analysieren-Tab aufgeht, so bleibt der Generator leicht.",
          "Die Analyse hat eine Suite von 33 Tests: einen pro erkanntem Muster, die Suche nach dem billigsten Pfad, mehr Versuche bei mehr Länge und grösserem Zeichensatz und Bits, die immer der Zweierlogarithmus der Versuche bleiben.",
        ],
      },
    ],
    captions: [
      "Der Generieren-Tab: ein Passwort mit 16 Zeichen aus allen vier Zeichensätzen, 104 Bit, als maximal bewertet, darüber die generative Grafik zu seinem Seed.",
      "Der Analysieren-Tab mit einer Passphrase aus vier Wörtern: 84 Bit, die fünf Angreiferszenarien und der Angriffspfad, der sie in Wörterbuchwörter und zufällige Stücke zerlegt.",
    ],
    tags: ["Next.js", "TypeScript", "Web Crypto", "Security"],
    stats: [
      { value: "100%", label: "im Browser" },
      { value: "0", label: "gesendete Secrets" },
      { value: "0", label: "Math.random() in Secrets" },
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
    sections: [
      {
        heading: "Des octets aléatoires, sans biais de modulo",
        body: [
          "Prendre un nombre aléatoire de 32 bits modulo la taille du jeu de caractères a l'air correct et ne l'est pas tout à fait : si le jeu ne divise pas 2³² exactement, les premiers caractères sortent un peu plus souvent que les autres. Chaque tirage passe donc par une petite fonction qui jette les valeurs de la queue inégale et tire à nouveau.",
          "Le générateur prend d'abord un caractère dans chaque jeu activé, complète avec le jeu combiné, puis mélange le tout avec Fisher-Yates, la même fonction servant à chaque échange. Les phrases de passe puisent dans la grande liste de l'EFF, environ 12,9 bits par mot.",
          "Math.random() n'apparaît qu'une fois dans l'app : il sert de graine à l'art génératif derrière le mot de passe, qui est décoratif et ne protège rien.",
        ],
        code: {
          language: "ts",
          text: RAND_INT,
          caption:
            "Extrait de src/lib/entropy-core.ts. Chaque caractère et chaque échange du mélange passent par là : les valeurs à partir du plus grand multiple de max sont rejetées, pour que chaque résultat ait exactement la même probabilité.",
        },
      },
      {
        heading: "Compter les essais plutôt que les classes de caractères",
        body: [
          "La première version de l'analyseur notait un mot de passe selon sa longueur et les classes de caractères utilisées, si bien qu'un mot du dictionnaire affublé d'un symbole et d'un chiffre passait pour du hasard. Je l'ai remplacée par un estimateur qui raisonne comme quelqu'un qui veut le casser : trouver chaque mot, chemin de clavier, répétition, suite et date dans le mot de passe, chiffrer chaque morceau en essais, et laisser la force brute couvrir le reste.",
          "Le prix du mot de passe entier est alors la façon la moins chère de le couvrir avec ces morceaux, trouvée par programmation dynamique sur chaque position. Le chemin d'attaque affiché est ce résultat, morceau par morceau : on voit quelle partie du mot de passe fait le travail et laquelle n'est qu'un mot du dictionnaire déguisé.",
        ],
        figure: 1,
      },
      {
        heading: "Le mot et le temps viennent du même attaquant",
        body: [
          "Une jauge qui affiche « fort » à côté d'un temps de cassage de quatre minutes a déjà perdu. Chaque libellé de palier est donc réglé sur un seul attaquant, un hachage rapide hors ligne sur GPU à dix milliards d'essais par seconde : sous 40 bits c'est faible, à partir de 96 c'est maximal, et le temps affiché dans l'onglet Générer utilise ce même débit.",
          "L'analyseur montre cinq attaquants côte à côte, du formulaire de connexion qui accepte 100 essais par heure à la ferme de GPU à mille milliards par seconde, parce que la réponse honnête à la question de la durée dépend de qui détient le hachage. Les conseils suivent la même échelle : à partir de 56 bits, la page cesse d'avertir et suggère tout au plus un peu plus de longueur.",
        ],
      },
      {
        heading: "Nulle part où un mot de passe pourrait aller",
        body: [
          "L'app n'a aucune route d'API et ne stocke rien. Un script télécharge les dictionnaires de l'analyseur et les écrit dans des fichiers générés livrés avec l'app, si bien que chercher un mot pendant la frappe ne coûte aucune requête. Ils sont dans un chunk à part qui ne se charge qu'à l'ouverture de l'onglet Analyser, ce qui garde le générateur léger.",
          "L'analyseur a une suite de 33 tests : un par motif reconnu, la recherche du chemin le moins coûteux, des essais qui augmentent avec la longueur et avec un jeu de caractères plus grand, et des bits qui restent le logarithme binaire du nombre d'essais.",
        ],
      },
    ],
    captions: [
      "L'onglet Générer : un mot de passe de 16 caractères issu des quatre jeux, 104 bits, noté maximal, avec au-dessus l'art génératif de sa graine.",
      "L'onglet Analyser sur une phrase de passe de quatre mots : 84 bits, les cinq scénarios d'attaque et le chemin d'attaque qui la découpe en mots du dictionnaire et en morceaux aléatoires.",
    ],
    tags: ["Next.js", "TypeScript", "Web Crypto", "Security"],
    stats: [
      { value: "100%", label: "côté client" },
      { value: "0", label: "secrets envoyés" },
      { value: "0", label: "Math.random() dans les secrets" },
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
    sections: [
      {
        heading: "随机字节，但不带取模偏差",
        body: [
          "拿一个 32 位随机数对字符池大小取模，看起来没问题，其实略有偏差：只要池子的大小不能整除 2³²，排在前面的几个字符就会比其他字符出现得稍微多一点。所以每一次抽取都经过一个小函数，它把落在不均匀尾段的值扔掉，重新再抽。",
          "生成器先从每个启用的字符集里各取一个字符，再从合并后的字符池补足长度，最后用 Fisher-Yates 把整串打乱，每一次交换用的也是同一个函数。口令短语取自 EFF 的长词表，每个词约 12.9 比特。",
          "整个应用里 Math.random() 只出现一次：给密码背后的生成艺术图案提供种子。那只是装饰，不守护任何东西。",
        ],
        code: {
          language: "ts",
          text: RAND_INT,
          caption:
            "摘自 src/lib/entropy-core.ts。每个字符、每次洗牌交换都经过这里：大于等于 max 最大倍数的值会被拒绝，所以每个结果的概率完全相同。",
        },
      },
      {
        heading: "数尝试次数，而不是数字符类别",
        body: [
          "分析器的第一版按长度和用了哪些字符类别来打分，这样一个字典单词加上一个符号和一个数字，就会被当成随机文本来打分。我把它换成了一个像破解者那样思考的估算器：找出密码里的每个单词、键盘走位、重复、序列和日期，给每一段按尝试次数定价，剩下的交给暴力破解。",
          "整个密码的价格，就是用这些片段把它覆盖起来最便宜的方式，用动态规划逐个位置搜出来。页面上的攻击路径就是这个结果，一段一段列出来，你能看到密码里哪一部分真正在出力，哪一部分只是换了装的词表单词。",
        ],
        figure: 1,
      },
      {
        heading: "等级和时间出自同一个攻击者",
        body: [
          "一个在四分钟破解时间旁边写着「强」的强度条，已经输了。所以每一档标签都按同一个攻击者来定：用 GPU 做离线快速哈希，每秒一百亿次。低于 40 比特是弱，96 比特及以上是最高档，生成页上显示的时间也按这个速度算。",
          "分析页把五种攻击者并排列出，从每小时只允许 100 次的登录表单，到每秒一万亿次的 GPU 农场，因为一个密码能撑多久，诚实的答案取决于谁拿到了哈希。建议也按同一把尺子：达到 56 比特以后，页面不再发出警告，最多建议再加一点长度。",
        ],
      },
      {
        heading: "密码无处可去",
        body: [
          "应用没有 API 路由，也不存储任何东西。分析所需的词表由一个脚本下载，写进随应用一起发布的生成文件里，所以打字时查词不产生任何请求。词表放在单独的代码块里，只有打开分析页时才加载，生成器因此保持轻量。",
          "分析器有一套 33 个测试：每种识别模式一个用例，最省力路径的搜索，尝试次数随长度和更大的字符集增加，以及比特数始终等于尝试次数的二进制对数。",
        ],
      },
    ],
    captions: [
      "生成页：一个取自全部四个字符集的 16 位密码，104 比特，评为最高档，上方是按它的种子画出的生成艺术。",
      "分析页里的一个四词口令短语：84 比特、五种攻击场景，以及把它拆成词表单词和随机片段的攻击路径。",
    ],
    tags: ["Next.js", "TypeScript", "Web Crypto", "Security"],
    stats: [
      { value: "100%", label: "在浏览器内" },
      { value: "0", label: "外发的密码" },
      { value: "0", label: "密码中的 Math.random()" },
      { value: "5", label: "攻击者模型" },
    ],
  },
};
