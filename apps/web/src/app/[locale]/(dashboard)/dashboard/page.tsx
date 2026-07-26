import { ActionRequired } from "@/components/dashboard/action-required";
import { BusCapacity } from "@/components/dashboard/bus-capacity";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { MainMap } from "@/components/dashboard/main-map";
import { TripsDonut } from "@/components/dashboard/trips-donut";
import { KPI_CARDS } from "@/lib/mock/dashboard";

/** Operations overview (design Screenshot 364). Runs on mock data until the module APIs land. */
export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPI_CARDS.map((kpi) => (
          <KpiCard key={kpi.key} data={kpi} />
        ))}
      </div>

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
