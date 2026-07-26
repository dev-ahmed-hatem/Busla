import { TONE_VAR } from "@busla/ui";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card, CardHeader } from "@/components/ui/card";
import { Donut } from "@/components/ui/donut";
import { TRIP_SEGMENTS, TRIPS_TOTAL } from "@/lib/mock/dashboard";

function TodayDropdown({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs text-slate-600"
    >
      {label}
      <ChevronDown className="h-3.5 w-3.5" />
    </button>
  );
}

export function TripsDonut() {
  const t = useTranslations("dashboard");

  return (
    <Card>
      <CardHeader title={t("tripsStatus")} action={<TodayDropdown label={t("today")} />} />
      <div className="flex items-center justify-around gap-4">
        <Donut
          segments={TRIP_SEGMENTS.map((s) => ({ value: s.value, color: TONE_VAR[s.tone] }))}
          center={
            <div>
              <div className="text-2xl font-bold text-brand-navy">{TRIPS_TOTAL}</div>
              <div className="text-xs text-slate-500">{t("totalTrips")}</div>
            </div>
          }
        />
        <ul className="flex flex-col gap-3 text-sm">
          {TRIP_SEGMENTS.map((s) => (
            <li key={s.key} className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: TONE_VAR[s.tone] }}
                />
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
