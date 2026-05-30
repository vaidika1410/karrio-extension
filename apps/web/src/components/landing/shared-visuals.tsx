"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ─── Styles ─────────────────────────────────────────────────── */

export function LandingStyles() {
  return (
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
  );
}

/* ─── hook: in-view ──────────────────────────────────────────── */

export function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ─── Floating dots canvas ───────────────────────────────────── */

export function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const primary =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--primary")
        .trim() || "250 60% 55%";
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
        d.x += d.vx;
        d.y += d.vy;
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
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

/* ─── Fine dot-grid SVG pattern ─────────────────────────────── */

export function DotGrid() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.045]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="dots"
          x="0"
          y="0"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
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

export function RingOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 200"
      className={`pointer-events-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="100"
        cy="100"
        r="80"
        stroke="hsl(var(--primary))"
        strokeOpacity="0.12"
        strokeWidth="1"
        strokeDasharray="6 6"
      />
      <circle
        cx="100"
        cy="100"
        r="55"
        stroke="hsl(var(--primary))"
        strokeOpacity="0.08"
        strokeWidth="1"
      />
      <circle
        cx="100"
        cy="100"
        r="30"
        stroke="hsl(var(--primary))"
        strokeOpacity="0.14"
        strokeWidth="1.5"
      />
      <circle cx="100" cy="100" r="5" fill="hsl(var(--primary))" fillOpacity="0.25" />
    </svg>
  );
}

/* ─── Shimmer headline ───────────────────────────────────────── */

export function ShimmerWord({ children }: { children: string }) {
  return (
    <span className="shimmer-word" aria-label={children}>
      {children.split("").map((ch, i) => (
        <span
          key={i}
          className="shimmer-letter"
          style={{ animationDelay: `${i * 38}ms` }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

/* ─── Tilt card ──────────────────────────────────────────────── */

export function TiltCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { ref: visRef, inView } = useInView();

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${
      -y * 6
    }deg) translateZ(6px)`;
    const g = el.querySelector<HTMLElement>(".card-glint");
    if (g) {
      g.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${
        (y + 0.5) * 100
      }%, hsl(var(--primary)/0.09) 0%, transparent 60%)`;
      g.style.opacity = "1";
    }
  }, []);

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.55s cubic-bezier(0.23,1,0.32,1)";
    el.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0)";
    setTimeout(() => {
      if (el) el.style.transition = "";
    }, 560);
    const g = el.querySelector<HTMLElement>(".card-glint");
    if (g) g.style.opacity = "0";
  }, []);

  return (
    <div
      ref={(node) => {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (visRef) {
          (visRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
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
      <div
        className="card-glint pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{ opacity: 0 }}
      />
      {children}
    </div>
  );
}

/* ─── Magnetic button ────────────────────────────────────────── */

export function MagButton({
  children,
  className = "",
}: {
  children: React.ReactElement;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.transition = "transform 0.1s ease";
    el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.5s cubic-bezier(0.23,1,0.32,1)";
    el.style.transform = "translate(0,0)";
  };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`inline-flex ${className}`}
      style={{ willChange: "transform" }}
    >
      {children}
    </div>
  );
}

/* ─── Animated counter ───────────────────────────────────────── */

export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const { ref, inView } = useInView(0.4);
  useEffect(() => {
    if (!inView) return;
    const dur = 1000,
      start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

/* ─── Stagger reveal ─────────────────────────────────────────── */

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView(0.1);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(0.23,1,0.32,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
