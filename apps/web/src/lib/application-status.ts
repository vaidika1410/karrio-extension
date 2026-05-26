export const APPLICATION_STATUSES = [
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
] as const;

export type ApplicationStatus =
  (typeof APPLICATION_STATUSES)[number];

export const STATUS_LABELS: Record<string, string> = {
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  ALL: "All statuses",
};

export const STATUS_FILTER_OPTIONS = [
  { value: "ALL", label: STATUS_LABELS.ALL },
  ...APPLICATION_STATUSES.map((status) => ({
    value: status,
    label: STATUS_LABELS[status],
  })),
];
