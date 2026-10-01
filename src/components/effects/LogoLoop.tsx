import {
  type CSSProperties,
  type FocusEvent,
  type Key,
  memo,
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "./LogoLoop.css";

/**
 * LogoLoop, a smooth, infinitely-scrolling marquee of logos (React Bits),
 * ported to TypeScript. Used for the tech-stack strip on the project pages.
 */

const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 };

/**
 * How far in from each end of the strip a focused link is brought, as a share
 * of the strip's length. Clears the 12% edge fade the project pages mask the
 * strip with, so the focused logo is fully visible.
 */
const FOCUS_INSET = 0.15;

export type LogoNodeItem = {
  node: ReactNode;
  title?: string;
  href?: string;
  ariaLabel?: string;
};
export type LogoImageItem = {
  src: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
  alt?: string;
  title?: string;
  href?: string;
  ariaLabel?: string;
};
export type LogoItem = LogoNodeItem | LogoImageItem;

export interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number;
  direction?: "left" | "right" | "up" | "down";
  width?: number | string;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  hoverSpeed?: number;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  renderItem?: (item: LogoItem, key: Key) => ReactNode;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

const toCssLength = (value?: number | string) =>
  typeof value === "number" ? `${value}px` : (value ?? undefined);

const useResizeObserver = (
  callback: () => void,
  elements: Array<RefObject<Element | null>>,
  dependencies: unknown[],
) => {
  useEffect(() => {
    if (!window.ResizeObserver) {
      const handleResize = () => callback();
      window.addEventListener("resize", handleResize);
      callback();
      return () => window.removeEventListener("resize", handleResize);
    }
    const observers = elements.map((ref) => {
      if (!ref.current) return null;
      const observer = new ResizeObserver(callback);
      observer.observe(ref.current);
      return observer;
    });
    callback();
    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, ...dependencies]);
};

