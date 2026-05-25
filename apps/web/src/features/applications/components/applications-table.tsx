"use client";


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { StatusSelect } from "./status-select";

import { ApplicationRowActions } from "./application-row-actions";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function ApplicationsTable({
  data,
  isLoading,
}: {
  data: any[];
  isLoading: boolean;
}) {


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

  const router = useRouter();

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
              onClick={() =>
                router.push(
                  `/applications/${application.id}`,
                )
              }
              className="
    cursor-pointer
    transition-colors
    hover:bg-muted/40
  "
            >
              <TableCell className="font-medium">
                <Link
                  href={`/applications/${application.id}`}
                  className="hover:underline"
                >
                  {application.company}
                </Link>
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
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                    className="
    text-primary
    underline
    underline-offset-4
  "
                  >
                    Open
                  </a>
                ) : (
                  "-"
                )}
              </TableCell>

              <TableCell className="text-right">
                <div
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                >
                  <ApplicationRowActions
                    applicationId={application.id}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}