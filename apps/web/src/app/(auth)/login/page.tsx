"use client";

import { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { login } from "@/services/auth.service";

import { AuthCard } from "@/components/auth/auth-card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await login(formData);

      localStorage.setItem(
        "accessToken",
        data.accessToken,
      );

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard>
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold">
            Welcome back
          </h1>

          <p className="text-sm text-muted-foreground">
            Login to continue tracking applications
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
          />

          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value,
              })
            }
          />

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}