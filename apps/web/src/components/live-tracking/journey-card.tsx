import { StatusPill, TONE_VAR, toneFor } from "@busla/ui";
import { Bus, Clock, MapPin, Users } from "lucide-react";
import { useTranslations } from "next-intl";

import { Avatar } from "@/components/ui/avatar";
import { STATUS_KEY, type Journey } from "@/lib/mock/live-tracking";
import { cn } from "@/lib/utils/cn";

export function JourneyCard({
  journey,
  onClick,
  selected,
}: {
  journey: Journey;
  onClick?: () => void;
  selected?: boolean;
}) {
  const t = useTranslations("liveTracking");
  const color = TONE_VAR[toneFor(journey.status)];
  const progress = journey.kmTotal ? (journey.kmDone / journey.kmTotal) * 100 : 0;
  const heading = journey.headingLabel === "Heading to" ? t("headingTo") : t("stoppedAt");

  return (
    <div
      role={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "rounded-lg border bg-surface p-3",
        onClick && "cursor-pointer hover:border-slate-300",
        selected ? "border-brand-navy" : "border-border",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 font-semibold text-brand-navy">
          <Bus className="h-4 w-4 text-brand-amber" />
          {journey.bus}
        </span>
        <StatusPill
          status={journey.status}
          label={t(`status.${STATUS_KEY[journey.status]}`)}
        />
      </div>

      <div className="mt-1 text-xs text-slate-400">{heading}</div>
      <div className="text-sm font-medium text-brand-navy">{journey.destination}</div>

      <div className="relative my-3 h-1.5 rounded-pill bg-slate-100">
        <div className="h-full rounded-pill" style={{ width: `${progress}%`, background: color }} />
        <span
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2"
          style={{ insetInlineStart: `${progress}%` }}
        >
          <Bus className="h-3.5 w-3.5" style={{ color }} />
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          {journey.occupied}/{journey.capacity}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {journey.minutes} {t("mins")}
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {journey.kmDone}/{journey.kmTotal} {t("km")}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3 text-xs">
        <span className="inline-flex min-w-0 items-center gap-1.5">
          <Avatar name={journey.driver} size={22} />
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="text-[10px] text-slate-400">{t("cols.driver")}</span>
            <span className="truncate text-slate-600">{journey.driver}</span>
          </span>
        </span>
        <span className="inline-flex min-w-0 items-center gap-1.5">
          <Avatar name={journey.nanny} size={22} />
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="text-[10px] text-slate-400">{t("cols.nanny")}</span>
            <span className="truncate text-slate-600">{journey.nanny}</span>
          </span>
        </span>
      </div>
    </div>
  );
}
