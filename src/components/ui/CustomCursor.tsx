import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { magnetRectOf } from "@/lib/cursor-magnet";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";

/**
 * CustomCursor — a free-stack re-implementation of Motion+ `<Cursor/>`.
 *
 * Motion+'s cursor is a paid component (`motion-plus`); this reproduces its
 * *behaviour* using only framer-motion v12 — no `motion-plus` import, no new
 * deps. It runs in "replace-default" mode: the native cursor is hidden globally
 * in index.css (`@media (pointer: fine){ *{cursor:none} }`) and we portal a
 * single custom element into <body> that follows the pointer and MORPHS to
 * context:
 *
 *   • DEFAULT  — a small solid dot in the theme accent, tracked with a snappy
 *                (responsive, lightly-smoothed) spring. The Motion feel: not
 *                floaty, but not a rigid 1:1 either.
 *   • MAGNETIC — over an interactive target (link/button/…), the dot SNAPS onto
 *                the target and morphs into a rounded rectangle matching its
 *                bounding rect (+padding) and border-radius, with a translucent
 *                accent fill and an inset accent ring so the label stays legible.
 *                A subtle magnetic PULL nudges the box from the target centre
 *                toward the real pointer for a tactile feel. It stays GLUED to
 *                the target during Lenis smooth-scroll and on resize.
 *   • CARET    — over non-input selectable text, morphs to a thin tall I-beam
 *                whose height is derived from the text's font/line metrics.
 *   • FIELD    — over a real form field it fades out (opacity 0) so the native
 *                I-beam (kept by index.css) owns the typing / selection / IME /
 *                blink affordance a synthetic caret can't represent.
 *   • PRESS    — scale dips on mousedown, restores on mouseup.
 *
 * ── Theme ──────────────────────────────────────────────────────────────────
 * Every colour is `hsl(var(--primary))`. The theme class lives on <html> and we
 * portal into <body>, so the CSS variable re-resolves automatically on theme
 * change with zero JS. Even the animated fill/ring alpha rides a motion value
 * composed INTO the colour string via `useMotionTemplate`, so it recolours for
 * free when the theme flips.
 *
 * ── Performance (hard requirement) ─────────────────────────────────────────
 * NOTHING on the move / hover / press / scroll path calls React setState.
 * Position, size, radius, fill/ring alpha, press and visibility all ride motion
 * values (useMotionValue / useSpring / useTransform / useMotionTemplate) and
 * animate only GPU-friendly transform / opacity / size. Visibility is a motion
 * value (not React state + AnimatePresence), so window-leave / blur / tab-hide /
 * form-field fades never re-render. The scroll-glue rAF loop runs ONLY while a
 * magnetic target is active and self-cancels the instant it isn't. The ONLY
 * React state is `enabled`: a one-shot mount gate flipped true after the first
 * real move (which also avoids the top-left mount flash). It never reverts, so
 * the element stays permanently mounted and the springs keep integrating.
 *
 * ── Robustness / SSR ───────────────────────────────────────────────────────
 * Renders nothing (return null) for reduced-motion or coarse/touch pointers —
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
 */
const INTERACTIVE_SELECTOR =
  'a, button:not(:disabled), [role="button"], [data-cursor], .cursor-pointer, [data-cursor-magnetic]';

// Real text-entry fields keep the native I-beam (restored via index.css). We
// fade out over them so the custom cursor and the native caret don't fight and
// the typing affordance is never lost.
const TEXT_FIELD_SELECTOR =
  'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"]';

// Non-input, text-bearing elements that earn the adaptive I-beam caret. Kept as
// a single string for the same cheap `closest()` walk; an empty-text guard in
// `caretHeightFor` filters icon-only elements so decorative markup stays a dot.
// `span` is deliberately omitted: real prose is wrapped in a block text tag that
// still matches via the ancestor walk, so a bare decorative <span> stays a dot.
const TEXT_SELECTOR =
  "p, h1, h2, h3, h4, h5, h6, li, blockquote, figcaption, dt, dd, code, pre, strong, em, small";

