import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Dashboard
        </h1>

        <p className="text-muted-foreground">
          Track your job search progress
        </p>
      </div>

      <DashboardOverview />
    </div>
  );
}