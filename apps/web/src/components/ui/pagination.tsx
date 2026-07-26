"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("common");
  const pad = (n: number) => n.toString().padStart(2, "0");

  // Leading pills, an ellipsis, then the final page (design: 01 02 03 … 10).
  const lead = Math.min(maxPills, pageCount);
  const leadPills = Array.from({ length: lead }, (_, i) => i + 1);
  const showTail = pageCount > lead;

  const pill = (n: number) => (
    <button
      key={n}
      type="button"
      onClick={() => onPageChange?.(n)}
      aria-current={n === page ? "page" : undefined}
      className={cn(
        "grid h-8 w-8 place-items-center rounded-full text-sm",
        n === page
          ? "border border-brand-navy font-semibold text-brand-navy"
          : "text-slate-500 hover:bg-slate-100",
      )}
    >
      {pad(n)}
    </button>
  );

  return (
    <div className={cn("flex items-center gap-1 text-sm", className)}>
      <button
        type="button"
        onClick={() => onPageChange?.(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-slate-500 disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
        <span className="hidden sm:inline">{t("previous")}</span>
      </button>
      {leadPills.map(pill)}
      {showTail && (
        <>
          <span className="px-1 text-slate-400">…</span>
          {pill(pageCount)}
        </>
      )}
      <button
        type="button"
        onClick={() => onPageChange?.(Math.min(pageCount, page + 1))}
        disabled={page >= pageCount}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-slate-500 disabled:opacity-40"
      >
        <span className="hidden sm:inline">{t("next")}</span>
        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
      </button>
    </div>
  );
}
