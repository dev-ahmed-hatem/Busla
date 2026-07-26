import { TONE_VAR, type StatusTone } from "@busla/ui";
import { Maximize2, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card, CardHeader } from "@/components/ui/card";

/**
 * Placeholder for the live fleet map (Screenshot 364). Real Google Maps lands with the
 * tracking module; for now it renders a static map-like panel with a few status pins.
 */
const PINS: { top: string; left: string; tone: StatusTone }[] = [
  { top: "22%", left: "18%", tone: "onTime" },
  { top: "40%", left: "55%", tone: "issue" },
  { top: "58%", left: "30%", tone: "onTime" },
  { top: "66%", left: "72%", tone: "delayed" },
  { top: "78%", left: "20%", tone: "onTime" },
];

export function MainMap() {
  const t = useTranslations("dashboard");

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
        style={{
          background:
            "linear-gradient(135deg, #eef2f7 0%, #e7edf3 40%, #edf1f6 100%)",
        }}
        aria-label={t("mainMap")}
      >
        {/* faux street grid */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(#dbe3ec 1px, transparent 1px), linear-gradient(90deg, #dbe3ec 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {PINS.map((pin, i) => (
          <MapPin
            key={i}
            className="absolute h-7 w-7 -translate-x-1/2 -translate-y-full drop-shadow"
            style={{ top: pin.top, left: pin.left, color: TONE_VAR[pin.tone], fill: TONE_VAR[pin.tone] }}
          />
        ))}
      </div>
    </Card>
  );
}
