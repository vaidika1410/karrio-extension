import { Card } from "@/components/ui/card";

export function StatsCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <Card className="rounded-2xl border-border bg-card p-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {title}
        </p>

        <h2 className="text-3xl font-semibold tracking-tight">
          {value}
        </h2>
      </div>
    </Card>
  );
}