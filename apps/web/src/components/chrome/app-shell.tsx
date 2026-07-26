"use client";

import { useState } from "react";

import { AppHeader } from "./app-header";
import { Sidebar } from "./sidebar";

/** Admin shell: full-width header + sidebar (static on desktop, slide-in drawer on mobile). */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col bg-background">
      <AppHeader onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
