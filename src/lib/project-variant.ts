/**
 * Layouts of the project page and list under consideration, picked with
 * `?v=a`, `?v=b`, `?v=c`, `?v=d` or `?v=e` (d and e exist for the project page only).
 * Without the parameter the pages render as before.
 */
export type ProjectVariant = "a" | "b" | "c" | "d" | "e";

export const readVariant = (value: string | null): ProjectVariant | null =>
  value === "a" || value === "b" || value === "c" || value === "d" || value === "e"
    ? value
    : null;