const useImageLoader = (
  seqRef: RefObject<HTMLElement | null>,
  onLoad: () => void,
  dependencies: unknown[],
) => {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll("img") ?? [];
    if (images.length === 0) {
      onLoad();
      return;
    }
    let remainingImages = images.length;
    const handleImageLoad = () => {
      remainingImages -= 1;
      if (remainingImages === 0) onLoad();
    };
    images.forEach((img) => {
      if (img.complete) {
        handleImageLoad();
      } else {
        img.addEventListener("load", handleImageLoad, { once: true });
        img.addEventListener("error", handleImageLoad, { once: true });
      }
    });
    return () => {
      images.forEach((img) => {
        img.removeEventListener("load", handleImageLoad);
        img.removeEventListener("error", handleImageLoad);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onLoad, seqRef, ...dependencies]);
};

const useAnimationLoop = (
  trackRef: RefObject<HTMLDivElement | null>,
  targetVelocity: number,
  seqWidth: number,
  seqHeight: number,
  isHovered: boolean,
  hoverSpeed: number | undefined,
  isVertical: boolean,
  heldRef: RefObject<boolean>,
) => {
  const rafRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const seqSize = isVertical ? seqHeight : seqWidth;

    // Not while held: the focused link may sit at an offset outside one
    // sequence, and wrapping it here would move it out of view.
    if (seqSize > 0 && !heldRef.current) {
      offsetRef.current = ((offsetRef.current % seqSize) + seqSize) % seqSize;
      track.style.transform = isVertical
        ? `translate3d(0, ${-offsetRef.current}px, 0)`
        : `translate3d(${-offsetRef.current}px, 0, 0)`;
    }

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === null) lastTimestampRef.current = timestamp;
      const deltaTime =
        Math.max(0, timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      // A keyboard user is on one of the links: stand still exactly where the
      // focus handler put it. Not even wrapped, because the focused link
      // belongs to the first copy and wrapping would hand its place to a copy.
      if (heldRef.current) {
        velocityRef.current = 0;
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const target =
        isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity;
      const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * easingFactor;

      if (seqSize > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
        nextOffset = ((nextOffset % seqSize) + seqSize) % seqSize;
        offsetRef.current = nextOffset;
        track.style.transform = isVertical
          ? `translate3d(0, ${-offsetRef.current}px, 0)`
          : `translate3d(${-offsetRef.current}px, 0, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimestampRef.current = null;
    };
  }, [
    targetVelocity,
    seqWidth,
    seqHeight,
    isHovered,
    hoverSpeed,
    isVertical,
    trackRef,
    heldRef,
  ]);

  return offsetRef;
};

export const LogoLoop = memo(
  ({
    logos,
    speed = 120,
    direction = "left",
    width = "100%",
    logoHeight = 28,
    gap = 32,
    pauseOnHover,
    hoverSpeed,
    fadeOut = false,
    fadeOutColor,
    scaleOnHover = false,
    renderItem,
    ariaLabel = "Partner logos",
    className,
    style,
  }: LogoLoopProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const seqRef = useRef<HTMLUListElement>(null);

    const [seqWidth, setSeqWidth] = useState(0);
    const [seqHeight, setSeqHeight] = useState(0);
    const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
    const [isHovered, setIsHovered] = useState(false);
    // True while a link in the strip has keyboard focus: the strip stops, so
    // the focused logo neither drifts out of view nor keeps moving under it.
    const focusHeldRef = useRef(false);

    const effectiveHoverSpeed = useMemo(() => {
      if (hoverSpeed !== undefined) return hoverSpeed;
      if (pauseOnHover === true) return 0;
      if (pauseOnHover === false) return undefined;
      return 0;
    }, [hoverSpeed, pauseOnHover]);

    const isVertical = direction === "up" || direction === "down";

    const targetVelocity = useMemo(() => {
      const magnitude = Math.abs(speed);
      const directionMultiplier = isVertical
        ? direction === "up"
          ? 1
          : -1
        : direction === "left"
          ? 1
          : -1;
      const speedMultiplier = speed < 0 ? -1 : 1;
      return magnitude * directionMultiplier * speedMultiplier;
    }, [speed, direction, isVertical]);

    const updateDimensions = useCallback(() => {
      const containerWidth = containerRef.current?.clientWidth ?? 0;
      const sequenceRect = seqRef.current?.getBoundingClientRect?.();
      const sequenceWidth = sequenceRect?.width ?? 0;
      const sequenceHeight = sequenceRect?.height ?? 0;
      if (isVertical) {
        const parentHeight =
          containerRef.current?.parentElement?.clientHeight ?? 0;
        if (containerRef.current && parentHeight > 0) {
          const targetHeight = Math.ceil(parentHeight);
          if (containerRef.current.style.height !== `${targetHeight}px`)
            containerRef.current.style.height = `${targetHeight}px`;
        }
        if (sequenceHeight > 0) {
          setSeqHeight(Math.ceil(sequenceHeight));
          const viewport =
            containerRef.current?.clientHeight ?? parentHeight ?? sequenceHeight;
          const copiesNeeded =
            Math.ceil(viewport / sequenceHeight) +
            ANIMATION_CONFIG.COPY_HEADROOM;
          setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
        }
      } else if (sequenceWidth > 0) {
        setSeqWidth(Math.ceil(sequenceWidth));
        const copiesNeeded =
          Math.ceil(containerWidth / sequenceWidth) +
          ANIMATION_CONFIG.COPY_HEADROOM;
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
      }
    }, [isVertical]);

    useResizeObserver(updateDimensions, [containerRef, seqRef], [
      logos,
      gap,
      logoHeight,
      isVertical,
    ]);

    useImageLoader(seqRef, updateDimensions, [
      logos,
      gap,
      logoHeight,
      isVertical,
    ]);

    const offsetRef = useAnimationLoop(
      trackRef,
      targetVelocity,
      seqWidth,
      seqHeight,
      isHovered,
      effectiveHoverSpeed,
      isVertical,
      focusHeldRef,
    );

    const cssVariables = useMemo<Record<string, string>>(
      () => ({
        "--logoloop-gap": `${gap}px`,
        "--logoloop-logoHeight": `${logoHeight}px`,
        ...(fadeOutColor && { "--logoloop-fadeColor": fadeOutColor }),
      }),
      [gap, logoHeight, fadeOutColor],
    );

    const rootClassName = useMemo(
      () =>
        [
          "logoloop",
          isVertical ? "logoloop--vertical" : "logoloop--horizontal",
          fadeOut && "logoloop--fade",
          scaleOnHover && "logoloop--scale-hover",
          className,
        ]
          .filter(Boolean)
          .join(" "),
      [isVertical, fadeOut, scaleOnHover, className],
    );

    const handleMouseEnter = useCallback(() => {
      if (effectiveHoverSpeed !== undefined) setIsHovered(true);
    }, [effectiveHoverSpeed]);
    const handleMouseLeave = useCallback(() => {
      if (effectiveHoverSpeed !== undefined) setIsHovered(false);
    }, [effectiveHoverSpeed]);

    // Keyboard focus pauses the strip and slides the focused link inside it,
    // clear of the faded ends. Only a visible focus counts: a mouse click on a
    // logo focuses it too, and that should not freeze the strip until the
    // visitor happens to click somewhere else.
    const handleFocus = useCallback(
      (event: FocusEvent<HTMLDivElement>) => {
        const link = event.target;
        const container = containerRef.current;
        const track = trackRef.current;
        if (!container || !track || !link.matches(":focus-visible")) return;
        focusHeldRef.current = true;
        const box = container.getBoundingClientRect();
        const item = link.getBoundingClientRect();
        const span = isVertical ? box.height : box.width;
        const start = isVertical ? item.top - box.top : item.left - box.left;
        const end = start + (isVertical ? item.height : item.width);
        const inset = span * FOCUS_INSET;
        let shift = 0;
        if (start < inset) shift = start - inset;
        else if (end > span - inset) {
          shift = Math.min(end - (span - inset), start - inset);
        }
        if (shift === 0) return;
        offsetRef.current += shift;
        track.style.transform = isVertical
          ? `translate3d(0, ${-offsetRef.current}px, 0)`
          : `translate3d(${-offsetRef.current}px, 0, 0)`;
      },
      [isVertical, offsetRef],
    );
    const handleBlur = useCallback((event: FocusEvent<HTMLDivElement>) => {
      if (event.currentTarget.contains(event.relatedTarget)) return;
      focusHeldRef.current = false;
    }, []);

    const renderLogoItem = useCallback(
      (item: LogoItem, key: Key, focusable: boolean) => {
        if (renderItem) {
          return (
            <li className="logoloop__item" key={key} role="listitem">
              {renderItem(item, key)}
            </li>
          );
        }
        const isNodeItem = "node" in item;
        const content = isNodeItem ? (
          <span
            aria-hidden={!!item.href && !item.ariaLabel}
            className="logoloop__node"
          >
            {item.node}
          </span>
        ) : (
          <img
            alt={item.alt ?? ""}
            decoding="async"
            draggable={false}
            height={item.height}
            loading="lazy"
            sizes={item.sizes}
            src={item.src}
            srcSet={item.srcSet}
            title={item.title}
            width={item.width}
          />
        );
        const itemAriaLabel = isNodeItem
          ? (item.ariaLabel ?? item.title)
          : (item.alt ?? item.title);
        const itemContent = item.href ? (
          <a
            aria-label={itemAriaLabel || "logo link"}
            className="logoloop__link"
            href={item.href}
            rel="noreferrer noopener"
            // Links in the wrap copies leave the tab order (the first copy is
            // the one keyboard users walk) but stay clickable: at any moment
            // most of the icons on screen belong to a copy, and a marquee
            // where only a drifting handful respond to the pointer reads as
            // broken.
            tabIndex={focusable ? undefined : -1}
            target="_blank"
          >
            {content}
          </a>
        ) : (
          content
        );
        return (
          <li className="logoloop__item" key={key} role="listitem">
            {itemContent}
          </li>
        );
      },
      [renderItem],
    );

    const logoLists = useMemo(
      () =>
        Array.from({ length: copyCount }, (_, copyIndex) => (
          <ul
            aria-hidden={copyIndex > 0}
            className="logoloop__list"
            /*
             * The extra copies exist only so the marquee can wrap seamlessly:
             * hidden from assistive tech, and their links are taken out of the
             * tab order below. Not `inert`: that also swallowed pointer events,
             * so only the icons of the first copy ever opened anything.
             */
            key={`copy-${copyIndex}`}
            ref={copyIndex === 0 ? seqRef : undefined}
            role="list"
          >
            {logos.map((item, itemIndex) =>
              renderLogoItem(
                item,
                `${copyIndex}-${itemIndex}`,
                copyIndex === 0,
              ),
            )}
          </ul>
        )),
      [copyCount, logos, renderLogoItem],
    );

    const containerStyle = useMemo<CSSProperties>(
      () =>
        ({
          width: isVertical
            ? toCssLength(width) === "100%"
              ? undefined
              : toCssLength(width)
            : (toCssLength(width) ?? "100%"),
          ...cssVariables,
          ...style,
        }) as CSSProperties,
      [width, cssVariables, style, isVertical],
    );

    return (
      <div
        aria-label={ariaLabel}
        className={rootClassName}
        ref={containerRef}
        role="region"
        style={containerStyle}
      >
        <div
          className="logoloop__track"
          onBlur={handleBlur}
          onFocus={handleFocus}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          ref={trackRef}
        >
          {logoLists}
        </div>
      </div>
    );
  },
);

LogoLoop.displayName = "LogoLoop";

export default LogoLoop;
