"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useSession } from "@/lib/auth/session";

import {
  apiCreate,
  apiDelete,
  apiGet,
  apiList,
  apiPatch,
  type DashboardStats,
  type OptimizeParams,
  type Paginated,
  type QueryParams,
  type Route,
  type RouteReadiness,
} from "./resources";

/** Route Planning readiness (student/route counts for the empty state). */
export function useRouteReadiness() {
  const token = useSession((s) => s.accessToken);
  return useQuery<RouteReadiness>({
    queryKey: ["route-readiness"],
    queryFn: () => apiGet<RouteReadiness>("/api/v1/routes/readiness/"),
    enabled: !!token,
  });
}

/** Run the optimizer; refreshes routes, readiness, and dashboard stats. */
export function useOptimize() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: OptimizeParams) => apiCreate<Route[]>("/api/v1/routes/optimize/", params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["routes"] });
      qc.invalidateQueries({ queryKey: ["route-readiness"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

/** Dashboard aggregate stats (KPIs + bus capacity). */
export function useDashboardStats() {
  const token = useSession((s) => s.accessToken);
  return useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: () => apiGet<DashboardStats>("/api/v1/dashboard/stats/"),
    enabled: !!token,
  });
}

/** Paginated list query, disabled until authenticated; keeps previous page while fetching. */
export function useList<T>(key: unknown[], path: string, params: QueryParams = {}) {
  const token = useSession((s) => s.accessToken);
  return useQuery<Paginated<T>>({
    queryKey: key,
    queryFn: () => apiList<T>(path, params),
    enabled: !!token,
    placeholderData: (prev) => prev,
  });
}

export function useCreate<T>(invalidateKey: unknown[], path: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: unknown) => apiCreate<T>(path, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: invalidateKey }),
  });
}

/** Partial-update mutation; pass `{ path, body }`. */
export function useUpdate<T>(invalidateKey: unknown[]) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ path, body }: { path: string; body: unknown }) => apiPatch<T>(path, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: invalidateKey }),
  });
}

/** Delete mutation; pass the full resource path (e.g. `/api/v1/buses/<id>/`). */
export function useDelete(invalidateKey: unknown[]) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (path: string) => apiDelete(path),
    onSuccess: () => qc.invalidateQueries({ queryKey: invalidateKey }),
  });
}
