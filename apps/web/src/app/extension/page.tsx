"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Download,
  KanbanSquare,
  Sparkles,
  FileArchive,
  Monitor,
  MousePointerClick,
  PlusCircle,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Particles,
  DotGrid,
  RingOrnament,
  ShimmerWord,
  TiltCard,
  Reveal,
  LandingStyles,
} from "@/components/landing/shared-visuals";

const EXTENSION_DOWNLOAD_URL = "https://github.com/vaidika1410/karrio-extension/releases/latest/download/karrio-extension-dist.zip";

const howItWorks = [
  {
    icon: Briefcase,
    title: "Find a LinkedIn Job",
    description: "Browse LinkedIn as you normally do. When you find a role you like, Karrio is ready.",
    hint: "Discovery",
    number: "01",
  },
  {
    icon: Download,
    title: "Save with Karrio",
    description: "Click the extension icon to instantly extract job details and save them to your tracker.",
    hint: "Extraction",
    number: "02",
  },
  {
    icon: KanbanSquare,
    title: "Track in Dashboard",
    description: "Manage all your saved jobs in your centralized Karrio dashboard with ease.",
    hint: "Management",
    number: "03",
  },
];

const steps = [
  {
    icon: FileArchive,
    title: "Download the extension ZIP",
    description: "Click the download button above to get the latest version.",
  },
  {
    icon: PlusCircle,
    title: "Extract the ZIP",
    description: "Unzip the downloaded file to a folder on your computer.",
  },
  {
    icon: Monitor,
    title: "Open chrome://extensions",
    description: "Type this into your Chrome address bar and press Enter.",
  },
  {
    icon: Sparkles,
    title: "Enable Developer Mode",
    description: "Toggle the switch in the top-right corner of the extensions page.",
  },
  {
    icon: MousePointerClick,
    title: "Click Load Unpacked",
    description: "Click the button in the top-left and select the extracted folder.",
  },
  {
    icon: ExternalLink,
    title: "Select Extension Folder",
    description: "Choose the folder you extracted in step 2 to complete installation.",
  },
];

