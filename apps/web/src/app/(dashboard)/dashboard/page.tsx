import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";

import { UpcomingInterviews } from "@/features/dashboard/components/upcoming-interviews";

import { InterviewReminders } from "@/features/dashboard/components/interview-reminders";
import { InterviewNotifications } from "@/features/dashboard/components/interview-notifications";

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <InterviewNotifications />
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Dashboard
        </h1>

        <p className="text-muted-foreground">
          Track your job search progress
        </p>
      </div>

      <DashboardOverview />
      <InterviewReminders />
      <UpcomingInterviews />
    </div>
  );
}