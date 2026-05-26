"use client";

import {
  Briefcase,
  CalendarCheck,
  Gift,
  XCircle,
} from "lucide-react";

import { StatsCard } from "@/features/dashboard/components/stats-card";

interface ApplicationStatsProps {
  applications: { status: string }[];
}

export function ApplicationStats({ applications }: ApplicationStatsProps) {
  const total = applications.length;
  const interviews = applications.filter(
    (app) => app.status === "INTERVIEW",
  ).length;
  const offers = applications.filter((app) => app.status === "OFFER").length;
  const rejected = applications.filter(
    (app) => app.status === "REJECTED",
  ).length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Total applications"
        value={total}
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
