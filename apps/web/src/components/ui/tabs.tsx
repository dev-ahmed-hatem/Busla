"use client";

import { cn } from "@/lib/utils/cn";

export interface TabItem {
  key: string;
  label: string;
  count?: number;
}

/** Underline tab bar with optional count badges (Notifications, profile modals). */
export function Tabs({
  items,
  value,
  onValueChange,
  className,
}: {
  items: TabItem[];
  value: string;
  onValueChange: (key: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-6 border-b border-border", className)} role="tablist">
      {items.map((item) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onValueChange(item.key)}
            className={cn(
              "relative flex items-center gap-2 pb-3 text-sm font-medium transition-colors",
              active ? "text-brand-navy" : "text-slate-500 hover:text-slate-700",
            )}
          >
            {item.label}
            {typeof item.count === "number" && (
              <span
                className={cn(
                  "grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-xs font-semibold",
                  active ? "bg-brand-navy text-white" : "bg-slate-100 text-slate-500",
                )}
              >
                {item.count}
              </span>
            )}
            {active && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-navy" />
            )}
          </button>
        );
      })}
    </div>
  );
}
