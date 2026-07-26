import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Avatar } from "@/components/ui/avatar";
import { PARENT_REQUESTS, type ParentRequest } from "@/lib/mock/notifications";

import { GroupedList, ROW_CLASS, UnreadDot } from "./parts";

function Row({ item }: { item: ParentRequest }) {
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
        className="flex shrink-0 items-center gap-1.5 rounded-md bg-brand-navy px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
      >
        {t("viewRequest")}
        <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
      </button>
      <span className="hidden whitespace-nowrap text-xs text-slate-400 md:block">{item.time}</span>
      <UnreadDot />
    </div>
  );
}

export function ParentRequestsList() {
  return (
    <GroupedList items={PARENT_REQUESTS} renderItem={(item) => <Row key={item.id} item={item} />} />
  );
}
