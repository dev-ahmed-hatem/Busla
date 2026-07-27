"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useLiveJourneys } from "@/lib/api/hooks";
import type { Journey } from "@/lib/api/resources";

import { JourneyCard } from "./journey-card";
import { JourneyDetail } from "./journey-detail";

export function LiveJourneysPanel() {
  const t = useTranslations("liveTracking");
  const tc = useTranslations("common");
  const [selected, setSelected] = useState<Journey | null>(null);
  const { data, isLoading } = useLiveJourneys();
  const journeys = data ?? [];

  if (selected) {
    return <JourneyDetail journey={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-2 font-semibold text-brand-navy">
        {t("liveJourneys")} ({journeys.length})
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
        {isLoading && <p className="py-6 text-center text-sm text-slate-400">{tc("loading")}</p>}
        {!isLoading && journeys.length === 0 && (
          <p className="py-6 text-center text-sm text-slate-400">—</p>
        )}
        {journeys.map((j) => (
          <JourneyCard key={j.id} journey={j} onClick={() => setSelected(j)} />
        ))}
      </div>
    </div>
  );
}
