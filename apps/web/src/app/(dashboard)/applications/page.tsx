import { CreateApplicationModal } from "@/features/applications/components/create-application-modal";

import { ApplicationsTable } from "@/features/applications/components/applications-table";

export default function ApplicationsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Applications
          </h1>

          <p className="text-sm text-muted-foreground">
            Track your job applications
          </p>
        </div>

        <CreateApplicationModal />
      </div>

      <ApplicationsTable />
    </div>
  );
}