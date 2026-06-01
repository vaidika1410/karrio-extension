"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  const [formData, setFormData] = useState<CreateApplicationData>({
    company: "",
    role: "",
    status: "SAVED",
    notes: "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/applications", formData);
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applications"],
      });

      setFormData({
        company: "",
        role: "",
        status: "SAVED",
        notes: "",
      });

      toast.success("Application added");
      onSuccess?.();
    },

    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message = error?.response?.data?.message;

      if (message === "Application already exists") {
        toast.info("This application is already in your list");
        onSuccess?.();
        return;
      }

      toast.error("Could not save application");
    },
  });

  const canSubmit =
    formData.company.trim().length > 0 && formData.role.trim().length > 0;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          placeholder="e.g. Acme Corp"
          value={formData.company}
          onChange={(e) =>
            setFormData({ ...formData, company: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Input
          id="role"
          placeholder="e.g. Software Engineer"
          value={formData.role}
          onChange={(e) =>
            setFormData({ ...formData, role: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          placeholder="Referral, salary range, recruiter name..."
          value={formData.notes}
          onChange={(e) =>
            setFormData({ ...formData, notes: e.target.value })
          }
          className="min-h-[100px] resize-none"
        />
      </div>

      <Button
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending || !canSubmit}
        className="w-full"
        size="lg"
      >
        {mutation.isPending ? "Saving..." : "Save application"}
      </Button>
    </div>
  );
}
