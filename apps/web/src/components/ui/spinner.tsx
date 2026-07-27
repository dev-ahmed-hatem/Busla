import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils/cn";

/** Inline spinning indicator. */
export function Spinner({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <Loader2
      aria-hidden
      style={{ width: size, height: size }}
      className={cn("animate-spin text-slate-400", className)}
    />
  );
}

/** Centered loading block for panels, tables, and route fallbacks (replaces "Loading…" text). */
export function Loading({
  size = 24,
  className,
  label,
}: {
  size?: number;
  className?: string;
  label?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("grid place-items-center gap-2 py-10 text-slate-400", className)}
    >
      <Spinner size={size} />
      {label ? <span className="text-sm">{label}</span> : <span className="sr-only">Loading</span>}
    </div>
  );
}
