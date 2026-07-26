import type { AuthUser } from "./types";

/** True if the user holds one of the given roles. Basis for later per-module route gating. */
export function requireRole(user: AuthUser | null, roles: readonly string[]): boolean {
  return !!user && roles.includes(user.user_type);
}
