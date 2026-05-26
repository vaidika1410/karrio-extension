"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Briefcase,
  KanbanSquare,
  LayoutDashboard,
  Settings,
  Sparkles,
} from "lucide-react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { getStoredUser, logout } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    match: (path: string) => path === "/dashboard",
  },
  {
    href: "/applications",
    label: "Applications",
    icon: Briefcase,
    match: (path: string) =>
      path === "/applications" || path.startsWith("/applications/"),
  },
  {
    href: "/kanban",
    label: "Kanban",
    icon: KanbanSquare,
    match: (path: string) => path === "/kanban",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    match: (path: string) => path === "/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const user = getStoredUser();

  return (
    <aside className="hidden w-[17.5rem] shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-6">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Sparkles className="size-4" strokeWidth={2.25} />
        </div>
        <div>
          <p className="text-base font-semibold tracking-tight text-sidebar-foreground">
            Karrio
          </p>
          <p className="text-xs text-muted-foreground">Job search, organized</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        <p className="mb-2 px-3 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>
        {navItems.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <Icon
                className={cn(
                  "size-4",
                  active ? "text-primary" : "opacity-70",
                )}
                strokeWidth={active ? 2.25 : 1.75}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-sidebar-border p-4">
        {user ? (
          <div className="rounded-xl bg-muted/40 px-3 py-2.5">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {user.name || "Your account"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        ) : null}

        <div className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2">
          <span className="text-xs text-muted-foreground">Appearance</span>
          <ThemeToggle />
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground"
          onClick={logout}
        >
          Sign out
        </Button>
      </div>
    </aside>
  );
}
