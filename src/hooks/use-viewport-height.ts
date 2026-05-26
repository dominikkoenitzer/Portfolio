import { useEffect } from "react";

/**
 * Sets a `--vh` CSS custom property to 1% of the *visual* viewport height.
 * Components can then use `calc(var(--vh) * 100)` instead of `100vh`,
 * eliminating the iOS Safari address-bar jump where 100vh overshoots.
 *
 * Updates on resize and orientationchange (passive listeners).
 */
export const useViewportHeight = () => {
  useEffect(() => {
    const setVh = () => {
      const vh = (window.visualViewport?.height ?? window.innerHeight) * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVh();

    window.addEventListener("resize", setVh, { passive: true });
    window.addEventListener("orientationchange", setVh, { passive: true });
    window.visualViewport?.addEventListener("resize", setVh, { passive: true });

    return () => {
      window.removeEventListener("resize", setVh);
      window.removeEventListener("orientationchange", setVh);
      window.visualViewport?.removeEventListener("resize", setVh);
    };
  }, []);
};
