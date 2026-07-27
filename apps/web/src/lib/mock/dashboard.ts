/**
 * Mock data for the Dashboard overview (Screenshot 364). Mirrors the design numbers.
 * Replaced by real API calls in Phase 2–4 (buses/drivers/students/trips modules).
 */

export type KpiKey = "buses" | "drivers" | "supervisors" | "students";

export interface KpiSubMetric {
  label: string;
  value: number;
  tone: "good" | "bad";
}

export interface KpiCard {
  key: KpiKey;
  total: number;
  subs: KpiSubMetric[];
  /** Utilisation/health percentage shown on the mini bar. */
  percent: number;
}

export const KPI_CARDS: KpiCard[] = [
  {
    key: "buses",
    total: 20,
    subs: [
      { label: "Active Now", value: 19, tone: "good" },
      { label: "Out of Service", value: 1, tone: "bad" },
    ],
    percent: 76.7,
  },
  {
    key: "drivers",
    total: 24,
    subs: [
      { label: "Available", value: 20, tone: "good" },
      { label: "Unavailable", value: 4, tone: "bad" },
    ],
    percent: 91,
  },
  {
    key: "supervisors",
    total: 24,
    subs: [
      { label: "On Trips", value: 19, tone: "good" },
      { label: "Unavailable", value: 5, tone: "bad" },
    ],
    percent: 95,
  },
  {
    key: "students",
    total: 625,
    subs: [
      { label: "Scheduled Today", value: 600, tone: "good" },
      { label: "Unscheduled", value: 25, tone: "bad" },
    ],
    percent: 85,
  },
];

export type ActionKind = "breakdown" | "off_route" | "absent" | "request";

export interface ActionItem {
  id: string;
  kind: ActionKind;
  title: string;
  subtitle: string;
  minsAgo: number;
}

export const ACTION_ITEMS: ActionItem[] = [
  {
    id: "a1",
    kind: "breakdown",
    title: "Bus 12 – Breakdown",
    subtitle: "Engine failure – Trip is currently stopped",
    minsAgo: 10,
  },
  {
    id: "a2",
    kind: "off_route",
    title: "Bus 45 – Off Route",
    subtitle: "Bus 45 deviated from route by 1.2 KM",
    minsAgo: 12,
  },
  {
    id: "a3",
    kind: "absent",
    title: "Driver Mohamed Ali – Absent",
    subtitle: "Morning trip has not started",
    minsAgo: 20,
  },
  {
    id: "a4",
    kind: "request",
    title: "Pickup Change Request",
    subtitle: "Requested to change pickup location",
    minsAgo: 30,
  },
];

export const ACTION_REQUIRED_COUNT = 12;

export interface TripSegment {
  key: "completed" | "in_progress" | "delayed" | "issues";
  label: string;
  value: number;
  percent: number;
  /** Maps to @busla/ui StatusTone via TONE_VAR. */
  tone: "onTime" | "info" | "delayed" | "issue";
}

export const TRIPS_TOTAL = 24;

export const TRIP_SEGMENTS: TripSegment[] = [
  { key: "completed", label: "Completed", value: 18, percent: 75, tone: "onTime" },
  { key: "in_progress", label: "In progress", value: 3, percent: 12.5, tone: "info" },
  { key: "delayed", label: "Delayed", value: 2, percent: 8.3, tone: "delayed" },
  { key: "issues", label: "Issues", value: 1, percent: 4.2, tone: "issue" },
];

export interface CapacityRow {
  bus: string;
  route: string;
  capacity: number;
  occupied: number;
  available: number;
}

export const CAPACITY_ROWS: CapacityRow[] = [
  { bus: "Bus 1", route: "Route 1", capacity: 50, occupied: 44, available: 6 },
  { bus: "Bus 2", route: "Route 2", capacity: 50, occupied: 20, available: 30 },
  { bus: "Bus 3", route: "Route 3", capacity: 50, occupied: 32, available: 18 },
  { bus: "Bus 4", route: "Route 4", capacity: 25, occupied: 14, available: 11 },
  { bus: "Bus 5", route: "Route 5", capacity: 25, occupied: 9, available: 16 },
];
