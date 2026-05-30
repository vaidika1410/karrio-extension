"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Briefcase,
  CalendarClock,
  KanbanSquare,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { isAuthenticated } from "@/lib/auth";

/* ─── data ───────────────────────────────────────────────────── */

const features = [
  {
    icon: Briefcase,
    title: "Track every application",
    description:
      "Log companies, roles, notes, and job links in one organised list. Never wonder 'did I apply?' again.",
    hint: "Applications",
    number: "01",
  },
  {
    icon: KanbanSquare,
    title: "Visual pipeline",
    description:
      "Drag cards across Applied → Interview → Offer → Rejected. Your whole search on one glance.",
    hint: "Pipeline",
    number: "02",
  },
  {
    icon: CalendarClock,
    title: "Interview reminders",
    description:
      "See what's coming up and get nudged before important conversations. Stay a step ahead.",
    hint: "Reminders",
    number: "03",
  },
];

const checks = [
  "No spreadsheet juggling",
  "One-click application logging",
  "Works on any device",
];

/* ─── hook: in-view ──────────────────────────────────────────── */

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setInView(true); obs.disconnect(); }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ─── Floating dots canvas ───────────────────────────────────── */

function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf: number;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const primary = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || "250 60% 55%";
    const dots = Array.from({ length: 32 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      alpha: Math.random() * 0.18 + 0.04,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach((d) => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = canvas.width;
        if (d.x > canvas.width) d.x = 0;
        if (d.y < 0) d.y = canvas.height;
        if (d.y > canvas.height) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${primary},${d.alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}

/* ─── Fine dot-grid SVG pattern ─────────────────────────────── */

function DotGrid() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.045]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="hsl(var(--primary))" />
        </pattern>
        <radialGradient id="dotfade" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="100%" stopColor="white" stopOpacity="1" />
        </radialGradient>
        <mask id="dotmask">
          <rect width="100%" height="100%" fill="white" />
          <rect width="100%" height="100%" fill="url(#dotfade)" />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" mask="url(#dotmask)" />
    </svg>
  );
}

/* ─── Decorative ring ornament ───────────────────────────────── */

function RingOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 200"
      className={`pointer-events-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="100" cy="100" r="80" stroke="hsl(var(--primary))" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="6 6" />
      <circle cx="100" cy="100" r="55" stroke="hsl(var(--primary))" strokeOpacity="0.08" strokeWidth="1" />
      <circle cx="100" cy="100" r="30" stroke="hsl(var(--primary))" strokeOpacity="0.14" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="5" fill="hsl(var(--primary))" fillOpacity="0.25" />
    </svg>
  );
}

/* ─── Shimmer headline ───────────────────────────────────────── */

function ShimmerWord({ children }: { children: string }) {
  return (
    <span className="shimmer-word" aria-label={children}>
      {children.split("").map((ch, i) => (
        <span key={i} className="shimmer-letter" style={{ animationDelay: `${i * 38}ms` }}>
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

/* ─── Tilt card ──────────────────────────────────────────────── */

function TiltCard({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { ref: visRef, inView } = useInView();

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateZ(6px)`;
    const g = el.querySelector<HTMLElement>(".card-glint");
    if (g) { g.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, hsl(var(--primary)/0.09) 0%, transparent 60%)`; g.style.opacity = "1"; }
  }, []);

  const handleLeave = useCallback(() => {
    const el = ref.current; if (!el) return;
    el.style.transition = "transform 0.55s cubic-bezier(0.23,1,0.32,1)";
    el.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0)";
    setTimeout(() => { if (el) el.style.transition = ""; }, 560);
    const g = el.querySelector<HTMLElement>(".card-glint");
    if (g) g.style.opacity = "0";
  }, []);

  return (
    <div
      ref={(node) => {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        (visRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`tilt-card ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(26px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s cubic-bezier(0.23,1,0.32,1) ${delay}ms`,
        willChange: "transform, opacity",
      }}
    >
      <div className="card-glint pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300" style={{ opacity: 0 }} />
      {children}
    </div>
  );
}

/* ─── Magnetic button ────────────────────────────────────────── */

function MagButton({ children, className = "" }: { children: React.ReactElement; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.transition = "transform 0.1s ease";
    el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  };
  const onLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.transition = "transform 0.5s cubic-bezier(0.23,1,0.32,1)";
    el.style.transform = "translate(0,0)";
  };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={`inline-flex ${className}`} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}

/* ─── Animated counter ───────────────────────────────────────── */

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const { ref, inView } = useInView(0.4);
  useEffect(() => {
    if (!inView) return;
    const dur = 1000, start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── Stagger reveal ─────────────────────────────────────────── */

function Reveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const { ref, inView } = useInView(0.1);
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(18px)",
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(0.23,1,0.32,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────── */

export function LandingPage() {
  const router = useRouter();
  useEffect(() => { if (isAuthenticated()) router.replace("/dashboard"); }, [router]);

  return (
    <>
      <style>{`
        /* ── shimmer letters ── */
        @keyframes shimmer-in {
          0%   { opacity:0; filter:blur(5px); transform:translateY(7px); }
          100% { opacity:1; filter:blur(0);   transform:translateY(0); }
        }
        .shimmer-letter {
          display: inline-block;
          opacity: 0;
          animation: shimmer-in 0.42s ease forwards;
        }
        .shimmer-word { display: inline; }

        /* ── badge ring pulse ── */
        @keyframes ring-pulse {
          0%   { box-shadow: 0 0 0 0   hsl(var(--primary)/0.3); }
          70%  { box-shadow: 0 0 0 7px hsl(var(--primary)/0); }
          100% { box-shadow: 0 0 0 0   hsl(var(--primary)/0); }
        }
        .badge-pulse { animation: ring-pulse 2.6s ease infinite; }

        /* ── cta button sweep ── */
        @keyframes sweep {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .cta-sweep {
          background: linear-gradient(90deg,
            hsl(var(--primary)) 0%,
            hsl(var(--primary)/0.8) 45%,
            hsl(var(--primary)) 60%,
            hsl(var(--primary)) 100%
          );
          background-size: 200% auto;
          animation: sweep 3.5s linear infinite;
        }

        /* ── tilt card base ── */
        .tilt-card {
          position: relative;
          transform-style: preserve-3d;
          border-radius: 1rem;
          overflow: hidden;
        }

        /* ── icon pop on card hover ── */
        .feat-icon-wrap {
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.25s ease;
        }
        .tilt-card:hover .feat-icon-wrap {
          transform: scale(1.13) rotate(-5deg);
          background: hsl(var(--primary)/0.18) !important;
        }

        /* ── card number fade-slide ── */
        .card-number {
          transition: opacity 0.25s ease, transform 0.25s ease;
          opacity: 0.18;
        }
        .tilt-card:hover .card-number {
          opacity: 0.55;
          transform: translateY(-2px);
        }

        /* ── read-more row ── */
        .read-more {
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 0.25s ease, transform 0.25s ease, gap 0.2s ease;
        }
        .tilt-card:hover .read-more {
          opacity: 1;
          transform: translateX(0);
        }

        /* ── arrow nudge ── */
        .arrow-icon { transition: transform 0.2s ease; }
        .arrow-link:hover .arrow-icon { transform: translateX(3px); }

        /* ── soft underline ── */
        .soft-link { position: relative; text-decoration: none; }
        .soft-link::after {
          content: ''; position: absolute; left: 0; bottom: -2px;
          width: 0; height: 1.5px;
          background: hsl(var(--primary)); border-radius: 1px;
          transition: width 0.25s ease;
        }
        .soft-link:hover::after { width: 100%; }

        /* ── stat pill hover ── */
        .stat-pill { transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease; }
        .stat-pill:hover {
          background: hsl(var(--primary)/0.07) !important;
          box-shadow: inset 0 0 0 1px hsl(var(--primary)/0.18), 0 4px 16px hsl(var(--primary)/0.08);
          transform: translateY(-2px);
        }

        /* ── check item ── */
        .check-item {
          transition: color 0.2s ease, transform 0.2s ease;
        }
        .check-item:hover { color: hsl(var(--foreground)); transform: translateX(2px); }

        /* ── ring spin ── */
        @keyframes ring-slow-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .ring-spin { animation: ring-slow-spin 28s linear infinite; }

        /* ── horizontal rule gradient ── */
        .hr-fade {
          height: 1px;
          background: linear-gradient(90deg, transparent, hsl(var(--border)), transparent);
          border: none;
          margin: 0;
        }

        /* ── CTA card top line ── */
        .cta-top-line {
          position: absolute; inset-x-0; top: 0; height: 1px;
          background: linear-gradient(90deg, transparent, hsl(var(--primary)/0.45), transparent);
        }

        /* ── floating label chip on feature cards ── */
        .feat-chip {
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .tilt-card:hover .feat-chip {
          background: hsl(var(--primary)/0.1);
          border-color: hsl(var(--primary)/0.3);
          color: hsl(var(--primary));
        }
      `}</style>

      <div className="relative min-h-screen overflow-hidden bg-background">

        {/* ── dot grid texture ── */}
        <DotGrid />

        {/* ── soft radial bg washes ── */}
        <div aria-hidden className="pointer-events-none absolute -top-48 -right-24 size-[40rem] rounded-full bg-primary/8 blur-[140px]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-24 size-[32rem] rounded-full bg-primary/6 blur-[120px]" />
        {/* warm secondary tint, centre-right */}
        <div aria-hidden className="pointer-events-none absolute top-[30%] right-[10%] size-[22rem] rounded-full bg-primary/5 blur-[100px]" />

        {/* ── existing shell gradient ── */}
        <div className="pointer-events-none absolute inset-0 app-shell-gradient" aria-hidden />

        {/* ── particles ── */}
        <Particles />

        {/* ── decorative ring top-right ── */}
        <RingOrnament className="absolute -top-16 -right-16 size-72 opacity-60 ring-spin" />
        {/* ── small ring bottom-left ── */}
        <RingOrnament className="absolute bottom-24 -left-10 size-44 opacity-40" />

        {/* ══ HEADER ══ */}
        <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-6 md:px-8">
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
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-border/70 transition-all duration-200 hover:border-primary/35 hover:bg-primary/5 hover:shadow-[0_0_0_4px_hsl(var(--primary)/0.06)]"
            >
              <Link href="/extension">
                Get Extension
              </Link>
            </Button>
          </nav>
        </header>

        {/* ══ HERO ══ */}
        <main className="relative z-10 mx-auto max-w-6xl px-4 pb-20 md:px-8">
          <section className="mx-auto max-w-3xl pt-12 text-center md:pt-20">

            {/* badge */}
            <Reveal delay={0}>
              <span className="badge-pulse mb-5 inline-flex cursor-default select-none items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1.5 text-xs font-medium text-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.05)]">
                <Sparkles className="size-3.5" />
                Your calm job search companion
              </span>
            </Reveal>

            {/* headline */}
            <Reveal delay={70}>
              <h1 className="text-4xl font-semibold tracking-tight text-balance leading-[1.13] md:text-5xl lg:text-6xl">
                <ShimmerWord>Track applications</ShimmerWord>
                <br />
                <span className="text-primary">
                  <ShimmerWord>without the stress</ShimmerWord>
                </span>
              </h1>
            </Reveal>

            {/* sub */}
            <Reveal delay={210}>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Karrio helps you add roles, follow your pipeline, and stay ready for
                interviews — in a workspace designed to feel{" "}
                <span className="font-medium text-foreground">clear, not chaotic</span>.
              </p>
            </Reveal>

            {/* inline checks */}
            <Reveal delay={280}>
              <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                {checks.map((c) => (
                  <li key={c} className="check-item flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="size-3.5 shrink-0 text-primary/70" strokeWidth={2} />
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* CTAs */}
            <Reveal delay={340}>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">

                <Button asChild>
                  <Link href="/signup" className="arrow-link gap-2">
                    Get started <ArrowRight className="size-3.5 arrow-icon" />
                  </Link>
                </Button>

                <Button size="lg" variant="outline" asChild
                  className="border-border/70 transition-all duration-200 hover:border-primary/35 hover:bg-primary/5 hover:shadow-[0_0_0_4px_hsl(var(--primary)/0.06)]">
                  <Link href="/extension">Get Extension</Link>
                </Button>

                <Button size="lg" variant="outline" asChild
                  className="border-border/70 transition-all duration-200 hover:border-primary/35 hover:bg-primary/5 hover:shadow-[0_0_0_4px_hsl(var(--primary)/0.06)]">
                  <Link href="/login">I already have an account</Link>
                </Button>

              </div>
            </Reveal>

            {/* social proof */}
            <Reveal delay={430}>
              <div className="mt-8 flex items-center justify-center gap-3 text-xs text-muted-foreground">
                <span className="flex -space-x-2">
                  {[0.28, 0.45, 0.62, 0.80].map((op, i) => (
                    <span key={i}
                      className="inline-flex size-6 items-center justify-center rounded-full border-2 border-background font-semibold text-primary-foreground text-[9px]"
                      style={{ background: `hsl(var(--primary)/${op})` }}
                    />
                  ))}
                </span>
                <span>Trusted by <strong className="font-semibold text-foreground">2,400+</strong> job seekers</span>
                <span className="h-3 w-px bg-border/80" />
                <span>Free to start</span>
              </div>
            </Reveal>
          </section>

          {/* ── faint divider ── */}
          <Reveal delay={80} className="mt-16">
            <hr className="hr-fade" />
          </Reveal>

          {/* ══ STATS ══ */}
          <Reveal delay={100} className="mt-10">
            <div className="mx-auto grid max-w-xl grid-cols-3 gap-3">
              {[
                { value: 94, suffix: "%", label: "Interview rate" },
                { value: 12, suffix: "k+", label: "Apps tracked" },
                { value: 3, suffix: "×", label: "Faster offers" },
              ].map(({ value, suffix, label }) => (
                <div key={label}
                  className="stat-pill rounded-2xl border border-border/50 bg-card/60 py-5 text-center backdrop-blur-sm shadow-[0_1px_4px_hsl(var(--foreground)/0.04)]">
                  <p className="text-2xl font-bold tracking-tight text-foreground">
                    <Counter to={value} suffix={suffix} />
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* ── faint divider ── */}
          <Reveal delay={60} className="mt-16">
            <hr className="hr-fade" />
          </Reveal>

          {/* ══ FEATURE CARDS ══ */}
          <section className="mt-12">

            {/* section eyebrow */}
            <Reveal delay={0}>
              <p className="mb-8 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary/70">
                <span className="h-px w-6 bg-primary/30" />
                What's inside
                <span className="h-px w-6 bg-primary/30" />
              </p>
            </Reveal>

            <div className="grid gap-5 md:grid-cols-3">
              {features.map(({ icon: Icon, title, description, hint, number }, i) => (
                <TiltCard
                  key={title}
                  delay={i * 100}
                  className="rounded-2xl border border-border/55 bg-card/75 p-6 shadow-[0_1px_3px_hsl(var(--foreground)/0.06),0_4px_16px_hsl(var(--foreground)/0.04)] backdrop-blur-sm"
                >
                  {/* top row: icon + chip + number */}
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

                  {/* hover read-more */}
                  <div className="read-more mt-4 flex items-center gap-1 text-xs font-medium text-primary">
                    Learn more <ArrowRight className="size-3" />
                  </div>
                </TiltCard>
              ))}
            </div>
          </section>

          {/* ══ CTA SECTION ══ */}
          <Reveal delay={0} className="mt-20">
            <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 px-8 py-12 text-center shadow-[0_1px_3px_hsl(var(--foreground)/0.06),0_8px_32px_hsl(var(--foreground)/0.05)] backdrop-blur-sm md:py-16">

              {/* top accent line */}
              <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary)/0.5), transparent)" }} />

              {/* inner glow */}
              <div aria-hidden className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 size-80 rounded-full bg-primary/6 blur-[90px]" />

              {/* bottom-right decorative ring */}
              <RingOrnament className="absolute -bottom-12 -right-10 size-48 opacity-25" />

              <p className="relative mb-3 text-xs font-semibold uppercase tracking-widest text-primary/70">
                Get started
              </p>
              <h2 className="relative text-2xl font-semibold tracking-tight md:text-3xl">
                Ready to organise your search?
              </h2>
              <p className="relative mx-auto mt-3 max-w-lg text-muted-foreground">
                Create an account in under a minute and add your first application right away.
              </p>

              <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild>
                  <Link href="/signup" className="arrow-link gap-2">
                    Get started <ArrowRight className="size-3.5 arrow-icon" />
                  </Link>
                </Button>
                <Button size="lg" variant="ghost" asChild
                  className="text-muted-foreground hover:text-foreground hover:bg-primary/5">
                  <Link href="/login">Sign in instead</Link>
                </Button>

              </div>
            </section>
          </Reveal>
        </main>

        {/* ══ FOOTER ══ */}
        <footer className="relative z-10 border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Sparkles className="size-3.5 text-primary/60" />
            Karrio — built for focused job seekers
          </span>
        </footer>
      </div>
    </>
  );
}
