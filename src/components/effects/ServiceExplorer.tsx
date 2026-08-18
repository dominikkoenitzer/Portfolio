import { useEffect, useRef } from "react";
import * as THREE from "three";
import { buildSapling } from "@/components/effects/service-tree/build";
import { clamp, easeOutCubic, lerpAngle } from "@/components/effects/service-tree/easing";
import { HUBS } from "@/components/effects/service-tree/layout";
import {
  SERVICE_TREE_THEMES,
  type ServiceTreeTheme,
} from "@/components/effects/service-tree/theme";
import type {
  BranchCat,
  Category,
  ServiceTreeNode,
} from "@/components/effects/service-tree/types";
import { setCursorMagnetRect } from "@/lib/cursor-magnet";

/**
 * ServiceExplorer — the Services page rendered AS a glowing 3D skill-tree
 * sapling (raw three.js). A mint trunk grows up from a seed, forks into three
 * category boughs (Build / Protect / Grow), and each service sits at a branch
 * tip as a leaf with its icon baked in. The tree grows in on first view, sways
 * like a young plant, auto-rotates when idle, and responds to drag + mouse
 * parallax; the category tabs fly the camera to a bough and dim the rest.
 * Hovering a leaf shows a tooltip; clicking one reports its key via `onSelect`
 * so the section pops a detail card; clicking empty space calls `onSelect(null)`.
 *
 * This is a 1:1 port of the handoff prototype's imperative three.js (the growth
 * draw-range reveal, hand-rolled spherical fly-to camera, and per-frame dimming
 * map far more naturally to an imperative `useEffect` than to a declarative r3f
 * scene graph). Default-exported for React.lazy (desktop + motion only).
 */

interface ServiceExplorerProps {
  nodes: ServiceTreeNode[];
  activeCategory: Category;
  selectedKey: string | null;
  designTheme: ServiceTreeTheme;
  autoRotate?: boolean;
  pulses?: boolean;
  /** Click reports the node key, or null when empty space is clicked. */
  onSelect: (key: string | null) => void;
  /** Fired once the scene is built and the first frame has rendered. */
  onReady?: () => void;
  /** Fired if WebGL setup throws — the section then drops the panel. */
  onError?: () => void;
}

