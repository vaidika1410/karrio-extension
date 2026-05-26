"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateApplicationForm } from "./create-application-form";

export function CreateApplicationModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2 shadow-sm">
          <Plus className="size-4" />
          Add application
        </Button>
      </DialogTrigger>

      <DialogContent className="border-border/60 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New application</DialogTitle>
          <DialogDescription>
            Capture a role you&apos;re pursuing. You can refine details anytime.
          </DialogDescription>
        </DialogHeader>

        <CreateApplicationForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
