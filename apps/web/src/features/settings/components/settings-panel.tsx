"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/page-header";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getStoredUser, logout, setStoredUser } from "@/lib/auth";
import { getProfile, updateProfile } from "@/services/users.service";

import { INTERVIEW_NOTIFICATIONS_KEY } from "@/lib/preferences";

export function SettingsPanel() {
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();
  const cachedUser = getStoredUser();

  const [name, setName] = useState(cachedUser?.name ?? "");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setStoredUser({
        id: profile.id,
        email: profile.email,
        name: profile.name,
      });
    }
  }, [profile]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setNotificationsEnabled(
      localStorage.getItem(INTERVIEW_NOTIFICATIONS_KEY) === "true",
    );
  }, []);

  const updateMutation = useMutation({
    mutationFn: () => updateProfile({ name: name.trim() || undefined }),
    onSuccess: (updated) => {
      setStoredUser({
        id: updated.id,
        email: updated.email,
        name: updated.name,
      });
      queryClient.setQueryData(["profile"], updated);
      toast.success("Profile updated");
    },
    onError: () => {
      toast.error("Could not update profile");
    },
  });

  async function handleNotificationToggle(enabled: boolean) {
    if (enabled && typeof Notification !== "undefined") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.error("Enable notifications in your browser to get interview alerts");
        return;
      }
    }

    localStorage.setItem(INTERVIEW_NOTIFICATIONS_KEY, String(enabled));
    setNotificationsEnabled(enabled);
    toast.success(
      enabled
        ? "Interview reminders enabled"
        : "Interview reminders turned off",
    );
  }

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your profile, preferences, and account."
      />

      <Card className="border-border/60 bg-card/80 shadow-[var(--shadow-soft)]">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            {memberSince ? `Member since ${memberSince}` : "Your account details"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display name</Label>
            <Input
              id="name"
              placeholder="Your name"
              value={name}
              disabled={isLoading}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={profile?.email ?? cachedUser?.email ?? ""}
              disabled
              className="opacity-70"
            />
          </div>

          <Button
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending || isLoading}
          >
            {updateMutation.isPending ? "Saving..." : "Save profile"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/80 shadow-[var(--shadow-soft)]">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Customize how Karrio looks and notifies you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className="text-xs text-muted-foreground">
                Currently {theme === "system" ? "system" : theme} mode
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("light")}
              >
                Light
              </Button>
              <Button
                type="button"
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("dark")}
              >
                Dark
              </Button>
              <ThemeToggle className="text-foreground" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
            <div>
              <p className="text-sm font-medium">Interview reminders</p>
              <p className="text-xs text-muted-foreground">
                Browser alerts when an interview is within an hour
              </p>
            </div>
            <Button
              type="button"
              variant={notificationsEnabled ? "default" : "outline"}
              size="sm"
              onClick={() =>
                handleNotificationToggle(!notificationsEnabled)
              }
            >
              {notificationsEnabled ? "On" : "Off"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/20 bg-card/80 shadow-[var(--shadow-soft)]">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Sign out of Karrio on this device</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={logout}>
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
