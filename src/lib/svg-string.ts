import { isValidElement, type ReactElement, type ReactNode } from "react";
import { DefaultContext } from "react-icons";

/**
 * Turns a React element tree that describes an SVG into markup, without
 * react-dom/server. The two WebGL scenes rasterise icon components into
 * textures, and pulling the 189 kB server renderer into the browser for that
 * was the single largest avoidable download on /skills and /services.
 *
 * Handles what icon libraries actually produce: string-typed elements,
 * plain function components (react-icons), forwardRef and memo wrappers
 * (lucide-react), fragments, and a context consumer whose child is a render
 * function (react-icons' IconBase reads its theme through one). Anything
 * else throws, so a new kind of component cannot fail silently into a blank
 * texture. Output is byte-identical to renderToStaticMarkup for these trees;
 * `svg-string.test.ts` holds it to that.
 */

const FORWARD_REF = Symbol.for("react.forward_ref");
const MEMO = Symbol.for("react.memo");
const FRAGMENT = Symbol.for("react.fragment");

/** SVG attributes that are camelCase in the spec itself, never kebab-cased. */
const CAMEL_SVG = new Set([
  "viewBox",
  "preserveAspectRatio",
  "gradientUnits",
  "gradientTransform",
  "patternUnits",
  "patternTransform",
  "patternContentUnits",
  "clipPathUnits",
  "markerUnits",
  "markerWidth",
  "markerHeight",
  "maskUnits",
  "maskContentUnits",
  "refX",
  "refY",
  "spreadMethod",
  "startOffset",
  "textLength",
  "lengthAdjust",
  "baseFrequency",
  "numOctaves",
  "stitchTiles",
  "xChannelSelector",
  "yChannelSelector",
  "tableValues",
  "filterUnits",
  "primitiveUnits",
  "attributeName",
  "attributeType",
  "repeatCount",
  "repeatDur",
  "keyTimes",
  "keySplines",
  "keyPoints",
  "calcMode",
  "stdDeviation",
  "kernelMatrix",
  "kernelUnitLength",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "diffuseConstant",
  "limitingConeAngle",
  "pointsAtX",
  "pointsAtY",
  "pointsAtZ",
  "targetX",
  "targetY",
  "edgeMode",
]);

const ATTR_ALIAS: Record<string, string> = {
  className: "class",
  htmlFor: "for",
  xlinkHref: "xlink:href",
  xmlnsXlink: "xmlns:xlink",
  xmlLang: "xml:lang",
  xmlSpace: "xml:space",
};

const SKIP_PROPS = new Set(["children", "ref", "key", "dangerouslySetInnerHTML"]);

/** CSS properties React leaves unitless when given a number. */
const UNITLESS = new Set([
  "opacity",
  "fillOpacity",
  "strokeOpacity",
  "strokeWidth",
  "flex",
  "flexGrow",
  "flexShrink",
  "fontWeight",
  "lineHeight",
  "order",
  "zIndex",
  "zoom",
]);

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

const escapeAttr = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const escapeText = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function attrName(prop: string): string {
  if (ATTR_ALIAS[prop]) return ATTR_ALIAS[prop];
  if (CAMEL_SVG.has(prop)) return prop;
  return kebab(prop);
}

function styleString(style: Record<string, unknown>): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(style)) {
    if (value === undefined || value === null || value === "") continue;
    const css =
      typeof value === "number" && value !== 0 && !UNITLESS.has(key)
        ? `${value}px`
        : String(value);
    parts.push(`${kebab(key)}:${css}`);
  }
  return parts.join(";");
}

function attributes(props: Record<string, unknown>): string {
  let out = "";
  for (const [prop, value] of Object.entries(props)) {
    if (SKIP_PROPS.has(prop)) continue;
    if (value === undefined || value === null || value === false) continue;
    if (typeof value === "function") continue;
    if (prop === "style") {
      if (value && typeof value === "object") {
        const css = styleString(value as Record<string, unknown>);
        if (css) out += ` style="${escapeAttr(css)}"`;
      }
      continue;
    }
    if (value === true) {
      out += ` ${attrName(prop)}=""`;
      continue;
    }
    out += ` ${attrName(prop)}="${escapeAttr(String(value))}"`;
  }
  return out;
}

type AnyProps = Record<string, unknown> & { children?: unknown };
type WrapperType = {
  $$typeof?: symbol;
  render?: (props: AnyProps, ref: null) => ReactNode;
  type?: unknown;
};

function renderElement(element: ReactElement<AnyProps>): string {
  const { type, props } = element;

  if (typeof type === "string") {
    return `<${type}${attributes(props)}>${renderNode(props.children as ReactNode)}</${type}>`;
  }
  if ((type as unknown) === FRAGMENT) {
    return renderNode(props.children as ReactNode);
  }
  if (typeof type === "function") {
    // Plain function component. Hooks would throw here; the icon components
    // this exists for use none.
    return renderNode((type as (p: AnyProps) => ReactNode)(props));
  }
  if (type && typeof type === "object") {
    const wrapper = type as WrapperType;
    if (wrapper.$$typeof === FORWARD_REF && wrapper.render) {
      return renderNode(wrapper.render(props, null));
    }
    if (wrapper.$$typeof === MEMO) {
      return renderElement({
        ...element,
        type: wrapper.type,
      } as ReactElement<AnyProps>);
    }
    if (typeof props.children === "function") {
      // A context consumer. The only provider these trees can see is
      // react-icons' default, so hand it that.
      return renderNode(
        (props.children as (value: typeof DefaultContext) => ReactNode)(
          DefaultContext,
        ),
      );
    }
  }
  throw new Error(
    `renderSvgString: unsupported element type ${String(
      typeof type === "object" ? (type as WrapperType).$$typeof : type,
    )}`,
  );
}

function renderNode(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }
  if (typeof node === "string") return escapeText(node);
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(renderNode).join("");
  if (isValidElement(node)) {
    return renderElement(node as ReactElement<AnyProps>);
  }
  return "";
}

/** Static SVG markup for an icon element, ready for a data URL. */
export function renderSvgString(element: ReactElement): string {
  return renderElement(element as ReactElement<AnyProps>);
}

/** The same markup wrapped as a `data:image/svg+xml` URL for TextureLoader. */
export function svgDataUrl(element: ReactElement): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(renderSvgString(element))}`;
}
