"use client";

import { useSession } from "@/lib/auth/session";
import { silentRefresh } from "@/lib/auth/silent-refresh";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * Untyped fetch against the Django API with the in-memory bearer token and a single
 * 401 → silent-refresh → retry. Used for endpoints not yet in the generated client
 * (e.g. /auth/me/); typed calls go through lib/api/client.ts instead.
 */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const withAuth = (token: string | null): RequestInit => ({
    ...init,
    headers: {
      ...(init.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  let token = useSession.getState().accessToken;
  let res = await fetch(`${API_URL}${path}`, withAuth(token));

  if (res.status === 401) {
    token = await silentRefresh();
    if (!token) return res;
    res = await fetch(`${API_URL}${path}`, withAuth(token));
  }

  return res;
}
