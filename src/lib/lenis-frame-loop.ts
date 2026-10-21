import type Lenis from "lenis";

/** Frames on start that measure the frame interval before the first glide. */
const WARMUP_FRAMES = 3;

const median = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

/**
 * Runs a Lenis instance's frame loop only while it glides.
 *
 * Lenis's own loop (`autoRaf`) asks for a frame forever, also while the page
 * sits still, and on a slow phone every one of those frames is main-thread
 * work nobody sees. Here the loop starts in `scrollTo`, which every glide goes
 * through (a wheel step calls it from inside Lenis, the back-to-top button and
 * the in-page links call it directly), and ends on the frame the glide
 * settles. Keyboard, scrollbar and touch scrolling are native (`syncTouch` is
 * off) and never needed the loop.
 *
 * A glide has to come out exactly as under the endless loop. Lenis moves by
 * the time since its previous frame; after a rest that time would be the whole
 * rest, and the first step of the next glide would jump to the end. So the
 * first frame of each run is credited one frame interval, which is what the
 * endless loop would have had, taken as the median frame gap of the run
 * before (the first few frames after mount give the starting value).
 *
 * Returns the function that cancels the loop and gives `scrollTo` back.
 */
export function runWhileGliding(lenis: Lenis): () => void {
  let frame = 0;
  let previous = 0;
  let interval = 1000 / 60;
  let gaps: number[] = [];
  let warmup = WARMUP_FRAMES;

  const tick = (time: number) => {
    if (previous) gaps.push(time - previous);
    else lenis.time = time - interval;
    previous = time;
    lenis.raf(time);

    const gliding = lenis.isScrolling === "smooth";
    if (gliding || warmup > 0) {
      warmup = Math.max(0, warmup - 1);
      frame = requestAnimationFrame(tick);
      return;
    }

    frame = 0;
    previous = 0;
    if (gaps.length > 1) {
      const gap = median(gaps);
      // A hidden tab or a stalled frame says nothing about the display.
      if (gap > 2 && gap < 50) interval = gap;
    }
    gaps = [];
  };

  const wake = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  const scrollTo = lenis.scrollTo;
  lenis.scrollTo = (...args: Parameters<Lenis["scrollTo"]>) => {
    scrollTo.apply(lenis, args);
    wake();
  };
  wake();

  return () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    lenis.scrollTo = scrollTo;
  };
}
