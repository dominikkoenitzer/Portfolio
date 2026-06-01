import { Aurora } from "./Aurora";

export default function AuroraBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 select-none"
    >
      <Aurora />
    </div>
  );
}
