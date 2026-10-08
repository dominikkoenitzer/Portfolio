import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

const FRESH_CODE = `/// <summary>A code typed in its last moments often expires on the way. Wait for the next one instead.</summary>
private static async Task<OtpCode?> FreshCodeAsync(Account account, bool next)
{
    var now = DateTimeOffset.UtcNow;
    if (account.Kind == OtpKind.Hotp)
    {
        return OtpGenerator.Generate(account, now);
    }
    if (next)
    {
        return OtpGenerator.Next(account, now);
    }
    var code = OtpGenerator.Generate(account, now);
    if (code.SecondsRemaining <= FreshCodeMargin.TotalSeconds)
    {
        var wait = TimeSpan.FromSeconds(code.SecondsRemaining) - TimeSpan.FromMilliseconds(now.Millisecond) + TimeSpan.FromMilliseconds(60);
        await Task.Delay(wait > TimeSpan.Zero ? wait : TimeSpan.Zero);
        code = OtpGenerator.Generate(account, DateTimeOffset.UtcNow);
    }
    return code;
}`;

const en: LocalizedContent = {
  tagline: "Two-factor codes on the Windows desktop. Alt+P on a 2FA prompt types the code.",
  description:
    "Psyche is a Windows app for two-factor codes. Press Alt+P on any 2FA prompt and it types the code for the site in front of you, from a vault that opens only for your Windows account.",
  overview:
    "Every sign-in with two-factor authentication meant picking up my phone, unlocking it, finding the account and typing six digits before they ran out. Psyche keeps those codes on the PC I am already sitting at. Press Alt+P on a 2FA prompt and it reads the address of the page in front. When exactly one account belongs to that site and the cursor is in a text field, it types the code at once. Otherwise a small picker opens, and a few letters and Enter do the rest. It is written in C# on .NET 10 with WinUI 3, compiled with Native AOT, and the accounts live in a vault encrypted with XChaCha20-Poly1305.",
  roleSummary: "Just me: the WinUI 3 app, the Windows layer, the vault format and the importers.",
  sections: [
    {
      heading: "The right account for the page in front",
      body: [
        "Psyche notes the foreground window inside the hotkey message itself, before the picker or anything else can take focus. If that window is Brave, Chrome, Edge, Vivaldi, Opera, Arc or Firefox, it reads the address bar through UI Automation on a thread of its own and gives the browser 300 ms to answer. While you are editing the address bar it reads nothing, because what is in there is not the page you are on.",
        "An address matches an account at one of three levels. Exact means the host is a domain the account was used on, or a subdomain of one. Known means the issuer is one of 151 services whose sign-in domains ship with the app. Probable means the first label of the site's registrable domain is the issuer's name. The registrable domain comes from the Public Suffix List, embedded in the app, so an account saved for github.io never matches a stranger's site at name.github.io.",
        "Only an exact or known match is typed without asking, and only when there is exactly one. A probable match always opens the picker. Once I pick an account on a site, Psyche saves that domain on the account, inside the encrypted vault, and the next match is exact.",
      ],
    },
    {
      heading: "A code that is still valid when it lands",
      body: [
        "Psyche types with SendInput and Unicode key events, one key down and up per digit, 12 ms apart, so the keyboard layout does not matter. Before the first digit it waits up to 1.5 seconds for the Alt key to come up, or the digits would arrive as Alt shortcuts, and it stops if the foreground window changes halfway through.",
        "A code typed in its last second often expires before the server checks it. When less than two seconds are left, Psyche waits for the next one and types that instead.",
        "Windows lets no normal process send input to a window that runs as administrator. Psyche compares the target's integrity level with its own, and counts the window as elevated when it cannot tell. Then the code goes to the clipboard, marked so that clipboard history, the cloud clipboard and clipboard monitors skip it. After 30 seconds it is zeroed and removed, but only if the clipboard still holds it.",
      ],
      code: {
        language: "csharp",
        text: FRESH_CODE,
        caption:
          "FreshCodeAsync in AppController.cs. SecondsRemaining is rounded up to whole seconds, so the check waits out any code with less than two real seconds left.",
      },
    },
    {
      heading: "A vault that opens for one Windows account",
      body: [
        "The vault is one file. Its header holds a format version, a random vault id, a key check and a save counter, and the whole header is authenticated together with the accounts by XChaCha20-Poly1305, with a fresh nonce on every save. A test flips every byte of a vault, one at a time, and checks that each changed file is refused.",
        "The key that opens the vault sits in a slot. By default the slot is protected by Windows (DPAPI) for the signed-in user and bound to the vault id, so the vault opens after you sign in, with no password, and a copy of the file is useless on another account or PC. A backup gets a new key and a password of its own, stretched with Argon2id at no less than 64 MiB and three passes, so it opens in Psyche on any PC.",
        "Each secret lives in pinned memory, encrypted with CryptProtectMemory while nothing reads it and zeroed when it is released. Psyche drops its keys after 15 minutes without use and whenever Windows locks or goes to sleep. A save writes a temporary file beside the vault, flushes it to disk and swaps it in, and a save counter refuses to overwrite a vault that changed since it was opened.",
      ],
      figure: 1,
    },
    {
      heading: "Moving the codes over from the phone",
      body: [
        "Google Authenticator exports its accounts as a series of QR codes. Psyche reads them through the webcam. Auto exposure meters the whole room and blows out a phone screen held close, so Psyche steps through a few shorter exposures, and each frame goes to zxing-cpp first and to ZXing.Net with mirrored and inverted retries after that. The codes can be shown in any order, a code seen twice is ignored, and every account is saved the moment its code is read. The export packs the accounts as protobuf, which Psyche decodes by hand without a protobuf library.",
        "Encrypted exports from Aegis, 2FAS, Proton Authenticator and Ente Auth open with their own key derivation, scrypt, PBKDF2 or Argon2id, followed by AES-GCM or libsodium's secretstream. Bitwarden's plain JSON and CSV exports work too. A new site's setup QR code can be read straight off the screen, or added from a pasted image, an otpauth:// link or the typed secret.",
        "There are 555 xUnit test cases for the core library and 112 for the Windows layer. The camera path is tested against simulated webcam frames, and the domain parser against the Public Suffix List's official test file. CI on Windows checks the formatting, runs both suites and publishes the AOT build on every push to main.",
      ],
    },
  ],
  captions: [
    "The picker on github.com with demo accounts: both GitHub accounts are marked as this site and listed first, each code beside its countdown ring.",
    "The main window with the same demo accounts, every code with a countdown ring and a Copy button.",
  ],
  tags: ["C#", ".NET 10", "WinUI 3", "Windows"],
  stats: [
    { value: "1", label: "hotkey" },
    { value: "6", label: "apps it imports from" },
    { value: "151", label: "known services" },
    { value: "667", label: "tests" },
  ],
};

