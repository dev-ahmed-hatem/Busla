import { Sidebar } from "@/components/chrome/sidebar";
import { TopBar } from "@/components/chrome/topbar";

/**
 * Authenticated dashboard chrome — every module renders inside here.
 * Phase 1 adds the auth guard (redirect to /login when unauthenticated).
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