export default function ServiceExplorer({
  nodes,
  activeCategory,
  selectedKey,
  designTheme,
  autoRotate = true,
  pulses = true,
  onSelect,
  onReady,
  onError,
}: ServiceExplorerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Live props the render loop reads without re-subscribing (effect runs once).
  const activeRef = useRef(activeCategory);
  activeRef.current = activeCategory;
  const selectedRef = useRef(selectedKey);
  selectedRef.current = selectedKey;
  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;
  const pulsesRef = useRef(pulses);
  pulsesRef.current = pulses;
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  // Re-tint the theme-driven objects when the site palette flips, without a
  // full rebuild. Read by the live theme effect below.
  const themeRef = useRef(designTheme);

  // Imperative scene handle, shared between the mount effect and the theme
  // effect. Populated once three.js is set up.
  const sceneApi = useRef<{
    applyTheme: (t: ServiceTreeTheme) => void;
  } | null>(null);

  // Builds the three.js scene once on mount; every live value (active category,
  // selection, theme, callbacks, node names) is read through a ref above.
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional mount-once
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const tooltip = tooltipRef.current;
    if (!container || !canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
    } catch {
      onErrorRef.current?.();
      return;
    }

    const disposables: { dispose: () => void }[] = [];
    const palette = SERVICE_TREE_THEMES[themeRef.current];

    const scene = new THREE.Scene();
    // Additive cannot darken, so it is invisible on a light page — the plant
    // is drawn rather than emissive there.
    const glowBlend = palette.onLight
      ? THREE.NormalBlending
      : THREE.AdditiveBlending;
    scene.fog = new THREE.FogExp2(palette.fog, 0.04);
    let dimColor = new THREE.Color(palette.fog);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    // Orbit / interaction state.
    let azimuth = -0.55;
    let elevation = 0.12;
    let radius = 14;
    const curTarget = new THREE.Vector3(0.2, 0.55, -0.2);
    const mouse = new THREE.Vector2(0, 0);
    const mouseRaw = { x: 0, y: 0 };
    const ndc = new THREE.Vector2(-2, -2);
    const catFactor: Record<BranchCat, number> = {
      trunk: 1,
      build: 1,
      protect: 1,
      grow: 1,
    };
    let hovered: number | null = null;
    let dragging = false;
    let lastUser = -9999;
    let lastX = 0;
    let lastY = 0;
    let downX = 0;
    let downY = 0;
    const raycaster = new THREE.Raycaster();

    // Manual clock: advances only while the loop runs, so the offscreen pause
    // freezes it (the grow-in plays once on first view, never replays).
    let elapsedTime = 0;
    let lastFrameMs = 0;
    const nowSec = () => elapsedTime;

    // Construction lives in service-tree/build.ts; what comes back is the set
    // of handles the render loop, the raycaster and the theme switch need.
    const {
      treeGroup,
      branches,
      nodeObjs,
      hitMeshes,
      hubGlows,
      pulseObjs,
      posByKey,
      points,
      groundRingMat,
      particleMat,
    } = buildSapling({
      scene,
      palette,
      glowBlend,
      nodes: nodesRef.current,
      disposables,
    });

    // ── Theme (re-tint without rebuild) ───────────────────────────────────
    const applyTheme = (name: ServiceTreeTheme) => {
      const th = SERVICE_TREE_THEMES[name];
      themeRef.current = name;
      dimColor = new THREE.Color(th.fog);
      if (scene.fog) (scene.fog as THREE.FogExp2).color.set(th.fog);
      groundRingMat.color.set(th.core);
      particleMat.color.set(th.particle);
    };
    sceneApi.current = { applyTheme };

    // ── Sizing ────────────────────────────────────────────────────────────
    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // ── Cursor magnet (pin the site cursor to the hovered leaf) ───────────
    // The custom cursor morphs onto interactive elements by their bounding box.
    // For the <canvas> that box is the WHOLE panel, so instead we hand it the
    // hovered leaf's live screen rect and it hugs just the leaf. Scratch vectors
    // reused every frame — the hover path never allocates.
    const magCenter = new THREE.Vector3();
    const magEdge = new THREE.Vector3();
    const magRight = new THREE.Vector3();
    const writeMagnetRect = (idx: number | null) => {
      const n = idx != null ? nodeObjs[idx] : null;
      if (!n) {
        setCursorMagnetRect(canvas, null);
        return;
      }
      n.group.getWorldPosition(magCenter);
      // Leaf half-extent in world units: sprite half (0.8) × the live group
      // scale (pops to ~1.34 when focused), so the halo grows with the leaf.
      const halfWorld = 0.8 * n.scale;
      magRight.setFromMatrixColumn(camera.matrixWorld, 0).normalize();
      magEdge.copy(magCenter).addScaledVector(magRight, halfWorld);
      magCenter.project(camera);
      if (magCenter.z > 1) {
        setCursorMagnetRect(canvas, null); // leaf is behind the camera
        return;
      }
      magEdge.project(camera);
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      const cxPx = (magCenter.x * 0.5 + 0.5) * cw;
      const cyPx = (-magCenter.y * 0.5 + 0.5) * ch;
      const exPx = (magEdge.x * 0.5 + 0.5) * cw;
      const eyPx = (-magEdge.y * 0.5 + 0.5) * ch;
      const rPx = Math.max(Math.hypot(exPx - cxPx, eyPx - cyPx), 10);
      const box = container.getBoundingClientRect(); // → viewport coords
      setCursorMagnetRect(canvas, {
        left: box.left + cxPx - rPx,
        top: box.top + cyPx - rPx,
        width: rPx * 2,
        height: rPx * 2,
      });
    };

    // ── Hover (raycast against the invisible hit spheres) ─────────────────
    const updateHover = () => {
      // Sync the camera's world matrices to THIS frame before we raycast/project.
      // updateCamera() sets position + lookAt() but never refreshes
      // matrixWorldInverse (renderer.render does that at frame end), so without
      // this the raycast, the leaf halo and the tooltip would all project through
      // the PREVIOUS frame's camera — a ~1–2px lag that grows with camera speed.
      camera.updateMatrixWorld();
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(hitMeshes, false);
      let idx: number | null = null;
      for (const ht of hits) {
        const i = ht.object.userData.idx as number;
        if (nowSec() > nodeObjs[i].growAt) {
          idx = i;
          break;
        }
      }
      hovered = idx;
      // Hand the custom cursor the hovered leaf's live screen rect (or clear it)
      // BEFORE the synthetic mouseover below, so when the cursor re-evaluates it
      // reads a fresh rect and hugs the leaf — never the whole <canvas> box.
      writeMagnetRect(idx);
      // Native cursors are defeated site-wide by `cursor:none` on fine pointers
      // (the custom dot takes over), and the dot only re-evaluates interactivity
      // on `mouseover` — which never re-fires while moving within one canvas. So
      // on each hover transition, flag the canvas as interactive and dispatch a
      // synthetic mouseover so the dot pops over a leaf, like every other CTA.
      const interactive = idx != null;
      if (interactive !== canvas.classList.contains("cursor-pointer")) {
        canvas.classList.toggle("cursor-pointer", interactive);
        canvas.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
      }
      canvas.style.cursor =
        idx != null ? "pointer" : dragging ? "grabbing" : "grab";
    };

    // ── Pointer interaction ───────────────────────────────────────────────
    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      downX = e.clientX;
      downY = e.clientY;
      lastUser = performance.now();
      canvas.style.cursor = "grabbing";
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseRaw.x = clamp(x * 2 - 1, -1, 1);
      mouseRaw.y = clamp(-(y * 2 - 1), -1, 1);
      ndc.set(x * 2 - 1, -(y * 2 - 1));
      if (dragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        azimuth -= dx * 0.005;
        elevation = clamp(elevation + dy * 0.005, -0.25, 0.85);
        lastUser = performance.now();
      }
      updateHover();
    };
    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - downX, e.clientY - downY);
      dragging = false;
      canvas.style.cursor = hovered != null ? "pointer" : "grab";
      if (dist < 6) {
        if (hovered != null) onSelectRef.current(nodeObjs[hovered].key);
        else if (selectedRef.current) onSelectRef.current(null);
      }
    };
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // ── Tooltip (project the hovered leaf to screen each frame) ───────────
    // Scratch vectors reused every frame — the loop never allocates.
    const tmpV = new THREE.Vector3();
    const focusV = new THREE.Vector3();
    const updateTooltip = () => {
      if (!tooltip) return;
      const i = hovered;
      if (
        i == null ||
        !nodeObjs[i] ||
        selectedRef.current ||
        nowSec() <= nodeObjs[i].growAt
      ) {
        tooltip.style.opacity = "0";
        return;
      }
      const n = nodeObjs[i];
      n.group.getWorldPosition(tmpV).project(camera);
      if (tmpV.z > 1) {
        tooltip.style.opacity = "0";
        return;
      }
      const w = container.clientWidth;
      const h = container.clientHeight;
      const x = (tmpV.x * 0.5 + 0.5) * w;
      const y = (-tmpV.y * 0.5 + 0.5) * h;
      const live = nodesRef.current.find((nd) => nd.key === n.key);
      tooltip.textContent = live?.name ?? "";
      tooltip.style.transform = `translate(${x}px, ${y}px) translate(-50%, -160%)`;
      tooltip.style.opacity = "1";
    };

    // ── Camera (spherical, hand-rolled fly-to) ────────────────────────────
    const updateCamera = (dt: number) => {
      const A = activeRef.current;
      const selKey = selectedRef.current;
      const selPos = selKey ? posByKey.get(selKey) : undefined;
      let desRad: number;
      if (selPos) {
        focusV.copy(selPos);
        desRad = 7.5;
      } else if (A !== "all") {
        const h = HUBS[A];
        focusV.set(h[0], h[1] * 0.8 + 0.3, h[2]);
        desRad = 9.5;
      } else {
        focusV.set(0.2, 0.55, -0.2);
        desRad = 14;
      }

      curTarget.lerp(focusV, 0.045);
      radius += (desRad - radius) * 0.045;

      const userActive = performance.now() - lastUser < 2200;
      if (userActive) {
        /* drag owns azimuth / elevation */
      } else if (selPos || A !== "all") {
        const desAz = Math.atan2(focusV.x, focusV.z + 0.0001);
        azimuth = lerpAngle(azimuth, desAz, 0.04);
        const desEl = clamp(0.12 + focusV.y * 0.05, 0.0, 0.6);
        elevation += (desEl - elevation) * 0.04;
      } else {
        if (autoRotateRef.current) azimuth += dt * 0.12;
        elevation += (0.16 - elevation) * 0.03;
      }

      mouse.x += (mouseRaw.x - mouse.x) * 0.06;
      mouse.y += (mouseRaw.y - mouse.y) * 0.06;

      const px =
        curTarget.x +
        radius * Math.cos(elevation) * Math.sin(azimuth) +
        mouse.x * 0.5;
      const py = curTarget.y + radius * Math.sin(elevation) + mouse.y * 0.4;
      const pz = curTarget.z + radius * Math.cos(elevation) * Math.cos(azimuth);
      camera.position.set(px, py, pz);
      camera.lookAt(curTarget.x, curTarget.y, curTarget.z);
    };

    // ── Render loop ───────────────────────────────────────────────────────
    let raf = 0;
    let running = false;
    let ready = false;

    const frame = () => {
      const t = performance.now();
      let dt = (t - lastFrameMs) / 1000;
      lastFrameMs = t;
      if (dt > 0.05) dt = 0.05; // cap jumps after an offscreen pause
      elapsedTime += dt;
      const el = elapsedTime;

      // Growth reveal via draw range.
      for (const b of branches) {
        const p = clamp((el - b.t0) / (b.t1 - b.t0), 0, 1);
        const e = easeOutCubic(p);
        for (const L of b.layers) {
          L.mesh.geometry.setDrawRange(0, Math.floor(L.idxFull * e));
        }
      }

      // Category dim factors.
      const A = activeRef.current;
      for (const k of ["trunk", "build", "protect", "grow"] as BranchCat[]) {
        const tgt =
          A === "all" ? 1 : k === A ? 1 : k === "trunk" ? 0.5 : 0.12;
        catFactor[k] += (tgt - catFactor[k]) * 0.1;
      }
      for (const b of branches) {
        const f = catFactor[b.cat];
        for (const L of b.layers) {
          L.mat.opacity = L.baseOp * f;
          L.mat.color
            .copy(L.core ? b.coreCol : b.base)
            .lerp(dimColor, (1 - f) * 0.85);
        }
      }
      for (const hg of hubGlows) {
        hg.sp.material.opacity =
          (el > hg.growAt ? 0.5 : 0.0) * catFactor[hg.cat];
      }

      // Nodes: pop-in, hover/select focus, dim.
      const selKey = selectedRef.current;
      for (let i = 0; i < nodeObjs.length; i++) {
        const n = nodeObjs[i];
        const f = catFactor[n.cat];
        const grown = el > n.growAt;
        const focused = hovered === i || selKey === n.key;
        const tScale = grown ? (focused ? 1.34 : 1.0) : 0.001;
        n.scale += (tScale - n.scale) * 0.16;
        n.group.scale.setScalar(n.scale);
        n.glow.scale.setScalar(focused ? 1.45 : 1.15);
        n.glowMat.opacity = (focused ? 0.8 : 0.5) * Math.max(f, 0.06);
        n.glowMat.color.copy(n.baseColor).lerp(dimColor, (1 - f) * 0.6);
        n.leafMat.opacity = (focused ? 1.0 : 0.9) * Math.max(f, 0.12);
        n.leafMat.color.copy(n.baseColor).lerp(dimColor, (1 - f) * 0.55);
        n.iconMat.opacity = Math.max(f, focused ? 1 : 0.14);
      }

      // Energy pulses.
      const showPulse = pulsesRef.current && el > 1.5;
      for (const p of pulseObjs) {
        if (!showPulse) {
          p.sprite.visible = false;
          continue;
        }
        p.sprite.visible = true;
        const tt = (el * p.speed + p.offset) % 1;
        p.curve.getPoint(tt, p.sprite.position); // writes in place (no alloc)
        p.sprite.material.opacity =
          0.9 * catFactor[p.cat] * (1 - Math.abs(0.5 - tt) * 0.7);
      }

      points.rotation.y += dt * 0.02;

      // Seedling breeze sway (eases in once grown).
      const sw = clamp((el - 1.0) / 1.8, 0, 1);
      treeGroup.rotation.z =
        (Math.sin(el * 0.55) * 0.03 + Math.sin(el * 0.27 + 1.3) * 0.018) * sw;
      treeGroup.rotation.x = Math.sin(el * 0.42 + 0.6) * 0.013 * sw;

      updateCamera(dt);
      // Re-raycast every frame, not just on pointer-move. The scene is never
      // still — breeze sway (treeGroup rotation above), auto-rotate, the easing
      // mouse-parallax camera offset and the fly-to all keep moving the leaves
      // under a stationary cursor. Hover computed only at move-time therefore
      // goes stale the instant the pointer stops and the leaf drifts off it, so
      // the lock-on latches the wrong leaf (or none). Recomputing here against
      // the live camera keeps it glued to whatever leaf is actually under the
      // cursor and gives click-selection a fresh `hovered`.
      updateHover();
      updateTooltip();
      renderer.render(scene, camera);

      if (!ready) {
        ready = true;
        onReadyRef.current?.();
      }
    };

    const loop = () => {
      if (!running) return;
      try {
        frame();
      } catch (err) {
        console.error("ServiceExplorer frame", err);
        running = false;
        onErrorRef.current?.();
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running) return;
      running = true;
      lastFrameMs = performance.now(); // resume without counting the paused gap
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // Pause while scrolled off-screen or the tab is hidden — the scene
    // self-animates, so otherwise the GPU draws every frame for nothing.
    let onScreen = false;
    let pageVisible = !document.hidden;
    const sync = () => {
      if (onScreen && pageVisible) start();
      else stop();
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    io.observe(container);
    const onVisibility = () => {
      pageVisible = !document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      // Drop any leaf magnet so the custom cursor doesn't keep a stale rect.
      canvas.classList.remove("cursor-pointer");
      setCursorMagnetRect(canvas, null);
      sceneApi.current = null;
      for (const d of disposables) d.dispose();
      renderer.dispose();
      // Drop the WebGL context so rapid route navigation can't exhaust the
      // browser's hard cap on live contexts.
      renderer.forceContextLoss();
    };
  }, []);

  // Re-tint when the site palette flips (no teardown/rebuild).
  useEffect(() => {
    if (themeRef.current !== designTheme) {
      sceneApi.current?.applyTheme(designTheme);
    }
  }, [designTheme]);

  return (
    // No z-index here on purpose: an absolute element with z-index:auto does not
    // form a stacking context, so the tooltip below flattens into the section
    // panel's context and layers above the vignette/header (as in the spec).
    <div aria-hidden="true" className="absolute inset-0" ref={containerRef}>
      <canvas
        className="block h-full w-full [touch-action:none]"
        ref={canvasRef}
        style={{ cursor: "grab" }}
      />
      <div
        className="glass-deep pointer-events-none absolute top-0 left-0 z-[3] whitespace-nowrap rounded-full px-[13px] py-1.5 font-semibold text-[13px] text-foreground opacity-0 shadow-[0_8px_26px_-10px_rgba(0,0,0,0.4)]"
        ref={tooltipRef}
        style={{ background: "rgba(8,16,42,0.72)", transition: "opacity 160ms" }}
      />
    </div>
  );
}
