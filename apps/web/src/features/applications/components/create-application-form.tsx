"use client";

import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

interface CreateApplicationData {
  company: string;
  role: string;
  status: string;
  notes: string;
}

export function CreateApplicationForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const queryClient = useQueryClient();

  const [formData, setFormData] =
    useState<CreateApplicationData>({
      company: "",
      role: "",
      status: "APPLIED",
      notes: "",
    });

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(
        "/applications",
        formData,
      );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applications"],
      });

      setFormData({
        company: "",
        role: "",
        status: "APPLIED",
        notes: "",
      });

      onSuccess?.();
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message;

      if (
        message ===
        "Application already exists"
      ) {
        alert(
          "Application already saved",
        );

        onSuccess?.();

        return;
      }

      alert(
        "Failed to create application",
      );
    },
  });

  return (
    <div className="space-y-4">
      <Input
        placeholder="Company"
        value={formData.company}
        onChange={(e) =>
          setFormData({
            ...formData,
            company: e.target.value,
          })
        }
      />

      <Input
        placeholder="Role"
        value={formData.role}
        onChange={(e) =>
          setFormData({
            ...formData,
            role: e.target.value,
          })
        }
      />

      <Textarea
        placeholder="Notes"
        value={formData.notes}
        onChange={(e) =>
          setFormData({
            ...formData,
            notes: e.target.value,
          })
        }
      />

      <Button
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        className="w-full"
      >
        {mutation.isPending
          ? "Creating..."
          : "Create Application"}
      </Button>
    </div>
  );
}