import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

const CHECKBOX_CODE = `function checkNoteItem(noteId: number, taskId: number, checked: boolean): void {
  const note = getNote(noteId)
  if (!note) return
  let doc: DocNode
  try {
    doc = JSON.parse(note.content) as DocNode
  } catch {
    return // malformed content, skip
  }
  let changed = false
  let found = false
  const walk = (n: DocNode | null): void => {
    if (!n || typeof n !== 'object' || !Array.isArray(n.content)) return
    for (const child of n.content) {
      if (found) return
      if (child && child.type === 'taskItem' && Number(child.attrs?.taskId) === taskId && child.attrs) {
        // Only the first line with this id: a pasted copy gets its own task on the next sync.
        found = true
        if (child.attrs.checked !== checked) {
          child.attrs.checked = checked
          changed = true
        }
        return
      }
      walk(child)
    }
  }
  walk(doc)
  if (!changed) return
  const content = JSON.stringify(doc)
  getDb().prepare(\`UPDATE notes SET content = ?, updated_at = ? WHERE id = ?\`).run(content, now(), noteId)
  if (note.deleted_at === null) ftsUpsert('note', noteId, note.title ?? 'Untitled', tiptapToText(content))
}`;

const en: LocalizedContent = {
  tagline: "Notes, to-dos and flashcards in one calm app.",
  description:
    "A desktop study app for notes, to-dos and flashcards, kept in one SQLite file on your own machine. A checkbox in a note shows up on Today, and a line with :: becomes a flashcard.",
  overview:
    "Inkling is an Electron app I built for studying. Everything starts as a note: a checkbox in a note is a to-do, and a Term :: Definition line becomes a flashcard. It opens on a Today page that lists the to-dos still open and the decks with cards due, and nothing else. Everything lives in a single SQLite file on the machine, so it works offline and nothing leaves the computer. The latest release, v0.8.2, ships for Windows, macOS and Linux and updates itself from GitHub Releases.",
  roleSummary: "Just me: the data model, the Electron shell, the interface and the release pipeline.",
  sections: [
    {
      heading: "One page of notes feeds the rest of the app",
      body: [
        "The point of Inkling is that you write things down once. Type [] at the start of a line and the checkbox shows up on Today with the name of its note beside it. Write Term :: Definition on a line, or {{c1::word}} for a fill-in-the-blank card, and the Flashcards button in the editor turns those lines into a deck.",
        "The to-do link runs both ways. When a note is saved, every checkbox is matched to its task row by an id stamped into the document, new ones are inserted and deleted ones are removed, all in one transaction. Tick a to-do on Today and the main process finds the checkbox in the note and ticks it there as well. Since v0.8.2 a task id is never handed to another task, so cutting a line and pasting it back can no longer swap two to-dos.",
      ],
      figure: 1,
      code: {
        language: "ts",
        text: CHECKBOX_CODE,
        caption:
          "From src/main/repos/tasks.ts. The way back from Today to the note: find the first checkbox that carries this to-do's id, tick it, and write the note only if something actually changed.",
      },
    },
    {
      heading: "Flashcards that schedule themselves",
      body: [
        "Reviews run on FSRS-6, which keeps two numbers per card, stability and difficulty, and schedules each card for a 90 percent chance that you still remember it. Every button shows the interval it would buy before you press it, and keys 1 to 4 answer without the mouse.",
        "Cards made from a note stay linked to the line they came from. Rewording the line updates the card and keeps its schedule, a new cloze number makes a new card, and every answer is kept in a review log.",
      ],
      figure: 2,
    },
    {
      heading: "A redesign that mostly took things out",
      body: [
        "With v0.8.0 Inkling became a calmer app built around notes. The Tasks tab, Grades, Progress, the focus timer, the streak, the deck import and every setting except the theme went. To-dos from the old Tasks tab moved into a note of their own, and no note, card or review was lost. What is left is one sidebar with New note, Today, Flashcards, the notes, Shortcuts and Settings, in a light and a dark theme.",
        "An earlier pass, v0.6.0, had already taken the source from about 9.8k lines to 6.5k, and loading the editor only when a note opens took the startup bundle from 1881 kB to 819 kB.",
      ],
      figure: 3,
    },
    {
      heading: "Local-first, one file on disk",
      body: [
        "All data sits in one SQLite database in WAL mode. On start it is checkpointed and copied into a backups folder that keeps the last five, and an update backs it up before it changes anything. Search across notes, to-dos and decks runs on SQLite's FTS5 behind Ctrl K.",
        "The renderer never touches the database. It runs sandboxed, with context isolation on and Node integration off, and everything goes through 31 IPC handlers in the preload bridge. A new database is created directly in its current shape, and on every push CI launches the built app against a throwaway profile and runs seventeen checks through the real bridge.",
      ],
    },
    {
      heading: "An assistant can work with your notes",
      body: [
        "Started with --mcp, Inkling serves its data to an AI assistant over MCP on stdin and stdout, with twenty tools: it can search, read and write notes down to a single section, undo its own edits, rename notes and use the trash, see Today, tick off to-dos and quiz you on the flashcards that are due. Settings connects the assistants it finds on the computer in one click, and the data is backed up before an assistant's first change.",
        "This mode takes no lock and never opens a window, so it runs next to the app while you use it.",
      ],
    },
  ],
  captions: [
    "The Today page: six open to-dos from four notes, and two decks with cards due.",
    "A note in the editor: Term :: Definition lines that become flashcards, and checkboxes that are to-dos.",
    "A review on the Flashcards page: the answer is showing, with the next interval under each of the four ratings.",
    "The dark theme on a maths note with two open to-dos.",
  ],
  tags: ["Electron", "React", "TypeScript", "SQLite", "FSRS"],
  stats: [
    { value: "20", label: "MCP tools" },
    { value: "17", label: "end-to-end smoke checks" },
    { value: "31", label: "IPC handlers" },
    { value: "3", label: "platforms" },
  ],
};

