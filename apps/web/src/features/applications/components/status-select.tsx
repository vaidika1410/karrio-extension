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

import { updateApplication } from "@/services/applications.service";

const statuses = [
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
];

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
      defaultValue={value}
      onValueChange={(value) =>
        mutation.mutate(value)
      }
    >
      <SelectTrigger className="w-[140px] ">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {statuses.map((status) => (
          <SelectItem
            key={status}
            value={status}
          >
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}