import { useEffect, useRef } from 'react';

interface OverscrollBackgroundProps {
  backgroundColor: string;
}

export function OverscrollBackground({ backgroundColor }: OverscrollBackgroundProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.style.backgroundColor = backgroundColor;
    }
  }, [backgroundColor]);

  return (
    <div
      ref={elementRef}
      id="overscroll-background"
      style={{
        position: 'fixed',
        top: '-500vh',
        left: '-200vw',
        right: '-200vw',
        bottom: '-500vh',
        backgroundColor: backgroundColor,
        zIndex: -9999,
        pointerEvents: 'none',
        transition: 'background-color 0.2s ease',
      }}
      aria-hidden="true"
    />
  );
}

