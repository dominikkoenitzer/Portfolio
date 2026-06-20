import { Color, Mesh, Program, Renderer, Triangle } from "ogl";
import { useEffect, useRef } from "react";
import { ALL_THEME_VALUES, getVeilPreset, type Theme } from "@/config/themes";

const VERTEX = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAGMENT = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform vec3  uStops[3];
uniform float uScale;
uniform float uMotion;
uniform float uCenter;
uniform float uFeather;
uniform float uSpread;
uniform float uGamma;
uniform float uFloor;
uniform float uSaturation;
uniform float uIntensity;
uniform float uCaustic;
uniform float uGlow;

out vec4 fragColor;

// Hash-based value noise: cheap, smooth, and fully self-contained — no
// gradient lookup tables, so the field reads differently from simplex/Perlin.
float hash(vec2 p) {
  p = fract(p * vec2(127.1, 311.7));
  p += dot(p, p + 34.45);
  return fract(p.x * p.y);
}

float valueNoise(vec2 p) {
  vec2 cell = floor(p);
  vec2 f = fract(p);
  vec2 w = f * f * (3.0 - 2.0 * f);
  float a = hash(cell);
  float b = hash(cell + vec2(1.0, 0.0));
  float c = hash(cell + vec2(0.0, 1.0));
  float d = hash(cell + vec2(1.0, 1.0));
  return mix(mix(a, b, w.x), mix(c, d, w.x), w.y);
}

// Fractal sum, rotating the sample frame each octave to hide the grid.
const mat2 OCTAVE_ROT = mat2(0.80, -0.60, 0.60, 0.80);
float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    sum += amp * valueNoise(p);
    p = OCTAVE_ROT * p * 2.02;
    amp *= 0.5;
  }
  return sum;
}

