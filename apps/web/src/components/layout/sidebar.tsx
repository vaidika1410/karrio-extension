"use client";

import Link from "next/link";

import {
  Briefcase,
  LayoutDashboard,
  Settings,
  KanbanSquare,
} from "lucide-react";

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 border-r border-border bg-card flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <h1 className="text-xl font-semibold">
          Karrio
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors"
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>

        <Link
          href="/applications"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors"
        >
          <Briefcase className="h-4 w-4" />
          Applications
        </Link>

        <Link
          href="/kanban"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors"
        >
          <KanbanSquare className="h-4 w-4" />
          Kanban
        </Link>

        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </nav>
    </aside>
  );
}