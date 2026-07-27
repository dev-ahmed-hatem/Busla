"use client";

import { CheckCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Tabs, type TabItem } from "@/components/ui/tabs";
import {
  useMarkAllRead,
  useNotifications,
  useParentRequests,
  useShiftReadiness,
} from "@/lib/api/hooks";

import { ParentRequestsList } from "./parent-requests";
import { ShiftReadiness } from "./shift-readiness";
import { TripFeed } from "./trip-feed";

export function NotificationsView() {
  const t = useTranslations("notifications");
  const [tab, setTab] = useState("trips");

  const notifs = useNotifications();
  const requests = useParentRequests({ status: "pending" });
  const shift = useShiftReadiness();
  const markAllRead = useMarkAllRead();

  const unreadTrips = notifs.data?.filter((n) => !n.is_read).length ?? 0;
  const pendingRequests = requests.data?.count ?? 0;
  const notCheckedIn = shift.data
    ? shift.data.summary.total - shift.data.summary.checkedIn
    : 0;

  const items: TabItem[] = [
    { key: "trips", label: t("tabs.trips"), count: unreadTrips },
    { key: "parentRequests", label: t("tabs.parentRequests"), count: pendingRequests },
    { key: "shiftReadiness", label: t("tabs.shiftReadiness"), count: notCheckedIn },
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <Tabs items={items} value={tab} onValueChange={setTab} />
        {tab === "trips" && unreadTrips > 0 && (
          <button
            type="button"
            disabled={markAllRead.isPending}
            onClick={() => markAllRead.mutate()}
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs font-medium text-status-info hover:underline disabled:opacity-60"
          >
            <CheckCheck className="h-4 w-4" />
            {t("markAllRead")}
          </button>
        )}
      </div>
      <div className="mt-2">
        {tab === "trips" && <TripFeed />}
        {tab === "parentRequests" && <ParentRequestsList />}
        {tab === "shiftReadiness" && <ShiftReadiness />}
      </div>
    </div>
  );
}
