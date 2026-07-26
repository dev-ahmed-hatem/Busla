"use client";

import { create } from "zustand";

import type { AuthUser } from "./types";

/**
 * In-memory auth session: the access token (never persisted) plus the current user.
 * The refresh token lives only in an httpOnly cookie managed by the BFF routes.
 */
interface SessionState {
  accessToken: string | null;
  user: AuthUser | null;
  setSession: (session: { accessToken: string; user: AuthUser }) => void;
  /** Update just the access token after a silent refresh (user unchanged). */
  setAccessToken: (token: string | null) => void;
  clear: () => void;
}

export const useSession = create<SessionState>((set) => ({
  accessToken: null,
  user: null,
  setSession: ({ accessToken, user }) => set({ accessToken, user }),
  setAccessToken: (accessToken) => set({ accessToken }),
  clear: () => set({ accessToken: null, user: null }),
}));
