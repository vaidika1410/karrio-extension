import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { CreateApplicationModal } from "@/features/applications/components/create-application-modal";
import { ApplicationsKanban } from "@/features/applications/components/applications-kanban";

export default function KanbanPage() {
  return (
    <PageContainer className="max-w-[100rem]">
      <PageHeader
        title="Kanban board"
        description="Drag cards between stages as your applications move forward."
        actions={<CreateApplicationModal />}
      />

      <ApplicationsKanban />
    </PageContainer>
  );
}
