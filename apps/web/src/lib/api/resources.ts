"use client";

import { apiFetch } from "./fetch";

/** DRF PageNumberPagination envelope. */
export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Bus {
  id: string;
  bus_number: string;
  license_plate: string;
  model_name: string;
  capacity: number;
  odometer_km: number;
  status: string;
  breakdown_reason: string;
  last_maintenance_at: string | null;
  driver_name: string | null;
  route_name: string | null;
}

export interface Guardian {
  id: string;
  student: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  is_primary: boolean;
}

export interface Student {
  id: string;
  full_name: string;
  date_of_birth: string | null;
  grade: string;
  class_name: string;
  area: string;
  address: string;
  phone: string;
  bus: string | null;
  bus_number: string | null;
  route: string | null;
  route_name: string | null;
  status: string;
  guardians: Guardian[];
}

export interface Driver {
  id: string;
  full_name: string;
  phone: string;
  national_id: string;
  license_number: string;
  license_expiry: string | null;
  experience_years: number | null;
  area: string;
  bus: string | null;
  bus_number: string | null;
  status: string;
}

export interface Supervisor {
  id: string;
  full_name: string;
  phone: string;
  national_id: string;
  area: string;
  address: string;
  bus: string | null;
  bus_number: string | null;
  status: string;
}

export type JourneyStatus = "On-time" | "Delayed" | "Broken down" | "Off-route";

/** Maps a live status to its `liveTracking.status.*` i18n key. */
export const JOURNEY_STATUS_KEY: Record<string, string> = {
  "On-time": "onTime",
  Delayed: "delayed",
  "Broken down": "brokenDown",
  "Off-route": "offRoute",
};

export interface Journey {
  id: string;
  bus: string;
  status: string;
  headingLabel: string;
  destination: string;
  occupied: number;
  capacity: number;
  minutes: number;
  kmDone: number;
  kmTotal: number;
  driver: string;
  nanny: string;
  latitude: number | null;
  longitude: number | null;
}

export interface TimelineStop {
  status: "completed" | "current" | "upcoming";
  title: string;
  address: string;
  time: string;
}

export interface TripDetail extends Journey {
  from: string;
  to: string;
  departure: string;
  stops: number;
  arrival: string;
  timeline: TimelineStop[];
}

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
  status: string;
  statusLabel: string;
}

export interface JourneyLogKpi {
  key: string;
  title: string;
  value: number;
  sub: string;
  tone: "onTime" | "delayed" | "issue";
  spark: number[];
}

export interface TripSegment {
  key: string;
  label: string;
  value: number;
  percent: number;
  tone: "onTime" | "info" | "delayed" | "issue";
}

export interface ActionItem {
  id: string;
  kind: "breakdown" | "off_route" | "delayed" | "absent" | "request";
  title: string;
  subtitle: string;
  minsAgo: number;
}

export interface LiveMapPin {
  bus: string;
  status: string;
  latitude: number | null;
  longitude: number | null;
}

export interface TripOverview {
  trip_segments: TripSegment[];
  action_required: ActionItem[];
  map_pins: LiveMapPin[];
  school: { latitude: number | null; longitude: number | null } | null;
}

/** Period selector for the dashboard trips-status donut. */
export type Period = "today" | "week" | "month";

export interface RouteStop {
  id: string;
  sequence: number;
  kind: string;
  student: string | null;
  student_name: string | null;
  label: string;
  latitude: number | null;
  longitude: number | null;
  eta: string | null;
}

export interface Route {
  id: string;
  code: string;
  name: string;
  shift: string;
  area: string;
  bus: string | null;
  bus_number: string | null;
  driver: string | null;
  driver_name: string | null;
  supervisor: string | null;
  supervisor_name: string | null;
  status: string;
  distance_km: number;
  duration_min: number;
  student_count: number;
  capacity: number | null;
  stops: RouteStop[];
}

export interface RouteReadiness {
  students_ready: number;
  routes_count: number;
}

export interface OptimizeParams {
  num_buses: number;
  seats_per_bus: number;
  shift?: string;
  multi_shift?: boolean;
  arrival_deadline?: string | null;
}

export interface Kpi {
  total: number;
  active: number;
  inactive: number;
  utilization: number;
}

export interface CapacityRow {
  bus: string;
  route: string | null;
  capacity: number;
  occupied: number;
  available: number;
}

export interface DashboardStats {
  buses: Kpi;
  drivers: Kpi;
  supervisors: Kpi;
  students: Kpi;
  bus_capacity: CapacityRow[];
}

// KPI-card presentational types (the API returns raw Kpi counts; the dashboard
// KpiRow maps them into these labelled cards).
export type KpiKey = "buses" | "drivers" | "supervisors" | "students";

export interface KpiSubMetric {
  label: string;
  value: number;
  tone: "good" | "bad";
}

export interface KpiCardData {
  key: KpiKey;
  total: number;
  subs: KpiSubMetric[];
  /** Utilisation/health percentage shown on the mini bar. */
  percent: number;
}

// --- Notifications (Phase 5) ---

export type NotifGroup = "today" | "yesterday" | "earlier";

export type TripNotifKind =
  | "breakdown"
  | "off_route"
  | "trip_started"
  | "delay"
  | "completed"
  | "parent_request"
  | "reminder"
  | "info";

export interface TripNotif {
  id: string;
  kind: TripNotifKind;
  title: string;
  subtitle: string;
  time: string;
  group: NotifGroup;
  is_read: boolean;
}

export interface UnreadCount {
  count: number;
}

export interface ParentRequestItem {
  id: string;
  name: string;
  zone: string;
  reason: string;
  time: string;
  group: NotifGroup;
  is_read: boolean;
  status: string;
}

export interface ParentRequestDetail {
  id: string;
  date: string;
  current: { address: string; route: string; tag: string };
  requested: { address: string; status: string };
  suggestion: { text: string; bus: string; seatsLeft: number; percent: number };
  status: string;
}

export type CheckInState = "no_response" | "pending" | "checked_in";

export interface DriverCheckin {
  id: string;
  name: string;
  bus: string;
  state: CheckInState;
  detail: string;
}

export interface ShiftBoard {
  summary: { time: string; checkedIn: number; total: number };
  checkins: DriverCheckin[];
}

export interface Substitute {
  id: string;
  name: string;
  bus: string | null;
}

export type QueryParams = Record<string, string | number | undefined>;

function toQuery(params: QueryParams): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") sp.set(key, String(value));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

async function unwrapError(res: Response): Promise<Error> {
  const body = await res.json().catch(() => null);
  const detail =
    body && typeof body === "object"
      ? Object.entries(body)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
          .join("; ")
      : `Request failed (${res.status})`;
  return new Error(detail);
}

export async function apiList<T>(path: string, params: QueryParams = {}): Promise<Paginated<T>> {
  const res = await apiFetch(`${path}${toQuery(params)}`);
  if (!res.ok) throw await unwrapError(res);
  return res.json() as Promise<Paginated<T>>;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await apiFetch(path);
  if (!res.ok) throw await unwrapError(res);
  return res.json() as Promise<T>;
}

export async function apiCreate<T>(path: string, body: unknown): Promise<T> {
  const res = await apiFetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await unwrapError(res);
  return res.json() as Promise<T>;
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const res = await apiFetch(path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await unwrapError(res);
  return res.json() as Promise<T>;
}

export async function apiDelete(path: string): Promise<void> {
  const res = await apiFetch(path, { method: "DELETE" });
  if (!res.ok && res.status !== 204) throw await unwrapError(res);
}

export const PAGE_SIZE = 25;
