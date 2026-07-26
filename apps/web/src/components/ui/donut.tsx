import type { ReactNode } from "react";

export interface DonutSegment {
  value: number;
  /** Any CSS color (hex or var(--…)). */
  color: string;
}

/**
 * Inline-SVG donut chart (no chart library). Segments render clockwise from 12 o'clock.
 * `center` renders in the hole (e.g. total + label).
 */
export function Donut({
  segments,
  size = 180,
  thickness = 22,
  center,
}: {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  center?: ReactNode;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const arcs = segments.map((seg, i) => {
    const frac = total > 0 ? seg.value / total : 0;
    const len = frac * circumference;
    const dash = `${len} ${circumference - len}`;
    const arc = (
      <circle
        key={i}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={seg.color}
        strokeWidth={thickness}
        strokeDasharray={dash}
        strokeDashoffset={-offset}
      />
    );
    offset += len;
    return arc;
  });

  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-neutral-100)"
            strokeWidth={thickness}
          />
          {arcs}
        </g>
      </svg>
      {center && (
        <div className="absolute inset-0 grid place-items-center text-center">{center}</div>
      )}
    </div>
  );
}
