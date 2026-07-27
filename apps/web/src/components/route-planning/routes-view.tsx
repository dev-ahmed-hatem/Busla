"use client";

import { StatusPill } from "@busla/ui";
import { Bot, Eye, Plus, RefreshCw, Search, Sparkles, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { Pagination } from "@/components/ui/pagination";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useCreate, useDelete, useList, useOptimize, useRouteReadiness } from "@/lib/api/hooks";
import { PAGE_SIZE, type Route } from "@/lib/api/resources";
import { humanizeStatus } from "@/lib/utils/status";

import { AddRouteModal } from "./add-route-modal";
import { OptimizeModal } from "./optimize-modal";
import { RouteDetailModal } from "./route-detail-modal";

const PATH = "/api/v1/routes/";
const KEY = ["routes"];

export function RoutesView() {
  const t = useTranslations("routePlanning");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [optimizeOpen, setOptimizeOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<Route | null>(null);

  const readiness = useRouteReadiness();
  const query = { search: search || undefined, page };
  const { data, isLoading } = useList<Route>([...KEY, query], PATH, query);
  const optimize = useOptimize();
  const create = useCreate<Route>(KEY, PATH);
  const del = useDelete(KEY);

  const rows = data?.results ?? [];
  const total = data?.count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasRoutes = (readiness.data?.routes_count ?? total) > 0;

  const columns: Column<Route>[] = [
    { key: "code", header: t("cols.route"), render: (r) => (
      <div className="leading-tight">
        <div className="font-medium text-brand-navy">{r.code}</div>
        <div className="text-xs text-slate-500">{r.name}</div>
      </div>
    ) },
    { key: "bus", header: t("cols.bus"), render: (r) => <span className="text-slate-600">{r.bus_number ?? "—"}</span> },
    { key: "students", header: t("cols.students"), render: (r) => (
      <div className="flex items-center gap-2">
        <span className="text-slate-600">{r.student_count}{r.capacity ? `/${r.capacity}` : ""}</span>
        {r.capacity ? (
          <div className="w-16">
            <ProgressBar
              percent={(r.student_count / r.capacity) * 100}
              tone={r.student_count >= r.capacity ? "onTime" : "delayed"}
            />
          </div>
        ) : null}
      </div>
    ) },
    { key: "distance", header: t("cols.distance"), render: (r) => <span className="text-slate-600">{r.distance_km} KM</span> },
    { key: "duration", header: t("cols.duration"), render: (r) => <span className="text-slate-600">{r.duration_min} min</span> },
    { key: "driver", header: t("cols.driver"), render: (r) =>
      r.driver_name ? (
        <span className="text-slate-600">{r.driver_name}</span>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-pill border border-dashed border-status-issue px-2.5 py-1 text-xs font-medium text-status-issue">
          <Plus className="h-3 w-3" />
          {t("assignDriver")}
        </span>
      ) },
    { key: "supervisor", header: t("cols.nannyStop"), render: (r) => <span className="text-slate-600">{r.supervisor_name ?? "—"}</span> },
    { key: "status", header: t("cols.status"), render: (r) => <StatusPill status={r.status} label={humanizeStatus(r.status)} /> },
    { key: "actions", header: t("cols.actions"), render: (r) => (
      <div className="flex items-center gap-1">
        <button type="button" onClick={() => setSelected(r)} aria-label={t("view")} className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100">
          <Eye className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => del.mutate(`${PATH}${r.id}/`)} aria-label={t("delete")} className="grid h-8 w-8 place-items-center rounded-md text-status-issue hover:bg-[#fdecec]">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ) },
  ];

  return (
    <div>
      <PageHeader
        title={t("title")}
        subtitle={hasRoutes ? t("subtitle") : t("subtitleEmpty")}
        actions={
          <>
            <Button variant="outline" onClick={() => readiness.refetch()}>
              <RefreshCw className="h-4 w-4" />
              {t("refreshData")}
            </Button>
            {hasRoutes && (
              <Button variant="primary" onClick={() => setOptimizeOpen(true)}>
                <Sparkles className="h-4 w-4" />
                {t("reoptimize")}
              </Button>
            )}
          </>
        }
      />

      {!hasRoutes ? (
        <Card>
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-12 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-[#eaeef5] text-brand-navy">
              <Bot className="h-7 w-7" />
            </span>
            <div className="text-lg font-semibold text-brand-navy">
              {t("studentsReady", { count: readiness.data?.students_ready ?? 0 })}
            </div>
            <div className="text-sm text-slate-500">{t("readyHint")}</div>
            <Button variant="primary" className="mt-2" onClick={() => setOptimizeOpen(true)}>
              <Sparkles className="h-4 w-4" />
              {t("configurePlan")}
            </Button>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-brand-navy">
              {t("routes")} ({total})
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute inset-y-0 start-3 my-auto h-4 w-4 text-slate-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder={t("search")}
                  className="h-9 w-52 rounded-md border border-border bg-surface ps-9 pe-3 text-sm outline-none focus:border-brand-navy"
                />
              </div>
              <Button variant="primary" onClick={() => setAddOpen(true)}>
                <Plus className="h-4 w-4" />
                {t("addRoute")}
              </Button>
            </div>
          </div>

          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(r) => r.id}
            emptyLabel={isLoading ? "Loading…" : "No routes"}
          />

          <div className="mt-4 flex justify-center border-t border-border pt-4">
            <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
          </div>
        </Card>
      )}

      <OptimizeModal
        open={optimizeOpen}
        onClose={() => setOptimizeOpen(false)}
        running={optimize.isPending}
        onRun={async (params) => {
          await optimize.mutateAsync(params);
          setOptimizeOpen(false);
        }}
      />
      <AddRouteModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        submitting={create.isPending}
        onSubmit={async (values) => {
          await create.mutateAsync(values);
          setAddOpen(false);
        }}
      />
      <RouteDetailModal route={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
