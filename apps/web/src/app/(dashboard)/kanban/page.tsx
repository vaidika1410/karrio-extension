import { ApplicationsKanban } from "@/features/applications/components/applications-kanban";

export default function KanbanPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Kanban Board
        </h1>

        <p className="text-muted-foreground">
          Track applications visually
        </p>
      </div>

      <ApplicationsKanban />
    </div>
  );
}