import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { CreateApplicationModal } from "@/features/applications/components/create-application-modal";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { InterviewNotifications } from "@/features/dashboard/components/interview-notifications";
import { InterviewReminders } from "@/features/dashboard/components/interview-reminders";
import { UpcomingInterviews } from "@/features/dashboard/components/upcoming-interviews";

export default function DashboardPage() {
  return (
    <PageContainer>
      <InterviewNotifications />

      <PageHeader
        title="Dashboard"
        description="A quiet overview of where you are in your job search."
        actions={<CreateApplicationModal />}
      />

      <DashboardOverview />
      <InterviewReminders />
      <UpcomingInterviews />
    </PageContainer>
  );
}
