"use client";

import { createBuslaClient } from "@busla/api-client-ts";

import { useSession } from "@/lib/auth/session";
import { silentRefresh } from "@/lib/auth/silent-refresh";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * Singleton typed API client. Injects the in-memory access token per request and,
 * on a 401, silently refreshes once and retries.
 */
export const api = createBuslaClient({
  baseUrl,
  getToken: () => useSession.getState().accessToken,
  onUnauthorized: () => silentRefresh(),
});
