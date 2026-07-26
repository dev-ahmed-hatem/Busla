"use client";

import { createBuslaClient } from "@busla/api-client-ts";

import { useSession } from "@/lib/auth/session";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/** Singleton typed API client; pulls the current access token from the session store. */
export const api = createBuslaClient({
  baseUrl,
  getToken: () => useSession.getState().accessToken,
});
