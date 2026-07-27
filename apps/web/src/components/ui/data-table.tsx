"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

export interface Column<T> {
  key: string;
  header: ReactNode;
  render?: (row: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
}

/**
 * Generic table with optional row selection. Pagination and toolbar are composed by the
 * caller. Selection is controlled via `selected` + `onSelectedChange`.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  selectable = false,
  selected,
  onSelectedChange,
  emptyLabel = "No data",
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  selectable?: boolean;
  selected?: Set<string>;
  onSelectedChange?: (next: Set<string>) => void;
  emptyLabel?: ReactNode;
}) {
  const sel = selected ?? new Set<string>();
  const allChecked = rows.length > 0 && rows.every((r) => sel.has(rowKey(r)));
  const colCount = columns.length + (selectable ? 1 : 0);

  const toggleAll = () => {
    const next = new Set(sel);
    if (allChecked) rows.forEach((r) => next.delete(rowKey(r)));
    else rows.forEach((r) => next.add(rowKey(r)));
    onSelectedChange?.(next);
  };

  const toggle = (id: string) => {
    const next = new Set(sel);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectedChange?.(next);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-slate-500">
            {selectable && (
              <th className="w-10 px-3 py-3">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  aria-label="Select all"
                  className="h-4 w-4 accent-[color:var(--color-brand-navy)]"
                />
              </th>
            )}
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn("whitespace-nowrap px-3 py-3 text-start font-medium", c.headerClassName)}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={colCount} className="py-12 text-center text-slate-400">
                {emptyLabel}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => {
              const id = rowKey(row);
              const checked = sel.has(id);
              return (
                <tr
                  key={id}
                  className={cn(
                    "border-b border-border last:border-0",
                    checked && "bg-[#f5f7fb]",
                  )}
                >
                  {selectable && (
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(id)}
                        aria-label="Select row"
                        className="h-4 w-4 accent-[color:var(--color-brand-navy)]"
                      />
                    </td>
                  )}
                  {columns.map((c) => (
                    <td key={c.key} className={cn("px-3 py-3 align-middle", c.className)}>
                      {c.render ? c.render(row, index) : String((row as Record<string, unknown>)[c.key] ?? "")}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
