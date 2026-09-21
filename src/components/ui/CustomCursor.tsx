import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { coversViewport, magnetRectOf } from "@/lib/cursor-magnet";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";

/**
 * CustomCursor, a free-stack re-implementation of Motion+ `<Cursor/>`.
 *
 * Motion+'s cursor is a paid component (`motion-plus`); this reproduces its
 * *behaviour* using only framer-motion v12: no `motion-plus` import, no new
 * deps. It runs in "replace-default" mode: the native cursor is hidden globally
 * in index.css (`@media (pointer: fine){ *{cursor:none} }`) and we portal a
 * single custom element into <body> that follows the pointer and MORPHS to
 * context:
 *
 *   • DEFAULT: a small solid violet dot inside a thin sage ring (the portrait's
 *                eye: pupil and iris), tracked with a snappy (responsive,
 *                lightly-smoothed) spring. The Motion feel: not floaty, but not
 *                a rigid 1:1 either.
 *   • MAGNETIC: over an interactive target (link/button/…), the dot SNAPS onto
 *                the target and morphs into a rounded rectangle matching its
 *                bounding rect (+padding) and border-radius, with a translucent
 *                violet fill, an inset violet ring so the label stays legible,
 *                and the sage ring thinned around the outside.
 *                A subtle magnetic PULL nudges the box from the target centre
 *                toward the real pointer for a tactile feel. It stays GLUED to
 *                the target during Lenis smooth-scroll and on resize.
 *   • CARET: over non-input selectable text, morphs to a thin tall I-beam
 *                whose height is derived from the text's font/line metrics.
 *   • FIELD: over a real form field (or an iframe) it fades out (opacity 0)
 *                so the native cursor owns the typing / selection / IME / blink
 *                affordance a synthetic caret can't represent, and so a nested
 *                document that swallows the page's mouse events can't strand it.
 *   • PRESS: scale dips on mousedown, restores on mouseup.
 *
 * ── Theme ──────────────────────────────────────────────────────────────────
 * Every colour is `hsl(var(--primary))` or `hsl(var(--sage))`. The tokens live
 * on `:root` and we portal into <body>, so the CSS variables re-resolve
 * automatically with zero JS. Even the animated fill/ring/halo widths ride
 * motion values composed INTO the colour strings via `useMotionTemplate`.
 *
 * ── Performance (hard requirement) ─────────────────────────────────────────
 * NOTHING on the move / hover / press / scroll path calls React setState.
 * Position, size, radius, fill/ring alpha, press and visibility all ride motion
 * values (useMotionValue / useSpring / useTransform / useMotionTemplate) and
 * animate only GPU-friendly transform / opacity / size. Visibility is a motion
 * value (not React state + AnimatePresence), so window-leave / blur / tab-hide /
 * form-field fades never re-render. The scroll-glue rAF loop runs ONLY while a
 * magnetic target is active and self-cancels the instant it isn't. There is no
 * React state at all: the element mounts with the component and hides itself
 * with `opacity: 0` until the first real move, which is what keeps the springs
 * attached; see the note on the opacity spring below.
 *
 * ── Robustness / SSR ───────────────────────────────────────────────────────
 * Renders nothing (return null) for reduced-motion or coarse/touch pointers,
 * the CSS restores the native cursor in those cases. All window/document access
 * is inside the effect or guarded, so SSR never crashes. Springs are ALWAYS
 * constructed (stable hook order); the reduced-motion opt-out is the render-time
 * `return null`, never a conditionally-called hook. Every listener is cleaned up
 * and the rAF is cancelled on unmount. Magnetic mode is defensively released
 * when its target unmounts, collapses to zero size, or the pointer strays well
 * outside it (scroll-away, gaps, nested/disabled elements).
 */

