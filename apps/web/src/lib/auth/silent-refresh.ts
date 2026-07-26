"use client";

import { useSession } from "./session";

let inflight: Promise<string | null> | null = null;

/**
 * Ask the BFF for a fresh access token using the httpOnly refresh cookie.
 * Single-flight: concurrent callers (e.g. several 401s at once) share one request.
 * Returns the new access token, or null when there is no valid session.
 */
export function silentRefresh(): Promise<string | null> {
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });
      if (!res.ok) {
        useSession.getState().clear();
        return null;
      }
      const { access } = (await res.json()) as { access: string };
      useSession.getState().setAccessToken(access);
      return access;
    } catch {
      useSession.getState().clear();
      return null;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}
