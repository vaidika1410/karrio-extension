"use client";

import { useQuery } from "@tanstack/react-query";

import { getApplications } from "@/services/applications.service";

import { StatsCard } from "./stats-card";

export function DashboardOverview() {
  const { data = [] } = useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
  });

  const totalApplications =
    data.length;

  const interviews = data.filter(
    (app: any) =>
      app.status === "INTERVIEW",
  ).length;

  const offers = data.filter(
    (app: any) =>
      app.status === "OFFER",
  ).length;

  const rejected = data.filter(
    (app: any) =>
      app.status === "REJECTED",
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Total Applications"
        value={totalApplications}
      />

      <StatsCard
        title="Interviews"
        value={interviews}
      />

      <StatsCard
        title="Offers"
        value={offers}
      />

      <StatsCard
        title="Rejected"
        value={rejected}
      />
    </div>
  );
}