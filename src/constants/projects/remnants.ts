import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

// Verbatim from Remnants/product.json (lines 36 to 44), indented with tabs as in the file.
const PRODUCT_JSON = `\t"enableTelemetry": false,
\t"extensionsGallery": {
\t\t"serviceUrl": "https://open-vsx.org/vscode/gallery",
\t\t"itemUrl": "https://open-vsx.org/vscode/item",
\t\t"resourceUrlTemplate": "https://open-vsx.org/vscode/unpkg/{publisher}/{name}/{version}/{path}",
\t\t"controlUrl": "",
\t\t"nlsBaseUrl": "",
\t\t"publisherUrl": ""
\t},`;

export const remnants: Record<Language, LocalizedContent> = {
  en: {
    tagline: "VS Code, minus the parts that talk back.",
    description:
      "Remnants is a code editor for Windows, macOS and Linux: my personal build of Code - OSS with Copilot, chat, agents, telemetry and sign-in cut out, and the editor, terminal, Git and debugger left fully intact.",
    overview:
      "I love VS Code. I do not love the chat panel, the agent window, the account prompt, or the telemetry quietly sending usage data back upstream. So I took Code - OSS, the open-source core, and removed every AI surface, telemetry hook and sign-in nag, without touching what actually matters: fast editing, IntelliSense, the integrated terminal, source control and the JavaScript/Node debugger. Extensions resolve through Open VSX. It ships for Windows, macOS and Linux. The whole change is roughly 759,000 lines removed and 2,800 added on top of upstream 1.125.0, and CHANGES.md lists all of it, because almost all the code here is Microsoft's and that should be easy to check.",
    roleSummary: "Just me: the cuts, the build, the installer, and the CHANGES file.",
    sections: [
      {
        heading: "Taking out 2,761 files without breaking the editor",
        body: [
          "The largest cut was the AI itself: chat, agent sessions, Copilot, MCP and the language-model APIs, 2,761 files and about 712,000 lines. The bundled AI extension went with it.",
          "That was not the end of it. AI code is registered all over the workbench, so later passes removed 143 files of leftover registrations, contributions and settings, the agent welcome and Copilot setup flows, and smaller traces in the Git, terminal, editor and search code. The editor, IntelliSense, the terminal, source control and the JavaScript/Node debugger stayed as they were.",
          "One leftover broke the install itself. Upstream's postinstall step created symlinks for an AI agent harness, and once the harness was gone, npm install failed. Fixing that was part of the removal.",
        ],
      },
      {
        heading: "Telemetry and the marketplace live in product.json",
        body: [
          "Telemetry is switched off at the product level, and the sign-in entries in the title bar and the status bar are gone, so nothing asks you to set up an account.",
          "The Microsoft Marketplace is not covered by the Code - OSS licence, so the extension gallery points at Open VSX instead. Both decisions come down to a few lines in one file.",
        ],
        code: {
          language: "json",
          text: PRODUCT_JSON,
          caption:
            "From product.json. The first line turns telemetry off for the whole product, and the gallery block sends every extension lookup to Open VSX instead of the Microsoft Marketplace.",
        },
      },
      {
        heading: "Git cannot show the deletions, so CHANGES.md does",
        body: [
          "I imported the upstream tree as one squashed snapshot instead of forking it on GitHub. That was a mistake in how I set the repository up, and a later history reset made it worse: the first commit already has the removals applied, so git log shows none of them.",
          "CHANGES.md makes up for it. It names the exact upstream commit, 93cfdd48 from release 1.125.0, lists every removal with its file and line counts, and includes a short script that compares this package.json with upstream's. It reports six AI SDKs taken out and nothing put back. For everything else, you can clone upstream at that commit and diff the two trees.",
          "The upstream tree is marked linguist-vendored, so Microsoft's code stays out of the repository's language statistics.",
        ],
      },
      {
        heading: "Every platform ships from one release",
        body: [
          "The release workflow builds Remnants for Windows, macOS and Linux, on x64 and arm64, and publishes every file in one GitHub release, with a checksum file and a signed provenance attestation per asset. Each asset is installed and run by the workflow that builds it, including the arm64 Windows installer on real ARM hardware and the deb and rpm packages inside Debian and Fedora containers.",
          "Getting there meant fixing upstream build scripts that were already broken and only failed once a newer dependency exposed them, such as gulp-rename callbacks that implicitly returned the path they had just assigned.",
          "Remnants is not code-signed on any platform, so each one asks you to confirm the first launch once. It does not update itself and never phones anywhere to check. New versions appear on the releases page.",
        ],
      },
    ],
    captions: ["The Remnants icon, a faceted blue shard, on a pale lilac background."],
    tags: ["TypeScript", "Electron", "VS Code", "Privacy"],
    stats: [
      { value: "759k", label: "lines removed" },
      { value: "0", label: "telemetry" },
      { value: "0", label: "sign-in" },
      { value: "1", label: "maintainer" },
    ],
  },
  de: {
    tagline: "VS Code, ohne die Teile, die zurückreden.",
    description:
      "Remnants ist ein Code-Editor für Windows, macOS und Linux: mein persönlicher Build von Code - OSS, aus dem Copilot, Chat, Agenten, Telemetrie und Sign-in herausgeschnitten sind, während Editor, Terminal, Git und Debugger vollständig erhalten bleiben.",
    overview:
      "Ich liebe VS Code. Ich liebe nicht das Chat-Panel, das Agenten-Fenster, die Kontoaufforderung oder die Telemetrie, die still Nutzungsdaten nach oben schickt. Also nahm ich Code - OSS, den Open-Source-Kern, und entfernte jede KI-Oberfläche, jeden Telemetrie-Hook und jedes Sign-in-Genöle, ohne das anzufassen, worauf es ankommt: schnelles Editieren, IntelliSense, das integrierte Terminal, die Versionskontrolle und den JavaScript/Node-Debugger. Erweiterungen kommen über Open VSX. Ausgeliefert wird für Windows, macOS und Linux. Die ganze Änderung sind rund 759'000 entfernte und 2'800 hinzugefügte Zeilen auf Upstream 1.125.0, und CHANGES.md listet alles davon auf, weil fast der ganze Code hier von Microsoft ist und das leicht nachprüfbar sein soll.",
    roleSummary: "Nur ich: die Schnitte, der Build, der Installer und die CHANGES-Datei.",
    sections: [
      {
        heading: "2'761 Dateien entfernen, ohne den Editor zu beschädigen",
        body: [
          "Der grösste Schnitt war die KI selbst: Chat, Agenten-Sessions, Copilot, MCP und die Language-Model-APIs, 2'761 Dateien und rund 712'000 Zeilen. Die mitgelieferte KI-Erweiterung ging gleich mit.",
          "Damit war es nicht getan. KI-Code ist überall in der Workbench registriert, also entfernten spätere Durchgänge 143 Dateien mit übrig gebliebenen Registrierungen, Contributions und Einstellungen, die Agenten-Willkommensseite und die Copilot-Einrichtung sowie kleinere Reste im Code für Git, Terminal, Editor und Suche. Editor, IntelliSense, Terminal, Versionskontrolle und der JavaScript/Node-Debugger blieben, wie sie waren.",
          "Ein Überbleibsel legte sogar die Installation lahm. Der postinstall-Schritt von Upstream legte Symlinks für ein KI-Agenten-Harness an, und sobald das Harness weg war, schlug npm install fehl. Das zu beheben gehörte zur Entfernung dazu.",
        ],
      },
      {
        heading: "Telemetrie und Marketplace stehen in product.json",
        body: [
          "Die Telemetrie ist auf Produktebene abgeschaltet, und die Sign-in-Einträge in Titel- und Statusleiste sind weg, also fordert einen nichts auf, ein Konto einzurichten.",
          "Die Lizenz von Code - OSS deckt den Microsoft Marketplace nicht ab, deshalb zeigt die Extension-Gallery auf Open VSX. Beide Entscheidungen sind ein paar Zeilen in einer einzigen Datei.",
        ],
        code: {
          language: "json",
          text: PRODUCT_JSON,
          caption:
            "Aus product.json. Die erste Zeile schaltet die Telemetrie für das ganze Produkt ab, und der Gallery-Block schickt jede Erweiterungssuche an Open VSX statt an den Microsoft Marketplace.",
        },
      },
      {
        heading: "Git zeigt die Löschungen nicht, also tut es CHANGES.md",
        body: [
          "Ich habe den Upstream-Baum als einen einzigen gequetschten Snapshot importiert, statt ihn auf GitHub zu forken. Das war ein Fehler beim Aufsetzen des Repos, und ein späterer Reset der Historie hat es verschlimmert: Der erste Commit enthält die Entfernungen bereits, also zeigt git log keine davon.",
          "CHANGES.md gleicht das aus. Die Datei nennt den genauen Upstream-Commit, 93cfdd48 aus Release 1.125.0, listet jede Entfernung mit Datei- und Zeilenzahlen auf und enthält ein kurzes Skript, das die package.json hier mit der von Upstream vergleicht. Es meldet sechs entfernte KI-SDKs und nichts, was dazugekommen wäre. Für den Rest kann man Upstream bei diesem Commit klonen und die beiden Bäume vergleichen.",
          "Der Upstream-Baum ist als linguist-vendored markiert, damit Microsofts Code nicht in die Sprachstatistik des Repos einfliesst.",
        ],
      },
      {
        heading: "Jede Plattform aus einem einzigen Release",
        body: [
          "Der Release-Workflow baut Remnants für Windows, macOS und Linux, jeweils für x64 und arm64, und veröffentlicht alle Dateien in einem GitHub-Release, mit einer Prüfsummendatei und einer signierten Provenance-Attestierung pro Asset. Jedes Asset wird vom Workflow, der es baut, auch installiert und gestartet, der arm64-Installer für Windows auf echter ARM-Hardware und die deb- und rpm-Pakete in Debian- und Fedora-Containern.",
          "Dafür musste ich Build-Skripte von Upstream reparieren, die schon kaputt waren und erst mit einer neueren Abhängigkeit aufflogen, etwa gulp-rename-Callbacks, die den eben zugewiesenen Pfad implizit zurückgaben.",
          "Remnants ist auf keiner Plattform code-signiert, deshalb muss man den ersten Start überall einmal bestätigen. Es aktualisiert sich nicht selbst und meldet sich nirgends, um nachzufragen. Neue Versionen erscheinen auf der Release-Seite.",
        ],
      },
    ],
    captions: ["Das Remnants-Icon, ein facettierter blauer Splitter, auf blassem Flieder."],
    tags: ["TypeScript", "Electron", "VS Code", "Privacy"],
    stats: [
      { value: "759k", label: "entfernte Zeilen" },
      { value: "0", label: "Telemetrie" },
      { value: "0", label: "Sign-in" },
      { value: "1", label: "Maintainer" },
    ],
  },
  fr: {
    tagline: "VS Code, moins les parties qui répondent.",
    description:
      "Remnants est un éditeur de code pour Windows, macOS et Linux : mon build personnel de Code - OSS, avec Copilot, le chat, les agents, la télémétrie et la connexion retirés, et l'éditeur, le terminal, Git et le débogueur laissés entièrement intacts.",
    overview:
      "J'aime VS Code. Je n'aime pas le panneau de chat, la fenêtre d'agent, l'invite de compte, ni la télémétrie qui renvoie discrètement des données d'usage. J'ai donc pris Code - OSS, le cœur open source, et retiré chaque surface d'IA, chaque hook de télémétrie et chaque relance de connexion, sans toucher à ce qui compte vraiment : l'édition rapide, IntelliSense, le terminal intégré, le contrôle de version et le débogueur JavaScript/Node. Les extensions passent par Open VSX. Il est livré pour Windows, macOS et Linux. Le changement complet fait environ 759 000 lignes retirées et 2 800 ajoutées au-dessus de la version amont 1.125.0, et CHANGES.md les liste toutes, parce que presque tout le code ici est celui de Microsoft et que ça doit être facile à vérifier.",
    roleSummary: "Moi seul : les coupes, le build, l'installateur et le fichier CHANGES.",
    sections: [
      {
        heading: "Retirer 2 761 fichiers sans casser l'éditeur",
        body: [
          "La plus grosse coupe, c'était l'IA elle-même : le chat, les sessions d'agent, Copilot, MCP et les API de modèles de langage, 2 761 fichiers et environ 712 000 lignes. L'extension d'IA fournie est partie avec.",
          "Ça ne s'arrêtait pas là. Le code d'IA est enregistré partout dans le workbench, alors des passes suivantes ont retiré 143 fichiers d'enregistrements, de contributions et de réglages restants, l'accueil des agents et la configuration de Copilot, et de plus petites traces dans le code de Git, du terminal, de l'éditeur et de la recherche. L'éditeur, IntelliSense, le terminal, le contrôle de version et le débogueur JavaScript/Node sont restés tels quels.",
          "Un de ces restes cassait même l'installation. L'étape postinstall de l'amont créait des liens symboliques vers un harnais d'agent IA, et une fois le harnais supprimé, npm install échouait. Le corriger faisait partie du retrait.",
        ],
      },
      {
        heading: "La télémétrie et le marketplace tiennent dans product.json",
        body: [
          "La télémétrie est coupée au niveau du produit, et les entrées de connexion dans la barre de titre et la barre d'état ont disparu : rien ne vous demande de créer un compte.",
          "La licence de Code - OSS ne couvre pas le Marketplace de Microsoft, donc la galerie d'extensions pointe vers Open VSX. Ces deux décisions tiennent en quelques lignes d'un seul fichier.",
        ],
        code: {
          language: "json",
          text: PRODUCT_JSON,
          caption:
            "Extrait de product.json. La première ligne coupe la télémétrie pour tout le produit, et le bloc de galerie envoie chaque recherche d'extension vers Open VSX au lieu du Marketplace de Microsoft.",
        },
      },
      {
        heading: "Git ne montre pas les suppressions, alors CHANGES.md le fait",
        body: [
          "J'ai importé l'arbre amont en un seul instantané écrasé au lieu de le forker sur GitHub. C'était une erreur dans la mise en place du dépôt, et une réinitialisation ultérieure de l'historique l'a aggravée : le premier commit contient déjà les suppressions, donc git log n'en montre aucune.",
          "CHANGES.md compense. Le fichier nomme le commit amont exact, 93cfdd48 de la version 1.125.0, liste chaque suppression avec ses nombres de fichiers et de lignes, et contient un court script qui compare le package.json d'ici avec celui de l'amont. Il indique six SDK d'IA retirés et rien de remis. Pour le reste, on peut cloner l'amont à ce commit et comparer les deux arbres.",
          "L'arbre amont est marqué linguist-vendored, pour que le code de Microsoft reste hors des statistiques de langage du dépôt.",
        ],
      },
      {
        heading: "Toutes les plateformes sortent d'une seule release",
        body: [
          "Le workflow de release construit Remnants pour Windows, macOS et Linux, en x64 et en arm64, et publie tous les fichiers dans une seule release GitHub, avec un fichier de sommes de contrôle et une attestation de provenance signée par fichier. Chaque fichier est installé et lancé par le workflow qui le construit, y compris l'installateur Windows arm64 sur du vrai matériel ARM et les paquets deb et rpm dans des conteneurs Debian et Fedora.",
          "Pour en arriver là, il a fallu corriger des scripts de build amont déjà cassés, qui n'échouaient qu'une fois exposés par une dépendance plus récente, comme des callbacks gulp-rename qui renvoyaient implicitement le chemin qu'ils venaient d'assigner.",
          "Remnants n'est signé sur aucune plateforme, donc chacune demande de confirmer le premier lancement une fois. Il ne se met pas à jour tout seul et ne contacte rien pour vérifier. Les nouvelles versions paraissent sur la page des releases.",
        ],
      },
    ],
    captions: ["L'icône de Remnants, un éclat bleu à facettes, sur un fond lilas pâle."],
    tags: ["TypeScript", "Electron", "VS Code", "Privacy"],
    stats: [
      { value: "759k", label: "lignes retirées" },
      { value: "0", label: "télémétrie" },
      { value: "0", label: "connexion" },
      { value: "1", label: "mainteneur" },
    ],
  },
  zh: {
    tagline: "VS Code，减去会跟你搭话的那些部分。",
    description:
      "Remnants 是一个适用于 Windows、macOS 和 Linux 的代码编辑器：我自己的 Code - OSS 构建版本，剔掉了 Copilot、聊天面板、智能体、遥测和登录，而编辑器、终端、Git 和调试器完整保留。",
    overview:
      "我喜欢 VS Code。我不喜欢聊天面板、智能体窗口、账号提示，也不喜欢悄悄往上报使用数据的遥测。于是我拿开源内核 Code - OSS，把每一处 AI 界面、每个遥测钩子和每一次登录催促都拆掉，同时不动那些真正要紧的部分：快速编辑、IntelliSense、集成终端、版本控制，以及 JavaScript/Node 调试器。扩展改走 Open VSX。它发布 Windows、macOS 和 Linux 三个平台的版本。整个改动在上游 1.125.0 之上大约是删掉 759,000 行、加上 2,800 行，CHANGES.md 把它们全列了出来，因为这里几乎所有代码都是微软的，这一点应该很容易核对。",
    roleSummary: "只有我：那些删减、构建、安装包，以及那份 CHANGES 文件。",
    sections: [
      {
        heading: "删掉 2,761 个文件，编辑器照常能用",
        body: [
          "最大的一刀是 AI 本身：聊天、智能体会话、Copilot、MCP 和语言模型 API，一共 2,761 个文件，约 712,000 行。随包的 AI 扩展也一起删了。",
          "这还没完。AI 代码在整个 workbench 里到处注册，所以后面又删了 143 个文件里残留的注册、contribution 和设置，还有智能体欢迎页、Copilot 设置流程，以及 Git、终端、编辑器和搜索代码里的零星痕迹。编辑器、IntelliSense、终端、版本控制和 JavaScript/Node 调试器都原样保留。",
          "有一处残留连安装都搞坏了。上游的 postinstall 步骤会为一个 AI 智能体工具链创建符号链接，工具链删掉之后，npm install 就失败了。修好它也是删除工作的一部分。",
        ],
      },
      {
        heading: "遥测和扩展市场写在 product.json 里",
        body: [
          "遥测在产品层被关掉，标题栏和状态栏里的登录入口也没了，所以没有任何地方让你去建账号。",
          "Code - OSS 的许可不涵盖微软的扩展商店，所以扩展库改指向 Open VSX。这两个决定就是同一个文件里的几行。",
        ],
        code: {
          language: "json",
          text: PRODUCT_JSON,
          caption:
            "摘自 product.json。第一行在整个产品层关掉遥测，gallery 这一段把每次扩展查询都发到 Open VSX，而不是微软的扩展商店。",
        },
      },
      {
        heading: "Git 看不到这些删除，所以由 CHANGES.md 来交代",
        body: [
          "我把上游代码树当成一个压缩快照导入，而没有在 GitHub 上 fork。这是我建仓库时犯的错，后来一次历史重置又让它更糟：第一个提交里删除已经做完了，所以 git log 一处也看不到。",
          "CHANGES.md 把这一点补上。它写明了确切的上游提交，即 1.125.0 版本的 93cfdd48，列出每一项删除的文件数和行数，还附了一段小脚本，把这里的 package.json 和上游的做对比。结果是删掉了六个 AI SDK，没有加回任何东西。其余部分，可以在那个提交上克隆上游，再对比两棵树。",
          "上游代码树标记为 linguist-vendored，这样微软的代码不会算进仓库的语言统计。",
        ],
      },
      {
        heading: "所有平台都出自同一个 release",
        body: [
          "发布工作流为 Windows、macOS 和 Linux 构建 Remnants，x64 和 arm64 都有，所有文件发布在同一个 GitHub release 里，附一个校验和文件，每个文件还有一份签名的来源证明。每个文件都由构建它的工作流实际安装并运行一遍，包括在真实 ARM 硬件上跑 arm64 的 Windows 安装包，以及在 Debian 和 Fedora 容器里装 deb 和 rpm 包。",
          "为此我修了几处上游构建脚本，它们本来就有问题，只是换上更新的依赖后才暴露出来，比如 gulp-rename 的回调会隐式返回刚赋值的路径。",
          "Remnants 在任何平台上都没有代码签名，所以每个平台首次启动时都要确认一次。它不会自动更新，也不会联网去检查。新版本只在 releases 页面发布。",
        ],
      },
    ],
    captions: ["Remnants 的图标：一块多面的蓝色碎片，背景是浅淡的丁香紫。"],
    tags: ["TypeScript", "Electron", "VS Code", "Privacy"],
    stats: [
      { value: "759k", label: "删除的行数" },
      { value: "0", label: "遥测" },
      { value: "0", label: "登录" },
      { value: "1", label: "维护者" },
    ],
  },
};
