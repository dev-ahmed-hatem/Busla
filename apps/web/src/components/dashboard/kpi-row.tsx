"use client";

import { useDashboardStats } from "@/lib/api/hooks";
import type { KpiCardData as KpiData, KpiKey } from "@/lib/api/resources";

import { KpiCard } from "./kpi-card";

// Per-card sub-metric labels (the API returns generic active/inactive counts).
const CONFIG: { key: KpiKey; active: string; inactive: string }[] = [
  { key: "buses", active: "Active Now", inactive: "Out of Service" },
  { key: "drivers", active: "Available", inactive: "Unavailable" },
  { key: "supervisors", active: "On Trips", inactive: "Unavailable" },
  { key: "students", active: "Scheduled Today", inactive: "Unscheduled" },
];

export function KpiRow() {
  const { data } = useDashboardStats();

  const cards: KpiData[] = CONFIG.map((c) => {
    const s = data?.[c.key];
    return {
      key: c.key,
      total: s?.total ?? 0,
      subs: [
        { label: c.active, value: s?.active ?? 0, tone: "good" },
        { label: c.inactive, value: s?.inactive ?? 0, tone: "bad" },
      ],
      percent: s?.utilization ?? 0,
    };
  });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((kpi) => (
        <KpiCard key={kpi.key} data={kpi} />
      ))}
    </div>
  );
}
