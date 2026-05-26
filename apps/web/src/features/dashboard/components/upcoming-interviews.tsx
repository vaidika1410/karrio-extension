"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { CalendarClock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getUpcomingInterviews } from "@/services/applications.service";

export function UpcomingInterviews() {
  const { data, isLoading } = useQuery({
    queryKey: ["upcoming-interviews"],
    queryFn: getUpcomingInterviews,
  });

  if (isLoading) {
    return (
      <Card className="border-border/60 bg-card/80 shadow-[var(--shadow-soft)]">
        <CardContent className="p-6">
          <div className="h-32 animate-pulse rounded-xl bg-muted" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 bg-card/80 shadow-[var(--shadow-soft)]">
      <CardHeader className="border-b border-border/50 pb-4">
        <CardTitle className="text-lg font-semibold">
          Upcoming interviews
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your nearest scheduled conversations
        </p>
      </CardHeader>

      <CardContent className="pt-4">
        {!data?.length ? (
          <EmptyState
            icon={<CalendarClock className="size-5" />}
            title="No interviews scheduled"
            description="When you set interview dates on applications, they will appear here."
            className="border-0 bg-transparent py-8"
          />
        ) : (
          <div className="space-y-3">
            {data.map((interview: {
              id: string;
              company: string;
              role: string;
              interviewType?: string;
              interviewDate: string;
            }) => (
              <Link
                key={interview.id}
                href={`/applications/${interview.id}`}
                className="flex items-start justify-between gap-4 rounded-xl border border-border/50 bg-muted/30 p-4 transition-colors hover:border-primary/20 hover:bg-accent/40"
              >
                <div className="min-w-0 space-y-1">
                  <p className="font-medium">{interview.company}</p>
                  <p className="text-sm text-muted-foreground">
                    {interview.role}
                  </p>
                  {interview.interviewType ? (
                    <p className="text-xs text-muted-foreground">
                      {interview.interviewType}
                    </p>
                  ) : null}
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-medium text-primary">
                    {formatDistanceToNow(new Date(interview.interviewDate), {
                      addSuffix: true,
                    })}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(interview.interviewDate).toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
