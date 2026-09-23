import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

const CHECKBOX_CODE = `function updateNoteCheckbox(noteId: number, taskId: number, checked: boolean): void {
  const note = getNote(noteId)
  if (!note) return
  try {
    const doc = JSON.parse(note.content)
    let changed = false
    const walk = (n: { type?: string; attrs?: Record<string, unknown>; content?: unknown[] }): void => {
      if (n.type === 'taskItem' && n.attrs && Number(n.attrs.taskId) === taskId) {
        if (n.attrs.checked !== checked) {
          n.attrs.checked = checked
          changed = true
        }
      }
      if (Array.isArray(n.content)) n.content.forEach((c) => walk(c as never))
    }
    walk(doc)
    if (changed) {
      getDb().prepare(\`UPDATE notes SET content = ?, updated_at = ? WHERE id = ?\`).run(JSON.stringify(doc), now(), noteId)
    }
  } catch {
    /* malformed content, skip */
  }
}`;

const en: LocalizedContent = {
  tagline: "A study app that opens on what to do today.",
  description:
    "A desktop study companion for notes, tasks, flashcards and grades, kept in one SQLite file on your own machine. A checkbox in a note becomes a real task, and a line with :: becomes a flashcard.",
  overview:
    "Inkling is an Electron app I built for studying. It has notes, tasks, flashcards with a focus timer, and grades, and it opens on a Today page that puts together a short plan from what is already in there: the decks that are due, the tasks due today, the subject with the lowest average and one focus block. Everything lives in a single SQLite file on the machine, so it works offline and nothing leaves the computer. The latest release, v0.6.0, ships for Windows, macOS and Linux and updates itself from GitHub Releases.",
  roleSummary: "Just me: the data model, the Electron shell, the interface and the release pipeline.",
  sections: [
    {
      heading: "One page of notes feeds the rest of the app",
      body: [
        "The point of Inkling is that you write things down once. Type [] at the start of a line in a note and the checkbox becomes a real task in the Tasks tab. Write Term :: Definition on a line and the Flashcards button in the editor turns those lines into a deck.",
        "The task link runs both ways. When a note is saved, every checkbox is matched to its task row by an id stamped into the document, new ones are inserted and deleted ones are removed, all in one transaction. When you tick the task off somewhere else, the main process walks the note's document and ticks the checkbox there as well.",
      ],
      figure: 1,
      code: {
        language: "ts",
        text: CHECKBOX_CODE,
        caption:
          "From src/main/repos/tasks.ts. The way back from task to note: find the checkbox that carries this task's id and write the note only if something actually changed.",
      },
    },
    {
      heading: "Flashcards that schedule themselves",
      body: [
        "Reviews run on FSRS-4.5, which keeps two numbers per card, stability and difficulty, and schedules each card for a 90 percent chance that you still remember it. Every button shows the interval it would buy before you press it, and keys 1 to 4 answer without the mouse.",
        "Every answer goes into a permanent review log, and the Progress page reads that log back for retention, reviews and the streak, so those numbers are counted from what you did. Next to the decks sits a focus timer that can be linked to a task or a deck, and its minutes count towards the streak too.",
      ],
      figure: 2,
    },
    {
      heading: "Grades kept in the scale they were written in",
      body: [
        "Grades are logged per subject, either on the Swiss 1 to 6 scale, where 4 is a pass, or as percentages. The scale is stored on every row, so switching the view later never reinterprets an old grade. A Swiss grade maps linearly onto percent, which is how a 4.5 shows up as 70 percent next to its weight.",
        "Each subject gets a weighted average and the sidebar shows one figure across all of them. The subject with the lowest average is the one the Today page suggests you spend time on.",
      ],
      figure: 3,
    },
    {
      heading: "Local-first, one file on disk",
      body: [
        "All data sits in one SQLite database in WAL mode. On start it is checkpointed and copied into a backups folder that keeps the last five. Search across notes, tasks and decks runs on SQLite's FTS5 behind Ctrl K.",
        "The renderer never touches the database. It runs with context isolation on and Node integration off, and everything goes through 48 IPC handlers in the preload bridge.",
      ],
    },
    {
      heading: "A release that mostly took things out",
      body: [
        "Inkling had grown a second way to do most things, so v0.6.0 kept one of each. The kanban board, hashtags, the journal, wiki links, PDF export and a handful of settings went, and none of the notes, tasks, decks, grades or review history were touched. The source went from about 9.8k lines to 6.5k, and loading the editor only when a page is opened took the startup bundle from 1881 kB to 819 kB.",
        "The same release fixed a bug that the unit tests could never have seen: a fresh install could not open its own database, because a new file was walked through every old migration and those touched columns that no longer exist. A new database is now created in its current shape, and a smoke test launches the built app against a throwaway profile and runs twelve checks through the real IPC bridge. CI runs it on every push.",
      ],
    },
  ],
  captions: [
    "The Today page: a greeting with the streak, four items for the day, and the tasks due this week in the sidebar.",
    "The editor on the welcome page, with a checkbox that becomes a task and two Term :: Definition lines above the Flashcards button's hint.",
    "The Study page with a deck of three due cards on the left and the focus timer set to 25 minutes on the right.",
    "Grades for one subject: two assessments on the Swiss scale with their percentages and a weight, and the overall average in the sidebar.",
  ],
  tags: ["Electron", "React", "TypeScript", "SQLite", "FSRS"],
  stats: [
    { value: "101", label: "unit tests" },
    { value: "12", label: "end-to-end smoke checks" },
    { value: "48", label: "IPC handlers" },
    { value: "3", label: "platforms" },
  ],
};

