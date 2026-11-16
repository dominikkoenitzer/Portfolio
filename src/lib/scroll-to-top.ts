type FocusTarget = {
  ownerDocument: { hasFocus: () => boolean };
  focus: (options?: FocusOptions) => void;
  hasAttribute: (name: string) => boolean;
  setAttribute: (name: string, value: string) => void;
  removeAttribute: (name: string) => void;
  addEventListener: (type: "blur", listener: () => void) => void;
  removeEventListener: (type: "blur", listener: () => void) => void;
};

/** index.css drops the focus ring on main while this is set. */
export const QUIET_FOCUS = "data-quiet-focus";

function quietFocus(main: FocusTarget): void {
  if (main.hasAttribute(QUIET_FOCUS)) return;
  main.setAttribute(QUIET_FOCUS, "");
  const release = () => {
    // A window or tab switch blurs main too, and focus returns to it on the way back.
    if (!main.ownerDocument.hasFocus()) return;
    main.removeAttribute(QUIET_FOCUS);
    main.removeEventListener("blur", release);
  };
  main.addEventListener("blur", release);
}

/** Starts the scroll home; the button unmounts near the top, so focus moves to main. */
export function scrollToTop(startScroll: () => void, main: FocusTarget | null): void {
  startScroll();
  if (!main) return;
  quietFocus(main);
  main.focus({ preventScroll: true });
}
