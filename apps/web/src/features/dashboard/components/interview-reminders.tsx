"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { differenceInMinutes } from "date-fns";
import { BellRing } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPendingReminders } from "@/services/applications.service";
import { cn } from "@/lib/utils";

export function InterviewReminders() {
  const { data = [] } = useQuery({
    queryKey: ["pending-reminders"],
    queryFn: getPendingReminders,
  });

  const reminders = data.filter((reminder: { remindAt?: string }) => {
    if (!reminder.remindAt) return false;

    const minutesLeft = differenceInMinutes(new Date(reminder.remindAt), new Date());

    return minutesLeft > 0;
  });

  if (!reminders.length) return null;

  return (
    <Card className="border-amber-500/25 bg-amber-500/5 shadow-[var(--shadow-soft)]">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-amber-500/15 pb-4">
        <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
          <BellRing className="size-4" />
        </div>
        <div>
          <CardTitle className="text-lg font-semibold">Reminders</CardTitle>
          <p className="text-sm text-muted-foreground">Upcoming reminders from your applications</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-4">
        {reminders.map(
          (reminder: {
            id: string;
            title: string;
            type: string;
            message?: string;
            remindAt: string;
            application?: {
              id: string;
              company: string;
              role: string;
            };
          }) => {
            const minutesLeft = differenceInMinutes(new Date(reminder.remindAt), new Date());
            const isUrgent = minutesLeft <= 60;
            const applicationId = reminder.application?.id;

            return (
              <Link
                key={reminder.id}
                href={applicationId ? `/applications/${applicationId}` : "/dashboard"}
                className={cn(
                  "flex items-start justify-between gap-4 rounded-xl border p-4 transition-colors",
                  isUrgent
                    ? "border-red-500/30 bg-red-500/10 hover:bg-red-500/15"
                    : "border-amber-500/25 bg-card/80 hover:bg-card",
                )}
              >
                <div className="min-w-0">
                  <p className="font-medium">{reminder.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {reminder.application
                      ? `${reminder.application.company} - ${reminder.application.role}`
                      : reminder.message || "Reminder"}
                  </p>
                  {reminder.message && reminder.application ? (
                    <p className="mt-1 text-xs text-muted-foreground">{reminder.message}</p>
                  ) : null}
                </div>

                <div className="shrink-0 text-right">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      isUrgent
                        ? "text-red-600 dark:text-red-400"
                        : "text-amber-700 dark:text-amber-300",
                    )}
                  >
                    {minutesLeft < 60
                      ? `${minutesLeft}m left`
                      : `${Math.floor(minutesLeft / 60)}h left`}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(reminder.remindAt).toLocaleString()}
                  </p>
                </div>
              </Link>
            );
          },
        )}
      </CardContent>
    </Card>
  );
}
