import type { LucideIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as THREE from "three";
import {
  CATEGORY_ACCENT_NUM,
  type Group3,
  SERVICE_TREE_THEMES,
  type ServiceTreeTheme,
  TRUNK_COLOR,
} from "@/components/effects/service-tree-theme";

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

type Category = "all" | Group3;

export interface ServiceTreeNode {
  key: string;
  category: Group3;
  /** Localized service name — shown in the hover tooltip. */
  name: string;
  icon: LucideIcon;
}

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

// ── Design-space layout (handoff spec) ──────────────────────────────────────
const ROOT: [number, number, number] = [0, -3.25, 0];
const FORK: [number, number, number] = [0, -1.3, 0];
const CATS: Group3[] = ["build", "protect", "grow"];
const HUBS: Record<Group3, [number, number, number]> = {
  build: [-2.3, 0.3, 0.5],
  protect: [0.2, 1.7, -1.3],
  grow: [2.4, 0.1, 0.8],
};
// Three leaf slots per bough, filled in service order (handoff positions).
const LEAVES: Record<Group3, [number, number, number][]> = {
  build: [
    [-4.0, 1.4, 1.0],
    [-3.7, -0.5, -0.4],
    [-2.7, 1.8, -0.9],
  ],
  protect: [
    [-0.9, 3.0, -1.6],
    [1.6, 2.8, -2.0],
    [0.3, 2.5, -3.0],
  ],
  grow: [
    [4.1, 1.1, 1.4],
    [3.8, -0.9, 0.3],
    [3.0, 1.5, 2.2],
  ],
};
// Per-bough grow-in window (the main bough's draw-range reveal).
const TIMING: Record<Group3, { t0: number; t1: number }> = {
  build: { t0: 0.45, t1: 1.05 },
  protect: { t0: 0.5, t1: 1.15 },
  grow: { t0: 0.55, t1: 1.2 },
};

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const lerpAngle = (a: number, b: number, t: number) => {
  const d =
    (((b - a + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) -
    Math.PI;
  return a + d * t;
};

// ── Procedural textures (module-cached: shared, never disposed) ─────────────
let glowTexCache: THREE.Texture | null = null;
function glowTexture(): THREE.Texture {
  if (glowTexCache) return glowTexCache;
  const S = 256;
  const cv = document.createElement("canvas");
  cv.width = S;
  cv.height = S;
  const ctx = cv.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.16, "rgba(255,255,255,0.95)");
    g.addColorStop(0.38, "rgba(255,255,255,0.42)");
    g.addColorStop(0.62, "rgba(255,255,255,0.14)");
    g.addColorStop(0.82, "rgba(255,255,255,0.04)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.minFilter = THREE.LinearFilter;
  glowTexCache = tex;
  return tex;
}

let leafTexCache: THREE.Texture | null = null;
function leafTexture(): THREE.Texture {
  if (leafTexCache) return leafTexCache;
  const S = 256;
  const cv = document.createElement("canvas");
  cv.width = S;
  cv.height = S;
  const ctx = cv.getContext("2d");
  if (ctx) {
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    const path = () => {
      ctx.beginPath();
      ctx.moveTo(128, 242);
      ctx.quadraticCurveTo(36, 150, 128, 14);
      ctx.quadraticCurveTo(220, 150, 128, 242);
      ctx.closePath();
    };
    ctx.fillStyle = "rgba(255,255,255,0.13)";
    path();
    ctx.fill();
    ctx.shadowColor = "rgba(255,255,255,0.8)";
    ctx.shadowBlur = 16;
    ctx.strokeStyle = "rgba(255,255,255,0.92)";
    ctx.lineWidth = 7;
    path();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(128, 226);
    ctx.lineTo(128, 40);
    ctx.stroke();
  }
  leafTexCache = new THREE.CanvasTexture(cv);
  return leafTexCache;
}

// Icon textures depend only on the icon component (white, language-agnostic),
// so cache them at module scope — a language/theme switch reuses them instead
// of re-running renderToStaticMarkup + re-uploading to the GPU.
const iconTexCache = new Map<string, THREE.Texture>();
function iconTexture(cacheKey: string, Icon: LucideIcon): THREE.Texture {
  const cached = iconTexCache.get(cacheKey);
  if (cached) return cached;
  // Rasterize at ~the prototype's texture size so the glyph stays crisp when a
  // node is focused (leaf scales 1.34 and the camera flies to radius 7.5).
  const svg = renderToStaticMarkup(
    <Icon color="#ffffff" size={256} strokeWidth={1.7} />,
  );
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  const tex = new THREE.TextureLoader().load(url);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  iconTexCache.set(cacheKey, tex);
  return tex;
}

// ── Scene object types ──────────────────────────────────────────────────────
type BranchKind = "trunk" | "main" | "sub";
type BranchCat = "trunk" | Group3;

interface BranchLayer {
  mesh: THREE.Mesh;
  mat: THREE.MeshBasicMaterial;
  baseOp: number;
  core: boolean;
  idxFull: number;
}
interface Branch {
  layers: BranchLayer[];
  base: THREE.Color;
  coreCol: THREE.Color;
  cat: BranchCat;
  t0: number;
  t1: number;
  curve: THREE.QuadraticBezierCurve3;
  kind: BranchKind;
}
interface NodeObj {
  key: string;
  cat: Group3;
  group: THREE.Group;
  glow: THREE.Sprite;
  glowMat: THREE.SpriteMaterial;
  leafMat: THREE.SpriteMaterial;
  iconMat: THREE.SpriteMaterial;
  baseColor: THREE.Color;
  pos: THREE.Vector3;
  growAt: number;
  scale: number;
}
interface HubGlow {
  sp: THREE.Sprite;
  cat: Group3;
  growAt: number;
}
interface PulseObj {
  sprite: THREE.Sprite;
  curve: THREE.QuadraticBezierCurve3;
  cat: BranchCat;
  speed: number;
  offset: number;
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

    const glowTex = glowTexture();
    const leafTex = leafTexture();

    const branches: Branch[] = [];
    const nodeObjs: NodeObj[] = [];
    const hitMeshes: THREE.Mesh[] = [];
    const pulseObjs: PulseObj[] = [];
    const hubGlows: HubGlow[] = [];
    const posByKey = new Map<string, THREE.Vector3>();

    const treeGroup = new THREE.Group();
    scene.add(treeGroup);

    const V = (a: [number, number, number]) =>
      new THREE.Vector3(a[0], a[1], a[2]);

    // ── Build helpers ─────────────────────────────────────────────────────
    const addBranch = (
      a: THREE.Vector3,
      b: THREE.Vector3,
      thickness: number,
      color: number,
      cat: BranchCat,
      t0: number,
      t1: number,
      kind: BranchKind,
    ) => {
      const mid = a.clone().add(b).multiplyScalar(0.5);
      const outward = new THREE.Vector3(mid.x, 0, mid.z);
      if (outward.lengthSq() > 0.0001) outward.normalize();
      else outward.set(0, 0, 0);
      const isTrunk = kind === "trunk";
      const ctrl = mid
        .clone()
        .add(
          new THREE.Vector3(0, 1, 0).multiplyScalar(
            isTrunk ? 0.18 : kind === "sub" ? 0.66 : 0.52,
          ),
        )
        .add(outward.multiplyScalar(isTrunk ? 0 : kind === "sub" ? 0.5 : 0.45));
      const curve = new THREE.QuadraticBezierCurve3(a, ctrl, b);
      const radSeg = isTrunk ? 14 : kind === "sub" ? 10 : 12;
      const tubSeg = isTrunk ? 40 : kind === "sub" ? 44 : 56;

      const base = new THREE.Color(color);
      const lineCol = base.clone().lerp(new THREE.Color(0xffffff), 0.32);
      // Three concentric tubes: two additive shells bloom, a near-white normal
      // core gives a crisp line so it reads as light, not a matte cylinder.
      const defs = [
        { r: thickness * 3.0, col: base, op: 0.18, additive: true, core: false, ro: 1 },
        { r: thickness * 1.5, col: base, op: 0.45, additive: true, core: false, ro: 2 },
        { r: thickness * 0.6, col: lineCol, op: 0.98, additive: false, core: true, ro: 3 },
      ];
      const layers: BranchLayer[] = [];
      for (const d of defs) {
        const g = new THREE.TubeGeometry(curve, tubSeg, d.r, radSeg, false);
        const m = new THREE.MeshBasicMaterial({
          color: d.col.clone(),
          transparent: true,
          opacity: 0,
          depthWrite: false,
          blending: d.additive
            ? THREE.AdditiveBlending
            : THREE.NormalBlending,
        });
        const mesh = new THREE.Mesh(g, m);
        mesh.renderOrder = d.ro;
        g.setDrawRange(0, 0);
        treeGroup.add(mesh);
        disposables.push(g, m);
        layers.push({
          mesh,
          mat: m,
          baseOp: d.op,
          core: d.core,
          idxFull: g.index ? g.index.count : 0,
        });
      }
      branches.push({
        layers,
        base: base.clone(),
        coreCol: lineCol,
        cat,
        t0,
        t1,
        curve,
        kind,
      });
    };

    const addNode = (
      node: ServiceTreeNode,
      pos: [number, number, number],
      hub: [number, number, number],
      growAt: number,
    ) => {
      const col = new THREE.Color(CATEGORY_ACCENT_NUM[node.category]);
      const p = V(pos);
      const group = new THREE.Group();
      group.position.copy(p);
      group.scale.setScalar(0.001);

      // Leaf points outward, continuing the branch line (screen-space rotation).
      const dx = pos[0] - hub[0];
      const dy = pos[1] - hub[1];
      const rot = -Math.atan2(dx, dy);

      const glowMat = new THREE.SpriteMaterial({
        map: glowTex,
        color: col.clone(),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.5,
      });
      const glow = new THREE.Sprite(glowMat);
      glow.scale.set(1.15, 1.15, 1);
      glow.renderOrder = 2;
      const leafMat = new THREE.SpriteMaterial({
        map: leafTex,
        color: col.clone(),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
        opacity: 0.95,
        rotation: rot,
      });
      const leaf = new THREE.Sprite(leafMat);
      leaf.scale.set(1.6, 1.6, 1);
      leaf.renderOrder = 3;
      const iconMat = new THREE.SpriteMaterial({
        map: iconTexture(node.key, node.icon),
        transparent: true,
        depthWrite: false,
        fog: false,
        opacity: 1,
      });
      const icon = new THREE.Sprite(iconMat);
      icon.scale.set(0.6, 0.6, 1);
      icon.position.z = 0.03;
      icon.renderOrder = 4;
      group.add(glow, leaf, icon);
      treeGroup.add(group);
      disposables.push(glowMat, leafMat, iconMat);

      const hitGeo = new THREE.SphereGeometry(0.6, 12, 12);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hit = new THREE.Mesh(hitGeo, hitMat);
      hit.position.copy(p);
      hit.userData.idx = nodeObjs.length;
      treeGroup.add(hit);
      hitMeshes.push(hit);
      disposables.push(hitGeo, hitMat);

      posByKey.set(node.key, p.clone());
      nodeObjs.push({
        key: node.key,
        cat: node.category,
        group,
        glow,
        glowMat,
        leafMat,
        iconMat,
        baseColor: col.clone(),
        pos: p,
        growAt,
        scale: 0.001,
      });
    };

    const addSprite = (
      color: number,
      scale: number,
      opacity: number,
      renderOrder: number,
      fog: boolean,
      parent: THREE.Object3D,
    ) => {
      const mat = new THREE.SpriteMaterial({
        map: glowTex,
        color: new THREE.Color(color),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog,
        opacity,
      });
      const sp = new THREE.Sprite(mat);
      sp.scale.set(scale, scale, 1);
      sp.renderOrder = renderOrder;
      parent.add(sp);
      disposables.push(mat);
      return sp;
    };

    // ── Build the sapling ─────────────────────────────────────────────────
    const root = V(ROOT);
    const fork = V(FORK);
    addBranch(root, fork, 0.075, TRUNK_COLOR, "trunk", 0.0, 0.5, "trunk");

    const forkGlow = addSprite(0xcfeede, 0.95, 0.4, 2, false, treeGroup);
    forkGlow.position.copy(fork);

    for (const cat of CATS) {
      const hub = HUBS[cat];
      const hubV = V(hub);
      const accent = CATEGORY_ACCENT_NUM[cat];
      const { t0, t1 } = TIMING[cat];
      addBranch(fork, hubV, 0.052, accent, cat, t0, t1, "main");

      const hubGlow = addSprite(accent, 0.85, 0, 2, false, treeGroup);
      hubGlow.position.copy(hubV);
      hubGlows.push({ sp: hubGlow, cat, growAt: t1 });

      const branchNodes = nodes.filter((n) => n.category === cat);
      branchNodes.forEach((node, i) => {
        const pos = LEAVES[cat][i] ?? LEAVES[cat][LEAVES[cat].length - 1];
        const st0 = t1 + 0.05 + i * 0.06;
        const st1 = st0 + 0.5;
        addBranch(hubV, V(pos), 0.034, accent, cat, st0, st1, "sub");
        addNode(node, pos, hub, st1);
      });
    }

    // Ground: a small flat circle the sapling is planted in — lies flat on the
    // floor at the root (not the old tilted, spinning hoop). Just the crisp
    // circle rim, no fill glow (that would spill under/in front of the ring).
    const groundColor = new THREE.Color(palette.core);
    const groundRingGeo = new THREE.RingGeometry(0.58, 0.7, 64);
    const groundRingMat = new THREE.MeshBasicMaterial({
      color: groundColor.clone(),
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const groundRing = new THREE.Mesh(groundRingGeo, groundRingMat);
    groundRing.position.copy(root);
    groundRing.rotation.x = -Math.PI / 2;
    groundRing.renderOrder = 1;
    treeGroup.add(groundRing);
    disposables.push(groundRingGeo, groundRingMat);

    // Ambient particles.
    const N = 320;
    const parr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      parr[i * 3] = (Math.random() - 0.5) * 15;
      parr[i * 3 + 1] = (Math.random() - 0.4) * 12;
      parr[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    const pgeo = new THREE.BufferGeometry();
    pgeo.setAttribute("position", new THREE.BufferAttribute(parr, 3));
    const pmat = new THREE.PointsMaterial({
      color: new THREE.Color(palette.particle),
      size: 0.045,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const points = new THREE.Points(pgeo, pmat);
    scene.add(points);
    disposables.push(pgeo, pmat);

    // Energy pulses on the trunk + the three main boughs.
    for (const b of branches) {
      if (b.kind === "sub") continue;
      const mat = new THREE.SpriteMaterial({
        map: glowTex,
        color: b.base.clone(),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
        opacity: 0,
      });
      const sp = new THREE.Sprite(mat);
      sp.scale.set(0.5, 0.5, 1);
      sp.visible = false;
      sp.renderOrder = 5;
      treeGroup.add(sp);
      disposables.push(mat);
      pulseObjs.push({
        sprite: sp,
        curve: b.curve,
        cat: b.cat,
        speed: 0.26 + Math.random() * 0.12,
        offset: Math.random(),
      });
    }

    // ── Theme (re-tint without rebuild) ───────────────────────────────────
    const applyTheme = (name: ServiceTreeTheme) => {
      const th = SERVICE_TREE_THEMES[name];
      themeRef.current = name;
      dimColor = new THREE.Color(th.fog);
      if (scene.fog) (scene.fog as THREE.FogExp2).color.set(th.fog);
      groundRingMat.color.set(th.core);
      pmat.color.set(th.particle);
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

    // ── Hover (raycast against the invisible hit spheres) ─────────────────
    const updateHover = () => {
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
        className="pointer-events-none absolute top-0 left-0 z-[3] whitespace-nowrap rounded-full border border-white/[0.16] px-[13px] py-1.5 font-semibold text-[13px] text-white opacity-0 shadow-[0_8px_26px_rgba(0,0,0,0.4)] backdrop-blur-[10px]"
        ref={tooltipRef}
        style={{ background: "rgba(8,16,42,0.72)", transition: "opacity 160ms" }}
      />
    </div>
  );
}