const de: LocalizedContent = {
  tagline: "Notizen, To-dos und Karteikarten in einer ruhigen App.",
  description:
    "Eine Lern-App für den Desktop mit Notizen, To-dos und Karteikarten, gespeichert in einer SQLite-Datei auf dem eigenen Rechner. Eine Checkbox in einer Notiz erscheint auf der Heute-Seite, eine Zeile mit :: wird zur Karteikarte.",
  overview:
    "Inkling ist eine Electron-App, die ich zum Lernen gebaut habe. Alles beginnt als Notiz: Eine Checkbox in einer Notiz ist ein To-do, und eine Zeile Begriff :: Definition wird zur Karteikarte. Die App öffnet auf einer Heute-Seite, die die offenen To-dos und die Stapel mit fälligen Karten zeigt, und sonst nichts. Alles liegt in einer einzigen SQLite-Datei auf dem Rechner, sie funktioniert also offline, und nichts verlässt den Computer. Das neueste Release, v0.8.2, erscheint für Windows, macOS und Linux und aktualisiert sich selbst über GitHub Releases.",
  roleSummary: "Nur ich: das Datenmodell, die Electron-Schale, die Oberfläche und die Release-Pipeline.",
  sections: [
    {
      heading: "Eine Seite Notizen speist den Rest der App",
      body: [
        "Die Idee von Inkling ist, dass man Dinge nur einmal aufschreibt. Wer am Zeilenanfang [] tippt, bekommt eine Checkbox, die auf der Heute-Seite mit dem Namen ihrer Notiz daneben erscheint. Wer Begriff :: Definition auf eine Zeile schreibt, oder {{c1::Wort}} für eine Lückenkarte, macht diese Zeilen mit dem Karteikarten-Knopf im Editor zu einem Stapel.",
        "Die Verknüpfung mit den To-dos geht in beide Richtungen. Beim Speichern einer Notiz wird jede Checkbox über eine im Dokument hinterlegte ID ihrer Aufgabenzeile zugeordnet, neue werden eingefügt und gelöschte entfernt, alles in einer Transaktion. Hakt man ein To-do auf der Heute-Seite ab, sucht der Hauptprozess die Checkbox in der Notiz und setzt dort den Haken ebenfalls. Seit v0.8.2 bekommt keine Aufgabe die ID einer anderen, also kann das Ausschneiden und Wiedereinfügen einer Zeile keine zwei To-dos mehr vertauschen.",
      ],
      figure: 1,
      code: {
        language: "ts",
        text: CHECKBOX_CODE,
        caption:
          "Aus src/main/repos/tasks.ts. Der Weg zurück von der Heute-Seite zur Notiz: die erste Checkbox mit der ID dieses To-dos suchen, abhaken und die Notiz nur schreiben, wenn sich wirklich etwas geändert hat.",
      },
    },
    {
      heading: "Karteikarten, die sich selbst einplanen",
      body: [
        "Wiederholungen laufen über FSRS-6. Das Verfahren führt pro Karte zwei Werte, Stabilität und Schwierigkeit, und plant jede Karte so, dass man sie mit 90 Prozent Wahrscheinlichkeit noch weiss. Jeder Knopf zeigt vor dem Drücken, welches Intervall er bringen würde, und die Tasten 1 bis 4 antworten ohne Maus.",
        "Karten aus einer Notiz bleiben mit ihrer Zeile verknüpft. Wer die Zeile umformuliert, ändert die Karte und behält ihren Plan, eine neue Lückennummer gibt eine neue Karte, und jede Antwort landet in einem Wiederholungsprotokoll.",
      ],
      figure: 2,
    },
    {
      heading: "Eine Überarbeitung, die vor allem Dinge herausnahm",
      body: [
        "Mit v0.8.0 wurde Inkling zu einer ruhigeren App rund um Notizen. Der Tab Aufgaben, Noten, Fortschritt, der Fokus-Timer, die Serie, der Stapel-Import und jede Einstellung ausser dem Theme fielen weg. To-dos aus dem alten Tab Aufgaben zogen in eine eigene Notiz um, und keine Notiz, Karte oder Wiederholung ging verloren. Geblieben ist eine Seitenleiste mit Neue Notiz, Heute, Karteikarten, den Notizen, Tastenkürzeln und Einstellungen, in einem hellen und einem dunklen Theme.",
        "Schon v0.6.0 hatte den Quellcode von etwa 9.8k auf 6.5k Zeilen gebracht, und weil der Editor erst beim Öffnen einer Notiz geladen wird, fiel das Start-Bundle von 1881 kB auf 819 kB.",
      ],
      figure: 3,
    },
    {
      heading: "Lokal zuerst, eine Datei auf der Platte",
      body: [
        "Alle Daten liegen in einer SQLite-Datenbank im WAL-Modus. Beim Start wird sie mit einem Checkpoint abgeschlossen und in einen Backup-Ordner kopiert, der die letzten fünf behält, und ein Update sichert sie, bevor es etwas ändert. Die Suche über Notizen, To-dos und Stapel läuft über SQLites FTS5 hinter Ctrl K.",
        "Der Renderer fasst die Datenbank nie an. Er läuft in der Sandbox, mit Context Isolation und ohne Node-Integration, und alles geht über 31 IPC-Handler in der Preload-Brücke. Eine neue Datenbank wird direkt in ihrer aktuellen Form angelegt, und bei jedem Push startet die CI die gebaute App gegen ein Wegwerfprofil und führt siebzehn Prüfungen über die echte Brücke aus.",
      ],
    },
    {
      heading: "Ein Assistent kann mit den Notizen arbeiten",
      body: [
        "Mit --mcp gestartet, stellt Inkling seine Daten einem KI-Assistenten über MCP auf stdin und stdout bereit, mit zwanzig Werkzeugen: Er kann suchen, Notizen bis auf einen einzelnen Abschnitt lesen und schreiben, die eigenen Änderungen rückgängig machen, Notizen umbenennen und den Papierkorb nutzen, die Heute-Seite sehen, To-dos abhaken und die fälligen Karteikarten abfragen. In den Einstellungen verbindet ein Klick die Assistenten, die Inkling auf dem Computer findet, und vor der ersten Änderung eines Assistenten werden die Daten gesichert.",
        "Dieser Modus nimmt keine Sperre und öffnet nie ein Fenster, er läuft also neben der App, während man sie benutzt.",
      ],
    },
  ],
  captions: [
    "Die Heute-Seite: sechs offene To-dos aus vier Notizen und zwei Stapel mit fälligen Karten.",
    "Eine Notiz im Editor: Zeilen Begriff :: Definition, die zu Karteikarten werden, und Checkboxen, die To-dos sind.",
    "Eine Wiederholung auf der Seite Karteikarten: Die Antwort ist aufgedeckt, unter jeder der vier Bewertungen steht das nächste Intervall.",
    "Das dunkle Theme auf einer Mathe-Notiz mit zwei offenen To-dos.",
  ],
  tags: ["Electron", "React", "TypeScript", "SQLite", "FSRS"],
  stats: [
    { value: "20", label: "MCP-Werkzeuge" },
    { value: "17", label: "End-to-End-Prüfungen" },
    { value: "31", label: "IPC-Handler" },
    { value: "3", label: "Plattformen" },
  ],
};

