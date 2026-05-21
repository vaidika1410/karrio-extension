"use client";

import { useSortable } from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import { StatusBadge } from "./status-badge";

interface Application {
  id: string;
  company: string;
  role: string;
  status: string;
  notes?: string;
}

export function DraggableApplicationCard({
  application,
}: {
  application: Application;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: application.id,
  });

  const style = {
    transform: CSS.Transform.toString(
      transform,
    ),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab space-y-3 rounded-xl border border-border bg-background p-4 transition-colors hover:bg-accent/30 active:cursor-grabbing"
    >
      <div className="space-y-1">
        <h3 className="font-medium">
          {application.role}
        </h3>

        <p className="text-sm text-muted-foreground">
          {application.company}
        </p>
      </div>

      <StatusBadge
        status={application.status}
      />

      {application.notes && (
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {application.notes}
        </p>
      )}
    </div>
  );
}