export type Phase = "idle" | "picker" | "ask" | "typing" | "typed";

/** What a key in the sign-in page does; Enter on a button other than Yes is left to that button. */
export function pickerKey(key: string, phase: Phase, onOtherButton: boolean): "close" | "yes" | "no" | null {
  if (key === "Escape" && (phase === "picker" || phase === "ask")) return "close";
  if (phase !== "ask") return null;
  if (key === "Enter") return onOtherButton ? null : "yes";
  if (key.toLowerCase() === "n") return "no";
  return null;
}
