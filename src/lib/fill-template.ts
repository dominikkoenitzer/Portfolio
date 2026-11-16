/**
 * Puts `value` in for `{key}`, as typed. A string replacement would read `$&`,
 * `$$` and the like in a visitor's query as replacement patterns.
 */
export function fillTemplate(
  template: string,
  key: string,
  value: string,
): string {
  return template.replace(`{${key}}`, () => value);
}
