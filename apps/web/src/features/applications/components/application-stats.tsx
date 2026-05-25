"use client";

interface ApplicationStatsProps {
  applications: any[];
}

export function ApplicationStats({
  applications,
}: ApplicationStatsProps) {
  const total =
    applications.length;

  const interviews =
    applications.filter(
      (app) =>
        app.status ===
        "INTERVIEW",
    ).length;

  const offers =
    applications.filter(
      (app) =>
        app.status === "OFFER",
    ).length;

  const rejected =
    applications.filter(
      (app) =>
        app.status ===
        "REJECTED",
    ).length;

  const cards = [
    {
      label:
        "Total Applications",
      value: total,
    },

    {
      label: "Interviews",
      value: interviews,
    },

    {
      label: "Offers",
      value: offers,
    },

    {
      label: "Rejected",
      value: rejected,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="
            rounded-2xl
            border
            border-border
            bg-card
            p-6
          "
        >
          <div className="text-sm text-muted-foreground">
            {card.label}
          </div>

          <div className="mt-2 text-3xl font-bold">
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}