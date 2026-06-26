import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { LucideIcon } from "lucide-react";
import {
  Component,
  memo,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as THREE from "three";

/**
 * ServiceExplorer — the Services page rendered AS a radial 3D skill tree
 * (three.js / r3f). A central core connects three service paths (Build /
 * Protect / Grow) that spoke outward symmetrically; each path chains its
 * services as glowing nodes with the icon baked in and an energy pulse flowing
 * along it. The tree is static (it does NOT follow the cursor) and the camera
 * auto-fits any viewport so nothing ever clips. Hover shows a tooltip + ring;
 * clicking a node reports its on-screen position via `onSelect` so the section
 * pops a card up beside it; clicking empty space calls `onClose`. Inactive
 * paths dim. Default-exported for React.lazy (desktop + motion only).
 */

type Group3 = "build" | "protect" | "grow";
type Category = "all" | Group3;
type ScreenPos = { x: number; y: number };

interface ServiceNodeData {
  key: string;
  category: Group3;
  title: string;
  price: string;
  icon: LucideIcon;
}

// Angles place the three paths symmetrically around the centre (one up, two
// down) — a balanced three-spoke that reads as a skill tree, not an arrow.
const SPOKES: { category: Group3; angleDeg: number }[] = [
  { category: "build", angleDeg: 90 },
  { category: "protect", angleDeg: 210 },
  { category: "grow", angleDeg: 330 },
];
const RADII = [2.0, 3.85, 5.7]; // node distance from the core, per tier
const OUTER_R = RADII[RADII.length - 1];
const FOV = 45;
// Fixed camera distance that frames the tree in a SQUARE viewport (the section
// renders the canvas as aspect-square, so the framing is constant and can't
// shrink): z = (OUTER_R + glow headroom) / tan(fov/2).
const CAM_Z = 16.3;
const SPIN_SPEED = 0.25; // windmill turn (rad/s); pauses on hover / while a card is open

type Palette = {
  iconColor: string;
  core: THREE.Color;
  colors: Record<Group3, THREE.Color>;
};

// Colours matched to each theme: cool neons on the dark (glass) theme; deeper
// jewel tones with a dark icon + dark core on the light (bloom) theme.
function paletteFor(glass: boolean): Palette {
  if (glass) {
    return {
      iconColor: "#ffffff",
      core: new THREE.Color("#cfe0ff"),
      colors: {
        build: new THREE.Color("#22d3ee"), // cyan
        protect: new THREE.Color("#a855f7"), // violet
        grow: new THREE.Color("#22c55e"), // green
      },
    };
  }
  return {
    iconColor: "#2a2238",
    core: cssVarColor("--primary", "#5b4b82"),
    colors: {
      build: new THREE.Color("#7b6be0"),
      protect: new THREE.Color("#d76b94"),
      grow: new THREE.Color("#5fae6a"),
    },
  };
}

function cssVarColor(name: string, fallback: string): THREE.Color {
  const color = new THREE.Color(fallback);
  if (typeof document === "undefined") return color;
  try {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
    const m = raw.match(/([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/);
    if (m) color.setHSL(+m[1] / 360, +m[2] / 100, +m[3] / 100);
  } catch {
    /* keep fallback */
  }
  return color;
}

function radialTexture(stops: [number, string][]): THREE.Texture {
  if (typeof document === "undefined") return new THREE.Texture();
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    for (const [o, c] of stops) g.addColorStop(o, c);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  return new THREE.CanvasTexture(canvas);
}

function ringTexture(): THREE.Texture {
  if (typeof document === "undefined") return new THREE.Texture();
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.strokeStyle = "rgba(255,255,255,0.95)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(64, 64, 52, 0, Math.PI * 2);
    ctx.stroke();
  }
  return new THREE.CanvasTexture(canvas);
}

// Icon textures depend only on the icon + colour (never the language), so cache
// them at module scope: a language switch reuses them instead of re-running
// renderToStaticMarkup + TextureLoader and re-uploading to the GPU. Cached
// textures are shared, so they are intentionally never disposed per rebuild.
const iconTexCache = new Map<string, THREE.Texture>();
function makeIconTexture(
  cacheKey: string,
  Icon: LucideIcon,
  color: string,
): THREE.Texture {
  if (typeof document === "undefined") return new THREE.Texture();
  const key = `${cacheKey}:${color}`;
  const cached = iconTexCache.get(key);
  if (cached) return cached;
  const svg = renderToStaticMarkup(
    <Icon color={color} size={96} strokeWidth={1.7} />,
  );
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  const tex = new THREE.TextureLoader().load(url);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  iconTexCache.set(key, tex);
  return tex;
}

type Placed = {
  data: ServiceNodeData;
  position: [number, number, number];
  color: THREE.Color;
  iconTex: THREE.Texture;
};
type Branch = {
  category: Group3;
  dir: THREE.Vector2;
  geometry: THREE.BufferGeometry;
  material: THREE.LineBasicMaterial;
  baseOpacity: number;
};

const Node = memo(function Node({
  placed,
  glowTex,
  ringTex,
  glass,
  selected,
  dimmed,
  onSelect,
  onHover,
}: {
  placed: Placed;
  glowTex: THREE.Texture;
  ringTex: THREE.Texture;
  glass: boolean;
  selected: boolean;
  dimmed: boolean;
  onSelect: (key: string, screen: ScreenPos) => void;
  onHover: (node: ServiceNodeData | null) => void;
}) {
  // Read camera/size lazily via the store getter so the node never subscribes to
  // the r3f store (which would re-render all nodes on every resize/DPR change).
  const get = useThree((s) => s.get);
  const glow = useRef<THREE.Sprite>(null);
  const icon = useRef<THREE.Sprite>(null);
  const ring = useRef<THREE.Sprite>(null);
  const hovered = useRef(false);
  const cur = useRef({ scale: 1, op: 1, ring: 0 });

  useFrame(() => {
    const active = selected || hovered.current;
    const scaleT = selected ? 1.42 : hovered.current ? 1.2 : dimmed ? 0.85 : 1;
    const opT = dimmed && !active ? 0.18 : 1;
    const ringT = selected ? 0.95 : hovered.current ? 0.4 : 0;
    cur.current.scale += (scaleT - cur.current.scale) * 0.2;
    cur.current.op += (opT - cur.current.op) * 0.2;
    cur.current.ring += (ringT - cur.current.ring) * 0.2;
    const s = cur.current.scale;
    if (glow.current) {
      glow.current.scale.setScalar(1.45 * s);
      // Dial back additive glow on the dark theme so the hue shows instead of
      // blowing out to white.
      (glow.current.material as THREE.SpriteMaterial).opacity =
        (glass ? 0.78 : 0.95) * cur.current.op;
    }
    if (icon.current) {
      icon.current.scale.setScalar(0.85 * s);
      (icon.current.material as THREE.SpriteMaterial).opacity = cur.current.op;
    }
    if (ring.current) {
      ring.current.scale.setScalar(1.3 * s);
      (ring.current.material as THREE.SpriteMaterial).opacity = cur.current.ring;
    }
  });

  return (
    <group position={placed.position}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          const { camera, size } = get();
          const v = new THREE.Vector3();
          e.object.getWorldPosition(v);
          v.project(camera);
          onSelect(placed.data.key, {
            x: (v.x * 0.5 + 0.5) * size.width,
            y: (-v.y * 0.5 + 0.5) * size.height,
          });
        }}
        onPointerOut={() => {
          hovered.current = false;
          onHover(null);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          hovered.current = true;
          onHover(placed.data);
        }}
      >
        <sphereGeometry args={[0.72, 16, 16]} />
        <meshBasicMaterial depthWrite={false} opacity={0} transparent />
      </mesh>
      <sprite ref={ring}>
        <spriteMaterial
          color={placed.color}
          depthWrite={false}
          map={ringTex}
          opacity={0}
          transparent
        />
      </sprite>
      <sprite ref={glow}>
        <spriteMaterial
          blending={glass ? THREE.AdditiveBlending : THREE.NormalBlending}
          color={placed.color}
          depthWrite={false}
          map={glowTex}
          transparent
        />
      </sprite>
      <sprite position={[0, 0, 0.02]} ref={icon}>
        <spriteMaterial depthWrite={false} map={placed.iconTex} transparent />
      </sprite>
    </group>
  );
});

