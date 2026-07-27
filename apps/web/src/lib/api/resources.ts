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
