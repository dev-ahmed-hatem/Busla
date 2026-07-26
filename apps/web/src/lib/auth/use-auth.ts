"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useSession } from "./session";
import type { Credentials, LoginResponse } from "./types";

/** Login/logout mutations against the BFF. Login hydrates the session; logout tears it down. */
export function useAuth() {
  const qc = useQueryClient();
  const setSession = useSession((s) => s.setSession);
  const clear = useSession((s) => s.clear);

  const login = useMutation({
    mutationFn: async (credentials: Credentials): Promise<LoginResponse> => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) {
        throw new Error("invalid_credentials");
      }
      return (await res.json()) as LoginResponse;
    },
    onSuccess: ({ access, user }) => {
      setSession({ accessToken: access, user });
      qc.setQueryData(["me"], user);
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    },
    onSettled: () => {
      clear();
      qc.clear();
    },
  });

  return { login, logout };
}
