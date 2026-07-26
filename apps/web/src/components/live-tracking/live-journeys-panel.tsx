"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { JOURNEYS, LIVE_JOURNEYS_COUNT, type Journey } from "@/lib/mock/live-tracking";

import { JourneyCard } from "./journey-card";
import { JourneyDetail } from "./journey-detail";

export function LiveJourneysPanel() {
  const t = useTranslations("liveTracking");
  const [selected, setSelected] = useState<Journey | null>(null);

  if (selected) {
    return <JourneyDetail journey={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-2 font-semibold text-brand-navy">
        {t("liveJourneys")} ({LIVE_JOURNEYS_COUNT})
      </h3>
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute inset-y-0 start-3 my-auto h-4 w-4 text-slate-400" />
        <input
          type="search"
          placeholder={t("searchJourneys")}
          className="h-9 w-full rounded-md border border-border bg-surface ps-9 pe-9 text-sm outline-none focus:border-brand-navy"
        />
        <SlidersHorizontal className="pointer-events-none absolute inset-y-0 end-3 my-auto h-4 w-4 text-slate-400" />
      </div>
      <div className="flex flex-col gap-3 overflow-auto pe-1">
        {JOURNEYS.map((j) => (
          <JourneyCard key={j.id} journey={j} onClick={() => setSelected(j)} />
        ))}
      </div>
    </div>
  );
}
