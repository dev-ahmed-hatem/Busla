"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Avatar } from "@/components/ui/avatar";
import { useParentRequests } from "@/lib/api/hooks";
import type { ParentRequestItem } from "@/lib/api/resources";

import { ParentRequestModal } from "./parent-request-modal";
import { GroupedList, ROW_CLASS, UnreadDot } from "./parts";

function Row({ item, onView }: { item: ParentRequestItem; onView: (id: string) => void }) {
  const t = useTranslations("notifications");
  return (
    <div className={ROW_CLASS}>
      <Avatar name={item.name} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-brand-navy">
          {item.name} - {item.zone}
        </div>
        <div className="truncate text-xs text-slate-500">{item.reason}</div>
      </div>
      <button
        type="button"
        onClick={() => onView(item.id)}
        className="flex shrink-0 items-center gap-1.5 rounded-md bg-brand-navy px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
      >
        {t("viewRequest")}
        <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
      </button>
      <span className="hidden whitespace-nowrap text-xs text-slate-400 md:block">{item.time}</span>
      <UnreadDot read={item.is_read} />
    </div>
  );
}

export function ParentRequestsList() {
  const t = useTranslations("notifications");
  const [openId, setOpenId] = useState<string | null>(null);
  const { data, isLoading } = useParentRequests({ status: "pending" });
  const items = data?.results ?? [];

  return (
    <>
      {isLoading ? (
        <div className="py-12 text-center text-sm text-slate-400">{t("loading")}</div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-sm text-slate-400">{t("empty")}</div>
      ) : (
        <GroupedList
          items={items}
          renderItem={(item) => <Row key={item.id} item={item} onView={setOpenId} />}
        />
      )}
      <ParentRequestModal id={openId} onClose={() => setOpenId(null)} />
    </>
  );
}
