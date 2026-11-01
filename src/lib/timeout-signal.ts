/**
 * A signal that aborts after `ms`. `AbortSignal.timeout` is missing in Safari
 * before 16 and older Chromium, where calling it threw before the request
 * started, so the form could never fetch its token or send.
 */
export function timeoutSignal(ms: number): AbortSignal {
  if (typeof AbortSignal.timeout === "function") return AbortSignal.timeout(ms);
  const controller = new AbortController();
  setTimeout(() => controller.abort(new DOMException("The operation timed out.", "TimeoutError")), ms);
  return controller.signal;
}
