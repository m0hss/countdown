import { launchConfig as c } from "@/launch.config";
export function OrbitalMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`orbital-mark ${className}`}
      width="32"
      height="32"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
    >
      <circle cx="20" cy="20" r="6" fill="currentColor" />
      <ellipse
        cx="20"
        cy="20"
        rx="18"
        ry="8"
        transform="rotate(-42 20 20)"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <ellipse
        cx="20"
        cy="20"
        rx="18"
        ry="8"
        transform="rotate(42 20 20)"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="32" cy="9" r="3" fill="currentColor" />
    </svg>
  );
}
export function Brand() {
  return (
    <span className="brand">
      <OrbitalMark />
      <span>{c.name}</span>
    </span>
  );
}
