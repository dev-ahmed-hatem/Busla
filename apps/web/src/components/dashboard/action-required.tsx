import { TONE_VAR, type StatusTone } from "@busla/ui";
import {
  AlertTriangle,
  ChevronRight,
  MapPin,
  MessageSquare,
  UserX,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Card, CardHeader } from "@/components/ui/card";
import {
  ACTION_ITEMS,
  ACTION_REQUIRED_COUNT,
  type ActionItem,
  type ActionKind,
} from "@/lib/mock/dashboard";

const KIND_META: Record<ActionKind, { icon: LucideIcon; tone: StatusTone }> = {
  breakdown: { icon: AlertTriangle, tone: "issue" },
  off_route: { icon: MapPin, tone: "issue" },
  absent: { icon: UserX, tone: "delayed" },
  request: { icon: MessageSquare, tone: "info" },
};

function Row({ item }: { item: ActionItem }) {
  const t = useTranslations("dashboard");
  const { icon: Icon, tone } = KIND_META[item.kind];
  const color = TONE_VAR[tone];

  return (
    <li className="flex items-center gap-3 border-b border-border py-3 last:border-0">
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full"
        style={{ background: `color-mix(in srgb, ${color} 14%, transparent)`, color }}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-brand-navy">{item.title}</div>
        <div className="truncate text-xs text-slate-500">{item.subtitle}</div>
      </div>
      <span className="whitespace-nowrap text-xs text-slate-400">
        {t("minAgo", { mins: item.minsAgo })}
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 rtl:rotate-180" />
    </li>
  );
}

export function ActionRequired() {
  const t = useTranslations("dashboard");
  return (
    <Card>
      <CardHeader
        title={t("actionRequired")}
        count={ACTION_REQUIRED_COUNT}
        action={
          <button type="button" className="text-sm font-medium text-status-info">
            {t("viewAll")}
          </button>
        }
      />
      <ul>
        {ACTION_ITEMS.map((item) => (
          <Row key={item.id} item={item} />
        ))}
      </ul>
    </Card>
  );
}
