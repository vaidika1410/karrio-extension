import type { ReactNode } from "react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="app-shell-gradient flex min-h-screen">
        <Sidebar />

        <main className="min-w-0 flex-1 overflow-auto">{children}</main>

        <MobileNav />
      </div>
    </ProtectedRoute>
  );
}
