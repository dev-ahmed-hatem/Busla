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
  type Journey,
  type JourneyLog,
  type JourneyLogKpi,
  type OptimizeParams,
  type Paginated,
  type Period,
  type ParentRequestDetail,
  type ParentRequestItem,
  type QueryParams,
  type Route,
  type RouteReadiness,
  type ShiftBoard,
  type Substitute,
  type TripDetail,
  type TripNotif,
  type TripOverview,
  type UnreadCount,
} from "./resources";

/** Active journeys, polled every 7s for a live feel (no WebSockets). */
export function useLiveJourneys() {
  const token = useSession((s) => s.accessToken);
  return useQuery<Journey[]>({
    queryKey: ["trips", "live"],
    queryFn: () => apiGet<Journey[]>("/api/v1/trips/live/"),
    enabled: !!token,
    refetchInterval: 7000,
  });
}

export function useTrip(id: string | null) {
  const token = useSession((s) => s.accessToken);
  return useQuery<TripDetail>({
    queryKey: ["trips", id],
    queryFn: () => apiGet<TripDetail>(`/api/v1/trips/${id}/`),
    enabled: !!token && !!id,
  });
}

export function useJourneyLogs(params: QueryParams = {}) {
  return useList<JourneyLog>(["trip-logs", params], "/api/v1/trips/logs/", params);
}

export function useJourneyLogSummary() {
  const token = useSession((s) => s.accessToken);
  return useQuery<JourneyLogKpi[]>({
    queryKey: ["trip-logs", "summary"],
    queryFn: () => apiGet<JourneyLogKpi[]>("/api/v1/trips/logs-summary/"),
    enabled: !!token,
  });
}

/** Dashboard trip widgets (donut / action-required / map pins), polled for liveness.
 * `period` scopes the status donut (map + actions always reflect today). */
export function useTripOverview(period: Period = "today") {
  const token = useSession((s) => s.accessToken);
  return useQuery<TripOverview>({
    queryKey: ["trips", "overview", period],
    queryFn: () => apiGet<TripOverview>(`/api/v1/trips/overview/?period=${period}`),
    enabled: !!token,
    refetchInterval: 7000,
  });
}

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

// --- Notifications (Phase 5), polled every 7s for a live feel ---

/** Persistent notification feed (Trips tab). */
export function useNotifications() {
  const token = useSession((s) => s.accessToken);
  return useQuery<TripNotif[]>({
    queryKey: ["notifications"],
    queryFn: () => apiGet<TripNotif[]>("/api/v1/notifications/"),
    enabled: !!token,
    refetchInterval: 7000,
  });
}

/** Unread count for the header bell badge. */
export function useUnreadCount() {
  const token = useSession((s) => s.accessToken);
  return useQuery<UnreadCount>({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => apiGet<UnreadCount>("/api/v1/notifications/unread-count/"),
    enabled: !!token,
    refetchInterval: 7000,
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiCreate("/api/v1/notifications/read-all/", {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

/** Today's driver shift-readiness board. */
export function useShiftReadiness() {
  const token = useSession((s) => s.accessToken);
  return useQuery<ShiftBoard>({
    queryKey: ["shift-readiness"],
    queryFn: () => apiGet<ShiftBoard>("/api/v1/shift-readiness/"),
    enabled: !!token,
    refetchInterval: 7000,
  });
}

/** Available active drivers for substitution (fetched on demand). */
export function useSubstitutes(enabled: boolean) {
  const token = useSession((s) => s.accessToken);
  return useQuery<Substitute[]>({
    queryKey: ["shift-readiness", "substitutes"],
    queryFn: () => apiGet<Substitute[]>("/api/v1/shift-readiness/substitutes/"),
    enabled: !!token && enabled,
  });
}

export function useRemindDriver() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiCreate(`/api/v1/shift-readiness/${id}/remind/`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

/** Parent change-requests (Parent Requests tab). */
export function useParentRequests(params: QueryParams = {}) {
  return useList<ParentRequestItem>(["parent-requests", params], "/api/v1/requests/", params);
}

export function useParentRequest(id: string | null) {
  const token = useSession((s) => s.accessToken);
  return useQuery<ParentRequestDetail>({
    queryKey: ["parent-requests", id],
    queryFn: () => apiGet<ParentRequestDetail>(`/api/v1/requests/${id}/`),
    enabled: !!token && !!id,
  });
}

/** Approve a request (applies the pickup change + reassigns the bus) or reject it. */
export function useResolveRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: "approve" | "reject" }) =>
      apiCreate(`/api/v1/requests/${id}/${action}/`, {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["parent-requests"] });
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
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