function Scene({
  nodes,
  activeCategory,
  selectedKey,
  paused,
  glass,
  onSelect,
  onHover,
}: {
  nodes: ServiceNodeData[];
  activeCategory: Category;
  selectedKey: string;
  paused: boolean;
  glass: boolean;
  onSelect: (key: string, screen: ScreenPos) => void;
  onHover: (node: ServiceNodeData | null) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const root = useRef<THREE.Sprite>(null);
  const rootRing = useRef<THREE.Sprite>(null);
  const pulses = useRef<(THREE.Sprite | null)[]>([]);

  const built = useMemo(() => {
    const palette = paletteFor(glass);
    const glowTex = radialTexture([
      [0, "rgba(255,255,255,1)"],
      [0.4, "rgba(255,255,255,0.55)"],
      [1, "rgba(255,255,255,0)"],
    ]);
    const ringTex = ringTexture();
    const blending = glass ? THREE.AdditiveBlending : THREE.NormalBlending;
    const placed: Placed[] = [];
    const branches: Branch[] = [];
    const baseOpacity = glass ? 0.26 : 0.34;

    for (const spoke of SPOKES) {
      const a = (spoke.angleDeg * Math.PI) / 180;
      const dir = new THREE.Vector2(Math.cos(a), Math.sin(a));
      const color = palette.colors[spoke.category];
      const branchNodes = nodes.filter((n) => n.category === spoke.category);
      const linePts: number[] = [];
      let prev: [number, number, number] = [0, 0, 0];
      branchNodes.forEach((data, j) => {
        const r = RADII[j] ?? RADII[RADII.length - 1];
        const position: [number, number, number] = [dir.x * r, dir.y * r, 0];
        const iconTex = makeIconTexture(data.key, data.icon, palette.iconColor);
        placed.push({ data, position, color, iconTex });
        linePts.push(prev[0], prev[1], prev[2], position[0], position[1], position[2]);
        prev = position;
      });
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(linePts), 3),
      );
      const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: baseOpacity,
        depthWrite: false,
        blending,
      });
      branches.push({ category: spoke.category, dir, geometry, material, baseOpacity });
    }

    return {
      glass,
      blending,
      glowTex,
      ringTex,
      rootColor: palette.core,
      colors: palette.colors,
      placed,
      branches,
    };
  }, [nodes, glass]);

  useEffect(() => {
    return () => {
      built.glowTex.dispose();
      built.ringTex.dispose();
      // Icon textures are module-cached + shared — never disposed per rebuild.
      for (const b of built.branches) {
        b.geometry.dispose();
        b.material.dispose();
      }
    };
  }, [built]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Windmill spin around the core — frozen while a card is open so the node
    // stays put beneath its pop-up.
    const g = group.current;
    if (g && !paused) {
      g.rotation.z -= SPIN_SPEED * Math.min(delta, 0.05);
    }

    for (const b of built.branches) {
      const lit = activeCategory === "all" || activeCategory === b.category;
      const target = lit ? b.baseOpacity : b.baseOpacity * 0.18;
      b.material.opacity += (target - b.material.opacity) * 0.1;
    }

    // Energy pulses flowing from the core outward along each path.
    built.branches.forEach((b, i) => {
      const sprite = pulses.current[i];
      if (!sprite) return;
      const p = (t * 0.22) % 1;
      sprite.position.set(b.dir.x * p * OUTER_R, b.dir.y * p * OUTER_R, 0.05);
      const lit = activeCategory === "all" || activeCategory === b.category;
      const edge = Math.sin(p * Math.PI);
      const target = (lit ? 0.9 : 0.12) * edge;
      const m = sprite.material as THREE.SpriteMaterial;
      m.opacity += (target - m.opacity) * 0.25;
    });

    if (root.current) {
      root.current.scale.setScalar(2.0 + Math.sin(t * 1.5) * 0.14);
    }
    if (rootRing.current) {
      const k = (Math.sin(t * 1.5) + 1) / 2;
      rootRing.current.scale.setScalar(2.4 + k * 0.55);
      (rootRing.current.material as THREE.SpriteMaterial).opacity = 0.35 - k * 0.25;
    }
  });

  return (
    <group ref={group}>
      {built.branches.map((b) => (
        <lineSegments geometry={b.geometry} key={b.category} material={b.material} />
      ))}

      {built.branches.map((b, i) => (
        <sprite
          key={`pulse-${b.category}`}
          ref={(el) => {
            pulses.current[i] = el;
          }}
          scale={0.7}
        >
          <spriteMaterial
            blending={built.blending}
            color={built.colors[b.category]}
            depthWrite={false}
            map={built.glowTex}
            opacity={0}
            transparent
          />
        </sprite>
      ))}

      {/* Core */}
      <sprite ref={rootRing}>
        <spriteMaterial
          color={built.rootColor}
          depthWrite={false}
          map={built.ringTex}
          opacity={0.2}
          transparent
        />
      </sprite>
      <sprite ref={root}>
        <spriteMaterial
          blending={built.blending}
          color={built.rootColor}
          depthWrite={false}
          map={built.glowTex}
          opacity={0.9}
          transparent
        />
      </sprite>

      {built.placed.map((p) => (
        <Node
          dimmed={activeCategory !== "all" && p.data.category !== activeCategory}
          glass={built.glass}
          glowTex={built.glowTex}
          key={p.data.key}
          onHover={onHover}
          onSelect={onSelect}
          placed={p}
          ringTex={built.ringTex}
          selected={selectedKey === p.data.key}
        />
      ))}
    </group>
  );
}

