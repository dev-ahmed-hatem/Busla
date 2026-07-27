"use client";

import { StatusPill } from "@busla/ui";
import { Bus, MapPin, School, User, UserCog, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Modal } from "@/components/ui/modal";
import type { Route, RouteStop } from "@/lib/api/resources";
import { humanizeStatus } from "@/lib/utils/status";

function Crew({ icon: Icon, label, value }: { icon: typeof Bus; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border p-3">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-[#eaeef5] text-brand-navy">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <div className="text-xs text-slate-400">{label}</div>
        <div className="truncate text-sm font-medium text-brand-navy">{value}</div>
      </div>
    </div>
  );
}

const STOP_ICON: Record<string, typeof Bus> = {
  supervisor_home: UserCog,
  student: User,
  school: School,
};

export function RouteDetailModal({ route, onClose }: { route: Route | null; onClose: () => void }) {
  const t = useTranslations("routePlanning");

  return (
    <Modal open={route !== null} onClose={onClose} size="xl">
      {route && (
        <>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("detail.close")}
            className="absolute end-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="mb-4 pe-8">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-brand-navy">
                {route.code} — {route.name}
              </h2>
              <StatusPill status={route.status} label={humanizeStatus(route.status)} />
            </div>
            <div className="mt-0.5 text-sm text-slate-500">
              {route.area || "—"} • {route.shift} • {route.student_count} students
            </div>
          </div>

          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            <Crew icon={Bus} label={t("cols.bus")} value={route.bus_number ?? "—"} />
            <Crew icon={User} label={t("cols.driver")} value={route.driver_name ?? t("assignDriver")} />
            <Crew icon={UserCog} label={t("cols.nannyStop")} value={route.supervisor_name ?? "—"} />
          </div>

          <div
            className="relative mb-4 h-40 overflow-hidden rounded-lg border border-border"
            style={{ background: "linear-gradient(135deg,#eef2f7,#e7edf3)" }}
          >
            <div
              className="absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  "linear-gradient(#dbe3ec 1px,transparent 1px),linear-gradient(90deg,#dbe3ec 1px,transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="absolute end-3 top-3 rounded-md bg-surface px-3 py-1.5 text-xs shadow-sm">
              <span className="font-medium text-brand-navy">{t("detail.distance")}:</span> {route.distance_km} KM
              {" · "}
              <span className="font-medium text-brand-navy">{t("detail.duration")}:</span> {route.duration_min} min
            </div>
          </div>

          <h4 className="mb-2 text-sm font-semibold text-brand-navy">
            {t("detail.stops")} ({route.stops.length})
          </h4>
          <ol className="flex flex-col gap-2">
            {route.stops.map((stop: RouteStop) => {
              const Icon = STOP_ICON[stop.kind] ?? MapPin;
              return (
                <li key={stop.id} className="flex items-center gap-3 rounded-md border border-border px-3 py-2">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-navy text-xs font-semibold text-white">
                    {stop.sequence}
                  </span>
                  <Icon className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className="truncate text-sm text-slate-700">{stop.label}</span>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </Modal>
  );
}
