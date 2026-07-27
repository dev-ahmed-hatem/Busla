"use client";

import { StatusPill } from "@busla/ui";
import { Bus as BusIcon, Gauge, IdCard, MapPin, User, Users, Wrench, X, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Tabs } from "@/components/ui/tabs";
import type { Bus } from "@/lib/api/resources";
import { humanizeStatus } from "@/lib/utils/status";

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border py-3 last:border-0">
      <Icon className="h-4 w-4 shrink-0 text-slate-400" />
      <span className="text-sm text-slate-500">{label}</span>
      <span className="ms-auto text-end text-sm font-medium text-brand-navy">{value}</span>
    </div>
  );
}

export function BusProfileModal({ bus, onClose }: { bus: Bus | null; onClose: () => void }) {
  const t = useTranslations("buses.profile");
  const [tab, setTab] = useState("info");

  return (
    <Modal open={bus !== null} onClose={onClose} size="lg">
      {bus && (
        <>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute end-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex flex-col gap-6 md:flex-row">
            <div className="w-full shrink-0 md:w-52">
              <div className="flex flex-col items-center gap-3 text-center">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-[#fef3e2] text-brand-amber">
                  <BusIcon className="h-9 w-9" />
                </span>
                <div className="font-semibold text-brand-navy">{bus.bus_number}</div>
                <StatusPill status={bus.status} label={humanizeStatus(bus.status)} />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <Tabs
                items={[
                  { key: "info", label: t("tabs.info") },
                  { key: "route", label: t("tabs.route") },
                  { key: "maintenance", label: t("tabs.maintenance") },
                ]}
                value={tab}
                onValueChange={setTab}
                className="mb-4"
              />

              {tab === "info" && (
                <div>
                  <InfoRow icon={User} label={t("info.driver")} value={bus.driver_name ?? "—"} />
                  <InfoRow icon={BusIcon} label={t("info.model")} value={bus.model_name || "—"} />
                  <InfoRow icon={IdCard} label={t("info.plate")} value={<span dir="rtl">{bus.license_plate || "—"}</span>} />
                  <InfoRow icon={Users} label={t("info.capacity")} value={`${bus.capacity}`} />
                </div>
              )}

              {tab === "route" && (
                <div>
                  <InfoRow icon={MapPin} label={t("route.route")} value={bus.route_name ?? "—"} />
                  <InfoRow icon={BusIcon} label={t("info.model")} value={bus.model_name || "—"} />
                  <InfoRow icon={Gauge} label={t("route.odometer")} value={`${bus.odometer_km} km`} />
                </div>
              )}

              {tab === "maintenance" && (
                <div>
                  <InfoRow icon={Wrench} label={t("maintenance.breakdown")} value={bus.breakdown_reason || "—"} />
                  <InfoRow icon={Wrench} label={t("maintenance.last")} value={bus.last_maintenance_at ?? "—"} />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
