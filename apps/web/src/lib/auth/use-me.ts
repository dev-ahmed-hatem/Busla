"use client";

import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api/fetch";

import { useSession } from "./session";
import type { AuthUser } from "./types";

/**
 * Fetches the current user from /auth/me/ once a token is present and mirrors it into
 * the session store (so the top bar and guards can read it synchronously).
 */
export function useMe() {
  const accessToken = useSession((s) => s.accessToken);

  return useQuery({
    queryKey: ["me"],
    enabled: !!accessToken,
    queryFn: async (): Promise<AuthUser> => {
      const res = await apiFetch("/api/v1/auth/me/");
      if (!res.ok) throw new Error("Failed to load current user");
      const user = (await res.json()) as AuthUser;
      const token = useSession.getState().accessToken;
      if (token) useSession.getState().setSession({ accessToken: token, user });
      return user;
    },
  });
}
