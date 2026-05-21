import { Badge } from "@/components/ui/badge";

const statusStyles: Record<
  string,
  string
> = {
  APPLIED:
    "bg-blue-500/10 text-blue-400 border-blue-500/20",

  INTERVIEW:
    "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",

  OFFER:
    "bg-green-500/10 text-green-400 border-green-500/20",

  REJECTED:
    "bg-red-500/10 text-red-400 border-red-500/20",
};

export function StatusBadge({
  status,
}: {
  status: string;
}) {
  return (
    <Badge
      variant="outline"
      className={statusStyles[status]}
    >
      {status}
    </Badge>
  );
}