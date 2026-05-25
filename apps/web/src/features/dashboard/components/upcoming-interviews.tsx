"use client";

import Link from "next/link";

import { useQuery } from "@tanstack/react-query";

import { formatDistanceToNow } from "date-fns";

import { getUpcomingInterviews } from "@/services/applications.service";

export function UpcomingInterviews() {
    const { data, isLoading } =
        useQuery({
            queryKey: [
                "upcoming-interviews",
            ],

            queryFn:
                getUpcomingInterviews,
        });

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-border bg-card p-6">
                Loading interviews...
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">
                        Upcoming Interviews
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Your nearest scheduled interviews
                    </p>
                </div>
            </div>

            {!data?.length ? (
                <p className="text-muted-foreground">
                    No upcoming interviews
                </p>
            ) : (
                <div className="space-y-4">
                    {data.map(
                        (
                            interview: any,
                        ) => (
                            <Link
                                key={
                                    interview.id
                                }
                                href={`/applications/${interview.id}`}
                                className="
                                    block
                                    rounded-xl
                                    border
                                    border-border
                                    bg-background
                                    p-4
                                    transition-colors
                                    hover:bg-muted
                                "
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="font-semibold">
                                            {
                                                interview.company
                                            }
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            {
                                                interview.role
                                            }
                                        </p>

                                        <p className="mt-2 text-sm">
                                            {
                                                interview.interviewType
                                            }
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm font-medium">
                                            {formatDistanceToNow(
                                                new Date(
                                                    interview.interviewDate,
                                                ),
                                                {
                                                    addSuffix: true,
                                                },
                                            )}
                                        </p>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {new Date(
                                                interview.interviewDate,
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ),
                    )}
                </div>
            )}
        </div>
    );
}