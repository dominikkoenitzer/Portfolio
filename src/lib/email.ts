/**
 * The address is stored in two pieces and joined in the browser, so the served
 * HTML and the bundle never carry it as one string a scraper can match.
 */
const PARTS = ["dominik.koenitzer", "gmail.com"] as const;

export const email = (): string => PARTS.join(String.fromCharCode(64));

export const mailto = (query = ""): string => `mailto:${email()}${query}`;
