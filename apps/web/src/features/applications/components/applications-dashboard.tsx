"use client";

import { useQuery } from "@tanstack/react-query";

import { getApplications } from "@/services/applications.service";

import { ApplicationsTable } from "./applications-table";

import { ApplicationStats } from "./application-stats";

import { useMemo, useState } from "react";

import { ApplicationsToolbar } from "./applications-toolbar";

export function ApplicationsDashboard() {
    const { data, isLoading } =
        useQuery({
            queryKey: ["applications"],
            queryFn: getApplications,
        });

    const [search, setSearch] =
        useState("");

    const [status, setStatus] =
        useState("ALL");

    const filteredApplications =
        useMemo(() => {
            return (data || []).filter(
                (application: any) => {
                    const matchesSearch =
                        application.company
                            .toLowerCase()
                            .includes(
                                search.toLowerCase(),
                            ) ||
                        application.role
                            .toLowerCase()
                            .includes(
                                search.toLowerCase(),
                            );

                    const matchesStatus =
                        status === "ALL" ||
                        application.status ===
                        status;

                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                },
            );
        }, [data, search, status]);

    return (
        <div className="space-y-6">
            <ApplicationStats
                applications={data || []}
            />

            <ApplicationsToolbar
                search={search}
                setSearch={setSearch}
                status={status}
                setStatus={setStatus}
            />

            <ApplicationsTable
                data={filteredApplications}
                isLoading={isLoading}
            />
        </div>
    );
}