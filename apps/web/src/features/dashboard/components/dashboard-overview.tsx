"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  CalendarCheck,
  Gift,
  XCircle,
} from "lucide-react";

import { getApplications } from "@/services/applications.service";

import { StatsCard } from "./stats-card";

export function DashboardOverview() {
  const { data = [] } = useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
  });

  const totalApplications = data.length;
  const interviews = data.filter(
    (app: { status: string }) => app.status === "INTERVIEW",
  ).length;
  const offers = data.filter(
    (app: { status: string }) => app.status === "OFFER",
  ).length;
  const rejected = data.filter(
    (app: { status: string }) => app.status === "REJECTED",
  ).length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Total applications"
        value={totalApplications}
        icon={Briefcase}
        accent="default"
      />
      <StatsCard
        title="Interviews"
        value={interviews}
        icon={CalendarCheck}
        accent="warning"
      />
      <StatsCard
        title="Offers"
        value={offers}
        icon={Gift}
        accent="success"
      />
      <StatsCard
        title="Rejected"
        value={rejected}
        icon={XCircle}
        accent="muted"
      />
    </div>
  );
}