const de: LocalizedContent = {
  tagline: "Zwei-Faktor-Codes auf dem Windows-Desktop. Alt+P bei einer 2FA-Abfrage tippt den Code ein.",
  description:
    "Psyche ist eine Windows-App für Zwei-Faktor-Codes. Ein Druck auf Alt+P bei jeder 2FA-Abfrage, und Psyche tippt den Code für die Seite vor dir ein, aus einem Tresor, der sich nur für dein Windows-Konto öffnet.",
  overview:
    "Jede Anmeldung mit Zwei-Faktor-Authentifizierung hiess, das Handy zu nehmen, es zu entsperren, das Konto zu suchen und sechs Ziffern einzutippen, bevor sie abliefen. Psyche bewahrt diese Codes auf dem PC auf, an dem ich ohnehin schon sitze. Drückt man bei einer 2FA-Abfrage Alt+P, liest Psyche die Adresse der Seite im Vordergrund. Gehört genau ein Konto zu dieser Seite und steht der Cursor in einem Textfeld, wird der Code sofort eingetippt. Sonst öffnet sich ein kleines Auswahlfenster, und ein paar Buchstaben und Enter erledigen den Rest. Psyche ist in C# auf .NET 10 mit WinUI 3 geschrieben und mit Native AOT kompiliert, und die Konten liegen in einem Tresor, der mit XChaCha20-Poly1305 verschlüsselt ist.",
  roleSummary: "Nur ich: die WinUI-3-App, die Windows-Schicht, das Tresorformat und die Importer.",
  sections: [
    {
      heading: "Das richtige Konto für die Seite im Vordergrund",
      body: [
        "Psyche hält das Vordergrundfenster schon beim Verarbeiten der Hotkey-Nachricht fest, bevor das Auswahlfenster oder sonst etwas den Fokus übernehmen kann. Ist dieses Fenster Brave, Chrome, Edge, Vivaldi, Opera, Arc oder Firefox, liest Psyche die Adressleiste über UI Automation in einem eigenen Thread und gibt dem Browser 300 ms Zeit für die Antwort. Während du die Adressleiste bearbeitest, wird nichts gelesen, denn was dort steht, ist nicht die Seite, auf der du bist.",
        "Eine Adresse passt auf einer von drei Stufen zu einem Konto. Exakt heisst, der Host ist eine Domain, auf der das Konto benutzt wurde, oder eine Subdomain davon. Bekannt heisst, der Aussteller ist einer von 151 Diensten, deren Anmelde-Domains mit der App mitkommen. Wahrscheinlich heisst, der erste Teil der registrierbaren Domain der Seite ist der Name des Ausstellers. Die registrierbare Domain kommt aus der Public Suffix List, die in die App eingebaut ist, deshalb passt ein für github.io gespeichertes Konto nie auf die Seite eines Fremden unter name.github.io.",
        "Ohne Nachfrage getippt wird nur bei einem exakten oder bekannten Treffer, und nur, wenn es genau einen gibt. Ein wahrscheinlicher Treffer öffnet immer das Auswahlfenster. Sobald ich auf einer Seite ein Konto auswähle, speichert Psyche diese Domain beim Konto, im verschlüsselten Tresor, und der nächste Treffer ist exakt.",
      ],
    },
    {
      heading: "Ein Code, der noch gilt, wenn er ankommt",
      body: [
        "Psyche tippt mit SendInput und Unicode-Tastenereignissen, pro Ziffer ein Drücken und ein Loslassen, im Abstand von 12 ms, und so spielt das Tastaturlayout keine Rolle. Vor der ersten Ziffer wartet Psyche bis zu 1,5 Sekunden, bis die Alt-Taste losgelassen ist, sonst kämen die Ziffern als Alt-Tastenkürzel an, und hört auf, wenn das Vordergrundfenster mittendrin wechselt.",
        "Ein Code, der in seiner letzten Sekunde getippt wird, läuft oft ab, bevor der Server ihn prüft. Bleiben weniger als zwei Sekunden, wartet Psyche auf den nächsten und tippt stattdessen diesen.",
        "Windows lässt keinen normalen Prozess Eingaben an ein Fenster schicken, das als Administrator läuft. Psyche vergleicht die Integritätsstufe des Ziels mit der eigenen und behandelt das Fenster als eines mit erhöhten Rechten, wenn sich das nicht feststellen lässt. Dann geht der Code in die Zwischenablage, so markiert, dass der Zwischenablageverlauf, die Cloud-Zwischenablage und Zwischenablage-Monitore ihn überspringen. Nach 30 Sekunden wird er mit Nullen überschrieben und entfernt, aber nur, wenn die Zwischenablage ihn noch enthält.",
      ],
      code: {
        language: "csharp",
        text: FRESH_CODE,
        caption:
          "FreshCodeAsync in AppController.cs. SecondsRemaining wird auf ganze Sekunden aufgerundet, also wartet die Prüfung jeden Code ab, dem weniger als zwei echte Sekunden bleiben.",
      },
    },
    {
      heading: "Ein Tresor, der sich für ein Windows-Konto öffnet",
      body: [
        "Der Tresor besteht aus einer Datei. Ihr Header enthält eine Formatversion, eine zufällige Tresor-ID, eine Schlüsselprüfung und einen Speicherzähler, und XChaCha20-Poly1305 authentifiziert den ganzen Header zusammen mit den Konten, bei jedem Speichern mit einer neuen Nonce. Ein Test verändert jedes Byte eines Tresors, eines nach dem anderen, und prüft, dass jede veränderte Datei abgewiesen wird.",
        "Der Schlüssel, der den Tresor öffnet, liegt in einem Slot. Standardmässig ist dieser Slot durch Windows (DPAPI) für den angemeldeten Benutzer geschützt und an die Tresor-ID gebunden, also öffnet sich der Tresor nach dem Anmelden ohne Passwort, und eine Kopie der Datei ist auf einem anderen Konto oder PC nutzlos. Ein Backup bekommt einen neuen Schlüssel und ein eigenes Passwort, das mit Argon2id mit mindestens 64 MiB und drei Durchläufen gestreckt wird, deshalb lässt es sich auf jedem PC in Psyche öffnen.",
        "Jedes Geheimnis liegt in fixiertem Speicher, mit CryptProtectMemory verschlüsselt, solange nichts es liest, und mit Nullen überschrieben, wenn es freigegeben wird. Psyche verwirft die Schlüssel nach 15 Minuten ohne Benutzung und jedes Mal, wenn Windows gesperrt wird oder in den Energiesparmodus geht. Beim Speichern schreibt Psyche eine temporäre Datei neben den Tresor, bringt sie vollständig auf die Platte und tauscht sie ein, und ein Speicherzähler verhindert, dass ein Tresor überschrieben wird, der sich seit dem Öffnen verändert hat.",
      ],
      figure: 1,
    },
    {
      heading: "Die Codes vom Handy herüberholen",
      body: [
        "Google Authenticator exportiert seine Konten als Folge von QR-Codes. Psyche liest sie über die Webcam. Die automatische Belichtung misst den ganzen Raum und überbelichtet einen nah gehaltenen Handybildschirm, deshalb probiert Psyche nacheinander ein paar kürzere Belichtungen durch, und jedes Bild geht zuerst an zxing-cpp und danach an ZXing.Net, das es gespiegelt und invertiert erneut versucht. Die Codes können in beliebiger Reihenfolge gezeigt werden, ein doppelt gesehener Code wird ignoriert, und jedes Konto wird gespeichert, sobald sein Code gelesen ist. Der Export packt die Konten als Protobuf, das Psyche von Hand dekodiert, ohne Protobuf-Bibliothek.",
        "Verschlüsselte Exporte aus Aegis, 2FAS, Proton Authenticator und Ente Auth öffnen sich mit ihrer jeweils eigenen Schlüsselableitung (scrypt, PBKDF2 oder Argon2id), gefolgt von AES-GCM oder dem secretstream von libsodium. Die unverschlüsselten JSON- und CSV-Exporte von Bitwarden funktionieren ebenfalls. Der Einrichtungs-QR-Code einer neuen Seite lässt sich direkt vom Bildschirm lesen oder aus einem eingefügten Bild, einem otpauth://-Link oder dem eingetippten Geheimnis hinzufügen.",
        "Für die Kernbibliothek gibt es 555 xUnit-Testfälle und für die Windows-Schicht 112. Der Kamerapfad wird gegen simulierte Webcam-Bilder getestet, der Domain-Parser gegen die offizielle Testdatei der Public Suffix List. Die CI auf Windows prüft bei jedem Push auf main die Formatierung, lässt beide Suiten laufen und veröffentlicht den AOT-Build.",
      ],
    },
  ],
  captions: [
    "Das Auswahlfenster auf github.com mit Demo-Konten: Beide GitHub-Konten sind als zu dieser Seite gehörend markiert und stehen zuoberst, jeder Code neben seinem Countdown-Ring.",
    "Das Hauptfenster mit denselben Demo-Konten, jeder Code mit einem Countdown-Ring und einem Copy-Button.",
  ],
  tags: ["C#", ".NET 10", "WinUI 3", "Windows"],
  stats: [
    { value: "1", label: "Hotkey" },
    { value: "6", label: "Apps als Importquelle" },
    { value: "151", label: "bekannte Dienste" },
    { value: "667", label: "Tests" },
  ],
};

