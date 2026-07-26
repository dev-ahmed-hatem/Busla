import * as React from "react";

import { TONE_VAR, toneFor, type StatusTone } from "./status.js";

export interface StatusPillProps {
  /** Raw backend status string (e.g. "on_time", "Maintenance", "Broken down"). */
  status: string;
  /** Human label; defaults to the status string. */
  label?: string;
  tone?: StatusTone;
}

/** Semantic status chip — the one component that renders any domain status. */
export function StatusPill({ status, label, tone }: StatusPillProps): React.ReactElement {
  const t = tone ?? toneFor(status);
  const color = TONE_VAR[t];
  return (
    <span
      data-tone={t}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        paddingInline: 10,
        paddingBlock: 3,
        borderRadius: "var(--radius-pill)",
        fontSize: "var(--font-size-xs)",
        fontWeight: 600,
        color,
        background: `color-mix(in srgb, ${color} 12%, transparent)`,
      }}
    >
      <span
        aria-hidden
        style={{ width: 6, height: 6, borderRadius: "50%", background: color }}
      />
      {label ?? status}
    </span>
  );
}
