import Lenis from "lenis";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { runWhileGliding } from "./lenis-frame-loop";

const FRAME = 1000 / 60;

/** A frame clock: callbacks wait in a queue until `frame()` runs them. */
let queue = new Map<number, FrameRequestCallback>();
let nextId = 1;
let now = 0;
const frame = () => {
  now += FRAME;
  const due = queue;
  queue = new Map();
  for (const cb of due.values()) cb(now);
};

/** A scroll container with a fixed height, enough for Lenis to run in Node. */
function container() {
  const classes = new Set<string>();
  return {
    scrollTop: 0,
    scrollLeft: 0,
    clientWidth: 1000,
    clientHeight: 800,
    scrollWidth: 1000,
    scrollHeight: 6000,
    classList: {
      add: (c: string) => classes.add(c),
      remove: (...c: string[]) => c.forEach((x) => classes.delete(x)),
    },
    className: "",
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => true,
    scrollTo(options: { top?: number }) {
      if (options.top !== undefined) this.scrollTop = options.top;
    },
  };
}

function makeLenis() {
  const wrapper = container();
  const lenis = new Lenis({
    wrapper: wrapper as unknown as HTMLElement,
    content: wrapper as unknown as HTMLElement,
    autoResize: false,
    autoRaf: false,
    lerp: 0.085,
  });
  return { lenis, wrapper };
}

/** Lenis's own behaviour: a frame for the whole life of the page. */
function endlessLoop(lenis: Lenis) {
  const loop = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

/**
 * Rest, a wheel-like glide, a long rest, an eased glide, a stop mid-glide and
 * one more glide; the scroll position after every frame.
 */
function script(lenis: Lenis, wrapper: { scrollTop: number }) {
  const positions: number[] = [];
  const frames = (n: number) => {
    for (let i = 0; i < n; i++) {
      frame();
      positions.push(wrapper.scrollTop);
    }
  };
  frames(30);
  lenis.scrollTo(1000);
  frames(4);
  lenis.scrollTo(1400);
  frames(150);
  lenis.scrollTo(200, { duration: 1.2, easing: (t: number) => 1 - (1 - t) ** 4 });
  frames(120);
  lenis.scrollTo(3000);
  frames(10);
  lenis.stop();
  frames(5);
  lenis.start();
  lenis.scrollTo(2500);
  frames(120);
  return positions;
}

describe("runWhileGliding", () => {
  beforeEach(() => {
    queue = new Map();
    nextId = 1;
    now = 0;
    vi.stubGlobal("window", {
      matchMedia: () => ({ matches: false }),
      addEventListener() {},
      removeEventListener() {},
      innerWidth: 1000,
      innerHeight: 800,
    });
    vi.stubGlobal("document", { documentElement: {} });
    vi.stubGlobal("Window", class {});
    vi.stubGlobal("Element", class {});
    vi.stubGlobal("navigator", { userAgent: "" });
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      const id = nextId++;
      queue.set(id, cb);
      return id;
    });
    vi.stubGlobal("cancelAnimationFrame", (id: number) => queue.delete(id));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("scrolls exactly as Lenis's endless loop does", () => {
    const endless = makeLenis();
    endlessLoop(endless.lenis);
    const expected = script(endless.lenis, endless.wrapper);

    queue = new Map();
    now = 0;
    const onDemand = makeLenis();
    runWhileGliding(onDemand.lenis);
    const actual = script(onDemand.lenis, onDemand.wrapper);

    expect(actual).toHaveLength(expected.length);
    for (let i = 0; i < expected.length; i++) {
      expect(actual[i]).toBeCloseTo(expected[i], 6);
    }
    // the script reaches every target, so the comparison covers real glides
    expect(expected).toContain(1400);
    expect(expected[expected.length - 1]).toBe(2500);
  });

  it("asks for no frame while the page is at rest", () => {
    const { lenis } = makeLenis();
    runWhileGliding(lenis);
    for (let i = 0; i < 5; i++) frame();
    expect(queue.size).toBe(0);

    lenis.scrollTo(900);
    expect(queue.size).toBe(1);
    for (let i = 0; i < 200 && queue.size > 0; i++) frame();
    expect(queue.size).toBe(0);
    expect(lenis.isScrolling).toBe(false);
  });

  it("stops with the instance and gives scrollTo back", () => {
    const { lenis } = makeLenis();
    const original = lenis.scrollTo;
    const cancel = runWhileGliding(lenis);
    expect(lenis.scrollTo).not.toBe(original);
    cancel();
    expect(queue.size).toBe(0);
    expect(lenis.scrollTo).toBe(original);
  });
});
