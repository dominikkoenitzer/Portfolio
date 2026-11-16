import { describe, expect, it } from "vitest";

import { QUIET_FOCUS, scrollToTop } from "./scroll-to-top";

function setup({ withMain = true } = {}) {
  const calls: string[] = [];
  const attributes = new Set<string>();
  const blurListeners = new Set<() => void>();
  let windowFocused = true;

  const main = withMain
    ? {
        ownerDocument: { hasFocus: () => windowFocused },
        focus: (options?: FocusOptions) => calls.push(`focus ${JSON.stringify(options)}`),
        hasAttribute: (name: string) => attributes.has(name),
        setAttribute: (name: string) => attributes.add(name),
        removeAttribute: (name: string) => attributes.delete(name),
        addEventListener: (type: string, listener: () => void) => {
          if (type === "blur") blurListeners.add(listener);
        },
        removeEventListener: (type: string, listener: () => void) => {
          if (type === "blur") blurListeners.delete(listener);
        },
      }
    : null;

  const start = () => calls.push("scroll");

  // A window or tab switch blurs main while the document loses focus with it.
  const blur = ({ windowAway = false } = {}) => {
    windowFocused = !windowAway;
    for (const listener of [...blurListeners]) listener();
    windowFocused = true;
  };

  return { main, start, calls, attributes, blurListeners, blur };
}

describe("scrollToTop", () => {
  it("moves focus to main without scrolling once the scroll has started", () => {
    const { main, start, calls } = setup();
    scrollToTop(start, main);
    expect(calls).toEqual(["scroll", 'focus {"preventScroll":true}']);
  });

  it("hides the ring on main only until main loses focus", () => {
    const { main, start, attributes, blur } = setup();
    scrollToTop(start, main);
    expect(attributes.has(QUIET_FOCUS)).toBe(true);
    blur();
    expect(attributes.has(QUIET_FOCUS)).toBe(false);
  });

  it("keeps the ring hidden across a window switch while main keeps focus", () => {
    const { main, start, attributes, blurListeners, blur } = setup();
    scrollToTop(start, main);
    blur({ windowAway: true });
    expect(attributes.has(QUIET_FOCUS)).toBe(true);
    blur();
    expect(attributes.has(QUIET_FOCUS)).toBe(false);
    expect(blurListeners.size).toBe(0);
  });

  it("adds one blur listener across repeated presses", () => {
    const { main, start, blurListeners } = setup();
    scrollToTop(start, main);
    scrollToTop(start, main);
    expect(blurListeners.size).toBe(1);
  });

  it("still scrolls when main is missing", () => {
    const { start, calls } = setup({ withMain: false });
    scrollToTop(start, null);
    expect(calls).toEqual(["scroll"]);
  });
});
