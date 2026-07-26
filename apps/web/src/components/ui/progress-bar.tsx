import { TONE_VAR, type StatusTone } from "@busla/ui";

import { cn } from "@/lib/utils/cn";

/** Thin labelled progress bar. `percent` 0–100; color from a status tone. */
export function ProgressBar({
  percent,
  tone = "onTime",
  className,
  trackClassName,
}: {
  percent: number;
  tone?: StatusTone;
  className?: string;
  trackClassName?: string;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-pill bg-slate-100", trackClassName)}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full rounded-pill", className)}
        style={{ width: `${clamped}%`, background: TONE_VAR[tone] }}
      />
    </div>
  );
}
