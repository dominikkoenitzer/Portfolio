import { NoteDemo, ReviewDemo } from "../demos/inkling";
import type { Story } from "../types";

// From src/main/db.ts, trimmed where it names and lists the files.
const BACKUP = `function backup(d: Database.Database, file: string, dir: string): void {
  const backupsDir = join(dir, 'backups')
  fs.mkdirSync(backupsDir, { recursive: true })
  d.pragma('wal_checkpoint(TRUNCATE)')
  // …
  fs.copyFileSync(file, join(backupsDir, \`inkling-\${stamp}.db\`))
  // …
  while (files.length > 5) {
    const oldest = files.shift()!
    fs.unlinkSync(join(backupsDir, oldest))
  }
}`;

/** Inkling: a short case study, two live demos between real captures. */
export const story: Story = {
  lead: "A desktop study app for notes, to-dos and flashcards, kept in one file on your own computer.",
  hero: {
    name: "inkling-hero",
    width: 1600,
    height: 1000,
    alt: "Inkling's Today page: six open to-dos, each with the name of its note, and two decks with cards due",
    caption: "Today: the to-dos still open across all notes, and the decks with cards due.",
  },
  opening: [
    "Studying used to mean separate apps for notes, to-dos and flashcards that never knew about each other. In Inkling I only write notes, and the to-dos and cards are read out of them.",
    { Demo: NoteDemo },
  ],
  sections: [
    {
      id: "lines",
      heading: "A few characters turn a line into a to-do or a card",
      blocks: [
        "Each of these lines gets an id stamped into the note, so its to-do or card stays tied to it. Rewording a card's line updates the card and keeps its schedule. An id is never handed to another to-do, so cutting a line and pasting it back cannot swap two of them.",
        {
          points: [
            { term: "[ ]", text: "A to-do. It shows up on Today beside the name of its note." },
            { term: "::", text: "A card: the term before it on the front, the definition after it on the back." },
            { term: "{{c1::…}}", text: "A cloze card with that word blanked out. A c2 in the same line makes a second card." },
            { term: "Indent", text: "A line indented under a card line continues its answer." },
          ],
        },
      ],
    },
    {
      id: "review",
      heading: "Every answer shows the gap it buys",
      blocks: [
        "Reviews run on FSRS-6. It keeps a stability and a difficulty for each card and brings the card back when the chance of still remembering it has fallen to 90 percent. Each button shows its gap before I press it, and keys 1 to 4 answer without the mouse.",
        { Demo: ReviewDemo },
      ],
    },
    {
      id: "less",
      heading: "The theme is the one setting left",
      blocks: [
        "Version 0.8.0 took out the tasks tab, grades, the progress page, the focus timer, the streak and every setting except the theme. To-dos now live only in notes: the old tab's tasks moved into a note of their own, and no note, card or review was lost.",
        {
          pair: [
            {
              name: "inkling-editor",
              width: 1600,
              height: 1000,
              crop: [0.365, 0.05, 0.71, 0.41],
              alt: "A note called Biology: The cell in the light theme: three Term :: Definition lines and two to-dos, one ticked",
            },
            {
              name: "inkling-dark",
              width: 1600,
              height: 1000,
              crop: [0.365, 0.05, 0.71, 0.41],
              alt: "A maths note in the dark theme with two open to-dos",
            },
          ],
          caption: "The light and the dark theme on two notes: a toolbar, a title and its lines, nothing else.",
        },
      ],
    },
    {
      id: "local",
      heading: "One file on the computer",
      blocks: [
        "Everything lives in one SQLite file, copied into a backup on every start. The window never touches it: it runs sandboxed and asks the main process for everything. Started with --mcp, Inkling serves the same data to an AI assistant, which can search and write notes, tick to-dos and add cards.",
        {
          code: {
            file: "src/main/db.ts",
            text: BACKUP,
            caption: "The WAL is folded into the file before the copy, so a backup holds the last write; past five, the oldest goes.",
          },
        },
      ],
    },
  ],
};
