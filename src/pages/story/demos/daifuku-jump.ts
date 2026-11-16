type Jump = {
  /** The last Jump found nobody to go to. */
  miss: boolean;
  /** How many agents Jump would go to now: the waiting ones and the failed ones. */
  needed: number;
  /** How many times Jump went somewhere. */
  visit: number;
  /** The demo Jump went to last, from 0, and the label of its state. */
  focus: number;
  label: string;
  waiting: number;
};

/** The jump demo's bar and whether the live region says it; a miss holds only while nobody needs you. */
export function jumpStatus({ miss, needed, visit, focus, label, waiting }: Jump): { text: string; announce: boolean } {
  if (miss && !needed) return { text: "Nobody needs you yet, so the focus stays where it is.", announce: true };
  if (visit) return { text: `On demo ${focus + 1}: ${label}.`, announce: true };
  if (waiting) return { text: `${waiting} waiting. Ctrl+Alt+N goes to the one that has waited longest.`, announce: false };
  return { text: "Six agents at work. Ctrl+Alt+N waits for one to need you.", announce: false };
}
