"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Download, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExtension } from "@/hooks/use-extension";
import { Reveal } from "@/components/landing/shared-visuals";

export function ExtensionBanner() {
  const { isInstalled } = useExtension();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true); // Default true until checked

  useEffect(() => {
    const dismissed = localStorage.getItem("karrio_extension_banner_dismissed");
    setIsDismissed(!!dismissed);
  }, []);

  useEffect(() => {
    // Only show if definitely not installed and not dismissed
    if (isInstalled === false && !isDismissed) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isInstalled, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("karrio_extension_banner_dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="mb-8">
      <Reveal delay={0}>
        <div className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-4 shadow-[0_0_0_1px_hsl(var(--primary)/0.05),0_4px_24px_hsl(var(--primary)/0.03)] backdrop-blur-sm">
          {/* Animated Background Decoration */}
          <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-primary/10 blur-3xl transition-transform duration-500 group-hover:scale-125" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 size-24 rounded-full bg-primary/5 blur-2xl" />

          <div className="relative flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary shadow-sm">
                <Sparkles className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Boost your productivity with the Karrio Extension
                </h3>
                <p className="text-xs text-muted-foreground">
                  Save LinkedIn jobs directly to your tracker in one click. Never copy-paste again.
                </p>
              </div>
            </div>

            <div className="flex w-full items-center gap-2 md:w-auto">
              <Button size="sm" asChild className="h-9 w-full gap-2 md:w-auto">
                <Link href="/extension">
                  <Download className="size-3.5" />
                  Install Now
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="h-9 w-9 shrink-0 text-muted-foreground hover:bg-primary/10 hover:text-primary"
              >
                <X className="size-4" />
                <span className="sr-only">Dismiss</span>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
