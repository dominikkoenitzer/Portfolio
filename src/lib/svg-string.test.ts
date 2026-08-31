import { Code, Search, Server, ShieldCheck, Wrench } from "lucide-react";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  SiBun,
  SiCplusplus,
  SiDocker,
  SiGraphql,
  SiJavascript,
  SiNextdotjs,
  SiPostgresql,
  SiReact,
  SiRust,
  SiTypescript,
} from "react-icons/si";
import { describe, expect, it } from "vitest";
import { renderSvgString, svgDataUrl } from "./svg-string";

// The serializer replaces react-dom/server in the browser bundle. This test is
// the contract: for every kind of icon the WebGL scenes rasterise, its output
// must be byte-identical to what the real renderer produces.

describe("renderSvgString", () => {
  it("matches renderToStaticMarkup for react-icons (SkillSphere textures)", () => {
    const icons = [
      SiReact,
      SiNextdotjs,
      SiTypescript,
      SiJavascript,
      SiBun,
      SiRust,
      SiCplusplus,
      SiGraphql,
      SiDocker,
      SiPostgresql,
    ];
    for (const Icon of icons) {
      const el = createElement(Icon, { color: "#61DAFB", size: 128 });
      expect(renderSvgString(el)).toBe(renderToStaticMarkup(el));
    }
  });

  it("matches renderToStaticMarkup for lucide icons (service tree textures)", () => {
    for (const Icon of [Code, Server, ShieldCheck, Wrench, Search]) {
      const el = createElement(Icon, {
        color: "#ffffff",
        size: 256,
        strokeWidth: 1.7,
      });
      expect(renderSvgString(el)).toBe(renderToStaticMarkup(el));
    }
  });

  it("kebab-cases React attribute names but keeps SVG camelCase ones", () => {
    const el = createElement(
      "svg",
      { viewBox: "0 0 24 24", strokeWidth: 2, className: "x" },
      createElement("path", { d: "M0 0", fillRule: "evenodd" }),
    );
    expect(renderSvgString(el)).toBe(
      '<svg viewBox="0 0 24 24" stroke-width="2" class="x"><path d="M0 0" fill-rule="evenodd"></path></svg>',
    );
    expect(renderSvgString(el)).toBe(renderToStaticMarkup(el));
  });

  it("wraps the markup as a data URL", () => {
    const el = createElement(SiReact, { color: "#fff", size: 64 });
    const url = svgDataUrl(el);
    expect(url.startsWith("data:image/svg+xml;charset=utf-8,")).toBe(true);
    expect(decodeURIComponent(url.split(",")[1])).toBe(renderToStaticMarkup(el));
  });

  it("refuses element types it does not understand instead of emitting nothing", () => {
    const el = {
      ...createElement("svg"),
      type: Symbol.for("react.suspense"),
    } as never;
    expect(() => renderSvgString(el)).toThrow(/unsupported element type/);
  });
});