const de: LocalizedContent = {
  tagline: "Eine Lern-App, die mit dem aufgeht, was heute zu tun ist.",
  description:
    "Ein Lernbegleiter für den Desktop mit Notizen, Aufgaben, Karteikarten und Noten, gespeichert in einer SQLite-Datei auf dem eigenen Rechner. Eine Checkbox in einer Notiz wird zur echten Aufgabe, eine Zeile mit :: zur Karteikarte.",
  overview:
    "Inkling ist eine Electron-App, die ich zum Lernen gebaut habe. Sie hat Notizen, Aufgaben, Karteikarten mit einem Fokus-Timer und Noten, und sie öffnet auf einer Heute-Seite, die aus dem, was schon drin ist, einen kurzen Plan zusammenstellt: die fälligen Stapel, die heute fälligen Aufgaben, das Fach mit dem tiefsten Schnitt und einen Fokusblock. Alles liegt in einer einzigen SQLite-Datei auf dem Rechner, sie funktioniert also offline, und nichts verlässt den Computer. Das neueste Release, v0.6.0, erscheint für Windows, macOS und Linux und aktualisiert sich selbst über GitHub Releases.",
  roleSummary: "Nur ich: das Datenmodell, die Electron-Schale, die Oberfläche und die Release-Pipeline.",
  sections: [
    {
      heading: "Eine Seite Notizen speist den Rest der App",
      body: [
        "Die Idee von Inkling ist, dass man Dinge nur einmal aufschreibt. Wer am Zeilenanfang einer Notiz [] tippt, bekommt eine Checkbox, die im Tab Aufgaben als echte Aufgabe erscheint. Wer Begriff :: Definition auf eine Zeile schreibt, kann diese Zeilen mit dem Karteikarten-Knopf im Editor zu einem Stapel machen.",
        "Die Verknüpfung mit den Aufgaben geht in beide Richtungen. Beim Speichern einer Notiz wird jede Checkbox über eine im Dokument hinterlegte ID ihrer Aufgabenzeile zugeordnet, neue werden eingefügt und gelöschte entfernt, alles in einer Transaktion. Hakt man die Aufgabe anderswo ab, geht der Hauptprozess durch das Dokument der Notiz und setzt dort den Haken ebenfalls.",
      ],
      figure: 1,
      code: {
        language: "ts",
        text: CHECKBOX_CODE,
        caption:
          "Aus src/main/repos/tasks.ts. Der Weg zurück von der Aufgabe zur Notiz: die Checkbox mit der ID dieser Aufgabe suchen und die Notiz nur schreiben, wenn sich wirklich etwas geändert hat.",
      },
    },
    {
      heading: "Karteikarten, die sich selbst einplanen",
      body: [
        "Wiederholungen laufen über FSRS-4.5. Das Verfahren führt pro Karte zwei Werte, Stabilität und Schwierigkeit, und plant jede Karte so, dass man sie mit 90 Prozent Wahrscheinlichkeit noch weiss. Jeder Knopf zeigt vor dem Drücken, welches Intervall er bringen würde, und die Tasten 1 bis 4 antworten ohne Maus.",
        "Jede Antwort landet in einem dauerhaften Wiederholungsprotokoll, und die Fortschrittsseite liest daraus Behaltensquote, Wiederholungen und die Serie. Diese Zahlen sind also gezählt und nicht geschätzt. Neben den Stapeln sitzt ein Fokus-Timer, der sich mit einer Aufgabe oder einem Stapel verknüpfen lässt, und seine Minuten zählen ebenfalls zur Serie.",
      ],
      figure: 2,
    },
    {
      heading: "Noten in der Skala, in der sie eingetragen wurden",
      body: [
        "Noten werden pro Fach erfasst, entweder auf der Schweizer Skala von 1 bis 6, bei der eine 4 genügend ist, oder in Prozent. Die Skala steht auf jeder Zeile, ein späterer Wechsel der Ansicht deutet also keine alte Note um. Eine Schweizer Note wird linear in Prozent umgerechnet, deshalb erscheint eine 4.5 als 70 Prozent neben ihrer Gewichtung.",
        "Jedes Fach bekommt einen gewichteten Schnitt, und die Seitenleiste zeigt eine Zahl über alle Fächer. Das Fach mit dem tiefsten Schnitt schlägt die Heute-Seite als dasjenige vor, dem man Zeit geben sollte.",
      ],
      figure: 3,
    },
    {
      heading: "Lokal zuerst, eine Datei auf der Platte",
      body: [
        "Alle Daten liegen in einer SQLite-Datenbank im WAL-Modus. Beim Start wird sie mit einem Checkpoint abgeschlossen und in einen Backup-Ordner kopiert, der die letzten fünf behält. Die Suche über Notizen, Aufgaben und Stapel läuft über SQLites FTS5 hinter Ctrl K.",
        "Der Renderer fasst die Datenbank nie an. Er läuft mit Context Isolation und ohne Node-Integration, und alles geht über 48 IPC-Handler in der Preload-Brücke.",
      ],
    },
    {
      heading: "Ein Release, das vor allem Dinge herausnahm",
      body: [
        "Inkling hatte für fast alles einen zweiten Weg bekommen, also behielt v0.6.0 von jedem einen. Das Kanban-Board, Hashtags, das Journal, Wiki-Links, der PDF-Export und eine Handvoll Einstellungen fielen weg, und keine Notiz, Aufgabe, kein Stapel, keine Note und kein Wiederholungsverlauf wurde angefasst. Der Quellcode schrumpfte von etwa 9.8k auf 6.5k Zeilen, und weil der Editor erst beim Öffnen einer Seite geladen wird, fiel das Start-Bundle von 1881 kB auf 819 kB.",
        "Dasselbe Release behob einen Fehler, den die Unit-Tests nie hätten sehen können: Eine frische Installation konnte ihre eigene Datenbank nicht öffnen, weil eine neue Datei durch jede alte Migration geschickt wurde und diese Spalten anfassten, die es nicht mehr gibt. Eine neue Datenbank wird jetzt direkt in ihrer aktuellen Form angelegt, und ein Smoke-Test startet die gebaute App gegen ein Wegwerfprofil und führt zwölf Prüfungen über die echte IPC-Brücke aus. Die CI lässt ihn bei jedem Push laufen.",
      ],
    },
  ],
  captions: [
    "Die Heute-Seite: eine Begrüssung mit der Serie, vier Punkte für den Tag und die Aufgaben dieser Woche in der Seitenleiste.",
    "Der Editor auf der Willkommensseite, mit einer Checkbox, die zur Aufgabe wird, und zwei Zeilen Begriff :: Definition über dem Hinweis zum Karteikarten-Knopf.",
    "Die Lernseite mit einem Stapel von drei fälligen Karten links und dem Fokus-Timer auf 25 Minuten rechts.",
    "Die Noten eines Fachs: zwei Prüfungen auf der Schweizer Skala mit ihren Prozentwerten und einer Gewichtung, und der Gesamtschnitt in der Seitenleiste.",
  ],
  tags: ["Electron", "React", "TypeScript", "SQLite", "FSRS"],
  stats: [
    { value: "101", label: "Unit-Tests" },
    { value: "12", label: "End-to-End-Prüfungen" },
    { value: "48", label: "IPC-Handler" },
    { value: "3", label: "Plattformen" },
  ],
};

