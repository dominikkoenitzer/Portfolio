import { Mesh, Program, Triangle } from "ogl";
import { useEffect, useRef } from "react";

import { createRenderer } from "./createRenderer";
import "./Aurora.css";

/**
 * Aurora, from React Bits (reactbits.dev/backgrounds/aurora), ported to
 * TypeScript on the repo's null-safe `createRenderer`, with the loop parked
 * while off-screen or tab-hidden and a single static frame under
 * `prefers-reduced-motion`. The ribbon is written as premultiplied alpha, so
 * whatever sits behind the canvas is the backdrop.
 *
 * One addition over upstream: `flat`. Upstream multiplies the ramp colour by
 * the ribbon's intensity, which is right on a dark page (the band glows) and
 * wrong on a light one (the band turns muddy). With `flat` the stops keep
 * their true colour and only the alpha carries the shape.
 */

const hexToRgb = (hex: string): [number, number, number] => {
  const value = hex.trim().replace(/^#/, "");
  const normalized =
    value.length === 3
      ? value.replace(/./g, (channel) => channel + channel)
      : value;
  const match = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized);
  if (!match) {
    return [1, 1, 1];
  }
  return [
    Number.parseInt(match[1], 16) / 255,
    Number.parseInt(match[2], 16) / 255,
    Number.parseInt(match[3], 16) / 255,
  ];
};

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
uniform float uFlat;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ),
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \\
  int index = 0;                                            \\
  for (int i = 0; i < 2; i++) {                               \\
     ColorStop currentColor = colors[i];                    \\
     bool isInBetween = currentColor.position <= factor;    \\
     index = int(mix(float(index), float(i), float(isInBetween))); \\
  }                                                         \\
  ColorStop currentColor = colors[index];                   \\
  ColorStop nextColor = colors[index + 1];                  \\
  float range = nextColor.position - currentColor.position; \\
  float lerpFactor = (factor - currentColor.position) / range; \\
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \\
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);

  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);

  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;

  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);

  vec3 auroraColor = mix(intensity * rampColor, rampColor, uFlat);

  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

export interface AuroraProps {
  /** Three stops, left to right. */
  colorStops?: [string, string, string];
  /** Height of the ribbon's wave. */
  amplitude?: number;
  /** Softness of the ribbon's lower edge. */
  blend?: number;
  /** Animation speed. */
  speed?: number;
  /** Keep the stops at their true colour instead of scaling them by intensity. */
  flat?: boolean;
  /** Canvas pixel density, clamped between 0.5 and 2. */
  dpr?: number;
  className?: string;
}

type AuroraCtx = {
  program: Program;
  render: () => void;
  setSpeed: (value: number) => void;
};

const ctxMap = new WeakMap<HTMLDivElement, AuroraCtx>();

const Aurora = ({
  colorStops = ["#5227FF", "#7cff67", "#5227FF"],
  amplitude = 1,
  blend = 0.5,
  speed = 1,
  flat = false,
  dpr = 1,
  className = "",
}: AuroraProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const renderer = createRenderer({
      webgl: 2,
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
      dpr: Math.min(Math.max(dpr, 0.5), 2),
    });
    if (!renderer) {
      return;
    }

    const { gl } = renderer;
    const canvas = gl.canvas;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "transparent";
    container.appendChild(canvas);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) {
      delete geometry.attributes.uv;
    }
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: 1 },
        uColorStops: { value: [hexToRgb("#5227FF"), hexToRgb("#7cff67"), hexToRgb("#5227FF")] },
        uResolution: { value: [1, 1] },
        uBlend: { value: 0.5 },
        uFlat: { value: 0 },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    let frameId = 0;
    let elapsed = 0;
    let previousTime = performance.now();
    let currentSpeed = 1;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const render = () => renderer.render({ scene: mesh });
    const stop = () => {
      if (frameId !== 0) {
        cancelAnimationFrame(frameId);
      }
      frameId = 0;
    };
    const canAnimate = () => isVisible && isPageVisible && !reducedMotion.matches;
    const loop = (now: number) => {
      frameId = 0;
      if (!canAnimate()) {
        return;
      }
      const delta = Math.min((now - previousTime) / 1000, 0.1);
      previousTime = now;
      elapsed += delta * currentSpeed;
      program.uniforms.uTime.value = elapsed;
      render();
      frameId = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!canAnimate() || frameId !== 0) {
        return;
      }
      previousTime = performance.now();
      frameId = requestAnimationFrame(loop);
    };
    const sync = () => {
      if (canAnimate()) {
        start();
      } else {
        stop();
        render();
      }
    };

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(
        Math.max(1, Math.floor(rect.width)),
        Math.max(1, Math.floor(rect.height)),
      );
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      program.uniforms.uResolution.value = [
        gl.drawingBufferWidth,
        gl.drawingBufferHeight,
      ];
      render();
    };

    const resizeObserver = new ResizeObserver(setSize);
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(container);
    const handleVisibility = () => {
      isPageVisible = !document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    reducedMotion.addEventListener("change", sync);

    ctxMap.set(container, {
      program,
      render,
      setSpeed(value) {
        currentSpeed = value;
      },
    });

    setSize();
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      reducedMotion.removeEventListener("change", sync);
      ctxMap.delete(container);
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [dpr]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const ctx = ctxMap.get(container);
    if (!ctx) {
      return;
    }
    const u = ctx.program.uniforms;
    u.uColorStops.value = colorStops.map(hexToRgb);
    u.uAmplitude.value = amplitude;
    u.uBlend.value = blend;
    u.uFlat.value = flat ? 1 : 0;
    ctx.setSpeed(speed);
    ctx.render();
  }, [colorStops, amplitude, blend, speed, flat, dpr]);

  return (
    <div className={`aurora-container ${className}`.trim()} ref={containerRef} />
  );
};

export default Aurora;
