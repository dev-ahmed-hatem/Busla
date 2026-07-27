import { ActionRequired } from "@/components/dashboard/action-required";
import { BusCapacity } from "@/components/dashboard/bus-capacity";
import { KpiRow } from "@/components/dashboard/kpi-row";
import { MainMap } from "@/components/dashboard/main-map";
import { TripsDonut } from "@/components/dashboard/trips-donut";

/**
 * Operations overview (design Screenshot 364). KPI cards + bus capacity are live
 * (dashboard/stats); the map, action list, and trips donut await Phase-4 trip data.
 */
export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <KpiRow />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MainMap />
        </div>
        <ActionRequired />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <TripsDonut />
        <div className="lg:col-span-2">
          <BusCapacity />
        </div>
      </div>
    </div>
  );
}