const fr: LocalizedContent = {
  tagline: "Des codes à deux facteurs sur le bureau Windows. Alt+P sur une demande 2FA tape le code.",
  description:
    "Psyche est une application Windows pour les codes à deux facteurs. Appuyez sur Alt+P sur n'importe quelle demande 2FA, et elle tape le code du site que vous avez devant vous, depuis un coffre qui ne s'ouvre que pour votre compte Windows.",
  overview:
    "Chaque connexion avec authentification à deux facteurs voulait dire prendre mon téléphone, le déverrouiller, trouver le compte et taper six chiffres avant qu'ils n'expirent. Psyche garde ces codes sur le PC devant lequel je suis déjà assis. Appuyez sur Alt+P sur une demande 2FA, et Psyche lit l'adresse de la page au premier plan. Quand exactement un compte appartient à ce site et que le curseur est dans un champ de texte, elle tape le code tout de suite. Sinon, un petit sélecteur s'ouvre, et quelques lettres puis Entrée font le reste. Elle est écrite en C# sur .NET 10 avec WinUI 3, compilée avec Native AOT, et les comptes vivent dans un coffre chiffré avec XChaCha20-Poly1305.",
  roleSummary: "Moi seul : l'application WinUI 3, la couche Windows, le format du coffre et les importateurs.",
  sections: [
    {
      heading: "Le bon compte pour la page au premier plan",
      body: [
        "Psyche note la fenêtre au premier plan dans le message du raccourci lui-même, avant que le sélecteur ou quoi que ce soit d'autre ne puisse prendre le focus. Si cette fenêtre est Brave, Chrome, Edge, Vivaldi, Opera, Arc ou Firefox, Psyche lit la barre d'adresse via UI Automation sur un thread à part et laisse 300 ms au navigateur pour répondre. Pendant que vous modifiez la barre d'adresse, Psyche ne lit rien, parce que ce qui s'y trouve n'est pas la page où vous êtes.",
        "Une adresse correspond à un compte à l'un de trois niveaux. Exact veut dire que l'hôte est un domaine sur lequel le compte a servi, ou un sous-domaine de l'un d'eux. Connu veut dire que l'émetteur est l'un des 151 services dont les domaines de connexion sont livrés avec l'application. Probable veut dire que le premier label du domaine enregistrable du site est le nom de l'émetteur. Le domaine enregistrable vient de la Public Suffix List, intégrée à l'application, si bien qu'un compte enregistré pour github.io ne correspond jamais au site d'un inconnu sous nom.github.io.",
        "Psyche ne tape sans demander que sur une correspondance exacte ou connue, et seulement s'il y en a exactement une. Une correspondance probable ouvre toujours le sélecteur. Dès que je choisis un compte sur un site, Psyche enregistre ce domaine sur le compte, dans le coffre chiffré, et la correspondance suivante est exacte.",
      ],
    },
    {
      heading: "Un code encore valable à son arrivée",
      body: [
        "La saisie passe par SendInput et des événements clavier Unicode, une pression et un relâchement par chiffre, à 12 ms d'intervalle, si bien que la disposition du clavier n'a pas d'importance. Avant le premier chiffre, Psyche attend jusqu'à 1,5 seconde que la touche Alt soit relâchée, sinon les chiffres arriveraient comme des raccourcis Alt, et elle s'arrête si la fenêtre au premier plan change en cours de route.",
        "Un code tapé dans sa dernière seconde expire souvent avant que le serveur ne le vérifie. Quand il reste moins de deux secondes, Psyche attend le suivant et tape celui-là à la place.",
        "Windows ne laisse aucun processus normal envoyer des saisies à une fenêtre qui tourne en administrateur. Psyche compare le niveau d'intégrité de la cible au sien et, dans le doute, considère la fenêtre comme élevée. Dans ce cas, le code part dans le presse-papiers, marqué pour que l'historique du presse-papiers, le presse-papiers cloud et les moniteurs de presse-papiers l'ignorent. Après 30 secondes, il est mis à zéro et retiré, mais seulement si le presse-papiers le contient encore.",
      ],
      code: {
        language: "csharp",
        text: FRESH_CODE,
        caption:
          "FreshCodeAsync dans AppController.cs. SecondsRemaining est arrondi à la seconde supérieure, si bien que le contrôle attend la fin de tout code auquel il reste moins de deux secondes réelles.",
      },
    },
    {
      heading: "Un coffre qui s'ouvre pour un seul compte Windows",
      body: [
        "Le coffre est un seul fichier. Son en-tête contient une version de format, un identifiant de coffre aléatoire, une vérification de clé et un compteur d'enregistrements, et tout l'en-tête est authentifié avec les comptes par XChaCha20-Poly1305, avec un nonce neuf à chaque enregistrement. Un test altère chaque octet d'un coffre, un à la fois, et vérifie que chaque fichier modifié est refusé.",
        "La clé qui ouvre le coffre se trouve dans un emplacement. Par défaut, cet emplacement est protégé par Windows (DPAPI) pour l'utilisateur connecté et lié à l'identifiant du coffre : le coffre s'ouvre donc après votre connexion, sans mot de passe, et une copie du fichier ne sert à rien sur un autre compte ou un autre PC. Une sauvegarde reçoit une nouvelle clé et son propre mot de passe, étiré avec Argon2id à 64 Mio au minimum et trois passes, si bien qu'elle s'ouvre dans Psyche sur n'importe quel PC.",
        "Chaque secret vit dans de la mémoire épinglée, chiffré avec CryptProtectMemory tant que rien ne le lit, et mis à zéro quand il est libéré. Psyche oublie ses clés après 15 minutes sans utilisation, et chaque fois que Windows se verrouille ou se met en veille. Un enregistrement écrit un fichier temporaire à côté du coffre, le vide sur le disque et le met à sa place, et un compteur d'enregistrements refuse d'écraser un coffre qui a changé depuis son ouverture.",
      ],
      figure: 1,
    },
    {
      heading: "Faire passer les codes depuis le téléphone",
      body: [
        "Google Authenticator exporte ses comptes sous forme d'une série de codes QR. Psyche les lit par la webcam. L'exposition automatique mesure toute la pièce et surexpose l'écran d'un téléphone tenu de près, alors Psyche passe par quelques expositions plus courtes, et chaque image va d'abord à zxing-cpp, puis à ZXing.Net avec de nouveaux essais en miroir et en négatif. Les codes peuvent être montrés dans n'importe quel ordre, un code vu deux fois est ignoré, et chaque compte est enregistré dès que son code est lu. L'export encode les comptes en protobuf, que Psyche décode à la main, sans bibliothèque protobuf.",
        "Les exports chiffrés d'Aegis, 2FAS, Proton Authenticator et Ente Auth s'ouvrent avec leur propre dérivation de clé, scrypt, PBKDF2 ou Argon2id, suivie d'AES-GCM ou du secretstream de libsodium. Les exports JSON et CSV en clair de Bitwarden marchent aussi. Le code QR de configuration d'un nouveau site peut se lire directement sur l'écran, ou s'ajouter depuis une image collée, un lien otpauth:// ou le secret saisi au clavier.",
        "Il y a 555 cas de test xUnit pour la bibliothèque centrale et 112 pour la couche Windows. Le chemin de la caméra est testé sur des images de webcam simulées, et l'analyseur de domaines sur le fichier de test officiel de la Public Suffix List. La CI sous Windows vérifie le formatage, lance les deux suites et publie le build AOT à chaque push sur main.",
      ],
    },
  ],
  captions: [
    "Le sélecteur sur github.com avec des comptes de démo : les deux comptes GitHub sont marqués comme appartenant à ce site et listés en premier, chaque code à côté de son anneau de compte à rebours.",
    "La fenêtre principale avec les mêmes comptes de démo, chaque code avec un anneau de compte à rebours et un bouton pour le copier.",
  ],
  tags: ["C#", ".NET 10", "WinUI 3", "Windows"],
  stats: [
    { value: "1", label: "raccourci" },
    { value: "6", label: "applications d'où importer" },
    { value: "151", label: "services connus" },
    { value: "667", label: "tests" },
  ],
};

