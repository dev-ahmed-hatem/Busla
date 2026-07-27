"use client";

import { TONE_VAR, toneFor } from "@busla/ui";
import { Maximize2, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card, CardHeader } from "@/components/ui/card";
import { useTripOverview } from "@/lib/api/hooks";
import type { LiveMapPin } from "@/lib/api/resources";

/** Live fleet map (Screenshot 364). Real Google Maps tiles land later; for now the bus
 * pins are placed by normalizing their lat/lng into this placeholder panel. */
function toPins(mapPins: LiveMapPin[]) {
  const pts = mapPins.filter(
    (p): p is LiveMapPin & { latitude: number; longitude: number } =>
      p.latitude != null && p.longitude != null,
  );
  if (pts.length === 0) return [];
  const lats = pts.map((p) => p.latitude);
  const lngs = pts.map((p) => p.longitude);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const frac = (v: number, min: number, max: number) => (max === min ? 0.5 : (v - min) / (max - min));
  return pts.map((p, i) => ({
    key: `${p.bus}-${i}`,
    tone: toneFor(p.status),
    left: `${12 + frac(p.longitude, minLng, maxLng) * 76}%`,
    top: `${12 + (1 - frac(p.latitude, minLat, maxLat)) * 76}%`,
  }));
}

export function MainMap() {
  const t = useTranslations("dashboard");
  const { data } = useTripOverview();
  const pins = toPins(data?.map_pins ?? []);

  return (
    <Card>
      <CardHeader
        title={t("mainMap")}
        action={
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            {t("openFullMap")}
          </button>
        }
      />
      <div
        className="relative h-72 w-full overflow-hidden rounded-md border border-border"
        style={{ background: "linear-gradient(135deg, #eef2f7 0%, #e7edf3 40%, #edf1f6 100%)" }}
        aria-label={t("mainMap")}
      >
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(#dbe3ec 1px, transparent 1px), linear-gradient(90deg, #dbe3ec 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {pins.map((pin) => (
          <MapPin
            key={pin.key}
            className="absolute h-7 w-7 -translate-x-1/2 -translate-y-full drop-shadow"
            style={{ top: pin.top, left: pin.left, color: TONE_VAR[pin.tone], fill: TONE_VAR[pin.tone] }}
          />
        ))}
      </div>
    </Card>
  );
}
