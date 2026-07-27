"use client";

import { Bell, UserSearch } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { useRemindDriver, useShiftReadiness, useSubstitutes } from "@/lib/api/hooks";
import type { CheckInState, DriverCheckin } from "@/lib/api/resources";
import { cn } from "@/lib/utils/cn";

import { ROW_CLASS, UnreadDot } from "./parts";

const DETAIL_TONE: Record<CheckInState, string> = {
  no_response: "text-status-issue",
  pending: "text-status-delayed",
  checked_in: "text-slate-400",
};

function SubstitutesModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations("notifications");
  const { data, isLoading } = useSubstitutes(open);
  return (
    <Modal open={open} onClose={onClose} title={t("substitutesTitle")} size="sm">
      {isLoading ? (
        <div className="py-8 text-center text-sm text-slate-400">…</div>
      ) : !data || data.length === 0 ? (
        <div className="py-8 text-center text-sm text-slate-400">{t("noSubstitutes")}</div>
      ) : (
        <div className="flex flex-col gap-2">
          {data.map((d) => (
            <div key={d.id} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2">
              <Avatar name={d.name} size={36} />
              <span className="flex-1 text-sm font-medium text-brand-navy">{d.name}</span>
              <span className="text-xs text-slate-500">{d.bus ?? "—"}</span>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

function Row({ item, onSubstitute }: { item: DriverCheckin; onSubstitute: () => void }) {
  const t = useTranslations("notifications");
  const remind = useRemindDriver();
  return (
    <div className={ROW_CLASS}>
      <Avatar name={item.name} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-brand-navy">{item.name}</div>
        <div className="truncate text-xs text-slate-500">{item.bus}</div>
      </div>
      {item.state === "no_response" && (
        <button
          type="button"
          onClick={onSubstitute}
          className="flex shrink-0 items-center gap-1.5 rounded-md bg-brand-navy px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
        >
          <UserSearch className="h-3.5 w-3.5" />
          {t("findSubstitute")}
        </button>
      )}
      {item.state === "pending" && (
        <button
          type="button"
          disabled={remind.isPending || remind.isSuccess}
          onClick={() => remind.mutate(item.id)}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-60"
        >
          <Bell className="h-3.5 w-3.5" />
          {remind.isSuccess ? t("reminderSent") : t("sendReminder")}
        </button>
      )}
      <span
        className={cn(
          "whitespace-nowrap text-xs font-medium",
          DETAIL_TONE[item.state],
          item.state !== "checked_in" && "hidden sm:inline",
        )}
      >
        {item.detail}
      </span>
      <UnreadDot read />
    </div>
  );
}

export function ShiftReadiness() {
  const t = useTranslations("notifications");
  const [subsOpen, setSubsOpen] = useState(false);
  const { data, isLoading } = useShiftReadiness();

  if (isLoading) return <div className="py-12 text-center text-sm text-slate-400">{t("loading")}</div>;
  if (!data || data.checkins.length === 0)
    return <div className="py-12 text-center text-sm text-slate-400">{t("empty")}</div>;

  return (
    <div>
      <div className="mb-4 mt-4 flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold text-brand-navy">
          {t("groups.today")} {data.summary.time}
        </span>
        <span className="rounded-full bg-[#eaeef5] px-3 py-1 text-xs font-medium text-brand-navy">
          {t("driversCheckedIn", { checked: data.summary.checkedIn, total: data.summary.total })}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {data.checkins.map((item) => (
          <Row key={item.id} item={item} onSubstitute={() => setSubsOpen(true)} />
        ))}
      </div>
      <SubstitutesModal open={subsOpen} onClose={() => setSubsOpen(false)} />
    </div>
  );
}