const zh: LocalizedContent = {
  tagline: "Windows 桌面上的两步验证码。在 2FA 提示处按 Alt+P，它就会输入验证码。",
  description:
    "Psyche 是一个管理两步验证码的 Windows 应用。在任意 2FA 提示处按 Alt+P，它就会从一个只为你的 Windows 账户打开的保险库里，取出眼前这个网站的验证码并输入。",
  overview:
    "以前每次用两步验证登录，我都得拿起手机、解锁、找到账户，再赶在六位数字失效之前把它们敲进去。Psyche 把这些验证码放在我本来就坐在跟前的这台电脑上。在 2FA 提示处按 Alt+P，它会读取眼前页面的地址。如果这个网站正好只对应一个账户，光标又在文本框里，它会立刻输入验证码。否则会弹出一个小选择框，敲几个字母再按 Enter 就行。它用 C# 写成，跑在 .NET 10 上，界面用 WinUI 3，以 Native AOT 编译，账户存放在一个用 XChaCha20-Poly1305 加密的保险库里。",
  roleSummary: "只有我：WinUI 3 应用、Windows 层、保险库格式和各个导入器。",
  sections: [
    {
      heading: "为眼前的页面选对账户",
      body: [
        "Psyche 在处理快捷键消息时就当场记下前台窗口，赶在选择框或别的任何东西拿走焦点之前。如果这个窗口是 Brave、Chrome、Edge、Vivaldi、Opera、Arc 或 Firefox，它会在一个单独的线程上通过 UI Automation 读取地址栏，并给浏览器 300 毫秒的时间作答。你正在编辑地址栏时，它什么也不读，因为那里面的内容并不是你所在的页面。",
        "地址与账户的匹配分三个等级。「精确」指主机名是这个账户用过的域名，或是其中某个域名的子域名。「已知」指发行方属于 151 个服务之一，这些服务的登录域名随应用一起提供。「可能」指网站可注册域名的第一段就是发行方的名字。可注册域名来自内置在应用里的 Public Suffix List，所以为 github.io 保存的账户，永远不会匹配到别人放在 name.github.io 上的网站。",
        "只有精确或已知的匹配才会不经询问直接输入，而且前提是正好只有一个。可能的匹配总是会打开选择框。我在某个网站上选过一次账户之后，Psyche 会把这个域名存到该账户上，存在加密的保险库里，下一次的匹配就是精确的了。",
      ],
    },
    {
      heading: "送达时依然有效的验证码",
      body: [
        "Psyche 用 SendInput 和 Unicode 按键事件来输入，每个数字一次按下、一次抬起，间隔 12 毫秒，所以键盘布局无关紧要。输入第一个数字之前，它最多会等 1.5 秒让 Alt 键松开，否则这些数字会被当成 Alt 快捷键；如果前台窗口在输入途中变了，它就停下。",
        "在最后一秒输入的验证码，常常还没等服务器检查就过期了。剩余时间不到两秒时，Psyche 会等下一个验证码，改为输入那一个。",
        "Windows 不允许任何普通进程向以管理员身份运行的窗口发送输入。Psyche 会拿目标窗口的完整性级别和自己的比较，无法判断时就把窗口当作已提权。这时验证码会进入剪贴板，并带上标记，让剪贴板历史记录、云剪贴板和剪贴板监视程序都跳过它。30 秒后它会被清零并移除，但前提是剪贴板里放的仍是它。",
      ],
      code: {
        language: "csharp",
        text: FRESH_CODE,
        caption:
          "AppController.cs 中的 FreshCodeAsync。SecondsRemaining 会向上取整到整秒，所以凡是实际剩余不到两秒的验证码，这个检查都会等它过去。",
      },
    },
    {
      heading: "只为一个 Windows 账户打开的保险库",
      body: [
        "保险库就是一个文件。文件头里有格式版本、一个随机的保险库 ID、一个密钥校验值和一个保存计数器，整个文件头和账户一起由 XChaCha20-Poly1305 认证，每次保存都用新的 nonce。有一个测试会把保险库的每个字节逐一翻转，并检查每个被改动的文件都会被拒绝。",
        "打开保险库的密钥放在一个槽位里。默认情况下，这个槽位由 Windows（DPAPI）为当前登录的用户保护，并绑定到保险库 ID，所以你登录之后保险库就会打开，不需要密码，而这个文件的副本拿到别的账户或别的电脑上毫无用处。备份会得到一把新密钥和它自己的密码，密码用 Argon2id 拉伸，至少 64 MiB 内存、三轮迭代，所以它在任何电脑上的 Psyche 里都能打开。",
        "每一项机密数据都放在固定内存里，没有东西读取时用 CryptProtectMemory 加密，释放时清零。Psyche 闲置 15 分钟后会丢弃手里的密钥，Windows 锁屏或进入睡眠时也一样。保存时会在保险库旁边写一个临时文件，刷到磁盘上再换进去；保存计数器会拒绝覆盖一个在打开之后被改动过的保险库。",
      ],
      figure: 1,
    },
    {
      heading: "把验证码从手机搬过来",
      body: [
        "Google Authenticator 会把账户导出成一组二维码。Psyche 通过网络摄像头读取它们。自动曝光按整个房间测光，凑近的手机屏幕就会过曝，所以 Psyche 会依次试几档更短的曝光，每一帧先交给 zxing-cpp，然后再交给 ZXing.Net，并做镜像和反色重试。这些二维码可以按任意顺序展示，看到两次的码会被忽略，每个账户在它的码被读出的那一刻就会保存。导出数据用 protobuf 打包账户，Psyche 不用 protobuf 库，自己手写解码。",
        "Aegis、2FAS、Proton Authenticator 和 Ente Auth 的加密导出，用各自的密钥派生方式打开（scrypt、PBKDF2 或 Argon2id），之后是 AES-GCM 或 libsodium 的 secretstream。Bitwarden 的明文 JSON 和 CSV 导出也能用。新网站的设置二维码可以直接从屏幕上读取，也可以从粘贴的图片、otpauth:// 链接或手动输入的密钥添加。",
        "核心库有 555 个 xUnit 测试用例，Windows 层有 112 个。摄像头这条路径用模拟的网络摄像头画面来测试，域名解析器则用 Public Suffix List 官方的测试文件来测试。每次推送到 main，Windows 上的 CI 都会检查代码格式、运行两套测试，并发布 AOT 构建。",
      ],
    },
  ],
  captions: [
    "github.com 上的选择框，用的是演示账户：两个 GitHub 账户都标记为当前网站并排在最前面，每个验证码旁边都有它的倒计时圆环。",
    "同样这些演示账户下的主窗口，每个验证码都带着倒计时圆环和一个复制按钮。",
  ],
  tags: ["C#", ".NET 10", "WinUI 3", "Windows"],
  stats: [
    { value: "1", label: "个快捷键" },
    { value: "6", label: "个可导入的应用" },
    { value: "151", label: "个已知服务" },
    { value: "667", label: "个测试" },
  ],
};

export const psyche: Record<Language, LocalizedContent> = { en, de, fr, zh };
