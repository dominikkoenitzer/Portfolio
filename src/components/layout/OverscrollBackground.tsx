import { useEffect, useRef } from 'react';

interface OverscrollBackgroundProps {
  backgroundColor: string;
}

export function OverscrollBackground({ backgroundColor }: OverscrollBackgroundProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const extendedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.style.backgroundColor = backgroundColor;
    }
    if (extendedRef.current) {
      extendedRef.current.style.backgroundColor = backgroundColor;
    }
    // Also update body and html directly to ensure they have the background
    document.body.style.backgroundColor = backgroundColor;
    document.documentElement.style.backgroundColor = backgroundColor;
  }, [backgroundColor]);

  return (
    <>
      {/* Fixed layer covering viewport */}
      <div
        ref={elementRef}
        id="overscroll-background"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: backgroundColor,
          zIndex: -9999,
          pointerEvents: 'none',
          transition: 'background-color 0.2s ease',
        }}
        aria-hidden="true"
      />
      {/* Extended layer that covers overscroll areas - positioned relative to body */}
      <div
        ref={extendedRef}
        style={{
          position: 'fixed',
          top: '-200vh',
          left: '-50vw',
          right: '-50vw',
          bottom: '-200vh',
          width: '200vw',
          height: '500vh',
          backgroundColor: backgroundColor,
          zIndex: -10000,
          pointerEvents: 'none',
          transition: 'background-color 0.2s ease',
        }}
        aria-hidden="true"
      />
    </>
  );
}

