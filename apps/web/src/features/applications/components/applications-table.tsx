"use client";

import { useQuery } from "@tanstack/react-query";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getApplications } from "@/services/applications.service";

import { StatusSelect } from "./status-select";

import { ApplicationRowActions } from "./application-row-actions";

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
      <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
        No applications found.
      </div>
    );
  }

  return (
    <div className="overflow-visible rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              Company
            </TableHead>

            <TableHead>
              Role
            </TableHead>

            <TableHead>
              Status
            </TableHead>

            <TableHead>
              Notes
            </TableHead>

            <TableHead>
              Link
            </TableHead>

            <TableHead className="w-[80px] text-right">
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((application: any) => (
            <TableRow
              key={application.id}
            >
              <TableCell className="font-medium">
                {application.company}
              </TableCell>

              <TableCell>
                {application.role}
              </TableCell>

              <TableCell>
                <StatusSelect
                  applicationId={application.id}
                  value={application.status}
                />
              </TableCell>

              <TableCell className="max-w-[300px] truncate text-muted-foreground">
                {application.notes ||
                  "No notes"}
              </TableCell>

              <TableCell>
                {application.jobUrl ? (
                  <a
                    href={application.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    Open
                  </a>
                ) : (
                  "-"
                )}
              </TableCell>

              <TableCell className="text-right">
                <ApplicationRowActions
                  applicationId={application.id}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}