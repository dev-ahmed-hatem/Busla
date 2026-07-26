"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils/cn";

/** Presentational pager: Previous · 01 02 … N · Next. `page` is 1-indexed. */
export function Pagination({
  page = 1,
  pageCount = 5,
  maxPills = 5,
  onPageChange,
  className,
}: {
  page?: number;
  pageCount?: number;
  maxPills?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}) {
  const pills = Array.from({ length: Math.min(maxPills, pageCount) }, (_, i) => i + 1);
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className={cn("flex items-center gap-1 text-sm", className)}>
      <button
        type="button"
        onClick={() => onPageChange?.(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-slate-500 disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
        Previous
      </button>
      {pills.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onPageChange?.(n)}
          aria-current={n === page ? "page" : undefined}
          className={cn(
            "grid h-8 w-8 place-items-center rounded-md",
            n === page
              ? "border border-brand-navy font-semibold text-brand-navy"
              : "text-slate-500 hover:bg-slate-100",
          )}
        >
          {pad(n)}
        </button>
      ))}
      {pageCount > maxPills && <span className="px-1 text-slate-500">…</span>}
      <button
        type="button"
        onClick={() => onPageChange?.(Math.min(pageCount, page + 1))}
        disabled={page >= pageCount}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-slate-500 disabled:opacity-40"
      >
        Next
        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
      </button>
    </div>
  );
}
