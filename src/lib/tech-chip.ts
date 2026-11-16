import { fillTemplate } from "./fill-template";

/** The filter chip's text, with the technology from the address as typed. */
export function techChipText(template: string, tech: string): string {
  return fillTemplate(template, "tech", tech);
}
