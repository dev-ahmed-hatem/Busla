/**
 * Server-only helpers for the auth BFF route handlers. The refresh token lives in
 * an httpOnly cookie the browser never reads; the access token is returned to the
 * client and kept in memory (see lib/auth/session.ts).
 */

/** Django origin reachable from the Next server. Falls back to the public URL, then localhost. */
export const API_INTERNAL_URL =
  process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const REFRESH_COOKIE = "busla_refresh";

/** Cookie options for the refresh token. Lifetime mirrors JWT_REFRESH_TTL_DAYS (30d). */
export function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  };
}

/** POST JSON to a Django auth endpoint; returns the raw upstream Response. */
export function djangoPost(path: string, body: unknown): Promise<Response> {
  return fetch(`${API_INTERNAL_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
}