const fr: LocalizedContent = {
  tagline: "Une app d'étude qui s'ouvre sur ce qu'il y a à faire aujourd'hui.",
  description:
    "Un compagnon d'étude pour le bureau, avec notes, tâches, cartes mémoire et notes scolaires, conservés dans un seul fichier SQLite sur votre machine. Une case à cocher dans une note devient une vraie tâche, et une ligne avec :: devient une carte.",
  overview:
    "Inkling est une application Electron que j'ai construite pour étudier. Elle réunit des notes, des tâches, des cartes mémoire avec un minuteur de concentration, et les notes scolaires, et elle s'ouvre sur une page Aujourd'hui qui compose un court plan à partir de ce qui s'y trouve déjà : les paquets à réviser, les tâches du jour, la matière à la moyenne la plus basse et un bloc de concentration. Tout vit dans un seul fichier SQLite sur la machine, donc elle marche hors ligne et rien ne quitte l'ordinateur. La dernière version, v0.6.0, sort pour Windows, macOS et Linux et se met à jour elle-même depuis GitHub Releases.",
  roleSummary: "Moi seul : le modèle de données, la coque Electron, l'interface et la chaîne de publication.",
  sections: [
    {
      heading: "Une page de notes alimente le reste de l'app",
      body: [
        "L'idée d'Inkling, c'est de n'écrire les choses qu'une fois. Tapez [] en début de ligne dans une note, et la case à cocher devient une vraie tâche dans l'onglet Tâches. Écrivez Terme :: Définition sur une ligne, et le bouton Cartes de l'éditeur transforme ces lignes en paquet.",
        "Le lien avec les tâches marche dans les deux sens. À l'enregistrement d'une note, chaque case est rattachée à sa ligne de tâche par un identifiant inscrit dans le document, les nouvelles sont insérées et les supprimées retirées, le tout dans une seule transaction. Quand vous cochez la tâche ailleurs, le processus principal parcourt le document de la note et coche la case là aussi.",
      ],
      figure: 1,
      code: {
        language: "ts",
        text: CHECKBOX_CODE,
        caption:
          "Tiré de src/main/repos/tasks.ts. Le chemin retour, de la tâche vers la note : trouver la case qui porte l'identifiant de cette tâche et n'écrire la note que si quelque chose a vraiment changé.",
      },
    },
    {
      heading: "Des cartes qui se planifient toutes seules",
      body: [
        "Les révisions tournent sur FSRS-4.5, qui garde deux valeurs par carte, la stabilité et la difficulté, et planifie chaque carte pour 90 % de chances de s'en souvenir encore. Chaque bouton affiche l'intervalle qu'il donnerait avant qu'on le presse, et les touches 1 à 4 répondent sans la souris.",
        "Chaque réponse est écrite dans un journal de révisions permanent, et la page Progrès relit ce journal pour la rétention, les révisions et la série. Ces chiffres sont donc comptés, pas estimés. À côté des paquets se trouve un minuteur de concentration qu'on peut lier à une tâche ou à un paquet, et ses minutes comptent aussi pour la série.",
      ],
      figure: 2,
    },
    {
      heading: "Des notes gardées dans l'échelle où elles ont été saisies",
      body: [
        "Les notes se saisissent par matière, soit sur l'échelle suisse de 1 à 6, où 4 est suffisant, soit en pourcentage. L'échelle est enregistrée sur chaque ligne, si bien que changer d'affichage plus tard ne réinterprète jamais une ancienne note. Une note suisse se convertit linéairement en pourcentage, c'est pourquoi un 4,5 apparaît comme 70 % à côté de sa pondération.",
        "Chaque matière a sa moyenne pondérée, et la barre latérale affiche un chiffre pour l'ensemble. La matière à la moyenne la plus basse est celle que la page Aujourd'hui propose de travailler.",
      ],
      figure: 3,
    },
    {
      heading: "Local d'abord, un seul fichier sur le disque",
      body: [
        "Toutes les données tiennent dans une base SQLite en mode WAL. Au démarrage, elle passe par un checkpoint puis est copiée dans un dossier de sauvegardes qui garde les cinq dernières. La recherche dans les notes, les tâches et les paquets passe par FTS5 de SQLite, derrière Ctrl K.",
        "Le rendu ne touche jamais la base. Il tourne avec l'isolation de contexte activée et l'intégration Node désactivée, et tout passe par 48 gestionnaires IPC dans le pont de preload.",
      ],
    },
    {
      heading: "Une version qui a surtout retiré des choses",
      body: [
        "Inkling avait fini par offrir une deuxième façon de faire presque tout, alors v0.6.0 n'en a gardé qu'une. Le tableau kanban, les hashtags, le journal, les liens wiki, l'export PDF et une poignée de réglages sont partis, et aucune note, tâche, carte, note scolaire ni aucun historique de révision n'a été touché. Le code source est passé d'environ 9,8k lignes à 6,5k, et charger l'éditeur seulement à l'ouverture d'une page a fait passer le bundle de démarrage de 1881 kB à 819 kB.",
        "La même version a corrigé un bug que les tests unitaires n'auraient jamais pu voir : une installation neuve ne pouvait pas ouvrir sa propre base, parce qu'un nouveau fichier passait par toutes les anciennes migrations et que celles-ci touchaient des colonnes qui n'existent plus. Une nouvelle base est désormais créée directement dans sa forme actuelle, et un test de fumée lance l'app construite sur un profil jetable et exécute douze vérifications à travers le vrai pont IPC. La CI le lance à chaque push.",
      ],
    },
  ],
  captions: [
    "La page Aujourd'hui : un bonjour avec la série, quatre éléments pour la journée, et les tâches de la semaine dans la barre latérale.",
    "L'éditeur sur la page de bienvenue, avec une case qui devient une tâche et deux lignes Terme :: Définition au-dessus de l'indication du bouton Cartes.",
    "La page Étude avec un paquet de trois cartes à réviser à gauche et le minuteur de concentration réglé sur 25 minutes à droite.",
    "Les notes d'une matière : deux évaluations sur l'échelle suisse avec leur pourcentage et une pondération, et la moyenne générale dans la barre latérale.",
  ],
  tags: ["Electron", "React", "TypeScript", "SQLite", "FSRS"],
  stats: [
    { value: "101", label: "tests unitaires" },
    { value: "12", label: "vérifications de bout en bout" },
    { value: "48", label: "gestionnaires IPC" },
    { value: "3", label: "plateformes" },
  ],
};

