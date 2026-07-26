import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { REFRESH_COOKIE, djangoPost } from "@/lib/auth/bff";

/** POST → blacklist the refresh token server-side and clear the cookie. Always succeeds locally. */
export async function POST() {
  const store = await cookies();
  const refresh = store.get(REFRESH_COOKIE)?.value;

  if (refresh) {
    await djangoPost("/api/v1/auth/logout/", { refresh }).catch(() => undefined);
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.delete(REFRESH_COOKIE);
  return res;
}
