import Lenis from "lenis";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { runWhileGliding } from "./lenis-frame-loop";

const FRAME = 1000 / 60;

/** A frame clock: callbacks wait in a queue until `frame()` runs them. */
let queue = new Map<number, FrameRequestCallback>();
let nextId = 1;
let now = 0;
let frameCount = 0;
/** Even frames by default; a test may make them uneven. */
let gapOf = (_n: number) => FRAME;
const frame = () => {
  now += gapOf(frameCount++);
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
    frameCount = 0;
    gapOf = () => FRAME;
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

  it("drifts from the endless loop by at most one frame's motion on uneven frames", () => {
    // 13 to 20 ms between frames, and a dropped frame every 37th. The endless
    // loop gives a glide's first frame whatever gap came before it, a dropped
    // frame included; here that frame gets the usual gap. On even frames the
    // two are the same (above). On uneven ones a glide runs ahead or behind by
    // the difference, at most the longest gap less the usual one, so the
    // distance is bounded by that time at the fastest speed of the script.
    gapOf = (n) => (n % 37 === 36 ? 2 * FRAME : FRAME + ((n * 7919) % 7) - 3);
    const endless = makeLenis();
    endlessLoop(endless.lenis);
    const expected = script(endless.lenis, endless.wrapper);

    queue = new Map();
    now = 0;
    frameCount = 0;
    const onDemand = makeLenis();
    runWhileGliding(onDemand.lenis);
    const actual = script(onDemand.lenis, onDemand.wrapper);

    let fastest = 0;
    let longest = 0;
    for (let i = 1; i < expected.length; i++) {
      fastest = Math.max(fastest, Math.abs(expected[i] - expected[i - 1]) / gapOf(i));
      longest = Math.max(longest, gapOf(i));
    }
    const worst = Math.max(...expected.map((y, i) => Math.abs(actual[i] - y)));
    expect(worst).toBeGreaterThan(0);
    expect(worst).toBeLessThanOrEqual(fastest * (longest - FRAME));
    expect(actual[actual.length - 1]).toBe(expected[expected.length - 1]);
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
