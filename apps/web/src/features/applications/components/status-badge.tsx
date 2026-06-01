import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS } from "@/lib/application-status";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  SAVED:
    "border-zinc-500/20 bg-zinc-500/10 text-zinc-700 dark:text-zinc-300",
  APPLIED:
    "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  INTERVIEW:
    "border-amber-500/25 bg-amber-500/10 text-amber-800 dark:text-amber-300",
  OFFER:
    "border-emerald-500/25 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
  REJECTED:
    "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-md border px-2 py-0.5 text-[0.7rem] font-medium tracking-wide",
        statusStyles[status],
      )}
    >
      {STATUS_LABELS[status] ?? status}
    </Badge>
  );
}
