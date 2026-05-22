"use client";

import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
} from "@dnd-kit/core";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { getApplications } from "@/services/applications.service";

import { updateApplication } from "@/services/applications.service";

import { KanbanColumn } from "./kanban-column";

import { useEffect, useState } from "react";

const statuses = [
    "APPLIED",
    "INTERVIEW",
    "OFFER",
    "REJECTED",
];

export function ApplicationsKanban() {
    const queryClient = useQueryClient();

    const { data = [] } = useQuery({
        queryKey: ["applications"],
        queryFn: getApplications,
    });

    const [applications, setApplications] =
        useState<any[]>([]);

    useEffect(() => {
        setApplications(data);
    }, [data]);

    const mutation = useMutation({
        mutationFn: ({
            id,
            status,
        }: {
            id: string;
            status: string;
        }) =>
            updateApplication(id, {
                status,
            }),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["applications"],
            });
        },
    });

    function handleDragEnd(
        event: DragEndEvent,
    ) {
        const {
            active,
            over,
        } = event;

        if (!over) return;

        const applicationId = String(
            active.id,
        );

        const newStatus = String(over.id);

        setApplications((prev) =>
            prev.map((application) =>
                application.id ===
                    applicationId
                    ? {
                        ...application,
                        status: newStatus,
                    }
                    : application,
            ),
        );

        mutation.mutate({
            id: applicationId,
            status: newStatus,
        });
    }

    const [activeApplication, setActiveApplication] =
        useState<any>(null);

    function handleDragStart(
        event: DragStartEvent,
    ) {
        const application = data.find(
            (app: any) =>
                app.id === String(event.active.id),
        );

        setActiveApplication(application);
    }

    return (
        <DndContext
            onDragStart={handleDragStart}
            onDragEnd={(event) => {
                handleDragEnd(event);

                setActiveApplication(null);
            }}
        >
            <div className="flex gap-6 overflow-x-auto pb-4">
                {statuses.map((status) => {
                    const filteredApplications =
                        applications.filter(
                            (application: any) =>
                                application.status ===
                                status,
                        );

                    return (
                        <KanbanColumn
                            key={status}
                            title={status}
                            applications={
                                filteredApplications
                            }
                        />
                    );
                })}
            </div>

            <DragOverlay>
                {activeApplication ? (
                    <div className="rotate-2 scale-105 opacity-90 shadow-2xl">
                        <div className="space-y-3 rounded-xl border border-border bg-card p-4">
                            <div className="space-y-1">
                                <h3 className="font-medium">
                                    {activeApplication.role}
                                </h3>

                                <p className="text-sm text-muted-foreground">
                                    {activeApplication.company}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}