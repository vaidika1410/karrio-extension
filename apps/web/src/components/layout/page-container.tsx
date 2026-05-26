import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-6xl space-y-8 px-4 py-8 pb-24 md:px-8 md:pb-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
