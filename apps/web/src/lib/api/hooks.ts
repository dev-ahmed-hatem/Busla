"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useSession } from "@/lib/auth/session";

import {
  apiCreate,
  apiDelete,
  apiList,
  apiPatch,
  type Paginated,
  type QueryParams,
} from "./resources";

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
