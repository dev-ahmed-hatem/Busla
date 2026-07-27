"use client";

import { StatusPill } from "@busla/ui";
import {
  Calendar,
  Camera,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Printer,
  Route as RouteIcon,
  School,
  X,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Tabs } from "@/components/ui/tabs";
import { useStudent, useUploadPhoto } from "@/lib/api/hooks";
import type { Guardian } from "@/lib/api/resources";
import { humanizeStatus } from "@/lib/utils/status";

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
  const t = useTranslations("users.profile");
  return (
    <div className="flex flex-col items-center rounded-lg border border-border bg-slate-50 p-4 text-center">
      <Avatar name={g.name} size={56} />
      <div className="mt-2 truncate text-sm font-semibold text-brand-navy">{g.name}</div>
      <div className="text-xs text-slate-500">
        {g.relationship}
        {g.is_primary && ` (${t("primaryContact")})`}
      </div>
      <div className="mt-3 flex flex-col items-center gap-1.5 text-sm text-slate-600">
        {g.phone && (
          <span className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-status-ontime" />
            {g.phone}
          </span>
        )}
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

export function StudentProfileModal({
  studentId,
  onClose,
}: {
  studentId: string | null;
  onClose: () => void;
}) {
  const t = useTranslations("users.profile");
  const [tab, setTab] = useState("personal");
  const { data: student, isLoading } = useStudent(studentId);
  const upload = useUploadPhoto([["students"], ["users"]]);
  const fileInput = useRef<HTMLInputElement>(null);

  const onPickPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && studentId) upload.mutate({ path: `/api/v1/students/${studentId}/`, file });
    e.target.value = "";
  };

  const dash = "—";

  return (
    <Modal open={!!studentId} onClose={onClose} size="xl">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute end-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100"
      >
        <X className="h-4 w-4" />
      </button>

      {isLoading || !student ? (
        <div className="grid place-items-center py-16 text-sm text-slate-400">…</div>
      ) : (
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="w-full shrink-0 md:w-56">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="relative">
                <Avatar name={student.full_name} src={student.photo} size={96} />
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  disabled={upload.isPending}
                  aria-label={t("changePhoto")}
                  className="absolute -end-1 -bottom-1 grid h-8 w-8 place-items-center rounded-full border-2 border-surface bg-brand-navy text-white hover:opacity-90 disabled:opacity-60"
                >
                  {upload.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </button>
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onPickPhoto}
                />
              </div>
              <div>
                <div className="font-semibold text-brand-navy">{student.full_name}</div>
                <div className="text-xs text-slate-500">
                  {t("studentId")}: {student.id.slice(0, 8)}
                </div>
              </div>
              <StatusPill status={student.status} label={humanizeStatus(student.status)} />
              <div className="mt-2 flex w-full flex-col gap-2">
                <Button variant="primary">
                  <Pencil className="h-4 w-4" />
                  {t("edit")}
                </Button>
                <Button variant="outline">
                  <Printer className="h-4 w-4" />
                  {t("printReport")}
                </Button>
              </div>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <Tabs
              items={[
                { key: "personal", label: t("tabs.personal") },
                { key: "guardian", label: t("tabs.guardian"), count: student.guardians.length || undefined },
                { key: "transportation", label: t("tabs.transportation") },
              ]}
              value={tab}
              onValueChange={setTab}
              className="mb-4"
            />

            {tab === "personal" && (
              <div>
                <InfoRow icon={Calendar} label={t("personal.dob")} value={student.date_of_birth || dash} />
                <InfoRow icon={GraduationCap} label={t("personal.grade")} value={student.grade || dash} />
                <InfoRow icon={School} label={t("personal.class")} value={student.class_name || dash} />
                <InfoRow icon={MapPin} label={t("personal.address")} value={student.address || dash} />
              </div>
            )}

            {tab === "guardian" &&
              (student.guardians.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {student.guardians.map((g) => (
                    <GuardianCard key={g.id} g={g} />
                  ))}
                </div>
              ) : (
                <div className="grid place-items-center py-12 text-center">
                  <div className="text-sm font-semibold text-brand-navy">{t("emptyTitle")}</div>
                  <div className="mt-1 text-xs text-slate-400">{t("noGuardians")}</div>
                </div>
              ))}

            {tab === "transportation" && (
              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-lg font-bold text-status-info">{student.bus_number || dash}</div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                    <RouteIcon className="h-4 w-4 text-slate-400" />
                    {t("route")}: {student.route_name || dash}
                  </div>
                </div>
                <InfoRow icon={MapPin} label={t("area")} value={student.area || dash} />
                <InfoRow icon={MapPin} label={t("personal.address")} value={student.address || dash} />
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
