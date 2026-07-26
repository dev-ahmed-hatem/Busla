"use client";

import { StatusPill } from "@busla/ui";
import { Bus, Download, Eye, Filter, Plus, Search, Trash2, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { PillTabs, type TabItem } from "@/components/ui/tabs";
import { USER_ROWS, type UserRow, type UserTab } from "@/lib/mock/users";

import { AddUserModal } from "./add-user-modal";
import { StudentProfileModal } from "./student-profile-modal";

const TABS: UserTab[] = ["students", "drivers", "supervisors"];

export function UsersView() {
  const t = useTranslations("users");
  const [tab, setTab] = useState<UserTab>("students");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const rows = USER_ROWS[tab];
  const selectionMode = selected.size > 0;

  const changeTab = (key: string) => {
    setTab(key as UserTab);
    setSelected(new Set());
    setPage(1);
  };

  const tabItems: TabItem[] = TABS.map((key) => ({ key, label: t(`tabs.${key}`) }));

  const columns: Column<UserRow>[] = [
    { key: "series", header: t("cols.series"), render: (r) => <span className="text-slate-500">{r.series}</span> },
    {
      key: "name",
      header: t(`person.${tab}`),
      render: (r) => (
        <div className="flex items-center gap-2">
          <Avatar name={r.name} size={32} />
          <span className="font-medium text-brand-navy">{r.name}</span>
        </div>
      ),
    },
    { key: "phone", header: t("cols.phone"), render: (r) => <span className="text-slate-600">{r.phone}</span> },
    { key: "area", header: t("cols.area"), render: (r) => <span className="text-slate-600">{r.area}</span> },
    {
      key: "route",
      header: t("cols.route"),
      render: (r) =>
        r.route ? (
          <span className="text-slate-600">{r.route}</span>
        ) : (
          <span className="tracking-widest text-slate-300">----------</span>
        ),
    },
    {
      key: "bus",
      header: t("cols.bus"),
      render: (r) => (
        <span className="inline-flex items-center gap-1.5 text-slate-600">
          <Bus className="h-4 w-4 text-brand-amber" />
          {r.bus}
        </span>
      ),
    },
    { key: "status", header: t("cols.status"), render: (r) => <StatusPill status={r.status} /> },
    {
      key: "actions",
      header: t("cols.actions"),
      render: (r) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => tab === "students" && setProfileOpen(true)}
            aria-label="View"
            className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Delete"
            className="grid h-8 w-8 place-items-center rounded-md text-status-issue hover:bg-[#fdecec]"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

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
                <button
                  type="button"
                  className="text-status-info"
                  onClick={() => setSelected(new Set())}
                >
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
                placeholder={t("search")}
                className="h-9 w-48 rounded-md border border-border bg-surface ps-9 pe-3 text-sm outline-none focus:border-brand-navy"
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
                <Button variant="danger">
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
        />

        <div className="mt-4 flex justify-end">
          <Pagination page={page} pageCount={10} onPageChange={setPage} />
        </div>
      </Card>

      <AddUserModal tab={tab} open={addOpen} onClose={() => setAddOpen(false)} />
      <StudentProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}
