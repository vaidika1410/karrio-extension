import type { ReactNode } from "react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface AuthCardProps {
  children: ReactNode;
}

export function AuthCard({
  children,
}: AuthCardProps) {
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur">
      <CardContent className="p-8">
        {children}
      </CardContent>
    </Card>
  );
}