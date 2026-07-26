"use client";

import { StatusPill } from "@busla/ui";
import { Bus, Check, ChevronDown, Eye, Plus, Search, Trash2, Wrench } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { BUSES, type BusFilter, type BusRow, type BusStatus } from "@/lib/mock/buses";
import { cn } from "@/lib/utils/cn";

import { AddBusModal } from "./add-bus-modal";
import { BusProfileModal } from "./bus-profile-modal";

const FILTERS: { key: Exclude<BusFilter, "all">; labelKey: string }[] = [
  { key: "In Service", labelKey: "filters.inService" },
  { key: "Maintenance", labelKey: "filters.maintenance" },
  { key: "Issue", labelKey: "filters.issue" },
];

const STATUS_LABEL_KEY: Record<BusStatus, string> = {
  "In Service": "filters.inService",
  Maintenance: "filters.maintenance",
  Issue: "filters.issue",
};

export function BusesView() {
  const t = useTranslations("buses");
  const [filter, setFilter] = useState<BusFilter>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const rows = BUSES.filter((b) => filter === "all" || b.status === filter);

  // Action set is driven by the active filter (per design 384–387), not per-row status.
  const renderActions = () => {
    const view = (
      <button
        type="button"
        onClick={() => setProfileOpen(true)}
        aria-label={t("view")}
        className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100"
      >
        <Eye className="h-4 w-4" />
      </button>
    );
    if (filter === "Maintenance") {
      return (
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex items-center gap-1 rounded-md bg-status-ontime px-2.5 py-1 text-xs font-medium text-white hover:opacity-90"
          >
            <Check className="h-3.5 w-3.5" />
            {t("resolve")}
          </button>
          {view}
        </div>
      );
    }
    if (filter === "Issue") {
      return (
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex items-center gap-1 rounded-md bg-status-delayed px-2.5 py-1 text-xs font-medium text-white hover:opacity-90"
          >
            <Wrench className="h-3.5 w-3.5" />
            {t("sendToMaintenance")}
          </button>
          {view}
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1">
        {view}
        <button
          type="button"
          aria-label={t("delete")}
          className="grid h-8 w-8 place-items-center rounded-md text-status-issue hover:bg-[#fdecec]"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    );
  };

  const columns: Column<BusRow>[] = [
    { key: "series", header: t("cols.series"), render: (r) => <span className="text-slate-500">{r.series}</span> },
    {
      key: "busNum",
      header: t("cols.busNum"),
      render: (r) => (
        <span className="inline-flex items-center gap-1.5 font-medium text-brand-navy">
          <Bus className="h-4 w-4 text-brand-amber" />
          {r.busNum}
        </span>
      ),
    },
    { key: "license", header: t("cols.license"), render: (r) => <span dir="rtl" className="text-slate-600">{r.license}</span> },
    { key: "route", header: t("cols.route"), render: (r) => <span className="text-slate-600">{r.route}</span> },
    { key: "lastMaintenance", header: t("cols.lastMaintenance"), render: (r) => <span className="text-slate-600">{r.lastMaintenance}</span> },
    { key: "status", header: t("cols.status"), render: (r) => <StatusPill status={r.status} label={t(STATUS_LABEL_KEY[r.status])} /> },
    {
      key: "breakdown",
      header: t("cols.breakdown"),
      render: (r) => (r.breakdown ? <span className="text-slate-600">{r.breakdown}</span> : <span className="text-slate-300">—</span>),
    },
    { key: "actions", header: t("cols.actions"), render: renderActions },
  ];

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
                  onClick={() => {
                    setFilter(active ? "all" : f.key);
                    setPage(1);
                    setSelected(new Set());
                  }}
                  className={cn(
                    "rounded-pill border px-3 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "border-brand-navy bg-[#eaeef5] text-brand-navy"
                      : "border-border text-slate-500 hover:bg-slate-100",
                  )}
                >
                  {t(f.labelKey)}
                </button>
              );
            })}
            <Button variant="outline">
              {t("filter")}
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button variant="primary" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" />
              {t("addBus")}
            </Button>
          </div>
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(r) => r.id}
          selectable
          selected={selected}
          onSelectedChange={setSelected}
        />

        <div className="mt-4 flex justify-center border-t border-border pt-4">
          <Pagination page={page} pageCount={10} onPageChange={setPage} />
        </div>
      </Card>

      <AddBusModal open={addOpen} onClose={() => setAddOpen(false)} />
      <BusProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}
