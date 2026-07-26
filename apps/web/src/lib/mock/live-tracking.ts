/**
 * Mock data for Live Tracking (Screenshots 369–372): active journeys, a bus route
 * timeline, and the Journey Logs table + KPIs. English content mirrors the design.
 */

export type JourneyStatus = "On-time" | "Delayed" | "Broken down" | "Off-route";

export interface Journey {
  id: string;
  bus: string;
  status: JourneyStatus;
  headingLabel: "Heading to" | "Stopped at";
  destination: string;
  occupied: number;
  capacity: number;
  minutes: number;
  kmDone: number;
  kmTotal: number;
  driver: string;
  nanny: string;
}

export const LIVE_JOURNEYS_COUNT = 8;

export const JOURNEYS: Journey[] = [
  { id: "j1", bus: "Bus 05", status: "On-time", headingLabel: "Heading to", destination: "Narjas District", occupied: 4, capacity: 25, minutes: 30, kmDone: 3, kmTotal: 30, driver: "Samy Ahmed", nanny: "Abeer sayed" },
  { id: "j2", bus: "Bus 06", status: "Delayed", headingLabel: "Heading to", destination: "Shorouk city", occupied: 18, capacity: 25, minutes: 12, kmDone: 15, kmTotal: 30, driver: "Tarek Youssef", nanny: "Dina Farouk" },
  { id: "j3", bus: "Bus 07", status: "Broken down", headingLabel: "Stopped at", destination: "Narjas District", occupied: 10, capacity: 25, minutes: 0, kmDone: 8, kmTotal: 30, driver: "Hassan Salah", nanny: "Laila Hamdy" },
  { id: "j4", bus: "Bus 08", status: "On-time", headingLabel: "Heading to", destination: "Fifth Settlement", occupied: 22, capacity: 25, minutes: 20, kmDone: 24, kmTotal: 40, driver: "Omar Nabil", nanny: "Nadia Mostafa" },
  { id: "j5", bus: "Bus 09", status: "Off-route", headingLabel: "Heading to", destination: "Madinaty", occupied: 16, capacity: 25, minutes: 8, kmDone: 12, kmTotal: 35, driver: "Karim Fathy", nanny: "Mona Khalil" },
];

/** Bus markers rendered on the map placeholder. */
export const MAP_PINS: { bus: string; status: JourneyStatus; top: string; left: string }[] = [
  { bus: "Bus 05", status: "On-time", top: "28%", left: "22%" },
  { bus: "Bus 06", status: "Delayed", top: "44%", left: "58%" },
  { bus: "Bus 07", status: "Broken down", top: "62%", left: "34%" },
  { bus: "Bus 08", status: "On-time", top: "70%", left: "72%" },
  { bus: "Bus 09", status: "Off-route", top: "36%", left: "78%" },
];

export const ZONES = ["All Zones", "Madinaty", "Shorouk", "Al-Narjis"];

// --- Bus detail timeline (Screenshot 371) ----------------------------------

export type StopStatus = "completed" | "current" | "upcoming";

export interface TimelineStop {
  status: StopStatus;
  title: string;
  address: string;
  time: string;
}

export interface JourneyDetail {
  from: string;
  to: string;
  departure: string;
  stops: number;
  arrival: string;
  timeline: TimelineStop[];
}

export const JOURNEY_DETAIL: JourneyDetail = {
  from: "Narjas District",
  to: "New Smart School",
  departure: "06:00 AM",
  stops: 4,
  arrival: "07:15 AM",
  timeline: [
    { status: "completed", title: "Starting point - Narjis district", address: "Al-Narjis District - 5 Settlement", time: "06:00 AM" },
    { status: "current", title: "Current Station - Shorouk City", address: "Al Shorouk City - Gate 1", time: "06:25 AM" },
    { status: "upcoming", title: "Next station - Madinaty", address: "The Craft Zone area", time: "06:50 AM" },
    { status: "upcoming", title: "Endpoint - School", address: "New Smart School", time: "07:15 AM" },
  ],
};

// --- Journey Logs (Screenshot 372) -----------------------------------------

export interface JourneyLogKpi {
  key: string;
  title: string;
  value: number;
  sub: string;
  tone: "onTime" | "delayed" | "issue";
  spark: number[];
}

export const JOURNEY_LOG_KPIS: JourneyLogKpi[] = [
  { key: "completed", title: "Completed Trips", value: 18, sub: "75% of total trips", tone: "onTime", spark: [3, 5, 4, 6, 5, 7, 8] },
  { key: "ontime", title: "On time Trips", value: 12, sub: "50% total trips", tone: "onTime", spark: [2, 3, 3, 4, 3, 5, 6] },
  { key: "delayed", title: "Delayed Trips", value: 5, sub: "Avg. delay time +15m", tone: "delayed", spark: [1, 2, 1, 3, 2, 2, 3] },
  { key: "incidents", title: "Incidents", value: 1, sub: "Requires attention", tone: "issue", spark: [0, 1, 0, 0, 1, 0, 1] },
];

export interface JourneyLog {
  id: string;
  bus: string;
  driver: string;
  nanny: string;
  shift: string;
  depSched: string;
  depActual: string;
  arrSched: string;
  arrActual: string;
  status: "On-time" | "Delayed" | "Broken down";
  statusLabel: string;
}

export const JOURNEY_LOGS: JourneyLog[] = [
  { id: "#2583", bus: "Bus 05", driver: "Samy Ahmed", nanny: "Abeer sayed", shift: "Morning", depSched: "06:00", depActual: "06:05", arrSched: "07:30", arrActual: "07:35", status: "Delayed", statusLabel: "Delayed 5m" },
  { id: "#2584", bus: "Bus 06", driver: "Tarek Youssef", nanny: "Dina Farouk", shift: "Morning", depSched: "06:00", depActual: "06:00", arrSched: "07:30", arrActual: "07:30", status: "On-time", statusLabel: "On-time" },
  { id: "#2585", bus: "Bus 07", driver: "Hassan Salah", nanny: "Laila Hamdy", shift: "Afternoon", depSched: "02:15", depActual: "02:15", arrSched: "07:30", arrActual: "07:38", status: "Delayed", statusLabel: "Delayed 8m" },
  { id: "#2586", bus: "Bus 08", driver: "Omar Nabil", nanny: "Nadia Mostafa", shift: "Afternoon", depSched: "02:30", depActual: "02:30", arrSched: "07:30", arrActual: "Terminated 06:45", status: "Broken down", statusLabel: "Broken down" },
  { id: "#2587", bus: "Bus 09", driver: "Karim Fathy", nanny: "Mona Khalil", shift: "Morning", depSched: "05:45", depActual: "05:45", arrSched: "07:30", arrActual: "07:30", status: "On-time", statusLabel: "On-time" },
];
