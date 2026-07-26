import { Bell, UserSearch } from "lucide-react";
import { useTranslations } from "next-intl";

import { Avatar } from "@/components/ui/avatar";
import {
  DRIVER_CHECKINS,
  SHIFT_SUMMARY,
  type CheckInState,
  type DriverCheckin,
} from "@/lib/mock/notifications";
import { cn } from "@/lib/utils/cn";

import { ROW_CLASS, UnreadDot } from "./parts";

const DETAIL_TONE: Record<CheckInState, string> = {
  no_response: "text-status-issue",
  pending: "text-status-delayed",
  checked_in: "text-slate-400",
};

function Action({ state }: { state: CheckInState }) {
  const t = useTranslations("notifications");
  if (state === "no_response") {
    return (
      <button
        type="button"
        className="flex shrink-0 items-center gap-1.5 rounded-md bg-brand-navy px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
      >
        <UserSearch className="h-3.5 w-3.5" />
        {t("findSubstitute")}
      </button>
    );
  }
  if (state === "pending") {
    return (
      <button
        type="button"
        className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
      >
        <Bell className="h-3.5 w-3.5" />
        {t("sendReminder")}
      </button>
    );
  }
  return null;
}

function Row({ item }: { item: DriverCheckin }) {
  return (
    <div className={ROW_CLASS}>
      <Avatar name={item.name} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-brand-navy">{item.name}</div>
        <div className="truncate text-xs text-slate-500">{item.bus}</div>
      </div>
      <Action state={item.state} />
      <span
        className={cn(
          "whitespace-nowrap text-xs font-medium",
          DETAIL_TONE[item.state],
          // rows with an action button hide the redundant detail text on small screens
          item.state !== "checked_in" && "hidden sm:inline",
        )}
      >
        {item.detail}
      </span>
      <UnreadDot />
    </div>
  );
}

export function ShiftReadiness() {
  const t = useTranslations("notifications");
  return (
    <div>
      <div className="mb-4 mt-4 flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold text-brand-navy">
          {t("groups.today")} {SHIFT_SUMMARY.time}
        </span>
        <span className="rounded-full bg-[#eaeef5] px-3 py-1 text-xs font-medium text-brand-navy">
          {t("driversCheckedIn", { checked: SHIFT_SUMMARY.checkedIn, total: SHIFT_SUMMARY.total })}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {DRIVER_CHECKINS.map((item) => (
          <Row key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
