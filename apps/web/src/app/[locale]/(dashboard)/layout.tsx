import { Sidebar } from "@/components/chrome/sidebar";
import { TopBar } from "@/components/chrome/topbar";

import { AuthGuard } from "./_components/auth-guard";

/**
 * Authenticated dashboard chrome — every module renders inside here.
 * AuthGuard silently refreshes on mount and redirects to /login when unauthenticated.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <TopBar />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
