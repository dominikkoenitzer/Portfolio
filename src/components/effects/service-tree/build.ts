import * as THREE from "three";
import { CATS, FORK, HUBS, LEAVES, ROOT, TIMING } from "./layout";
import type { ServiceTreePalette } from "./theme";
import { glowTexture, iconTexture, leafTexture } from "./textures";
import type {
  Branch,
  BranchCat,
  BranchKind,
  BranchLayer,
  HubGlow,
  NodeObj,
  PulseObj,
  ServiceTreeNode,
} from "./types";

/** Everything the render loop, the raycaster and the theme switch need back. */
export interface Sapling {
  /** Parent of the whole plant — the breeze sway and auto-rotate turn this. */
  treeGroup: THREE.Group;
  branches: Branch[];
  nodeObjs: NodeObj[];
  /** Invisible spheres the hover raycast tests against, index-aligned via userData.idx. */
  hitMeshes: THREE.Mesh[];
  hubGlows: HubGlow[];
  pulseObjs: PulseObj[];
  /** Leaf world positions by service key, for the camera fly-to. */
  posByKey: Map<string, THREE.Vector3>;
  /** Ambient dust, drifting independently of the tree. */
  points: THREE.Points;
  /** The two materials a theme flip re-tints. */
  groundRingMat: THREE.MeshBasicMaterial;
  particleMat: THREE.PointsMaterial;
}

/**
 * Builds the sapling: trunk, three category boughs, a leaf per service, the
 * ground ring, ambient dust and the energy pulses that travel the boughs.
 *
 * Construction only — nothing here animates. Every mesh starts at zero draw
 * range or zero scale and the render loop reveals it against the grow-in
 * timings in `layout.ts`. Geometries and materials are pushed onto the caller's
 * `disposables` so unmounting stays one loop in the effect cleanup.
 */
export function buildSapling(opts: {
  scene: THREE.Scene;
  palette: ServiceTreePalette;
  glowBlend: THREE.Blending;
  nodes: ServiceTreeNode[];
  disposables: { dispose: () => void }[];
}): Sapling {
  const { scene, palette, glowBlend, nodes, disposables } = opts;
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
    const lineCol = palette.onLight
      ? base.clone().lerp(new THREE.Color(0x000000), 0.28)
      : base.clone().lerp(new THREE.Color(0xffffff), 0.32);
    // Three concentric tubes: two additive shells bloom, a near-white normal
    // core gives a crisp line so it reads as light, not a matte cylinder.
    const defs = [
      // The two outer shells are a bloom on dark and a soft body on light.
      { r: thickness * 3.0, col: base, op: palette.onLight ? 0.1 : 0.18, additive: true, core: false, ro: 1 },
      { r: thickness * 1.5, col: base, op: palette.onLight ? 0.3 : 0.45, additive: true, core: false, ro: 2 },
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
        blending: d.additive ? glowBlend : THREE.NormalBlending,
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
    const col = new THREE.Color(palette.accent[node.category]);
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
      blending: glowBlend,
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
      blending: glowBlend,
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
      blending: glowBlend,
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
  addBranch(root, fork, 0.075, palette.trunk, "trunk", 0.0, 0.5, "trunk");

  const forkGlow = addSprite(0xcfeede, 0.95, 0.4, 2, false, treeGroup);
  forkGlow.position.copy(fork);

  for (const cat of CATS) {
    const hub = HUBS[cat];
    const hubV = V(hub);
    const accent = palette.accent[cat];
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
    blending: glowBlend,
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
    blending: glowBlend,
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
      blending: glowBlend,
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

  return {
    treeGroup,
    branches,
    nodeObjs,
    hitMeshes,
    hubGlows,
    pulseObjs,
    posByKey,
    points,
    groundRingMat,
    particleMat: pmat,
  };
}
