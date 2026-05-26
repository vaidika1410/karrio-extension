"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { getApplications } from "@/services/applications.service";

import { ApplicationStats } from "./application-stats";
import { ApplicationsTable } from "./applications-table";
import { ApplicationsToolbar } from "./applications-toolbar";
import { CreateApplicationModal } from "./create-application-modal";

export function ApplicationsDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
  });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const filteredApplications = useMemo(() => {
    return (data || []).filter((application: { company: string; role: string; status: string }) => {
      const matchesSearch =
        application.company.toLowerCase().includes(search.toLowerCase()) ||
        application.role.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === "ALL" || application.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [data, search, status]);

  return (
    <PageContainer>
      <PageHeader
        title="Applications"
        description="Add roles, update status, and keep every opportunity in one calm place."
        actions={<CreateApplicationModal />}
      />

      <ApplicationStats applications={data || []} />

      <ApplicationsToolbar
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
      />

      <ApplicationsTable
        data={filteredApplications}
        isLoading={isLoading}
        hasFilters={search.length > 0 || status !== "ALL"}
      />
    </PageContainer>
  );
}
