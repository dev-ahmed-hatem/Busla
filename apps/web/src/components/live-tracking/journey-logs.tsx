"use client";

import { StatusPill, TONE_VAR } from "@busla/ui";
import { Calendar, ChevronDown, Download, Eye, Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { Sparkline } from "@/components/ui/sparkline";
import {
  JOURNEY_LOG_KPIS,
  JOURNEY_LOGS,
  type JourneyLog,
  type JourneyLogKpi,
} from "@/lib/mock/live-tracking";

function Kpi({ kpi }: { kpi: JourneyLogKpi }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm text-slate-500">{kpi.title}</div>
          <div className="text-2xl font-bold text-brand-navy">{kpi.value}</div>
          <div className="truncate text-xs text-slate-400">{kpi.sub}</div>
        </div>
        <Sparkline points={kpi.spark} color={TONE_VAR[kpi.tone]} />
      </div>
    </Card>
  );
}

function FilterButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
    >
      {label}
      <ChevronDown className="h-3.5 w-3.5" />
    </button>
  );
}

function TimeCell({ sched, actual, alert }: { sched: string; actual: string; alert?: boolean }) {
  return (
    <div className="leading-tight">
      <div className="text-xs text-slate-400">{sched}</div>
      <div className={alert ? "font-medium text-status-issue" : "font-medium text-brand-navy"}>
        {actual}
      </div>
    </div>
  );
}

export function JourneyLogs() {
  const [page, setPage] = useState(1);

  const columns: Column<JourneyLog>[] = [
    { key: "id", header: "Journey id", render: (r) => <span className="font-medium text-brand-navy">{r.id}</span> },
    { key: "bus", header: "Bus", render: (r) => <span className="text-slate-600">{r.bus}</span> },
    { key: "driver", header: "Driver", render: (r) => <span className="text-slate-600">{r.driver}</span> },
    { key: "nanny", header: "Nanny", render: (r) => <span className="text-slate-600">{r.nanny}</span> },
    { key: "shift", header: "Shift", render: (r) => <span className="text-slate-600">{r.shift}</span> },
    { key: "departed", header: "Departed", render: (r) => <TimeCell sched={r.depSched} actual={r.depActual} /> },
    {
      key: "arrived",
      header: "Arrived",
      render: (r) => (
        <TimeCell sched={r.arrSched} actual={r.arrActual} alert={r.status === "Broken down"} />
      ),
    },
    { key: "status", header: "Status", render: (r) => <StatusPill status={r.status} label={r.statusLabel} /> },
    {
      key: "actions",
      header: "Actions",
      render: () => (
        <button
          type="button"
          aria-label="View"
          className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100"
        >
          <Eye className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
        >
          <Calendar className="h-4 w-4" />
          1 Apr 2026
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {JOURNEY_LOG_KPIS.map((kpi) => (
          <Kpi key={kpi.key} kpi={kpi} />
        ))}
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-brand-navy">Journey Logs</h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute inset-y-0 start-3 my-auto h-4 w-4 text-slate-400" />
              <input
                type="search"
                placeholder="Search by Bus no. or Driver name…"
                className="h-9 w-56 rounded-md border border-border bg-surface ps-9 pe-3 text-sm outline-none focus:border-brand-navy"
              />
            </div>
            <FilterButton label="Shift" />
            <FilterButton label="Area" />
            <FilterButton label="Status" />
            <Button variant="primary">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        <DataTable columns={columns} rows={JOURNEY_LOGS} rowKey={(r) => r.id} />

        <div className="mt-4 flex justify-end">
          <Pagination page={page} pageCount={10} onPageChange={setPage} />
        </div>
      </Card>
    </div>
  );
}
