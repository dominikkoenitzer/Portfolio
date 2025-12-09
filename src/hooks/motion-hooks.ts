import { useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

// Enhanced scroll-triggered animations
export const useScrollAnimation = (threshold = 0.1) => {
  const ref = useRef(null);
  const margin = `0px 0px -${Math.round(threshold * 100)}% 0px`;
  const isInView = useInView(ref, {
    once: true,
    margin: margin as string,
  });

  return { ref, isInView };
};

// Parallax scrolling hook
export const useParallax = (offset = 50) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, offset]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return smoothY;
};

// Advanced mouse tracking for interactive elements
export const useMouseTracking = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    });
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setMousePosition({ x: 0, y: 0 });
  }, []);

  return {
    mousePosition,
    isHovering,
    mouseHandlers: {
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
  };
};

// Intersection observer with advanced options
export const useAdvancedInView = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (!hasAnimated) {
            setHasAnimated(true);
          }
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px",
        ...options,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, options]);

  return { ref, isVisible, hasAnimated };
};

// Smooth scroll to element hook
export const useSmoothScroll = () => {
  const scrollToElement = useCallback((elementId: string, offset = 0) => {
    const element = document.getElementById(elementId);
    if (element) {
      const top =
        element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }
  }, []);

  return scrollToElement;
};

// Advanced parallax with multiple layers
// Note: This hook is limited to 3 layers to avoid hooks in loops
export const useMultiLayerParallax = (layers: number[] = [0.2, 0.5, 0.8]) => {
  const { scrollY } = useScroll();

  // Limit to 3 layers to avoid hooks in loops
  const [layer1, layer2, layer3] = layers.slice(0, 3);

  const transform1 = useTransform(
    scrollY,
    [0, 1000],
    [0, -1000 * (layer1 || 0.2)]
  );
  const transform2 = useTransform(
    scrollY,
    [0, 1000],
    [0, -1000 * (layer2 || 0.5)]
  );
  const transform3 = useTransform(
    scrollY,
    [0, 1000],
    [0, -1000 * (layer3 || 0.8)]
  );

  const spring1 = useSpring(transform1, { stiffness: 100, damping: 30 });
  const spring2 = useSpring(transform2, { stiffness: 100, damping: 30 });
  const spring3 = useSpring(transform3, { stiffness: 100, damping: 30 });

  return [spring1, spring2, spring3].filter((_, i) => i < layers.length);
};

// Staggered animation hook
export const useStaggeredAnimation = (itemCount: number, delay = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * delay,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return { ref, isVisible, variants };
};

// Theme-aware motion values
export const useThemeMotion = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return { isDark };
};

// Advanced scroll progress tracking
export const useScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return { scrollYProgress, scaleX };
};

// Magnetic hover effect hook
export const useMagneticHover = (strength = 0.3) => {
  const ref = useRef<HTMLElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      setPosition({ x: deltaX, y: deltaY });
    },
    [strength]
  );

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return { ref, position };
};
