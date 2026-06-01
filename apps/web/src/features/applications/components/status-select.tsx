"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  APPLICATION_STATUSES,
  STATUS_LABELS,
} from "@/lib/application-status";
import { updateApplication } from "@/services/applications.service";

export function StatusSelect({
  applicationId,
  value,
}: {
  applicationId: string;
  value: string;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (status: string) =>
      updateApplication(
        applicationId,
        {
          status,
        },
      ),

    onSuccess: async () => {
    await queryClient.invalidateQueries({
        queryKey: ["applications"],
    });

    await queryClient.invalidateQueries({
        queryKey: [
            "application",
            applicationId,
        ],
    });

    await queryClient.refetchQueries({
        queryKey: [
            "application",
            applicationId,
        ],
    });
},
  });

  return (
    <Select
      value={value}
      onValueChange={(value) =>
        mutation.mutate(value)
      }
    >
      <SelectTrigger className="h-9 w-[148px] border-border/80 bg-background">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {APPLICATION_STATUSES.map((status) => (
          <SelectItem
            key={status}
            value={status}
          >
            {STATUS_LABELS[status]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
