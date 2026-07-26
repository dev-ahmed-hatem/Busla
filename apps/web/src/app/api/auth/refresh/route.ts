import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { REFRESH_COOKIE, djangoPost, refreshCookieOptions } from "@/lib/auth/bff";

/** POST → read the refresh cookie, ask Django for a new access token (rotating), reset the cookie. */
export async function POST() {
  const store = await cookies();
  const refresh = store.get(REFRESH_COOKIE)?.value;

  if (!refresh) {
    return NextResponse.json({ detail: "No session" }, { status: 401 });
  }

  const upstream = await djangoPost("/api/v1/auth/refresh/", { refresh });
  const data = await upstream.json().catch(() => ({}));

  if (!upstream.ok) {
    const res = NextResponse.json({ detail: "Session expired" }, { status: 401 });
    res.cookies.delete(REFRESH_COOKIE);
    return res;
  }

  const res = NextResponse.json({ access: data.access });
  // ROTATE_REFRESH_TOKENS is on server-side, so a fresh refresh comes back each time.
  if (data.refresh) {
    res.cookies.set(REFRESH_COOKIE, data.refresh, refreshCookieOptions());
  }
  return res;
}
