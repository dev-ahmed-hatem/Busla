"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import type { Period } from "@/lib/api/resources";
import { cn } from "@/lib/utils/cn";

const PERIODS: { value: Period; key: string }[] = [
  { value: "today", key: "period.today" },
  { value: "week", key: "period.thisWeek" },
  { value: "month", key: "period.thisMonth" },
];

/** Small controlled period selector (Today / This week / This month) with click-away close. */
export function PeriodDropdown({
  value,
  onChange,
}: {
  value: Period;
  onChange: (p: Period) => void;
}) {
  const t = useTranslations("dashboard");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const current =
    PERIODS.find((p) => p.value === value) ?? { value: "today" as Period, key: "period.today" };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100"
      >
        {t(current.key)}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute end-0 z-10 mt-1 min-w-32 overflow-hidden rounded-md border border-border bg-surface py-1 shadow-lg"
        >
          {PERIODS.map((p) => (
            <li key={p.value}>
              <button
                type="button"
                role="option"
                aria-selected={p.value === value}
                onClick={() => {
                  onChange(p.value);
                  setOpen(false);
                }}
                className={cn(
                  "block w-full px-3 py-1.5 text-start text-xs hover:bg-slate-100",
                  p.value === value ? "font-semibold text-brand-navy" : "text-slate-600",
                )}
              >
                {t(p.key)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