class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function ServiceExplorer({
  nodes,
  activeCategory,
  selectedKey,
  theme,
  onSelect,
  onClose,
}: {
  nodes: ServiceNodeData[];
  activeCategory: Category;
  selectedKey: string;
  theme: "glass" | "bloom";
  onSelect: (key: string, screen: ScreenPos) => void;
  onClose: () => void;
}) {
  const tooltip = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<ServiceNodeData | null>(null);

  // Pause the render loop while the tree is scrolled off-screen or the tab is
  // hidden. The scene self-animates (windmill spin + energy pulses), so without
  // this the GPU keeps drawing every frame even when nothing is visible. Mirrors
  // the IntersectionObserver + visibilitychange gating the Grainient background uses.
  const [live, setLive] = useState(true);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let onScreen = true;
    let pageVisible = !document.hidden;
    const sync = () => setLive(onScreen && pageVisible);
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    io.observe(el);
    const onVisibility = () => {
      pageVisible = !document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!tooltip.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    tooltip.current.style.transform = `translate(${e.clientX - rect.left + 14}px, ${e.clientY - rect.top + 14}px)`;
  };

  return (
    <SceneBoundary>
      <div
        aria-hidden="true"
        className={`relative h-full w-full [touch-action:none] ${hovered ? "cursor-pointer" : "cursor-default"}`}
        onPointerMove={onMove}
        ref={containerRef}
      >
        <Canvas
          camera={{ position: [0, 0, CAM_Z], fov: FOV }}
          dpr={[1, 2]}
          frameloop={live ? "always" : "never"}
          gl={{ alpha: true, antialias: true }}
          onPointerMissed={onClose}
        >
          <Scene
            activeCategory={activeCategory}
            glass={theme === "glass"}
            nodes={nodes}
            onHover={setHovered}
            onSelect={onSelect}
            paused={hovered !== null || selectedKey !== ""}
            selectedKey={selectedKey}
          />
        </Canvas>

        <div
          aria-hidden
          className={`pointer-events-none absolute top-0 left-0 z-10 max-w-[200px] rounded-lg border border-border/50 bg-background/90 px-3 py-1.5 shadow-lg backdrop-blur-sm transition-opacity duration-150 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
          ref={tooltip}
        >
          <span className="block font-medium text-foreground text-sm leading-tight">
            {hovered?.title}
          </span>
          <span className="block font-mono text-muted-foreground text-xs">
            {hovered?.price}
          </span>
        </div>
      </div>
    </SceneBoundary>
  );
}
