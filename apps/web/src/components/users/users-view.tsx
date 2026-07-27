"use client";

import { StatusPill } from "@busla/ui";
import { Bus, Download, Eye, Filter, Plus, Search, Trash2, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { PillTabs, type TabItem } from "@/components/ui/tabs";
import { useCreate, useDelete, useList } from "@/lib/api/hooks";
import { PAGE_SIZE } from "@/lib/api/resources";
import { humanizeStatus } from "@/lib/utils/status";

import { AddUserModal } from "./add-user-modal";
import { StudentProfileModal } from "./student-profile-modal";

type UserTab = "students" | "drivers" | "supervisors";
const TABS: UserTab[] = ["students", "drivers", "supervisors"];

interface PersonRow {
  id: string;
  full_name: string;
  phone: string;
  area: string;
  route_name: string | null;
  bus_number: string | null;
  status: string;
}

export function UsersView() {
  const t = useTranslations("users");
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<UserTab>("students");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  // Seed from a `?q=` handoff (e.g. the header search box lands here).
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  const path = `/api/v1/${tab}/`;
  const key = ["users", tab];
  const query = { search: search || undefined, page };

  const { data, isLoading, isError, error } = useList<PersonRow>([...key, query], path, query);
  const create = useCreate<PersonRow>(key, path);
  const del = useDelete(key);

  const rows = data?.results ?? [];
  const pageCount = Math.max(1, Math.ceil((data?.count ?? 0) / PAGE_SIZE));
  const selectionMode = selected.size > 0;

  const changeTab = (k: string) => {
    setTab(k as UserTab);
    setSelected(new Set());
    setSearch("");
    setPage(1);
  };

  const bulkDelete = async () => {
    await Promise.all([...selected].map((id) => del.mutateAsync(`${path}${id}/`)));
    setSelected(new Set());
  };

  const columns: Column<PersonRow>[] = [
    { key: "series", header: t("cols.series"), render: (_r, i) => <span className="text-slate-500">{(page - 1) * PAGE_SIZE + i + 1}</span> },
    { key: "name", header: t(`person.${tab}`), render: (r) => (
      <div className="flex items-center gap-2">
        <Avatar name={r.full_name} size={32} />
        <span className="font-medium text-brand-navy">{r.full_name}</span>
      </div>
    ) },
    { key: "phone", header: t("cols.phone"), render: (r) => <span className="text-slate-600">{r.phone || "—"}</span> },
    { key: "area", header: t("cols.area"), render: (r) => <span className="text-slate-600">{r.area || "—"}</span> },
    { key: "route", header: t("cols.route"), render: (r) =>
      r.route_name ? (
        <span className="text-slate-600">{r.route_name}</span>
      ) : (
        <span className="tracking-widest text-slate-300">----------</span>
      ) },
    { key: "bus", header: t("cols.bus"), render: (r) => (
      <span className="inline-flex items-center gap-1.5 text-slate-600">
        <Bus className="h-4 w-4 text-brand-amber" />
        {r.bus_number ?? "—"}
      </span>
    ) },
    { key: "status", header: t("cols.status"), render: (r) => <StatusPill status={r.status} label={humanizeStatus(r.status)} /> },
    { key: "actions", header: t("cols.actions"), render: (r) => (
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => tab === "students" && setProfileId(r.id)}
          aria-label={t("cols.actions")}
          className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100"
        >
          <Eye className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => del.mutate(`${path}${r.id}/`)}
          aria-label="Delete"
          className="grid h-8 w-8 place-items-center rounded-md text-status-issue hover:bg-[#fdecec]"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ) },
  ];

  const tabItems: TabItem[] = TABS.map((k) => ({ key: k, label: t(`tabs.${k}`) }));

  const emptyLabel = isLoading
    ? "Loading…"
    : isError
      ? (error as Error)?.message || "Failed to load"
      : "No records yet";

  return (
    <div>
      <PillTabs items={tabItems} value={tab} onValueChange={changeTab} className="mb-4" />

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-brand-navy">{t(`heading.${tab}`)}</h2>
            {selectionMode && (
              <span className="text-sm text-slate-500">
                {t("selected", { count: selected.size })}
                {" · "}
                <button type="button" className="text-status-info" onClick={() => setSelected(new Set())}>
                  {t("clearSelection")}
                </button>
              </span>
            )}
          </div>

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
            <Button variant="outline">
              <Filter className="h-4 w-4" />
              {t("filter")}
            </Button>
            {selectionMode ? (
              <>
                <Button variant="outline">
                  <Download className="h-4 w-4" />
                  {t("export")}
                </Button>
                <Button variant="danger" onClick={bulkDelete}>
                  <Trash2 className="h-4 w-4" />
                  {t("deleteAll")}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline">
                  <Upload className="h-4 w-4" />
                  {t("uploadFile")}
                </Button>
                <Button variant="primary" onClick={() => setAddOpen(true)}>
                  <Plus className="h-4 w-4" />
                  {t(`add.${tab}`)}
                </Button>
              </>
            )}
          </div>
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(r) => r.id}
          selectable
          selected={selected}
          onSelectedChange={setSelected}
          emptyLabel={emptyLabel}
        />

        <div className="mt-4 flex justify-center border-t border-border pt-4">
          <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
        </div>
      </Card>

      <AddUserModal
        tab={tab}
        open={addOpen}
        onClose={() => setAddOpen(false)}
        submitting={create.isPending}
        onSubmit={async (values) => {
          await create.mutateAsync(values);
          setAddOpen(false);
        }}
      />
      <StudentProfileModal studentId={profileId} onClose={() => setProfileId(null)} />
    </div>
  );
}