/** Snappy position spring — responsive, lightly smoothed, never floaty. */
const POS_SPRING = { stiffness: 620, damping: 34, mass: 0.55 } as const;
/** Slightly softer spring for the size/shape morph so it reads as a "melt". */
const SIZE_SPRING = { stiffness: 520, damping: 40, mass: 0.7 } as const;
/** Fill/ring alpha — smooth cross-fade between shapes. */
const ALPHA_SPRING = { stiffness: 500, damping: 40 } as const;
/** Press dip — snappy, settles fast. */
const SCALE_SPRING = { stiffness: 700, damping: 30, mass: 0.45 } as const;
/** Opacity fade for visibility / form-field hand-off — gentle, no overshoot. */
const FADE_SPRING = { stiffness: 420, damping: 40, mass: 1 } as const;

const DOT_SIZE = 9; // px — dot diameter at rest
const CARET_WIDTH = 2; // px — I-beam thickness
const MAGNET_PAD = 6; // px — padding added around the target rect
const MAGNET_PULL = 0.22; // 0..1 — how far the box drifts toward the pointer
const MAGNET_FILL = 0.16; // accent alpha of the translucent fill while snapped
const MAGNET_RING_W = 1.5; // px — inset accent ring while snapped
const MAGNET_RELEASE_MARGIN = 28; // px — pointer beyond rect ⇒ release the magnet
const PRESS_DIP = 0.2; // scale reduction on press (1 → 0.8)

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