/**
 * Elements that trigger the magnetic morph. One string so the per-event
 * `closest()` is a single cheap ancestor walk. `:not(:disabled)` skips disabled
 * buttons (no affordance to advertise); `[data-cursor-magnetic]` is an explicit
 * opt-in hook for arbitrary elements.
 *
 * `[data-cursor-ignore]` is the opt-out, and it exists because a dialog's
 * click-to-dismiss backdrop is a real `<button>` the size of the viewport: over
 * the dimmed area beside an open panel the morph took the whole page (measured
 * at 1498 x 819 with the CV preview open), which advertises nothing and reads
 * as the cursor losing track of the pointer. A backdrop is a click target with
 * no shape to snap to, so it opts out and the pointer stays a dot over it.
 */
const INTERACTIVE_SELECTOR =
  ':is(a, button:not(:disabled), [role="button"], [data-cursor], .cursor-pointer, [data-cursor-magnetic]):not([data-cursor-ignore])';

// Real text-entry fields keep the native I-beam (restored via index.css). We
// fade out over them so the custom cursor and the native caret don't fight and
// the typing affordance is never lost.
const TEXT_FIELD_SELECTOR =
  'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"]';

// A nested document owns its own pointer: once the cursor is over an iframe the
// page stops getting mouse events entirely (measured: one `mouseover` on the
// frame, then nothing), so the custom element would freeze mid-page and sit
// there, visible, while the real pointer moves inside the frame. Fade out for
// the same reason as a form field and let the frame's native cursor take over.
const NESTED_DOCUMENT_SELECTOR = "iframe, embed, object";

// Non-input, text-bearing elements that earn the adaptive I-beam caret. Kept as
// a single string for the same cheap `closest()` walk; an empty-text guard in
// `caretHeightFor` filters icon-only elements so decorative markup stays a dot.
// `span` is deliberately omitted: real prose is wrapped in a block text tag that
// still matches via the ancestor walk, so a bare decorative <span> stays a dot.
const TEXT_SELECTOR =
  "p, h1, h2, h3, h4, h5, h6, li, blockquote, figcaption, dt, dd, code, pre, strong, em, small";

/** Snappy position spring: responsive, lightly smoothed, never floaty. */
const POS_SPRING = { stiffness: 620, damping: 34, mass: 0.55 } as const;
/** Slightly softer spring for the size/shape morph so it reads as a "melt". */
const SIZE_SPRING = { stiffness: 520, damping: 40, mass: 0.7 } as const;
/** Fill/ring alpha: smooth cross-fade between shapes. */
const ALPHA_SPRING = { stiffness: 500, damping: 40 } as const;
/** Press dip: snappy, settles fast. */
const SCALE_SPRING = { stiffness: 700, damping: 30, mass: 0.45 } as const;
/** Opacity fade for visibility / form-field hand-off, gentle, no overshoot. */
const FADE_SPRING = { stiffness: 420, damping: 40, mass: 1 } as const;

const DOT_SIZE = 8; // px, pupil diameter at rest (the halo sits outside it)
const HALO_W = 2; // px, outer sage ring around the dot: the iris of the eye
const CARET_WIDTH = 2; // px, I-beam thickness
const MAGNET_PAD = 6; // px, padding added around the target rect
const MAGNET_PULL = 0.22; // 0..1, how far the box drifts toward the pointer
const MAGNET_FILL = 0.16; // accent alpha of the translucent fill while snapped
const MAGNET_RING_W = 1.5; // px, inset accent ring while snapped
const MAGNET_HALO_W = 1.5; // px, the sage ring, thinner, around a snapped box
const MAGNET_RELEASE_MARGIN = 28; // px, pointer beyond rect ⇒ release the magnet
const PRESS_DIP = 0.2; // scale reduction on press (1 → 0.8)
/**
 * Frames between hit-tests that confirm the snapped target is still the topmost
 * thing under the pointer. A rect alone cannot tell that something has been
 * drawn over it, so the glue loop would happily keep painting the box on top of
 * a modal the click just opened. Every fourth frame is imperceptible (~66ms)
 * and costs one `elementFromPoint` in a loop that already reads layout.
 */
