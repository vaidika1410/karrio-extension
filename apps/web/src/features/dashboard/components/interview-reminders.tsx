"use client";

import Link from "next/link";

import { useQuery } from "@tanstack/react-query";

import { differenceInHours } from "date-fns";

import { getUpcomingInterviews } from "@/services/applications.service";

export function InterviewReminders() {
    const { data = [] } =
        useQuery({
            queryKey: [
                "upcoming-interviews",
            ],

            queryFn:
                getUpcomingInterviews,
        });

    const reminders =
        data.filter(
            (interview: any) => {
                if (
                    !interview.interviewDate
                ) {
                    return false;
                }

                const hoursLeft =
                    differenceInHours(
                        new Date(
                            interview.interviewDate,
                        ),
                        new Date(),
                    );

                return (
                    hoursLeft > 0 && hoursLeft <= 24
                );
            },
        );

    if (!reminders.length) {
        return null;
    }

    return (
        <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">
                    Reminders
                </h2>

                <p className="text-sm text-muted-foreground">
                    Upcoming interview alerts
                </p>
            </div>

            <div className="space-y-4">
                {reminders.map(
                    (
                        reminder: any,
                    ) => {
                        const hoursLeft =
                            differenceInHours(
                                new Date(
                                    reminder.interviewDate,
                                ),
                                new Date(),
                            );

                        const isUrgent =
                            hoursLeft <= 3;

                        return (
                            <Link
                                key={
                                    reminder.id
                                }
                                href={`/applications/${reminder.id}`}
                                className={`
                  block rounded-xl border p-4 transition-colors
                  ${
                      isUrgent
                          ? "border-red-500/40 bg-red-500/10"
                          : "border-yellow-500/40 bg-yellow-500/10"
                  }
                `}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="font-semibold">
                                            {
                                                reminder.company
                                            }
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            {
                                                reminder.role
                                            }
                                        </p>

                                        <p className="mt-2 text-sm">
                                            {
                                                reminder.interviewType
                                            }
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-semibold">
                                            {hoursLeft <=
                                            0
                                                ? "Interview ongoing/overdue"
                                                : `${hoursLeft}h left`}
                                        </p>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {new Date(
                                                reminder.interviewDate,
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    },
                )}
            </div>
        </div>
    );
}