const zh: LocalizedContent = {
  tagline: "一个打开就告诉你今天该做什么的学习应用。",
  description:
    "一个桌面学习助手，包含笔记、任务、抽认卡和成绩，全部保存在你自己电脑上的一个 SQLite 文件里。笔记里的复选框会变成真正的任务，带 :: 的一行会变成一张抽认卡。",
  overview:
    "Inkling 是我为学习做的一个 Electron 应用。它有笔记、任务、带专注计时器的抽认卡，还有成绩，打开时是一个“今天”页面，从已有的内容里拼出一份简短的计划：到期的卡组、今天到期的任务、平均分最低的科目，以及一个专注时段。所有数据都在机器上的一个 SQLite 文件里，所以它可以离线使用，什么都不会离开这台电脑。最新版本 v0.6.0 支持 Windows、macOS 和 Linux，并通过 GitHub Releases 自动更新。",
  roleSummary: "只有我：数据模型、Electron 外壳、界面和发布流程。",
  sections: [
    {
      heading: "一页笔记喂给整个应用",
      body: [
        "Inkling 的出发点是：一件事只写一次。在笔记的行首输入 []，这个复选框就会作为真正的任务出现在“任务”标签里。在一行里写下 术语 :: 定义，编辑器里的抽认卡按钮就能把这些行变成一个卡组。",
        "任务和笔记是双向关联的。保存笔记时，每个复选框都通过写进文档里的 id 对应到它的任务行，新的插入，删掉的移除，全部在一个事务里完成。如果你在别处把任务勾掉，主进程会遍历这条笔记的文档，把那里的复选框也勾上。",
      ],
      figure: 1,
      code: {
        language: "ts",
        text: CHECKBOX_CODE,
        caption:
          "摘自 src/main/repos/tasks.ts。从任务回到笔记的那条路：找到带着这个任务 id 的复选框，只有真的有变化时才写回笔记。",
      },
    },
    {
      heading: "自己安排复习时间的抽认卡",
      body: [
        "复习基于 FSRS-4.5。它为每张卡记录两个值，稳定度和难度，并按照你仍有 90% 概率记得来安排每张卡。每个按钮在按下之前就显示它会带来的间隔，数字键 1 到 4 不用鼠标就能作答。",
        "每一次作答都写进一份永久的复习日志，“进度”页面从这份日志里读出保持率、复习次数和连续天数，所以这些数字是数出来的，不是估出来的。卡组旁边是一个专注计时器，可以关联到某个任务或卡组，它的分钟数也计入连续天数。",
      ],
      figure: 2,
    },
    {
      heading: "成绩按录入时的评分制保存",
      body: [
        "成绩按科目记录，可以用瑞士的 1 到 6 分制（4 分及格），也可以用百分比。评分制存在每一行上，所以之后切换显示方式，旧成绩也不会被重新解读。瑞士分数线性换算成百分比，所以 4.5 分会在它的权重旁边显示为 70%。",
        "每个科目都有加权平均分，侧栏里显示所有科目的总平均。平均分最低的科目，就是“今天”页面建议你多花时间的那一科。",
      ],
      figure: 3,
    },
    {
      heading: "本地优先，磁盘上的一个文件",
      body: [
        "所有数据都在一个 WAL 模式的 SQLite 数据库里。启动时先做一次检查点，再复制到备份文件夹，那里保留最近的五份。笔记、任务和卡组的搜索用的是 SQLite 的 FTS5，入口在 Ctrl K。",
        "渲染进程从不直接碰数据库。它开启了上下文隔离，关闭了 Node 集成，一切都经过 preload 桥里的 48 个 IPC 处理函数。",
      ],
    },
    {
      heading: "一个主要在做减法的版本",
      body: [
        "Inkling 几乎每件事都长出了第二种做法，所以 v0.6.0 每样只留一种。看板、话题标签、日记、wiki 链接、PDF 导出和一些设置都拿掉了，而笔记、任务、卡组、成绩和复习记录一样都没动。源代码从大约 9.8k 行减到 6.5k 行，编辑器改成打开页面时才加载，启动包从 1881 kB 降到 819 kB。",
        "同一个版本还修了一个单元测试永远看不到的 bug：全新安装打不开自己的数据库，因为新文件会被拿去跑一遍所有旧迁移，而那些迁移会碰到已经不存在的列。现在新数据库直接按当前结构创建，另外有一个冒烟测试，在一次性的配置目录上启动构建好的应用，通过真实的 IPC 桥跑十二项检查。CI 每次推送都会跑它。",
      ],
    },
  ],
  captions: [
    "“今天”页面：带连续天数的问候、当天的四项内容，以及侧栏里本周到期的任务。",
    "欢迎页里的编辑器：一个会变成任务的复选框，还有两行 术语 :: 定义，下面是关于抽认卡按钮的提示。",
    "学习页面：左边是一个有三张到期卡片的卡组，右边是设为 25 分钟的专注计时器。",
    "一个科目的成绩：两次瑞士分制的考核及其百分比和权重，侧栏里是总平均分。",
  ],
  tags: ["Electron", "React", "TypeScript", "SQLite", "FSRS"],
  stats: [
    { value: "101", label: "单元测试" },
    { value: "12", label: "端到端冒烟检查" },
    { value: "48", label: "IPC 处理函数" },
    { value: "3", label: "平台" },
  ],
};

export const inkling: Record<Language, LocalizedContent> = { en, de, fr, zh };
