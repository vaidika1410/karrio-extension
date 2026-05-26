"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "rounded-xl border border-border/60 bg-card text-foreground shadow-[var(--shadow-soft)]",
          title: "font-medium",
          description: "text-muted-foreground",
        },
      }}
    />
  );
}
