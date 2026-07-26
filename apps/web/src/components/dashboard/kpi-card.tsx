import { Bus, GraduationCap, UserCog, UserRound, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card } from "@/components/ui/card";
import type { KpiCard as KpiData } from "@/lib/mock/dashboard";
import { cn } from "@/lib/utils/cn";

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

      <div className="mt-4 flex items-start justify-between gap-2">
        {data.subs.map((s) => (
          <div key={s.label} className="min-w-0">
            <div
              className={cn(
                "text-xl font-bold",
                s.tone === "good" ? "text-status-ontime" : "text-status-issue",
              )}
            >
              {s.value}
            </div>
            <div className="truncate text-xs text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        {/* utilisation: green fill over the red (out-of-service) remainder */}
        <div className="h-1.5 flex-1 overflow-hidden rounded-pill bg-status-issue">
          <div
            className="h-full rounded-pill bg-status-ontime"
            style={{ width: `${data.percent}%` }}
          />
        </div>
        <span className="text-xs font-medium text-slate-500">{data.percent}%</span>
      </div>
    </Card>
  );
}
