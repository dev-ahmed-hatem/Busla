/**
 * Mock data for Buses Management (Screenshots 384–390). Row data is English/Arabic plates
 * mirroring the design; table chrome is localised.
 */

export type BusStatus = "In Service" | "Maintenance" | "Issue";

export interface BusRow {
  id: string;
  series: number;
  busNum: string;
  license: string;
  route: string;
  lastMaintenance: string;
  status: BusStatus;
  breakdown: string;
}

export const BUSES: BusRow[] = [
  { id: "b1", series: 1, busNum: "Bus 05", license: "أ ب د 234", route: "Al Narges", lastMaintenance: "Tue . 12 Dec 2026", status: "Maintenance", breakdown: "Engine" },
  { id: "b2", series: 2, busNum: "Bus 06", license: "أ ب د 235", route: "Al Narges", lastMaintenance: "Tue . 12 Dec 2026", status: "In Service", breakdown: "" },
  { id: "b3", series: 3, busNum: "Bus 07", license: "أ ب د 236", route: "Al Narges", lastMaintenance: "Tue . 12 Dec 2026", status: "In Service", breakdown: "" },
  { id: "b4", series: 4, busNum: "Bus 08", license: "أ ب د 237", route: "Al Narges", lastMaintenance: "Tue . 12 Dec 2026", status: "Issue", breakdown: "Electrical" },
  { id: "b5", series: 5, busNum: "Bus 09", license: "أ ب د 238", route: "Al Narges", lastMaintenance: "Tue . 12 Dec 2026", status: "Maintenance", breakdown: "Suspension" },
  { id: "b6", series: 6, busNum: "Bus 10", license: "أ ب د 239", route: "Al Narges", lastMaintenance: "Tue . 12 Dec 2026", status: "In Service", breakdown: "" },
];

export type BusFilter = "all" | "In Service" | "Maintenance" | "Issue";

// --- Bus profile (for the profile modal, Screenshots 388–390) --------------

export interface HealthMeter {
  label: string;
  percent: number;
  tone: "issue" | "delayed" | "onTime";
}

export interface BusProfile {
  name: string;
  status: BusStatus;
  openMaintenance: number;
  info: { driver: string; model: string; plate: string; capacity: string };
  route: { route: string; odometer: string };
  maintenance: { breakdown: string; last: string; oil: HealthMeter; tire: HealthMeter };
}

export const BUS_PROFILE: BusProfile = {
  name: "Bus 05",
  status: "Maintenance",
  openMaintenance: 1,
  info: { driver: "Mohamed Ali", model: "######", plate: "أ ب د 234", capacity: "25 student" },
  route: { route: "Al Narges", odometer: "350 km" },
  maintenance: {
    breakdown: "Engine Failure",
    last: "Currently in maintenance",
    oil: { label: "5,120 / 5,000 KM · Critical", percent: 100, tone: "issue" },
    tire: { label: "95,000 / 100,000 KM · Soon", percent: 90, tone: "delayed" },
  },
};
