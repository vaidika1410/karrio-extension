"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";

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
    isDragging,
  } = useSortable({
    id: application.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group cursor-grab space-y-2.5 rounded-xl border border-border/60 bg-background p-3.5 shadow-sm transition-all hover:border-primary/25 hover:shadow-md active:cursor-grabbing ${
        isDragging ? "opacity-60" : ""
      }`}
    >
      <div className="space-y-0.5">
        <Link
          href={`/applications/${application.id}`}
          className="font-medium leading-snug hover:text-primary"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {application.role}
        </Link>
        <p className="text-sm text-muted-foreground">{application.company}</p>
      </div>

      <StatusBadge status={application.status} />

      {application.notes ? (
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {application.notes}
        </p>
      ) : null}
    </div>
  );
}
