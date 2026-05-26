import type { ReactNode } from "react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface AuthCardProps {
  children: ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <Card className="border-border/60 bg-card/90 shadow-[var(--shadow-soft)] backdrop-blur-md">
      <CardContent className="p-8">{children}</CardContent>
    </Card>
  );
}