const OCCLUSION_EVERY = 4;
/**
 * Frames of per-frame hit-testing after a press. A click is what usually drops
 * an overlay over the target, and React needs a frame or two to mount it, so
 * the release has to be watched for rather than checked once.
 */
const OCCLUSION_BURST = 20;

/** Border-radius of a magnetic target: `pct` pills round to half the short side. */
type MagnetRadius = { pct: boolean; px: number };

/** Derive a pleasant I-beam height from a text element's font/line metrics. */
function readCaretHeight(el: Element): number {
  const cs = getComputedStyle(el);
  const fontSize = parseFloat(cs.fontSize) || 16;
  const lhRaw = cs.lineHeight;
  const lineHeight =
    lhRaw === "normal" ? fontSize * 1.2 : parseFloat(lhRaw) || fontSize * 1.2;
  // An I-beam a touch shorter than the full line height reads best.
  return Math.max(12, Math.min(lineHeight, fontSize * 1.3));
}

const clamp = (v: number, lo: number, hi: number) =>
  v < lo ? lo : v > hi ? hi : v;

/**
 * A fine pointer means a mouse or trackpad. Read during render, like
 * `prefersReducedMotion`: a synchronous media-query read is render-safe.
 */
const hasFinePointer = (): boolean =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(pointer: fine)").matches;

