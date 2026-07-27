"use client";

import { TONE_VAR, toneFor } from "@busla/ui";
import { Bus, Maximize2, School } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card, CardHeader } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { useTripOverview } from "@/lib/api/hooks";
import type { LiveMapPin, TripOverview } from "@/lib/api/resources";

type Pt = { latitude: number; longitude: number };

/** Live fleet map (Screenshot 364). Real Google Maps tiles land later; for now the bus
 * pins + school marker are placed by normalizing lat/lng into this placeholder panel. */
function project(overview: TripOverview | undefined) {
  const busPts = (overview?.map_pins ?? []).filter(
    (p): p is LiveMapPin & Pt => p.latitude != null && p.longitude != null,
  );
  const school = overview?.school;
  const schoolPt: Pt | null =
    school && school.latitude != null && school.longitude != null
      ? { latitude: school.latitude, longitude: school.longitude }
      : null;

  // Shared extents across buses + school so everything sits in one coordinate space.
  const all: Pt[] = schoolPt ? [...busPts, schoolPt] : busPts;
  if (all.length === 0) return { buses: [], school: null };

  const lats = all.map((p) => p.latitude);
  const lngs = all.map((p) => p.longitude);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const frac = (v: number, min: number, max: number) => (max === min ? 0.5 : (v - min) / (max - min));
  const place = (p: Pt) => ({
    left: `${12 + frac(p.longitude, minLng, maxLng) * 76}%`,
    top: `${12 + (1 - frac(p.latitude, minLat, maxLat)) * 76}%`,
  });

  return {
    buses: busPts.map((p, i) => ({ key: `${p.bus}-${i}`, tone: toneFor(p.status), ...place(p) })),
    school: schoolPt ? place(schoolPt) : null,
  };
}

export function MainMap() {
  const t = useTranslations("dashboard");
  const { data } = useTripOverview();
  const { buses, school } = project(data);

  return (
    <Card>
      <CardHeader
        title={t("mainMap")}
        action={
          <Link
            href="/live-tracking"
            className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            {t("openFullMap")}
          </Link>
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
        {school && (
          <span
            className="absolute grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-brand-navy text-white shadow"
            style={{ top: school.top, left: school.left }}
            aria-label={t("schoolMarker")}
          >
            <School className="h-4 w-4" />
          </span>
        )}
        {buses.map((pin) => (
          <span
            key={pin.key}
            className="absolute grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white text-white shadow"
            style={{ top: pin.top, left: pin.left, background: TONE_VAR[pin.tone] }}
            aria-label={pin.key}
          >
            <Bus className="h-4 w-4" />
          </span>
        ))}
      </div>
    </Card>
  );
}
