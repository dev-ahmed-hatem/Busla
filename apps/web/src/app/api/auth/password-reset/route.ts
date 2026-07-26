import { NextResponse } from "next/server";

import { djangoPost } from "@/lib/auth/bff";

/** POST {email} → Django password-reset request. Non-enumerating: always reports success. */
export async function POST(request: Request) {
  const { email } = await request.json().catch(() => ({}));
  await djangoPost("/api/v1/auth/password-reset/", { email }).catch(() => undefined);
  return NextResponse.json({ ok: true });
}
