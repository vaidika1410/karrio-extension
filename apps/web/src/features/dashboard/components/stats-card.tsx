import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const accentStyles = {
  default: "bg-primary/10 text-primary",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  muted: "bg-muted text-muted-foreground",
  danger: "bg-red-500/10 text-red-600 dark:text-red-400",
} as const;

export function StatsCard({
  title,
  value,
  icon: Icon,
  accent = "default",
}: {
  title: string;
  value: number;
  icon?: LucideIcon;
  accent?: keyof typeof accentStyles;
}) {
  return (
    <Card className="border-border/60 bg-card/80 shadow-[var(--shadow-soft)] backdrop-blur-sm transition-shadow hover:shadow-md">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-semibold tracking-tight tabular-nums">
            {value}
          </p>
        </div>
        {Icon ? (
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl",
              accentStyles[accent],
            )}
          >
            <Icon className="size-5" strokeWidth={1.75} />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