// Ridged noise — folds the field at its peaks into thin bright crests, the
// building block for the caustic veins of light.
float ridge(vec2 x) { return 1.0 - abs(2.0 * valueNoise(x) - 1.0); }

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / max(uResolution.y, 1.0);

  vec2 base = vec2(uv.x * aspect, uv.y) * (2.5 * uScale);

  // Continuous pan — the whole field translates like a camera gliding over
  // moving water, so it never settles back into the same arrangement.
  vec2 drift = uTime * vec2(0.05, 0.018);
  vec2 p = base + drift;
  float t = uTime * 0.18;

  // Two-pass domain warp folds the drifting field into ribbons.
  vec2 q = vec2(fbm(p + vec2(1.7, 9.2)), fbm(p + vec2(8.3, 2.8)));
  vec2 r = vec2(
    fbm(p + 1.8 * q + vec2(t, 0.4)),
    fbm(p + 1.8 * q + vec2(-0.6, t * 0.9))
  );
  float field = clamp(fbm(p + 2.2 * r) * 1.15, 0.0, 1.0);

  // Caustics: overlapping ridged ripples advected along the same drift as the
  // field, so the light flows like a current instead of boiling in place. The
  // product keeps only the crossings bright; smoothstep cleans them into
  // distinct veins rather than a muddy haze.
  vec2 cflow = drift * 1.6;
  float c1 = ridge(p * 1.8 + cflow + r);
  float c2 = ridge(p * 2.4 - cflow * 0.7 + r * 0.8 + 7.0);
  float caustic = smoothstep(0.35, 0.95, c1 * c2);

  // Walk across the three theme colours via the field plus a gentle
  // left-to-right bias, then lift the caustic crests toward the brightest
  // stop so the glints read as light on water.
  float mixT = clamp(field + (uv.x - 0.5) * 0.35, 0.0, 1.0);
  vec3 col = mix(uStops[0], uStops[1], smoothstep(0.0, 0.6, mixT));
  col = mix(col, uStops[2], smoothstep(0.4, 1.0, mixT));

  // Caustic crests deepen the light themes (toward the darkest stop, which
  // shows under multiply) and brighten the dark theme (toward the lightest
  // stop, which glows under screen). uGlow picks the direction per theme.
  float causticAmt = clamp(caustic * uCaustic, 0.0, 1.0);
  vec3 causticTint = mix(uStops[0], uStops[2], uGlow);
  col = mix(col, causticTint, causticAmt);

  float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(vec3(luma), col, uSaturation);

  // Opacity peaks along a soft band the field nudges up and down, lifted
  // where caustics shine; uFloor keeps a faint wash everywhere.
  float band = uCenter + field * uMotion;
  float fade = 1.0 - smoothstep(uFeather, uFeather + uSpread + 1e-3, abs(uv.y - band));
  float alpha = pow(max(fade, uFloor), uGamma);
  alpha = clamp(alpha + causticAmt * 0.5, 0.0, 1.0) * uIntensity;

  // Premultiplied output to match the renderer's blend configuration.
  fragColor = vec4(col * alpha, alpha);
}
`;

export interface LightVeilProps {
  /** Animation speed multiplier. */
  speed?: number;
  /** How far the bright band drifts vertically (0 = still). */
  motion?: number;
  /** Override the theme's three gradient colours. */
  colorStops?: [string, string, string];
}

const themeFromDom = (): Theme => {
  const { classList } = document.documentElement;
  return ALL_THEME_VALUES.find((name) => classList.contains(name)) ?? "bloom";
};

const DEFAULT_MOTION = 0.4;

/**
 * Full-viewport WebGL gradient haze. Drives colour and opacity from a
 * domain-warped value-noise field so it slowly folds and drifts. Reads its
 * palette and softness from the active theme's veil preset.
 */
export function LightVeil({ speed = 1, motion, colorStops }: LightVeilProps) {
  // Live props are read through a ref so changing them never tears down the
  // GL context (which the effect intentionally creates only once).
  const live = useRef({ speed, motion, colorStops });
  live.current = { speed, motion, colorStops };

  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = host.current;
    if (!node) return;

    const coarsePointer =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      // A soft, blurry haze gains nothing from MSAA — skip it on phones.
      antialias: !coarsePointer,
      // Phones report dpr 3; a soft full-screen blur reads identically at 1×, so
      // rendering at native density would just burn the mobile GPU for nothing.
      dpr: Math.min(window.devicePixelRatio || 1, coarsePointer ? 1 : 2),
    });
    const { gl } = renderer;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = "transparent";

    const toRGB = (hex: string): [number, number, number] => {
      const c = new Color(hex);
      return [c.r, c.g, c.b];
    };

    const program = new Program(gl, {
      vertex: VERTEX,
      fragment: FRAGMENT,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [gl.drawingBufferWidth, gl.drawingBufferHeight] },
        uStops: { value: [] as [number, number, number][] },
        uScale: { value: 1 },
        uMotion: { value: DEFAULT_MOTION },
        uCenter: { value: 0.25 },
        uFeather: { value: 0.45 },
        uSpread: { value: 0.6 },
        uGamma: { value: 1.15 },
        uFloor: { value: 0.04 },
        uSaturation: { value: 1 },
        uIntensity: { value: 0.5 },
        uCaustic: { value: 0.6 },
        uGlow: { value: 0 },
      },
    });

    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    node.appendChild(gl.canvas);

    const setResolution = () => {
      program.uniforms.uResolution.value = [
        gl.drawingBufferWidth,
        gl.drawingBufferHeight,
      ];
    };

    // Pull palette + softness from the active theme. Called on mount and
    // whenever the theme class on <html> changes.
    const applyPreset = () => {
      const preset = getVeilPreset(themeFromDom());
      const u = program.uniforms;
      gl.canvas.style.mixBlendMode =
        preset.blendMode as CSSStyleDeclaration["mixBlendMode"];
      if (!live.current.colorStops) {
        u.uStops.value = preset.colorStops.map(toRGB);
      }
      u.uScale.value = preset.scale;
      u.uCenter.value = preset.base;
      u.uFeather.value = preset.feather;
      u.uSpread.value = preset.blend;
      u.uGamma.value = preset.alphaGamma;
      u.uFloor.value = preset.minAlpha;
      u.uSaturation.value = preset.saturation;
      u.uIntensity.value = preset.intensity;
      u.uCaustic.value = preset.caustic;
      u.uGlow.value = preset.blendMode === "screen" ? 1 : 0;
    };

    const themeWatcher = new MutationObserver(applyPreset);
    themeWatcher.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // On touch devices the browser fires `resize` on every scroll as the URL
    // bar collapses — but only the height changes. Reallocating the GL buffer
    // mid-scroll is what makes scrolling hitch, so there we react to real width
    // changes only (rotation etc.) and let CSS stretch over height changes.
    let prevWidth = -1;
    const fit = () => {
      const w = node.offsetWidth;
      if (coarsePointer && w === prevWidth) return;
      prevWidth = w;
      renderer.setSize(w, node.offsetHeight);
      gl.canvas.style.width = "100%";
      gl.canvas.style.height = "100%";
      setResolution();
    };
    let fitFrame = 0;
    const onResize = () => {
      cancelAnimationFrame(fitFrame);
      fitFrame = requestAnimationFrame(fit);
    };
    window.addEventListener("resize", onResize);

    // The drift is glacial (~0.05 units/sec), so 30fps is indistinguishable
    // from 60 — but on phones it halves the per-frame cost of an already heavy
    // fragment shader. Throttle there; render every frame on desktop.
    const minFrameMs = coarsePointer ? 1000 / 30 : 0;
    let lastRender = 0;
    let frame = 0;
    const render = (ms: number) => {
      frame = requestAnimationFrame(render);
      if (ms - lastRender < minFrameMs) return;
      lastRender = ms;
      const u = program.uniforms;
      u.uTime.value = ms * 0.001 * (live.current.speed ?? 1);
      u.uMotion.value = live.current.motion ?? DEFAULT_MOTION;
      if (live.current.colorStops) {
        u.uStops.value = live.current.colorStops.map(toRGB);
      }
      renderer.render({ scene: mesh });
    };

    applyPreset();
    fit();
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(fitFrame);
      window.removeEventListener("resize", onResize);
      themeWatcher.disconnect();
      if (gl.canvas.parentNode === node) node.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
    // live props are read through a ref, so the GL context is built once and never on rerender
  }, []);

  return <div className="h-full w-full" ref={host} />;
}
