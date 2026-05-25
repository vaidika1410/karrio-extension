import { CreateApplicationModal } from "@/features/applications/components/create-application-modal";

import { ApplicationsTable } from "@/features/applications/components/applications-table";

import { ApplicationStats } from "@/features/applications/components/application-stats";

import { useQuery } from "@tanstack/react-query";

import { ApplicationsDashboard } from "@/features/applications/components/applications-dashboard";

export default function ApplicationsPage() {
  return <ApplicationsDashboard />;
}