export default function ExtensionPage() {
  const installationRef = useRef<HTMLElement>(null);

  const scrollToInstallation = () => {
    installationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <LandingStyles />

      <div className="relative min-h-screen overflow-hidden bg-background">
        <DotGrid />

        <div aria-hidden className="pointer-events-none absolute -top-48 -right-24 size-[40rem] rounded-full bg-primary/8 blur-[140px]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-24 size-[32rem] rounded-full bg-primary/6 blur-[120px]" />

        <div className="pointer-events-none absolute inset-0 app-shell-gradient" aria-hidden />
        <Particles />

        <RingOrnament className="absolute -top-16 -right-16 size-72 opacity-60 ring-spin" />
        <RingOrnament className="absolute bottom-24 -left-10 size-44 opacity-40" />

        <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-4 py-6 md:px-8">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary transition-all duration-300 group-hover:bg-primary/25 group-hover:scale-105 group-hover:rotate-[-6deg]">
              <Sparkles className="size-4" strokeWidth={2.25} />
            </div>
            <span className="text-lg font-semibold tracking-tight">Karrio</span>
          </Link>

          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login" className="soft-link">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup" className="arrow-link gap-2">
                Get started <ArrowRight className="size-3.5 arrow-icon" />
              </Link>
            </Button>
          </nav>
        </header>

        <main className="relative z-10 mx-auto max-w-6xl px-4 pb-20 md:px-8">
          {/* ══ HERO ══ */}
          <section className="mx-auto max-w-3xl pt-12 text-center md:pt-20">
            <Reveal delay={0}>
              <span className="badge-pulse mb-5 inline-flex cursor-default select-none items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1.5 text-xs font-medium text-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.05)]">
                <Sparkles className="size-3.5" />
                Karrio for Chrome
              </span>
            </Reveal>

            <Reveal delay={70}>
              <h1 className="text-4xl font-semibold tracking-tight text-balance leading-[1.13] md:text-5xl lg:text-6xl">
                <ShimmerWord>Karrio</ShimmerWord>
                <br />
                <span className="text-primary">
                  <ShimmerWord>Chrome Extension</ShimmerWord>
                </span>
              </h1>
            </Reveal>

            <Reveal delay={210}>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Save LinkedIn jobs directly into Karrio with one click.
              </p>
            </Reveal>

            <Reveal delay={340}>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href={EXTENSION_DOWNLOAD_URL} target="_blank" className="arrow-link gap-2">
                    Download Extension <Download className="size-3.5 arrow-icon" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={scrollToInstallation}
                  className="border-border/70 transition-all duration-200 hover:border-primary/35 hover:bg-primary/5 hover:shadow-[0_0_0_4px_hsl(var(--primary)/0.06)]"
                >
                  View Installation Guide
                </Button>
              </div>
            </Reveal>
          </section>

          <Reveal delay={80} className="mt-20">
            <hr className="hr-fade" />
          </Reveal>

          {/* ══ HOW IT WORKS ══ */}
          <section className="mt-20">
            <Reveal delay={0}>
              <p className="mb-8 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary/70">
                <span className="h-px w-6 bg-primary/30" />
                How It Works
                <span className="h-px w-6 bg-primary/30" />
              </p>
            </Reveal>

            <div className="grid gap-5 md:grid-cols-3">
              {howItWorks.map(({ icon: Icon, title, description, hint, number }, i) => (
                <TiltCard
                  key={title}
                  delay={i * 100}
                  className="rounded-2xl border border-border/55 bg-card/75 p-6 shadow-[0_1px_3px_hsl(var(--foreground)/0.06),0_4px_16px_hsl(var(--foreground)/0.04)] backdrop-blur-sm"
                >
                  <div className="mb-5 flex items-start justify-between">
                    <div className="feat-icon-wrap flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" strokeWidth={1.75} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="feat-chip rounded-full border border-border/70 bg-background/50 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {hint}
                      </span>
                      <span className="card-number text-xl font-bold tabular-nums text-primary">
                        {number}
                      </span>
                    </div>
                  </div>
                  <h2 className="text-base font-semibold leading-snug">{title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </TiltCard>
              ))}
            </div>
          </section>

          {/* ══ INSTALLATION GUIDE ══ */}
          <section ref={installationRef} className="mt-32 scroll-mt-20">
            <Reveal delay={0}>
              <p className="mb-8 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary/70">
                <span className="h-px w-6 bg-primary/30" />
                Setup Guide
                <span className="h-px w-6 bg-primary/30" />
              </p>
            </Reveal>

            <div className="grid gap-5 md:grid-cols-3">
              {steps.map(({ icon: Icon, title, description }, i) => (
                <TiltCard
                  key={title}
                  delay={i * 100}
                  className="rounded-2xl border border-border/55 bg-card/75 p-6 shadow-[0_1px_3px_hsl(var(--foreground)/0.06),0_4px_16px_hsl(var(--foreground)/0.04)] backdrop-blur-sm"
                >
                  <div className="mb-5 flex items-start justify-between">
                    <div className="feat-icon-wrap flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" strokeWidth={1.75} />
                    </div>
                    <div className="card-number text-xl font-bold tabular-nums text-primary">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                  </div>
                  <h2 className="text-base font-semibold leading-snug">{title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </TiltCard>
              ))}
            </div>
          </section>

          {/* ══ FAQ ══ */}
          <section className="mt-32">
            <Reveal delay={0}>
              <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 px-8 py-12 text-center shadow-[0_1px_3px_hsl(var(--foreground)/0.06),0_8px_32px_hsl(var(--foreground)/0.05)] backdrop-blur-sm">
                <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px"
                  style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary)/0.5), transparent)" }} />
                
                <p className="relative mb-3 text-xs font-semibold uppercase tracking-widest text-primary/70">
                  FAQ
                </p>
                <h2 className="relative text-2xl font-semibold tracking-tight md:text-3xl">
                  Why isn't it on the Chrome Web Store?
                </h2>
                <p className="relative mx-auto mt-4 max-w-lg text-muted-foreground">
                  Karrio Extension is currently in beta and available through manual installation.
                </p>
                
                <div className="relative mt-8">
                  <Button size="lg" asChild>
                    <Link href={EXTENSION_DOWNLOAD_URL} target="_blank" className="arrow-link gap-2">
                      Download Extension <Download className="size-3.5 arrow-icon" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Reveal>
          </section>
        </main>

        <footer className="relative z-20 border-t border-border/40 bg-background/50 py-10 text-center text-sm text-muted-foreground backdrop-blur-md">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="size-3" />
                </div>
                <span className="font-medium text-foreground">Karrio</span>
              </div>
              
              <div className="flex items-center gap-6">
                <Link href="/" className="transition-colors hover:text-primary">Home</Link>
                <Link href="/login" className="transition-colors hover:text-primary">Sign in</Link>
                <Link href="/signup" className="transition-colors hover:text-primary">Register</Link>
              </div>

              <span className="text-xs text-muted-foreground/60">
                &copy; {new Date().getFullYear()} Karrio. built for focused job seekers.
              </span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
