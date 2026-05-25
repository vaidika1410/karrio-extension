"use client";

import { useQuery } from "@tanstack/react-query";

import { getApplication } from "@/services/applications.service";

import { StatusSelect } from "@/features/applications/components/status-select";

import { use } from "react";

export default function ApplicationDetailPage({
    params: paramsPromise,
}: {
    params: Promise<{ id: string }>;
}) {
    const params = use(paramsPromise);

    const {
        data,
        isLoading,
        error,
    } = useQuery({
        queryKey: [
            "application",
            params.id,
        ],

        queryFn: () =>
            getApplication(
                params.id,
            ),
        enabled: !!params.id,
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
                <div className="flex items-start justify-between">
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
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold">
                    Notes
                </h2>

                <p className="text-muted-foreground">
                    {data.notes ||
                        "No notes added"}
                </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold">
                    Job Link
                </h2>

                {data.jobUrl ? (
                    <a
                        href={data.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                    >
                        Open Job Posting
                    </a>
                ) : (
                    <p className="text-muted-foreground">
                        No link available
                    </p>
                )}
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