"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Card, CardHeader } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { ProgressBar } from "@/components/ui/progress-bar";
import { CAPACITY_ROWS } from "@/lib/mock/dashboard";

export function BusCapacity() {
  const t = useTranslations("dashboard");
  const [page, setPage] = useState(1);

  const occupancyTone = (ratio: number) =>
    ratio >= 0.75 ? "onTime" : ratio >= 0.5 ? "delayed" : "issue";

  return (
    <Card>
      <CardHeader
        title={t("busCapacity")}
        action={
          <button
            type="button"
            className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs text-slate-600"
          >
            {t("today")}
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
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
            {CAPACITY_ROWS.map((row) => (
              <tr key={row.bus} className="border-b border-border last:border-0">
                <td className="py-3 font-medium text-brand-navy">{row.bus}</td>
                <td className="py-3 text-slate-600">{row.route}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-slate-600">{row.capacity}</span>
                    <div className="w-24">
                      <ProgressBar
                        percent={(row.occupied / row.capacity) * 100}
                        tone={occupancyTone(row.occupied / row.capacity)}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3 text-slate-600">{row.occupied}</td>
                <td className="py-3 text-slate-600">{row.available}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end">
        <Pagination page={page} pageCount={5} onPageChange={setPage} />
      </div>
    </Card>
  );
}
