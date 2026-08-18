/** Small maths the scene leans on every frame. */

export const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
export const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
export const lerpAngle = (a: number, b: number, t: number) => {
  const d =
    (((b - a + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) -
    Math.PI;
  return a + d * t;
};
