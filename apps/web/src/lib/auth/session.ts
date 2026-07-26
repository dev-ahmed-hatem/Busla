"use client";

import { create } from "zustand";

/**
 * Minimal auth/session store. Phase 1 wires real JWT login + httpOnly refresh cookie;
 * for Phase 0 this just holds an in-memory access token for the API client.
 */
interface SessionState {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  clear: () => void;
}

export const useSession = create<SessionState>((set) => ({
  accessToken: null,
  setAccessToken: (accessToken) => set({ accessToken }),
  clear: () => set({ accessToken: null }),
}));
