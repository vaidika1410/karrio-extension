"use client";

import { useQuery } from "@tanstack/react-query";

import { getApplication } from "@/services/applications.service";

import { StatusSelect } from "@/features/applications/components/status-select";

import { use } from "react";

import Link from "next/link";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";

export default function ApplicationDetailPage({
    params: paramsPromise,
}: {
    params: Promise<{ id: string }>;
}) {
    const params = use(paramsPromise);

    const [notes, setNotes] =
    useState("");
    

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

            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: [
                        "application",
                        String(params.id),
                    ],
                });
            },
        });

    if (isLoading) {
        return (
            <div className="p-6">
                Loading...
            </div>
        );
    }


    if (error || !data) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-red-500">
                    Application not found
                </h1>
                <p className="mt-2 text-muted-foreground">
                    The application you are looking for might have been deleted or you don't have access to it.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            {data.role}
                        </h1>

                        <p className="mt-2 text-lg text-muted-foreground">
                            {data.company}
                        </p>
                    </div>

                    <StatusSelect
                        applicationId={data.id}
                        value={data.status}
                    />
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-border bg-background p-4">
                        <p className="text-sm text-muted-foreground">
                            Platform
                        </p>

                        <p className="mt-1 font-medium">
                            {data.platform ||
                                "Not specified"}
                        </p>
                    </div>

                    <div className="rounded-xl border border-border bg-background p-4">
                        <p className="text-sm text-muted-foreground">
                            Location
                        </p>

                        <p className="mt-1 font-medium">
                            {data.location ||
                                "Not specified"}
                        </p>
                    </div>

                    <div className="rounded-xl border border-border bg-background p-4">
                        <p className="text-sm text-muted-foreground">
                            Salary
                        </p>

                        <p className="mt-1 font-medium">
                            {data.salary ||
                                "Not specified"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
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

            <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold">
                    Job Link
                </h2>

                {data.jobUrl ? (
                    <Link
                        href={data.jobUrl}
                        target="_blank"
                        className="
                        inline-flex
                        items-center
                        rounded-xl
                        border
                        border-border
                        bg-background
                        px-4
                        py-2
                        text-sm
                        font-medium
                        transition-colors
                        hover:bg-muted
                    "
                    >
                        Open Job Posting
                    </Link>
                ) : (
                    <p className="text-muted-foreground">
                        No link available
                    </p>
                )}
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="mb-6 text-lg font-semibold">
                    Activity Timeline
                </h2>

                <div className="space-y-6">
                    {data.activities?.length ? (
                        data.activities.map(
                            (activity: any) => (
                                <div
                                    key={activity.id}
                                    className="relative border-l border-border pl-5"
                                >
                                    <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-primary" />

                                    <p className="font-medium">
                                        {activity.message}
                                    </p>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {new Date(
                                            activity.createdAt,
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            ),
                        )
                    ) : (
                        <p className="text-muted-foreground">
                            No activity yet
                        </p>
                    )}
                </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold">
                    Created
                </h2>

                <p className="text-muted-foreground">
                    {new Date(
                        data.createdAt,
                    ).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
}