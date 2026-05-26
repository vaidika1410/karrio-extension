"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { differenceInMinutes } from "date-fns";
import { BellRing } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUpcomingInterviews } from "@/services/applications.service";
import { cn } from "@/lib/utils";

export function InterviewReminders() {
  const { data = [] } = useQuery({
    queryKey: ["upcoming-interviews"],
    queryFn: getUpcomingInterviews,
  });

  const reminders = data.filter((interview: { interviewDate?: string }) => {
    if (!interview.interviewDate) return false;

    const minutesLeft = differenceInMinutes(
      new Date(interview.interviewDate),
      new Date(),
    );

    return minutesLeft > 0 && minutesLeft <= 24 * 60;
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
          <p className="text-sm text-muted-foreground">
            Interviews coming up in the next 24 hours
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-4">
        {reminders.map(
          (reminder: {
            id: string;
            company: string;
            role: string;
            interviewType?: string;
            interviewDate: string;
          }) => {
            const minutesLeft = differenceInMinutes(
              new Date(reminder.interviewDate),
              new Date(),
            );
            const isUrgent = minutesLeft <= 60;

            return (
              <Link
                key={reminder.id}
                href={`/applications/${reminder.id}`}
                className={cn(
                  "flex items-start justify-between gap-4 rounded-xl border p-4 transition-colors",
                  isUrgent
                    ? "border-red-500/30 bg-red-500/10 hover:bg-red-500/15"
                    : "border-amber-500/25 bg-card/80 hover:bg-card",
                )}
              >
                <div className="min-w-0">
                  <p className="font-medium">{reminder.company}</p>
                  <p className="text-sm text-muted-foreground">
                    {reminder.role}
                  </p>
                  {reminder.interviewType ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {reminder.interviewType}
                    </p>
                  ) : null}
                </div>

                <div className="shrink-0 text-right">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      isUrgent ? "text-red-600 dark:text-red-400" : "text-amber-700 dark:text-amber-300",
                    )}
                  >
                    {minutesLeft < 60
                      ? `${minutesLeft}m left`
                      : `${Math.floor(minutesLeft / 60)}h left`}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(reminder.interviewDate).toLocaleString()}
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
