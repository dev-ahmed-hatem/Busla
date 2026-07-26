"use client";

import { StatusPill } from "@busla/ui";
import { Bus, Check, Gauge, IdCard, Trash2, User, Users, Wrench, X, type LucideIcon } from "lucide-react";
import { useState } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Tabs } from "@/components/ui/tabs";
import { BUS_PROFILE, type HealthMeter } from "@/lib/mock/buses";

const p = BUS_PROFILE;

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

function Meter({ label, meter }: { label: string; meter: HealthMeter }) {
  return (
    <div className="py-3">
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-slate-500">{label}</span>
        <span className="font-medium text-brand-navy">{meter.label}</span>
      </div>
      <ProgressBar percent={meter.percent} tone={meter.tone} />
    </div>
  );
}

export function BusProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState("info");

  return (
    <Modal open={open} onClose={onClose} size="lg">
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
              <Bus className="h-9 w-9" />
            </span>
            <div className="font-semibold text-brand-navy">{p.name}</div>
            <StatusPill status={p.status} />
            <div className="mt-2 flex w-full flex-col gap-2">
              <Button variant="success">
                <Check className="h-4 w-4" />
                Resolve
              </Button>
              <Button variant="dangerOutline">
                <Trash2 className="h-4 w-4" />
                Delete Bus
              </Button>
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <Tabs
            items={[
              { key: "info", label: "Info" },
              { key: "route", label: "Route" },
              { key: "maintenance", label: "Maintenance", count: p.openMaintenance },
            ]}
            value={tab}
            onValueChange={setTab}
            className="mb-4"
          />

          {tab === "info" && (
            <div>
              <InfoRow
                icon={User}
                label="Driver"
                value={
                  <span className="inline-flex items-center gap-2">
                    <Avatar name={p.info.driver} size={24} />
                    {p.info.driver}
                  </span>
                }
              />
              <InfoRow icon={Bus} label="Bus Model" value={p.info.model} />
              <InfoRow icon={IdCard} label="Bus Plate" value={<span dir="rtl">{p.info.plate}</span>} />
              <InfoRow icon={Users} label="Capacity" value={p.info.capacity} />
            </div>
          )}

          {tab === "route" && (
            <div>
              <InfoRow icon={Bus} label="Route" value={p.route.route} />
              <InfoRow icon={Gauge} label="Odometer (Current KM)" value={p.route.odometer} />
            </div>
          )}

          {tab === "maintenance" && (
            <div>
              <InfoRow icon={Wrench} label="Breakdown" value={p.maintenance.breakdown} />
              <InfoRow
                icon={Wrench}
                label="Last maintenance"
                value={<span className="text-status-delayed">{p.maintenance.last}</span>}
              />
              <Meter label="Oil Health" meter={p.maintenance.oil} />
              <Meter label="Tire Life" meter={p.maintenance.tire} />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
