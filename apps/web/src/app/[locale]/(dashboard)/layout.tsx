import { AppShell } from "@/components/chrome/app-shell";

import { AuthGuard } from "./_components/auth-guard";

/**
 * Authenticated admin shell. AuthGuard silently refreshes on mount and redirects to
 * /login when unauthenticated; AppShell renders the responsive header + sidebar + content.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
