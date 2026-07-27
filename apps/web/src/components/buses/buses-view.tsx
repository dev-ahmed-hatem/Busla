"use client";

import { StatusPill } from "@busla/ui";
import { Bus as BusIcon, Check, Eye, Plus, Search, Trash2, Wrench } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { useCreate, useDelete, useList, useUpdate } from "@/lib/api/hooks";
import { PAGE_SIZE, type Bus } from "@/lib/api/resources";
import { cn } from "@/lib/utils/cn";
import { humanizeStatus } from "@/lib/utils/status";

import { AddBusModal } from "./add-bus-modal";
import { BusProfileModal } from "./bus-profile-modal";

type Filter = "all" | "in_service" | "maintenance" | "issue";

const FILTERS: { key: Exclude<Filter, "all">; labelKey: string }[] = [
  { key: "in_service", labelKey: "filters.inService" },
  { key: "maintenance", labelKey: "filters.maintenance" },
  { key: "issue", labelKey: "filters.issue" },
];

const PATH = "/api/v1/buses/";
const KEY = ["buses"];

export function BusesView() {
  const t = useTranslations("buses");
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<Bus | null>(null);

  const query = { status: filter === "all" ? undefined : filter, search: search || undefined, page };
  const { data, isLoading, isError, error } = useList<Bus>([...KEY, query], PATH, query);
  const create = useCreate<Bus>(KEY, PATH);
  const update = useUpdate<Bus>(KEY);
  const del = useDelete(KEY);

  const rows = data?.results ?? [];
  const pageCount = Math.max(1, Math.ceil((data?.count ?? 0) / PAGE_SIZE));

  const columns: Column<Bus>[] = [
    { key: "bus_number", header: t("cols.busNum"), render: (r) => (
      <span className="inline-flex items-center gap-1.5 font-medium text-brand-navy">
        <BusIcon className="h-4 w-4 text-brand-amber" />
        {r.bus_number}
      </span>
    ) },
    { key: "license_plate", header: t("cols.license"), render: (r) => <span dir="rtl" className="text-slate-600">{r.license_plate || "—"}</span> },
    { key: "route", header: t("cols.route"), render: (r) => <span className="text-slate-600">{r.route_name ?? "—"}</span> },
    { key: "last_maintenance_at", header: t("cols.lastMaintenance"), render: (r) => <span className="text-slate-600">{r.last_maintenance_at ?? "—"}</span> },
    { key: "status", header: t("cols.status"), render: (r) => <StatusPill status={r.status} label={humanizeStatus(r.status)} /> },
    { key: "breakdown_reason", header: t("cols.breakdown"), render: (r) => (r.breakdown_reason ? <span className="text-slate-600">{r.breakdown_reason}</span> : <span className="text-slate-300">—</span>) },
    { key: "actions", header: t("cols.actions"), render: (r) => (
      <div className="flex items-center gap-1">
        {filter === "maintenance" && (
          <button type="button" onClick={() => update.mutate({ path: `${PATH}${r.id}/`, body: { status: "in_service", breakdown_reason: "" } })} className="flex items-center gap-1 rounded-md bg-status-ontime px-2.5 py-1 text-xs font-medium text-white hover:opacity-90">
            <Check className="h-3.5 w-3.5" />
            {t("resolve")}
          </button>
        )}
        {filter === "issue" && (
          <button type="button" onClick={() => update.mutate({ path: `${PATH}${r.id}/`, body: { status: "maintenance" } })} className="flex items-center gap-1 rounded-md bg-status-delayed px-2.5 py-1 text-xs font-medium text-white hover:opacity-90">
            <Wrench className="h-3.5 w-3.5" />
            {t("sendToMaintenance")}
          </button>
        )}
        <button type="button" onClick={() => setSelected(r)} aria-label={t("view")} className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100">
          <Eye className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => del.mutate(`${PATH}${r.id}/`)} aria-label={t("delete")} className="grid h-8 w-8 place-items-center rounded-md text-status-issue hover:bg-[#fdecec]">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ) },
  ];

  const emptyLabel = isLoading
    ? "Loading…"
    : isError
      ? (error as Error)?.message || "Failed to load buses"
      : "No buses yet";

  return (
    <div>
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="shrink-0 text-base font-semibold text-brand-navy">{t("busList")}</h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute inset-y-0 start-3 my-auto h-4 w-4 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder={t("search")}
                className="h-9 w-40 rounded-md border border-border bg-surface ps-9 pe-3 text-sm outline-none focus:border-brand-navy sm:w-48"
              />
            </div>
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => { setFilter(active ? "all" : f.key); setPage(1); }}
                  className={cn(
                    "rounded-pill border px-3 py-1.5 text-sm font-medium transition-colors",
                    active ? "border-brand-navy bg-[#eaeef5] text-brand-navy" : "border-border text-slate-500 hover:bg-slate-100",
                  )}
                >
                  {t(f.labelKey)}
                </button>
              );
            })}
            <Button variant="primary" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" />
              {t("addBus")}
            </Button>
          </div>
        </div>

        <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} emptyLabel={emptyLabel} />

        <div className="mt-4 flex justify-center border-t border-border pt-4">
          <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
        </div>
      </Card>

      <AddBusModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        submitting={create.isPending}
        onSubmit={async (values) => {
          await create.mutateAsync(values);
          setAddOpen(false);
        }}
      />
      <BusProfileModal bus={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