const fr: LocalizedContent = {
  tagline: "Notes, tâches et cartes mémoire dans une app calme.",
  description:
    "Une app d'étude pour le bureau, avec notes, tâches et cartes mémoire, conservées dans un seul fichier SQLite sur votre machine. Une case à cocher dans une note apparaît sur la page Aujourd'hui, et une ligne avec :: devient une carte.",
  overview:
    "Inkling est une application Electron que j'ai construite pour étudier. Tout commence par une note : une case à cocher dans une note est une tâche, et une ligne Terme :: Définition devient une carte mémoire. Elle s'ouvre sur une page Aujourd'hui qui affiche les tâches encore ouvertes et les paquets avec des cartes à réviser, et rien d'autre. Tout vit dans un seul fichier SQLite sur la machine, donc elle marche hors ligne et rien ne quitte l'ordinateur. La dernière version, v0.8.2, sort pour Windows, macOS et Linux et se met à jour elle-même depuis GitHub Releases.",
  roleSummary: "Moi seul : le modèle de données, la coque Electron, l'interface et la chaîne de publication.",
  sections: [
    {
      heading: "Une page de notes alimente le reste de l'app",
      body: [
        "L'idée d'Inkling, c'est de n'écrire les choses qu'une fois. Tapez [] en début de ligne, et la case à cocher apparaît sur la page Aujourd'hui avec le nom de sa note à côté. Écrivez Terme :: Définition sur une ligne, ou {{c1::mot}} pour une carte à trou, et le bouton Cartes de l'éditeur transforme ces lignes en paquet.",
        "Le lien avec les tâches marche dans les deux sens. À l'enregistrement d'une note, chaque case est rattachée à sa ligne de tâche par un identifiant inscrit dans le document, les nouvelles sont insérées et les supprimées retirées, le tout dans une seule transaction. Quand vous cochez une tâche sur la page Aujourd'hui, le processus principal retrouve la case dans la note et la coche là aussi. Depuis v0.8.2, l'identifiant d'une tâche n'est jamais donné à une autre, donc couper une ligne puis la recoller ne peut plus intervertir deux tâches.",
      ],
      figure: 1,
      code: {
        language: "ts",
        text: CHECKBOX_CODE,
        caption:
          "Tiré de src/main/repos/tasks.ts. Le chemin retour, de la page Aujourd'hui vers la note : trouver la première case qui porte l'identifiant de cette tâche, la cocher, et n'écrire la note que si quelque chose a vraiment changé.",
      },
    },
    {
      heading: "Des cartes qui se planifient toutes seules",
      body: [
        "Les révisions tournent sur FSRS-6, qui garde deux valeurs par carte, la stabilité et la difficulté, et planifie chaque carte pour 90 % de chances de s'en souvenir encore. Chaque bouton affiche l'intervalle qu'il donnerait avant qu'on le presse, et les touches 1 à 4 répondent sans la souris.",
        "Les cartes tirées d'une note restent liées à la ligne d'où elles viennent. Reformuler la ligne met la carte à jour sans toucher à son planning, un nouveau numéro de trou donne une nouvelle carte, et chaque réponse est gardée dans un journal de révisions.",
      ],
      figure: 2,
    },
    {
      heading: "Une refonte qui a surtout retiré des choses",
      body: [
        "Avec v0.8.0, Inkling est devenue une app plus calme, construite autour des notes. L'onglet Tâches, les notes scolaires, la page Progrès, le minuteur de concentration, la série, l'import de paquets et tous les réglages sauf le thème sont partis. Les tâches de l'ancien onglet ont rejoint une note à part, et aucune note, carte ni révision n'a été perdue. Il reste une barre latérale avec Nouvelle note, Aujourd'hui, Cartes, les notes, les raccourcis et les réglages, dans un thème clair et un thème sombre.",
        "Une passe plus ancienne, v0.6.0, avait déjà fait passer le code source d'environ 9,8k lignes à 6,5k, et charger l'éditeur seulement à l'ouverture d'une note avait fait passer le bundle de démarrage de 1881 kB à 819 kB.",
      ],
      figure: 3,
    },
    {
      heading: "Local d'abord, un seul fichier sur le disque",
      body: [
        "Toutes les données tiennent dans une base SQLite en mode WAL. Au démarrage, elle passe par un checkpoint puis est copiée dans un dossier de sauvegardes qui garde les cinq dernières, et une mise à jour la sauvegarde avant de changer quoi que ce soit. La recherche dans les notes, les tâches et les paquets passe par FTS5 de SQLite, derrière Ctrl K.",
        "Le rendu ne touche jamais la base. Il tourne en sandbox, avec l'isolation de contexte activée et l'intégration Node désactivée, et tout passe par 31 gestionnaires IPC dans le pont de preload. Une nouvelle base est créée directement dans sa forme actuelle, et à chaque push la CI lance l'app construite sur un profil jetable et exécute dix-sept vérifications à travers le vrai pont.",
      ],
    },
    {
      heading: "Un assistant peut travailler avec vos notes",
      body: [
        "Lancée avec --mcp, Inkling sert ses données à un assistant IA par MCP sur stdin et stdout, avec vingt outils : il peut chercher, lire et écrire les notes jusqu'à une seule section, annuler ses propres modifications, renommer les notes et utiliser la corbeille, voir la page Aujourd'hui, cocher les tâches et vous interroger sur les cartes à réviser. Les réglages connectent en un clic les assistants trouvés sur l'ordinateur, et les données sont sauvegardées avant la première modification d'un assistant.",
        "Ce mode ne prend aucun verrou et n'ouvre jamais de fenêtre, il tourne donc à côté de l'app pendant qu'on s'en sert.",
      ],
    },
  ],
  captions: [
    "La page Aujourd'hui : six tâches ouvertes tirées de quatre notes, et deux paquets avec des cartes à réviser.",
    "Une note dans l'éditeur : des lignes Terme :: Définition qui deviennent des cartes, et des cases à cocher qui sont des tâches.",
    "Une révision dans la page Cartes : la réponse est affichée, avec le prochain intervalle sous chacun des quatre choix.",
    "Le thème sombre sur une note de maths avec deux tâches ouvertes.",
  ],
  tags: ["Electron", "React", "TypeScript", "SQLite", "FSRS"],
  stats: [
    { value: "20", label: "outils MCP" },
    { value: "17", label: "vérifications de bout en bout" },
    { value: "31", label: "gestionnaires IPC" },
    { value: "3", label: "plateformes" },
  ],
};

