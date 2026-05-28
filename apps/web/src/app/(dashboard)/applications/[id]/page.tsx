"use client";

import { useQuery } from "@tanstack/react-query";

import { getApplication } from "@/services/applications.service";

import { StatusSelect } from "@/features/applications/components/status-select";

import { use } from "react";

import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { useState, useEffect } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";

import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export default function ApplicationDetailPage({
    params: paramsPromise,
}: {
    params: Promise<{ id: string }>;
}) {
    const params = use(paramsPromise);

    const [notes, setNotes] =
        useState("");

    const [
        interviewDate,
        setInterviewDate,
    ] = useState("");

    const [
        interviewType,
        setInterviewType,
    ] = useState("");


    const queryClient =
        useQueryClient();

    const {
        data,
        isLoading,
        error,
    } = useQuery({
        queryKey: [
            "application",
            String(params.id),
        ],

        queryFn: () =>
            getApplication(
                params.id,
            ),
        enabled: !!params.id,
    });

    useEffect(() => {
        if (data) {
            setNotes(data.notes || "");
        }

        setInterviewDate(
            data?.interviewDate
                ? formatDateTimeLocal(
                    data.interviewDate,
                )
                : "",
        );

        setInterviewType(
            data?.interviewType || "",
        );
    }, [data]);

    const updateNotesMutation =
        useMutation({
            mutationFn: async () => {
                const response =
                    await api.patch(
                        `/applications/${params.id}`,
                        {
                            notes,
                        },
                    );

                return response.data;
            },

            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: [
                        "application",
                        params.id,
                    ],
                });

                await queryClient.refetchQueries({
                    queryKey: [
                        "application",
                        params.id,
                    ],
                });

                toast.success("Notes saved");
            },
            onError: () => {
                toast.error("Could not save notes");
            },
        });

    const interviewMutation =
        useMutation({
            mutationFn: async () => {
                const response =
                    await api.patch(
                        `/applications/${params.id}`,
                        {
                            interviewDate:
    interviewDate
        ? new Date(
              interviewDate,
          ).toISOString()
        : null,

                            interviewType,
                        },
                    );

                return response.data;
            },

            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: [
                        "application",
                        params.id,
                    ],
                });

                await queryClient.refetchQueries({
                    queryKey: [
                        "upcoming-interviews",
                    ],
                });

                await queryClient.refetchQueries({
                    queryKey: ["applications"],
                });

                toast.success("Interview details saved");
            },
            onError: () => {
                toast.error("Could not save interview details");
            },
        });

    if (isLoading) {
        return (
            <PageContainer>
                <div className="h-48 animate-pulse rounded-2xl bg-muted" />
            </PageContainer>
        );
    }

    if (error || !data) {
        return (
            <PageContainer>
                <Link
                    href="/applications"
                    className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />
                    Back to applications
                </Link>
                <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8">
                    <h1 className="text-xl font-semibold text-destructive">
                        Application not found
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        It may have been removed or you may not have access.
                    </p>
                </div>
            </PageContainer>
        );
    }

    const canEditInterview =
        data.status !==
        "APPLIED";

    return (
        <PageContainer>
            <Link
                href="/applications"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="size-4" />
                Back to applications
            </Link>

            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                            {data.role}
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            {data.company}
                        </p>
                    </div>

                    <StatusSelect
                        applicationId={data.id}
                        value={data.status}
                    />
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[
                        { label: "Platform", value: data.platform },
                        { label: "Location", value: data.location },
                        { label: "Salary", value: data.salary },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="rounded-xl border border-border/50 bg-muted/30 px-4 py-3"
                        >
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                {item.label}
                            </p>
                            <p className="mt-1 text-sm font-medium">
                                {item.value || "Not specified"}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold">
                        Notes
                    </h2>

                    <Button
                        size="sm"
                        onClick={() =>
                            updateNotesMutation.mutate()
                        }
                        disabled={
                            updateNotesMutation.isPending
                        }
                    >
                        {updateNotesMutation.isPending
                            ? "Saving..."
                            : "Save Notes"}
                    </Button>
                </div>


                <Textarea
                    value={notes}
                    onChange={(e) =>
                        setNotes(
                            e.target.value,
                        )
                    }
                    placeholder="Add interview prep notes, follow-ups, recruiter info..."
                    className="min-h-[180px]"
                />
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        Interview
                    </h2>

                    <Button
                        size="sm"
                        onClick={() =>
                            interviewMutation.mutate()
                        }
                        disabled={
                            interviewMutation.isPending || !canEditInterview
                        }
                    >
                        {interviewMutation.isPending
                            ? "Saving..."
                            : "Save Interview"}
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="interview-date">Interview date</Label>
                        <Input
                            id="interview-date"
                            type="datetime-local"
                            value={interviewDate}
                            disabled={!canEditInterview}
                            onChange={(e) =>
                                setInterviewDate(e.target.value)
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="interview-type">Interview type</Label>
                        <Input
                            id="interview-type"
                            type="text"
                            placeholder="HR round, technical, OA..."
                            value={interviewType}
                            disabled={!canEditInterview}
                            onChange={(e) =>
                                setInterviewType(e.target.value)
                            }
                        />
                    </div>

                    {!canEditInterview && (
                        <p className="col-span-full text-sm text-muted-foreground">
                            Move the status beyond Applied to schedule interview details.
                        </p>
                    )}
                </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]">
                <h2 className="mb-4 text-lg font-semibold">
                    Job Link
                </h2>

                {data.jobUrl ? (
                    <Link
                        href={data.jobUrl}
                        target="_blank"
                        className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                    >
                        Open job posting
                        <ExternalLink className="size-4" />
                    </Link>
                ) : (
                    <p className="text-muted-foreground">
                        No link available
                    </p>
                )}
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]">
                <h2 className="mb-6 text-lg font-semibold">
                    Activity timeline
                </h2>

                {!data.activities ||
                    data.activities.length === 0 ? (
                    <p className="text-muted-foreground">
                        No activity yet
                    </p>
                ) : (
                    <div className="space-y-6">
                        {data.activities.map(
                            (activity: any) => (
                                <div
                                    key={activity.id}
                                    className="relative border-l border-border pl-5"
                                >
                                    <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full" />

                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">
                                                {activity.type ===
                                                    "CREATED"
                                                    ? "🟢"
                                                    : activity.type ===
                                                        "STATUS_CHANGED"
                                                        ? "🔵"
                                                        : activity.type ===
                                                            "NOTES_UPDATED"
                                                            ? "🟡"
                                                            : "⚪"}
                                            </span>

                                            <p className="font-medium">
                                                {activity.message}
                                            </p>
                                        </div>

                                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                                            {formatDistanceToNow(
                                                new Date(
                                                    activity.createdAt,
                                                ),
                                                {
                                                    addSuffix: true,
                                                },
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                )}
            </div>

            <div className="rounded-2xl border border-border/60 bg-muted/20 px-6 py-4 text-sm text-muted-foreground">
                Added on{" "}
                <span className="font-medium text-foreground">
                    {new Date(data.createdAt).toLocaleDateString(undefined, {
                        dateStyle: "long",
                    })}
                </span>
            </div>
        </PageContainer>
    );
}

function formatDateTimeLocal(
    dateString: string,
) {
    const date =
        new Date(dateString);

    const offset =
        date.getTimezoneOffset();

    const localDate =
        new Date(
            date.getTime() -
            offset * 60 * 1000,
        );

    return localDate
        .toISOString()
        .slice(0, 16);
}