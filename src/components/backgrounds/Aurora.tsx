import { Color, Mesh, Program, Renderer, Triangle } from "ogl";
import { useEffect, useRef } from "react";
import {
  ALL_THEME_VALUES,
  getAuroraPreset,
  type Theme,
} from "@/config/themes";

const VERT = `#version 300 es
in vec2 position;
void main(){ gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3  uColorStops[3];
uniform vec2  uResolution;
uniform float uBlend;
uniform float uIntensity;
uniform float uScale;
uniform float uFeather;
uniform float uAlphaGamma;
uniform float uSaturation;
uniform float uMinAlpha;
uniform float uBase;

out vec4 fragColor;

vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x,289.0); }

float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod(i,289.0);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m*=m; m*=m;
  vec3 x=2.0*fract(p*C.www)-1.0;
  vec3 h=abs(x)-0.5;
  vec3 ox=floor(x+0.5);
  vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g;
  g.x=a0.x*x0.x + h.x*x0.y;
  g.yz=a0.yz*x12.xz + h.yz*x12.yw;
  return 130.0*dot(m,g);
}

struct ColorStop { vec3 color; float position; };

#define COLOR_RAMP(colors,factor,finalColor) {                  \
  int index=0;                                                  \
  for (int i=0;i<2;i++){                                        \
    ColorStop c=colors[i];                                      \
    bool inb=c.position<=factor;                                \
    index=int(mix(float(index),float(i),float(inb)));           \
  }                                                             \
  ColorStop c0=colors[index];                                   \
  ColorStop c1=colors[index+1];                                 \
  float range=c1.position-c0.position;                          \
  float t=(factor-c0.position)/max(range,1e-4);                 \
  finalColor=mix(c0.color,c1.color,clamp(t,0.0,1.0));           \
}

void main(){
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 suv = vec2(uv.x * aspect, uv.y);

  ColorStop colors[3];
  colors[0]=ColorStop(uColorStops[0],0.0);
  colors[1]=ColorStop(uColorStops[1],0.5);
  colors[2]=ColorStop(uColorStops[2],1.0);

  vec3 rampColor; COLOR_RAMP(colors, uv.x, rampColor);

  float n = snoise(vec2(suv.x * uScale + uTime*0.06, uTime*0.12));
  n = 0.5 + 0.5 * n;

  float wave = uBase + n * 0.35 * uAmplitude;
  float d = uv.y - wave;

  float alpha = smoothstep(-(uFeather+uBlend), (uFeather+uBlend), -d);
  alpha = max(alpha, uMinAlpha);
  alpha = pow(alpha, uAlphaGamma);

  float gray = dot(rampColor, vec3(0.2126, 0.7152, 0.0722));
  vec3 satCol = mix(vec3(gray), rampColor, uSaturation);

  vec3 col = satCol * (0.6 + 0.4*n) * uIntensity;
  fragColor = vec4(col * alpha, alpha * uIntensity);
}
`;

export interface AuroraProps {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
  time?: number;
  speed?: number;
  scale?: number;
  feather?: number;
  alphaGamma?: number;
  saturation?: number;
  minAlpha?: number;
  base?: number;
}

const detectThemeFromHtml = (): Theme => {
  const cls = document.documentElement.classList;
  for (const key of ALL_THEME_VALUES) {
    if (cls.contains(key)) return key;
  }
  return "glass";
};

