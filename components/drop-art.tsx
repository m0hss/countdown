/** Pure CSS/SVG artwork: all pigment comes from app/theme.css. */
export function DropArt({
  kind = "orbit",
  large = false,
}: {
  kind?: string;
  large?: boolean;
}) {
  return (
    <div
      className={`drop-art art-${kind} ${large ? "art-large" : ""}`}
      aria-hidden
    >
      <div className="art-grid" />
      <svg viewBox="0 0 300 200" fill="none">
        <defs>
          <linearGradient
            id={`fade-${kind}-${large}`}
            x1="40"
            y1="30"
            x2="250"
            y2="180"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--accent)" />
            <stop offset="1" stopColor="var(--foil-teal)" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {kind === "orbit" ? (
          <g stroke={`url(#fade-${kind}-${large})`}>
            <ellipse
              cx="150"
              cy="100"
              rx="83"
              ry="34"
              transform="rotate(-35 150 100)"
            />
            <ellipse
              cx="150"
              cy="100"
              rx="83"
              ry="34"
              transform="rotate(35 150 100)"
            />
            <ellipse
              cx="150"
              cy="100"
              rx="83"
              ry="34"
              transform="rotate(90 150 100)"
            />
            <circle
              cx="150"
              cy="100"
              r="19"
              fill="var(--accent)"
              stroke="none"
            />
            <circle cx="219" cy="62" r="5" fill="var(--accent)" />
          </g>
        ) : kind === "layers" ? (
          <g stroke="var(--accent)">
            {[0, 1, 2, 3].map((i) => (
              <path
                key={i}
                d={`M150 ${36 + i * 25} 225 ${71 + i * 25} 150 ${106 + i * 25} 75 ${71 + i * 25}Z`}
                opacity={1 - i * 0.2}
              />
            ))}
          </g>
        ) : kind === "terminal" ? (
          <g stroke="var(--accent)" strokeWidth="2">
            <rect x="55" y="40" width="190" height="120" rx="8" />
            <path d="M55 65H245M80 90l18 15-18 15M114 123h40" />
            <circle cx="70" cy="53" r="2" />
            <circle cx="80" cy="53" r="2" />
          </g>
        ) : kind === "network" ? (
          <g stroke="var(--accent)">
            <path d="M150 100 70 50M150 100 230 50M150 100 70 150M150 100 230 150" />
            {[
              [150, 100],
              [70, 50],
              [230, 50],
              [70, 150],
              [230, 150],
            ].map(([x, y]) => (
              <circle
                key={`${x}-${y}`}
                cx={x}
                cy={y}
                r="16"
                fill="var(--surface)"
              />
            ))}
          </g>
        ) : (
          <g stroke="var(--accent)">
            {Array.from({ length: 12 }, (_, i) => (
              <path
                key={i}
                d="M150 45v35"
                transform={`rotate(${i * 30} 150 100)`}
              />
            ))}
            <circle cx="150" cy="100" r="10" fill="var(--accent)" />
          </g>
        )}
      </svg>
    </div>
  );
}
