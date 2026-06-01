import { LightVeil } from "./LightVeil";

export default function LightVeilBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 select-none"
    >
      <LightVeil />
    </div>
  );
}