export function CustomCursor() {
  // `enabled` gates the very first render: true only on a fine pointer AND after
  // the first real mousemove — this avoids the classic top-left mount flash.
  // Once true it never reverts, so the element stays mounted (springs keep
  // integrating) and the user is never left cursor-less (the native one is
  // hidden via global CSS). This is the ONLY React state.
  const [enabled, setEnabled] = useState(false);

  // Reduced motion is read once during render (synchronous, render-safe). When
  // true we render nothing at all — the CSS restores the native cursor.
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
  const fieldMV = useMotionValue(0); // 1 over a form field ⇒ fade to native I-beam
  const visMV = useMotionValue(0); // 0 hidden / 1 shown (window-leave, blur, tab)
  const press = useMotionValue(0); // 1 while the primary button is held

  // ── Springs (ALWAYS constructed — stable hook order) ──────────────────────
  const cx = useSpring(destX, POS_SPRING);
  const cy = useSpring(destY, POS_SPRING);
  const w = useSpring(destW, SIZE_SPRING);
  const h = useSpring(destH, SIZE_SPRING);
  const r = useSpring(destR, SIZE_SPRING);
  const fill = useSpring(destFill, ALPHA_SPRING);
  const ring = useSpring(destRing, ALPHA_SPRING);
  const pressSpring = useSpring(press, SCALE_SPRING);

  // The element is anchored by its top-left, so convert centre → corner using
  // the live (spring) size. Keeping it a transform (`x`/`y`) stays composited.
  const cornerX = useTransform([cx, w], ([c, ww]: number[]) => c - ww / 2);
  const cornerY = useTransform([cy, h], ([c, hh]: number[]) => c - hh / 2);
  // Press dip only — scales about the box centre.
  const scale = useTransform(pressSpring, (pv: number) => 1 - pv * PRESS_DIP);
  // Visibility × (not over a form field), spring-smoothed into one opacity.
  const opacityTarget = useTransform(
    [visMV, fieldMV],
    ([v, f]: number[]) => v * (1 - f),
  );
  const opacity = useSpring(opacityTarget, FADE_SPRING);
  // Colour re-resolves `--primary` from the live theme; alpha/width ride springs.
  const background = useMotionTemplate`hsl(var(--primary) / ${fill})`;
  const boxShadow = useMotionTemplate`inset 0 0 0 ${ring}px hsl(var(--primary) / 0.85)`;

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
    // false→true edge — never per-frame. Boundary handlers keep it in sync.
    let shown = false;
    // Whether the pointer is currently within the viewport. Tracked ONLY by
    // pointer boundary events (enter/move → true, leave → false); blur / tab-
    // hide deliberately do NOT change it, so a keyboard app-or-tab switch (the
    // pointer stays put over the page) can correctly re-show on refocus.
    let inside = false;

    // Visibility rides a motion value, so show/hide are cheap edge-guarded
    // writes — never React state, never per-frame.
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
      // Release on ANY degenerate rect (either axis collapsed) — a collapsed
      // accordion / max-height:0 target would otherwise render a thin sliver.
      if (width < 1 || height < 1) return false;
      const right = left + width;
      const bottom = top + height;

      const { x: pxp, y: pyp } = pointerRef.current;
      // Release if the pointer has drifted well outside the target — covers
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

    // The scroll-glue loop. Alive ONLY while a magnetic target is set; it reads
    // `rafRef` back to null before rescheduling so `ensureRaf` can restart it,
    // and self-cancels (no reschedule) the moment there's no target.
    function tick() {
      rafRef.current = null;
      const el = activeTargetRef.current;
      if (!el) return;
      if (!glueMagnet(el)) {
        releaseMagnet();
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
      fieldMV.set(0);
      destW.set(DOT_SIZE);
      destH.set(DOT_SIZE);
      destR.set(DOT_SIZE / 2);
    }
    function setCaretShape(height: number) {
      destFill.set(1);
      destRing.set(0);
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
      fieldMV.set(0);
      glueMagnet(el); // place it this frame — no one-frame lag
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
      const interactive = el ? el.closest(INTERACTIVE_SELECTOR) : null;
      if (interactive) {
        if (activeTargetRef.current !== interactive) enterMagnet(interactive);
        return; // centre + size are owned by the rAF glue loop
      }
      if (activeTargetRef.current) releaseMagnet();

      // 2) Real form field ⇒ fade out (native I-beam shows).
      const field = el ? el.closest(TEXT_FIELD_SELECTOR) : null;
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
        setEnabled(true);
      }
      showCursor();
      applyContext(e.target as Element | null);
    };

    // A canvas scene can't emit a real pointer move when its interactivity
    // changes under a STILL cursor (the object drifts under the pixel, not the
    // pixel onto the object). It toggles `.cursor-pointer` / a magnet rect and
    // fires a synthetic `mouseover`; re-evaluate here so the morph acquires or
    // releases without waiting for the user to jog the mouse. Real hovers are
    // already covered by `mousemove`, so only handle untrusted (synthetic) ones.
    const onOver = (e: MouseEvent) => {
      if (e.isTrusted || !hasMoved) return;
      applyContext(e.target as Element | null);
    };

    const onDown = () => press.set(1);
    const onUp = () => press.set(0);

    // Pointer physically left the viewport: mark it outside, release any magnet
    // (so re-entry starts fresh — never a stale box) and fade out.
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
    // signal — belt-and-suspenders with the mouseout check above.
    const onWindowLeave = () => pointerLeave();
    // Pointer re-entered the viewport (mouseenter carries coordinates): hard-sync
    // the position springs to the entry point so the dot lands exactly there —
    // no fade-in "streak" across from the stale last-exit position — then reveal.
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
    // coordinates and don't move the pointer, so we DON'T touch `inside` here —
    // a keyboard app/tab switch keeps the pointer where it was — and re-show at
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
      document.removeEventListener("mouseout", onWindowOut);
      window.removeEventListener("blur", onBlur);
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
    fieldMV,
    visMV,
    press,
    cx,
    cy,
  ]);

  // Reduced-motion / coarse-pointer users (and SSR) get nothing — the CSS
  // restores the native cursor. This is the ONLY opt-out; all hooks above ran
  // unconditionally, so hook order is stable across every render.
  if (!enabled || reduced || typeof document === "undefined") return null;

  // Portal to <body> so we share the stacking context of Radix popovers/menus
  // (which also portal to body at z-50); z-[9999] keeps the cursor above them.
  // The element stays permanently mounted; only `opacity` toggles visibility.
  return createPortal(
    <div className="pointer-events-none select-none" aria-hidden="true">
      <motion.div
        className="fixed left-0 top-0 z-[9999]"
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
