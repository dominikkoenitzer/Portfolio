/** True for an Escape meant for the overlay asking: nothing lay over it when the key went down. */
export function escapeCloses(
  event: Event & { key: string },
  isTopLayer: (event: Event) => boolean,
): boolean {
  return event.key === "Escape" && isTopLayer(event);
}
