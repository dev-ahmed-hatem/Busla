"use client";

import { TONE_VAR } from "@busla/ui";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Card, CardHeader } from "@/components/ui/card";
import { Donut } from "@/components/ui/donut";
import { useTripOverview } from "@/lib/api/hooks";
import type { Period } from "@/lib/api/resources";

import { PeriodDropdown } from "./period-dropdown";

export function TripsDonut() {
  const t = useTranslations("dashboard");
  const [period, setPeriod] = useState<Period>("today");
  const { data } = useTripOverview(period);
  const segments = data?.trip_segments ?? [];
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <Card>
      <CardHeader
        title={t("tripsStatus")}
        action={<PeriodDropdown value={period} onChange={setPeriod} />}
      />
      <div className="flex items-center justify-around gap-4">
        <Donut
          segments={segments.map((s) => ({ value: s.value, color: TONE_VAR[s.tone] }))}
          center={
            <div>
              <div className="text-2xl font-bold text-brand-navy">{total}</div>
              <div className="text-xs text-slate-500">{t("totalTrips")}</div>
            </div>
          }
        />
        <ul className="flex flex-col gap-3 text-sm">
          {segments.map((s) => (
            <li key={s.key} className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: TONE_VAR[s.tone] }} />
                <span className="text-slate-600">{s.label}</span>
              </span>
              <span className="whitespace-nowrap">
                <span className="font-semibold text-brand-navy">{s.value}</span>{" "}
                <span className="text-slate-400">({s.percent}%)</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
