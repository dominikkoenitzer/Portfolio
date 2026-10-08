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
      "A password generator and analyzer that runs entirely in the browser: randomness from Web Crypto, a strength estimator I wrote myself, and crack times for five attacker models. Nothing is sent anywhere. Its Windows app, a local password manager on the same engine, types logins with Alt+E.",
    overview:
      "I did not want to paste a password into a website to find out whether it was any good, and the generators that do not ask you to are usually the ones reaching for Math.random(). So I wrote my own in Next.js and TypeScript. Generation pulls its bytes from Web Crypto. The analyzer is mine too: it matches dictionary words (reversed and l33t spellings included), keyboard walks, repeats, sequences and dates, brute-forces whatever is left at the password's real cardinality, and runs a dynamic-programming search for the cheapest attack path. What comes out is a guess count, which becomes bits, which becomes crack times. There are no API routes, so nothing you type has anywhere to go. Since October 2026 the same engine also runs in a password manager for Windows.",
    roleSummary: "Just me, and the analyzer took longer than the rest of the app together.",
    sections: [
      {
        heading: "Random bytes, without the modulo bias",
        body: [
          "Taking a random 32-bit number modulo the size of the character pool looks fine and is slightly wrong: unless the pool divides 2³² evenly, the first few characters come up a little more often than the rest. So every pick goes through one small function that throws away the values from the uneven tail and draws again.",
          "The generator draws every character from the combined pool of the sets you switched on and redraws the whole password until each of those sets appears in it, so the result stays uniform over exactly the passwords that fit the settings. Passphrases draw from the EFF long wordlist, about 12.9 bits a word.",
          "Math.random() appears exactly once in the app: it seeds the generative art behind the password, which is decoration and guards nothing.",
        ],
        code: {
          language: "ts",
          text: RAND_INT,
          caption:
            "From src/lib/entropy-core.ts. Every character and every passphrase word goes through this: values at or above the largest multiple of max are rejected, so each outcome is exactly as likely as the others.",
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
          "A meter that says strong beside a crack time of four minutes has lost the argument. Every tier label is therefore set against one attacker, an offline fast hash on a GPU at a hundred billion guesses a second: under 43 bits is weak, 99 and above is maximum, and the time shown under the Generate tab uses that same rate.",
          "The analyzer shows five attackers side by side, from a login form that allows 100 guesses an hour to a GPU farm at ten trillion a second, because the honest answer to how long a password lasts depends on who has the hash. Advice follows the same scale: from 59 bits up the page stops warning, and at most suggests a little more length.",
        ],
      },
      {
        heading: "Nowhere for a password to go",
        body: [
          "The app has no API routes and stores nothing. A script downloads the dictionaries the analyzer needs and writes them into generated files that ship with the app, so looking up a word while you type costs no request. They sit in their own chunk that only loads when the Analyze tab opens, which keeps the generator light.",
          "The analyzer has a suite of 49 tests: one per pattern it recognises, the cheapest-path search, guesses rising with length and with a larger character set, and bits staying the base-2 log of the guess count.",
        ],
      },
      {
        heading: "A password manager for Windows on the same engine",
        body: [
          "The Windows app keeps logins in a local vault and types them for you. There is no server and no account to sign up for. Press Alt+E on a sign-in page and Entropy reads the address of the page in front. If exactly one saved login belongs to that site and the cursor is in a text field, it types the username, a Tab and the password. Otherwise a small picker opens with the site's logins on top. A login with saved sites is offered only on those sites and their subdomains, never on an address that merely looks like one of them. I wrote the app in C# on .NET 10 with WinUI 3, starting from the code of Psyche, my two-factor app, and compiled it with Native AOT. Its windows use the website's Y2K poster look and fonts.",
        ],
        figure: 3,
      },
      {
        heading: "A health check that stays on the PC",
        body: [
          "The Health page puts each saved password through the analyzer and sorts the problems into four groups: found in a leak, weak, reused and old. The leak check runs offline against about a million of the most common passwords from public leaks. A binary fuse filter of 2.26 MB keeps a 16-bit fingerprint of each one's SHA-256 and raises a false alarm for about 1 in 65,536 passwords that never leaked. I ported the website's generator and analyzer to C#, including randInt, the function that draws random numbers without modulo bias. A script runs the website's own TypeScript over 643 passwords and 672 generator settings and saves the results, and the C# tests have to reproduce every guess count, bit value, tier and crack time in that file. In all there are 828 xUnit test cases for the core library and 153 for the Windows layer.",
        ],
        figure: 4,
      },
      {
        heading: "Codes, imports and the vault",
        body: [
          "A login keeps its last ten passwords with the date each one was replaced, and can hold a one-time code that a second Alt+E types into the code field. Secure notes and payment cards live in the same vault. An import reads the password exports of browsers and other password apps and, once every entry is saved, overwrites the export file with zeros and deletes it.",
          "The vault is encrypted with XChaCha20-Poly1305 under a key that Windows protects for the signed-in account, so it needs no master password and opens on no other account. Entropy wipes its keys when Windows locks or sleeps, and signing back in to Windows is enough to open the vault again. After 15 minutes without use it wipes them as well, and the first password, code or backup after that asks for Windows Hello once. A backup carries a password of its own, stretched with Argon2id, and restores on any PC: in full into an empty vault, and into a filled one by adding only what it lacks.",
        ],
        figure: 2,
      },
    ],
    captions: [
      "The Generate tab: a 16-character password from all four character sets at 103 bits, rated maximum, with the generative art for its seed above it.",
      "The Analyze tab on a four-word passphrase: 94 bits, the five attacker scenarios, and the attack path that splits it into dictionary words and random pieces.",
      "The vault with demo logins. One-time codes count down beside their logins, and the reused and weak labels come from the analyzer.",
      "The Alt+E picker on a sign-in page. The top login is marked as this site, and the keys below it type, copy or close.",
      "The Health page with demo logins, sorted into the four groups.",
    ],
    tags: ["Next.js", "TypeScript", "C#", "Web Crypto", "Security"],
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
      "Ein Passwortgenerator und -analysator, der komplett im Browser läuft: Zufall aus Web Crypto, eine selbst geschriebene Stärkeschätzung und Knackzeiten für fünf Angreifermodelle. Nichts wird irgendwohin gesendet. Die Windows-App, ein lokaler Passwortmanager auf derselben Engine, tippt Logins mit Alt+E ein.",
    overview:
      "Ich wollte kein Passwort in eine Website tippen, nur um zu erfahren, ob es gut ist, und die Generatoren, die das nicht verlangen, greifen meist zu Math.random(). Also schrieb ich meinen eigenen in Next.js und TypeScript. Die Erzeugung holt ihre Bytes aus Web Crypto. Die Analyse ist ebenfalls meine: Sie erkennt Wörterbuchwörter (rückwärts und in Leetschreibweise inklusive), Tastaturwege, Wiederholungen, Sequenzen und Datumsangaben, brute-forced den Rest mit der echten Kardinalität des Passworts und sucht per dynamischer Programmierung den billigsten Angriffspfad. Heraus kommt eine Anzahl an Versuchen, daraus Bits, daraus Knackzeiten. Es gibt keine API-Routen, also hat das Getippte gar keinen Weg nach draussen. Seit Oktober 2026 läuft dieselbe Engine auch in einem Passwortmanager für Windows.",
    roleSummary: "Nur ich, und die Analyse dauerte länger als der ganze Rest der App.",
    sections: [
      {
        heading: "Zufallsbytes ohne Modulo-Verzerrung",
        body: [
          "Eine zufällige 32-Bit-Zahl modulo der Grösse des Zeichenvorrats zu nehmen, sieht richtig aus und ist leicht falsch: Solange der Vorrat 2³² nicht glatt teilt, kommen die ersten paar Zeichen etwas häufiger vor als der Rest. Deshalb läuft jede Auswahl durch eine kleine Funktion, die die Werte aus dem ungeraden Rest verwirft und neu zieht.",
          "Der Generator zieht jedes Zeichen aus dem gemeinsamen Vorrat der eingeschalteten Sätze und zieht das ganze Passwort neu, bis jeder dieser Sätze darin vorkommt; so bleibt das Ergebnis gleichverteilt über genau die Passwörter, die zu den Einstellungen passen. Passphrasen kommen aus der langen EFF-Wortliste, etwa 12,9 Bit pro Wort.",
          "Math.random() kommt in der App genau einmal vor: Es setzt den Seed für die generative Grafik hinter dem Passwort, und die ist Dekoration und bewacht nichts.",
        ],
        code: {
          language: "ts",
          text: RAND_INT,
          caption:
            "Aus src/lib/entropy-core.ts. Jedes Zeichen und jedes Wort einer Passphrase geht hier durch: Werte ab dem grössten Vielfachen von max werden verworfen, damit jedes Ergebnis genau gleich wahrscheinlich ist.",
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
          "Eine Anzeige, die „stark“ neben eine Knackzeit von vier Minuten schreibt, hat schon verloren. Deshalb ist jedes Stufenlabel an einem einzigen Angreifer ausgerichtet, einem Offline-Fast-Hash auf einer GPU mit hundert Milliarden Versuchen pro Sekunde: Unter 43 Bit ist schwach, ab 99 maximal, und die Zeit im Generieren-Tab rechnet mit derselben Rate.",
          "Die Analyse zeigt fünf Angreifer nebeneinander, vom Login-Formular mit 100 Versuchen pro Stunde bis zur GPU-Farm mit zehn Billionen pro Sekunde, weil die ehrliche Antwort auf die Frage, wie lange ein Passwort hält, davon abhängt, wer den Hash hat. Die Ratschläge folgen derselben Skala: Ab 59 Bit hört die Seite auf zu warnen und schlägt höchstens noch etwas mehr Länge vor.",
        ],
      },
      {
        heading: "Kein Ort, an den ein Passwort gehen könnte",
        body: [
          "Die App hat keine API-Routen und speichert nichts. Die Wörterbücher für die Analyse lädt ein Skript herunter und schreibt sie in generierte Dateien, die mit der App ausgeliefert werden, darum kostet eine Wortsuche beim Tippen keinen Request. Sie liegen in einem eigenen Chunk, der erst lädt, wenn der Analysieren-Tab aufgeht, so bleibt der Generator leicht.",
          "Die Analyse hat eine Suite von 49 Tests: einen pro erkanntem Muster, die Suche nach dem billigsten Pfad, mehr Versuche bei mehr Länge und grösserem Zeichensatz und Bits, die immer der Zweierlogarithmus der Versuche bleiben.",
        ],
      },
      {
        heading: "Ein Passwortmanager für Windows auf derselben Engine",
        body: [
          "Die Windows-App bewahrt Logins in einem lokalen Tresor auf und tippt sie ein. Es gibt keinen Server und kein Konto, das man eröffnen müsste. Drückt man auf einer Anmeldeseite Alt+E, liest Entropy die Adresse der Seite im Vordergrund. Gehört genau ein gespeichertes Login zu dieser Seite und steht der Cursor in einem Textfeld, tippt Entropy den Benutzernamen, einen Tab und das Passwort ein. Sonst öffnet sich ein kleines Auswahlfenster mit den Logins der Seite zuoberst. Ein Login mit gespeicherten Seiten wird nur auf diesen Seiten und ihren Subdomains angeboten, nie auf einer Adresse, die einer von ihnen bloss ähnlich sieht. Die App habe ich in C# auf .NET 10 mit WinUI 3 geschrieben, ausgehend vom Code von Psyche, meiner Zwei-Faktor-App, und mit Native AOT kompiliert. Ihre Fenster übernehmen den Y2K-Posterlook und die Schriften der Website.",
        ],
        figure: 3,
      },
      {
        heading: "Ein Gesundheitscheck, der auf dem PC bleibt",
        body: [
          "Die Health-Seite schickt jedes gespeicherte Passwort durch die Analyse und ordnet die Probleme in vier Gruppen: in einem Leak gefunden, schwach, mehrfach verwendet und alt. Die Leak-Prüfung läuft offline gegen rund eine Million der häufigsten Passwörter aus öffentlichen Leaks. Ein Binary Fuse Filter von 2,26 MB hält vom SHA-256 jedes Passworts einen 16-Bit-Fingerabdruck und meldet etwa 1 von 65'536 nie geleakten Passwörtern fälschlich als gefunden. Generator und Analyse der Website habe ich nach C# portiert, samt randInt, der Funktion, die Zufallszahlen ohne Modulo-Verzerrung zieht. Ein Skript lässt das TypeScript der Website über 643 Passwörter und 672 Generator-Einstellungen laufen und speichert die Ergebnisse, und die C#-Tests müssen jede Anzahl Versuche, jeden Bitwert, jede Stufe und jede Knackzeit in dieser Datei genau treffen. Insgesamt gibt es für die Kernbibliothek 828 xUnit-Testfälle und für die Windows-Schicht 153.",
        ],
        figure: 4,
      },
      {
        heading: "Codes, Importe und der Tresor",
        body: [
          "Ein Login behält seine letzten zehn Passwörter mit dem Datum, an dem jedes ersetzt wurde, und kann einen Einmalcode enthalten, den ein zweites Alt+E ins Codefeld tippt. Sichere Notizen und Zahlungskarten liegen im selben Tresor. Ein Import liest die Passwort-Exporte von Browsern und anderen Passwort-Apps, und sobald jeder Eintrag gespeichert ist, überschreibt er die Exportdatei mit Nullen und löscht sie.",
          "Der Tresor ist mit XChaCha20-Poly1305 verschlüsselt, unter einem Schlüssel, den Windows für das angemeldete Konto schützt, also braucht er kein Master-Passwort und öffnet sich auf keinem anderen Konto. Entropy verwirft seine Schlüssel, wenn Windows sperrt oder in den Energiesparmodus geht, und die nächste Anmeldung bei Windows genügt, um den Tresor wieder zu öffnen. Nach 15 Minuten ohne Benutzung verwirft es sie ebenfalls, und danach fragt das erste Passwort, der erste Code oder das erste Backup einmal nach Windows Hello. Ein Backup hat ein eigenes Passwort, mit Argon2id gestreckt, und lässt sich auf jedem PC wiederherstellen: in einen leeren Tresor vollständig, in einen gefüllten nur mit dem, was ihm fehlt.",
        ],
        figure: 2,
      },
    ],
    captions: [
      "Der Generieren-Tab: ein Passwort mit 16 Zeichen aus allen vier Zeichensätzen, 103 Bit, als maximal bewertet, darüber die generative Grafik zu seinem Seed.",
      "Der Analysieren-Tab mit einer Passphrase aus vier Wörtern: 94 Bit, die fünf Angreiferszenarien und der Angriffspfad, der sie in Wörterbuchwörter und zufällige Stücke zerlegt.",
      "Der Tresor mit Demo-Logins. Einmalcodes laufen neben ihren Logins ab, und die Hinweise auf mehrfach verwendete und schwache Passwörter kommen von der Analyse.",
      "Die Auswahl mit Alt+E auf einer Anmeldeseite. Das oberste Login ist als diese Seite markiert, darunter liegen die Tasten zum Tippen, Kopieren und Schliessen.",
      "Die Health-Seite mit Demo-Logins, in die vier Gruppen sortiert.",
    ],
    tags: ["Next.js", "TypeScript", "C#", "Web Crypto", "Security"],
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
      "Un générateur et analyseur de mots de passe qui tourne entièrement dans le navigateur : aléa issu de Web Crypto, un estimateur de robustesse que j'ai écrit moi-même, et des temps de cassage pour cinq modèles d'attaquant. Rien n'est envoyé nulle part. Son app Windows, un gestionnaire de mots de passe local sur le même moteur, tape les identifiants avec Alt+E.",
    overview:
      "Je ne voulais pas coller un mot de passe dans un site web pour savoir s'il valait quelque chose, et les générateurs qui ne le demandent pas sont en général ceux qui utilisent Math.random(). J'ai donc écrit le mien en Next.js et TypeScript. La génération tire ses octets de Web Crypto. L'analyseur est de moi aussi : il repère les mots du dictionnaire (à l'envers et en leet compris), les chemins de clavier, les répétitions, les suites et les dates, force le reste à la vraie cardinalité du mot de passe, et cherche le chemin d'attaque le moins coûteux par programmation dynamique. Il en sort un nombre d'essais, qui devient des bits, qui deviennent des temps de cassage. Il n'y a aucune route d'API, donc ce que vous tapez n'a nulle part où aller. Depuis octobre 2026, le même moteur tourne aussi dans un gestionnaire de mots de passe pour Windows.",
    roleSummary: "Moi seul, et l'analyseur m'a pris plus de temps que tout le reste de l'app.",
    sections: [
      {
        heading: "Des octets aléatoires, sans biais de modulo",
        body: [
          "Prendre un nombre aléatoire de 32 bits modulo la taille du jeu de caractères a l'air correct et ne l'est pas tout à fait : si le jeu ne divise pas 2³² exactement, les premiers caractères sortent un peu plus souvent que les autres. Chaque tirage passe donc par une petite fonction qui jette les valeurs de la queue inégale et tire à nouveau.",
          "Le générateur tire chaque caractère dans le jeu combiné des jeux activés et tire de nouveau tout le mot de passe jusqu'à ce que chacun de ces jeux y figure, pour que le résultat reste uniforme sur exactement les mots de passe conformes aux réglages. Les phrases de passe puisent dans la grande liste de l'EFF, environ 12,9 bits par mot.",
          "Math.random() n'apparaît qu'une fois dans l'app : il sert de graine à l'art génératif derrière le mot de passe, qui est décoratif et ne protège rien.",
        ],
        code: {
          language: "ts",
          text: RAND_INT,
          caption:
            "Extrait de src/lib/entropy-core.ts. Chaque caractère et chaque mot de phrase de passe passent par là : les valeurs à partir du plus grand multiple de max sont rejetées, pour que chaque résultat ait exactement la même probabilité.",
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
          "Une jauge qui affiche « fort » à côté d'un temps de cassage de quatre minutes a déjà perdu. Chaque libellé de palier est donc réglé sur un seul attaquant, un hachage rapide hors ligne sur GPU à cent milliards d'essais par seconde : sous 43 bits c'est faible, à partir de 99 c'est maximal, et le temps affiché dans l'onglet Générer utilise ce même débit.",
          "L'analyseur montre cinq attaquants côte à côte, du formulaire de connexion qui accepte 100 essais par heure à la ferme de GPU à dix mille milliards par seconde, parce que la réponse honnête à la question de la durée dépend de qui détient le hachage. Les conseils suivent la même échelle : à partir de 59 bits, la page cesse d'avertir et suggère tout au plus un peu plus de longueur.",
        ],
      },
      {
        heading: "Nulle part où un mot de passe pourrait aller",
        body: [
          "L'app n'a aucune route d'API et ne stocke rien. Un script télécharge les dictionnaires de l'analyseur et les écrit dans des fichiers générés livrés avec l'app, si bien que chercher un mot pendant la frappe ne coûte aucune requête. Ils sont dans un chunk à part qui ne se charge qu'à l'ouverture de l'onglet Analyser, ce qui garde le générateur léger.",
          "L'analyseur a une suite de 49 tests : un par motif reconnu, la recherche du chemin le moins coûteux, des essais qui augmentent avec la longueur et avec un jeu de caractères plus grand, et des bits qui restent le logarithme binaire du nombre d'essais.",
        ],
      },
      {
        heading: "Un gestionnaire de mots de passe pour Windows sur le même moteur",
        body: [
          "L'app Windows garde les identifiants dans un coffre local et les tape à votre place. Il n'y a ni serveur ni compte à créer. Sur une page de connexion, Alt+E fait lire à Entropy l'adresse de la page au premier plan. Si un seul identifiant enregistré correspond à ce site et que le curseur est dans un champ de texte, il tape le nom d'utilisateur, une tabulation et le mot de passe. Sinon, un petit sélecteur s'ouvre avec les identifiants du site en tête. Un identifiant avec des sites enregistrés n'est proposé que sur ces sites et leurs sous-domaines, jamais sur une adresse qui ne fait que leur ressembler. J'ai écrit l'app en C# sur .NET 10 avec WinUI 3, à partir du code de Psyche, mon app de double authentification, et je l'ai compilée avec Native AOT. Ses fenêtres reprennent le style d'affiche Y2K et les polices du site.",
        ],
        figure: 3,
      },
      {
        heading: "Un bilan de santé qui reste sur le PC",
        body: [
          "La page Health passe chaque mot de passe enregistré dans l'analyseur et range les problèmes en quatre groupes : trouvé dans une fuite, faible, réutilisé et ancien. La vérification des fuites se fait hors ligne, contre environ un million des mots de passe les plus courants issus de fuites publiques. Un filtre binary fuse de 2,26 Mo garde une empreinte de 16 bits du SHA-256 de chacun, et signale à tort environ 1 mot de passe sur 65 536 qui n'a jamais fuité. J'ai porté en C# le générateur et l'analyseur du site, y compris randInt, la fonction qui tire des nombres aléatoires sans biais de modulo. Un script fait tourner le TypeScript du site sur 643 mots de passe et 672 réglages du générateur et enregistre les résultats, et les tests C# doivent retrouver chaque nombre d'essais, chaque valeur en bits, chaque palier et chaque temps de cassage de ce fichier. Au total, la bibliothèque centrale a 828 cas de test xUnit, la couche Windows 153.",
        ],
        figure: 4,
      },
      {
        heading: "Codes, importations et coffre",
        body: [
          "Un identifiant garde ses dix derniers mots de passe avec la date où chacun a été remplacé, et peut contenir un code à usage unique qu'un second Alt+E tape dans le champ du code. Les notes sécurisées et les cartes de paiement sont dans le même coffre. Une importation lit les exports de mots de passe des navigateurs et d'autres apps de mots de passe, puis, une fois chaque entrée enregistrée, écrase le fichier d'export avec des zéros et le supprime.",
          "Le coffre est chiffré avec XChaCha20-Poly1305 sous une clé que Windows protège pour le compte connecté : il n'a besoin d'aucun mot de passe maître et ne s'ouvre sur aucun autre compte. Entropy efface ses clés quand Windows se verrouille ou se met en veille, et se reconnecter à Windows suffit pour rouvrir le coffre. Il les efface aussi après 15 minutes d'inactivité, et ensuite, le premier mot de passe, code ou sauvegarde demande Windows Hello une fois. Une sauvegarde a son propre mot de passe, étiré avec Argon2id, et se restaure sur n'importe quel PC : en entier dans un coffre vide, et dans un coffre déjà rempli en n'ajoutant que ce qui lui manque.",
        ],
        figure: 2,
      },
    ],
    captions: [
      "L'onglet Générer : un mot de passe de 16 caractères issu des quatre jeux, 103 bits, noté maximal, avec au-dessus l'art génératif de sa graine.",
      "L'onglet Analyser sur une phrase de passe de quatre mots : 94 bits, les cinq scénarios d'attaque et le chemin d'attaque qui la découpe en mots du dictionnaire et en morceaux aléatoires.",
      "Le coffre avec des identifiants de démonstration. Les codes à usage unique défilent à côté de leurs identifiants, et les mentions réutilisé et faible viennent de l'analyseur.",
      "Le sélecteur Alt+E sur une page de connexion. L'identifiant du haut est marqué comme ce site, et les touches en dessous servent à taper, copier ou fermer.",
      "La page Health avec des identifiants de démonstration, triés dans les quatre groupes.",
    ],
    tags: ["Next.js", "TypeScript", "C#", "Web Crypto", "Security"],
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
      "一个完全在浏览器里跑的密码生成与分析工具：随机数来自 Web Crypto，强度估算由我自己写，破解时间按五种攻击者模型给出。什么都不会被发出去。它的 Windows 应用是基于同一引擎的本地密码管理器，按 Alt+E 就能输入登录信息。",
    overview:
      "我不想为了确认一个密码好不好，就把它粘进某个网站；而那些不要求你这么做的生成器，往下一翻往往在用 Math.random()。于是我用 Next.js 和 TypeScript 写了自己的一个。生成部分的每个字节都取自 Web Crypto。分析部分也是我写的：它会匹配词表里的单词（含倒写和 leet 拼法）、键盘走位、重复、递增序列和日期，剩下的按密码真实的字符空间做暴力估算，再用动态规划搜出最省力的那条攻击路径。算出来的是尝试次数，再换成比特，再换成破解时间。项目没有任何 API 路由，所以你输入的东西根本无处可去。从 2026 年 10 月起，同一套引擎也跑在一个 Windows 密码管理器里。",
    roleSummary: "只有我，而分析引擎花的时间比应用其余部分加起来还多。",
    sections: [
      {
        heading: "随机字节，但不带取模偏差",
        body: [
          "拿一个 32 位随机数对字符池大小取模，看起来没问题，其实略有偏差：只要池子的大小不能整除 2³²，排在前面的几个字符就会比其他字符出现得稍微多一点。所以每一次抽取都经过一个小函数，它把落在不均匀尾段的值扔掉，重新再抽。",
          "生成器从所有启用字符集合并后的字符池里抽取每一个字符，只要有一个启用的字符集没有出现，就整串重新抽取，因此结果在所有符合设置的密码上保持均匀分布。口令短语取自 EFF 的长词表，每个词约 12.9 比特。",
          "整个应用里 Math.random() 只出现一次：给密码背后的生成艺术图案提供种子。那只是装饰，不守护任何东西。",
        ],
        code: {
          language: "ts",
          text: RAND_INT,
          caption:
            "摘自 src/lib/entropy-core.ts。每个字符、每个口令短语里的词都经过这里：大于等于 max 最大倍数的值会被拒绝，所以每个结果的概率完全相同。",
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
          "一个在四分钟破解时间旁边写着「强」的强度条，已经输了。所以每一档标签都按同一个攻击者来定：用 GPU 做离线快速哈希，每秒一千亿次。低于 43 比特是弱，99 比特及以上是最高档，生成页上显示的时间也按这个速度算。",
          "分析页把五种攻击者并排列出，从每小时只允许 100 次的登录表单，到每秒十万亿次的 GPU 农场，因为一个密码能撑多久，诚实的答案取决于谁拿到了哈希。建议也按同一把尺子：达到 59 比特以后，页面不再发出警告，最多建议再加一点长度。",
        ],
      },
      {
        heading: "密码无处可去",
        body: [
          "应用没有 API 路由，也不存储任何东西。分析所需的词表由一个脚本下载，写进随应用一起发布的生成文件里，所以打字时查词不产生任何请求。词表放在单独的代码块里，只有打开分析页时才加载，生成器因此保持轻量。",
          "分析器有一套 49 个测试：每种识别模式一个用例，最省力路径的搜索，尝试次数随长度和更大的字符集增加，以及比特数始终等于尝试次数的二进制对数。",
        ],
      },
      {
        heading: "同一套引擎上的 Windows 密码管理器",
        body: [
          "Windows 应用把登录信息存在本地保险库里，并替你输入。没有服务器，也不用注册账号。在登录页面按下 Alt+E，Entropy 会读取前台页面的地址。如果恰好有一条已保存的登录属于这个网站，并且光标在文本框里，它就输入用户名、一个 Tab 和密码。否则会弹出一个小选择窗口，这个网站的登录排在最前面。已保存网站的登录只会在这些网站及其子域名上出现，绝不会出现在只是看起来相像的地址上。这个应用是我用 C# 在 .NET 10 上配合 WinUI 3 写的，以我的双重验证应用 Psyche 的代码为起点，并用 Native AOT 编译。它的窗口沿用网站的 Y2K 海报风格和字体。",
        ],
        figure: 3,
      },
      {
        heading: "留在本机上的健康检查",
        body: [
          "Health 页面把每个已保存的密码交给分析器，把问题分成四组：出现在泄露中、弱、重复使用和过旧。泄露检查完全离线，对照的是公开泄露中最常见的约一百万个密码。一个 2.26 MB 的 binary fuse 过滤器为每个密码的 SHA-256 保存一个 16 位指纹，对从未泄露的密码，大约每 65,536 个会误报一个。我把网站的生成器和分析器移植到了 C#，包括不带取模偏差地抽取随机数的 randInt 函数。一个脚本用网站自己的 TypeScript 跑 643 个密码和 672 种生成器设置，把结果存成文件，C# 测试必须逐一还原其中每个尝试次数、比特值、等级和破解时间。核心库共有 828 个 xUnit 测试用例，Windows 层有 153 个。",
        ],
        figure: 4,
      },
      {
        heading: "验证码、导入与保险库",
        body: [
          "每条登录会保留最近十个旧密码和各自被替换的日期，也可以存一个一次性验证码，再按一次 Alt+E 就会把它输入验证码框。安全笔记和支付卡放在同一个保险库里。导入功能读取浏览器和其他密码应用导出的密码文件，等每一条都保存好后，用零覆盖导出文件再把它删除。",
          "保险库用 XChaCha20-Poly1305 加密，密钥由 Windows 为当前登录的账户保护，所以不需要主密码，换一个账户也打不开。Windows 锁屏或睡眠时，Entropy 会清除密钥，重新登录 Windows 就能再次打开保险库。闲置 15 分钟后它也会清除密钥，之后第一次取用密码、验证码或备份时会要求一次 Windows Hello。备份有自己的密码，经 Argon2id 加强，可以在任何电脑上恢复：恢复到空保险库时全部导入，恢复到已有内容的保险库时只补上缺少的条目。",
        ],
        figure: 2,
      },
    ],
    captions: [
      "生成页：一个取自全部四个字符集的 16 位密码，103 比特，评为最高档，上方是按它的种子画出的生成艺术。",
      "分析页里的一个四词口令短语：94 比特、五种攻击场景，以及把它拆成词表单词和随机片段的攻击路径。",
      "保险库里的演示登录。一次性验证码在各自的登录旁倒计时，重复使用和弱密码的标签来自分析器。",
      "登录页面上的 Alt+E 选择窗口。最上面的登录标为本站，下面的按键用来输入、复制和关闭。",
      "Health 页面上的演示登录，已分进四个组。",
    ],
    tags: ["Next.js", "TypeScript", "C#", "Web Crypto", "Security"],
    stats: [
      { value: "100%", label: "在浏览器内" },
      { value: "0", label: "外发的密码" },
      { value: "0", label: "密码中的 Math.random()" },
      { value: "5", label: "攻击者模型" },
    ],
  },
};
