"use client";

import { StatusPill } from "@busla/ui";
import {
  ArrowUpDown,
  Calendar,
  Check,
  GraduationCap,
  Lightbulb,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Printer,
  School,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Tabs } from "@/components/ui/tabs";
import { STUDENT_PROFILE, type Guardian } from "@/lib/mock/users";

const p = STUDENT_PROFILE;

function InfoRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-border py-3 last:border-0">
      <Icon className="h-4 w-4 shrink-0 text-slate-400" />
      <span className="text-sm text-slate-500">{label}</span>
      <span className="ms-auto text-end text-sm font-medium text-brand-navy">{value}</span>
    </div>
  );
}

function GuardianCard({ g }: { g: Guardian }) {
  return (
    <div className="rounded-lg border border-border bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <Avatar name={g.name} size={40} />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-brand-navy">{g.name}</div>
          <div className="text-xs text-slate-500">
            {g.role}
            {g.primary && " (Primary Contact)"}
            {g.isNew && " (New)"}
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-1.5 text-sm text-slate-600">
        <span className="flex items-center gap-2">
          <Phone className="h-3.5 w-3.5 text-status-ontime" />
          {g.phone}
        </span>
        {g.email && (
          <span className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-status-info" />
            {g.email}
          </span>
        )}
      </div>
    </div>
  );
}

function PickupCard({ title, time, address }: { title: string; time: string; address: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-brand-navy">{title}</span>
        <span className="text-sm text-slate-500">{time}</span>
      </div>
      <div className="mt-1 flex items-start gap-2 text-sm text-slate-600">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
        {address}
      </div>
    </div>
  );
}

function RequestsTab() {
  const r = p.request;
  if (!r) {
    return (
      <div className="grid place-items-center py-12 text-center">
        <div className="text-sm font-semibold text-brand-navy">No Available Requests</div>
        <div className="mt-1 text-xs text-slate-400">
          New requests will appear here once submitted
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-brand-navy">Change Details</span>
        <span className="text-xs text-slate-500">{r.date}</span>
      </div>

      <div className="rounded-lg border border-border p-3">
        <div className="text-sm text-slate-600">{r.current.address}</div>
        <div className="mt-1 text-xs text-slate-500">{r.current.route}</div>
        <span className="mt-2 inline-block rounded-full bg-[#e9f7ef] px-2 py-0.5 text-xs font-medium text-status-ontime">
          {r.current.tag}
        </span>
      </div>

      <div className="flex justify-center">
        <ArrowUpDown className="h-4 w-4 text-slate-400" />
      </div>

      <div
        className="rounded-lg border border-border p-3"
        style={{ borderInlineStartWidth: 4, borderInlineStartColor: "var(--color-status-delayed)" }}
      >
        <div className="text-sm text-slate-600">{r.requested.address}</div>
        <span className="mt-2 inline-block rounded-full bg-[#fdf3e7] px-2 py-0.5 text-xs font-medium text-status-delayed">
          {r.requested.status}
        </span>
      </div>

      <div className="rounded-lg bg-[#fdf9ee] p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-brand-navy">
          <Lightbulb className="h-4 w-4 text-status-delayed" />
          System Suggestion
        </div>
        <p className="mt-1 text-xs text-slate-600">{r.suggestion.text}</p>
        <div className="mt-3 text-sm">
          <span className="mb-1 block text-xs font-medium text-slate-500">Assign New Bus *</span>
          <div className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-slate-700">
            {r.suggestion.bus}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <span>{r.suggestion.seatsLeft} Seats Left</span>
          <div className="w-24">
            <ProgressBar percent={r.suggestion.percent} tone="delayed" />
          </div>
          <span>{r.suggestion.percent}%</span>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="dangerOutline">
          <X className="h-4 w-4" />
          Reject Request
        </Button>
        <Button variant="success">
          <Check className="h-4 w-4" />
          Approve Request
        </Button>
      </div>
    </div>
  );
}

export function StudentProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState("personal");
  const tr = p.transportation;

  return (
    <Modal open={open} onClose={onClose} size="xl">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute end-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="w-full shrink-0 md:w-56">
          <div className="flex flex-col items-center gap-3 text-center">
            <Avatar name={p.name} size={96} />
            <div>
              <div className="font-semibold text-brand-navy">{p.name}</div>
              <div className="text-xs text-slate-500">Student ID: {p.studentId}</div>
            </div>
            <StatusPill status={p.status} tone="onTime" />
            <div className="mt-2 flex w-full flex-col gap-2">
              <Button variant="primary">
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline">
                <Printer className="h-4 w-4" />
                Print Report
              </Button>
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <Tabs
            items={[
              { key: "personal", label: "Personal Info" },
              { key: "guardian", label: "Guardian" },
              { key: "transportation", label: "Transportation" },
              { key: "requests", label: "Requests", count: p.request ? 1 : undefined },
            ]}
            value={tab}
            onValueChange={setTab}
            className="mb-4"
          />

          {tab === "personal" && (
            <div>
              <InfoRow icon={Calendar} label="Date of Birth" value={p.personal.dob} />
              <InfoRow icon={GraduationCap} label="Grade" value={p.personal.grade} />
              <InfoRow icon={School} label="Class" value={p.personal.class} />
              <InfoRow icon={MapPin} label="Address" value={p.personal.address} />
            </div>
          )}

          {tab === "guardian" && (
            <div className="grid gap-4 sm:grid-cols-2">
              {p.guardians.map((g) => (
                <GuardianCard key={g.name + g.role} g={g} />
              ))}
            </div>
          )}

          {tab === "transportation" && (
            <div className="flex flex-col gap-4">
              <div>
                <div className="text-lg font-bold text-status-info">{tr.bus}</div>
                <div className="mt-1 text-sm text-slate-600">Driver: {tr.driver}</div>
                <div className="text-sm text-slate-600">Supervisor: {tr.supervisor}</div>
              </div>
              <PickupCard
                title="Morning Pickup"
                time={tr.morningPickup.time}
                address={tr.morningPickup.address}
              />
              <PickupCard
                title="Afternoon Drop-Off"
                time={tr.afternoonDropoff.time}
                address={tr.afternoonDropoff.address}
              />
            </div>
          )}

          {tab === "requests" && <RequestsTab />}
        </div>
      </div>
    </Modal>
  );
}
