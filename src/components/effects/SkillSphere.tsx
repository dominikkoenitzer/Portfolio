import { Canvas, useFrame } from "@react-three/fiber";
import {
  Component,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useMemo,
  useRef,
} from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { IconType } from "react-icons";
import {
  SiBun,
  SiCplusplus,
  SiDocker,
  SiFigma,
  SiFramer,
  SiGit,
  SiGnubash,
  SiGrafana,
  SiGraphql,
  SiJavascript,
  SiJenkins,
  SiKotlin,
  SiMongodb,
  SiNextdotjs,
  SiNginx,
  SiNodedotjs,
  SiOpenjdk,
  SiPnpm,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
  SiRust,
  SiSharp,
  SiSpring,
  SiTailwindcss,
  SiTypescript,
  SiUbuntu,
  SiVercel,
} from "react-icons/si";
import * as THREE from "three";

/**
 * SkillSphere — a draggable 3D cloud of the tech-stack logos (three.js / r3f).
 *
 * Each logo is rendered (react-icons SVG → data URL → texture) onto a sprite,
 * distributed over a Fibonacci sphere. The group auto-rotates, eases toward the
 * cursor on drag, and fades sprites toward the back for depth. Brand colours are
 * baked into the textures; black/white marks use a theme-neutral slate so they
 * read on both light and dark themes. Default-exported for React.lazy.
 */

const RADIUS = 2.4;
const SPRITE = 0.62;
const CAM_Z = 6.9; // pulled back so the full sphere fits with margin (no edge clipping while it tumbles)
const AUTO_Y = 0.0016;
const AUTO_X = 0.0008; // constant tilt so the Y-poles also drift (nothing stays still)
const NEUTRAL = "#94A3B8"; // for monochrome marks (Next.js, Vercel, Rust, Bun)

const ICONS: { Icon: IconType; color: string }[] = [
  { Icon: SiReact, color: "#61DAFB" },
  { Icon: SiNextdotjs, color: NEUTRAL },
  { Icon: SiTypescript, color: "#3178C6" },
  { Icon: SiJavascript, color: "#F7DF1E" },
  { Icon: SiTailwindcss, color: "#38BDF8" },
  { Icon: SiFramer, color: "#1466FF" },
  { Icon: SiNodedotjs, color: "#5FA04E" },
  { Icon: SiBun, color: NEUTRAL },
  { Icon: SiSpring, color: "#6DB33F" },
  { Icon: SiPython, color: "#4B8BBE" },
  { Icon: SiOpenjdk, color: "#ED8B00" },
  { Icon: SiKotlin, color: "#7F52FF" },
  { Icon: SiRust, color: NEUTRAL },
  { Icon: SiCplusplus, color: "#0086D4" },
  { Icon: SiSharp, color: "#A074C4" },
  { Icon: SiGraphql, color: "#E535AB" },
  { Icon: SiGnubash, color: "#5AB552" },
  { Icon: SiDocker, color: "#2496ED" },
  { Icon: SiVercel, color: NEUTRAL },
  { Icon: SiNginx, color: "#009639" },
  { Icon: SiJenkins, color: "#E0584B" },
  { Icon: SiGrafana, color: "#F46800" },
  { Icon: SiUbuntu, color: "#E95420" },
  { Icon: SiGit, color: "#F05032" },
  { Icon: SiPostgresql, color: "#4F8CC9" },
  { Icon: SiMongodb, color: "#4DB33D" },
  { Icon: SiRedis, color: "#FF5A4D" },
  { Icon: SiPnpm, color: "#F69220" },
  { Icon: SiFigma, color: "#F24E1E" },
];

function makeTexture(Icon: IconType, color: string): THREE.Texture {
  const svg = renderToStaticMarkup(<Icon color={color} size={128} />);
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  const tex = new THREE.TextureLoader().load(url);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function fibonacciSphere(n: number, r: number): [number, number, number][] {
  const pts: [number, number, number][] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const ring = Math.sqrt(1 - y * y);
    const theta = phi * i;
    pts.push([Math.cos(theta) * ring * r, y * r, Math.sin(theta) * ring * r]);
  }
  return pts;
}

type Vel = { x: number; y: number };
type Drag = { active: boolean; x: number; y: number };

function Cloud({
  vel,
  drag,
}: {
  vel: MutableRefObject<Vel>;
  drag: MutableRefObject<Drag>;
}) {
  const textures = useMemo(
    () => ICONS.map(({ Icon, color }) => makeTexture(Icon, color)),
    [],
  );
  const positions = useMemo(
    () => fibonacciSphere(textures.length, RADIUS),
    [textures.length],
  );
  const group = useRef<THREE.Group>(null);
  const sprites = useRef<(THREE.Sprite | null)[]>([]);
  const world = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    if (!drag.current.active) {
      vel.current.y += (AUTO_Y - vel.current.y) * 0.03;
      vel.current.x += (AUTO_X - vel.current.x) * 0.03;
    }
    // Tumble on both axes (no clamp) so logos near a pole never sit still.
    g.rotation.y += vel.current.y;
    g.rotation.x += vel.current.x;
    for (const s of sprites.current) {
      if (!s) continue;
      s.getWorldPosition(world);
      const t = (world.z + RADIUS) / (2 * RADIUS); // 0 = back, 1 = front
      (s.material as THREE.SpriteMaterial).opacity =
        0.16 + 0.84 * Math.min(1, Math.max(0, t));
    }
  });

  return (
    <group ref={group}>
      {positions.map((p, i) => (
        <sprite
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length icon list
          key={i}
          position={p}
          ref={(el) => {
            sprites.current[i] = el;
          }}
          scale={[SPRITE, SPRITE, 1]}
        >
          <spriteMaterial
            depthWrite={false}
            map={textures[i]}
            transparent
          />
        </sprite>
      ))}
    </group>
  );
}

/** Renders nothing if WebGL/the scene throws — the chip list below remains. */
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

export default function SkillSphere() {
  const vel = useRef<Vel>({ x: 0.0012, y: AUTO_Y });
  const drag = useRef<Drag>({ active: false, x: 0, y: 0 });

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    drag.current = { active: true, x: e.clientX, y: e.clientY };
  };
  const onUp = () => {
    drag.current.active = false;
  };
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    drag.current.x = e.clientX;
    drag.current.y = e.clientY;
    vel.current.y = dx * 0.005;
    vel.current.x = dy * 0.005;
  };

  return (
    <SceneBoundary>
      <div
        aria-hidden="true"
        className="h-full w-full cursor-grab [touch-action:none] active:cursor-grabbing"
        onPointerDown={onDown}
        onPointerLeave={onUp}
        onPointerMove={onMove}
        onPointerUp={onUp}
      >
        <Canvas
          camera={{ position: [0, 0, CAM_Z], fov: 50 }}
          dpr={[1, 2]}
          gl={{ alpha: true, antialias: true }}
        >
          <Cloud drag={drag} vel={vel} />
        </Canvas>
      </div>
    </SceneBoundary>
  );
}
