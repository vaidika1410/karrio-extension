"use client";

import { useDroppable } from "@dnd-kit/core";

import { DraggableApplicationCard } from "./draggable-application-card";

interface Application {
    id: string;
    company: string;
    role: string;
    status: string;
    notes?: string;
}

export function KanbanColumn({
    title,
    applications,
}: {
    title: string;
    applications: Application[];
}) {
    const { setNodeRef, isOver } = useDroppable({
        id: title,
    });

    return (
        <div
            ref={setNodeRef}
            className={`flex min-h-[500px] w-[320px] flex-col rounded-2xl border transition-all ${isOver
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card"
                }`}
        >
            <div className="border-b border-border p-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold">
                        {title}
                    </h2>

                    <div className="rounded-full bg-secondary px-2 py-1 text-xs text-muted-foreground">
                        {applications.length}
                    </div>
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-3 p-4">
                {applications.map((application) => (
                    <DraggableApplicationCard
                        key={application.id}
                        application={application}
                    />
                ))}
            </div>
        </div>
    );
}