export function CustomCursor() {
  // Both read during render (synchronous media-query reads, render-safe). On a
  // coarse pointer or with reduced motion we render nothing and the CSS leaves
  // the native cursor alone.
  const fine = hasFinePointer();

  // Reduced motion is read once during render (synchronous, render-safe). When
  // true we render nothing at all: the CSS restores the native cursor.
  const reduced = prefersReducedMotion();

  // ── Raw motion values (written imperatively, never re-render React) ────────
  // Destination centre, size, radius, fill/ring alpha and visibility; the
  // springs below chase these. Initialised to the resting dot so nothing
  // "grows in" on first paint.
  const destX = useMotionValue(-100);
  const destY = useMotionValue(-100);
  const destW = useMotionValue(DOT_SIZE);
  const destH = useMotionValue(DOT_SIZE);
  const destR = useMotionValue(DOT_SIZE / 2);
  const destFill = useMotionValue(1); // accent alpha of the fill (dot/caret = 1)
  const destRing = useMotionValue(0); // inset ring width in px (only magnetic > 0)
  const destHalo = useMotionValue(HALO_W); // outer sage ring width in px (0 for the caret)
  const fieldMV = useMotionValue(0); // 1 over a form field ⇒ fade to native I-beam
  const visMV = useMotionValue(0); // 0 hidden / 1 shown (window-leave, blur, tab)
  const press = useMotionValue(0); // 1 while the primary button is held

  // ── Springs (ALWAYS constructed: stable hook order) ──────────────────────
  const cx = useSpring(destX, POS_SPRING);
  const cy = useSpring(destY, POS_SPRING);
  const w = useSpring(destW, SIZE_SPRING);
  const h = useSpring(destH, SIZE_SPRING);
  const r = useSpring(destR, SIZE_SPRING);
  const fill = useSpring(destFill, ALPHA_SPRING);
  const ring = useSpring(destRing, ALPHA_SPRING);
  const halo = useSpring(destHalo, ALPHA_SPRING);
  const pressSpring = useSpring(press, SCALE_SPRING);

  // The element is anchored by its top-left, so convert centre → corner using
  // the live (spring) size. Keeping it a transform (`x`/`y`) stays composited.
  const cornerX = useTransform([cx, w], ([c, ww]: number[]) => c - ww / 2);
  const cornerY = useTransform([cy, h], ([c, hh]: number[]) => c - hh / 2);
  // Press dip only: scales about the box centre.
  const scale = useTransform(pressSpring, (pv: number) => 1 - pv * PRESS_DIP);
  // Visibility × (not over a form field), spring-smoothed into one opacity.
  const opacityTarget = useTransform(
    [visMV, fieldMV],
    ([v, f]: number[]) => v * (1 - f),
  );
  /*
   * The element must be mounted before this spring is ever given a target.
   * It used to be gated behind a `return null` until the first mousemove, the
   * same event that revealed the cursor, so the 0 → 1 arrived with nothing
   * rendered to drive it: the spring ticked once to ~0.006 and stalled there
   * forever, leaving the site with no cursor at all (the native one is hidden
   * globally). Mounting unconditionally costs an invisible 9px div parked
   * off-screen at -100,-100 and keeps the spring attached from the first frame.
   */
  const opacity = useSpring(opacityTarget, FADE_SPRING);
  // Colours re-resolve the tokens from the live theme; alpha/width ride springs.
  // Violet pupil, sage halo: the portrait's eye at twelve pixels. The halo is
  // the second box-shadow, so it composes with the magnet's inset ring.
  const background = useMotionTemplate`hsl(var(--primary) / ${fill})`;
  const boxShadow = useMotionTemplate`inset 0 0 0 ${ring}px hsl(var(--primary) / 0.85), 0 0 0 ${halo}px hsl(var(--sage))`;

  // ── Refs: hot-path state that must NOT trigger React renders ───────────────
  const pointerRef = useRef({ x: -100, y: -100 });
  const activeTargetRef = useRef<Element | null>(null); // current magnetic target
  const magnetRadiusRef = useRef<MagnetRadius | null>(null); // its cached radius
  const rafRef = useRef<number | null>(null); // scroll-glue loop id (null = idle)
  const lastTextElRef = useRef<Element | null>(null); // caret-metric cache key
  const lastCaretHRef = useRef(0); // cached caret height (0 = not text-bearing)

  useEffect(() => {
    // Activate only for fine pointers (mouse/trackpad) and non-reduced motion.
    // On coarse/touch or reduced-motion the native cursor stays and we render
    // nothing (the early `return null` below also guards render).
    if (
      typeof window === "undefined" ||
      !window.matchMedia("(pointer: fine)").matches ||
      reduced
    ) {
      return;
    }

    let hasMoved = false;
    // Mirror of visibility so the move path only ever writes visMV on a real
    // false→true edge: never per-frame. Boundary handlers keep it in sync.
    let shown = false;
    // Whether the pointer is currently within the viewport. Tracked ONLY by
    // pointer boundary events (enter/move → true, leave → false); blur / tab-
    // hide deliberately do NOT change it, so a keyboard app-or-tab switch (the
    // pointer stays put over the page) can correctly re-show on refocus.
    let inside = false;
    // Occlusion-check bookkeeping for the glue loop, see the constants above.
    let occlusionFrame = 0;
    let occlusionBurst = 0;

    // Visibility rides a motion value, so show/hide are cheap edge-guarded
    // writes, never React state, never per-frame.
    const showCursor = () => {
      if (hasMoved && !shown) {
        shown = true;
        visMV.set(1);
      }
    };
    const hideCursor = () => {
      if (shown) {
        shown = false;
        visMV.set(0);
      }
      press.set(0);
    };

    // Recompute the magnetic box from the target's LIVE rect. This is the glue
    // that keeps the morph on the target during Lenis smooth-scroll and resize.
    // Returns false when the magnet should be released (target gone / collapsed
    // / pointer strayed far outside) so the caller can fall back to a dot.
    function glueMagnet(el: Element): boolean {
      if (!el.isConnected) return false;
      // A target can stop being interactive while the pointer rests on it: the
      // contact form disables its submit button for the length of the request,
      // and the box went on advertising a control that no longer takes a click
      // (the rect, the connection and the hit-test all still pass).
      if (!el.matches(INTERACTIVE_SELECTOR)) return false;

      // Prefer an override sub-rect (e.g. the hovered services leaf) over the
      // element's bounding box. `undefined` ⇒ no override; explicit `null` ⇒ the
      // override source is active but has no live target ⇒ release the morph.
      const override = magnetRectOf(el);
      let left: number;
      let top: number;
      let width: number;
      let height: number;
      if (override !== undefined) {
        if (!override) return false;
        ({ left, top, width, height } = override);
      } else {
        const rect = el.getBoundingClientRect();
        left = rect.left;
        top = rect.top;
        width = rect.width;
        height = rect.height;
      }
      // Release on ANY degenerate rect (either axis collapsed), a collapsed
      // accordion / max-height:0 target would otherwise render a thin sliver.
      if (width < 1 || height < 1) return false;
      // And on the opposite degenerate case: a target that has grown to the
      // size of the page is the page. Releasing here cannot loop, because
      // `applyContext` refuses to re-acquire it on the way back down.
      if (
        coversViewport({ width, height }, window.innerWidth, window.innerHeight)
      ) {
        return false;
      }
      const right = left + width;
      const bottom = top + height;

      const { x: pxp, y: pyp } = pointerRef.current;
      // Release if the pointer has drifted well outside the target, covers
      // scroll-away, gaps between elements, and cases where mouseout never fires.
      if (
        pxp < left - MAGNET_RELEASE_MARGIN ||
        pxp > right + MAGNET_RELEASE_MARGIN ||
        pyp < top - MAGNET_RELEASE_MARGIN ||
        pyp > bottom + MAGNET_RELEASE_MARGIN
      ) {
        return false;
      }

      const boxW = width + MAGNET_PAD * 2;
      const boxH = height + MAGNET_PAD * 2;
      const centreX = left + width / 2;
      const centreY = top + height / 2;
      // Magnetic pull: base at the centre, nudged toward the pointer, but clamped
      // inside the target so the box never slides off it.
      const nudgedX = clamp(centreX + (pxp - centreX) * MAGNET_PULL, left, right);
      const nudgedY = clamp(centreY + (pyp - centreY) * MAGNET_PULL, top, bottom);

      const maxR = Math.min(boxW, boxH) / 2;
      const rad = magnetRadiusRef.current;
      const radius = rad?.pct
        ? maxR
        : Math.min((rad?.px ?? 0) + MAGNET_PAD, maxR);

      destX.set(nudgedX);
      destY.set(nudgedY);
      destW.set(boxW);
      destH.set(boxH);
      destR.set(radius);
      return true;
    }

    /**
     * True when the snapped target is no longer what the pointer would hit.
     * Opening a modal over the target leaves its rect exactly where it was, so
     * the geometry checks in `glueMagnet` all still pass and the box goes on
     * drawing over the overlay until the pointer moves. One hit-test settles it:
     * the target counts as reachable when it is the topmost element, contains
     * it, or is contained by it (the pointer sitting in a parent's padding,
     * inside the release margin, is still a hover).
     */
    function isOccluded(el: Element): boolean {
      const { x, y } = pointerRef.current;
      const top = document.elementFromPoint(x, y);
      if (!top) return true; // nothing hit ⇒ pointer is off-viewport
      return !(top === el || el.contains(top) || top.contains(el));
    }

    // The scroll-glue loop. Alive ONLY while a magnetic target is set; it reads
    // `rafRef` back to null before rescheduling so `ensureRaf` can restart it,
    // and self-cancels (no reschedule) the moment there's no target.
    function tick() {
      rafRef.current = null;
      const el = activeTargetRef.current;
      if (!el) return;

      occlusionFrame += 1;
      const due = occlusionBurst > 0 || occlusionFrame >= OCCLUSION_EVERY;
      if (occlusionBurst > 0) occlusionBurst -= 1;
      if (due) {
        occlusionFrame = 0;
        if (isOccluded(el)) {
          releaseMagnet();
          // Re-read context from whatever is now on top: the pointer has not
          // moved, so nothing else would, and a modal's own button under the
          // pointer deserves the morph the covered element just lost.
          const { x, y } = pointerRef.current;
          applyContext(document.elementFromPoint(x, y));
          return;
        }
      }

      if (!glueMagnet(el)) {
        releaseMagnet();
        // Re-read what is under the pointer, exactly as the occlusion branch
        // above does. Without it a release could never be undone while the
        // pointer sat still: the contact form's submit button drops the magnet
        // when it disables itself for the request, and re-enabling it left a
        // plain dot sitting on a live primary action until the mouse moved.
        const { x, y } = pointerRef.current;
        applyContext(document.elementFromPoint(x, y));
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    function ensureRaf() {
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(tick);
    }

    // ── Shape setters (pure motion-value writes) ─────────────────────────────
    function setDotShape() {
      destFill.set(1);
      destRing.set(0);
      destHalo.set(HALO_W);
      fieldMV.set(0);
      destW.set(DOT_SIZE);
      destH.set(DOT_SIZE);
      destR.set(DOT_SIZE / 2);
    }
    function setCaretShape(height: number) {
      destFill.set(1);
      destRing.set(0);
      // A haloed I-beam is a 6px pill, not a caret: the ring goes with the dot.
      destHalo.set(0);
      fieldMV.set(0);
      destW.set(CARET_WIDTH);
      destH.set(height);
      destR.set(1);
    }
    function setFieldShape() {
      // Fade out (native I-beam shows) but keep the dot geometry underneath so
      // leaving the field morphs back cleanly.
      fieldMV.set(1);
      destFill.set(1);
      destRing.set(0);
      destHalo.set(HALO_W);
      destW.set(DOT_SIZE);
      destH.set(DOT_SIZE);
      destR.set(DOT_SIZE / 2);
    }

    // Cached caret height per text element: returns >0 for text-bearing elements
    // (I-beam) and 0 for empty/icon-only ones (fall back to a dot). Only reads
    // computed style / textContent when the element under the pointer changes.
    function caretHeightFor(el: Element): number {
      if (el === lastTextElRef.current) return lastCaretHRef.current;
      lastTextElRef.current = el;
      const txt = el.textContent;
      const height = txt && txt.trim().length > 0 ? readCaretHeight(el) : 0;
      lastCaretHRef.current = height;
      return height;
    }

    function enterMagnet(el: Element) {
      activeTargetRef.current = el;
      // Read the target radius ONCE (constant while hovered); pills (percentage
      // radii) round to half the short side each frame from the live rect. An
      // override target (a round services leaf on a square-cornered <canvas>)
      // has no meaningful CSS radius, so treat it as a pill for a snug halo.
      if (magnetRectOf(el) !== undefined) {
        magnetRadiusRef.current = { pct: true, px: 0 };
      } else {
        const cs = getComputedStyle(el);
        const rr = cs.borderTopLeftRadius;
        magnetRadiusRef.current = rr.includes("%")
          ? { pct: true, px: 0 }
          : { pct: false, px: parseFloat(rr) || 0 };
      }
      destFill.set(MAGNET_FILL);
      destRing.set(MAGNET_RING_W);
      destHalo.set(MAGNET_HALO_W);
      fieldMV.set(0);
      occlusionFrame = 0;
      occlusionBurst = 0;
      glueMagnet(el); // place it this frame, no one-frame lag
      ensureRaf();
    }
    // Drop magnetic mode and fall back to a dot at the current pointer; the next
    // move re-evaluates context. Never touches React state.
    function releaseMagnet() {
      activeTargetRef.current = null;
      magnetRadiusRef.current = null;
      setDotShape();
      destX.set(pointerRef.current.x);
      destY.set(pointerRef.current.y);
    }

    // ── Listeners ─────────────────────────────────────────────────────────────
    // Resolve what's under the pointer and morph accordingly. Free (non-magnetic)
    // modes read the position from `pointerRef`, so this can also be driven by a
    // synthetic `mouseover` that carries no coordinates (see `onOver`).
    const applyContext = (el: Element | null) => {
      // 1) Magnetic wins over everything (e.g. a link inside a paragraph).
      const candidate = el ? el.closest(INTERACTIVE_SELECTOR) : null;
      // …unless the candidate spans the viewport, which no control does and
      // every dialog backdrop does. Measured only when the target changes, so
      // the per-move path keeps its one `closest()` and no layout read; while
      // the pointer rests on a snapped target the glue loop owns the geometry
      // and re-checks it there.
      const interactive =
        candidate &&
        candidate !== activeTargetRef.current &&
        coversViewport(
          magnetRectOf(candidate) ?? candidate.getBoundingClientRect(),
          window.innerWidth,
          window.innerHeight,
        )
          ? null
          : candidate;
      if (interactive) {
        if (activeTargetRef.current !== interactive) enterMagnet(interactive);
        return; // centre + size are owned by the rAF glue loop
      }
      if (activeTargetRef.current) releaseMagnet();

      // 2) Real form field, or a nested document ⇒ fade out (the native
      //    cursor shows).
      const field = el
        ? el.closest(`${TEXT_FIELD_SELECTOR}, ${NESTED_DOCUMENT_SELECTOR}`)
        : null;
      if (field) {
        setFieldShape();
      } else {
        // 3) Non-input selectable text ⇒ adaptive caret; else 4) default dot.
        const textEl = el ? el.closest(TEXT_SELECTOR) : null;
        const caretH = textEl ? caretHeightFor(textEl) : 0;
        if (caretH > 0) setCaretShape(caretH);
        else setDotShape();
      }

      // Free (non-magnetic) modes track the pointer directly.
      destX.set(pointerRef.current.x);
      destY.set(pointerRef.current.y);
    };

    const onMove = (e: MouseEvent) => {
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;
      inside = true;

      if (!hasMoved) {
        hasMoved = true;
        // Land exactly on the pointer: jump the position springs so the cursor
        // never "flies in" from the -100 origin on its first appearance.
        destX.set(e.clientX);
        destY.set(e.clientY);
        cx.jump(e.clientX);
        cy.jump(e.clientY);
      }
      showCursor();
      applyContext(e.target as Element | null);
    };

    // `mousemove` is not the only way the thing under the pointer changes: a
    // scroll, a resize, an overlay opening and a canvas scene re-hit-testing
    // all move content under a STILL cursor, and none of them emit a move. The
    // browser does fire a trusted `mouseover` for every one of them (measured:
    // 8 of them across one wheel scroll), so this is what keeps the morph in
    // sync when the page moves instead of the mouse. Synthetic (untrusted)
    // `mouseover`s from the canvas scenes carry no coordinates and are handled
    // here too; both read the position from `pointerRef`, which is still
    // correct precisely because the pointer has not moved.
    const onOver = (e: MouseEvent) => {
      if (!hasMoved) return;
      applyContext(e.target as Element | null);
    };

    // A press is the usual way an overlay lands on top of the snapped target, so
    // both edges arm a short burst of per-frame occlusion checks (see `tick`).
    const onDown = () => {
      press.set(1);
      occlusionBurst = OCCLUSION_BURST;
    };
    const onUp = () => {
      press.set(0);
      occlusionBurst = OCCLUSION_BURST;
    };

    // Chrome turns a mousedown on a link or an image into a native drag, and
    // from that moment the page sees no mousemove and no mouseup at all. The
    // morph stayed parked on the link while the pointer travelled away, and the
    // press dip outlived the drop, leaving the whole cursor a fifth too small
    // until the next click anywhere. `dragstart` is the last event before the
    // blackout, `dragend` the first one after it, and `dragend` carries the
    // release coordinates.
    const onDragStart = () => {
      press.set(0);
      if (activeTargetRef.current) releaseMagnet();
      hideCursor();
    };
    const onDragEnd = (e: DragEvent) => {
      press.set(0);
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;
      destX.set(e.clientX);
      destY.set(e.clientY);
      cx.jump(e.clientX);
      cy.jump(e.clientY);
      showCursor();
      applyContext(document.elementFromPoint(e.clientX, e.clientY));
    };
    // A native context menu can swallow the mouseup that would clear the dip.
    const onContextMenu = () => press.set(0);

    // Pointer physically left the viewport: mark it outside, release any magnet
    // (so re-entry starts fresh: never a stale box) and fade out.
    const pointerLeave = () => {
      inside = false;
      if (activeTargetRef.current) releaseMagnet();
      hideCursor();
    };
    // `relatedTarget` is null on a document-level mouseout when the pointer
    // exits the viewport (not just crosses between elements).
    const onWindowOut = (e: MouseEvent) => {
      if (!e.relatedTarget) pointerLeave();
    };
    // `mouseleave` on <html> is a reliable non-bubbling "left the viewport"
    // signal, belt-and-suspenders with the mouseout check above.
    const onWindowLeave = () => pointerLeave();
    // Pointer re-entered the viewport (mouseenter carries coordinates): hard-sync
    // the position springs to the entry point so the dot lands exactly there,
    // no fade-in "streak" across from the stale last-exit position, then reveal.
    const onWindowEnter = (e: MouseEvent) => {
      inside = true;
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;
      destX.set(e.clientX);
      destY.set(e.clientY);
      cx.jump(e.clientX);
      cy.jump(e.clientY);
      showCursor();
    };

    // Window/tab focus changes hide the cursor in the background and re-show it
    // on return IF the pointer is still over the page. These events carry no
    // coordinates and don't move the pointer, so we DON'T touch `inside` here,
    // a keyboard app/tab switch keeps the pointer where it was, and re-show at
    // the last position without repositioning (no streak, no stale reveal when
    // the pointer had genuinely left the viewport first).
    const onBlur = () => hideCursor();
    const onFocus = () => {
      if (inside) showCursor();
    };
    const onVisibility = () => {
      if (document.hidden) hideCursor();
      else if (inside) showCursor();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });
    window.addEventListener("dragstart", onDragStart, { passive: true });
    window.addEventListener("dragend", onDragEnd, { passive: true });
    window.addEventListener("contextmenu", onContextMenu, { passive: true });
    document.addEventListener("mouseout", onWindowOut, { passive: true });
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    document.documentElement.addEventListener("mouseleave", onWindowLeave);
    document.documentElement.addEventListener("mouseenter", onWindowEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("dragstart", onDragStart);
      window.removeEventListener("dragend", onDragEnd);
      window.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("mouseout", onWindowOut);
      window.removeEventListener("blur-sm", onBlur);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      document.documentElement.removeEventListener("mouseleave", onWindowLeave);
      document.documentElement.removeEventListener("mouseenter", onWindowEnter);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      activeTargetRef.current = null;
    };
  }, [
    reduced,
    destX,
    destY,
    destW,
    destH,
    destR,
    destFill,
    destRing,
    destHalo,
    fieldMV,
    visMV,
    press,
    cx,
    cy,
  ]);

  // Reduced-motion / coarse-pointer users (and SSR) get nothing, the CSS
  // restores the native cursor. This is the ONLY opt-out; all hooks above ran
  // unconditionally, so hook order is stable across every render.
  if (!fine || reduced || typeof document === "undefined") return null;

  // Portal to <body> so we share the stacking context of Radix popovers/menus
  // (which also portal to body at z-50); z-9999 keeps the cursor above them.
  // The element stays permanently mounted; only `opacity` toggles visibility.
  return createPortal(
    <div className="pointer-events-none select-none" aria-hidden="true">
      <motion.div
        className="fixed left-0 top-0 z-9999"
        style={{
          x: cornerX,
          y: cornerY,
          width: w,
          height: h,
          borderRadius: r,
          backgroundColor: background,
          boxShadow,
          scale,
          opacity,
        }}
      />
    </div>,
    document.body,
  );
}
