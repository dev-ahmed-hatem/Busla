import { NextResponse } from "next/server";

import { REFRESH_COOKIE, djangoPost, refreshCookieOptions } from "@/lib/auth/bff";

/** POST {email,password} → Django login; stash refresh in an httpOnly cookie, return {access,user}. */
export async function POST(request: Request) {
  const { email, password } = await request.json().catch(() => ({}));

  const upstream = await djangoPost("/api/v1/auth/login/", { email, password });
  const data = await upstream.json().catch(() => ({}));

  if (!upstream.ok) {
    return NextResponse.json(data, { status: upstream.status });
  }

  const { access, refresh, user } = data as {
    access: string;
    refresh: string;
    user: unknown;
  };

  const res = NextResponse.json({ access, user });
  res.cookies.set(REFRESH_COOKIE, refresh, refreshCookieOptions());
  return res;
}
