import type { LucideIcon } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import * as THREE from "three";

// ── Procedural textures (module-cached: shared, never disposed) ─────────────
let glowTexCache: THREE.Texture | null = null;
export function glowTexture(): THREE.Texture {
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
export function leafTexture(): THREE.Texture {
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
export function iconTexture(cacheKey: string, Icon: LucideIcon): THREE.Texture {
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
