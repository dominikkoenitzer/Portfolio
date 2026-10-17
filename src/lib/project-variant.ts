/**
 * Three layouts of the project page and list under consideration, picked with
 * `?v=a`, `?v=b` or `?v=c`. Without the parameter the pages render as before.
 */
export type ProjectVariant = "a" | "b" | "c";

export const readVariant = (value: string | null): ProjectVariant | null =>
  value === "a" || value === "b" || value === "c" ? value : null;
