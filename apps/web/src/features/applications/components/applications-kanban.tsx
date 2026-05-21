"use client";

import {
  DndContext,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { getApplications } from "@/services/applications.service";

import { updateApplication } from "@/services/applications.service";

import { KanbanColumn } from "./kanban-column";

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

    const newStatus = String(over.id);

    mutation.mutate({
      id: String(active.id),
      status: newStatus,
    });
  }

  return (
    <DndContext
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-4">
        {statuses.map((status) => {
          const filteredApplications =
            data.filter(
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
    </DndContext>
  );
}