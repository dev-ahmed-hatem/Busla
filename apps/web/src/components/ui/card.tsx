import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

/** White rounded panel used across every screen. */
export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-card border border-border bg-surface p-5 shadow-sm",
        className,
      )}
    >
      {children}
    </section>
  );
}

/** Card title row: title (+ optional count badge) on the start, actions on the end. */
export function CardHeader({
  title,
  count,
  action,
  className,
}: {
  title: ReactNode;
  count?: number;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-center justify-between gap-3", className)}>
      <div className="flex items-center gap-2">
        <h2 className="text-base font-semibold text-brand-navy">{title}</h2>
        {typeof count === "number" && (
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-status-issue px-1.5 text-xs font-semibold text-white">
            {count}
          </span>
        )}
      </div>
      {action}
    </div>
  );
}
