"use client";

import type { ReactNode } from "react";

import { useRouter } from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import { getAccessToken } from "@/lib/auth";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const router = useRouter();

  const [isChecking, setIsChecking] =
    useState(true);

  const [authorized, setAuthorized] =
    useState(false);

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      router.replace("/login");
    } else {
      setAuthorized(true);
    }

    setIsChecking(false);
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center app-shell-gradient">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}