export function Aurora({
  amplitude = 0.45,
  speed = 1.0,
  ...over
}: AuroraProps) {
  const propsRef = useRef({ amplitude, speed, ...over });
  propsRef.current = { amplitude, speed, ...over };

  const ctnDom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    const isCoarse =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      // MSAA is wasted on a soft, blurry aurora — skip it on phones.
      antialias: !isCoarse,
      // iPhones report dpr 3; a blurry full-screen shader doesn't need that.
      dpr: Math.min(window.devicePixelRatio || 1, isCoarse ? 1.5 : 2),
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = "transparent";

    let program: Program | undefined;

    const toRGB = (hex: string) => {
      const c = new Color(hex);
      return [c.r, c.g, c.b] as [number, number, number];
    };

    const preset = getAuroraPreset(detectThemeFromHtml());
    gl.canvas.style.mixBlendMode =
      preset.blendMode as CSSStyleDeclaration["mixBlendMode"];

    const setRes = () => {
      if (program)
        program.uniforms.uResolution.value = [
          gl.drawingBufferWidth,
          gl.drawingBufferHeight,
        ];
    };

    // iOS Safari fires `resize` on every scroll as the URL bar collapses —
    // that only changes the height. Re-allocating the GL buffer mid-scroll is
    // what makes scrolling hitch, so on touch we react to real width changes
    // only (rotation etc.) and let CSS stretch the canvas over height changes.
    let lastWidth = -1;
    const resize = () => {
      const w = ctn.offsetWidth;
      if (isCoarse && w === lastWidth) return;
      lastWidth = w;
      renderer.setSize(w, ctn.offsetHeight);
      gl.canvas.style.width = "100%";
      gl.canvas.style.height = "100%";
      setRes();
    };
    let resizeRaf = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(resize);
    };
    window.addEventListener("resize", onResize);

    const geometry = new Triangle(gl);
    // biome-ignore lint/suspicious/noExplicitAny: OGL Triangle internals not typed
    const geomAttrs = (geometry as Record<string, any>).attributes;
    if (geomAttrs?.uv) delete geomAttrs.uv;

    program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: propsRef.current.amplitude },
        uColorStops: {
          value: (propsRef.current.colorStops ?? preset.colorStops).map(toRGB),
        },
        uResolution: { value: [gl.drawingBufferWidth, gl.drawingBufferHeight] },
        uBlend: { value: propsRef.current.blend ?? preset.blend },
        uIntensity: { value: preset.intensity },
        uScale: { value: propsRef.current.scale ?? preset.scale },
        uFeather: { value: propsRef.current.feather ?? preset.feather },
        uAlphaGamma: {
          value: propsRef.current.alphaGamma ?? preset.alphaGamma,
        },
        uSaturation: {
          value: propsRef.current.saturation ?? preset.saturation,
        },
        uMinAlpha: { value: propsRef.current.minAlpha ?? preset.minAlpha },
        uBase: { value: propsRef.current.base ?? preset.base },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    const applyTheme = () => {
      if (!program) return;
      const p = getAuroraPreset(detectThemeFromHtml());
      gl.canvas.style.mixBlendMode =
        p.blendMode as CSSStyleDeclaration["mixBlendMode"];
      program.uniforms.uIntensity.value = p.intensity;
      if (!propsRef.current.colorStops)
        program.uniforms.uColorStops.value = p.colorStops.map(toRGB);
      if (propsRef.current.blend == null)
        program.uniforms.uBlend.value = p.blend;
      if (propsRef.current.scale == null)
        program.uniforms.uScale.value = p.scale;
      if (propsRef.current.feather == null)
        program.uniforms.uFeather.value = p.feather;
      if (propsRef.current.alphaGamma == null)
        program.uniforms.uAlphaGamma.value = p.alphaGamma;
      if (propsRef.current.saturation == null)
        program.uniforms.uSaturation.value = p.saturation;
      if (propsRef.current.minAlpha == null)
        program.uniforms.uMinAlpha.value = p.minAlpha;
      if (propsRef.current.base == null) program.uniforms.uBase.value = p.base;
      setRes();
    };

    const observer = new MutationObserver(applyTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    let raf = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!program) return;
      const { time = t * 0.01 } = propsRef.current;
      program.uniforms.uTime.value =
        time * (propsRef.current.speed ?? speed) * 0.1;
      program.uniforms.uAmplitude.value = propsRef.current.amplitude;

      if (propsRef.current.colorStops) {
        program.uniforms.uColorStops.value =
          propsRef.current.colorStops.map(toRGB);
      }
      if (typeof propsRef.current.blend === "number") {
        program.uniforms.uBlend.value = propsRef.current.blend;
      }
      if (typeof propsRef.current.base === "number") {
        program.uniforms.uBase.value = propsRef.current.base;
      }

      renderer.render({ scene: mesh });
    };

    raf = requestAnimationFrame(loop);
    resize();
    applyTheme();

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
      if (gl.canvas.parentNode === ctn) ctn.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
    // biome-ignore lint/correctness/useExhaustiveDependencies: props are read via propsRef to avoid GL teardowns on rerender
  }, []);

  return <div className="h-full w-full" ref={ctnDom} />;
}
