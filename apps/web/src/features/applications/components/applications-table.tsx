"use client";

import { useQuery } from "@tanstack/react-query";

import { getApplications } from "@/services/applications.service";

export function ApplicationsTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        Loading applications...
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="p-6 text-muted-foreground">
        No applications found.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {data.map((application: any) => (
        <div
          key={application.id}
          className="rounded-xl border border-border bg-card p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">
                {application.role}
              </h2>

              <p className="text-sm text-muted-foreground">
                {application.company}
              </p>
            </div>

            <div className="text-sm">
              {application.status}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}