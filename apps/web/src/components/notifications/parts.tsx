import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import type { NotifGroup } from "@/lib/api/resources";

/** Shared row card styling for notification lists. */
export const ROW_CLASS =
  "flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3";

/** Renders the unread marker, or an equal-width spacer so read rows stay aligned. */
export function UnreadDot({ read = false }: { read?: boolean }) {
  if (read) return <span className="h-2 w-2 shrink-0" aria-hidden />;
  return <span className="h-2 w-2 shrink-0 rounded-full bg-status-info" aria-label="Unread" />;
}

function GroupHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="mb-3 mt-6 flex items-center gap-2 first:mt-0">
      <h3 className="text-sm font-semibold text-brand-navy">{label}</h3>
      <span className="text-xs font-medium text-status-info">{count}</span>
    </div>
  );
}

const GROUP_ORDER: NotifGroup[] = ["today", "yesterday", "earlier"];

/** Groups items by `group` and renders a header + stacked rows per non-empty group. */
export function GroupedList<T extends { id: string; group: NotifGroup }>({
  items,
  renderItem,
}: {
  items: T[];
  renderItem: (item: T) => ReactNode;
}) {
  const t = useTranslations("notifications");
  return (
    <div>
      {GROUP_ORDER.map((group) => {
        const rows = items.filter((i) => i.group === group);
        if (rows.length === 0) return null;
        return (
          <section key={group}>
            <GroupHeader label={t(`groups.${group}`)} count={rows.length} />
            <div className="flex flex-col gap-3">{rows.map(renderItem)}</div>
          </section>
        );
      })}
    </div>
  );
}
