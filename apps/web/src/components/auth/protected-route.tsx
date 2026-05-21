"use client";

import type { ReactNode } from "react";

import { useRouter } from "next/navigation";

import {
  useEffect,
  useSyncExternalStore,
} from "react";

import { getAccessToken } from "@/lib/auth";

interface ProtectedRouteProps {
  children: ReactNode;
}

function subscribeToAuthChanges(
  onStoreChange: () => void,
) {
  window.addEventListener(
    "storage",
    onStoreChange,
  );

  return () => {
    window.removeEventListener(
      "storage",
      onStoreChange,
    );
  };
}

function getAuthSnapshot() {
  return getAccessToken() !== null;
}

function getServerAuthSnapshot() {
  return false;
}

export function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const router = useRouter();

  const authorized = useSyncExternalStore(
    subscribeToAuthChanges,
    getAuthSnapshot,
    getServerAuthSnapshot,
  );

  useEffect(() => {
    if (!authorized) {
      router.push("/login");
    }
  }, [authorized, router]);

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}