const zh: LocalizedContent = {
  tagline: "把笔记、待办和抽认卡放进一个安静的应用。",
  description:
    "一个桌面学习应用，包含笔记、待办和抽认卡，全部保存在你自己电脑上的一个 SQLite 文件里。笔记里的复选框会出现在“今天”页面上，带 :: 的一行会变成一张抽认卡。",
  overview:
    "Inkling 是我为学习做的一个 Electron 应用。一切都从笔记开始：笔记里的复选框就是待办，术语 :: 定义 这样的一行会变成抽认卡。打开时是一个“今天”页面，只列出还没完成的待办和有到期卡片的卡组，别的什么都没有。所有数据都在机器上的一个 SQLite 文件里，所以它可以离线使用，什么都不会离开这台电脑。最新版本 v0.8.2 支持 Windows、macOS 和 Linux，并通过 GitHub Releases 自动更新。",
  roleSummary: "只有我：数据模型、Electron 外壳、界面和发布流程。",
  sections: [
    {
      heading: "一页笔记喂给整个应用",
      body: [
        "Inkling 的出发点是：一件事只写一次。在行首输入 []，这个复选框就会出现在“今天”页面上，旁边写着它所在笔记的名字。在一行里写下 术语 :: 定义，或者用 {{c1::词}} 做一张填空卡，编辑器里的抽认卡按钮就能把这些行变成一个卡组。",
        "待办和笔记是双向关联的。保存笔记时，每个复选框都通过写进文档里的 id 对应到它的任务行，新的插入，删掉的移除，全部在一个事务里完成。在“今天”页面上勾掉一个待办，主进程会在笔记里找到那个复选框，把它也勾上。从 v0.8.2 起，一个任务的 id 不会再交给别的任务，所以剪切一行再粘贴回去，不会再把两个待办对调。",
      ],
      figure: 1,
      code: {
        language: "ts",
        text: CHECKBOX_CODE,
        caption:
          "摘自 src/main/repos/tasks.ts。从“今天”页面回到笔记的那条路：找到第一个带着这个待办 id 的复选框，把它勾上，只有真的有变化时才写回笔记。",
      },
    },
    {
      heading: "自己安排复习时间的抽认卡",
      body: [
        "复习基于 FSRS-6。它为每张卡记录两个值，稳定度和难度，并按照你仍有 90% 概率记得来安排每张卡。每个按钮在按下之前就显示它会带来的间隔，数字键 1 到 4 不用鼠标就能作答。",
        "从笔记生成的卡片会一直关联着它来自的那一行。改写这一行会更新卡片，但保留它的复习安排；新的填空编号会生成一张新卡；每一次作答都记在复习日志里。",
      ],
      figure: 2,
    },
    {
      heading: "一次主要在做减法的改版",
      body: [
        "从 v0.8.0 起，Inkling 变成了一个围绕笔记的、更安静的应用。“任务”标签、成绩、进度、专注计时器、连续天数、卡组导入，以及除主题以外的所有设置都拿掉了。旧“任务”标签里的待办搬进了一篇单独的笔记，没有丢掉任何笔记、卡片或复习记录。留下来的是一个侧栏，里面有“新建笔记”、“今天”、“抽认卡”、所有笔记、“快捷键”和“设置”，配一套浅色和一套深色主题。",
        "更早的 v0.6.0 已经把源代码从大约 9.8k 行减到 6.5k 行，编辑器改成打开笔记时才加载，启动包从 1881 kB 降到 819 kB。",
      ],
      figure: 3,
    },
    {
      heading: "本地优先，磁盘上的一个文件",
      body: [
        "所有数据都在一个 WAL 模式的 SQLite 数据库里。启动时先做一次检查点，再复制到备份文件夹，那里保留最近的五份；更新在改动任何东西之前也会先备份。笔记、待办和卡组的搜索用的是 SQLite 的 FTS5，入口在 Ctrl K。",
        "渲染进程从不直接碰数据库。它运行在沙箱里，开启了上下文隔离，关闭了 Node 集成，一切都经过 preload 桥里的 31 个 IPC 处理函数。新数据库直接按当前结构创建；每次推送，CI 都会在一次性的配置目录上启动构建好的应用，通过真实的桥跑十七项检查。",
      ],
    },
    {
      heading: "AI 助手可以帮你处理笔记",
      body: [
        "用 --mcp 启动时，Inkling 通过 MCP 在 stdin 和 stdout 上把数据提供给 AI 助手，共有二十个工具：它可以搜索，读写笔记（细到单独一节），撤销自己的修改，重命名笔记、使用回收站，查看“今天”页面，勾掉待办，并就到期的抽认卡考你。在设置里点一下，就能连接在电脑上找到的助手；助手第一次修改之前，数据会先备份。",
        "这个模式不占用锁，也从不打开窗口，所以你在用应用的时候，它可以在旁边同时运行。",
      ],
    },
  ],
  captions: [
    "“今天”页面：来自四篇笔记的六个未完成待办，以及两个有到期卡片的卡组。",
    "编辑器里的一篇笔记：术语 :: 定义 这样的行会变成抽认卡，复选框就是待办。",
    "抽认卡页面里的一次复习：答案已经翻开，四个评分按钮下各标着下一次复习的间隔。",
    "深色主题下的一篇数学笔记，里面有两个未完成的待办。",
  ],
  tags: ["Electron", "React", "TypeScript", "SQLite", "FSRS"],
  stats: [
    { value: "20", label: "MCP 工具" },
    { value: "17", label: "端到端冒烟检查" },
    { value: "31", label: "IPC 处理函数" },
    { value: "3", label: "平台" },
  ],
};

export const inkling: Record<Language, LocalizedContent> = { en, de, fr, zh };
