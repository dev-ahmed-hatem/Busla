import { Bus, GraduationCap, UserCog, UserRound, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { KpiCard as KpiData } from "@/lib/mock/dashboard";

const ICONS: Record<string, LucideIcon> = {
  buses: Bus,
  drivers: UserRound,
  supervisors: UserCog,
  students: GraduationCap,
};

export function KpiCard({ data }: { data: KpiData }) {
  const t = useTranslations("dashboard");
  const Icon = ICONS[data.key] ?? Bus;

  return (
    <Card>
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-[#eaeef5] text-brand-navy">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <div className="truncate text-sm text-slate-500">{t(`kpi.${data.key}`)}</div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-brand-navy">{data.total}</span>
            <span className="text-xs text-slate-400">{t("kpi.total")}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 text-sm">
        {data.subs.map((s) => (
          <div key={s.label} className="min-w-0">
            <span
              className={
                s.tone === "good"
                  ? "font-semibold text-status-ontime"
                  : "font-semibold text-status-issue"
              }
            >
              {s.value}
            </span>
            <span className="ms-1 text-xs text-slate-500">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <ProgressBar percent={data.percent} tone="onTime" />
        <span className="text-xs font-medium text-slate-500">{data.percent}%</span>
      </div>
    </Card>
  );
}
