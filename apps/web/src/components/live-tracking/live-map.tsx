import { TONE_VAR, toneFor } from "@busla/ui";
import { Bus, ChevronDown, Minus, Plus } from "lucide-react";

import { MAP_PINS, ZONES, type JourneyStatus } from "@/lib/mock/live-tracking";

const LEGEND: JourneyStatus[] = ["On-time", "Delayed", "Broken down", "Off-route"];

/** Placeholder fleet map (real Google Maps lands later). Shows status legend + bus pins. */
export function LiveMap() {
  return (
    <div
      className="relative h-[560px] w-full overflow-hidden rounded-card border border-border"
      style={{ background: "linear-gradient(135deg, #eef2f7 0%, #e7edf3 45%, #edf1f6 100%)" }}
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(#dbe3ec 1px, transparent 1px), linear-gradient(90deg, #dbe3ec 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />

      {/* legend */}
      <div className="absolute start-4 top-4 flex flex-wrap gap-2">
        {LEGEND.map((s) => (
          <span
            key={s}
            className="flex items-center gap-1.5 rounded-pill bg-surface px-2.5 py-1 text-xs font-medium text-slate-600 shadow-sm"
          >
            <span className="h-2 w-2 rounded-full" style={{ background: TONE_VAR[toneFor(s)] }} />
            {s}
          </span>
        ))}
      </div>

      {/* zone filter */}
      <button
        type="button"
        className="absolute end-4 top-4 flex items-center gap-1.5 rounded-md bg-surface px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm"
      >
        {ZONES[0]}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {/* pins */}
      {MAP_PINS.map((pin) => {
        const color = TONE_VAR[toneFor(pin.status)];
        return (
          <div
            key={pin.bus}
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{ top: pin.top, left: pin.left }}
          >
            <span
              className="flex items-center gap-1 rounded-pill px-2 py-1 text-xs font-semibold text-white shadow"
              style={{ background: color }}
            >
              <Bus className="h-3.5 w-3.5" />
              {pin.bus}
            </span>
          </div>
        );
      })}

      {/* zoom */}
      <div className="absolute end-4 bottom-4 flex flex-col overflow-hidden rounded-md bg-surface shadow-sm">
        <button type="button" aria-label="Zoom in" className="grid h-8 w-8 place-items-center hover:bg-slate-100">
          <Plus className="h-4 w-4 text-slate-600" />
        </button>
        <button type="button" aria-label="Zoom out" className="grid h-8 w-8 place-items-center border-t border-border hover:bg-slate-100">
          <Minus className="h-4 w-4 text-slate-600" />
        </button>
      </div>
    </div>
  );
}
