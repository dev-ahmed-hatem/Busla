import { TONE_VAR, type StatusTone } from "@busla/ui";
import {
  AlertTriangle,
  Bus,
  CheckCircle2,
  Clock,
  Navigation,
  type LucideIcon,
} from "lucide-react";

import { TRIP_NOTIFS, type TripNotif, type TripNotifKind } from "@/lib/mock/notifications";

import { GroupedList, ROW_CLASS, UnreadDot } from "./parts";

const KIND_META: Record<TripNotifKind, { icon: LucideIcon; tone: StatusTone }> = {
  breakdown: { icon: AlertTriangle, tone: "issue" },
  off_route: { icon: Navigation, tone: "issue" },
  trip_started: { icon: Bus, tone: "info" },
  delay: { icon: Clock, tone: "delayed" },
  completed: { icon: CheckCircle2, tone: "onTime" },
};

function Row({ item }: { item: TripNotif }) {
  const { icon: Icon, tone } = KIND_META[item.kind];
  const color = TONE_VAR[tone];
  return (
    <div className={ROW_CLASS}>
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full"
        style={{ background: `color-mix(in srgb, ${color} 14%, transparent)`, color }}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-brand-navy">{item.title}</div>
        <div className="truncate text-xs text-slate-500">{item.subtitle}</div>
      </div>
      <span className="whitespace-nowrap text-xs text-slate-400">{item.time}</span>
      <UnreadDot />
    </div>
  );
}

export function TripFeed() {
  return <GroupedList items={TRIP_NOTIFS} renderItem={(item) => <Row key={item.id} item={item} />} />;
}
