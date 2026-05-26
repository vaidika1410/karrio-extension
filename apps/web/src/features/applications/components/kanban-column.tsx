"use client";

import { useDroppable } from "@dnd-kit/core";

import { STATUS_LABELS } from "@/lib/application-status";
import { cn } from "@/lib/utils";

import { DraggableApplicationCard } from "./draggable-application-card";

interface Application {
  id: string;
  company: string;
  role: string;
  status: string;
  notes?: string;
}

const columnAccent: Record<string, string> = {
  APPLIED: "border-t-sky-500/60",
  INTERVIEW: "border-t-amber-500/60",
  OFFER: "border-t-emerald-500/60",
  REJECTED: "border-t-red-400/50",
};

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

  const label = STATUS_LABELS[title] ?? title;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-[28rem] w-[min(100%,18rem)] shrink-0 flex-col rounded-2xl border border-border/60 border-t-[3px] bg-card/80 shadow-[var(--shadow-soft)] backdrop-blur-sm transition-all",
        columnAccent[title],
        isOver && "border-primary/40 bg-primary/5 ring-2 ring-primary/20",
      )}
    >
      <div className="border-b border-border/50 px-4 py-3.5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold tracking-tight">{label}</h2>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
            {applications.length}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-3">
        {applications.length === 0 ? (
          <p className="py-8 text-center text-xs text-muted-foreground">
            Drop applications here
          </p>
        ) : (
          applications.map((application) => (
            <DraggableApplicationCard
              key={application.id}
              application={application}
            />
          ))
        )}
      </div>
    </div>
  );
}
