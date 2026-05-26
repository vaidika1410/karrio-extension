"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Briefcase, ExternalLink } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { CreateApplicationModal } from "./create-application-modal";
import { StatusSelect } from "./status-select";
import { ApplicationRowActions } from "./application-row-actions";

export function ApplicationsTable({
  data,
  isLoading,
  hasFilters = false,
}: {
  data: {
    id: string;
    company: string;
    role: string;
    status: string;
    notes?: string;
    jobUrl?: string;
  }[];
  isLoading: boolean;
  hasFilters?: boolean;
}) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[var(--shadow-soft)]">
        <div className="space-y-0 divide-y divide-border/60">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex animate-pulse items-center gap-4 px-6 py-4"
            >
              <div className="h-4 flex-1 rounded-md bg-muted" />
              <div className="h-4 w-24 rounded-md bg-muted" />
              <div className="h-8 w-28 rounded-lg bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <EmptyState
        icon={<Briefcase className="size-5" />}
        title={hasFilters ? "No matches" : "No applications yet"}
        description={
          hasFilters
            ? "Try a different search or clear your status filter."
            : "Add your first role to start tracking your job search."
        }
        action={hasFilters ? undefined : <CreateApplicationModal />}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[var(--shadow-soft)]">
      <Table>
        <TableHeader>
          <TableRow className="border-border/60 hover:bg-transparent">
            <TableHead className="font-medium text-muted-foreground">
              Company
            </TableHead>
            <TableHead className="font-medium text-muted-foreground">
              Role
            </TableHead>
            <TableHead className="font-medium text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="hidden font-medium text-muted-foreground md:table-cell">
              Notes
            </TableHead>
            <TableHead className="font-medium text-muted-foreground">
              Link
            </TableHead>
            <TableHead className="w-[72px]" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((application) => (
            <TableRow
              key={application.id}
              onClick={() => router.push(`/applications/${application.id}`)}
              className="cursor-pointer border-border/40 transition-colors hover:bg-muted/40"
            >
              <TableCell className="font-medium">
                <Link
                  href={`/applications/${application.id}`}
                  className="hover:text-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  {application.company}
                </Link>
              </TableCell>

              <TableCell className="text-muted-foreground">
                {application.role}
              </TableCell>

              <TableCell onClick={(e) => e.stopPropagation()}>
                <StatusSelect
                  applicationId={application.id}
                  value={application.status}
                />
              </TableCell>

              <TableCell className="hidden max-w-[280px] truncate text-muted-foreground md:table-cell">
                {application.notes || "—"}
              </TableCell>

              <TableCell>
                {application.jobUrl ? (
                  <a
                    href={application.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Open
                    <ExternalLink className="size-3.5" />
                  </a>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>

              <TableCell className="text-right">
                <div onClick={(e) => e.stopPropagation()}>
                  <ApplicationRowActions applicationId={application.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
