"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Tabs, type TabItem } from "@/components/ui/tabs";
import { NOTIF_COUNTS } from "@/lib/mock/notifications";

import { ParentRequestsList } from "./parent-requests";
import { ShiftReadiness } from "./shift-readiness";
import { TripFeed } from "./trip-feed";

export function NotificationsView() {
  const t = useTranslations("notifications");
  const [tab, setTab] = useState("trips");

  const items: TabItem[] = [
    { key: "trips", label: t("tabs.trips"), count: NOTIF_COUNTS.trips },
    { key: "parentRequests", label: t("tabs.parentRequests"), count: NOTIF_COUNTS.parentRequests },
    { key: "shiftReadiness", label: t("tabs.shiftReadiness"), count: NOTIF_COUNTS.shiftReadiness },
  ];

  return (
    <div>
      <Tabs items={items} value={tab} onValueChange={setTab} />
      <div className="mt-2">
        {tab === "trips" && <TripFeed />}
        {tab === "parentRequests" && <ParentRequestsList />}
        {tab === "shiftReadiness" && <ShiftReadiness />}
      </div>
    </div>
  );
}
