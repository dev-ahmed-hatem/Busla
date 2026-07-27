"use client";

import { StatusPill, TONE_VAR, type StatusTone } from "@busla/ui";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { useTrip } from "@/lib/api/hooks";
import type { Journey, TimelineStop } from "@/lib/api/resources";

import { JourneyCard } from "./journey-card";

type StopStatus = TimelineStop["status"];

const STOP_TONE: Record<StopStatus, StatusTone> = {
  completed: "onTime",
  current: "info",
  upcoming: "neutral",
};

function Timeline({ stops }: { stops: TimelineStop[] }) {
  const t = useTranslations("liveTracking");
  return (
    <ol>
      {stops.map((stop, i) => {
        const tone = STOP_TONE[stop.status];
        const last = i === stops.length - 1;
        return (
          <li key={i} className="relative flex gap-3 pb-5 last:pb-0">
            {!last && (
              <span className="absolute top-4 h-full w-px bg-border" style={{ insetInlineStart: 6 }} />
            )}
            <span
              className="relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-surface"
              style={{ background: TONE_VAR[tone] }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-brand-navy">{stop.title}</span>
                <StatusPill status={stop.status} tone={tone} label={t(`stopStatus.${stop.status}`)} />
              </div>
              {stop.address && <div className="text-xs text-slate-500">{stop.address}</div>}
              <div className="text-xs text-slate-400">{stop.time}</div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function JourneyDetail({ journey, onBack }: { journey: Journey; onBack: () => void }) {
  const t = useTranslations("liveTracking");
  const { data: d } = useTrip(journey.id);

  return (
    <div className="flex h-full flex-col overflow-auto">
      <button
        type="button"
        onClick={onBack}
        className="mb-3 inline-flex items-center gap-1 self-start text-sm text-slate-500 hover:text-brand-navy"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        {t("back")}
      </button>

      <JourneyCard journey={journey} />

      {d && (
        <>
          <div className="mt-4 rounded-lg border border-border p-3">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>
                {t("from")} <span className="font-medium text-brand-navy">{d.from}</span>
              </span>
              <span>
                {t("to")} <span className="font-medium text-brand-navy">{d.to}</span>
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center text-xs">
              <div>
                <div className="text-slate-400">{t("departureTime")}</div>
                <div className="font-medium text-brand-navy">{d.departure}</div>
              </div>
              <div>
                <div className="text-slate-400">{t("stops")}</div>
                <div className="font-medium text-brand-navy">{d.stops}</div>
              </div>
              <div>
                <div className="text-slate-400">{t("estimatedArrival")}</div>
                <div className="font-medium text-brand-navy">{d.arrival}</div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="mb-3 text-sm font-semibold text-brand-navy">{t("routeTimeline")}</h4>
            <Timeline stops={d.timeline} />
          </div>
        </>
      )}
    </div>
  );
}
