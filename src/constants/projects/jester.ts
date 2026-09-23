import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

const SAFE_WRITE = `string full = Path.GetFullPath(path);
string directory = Path.GetDirectoryName(full) ?? Directory.GetCurrentDirectory();
string temp = Path.Combine(directory,
    "." + Path.GetFileName(full) + "." + Guid.NewGuid().ToString("N") + ".tmp");

try
{
    File.WriteAllText(temp, text, encoding);
    if (File.Exists(full))
        File.Replace(temp, full, destinationBackupFileName: null);
    else
        File.Move(temp, full);
}
finally
{
    if (File.Exists(temp))
    {
        try { File.Delete(temp); }
        catch { /* best-effort cleanup of the temp file */ }
    }
}`;

export const jester: Record<Language, LocalizedContent> = {
  en: {
    tagline: "Notepad, but it grew up. Tabs, line numbers, find-in-files, PDF export.",
    description:
      "Jester is a native Windows notepad with tabbed editing, a line-number gutter, find-in-files and PDF export, all in one portable Jester.exe with no installer.",
    overview:
      "I wanted a notepad that opens before I let go of the mouse, but still does the few things Notepad refuses to. So I built one in C# and WPF on .NET 9: tabs, a line-number gutter, find across a whole folder, and clean A4 PDF export through QuestPDF. It also has the small things you only miss once they are gone, like session restore, Open Recent, and \"Open with Jester\" in the Explorer context menu. It ships as a single portable executable with the runtime baked in, so there is no installer and no \"please install .NET\" dialog.",
    roleSummary: "Just me: the WPF UI and the whole .NET 9 build.",
    sections: [
      {
        heading: "Saving never truncates the file you already have",
        body: [
          "The obvious way to save is to open the file for writing and put the text in. Opening for writing empties the file first, so a crash or a full disk halfway through leaves you with less than you had before you pressed Ctrl+S.",
          "Jester writes the text to a hidden temporary file in the same folder and then swaps it in over the original with File.Replace. If anything fails before the swap, the old file is untouched and the temporary one is cleaned up.",
          "Leaving gets the same care. Closing a tab, the window or even signing out of Windows with unsaved changes asks first, and Cancel holds the sign-out back. An unexpected error on the UI thread is written to a crash log in AppData and shown in a message, and the other tabs stay open.",
        ],
        code: {
          language: "csharp",
          text: SAFE_WRITE,
          caption:
            "The body of SafeWrite in MainWindow.Files.cs. The text only ever lands in a temporary file beside the real one, and File.Replace swaps it in, so a failed write leaves the old file whole.",
        },
      },
      {
        heading: "A file goes back the way it came",
        body: [
          "On open, Jester reads the byte-order mark if there is one and falls back to UTF-8 if there is not. The encoding it found stays with that tab and is used again on save, so a UTF-16 file does not quietly come back as UTF-8. Converting is something you choose in the Format menu.",
          "Line endings are read from the text and shown in the status bar. The line counter used to count only newlines, so an old Mac file with bare carriage returns showed up as one line while the status bar called it CR in the same breath. A lone carriage return now counts as a line break too.",
          "Jester's own Delete command removes a CRLF pair or a surrogate pair as one character, because removing half of either leaves a stray line break or half a character behind.",
        ],
      },
      {
        heading: "One exe, even with a PDF library inside",
        body: [
          "Jester ships as one self-contained Jester.exe with the .NET 9 runtime compressed inside it, so it runs on Windows 10 and 11 without an installer or a separate .NET install. The build is unsigned, so the first launch can show a SmartScreen prompt.",
          "QuestPDF came with a catch: it copies its bundled Lato fonts next to the executable as loose files. Jester never uses them, since a PDF is set in Consolas or the font chosen in the editor, so a step in the project file strips them from the published build and the release stays a single file.",
          "The export itself is A4 with 2 cm margins, the file name as a header over a gold rule and page numbers in the footer. Long lines wrap to the page.",
        ],
      },
      {
        heading: "Search that can be tested without a window",
        body: [
          "The find and replace arithmetic lives in TextSearch.cs, which knows nothing about the editor. The 57 xUnit tests cover that file, settings persistence and the command table, and CI runs them on every push to main. The WPF views I check by running the app.",
          "Find in Files has to survive whatever folder it is pointed at. It skips hidden and system files, ignores folders it may not read, and builds the file list before the search starts, so a protected subfolder cannot throw halfway through. Files over 4 MB and files that fail to read are passed over, and the results stop at 5000.",
        ],
      },
    ],
    captions: [
      "Jester in its purple and gold theme with an unsaved Untitled note, the status bar showing 180 characters, 9 lines, Windows (CRLF) line endings and UTF-8.",
    ],
    tags: ["C#", "WPF", ".NET 9", "Windows"],
    stats: [
      { value: "1", label: "portable exe" },
      { value: "0", label: "installers" },
      { value: "57", label: "tests" },
      { value: "A4", label: "PDF export" },
    ],
  },
  de: {
    tagline: "Notepad, aber erwachsen. Tabs, Zeilennummern, Suche im Ordner, PDF-Export.",
    description:
      "Jester ist ein nativer Windows-Notizblock mit Tabs, Zeilennummern-Spalte, Suche über ganze Ordner und PDF-Export, alles in einer portablen Jester.exe ohne Installer.",
    overview:
      "Ich wollte einen Notizblock, der aufgeht, bevor ich die Maus loslasse, der aber die paar Dinge kann, die Notepad verweigert. Also habe ich einen in C# und WPF auf .NET 9 gebaut: Tabs, eine Zeilennummern-Spalte, Suche über einen ganzen Ordner und saubere A4-PDF-Ausgabe über QuestPDF. Dazu die kleinen Dinge, die man erst vermisst, wenn sie fehlen: Sitzungswiederherstellung, „Zuletzt verwendet“ und „Mit Jester öffnen“ im Explorer-Kontextmenü. Ausgeliefert wird eine einzige portable Datei mit eingebackener Runtime, also kein Installer und kein „bitte .NET installieren“-Dialog.",
    roleSummary: "Nur ich: die WPF-Oberfläche und der ganze .NET-9-Build.",
    sections: [
      {
        heading: "Speichern kürzt nie die Datei, die schon da ist",
        body: [
          "Der naheliegende Weg zum Speichern: Datei zum Schreiben öffnen, Text hinein. Nur leert das Öffnen zum Schreiben die Datei zuerst, und ein Absturz oder eine volle Festplatte mittendrin hinterlässt weniger, als vor Ctrl+S da war.",
          "Jester schreibt den Text in eine versteckte temporäre Datei im selben Ordner und tauscht sie dann mit File.Replace gegen das Original aus. Scheitert vor dem Tausch etwas, bleibt die alte Datei unberührt, und die temporäre wird aufgeräumt.",
          "Beim Verlassen gilt dieselbe Sorgfalt. Wer einen Tab, das Fenster oder sogar die Windows-Sitzung mit ungespeicherten Änderungen schliesst, wird zuerst gefragt, und Abbrechen hält die Abmeldung auf. Ein unerwarteter Fehler im UI-Thread landet in einem Absturzprotokoll unter AppData und in einer Meldung, und die anderen Tabs bleiben offen.",
        ],
        code: {
          language: "csharp",
          text: SAFE_WRITE,
          caption:
            "Der Rumpf von SafeWrite in MainWindow.Files.cs. Der Text landet immer zuerst in einer temporären Datei neben der echten, File.Replace tauscht sie ein, und ein fehlgeschlagener Schreibvorgang lässt die alte Datei ganz.",
        },
      },
      {
        heading: "Eine Datei geht so zurück, wie sie gekommen ist",
        body: [
          "Beim Öffnen liest Jester die Byte-Order-Mark, falls es eine gibt, und nimmt sonst UTF-8 an. Die gefundene Kodierung bleibt beim Tab und wird beim Speichern wieder verwendet, damit eine UTF-16-Datei nicht still als UTF-8 zurückkommt. Umwandeln ist etwas, das man im Format-Menü selbst wählt.",
          "Zeilenenden werden aus dem Text gelesen und in der Statusleiste angezeigt. Der Zeilenzähler hat früher nur Zeilenumbrüche mit Newline gezählt, also stand eine alte Mac-Datei mit reinen Wagenrückläufen als eine einzige Zeile da, während die Statusleiste im selben Atemzug CR meldete. Ein einzelner Wagenrücklauf zählt jetzt auch als Zeilenumbruch.",
          "Jesters eigener Löschen-Befehl entfernt ein CRLF-Paar oder ein Surrogatpaar als ein Zeichen, weil die Hälfte davon einen verirrten Zeilenumbruch oder ein halbes Zeichen zurücklässt.",
        ],
      },
      {
        heading: "Eine Exe, auch mit PDF-Bibliothek drin",
        body: [
          "Jester kommt als eine eigenständige Jester.exe, die .NET-9-Runtime komprimiert darin, und läuft so auf Windows 10 und 11 ohne Installer und ohne separate .NET-Installation. Der Build ist nicht signiert, beim ersten Start kann also SmartScreen nachfragen.",
          "QuestPDF brachte einen Haken mit: Es kopiert seine mitgelieferten Lato-Schriften als lose Dateien neben die Exe. Jester braucht sie nie, denn ein PDF wird in Consolas oder in der im Editor gewählten Schrift gesetzt. Ein Schritt in der Projektdatei nimmt sie deshalb aus dem veröffentlichten Build, und das Release bleibt eine einzige Datei.",
          "Der Export selbst ist A4 mit 2 cm Rand, dem Dateinamen als Kopfzeile über einer goldenen Linie und Seitenzahlen in der Fusszeile. Lange Zeilen brechen auf der Seite um.",
        ],
      },
      {
        heading: "Suche, die sich ohne Fenster testen lässt",
        body: [
          "Die Rechnerei hinter Suchen und Ersetzen steckt in TextSearch.cs, das nichts vom Editor weiss. Die 57 xUnit-Tests decken diese Datei, das Speichern der Einstellungen und die Befehlstabelle ab, und die CI lässt sie bei jedem Push auf main laufen. Die WPF-Ansichten prüfe ich, indem ich die App starte.",
          "Die Suche im Ordner muss jeden Ordner überstehen, auf den man sie ansetzt. Sie überspringt versteckte und Systemdateien, ignoriert Ordner ohne Leserecht und stellt die Dateiliste vor der Suche zusammen, damit ein geschützter Unterordner nicht mittendrin einen Fehler wirft. Dateien über 4 MB und Dateien, die sich nicht lesen lassen, fallen weg, und bei 5000 Treffern ist Schluss.",
        ],
      },
    ],
    captions: [
      "Jester im Violett-Gold-Theme mit einer ungespeicherten Notiz „Untitled“, die Statusleiste zeigt 180 Zeichen, 9 Zeilen, Windows-Zeilenenden (CRLF) und UTF-8.",
    ],
    tags: ["C#", "WPF", ".NET 9", "Windows"],
    stats: [
      { value: "1", label: "portable Exe" },
      { value: "0", label: "Installer" },
      { value: "57", label: "Tests" },
      { value: "A4", label: "PDF-Export" },
    ],
  },
  fr: {
    tagline: "Notepad, mais il a grandi. Onglets, numéros de ligne, recherche dans les fichiers, export PDF.",
    description:
      "Jester est un bloc-notes Windows natif avec édition par onglets, une gouttière de numéros de ligne, la recherche dans un dossier et l'export PDF, le tout dans un seul Jester.exe portable, sans installateur.",
    overview:
      "Je voulais un bloc-notes qui s'ouvre avant que je lâche la souris, mais qui fasse les quelques choses que Notepad refuse. J'en ai donc construit un en C# et WPF sur .NET 9 : onglets, gouttière de numéros de ligne, recherche dans un dossier entier, et export A4 propre via QuestPDF. Avec aussi les petites choses qui ne manquent qu'une fois disparues : la restauration de session, « Fichiers récents », et « Ouvrir avec Jester » dans le menu contextuel de l'Explorateur. Il se livre en un exécutable portable unique, runtime inclus, donc pas d'installateur et pas de boîte de dialogue « veuillez installer .NET ».",
    roleSummary: "Moi seul : l'interface WPF et tout le build .NET 9.",
    sections: [
      {
        heading: "Enregistrer ne vide jamais le fichier existant",
        body: [
          "La façon évidente d'enregistrer, c'est d'ouvrir le fichier en écriture et d'y mettre le texte. Or l'ouverture en écriture vide d'abord le fichier, et un plantage ou un disque plein en cours de route vous laisse avec moins qu'avant le Ctrl+S.",
          "Jester écrit le texte dans un fichier temporaire caché du même dossier, puis le met à la place de l'original avec File.Replace. Si quelque chose échoue avant l'échange, l'ancien fichier reste intact et le temporaire est nettoyé.",
          "Partir demande le même soin. Fermer un onglet, la fenêtre ou même la session Windows avec des modifications non enregistrées pose d'abord la question, et Annuler retient la déconnexion. Une erreur inattendue sur le thread d'interface est écrite dans un journal de plantage sous AppData et affichée dans un message, et les autres onglets restent ouverts.",
        ],
        code: {
          language: "csharp",
          text: SAFE_WRITE,
          caption:
            "Le corps de SafeWrite dans MainWindow.Files.cs. Le texte n'arrive jamais que dans un fichier temporaire à côté du vrai, File.Replace fait l'échange, et une écriture ratée laisse l'ancien fichier entier.",
        },
      },
      {
        heading: "Un fichier repart comme il est arrivé",
        body: [
          "À l'ouverture, Jester lit l'indicateur d'ordre des octets (BOM) s'il y en a un, et suppose l'UTF-8 sinon. L'encodage trouvé reste attaché à l'onglet et sert de nouveau à l'enregistrement, pour qu'un fichier UTF-16 ne revienne pas en douce en UTF-8. Convertir se choisit dans le menu Format.",
          "Les fins de ligne sont lues dans le texte et affichées dans la barre d'état. Le compteur de lignes ne comptait autrefois que les sauts de ligne, si bien qu'un vieux fichier Mac aux retours chariot seuls apparaissait comme une seule ligne, alors que la barre d'état annonçait CR dans le même souffle. Un retour chariot isolé compte désormais aussi comme un saut de ligne.",
          "La commande Supprimer de Jester retire une paire CRLF ou une paire de substitution comme un seul caractère, parce qu'en retirer la moitié laisse un saut de ligne égaré ou un demi-caractère.",
        ],
      },
      {
        heading: "Un seul exe, même avec une bibliothèque PDF dedans",
        body: [
          "Jester se livre en un Jester.exe autonome, runtime .NET 9 compressé à l'intérieur, et tourne donc sur Windows 10 et 11 sans installateur ni installation .NET séparée. Le build n'est pas signé, le premier lancement peut donc afficher une alerte SmartScreen.",
          "QuestPDF est venu avec un piège : il copie ses polices Lato fournies à côté de l'exécutable, en fichiers séparés. Jester ne s'en sert jamais, puisqu'un PDF est composé en Consolas ou dans la police choisie dans l'éditeur ; une étape du fichier de projet les retire donc du build publié, et la version publiée reste un seul fichier.",
          "L'export lui-même est en A4 avec des marges de 2 cm, le nom du fichier en en-tête au-dessus d'un filet doré et les numéros de page en pied de page. Les longues lignes passent à la ligne sur la page.",
        ],
      },
      {
        heading: "Une recherche qui se teste sans fenêtre",
        body: [
          "Le calcul derrière rechercher-remplacer vit dans TextSearch.cs, qui ne sait rien de l'éditeur. Les 57 tests xUnit couvrent ce fichier, l'enregistrement des réglages et la table des commandes, et la CI les lance à chaque push sur main. Les vues WPF, je les vérifie en lançant l'application.",
          "La recherche dans les fichiers doit survivre à n'importe quel dossier. Elle saute les fichiers cachés et système, ignore les dossiers qu'elle n'a pas le droit de lire, et dresse la liste des fichiers avant de chercher, pour qu'un sous-dossier protégé ne lève pas d'erreur à mi-chemin. Les fichiers de plus de 4 Mo et ceux qui ne se lisent pas sont laissés de côté, et les résultats s'arrêtent à 5000.",
        ],
      },
    ],
    captions: [
      "Jester dans son thème violet et or avec une note « Untitled » non enregistrée, la barre d'état affichant 180 caractères, 9 lignes, des fins de ligne Windows (CRLF) et l'UTF-8.",
    ],
    tags: ["C#", "WPF", ".NET 9", "Windows"],
    stats: [
      { value: "1", label: "exe portable" },
      { value: "0", label: "installateurs" },
      { value: "57", label: "tests" },
      { value: "A4", label: "export PDF" },
    ],
  },
  zh: {
    tagline: "记事本，但长大了。标签页、行号、跨文件查找、PDF 导出。",
    description:
      "Jester 是一个原生 Windows 记事本，带标签页编辑、行号栏、跨文件夹查找和 PDF 导出，全部装在一个便携的 Jester.exe 里，不需要安装。",
    overview:
      "我想要一个我松开鼠标之前就已经打开的记事本，同时还能做记事本拒绝做的那几件事。于是我用 C# 和 WPF、跑在 .NET 9 上做了一个：标签页、行号栏、跨整个文件夹查找，以及通过 QuestPDF 输出干净的 A4 PDF。还有那些丢了才会想起来的小事：会话恢复、最近打开，以及资源管理器右键菜单里的「用 Jester 打开」。它是一个便携可执行文件，运行时已经打包在内，所以没有安装程序，也没有那句「请先安装 .NET」。",
    roleSummary: "只有我：WPF 界面和整套 .NET 9 构建。",
    sections: [
      {
        heading: "保存永远不会清空已有的文件",
        body: [
          "最直接的保存方式，是以写入模式打开文件再把文字放进去。可是以写入模式打开会先把文件清空，写到一半时程序崩溃或磁盘写满，你手里的东西就比按 Ctrl+S 之前还少。",
          "Jester 先把文字写进同一文件夹里的一个隐藏临时文件，再用 File.Replace 把它换到原文件的位置。交换之前任何一步出错，旧文件都原封不动，临时文件也会被清理掉。",
          "离开时也一样小心。带着未保存的修改关闭标签页、关闭窗口，甚至注销 Windows，都会先问一声；选择取消，注销就会被拦下。界面线程上的意外错误会写进 AppData 下的崩溃日志并弹出提示，其他标签页照样开着。",
        ],
        code: {
          language: "csharp",
          text: SAFE_WRITE,
          caption:
            "MainWindow.Files.cs 中 SafeWrite 的函数体。文字只会先落进真实文件旁边的临时文件，再由 File.Replace 换进去，所以写入失败时旧文件完好无损。",
        },
      },
      {
        heading: "文件怎么来，就怎么回去",
        body: [
          "打开文件时，Jester 会读取字节顺序标记（BOM），没有的话就按 UTF-8 处理。识别出的编码跟着这个标签页走，保存时照样使用，所以 UTF-16 文件不会悄悄变成 UTF-8 回来。要转换编码，就在「格式」菜单里自己选。",
          "行尾格式从文本本身读出，显示在状态栏里。行数统计以前只数换行符，于是一个只用回车符的老 Mac 文件被算成一行，而状态栏同时却标着 CR。现在单独的回车符也算作换行。",
          "Jester 自己的删除命令会把一对 CRLF 或一个代理对当作一个字符删掉，因为只删一半，就会留下一个多余的换行或半个字符。",
        ],
      },
      {
        heading: "一个 exe，哪怕里面装着 PDF 库",
        body: [
          "Jester 以一个自包含的 Jester.exe 发布，.NET 9 运行时压缩在里面，所以在 Windows 10 和 11 上无需安装程序，也不用另装 .NET。这个构建没有签名，第一次启动时可能会出现 SmartScreen 提示。",
          "QuestPDF 带来一个麻烦：它会把自带的 Lato 字体作为零散文件复制到可执行文件旁边。Jester 从来用不到它们，因为 PDF 用的是 Consolas 或编辑器里选定的字体，所以项目文件里有一步会把它们从发布构建中剔除，发布版依旧只是一个文件。",
          "导出本身是 A4，页边距 2 厘米，页眉是文件名，下面一条金色细线，页脚是页码。过长的行会在页面内自动换行。",
        ],
      },
      {
        heading: "不开窗口也能测试的查找",
        body: [
          "查找与替换的计算都在 TextSearch.cs 里，它对编辑器一无所知。57 个 xUnit 测试覆盖这个文件、设置的保存以及命令表，每次推送到 main，CI 都会运行它们。WPF 界面则由我亲自运行程序来检查。",
          "跨文件查找必须扛得住它被指向的任何文件夹。它跳过隐藏文件和系统文件，忽略没有读取权限的文件夹，并在开始搜索前先列出全部文件，这样受保护的子文件夹就不会在半路抛出错误。超过 4 MB 的文件和读不出来的文件会被跳过，结果最多 5000 条。",
        ],
      },
    ],
    captions: [
      "紫金配色的 Jester，打开着一篇未保存的 Untitled 笔记，状态栏显示 180 个字符、9 行、Windows (CRLF) 行尾和 UTF-8。",
    ],
    tags: ["C#", "WPF", ".NET 9", "Windows"],
    stats: [
      { value: "1", label: "便携 exe" },
      { value: "0", label: "安装程序" },
      { value: "57", label: "测试" },
      { value: "A4", label: "PDF 导出" },
    ],
  },
};
