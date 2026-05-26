"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Briefcase,
  CalendarClock,
  KanbanSquare,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { isAuthenticated } from "@/lib/auth";

const features = [
  {
    icon: Briefcase,
    title: "Track every application",
    description:
      "Log companies, roles, notes, and job links in one organized list.",
  },
  {
    icon: KanbanSquare,
    title: "Visual pipeline",
    description:
      "Drag cards across Applied, Interview, Offer, and Rejected stages.",
  },
  {
    icon: CalendarClock,
    title: "Interview reminders",
    description:
      "See what's coming up and get nudged before important conversations.",
  },
];

export function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 app-shell-gradient" aria-hidden />
      <div
        className="pointer-events-none absolute -top-32 right-0 size-[28rem] rounded-full bg-primary/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 size-80 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-6 md:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Sparkles className="size-4" strokeWidth={2.25} />
          </div>
          <span className="text-lg font-semibold tracking-tight">Karrio</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get started</Link>
          </Button>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-20 md:px-8">
        <section className="mx-auto max-w-3xl pt-12 text-center md:pt-20">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" />
            Your calm job search companion
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl lg:text-6xl">
            Track applications without the spreadsheet stress
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Karrio helps you add roles, follow your pipeline, and stay ready for
            interviews — in a workspace designed to feel clear, not chaotic.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="gap-2 px-8" asChild>
              <Link href="/signup">
                Start for free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">I already have an account</Link>
            </Button>
          </div>
        </section>

        <section className="mt-24 grid gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-[var(--shadow-soft)] backdrop-blur-sm"
            >
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" strokeWidth={1.75} />
              </div>
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-24 rounded-3xl border border-border/60 bg-card/80 px-8 py-12 text-center shadow-[var(--shadow-soft)] backdrop-blur-sm md:py-16">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Ready to organize your search?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Create an account in under a minute and add your first application
            right away.
          </p>
          <Button size="lg" className="mt-8 gap-2" asChild>
            <Link href="/signup">
              Create your account
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        Karrio — built for focused job seekers
      </footer>
    </div>
  );
}
