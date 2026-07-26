"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { PillTabs } from "@/components/ui/tabs";

import { JourneyLogs } from "./journey-logs";
import { LiveJourneysPanel } from "./live-journeys-panel";
import { LiveMap } from "./live-map";

export function LiveTrackingView() {
  const t = useTranslations("liveTracking");
  const [mode, setMode] = useState("map");

  return (
    <div>
      <PillTabs
        items={[
          { key: "map", label: t("map") },
          { key: "logs", label: t("journeyLogs") },
        ]}
        value={mode}
        onValueChange={setMode}
        className="mb-4"
      />

      {mode === "map" ? (
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="lg:flex-1">
            <LiveMap />
          </div>
          <Card className="h-[560px] w-full overflow-hidden lg:w-96">
            <LiveJourneysPanel />
          </Card>
        </div>
      ) : (
        <JourneyLogs />
      )}
    </div>
  );
}
