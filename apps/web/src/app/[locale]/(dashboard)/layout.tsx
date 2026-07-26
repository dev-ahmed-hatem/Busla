import { AppHeader } from "@/components/chrome/app-header";
import { Sidebar } from "@/components/chrome/sidebar";

import { AuthGuard } from "./_components/auth-guard";

/**
 * Authenticated admin shell: full-width header on top, sidebar + scrolling content below.
 * AuthGuard silently refreshes on mount and redirects to /login when unauthenticated.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen flex-col bg-background">
        <AppHeader />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
