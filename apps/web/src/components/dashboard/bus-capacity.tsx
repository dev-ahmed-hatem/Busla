"use client";

import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Card, CardHeader } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useDashboardStats } from "@/lib/api/hooks";

const PAGE = 5;

export function BusCapacity() {
  const t = useTranslations("dashboard");
  const [page, setPage] = useState(1);
  const { data } = useDashboardStats();

  const rows = data?.bus_capacity ?? [];
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE));
  const visible = rows.slice((page - 1) * PAGE, page * PAGE);

  const occupancyTone = (ratio: number) =>
    ratio >= 0.75 ? "onTime" : ratio >= 0.5 ? "delayed" : "issue";

  return (
    <Card>
      <CardHeader
        title={t("busCapacity")}
        action={
          // Occupancy is a live assignment snapshot (no time axis) — static scope label, not a filter.
          <span className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs text-slate-500">
            <Calendar className="h-3.5 w-3.5" />
            {t("today")}
          </span>
        }
      />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-start text-xs text-slate-500">
              <th className="py-2 text-start font-medium">{t("col.busNo")}</th>
              <th className="py-2 text-start font-medium">{t("col.route")}</th>
              <th className="py-2 text-start font-medium">{t("col.capacity")}</th>
              <th className="py-2 text-start font-medium">{t("col.occupied")}</th>
              <th className="py-2 text-start font-medium">{t("col.available")}</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.bus} className="border-b border-border last:border-0">
                <td className="py-3 font-medium text-brand-navy">{row.bus}</td>
                <td className="py-3 text-slate-600">{row.route ?? "—"}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-slate-600">{row.capacity}</span>
                    <div className="w-24">
                      <ProgressBar
                        percent={row.capacity ? (row.occupied / row.capacity) * 100 : 0}
                        tone={occupancyTone(row.capacity ? row.occupied / row.capacity : 0)}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3 text-slate-600">{row.occupied}</td>
                <td className="py-3 text-slate-600">{row.available}</td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  —
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-center border-t border-border pt-4">
        <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
      </div>
    </Card>
  );
}
