import { Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 app-shell-gradient"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 right-0 size-72 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 size-96 rounded-full bg-primary/5 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-sm">
            <Sparkles className="size-6" strokeWidth={2} />
          </div>
          <div>
            <p className="text-xl font-semibold tracking-tight">Karrio</p>
            <p className="text-sm text-muted-foreground">
              Your calm companion for job applications
            </p>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
